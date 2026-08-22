'use client';
import { useState, useEffect, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import { ToastProvider, useToast } from '@/components/Toast';
import { getCurrentUser, searchCities, searchActivities, getCityActivities, getCity, CITIES, getUserTrips, addStop, addTripActivity, addCustomCity, getAllCities, getCostTierLabel } from '@/lib/data';
import { useRouter, useSearchParams } from 'next/navigation';
import { FiSearch, FiMapPin, FiStar, FiDollarSign, FiClock, FiFilter, FiX, FiGlobe, FiCompass, FiPlus, FiCheck, FiLoader, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';
import styles from './page.module.css';

function ExploreContent() {
  const [user, setUser] = useState(null);
  const [activeView, setActiveView] = useState('cities');
  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [maxCost, setMaxCost] = useState('');
  const [sortBy, setSortBy] = useState('popularity');
  const [selectedCity, setSelectedCity] = useState(null);
  const [userTrips, setUserTrips] = useState([]);
  const [showAddToTripModal, setShowAddToTripModal] = useState(null); // { type: 'city' | 'activity', item }
  const [isVerifyingLocation, setIsVerifyingLocation] = useState(false);
  const [verifiedLocation, setVerifiedLocation] = useState(null);
  const [verificationError, setVerificationError] = useState(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const addToast = useToast();

  useEffect(() => {
    const u = getCurrentUser();
    if (!u) { router.push('/auth/login'); return; }
    setUser(u);
    setUserTrips(getUserTrips(u.id));

    const initialSearch = searchParams?.get('search');
    if (initialSearch) {
      setSearch(initialSearch);
    }
  }, [router, searchParams]);

  // Debounced location verification for explore search
  useEffect(() => {
    const q = search.trim();
    if (!q || q.length < 2 || activeView !== 'cities') {
      setVerifiedLocation(null);
      setVerificationError(null);
      setIsVerifyingLocation(false);
      return;
    }

    const localMatches = searchCities(q, {
      region: selectedRegion,
      maxCost: maxCost ? parseInt(maxCost) : undefined,
    });

    if (localMatches.length > 0) {
      setVerifiedLocation(null);
      setVerificationError(null);
      setIsVerifyingLocation(false);
      return;
    }

    setIsVerifyingLocation(true);
    setVerificationError(null);
    setVerifiedLocation(null);

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/places/search?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        if (data.exists && data.city) {
          setVerifiedLocation(data.city);
          setVerificationError(null);
        } else {
          setVerifiedLocation(null);
          setVerificationError(data.message || `"${q}" does not exist in the real world.`);
        }
      } catch (err) {
        setVerificationError('Unable to connect to global geocoding network.');
      } finally {
        setIsVerifyingLocation(false);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [search, activeView, selectedRegion, maxCost]);

  const regions = [...new Set(CITIES.map(c => c.region))];
  const categories = ['Sightseeing', 'Culture', 'Nature', 'Food', 'Adventure', 'Experience', 'Entertainment', 'Beach', 'Walking Tour'];

  const cities = searchCities(search, {
    region: selectedRegion,
    maxCost: maxCost ? parseInt(maxCost) : undefined,
    sortBy,
  });

  const activities = searchActivities(search, {
    category: selectedCategory,
    cityId: selectedCity?.id,
    maxCost: maxCost ? parseInt(maxCost) : undefined,
  });

  const handleAddCityToTrip = (tripId, cityId) => {
    const trip = userTrips.find(t => t.id === tripId);
    if (!trip) return;
    const defaultStart = trip.stops?.length > 0
      ? trip.stops[trip.stops.length - 1].departure_date
      : trip.start_date || new Date().toISOString().split('T')[0];
    const startDate = new Date(defaultStart);
    startDate.setDate(startDate.getDate() + 1);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 3);

    addStop(trip.id, {
      city_id: cityId,
      arrival_date: startDate.toISOString().split('T')[0],
      departure_date: endDate.toISOString().split('T')[0],
      budget_allocated: 500,
    });
    addToast('City added to your trip itinerary!', 'success');
    setShowAddToTripModal(null);
  };

  const handleAddActivityToTrip = (tripId, activity) => {
    const trip = userTrips.find(t => t.id === tripId);
    if (!trip) return;
    let targetStop = (trip.stops || []).find(s => s.city_id === activity.city_id);
    if (!targetStop && trip.stops?.length > 0) {
      targetStop = trip.stops[0];
    }
    if (!targetStop) {
      const start = trip.start_date || new Date().toISOString().split('T')[0];
      const stopRes = addStop(trip.id, {
        city_id: activity.city_id,
        arrival_date: start,
        departure_date: start,
        budget_allocated: 300,
      });
      targetStop = stopRes.stop;
    }

    addTripActivity(trip.id, {
      stop_id: targetStop.id,
      activity_id: activity.id,
      scheduled_date: targetStop.arrival_date,
      time_slot: 'Morning',
      actual_cost: activity.estimated_cost || 0,
    });

    addToast(`Added "${activity.name}" to your trip!`, 'success');
    setShowAddToTripModal(null);
  };

  if (!user) return null;

  return (
    <>
      <Navbar />
      <main className={styles.page}>
        <div className="container">
          <div className={styles.header}>
            <span className="section-label">Discover Destinations</span>
            <h1>Explore Cities & Activities</h1>
            <p>Browse 25+ global cities and 40+ curated activities to build your personalized travel plan.</p>
          </div>

          {/* Search Bar */}
          <div className={styles.searchSection}>
            <div className={styles.searchBar}>
              <FiSearch className={styles.searchIcon} />
              <input
                type="text"
                placeholder={activeView === 'cities' ? 'Search cities, countries, or regions...' : 'Search activities...'}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button className={styles.clearBtn} onClick={() => setSearch('')}><FiX /></button>
              )}
            </div>

            {/* View Toggle */}
            <div className={styles.viewToggle}>
              <button className={`${styles.viewBtn} ${activeView === 'cities' ? styles.activeView : ''}`} onClick={() => { setActiveView('cities'); setSelectedCity(null); }}>
                <FiGlobe /> Cities ({cities.length})
              </button>
              <button className={`${styles.viewBtn} ${activeView === 'activities' ? styles.activeView : ''}`} onClick={() => setActiveView('activities')}>
                <FiCompass /> Activities ({activities.length})
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className={styles.filters}>
            {activeView === 'cities' ? (
              <>
                <select className={styles.filterSelect} value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)}>
                  <option value="">All Regions</option>
                  {regions.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <select className={styles.filterSelect} value={maxCost} onChange={(e) => setMaxCost(e.target.value)}>
                  <option value="">Any Budget</option>
                  <option value="1">Budget (~₹1,500/day)</option>
                  <option value="2">Affordable (~₹3,500/day)</option>
                  <option value="3">Moderate (~₹6,500/day)</option>
                  <option value="4">Premium (~₹12,000/day)</option>
                  <option value="5">Luxury (~₹25,000/day)</option>
                </select>
                <select className={styles.filterSelect} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="popularity">Most Popular</option>
                  <option value="cost_low">Cheapest First</option>
                  <option value="cost_high">Most Expensive</option>
                </select>
              </>
            ) : (
              <>
                <div className={styles.chipFilters}>
                  <button className={`chip ${!selectedCategory ? 'active' : ''}`} onClick={() => setSelectedCategory('')}>All</button>
                  {categories.map(c => (
                    <button key={c} className={`chip ${selectedCategory === c ? 'active' : ''}`} onClick={() => setSelectedCategory(selectedCategory === c ? '' : c)}>{c}</button>
                  ))}
                </div>
              </>
            )}
            <span className={styles.resultCount}>
              {activeView === 'cities' ? cities.length : activities.length} destinations
            </span>
          </div>

          {/* ── Cities Grid ── */}
          {activeView === 'cities' && (
            <div className={styles.cityGrid}>
              {cities.map((city, i) => (
                <div key={city.id} className={styles.cityCard} style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className={styles.cityImageWrap} onClick={() => { setSelectedCity(city); setActiveView('activities'); }}>
                    <img 
                      src={city.image_url} 
                      alt={city.name} 
                      onError={(e) => { e.target.src = '/images/destinations/paris.jpg'; }}
                    />
                    <div className={styles.cityBadge}><FiMapPin /> {city.country}</div>
                    <div className={styles.cityOverlay}>
                      <h3>{city.name}</h3>
                      <p>{city.description.substring(0, 90)}...</p>
                      <div className={styles.cityMeta}>
                        <span className={styles.cityRating}><FiStar /> {(city.popularity_score / 20).toFixed(1)}</span>
                        <span className={styles.cityCost}>
                          {getCostTierLabel(city.cost_index)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.cityActions}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => { setSelectedCity(city); setActiveView('activities'); }}
                      title={`View activities in ${city.name}`}
                    >
                      <FiCompass style={{ fontSize: '0.9rem' }} /> Activities
                    </button>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => setShowAddToTripModal({ type: 'city', item: city })}
                      title={`Add ${city.name} to itinerary`}
                    >
                      <FiPlus style={{ fontSize: '0.9rem' }} /> Add to Trip
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Activities Grid ── */}
          {activeView === 'activities' && (
            <>
              {selectedCity && (
                <div className={styles.selectedCityBanner}>
                  <img 
                    src={selectedCity.image_url} 
                    alt={selectedCity.name} 
                    onError={(e) => { e.target.src = '/images/destinations/paris.jpg'; }}
                  />
                  <div className={styles.bannerContent}>
                    <h3>Activities in {selectedCity.name}</h3>
                    <p>{selectedCity.country} · {selectedCity.region}</p>
                  </div>
                  <button className="btn btn-secondary btn-sm" onClick={() => setSelectedCity(null)}>
                    <FiX /> Clear Filter
                  </button>
                </div>
              )}
              <div className={styles.activityGrid}>
                {activities.map((act, i) => {
                  const city = getCity(act.city_id);
                  return (
                    <div key={act.id} className={styles.activityCard} style={{ animationDelay: `${i * 0.05}s` }}>
                      <div className={styles.actImgWrap}>
                        <img 
                          src={act.image_url} 
                          alt={act.name} 
                          onError={(e) => { e.target.src = '/images/destinations/paris.jpg'; }}
                        />
                        <span className={`badge badge-white ${styles.actCategoryBadge}`}>{act.category}</span>
                      </div>
                      <div className={styles.actBody}>
                        <h4>{act.name}</h4>
                        <p className={styles.actCity}><FiMapPin /> {city?.name}, {city?.country}</p>
                        <p className={styles.actDesc}>{act.description.substring(0, 80)}...</p>
                        <div className={styles.actMeta}>
                          <span><FiClock /> {act.duration}</span>
                          <span><FiDollarSign /> {act.estimated_cost === 0 ? 'Free' : `₹${act.estimated_cost}`}</span>
                          <span className={styles.actRating}><FiStar /> {act.rating}</span>
                        </div>
                        <button
                          className="btn btn-primary btn-sm"
                          style={{ width: '100%', marginTop: '12px' }}
                          onClick={() => setShowAddToTripModal({ type: 'activity', item: act })}
                        >
                          <FiPlus /> Add to Itinerary
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Dynamic Real-World Location Verification in Explore */}
          {activeView === 'cities' && cities.length === 0 && isVerifyingLocation && (
            <div style={{ padding: '40px 20px', textAlign: 'center', background: 'rgba(6, 182, 212, 0.08)', borderRadius: 'var(--radius-xl)', border: '1.5px dashed #06b6d4', margin: '30px 0' }}>
              <FiLoader className="spin" style={{ fontSize: '2rem', color: '#06b6d4', marginBottom: '12px' }} />
              <h3 style={{ fontSize: '1.2rem', color: '#0891b2', marginBottom: '4px' }}>Verifying "{search}" with Global Geocoding & Satellite Data...</h3>
              <p style={{ color: 'var(--color-slate)', fontSize: '0.9rem' }}>Searching worldwide maps, coordinates, and tourism insights.</p>
            </div>
          )}

          {activeView === 'cities' && cities.length === 0 && !isVerifyingLocation && verifiedLocation && (
            <div style={{ margin: '30px 0', background: 'var(--color-white)', borderRadius: 'var(--radius-2xl)', border: '2px solid var(--color-forest)', padding: '24px', boxShadow: 'var(--shadow-lg)' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(27,67,50,0.1)', color: 'var(--color-forest)', padding: '6px 14px', borderRadius: 'var(--radius-full)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '16px' }}>
                <FiCheckCircle /> Verified Real-World Destination Found
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(140px, 200px) 1fr', gap: '24px', alignItems: 'center' }}>
                <img 
                  src={verifiedLocation.image_url} 
                  alt={verifiedLocation.name}
                  style={{ width: '100%', height: '160px', borderRadius: 'var(--radius-xl)', objectFit: 'cover' }}
                  onError={(e) => { e.target.src = '/images/destinations/paris.jpg'; }}
                />
                <div>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', marginBottom: '4px' }}>{verifiedLocation.name}</h3>
                  <p style={{ color: 'var(--color-forest)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '8px' }}>
                    <FiMapPin /> {verifiedLocation.country} {verifiedLocation.state ? `(${verifiedLocation.state})` : ''} · {verifiedLocation.region} · {getCostTierLabel(verifiedLocation.cost_index)}
                  </p>
                  <p style={{ color: 'var(--color-slate)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '16px' }}>{verifiedLocation.description}</p>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <button 
                      className="btn btn-primary"
                      onClick={() => {
                        const newCity = addCustomCity(verifiedLocation);
                        setShowAddToTripModal({ type: 'city', item: newCity });
                      }}
                    >
                      <FiPlus /> Add {verifiedLocation.name} to Trip
                    </button>
                    <button 
                      className="btn btn-secondary"
                      onClick={() => {
                        const newCity = addCustomCity(verifiedLocation);
                        setSelectedCity(newCity);
                        setActiveView('activities');
                      }}
                    >
                      View Activities in {verifiedLocation.name}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeView === 'cities' && cities.length === 0 && !isVerifyingLocation && verificationError && (
            <div style={{ padding: '36px 20px', textAlign: 'center', background: '#fef2f2', border: '1.5px solid #fecaca', borderRadius: 'var(--radius-xl)', margin: '30px 0' }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>❌</div>
              <h3 style={{ color: '#991b1b', fontSize: '1.2rem', marginBottom: '6px' }}>Destination Not Found</h3>
              <p style={{ color: '#b91c1c', fontSize: '0.92rem', maxWidth: '500px', margin: '0 auto' }}>{verificationError}</p>
            </div>
          )}

          {((activeView === 'cities' && cities.length === 0 && !isVerifyingLocation && !verifiedLocation && !verificationError) || (activeView === 'activities' && activities.length === 0)) && (
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
              <h3>No destinations found</h3>
              <p>Try adjusting your search criteria or filters.</p>
            </div>
          )}
        </div>
      </main>

      {/* ── Add to Trip Modal ── */}
      {showAddToTripModal && (
        <div className="modal-overlay" onClick={() => setShowAddToTripModal(null)}>
          <div className="modal-content animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                Add {showAddToTripModal.item.name} to Trip
              </h3>
              <button className="modal-close" onClick={() => setShowAddToTripModal(null)}>×</button>
            </div>
            
            <p style={{ marginBottom: '16px', color: 'var(--color-slate)' }}>
              Select which trip itinerary you'd like to add this {showAddToTripModal.type} to:
            </p>

            {userTrips.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {userTrips.map((trip) => (
                  <div
                    key={trip.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 18px',
                      background: 'var(--color-cream)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid rgba(0,0,0,0.06)',
                    }}
                  >
                    <div>
                      <strong style={{ display: 'block', fontSize: '1rem', color: 'var(--color-charcoal)' }}>{trip.name}</strong>
                      <span style={{ fontSize: '0.85rem', color: 'var(--color-slate)' }}>{trip.stops?.length || 0} stops scheduled</span>
                    </div>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        if (showAddToTripModal.type === 'city') {
                          handleAddCityToTrip(trip.id, showAddToTripModal.item.id);
                        } else {
                          handleAddActivityToTrip(trip.id, showAddToTripModal.item);
                        }
                      }}
                    >
                      Select
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <p>You don't have any trips created yet.</p>
                <button
                  className="btn btn-primary btn-sm"
                  style={{ marginTop: '12px' }}
                  onClick={() => router.push('/trips/create')}
                >
                  Create a Trip Now
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default function ExplorePage() {
  return (
    <ToastProvider>
      <Suspense fallback={<div style={{ padding: '60px', textAlign: 'center' }}>Loading Explore...</div>}>
        <ExploreContent />
      </Suspense>
    </ToastProvider>
  );
}
