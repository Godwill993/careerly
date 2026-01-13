import { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import styles from '../styles/DashboardLayout.module.css';

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={styles.layoutContainer}>
      {/* Sidebar remains fixed or relative based on CSS */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className={styles.mainWrapper}>
        <Navbar toggleSidebar={toggleSidebar} />
        
        <main className={styles.contentArea}>
          {/* This is where your pages will be rendered */}
          <div className={styles.container}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;