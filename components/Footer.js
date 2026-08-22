'use client';
import Link from 'next/link';
import { MdFlight } from 'react-icons/md';
import { FiCompass, FiUsers, FiMap, FiBarChart2 } from 'react-icons/fi';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerTop}>
          <div className={styles.brandCol}>
            <Link href="/" className={styles.logo}>
              <div className={styles.logoBadge}>
                <MdFlight className={styles.logoIcon} />
              </div>
              <div>
                <span className={styles.logoText}>GlobeTrotter</span>
                <span className={styles.logoTagline}>Personalized Travel Planning</span>
              </div>
            </Link>
            <p className={styles.brandDesc}>
              An intelligent, end-to-end multi-city travel platform empowering travelers to dream, design, budget, and experience extraordinary global journeys.
            </p>
          </div>

          <div className={styles.linksCol}>
            <h4>Platform Quick Links</h4>
            <div className={styles.platformLinks}>
              <Link href="/explore" className={styles.footerLink}><FiCompass /> Explore Destinations</Link>
              <Link href="/trips/create" className={styles.footerLink}>✨ AI Smart Itinerary</Link>
              <Link href="/community" className={styles.footerLink}><FiUsers /> Community Itineraries</Link>
              <Link href="/trips" className={styles.footerLink}><FiMap /> My Trips & Itineraries</Link>
              <Link href="/admin" className={styles.footerLink}><FiBarChart2 /> Live Analytics</Link>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p className={styles.copyText}>
            © {new Date().getFullYear()} GlobeTrotter Portal Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
