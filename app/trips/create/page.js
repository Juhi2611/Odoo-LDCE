'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { ToastProvider, useToast } from '@/components/Toast';
import { getCurrentUser, createTrip, CITIES, ACTIVITIES } from '@/lib/data';
import { 
  FiArrowLeft, 
  FiArrowRight, 
  FiCalendar, 
  FiDollarSign, 
  FiImage, 
  FiMapPin, 
  FiCheck, 
  FiZap, 
  FiCompass, 
  FiHeart, 
  FiAward, 
  FiTrendingUp 
} from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';
import styles from './page.module.css';

const AI_VIBES = [
  { id: 'heritage', icon: '🏛️', title: 'Culture & Heritage', desc: 'Ancient monuments, art galleries & history' },
  { id: 'adventure', icon: '🏔️', title: 'Adventure & Thrills', desc: 'Hiking, outdoor exploration & nature' },
  { id: 'romantic', icon: '💕', title: 'Romantic Getaway', desc: 'Sunset cruises, boutique stays & dining' },
  { id: 'budget', icon: '🎒', title: 'Budget Backpacking', desc: 'Smart spending, street food & hostels' },
  { id: 'luxury', icon: '💎', title: 'Luxury & Relaxation', desc: '5-star resorts, private tours & spas' },
  { id: 'foodie', icon: '🍜', title: 'Culinary Journey', desc: 'Cooking classes, night markets & cafes' },
];

