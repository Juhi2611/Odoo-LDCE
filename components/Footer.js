'use client';
import Link from 'next/link';
import { MdFlight } from 'react-icons/md';
import { FiGlobe, FiShield, FiHeart, FiAward, FiCompass, FiUsers, FiMap, FiBarChart2 } from 'react-icons/fi';
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
            <div className={styles.hackathonBadge}>
              <FiAward style={{ color: 'var(--color-gold)' }} />
              <span>Odoo X LDCE Virtual Hackathon 2026</span>
            </div>
          </div>

          <div className={styles.linksCol}>
            <h4>Platform</h4>
            <ul>
              <li><Link href="/explore"><FiCompass /> Explore Destinations</Link></li>
              <li><Link href="/trips/create">✨ AI Smart Itinerary</Link></li>
              <li><Link href="/community"><FiUsers /> Community Itineraries</Link></li>
              <li><Link href="/trips"><FiMap /> My Trips & Itineraries</Link></li>
              <li><Link href="/admin"><FiBarChart2 /> Analytics Dashboard</Link></li>
            </ul>
          </div>

          <div className={styles.linksCol}>
            <h4>Destinations</h4>
            <ul>
              <li><Link href="/explore?search=Paris">Paris, France</Link></li>
              <li><Link href="/explore?search=Tokyo">Tokyo, Japan</Link></li>
              <li><Link href="/explore?search=Jaipur">Jaipur, India</Link></li>
              <li><Link href="/explore?search=Santorini">Santorini, Greece</Link></li>
              <li><Link href="/explore?search=Dubai">Dubai, UAE</Link></li>
            </ul>
          </div>

          <div className={styles.linksCol}>
            <h4>Legal & Security</h4>
            <ul>
              <li><span className={styles.legalLink}>Terms of Service</span></li>
              <li><span className={styles.legalLink}>Privacy Policy</span></li>
              <li><span className={styles.legalLink}>Security & Data Protection</span></li>
              <li><span className={styles.legalLink}>Cookie Settings</span></li>
              <li><span className={styles.legalLink}>GDPR Compliance</span></li>
            </ul>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <div className={styles.copyText}>
            © {new Date().getFullYear()} GlobeTrotter Portal Inc. All rights reserved. Registered under Odoo Hackathon 2026.
          </div>
          
          <div className={styles.teamAttribution}>
            <span>Crafted with <FiHeart style={{ color: '#E63946', verticalAlign: 'middle' }} /> by Team:</span>
            <strong>Juhi Vanjara, Yashvi Sanghvi, Snehi Patel, Nandish Patel</strong>
          </div>
        </div>
      </div>
    </footer>
  );
}
