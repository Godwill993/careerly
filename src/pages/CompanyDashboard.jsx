import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaUsers, FaGraduationCap, FaBriefcase, FaSearch, FaTimes } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { internshipService } from '../services/internshipService';
import LoadingSpinner from '../components/LoadingSpinner';
import styles from '../styles/CompanyDashboard.module.css';

const CompanyDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [internships, setInternships] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.uid) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const data = await internshipService.getCompanyInternships(user.uid);
      setInternships(data);
      // Applicants fetching will be added in later phase
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
    setLoading(false);
  };

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
        <StatCard label="Live Postings" value={internships.length} icon={<FaBriefcase />} color="#2563eb" />
        <StatCard label="Total Applicants" value={applicants.length} icon={<FaUsers />} color="#10b981" />
        <StatCard label="Partnered Schools" value="12" icon={<FaGraduationCap />} color="#facc15" />
      </div>

      <div className={styles.contentSection}>
        <div className={styles.controls}>
          <div className={styles.tabs}>
            <button className={styles.activeTab}>Active Postings</button>
          </div>
          <div className={styles.searchBox}>
            <FaSearch />
            <input type="text" placeholder="Search talent..." />
          </div>
        </div>

        <div className={styles.grid}>
          {loading ? (
            <LoadingSpinner message="Loading dashboard data..." fullHeight />
          ) : internships.length > 0 ? (
            internships.map(internship => (
              <InternshipPostCard key={internship.id} internship={internship} />
            ))
          ) : (
            <p style={{ padding: '20px', color: 'var(--color-text-muted)' }}>No active postings found. Go ahead and create one!</p>
          )}
        </div>
      </div>

      {/* Animated Post Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <PostModal 
            onClose={() => setIsModalOpen(false)} 
            user={user}
            onRefresh={loadDashboardData}
          />
        )}
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

const InternshipPostCard = ({ internship }) => (
  <motion.div whileHover={{ y: -5 }} className={styles.card}>
    <div className={styles.cardHeader}>
      <span className={styles.badge}>{internship.type || 'Full-time'}</span>
      <h4>{internship.title}</h4>
    </div>
    <p className={styles.cardMeta}>Posted recently • {internship.location}</p>
    <div className={styles.cardFooter}>
      <button className={styles.outlineBtn}>View Details</button>
    </div>
  </motion.div>
);

const PostModal = ({ onClose, user, onRefresh }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    type: 'Full-time',
    stipend: '',
    duration: '',
    requirements: ''
  });
  const [posting, setPosting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return;
    
    setPosting(true);
    try {
      await internshipService.createInternship({
        ...formData,
        requirements: formData.requirements.split(',').map(r => r.trim()).filter(r => r),
        companyId: user.uid,
        company: user?.companyName || user?.displayName || user?.email || "Unknown Company",
      });
      onRefresh();
      onClose();
    } catch (error) {
      console.error("Error creating internship:", error);
    }
    setPosting(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className={styles.modalOverlay}
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
        className={styles.modalContent}
        style={{ maxHeight: '90vh', overflowY: 'auto' }}
      >
        <div className={styles.modalHeader}>
          <h3>Post New Internship</h3>
          <FaTimes onClick={onClose} style={{ cursor: 'pointer' }} />
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Job Title</label>
            <input type="text" placeholder="e.g. Frontend Developer" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
            
            <label>Description</label>
            <textarea placeholder="Describe the role..." style={{ minHeight: '100px' }} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required></textarea>

            <label>Location</label>
            <input type="text" placeholder="e.g. Douala (Remote)" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} required />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label>Type</label>
                  <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
                <div>
                   <label>Duration</label>
                   <input type="text" placeholder="e.g. 3 Months" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} required />
                </div>
            </div>
            
            <label>Stipend</label>
            <input type="text" placeholder="e.g. 50,000 XAF/mo or Unpaid" value={formData.stipend} onChange={e => setFormData({...formData, stipend: e.target.value})} required />

            <label>Requirements (comma separated)</label>
            <input type="text" placeholder="e.g. React, Node.js, Git" value={formData.requirements} onChange={e => setFormData({...formData, requirements: e.target.value})} required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={posting}>
            {posting ? 'Publishing...' : 'Publish Listing'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default CompanyDashboard;