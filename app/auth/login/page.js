'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { loginUser, initializeData } from '@/lib/data';
import { FiGlobe, FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import styles from '../auth.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    initializeData();
    const result = loginUser(email, password);
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
        <img src="/images/destinations/santorini.jpg" alt="Travel destination" className={styles.authImage} />
        <div className={styles.authVisualOverlay} />
        <div className={styles.authVisualContent}>
          <h2>Welcome Back,<br />Explorer</h2>
          <p>Continue planning your dream adventures with GlobeTrotter.</p>
        </div>
      </div>

      <div className={styles.authForm}>
        <div className={styles.authFormInner}>
          <Link href="/" className={styles.authLogo}>
            <FiGlobe />
            <span>GlobeTrotter</span>
          </Link>

          <div className={styles.authHeader}>
            <h1>Sign In</h1>
            <p>Enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {error && <div className={styles.error}>{error}</div>}

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className={styles.inputWrapper}>
                <FiMail className={styles.inputIcon} />
                <input
                  type="email"
                  className={`form-input ${styles.iconInput}`}
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  id="login-email"
                />
              </div>
            </div>

            <div className="form-group">
              <div className={styles.labelRow}>
                <label className="form-label">Password</label>
                <a href="#" className={styles.forgotLink}>Forgot Password?</a>
              </div>
              <div className={styles.inputWrapper}>
                <FiLock className={styles.inputIcon} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={`form-input ${styles.iconInput}`}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  id="login-password"
                />
                <button
                  type="button"
                  className={styles.togglePassword}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className={`btn btn-primary btn-lg ${styles.submitBtn}`}
              disabled={loading}
              id="login-submit"
            >
              {loading ? 'Signing in...' : 'Sign In'} <FiArrowRight />
            </button>
          </form>

          <p className={styles.authSwitch}>
            Don't have an account?{' '}
            <Link href="/auth/signup">Create one for free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
