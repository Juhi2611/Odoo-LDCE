'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { ToastProvider } from '@/components/Toast';
import { getCurrentUser, getUserTrips, CITIES, calculateTripBudget, getCity, getCostTierLabel } from '@/lib/data';
import { FiPlus, FiMapPin, FiCalendar, FiDollarSign, FiArrowRight, FiMap, FiStar, FiTrendingUp, FiCompass, FiGlobe } from 'react-icons/fi';
import styles from './page.module.css';

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [trips, setTrips] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const u = getCurrentUser();
    if (!u) { router.push('/auth/login'); return; }
    setUser(u);
    setTrips(getUserTrips(u.id));
  }, [router]);

  if (!user) return null;

  const upcomingTrips = trips.filter(t => t.status === 'upcoming');
  const pastTrips = trips.filter(t => t.status === 'completed');
  const recommendedCities = CITIES.slice(0, 4);

  // Quick stats
  const totalDestinations = trips.reduce((acc, t) => acc + (t.stops?.length || 0), 0);
  const totalBudgetSpent = trips.reduce((acc, t) => {
    const b = calculateTripBudget(t);
    return acc + b.totalSpent;
  }, 0);

  return (
    <>
      <Navbar />
      <main className={styles.page}>
        <div className="container">
          {/* Welcome Header */}
          <div className={styles.welcomeHeader}>
            <div>
              <span className="section-label">Travel Dashboard</span>
              <h1>Welcome back, {user.name} 👋</h1>
              <p>Ready to plan your next adventure? Here's an overview of your journeys.</p>
            </div>
            <Link href="/trips/create" className="btn btn-primary">
              <FiPlus /> Create New Trip
            </Link>
          </div>

          {/* Stats Bar */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ background: 'rgba(27,67,50,0.1)', color: 'var(--color-forest)' }}>
                <FiMap />
              </div>
              <div>
                <span className={styles.statNumber}>{trips.length}</span>
                <span className={styles.statLabel}>Total Trips</span>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ background: 'rgba(196,163,90,0.15)', color: 'var(--color-gold-dark)' }}>
                <FiMapPin />
              </div>
              <div>
                <span className={styles.statNumber}>{totalDestinations}</span>
                <span className={styles.statLabel}>Cities Visited</span>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ background: 'rgba(41,128,185,0.1)', color: '#2980b9' }}>
                <FiCalendar />
              </div>
              <div>
                <span className={styles.statNumber}>{upcomingTrips.length}</span>
                <span className={styles.statLabel}>Upcoming Trips</span>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ background: 'rgba(46,204,113,0.1)', color: '#27ae60' }}>
                <FiDollarSign />
              </div>
              <div>
                <span className={styles.statNumber}>₹{totalBudgetSpent.toLocaleString('en-IN')}</span>
                <span className={styles.statLabel}>Total Budget Spent</span>
              </div>
            </div>
          </div>

          {/* Active / Upcoming Trips */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <div>
                <span className="section-label">Your Itineraries</span>
                <h2>Upcoming Journeys</h2>
              </div>
              <Link href="/trips" className={styles.seeAll}>
                View All ({trips.length}) <FiArrowRight />
              </Link>
            </div>

            {upcomingTrips.length > 0 ? (
              <div className={styles.tripGrid}>
                {upcomingTrips.map(trip => {
                  const budget = calculateTripBudget(trip);
                  const firstCity = trip.stops?.length > 0 ? getCity(trip.stops[0].city_id) : null;
                  return (
                    <Link href={`/trips/${trip.id}`} key={trip.id} className={styles.tripCard}>
                      <div className={styles.tripCover}>
                        <img 
                          src={trip.cover_image || firstCity?.image_url || '/images/destinations/paris.jpg'} 
                          alt={trip.name} 
                          onError={(e) => { e.target.src = '/images/destinations/paris.jpg'; }}
                        />
                        <span className={`badge ${trip.status === 'upcoming' ? 'badge-forest' : 'badge-gold'} ${styles.tripBadge}`}>
                          {trip.status}
                        </span>
                      </div>
                      <div className={styles.tripBody}>
                        <h3>{trip.name}</h3>
                        <p className={styles.tripMeta}>
                          <FiCalendar /> {trip.start_date ? new Date(trip.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No date'} — {trip.end_date ? new Date(trip.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No date'}
                        </p>
                        <p className={styles.tripStops}>
                          <FiMapPin /> {trip.stops?.length || 0} destinations · {(trip.activities || []).length} activities
                        </p>
                        <div className={styles.tripBudget}>
                          <div className={styles.budgetBarMini}>
                            <div className="progress-bar-fill" style={{ width: `${Math.min((budget.totalSpent / Math.max(budget.totalBudget, 1)) * 100, 100)}%` }} />
                          </div>
                          <span>₹{budget.totalSpent.toLocaleString('en-IN')} of ₹{budget.totalBudget.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">✈️</div>
                <h3>No upcoming trips yet</h3>
                <p>Start planning your next adventure by creating a new trip itinerary.</p>
                <Link href="/trips/create" className="btn btn-primary" style={{ marginTop: '16px' }}>
                  <FiPlus /> Plan a Trip
                </Link>
              </div>
            )}
          </section>

          {/* Recommended Destinations */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <div>
                <span className="section-label">Inspiration</span>
                <h2>Recommended For You</h2>
              </div>
              <Link href="/explore" className={styles.seeAll}>
                Explore All <FiArrowRight />
              </Link>
            </div>

            <div className={styles.recGrid}>
              {recommendedCities.map((city, i) => (
                <Link href="/explore" key={city.id} className={styles.recCard} style={{ animationDelay: `${i * 0.08}s` }}>
                  <img 
                    src={city.image_url} 
                    alt={city.name} 
                    onError={(e) => { e.target.src = '/images/destinations/paris.jpg'; }}
                  />
                  <div className={styles.recOverlay}>
                    <span className={styles.recCountry}>{city.country}</span>
                    <h4>{city.name}</h4>
                    <div className={styles.recMeta}>
                      <span><FiStar /> {(city.popularity_score / 20).toFixed(1)}</span>
                      <span className={styles.recCost}>
                        {getCostTierLabel(city.cost_index)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Quick Actions */}
          <section className={styles.quickActions}>
            {[
              { icon: <FiCompass />, title: 'Explore Cities', desc: 'Discover 25+ destinations worldwide', href: '/explore' },
              { icon: <FiMap />, title: 'My Itineraries', desc: 'View and manage your travel plans', href: '/trips' },
              { icon: <FiGlobe />, title: 'Community Feed', desc: 'Browse and clone shared travel plans', href: '/community' },
              { icon: <FiTrendingUp />, title: 'Live Analytics', desc: 'System statistics and city trends', href: '/admin' },
            ].map((action, i) => (
              <Link key={i} href={action.href} className={styles.quickCard}>
                <div className={styles.quickIcon}>{action.icon}</div>
                <h4>{action.title}</h4>
                <p>{action.desc}</p>
                <FiArrowRight className={styles.quickArrow} />
              </Link>
            ))}
          </section>
        </div>
      </main>
    </>
  );
}
