'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ToastProvider, useToast } from '@/components/Toast';
import { getCurrentUser, updateUser, logoutUser, getUserTrips, CITIES, getCity, getSavedCityIds } from '@/lib/data';
import { FiUser, FiMail, FiMapPin, FiGlobe, FiSave, FiLogOut, FiTrash2, FiCamera, FiMap, FiCalendar, FiStar, FiHeart, FiUpload, FiX, FiCheck, FiCompass } from 'react-icons/fi';
import styles from './page.module.css';

const PRESET_AVATARS = [
  { label: 'Explorer', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200' },
  { label: 'Nomad', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200' },
  { label: 'Adventurer', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200' },
  { label: 'Backpacker', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200' },
  { label: 'Pilot', url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200' },
];

function ProfileContent() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', city: '', country: '' });
  const [editing, setEditing] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [savedCityIds, setSavedCityIds] = useState([]);
  const fileInputRef = useRef(null);
  const router = useRouter();
  const addToast = useToast();

  const syncData = () => {
    const u = getCurrentUser();
    if (!u) { router.push('/auth/login'); return; }
    setUser(u);
    setForm({ name: u.name || '', email: u.email || '', city: u.city || '', country: u.country || '' });
    setSavedCityIds(u.saved_city_ids || []);
  };

  useEffect(() => {
    syncData();
    window.addEventListener('storage', syncData);
    return () => window.removeEventListener('storage', syncData);
  }, [router]);

  if (!user) return null;

  const trips = getUserTrips(user.id);
  const totalCities = [...new Set(trips.flatMap(t => (t.stops || []).map(s => s.city_id)))];
  const totalCountries = [...new Set(totalCities.map(id => getCity(id)?.country).filter(Boolean))];
  const savedCities = savedCityIds.map(id => getCity(id)).filter(Boolean);

  const handleSave = () => {
    const result = updateUser(form);
    if (result.user) {
      setUser(result.user);
      setEditing(false);
      addToast('Profile updated successfully!', 'success');
      window.dispatchEvent(new Event('storage'));
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      addToast('Please choose an image under 2MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Url = event.target.result;
      const result = updateUser({ avatar_url: base64Url });
      if (result.user) {
        setUser(result.user);
        setShowAvatarPicker(false);
        addToast('Profile photo updated successfully!', 'success');
        window.dispatchEvent(new Event('storage'));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPresetAvatar = (url) => {
    const result = updateUser({ avatar_url: url });
    if (result.user) {
      setUser(result.user);
      setShowAvatarPicker(false);
      addToast('Avatar updated!', 'success');
      window.dispatchEvent(new Event('storage'));
    }
  };

  const handleRemoveAvatar = () => {
    const result = updateUser({ avatar_url: null });
    if (result.user) {
      setUser(result.user);
      setShowAvatarPicker(false);
      addToast('Avatar removed', 'info');
      window.dispatchEvent(new Event('storage'));
    }
  };

  const handleDeleteAccount = () => {
    logoutUser();
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
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
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.name}
                    className={styles.avatarLargeImg}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <div className={styles.avatarLarge}>
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <button
                  className={styles.avatarEdit}
                  onClick={() => setShowAvatarPicker(true)}
                  title="Change Profile Photo"
                  id="change-avatar-btn"
                >
                  <FiCamera />
                </button>
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

            {/* Settings & Saved Destinations */}
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
                    <input type="email" className="form-input" value={form.email} disabled />
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
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <h3 style={{ margin: 0 }}><FiHeart style={{ color: '#E63946' }} /> Saved Destinations ({savedCities.length})</h3>
                  <Link href="/explore" className="btn btn-secondary btn-sm" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
                    <FiCompass /> Explore More
                  </Link>
                </div>

                {savedCities.length > 0 ? (
                  <div className={styles.savedGrid}>
                    {savedCities.map(city => (
                      <Link href="/explore" key={city.id} className={styles.savedCity}>
                        <img 
                          src={city.image_url} 
                          alt={city.name} 
                          onError={(e) => { e.target.src = '/images/destinations/paris.jpg'; }}
                        />
                        <div>
                          <strong>{city.name}</strong>
                          <span>{city.country}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '36px 20px', background: 'var(--color-cream-light, #FAF7F2)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--color-cream-dark)' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🤍</div>
                    <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 600, color: 'var(--color-charcoal)', marginBottom: '6px' }}>
                      No Saved Destinations Yet
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-slate)', maxWidth: '400px', margin: '0 auto 16px' }}>
                      Discover destinations on the Explore page and click the heart icon on any city card to save your dream spots here.
                    </p>
                    <Link href="/explore" className="btn btn-primary btn-sm">
                      <FiCompass /> Discover Destinations
                    </Link>
                  </div>
                )}
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

      {/* ── Avatar Upload & Picker Modal ── */}
      {showAvatarPicker && (
        <div className="modal-overlay" onClick={() => setShowAvatarPicker(false)}>
          <div className="modal-content animate-scale-in" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <h3>Change Profile Photo</h3>
              <button className="modal-close" onClick={() => setShowAvatarPicker(false)}>×</button>
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--color-slate)', marginBottom: '16px' }}>
              Upload a new picture from your device or select from curated explorer avatars.
            </p>

            {/* File Upload Button */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileUpload}
            />
            <button
              className="btn btn-primary"
              style={{ width: '100%', marginBottom: '20px', gap: '8px' }}
              onClick={() => fileInputRef.current?.click()}
            >
              <FiUpload /> Upload from Computer
            </button>

            <h4 style={{ fontSize: '0.88rem', color: 'var(--color-charcoal)', marginBottom: '12px' }}>
              Or choose a preset avatar:
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', marginBottom: '20px' }}>
              {PRESET_AVATARS.map((av, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectPresetAvatar(av.url)}
                  style={{
                    cursor: 'pointer',
                    borderRadius: '50%',
                    border: user.avatar_url === av.url ? '3px solid var(--color-forest)' : '2px solid transparent',
                    padding: '2px',
                    textAlign: 'center',
                    transition: 'transform 0.2s ease',
                  }}
                  title={av.label}
                >
                  <img
                    src={av.url}
                    alt={av.label}
                    style={{ width: '100%', height: '56px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--color-cream-dark)', paddingTop: '16px' }}>
              {user.avatar_url ? (
                <button className="btn btn-danger btn-sm" onClick={handleRemoveAvatar}>
                  Remove Photo
                </button>
              ) : <div />}
              <button className="btn btn-secondary btn-sm" onClick={() => setShowAvatarPicker(false)}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDelete && (
        <div className="modal-overlay" onClick={() => setShowDelete(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Delete Account</h3>
              <button className="modal-close" onClick={() => setShowDelete(false)}>×</button>
            </div>
            <p style={{ margin: '16px 0' }}>Are you sure you want to delete your account? This action is permanent and will remove all your trips.</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setShowDelete(false)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDeleteAccount}>Yes, Delete Everything</button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default function ProfilePage() {
  return (
    <ToastProvider>
      <ProfileContent />
    </ToastProvider>
  );
}