const AI_REGIONS = [
  { id: 'india', flag: '🇮🇳', name: 'Incredible India', subtitle: 'Jaipur, Goa, Delhi, Agra', cityIds: [21, 21, 11], cover: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800' },
  { id: 'europe', flag: '🇪🇺', name: 'Classic Europe', subtitle: 'Paris, Santorini, Rome', cityIds: [1, 4, 8], cover: '/images/destinations/paris.jpg' },
  { id: 'asia', flag: '🇯🇵', name: 'Far East Wonders', subtitle: 'Tokyo, Kyoto, Bali', cityIds: [2, 12, 3], cover: '/images/destinations/tokyo.jpg' },
  { id: 'middle_east', flag: '🏜️', name: 'Arabian & Desert Magic', subtitle: 'Dubai, Marrakech', cityIds: [7, 11], cover: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800' },
];

function CreateTripContent() {
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState('ai'); // 'ai' or 'manual'
  const [step, setStep] = useState(1);
  
  // Manual Form State
  const [form, setForm] = useState({
    name: '', description: '', start_date: '', end_date: '', total_budget: '',
    cover_image: '/images/destinations/paris.jpg', is_public: false,
  });

  // AI Architect State
  const [aiVibe, setAiVibe] = useState('heritage');
  const [aiRegion, setAiRegion] = useState('europe');
  const [aiDuration, setAiDuration] = useState(7);
  const [aiBudget, setAiBudget] = useState(120000);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiStepText, setAiStepText] = useState('');

  const [error, setError] = useState('');
  const router = useRouter();
  const addToast = useToast();

  useEffect(() => {
    const u = getCurrentUser();
    if (!u) { router.push('/auth/login'); return; }
    setUser(u);
  }, [router]);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const coverOptions = [
    '/images/destinations/paris.jpg',
    '/images/destinations/tokyo.jpg',
    '/images/destinations/bali.jpg',
    '/images/destinations/santorini.jpg',
    ...CITIES.slice(4, 12).map(c => c.image_url),
  ];

  const nextStep = () => {
    if (step === 1) {
      if (!form.name) { setError('Trip name is required'); return; }
      setError('');
    }
    if (step === 2) {
      if (!form.start_date || !form.end_date) { setError('Please select both dates'); return; }
      if (new Date(form.end_date) <= new Date(form.start_date)) { setError('End date must be after start date'); return; }
      setError('');
    }
    setStep(step + 1);
  };

  const handleCreate = () => {
    const result = createTrip({
      ...form,
      total_budget: parseFloat(form.total_budget) || 0,
    });
    if (result.error) {
      setError(result.error);
      return;
    }
    addToast('Trip created successfully!', 'success');
    setTimeout(() => router.push(`/trips/${result.trip.id}`), 300);
  };

  // ── AI Magic Generator Execution ────────────────
  const handleGenerateAI = async () => {
    setIsGenerating(true);
    setError('');

    const steps = [
      'Scanning top global destinations & routes...',
      'Matching curated attractions with your travel vibe...',
      'Optimizing multi-city timeline & activity time slots...',
      'Calculating daily budget allocations in ₹ INR...',
      'Finalizing your AI itinerary...'
    ];

    for (let i = 0; i < steps.length; i++) {
      setAiStepText(steps[i]);
      await new Promise(r => setTimeout(r, 350));
    }

    try {
      const selectedRegion = AI_REGIONS.find(r => r.id === aiRegion) || AI_REGIONS[0];
      const selectedVibeObj = AI_VIBES.find(v => v.id === aiVibe) || AI_VIBES[0];

      // Calculate start and end dates (starts in 14 days)
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + 14);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + aiDuration);

      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];

      // Select cities for the stops
      const stopCities = selectedRegion.cityIds.map(id => CITIES.find(c => c.id === id) || CITIES[0]);
      const daysPerCity = Math.max(2, Math.floor(aiDuration / stopCities.length));

      const generatedStops = [];
      const generatedActivities = [];
      const generatedExpenses = [];

      let currentDate = new Date(startDate);

      stopCities.forEach((city, index) => {
        const stopId = `stop-ai-${Date.now()}-${index}`;
        const arrivalStr = currentDate.toISOString().split('T')[0];
        
        currentDate.setDate(currentDate.getDate() + daysPerCity);
        const departureStr = currentDate.toISOString().split('T')[0];

        const budgetAllocated = Math.round(aiBudget / stopCities.length);

        generatedStops.push({
          id: stopId,
          city_id: city.id,
          arrival_date: arrivalStr,
          departure_date: departureStr,
          order_index: index,
          budget_allocated: budgetAllocated,
          notes: `${selectedVibeObj.title} stop in ${city.name}.`
        });

        // Pull top 2 activities for this city
        const cityActs = ACTIVITIES.filter(a => a.city_id === city.id).slice(0, 2);
        cityActs.forEach((act, actIdx) => {
          const actDate = new Date(arrivalStr);
          actDate.setDate(actDate.getDate() + (actIdx + 1));
          
          generatedActivities.push({
            id: `ta-ai-${Date.now()}-${index}-${actIdx}`,
            stop_id: stopId,
            activity_id: act.id,
            scheduled_date: actDate.toISOString().split('T')[0],
            time_slot: actIdx === 0 ? 'Morning' : 'Evening',
            actual_cost: act.estimated_cost * 85 || 1200,
            notes: `${selectedVibeObj.title} experience in ${city.name}`,
            order_index: actIdx
          });
        });

        // Add typical expense for stay & transport
        generatedExpenses.push({
          id: `exp-ai-${Date.now()}-${index}-1`,
          stop_id: stopId,
          category: 'Stay',
          amount: Math.round(budgetAllocated * 0.45),
          description: `Hotel stay in ${city.name} (${daysPerCity} nights)`,
          expense_date: arrivalStr
        });
        generatedExpenses.push({
          id: `exp-ai-${Date.now()}-${index}-2`,
          stop_id: stopId,
          category: 'Transport',
          amount: Math.round(budgetAllocated * 0.25),
          description: `Transit to ${city.name}`,
          expense_date: arrivalStr
        });
      });

      const tripName = `${selectedVibeObj.title} across ${selectedRegion.name}`;
      const tripDesc = `A custom ${aiDuration}-day AI-crafted ${selectedVibeObj.title.toLowerCase()} itinerary exploring ${stopCities.map(c => c.name).join(', ')} with balanced pacing and curated experiences.`;

      const result = createTrip({
        name: tripName,
        description: tripDesc,
        start_date: startDateStr,
        end_date: endDateStr,
        cover_image: selectedRegion.cover,
        total_budget: aiBudget,
        is_public: true,
        stops: generatedStops,
        activities: generatedActivities,
        expenses: generatedExpenses,
      });

      if (result.error) {
        setError(result.error);
        setIsGenerating(false);
        return;
      }

      addToast('✨ AI Itinerary generated successfully!', 'success');
      setTimeout(() => router.push(`/trips/${result.trip.id}`), 400);

    } catch (err) {
      console.error(err);
      setError('Failed to generate AI trip. Please try again.');
      setIsGenerating(false);
    }
  };

  if (!user) return null;

  return (
    <>
      <Navbar />
      <main className={styles.page}>
        <div className="container">
          <Link href="/trips" className={styles.backLink}>
            <FiArrowLeft /> Back to My Trips
          </Link>

          <div className={styles.createCard}>
            {/* Mode Switcher */}
            <div className={styles.modeTabs}>
              <button
                type="button"
                className={`${styles.modeTab} ${mode === 'ai' ? styles.activeModeTab : ''}`}
                onClick={() => setMode('ai')}
              >
                <HiSparkles style={{ color: 'var(--color-gold)' }} />
                <span>AI Smart Architect</span>
                <span className={styles.aiBadge}>1-Click</span>
              </button>
              <button
                type="button"
                className={`${styles.modeTab} ${mode === 'manual' ? styles.activeModeTab : ''}`}
                onClick={() => setMode('manual')}
              >
                <FiCalendar />
                <span>Custom Manual Wizard</span>
              </button>
            </div>

            {/* ── AI ARCHITECT PANEL ── */}
            {mode === 'ai' && (
              <div className={styles.aiPanel}>
                {isGenerating ? (
                  <div className={styles.aiLoadingOverlay}>
                    <div className={styles.aiSpinner} />
                    <h3 className={styles.aiLoadingText}>Crafting Your Personalized Journey</h3>
                    <p className={styles.aiLoadingStep}>⚡ {aiStepText}</p>
                  </div>
                ) : (
                  <>
                    <div className={styles.aiHeader}>
                      <span className="section-label">AI Itinerary Generator</span>
                      <h2>Where does your soul want to travel?</h2>
                      <p>Select your travel vibe, region, and budget — our AI will orchestrate the complete multi-stop schedule in seconds.</p>
                    </div>

                    {error && <div className={styles.error}>{error}</div>}

                    {/* 1. Travel Vibe */}
                    <div className="form-group">
                      <label className="form-label">1. Choose Your Travel Vibe</label>
                      <div className={styles.vibeGrid}>
                        {AI_VIBES.map(v => (
                          <div
                            key={v.id}
                            className={`${styles.vibeCard} ${aiVibe === v.id ? styles.vibeSelected : ''}`}
                            onClick={() => setAiVibe(v.id)}
                          >
                            <span className={styles.vibeIcon}>{v.icon}</span>
                            <span className={styles.vibeTitle}>{v.title}</span>
                            <span className={styles.vibeDesc}>{v.desc}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 2. Destination Region */}
                    <div className="form-group">
                      <label className="form-label">2. Select Destination Route</label>
                      <div className={styles.regionGrid}>
                        {AI_REGIONS.map(r => (
                          <div
                            key={r.id}
                            className={`${styles.regionCard} ${aiRegion === r.id ? styles.regionSelected : ''}`}
                            onClick={() => setAiRegion(r.id)}
                          >
                            <span className={styles.regionFlag}>{r.flag}</span>
                            <div className={styles.regionInfo}>
                              <strong>{r.name}</strong>
                              <span>{r.subtitle}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 3. Duration & Budget */}
                    <div className={styles.aiInputsGrid}>
                      <div className="form-group">
                        <label className="form-label">3. Duration ({aiDuration} Days)</label>
                        <div className={styles.durationChips}>
                          {[3, 5, 7, 10, 14].map(d => (
                            <button
                              key={d}
                              type="button"
                              className={`${styles.durationChip} ${aiDuration === d ? styles.durationChipSelected : ''}`}
                              onClick={() => setAiDuration(d)}
                            >
                              {d} Days
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">4. Target Budget (₹ INR)</label>
                        <input
                          type="number"
                          className="form-input"
                          value={aiBudget}
                          onChange={(e) => setAiBudget(parseInt(e.target.value) || 0)}
                          step="5000"
                          min="10000"
                        />
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-slate)', marginTop: '4px', display: 'block' }}>
                          ≈ ₹{(aiBudget / aiDuration).toFixed(0)}/day estimated spending
                        </span>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="button"
                      className="btn btn-primary btn-lg"
                      style={{ width: '100%', gap: '8px', boxShadow: '0 8px 24px rgba(27,67,50,0.3)' }}
                      onClick={handleGenerateAI}
                    >
                      <HiSparkles style={{ color: 'var(--color-gold)' }} />
                      <span>Generate Smart Itinerary with AI</span>
                    </button>
                  </>
                )}
              </div>
            )}

            {/* ── MANUAL WIZARD PANEL ── */}
            {mode === 'manual' && (
              <>
                <div className={styles.progress}>
                  {[1, 2, 3].map(s => (
                    <div key={s} className={`${styles.progressStep} ${step >= s ? styles.activeStep : ''}`}>
                      <div className={styles.progressDot}>
                        {step > s ? <FiCheck /> : s}
                      </div>
                      <span>{s === 1 ? 'Basics' : s === 2 ? 'Dates' : 'Details'}</span>
                    </div>
                  ))}
                  <div className={styles.progressLine}>
                    <div className={styles.progressFill} style={{ width: `${((step - 1) / 2) * 100}%` }} />
                  </div>
                </div>

                <div className={styles.formContent}>
                  {error && <div className={styles.error}>{error}</div>}

                  {step === 1 && (
                    <div className={styles.stepContent}>
                      <div className={styles.stepHeader}>
                        <span className="section-label">Step 1 of 3</span>
                        <h2>Name Your Adventure</h2>
                        <p>Give your trip a memorable name and brief description.</p>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Trip Name *</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. Summer in Southern Italy, Tokyo Food Odyssey"
                          value={form.name}
                          onChange={update('name')}
                          autoFocus
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea
                          className="form-textarea"
                          placeholder="What's the inspiration for this trip? Any special goals or companions?"
                          value={form.description}
                          onChange={update('description')}
                          rows={4}
                        />
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className={styles.stepContent}>
                      <div className={styles.stepHeader}>
                        <span className="section-label">Step 2 of 3</span>
                        <h2>When Are You Traveling?</h2>
                        <p>Set your travel dates and estimated overall budget.</p>
                      </div>

                      <div className={styles.dateRow}>
                        <div className="form-group">
                          <label className="form-label">Start Date *</label>
                          <input
                            type="date"
                            className="form-input"
                            value={form.start_date}
                            onChange={update('start_date')}
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">End Date *</label>
                          <input
                            type="date"
                            className="form-input"
                            value={form.end_date}
                            onChange={update('end_date')}
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Total Budget (₹ INR)</label>
                        <input
                          type="number"
                          className="form-input"
                          placeholder="e.g. 150000"
                          value={form.total_budget}
                          onChange={update('total_budget')}
                        />
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className={styles.stepContent}>
                      <div className={styles.stepHeader}>
                        <span className="section-label">Step 3 of 3</span>
                        <h2>Personalize Your Trip</h2>
                        <p>Choose a cover image and privacy setting.</p>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Cover Image</label>
                        <div className={styles.coverGrid}>
                          {coverOptions.map((url, i) => (
                            <button
                              key={i}
                              type="button"
                              className={`${styles.coverOption} ${form.cover_image === url ? styles.coverSelected : ''}`}
                              onClick={() => setForm({ ...form, cover_image: url })}
                            >
                              <img src={url} alt={`Cover option ${i + 1}`} />
                              {form.cover_image === url && (
                                <div className={styles.coverCheck}><FiCheck /></div>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="form-group" style={{ marginTop: '20px' }}>
                        <label className={styles.checkboxLabel}>
                          <input
                            type="checkbox"
                            checked={form.is_public}
                            onChange={(e) => setForm({ ...form, is_public: e.target.checked })}
                          />
                          <div className={styles.checkmark} />
                          <div>
                            <strong>Make this trip public</strong>
                            <p>Anyone with the share link can view this itinerary and clone it into their account.</p>
                          </div>
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                <div className={styles.actions}>
                  {step > 1 && (
                    <button type="button" className="btn btn-secondary" onClick={() => setStep(step - 1)}>
                      <FiArrowLeft /> Back
                    </button>
                  )}
                  <div style={{ flex: 1 }} />
                  {step < 3 ? (
                    <button type="button" className="btn btn-primary" onClick={nextStep}>
                      Continue <FiArrowRight />
                    </button>
                  ) : (
                    <button type="button" className="btn btn-primary btn-lg" onClick={handleCreate}>
                      <FiCheck /> Create Itinerary
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

export default function CreateTripPage() {
  return (
    <ToastProvider>
      <CreateTripContent />
    </ToastProvider>
  );
}
