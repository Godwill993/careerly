import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBookmark, FaRegBookmark, FaSearch, FaCheckCircle, FaClock, FaBook } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { internshipService } from '../services/internshipService';
import LoadingSpinner from '../components/LoadingSpinner';
import styles from '../styles/Dashboard.module.css';

const StudentDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [applications, setApplications] = useState([]);
  const [internships, setInternships] = useState([]);
  const [courses, setCourses] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.uid) {
      loadStudentData();
    }
  }, [user]);

  const loadStudentData = async () => {
    setLoading(true);
    try {
      // Load user profile specifically to get latest courses
      const { doc, getDoc } = await import('firebase/firestore');
      const { db } = await import('../firebase/config');
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
         setCourses(userSnap.data().courses || []);
      }

      // Load student's applications
      const apps = await internshipService.getStudentApplications(user.uid);
      setApplications(apps);
      
      // Load some general internships for the "Recommended" section
      const allInternships = await internshipService.getAllInternships();
      setInternships(allInternships.slice(0, 3)); // Just show top 3 for now
    } catch (error) {
      console.error("Error loading student data:", error);
    }
    setLoading(false);
  };

  const stats = [
    { id: 1, label: 'Applications Submitted', value: applications.length, icon: <FaCheckCircle />, color: '#10b981' },
    { id: 2, label: 'Interviews Scheduled', value: applications.filter(a => a.status === 'accepted').length, icon: <FaClock />, color: '#f59e0b' },
  ];

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

      <div className={styles.mainGrid} style={{ gridTemplateColumns: '1fr' }}>
        {/* Applications Section */}
        <section className={styles.contentSection} style={{ marginBottom: '2rem' }}>
          <h2>My Applications</h2>
          {loading ? (
             <LoadingSpinner message="Fetching your applications..." />
          ) : applications.length > 0 ? (
             <div className="table-wrapper" style={{ overflowX: 'auto', marginTop: '1rem', background: 'var(--color-surface)', borderRadius: '12px', padding: '1rem', border: '1px solid var(--color-border)' }}>
               <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                 <thead>
                   <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                     <th style={{ padding: '12px', color: 'var(--color-text-muted)' }}>Position</th>
                     <th style={{ padding: '12px', color: 'var(--color-text-muted)' }}>Status</th>
                   </tr>
                 </thead>
                 <tbody>
                   {applications.map(app => (
                     <tr key={app.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                       <td style={{ padding: '12px', fontWeight: '500' }}>{app.internshipTitle || 'Job Application'}</td>
                       <td style={{ padding: '12px' }}>
                         <span className={styles.badge} style={{ background: app.status === 'accepted' ? '#10b98115' : 'var(--color-primary-light)', color: app.status === 'accepted' ? '#10b981' : 'var(--color-primary)' }}>
                           {app.status || 'Pending'}
                         </span>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          ) : (
             <p style={{ padding: '2rem', textAlign: 'center', background: 'var(--color-surface)', borderRadius: '12px', border: '1px solid var(--color-border)' }}>You haven't applied to any roles yet.</p>
          )}
        </section>

        {/* My Courses Section */}
        <section className={styles.contentSection} style={{ marginBottom: '2rem' }}>
          <h2>My Assigned Courses</h2>
          {loading ? (
             <LoadingSpinner message="Fetching your courses..." />
          ) : courses.length > 0 ? (
             <div className={styles.grid} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
               {courses.map((course, idx) => (
                 <motion.div whileHover={{ y: -5 }} key={idx} style={{ padding: '1.5rem', background: 'var(--color-primary-light)', borderRadius: '12px', border: `1px solid var(--color-primary)` }}>
                   <FaBook style={{ fontSize: '2rem', color: 'var(--color-primary)', marginBottom: '1rem' }} />
                   <h4 style={{ color: 'var(--color-text)' }}>{course}</h4>
                 </motion.div>
               ))}
             </div>
          ) : (
             <p style={{ padding: '2rem', textAlign: 'center', background: 'var(--color-surface)', borderRadius: '12px', border: '1px solid var(--color-border)' }}>Your school hasn't assigned any courses to you yet.</p>
          )}
        </section>

        {/* Recommended Internship Section */}
        <section className={styles.contentSection}>
          <h2>Recommended Jobs</h2>
          {loading ? (
             <LoadingSpinner message="Curating your recommendations..." />
          ) : (
            <div className={styles.internshipGrid}>
              {internships.length > 0 ? (
                 internships.map((internship) => (
                   <InternshipCard key={internship.id} internship={internship} />
                 ))
              ) : (
                 <p style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
                   No jobs available right now.
                 </p>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

// Sub-components
const InternshipCard = ({ internship }) => (
  <motion.div 
    whileHover={{ y: -8 }}
    className={styles.internCard}
  >
    <div className={styles.imagePlaceholder} style={{ background: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>
        {internship.company?.charAt(0).toUpperCase() || 'C'}
      </span>
      <button className={styles.bookmarkBtn}><FaRegBookmark /></button>
    </div>
    <div className={styles.cardBody}>
      <span className={styles.tag}>{internship.type || 'Tech'}</span>
      <h4>{internship.title}</h4>
      <p>{internship.company} • {internship.location || 'Remote'}</p>
      <button className="btn btn-primary mt-1" style={{ width: '100%' }}>View Details</button>
    </div>
  </motion.div>
);

const SkeletonCard = () => (
  <div className={`${styles.internCard} ${styles.skeleton}`}>
    <div className={styles.skeletonImage}></div>
    <div className={styles.skeletonText}></div>
    <div className={styles.skeletonText} style={{ width: '60%' }}></div>
  </div>
);

export default StudentDashboard;