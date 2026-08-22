'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ToastProvider, useToast } from '@/components/Toast';
import { getCurrentUser, getUserTrips, deleteTrip, getCity, calculateTripBudget } from '@/lib/data';
import { FiPlus, FiMapPin, FiCalendar, FiDollarSign, FiEdit3, FiTrash2, FiEye, FiSearch, FiFilter } from 'react-icons/fi';
import styles from './page.module.css';

function TripsContent() {
  const [user, setUser] = useState(null);
  const [trips, setTrips] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [deleteModal, setDeleteModal] = useState(null);
  const router = useRouter();
  const addToast = useToast();

  useEffect(() => {
    const u = getCurrentUser();
    if (!u) { router.push('/auth/login'); return; }
    setUser(u);
    setTrips(getUserTrips(u.id));
  }, [router]);

  const filtered = trips.filter(t => {
    if (filter !== 'all' && t.status !== filter) return false;
    if (search && !t.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleDelete = (tripId) => {
    deleteTrip(tripId);
    setTrips(getUserTrips(user.id));
    setDeleteModal(null);
    addToast('Trip deleted successfully', 'success');
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';

  if (!user) return null;

  return (
    <>
      <Navbar />
      <main className={styles.page}>
        <div className="container">
          <div className={styles.header}>
            <div>
              <span className="section-label">Your Adventures</span>
              <h1>My Trips</h1>
              <p>Manage and organize all your travel plans in one place.</p>
            </div>
            <Link href="/trips/create" className="btn btn-primary">
              <FiPlus /> Plan New Trip
            </Link>
          </div>

          {/* Filters */}
          <div className={styles.filters}>
            <div className={styles.tabs}>
              {[
                { key: 'all', label: 'All Trips' },
                { key: 'upcoming', label: 'Upcoming' },
                { key: 'ongoing', label: 'Ongoing' },
                { key: 'completed', label: 'Completed' },
              ].map(tab => (
                <button
                  key={tab.key}
                  className={`${styles.tab} ${filter === tab.key ? styles.active : ''}`}
                  onClick={() => setFilter(tab.key)}
                >
                  {tab.label}
                  {tab.key === 'all' && <span className={styles.count}>{trips.length}</span>}
                </button>
              ))}
            </div>
            <div className={styles.searchBar}>
              <FiSearch />
              <input
                type="text"
                placeholder="Search trips..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Trip List */}
          {filtered.length > 0 ? (
            <div className={styles.tripList}>
              {filtered.map((trip, i) => {
                const budget = calculateTripBudget(trip);
                const cities = trip.stops?.map(s => getCity(s.city_id)?.name).filter(Boolean);
                return (
                  <div key={trip.id} className={styles.tripItem} style={{ animationDelay: `${i * 0.05}s` }}>
                    <Link href={`/trips/${trip.id}`} className={styles.tripLink}>
                      <div className={styles.tripImgWrap}>
                        <img src={trip.cover_image} alt={trip.name} />
                      </div>
                      <div className={styles.tripDetails}>
                        <div className={styles.tripTop}>
                          <h3>{trip.name}</h3>
                          <span className={`badge ${trip.status === 'upcoming' ? 'badge-forest' : trip.status === 'completed' ? 'badge-gold' : 'badge-forest'}`}>
                            {trip.status}
                          </span>
                        </div>
                        {trip.description && <p className={styles.tripDesc}>{trip.description.substring(0, 100)}...</p>}
                        <div className={styles.tripMetaRow}>
                          <span><FiCalendar /> {formatDate(trip.start_date)} – {formatDate(trip.end_date)}</span>
                          <span><FiMapPin /> {cities?.length || 0} cities</span>
                          <span><FiDollarSign /> ₹{trip.total_budget?.toLocaleString('en-IN')}</span>
                        </div>
                        {cities && cities.length > 0 && (
                          <div className={styles.citiesRow}>
                            {cities.map((c, j) => (
                              <span key={j} className="chip">{c}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </Link>
                    <div className={styles.tripActions}>
                      <Link href={`/trips/${trip.id}`} className={styles.actionBtn} title="View">
                        <FiEye />
                      </Link>
                      <Link href={`/trips/${trip.id}`} className={styles.actionBtn} title="Edit">
                        <FiEdit3 />
                      </Link>
                      <button className={`${styles.actionBtn} ${styles.deleteBtn}`} title="Delete" onClick={(e) => { e.preventDefault(); setDeleteModal(trip.id); }}>
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">✈️</div>
              <h3>{search ? 'No trips found' : 'No trips yet'}</h3>
              <p>{search ? 'Try a different search term' : 'Create your first trip and start planning!'}</p>
              {!search && (
                <Link href="/trips/create" className="btn btn-primary">
                  <FiPlus /> Create Trip
                </Link>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Delete Modal */}
      {deleteModal && (
        <div className="modal-overlay" onClick={() => setDeleteModal(null)}>
          <div className="modal-content animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Delete Trip</h3>
              <button className="modal-close" onClick={() => setDeleteModal(null)}>×</button>
            </div>
            <p style={{ marginBottom: '24px', color: 'var(--color-slate)' }}>
              Are you sure you want to delete this trip? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setDeleteModal(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteModal)}>Delete Trip</button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default function TripsPage() {
  return <ToastProvider><TripsContent /></ToastProvider>;
}
