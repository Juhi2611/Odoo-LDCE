'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getCurrentUser, logoutUser } from '@/lib/data';
import { 
  FiMenu, 
  FiX, 
  FiUser, 
  FiLogOut, 
  FiMapPin, 
  FiCompass, 
  FiPlusCircle, 
  FiBarChart2, 
  FiHome, 
  FiUsers, 
  FiGlobe,
  FiMap,
  FiFileText,
  FiShield,
  FiLock,
  FiCheckCircle
} from 'react-icons/fi';
import { MdFlight } from 'react-icons/md';
import styles from './Navbar.module.css';

export default function Navbar({ transparent = false }) {
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [legalModal, setLegalModal] = useState(null); // 'terms' | 'privacy' | 'security' | null
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const syncUser = () => setUser(getCurrentUser());
    syncUser();
    window.addEventListener('storage', syncUser);
    return () => window.removeEventListener('storage', syncUser);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    setProfileOpen(false);
    setDrawerOpen(false);
    router.push('/');
  };

  const navLinks = [
    { href: '/explore', label: 'Destinations' },
    { href: '/community', label: 'Community Feed' },
    { href: '/trips', label: 'My Itineraries' },
    { href: '/admin', label: 'Analytics' },
  ];

  const isTransparent = transparent && !scrolled;

  return (
    <nav className={`${styles.navbar} ${isTransparent ? styles.transparent : styles.solid} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        {/* Logo */}
        <Link href={user ? '/dashboard' : '/'} className={styles.logo}>
          <div className={styles.logoBadge}>
            <MdFlight className={styles.logoIcon} />
          </div>
          <div>
            <span className={styles.logoText}>GlobeTrotter</span>
            <span className={styles.logoTagline}>Personalized Travel Planning</span>
          </div>
        </Link>

        {/* Center Nav Links (Desktop) */}
        <div className={styles.navLinks}>
          {user && (
            <Link
              href="/dashboard"
              className={`${styles.navLink} ${pathname === '/dashboard' ? styles.active : ''}`}
            >
              Dashboard
            </Link>
          )}

          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`${styles.navLink} ${pathname === link.href ? styles.active : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Action Buttons */}
        <div className={styles.navActions}>
          {user ? (
            <>
              <Link href="/trips/create" className="btn btn-primary btn-sm" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
                <FiPlusCircle /> Plan Trip
              </Link>
              <div className={styles.profileWrapper}>
                <button
                  className={styles.profileBtn}
                  onClick={() => setProfileOpen(!profileOpen)}
                  title="Your Profile"
                >
                  <div className={styles.avatar}>
                    {user.avatar_url ? (
                      <img 
                        src={user.avatar_url} 
                        alt={user.name} 
                        style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} 
                      />
                    ) : (
                      user.name?.charAt(0).toUpperCase()
                    )}
                  </div>
                </button>
                {profileOpen && (
                  <div className={styles.profileDropdown}>
                    <div className={styles.dropdownHeader}>
                      <strong>{user.name}</strong>
                      <span>{user.email}</span>
                    </div>
                    <hr className={styles.dropdownDivider} />
                    <Link href="/dashboard" className={styles.dropdownItem} onClick={() => setProfileOpen(false)}>
                      <FiHome /> Dashboard
                    </Link>
                    <Link href="/trips" className={styles.dropdownItem} onClick={() => setProfileOpen(false)}>
                      <FiCompass /> My Trips
                    </Link>
                    <Link href="/profile" className={styles.dropdownItem} onClick={() => setProfileOpen(false)}>
                      <FiUser /> Profile & Settings
                    </Link>
                    <Link href="/admin" className={styles.dropdownItem} onClick={() => setProfileOpen(false)}>
                      <FiBarChart2 /> Analytics
                    </Link>
                    <hr className={styles.dropdownDivider} />
                    <button onClick={handleLogout} className={styles.dropdownItem}>
                      <FiLogOut /> Log Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link href="/auth/login" className="btn btn-secondary btn-sm" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
                Sign In
              </Link>
              <Link href="/auth/signup" className="btn btn-primary btn-sm" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
                Get Started
              </Link>
            </div>
          )}

          {/* Quick Menu Drawer Button */}
          <button 
            className={styles.menuCircleBtn} 
            onClick={() => setDrawerOpen(true)}
            title="Open Navigation Menu"
          >
            <FiMenu />
          </button>
        </div>
      </div>

      {/* ── Slide-Out Quick Navigation Drawer ── */}
      <div className={`${styles.quickDrawer} ${drawerOpen ? styles.drawerOpen : ''}`}>
        <div className={styles.drawerHeader}>
          <div className={styles.drawerLogo}>
            <div className={styles.logoBadge} style={{ width: '32px', height: '32px' }}>
              <MdFlight style={{ fontSize: '1rem' }} />
            </div>
            <strong>Navigation & Hub</strong>
          </div>
          <button className={styles.drawerCloseBtn} onClick={() => setDrawerOpen(false)}>
            <FiX />
          </button>
        </div>

        {user && (
          <div className={styles.drawerUserBox}>
            <div className={styles.avatar} style={{ width: '48px', height: '48px', fontSize: '1.2rem' }}>
              {user.avatar_url ? (
                <img 
                  src={user.avatar_url} 
                  alt={user.name} 
                  style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} 
                />
              ) : (
                user.name?.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <strong style={{ display: 'block', fontSize: '0.95rem' }}>{user.name}</strong>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-slate)' }}>{user.email}</span>
            </div>
          </div>
        )}

        <div className={styles.drawerLinks}>
          <div className={styles.drawerSectionTitle}>Main Pages</div>
          <Link href="/dashboard" className={styles.drawerLink} onClick={() => setDrawerOpen(false)}>
            <FiHome /> Dashboard
          </Link>
          <Link href="/explore" className={styles.drawerLink} onClick={() => setDrawerOpen(false)}>
            <FiCompass /> Explore Destinations
          </Link>
          <Link href="/community" className={styles.drawerLink} onClick={() => setDrawerOpen(false)}>
            <FiUsers /> Community Feed
          </Link>
          <Link href="/trips" className={styles.drawerLink} onClick={() => setDrawerOpen(false)}>
            <FiMap /> My Itineraries
          </Link>
          <Link href="/profile" className={styles.drawerLink} onClick={() => setDrawerOpen(false)}>
            <FiUser /> Profile & Saved Spots
          </Link>
          <Link href="/admin" className={styles.drawerLink} onClick={() => setDrawerOpen(false)}>
            <FiBarChart2 /> Live Analytics
          </Link>

          <div style={{ marginTop: '12px', padding: '0 4px' }}>
            <Link 
              href="/trips/create" 
              className="btn btn-primary" 
              style={{ width: '100%', justifyContent: 'center', gap: '8px' }}
              onClick={() => setDrawerOpen(false)}
            >
              <FiPlusCircle /> Plan New Trip
            </Link>
          </div>

          {/* ── Legal & Policies Section in Sidebar ── */}
          <div className={styles.drawerSectionTitle} style={{ marginTop: '20px' }}>Legal & Security</div>
          <button 
            type="button" 
            className={styles.drawerLink}
            onClick={() => { setLegalModal('terms'); setDrawerOpen(false); }}
          >
            <FiFileText /> Terms of Service
          </button>
          <button 
            type="button" 
            className={styles.drawerLink}
            onClick={() => { setLegalModal('privacy'); setDrawerOpen(false); }}
          >
            <FiLock /> Privacy Policy
          </button>
          <button 
            type="button" 
            className={styles.drawerLink}
            onClick={() => { setLegalModal('security'); setDrawerOpen(false); }}
          >
            <FiShield /> Security & Data
          </button>

          {user ? (
            <div style={{ marginTop: '16px', borderTop: '1px solid var(--color-cream-dark)', paddingTop: '12px' }}>
              <button onClick={handleLogout} className={styles.drawerLink} style={{ color: 'var(--color-danger)' }}>
                <FiLogOut /> Log Out
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px', borderTop: '1px solid var(--color-cream-dark)', paddingTop: '16px' }}>
              <Link href="/auth/login" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setDrawerOpen(false)}>
                Sign In
              </Link>
              <Link href="/auth/signup" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setDrawerOpen(false)}>
                Create Account
              </Link>
            </div>
          )}
        </div>
      </div>

      {drawerOpen && <div className={styles.overlay} onClick={() => setDrawerOpen(false)} />}

      {/* ── Legal & Security Modal ── */}
      {legalModal && (
        <div className="modal-overlay" onClick={() => setLegalModal(null)}>
          <div className="modal-content animate-scale-in" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px', maxHeight: '85vh', overflowY: 'auto' }}>
            <div className="modal-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {legalModal === 'terms' && <><FiFileText style={{ color: 'var(--color-forest)' }} /> Terms of Service</>}
                {legalModal === 'privacy' && <><FiLock style={{ color: 'var(--color-forest)' }} /> Privacy Policy</>}
                {legalModal === 'security' && <><FiShield style={{ color: 'var(--color-forest)' }} /> Security & Data Protection</>}
              </h3>
              <button className="modal-close" onClick={() => setLegalModal(null)}>×</button>
            </div>

            <div style={{ padding: '8px 0', fontSize: '0.9rem', color: 'var(--color-charcoal)', lineHeight: '1.7' }}>
              {legalModal === 'terms' && (
                <>
                  <p><strong>Effective Date:</strong> January 2026</p>
                  <p>Welcome to <strong>GlobeTrotter</strong>. By creating an account or accessing our services, you agree to comply with our Terms of Service.</p>
                  <h4 style={{ marginTop: '14px', marginBottom: '6px', fontSize: '0.95rem' }}>1. Platform Usage</h4>
                  <p>GlobeTrotter provides multi-city travel itinerary planning, real-time budgeting tools, and community itinerary sharing. Users are responsible for maintaining the confidentiality of their credentials.</p>
                  <h4 style={{ marginTop: '14px', marginBottom: '6px', fontSize: '0.95rem' }}>2. Public Itineraries & Content</h4>
                  <p>When you publish an itinerary publicly, you grant other travelers permission to view and clone your route details. Personal financial notes and sensitive data remain strictly private.</p>
                </>
              )}

              {legalModal === 'privacy' && (
                <>
                  <p><strong>Effective Date:</strong> January 2026</p>
                  <p>Your privacy is paramount. GlobeTrotter protects your personal information with modern encryption and strict data minimization.</p>
                  <h4 style={{ marginTop: '14px', marginBottom: '6px', fontSize: '0.95rem' }}>1. Information We Collect</h4>
                  <p>We collect your account name, email address, custom travel itineraries, and saved destinations to provide a personalized experience.</p>
                  <h4 style={{ marginTop: '14px', marginBottom: '6px', fontSize: '0.95rem' }}>2. Data Ownership</h4>
                  <p>You retain 100% ownership of your itineraries and profile. You may export or permanently delete your account and all associated records at any time in Profile Settings.</p>
                </>
              )}

              {legalModal === 'security' && (
                <>
                  <p><strong>Security Architecture:</strong> Enterprise Grade</p>
                  <p>GlobeTrotter utilizes cloud database isolation, encrypted JWT authentication, and secure HTTPS transmission across all endpoints.</p>
                  <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
                    <li>End-to-end SSL/TLS 256-bit encrypted data in transit</li>
                    <li>Secure tokenized identity and deterministic user isolation</li>
                    <li>Zero unencrypted credential storage</li>
                  </ul>
                </>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--color-cream-dark)' }}>
              <button className="btn btn-primary btn-sm" onClick={() => setLegalModal(null)}>
                <FiCheckCircle /> Understood & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
