'use client';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Globe3D from '@/components/Globe3D';
import { getCurrentUser, initializeData, CITIES } from '@/lib/data';
import { FiArrowRight, FiMapPin, FiStar, FiCalendar, FiUsers, FiSearch, FiArrowDown, FiHeart, FiPlay, FiAward, FiHeadphones, FiDollarSign, FiCompass, FiSun, FiDroplet, FiWind, FiCoffee, FiGlobe } from 'react-icons/fi';
import { MdFlight } from 'react-icons/md';
import { FaFacebookF, FaInstagram, FaYoutube, FaXTwitter } from 'react-icons/fa6';
import styles from './page.module.css';

export default function LandingPage() {
  const router = useRouter();
  const [destinationSearch, setDestinationSearch] = useState('');
  const [isVisible, setIsVisible] = useState({});
  const observerRef = useRef(null);

  useEffect(() => {
    initializeData();
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('[data-animate]').forEach((el) => {
      observerRef.current.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

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

  const featuredStays = [
    {
      name: 'Sunset Paradise Resort',
      location: 'Bali, Indonesia',
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
      rating: '4.8',
      price: '₹24,500',
      badge: 'Bestseller',
    },
    {
      name: 'Alpine Lodge & Spa',
      location: 'Zermatt, Switzerland',
      image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
      rating: '4.9',
      price: '₹36,000',
      badge: 'Luxury',
    },
    {
      name: 'Aegean Cliff Villa',
      location: 'Santorini, Greece',
      image: 'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=800',
      rating: '4.7',
      price: '₹22,000',
      badge: 'Popular',
    },
  ];

  const experiences = [
    { icon: <FiSun />, title: 'Infinity Pool', desc: 'Swim with a panoramic view' },
    { icon: <FiDroplet />, title: 'Private Beach', desc: 'Feel the ocean breeze' },
    { icon: <FiWind />, title: 'Sunset Lounge', desc: 'Unwind at golden hour' },
    { icon: <FiCoffee />, title: 'Spa & Wellness', desc: 'Rejuvenate your body and mind' },
  ];

  const features = [
    {
      icon: <FiAward />,
      title: 'Handpicked Stays',
      desc: 'Premium properties selected for quality.',
    },
    {
      icon: <FiCompass />,
      title: 'Local Experiences',
      desc: 'Discover authentic local adventures.',
    },
    {
      icon: <FiDollarSign />,
      title: 'Best Price',
      desc: 'Find competitive prices for your trip.',
    },
    {
      icon: <FiHeadphones />,
      title: '24/7 Support',
      desc: "We're here whenever you need us.",
    },
  ];

  const stats = [
    { value: '10K+', label: 'Happy Travelers' },
    { value: '150+', label: 'Premium Properties' },
    { value: '24/7', label: 'Customer Support' },
    { value: '4.8', label: 'Average Rating' },
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
            <span className={styles.tagPill}>✈ Travel Portal</span>
          </div>

          <h1 className={styles.heroTitle}>
            Discover Places<br />
            Worth <span className={styles.goldText}>Remembering</span>
          </h1>

          <p className={styles.heroSubtitle}>
            Explore breathtaking destinations, unforgettable experiences, 
            and create memories that last a lifetime.
          </p>

          <Link href="/auth/signup" className={styles.exploreBtn}>
            Explore Destinations <span className={styles.btnArrowCircle}>→</span>
          </Link>
        </div>

        <div className={styles.scrollIndicator}>
          <span>Scroll Down</span>
          <div className={styles.scrollCircle}>
            <FiArrowDown />
          </div>
        </div>

        {/* ── Search Bar Container ────────────── */}
        <form 
          className={styles.searchPanel}
          onSubmit={(e) => {
            e.preventDefault();
            if (destinationSearch.trim()) {
              router.push(`/explore?search=${encodeURIComponent(destinationSearch.trim())}`);
            } else {
              router.push('/explore');
            }
          }}
        >
          <div className={styles.searchField}>
            <div className={styles.fieldHeader}>
              <FiMapPin className={styles.fieldIcon} />
              <div>
                <label htmlFor="landing-where-to">Where to?</label>
                <input
                  id="landing-where-to"
                  type="text"
                  placeholder="e.g. Goa, Tokyo, Paris"
                  value={destinationSearch}
                  onChange={(e) => setDestinationSearch(e.target.value)}
                  autoComplete="off"
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
                <input 
                  type="text" 
                  placeholder="Select date" 
                  onFocus={(e) => e.target.type = 'date'}
                  onBlur={(e) => { if (!e.target.value) e.target.type = 'text'; }}
                />
              </div>
            </div>
          </div>

          <div className={styles.searchDivider} />

          <div className={styles.searchField}>
            <div className={styles.fieldHeader}>
              <FiCalendar className={styles.fieldIcon} />
              <div>
                <label>Check out</label>
                <input 
                  type="text" 
                  placeholder="Select date" 
                  onFocus={(e) => e.target.type = 'date'}
                  onBlur={(e) => { if (!e.target.value) e.target.type = 'text'; }}
                />
              </div>
            </div>
          </div>

          <div className={styles.searchDivider} />

          <div className={styles.searchField}>
            <div className={styles.fieldHeader}>
              <FiUsers className={styles.fieldIcon} />
              <div>
                <label>Travelers</label>
                <input type="text" placeholder="2 Guests" defaultValue="2 Guests" />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            className={styles.searchSubmitBtn}
            id="landing-search-btn"
          >
            <span>Search</span> <FiSearch />
          </button>
        </form>
      </section>

      {/* ── 3D Interactive Global Map Showcase ──────────────── */}
      <section className={styles.globeSection} id="section-globe" data-animate>
        <div className="container">
          <div className={styles.globeContainerBox}>
            <div className={styles.globeHeader}>
              <div className={styles.tagPill} style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#06B6D4', border: '1px solid rgba(6, 182, 212, 0.3)' }}>
                <FiGlobe /> 3D Interactive Visualizer
              </div>
              <h2>Explore the Globe in Real-Time 3D</h2>
              <p>Spin the globe, click any glowing node to inspect popular destinations, budget scores, and jump straight into itinerary planning.</p>
            </div>
            
            <div className={styles.globeComponentWrapper}>
              <Globe3D onSelectCity={(cityName) => {
                router.push(`/explore?search=${encodeURIComponent(cityName)}`);
              }} />
            </div>

            <div className={styles.globeHighlights}>
              <div className={styles.globeHighlightItem}>
                <span className={styles.highlightNum}>25+</span>
                <span className={styles.highlightLabel}>Curated Cities</span>
              </div>
              <div className={styles.globeHighlightItem}>
                <span className={styles.highlightNum}>40+</span>
                <span className={styles.highlightLabel}>Handpicked Activities</span>
              </div>
              <div className={styles.globeHighlightItem}>
                <span className={styles.highlightNum}>100%</span>
                <span className={styles.highlightLabel}>Live Budget Calculation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Bar ────────────────────── */}
      <section className={styles.featuresSection} id="section-features" data-animate>
        <div className={`container ${styles.featuresGrid}`}>
          {features.map((f, i) => (
            <div key={i} className={`${styles.featureItem} ${isVisible['section-features'] ? styles.fadeInUp : ''}`} style={{ animationDelay: `${i * 0.1}s` }}>
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
      <section className={styles.destinationsSection} id="section-destinations" data-animate>
        <div className="container">
          <span className={styles.goldSubhead}>EXPLORE THE WORLD</span>
          <div className={styles.destHeader}>
            <h2 className={styles.destTitle}>Popular Destinations</h2>
            <Link href="/explore" className={styles.viewAllBtn}>
              View all destinations <span className={styles.arrowCircle}>→</span>
            </Link>
          </div>

          <div className={styles.destGrid}>
            {featuredDestinations.map((dest, i) => (
              <div key={i} className={`${styles.destCard} ${isVisible['section-destinations'] ? styles.fadeInUp : ''}`} style={{ animationDelay: `${i * 0.12}s` }} onClick={() => router.push('/auth/signup')}>
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

      {/* ── Featured Stays ─────────────────── */}
      <section className={styles.staysSection} id="section-stays" data-animate>
        <div className="container">
          <span className={styles.goldSubhead}>CURATED FOR YOU</span>
          <div className={styles.destHeader}>
            <h2 className={styles.destTitle}>Featured Stays</h2>
            <Link href="/explore" className={styles.viewAllBtn}>
              Browse all stays <span className={styles.arrowCircle}>→</span>
            </Link>
          </div>

          <div className={styles.staysGrid}>
            {featuredStays.map((stay, i) => (
              <div key={i} className={`${styles.stayCard} ${isVisible['section-stays'] ? styles.fadeInUp : ''}`} style={{ animationDelay: `${i * 0.12}s` }} onClick={() => router.push('/auth/signup')}>
                <div className={styles.stayImageWrap}>
                  <img src={stay.image} alt={stay.name} className={styles.stayImage} />
                  <span className={styles.stayBadge}>{stay.badge}</span>
                  <button className={styles.heartBtn} onClick={(e) => e.stopPropagation()}>
                    <FiHeart />
                  </button>
                </div>
                <div className={styles.stayInfo}>
                  <h3 className={styles.stayName}>{stay.name}</h3>
                  <p className={styles.stayLocation}>
                    <FiMapPin /> {stay.location}
                  </p>
                  <div className={styles.stayMeta}>
                    <span className={styles.stayRating}>
                      <span className={styles.starYellow}>★</span> {stay.rating}
                    </span>
                    <span className={styles.stayPrice}>
                      <strong>{stay.price}</strong> / night
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Experiences Section ──────────────── */}
      <section className={styles.experiencesSection} id="section-experiences" data-animate>
        <div className="container">
          <div className={styles.expLayout}>
            <div className={`${styles.expLeft} ${isVisible['section-experiences'] ? styles.fadeInLeft : ''}`}>
              <span className={styles.goldSubhead}>RESORT EXPERIENCES</span>
              <h2 className={styles.expTitle}>Unforgettable Moments Await</h2>
              <p className={styles.expDesc}>
                From infinity pools to private beaches, discover curated experiences that transform your journey into something truly extraordinary.
              </p>

              <div className={styles.expList}>
                {experiences.map((exp, i) => (
                  <div key={i} className={styles.expItem}>
                    <div className={styles.expIconCircle}>{exp.icon}</div>
                    <div>
                      <h4 className={styles.expItemTitle}>{exp.title}</h4>
                      <p className={styles.expItemDesc}>{exp.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link href="/explore" className={styles.expCta}>
                Explore All Experiences <FiArrowRight />
              </Link>
            </div>

            <div className={`${styles.expRight} ${isVisible['section-experiences'] ? styles.fadeInRight : ''}`}>
              <div className={styles.expMediaCard}>
                <img 
                  src="https://images.unsplash.com/photo-1540541338287-41700207dee6?w=900" 
                  alt="Resort pool at sunset" 
                  className={styles.expMainImage} 
                />
                <div className={styles.playOverlay}>
                  <button className={styles.playBtn}>
                    <FiPlay />
                  </button>
                </div>
                <div className={styles.expThumbnails}>
                  <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300" alt="Beach" className={styles.expThumb} />
                  <img src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=300" alt="Hotel" className={styles.expThumb} />
                  <img src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=300" alt="Nature" className={styles.expThumb} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Promotional Banner ────────────────── */}
      <section className={styles.offerSection} id="section-offer" data-animate>
        <div className={`container ${styles.offerBox}`}>
          <div className={`${styles.offerContent} ${isVisible['section-offer'] ? styles.fadeInUp : ''}`}>
            <span className={styles.offerLabel}>LIMITED TIME OFFER</span>
            <h2>
              Get up to <span className={styles.goldPercent}>30% OFF</span><br />
              on your next adventure
            </h2>
            <p className={styles.offerDesc}>Book your dream getaway today and save big on premium properties, curated experiences, and luxury stays.</p>
            <Link href="/auth/signup" className={styles.offerBtn}>
              Explore Deals <span className={styles.arrowCircle}>→</span>
            </Link>
          </div>

          <div className={styles.offerImageWrap}>
            <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200" alt="Mountain adventure" />
          </div>

          {/* Dotted Flight Arc Vector */}
          <svg className={styles.flightArc} viewBox="0 0 400 120" fill="none">
            <path d="M10 100 Q150 10 380 40" stroke="rgba(255, 255, 255, 0.35)" strokeWidth="2" strokeDasharray="6 6" fill="none" />
          </svg>
          <MdFlight className={styles.arcPlane} />
        </div>
      </section>

      {/* ── Stats Section ─────────────────────── */}
      <section className={styles.statsSection} id="section-stats" data-animate>
        <div className={`container ${styles.statsGrid}`}>
          {stats.map((stat, i) => (
            <div key={i} className={`${styles.statItem} ${isVisible['section-stats'] ? styles.fadeInUp : ''}`} style={{ animationDelay: `${i * 0.1}s` }}>
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
          ))}
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
              <MdFlight className={styles.footerPlane} /> <strong>GlobeTrotter</strong>
            </div>
            <p className={styles.tagline}>Empowering Personalized Travel Planning</p>
            <p className={styles.brandDesc}>
              Dream, design, and organize multi-city adventures with ease. Intelligent itineraries, cost breakdowns, and global community sharing.
            </p>
            <div className={styles.socialIcons}>
              <a href="#" className={styles.socialIcon} aria-label="Facebook"><FaFacebookF /></a>
              <a href="#" className={styles.socialIcon} aria-label="Instagram"><FaInstagram /></a>
              <a href="#" className={styles.socialIcon} aria-label="YouTube"><FaYoutube /></a>
              <a href="#" className={styles.socialIcon} aria-label="X (Twitter)"><FaXTwitter /></a>
            </div>
          </div>

          <div className={styles.footerCol}>
            <h4>Quick Links</h4>
            <Link href="/explore">Destinations</Link>
            <Link href="/explore">Experiences</Link>
            <Link href="/trips">My Itineraries</Link>
            <Link href="/community">Community Feed</Link>
            <Link href="/trips/create">Plan Trip</Link>
            <Link href="/dashboard">Dashboard</Link>
          </div>

          <div className={styles.footerCol}>
            <h4>Support</h4>
            <a href="#">Help Center</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Contact Us</a>
          </div>

          <div className={styles.footerCol}>
            <h4>Stay Connected</h4>
            <p className={styles.newsletterDesc}>Get intelligent travel insights and destination recommendations.</p>
            <div className={styles.newsletterBox}>
              <input type="email" placeholder="Enter your email" />
              <button className={styles.newsSendBtn}>
                <FiArrowRight />
              </button>
            </div>
          </div>
        </div>

        <div className={styles.footerCopyright}>
          <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: '0.85rem', textAlign: 'center', color: 'rgba(255, 255, 255, 0.6)' }}>
              © {new Date().getFullYear()} GlobeTrotter Portal Inc. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
