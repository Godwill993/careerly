import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  MapPin, 
  Clock, 
  DollarSign, 
  Filter, 
  ChevronRight, 
  Bookmark,
  Briefcase,
  Building,
  Calendar,
  CheckCircle2,
  Trophy,
  ArrowUpRight,
  X,
  Star,
  Zap,
  GraduationCap,
  LineChart,
  Award,
  Code2,
  Users,
  Terminal,
  FileBadge
} from 'lucide-react';

const Internships = () => {
  const [selectedId, setSelectedId] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState("rankings"); 

  const internships = [
    {
      id: 1,
      title: "Product Design Intern",
      company: "InnovateTech",
      location: "San Francisco, CA (Hybrid)",
      type: "Full-time",
      stipend: "$4,500/mo",
      duration: "3 Months",
      posted: "2 days ago",
      description: "Join our core design team to build the next generation of fintech products. You'll work directly with senior designers on high-impact user interfaces.",
      requirements: ["Proficiency in Figma", "Strong Portfolio", "Understanding of Design Systems"],
      tags: ["UI/UX", "Product", "Fintech"]
    },
    {
      id: 2,
      title: "Software Engineering Intern",
      company: "DataCloud",
      location: "Remote",
      type: "Part-time",
      stipend: "$35/hr",
      duration: "6 Months",
      posted: "5 hours ago",
      description: "Help us scale our distributed systems. You will be contributing to open-source tools and internal infrastructure using Go and Kubernetes.",
      requirements: ["Java/Go knowledge", "Familiarity with Cloud", "Problem Solving"],
      tags: ["Go", "Cloud", "Kubernetes"]
    }
  ];

  const rankings = [
    { 
      name: "Alex Rivera", 
      score: 98.4, 
      rank: 1,
      academic: {
        gpa: "4.0",
        institution: "Stanford University",
        major: "Computer Science",
        honors: "Dean's List (4Y)",
        research: "AI Optimization"
      },
      professional: {
        lastRole: "SWE Intern @ Google",
        projects: 14,
        certifications: ["AWS Solutions Architect", "Google Cloud Professional"],
        contributions: "500+ GitHub Commits"
      },
      skills: { technical: 98, soft: 92, impact: 95 },
      badges: ["Top 1%", "Research Fellow"]
    },
    { 
      name: "Sarah Chen", 
      score: 95.8, 
      rank: 2,
      academic: {
        gpa: "3.95",
        institution: "MIT",
        major: "Data Science",
        honors: "Summa Cum Laude",
        research: "Quantum Computing"
      },
      professional: {
        lastRole: "Product Intern @ Meta",
        projects: 9,
        certifications: ["TensorFlow Developer", "PMP"],
        contributions: "Top 5% Kaggle"
      },
      skills: { technical: 94, soft: 97, impact: 90 },
      badges: ["Innovation Award", "Hackathon Hero"]
    },
    { 
      name: "Jordan Smith", 
      score: 93.2, 
      rank: 3,
      academic: {
        gpa: "3.88",
        institution: "UC Berkeley",
        major: "EECS",
        honors: "Tau Beta Pi",
        research: "Robotics"
      },
      professional: {
        lastRole: "Backend Intern @ Stripe",
        projects: 11,
        certifications: ["CKAD", "RedHat Engineer"],
        contributions: "Linux Kernel Contributor"
      },
      skills: { technical: 96, soft: 85, impact: 88 },
      badges: ["Open Source", "Technical Lead"]
    }
  ];

  const selectedJob = internships.find(job => job.id === selectedId);

  return (
    <div className="intern-wrapper">
      <style>{`
        :root {
          --brand-blue: #2563eb;
          --brand-gold: #eab308;
          --bg-slate: #f8fafc;
          --border-slate: #e2e8f0;
          --text-main: #0f172a;
          --text-muted: #64748b;
          --success: #10b981;
          --glass: rgba(255, 255, 255, 0.8);
        }

        .intern-wrapper {
          background-color: var(--bg-slate);
          min-height: 100vh;
          font-family: 'Inter', system-ui, sans-serif;
          color: var(--text-main);
        }

        .top-bar {
          background: white;
          border-bottom: 1px solid var(--border-slate);
          padding: 16px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .nav-links { display: flex; gap: 32px; }
        .nav-item { 
          font-weight: 600; 
          color: var(--text-muted); 
          cursor: pointer; 
          padding: 8px 0;
          position: relative;
        }
        .nav-item.active { color: var(--brand-blue); }
        .nav-item.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: var(--brand-blue);
        }

        .main-content {
          max-width: 1300px;
          margin: 0 auto;
          padding: 40px 24px;
        }

        .ranking-dashboard {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .rank-card-detailed {
          background: white;
          border-radius: 24px;
          border: 1px solid var(--border-slate);
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .rank-card-detailed:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px -10px rgba(0,0,0,0.05);
        }

        .rank-card-header {
          padding: 32px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border-slate);
          background: linear-gradient(to right, #ffffff, #f1f5f9);
        }

        .profile-main {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .rank-number {
          font-size: 32px;
          font-weight: 900;
          color: var(--brand-blue);
          opacity: 0.3;
        }

        .user-info h3 { font-size: 24px; font-weight: 800; margin-bottom: 4px; }
        
        .score-circle {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          border: 4px solid var(--brand-blue);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: white;
        }

        .score-val { font-size: 20px; font-weight: 900; color: var(--brand-blue); }
        .score-label { font-size: 10px; font-weight: 800; color: var(--text-muted); text-transform: uppercase; }

        .rank-body {
          display: grid;
          grid-template-columns: 1fr 1fr 300px;
          gap: 1px;
          background: var(--border-slate);
        }

        .rank-section {
          background: white;
          padding: 24px;
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 800;
          color: var(--text-muted);
          text-transform: uppercase;
          margin-bottom: 16px;
        }

        .data-point {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
          font-size: 14px;
        }

        .data-label { color: var(--text-muted); }
        .data-value { font-weight: 700; color: var(--text-main); }

        .skill-bar-wrap {
          margin-top: 20px;
        }

        .skill-bar-container {
          height: 8px;
          background: var(--bg-slate);
          border-radius: 4px;
          margin-bottom: 12px;
          overflow: hidden;
        }

        .skill-bar-fill {
          height: 100%;
          background: var(--brand-blue);
          border-radius: 4px;
        }

        .badge-pill {
          padding: 4px 12px;
          background: #eff6ff;
          color: var(--brand-blue);
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
          border: 1px solid #dbeafe;
        }

        .apply-btn {
          background: var(--brand-blue);
          color: white;
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 700;
          border: none;
          cursor: pointer;
        }

        @media (max-width: 1000px) {
          .rank-body { grid-template-columns: 1fr; }
        }
      `}</style>


      <main className="main-content">
        {view === 'rankings' && (
          <div className="ranking-dashboard">
            <header>
              <h1 style={{ fontSize: '36px', fontWeight: '900', letterSpacing: '-0.02em' }}>Top Talent Ecosystem</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '18px', marginTop: '8px' }}>
                Objective rankings based on verified academic records and professional output.
              </p>
            </header>

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
            >
              {rankings.map((person, idx) => (
                <motion.div 
                  key={idx}
                  variants={itemVariants}
                  className="rank-card-detailed"
                >
                  <div className="rank-card-header">
                    <div className="profile-main">
                      <span className="rank-number">#0{person.rank}</span>
                      <div className="user-info">
                        <h3>{person.name}</h3>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {person.badges.map(b => <span key={b} className="badge-pill">{b}</span>)}
                        </div>
                      </div>
                    </div>
                    <div className="score-circle">
                      <span className="score-val">{person.score}</span>
                      <span className="score-label">Index</span>
                    </div>
                  </div>

                  <div className="rank-body">
                    {/* ACADEMIC PILLAR */}
                    <div className="rank-section">
                      <div className="section-title">
                        <GraduationCap size={16} /> Academic Excellence
                      </div>
                      <div className="data-point">
                        <span className="data-label">Institution</span>
                        <span className="data-value">{person.academic.institution}</span>
                      </div>
                      <div className="data-point">
                        <span className="data-label">GPA</span>
                        <span className="data-value" style={{ color: 'var(--success)' }}>{person.academic.gpa}</span>
                      </div>
                      <div className="data-point">
                        <span className="data-label">Major</span>
                        <span className="data-value">{person.academic.major}</span>
                      </div>
                      <div className="data-point">
                        <span className="data-label">Research Focus</span>
                        <span className="data-value">{person.academic.research}</span>
                      </div>
                    </div>

                    {/* PROFESSIONAL PILLAR */}
                    <div className="rank-section">
                      <div className="section-title">
                        <Briefcase size={16} /> Professional Output
                      </div>
                      <div className="data-point">
                        <span className="data-label">Latest Role</span>
                        <span className="data-value">{person.professional.lastRole}</span>
                      </div>
                      <div className="data-point">
                        <span className="data-label">Code Contributions</span>
                        <span className="data-value">{person.professional.contributions}</span>
                      </div>
                      <div className="data-point">
                        <span className="data-label">Certifications</span>
                        <span className="data-value">{person.professional.certifications.length} Active</span>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '8px' }}>
                        {person.professional.certifications.map(c => (
                          <span key={c} style={{ fontSize: '10px', padding: '2px 6px', background: '#f8fafc', borderRadius: '4px', border: '1px solid #e2e8f0' }}>{c}</span>
                        ))}
                      </div>
                    </div>

                    {/* SKILL ANALYTICS */}
                    <div className="rank-section" style={{ background: '#f8fafc' }}>
                      <div className="section-title">
                        <LineChart size={16} /> Competency Index
                      </div>
                      <div className="skill-bar-wrap">
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>
                          <span>Technical Proficiency</span>
                          <span>{person.skills.technical}%</span>
                        </div>
                        <div className="skill-bar-container">
                          <motion.div 
                            initial={{ width: 0 }} 
                            animate={{ width: `${person.skills.technical}%` }} 
                            className="skill-bar-fill" 
                          />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>
                          <span>Soft Skills & Leadership</span>
                          <span>{person.skills.soft}%</span>
                        </div>
                        <div className="skill-bar-container">
                          <motion.div 
                            initial={{ width: 0 }} 
                            animate={{ width: `${person.skills.soft}%` }} 
                            className="skill-bar-fill" 
                            style={{ background: 'var(--brand-gold)' }} 
                          />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>
                          <span>Industry Impact</span>
                          <span>{person.skills.impact}%</span>
                        </div>
                        <div className="skill-bar-container">
                          <motion.div 
                            initial={{ width: 0 }} 
                            animate={{ width: `${person.skills.impact}%` }} 
                            className="skill-bar-fill" 
                            style={{ background: 'var(--success)' }} 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* ANALYTICS SUMMARY */}
            <div style={{ marginTop: '32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              <div style={{ background: 'white', padding: '24px', borderRadius: '20px', border: '1px solid var(--border-slate)' }}>
                <Terminal size={24} style={{ color: '#2563eb', marginBottom: '12px' }} />
                <h4 style={{ fontWeight: '800' }}>Algorithm Integrity</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Rankings are updated weekly using weighted data from 12+ institutional APIs.</p>
              </div>
              <div style={{ background: 'white', padding: '24px', borderRadius: '20px', border: '1px solid var(--border-slate)' }}>
                <FileBadge size={24} style={{ color: '#eab308', marginBottom: '12px' }} />
                <h4 style={{ fontWeight: '800' }}>Credential Verified</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>100% of academic and professional badges listed are cryptographically signed.</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default Internships;