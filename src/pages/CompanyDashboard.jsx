import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaUsers, FaGraduationCap, FaBriefcase, FaSearch, FaTimes } from 'react-icons/fa';
import styles from '../styles/CompanyDashboard.module.css';

const CompanyDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeView, setActiveView] = useState('internships');

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Company Hub</h1>
          <p className="text-muted">Manage postings and discover top talent</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <FaPlus style={{ marginRight: '0.5rem' }} /> Post Internship
        </button>
      </header>

      {/* Analytics Overview */}
      <div className={styles.statsGrid}>
        <StatCard label="Live Postings" value="8" icon={<FaBriefcase />} color="#2563eb" />
        <StatCard label="Total Applicants" value="142" icon={<FaUsers />} color="#10b981" />
        <StatCard label="Partnered Schools" value="12" icon={<FaGraduationCap />} color="#facc15" />
      </div>

      <div className={styles.contentSection}>
        <div className={styles.controls}>
          <div className={styles.tabs}>
            <button className={activeView === 'internships' ? styles.activeTab : ''} onClick={() => setActiveView('internships')}>Active Postings</button>
            <button className={activeView === 'candidates' ? styles.activeTab : ''} onClick={() => setActiveView('candidates')}>Shortlisted Candidates</button>
          </div>
          <div className={styles.searchBox}>
            <FaSearch />
            <input type="text" placeholder="Search talent..." />
          </div>
        </div>

        <div className={styles.grid}>
          {activeView === 'internships' ? (
            [1, 2, 3].map(i => <InternshipPostCard key={i} />)
          ) : (
            [1, 2, 3, 4].map(i => <CandidateCard key={i} />)
          )}
        </div>
      </div>

      {/* Animated Post Modal */}
      <AnimatePresence>
        {isModalOpen && <PostModal onClose={() => setIsModalOpen(false)} />}
      </AnimatePresence>
    </div>
  );
};

// Sub-components
const StatCard = ({ label, value, icon, color }) => (
  <div className={styles.statCard}>
    <div className={styles.statIcon} style={{ background: `${color}15`, color }}>{icon}</div>
    <div><h3>{value}</h3><p>{label}</p></div>
  </div>
);

const InternshipPostCard = () => (
  <motion.div whileHover={{ y: -5 }} className={styles.card}>
    <div className={styles.cardHeader}>
      <span className={styles.badge}>Full-time</span>
      <h4>UX/UI Design Intern</h4>
    </div>
    <p className={styles.cardMeta}>Posted 2 days ago • 24 Applicants</p>
    <div className={styles.cardFooter}>
      <button className={styles.outlineBtn}>View Details</button>
      <button className={styles.outlineBtn}>Edit</button>
    </div>
  </motion.div>
);

const CandidateCard = () => (
  <motion.div whileHover={{ scale: 1.02 }} className={styles.card}>
    <div className={styles.candidateInfo}>
      <div className={styles.avatar}>JD</div>
      <div>
        <h4>Jane Doe</h4>
        <p>Computer Science • Year 3</p>
      </div>
    </div>
    <div className={styles.skillTags}>
      <span>React</span><span>Firebase</span><span>Python</span>
    </div>
    <button className="btn btn-primary mt-1" style={{ width: '100%' }}>View Profile</button>
  </motion.div>
);

const PostModal = ({ onClose }) => (
  <motion.div 
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className={styles.modalOverlay}
  >
    <motion.div 
      initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
      className={styles.modalContent}
    >
      <div className={styles.modalHeader}>
        <h3>Post New Internship</h3>
        <FaTimes onClick={onClose} style={{ cursor: 'pointer' }} />
      </div>
      <div className={styles.formGroup}>
        <label>Job Title</label>
        <input type="text" placeholder="e.g. Frontend Developer" />
        <label>Description</label>
        <textarea placeholder="Describe the role..."></textarea>
      </div>
      <button className="btn btn-primary" style={{ width: '100%' }} onClick={onClose}>Publish Listing</button>
    </motion.div>
  </motion.div>
);

export default CompanyDashboard;