'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { ToastProvider, useToast } from '@/components/Toast';
import { getCurrentUser, updateUser, logoutUser, getUserTrips, CITIES, getCity } from '@/lib/data';
import { FiUser, FiMail, FiMapPin, FiGlobe, FiSave, FiLogOut, FiTrash2, FiCamera, FiMap, FiCalendar, FiStar, FiHeart } from 'react-icons/fi';
import styles from './page.module.css';

function ProfileContent() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', city: '', country: '' });
  const [editing, setEditing] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const router = useRouter();
  const addToast = useToast();

  useEffect(() => {
    const u = getCurrentUser();
    if (!u) { router.push('/auth/login'); return; }
    setUser(u);
    setForm({ name: u.name || '', email: u.email || '', city: u.city || '', country: u.country || '' });
  }, [router]);

  if (!user) return null;

  const trips = getUserTrips(user.id);
  const totalCities = [...new Set(trips.flatMap(t => (t.stops || []).map(s => s.city_id)))];
  const totalCountries = [...new Set(totalCities.map(id => getCity(id)?.country).filter(Boolean))];
  const savedCities = CITIES.slice(0, 6);

  const handleSave = () => {
    const result = updateUser(form);
    if (result.user) {
      setUser(result.user);
      setEditing(false);
      addToast('Profile updated successfully!', 'success');
    }
  };

  const handleDeleteAccount = () => {
    logoutUser();
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
    addToast('Account deleted', 'info');
    router.push('/');
  };

  return (
    <>
      <Navbar />
      <main className={styles.page}>
        <div className="container">
          <div className={styles.layout}>
            {/* Profile Card */}
            <div className={styles.profileCard}>
              <div className={styles.avatarSection}>
                <div className={styles.avatarLarge}>
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <button className={styles.avatarEdit}><FiCamera /></button>
              </div>
              <h2>{user.name}</h2>
              <p className={styles.userEmail}>{user.email}</p>
              {user.city && <p className={styles.userLocation}><FiMapPin /> {user.city}{user.country ? `, ${user.country}` : ''}</p>}

              <div className={styles.profileStats}>
                <div><strong>{trips.length}</strong><span>Trips</span></div>
                <div><strong>{totalCities.length}</strong><span>Cities</span></div>
                <div><strong>{totalCountries.length}</strong><span>Countries</span></div>
              </div>

              <button className={`btn btn-outline ${styles.logoutBtn}`} onClick={() => { logoutUser(); router.push('/'); }}>
                <FiLogOut /> Log Out
              </button>
            </div>

            {/* Settings */}
            <div className={styles.settingsSection}>
              <div className={styles.settingsCard}>
                <div className={styles.cardHeader}>
                  <h3><FiUser /> Personal Information</h3>
                  {!editing && <button className="btn btn-secondary btn-sm" onClick={() => setEditing(true)}><FiSave /> Edit</button>}
                </div>
                <div className={styles.formGrid}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input type="text" className="form-input" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} disabled={!editing} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-input" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} disabled={!editing} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input type="text" className="form-input" value={form.city} onChange={(e) => setForm({...form, city: e.target.value})} disabled={!editing} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Country</label>
                    <input type="text" className="form-input" value={form.country} onChange={(e) => setForm({...form, country: e.target.value})} disabled={!editing} />
                  </div>
                </div>
                {editing && (
                  <div className={styles.editActions}>
                    <button className="btn btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
                    <button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
                  </div>
                )}
              </div>

              {/* Saved Destinations */}
              <div className={styles.settingsCard}>
                <h3><FiHeart /> Saved Destinations</h3>
                <div className={styles.savedGrid}>
                  {savedCities.map(city => (
                    <div key={city.id} className={styles.savedCity}>
                      <img src={city.image_url} alt={city.name} />
                      <div>
                        <strong>{city.name}</strong>
                        <span>{city.country}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Danger Zone */}
              <div className={`${styles.settingsCard} ${styles.dangerZone}`}>
                <h3><FiTrash2 /> Danger Zone</h3>
                <p>Permanently delete your account and all associated data.</p>
                <button className="btn btn-danger btn-sm" onClick={() => setShowDelete(true)}>Delete Account</button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {showDelete && (
        <div className="modal-overlay" onClick={() => setShowDelete(false)}>
          <div className="modal-content animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h3>Delete Account</h3><button className="modal-close" onClick={() => setShowDelete(false)}>×</button></div>
            <p style={{ marginBottom: 24, color: 'var(--color-slate)' }}>This will permanently delete your account and all your trips. This cannot be undone.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setShowDelete(false)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDeleteAccount}>Delete Forever</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function ProfilePage() {
  return <ToastProvider><ProfileContent /></ToastProvider>;
}
