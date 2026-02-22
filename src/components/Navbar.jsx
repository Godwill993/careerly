import { FaSearch, FaBell, FaUserCircle, FaBars, FaSignOutAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import styles from '../styles/Navbar.module.css';

const Navbar = ({ toggleSidebar }) => {
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.leftSection}>
        <button onClick={toggleSidebar} className={styles.menuButton}>
          <FaBars />
        </button>
        <div className={styles.searchWrapper}>
          <FaSearch className={styles.searchIcon} />
          <input type="text" placeholder="Search..." className={styles.searchInput} />
        </div>
      </div>

      <div className={styles.rightSection}>
        <motion.div whileHover={{ scale: 1.1 }} className={styles.iconBadge}>
          <FaBell />
          <span className={styles.dot} />
        </motion.div>

        <div className={styles.profileSection}>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{user?.displayName || user?.email?.split('@')[0] || 'User'}</span>
            <span className={styles.userRole}>{user?.role || 'Guest'}</span>
          </div>
          <FaUserCircle className={styles.profileAvatar} />
          <button onClick={handleLogout} className={styles.logoutBtn} title="Logout">
            <FaSignOutAlt />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;