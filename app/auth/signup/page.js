'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signupUser, initializeData } from '@/lib/data';
import { FiGlobe, FiMail, FiLock, FiUser, FiMapPin, FiEye, FiEyeOff, FiArrowRight, FiPhone } from 'react-icons/fi';
import styles from '../auth.module.css';

export default function SignupPage() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '', city: '', country: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!form.firstName || !form.email || !form.password) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    initializeData();
    const result = signupUser(form);
    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setTimeout(() => router.push('/dashboard'), 500);
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.authVisual}>
        <img src="/images/destinations/bali.jpg" alt="Travel destination" className={styles.authImage} />
        <div className={styles.authVisualOverlay} />
        <div className={styles.authVisualContent}>
          <h2>Start Your<br />Adventure</h2>
          <p>Join thousands of travelers planning extraordinary journeys.</p>
        </div>
      </div>

      <div className={styles.authForm}>
        <div className={styles.authFormInner}>
          <Link href="/" className={styles.authLogo}>
            <FiGlobe />
            <span>GlobeTrotter</span>
          </Link>

          <div className={styles.authHeader}>
            <h1>Create Account</h1>
            <p>Fill in your details to get started</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.formRow}>
              <div className="form-group">
                <label className="form-label">First Name *</label>
                <div className={styles.inputWrapper}>
                  <FiUser className={styles.inputIcon} />
                  <input type="text" className={`form-input ${styles.iconInput}`} placeholder="John" value={form.firstName} onChange={update('firstName')} id="signup-first-name" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <div className={styles.inputWrapper}>
                  <FiUser className={styles.inputIcon} />
                  <input type="text" className={`form-input ${styles.iconInput}`} placeholder="Doe" value={form.lastName} onChange={update('lastName')} id="signup-last-name" />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <div className={styles.inputWrapper}>
                <FiMail className={styles.inputIcon} />
                <input type="email" className={`form-input ${styles.iconInput}`} placeholder="you@example.com" value={form.email} onChange={update('email')} id="signup-email" />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <div className={styles.inputWrapper}>
                  <FiPhone className={styles.inputIcon} />
                  <input type="tel" className={`form-input ${styles.iconInput}`} placeholder="+91 98765 43210" value={form.phone} onChange={update('phone')} id="signup-phone" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">City</label>
                <div className={styles.inputWrapper}>
                  <FiMapPin className={styles.inputIcon} />
                  <input type="text" className={`form-input ${styles.iconInput}`} placeholder="Mumbai" value={form.city} onChange={update('city')} id="signup-city" />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Country</label>
              <div className={styles.inputWrapper}>
                <FiMapPin className={styles.inputIcon} />
                <input type="text" className={`form-input ${styles.iconInput}`} placeholder="India" value={form.country} onChange={update('country')} id="signup-country" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password *</label>
              <div className={styles.inputWrapper}>
                <FiLock className={styles.inputIcon} />
                <input type={showPassword ? 'text' : 'password'} className={`form-input ${styles.iconInput}`} placeholder="Min. 6 characters" value={form.password} onChange={update('password')} id="signup-password" />
                <button type="button" className={styles.togglePassword} onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <div className={styles.additionalInfo}>
              <p className={styles.termsText}>
                By creating an account, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>

            <button type="submit" className={`btn btn-primary btn-lg ${styles.submitBtn}`} disabled={loading} id="signup-submit">
              {loading ? 'Creating Account...' : 'Create Account'} <FiArrowRight />
            </button>
          </form>

          <p className={styles.authSwitch}>
            Already have an account?{' '}
            <Link href="/auth/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
