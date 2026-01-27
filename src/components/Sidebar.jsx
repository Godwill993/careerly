import { motion, AnimatePresence } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FaHome, FaChartPie, FaRobot, 
  FaUserFriends, FaCog, FaChevronLeft 
} from 'react-icons/fa';
import styles from '../styles/Sidebar.module.css';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user } = useAuth();

  // Dynamic dashboard path based on role
  const dashboardPath = user ? `/${user.role}-dashboard` : '/login';

  const menuItems = [
    { id: 1, label: 'Dashboard', icon: <FaHome />, path: dashboardPath },
    { id: 2, label: 'Internships', icon: <FaChartPie />, path: '/internships' },
    { id: 3, label: 'AI Assistant', icon: <FaRobot />, path: '/ai-assistant' },
    { id: 4, label: 'Rankings', icon: <FaUserFriends />, path: '/rankings' },
    { id: 5, label: 'Settings', icon: <FaCog />, path: '/settings' },
  ];

  return (
    <motion.aside 
      className={styles.sidebar}
      animate={{ width: isOpen ? '260px' : '80px' }}
    >
      <div className={styles.header}>
        <div className={styles.logoIcon}>C</div>
        <AnimatePresence>
          {isOpen && (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.logoText}>
              <div className> Careerly</div>
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <nav className={styles.nav}>
        {menuItems.map((item) => (
          <NavLink 
            to={item.path} 
            key={item.id} 
            className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}
          >
            <div className={styles.icon}>{item.icon}</div>
            {isOpen && <span className={styles.label}>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      
    </motion.aside>
  );
};

export default Sidebar;
