import { useState, useId } from 'react';
import { authService } from '../services/authService';
import { userService } from '../services/userService';
import { useNavigate, Link } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { motion } from 'framer-motion';
import { Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/Auth.module.css';

// ─── Static Maps ─────────────────────────────────────────────────────────────

const ROLE_ROUTES = {
  student: '/student-dashboard',
  school: '/school-dashboard',
  company: '/company-dashboard',
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const { googleLogin } = useAuth();
  const navigate = useNavigate();

  // Stable IDs for label ↔ input association
  const emailId = useId();
  const passwordId = useId();

  const redirectByRole = async (uid) => {
    const profile = await userService.getUserProfile(uid);
    const route = ROLE_ROUTES[profile?.role] ?? '/student-dashboard';
    navigate(route);
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authService.login(email, password);
      await redirectByRole(res.user.uid);
    } catch (err) {
      setError(getFriendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      const res = await googleLogin();
      await redirectByRole(res.user.uid);
    } catch (err) {
      setError(getFriendlyError(err.code));
    } finally {
      setGoogleLoading(false);
    }
  };

  const isDisabled = loading || googleLoading;

  return (
    <div className={styles.authContainer}>
      <motion.div
        className={styles.authCard}
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
      >
        {/* Branding */}
        <div className={styles.cardHeader}>
          <div className={styles.brandMark} aria-hidden="true">C</div>
          <h1 className={styles.cardTitle}>Welcome back</h1>
          <p className={styles.cardSubtitle}>Sign in to your Careerly account</p>
        </div>

        {/* Inline error banner */}
        {error && (
          <div className={styles.errorBanner} role="alert" aria-live="polite">
            <AlertCircle size={16} aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleEmailLogin} noValidate>
          <fieldset disabled={isDisabled} className={styles.fieldset}>
            {/* Email */}
            <div className={styles.inputGroup}>
              <label htmlFor={emailId} className={styles.inputLabel}>
                Email address
              </label>
              <input
                id={emailId}
                className={styles.inputField}
                type="email"
                placeholder="name@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                aria-required="true"
              />
            </div>

            {/* Password */}
            <div className={styles.inputGroup}>
              <div className={styles.labelRow}>
                <label htmlFor={passwordId} className={styles.inputLabel}>
                  Password
                </label>
                <button type="button" className={styles.forgotLink} tabIndex={0}>
                  Forgot password?
                </button>
              </div>
              <div className={styles.passwordWrap}>
                <input
                  id={passwordId}
                  className={styles.inputField}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  aria-required="true"
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={0}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </fieldset>

          {/* Submit */}
          <button
            type="submit"
            className={styles.primaryBtn}
            disabled={isDisabled}
            aria-busy={loading}
          >
            {loading ? (
              <span className={styles.btnSpinner} aria-hidden="true" />
            ) : (
              <LogIn size={17} aria-hidden="true" />
            )}
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div className={styles.divider} role="separator">
          <span>or</span>
        </div>

        <button
          type="button"
          className={styles.googleBtn}
          onClick={handleGoogleLogin}
          disabled={isDisabled}
          aria-busy={googleLoading}
        >
          {googleLoading ? (
            <span className={styles.btnSpinnerDark} aria-hidden="true" />
          ) : (
            <FcGoogle size={20} aria-hidden="true" />
          )}
          {googleLoading ? 'Connecting…' : 'Continue with Google'}
        </button>

        <p className={styles.switchText}>
          Don&apos;t have an account?{' '}
          <Link to="/register" className={styles.switchLink}>
            Create a free account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Maps Firebase error codes to user-friendly messages.
 * Never expose raw Firebase error strings to the user.
 */
function getFriendlyError(code) {
  const map = {
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/invalid-credential': 'Invalid email or password. Please check and try again.',
    'auth/too-many-requests': 'Too many failed attempts. Please wait a few minutes and try again.',
    'auth/user-disabled': 'This account has been disabled. Please contact support.',
    'auth/popup-closed-by-user': 'Google sign-in was cancelled.',
    'auth/network-request-failed': 'A network error occurred. Please check your connection.',
  };
  return map[code] ?? 'Something went wrong. Please try again.';
}