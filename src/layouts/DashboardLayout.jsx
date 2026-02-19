import { useState } from 'react';
import { Outlet } from 'react-router-dom'; // FIXED: Required for nested routes
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import styles from '../styles/DashboardLayout.module.css';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Close sidebar on mobile when navigating
  const closeSidebarOnMobile = () => {
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className={styles.layoutContainer}>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} onCloseMobile={closeSidebarOnMobile} />
      
      {/* Mobile Overlay Backdrop */}
      {isSidebarOpen && (
        <div 
          className={styles.mobileOverlay} 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      <div className={styles.mainWrapper}>
        <Navbar toggleSidebar={toggleSidebar} />
        
        <main className={styles.contentArea}>
          <div className={styles.container}>
            {/* FIXED: Replaced {children} with <Outlet /> to show sub-pages */}
            <Outlet /> 
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;