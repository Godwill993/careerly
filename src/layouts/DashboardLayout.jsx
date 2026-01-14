import { useState } from 'react';
import { Outlet } from 'react-router-dom'; // 1. Add this import
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import styles from '../styles/DashboardLayout.module.css';

const DashboardLayout = () => { // 2. Remove ({ children })
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={styles.layoutContainer}>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className={styles.mainWrapper}>
        <Navbar toggleSidebar={toggleSidebar} />
        
        <main className={styles.contentArea}>
          <div className={styles.container}>
            {/* 3. Replace {children} with <Outlet /> */}
            <Outlet /> 
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;