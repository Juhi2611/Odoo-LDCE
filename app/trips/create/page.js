'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { ToastProvider, useToast } from '@/components/Toast';
import { getCurrentUser, createTrip, CITIES } from '@/lib/data';
import { FiArrowLeft, FiArrowRight, FiCalendar, FiDollarSign, FiImage, FiMapPin, FiCheck } from 'react-icons/fi';
import styles from './page.module.css';

function CreateTripContent() {
  const [user, setUser] = useState(null);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '', description: '', start_date: '', end_date: '', total_budget: '',
    cover_image: '/images/destinations/paris.jpg', is_public: false,
  });
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

  if (!user) return null;

  const totalSteps = 3;

  return (
    <>
      <Navbar />
      <main className={styles.page}>
        <div className="container">
          <Link href="/trips" className={styles.backLink}>
            <FiArrowLeft /> Back to My Trips
          </Link>

          <div className={styles.createCard}>
            {/* Progress */}
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
                <div className={styles.progressFill} style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }} />
              </div>
            </div>

            <div className={styles.formContent}>
              {error && <div className={styles.error}>{error}</div>}

              {/* Step 1: Basics */}
              {step === 1 && (
                <div className={styles.stepContent}>
                  <div className={styles.stepHeader}>
                    <span className="section-label">Step 1 of 3</span>
                    <h2>Name Your Adventure</h2>
                    <p>Give your trip a memorable name and description.</p>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Trip Name *</label>
                    <input type="text" className="form-input" placeholder="e.g. European Dream, Asian Adventure..." value={form.name} onChange={update('name')} id="create-trip-name" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea className="form-input" placeholder="Describe your dream trip..." value={form.description} onChange={update('description')} rows={4} id="create-trip-desc" />
                  </div>
                </div>
              )}

              {/* Step 2: Dates */}
              {step === 2 && (
                <div className={styles.stepContent}>
                  <div className={styles.stepHeader}>
                    <span className="section-label">Step 2 of 3</span>
                    <h2>Pick Your Dates</h2>
                    <p>When do you want to travel?</p>
                  </div>
                  <div className={styles.dateRow}>
                    <div className="form-group">
                      <label className="form-label"><FiCalendar /> Start Date *</label>
                      <input type="date" className="form-input" value={form.start_date} onChange={update('start_date')} id="create-trip-start" />
                    </div>
                    <div className="form-group">
                      <label className="form-label"><FiCalendar /> End Date *</label>
                      <input type="date" className="form-input" value={form.end_date} onChange={update('end_date')} id="create-trip-end" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label"><FiDollarSign /> Total Budget (₹ INR)</label>
                    <input type="number" className="form-input" placeholder="e.g. 50000" value={form.total_budget} onChange={update('total_budget')} id="create-trip-budget" />
                  </div>
                </div>
              )}

              {/* Step 3: Details */}
              {step === 3 && (
                <div className={styles.stepContent}>
                  <div className={styles.stepHeader}>
                    <span className="section-label">Step 3 of 3</span>
                    <h2>Final Touches</h2>
                    <p>Choose a cover photo and visibility settings.</p>
                  </div>
                  <div className="form-group">
                    <label className="form-label"><FiImage /> Cover Photo</label>
                    <div className={styles.coverGrid}>
                      {coverOptions.map((img, i) => (
                        <button
                          key={i}
                          className={`${styles.coverOption} ${form.cover_image === img ? styles.coverSelected : ''}`}
                          onClick={() => setForm({ ...form, cover_image: img })}
                        >
                          <img src={img} alt={`Cover ${i + 1}`} />
                          {form.cover_image === img && <div className={styles.coverCheck}><FiCheck /></div>}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="form-group">
                    <label className={styles.checkboxLabel}>
                      <input type="checkbox" checked={form.is_public} onChange={(e) => setForm({ ...form, is_public: e.target.checked })} />
                      <span className={styles.checkmark} />
                      <div>
                        <strong>Make trip public</strong>
                        <p>Allow others to view and get inspired by your itinerary</p>
                      </div>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className={styles.actions}>
              {step > 1 && (
                <button className="btn btn-secondary" onClick={() => setStep(step - 1)}>
                  <FiArrowLeft /> Previous
                </button>
              )}
              <div style={{ flex: 1 }} />
              {step < totalSteps ? (
                <button className="btn btn-primary" onClick={nextStep}>
                  Next Step <FiArrowRight />
                </button>
              ) : (
                <button className="btn btn-primary btn-lg" onClick={handleCreate} id="create-trip-submit">
                  Create Trip <FiArrowRight />
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default function CreateTripPage() {
  return <ToastProvider><CreateTripContent /></ToastProvider>;
}
