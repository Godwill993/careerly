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
      location: "Bamenda, CA (Hybrid)",
      type: "Full-time",
      stipend: "XAF 14000/mo",
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
      stipend: "XAF 7000/hr",
      duration: "6 Months",
      posted: "5 hours ago",
      description: "Help us scale our distributed systems. You will be contributing to open-source tools and internal infrastructure using Go and Kubernetes.",
      requirements: ["Java/Go knowledge", "Familiarity with Cloud", "Problem Solving"],
      tags: ["Go", "Cloud", "Kubernetes"]
    }
  ];

  const rankings = [
    { 
      name: "TABI JACOB", 
      score:12.4, 
      rank: 1,
      academic: {
        gpa: "3.0",
        institution: "UNHIMAS",
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
      skills: { technical: 98, soft: 74, impact: 45 },
      badges: ["Top 1%", "Research Fellow"]
    },
    { 
      name: "NYAMNDI ZIAN", 
      score: 92.8, 
      rank: 2,
      academic: {
        gpa: "3.95",
        institution: "YIBS",
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
      name: "WARREN PETER", 
      score: 93.2, 
      rank: 3,
      academic: {
        gpa: "3.88",
        institution: "POLYTECH YDE",
        major: "MECHANICAL ENG.",
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
        .intern-wrapper {
          background-color: var(--color-bg);
          min-height: 100vh;
          font-family: 'Inter', system-ui, sans-serif;
          color: var(--color-text);
        }

        .top-bar {
          background: var(--color-surface);
          border-bottom: 1px solid var(--color-border);
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
          color: var(--color-text-muted); 
          cursor: pointer; 
          padding: 8px 0;
          position: relative;
        }
        .nav-item.active { color: var(--color-primary); }
        .nav-item.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: var(--color-primary);
        }

        .rank-card-detailed {
          background: var(--color-surface);
          border-radius: 24px;
          border: 1px solid var(--color-border);
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .rank-card-header {
          padding: 32px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--color-border);
          background: var(--color-surface);
        }

        .rank-number {
          font-size: 32px;
          font-weight: 900;
          color: var(--color-primary);
          opacity: 0.3;
        }

        .score-circle {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          border: 4px solid var(--color-primary);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: var(--color-surface);
        }

        .score-val { font-size: 20px; font-weight: 900; color: var(--color-primary); }
        .score-label { font-size: 10px; font-weight: 800; color: var(--color-text-muted); text-transform: uppercase; }

        .rank-body {
          display: grid;
          grid-template-columns: 1fr 1fr 300px;
          gap: 1px;
          background: var(--color-border);
        }

        .rank-section {
          background: var(--color-surface);
          padding: 24px;
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 800;
          color: var(--color-text-muted);
          text-transform: uppercase;
          margin-bottom: 16px;
        }

        .data-label { color: var(--color-text-muted); }
        .data-value { font-weight: 700; color: var(--color-text); }

        .skill-bar-container {
          height: 8px;
          background: var(--color-bg);
          border-radius: 4px;
          margin-bottom: 12px;
          overflow: hidden;
        }

        .skill-bar-fill {
          height: 100%;
          background: var(--color-primary);
          border-radius: 4px;
        }

        .badge-pill {
          padding: 4px 12px;
          background: var(--color-primary-light);
          color: var(--color-primary);
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
          border: 1px solid var(--color-border);
        }

        .apply-btn {
          background: var(--color-primary);
          color: white;
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 700;
          border: none;
          cursor: pointer;
        }


        @media (max-width: 1000px) {
          .rank-body { grid-template-columns: 1fr; }
          
          .rank-card-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 20px;
          }
          
          .score-circle {
            align-self: flex-end; /* Move score to right/bottom of header or keep it inline? Let's align right */
            margin-top: -40px; /* Overlap or just adjust */
            margin-top: 0;
            width: 60px;
            height: 60px;
          }
          
          .score-val { font-size: 16px; }
          .score-label { font-size: 8px; }
          
          .rank-number {
             font-size: 24px;
          }
          
          .rank-card-detailed {
            border-radius: 16px;
          }
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
                        <span className="data-value" style={{ color: 'var(--color-success)' }}>{person.academic.gpa}</span>
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
                            style={{ background: 'var(--color-warning)' }} 
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
                            style={{ background: 'var(--color-success)' }} 
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