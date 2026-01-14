import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaApple, FaTrophy, FaBuilding, FaBook, FaPlus, FaSearch } from 'react-icons/fa';
import styles from '../styles/SchoolDashboard.module.css';

const SchoolDashboard = () => {
  const [activeTab, setActiveTab] = useState('students');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    { label: 'Total Students', value: '1,240', icon: <FaApple />, color: 'var(--color-primary)' },
    { label: 'Active Courses', value: '42', icon: <FaBook />, color: 'var(--color-secondary)' },
    { label: 'Partner Companies', value: '18', icon: <FaBuilding />, color: '#10b981' },
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>School Administration</h1>
          <p className="text-muted">Manage your academic ecosystem</p>
        </div>
        <button className="btn btn-primary">
          <FaPlus style={{ marginRight: '0.5rem' }} /> Create New Course
        </button>
      </header>

      {/* Quick Stats */}
      <div className={styles.statsGrid}>
        {stats.map((stat, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={styles.statCard}
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

      {/* Main Admin Section */}
      <div className={styles.adminCard}>
        <nav className={styles.tabs}>
          <button className={activeTab === 'students' ? styles.activeTab : ''} onClick={() => setActiveTab('students')}>Students</button>
          <button className={activeTab === 'rankings' ? styles.activeTab : ''} onClick={() => setActiveTab('rankings')}>Rankings</button>
          <button className={activeTab === 'interactions' ? styles.activeTab : ''} onClick={() => setActiveTab('interactions')}>Company Interactions</button>
        </nav>

        <div className={styles.content}>
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.loader}>
                <div className={styles.spinner}></div>
                <p>Fetching records...</p>
              </motion.div>
            ) : (
              <motion.div 
                key={activeTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                {activeTab === 'students' && <StudentTable />}
                {activeTab === 'rankings' && <RankingPublisher />}
                {activeTab === 'interactions' && <InteractionList />}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

// Sub-components for cleaner logic
const StudentTable = () => (
  <div className={styles.tableWrapper}>
    <div className={styles.tableActions}>
      <div className={styles.searchBox}>
        <FaSearch />
        <input type="text" placeholder="Filter students..." />
      </div>
    </div>
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Student Name</th>
          <th>ID</th>
          <th>Course</th>
          <th>GPA</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {[1, 2, 3, 4].map(i => (
          <tr key={i}>
            <td><strong>John Doe</strong></td>
            <td>#STD-00{i}</td>
            <td>Computer Science</td>
            <td>3.8</td>
            <td><span className={styles.badge}>Active</span></td>
            <td><button className={styles.editBtn}>Manage</button></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const RankingPublisher = () => (
  <div className={styles.placeholderView}>
    <FaTrophy size={40} color="var(--color-secondary)" />
    <h3>Publish Monthly Rankings</h3>
    <p>Select a department to generate and publish current student leaderboards.</p>
    <button className="btn btn-secondary mt-1">Generate Standings</button>
  </div>
);

const InteractionList = () => (
  <div className={styles.placeholderView}>
    <FaBuilding size={40} color="var(--color-primary)" />
    <h3>Recent Company Hires</h3>
    <p>Google and Microsoft recently viewed 15 student profiles from your institution.</p>
  </div>
);

export default SchoolDashboard;