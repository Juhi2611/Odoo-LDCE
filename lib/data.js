import { v4 as uuidv4 } from 'uuid';
import { supabase } from './supabase';

// ── Seed Data: Cities ──────────────────────────
export const CITIES = [
  { id: 1, name: 'Paris', country: 'France', region: 'Europe', image_url: '/images/destinations/paris.jpg', cost_index: 4, popularity_score: 98, description: 'The City of Light, known for the Eiffel Tower, Louvre Museum, and world-class cuisine.', latitude: 48.8566, longitude: 2.3522 },
  { id: 2, name: 'Tokyo', country: 'Japan', region: 'Asia', image_url: '/images/destinations/tokyo.jpg', cost_index: 4, popularity_score: 95, description: 'A dazzling blend of ultramodern and traditional, from neon-lit skyscrapers to historic temples.', latitude: 35.6762, longitude: 139.6503 },
  { id: 3, name: 'Bali', country: 'Indonesia', region: 'Asia', image_url: '/images/destinations/bali.jpg', cost_index: 2, popularity_score: 92, description: 'Tropical paradise with stunning rice terraces, ancient temples, and vibrant culture.', latitude: -8.3405, longitude: 115.092 },
  { id: 4, name: 'Santorini', country: 'Greece', region: 'Europe', image_url: '/images/destinations/santorini.jpg', cost_index: 4, popularity_score: 94, description: 'Iconic white-washed buildings with blue domes perched on dramatic volcanic cliffs.', latitude: 36.3932, longitude: 25.4615 },
  { id: 5, name: 'New York', country: 'USA', region: 'North America', image_url: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800', cost_index: 5, popularity_score: 97, description: 'The city that never sleeps — iconic skyline, Broadway, Central Park, and endless energy.', latitude: 40.7128, longitude: -74.006 },
  { id: 6, name: 'London', country: 'UK', region: 'Europe', image_url: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800', cost_index: 5, popularity_score: 96, description: 'Historic royal palaces, world-class museums, and a thriving multicultural food scene.', latitude: 51.5074, longitude: -0.1278 },
  { id: 7, name: 'Dubai', country: 'UAE', region: 'Middle East', image_url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800', cost_index: 4, popularity_score: 90, description: 'Futuristic skyline, luxury shopping, ultramodern architecture, and desert adventures.', latitude: 25.2048, longitude: 55.2708 },
  { id: 8, name: 'Rome', country: 'Italy', region: 'Europe', image_url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800', cost_index: 3, popularity_score: 93, description: 'The Eternal City — ancient ruins, Renaissance art, and the finest Italian cuisine.', latitude: 41.9028, longitude: 12.4964 },
  { id: 9, name: 'Barcelona', country: 'Spain', region: 'Europe', image_url: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800', cost_index: 3, popularity_score: 91, description: "Gaudí's masterpieces, vibrant nightlife, Mediterranean beaches, and La Rambla.", latitude: 41.3874, longitude: 2.1686 },
  { id: 10, name: 'Sydney', country: 'Australia', region: 'Oceania', image_url: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800', cost_index: 4, popularity_score: 88, description: 'Stunning harbor, iconic Opera House, beautiful beaches, and laid-back lifestyle.', latitude: -33.8688, longitude: 151.2093 },
  { id: 11, name: 'Marrakech', country: 'Morocco', region: 'Africa', image_url: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=800', cost_index: 2, popularity_score: 85, description: 'Vibrant souks, ornate palaces, aromatic spice markets, and the magical Sahara nearby.', latitude: 31.6295, longitude: -7.9811 },
  { id: 12, name: 'Kyoto', country: 'Japan', region: 'Asia', image_url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800', cost_index: 3, popularity_score: 89, description: 'Ancient capital with thousands of temples, zen gardens, geisha culture, and bamboo groves.', latitude: 35.0116, longitude: 135.7681 },
  { id: 13, name: 'Cape Town', country: 'South Africa', region: 'Africa', image_url: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800', cost_index: 2, popularity_score: 87, description: 'Table Mountain, stunning coastline, wine country, and incredible wildlife.', latitude: -33.9249, longitude: 18.4241 },
  { id: 14, name: 'Istanbul', country: 'Turkey', region: 'Europe', image_url: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800', cost_index: 2, popularity_score: 88, description: 'Where East meets West — Byzantine churches, Ottoman mosques, and bustling bazaars.', latitude: 41.0082, longitude: 28.9784 },
  { id: 15, name: 'Reykjavik', country: 'Iceland', region: 'Europe', image_url: 'https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=800', cost_index: 5, popularity_score: 82, description: 'Gateway to Northern Lights, glaciers, geysers, and otherworldly volcanic landscapes.', latitude: 64.1466, longitude: -21.9426 },
  { id: 16, name: 'Bangkok', country: 'Thailand', region: 'Asia', image_url: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800', cost_index: 1, popularity_score: 90, description: 'Ornate temples, vibrant street life, legendary street food, and floating markets.', latitude: 13.7563, longitude: 100.5018 },
  { id: 17, name: 'Machu Picchu', country: 'Peru', region: 'South America', image_url: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800', cost_index: 3, popularity_score: 91, description: 'The lost city of the Incas, perched high in the Andes with breathtaking mountain views.', latitude: -13.1631, longitude: -72.545 },
  { id: 18, name: 'Amsterdam', country: 'Netherlands', region: 'Europe', image_url: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800', cost_index: 4, popularity_score: 89, description: 'Charming canals, world-class art museums, cycling culture, and vibrant nightlife.', latitude: 52.3676, longitude: 4.9041 },
  { id: 19, name: 'Maldives', country: 'Maldives', region: 'Asia', image_url: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800', cost_index: 5, popularity_score: 86, description: 'Crystal-clear lagoons, overwater villas, pristine white sand beaches, and marine life.', latitude: 3.2028, longitude: 73.2207 },
  { id: 20, name: 'Prague', country: 'Czech Republic', region: 'Europe', image_url: 'https://images.unsplash.com/photo-1541849546-216549ae216d?w=800', cost_index: 2, popularity_score: 87, description: 'Fairy-tale architecture, medieval Old Town, Charles Bridge, and excellent beer culture.', latitude: 50.0755, longitude: 14.4378 },
  { id: 21, name: 'Jaipur', country: 'India', region: 'Asia', image_url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800', cost_index: 1, popularity_score: 84, description: 'The Pink City — magnificent forts, ornate palaces, colorful bazaars, and royal heritage.', latitude: 26.9124, longitude: 75.7873 },
  { id: 22, name: 'Rio de Janeiro', country: 'Brazil', region: 'South America', image_url: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800', cost_index: 3, popularity_score: 90, description: 'Christ the Redeemer, Copacabana beach, Carnival, samba, and stunning natural beauty.', latitude: -22.9068, longitude: -43.1729 },
  { id: 23, name: 'Vienna', country: 'Austria', region: 'Europe', image_url: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=800', cost_index: 3, popularity_score: 86, description: 'Imperial palaces, classical music heritage, coffeehouse culture, and art nouveau.', latitude: 48.2082, longitude: 16.3738 },
  { id: 24, name: 'Singapore', country: 'Singapore', region: 'Asia', image_url: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800', cost_index: 4, popularity_score: 88, description: 'Futuristic gardens, hawker food culture, Marina Bay, and a perfect blend of cultures.', latitude: 1.3521, longitude: 103.8198 },
  { id: 25, name: 'Lisbon', country: 'Portugal', region: 'Europe', image_url: 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=800', cost_index: 2, popularity_score: 87, description: 'Sun-drenched hills, pastel buildings, historic trams, pastéis de nata, and fado music.', latitude: 38.7223, longitude: -9.1393 },
];

// ── Seed Data: Activities ──────────────────────
export const ACTIVITIES = [
  // Paris
  { id: 1, city_id: 1, name: 'Eiffel Tower Visit', description: 'Ascend the iconic iron lattice tower for breathtaking panoramic views of Paris.', category: 'Sightseeing', estimated_cost: 26, duration: '2-3 hours', image_url: '/images/destinations/paris.jpg', rating: 4.8 },
  { id: 2, city_id: 1, name: 'Louvre Museum Tour', description: 'Explore the world\'s largest art museum, home to the Mona Lisa and Venus de Milo.', category: 'Culture', estimated_cost: 17, duration: '3-4 hours', image_url: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=600', rating: 4.9 },
  { id: 3, city_id: 1, name: 'Seine River Cruise', description: 'Glide past illuminated monuments on a romantic evening river cruise.', category: 'Experience', estimated_cost: 15, duration: '1-2 hours', image_url: 'https://images.unsplash.com/photo-1478391679764-b2d8b3cd1e94?w=600', rating: 4.7 },
  { id: 4, city_id: 1, name: 'Montmartre Walking Tour', description: 'Wander through the artistic hilltop neighborhood, visit Sacré-Cœur basilica.', category: 'Walking Tour', estimated_cost: 0, duration: '2 hours', image_url: 'https://images.unsplash.com/photo-1550340499-a6c60fc8287c?w=600', rating: 4.6 },
  // Tokyo
  { id: 5, city_id: 2, name: 'Shibuya Crossing Experience', description: 'Stand in the world\'s busiest pedestrian crossing and feel the energy of Tokyo.', category: 'Experience', estimated_cost: 0, duration: '1 hour', image_url: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=600', rating: 4.5 },
  { id: 6, city_id: 2, name: 'Tsukiji Fish Market Tour', description: 'Sample the freshest sushi and seafood at the world-famous outer market.', category: 'Food', estimated_cost: 30, duration: '2-3 hours', image_url: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=600', rating: 4.8 },
  { id: 7, city_id: 2, name: 'Meiji Shrine Visit', description: 'Find tranquility in this Shinto shrine surrounded by a lush forest in central Tokyo.', category: 'Culture', estimated_cost: 0, duration: '1-2 hours', image_url: 'https://images.unsplash.com/photo-1583086762675-5a142e6e7f0c?w=600', rating: 4.7 },
  { id: 8, city_id: 2, name: 'Akihabara Gaming District', description: 'Explore the electric town of anime, manga, electronics, and gaming arcades.', category: 'Entertainment', estimated_cost: 20, duration: '3-4 hours', image_url: 'https://images.unsplash.com/photo-1578469645742-46cae010e5d6?w=600', rating: 4.4 },
  // Bali
  { id: 9, city_id: 3, name: 'Tegallalang Rice Terraces', description: 'Walk through the stunning cascading rice paddies and learn about Subak irrigation.', category: 'Nature', estimated_cost: 5, duration: '2-3 hours', image_url: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=600', rating: 4.7 },
  { id: 10, city_id: 3, name: 'Uluwatu Temple Sunset', description: 'Watch a mesmerizing Kecak fire dance at this clifftop temple during sunset.', category: 'Culture', estimated_cost: 8, duration: '2-3 hours', image_url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600', rating: 4.8 },
  { id: 11, city_id: 3, name: 'Ubud Monkey Forest', description: 'Encounter playful long-tailed macaques in this sacred sanctuary amid ancient temples.', category: 'Nature', estimated_cost: 6, duration: '1-2 hours', image_url: 'https://images.unsplash.com/photo-1578469550956-0e16b69c6a3d?w=600', rating: 4.5 },
  { id: 12, city_id: 3, name: 'Balinese Cooking Class', description: 'Learn to prepare authentic Balinese dishes using fresh local ingredients.', category: 'Food', estimated_cost: 25, duration: '4-5 hours', image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600', rating: 4.9 },
  // Santorini
  { id: 13, city_id: 4, name: 'Oia Sunset Viewpoint', description: 'Witness the world-famous sunset from the charming village of Oia.', category: 'Experience', estimated_cost: 0, duration: '1-2 hours', image_url: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600', rating: 4.9 },
  { id: 14, city_id: 4, name: 'Caldera Sailing Tour', description: 'Sail around the volcanic caldera, swim in hot springs, and enjoy a Greek feast.', category: 'Adventure', estimated_cost: 120, duration: '5-6 hours', image_url: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=600', rating: 4.8 },
  { id: 15, city_id: 4, name: 'Wine Tasting Tour', description: 'Sample unique volcanic wines at traditional wineries with caldera views.', category: 'Food', estimated_cost: 45, duration: '3-4 hours', image_url: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=600', rating: 4.7 },
  { id: 16, city_id: 4, name: 'Red Beach Visit', description: 'Relax on the dramatic red volcanic cliffs and swim in crystal-clear waters.', category: 'Beach', estimated_cost: 0, duration: '2-3 hours', image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600', rating: 4.5 },
  // New York
  { id: 17, city_id: 5, name: 'Statue of Liberty & Ellis Island', description: 'Visit the iconic symbol of freedom and explore the immigration museum.', category: 'Sightseeing', estimated_cost: 24, duration: '4-5 hours', image_url: 'https://images.unsplash.com/photo-1605130284535-11dd9eedc58a?w=600', rating: 4.7 },
  { id: 18, city_id: 5, name: 'Broadway Show', description: 'Experience world-class theater on the Great White Way.', category: 'Entertainment', estimated_cost: 120, duration: '2-3 hours', image_url: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=600', rating: 4.9 },
  { id: 19, city_id: 5, name: 'Central Park Walking Tour', description: 'Stroll through the beloved 843-acre green oasis in the heart of Manhattan.', category: 'Nature', estimated_cost: 0, duration: '2-3 hours', image_url: 'https://images.unsplash.com/photo-1568515387631-8b650bbcdb90?w=600', rating: 4.6 },
  { id: 20, city_id: 5, name: 'Top of the Rock', description: 'Enjoy unobstructed 360-degree views from Rockefeller Center observation deck.', category: 'Sightseeing', estimated_cost: 40, duration: '1-2 hours', image_url: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=600', rating: 4.8 },
  // London
  { id: 21, city_id: 6, name: 'Tower of London', description: 'Explore 900 years of royal history and see the Crown Jewels.', category: 'Culture', estimated_cost: 33, duration: '3-4 hours', image_url: 'https://images.unsplash.com/photo-1529655683826-aba9b3e77383?w=600', rating: 4.7 },
  { id: 22, city_id: 6, name: 'British Museum', description: 'Discover human history spanning two million years — completely free.', category: 'Culture', estimated_cost: 0, duration: '3-4 hours', image_url: 'https://images.unsplash.com/photo-1590080876411-eb6f3e95abac?w=600', rating: 4.8 },
  { id: 23, city_id: 6, name: 'Afternoon Tea Experience', description: 'Indulge in a traditional English afternoon tea with scones and finger sandwiches.', category: 'Food', estimated_cost: 55, duration: '1-2 hours', image_url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600', rating: 4.6 },
  { id: 24, city_id: 6, name: 'West End Musical', description: 'Catch a world-class musical performance in London\'s theater district.', category: 'Entertainment', estimated_cost: 80, duration: '2-3 hours', image_url: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=600', rating: 4.8 },
  // Dubai
  { id: 25, city_id: 7, name: 'Burj Khalifa Observation', description: 'Ascend to the 148th floor of the world\'s tallest building for stunning views.', category: 'Sightseeing', estimated_cost: 50, duration: '1-2 hours', image_url: 'https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=600', rating: 4.8 },
  { id: 26, city_id: 7, name: 'Desert Safari', description: 'Experience dune bashing, camel riding, and a BBQ dinner under the stars.', category: 'Adventure', estimated_cost: 65, duration: '6-7 hours', image_url: 'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?w=600', rating: 4.7 },
  // Rome
  { id: 27, city_id: 8, name: 'Colosseum Tour', description: 'Step into the ancient arena where gladiators once fought.', category: 'Culture', estimated_cost: 18, duration: '2-3 hours', image_url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600', rating: 4.9 },
  { id: 28, city_id: 8, name: 'Vatican Museums & Sistine Chapel', description: 'Marvel at Michelangelo\'s ceiling and the vast papal art collection.', category: 'Culture', estimated_cost: 20, duration: '3-4 hours', image_url: 'https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=600', rating: 4.9 },
  { id: 29, city_id: 8, name: 'Trastevere Food Tour', description: 'Taste authentic Roman cuisine in the charming cobblestone streets.', category: 'Food', estimated_cost: 45, duration: '3 hours', image_url: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=600', rating: 4.8 },
  // Barcelona
  { id: 30, city_id: 9, name: 'Sagrada Familia Tour', description: 'Explore Gaudí\'s unfinished masterpiece basilica with its stunning interiors.', category: 'Culture', estimated_cost: 26, duration: '2-3 hours', image_url: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600', rating: 4.9 },
  { id: 31, city_id: 9, name: 'Park Güell', description: 'Wander through Gaudí\'s colorful mosaic park with panoramic city views.', category: 'Sightseeing', estimated_cost: 10, duration: '1-2 hours', image_url: 'https://images.unsplash.com/photo-1583779457711-ab081e10d0f3?w=600', rating: 4.7 },
  // Jaipur
  { id: 32, city_id: 21, name: 'Amber Fort Exploration', description: 'Explore the magnificent hilltop fort with intricate mirror work and courtyards.', category: 'Culture', estimated_cost: 8, duration: '3-4 hours', image_url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600', rating: 4.8 },
  { id: 33, city_id: 21, name: 'Hawa Mahal Visit', description: 'Admire the iconic Palace of Winds with its 953 small windows.', category: 'Sightseeing', estimated_cost: 3, duration: '1 hour', image_url: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600', rating: 4.6 },
  { id: 34, city_id: 21, name: 'Jaipur Street Food Tour', description: 'Sample dal baati churma, pyaaz kachori, and lassi in the Pink City bazaars.', category: 'Food', estimated_cost: 10, duration: '2-3 hours', image_url: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600', rating: 4.7 },
  // More activities for other cities
  { id: 35, city_id: 10, name: 'Sydney Opera House Tour', description: 'Go behind the scenes of this UNESCO World Heritage performing arts venue.', category: 'Culture', estimated_cost: 30, duration: '1-2 hours', image_url: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=600', rating: 4.7 },
  { id: 36, city_id: 10, name: 'Bondi to Coogee Walk', description: 'Scenic coastal walk with stunning ocean views and beach stops.', category: 'Nature', estimated_cost: 0, duration: '2-3 hours', image_url: 'https://images.unsplash.com/photo-1523428096049-1ced17076b30?w=600', rating: 4.6 },
  { id: 37, city_id: 11, name: 'Jemaa el-Fnaa Night Market', description: 'Experience the magical atmosphere of snake charmers, storytellers, and food stalls.', category: 'Experience', estimated_cost: 10, duration: '2-3 hours', image_url: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=600', rating: 4.7 },
  { id: 38, city_id: 12, name: 'Fushimi Inari Shrine', description: 'Walk through thousands of vermillion torii gates on the sacred mountain trail.', category: 'Culture', estimated_cost: 0, duration: '2-3 hours', image_url: 'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=600', rating: 4.9 },
  { id: 39, city_id: 12, name: 'Traditional Tea Ceremony', description: 'Experience the art of Japanese tea preparation in a historic tea house.', category: 'Culture', estimated_cost: 35, duration: '1-2 hours', image_url: 'https://images.unsplash.com/photo-1545048702-79362596cdc9?w=600', rating: 4.8 },
  { id: 40, city_id: 16, name: 'Grand Palace Tour', description: 'Marvel at the former royal residence and the Emerald Buddha temple.', category: 'Culture', estimated_cost: 15, duration: '2-3 hours', image_url: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600', rating: 4.7 },
];

// ── Seed Data: Sample Trips ────────────────────
const SAMPLE_TRIPS = [
  {
    id: 'trip-sample-1',
    user_id: 'user-demo',
    name: 'European Dream',
    description: 'A magical journey through Europe\'s most enchanting cities — from the romance of Paris to the cliffs of Santorini.',
    start_date: '2026-09-15',
    end_date: '2026-09-30',
    cover_image: '/images/destinations/paris.jpg',
    total_budget: 5000,
    is_public: true,
    share_slug: 'european-dream-2026',
    status: 'upcoming',
    created_at: '2026-08-01T10:00:00Z',
    stops: [
      { id: 'stop-1', trip_id: 'trip-sample-1', city_id: 1, arrival_date: '2026-09-15', departure_date: '2026-09-20', order_index: 0, budget_allocated: 2000, notes: 'Explore the City of Light' },
      { id: 'stop-2', trip_id: 'trip-sample-1', city_id: 4, arrival_date: '2026-09-21', departure_date: '2026-09-25', order_index: 1, budget_allocated: 1800, notes: 'Relax in the Greek islands' },
      { id: 'stop-3', trip_id: 'trip-sample-1', city_id: 8, arrival_date: '2026-09-26', departure_date: '2026-09-30', order_index: 2, budget_allocated: 1200, notes: 'History and pasta' },
    ],
    activities: [
      { id: 'ta-1', stop_id: 'stop-1', activity_id: 1, scheduled_date: '2026-09-16', time_slot: 'Morning', actual_cost: 26, notes: '', order_index: 0 },
      { id: 'ta-2', stop_id: 'stop-1', activity_id: 2, scheduled_date: '2026-09-17', time_slot: 'Morning', actual_cost: 17, notes: '', order_index: 0 },
      { id: 'ta-3', stop_id: 'stop-1', activity_id: 3, scheduled_date: '2026-09-18', time_slot: 'Evening', actual_cost: 15, notes: '', order_index: 0 },
      { id: 'ta-4', stop_id: 'stop-2', activity_id: 13, scheduled_date: '2026-09-22', time_slot: 'Evening', actual_cost: 0, notes: '', order_index: 0 },
      { id: 'ta-5', stop_id: 'stop-2', activity_id: 14, scheduled_date: '2026-09-23', time_slot: 'Morning', actual_cost: 120, notes: '', order_index: 0 },
      { id: 'ta-6', stop_id: 'stop-3', activity_id: 27, scheduled_date: '2026-09-27', time_slot: 'Morning', actual_cost: 18, notes: '', order_index: 0 },
      { id: 'ta-7', stop_id: 'stop-3', activity_id: 28, scheduled_date: '2026-09-28', time_slot: 'Morning', actual_cost: 20, notes: '', order_index: 0 },
    ],
    expenses: [
      { id: 'exp-1', trip_id: 'trip-sample-1', stop_id: 'stop-1', category: 'Transport', amount: 350, description: 'Flight to Paris', expense_date: '2026-09-15' },
      { id: 'exp-2', trip_id: 'trip-sample-1', stop_id: 'stop-1', category: 'Stay', amount: 600, description: 'Hotel Le Marais 5 nights', expense_date: '2026-09-15' },
      { id: 'exp-3', trip_id: 'trip-sample-1', stop_id: 'stop-1', category: 'Meals', amount: 200, description: 'Dining in Paris', expense_date: '2026-09-16' },
      { id: 'exp-4', trip_id: 'trip-sample-1', stop_id: 'stop-2', category: 'Transport', amount: 180, description: 'Flight Paris → Santorini', expense_date: '2026-09-21' },
      { id: 'exp-5', trip_id: 'trip-sample-1', stop_id: 'stop-2', category: 'Stay', amount: 500, description: 'Cave hotel 4 nights', expense_date: '2026-09-21' },
      { id: 'exp-6', trip_id: 'trip-sample-1', stop_id: 'stop-3', category: 'Transport', amount: 150, description: 'Flight Santorini → Rome', expense_date: '2026-09-26' },
      { id: 'exp-7', trip_id: 'trip-sample-1', stop_id: 'stop-3', category: 'Stay', amount: 400, description: 'Boutique hotel Trastevere', expense_date: '2026-09-26' },
      { id: 'exp-8', trip_id: 'trip-sample-1', stop_id: 'stop-3', category: 'Meals', amount: 180, description: 'Roman cuisine', expense_date: '2026-09-27' },
    ],
  },
  {
    id: 'trip-sample-2',
    user_id: 'user-demo',
    name: 'Asian Adventure',
    description: 'From the neon lights of Tokyo to the tranquil rice terraces of Bali — an unforgettable Asian journey.',
    start_date: '2026-11-01',
    end_date: '2026-11-14',
    cover_image: '/images/destinations/tokyo.jpg',
    total_budget: 3500,
    is_public: false,
    share_slug: 'asian-adventure-2026',
    status: 'upcoming',
    created_at: '2026-08-10T14:00:00Z',
    stops: [
      { id: 'stop-4', trip_id: 'trip-sample-2', city_id: 2, arrival_date: '2026-11-01', departure_date: '2026-11-07', order_index: 0, budget_allocated: 2000, notes: 'Explore Tokyo' },
      { id: 'stop-5', trip_id: 'trip-sample-2', city_id: 3, arrival_date: '2026-11-08', departure_date: '2026-11-14', order_index: 1, budget_allocated: 1500, notes: 'Relax in Bali' },
    ],
    activities: [
      { id: 'ta-8', stop_id: 'stop-4', activity_id: 5, scheduled_date: '2026-11-02', time_slot: 'Morning', actual_cost: 0, notes: '', order_index: 0 },
      { id: 'ta-9', stop_id: 'stop-4', activity_id: 6, scheduled_date: '2026-11-03', time_slot: 'Morning', actual_cost: 30, notes: '', order_index: 0 },
      { id: 'ta-10', stop_id: 'stop-5', activity_id: 9, scheduled_date: '2026-11-09', time_slot: 'Morning', actual_cost: 5, notes: '', order_index: 0 },
      { id: 'ta-11', stop_id: 'stop-5', activity_id: 10, scheduled_date: '2026-11-10', time_slot: 'Evening', actual_cost: 8, notes: '', order_index: 0 },
    ],
    expenses: [
      { id: 'exp-9', trip_id: 'trip-sample-2', stop_id: 'stop-4', category: 'Transport', amount: 800, description: 'Flight to Tokyo', expense_date: '2026-11-01' },
      { id: 'exp-10', trip_id: 'trip-sample-2', stop_id: 'stop-4', category: 'Stay', amount: 700, description: 'Hotel Shinjuku 6 nights', expense_date: '2026-11-01' },
      { id: 'exp-11', trip_id: 'trip-sample-2', stop_id: 'stop-5', category: 'Transport', amount: 200, description: 'Flight Tokyo → Bali', expense_date: '2026-11-08' },
      { id: 'exp-12', trip_id: 'trip-sample-2', stop_id: 'stop-5', category: 'Stay', amount: 400, description: 'Villa in Ubud', expense_date: '2026-11-08' },
    ],
  },
];

// ── Storage Helper ────────────────────────────
const STORAGE_KEYS = {
  USER: 'globetrotter_user',
  REGISTERED_USERS: 'globetrotter_registered_users',
  TRIPS: 'globetrotter_trips',
  INITIALIZED: 'globetrotter_initialized',
  CUSTOM_CITIES: 'globetrotter_custom_cities',
  CUSTOM_ACTIVITIES: 'globetrotter_custom_activities',
};

function getDeterministicUserId(email) {
  if (!email) return 'user-demo';
  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    hash = ((hash << 5) - hash) + email.charCodeAt(i);
    hash |= 0;
  }
  return 'user-' + Math.abs(hash).toString(36);
}

function getStorage(key, fallback = null) {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch { return fallback; }
}

function setStorage(key, value) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}

// ── Initialize Seed Data ──────────────────────
export function initializeData() {
  if (typeof window === 'undefined') return;
  if (!getStorage(STORAGE_KEYS.INITIALIZED)) {
    setStorage(STORAGE_KEYS.TRIPS, SAMPLE_TRIPS);
    setStorage(STORAGE_KEYS.INITIALIZED, true);
  }
}

// ── Auth Functions ────────────────────────────
export function getCurrentUser() {
  return getStorage(STORAGE_KEYS.USER);
}

export function loginUser(email, password) {
  if (!email || !password) return { error: 'Email and password required' };
  const cleanEmail = email.trim().toLowerCase();
  const registeredUsers = getStorage(STORAGE_KEYS.REGISTERED_USERS, {});
  
  let user = registeredUsers[cleanEmail];
  if (user) {
    // Restore existing user profile with avatar and saved info
    setStorage(STORAGE_KEYS.USER, user);
  } else {
    user = {
      id: getDeterministicUserId(cleanEmail),
      email: cleanEmail,
      name: cleanEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      avatar_url: null,
      city: 'Mumbai',
      country: 'India',
      preferences: { currency: 'INR', language: 'en' },
      created_at: new Date().toISOString(),
    };
    registeredUsers[cleanEmail] = user;
    setStorage(STORAGE_KEYS.REGISTERED_USERS, registeredUsers);
    setStorage(STORAGE_KEYS.USER, user);
  }

  // Cloud sync to Supabase
  if (supabase) {
    supabase.from('users').select('*').eq('email', cleanEmail).single().then(({ data: remoteUser, error }) => {
      if (remoteUser && !error) {
        const mergedUser = { ...user, ...remoteUser };
        setStorage(STORAGE_KEYS.USER, mergedUser);
        const users = getStorage(STORAGE_KEYS.REGISTERED_USERS, {});
        users[cleanEmail] = mergedUser;
        setStorage(STORAGE_KEYS.REGISTERED_USERS, users);
      } else {
        supabase.from('users').upsert([{
          id: user.id,
          email: user.email,
          name: user.name,
          avatar_url: user.avatar_url,
          city: user.city,
          country: user.country,
          preferences: user.preferences
        }], { onConflict: 'email' });
      }
    });
  }

  return { user };
}

export function signupUser(data) {
  const { firstName, lastName, email, password, city, country } = data;
  if (!email || !password || !firstName) return { error: 'Required fields missing' };
  const cleanEmail = email.trim().toLowerCase();
  const registeredUsers = getStorage(STORAGE_KEYS.REGISTERED_USERS, {});

  const user = {
    id: getDeterministicUserId(cleanEmail),
    email: cleanEmail,
    name: `${firstName} ${lastName || ''}`.trim(),
    avatar_url: null,
    city: city || 'Mumbai',
    country: country || 'India',
    preferences: { currency: 'INR', language: 'en' },
    created_at: new Date().toISOString(),
  };

  registeredUsers[cleanEmail] = user;
  setStorage(STORAGE_KEYS.REGISTERED_USERS, registeredUsers);
  setStorage(STORAGE_KEYS.USER, user);

  if (supabase) {
    supabase.from('users').upsert([{
      id: user.id,
      email: user.email,
      name: user.name,
      avatar_url: user.avatar_url,
      city: user.city,
      country: user.country,
      preferences: user.preferences
    }], { onConflict: 'email' }).then(({ error }) => {
      if (error) console.log('Supabase signup sync:', error.message);
    });
  }

  return { user };
}

export function updateUser(updates) {
  const user = getCurrentUser();
  if (!user) return { error: 'Not logged in' };
  const updated = { ...user, ...updates };
  setStorage(STORAGE_KEYS.USER, updated);

  // Update in registered users registry
  if (user.email) {
    const cleanEmail = user.email.toLowerCase();
    const registeredUsers = getStorage(STORAGE_KEYS.REGISTERED_USERS, {});
    registeredUsers[cleanEmail] = updated;
    setStorage(STORAGE_KEYS.REGISTERED_USERS, registeredUsers);
  }

  if (supabase) {
    supabase.from('users').update({
      name: updated.name,
      city: updated.city,
      country: updated.country,
      avatar_url: updated.avatar_url,
      preferences: updated.preferences
    }).eq('email', updated.email).then(({ error }) => {
      if (error) console.log('Supabase user update:', error.message);
    });
  }

  return { user: updated };
}

export function logoutUser() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.USER);
}

// ── Trip Functions ────────────────────────────
export function getTrips() {
  return getStorage(STORAGE_KEYS.TRIPS, []);
}

export function getUserTrips(userId) {
  const trips = getTrips();
  if (!userId) return trips;
  return trips.filter(t => t.user_id === userId || t.user_id === 'user-demo' || t.user_id === 'user-sample-1');
}

export function getTrip(tripId) {
  return getTrips().find(t => t.id === tripId) || null;
}

export function getTripBySlug(slug) {
  return getTrips().find(t => t.share_slug === slug && t.is_public) || null;
}

export function createTrip(data) {
  const user = getCurrentUser();
  if (!user) return { error: 'Not logged in' };
  const trip = {
    id: 'trip-' + uuidv4().slice(0, 8),
    user_id: user.id,
    name: data.name,
    description: data.description || '',
    start_date: data.start_date,
    end_date: data.end_date,
    cover_image: data.cover_image || '/images/destinations/paris.jpg',
    total_budget: data.total_budget || 0,
    is_public: data.is_public || false,
    share_slug: data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString(36),
    status: 'upcoming',
    created_at: new Date().toISOString(),
    stops: data.stops || [],
    activities: data.activities || [],
    expenses: data.expenses || [],
  };
  const trips = getTrips();
  trips.push(trip);
  setStorage(STORAGE_KEYS.TRIPS, trips);

  // Sync to Supabase in background
  if (supabase) {
    supabase.from('trips').insert([{
      id: trip.id,
      user_id: trip.user_id,
      name: trip.name,
      description: trip.description,
      start_date: trip.start_date,
      end_date: trip.end_date,
      cover_image: trip.cover_image,
      total_budget: trip.total_budget,
      is_public: trip.is_public,
      share_slug: trip.share_slug,
      status: trip.status
    }]).then(({ error }) => {
      if (error) console.log('Supabase sync (non-blocking):', error.message);
    });
  }

  return { trip };
}

export function updateTrip(tripId, updates) {
  const trips = getTrips();
  const idx = trips.findIndex(t => t.id === tripId);
  if (idx === -1) return { error: 'Trip not found' };
  trips[idx] = { ...trips[idx], ...updates };
  setStorage(STORAGE_KEYS.TRIPS, trips);

  if (supabase) {
    supabase.from('trips').update(updates).eq('id', tripId).then(({ error }) => {
      if (error) console.log('Supabase sync:', error.message);
    });
  }

  return { trip: trips[idx] };
}

export function deleteTrip(tripId) {
  const trips = getTrips().filter(t => t.id !== tripId);
  setStorage(STORAGE_KEYS.TRIPS, trips);

  if (supabase) {
    supabase.from('trips').delete().eq('id', tripId).then(({ error }) => {
      if (error) console.log('Supabase delete sync:', error.message);
    });
  }

  return { success: true };
}

// ── Stop Functions ────────────────────────────
export function addStop(tripId, data) {
  const trips = getTrips();
  const trip = trips.find(t => t.id === tripId);
  if (!trip) return { error: 'Trip not found' };
  const stop = {
    id: 'stop-' + uuidv4().slice(0, 8),
    trip_id: tripId,
    city_id: data.city_id,
    arrival_date: data.arrival_date,
    departure_date: data.departure_date,
    order_index: trip.stops.length,
    budget_allocated: data.budget_allocated || 0,
    notes: data.notes || '',
  };
  trip.stops.push(stop);
  setStorage(STORAGE_KEYS.TRIPS, trips);

  if (supabase) {
    supabase.from('trip_stops').insert([{
      id: stop.id,
      trip_id: stop.trip_id,
      city_id: stop.city_id,
      arrival_date: stop.arrival_date,
      departure_date: stop.departure_date,
      order_index: stop.order_index,
      budget_allocated: stop.budget_allocated,
      notes: stop.notes
    }]).then(({ error }) => {
      if (error) console.log('Supabase stop sync:', error.message);
    });
  }

  return { stop };
}

export function updateStop(tripId, stopId, updates) {
  const trips = getTrips();
  const trip = trips.find(t => t.id === tripId);
  if (!trip) return { error: 'Trip not found' };
  const idx = trip.stops.findIndex(s => s.id === stopId);
  if (idx === -1) return { error: 'Stop not found' };
  trip.stops[idx] = { ...trip.stops[idx], ...updates };
  setStorage(STORAGE_KEYS.TRIPS, trips);

  if (supabase) {
    supabase.from('trip_stops').update(updates).eq('id', stopId).then(({ error }) => {
      if (error) console.log('Supabase stop update sync:', error.message);
    });
  }

  return { stop: trip.stops[idx] };
}

export function removeStop(tripId, stopId) {
  const trips = getTrips();
  const trip = trips.find(t => t.id === tripId);
  if (!trip) return { error: 'Trip not found' };
  trip.stops = trip.stops.filter(s => s.id !== stopId);
  trip.activities = trip.activities.filter(a => a.stop_id !== stopId);
  trip.expenses = trip.expenses.filter(e => e.stop_id !== stopId);
  setStorage(STORAGE_KEYS.TRIPS, trips);

  if (supabase) {
    supabase.from('trip_stops').delete().eq('id', stopId).then(({ error }) => {
      if (error) console.log('Supabase stop delete sync:', error.message);
    });
  }

  return { success: true };
}

export function reorderStops(tripId, stopIds) {
  const trips = getTrips();
  const trip = trips.find(t => t.id === tripId);
  if (!trip) return { error: 'Trip not found' };
  trip.stops = stopIds.map((id, i) => {
    const s = trip.stops.find(s => s.id === id);
    return { ...s, order_index: i };
  });
  setStorage(STORAGE_KEYS.TRIPS, trips);
  return { success: true };
}

// ── Activity Functions ────────────────────────
export function addTripActivity(tripId, data) {
  const trips = getTrips();
  const trip = trips.find(t => t.id === tripId);
  if (!trip) return { error: 'Trip not found' };
  const ta = {
    id: 'ta-' + uuidv4().slice(0, 8),
    stop_id: data.stop_id,
    activity_id: data.activity_id,
    scheduled_date: data.scheduled_date,
    time_slot: data.time_slot || 'Morning',
    actual_cost: data.actual_cost || 0,
    notes: data.notes || '',
    order_index: trip.activities.filter(a => a.stop_id === data.stop_id).length,
  };
  trip.activities.push(ta);
  setStorage(STORAGE_KEYS.TRIPS, trips);

  if (supabase) {
    supabase.from('trip_activities').insert([{
      id: ta.id,
      stop_id: ta.stop_id,
      activity_id: ta.activity_id,
      scheduled_date: ta.scheduled_date,
      time_slot: ta.time_slot,
      actual_cost: ta.actual_cost,
      notes: ta.notes,
      order_index: ta.order_index
    }]).then(({ error }) => {
      if (error) console.log('Supabase activity sync:', error.message);
    });
  }

  return { activity: ta };
}

export function removeTripActivity(tripId, activityId) {
  const trips = getTrips();
  const trip = trips.find(t => t.id === tripId);
  if (!trip) return { error: 'Trip not found' };
  trip.activities = trip.activities.filter(a => a.id !== activityId);
  setStorage(STORAGE_KEYS.TRIPS, trips);

  if (supabase) {
    supabase.from('trip_activities').delete().eq('id', activityId).then(({ error }) => {
      if (error) console.log('Supabase activity delete sync:', error.message);
    });
  }

  return { success: true };
}

// ── Expense Functions ─────────────────────────
export function addExpense(tripId, data) {
  const trips = getTrips();
  const trip = trips.find(t => t.id === tripId);
  if (!trip) return { error: 'Trip not found' };
  const expense = {
    id: 'exp-' + uuidv4().slice(0, 8),
    trip_id: tripId,
    stop_id: data.stop_id || null,
    category: data.category,
    amount: data.amount,
    description: data.description || '',
    expense_date: data.expense_date || new Date().toISOString().split('T')[0],
  };
  trip.expenses.push(expense);
  setStorage(STORAGE_KEYS.TRIPS, trips);

  if (supabase) {
    supabase.from('expenses').insert([{
      id: expense.id,
      trip_id: expense.trip_id,
      stop_id: expense.stop_id,
      category: expense.category,
      amount: expense.amount,
      description: expense.description,
      expense_date: expense.expense_date
    }]).then(({ error }) => {
      if (error) console.log('Supabase expense sync:', error.message);
    });
  }

  return { expense };
}

export function removeExpense(tripId, expenseId) {
  const trips = getTrips();
  const trip = trips.find(t => t.id === tripId);
  if (!trip) return { error: 'Trip not found' };
  trip.expenses = trip.expenses.filter(e => e.id !== expenseId);
  setStorage(STORAGE_KEYS.TRIPS, trips);

  if (supabase) {
    supabase.from('expenses').delete().eq('id', expenseId).then(({ error }) => {
      if (error) console.log('Supabase expense delete sync:', error.message);
    });
  }

  return { success: true };
}

// ── City & Activity Helpers ───────────────────
export function getAllCities() {
  const custom = getStorage(STORAGE_KEYS.CUSTOM_CITIES, []);
  const all = [...CITIES];
  custom.forEach(cc => {
    if (!all.some(c => c.id === cc.id || c.name.toLowerCase() === cc.name.toLowerCase())) {
      all.push(cc);
    }
  });
  return all;
}

export function addCustomCity(cityData) {
  const custom = getStorage(STORAGE_KEYS.CUSTOM_CITIES, []);
  const allCities = getAllCities();
  const existing = allCities.find(c => c.name.toLowerCase() === cityData.name.toLowerCase());
  if (existing) return existing;

  const newCity = {
    id: cityData.id || ('dyn-' + uuidv4().slice(0, 8)),
    name: cityData.name,
    country: cityData.country || 'Global',
    region: cityData.region || 'International',
    image_url: cityData.image_url || '/images/destinations/paris.jpg',
    cost_index: cityData.cost_index || 3,
    popularity_score: cityData.popularity_score || 85,
    description: cityData.description || `Explore the beautiful sights, rich culture, and authentic experiences of ${cityData.name}.`,
    latitude: cityData.latitude || 0,
    longitude: cityData.longitude || 0,
  };

  custom.push(newCity);
  setStorage(STORAGE_KEYS.CUSTOM_CITIES, custom);

  // Generate 4 curated default activities for this new destination in ₹ INR
  const customActs = getStorage(STORAGE_KEYS.CUSTOM_ACTIVITIES, []);
  const sampleActivities = [
    {
      id: 'act-' + uuidv4().slice(0, 8),
      city_id: newCity.id,
      name: `${newCity.name} Heritage & City Highlights`,
      description: `Discover the top historical landmarks, iconic architecture, and local culture of ${newCity.name}.`,
      category: 'Culture',
      estimated_cost: 500,
      duration: '3-4 hours',
      image_url: newCity.image_url,
      rating: 4.8,
    },
    {
      id: 'act-' + uuidv4().slice(0, 8),
      city_id: newCity.id,
      name: `Authentic ${newCity.name} Food & Market Tour`,
      description: `Taste the most celebrated street food, delicacies, and local recipes of ${newCity.name}.`,
      category: 'Food',
      estimated_cost: 350,
      duration: '2 hours',
      image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600',
      rating: 4.7,
    },
    {
      id: 'act-' + uuidv4().slice(0, 8),
      city_id: newCity.id,
      name: `${newCity.name} Scenic Sunset Viewpoint`,
      description: `Enjoy breathtaking views of ${newCity.name} and relax during the golden hour.`,
      category: 'Sightseeing',
      estimated_cost: 200,
      duration: '1-2 hours',
      image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600',
      rating: 4.9,
    },
    {
      id: 'act-' + uuidv4().slice(0, 8),
      city_id: newCity.id,
      name: `${newCity.name} Nature & Adventure Excursion`,
      description: `Immerse yourself in the surrounding nature, trails, and scenic outdoor spots around ${newCity.name}.`,
      category: 'Adventure',
      estimated_cost: 800,
      duration: '4-5 hours',
      image_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600',
      rating: 4.6,
    },
  ];

  sampleActivities.forEach(act => customActs.push(act));
  setStorage(STORAGE_KEYS.CUSTOM_ACTIVITIES, customActs);

  return newCity;
}

export function getAllActivities() {
  const custom = getStorage(STORAGE_KEYS.CUSTOM_ACTIVITIES, []);
  const all = [...ACTIVITIES];
  custom.forEach(ca => {
    if (!all.some(a => a.id === ca.id)) {
      all.push(ca);
    }
  });
  return all;
}

export function searchCities(query, filters = {}) {
  let results = getAllCities();
  if (query) {
    const q = query.toLowerCase().trim();
    results = results.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.country.toLowerCase().includes(q) ||
      c.region.toLowerCase().includes(q)
    );
  }
  if (filters.region) results = results.filter(c => c.region === filters.region);
  if (filters.maxCost) results = results.filter(c => c.cost_index <= filters.maxCost);
  if (filters.sortBy === 'popularity') results.sort((a, b) => b.popularity_score - a.popularity_score);
  if (filters.sortBy === 'cost_low') results.sort((a, b) => a.cost_index - b.cost_index);
  if (filters.sortBy === 'cost_high') results.sort((a, b) => b.cost_index - a.cost_index);
  return results;
}

export function getCity(cityId) {
  return getAllCities().find(c => c.id === cityId) || null;
}

export function getCityActivities(cityId, filters = {}) {
  let results = getAllActivities().filter(a => a.city_id === cityId);
  if (filters.category) results = results.filter(a => a.category === filters.category);
  if (filters.maxCost !== undefined) results = results.filter(a => a.estimated_cost <= filters.maxCost);
  return results;
}

export function searchActivities(query, filters = {}) {
  let results = getAllActivities();
  if (query) {
    const q = query.toLowerCase().trim();
    results = results.filter(a =>
      a.name.toLowerCase().includes(q) ||
      a.description.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q)
    );
  }
  if (filters.category) results = results.filter(a => a.category === filters.category);
  if (filters.cityId) results = results.filter(a => a.city_id === filters.cityId);
  if (filters.maxCost !== undefined) results = results.filter(a => a.estimated_cost <= filters.maxCost);
  return results;
}

export function getActivity(activityId) {
  return getAllActivities().find(a => a.id === activityId) || null;
}

// ── Budget Calculation Helpers ────────────────
export function calculateTripBudget(trip) {
  const expenseTotal = (trip.expenses || []).reduce((sum, e) => sum + e.amount, 0);
  const activityTotal = (trip.activities || []).reduce((sum, a) => sum + (a.actual_cost || 0), 0);
  const totalSpent = expenseTotal + activityTotal;

  const byCategory = {};
  (trip.expenses || []).forEach(e => {
    byCategory[e.category] = (byCategory[e.category] || 0) + e.amount;
  });
  byCategory['Activities'] = activityTotal;

  const days = trip.start_date && trip.end_date
    ? Math.max(1, Math.ceil((new Date(trip.end_date) - new Date(trip.start_date)) / (1000 * 60 * 60 * 24)))
    : 1;

  return {
    totalBudget: trip.total_budget || 0,
    totalSpent,
    remaining: (trip.total_budget || 0) - totalSpent,
    byCategory,
    avgPerDay: totalSpent / days,
    days,
    isOverBudget: totalSpent > (trip.total_budget || 0),
  };
}

// ── Admin Analytics ──────────────────────────
export function getAnalytics() {
  const trips = getTrips();
  const totalTrips = trips.length;
  const totalStops = trips.reduce((sum, t) => sum + (t.stops?.length || 0), 0);
  const totalActivities = trips.reduce((sum, t) => sum + (t.activities?.length || 0), 0);

  // Most popular cities
  const cityCounts = {};
  trips.forEach(t => {
    (t.stops || []).forEach(s => {
      cityCounts[s.city_id] = (cityCounts[s.city_id] || 0) + 1;
    });
  });
  const popularCities = Object.entries(cityCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id, count]) => ({ city: getCity(Number(id)), count }));

  // Budget stats
  const totalBudget = trips.reduce((sum, t) => sum + (t.total_budget || 0), 0);
  const totalSpent = trips.reduce((sum, t) => sum + calculateTripBudget(t).totalSpent, 0);

  return {
    totalTrips,
    totalStops,
    totalActivities,
    totalUsers: 1,
    popularCities,
    totalBudget,
    totalSpent,
    avgTripBudget: totalTrips ? totalBudget / totalTrips : 0,
  };
}

// ── Utility: Copy Trip ────────────────────────
export function copyTrip(sourceTripId) {
  const source = getTrip(sourceTripId);
  if (!source) return { error: 'Trip not found' };
  const user = getCurrentUser();
  if (!user) return { error: 'Not logged in' };

  const newTrip = {
    ...source,
    id: 'trip-' + uuidv4().slice(0, 8),
    user_id: user.id,
    name: source.name + ' (Copy)',
    is_public: false,
    share_slug: source.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-copy-' + Date.now().toString(36),
    created_at: new Date().toISOString(),
    stops: source.stops.map(s => ({ ...s, id: 'stop-' + uuidv4().slice(0, 8) })),
    activities: source.activities.map(a => ({ ...a, id: 'ta-' + uuidv4().slice(0, 8) })),
    expenses: source.expenses.map(e => ({ ...e, id: 'exp-' + uuidv4().slice(0, 8) })),
  };

  const trips = getTrips();
  trips.push(newTrip);
  setStorage(STORAGE_KEYS.TRIPS, trips);
  return { trip: newTrip };
}

// ── Cost & Budget Formatters ──────────────────
export function getCostTierLabel(costIndex) {
  const tiers = {
    1: 'Budget (~₹1,500/day)',
    2: 'Affordable (~₹3,500/day)',
    3: 'Moderate (~₹6,500/day)',
    4: 'Premium (~₹12,000/day)',
    5: 'Luxury (~₹25,000/day)',
  };
  return tiers[costIndex] || tiers[3];
}

export function formatINR(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  return '₹' + Number(amount).toLocaleString('en-IN');
}
