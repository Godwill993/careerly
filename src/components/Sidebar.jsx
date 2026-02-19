

import { motion, AnimatePresence } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMenuItems } from '../config/navigation.jsx';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'; // Added icons
import styles from '../styles/Sidebar.module.css';

const Sidebar = ({ isOpen, toggleSidebar, onCloseMobile }) => {
  const { user } = useAuth();

  const menuItems = getMenuItems(user?.role);

  return (
    <motion.aside 
      className={styles.sidebar}
      animate={{ width: isOpen ? '260px' : '80px' }}
      // On mobile, if open, we want it full width or fixed width, simplified here by reliance on CSS class
    >
      <div className={styles.header}>
        <div className={styles.logoIcon}>C</div>
        <AnimatePresence>
          {isOpen && (
            <motion.span 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className={styles.logoText}
            >
              Careerly
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
            onClick={onCloseMobile} // Close sidebar on mobile when link is clicked
          >
            <div className={styles.icon}>{item.icon}</div>
            {isOpen && (
              <motion.span 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className={styles.label}
              >
                {item.label}
              </motion.span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Collapse Button */}
      <div className={styles.footer}>
        <div className={styles.toggleBtn} onClick={toggleSidebar}>
          {isOpen ? <FaChevronLeft /> : <FaChevronRight />}
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
