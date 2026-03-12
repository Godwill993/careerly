import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  Building2,
  School,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Users,
  BarChart3,
  Quote,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from '../styles/LandingPage.module.css';

// ─── Animation Variants (module-scope to prevent recreation on render) ───────

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 90, damping: 20 } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const heroVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: 'easeOut', delay: 0.3 } },
};

const badgeSlide = {
  hidden: { x: 24, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { delay: 0.9, duration: 0.5 } },
};

const press = { tap: { scale: 0.96 }, hover: { scale: 1.03 } };

// ─── Static Data (module-scope to prevent recreation on render) ───────────────

const USER_TYPES = [
  {
    id: 'student',
    title: 'For Students',
    icon: GraduationCap,
    description: 'Launch your career with AI-matched internships and personalized growth roadmaps.',
    features: ['AI Resume Builder', 'Skill Gap Analysis', 'Verified Internship Access'],
    buttonText: 'Join as Student',
    colorMod: styles.cardBlue,
    roleParam: 'student',
  },
  {
    id: 'school',
    title: 'For Schools',
    icon: School,
    description: 'Empower your students and track placement metrics with powerful administrative tools.',
    features: ['Student Analytics', 'Partner Networking', 'Program Management'],
    buttonText: 'Register Institution',
    colorMod: styles.cardYellow,
    roleParam: 'school',
  },
  {
    id: 'company',
    title: 'For Companies',
    icon: Building2,
    description: 'Access a verified pipeline of top-tier talent filtered by real-world performance.',
    features: ['Smart Recruitment', 'Brand Management', 'Performance Tracking'],
    buttonText: 'Hire Top Talent',
    colorMod: styles.cardIndigo,
    roleParam: 'company',
  },
];

const STEPS = [
  {
    id: 'profile',
    title: 'Profile Creation',
    desc: 'AI scans your background to create a dynamic talent identity.',
    Icon: Users,
  },
  {
    id: 'matching',
    title: 'Smart Matching',
    desc: 'Our neural engine connects you with the perfect professional fit.',
    Icon: Zap,
  },
  {
    id: 'success',
    title: 'Verified Success',
    desc: 'Data-driven placement results for long-term career growth.',
    Icon: BarChart3,
  },
];

const TESTIMONIALS = [
  {
    id: 'abena',
    name: 'Abena Marie',
    role: 'CS Student @ University of Yaoundé I',
    initials: 'AM',
    text: 'Careerly found me an internship that perfectly matched my niche skills in AI ethics. The matching felt truly intelligent.',
  },
  {
    id: 'mbida',
    name: 'Mbida Jean-Paul',
    role: 'Talent Lead @ Orange Cameroon',
    initials: 'MJ',
    text: 'The quality of candidates is unmatched. The verification layer saves us weeks of screening time every quarter.',
  },
];

