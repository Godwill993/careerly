import { useState, useEffect, useCallback, useId, useRef } from 'react';
import { authService } from '../services/authService';
import { userService } from '../services/userService';
import { schoolService } from '../services/schoolService';
import { orgService } from '../services/orgService';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UploadCloud,
  CheckCircle2,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  UserCircle2,
} from 'lucide-react';
import styles from '../styles/Auth.module.css';

// ─── Static Maps (module-scope — never recreated on render) ──────────────────

const ROLE_CONFIG = {
  student: { label: 'Student / Candidate', namePlaceholder: 'Full name' },
  school:  { label: 'Academic Institution', namePlaceholder: 'Institution name' },
  company: { label: 'Industry Partner',     namePlaceholder: 'Company or partner name' },
};

const VALID_ROLES = Object.keys(ROLE_CONFIG);

// ─── Sub-component: Step Indicator ───────────────────────────────────────────

function StepIndicator({ current, total }) {
  return (
    <div className={styles.stepIndicator} aria-label={`Step ${current} of ${total}`}>
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`${styles.stepDot} ${i + 1 <= current ? styles.stepDotActive : ''}`}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Register() {
  const [searchParams] = useSearchParams();
  const rawRole = searchParams.get('role') ?? 'student';
  const initialRole = VALID_ROLES.includes(rawRole) ? rawRole : 'student';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: initialRole,
    orgId: '',
    department: '',
  });

  const [legalDoc, setLegalDoc] = useState(null); // eslint-disable-line no-unused-vars
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // UX State
  const [step, setStep] = useState(1);
  const [createdUid, setCreatedUid] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  // Data
  const [schools, setSchools] = useState([]);
  const [departments, setDepartments] = useState([]);

  const navigate = useNavigate();

  // Stable IDs for label ↔ input association
  const nameId = useId();
  const emailId = useId();
  const passwordId = useId();
  const roleId = useId();
  const schoolId_ = useId();
  const deptId = useId();
  const avatarInputId = useId();

  // Ref to revoke blob URL on cleanup / file change
  const blobUrlRef = useRef(null);

  // ─── Data Loading ───────────────────────────────────────────────────────────

  useEffect(() => {
    schoolService.getAllSchools().then(setSchools).catch((err) => {
      console.error("Critical: Failed to load schools for registration:", err);
    });
  }, []);

  useEffect(() => {
    if (formData.role === 'student' && formData.orgId) {
      schoolService.getDepartments(formData.orgId).then(setDepartments).catch(() => {
        setDepartments([]);
      });
    } else {
      setDepartments([]);
    }
  }, [formData.orgId, formData.role]);

  // ─── Cleanup blob URL on unmount ────────────────────────────────────────────

  useEffect(() => {
    return () => {
      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
    };
  }, []);

  // ─── Handlers ───────────────────────────────────────────────────────────────

  const updateField = useCallback((field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  }, []);

  const handleAvatarChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Revoke previous blob to prevent memory leak
    if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);

    const url = URL.createObjectURL(file);
    blobUrlRef.current = url;
    setAvatar(file);
    setAvatarPreview(url);
  }, []);

  const handleInitialRegister = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (formData.role === 'student' && (!formData.orgId || !formData.department)) {
      setError('Please select your academic institution and department.');
      return;
    }

    setIsProcessing(true);
    try {
      const res = await authService.register(formData.email, formData.password);

      const userData = {
        displayName: formData.name,
        email: formData.email,
        role: formData.role,
      };

      if (formData.role === 'student') {
        userData.orgId = formData.orgId;
        userData.department = formData.department;
        userData.courses = [];
      }

      if (['school', 'company'].includes(formData.role)) {
        // Create the Organization entity first as per data model
        const orgType = formData.role === 'school' ? 'academic' : 'industry';
        const org = await orgService.createOrganization({
            name: formData.name,
            type: orgType,
            email: formData.email
        });
        userData.orgId = org.id;
        userData.verified = false;
        userData.documentUploadedAt = new Date().toISOString();
      }

      await userService.createUserProfile(res.user.uid, userData);
      setCreatedUid(res.user.uid);
      setStep(2);
    } catch (err) {
      setError(getFriendlyError(err.code));
    } finally {
      setIsProcessing(false);
    }
  };

  const finalizeRegistration = async () => {
    setIsProcessing(true);
    try {
      if (avatar && createdUid) {
        await userService.uploadProfilePicture(createdUid, avatar);
      }
    } catch (err) {
      // Non-fatal: avatar upload failure should not block access to dashboard
      console.error('Avatar upload failed:', err);
    } finally {
      navigate(`/${formData.role}-dashboard`);
    }
  };

  // ─── Derived ────────────────────────────────────────────────────────────────

  const roleConfig = ROLE_CONFIG[formData.role];

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className={styles.authContainer}>
      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div
            key="step1"
            className={styles.authCard}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.45, type: 'spring', stiffness: 110 }}
          >
            {/* Card header */}
            <div className={styles.cardHeader}>
              <div className={styles.brandMark} aria-hidden="true">C</div>
              <h1 className={styles.cardTitle}>Join the Ecosystem</h1>
              <p className={styles.cardSubtitle}>Choose your role to get started</p>
              <StepIndicator current={1} total={2} />
            </div>

            {/* Error banner */}
            {error && (
              <div className={styles.errorBanner} role="alert" aria-live="polite">
                <AlertCircle size={16} aria-hidden="true" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleInitialRegister} noValidate>
              <fieldset disabled={isProcessing} className={styles.fieldset}>

                {/* Role selector */}
                <div className={styles.inputGroup}>
                  <label htmlFor={roleId} className={styles.inputLabel}>Your role</label>
                  <select
                    id={roleId}
                    className={styles.select}
                    value={formData.role}
                    onChange={updateField('role')}
                  >
                    <option value="student">Student / Candidate</option>
                    <option value="school">Academic Institution</option>
                    <option value="company">Industry Partner</option>
                  </select>
                </div>

                {/* Name */}
                <div className={styles.inputGroup}>
                  <label htmlFor={nameId} className={styles.inputLabel}>
                    {roleConfig.namePlaceholder === 'Full name' ? 'Full name' : roleConfig.namePlaceholder}
                  </label>
                  <input
                    id={nameId}
                    className={styles.inputField}
                    type="text"
                    placeholder={roleConfig.namePlaceholder}
                    value={formData.name}
                    onChange={updateField('name')}
                    autoComplete="name"
                    required
                    aria-required="true"
                  />
                </div>

                {/* Email */}
                <div className={styles.inputGroup}>
                  <label htmlFor={emailId} className={styles.inputLabel}>
                    {formData.role === 'student' ? 'Student email' : 'Corporate / institutional email'}
                  </label>
                  <input
                    id={emailId}
                    className={styles.inputField}
                    type="email"
                    placeholder={formData.role === 'student' ? 'name@university.edu' : 'name@company.com'}
                    value={formData.email}
                    onChange={updateField('email')}
                    autoComplete="email"
                    required
                    aria-required="true"
                  />
                </div>

                {/* Password */}
                <div className={styles.inputGroup}>
                  <label htmlFor={passwordId} className={styles.inputLabel}>
                    Password <span className={styles.labelHint}>(min. 6 characters)</span>
                  </label>
                  <div className={styles.passwordWrap}>
                    <input
                      id={passwordId}
                      className={styles.inputField}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={updateField('password')}
                      autoComplete="new-password"
                      minLength={6}
                      required
                      aria-required="true"
                    />
                    <button
                      type="button"
                      className={styles.eyeBtn}
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Student-specific: school & department */}
                <AnimatePresence mode="popLayout">
                  {formData.role === 'student' && (
                    <motion.div
                      key="student-fields"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className={styles.conditionalFields}
                    >
                      <div className={styles.inputGroup}>
                        <label htmlFor={schoolId_} className={styles.inputLabel}>
                          Academic institution
                        </label>
                        <select
                          id={schoolId_}
                          className={styles.select}
                          value={formData.orgId}
                          onChange={updateField('orgId')}
                          required
                          aria-required="true"
                        >
                          <option value="">Select your institution</option>
                          {schools.map((school) => (
                            <option key={school.id} value={school.id}>
                              {school.name || school.displayName || school.email || 'Unnamed School'}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className={styles.inputGroup}>
                        <label htmlFor={deptId} className={styles.inputLabel}>
                          Department / faculty
                        </label>
                        <select
                          id={deptId}
                          className={styles.select}
                          value={formData.department}
                          onChange={updateField('department')}
                          disabled={!formData.orgId}
                          required
                          aria-required="true"
                        >
                          <option value="">
                            {formData.orgId ? 'Select your department' : 'Select an institution first'}
                          </option>
                          {departments.map((dep) => (
                            <option key={dep.id} value={dep.name}>{dep.name}</option>
                          ))}
                        </select>
                      </div>
                    </motion.div>
                  )}

                  {/* Institution / Company: legal doc (disabled, placeholder for future) */}
                  {['school', 'company'].includes(formData.role) && (
                    <motion.div
                      key="institution-fields"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className={styles.conditionalFields}
                    >
                      <div className={`${styles.inputGroup} ${styles.disabledGroup}`}>
                        <label className={styles.inputLabel}>
                          Legal verification document
                          <span className={styles.disabledBadge}>Coming soon</span>
                        </label>
                        <label className={`${styles.fileUpload} ${styles.fileUploadDisabled}`} aria-disabled="true">
                          <UploadCloud size={26} className={styles.uploadIcon} aria-hidden="true" />
                          <span className={styles.uploadText}>
                            Registration / Incorporation document (.pdf, .doc)
                          </span>
                          <input
                            type="file"
                            className={styles.fileInputHidden}
                            accept=".pdf,.doc,.docx"
                            disabled
                            aria-hidden="true"
                            tabIndex={-1}
                          />
                        </label>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </fieldset>

              <button
                type="submit"
                className={styles.primaryBtn}
                disabled={isProcessing}
                aria-busy={isProcessing}
              >
                {isProcessing ? (
                  <span className={styles.btnSpinner} aria-hidden="true" />
                ) : (
                  <ArrowRight size={17} aria-hidden="true" />
                )}
                {isProcessing ? 'Creating account…' : 'Continue'}
              </button>
            </form>

            <p className={styles.switchText}>
              Already have an account?{' '}
              <Link to="/login" className={styles.switchLink}>Sign in</Link>
            </p>
          </motion.div>
        ) : (
          /* ─── STEP 2: Avatar ─────────────────────────────────────────────── */
          <motion.div
            key="step2"
            className={styles.authCard}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.45, type: 'spring', stiffness: 110 }}
          >
            <div className={styles.cardHeader}>
              <CheckCircle2 size={44} className={styles.successIcon} aria-hidden="true" />
              <h1 className={styles.cardTitle}>Account Created!</h1>
              <p className={styles.cardSubtitle}>
                Add a profile photo so companies and peers can recognise you.
              </p>
              <StepIndicator current={2} total={2} />
            </div>

            <div className={styles.avatarSection}>
              {/* Avatar preview circle */}
              <div
                className={styles.avatarPreviewCircle}
                role="img"
                aria-label={avatarPreview ? 'Profile picture preview' : 'No profile picture selected'}
              >
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Your profile picture preview"
                    className={styles.avatarImg}
                  />
                ) : (
                  <UserCircle2 size={52} className={styles.avatarPlaceholderIcon} aria-hidden="true" />
                )}
              </div>

              {/* File picker */}
              <label htmlFor={avatarInputId} className={styles.outlineBtn}>
                {avatarPreview ? 'Change photo' : 'Choose a photo'}
                <input
                  id={avatarInputId}
                  type="file"
                  className={styles.fileInputHidden}
                  onChange={handleAvatarChange}
                  accept="image/*"
                  aria-label="Upload profile picture"
                />
              </label>
              <p className={styles.avatarHint}>JPG, PNG, WEBP — max 5 MB recommended</p>
            </div>

            <button
              type="button"
              className={styles.primaryBtn}
              onClick={finalizeRegistration}
              disabled={isProcessing}
              aria-busy={isProcessing}
            >
              {isProcessing ? (
                <span className={styles.btnSpinner} aria-hidden="true" />
              ) : (
                <ArrowRight size={17} aria-hidden="true" />
              )}
              {isProcessing ? 'Setting up dashboard…' : 'Enter Dashboard'}
            </button>

            {!isProcessing && (
              <button
                type="button"
                className={styles.skipBtn}
                onClick={finalizeRegistration}
              >
                Skip for now
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Maps Firebase error codes to user-friendly messages.
 */
function getFriendlyError(code) {
  const map = {
    'auth/email-already-in-use': 'An account with this email already exists. Try signing in.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/weak-password': 'Password must be at least 6 characters.',
    'auth/too-many-requests': 'Too many attempts. Please wait a few minutes and try again.',
    'auth/network-request-failed': 'Network error. Please check your connection and try again.',
    'auth/operation-not-allowed': 'This sign-in method is not enabled. Please contact support.',
  };
  return map[code] ?? 'Something went wrong. Please try again.';
}