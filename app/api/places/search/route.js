import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.trim();

  if (!query || query.length < 2) {
    return NextResponse.json({ exists: false, message: 'Please provide a valid location name.' }, { status: 400 });
  }

  try {
    // 1. Verify existence via Nominatim OpenStreetMap geocoding API
    const geoUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5`;
    const geoRes = await fetch(geoUrl, {
      headers: {
        'User-Agent': 'GlobeTrotter-Hackathon-App/1.0 (travel-planner@globetrotter.internal)',
        'Accept-Language': 'en',
      },
    });

    if (!geoRes.ok) {
      return NextResponse.json({ exists: false, message: 'Geocoding service temporarily unavailable.' }, { status: 502 });
    }

    const geoData = await geoRes.json();

    if (!geoData || geoData.length === 0) {
      return NextResponse.json({
        exists: false,
        query,
        message: `"${query}" does not exist in the real world. Please check your spelling or try another destination.`,
      });
    }

    // Find the most relevant place (city, town, administrative area, tourism, or country)
    const bestMatch = geoData.find(item => 
      item.type === 'city' || 
      item.type === 'town' || 
      item.type === 'administrative' || 
      item.type === 'village' || 
      item.class === 'boundary' || 
      item.class === 'place'
    ) || geoData[0];

    const address = bestMatch.address || {};
    const cityName = address.city || address.town || address.village || address.state || address.municipality || bestMatch.name || query;
    const country = address.country || 'Global';
    const state = address.state || '';
    const lat = parseFloat(bestMatch.lat);
    const lon = parseFloat(bestMatch.lon);

    // Determine continental region
    let region = 'International';
    if (country.toLowerCase().includes('india') || country.toLowerCase().includes('japan') || country.toLowerCase().includes('china') || country.toLowerCase().includes('thailand') || country.toLowerCase().includes('indonesia') || country.toLowerCase().includes('singapore') || country.toLowerCase().includes('vietnam')) {
      region = 'Asia';
    } else if (country.toLowerCase().includes('france') || country.toLowerCase().includes('italy') || country.toLowerCase().includes('germany') || country.toLowerCase().includes('spain') || country.toLowerCase().includes('uk') || country.toLowerCase().includes('greece') || country.toLowerCase().includes('switzerland')) {
      region = 'Europe';
    } else if (country.toLowerCase().includes('united states') || country.toLowerCase().includes('canada') || country.toLowerCase().includes('mexico')) {
      region = 'North America';
    } else if (country.toLowerCase().includes('brazil') || country.toLowerCase().includes('argentina') || country.toLowerCase().includes('peru')) {
      region = 'South America';
    } else if (country.toLowerCase().includes('egypt') || country.toLowerCase().includes('south africa') || country.toLowerCase().includes('morocco') || country.toLowerCase().includes('kenya')) {
      region = 'Africa';
    } else if (country.toLowerCase().includes('australia') || country.toLowerCase().includes('new zealand')) {
      region = 'Oceania';
    } else if (country.toLowerCase().includes('uae') || country.toLowerCase().includes('saudi') || country.toLowerCase().includes('qatar')) {
      region = 'Middle East';
    }

    // 2. Fetch summary & image from Wikipedia API
    let description = `${cityName} is a renowned destination in ${country}${state ? `, ${state}` : ''}, famous for its rich culture, scenic landscapes, and travel experiences.`;
    let imageUrl = `https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800`; // High quality travel fallback

    try {
      const wikiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cityName)}`;
      const wikiRes = await fetch(wikiUrl, {
        headers: { 'User-Agent': 'GlobeTrotter-Hackathon-App/1.0' },
      });

      if (wikiRes.ok) {
        const wikiData = await wikiRes.json();
        if (wikiData.extract) {
          description = wikiData.extract.length > 250 ? wikiData.extract.substring(0, 247) + '...' : wikiData.extract;
        }
        if (wikiData.thumbnail?.source) {
          imageUrl = wikiData.thumbnail.source;
        } else if (wikiData.originalimage?.source) {
          imageUrl = wikiData.originalimage.source;
        }
      }
    } catch (wikiErr) {
      console.log('Wikipedia enrich fallback:', wikiErr.message);
    }

    // Destination verified and packed
    return NextResponse.json({
      exists: true,
      city: {
        id: 'dyn-' + cityName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.abs(Math.round(lat * 100)),
        name: cityName,
        country: country,
        region: region,
        state: state,
        description: description,
        image_url: imageUrl,
        latitude: lat,
        longitude: lon,
        cost_index: Math.floor(Math.random() * 3) + 2, // 2 to 4
        popularity_score: Math.floor(Math.random() * 15) + 80, // 80 to 95
        is_verified: true,
      },
    });

  } catch (error) {
    console.error('Error verifying location:', error);
    return NextResponse.json({ exists: false, message: 'Server error verifying destination.' }, { status: 500 });
  }
}
