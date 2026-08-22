'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { ToastProvider } from '@/components/Toast';
import { getCurrentUser, getAnalytics, getTrips, CITIES } from '@/lib/data';
import { useRouter } from 'next/navigation';
import { FiTrendingUp, FiUsers, FiMapPin, FiCompass, FiDollarSign, FiActivity, FiArrowUpRight, FiLayers, FiShield } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import styles from './page.module.css';

function AdminContent() {
  const [user, setUser] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [trips, setTrips] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const u = getCurrentUser();
    if (!u) {
      router.push('/auth/login');
      return;
    }
    setUser(u);
    setAnalytics(getAnalytics());
    setTrips(getTrips());
  }, [router]);

  if (!user || !analytics) return null;

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

  const cityDistribution = analytics.popularCities.map((pc, idx) => ({
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

          {/* Key Metric Highlights */}
          <div className={styles.metricsGrid}>
            <div className={styles.metricCard}>
              <div className={styles.metricHeader}>
                <span className={styles.metricTitle}>Total Trips Created</span>
                <span className={styles.metricIcon} style={{ background: 'rgba(27, 67, 50, 0.1)', color: '#1B4332' }}><FiCompass /></span>
              </div>
              <div className={styles.metricVal}>{analytics.totalTrips}</div>
              <div className={styles.metricSub}>
                <span className={styles.trendUp}><FiArrowUpRight /> +24%</span> vs last month
              </div>
            </div>

            <div className={styles.metricCard}>
              <div className={styles.metricHeader}>
                <span className={styles.metricTitle}>Stops Scheduled</span>
                <span className={styles.metricIcon} style={{ background: 'rgba(45, 106, 79, 0.1)', color: '#2D6A4F' }}><FiMapPin /></span>
              </div>
              <div className={styles.metricVal}>{analytics.totalStops}</div>
              <div className={styles.metricSub}>
                <span className={styles.trendUp}><FiArrowUpRight /> +31%</span> across 25 global cities
              </div>
            </div>

            <div className={styles.metricCard}>
              <div className={styles.metricHeader}>
                <span className={styles.metricTitle}>Activities Booked</span>
                <span className={styles.metricIcon} style={{ background: 'rgba(196, 163, 90, 0.15)', color: '#A68B42' }}><FiActivity /></span>
              </div>
              <div className={styles.metricVal}>{analytics.totalActivities}</div>
              <div className={styles.metricSub}>
                <span className={styles.trendUp}><FiArrowUpRight /> +18%</span> experiences cataloged
              </div>
            </div>

            <div className={styles.metricCard}>
              <div className={styles.metricHeader}>
                <span className={styles.metricTitle}>Total Budget Planned</span>
                <span className={styles.metricIcon} style={{ background: 'rgba(41, 128, 185, 0.1)', color: '#2980B9' }}><FiDollarSign /></span>
              </div>
              <div className={styles.metricVal}>${analytics.totalBudget.toLocaleString()}</div>
              <div className={styles.metricSub}>
                Avg. ${(analytics.avgTripBudget || 0).toFixed(0)} per traveler
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className={styles.chartsGrid}>
            <div className={styles.chartCard}>
              <div className={styles.cardHeading}>
                <h3>Trip Growth & Active Travelers</h3>
                <span className="badge badge-gold">2026 Trends</span>
              </div>
              <p className={styles.chartDesc}>Monthly progression of travel itineraries created vs registered travelers</p>
              <div className={styles.chartBox}>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="colorTrips" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1B4332" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#1B4332" stopOpacity={0.0}/>
                      </linearGradient>
                      <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#C4A35A" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#C4A35A" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.06)" />
                    <XAxis dataKey="month" stroke="#6B7280" tickLine={false} />
                    <YAxis stroke="#6B7280" tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Area type="monotone" dataKey="trips" stroke="#1B4332" strokeWidth={2} fillOpacity={1} fill="url(#colorTrips)" name="Trips Planned" />
                    <Area type="monotone" dataKey="users" stroke="#C4A35A" strokeWidth={2} fillOpacity={1} fill="url(#colorUsers)" name="Active Planners" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={styles.chartCard}>
              <div className={styles.cardHeading}>
                <h3>Top Destination Density</h3>
                <span className="badge badge-forest">City Stops</span>
              </div>
              <p className={styles.chartDesc}>Distribution of scheduled travel stops in top global cities</p>
              <div className={styles.chartBox}>
                {cityDistribution.length > 0 ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={cityDistribution}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.06)" />
                      <XAxis dataKey="name" stroke="#6B7280" tickLine={false} />
                      <YAxis stroke="#6B7280" tickLine={false} axisLine={false} />
                      <Tooltip />
                      <Bar dataKey="trips" fill="#2D6A4F" radius={[6, 6, 0, 0]} name="Stops Added" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className={styles.noData}>No city stop data to plot yet</div>
                )}
              </div>
            </div>
          </div>

          {/* Detailed Tables */}
          <div className={styles.tablesRow}>
            <div className={styles.tableCard}>
              <div className={styles.cardHeading}>
                <h3>Most Popular Destinations</h3>
                <Link href="/explore" className={styles.viewLink}>View Catalog →</Link>
              </div>
              <div className={styles.tableWrapper}>
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>City</th>
                      <th>Country</th>
                      <th>Cost Index</th>
                      <th>Popularity</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CITIES.slice(0, 6).map((city) => (
                      <tr key={city.id}>
                        <td className={styles.cityCell}>
                          <img src={city.image_url} alt={city.name} className={styles.tableImg} />
                          <strong>{city.name}</strong>
                        </td>
                        <td>{city.country}</td>
                        <td>
                          <span className={styles.costBadge}>{'$'.repeat(city.cost_index)}</span>
                        </td>
                        <td>
                          <div className={styles.popBarWrap}>
                            <div className={styles.popBar} style={{ width: `${city.popularity_score}%` }} />
                            <span>{city.popularity_score}/100</span>
                          </div>
                        </td>
                        <td>
                          <span className="badge badge-forest">Trending</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className={styles.tableCard}>
              <div className={styles.cardHeading}>
                <h3>Recent System Itineraries</h3>
                <Link href="/trips" className={styles.viewLink}>All Trips →</Link>
              </div>
              <div className={styles.tableWrapper}>
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>Trip Name</th>
                      <th>Duration</th>
                      <th>Budget</th>
                      <th>Access</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trips.map((t) => (
                      <tr key={t.id}>
                        <td>
                          <strong>{t.name}</strong>
                          <span className={styles.tripSub}>{t.stops?.length || 0} stops scheduled</span>
                        </td>
                        <td>
                          {t.start_date && t.end_date ? `${new Date(t.start_date).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})} - ${new Date(t.end_date).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}` : 'N/A'}
                        </td>
                        <td>
                          <strong>${t.total_budget?.toLocaleString()}</strong>
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
