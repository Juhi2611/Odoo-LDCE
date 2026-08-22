'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { getCurrentUser, initializeData, CITIES } from '@/lib/data';
import { FiArrowRight, FiMapPin, FiStar, FiCalendar, FiUsers, FiSearch, FiArrowDown, FiX, FiCheck } from 'react-icons/fi';
import { MdFlight } from 'react-icons/md';
import styles from './page.module.css';

export default function LandingPage() {
  const router = useRouter();
  const [destinationSearch, setDestinationSearch] = useState('');

  useEffect(() => {
    initializeData();
    const user = getCurrentUser();
    if (user) router.push('/dashboard');
  }, [router]);

  const featuredDestinations = [
    {
      name: 'Santorini',
      subtitle: 'White-washed beauty over the Aegean Sea.',
      image: '/images/destinations/santorini.jpg',
      rating: '4.8',
      reviews: '1,230',
      badge: 'Greece',
    },
    {
      name: 'Bali, Indonesia',
      subtitle: 'Tropical paradise with rich culture and nature.',
      image: '/images/destinations/bali.jpg',
      rating: '4.7',
      reviews: '980',
      badge: 'Bali',
    },
    {
      name: 'Swiss Alps',
      subtitle: 'Scenic landscapes and breathtaking adventures.',
      image: '/images/destinations/switzerland.jpg',
      rating: '4.9',
      reviews: '1,110',
      badge: 'Switzerland',
    },
    {
      name: 'Maldives',
      subtitle: 'Luxury and tranquility in crystal-clear waters.',
      image: '/images/destinations/maldives.jpg',
      rating: '4.8',
      reviews: '1,340',
      badge: 'Maldives',
    },
  ];

  const features = [
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16" />
          <path d="M12 7v4" />
          <path d="M12 15h.01" />
        </svg>
      ),
      title: 'Handpicked Hotels',
      desc: 'Stay at the finest places to relax.',
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      title: 'Expert Guides',
      desc: 'Local experts to guide your journey.',
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M16 8l-8 8" />
          <path d="M8 8h8v8" />
        </svg>
      ),
      title: 'Best Price Guarantee',
      desc: 'We match the best prices for you.',
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
          <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
        </svg>
      ),
      title: '24/7 Support',
      desc: "We're here for you anytime, anywhere.",
    },
  ];

  return (
    <div className={styles.page}>
      <Navbar transparent />

      {/* ── Hero Section ────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroImage}>
          <img src="/images/hero.jpg" alt="European lakeside village" />
          <div className={styles.heroGradient} />
        </div>

        <div className={styles.heroContent}>
          <div className={styles.timeTag}>
            <span>It's time to</span>
            <span className={styles.closeCross}>✕</span>
            <MdFlight className={styles.planeGraphic} />
          </div>

          <h1 className={styles.heroTitle}>
            Explore<br />
            the <span className={styles.goldText}>World</span>
            <span className={styles.goldFlourish} />
          </h1>

          <p className={styles.heroSubtitle}>
            Discover breathtaking destinations, unforgettable experiences, and memories that last a lifetime.
          </p>

          <Link href="/auth/signup" className={styles.exploreBtn}>
            Explore Now <span className={styles.btnArrowCircle}>→</span>
          </Link>
        </div>

        <div className={styles.scrollIndicator}>
          <span>Scroll Down</span>
          <div className={styles.scrollCircle}>
            <FiArrowDown />
          </div>
        </div>

        {/* ── Search Bar Container ────────────── */}
        <div className={styles.searchPanel}>
          <div className={styles.searchField}>
            <div className={styles.fieldHeader}>
              <FiMapPin className={styles.fieldIcon} />
              <div>
                <label>Where to?</label>
                <input
                  type="text"
                  placeholder="Search destinations"
                  value={destinationSearch}
                  onChange={(e) => setDestinationSearch(e.target.value)}
                  onClick={() => router.push('/auth/signup')}
                />
              </div>
            </div>
          </div>

          <div className={styles.searchDivider} />

          <div className={styles.searchField}>
            <div className={styles.fieldHeader}>
              <FiCalendar className={styles.fieldIcon} />
              <div>
                <label>Check in</label>
                <input type="text" placeholder="Add dates" readOnly onClick={() => router.push('/auth/signup')} />
              </div>
            </div>
          </div>

          <div className={styles.searchDivider} />

          <div className={styles.searchField}>
            <div className={styles.fieldHeader}>
              <FiCalendar className={styles.fieldIcon} />
              <div>
                <label>Check out</label>
                <input type="text" placeholder="Add dates" readOnly onClick={() => router.push('/auth/signup')} />
              </div>
            </div>
          </div>

          <div className={styles.searchDivider} />

          <div className={styles.searchField}>
            <div className={styles.fieldHeader}>
              <FiUsers className={styles.fieldIcon} />
              <div>
                <label>Travelers</label>
                <input type="text" placeholder="Add guests" readOnly onClick={() => router.push('/auth/signup')} />
              </div>
            </div>
          </div>

          <button className={styles.searchSubmitBtn} onClick={() => router.push('/auth/signup')}>
            <span>Search</span> <FiSearch />
          </button>
        </div>
      </section>

      {/* ── Features Bar ────────────────────── */}
      <section className={styles.featuresSection}>
        <div className={`container ${styles.featuresGrid}`}>
          {features.map((f, i) => (
            <div key={i} className={styles.featureItem}>
              <div className={styles.featureIconBox}>{f.icon}</div>
              <div>
                <h4 className={styles.featureTitle}>{f.title}</h4>
                <p className={styles.featureDesc}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Popular Destinations ─────────────── */}
      <section className={styles.destinationsSection}>
        <div className="container">
          <span className={styles.goldSubhead}>EXPLORE THE BEST</span>
          <div className={styles.destHeader}>
            <h2 className={styles.destTitle}>Popular Destinations</h2>
            <Link href="/explore" className={styles.viewAllBtn}>
              View all destinations <span className={styles.arrowCircle}>→</span>
            </Link>
          </div>

          <div className={styles.destGrid}>
            {featuredDestinations.map((dest, i) => (
              <div key={i} className={styles.destCard} onClick={() => router.push('/auth/signup')}>
                <div className={styles.destImageWrap}>
                  <img src={dest.image} alt={dest.name} className={styles.destImage} />
                  
                  {/* Top Left Location Badge */}
                  <div className={styles.locationBadge}>
                    <FiMapPin className={styles.pinIcon} /> {dest.badge}
                  </div>

                  {/* Bottom Gradient Overlay */}
                  <div className={styles.destCardContent}>
                    <h3>{dest.name}</h3>
                    <p>{dest.subtitle}</p>
                    <div className={styles.destRatingRow}>
                      <span className={styles.starYellow}>★</span>
                      <strong>{dest.rating}</strong>
                      <span className={styles.reviewsCount}>({dest.reviews})</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Promotional Banner ────────────────── */}
      <section className={styles.offerSection}>
        <div className={`container ${styles.offerBox}`}>
          <div className={styles.offerContent}>
            <span className={styles.offerLabel}>Limited Time Offer</span>
            <h2>
              Get up to <span className={styles.goldPercent}>30% OFF</span><br />
              on your next adventure
            </h2>
            <Link href="/auth/signup" className={styles.offerBtn}>
              Explore Deals <span className={styles.arrowCircle}>→</span>
            </Link>
          </div>

          <div className={styles.offerImageWrap}>
            <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200" alt="Hiker in mountains" />
          </div>

          {/* Dotted Flight Arc Vector */}
          <svg className={styles.flightArc} viewBox="0 0 400 120" fill="none">
            <path d="M10 100 Q150 10 380 40" stroke="rgba(255, 255, 255, 0.45)" strokeWidth="2" strokeDasharray="6 6" fill="none" />
          </svg>
          <MdFlight className={styles.arcPlane} />
        </div>
      </section>

      {/* ── Trusted Brands Bar ────────────────── */}
      <section className={styles.trustedSection}>
        <div className={`container ${styles.trustedContent}`}>
          <span className={styles.trustedText}>Trusted by thousands of travelers worldwide</span>
          <div className={styles.brandLogos}>
            <span className={styles.brandLogo}>Booking.com</span>
            <span className={styles.brandLogo}>Expedia</span>
            <span className={styles.brandLogo}>Tripadvisor</span>
            <span className={styles.brandLogo}>Skyscanner</span>
            <span className={styles.brandLogo}>airbnb</span>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────── */}
      <footer className={styles.footer}>
        <div className={`container ${styles.footerGrid}`}>
          <div className={styles.footerBrand}>
            <div className={styles.footerLogo}>
              <MdFlight className={styles.footerPlane} /> <strong>Roamora</strong>
            </div>
            <p className={styles.tagline}>Explore Beyond Limits</p>
            <p className={styles.brandDesc}>
              We help you discover the world with unforgettable travel experiences and exceptional service.
            </p>
            <div className={styles.socialIcons}>
              <a href="#" className={styles.socialIcon}>f</a>
              <a href="#" className={styles.socialIcon}>ig</a>
              <a href="#" className={styles.socialIcon}>yt</a>
              <a href="#" className={styles.socialIcon}>tw</a>
            </div>
          </div>

          <div className={styles.footerCol}>
            <h4>Quick Links</h4>
            <Link href="/explore">Destinations</Link>
            <Link href="/explore">Experiences</Link>
            <Link href="/trips">Hotels</Link>
            <Link href="/trips">Tours</Link>
            <Link href="/community">Deals</Link>
            <Link href="/dashboard">About Us</Link>
          </div>

          <div className={styles.footerCol}>
            <h4>Support</h4>
            <a href="#">FAQs</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms & Conditions</a>
            <a href="#">Contact Us</a>
          </div>

          <div className={styles.footerCol}>
            <h4>Newsletter</h4>
            <p className={styles.newsletterDesc}>Subscribe to get exclusive travel deals and updates.</p>
            <div className={styles.newsletterBox}>
              <input type="email" placeholder="Enter your email" />
              <button className={styles.newsSendBtn}>
                <FiArrowRight />
              </button>
            </div>
          </div>
        </div>

        <div className={styles.footerCopyright}>
          <div className="container">
            <p>© 2026 Roamora. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
