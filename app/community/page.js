'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { ToastProvider, useToast } from '@/components/Toast';
import { getCurrentUser, getTrips, getCity, copyTrip } from '@/lib/data';
import { useRouter } from 'next/navigation';
import { FiUsers, FiCopy, FiHeart, FiShare2, FiMapPin, FiCalendar, FiDollarSign, FiSearch, FiArrowRight, FiEye, FiTrendingUp } from 'react-icons/fi';
import styles from './page.module.css';

function CommunityContent() {
  const [user, setUser] = useState(null);
  const [trips, setTrips] = useState([]);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [likedTrips, setLikedTrips] = useState(new Set());
  const router = useRouter();
  const addToast = useToast();

  useEffect(() => {
    setUser(getCurrentUser());
    setTrips(getTrips());
  }, []);

  const toggleLike = (id) => {
    setLikedTrips(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        addToast('Removed from favorites', 'info');
      } else {
        next.add(id);
        addToast('Added to your favorite community itineraries!', 'success');
      }
      return next;
    });
  };

  const handleCopyTrip = (tripId) => {
    if (!user) {
      addToast('Please log in to copy this itinerary', 'info');
      router.push('/auth/login');
      return;
    }
    const result = copyTrip(tripId);
    if (result.trip) {
      addToast('Trip copied to your personal planner!', 'success');
      router.push(`/trips/${result.trip.id}`);
    }
  };

  const handleShare = (slug) => {
    const url = `${window.location.origin}/share/${slug}`;
    navigator.clipboard?.writeText(url);
    addToast('Public itinerary link copied to clipboard!', 'success');
  };

  const filteredTrips = trips.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (activeFilter === 'featured') return t.is_public;
    return true;
  });

  return (
    <>
      <Navbar />
      <main className={styles.page}>
        <div className="container">
          <div className={styles.heroSection}>
            <span className="section-label"><FiUsers /> Global Traveler Community</span>
            <h1>Explore Curated Community Itineraries</h1>
            <p>Discover hand-crafted multi-city routes from passionate explorers around the globe. Clone any plan, customize it, and make it your own.</p>
          </div>

          {/* Controls Bar */}
          <div className={styles.controlsBar}>
            <div className={styles.searchBox}>
              <FiSearch className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search community itineraries (e.g. Europe, Asia, Backpacking)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className={styles.filterTabs}>
              <button
                className={`${styles.filterBtn} ${activeFilter === 'all' ? styles.activeFilter : ''}`}
                onClick={() => setActiveFilter('all')}
              >
                All Stories ({trips.length})
              </button>
              <button
                className={`${styles.filterBtn} ${activeFilter === 'featured' ? styles.activeFilter : ''}`}
                onClick={() => setActiveFilter('featured')}
              >
                <FiTrendingUp /> Featured
              </button>
            </div>
          </div>

          {/* Itineraries Grid */}
          <div className={styles.grid}>
            {filteredTrips.map((trip) => {
              const cities = trip.stops?.map(s => getCity(s.city_id)?.name).filter(Boolean);
              const isLiked = likedTrips.has(trip.id);

              return (
                <div key={trip.id} className={styles.card}>
                  <div className={styles.imageWrap}>
                    <img src={trip.cover_image} alt={trip.name} />
                    <div className={styles.cardBadges}>
                      <span className="badge badge-forest">{trip.stops?.length || 0} Cities</span>
                      <button
                        className={`${styles.likeBtn} ${isLiked ? styles.liked : ''}`}
                        onClick={() => toggleLike(trip.id)}
                        title="Save to favorites"
                      >
                        <FiHeart />
                      </button>
                    </div>
                  </div>

                  <div className={styles.cardContent}>
                    <div className={styles.authorRow}>
                      <div className={styles.authorAvatar}>
                        {trip.name.charAt(0)}
                      </div>
                      <div>
                        <span className={styles.authorName}>GlobeTrotter Explorer</span>
                        <span className={styles.publishedDate}>Verified Route</span>
                      </div>
                    </div>

                    <h3 className={styles.tripTitle}>{trip.name}</h3>
                    <p className={styles.tripDesc}>{trip.description}</p>

                    {cities && cities.length > 0 && (
                      <div className={styles.citiesTags}>
                        <FiMapPin className={styles.pinIcon} />
                        {cities.slice(0, 3).map((city, idx) => (
                          <span key={idx} className={styles.cityTag}>{city}</span>
                        ))}
                        {cities.length > 3 && <span className={styles.moreTag}>+{cities.length - 3} more</span>}
                      </div>
                    )}

                    <div className={styles.metaRow}>
                      <span><FiCalendar /> {trip.start_date && trip.end_date ? `${new Date(trip.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(trip.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : 'Flexible'}</span>
                      <span><FiDollarSign /> ₹{trip.total_budget?.toLocaleString('en-IN')} Est.</span>
                    </div>

                    <div className={styles.cardActions}>
                      <Link href={`/share/${trip.share_slug}`} className="btn btn-secondary btn-sm">
                        <FiEye /> View Plan
                      </Link>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleCopyTrip(trip.id)}
                      >
                        <FiCopy /> Clone Trip
                      </button>
                      <button
                        className={styles.shareIconBtn}
                        onClick={() => handleShare(trip.share_slug)}
                        title="Copy Public Link"
                      >
                        <FiShare2 />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </main>
    </>
  );
}

export default function CommunityPage() {
  return (
    <ToastProvider>
      <CommunityContent />
    </ToastProvider>
  );
}
