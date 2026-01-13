import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBookmark, FaRegBookmark, FaSearch, FaCheckCircle, FaClock } from 'react-icons/fa';
import styles from '../styles/Dashboard.module.css';

const StudentDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock Data (Replace with Firebase service calls later)
  const stats = [
    { id: 1, label: 'Courses Completed', value: 12, icon: <FaCheckCircle />, color: '#10b981' },
    { id: 2, label: 'Courses Remaining', value: 4, icon: <FaClock />, color: '#f59e0b' },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.header}>
        <h1>Student Overview</h1>
        <div className={styles.searchBar}>
          <FaSearch />
          <input 
            type="text" 
            placeholder="Search internships or courses..." 
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      {/* Stats Section */}
      <section className={styles.statsGrid}>
        {stats.map(stat => (
          <motion.div key={stat.id} whileHover={{ y: -5 }} className={styles.statCard}>
            <div className={styles.statIcon} style={{ color: stat.color }}>{stat.icon}</div>
            <div>
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </section>

      <div className={styles.mainGrid}>
        {/* Internship Section */}
        <section className={styles.contentSection}>
          <h2>Recommended Internships</h2>
          <div className={styles.internshipGrid}>
            {[1, 2, 3].map((item) => (
              loading ? <SkeletonCard key={item} /> : <InternshipCard key={item} />
            ))}
          </div>
        </section>

        {/* Ranking Sidebar Section */}
        <aside className={styles.rankingSidebar}>
          <RankingCard title="School Ranking" />
          <RankingCard title="Company Ranking" />
        </aside>
      </div>
    </div>
  );
};

// Sub-components
const InternshipCard = () => (
  <motion.div 
    whileHover={{ y: -8 }}
    className={styles.internCard}
  >
    <div className={styles.imagePlaceholder}>
      <img src="https://via.placeholder.com/300x150" alt="Company" />
      <button className={styles.bookmarkBtn}><FaRegBookmark /></button>
    </div>
    <div className={styles.cardBody}>
      <span className={styles.tag}>Tech</span>
      <h4>Software Engineer Intern</h4>
      <p>Google Inc. • Remote</p>
      <button className="btn btn-primary mt-1" style={{ width: '100%' }}>Apply Now</button>
    </div>
  </motion.div>
);

const RankingCard = ({ title }) => (
  <div className={styles.rankCard}>
    <h4>{title}</h4>
    {[1, 2, 3].map(i => (
      <div key={i} className={styles.rankItem}>
        <span>#{i}</span>
        <p>{i === 1 ? 'Top Performer' : 'Elite Student'}</p>
        <strong>{95 - i}%</strong>
      </div>
    ))}
  </div>
);

const SkeletonCard = () => (
  <div className={`${styles.internCard} ${styles.skeleton}`}>
    <div className={styles.skeletonImage}></div>
    <div className={styles.skeletonText}></div>
    <div className={styles.skeletonText} style={{ width: '60%' }}></div>
  </div>
);

export default StudentDashboard;