const NAV_LINKS = [
  { href: '#how', label: 'How it Works' },
  { href: '#solutions', label: 'Solutions' },
  { href: '#testimonials', label: 'Success Stories' },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = useCallback(() => setMenuOpen((prev) => !prev), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <header className={styles.header}>
      <nav className={styles.navbar} aria-label="Main navigation">
        <Link to="/" className={styles.brand} aria-label="Careerly home">
          <div className={styles.brandIcon} aria-hidden="true">C</div>
          <span className={styles.brandName}>
            Careerly
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className={styles.navLinks} role="list">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} className={styles.navLink}>
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <Link to="/register" className={styles.navCta}>
              Get Started
            </Link>
          </li>
        </ul>

        {/* Mobile hamburger */}
        <button
          className={styles.hamburger}
          onClick={toggleMenu}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            className={styles.mobileMenu}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-label="Mobile navigation"
          >
            <ul role="list">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className={styles.mobileNavLink} onClick={closeMenu}>
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <Link to="/register" className={styles.mobileNavCta} onClick={closeMenu}>
                  Get Started →
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function HeroSection() {
  return (
    <section className={styles.hero} aria-labelledby="hero-heading">
      {/* Decorative blobs */}
      <motion.div
        className={`${styles.blob} ${styles.blob1}`}
        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
        aria-hidden="true"
      />
      <motion.div
        className={`${styles.blob} ${styles.blob2}`}
        animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0] }}
        transition={{ duration: 17, repeat: Infinity, ease: 'linear' }}
        aria-hidden="true"
      />

      <div className={styles.heroContent}>
        <motion.div variants={heroVariant} initial="hidden" animate="visible">
          <span className={styles.badge} aria-label="Tagline">
            <Sparkles size={14} aria-hidden="true" />
            The Future of Talent Placement
          </span>

          <h1 id="hero-heading" className={styles.heroTitle}>
            Bridging the Gap Between{' '}
            <br className={styles.titleBreak} />
            <span className={styles.gradientText}>Ambition and Opportunity</span>
          </h1>

          <p className={styles.heroDesc}>
            Careerly is the intelligent ecosystem connecting students, educational institutions, and
            global companies through AI-driven career matching.
          </p>

          <div className={styles.ctaGroup}>
            <motion.div variants={press} whileHover="hover" whileTap="tap">
              <Link to="/register" className={styles.btnPrimary}>
                Get Started Now <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </motion.div>
            <a href="#how" className={styles.btnSecondary}>
              See How It Works
            </a>
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          className={styles.statsRow}
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          {[
            { value: '12k+', label: 'Placements' },
            { value: '400+', label: 'Partner Companies' },
            { value: '98%', label: 'Satisfaction Rate' },
          ].map((stat) => (
            <motion.div key={stat.label} variants={fadeUp} className={styles.statItem}>
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* App Preview */}
        <motion.div
          className={styles.previewWrapper}
          variants={scaleIn}
          initial="hidden"
          animate="visible"
        >
          <div className={styles.previewBox}>
            {/* Fake browser chrome */}
            <div className={styles.browserBar} aria-hidden="true">
              <span className={`${styles.dot} ${styles.dotRed}`} />
              <span className={`${styles.dot} ${styles.dotYellow}`} />
              <span className={`${styles.dot} ${styles.dotGreen}`} />
              <span className={styles.urlBar}>app.careerly.io/dashboard</span>
            </div>
            {/* Mock dashboard content */}
            <div className={styles.previewInner}>
              <div className={styles.mockSidebar} aria-hidden="true">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className={`${styles.mockNavItem} ${i === 0 ? styles.mockNavActive : ''}`} />
                ))}
              </div>
              <div className={styles.mockMain}>
                <div className={styles.mockHeader} />
                <div className={styles.mockCards}>
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className={styles.mockCard} />
                  ))}
                </div>
                <div className={styles.mockChart} />
              </div>
            </div>
          </div>

          <motion.div
            className={styles.trustBadge}
            variants={badgeSlide}
            initial="hidden"
            animate="visible"
          >
            <ShieldCheck size={20} className={styles.trustIcon} aria-hidden="true" />
            <div>
              <p className={styles.trustLabel}>Verified Placements</p>
              <p className={styles.trustValue}>12,400+ careers launched</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  return (
    <section id="how" className={styles.howItWorks} aria-labelledby="how-heading">
      <div className={styles.sectionHeader}>
        <h2 id="how-heading" className={styles.sectionTitle}>The Three-Step Synergy</h2>
        <p className={styles.sectionSubtitle}>
          A streamlined pipeline designed to get you from start to hired in record time.
        </p>
      </div>

      <motion.div
        className={styles.stepsGrid}
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        {STEPS.map((step, i) => (
          <motion.div key={step.id} variants={fadeUp} className={styles.stepItem}>
            <div className={styles.stepNumber} aria-hidden="true">{String(i + 1).padStart(2, '0')}</div>
            <div className={styles.stepIconWrap} aria-hidden="true">
              <step.Icon size={28} />
            </div>
            <h3 className={styles.stepTitle}>{step.title}</h3>
            <p className={styles.stepDesc}>{step.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

function SolutionsSection() {
  return (
    <section id="solutions" className={styles.solutions} aria-labelledby="solutions-heading">
      <div className={styles.sectionHeader}>
        <h2 id="solutions-heading" className={styles.sectionTitle}>Choose Your Path</h2>
        <p className={styles.sectionSubtitle}>
          Careerly's specialized ecosystem adapts to every role in the talent journey.
        </p>
      </div>

      <motion.div
        className={styles.solutionsGrid}
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        {USER_TYPES.map((type) => (
          <motion.article
            key={type.id}
            variants={fadeUp}
            whileHover={{ y: -10, transition: { duration: 0.25 } }}
            className={`${styles.card} ${type.colorMod}`}
          >
            <div className={styles.cardAccent} aria-hidden="true" />
            <div className={styles.iconBox} aria-hidden="true">
              <type.icon size={36} />
            </div>
            <h3 className={styles.cardTitle}>{type.title}</h3>
            <p className={styles.cardDesc}>{type.description}</p>
            <ul className={styles.featureList} aria-label={`${type.title} features`}>
              {type.features.map((feature) => (
                <li key={feature} className={styles.featureItem}>
                  <CheckCircle2 size={16} className={styles.featureCheck} aria-hidden="true" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Link
              to={`/register?role=${type.roleParam}`}
              className={styles.cardBtn}
              aria-label={`${type.buttonText} — ${type.title}`}
            >
              {type.buttonText}
            </Link>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section id="testimonials" className={styles.testimonials} aria-labelledby="testimonials-heading">
      <div className={styles.sectionHeader}>
        <h2 id="testimonials-heading" className={styles.sectionTitle}>Voices of Success</h2>
        <p className={styles.sectionSubtitle}>
          Join thousands of students and recruiters already thriving on Careerly.
        </p>
      </div>

      <div className={styles.testimonialGrid}>
        {TESTIMONIALS.map((t, i) => (
          <motion.figure
            key={t.id}
            initial={{ opacity: 0, x: i % 2 === 0 ? -24 : 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className={styles.testimonialCard}
          >
            <Quote className={styles.quoteIcon} size={36} aria-hidden="true" />
            <blockquote>
              <p className={styles.testimonialText}>{t.text}</p>
            </blockquote>
            <figcaption className={styles.testimonialAuthor}>
              <div className={styles.avatar} aria-hidden="true">
                {t.initials}
              </div>
              <div>
                <p className={styles.authorName}>{t.name}</p>
                <p className={styles.authorRole}>{t.role}</p>
              </div>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section className={styles.ctaSection} aria-labelledby="cta-heading">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className={styles.ctaInner}
      >
        <span className={styles.ctaBadge} aria-hidden="true">✦ No credit card required</span>
        <h2 id="cta-heading" className={styles.ctaTitle}>
          Ready to redefine your future?
        </h2>
        <p className={styles.ctaDesc}>
          Create your free account today and start matching with the best opportunities.
        </p>
        <motion.div variants={press} whileHover="hover" whileTap="tap">
          <Link to="/register" className={styles.ctaBtn}>
            Get Started — It's Free <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerBrand}>
          <Link to="/" className={styles.brand} aria-label="Careerly home">
            <div className={styles.brandIconSmall} aria-hidden="true">C</div>
            <span className={styles.brandNameSmall}>Careerly</span>
          </Link>
          <p className={styles.footerTagline}>
            Elevating potential through intelligence.
          </p>
        </div>

        <nav className={styles.footerLinks} aria-label="Footer navigation">
          <a href="/privacy-policy" className={styles.footerLink}>Privacy Policy</a>
          <a href="/terms-of-service" className={styles.footerLink}>Terms of Service</a>
          <a href="/cookie-policy" className={styles.footerLink}>Cookie Policy</a>
        </nav>

        <p className={styles.footerCopy}>
          © {currentYear} Careerly Talent Ecosystem. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

// ─── Main Page Component ──────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className={styles.pageWrapper}>
      <NavBar />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <SolutionsSection />
        <TestimonialsSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}