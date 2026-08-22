'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ToastProvider } from '@/components/Toast';
import {
  getCurrentUser,
  getUserTrips,
  CITIES,
  getCity,
  calculateTripBudget,
  getCostTierLabel
} from '@/lib/data';
import {
  FiPlus,
  FiMapPin,
  FiCalendar,
  FiTrendingUp,
  FiDollarSign,
  FiArrowRight,
  FiCompass,
  FiStar,
  FiMap,
  FiGlobe,
  FiCheckCircle
} from 'react-icons/fi';
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
  const completedTrips = trips.filter(t => t.status === 'completed');
  const totalBudget = trips.reduce((sum, t) => sum + (t.total_budget || 0), 0);
  const totalCities = trips.reduce((sum, t) => sum + (t.stops?.length || 0), 0);
  const recommendedCities = CITIES.sort((a, b) => b.popularity_score - a.popularity_score).slice(4, 10);

  const formatDate = (d) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <ToastProvider>
      <Navbar />
      <main className={styles.dashboard}>
        <div className="container">
          {/* Welcome Section */}
          <section className={styles.welcome}>
            <div className={styles.welcomeText}>
              <span className="section-label">Welcome Back</span>
              <h1>Hello, {user.name?.split(' ')[0]} 👋</h1>
              <p>Ready to plan your next adventure? Here's your travel overview.</p>
            </div>
            <Link href="/trips/create" className="btn btn-primary btn-lg">
              <FiPlus /> Plan New Trip
            </Link>
          </section>

          {/* Stats Cards */}
          <section className={styles.statsRow}>
            {[
              { icon: <FiMap />, label: 'Total Trips', value: trips.length, color: '#1B4332' },
              { icon: <FiMapPin />, label: 'Cities Explored', value: totalCities, color: '#2D6A4F' },
              { icon: <span style={{ fontSize: '1.2rem', fontWeight: 700 }}>₹</span>, label: 'Total Budget', value: `₹${totalBudget.toLocaleString('en-IN')}`, color: '#C4A35A' },
              { icon: <FiTrendingUp />, label: 'Upcoming', value: upcomingTrips.length, color: '#2980B9' },
            ].map((stat, i) => (
              <div key={i} className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: `${stat.color}15`, color: stat.color }}>
                  {stat.icon}
                </div>
                <div>
                  <span className={styles.statValue}>{stat.value}</span>
                  <span className={styles.statLabel}>{stat.label}</span>
                </div>
              </div>
            ))}
          </section>

          {/* Upcoming Trips */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <div>
                <span className="section-label">Your Adventures</span>
                <h2>Upcoming Trips</h2>
              </div>
              <Link href="/trips" className={styles.seeAll}>
                View All <FiArrowRight />
              </Link>
            </div>

            {upcomingTrips.length > 0 ? (
              <div className={styles.tripGrid}>
                {upcomingTrips.map((trip, i) => {
                  const budget = calculateTripBudget(trip);
                  const cities = trip.stops?.map(s => getCity(s.city_id)?.name).filter(Boolean).join(' → ');
                  return (
                    <Link href={`/trips/${trip.id}`} key={trip.id} className={styles.tripCard} style={{ animationDelay: `${i * 0.1}s` }}>
                      <div className={styles.tripImageWrap}>
                        <img 
                          src={trip.cover_image || '/images/destinations/paris.jpg'} 
                          alt={trip.name} 
                          className={styles.tripImage} 
                          onError={(e) => { e.target.src = '/images/destinations/paris.jpg'; }}
                        />
                        <div className={styles.tripBadge}>
                          {trip.stops?.length || 0} {trip.stops?.length === 1 ? 'city' : 'cities'}
                        </div>
                      </div>
                      <div className={styles.tripInfo}>
                        <h3>{trip.name}</h3>
                        {cities && <p className={styles.tripRoute}><FiMapPin /> {cities}</p>}
                        <div className={styles.tripMeta}>
                          <span><FiCalendar /> {formatDate(trip.start_date)} – {formatDate(trip.end_date)}</span>
                          <span>₹ {trip.total_budget?.toLocaleString('en-IN')}</span>
                        </div>
                        <div className={styles.tripProgress}>
                          <div className={styles.progressLabel}>
                            <span>Budget Used</span>
                            <span>{Math.round((budget.totalSpent / Math.max(budget.totalBudget, 1)) * 100)}%</span>
                          </div>
                          <div className="progress-bar">
                            <div
                              className={`progress-bar-fill ${budget.isOverBudget ? 'over-budget' : ''}`}
                              style={{ width: `${Math.min((budget.totalSpent / Math.max(budget.totalBudget, 1)) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}

                {/* Quick Add Card */}
                <Link href="/trips/create" className={styles.addTripCard}>
                  <div className={styles.addIcon}>
                    <FiPlus />
                  </div>
                  <h3>Plan a New Trip</h3>
                  <p>Start designing your next adventure</p>
                </Link>
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">🌍</div>
                <h3>No Trips Yet</h3>
                <p>Start planning your first adventure — it only takes a minute!</p>
                <Link href="/trips/create" className="btn btn-primary">
                  <FiPlus /> Create Your First Trip
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
              { icon: <FiMap />, title: 'My Trips', desc: 'View and manage all your trips', href: '/trips' },
              { icon: <FiGlobe />, title: 'Community Feed', desc: 'Browse and clone shared travel plans', href: '/community' },
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
      <Footer />
    </ToastProvider>
  );
}
