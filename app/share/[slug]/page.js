'use client';
import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { getTripBySlug, getTrip, getCity, getActivity, calculateTripBudget, copyTrip, getCurrentUser } from '@/lib/data';
import { ToastProvider, useToast } from '@/components/Toast';
import { FiMapPin, FiCalendar, FiDollarSign, FiClock, FiCopy, FiShare2, FiGlobe, FiStar, FiArrowRight } from 'react-icons/fi';
import styles from './page.module.css';

function ShareContent({ params }) {
  const resolvedParams = use(params);
  const [trip, setTrip] = useState(null);
  const addToast = useToast();

  useEffect(() => {
    const t = getTripBySlug(resolvedParams.slug);
    if (t) setTrip(t);
  }, [resolvedParams.slug]);

  const handleCopy = () => {
    const user = getCurrentUser();
    if (!user) {
      addToast('Please sign in to copy this trip', 'info');
      return;
    }
    const result = copyTrip(trip.id);
    if (result.trip) {
      addToast('Trip copied to your account!', 'success');
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard?.writeText(url);
    addToast('Link copied to clipboard!', 'success');
  };

  if (!trip) {
    return (
      <div className={styles.notFound}>
        <div className={styles.notFoundContent}>
          <h1>🌍</h1>
          <h2>Trip Not Found</h2>
          <p>This trip might be private or doesn't exist.</p>
          <Link href="/" className="btn btn-primary">Go Home</Link>
        </div>
      </div>
    );
  }

  const budget = calculateTripBudget(trip);
  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '';

  return (
    <div className={styles.page}>
      {/* Header */}
      <nav className={styles.shareNav}>
        <Link href="/" className={styles.logo}>
          <FiGlobe /> GlobeTrotter
        </Link>
        <div className={styles.navActions}>
          <button className="btn btn-secondary btn-sm" onClick={handleShare}><FiShare2 /> Share</button>
          <button className="btn btn-primary btn-sm" onClick={handleCopy}><FiCopy /> Copy Trip</button>
        </div>
      </nav>

      {/* Cover */}
      <div className={styles.cover}>
        <img src={trip.cover_image} alt={trip.name} />
        <div className={styles.coverOverlay} />
        <div className={styles.coverContent}>
          <span className={styles.publicBadge}>Public Itinerary</span>
          <h1>{trip.name}</h1>
          <p className={styles.coverMeta}>
            <span><FiCalendar /> {formatDate(trip.start_date)} – {formatDate(trip.end_date)}</span>
            <span><FiMapPin /> {trip.stops?.length || 0} destinations</span>
            <span><FiDollarSign /> ${trip.total_budget?.toLocaleString()} budget</span>
          </p>
          {trip.description && <p className={styles.coverDesc}>{trip.description}</p>}
        </div>
      </div>

      {/* Itinerary */}
      <div className={`container ${styles.content}`}>
        <h2 className={styles.sectionTitle}>📍 Itinerary</h2>
        <div className={styles.stops}>
          {(trip.stops || []).sort((a, b) => a.order_index - b.order_index).map((stop, i) => {
            const city = getCity(stop.city_id);
            const acts = (trip.activities || []).filter(a => a.stop_id === stop.id).map(ta => ({ ...ta, activity: getActivity(ta.activity_id) }));

            return (
              <div key={stop.id} className={styles.stopCard}>
                <div className={styles.stopNumber}>{i + 1}</div>
                <div className={styles.stopBody}>
                  <div className={styles.stopHeader}>
                    <img src={city?.image_url} alt={city?.name} className={styles.stopImage} />
                    <div>
                      <h3>{city?.name}</h3>
                      <p>{city?.country} · {formatDate(stop.arrival_date)} – {formatDate(stop.departure_date)}</p>
                    </div>
                  </div>
                  {acts.length > 0 && (
                    <div className={styles.actList}>
                      {acts.map(ta => (
                        <div key={ta.id} className={styles.actItem}>
                          <img src={ta.activity?.image_url} alt={ta.activity?.name} />
                          <div>
                            <strong>{ta.activity?.name}</strong>
                            <span><FiClock /> {ta.activity?.duration} · <FiDollarSign />${ta.actual_cost} · <FiStar /> {ta.activity?.rating}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Budget Summary */}
        <h2 className={styles.sectionTitle}>💰 Budget Overview</h2>
        <div className={styles.budgetSummary}>
          <div className={styles.budgetItem}>
            <span>Total Budget</span>
            <strong>${budget.totalBudget.toLocaleString()}</strong>
          </div>
          <div className={styles.budgetItem}>
            <span>Estimated Spending</span>
            <strong>${budget.totalSpent.toLocaleString()}</strong>
          </div>
          <div className={styles.budgetItem}>
            <span>Avg. per Day</span>
            <strong>${budget.avgPerDay.toFixed(0)}/day</strong>
          </div>
          <div className={styles.budgetItem}>
            <span>Duration</span>
            <strong>{budget.days} days</strong>
          </div>
        </div>

        {/* CTA */}
        <div className={styles.ctaSection}>
          <h3>Inspired by this trip?</h3>
          <p>Copy it to your account and customize it for your own adventure.</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary btn-lg" onClick={handleCopy}><FiCopy /> Copy This Trip</button>
            <Link href="/auth/signup" className="btn btn-outline btn-lg">Create Your Own <FiArrowRight /></Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>Shared via <strong>GlobeTrotter</strong> — Empowering Personalized Travel Planning</p>
      </footer>
    </div>
  );
}

export default function SharePage({ params }) {
  return <ToastProvider><ShareContent params={params} /></ToastProvider>;
}
