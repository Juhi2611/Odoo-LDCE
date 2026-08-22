'use client';
import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ToastProvider, useToast } from '@/components/Toast';
import { getCurrentUser, getTrip, updateTrip, deleteTrip, getCity, getActivity, getCityActivities, addStop, removeStop, addTripActivity, removeTripActivity, addExpense, removeExpense, calculateTripBudget, CITIES, searchCities, addCustomCity, getCostTierLabel } from '@/lib/data';
import { FiArrowLeft, FiPlus, FiTrash2, FiMapPin, FiCalendar, FiDollarSign, FiClock, FiStar, FiShare2, FiEdit3, FiList, FiGrid, FiBarChart2, FiExternalLink, FiX, FiSearch, FiChevronDown, FiChevronUp, FiCheckCircle, FiAlertTriangle, FiGlobe, FiCompass, FiLoader } from 'react-icons/fi';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import styles from './page.module.css';

function TripDetailContent({ params }) {
  const resolvedParams = use(params);
  const [trip, setTrip] = useState(null);
  const [activeTab, setActiveTab] = useState('itinerary');
  const [showAddStop, setShowAddStop] = useState(false);
  const [showAddActivity, setShowAddActivity] = useState(null);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [citySearch, setCitySearch] = useState('');
  const [isVerifyingLocation, setIsVerifyingLocation] = useState(false);
  const [verifiedLocation, setVerifiedLocation] = useState(null);
  const [verificationError, setVerificationError] = useState(null);
  const [expandedStop, setExpandedStop] = useState(null);
  const [calendarView, setCalendarView] = useState('timeline');
  const router = useRouter();
  const addToast = useToast();

  useEffect(() => {
    const u = getCurrentUser();
    if (!u) { router.push('/auth/login'); return; }
    loadTrip();
  }, [router, resolvedParams.id]);

  const loadTrip = () => {
    const t = getTrip(resolvedParams.id);
    if (!t) { router.push('/trips'); return; }
    setTrip(t);
    if (t.stops?.length > 0 && !expandedStop) setExpandedStop(t.stops[0].id);
  };

  // Debounced Real-World Location Verification (Hook defined before any early returns)
  useEffect(() => {
    const q = citySearch.trim();
    if (!q || q.length < 2) {
      setVerifiedLocation(null);
      setVerificationError(null);
      setIsVerifyingLocation(false);
      return;
    }

    const localMatches = searchCities(q);
    if (localMatches.length > 0) {
      setVerifiedLocation(null);
      setVerificationError(null);
      setIsVerifyingLocation(false);
      return;
    }

    // No local matches found: initiate live external verification
    setIsVerifyingLocation(true);
    setVerificationError(null);
    setVerifiedLocation(null);

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/places/search?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        if (data.exists && data.city) {
          setVerifiedLocation(data.city);
          setVerificationError(null);
        } else {
          setVerifiedLocation(null);
          setVerificationError(data.message || `"${q}" does not exist in the real world.`);
        }
      } catch (err) {
        setVerificationError('Unable to connect to global geocoding network.');
      } finally {
        setIsVerifyingLocation(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [citySearch]);

  if (!trip) return null;

  const budget = calculateTripBudget(trip);
  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';
  const formatDateFull = (d) => d ? new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : '';

  // Budget chart data
  const pieData = Object.entries(budget.byCategory).filter(([,v]) => v > 0).map(([name, value]) => ({ name, value }));
  const COLORS = ['#1B4332', '#2D6A4F', '#C4A35A', '#D4B96E', '#2980B9', '#E67E22'];

  // Calendar data
  const getDaysBetween = (start, end) => {
    const days = [];
    let current = new Date(start);
    const last = new Date(end);
    while (current <= last) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return days;
  };

  const tripDays = trip.start_date && trip.end_date ? getDaysBetween(trip.start_date, trip.end_date) : [];

  const getActivitiesForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return (trip.activities || []).filter(a => a.scheduled_date === dateStr).map(ta => ({
      ...ta,
      activity: getActivity(ta.activity_id),
    }));
  };

  const getStopForDate = (date) => {
    return (trip.stops || []).find(s => {
      const arrival = new Date(s.arrival_date);
      const departure = new Date(s.departure_date);
      return date >= arrival && date <= departure;
    });
  };

  // Add Stop Handler
  const handleAddStop = (cityId, customCityData = null) => {
    let targetCityId = cityId;
    if (customCityData) {
      const added = addCustomCity(customCityData);
      targetCityId = added.id;
    }

    const defaultStart = trip.stops?.length > 0
      ? trip.stops[trip.stops.length - 1].departure_date
      : trip.start_date;
    const startDate = new Date(defaultStart);
    startDate.setDate(startDate.getDate() + 1);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 3);

    addStop(trip.id, {
      city_id: targetCityId,
      arrival_date: startDate.toISOString().split('T')[0],
      departure_date: endDate.toISOString().split('T')[0],
      budget_allocated: 500,
    });
    loadTrip();
    setShowAddStop(false);
    setCitySearch('');
    setVerifiedLocation(null);
    setVerificationError(null);
    addToast('Destination added to itinerary!', 'success');
  };

  // Add Activity Handler
  const handleAddActivity = (activityId, stopId) => {
    const stop = trip.stops.find(s => s.id === stopId);
    const activity = getActivity(activityId);
    addTripActivity(trip.id, {
      stop_id: stopId,
      activity_id: activityId,
      scheduled_date: stop.arrival_date,
      time_slot: 'Morning',
      actual_cost: activity?.estimated_cost || 0,
    });
    loadTrip();
    setShowAddActivity(null);
    addToast('Activity added!', 'success');
  };

  // Remove handlers
  const handleRemoveStop = (stopId) => {
    removeStop(trip.id, stopId);
    loadTrip();
    addToast('Stop removed', 'info');
  };

  const handleRemoveActivity = (actId) => {
    removeTripActivity(trip.id, actId);
    loadTrip();
    addToast('Activity removed', 'info');
  };

  // Add Expense Handler
  const handleAddExpense = (e) => {
    e.preventDefault();
    const form = e.target;
    addExpense(trip.id, {
      category: form.category.value,
      amount: parseFloat(form.amount.value),
      description: form.description.value,
      expense_date: form.expense_date.value,
      stop_id: form.stop_id?.value || null,
    });
    loadTrip();
    setShowAddExpense(false);
    addToast('Expense added!', 'success');
  };

  // Share
  const handleShare = () => {
    updateTrip(trip.id, { is_public: true });
    loadTrip();
    const url = `${window.location.origin}/share/${trip.share_slug}`;
    navigator.clipboard?.writeText(url);
    addToast('Share link copied to clipboard!', 'success');
  };

  // Delete Trip
  const handleDeleteTrip = () => {
    deleteTrip(trip.id);
    addToast('Trip deleted successfully', 'success');
    router.push('/trips');
  };

  const searchResults = showAddStop ? searchCities(citySearch).slice(0, 8) : [];

  return (
    <>
      <Navbar />
      <main className={styles.page}>
        <div className="container">
          <Link href="/trips" className={styles.backLink}><FiArrowLeft /> Back to My Trips</Link>

          {/* Trip Header */}
          <div className={styles.tripHeader}>
            <div className={styles.tripCover}>
              <img src={trip.cover_image} alt={trip.name} />
              <div className={styles.coverOverlay} />
              <div className={styles.coverContent}>
                <h1>{trip.name}</h1>
                <p className={styles.tripDates}>
                  <FiCalendar /> {formatDate(trip.start_date)} – {formatDate(trip.end_date)}
                  <span className={styles.dotSep}>•</span>
                  <FiMapPin /> {trip.stops?.length || 0} cities
                  <span className={styles.dotSep}>•</span>
                  <FiDollarSign /> ₹{trip.total_budget?.toLocaleString('en-IN')}
                </p>
                {trip.description && <p className={styles.tripDescText}>{trip.description}</p>}
              </div>
            </div>

            {/* Budget Bar */}
            <div className={styles.budgetBar}>
              <div className={styles.budgetInfo}>
                <span>Budget: <strong>₹{budget.totalBudget.toLocaleString('en-IN')}</strong></span>
                <span>Spent: <strong>₹{budget.totalSpent.toLocaleString('en-IN')}</strong></span>
                <span>Remaining: <strong className={budget.isOverBudget ? styles.overBudget : styles.underBudget}>₹{Math.abs(budget.remaining).toLocaleString('en-IN')}</strong></span>
              </div>
              <div className="progress-bar" style={{ height: '10px' }}>
                <div className={`progress-bar-fill ${budget.isOverBudget ? 'over-budget' : ''}`} style={{ width: `${Math.min((budget.totalSpent / Math.max(budget.totalBudget, 1)) * 100, 100)}%` }} />
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className={styles.tabNav}>
            {[
              { key: 'itinerary', label: 'Itinerary', icon: <FiList /> },
              { key: 'budget', label: 'Budget', icon: <FiBarChart2 /> },
              { key: 'calendar', label: 'Calendar', icon: <FiCalendar /> },
            ].map(tab => (
              <button key={tab.key} className={`${styles.tabBtn} ${activeTab === tab.key ? styles.activeTab : ''}`} onClick={() => setActiveTab(tab.key)}>
                {tab.icon} {tab.label}
              </button>
            ))}
            <div style={{ flex: 1 }} />
            <button className="btn btn-outline btn-sm" onClick={handleShare}><FiShare2 /> Share</button>
            <button className="btn btn-danger btn-sm" onClick={() => setShowDeleteModal(true)} style={{ gap: '6px' }}><FiTrash2 /> Delete Trip</button>
          </div>

          {/* ── Itinerary Tab ── */}
          {activeTab === 'itinerary' && (
            <div className={styles.itinerarySection}>
              {(trip.stops || []).sort((a, b) => a.order_index - b.order_index).map((stop, i) => {
                const city = getCity(stop.city_id);
                const stopActivities = (trip.activities || []).filter(a => a.stop_id === stop.id).map(ta => ({ ...ta, activity: getActivity(ta.activity_id) }));
                const isExpanded = expandedStop === stop.id;

                return (
                  <div key={stop.id} className={styles.stopCard}>
                    <div className={styles.stopTimeline}>
                      <div className={styles.stopDot}>{i + 1}</div>
                      {i < trip.stops.length - 1 && <div className={styles.stopLine} />}
                    </div>
                    <div className={styles.stopContent}>
                      <div className={styles.stopHeader} onClick={() => setExpandedStop(isExpanded ? null : stop.id)}>
                        <div className={styles.stopInfo}>
                          <div className={styles.stopCityImg}>
                            <img src={city?.image_url} alt={city?.name} />
                          </div>
                          <div>
                            <h3>{city?.name || 'Unknown City'}</h3>
                            <p><FiMapPin /> {city?.country} · <FiCalendar /> {formatDate(stop.arrival_date)} – {formatDate(stop.departure_date)}</p>
                          </div>
                        </div>
                        <div className={styles.stopActions}>
                          <button className={styles.removeBtn} onClick={(e) => { e.stopPropagation(); handleRemoveStop(stop.id); }}>
                            <FiTrash2 />
                          </button>
                          {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                        </div>
                      </div>

                      {isExpanded && (
                        <div className={styles.stopExpanded}>
                          {/* Activities for this stop */}
                          <div className={styles.activitiesSection}>
                            <h4>Activities ({stopActivities.length})</h4>
                            {stopActivities.length > 0 ? (
                              <div className={styles.activityList}>
                                {stopActivities.map(ta => (
                                  <div key={ta.id} className={styles.activityItem}>
                                    <div className={styles.activityImg}>
                                      <img src={ta.activity?.image_url} alt={ta.activity?.name} />
                                    </div>
                                    <div className={styles.activityInfo}>
                                      <strong>{ta.activity?.name}</strong>
                                      <div className={styles.activityMeta}>
                                        <span><FiClock /> {ta.activity?.duration}</span>
                                        <span><FiDollarSign /> ₹{ta.actual_cost}</span>
                                        <span className="badge badge-forest">{ta.time_slot}</span>
                                      </div>
                                    </div>
                                    <button className={styles.removeBtn} onClick={() => handleRemoveActivity(ta.id)}><FiX /></button>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className={styles.noActivities}>No activities added yet</p>
                            )}
                            <button className={`btn btn-secondary btn-sm ${styles.addActivityBtn}`} onClick={() => setShowAddActivity(stop.id)}>
                              <FiPlus /> Add Activity
                            </button>
                          </div>

                          {/* Stop dates editor */}
                          <div className={styles.stopDates}>
                            <div className="form-group">
                              <label className="form-label">Arrival</label>
                              <input type="date" className="form-input" value={stop.arrival_date} onChange={(e) => {
                                const { updateStop } = require('@/lib/data');
                                updateStop(trip.id, stop.id, { arrival_date: e.target.value });
                                loadTrip();
                              }} />
                            </div>
                            <div className="form-group">
                              <label className="form-label">Departure</label>
                              <input type="date" className="form-input" value={stop.departure_date} onChange={(e) => {
                                const { updateStop } = require('@/lib/data');
                                updateStop(trip.id, stop.id, { departure_date: e.target.value });
                                loadTrip();
                              }} />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Add Stop Button */}
              <button className={styles.addStopBtn} onClick={() => setShowAddStop(true)}>
                <div className={styles.addStopIcon}><FiPlus /></div>
                <span>Add a Stop</span>
              </button>
            </div>
          )}

          {/* ── Budget Tab ── */}
          {activeTab === 'budget' && (
            <div className={styles.budgetSection}>
              <div className={styles.budgetGrid}>
                {/* Pie Chart */}
                <div className={styles.chartCard}>
                  <h3>Cost Breakdown</h3>
                  {pieData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie data={pieData} cx="50%" cy="50%" outerRadius={100} innerRadius={50} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                          {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                        </Pie>
                        <Tooltip formatter={(v) => `₹${v.toLocaleString('en-IN')}`} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className={styles.noData}>Add expenses to see breakdown</p>
                  )}
                </div>

                {/* Summary */}
                <div className={styles.chartCard}>
                  <h3>Budget Summary</h3>
                  <div className={styles.summaryList}>
                    {Object.entries(budget.byCategory).map(([cat, amount]) => (
                      <div key={cat} className={styles.summaryItem}>
                        <span>{cat}</span>
                        <strong>₹{amount.toLocaleString('en-IN')}</strong>
                      </div>
                    ))}
                    <hr className="divider" />
                    <div className={styles.summaryItem}>
                      <strong>Total Spent</strong>
                      <strong>₹{budget.totalSpent.toLocaleString('en-IN')}</strong>
                    </div>
                    <div className={styles.summaryItem}>
                      <span>Avg. per Day</span>
                      <span>₹{budget.avgPerDay.toLocaleString('en-IN', { maximumFractionDigits: 0 })}/day</span>
                    </div>
                    <div className={`${styles.summaryItem} ${budget.isOverBudget ? styles.overBudget : ''}`}>
                      <strong>{budget.isOverBudget ? 'Over Budget' : 'Remaining'}</strong>
                      <strong>₹{Math.abs(budget.remaining).toLocaleString('en-IN')}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expenses List */}
              <div className={styles.expensesCard}>
                <div className={styles.expensesHeader}>
                  <h3>Expenses</h3>
                  <button className="btn btn-primary btn-sm" onClick={() => setShowAddExpense(true)}>
                    <FiPlus /> Add Expense
                  </button>
                </div>
                {(trip.expenses || []).length > 0 ? (
                  <div className={styles.expensesList}>
                    {(trip.expenses || []).map(exp => (
                      <div key={exp.id} className={styles.expenseItem}>
                        <div className={styles.expenseCat}><span className={`badge badge-forest`}>{exp.category}</span></div>
                        <div className={styles.expenseDesc}>
                          <strong>{exp.description}</strong>
                          <span>{formatDate(exp.expense_date)}</span>
                        </div>
                        <strong className={styles.expenseAmount}>₹{exp.amount.toLocaleString('en-IN')}</strong>
                        <button className={styles.removeBtn} onClick={() => { removeExpense(trip.id, exp.id); loadTrip(); }}><FiX /></button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={styles.noData}>No expenses recorded yet</p>
                )}
              </div>
            </div>
          )}

          {/* ── Calendar Tab ── */}
          {activeTab === 'calendar' && (
            <div className={styles.calendarSection}>
              <div className={styles.calendarHeader}>
                <h3>Trip Timeline</h3>
                <div className={styles.viewToggle}>
                  <button className={`${styles.viewBtn} ${calendarView === 'timeline' ? styles.activeView : ''}`} onClick={() => setCalendarView('timeline')}>
                    <FiList /> Timeline
                  </button>
                  <button className={`${styles.viewBtn} ${calendarView === 'calendar' ? styles.activeView : ''}`} onClick={() => setCalendarView('calendar')}>
                    <FiGrid /> Calendar
                  </button>
                </div>
              </div>

              {calendarView === 'timeline' ? (
                <div className={styles.timeline}>
                  {tripDays.map((day, i) => {
                    const stop = getStopForDate(day);
                    const city = stop ? getCity(stop.city_id) : null;
                    const acts = getActivitiesForDate(day);
                    const isFirst = i === 0 || !getStopForDate(tripDays[i - 1]) || getStopForDate(tripDays[i - 1])?.id !== stop?.id;

                    return (
                      <div key={i} className={styles.timelineDay}>
                        <div className={styles.timelineLeft}>
                          <span className={styles.dayNumber}>Day {i + 1}</span>
                          <span className={styles.dayDate}>{formatDateFull(day)}</span>
                        </div>
                        <div className={styles.timelineDot} />
                        <div className={styles.timelineContent}>
                          {isFirst && city && (
                            <div className={styles.timelineCity}>
                              <FiMapPin /> <strong>{city.name}</strong>, {city.country}
                            </div>
                          )}
                          {acts.length > 0 ? (
                            acts.map(ta => (
                              <div key={ta.id} className={styles.timelineActivity}>
                                <span className="badge badge-forest">{ta.time_slot}</span>
                                <strong>{ta.activity?.name}</strong>
                                {ta.activity?.estimated_cost > 0 && <span className={styles.timelineCost}>₹{ta.actual_cost?.toLocaleString('en-IN')}</span>}
                              </div>
                            ))
                          ) : (
                            <div className={styles.timelineFree}>
                              {stop ? 'Free day — explore on your own!' : 'Travel day'}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className={styles.calendarGrid}>
                  <div className={styles.calendarDayHeaders}>
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                      <div key={d} className={styles.calendarDayHeader}>{d}</div>
                    ))}
                  </div>
                  <div className={styles.calendarDays}>
                    {/* Offset for first day */}
                    {tripDays.length > 0 && Array.from({ length: tripDays[0].getDay() }).map((_, i) => (
                      <div key={`empty-${i}`} className={styles.calendarEmpty} />
                    ))}
                    {tripDays.map((day, i) => {
                      const stop = getStopForDate(day);
                      const city = stop ? getCity(stop.city_id) : null;
                      const acts = getActivitiesForDate(day);
                      return (
                        <div key={i} className={`${styles.calendarDay} ${stop ? styles.hasStop : ''}`}>
                          <span className={styles.calendarDayNum}>{day.getDate()}</span>
                          {city && <span className={styles.calendarCity}>{city.name}</span>}
                          {acts.length > 0 && <span className={styles.calendarActs}>{acts.length} activities</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* ── Add Stop Modal ── */}
      {showAddStop && (
        <div className="modal-overlay" onClick={() => setShowAddStop(false)}>
          <div className="modal-content animate-scale-in" onClick={e => e.stopPropagation()} style={{ maxWidth: '700px' }}>
            <div className="modal-header">
              <h3>Add a Destination</h3>
              <button className="modal-close" onClick={() => setShowAddStop(false)}>×</button>
            </div>
            <div className={styles.modalSearch}>
              <FiSearch />
              <input 
                type="text" 
                placeholder="Search any global destination (e.g. Goa, Kyoto, Zurich)..." 
                value={citySearch} 
                onChange={(e) => setCitySearch(e.target.value)} 
                autoFocus 
              />
            </div>
            <div className={styles.cityResults}>
              {/* 1. Local Database Matches */}
              {searchResults.map(city => (
                <div key={city.id} className={styles.cityResultItem} onClick={() => handleAddStop(city.id)}>
                  <img 
                    src={city.image_url} 
                    alt={city.name} 
                    onError={(e) => { e.target.src = '/images/destinations/paris.jpg'; }}
                  />
                  <div>
                    <strong>{city.name}</strong>
                    <span>{city.country} · {city.region}</span>
                  </div>
                  <div className={styles.cityMeta}>
                    <span><FiStar /> {(city.popularity_score / 20).toFixed(1)}</span>
                    <span style={{ fontWeight: 600, color: 'var(--color-forest)' }}>{getCostTierLabel(city.cost_index)}</span>
                  </div>
                  <button className="btn btn-primary btn-sm">Add</button>
                </div>
              ))}

              {/* 2. Verifying Real-World Location Spinner */}
              {searchResults.length === 0 && isVerifyingLocation && (
                <div className={styles.verifyingBox}>
                  <FiLoader className="spin" style={{ fontSize: '1.4rem' }} />
                  <div>
                    <strong>Verifying "{citySearch}" with Satellite & Geocoding Data...</strong>
                    <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.85 }}>Checking real-world coordinates and travel information.</p>
                  </div>
                </div>
              )}

              {/* 3. Verified Real-World Destination Found */}
              {searchResults.length === 0 && !isVerifyingLocation && verifiedLocation && (
                <div className={styles.verifiedCard}>
                  <div className={styles.verifiedBadge}>
                    <FiCheckCircle /> Verified Real-World Destination
                  </div>
                  <div className={styles.verifiedHeader}>
                    <img 
                      src={verifiedLocation.image_url} 
                      alt={verifiedLocation.name} 
                      onError={(e) => { e.target.src = '/images/destinations/paris.jpg'; }}
                    />
                    <div className={styles.verifiedInfo}>
                      <h4>{verifiedLocation.name}</h4>
                      <span><FiMapPin /> {verifiedLocation.country} {verifiedLocation.state ? `(${verifiedLocation.state})` : ''} · {verifiedLocation.region}</span>
                      <p>{verifiedLocation.description}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--color-cream-dark)', paddingTop: '12px' }}>
                    <div style={{ fontSize: '0.82rem', color: 'var(--color-slate)' }}>
                      <span>Lat: {verifiedLocation.latitude.toFixed(2)}°, Lon: {verifiedLocation.longitude.toFixed(2)}° · {getCostTierLabel(verifiedLocation.cost_index)}</span>
                    </div>
                    <button 
                      className="btn btn-primary"
                      onClick={() => handleAddStop(null, verifiedLocation)}
                    >
                      <FiPlus /> Add {verifiedLocation.name} to Trip
                    </button>
                  </div>
                </div>
              )}

              {/* 4. Location Does Not Exist Error Message */}
              {searchResults.length === 0 && !isVerifyingLocation && verificationError && (
                <div className={styles.notFoundBox}>
                  <h4><FiAlertTriangle /> Destination Not Found</h4>
                  <p>{verificationError}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Add Activity Modal ── */}
      {showAddActivity && (
        <div className="modal-overlay" onClick={() => setShowAddActivity(null)}>
          <div className="modal-content animate-scale-in" onClick={e => e.stopPropagation()} style={{ maxWidth: '700px' }}>
            <div className="modal-header">
              <h3>Add Activity</h3>
              <button className="modal-close" onClick={() => setShowAddActivity(null)}>×</button>
            </div>
            {(() => {
              const stop = trip.stops.find(s => s.id === showAddActivity);
              const activities = stop ? getCityActivities(stop.city_id) : [];
              const existing = (trip.activities || []).filter(a => a.stop_id === showAddActivity).map(a => a.activity_id);
              const available = activities.filter(a => !existing.includes(a.id));
              return available.length > 0 ? (
                <div className={styles.activityResults}>
                  {available.map(act => (
                    <div key={act.id} className={styles.activityResultItem}>
                      <img src={act.image_url} alt={act.name} />
                      <div className={styles.actResultInfo}>
                        <strong>{act.name}</strong>
                        <p>{act.description.substring(0, 80)}...</p>
                        <div className={styles.actResultMeta}>
                          <span className="badge badge-forest">{act.category}</span>
                          <span><FiClock /> {act.duration}</span>
                          <span><FiDollarSign /> ₹{act.estimated_cost}</span>
                          <span><FiStar /> {act.rating}</span>
                        </div>
                      </div>
                      <button className="btn btn-primary btn-sm" onClick={() => handleAddActivity(act.id, showAddActivity)}>Add</button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={styles.noData}>No more activities available for this city.</p>
              );
            })()}
          </div>
        </div>
      )}

      {/* ── Add Expense Modal ── */}
      {showAddExpense && (
        <div className="modal-overlay" onClick={() => setShowAddExpense(false)}>
          <div className="modal-content animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Expense</h3>
              <button className="modal-close" onClick={() => setShowAddExpense(false)}>×</button>
            </div>
            <form onSubmit={handleAddExpense}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select name="category" className="form-input" required>
                  <option value="Transport">Transport</option>
                  <option value="Stay">Stay</option>
                  <option value="Meals">Meals</option>
                  <option value="Activities">Activities</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Amount (₹ INR)</label>
                <input type="number" name="amount" className="form-input" placeholder="100" required min="0" step="0.01" />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <input type="text" name="description" className="form-input" placeholder="Flight ticket, hotel, etc." required />
              </div>
              <div className="form-group">
                <label className="form-label">Date</label>
                <input type="date" name="expense_date" className="form-input" defaultValue={trip.start_date} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Add Expense</button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Trip Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content animate-scale-in" onClick={e => e.stopPropagation()} style={{ maxWidth: '440px' }}>
            <div className="modal-header">
              <h3>Delete Trip</h3>
              <button className="modal-close" onClick={() => setShowDeleteModal(false)}>×</button>
            </div>
            <p style={{ margin: '16px 0 24px', color: 'var(--color-slate)' }}>
              Are you sure you want to delete <strong>&quot;{trip.name}&quot;</strong>? This action cannot be undone and will remove all associated itinerary stops and expenses.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDeleteTrip}>Yes, Delete Trip</button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default function TripDetailPage({ params }) {
  return <ToastProvider><TripDetailContent params={params} /></ToastProvider>;
}
