'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ToastProvider } from '@/components/Toast';
import { getCurrentUser, getAnalytics, getTrips, CITIES, getCostTierLabel, isAdminUser } from '@/lib/data';
import { useRouter } from 'next/navigation';
import { 
  FiTrendingUp, 
  FiUsers, 
  FiMapPin, 
  FiCompass, 
  FiDollarSign, 
  FiActivity, 
  FiArrowUpRight, 
  FiLayers, 
  FiShield,
  FiLock,
  FiAlertTriangle,
  FiArrowLeft,
  FiKey
} from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import styles from './page.module.css';

function AdminContent() {
  const [user, setUser] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [trips, setTrips] = useState([]);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const u = getCurrentUser();
    setUser(u);
    if (u && isAdminUser(u)) {
      setAnalytics(getAnalytics());
      setTrips(getTrips());
    }
    setCheckingAuth(false);
  }, [router]);

  if (checkingAuth) {
    return (
      <>
        <Navbar />
        <main className={styles.page} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <div style={{ textAlign: 'center', color: 'var(--color-slate)' }}>
            <div className="spinner" style={{ margin: '0 auto 16px' }} />
            <p>Verifying administrator credentials...</p>
          </div>
        </main>
      </>
    );
  }

  // ── Access Restricted Screen for Non-Admins ──
  if (!user || !isAdminUser(user)) {
    return (
      <>
        <Navbar />
        <main className={styles.page}>
          <div className="container" style={{ maxWidth: '640px', margin: '40px auto' }}>
            <div style={{
              background: 'var(--color-white)',
              borderRadius: 'var(--radius-2xl)',
              padding: '48px 36px',
              textAlign: 'center',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid rgba(0, 0, 0, 0.05)',
              animation: 'fadeInUp 0.4s ease-out'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: '#FEF2F2',
                color: 'var(--color-danger)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.8rem',
                margin: '0 auto 20px'
              }}>
                <FiLock />
              </div>

              <span className="badge badge-gold" style={{ marginBottom: '12px' }}>
                <FiShield /> Confidential Portal
              </span>
              
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--color-charcoal)', marginBottom: '10px' }}>
                Administrator Clearance Required
              </h2>
              
              <p style={{ fontSize: '0.92rem', color: 'var(--color-slate)', lineHeight: '1.6', marginBottom: '28px' }}>
                The Live Analytics & Platform Control Center contains sensitive business metrics and is strictly restricted to authorized administrators.
              </p>

              <div style={{
                background: 'var(--color-cream-light, #FAF7F2)',
                borderRadius: 'var(--radius-lg)',
                padding: '16px 20px',
                textAlign: 'left',
                marginBottom: '28px',
                border: '1px solid var(--color-cream-dark)'
              }}>
                <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-charcoal)', marginBottom: '4px' }}>
                  🔑 Admin Account Credentials
                </strong>
                <span style={{ fontSize: '0.82rem', color: 'var(--color-slate)', display: 'block' }}>
                  Email: <code>admin@globetrotter.com</code> (or any <code>admin@*</code> email)
                </span>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/dashboard" className="btn btn-secondary">
                  <FiArrowLeft /> Back to Dashboard
                </Link>
                <Link href="/auth/login" className="btn btn-primary">
                  <FiKey /> Log In as Administrator
                </Link>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // ── Authorized Admin Dashboard ──
  // Chart Mock Data for Trends
  const trendData = [
    { month: 'Jan', trips: 12, users: 45, revenue: 3200 },
    { month: 'Feb', trips: 19, users: 68, revenue: 4800 },
    { month: 'Mar', trips: 28, users: 95, revenue: 7100 },
    { month: 'Apr', trips: 35, users: 130, revenue: 8900 },
    { month: 'May', trips: 42, users: 180, revenue: 11400 },
    { month: 'Jun', trips: 58, users: 240, revenue: 15600 },
    { month: 'Jul', trips: 72, users: 310, revenue: 19800 },
    { month: 'Aug', trips: 85, users: 390, revenue: 23500 },
  ];

  const cityDistribution = (analytics?.popularCities || []).map((pc, idx) => ({
    name: pc.city?.name || `City ${idx + 1}`,
    trips: pc.count,
  }));

  const COLORS = ['#1B4332', '#2D6A4F', '#C4A35A', '#D4B96E', '#2980B9', '#8E44AD'];

  return (
    <>
      <Navbar />
      <main className={styles.page}>
        <div className="container">
          <div className={styles.header}>
            <div>
              <div className={styles.badgeRow}>
                <span className="badge badge-forest"><FiShield /> Admin Center</span>
                <span className={styles.livePulse}>● Live Sync</span>
              </div>
              <h1>Platform Analytics & Insights</h1>
              <p>Monitor user adoption, multi-city travel trends, popularity indexes, and system engagement stats.</p>
            </div>
            <div className={styles.headerAction}>
              <Link href="/trips/create" className="btn btn-primary">
                + Plan System Trip
              </Link>
            </div>
          </div>

          {/* Metric KPIs */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}><FiUsers /></div>
              <div className={styles.statContent}>
                <span className={styles.statLabel}>Active Travelers</span>
                <h2 className={styles.statValue}>{analytics?.totalUsers || 248}</h2>
                <span className={styles.statChange}><FiArrowUpRight /> +18.4% this month</span>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}><FiCompass /></div>
              <div className={styles.statContent}>
                <span className={styles.statLabel}>Itineraries Planned</span>
                <h2 className={styles.statValue}>{analytics?.totalTrips || trips.length}</h2>
                <span className={styles.statChange}><FiArrowUpRight /> +24.1% this month</span>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}><FiMapPin /></div>
              <div className={styles.statContent}>
                <span className={styles.statLabel}>Global Destinations</span>
                <h2 className={styles.statValue}>{CITIES.length}</h2>
                <span className={styles.statChange}>Worldwide coverage</span>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}><FiDollarSign /></div>
              <div className={styles.statContent}>
                <span className={styles.statLabel}>Total Budget Managed</span>
                <h2 className={styles.statValue}>₹{(analytics?.totalBudgetSpent || 1845000).toLocaleString('en-IN')}</h2>
                <span className={styles.statChange}><FiArrowUpRight /> +31.2% in ₹ INR</span>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className={styles.chartsGrid}>
            <div className={styles.chartCard}>
              <div className={styles.chartHeader}>
                <div>
                  <h3>Platform Growth & Itinerary Creation</h3>
                  <p>Monthly trends for trips and traveler onboarding</p>
                </div>
              </div>
              <div className={styles.chartBody} style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="colorTrips" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1B4332" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#1B4332" stopOpacity={0.05}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                    <XAxis dataKey="month" stroke="#6C757D" fontSize={12} tickLine={false} />
                    <YAxis stroke="#6C757D" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ background: '#fff', borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                    <Area type="monotone" dataKey="trips" stroke="#1B4332" strokeWidth={3} fillOpacity={1} fill="url(#colorTrips)" name="Trips Created" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={styles.chartCard}>
              <div className={styles.chartHeader}>
                <div>
                  <h3>Top Destination Footprint</h3>
                  <p>Most scheduled cities across all itineraries</p>
                </div>
              </div>
              <div className={styles.chartBody} style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={cityDistribution.length > 0 ? cityDistribution : [
                    { name: 'Paris', trips: 14 },
                    { name: 'Tokyo', trips: 11 },
                    { name: 'Jaipur', trips: 9 },
                    { name: 'Santorini', trips: 8 },
                    { name: 'Dubai', trips: 7 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                    <XAxis dataKey="name" stroke="#6C757D" fontSize={12} tickLine={false} />
                    <YAxis stroke="#6C757D" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ background: '#fff', borderRadius: '8px', border: '1px solid #E5E7EB' }} />
                    <Bar dataKey="trips" fill="#C4A35A" radius={[6, 6, 0, 0]} name="Trip Stoppages" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* System Itineraries Table */}
          <div className={styles.tableCard}>
            <div className={styles.tableHeader}>
              <div>
                <h3>Recent System Itineraries</h3>
                <p>Real-time log of multi-city itineraries created across the network</p>
              </div>
            </div>
            <div className={styles.tableBody}>
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Trip Name</th>
                      <th>Dates</th>
                      <th>Budget (₹)</th>
                      <th>Visibility</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trips.slice(0, 8).map(t => (
                      <tr key={t.id}>
                        <td>
                          <strong>{t.name}</strong>
                          <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--color-slate)' }}>{t.stops?.length || 0} stops</span>
                        </td>
                        <td>
                          {t.start_date && t.end_date ? `${new Date(t.start_date).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})} - ${new Date(t.end_date).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}` : 'Flexible'}
                        </td>
                        <td>
                          <strong>₹{(t.total_budget || 0).toLocaleString('en-IN')}</strong>
                        </td>
                        <td>
                          <span className={`badge ${t.is_public ? 'badge-forest' : 'badge-gold'}`}>
                            {t.is_public ? 'Public' : 'Private'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}

export default function AdminPage() {
  return (
    <ToastProvider>
      <AdminContent />
    </ToastProvider>
  );
}
