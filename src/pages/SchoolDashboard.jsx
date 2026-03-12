import { motion, AnimatePresence } from 'framer-motion';
import { FaGraduationCap, FaNetworkWired, FaBrain, FaSearch, FaFireAlt } from 'react-icons/fa';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import styles from '../styles/SchoolDashboard.module.css';
import "../styles/index.css";
import { useState, useEffect } from 'react';

import ProfileHeader from '../components/ProfileHeader';

const SchoolDashboard = () => {
  const [activeTab, setActiveTab] = useState('heatmap');
  const [loading, setLoading] = useState(true);
  const [cohort, setCohort] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    let unsubscribe;
    if (user?.uid) {
      unsubscribe = loadEcosystemData();
    }
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user]);

  const loadEcosystemData = () => {
    setLoading(true);
    // Fetch Academic Cohort
    const studentsQ = query(collection(db, "users"), where("role", "==", "student"), where("schoolId", "==", user.uid));
    
    const unsubscribe = onSnapshot(studentsQ, (snapshot) => {
      const loadedCohort = snapshot.docs.map(doc => {
        const data = doc.data();
        // Synthesized Mock Variables for Heatmap Generation
        const unverifiedLogs = Math.floor(Math.random() * 10);
        const industrialEngagementDays = Math.floor(Math.random() * 30);
        
        // Heatmap Risk Algorithm
        let riskLevel = 'Low Risk';
        let heatmapColor = '#10b981'; // Green
        if (unverifiedLogs > 4 || industrialEngagementDays > 14) {
          riskLevel = 'Medium Risk';
          heatmapColor = '#f59e0b'; // Yellow
        }
        if (unverifiedLogs > 7 || industrialEngagementDays > 21) {
          riskLevel = 'High Risk';
          heatmapColor = '#ef4444'; // Red
        }

        return { 
          id: doc.id, 
          ...data, 
          unverifiedLogs,
          industrialEngagementDays,
          riskLevel,
          heatmapColor
        };
      });
      setCohort(loadedCohort);
      setLoading(false);
    }, (err) => {
      console.error(err);
      setLoading(false);
    });
    
    return unsubscribe;
  };

  const getHighRiskCount = () => cohort.filter(s => s.riskLevel === 'High Risk').length;

  const stats = [
    { label: 'Total Cohort Size', value: cohort.length.toString(), icon: <FaGraduationCap />, color: '#3b82f6' },
    { label: 'Active Industry Links', value: '42', icon: <FaNetworkWired />, color: '#8b5cf6' },
    { label: 'At-Risk Pipelines', value: getHighRiskCount().toString(), icon: <FaFireAlt />, color: '#ef4444' },
  ];

  const headerStats = [
    { label: 'Followers', value: '2.9K' },
    { label: 'Trainees', value: cohort.length.toString() },
    { label: 'Rating', value: '4.9' }
  ];

  return (
    <div className={styles.container}>
      <ProfileHeader stats={headerStats} roleLabel="Verified Institution" bannerGradient="linear-gradient(120deg, #f6d365 0%, #fda085 100%)" />

      {/* System Telemetry */}
      <div className={styles.statsGrid}>
        {stats.map((stat, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className={styles.statCard}
            style={{ borderTop: `4px solid ${stat.color}` }}
          >
            <div className={styles.statIcon} style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
              {stat.icon}
            </div>
            <div>
              <p className={styles.statLabel}>{stat.label}</p>
              <h2 className={styles.statValue}>{stat.value}</h2>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ marginTop: '2rem' }}>
        <div className={styles.adminCard}>
          <nav className={styles.tabs}>
            <button className={activeTab === 'heatmap' ? styles.activeTab : ''} onClick={() => setActiveTab('heatmap')}>
              Cohort Progress Heatmap
            </button>
            <button className={activeTab === 'skills' ? styles.activeTab : ''} onClick={() => setActiveTab('skills')}>
              AI Skills Gaps (Macro)
            </button>
          </nav>

          <div className={styles.content}>
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <LoadingSpinner message="Synthesizing Ecosystem Telemetry..." fullHeight />
                </motion.div>
              ) : (
                <motion.div 
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {activeTab === 'heatmap' && <HeatmapTable cohort={cohort} />}
                  {activeTab === 'skills' && (
                    <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                      <FaBrain size={48} style={{ color: '#8b5cf6', marginBottom: '1rem' }} />
                      <h3>Macro AI Competency Mapping</h3>
                      <p>Institution-wide curriculum gap analysis is compiling daily logs...</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

const HeatmapTable = ({ cohort }) => {
  return (
    <div className={styles.tableWrapper}>
      <div className={styles.tableActions}>
         <div className={styles.searchBox}>
            <FaSearch color="var(--color-text-muted)" />
            <input type="text" placeholder="Filter pipeline by student or industry partner..." />
         </div>
         <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            Sorted by Risk Severity
         </span>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Student / Entity</th>
            <th>Program</th>
            <th>Unverified Milestones</th>
            <th>Days Since Last Engagement</th>
            <th>Ecosystem Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {cohort.sort((a,b) => b.unverifiedLogs - a.unverifiedLogs).map((s, i) => (
            <tr key={s.id || i}>
              <td>
                <strong>{s.displayName || s.email || 'Anonymous Student'}</strong>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>ID: {s.id.slice(0,8)}...</div>
              </td>
              <td>{s.department || 'B.S. Computer Science'}</td>
              <td>
                <span style={{ fontWeight: 800, color: s.heatmapColor }}>{s.unverifiedLogs}</span>
              </td>
              <td>{s.industrialEngagementDays} days</td>
              <td>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: s.heatmapColor }}></div>
                    <span style={{ fontWeight: 600, color: s.heatmapColor, fontSize: '0.85rem' }}>{s.riskLevel}</span>
                 </div>
              </td>
              <td>
                <button 
                  className="btn btn-secondary" 
                  style={{ padding: '6px 12px', fontSize: '0.8rem', borderRadius: '8px' }}
                >
                  Force Handshake
                </button>
              </td>
            </tr>
          ))}
          {cohort.length === 0 && (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No cohort data detected.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SchoolDashboard;