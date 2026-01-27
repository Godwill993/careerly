import React from 'react';
import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  Building2, 
  School, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Globe,
  Zap,
  Users,
  BarChart3,
  Star,
  Quote
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

/**
 * ANIMATION VARIANTS
 */
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
};

const interactionVariants = {
  hover: { scale: 1.05, transition: { duration: 0.2 } },
  tap: { scale: 0.95 }
};

const LandingPage = () => {
  const userTypes = [
    {
      title: "For Students",
      icon: <GraduationCap size={40} className="icon-blue" />,
      description: "Launch your career with AI-matched internships and personalized growth roadmaps.",
      features: ["AI Resume Builder", "Skill Gap Analysis", "Verified Internship Access"],
      buttonText: "Join as Student",
      colorClass: "bg-blue",
      shadowClass: "shadow-blue"
    },
    {
      title: "For Schools",
      icon: <School size={40} className="icon-yellow" />,
      description: "Empower your students and track placement metrics with powerful administrative tools.",
      features: ["Student Analytics", "Partner Networking", "Program Management"],
      buttonText: "Register Institution",
      colorClass: "bg-yellow",
      shadowClass: "shadow-yellow"
    },
    {
      title: "For Companies",
      icon: <Building2 size={40} className="icon-indigo" />,
      description: "Access a verified pipeline of top-tier talent filtered by real-world performance.",
      features: ["Smart Recruitment", "Brand Management", "Performance Tracking"],
      buttonText: "Hire Top Talent",
      colorClass: "bg-indigo",
      shadowClass: "shadow-indigo"
    }
  ];

  const steps = [
    { title: "Profile Creation", desc: "AI scans your background to create a dynamic talent identity.", icon: <Users /> },
    { title: "Smart Matching", desc: "Our neural engine connects you with the perfect professional fit.", icon: <Zap /> },
    { title: "Verified Success", desc: "Data-driven placement results for long-term career growth.", icon: <BarChart3 /> }
  ];

  const testimonials = [
    { name: "Sarah Chen", role: "CS Student @ Stanford", text: "BlueGold found me an internship that perfectly matched my niche skills in AI ethics." },
    { name: "Marcus Thorne", role: "Talent Lead @ TechFlow", text: "The quality of candidates is unmatched. The verification layer saves us weeks of screening." }
  ];

  return (
    <div className="landing-wrapper">
      <style>{`
        :root {
          --blue-600: #2563eb;
          --blue-50: #eff6ff;
          --yellow-500: #eab308;
          --indigo-600: #4f46e5;
          --slate-50: #f8fafc;
          --slate-100: #f1f5f9;
          --slate-200: #e2e8f0;
          --slate-400: #94a3b8;
          --slate-500: #64748b;
          --slate-600: #475569;
          --slate-900: #0f172a;
          --white: #ffffff;
        }

        .landing-wrapper {
          min-height: 100vh;
          background-color: var(--slate-50);
          color: var(--slate-900);
          font-family: system-ui, -apple-system, sans-serif;
          overflow-x: hidden;
        }

        .navbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 32px;
          max-width: 1200px;
          margin: 0 auto;
          position: sticky;
          top: 0;
          background: rgba(248, 250, 252, 0.8);
          backdrop-filter: blur(10px);
          z-index: 100;
        }

        .logo-container {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .logo-box {
          width: 40px;
          height: 40px;
          background-color: var(--blue-600);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 20px;
        }

        .logo-text {
          font-size: 24px;
          font-weight: 900;
        }

        .logo-accent {
          color: var(--blue-600);
        }

        .nav-links {
          display: flex;
          gap: 32px;
          align-items: center;
        }

        .nav-link-item {
          text-decoration: none;
          color: var(--slate-600);
          font-weight: 600;
          transition: color 0.2s;
        }
        
        .nav-link-item:hover { color: var(--blue-600); }

        .nav-btn {
          background-color: var(--slate-900);
          color: white;
          padding: 10px 24px;
          border-radius: 9999px;
          border: none;
          cursor: pointer;
          font-weight: bold;
        }

        .hero {
          position: relative;
          padding: 80px 24px 120px;
          text-align: center;
        }

        .blob {
          position: absolute;
          width: 400px;
          height: 400px;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.4;
          z-index: 0;
        }

        .blob-1 { top: -5%; right: -5%; background-color: #dbeafe; }
        .blob-2 { bottom: 5%; left: -5%; background-color: #fef9c3; }

        .hero-content {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 10;
        }

        .badge {
          display: inline-block;
          padding: 6px 16px;
          margin-bottom: 24px;
          font-size: 14px;
          font-weight: 700;
          color: var(--blue-600);
          background-color: var(--blue-50);
          border-radius: 9999px;
        }

        .hero-title {
          font-size: clamp(2.5rem, 8vw, 4.5rem);
          font-weight: 900;
          margin-bottom: 24px;
          line-height: 1.1;
        }

        .gradient-text {
          background: linear-gradient(to right, var(--blue-600), var(--indigo-600));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-desc {
          max-width: 680px;
          margin: 0 auto 48px;
          font-size: 20px;
          color: var(--slate-600);
          line-height: 1.6;
        }

        .cta-group {
          display: flex;
          gap: 16px;
          justify-content: center;
        }

        .btn-primary {
          padding: 16px 32px;
          background-color: var(--blue-600);
          color: white;
          border-radius: 16px;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 8px;
          border: none;
          cursor: pointer;
          box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.3);
        }

        .btn-secondary {
          padding: 16px 32px;
          background-color: white;
          color: var(--slate-700);
          border: 1px solid var(--slate-200);
          border-radius: 16px;
          font-weight: 800;
          cursor: pointer;
        }

        .preview-container {
          margin-top: 80px;
          position: relative;
          max-width: 900px;
          margin-inline: auto;
        }

        .preview-box {
          background: white;
          padding: 12px;
          border-radius: 24px;
          border: 1px solid var(--slate-200);
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.1);
        }

        .preview-inner {
          aspect-ratio: 16/9;
          background: var(--slate-50);
          border: 2px dashed var(--slate-200);
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .preview-globe { color: var(--blue-600); opacity: 0.5; }

        .trust-badge {
          position: absolute;
          bottom: -20px;
          right: -20px;
          background: white;
          padding: 16px 24px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
        }

        .icon-success { color: #16a34a; }

        .solutions { padding: 100px 24px; background: white; }
        .solutions-header { text-align: center; margin-bottom: 60px; }
        .section-title { font-size: 36px; font-weight: 900; margin-bottom: 16px; }
        .section-subtitle { color: var(--slate-500); font-size: 18px; max-width: 600px; margin: 0 auto; }

        .solutions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 32px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .card {
          background: var(--slate-50);
          padding: 40px;
          border-radius: 32px;
          position: relative;
          overflow: hidden;
          border: 1px solid var(--slate-100);
          transition: transform 0.3s;
        }

        .card-accent {
          position: absolute;
          top: 0; right: 0; width: 100px; height: 100px;
          border-bottom-left-radius: 100%;
          opacity: 0.1;
        }

        .icon-box { margin-bottom: 24px; }
        .icon-blue { color: var(--blue-600); }
        .icon-yellow { color: var(--yellow-500); }
        .icon-indigo { color: var(--indigo-600); }

        .feature-list { list-style: none; padding: 0; margin-bottom: 32px; }
        .feature-item { display: flex; gap: 8px; margin-bottom: 12px; font-weight: 600; }
        .feature-check { color: var(--blue-600); }

        .card-btn {
          width: 100%;
          padding: 14px;
          border-radius: 12px;
          border: none;
          color: white;
          font-weight: 800;
          cursor: pointer;
        }

        .bg-blue { background: var(--blue-600); }
        .bg-yellow { background: var(--yellow-500); }
        .bg-indigo { background: var(--indigo-600); }

        /* HOW IT WORKS SECTION */
        .how-it-works { padding: 100px 24px; background: var(--slate-50); }
        .steps-container { 
          display: flex; 
          justify-content: space-between; 
          max-width: 1100px; 
          margin: 60px auto 0; 
          gap: 40px;
          flex-wrap: wrap;
        }
        .step-item { flex: 1; min-width: 250px; text-align: center; position: relative; }
        .step-icon-wrap {
          width: 80px; height: 80px;
          background: white;
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
          color: var(--blue-600);
          box-shadow: 0 10px 20px -5px rgba(0,0,0,0.05);
        }
        .step-title { font-weight: 800; margin-bottom: 8px; }
        .step-desc { color: var(--slate-500); font-size: 15px; line-height: 1.5; }

        /* TESTIMONIALS */
        .testimonials { padding: 100px 24px; background: var(--white); }
        .testimonial-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; max-width: 1000px; margin: 60px auto 0; }
        .testimonial-card {
          padding: 40px;
          background: var(--slate-50);
          border-radius: 24px;
          position: relative;
        }
        .quote-icon { color: var(--blue-600); opacity: 0.2; position: absolute; top: 20px; right: 20px; }
        .test-text { font-size: 18px; font-weight: 500; color: var(--slate-700); margin-bottom: 24px; line-height: 1.6; font-style: italic; }
        .test-author { display: flex; align-items: center; gap: 12px; }
        .test-avatar { width: 48px; height: 48px; border-radius: 50%; background: var(--slate-200); }
        .test-name { font-weight: 800; font-size: 16px; }
        .test-role { color: var(--slate-500); font-size: 14px; }

        .footer { padding: 60px 24px; text-align: center; border-top: 1px solid var(--slate-100); background: white; }
        .footer-logo-wrap { display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 24px; }
        .logo-box-small { width: 32px; height: 32px; font-size: 16px; }
        .footer-links { display: flex; justify-content: center; gap: 24px; margin-top: 24px; }
        .footer-link-btn { background: none; border: none; color: var(--slate-500); font-weight: 600; cursor: pointer; }
      `}</style>

      {/* NAVIGATION */}
      <nav className="navbar">
        <div className="logo-container">
          <div className="logo-box">CAREELY</div>
         
        </div>
        <div className="nav-links">
          <a href="#about" className="nav-link-item">About</a>
          <a href="#how" className="nav-link-item">How it Works</a>
          <a href="#solutions" className="nav-link-item">Solutions</a>
          <Link to="/register">
                 <motion.button 
            variants={interactionVariants}
            whileHover="hover"
            whileTap="tap"
            className="nav-btn"
          >
            Get Started
          </motion.button>
          </Link>
       
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="hero">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="blob blob-1"
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="blob blob-2"
        />

        <div className="hero-content">
          <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
          >
            <span className="badge">The Future of Talent Placement</span>
            <h1 className="hero-title">
              Bridging the Gap Between <br />
              <span className="gradient-text">Ambition and Opportunity</span>
            </h1>
            <p className="hero-desc">
              BlueGold is the intelligent ecosystem connecting students, educational institutions, and global companies through AI-driven career matching.
            </p>
            <div className="cta-group">
         
              <Link to="/register">
                   <motion.button 
                variants={interactionVariants}
                whileHover="hover"
                whileTap="tap"
                className="btn-primary"
              >
                Get Started Now <ArrowRight size={20} className="btn-icon" />
              </motion.button>  
              </Link>
              <button className="btn-secondary">Watch Demo</button>
            </div>
          </motion.div>

          {/* INTERACTIVE PREVIEW ELEMENT */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 1 }}
            className="preview-container"
          >
            <div className="preview-box">
              <div className="preview-inner">
                <Globe size={64} className="preview-globe" />
                <p className="preview-title">Interactive Platform Preview</p>
                <p className="preview-subtitle">Real-time talent dashboard visualization</p>
              </div>
            </div>
            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="trust-badge"
            >
              <div className="trust-icon-wrapper">
                <ShieldCheck size={24} className="icon-success" />
              </div>
              <div className="trust-text">
                <p className="trust-label">Trust Signal</p>
                <p className="trust-value">12k+ Placements</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how" className="how-it-works">
        <div className="solutions-header">
          <h2 className="section-title">The Three-Step Synergy</h2>
          <p className="section-subtitle">A streamlined pipeline designed to get you from start to hired in record time.</p>
        </div>
        <motion.div 
          className="steps-container"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {steps.map((step, i) => (
            <motion.div key={i} variants={itemVariants} className="step-item">
              <div className="step-icon-wrap">
                {step.icon}
              </div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-desc">{step.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* SOLUTIONS / PERSONA SECTION */}
      <section id="solutions" className="solutions">
        <div className="solutions-header">
          <h2 className="section-title">Choose Your Path</h2>
          <p className="section-subtitle">Select a profile to begin your journey with BlueGold's specialized talent ecosystem.</p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="solutions-grid"
        >
          {userTypes.map((type, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -12, boxShadow: "0 20px 40px -15px rgba(0,0,0,0.1)" }}
              className="card"
            >
              <div className={`card-accent ${type.colorClass}`} />
              <div className="icon-box">
                {type.icon}
              </div>
              <h3 className="card-title">{type.title}</h3>
              <p className="card-desc">{type.description}</p>
              <ul className="feature-list">
                {type.features.map((feature, idx) => (
                  <li key={idx} className="feature-item">
                    <CheckCircle2 size={18} className="feature-check" />
                    <span className="feature-text">{feature}</span>
                  </li>
                ))}
              </ul>
              <motion.button
                variants={interactionVariants}
                whileHover="hover"
                whileTap="tap"
                className={`card-btn ${type.colorClass} ${type.shadowClass}`}
              >
                {type.buttonText}
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="testimonials">
        <div className="solutions-header">
          <h2 className="section-title">Voices of Success</h2>
          <p className="section-subtitle">Join thousands of students and recruiters already thriving on BlueGold.</p>
        </div>
        <div className="testimonial-grid">
          {testimonials.map((t, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="testimonial-card"
            >
              <Quote className="quote-icon" size={40} />
              <p className="test-text">"{t.text}"</p>
              <div className="test-author">
                <div className="test-avatar" />
                <div>
                  <p className="test-name">{t.name}</p>
                  <p className="test-role">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA BOTTOM SECTION */}
      <section style={{ padding: '80px 24px', background: 'var(--blue-600)', color: 'white', textAlign: 'center' }}>
        <motion.div initial={{ scale: 0.9 }} whileInView={{ scale: 1 }}>
          <h2 style={{ fontSize: '32px', fontWeight: '900', marginBottom: '20px' }}>Ready to redefine your future?</h2>
          <p style={{ opacity: 0.9, marginBottom: '32px', fontSize: '18px' }}>Create your free account today and start matching.</p>
          <button className="nav-btn" style={{ background: 'white', color: 'var(--blue-600)', padding: '16px 40px', fontSize: '18px' }}>
            Get Started Now
          </button>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-logo-wrap">
          <div className="logo-box logo-box-small">CAREERLY</div>
          
        </div>
        <p className="footer-copyright">
          © 2026 CAREELY Talent Ecosystem. Elevating potential through intelligence.
        </p>
        <div className="footer-links">
          <button className="footer-link-btn">Privacy Policy</button>
          <button className="footer-link-btn">Terms of Service</button>
          <button className="footer-link-btn">Cookie Policy</button>
          <button className="footer-link-btn">Support Center</button>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;