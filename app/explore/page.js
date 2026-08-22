'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { ToastProvider, useToast } from '@/components/Toast';
import { getCurrentUser, searchCities, searchActivities, getCityActivities, getCity, CITIES } from '@/lib/data';
import { useRouter } from 'next/navigation';
import { FiSearch, FiMapPin, FiStar, FiDollarSign, FiClock, FiFilter, FiX, FiGlobe, FiCompass } from 'react-icons/fi';
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
  const router = useRouter();

  useEffect(() => {
    const u = getCurrentUser();
    if (!u) { router.push('/auth/login'); return; }
    setUser(u);
  }, [router]);

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

  if (!user) return null;

  return (
    <>
      <Navbar />
      <main className={styles.page}>
        <div className="container">
          <div className={styles.header}>
            <span className="section-label">Discover</span>
            <h1>Explore Destinations & Activities</h1>
            <p>Browse 25+ cities and 200+ activities to build your perfect trip.</p>
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
                <FiGlobe /> Cities
              </button>
              <button className={`${styles.viewBtn} ${activeView === 'activities' ? styles.activeView : ''}`} onClick={() => setActiveView('activities')}>
                <FiCompass /> Activities
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
                  <option value="1">$ Budget</option>
                  <option value="2">$$ Affordable</option>
                  <option value="3">$$$ Moderate</option>
                  <option value="4">$$$$ Premium</option>
                  <option value="5">$$$$$ Luxury</option>
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
              {activeView === 'cities' ? cities.length : activities.length} results
            </span>
          </div>

          {/* ── Cities Grid ── */}
          {activeView === 'cities' && (
            <div className={styles.cityGrid}>
              {cities.map((city, i) => (
                <div key={city.id} className={styles.cityCard} style={{ animationDelay: `${i * 0.05}s` }}
                  onClick={() => { setSelectedCity(city); setActiveView('activities'); }}>
                  <div className={styles.cityImageWrap}>
                    <img src={city.image_url} alt={city.name} />
                    <div className={styles.cityBadge}><FiMapPin /> {city.country}</div>
                    <div className={styles.cityOverlay}>
                      <h3>{city.name}</h3>
                      <p>{city.description.substring(0, 90)}...</p>
                      <div className={styles.cityMeta}>
                        <span className={styles.cityRating}><FiStar /> {(city.popularity_score / 20).toFixed(1)}</span>
                        <span className={styles.cityCost}>
                          {'$'.repeat(city.cost_index)}<span style={{ opacity: 0.3 }}>{'$'.repeat(5 - city.cost_index)}</span>
                        </span>
                      </div>
                    </div>
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
                  <img src={selectedCity.image_url} alt={selectedCity.name} />
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
                        <img src={act.image_url} alt={act.name} />
                        <span className={`badge badge-white ${styles.actCategoryBadge}`}>{act.category}</span>
                      </div>
                      <div className={styles.actBody}>
                        <h4>{act.name}</h4>
                        <p className={styles.actCity}><FiMapPin /> {city?.name}, {city?.country}</p>
                        <p className={styles.actDesc}>{act.description.substring(0, 80)}...</p>
                        <div className={styles.actMeta}>
                          <span><FiClock /> {act.duration}</span>
                          <span><FiDollarSign /> {act.estimated_cost === 0 ? 'Free' : `$${act.estimated_cost}`}</span>
                          <span className={styles.actRating}><FiStar /> {act.rating}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {((activeView === 'cities' && cities.length === 0) || (activeView === 'activities' && activities.length === 0)) && (
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
              <h3>No results found</h3>
              <p>Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export default function ExplorePage() {
  return <ToastProvider><ExploreContent /></ToastProvider>;
}
