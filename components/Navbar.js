'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getCurrentUser, logoutUser } from '@/lib/data';
import { FiMenu, FiX, FiUser, FiLogOut, FiMapPin, FiCompass, FiPlusCircle, FiBarChart2, FiHome, FiUsers, FiMail } from 'react-icons/fi';
import { MdFlight } from 'react-icons/md';
import styles from './Navbar.module.css';

export default function Navbar({ transparent = false }) {
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setUser(getCurrentUser());
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
    router.push('/');
  };

  const navLinks = [
    { href: '/explore', label: 'Destinations' },
    { href: '/explore', label: 'Experiences' },
    { href: '/trips', label: 'My Trips' },
    { href: '/community', label: 'Community' },
    { href: '#deals', label: 'Deals' },
    { href: '#about', label: 'About Us' },
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
            <span className={styles.logoTagline}>Explore Beyond Limits</span>
          </div>
        </Link>

        {/* Center Nav Links */}
        <div className={`${styles.navLinks} ${mobileOpen ? styles.mobileOpen : ''}`}>
          <button className={styles.mobileClose} onClick={() => setMobileOpen(false)}>
            <FiX />
          </button>

          {user && (
            <Link
              href="/dashboard"
              className={`${styles.navLink} ${pathname === '/dashboard' ? styles.active : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              Dashboard
            </Link>
          )}

          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`${styles.navLink} ${pathname === link.href ? styles.active : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Action Buttons */}
        <div className={styles.navActions}>
          {user ? (
            <div className={styles.profileWrapper}>
              <button
                className={styles.profileBtn}
                onClick={() => setProfileOpen(!profileOpen)}
              >
                <div className={styles.avatar}>
                  {user.name?.charAt(0).toUpperCase()}
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
          ) : (
            <>
              <Link href="/auth/signup" className={`btn ${styles.contactBtn}`}>
                Contact Us
              </Link>
            </>
          )}

          {/* Circle Hamburger Button */}
          <button className={styles.menuCircleBtn} onClick={() => setMobileOpen(!mobileOpen)}>
            <FiMenu />
          </button>
        </div>
      </div>

      {mobileOpen && <div className={styles.overlay} onClick={() => setMobileOpen(false)} />}
    </nav>
  );
}
