import { motion, AnimatePresence } from 'framer-motion';
import { FaApple, FaTrophy, FaBuilding, FaBook, FaPlus, FaSearch, FaTimes } from 'react-icons/fa';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { schoolService } from '../services/schoolService';
import { db } from '../firebase/config';
import { collection, getDocs, query, where } from 'firebase/firestore';
import styles from '../styles/SchoolDashboard.module.css';
import "../styles/index.css";
import { useState, useEffect } from 'react'; // Added useState and useEffect imports

const SchoolDashboard = () => {
  const [activeTab, setActiveTab] = useState('students');
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.uid) {
      loadSchoolData();
    }
  }, [user]);

  const loadSchoolData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Students specifically for this school
      const studentsQ = query(collection(db, "users"), where("role", "==", "student"), where("schoolId", "==", user.uid));
      const studentsSnap = await getDocs(studentsQ);
      setStudents(studentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      
      // 2. Fetch Departments for this school
      const deps = await schoolService.getDepartments(user.uid);
      setDepartments(deps);
      
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const stats = [
    { label: 'Total Students', value: students.length.toString(), icon: <FaApple />, color: 'var(--color-primary)' },
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
          <button className={activeTab === 'departments' ? styles.activeTab : ''} onClick={() => setActiveTab('departments')}>Departments</button>
        </nav>

        <div className={styles.content}>
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <LoadingSpinner message="Fetching campus records..." fullHeight />
              </motion.div>
            ) : (
              <motion.div 
                key={activeTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                {activeTab === 'students' && <StudentTable students={students} schoolId={user.uid} onRefresh={loadSchoolData} />}
                {activeTab === 'departments' && <DepartmentList departments={departments} schoolId={user.uid} onRefresh={loadSchoolData} />}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

// Sub-components for cleaner logic
const StudentTable = ({ students, schoolId, onRefresh }) => {
  const [selectedStudent, setSelectedStudent] = useState(null);

  return (
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
            <th>Email</th>
            <th>Department</th>
            <th>Courses Assigned</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {students.length > 0 ? students.map((s, i) => (
            <tr key={s.id || i}>
              <td><strong>{s.displayName || s.firstName || 'Student'}</strong></td>
              <td>{s.email}</td>
              <td>{s.department || 'Unassigned'}</td>
              <td>{s.courses ? s.courses.length : 0}</td>
              <td>
                <button 
                  className="btn btn-secondary" 
                  style={{ padding: '5px 10px', fontSize: '0.8rem' }}
                  onClick={() => setSelectedStudent(s)}
                >
                  Manage Courses
                </button>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>No students found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Course Assignment Modal */}
      <AnimatePresence>
        {selectedStudent && (
          <CourseModal 
            student={selectedStudent} 
            onClose={() => setSelectedStudent(null)} 
            onRefresh={onRefresh}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const CourseModal = ({ student, onClose, onRefresh }) => {
  const [newCourse, setNewCourse] = useState('');
  const [assigning, setAssigning] = useState(false);

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!newCourse.trim()) return;
    setAssigning(true);
    try {
      await schoolService.assignCourse(student.id, newCourse.trim());
      setNewCourse('');
      onRefresh();
      // Since context/props might not update immediately for modal, you might close or let them stay
    } catch (err) {
      console.error(err);
    }
    setAssigning(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className={styles.modalOverlay}
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
        style={{ background: 'var(--color-surface)', padding: '2rem', borderRadius: '12px', width: '90%', maxWidth: '500px' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ margin: 0 }}>Manage {student.displayName || 'Student'}'s Courses</h3>
          <FaTimes onClick={onClose} style={{ cursor: 'pointer', fontSize: '1.2rem', color: 'var(--color-text-muted)' }} />
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>Current Courses</h4>
          {student.courses && student.courses.length > 0 ? (
            <ul style={{ paddingLeft: '1.2rem', color: 'var(--color-text)' }}>
              {student.courses.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          ) : (
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>No courses assigned yet.</p>
          )}
        </div>

        <form onSubmit={handleAssign} style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="text" 
            placeholder="Course Name (e.g. CS101)" 
            value={newCourse} 
            onChange={(e) => setNewCourse(e.target.value)}
            style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)' }}
            disabled={assigning}
          />
          <button type="submit" className="btn btn-primary" disabled={assigning}>
            {assigning ? 'Adding...' : 'Assign'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};


const DepartmentList = ({ departments, schoolId, onRefresh }) => {
  const [newDep, setNewDep] = useState('');
  const [adding, setAdding] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newDep.trim()) return;
    setAdding(true);
    try {
      await schoolService.addDepartment(schoolId, newDep);
      setNewDep('');
      onRefresh();
    } catch (err) {
      console.error(err);
    }
    setAdding(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3>Active Departments</h3>
        <form onSubmit={handleAdd} style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="text" 
            placeholder="New Department Name" 
            value={newDep} 
            onChange={(e) => setNewDep(e.target.value)}
            style={{ padding: '8px', borderRadius: '5px', border: '1px solid var(--color-border)' }}
            disabled={adding}
          />
          <button type="submit" className="btn btn-primary" disabled={adding}>
            {adding ? 'Adding...' : 'Add'}
          </button>
        </form>
      </div>

      <div className={styles.grid} style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        {departments.map(dep => (
          <div key={dep.id} style={{ padding: '1.5rem', background: 'var(--color-surface)', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
            <h4>{dep.name}</h4>
          </div>
        ))}
        {departments.length === 0 && <p style={{ gridColumn: '1 / -1' }}>No departments defined yet.</p>}
      </div>
    </div>
  )
};

export default SchoolDashboard;