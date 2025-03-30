import React, { useState, memo } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import styles from './Layout.module.css';

// Optimize Layout with memo to prevent unnecessary re-renders
const Layout = memo(({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
 
  const handleSidebarCollapse = (collapsed) => {
    setIsSidebarCollapsed(collapsed);
  };

  return (
    <div className={styles.mainLayout}>
      <Sidebar onCollapse={handleSidebarCollapse} />
      <div className={`${styles.mainContent} ${isSidebarCollapsed ? styles.collapsed : ''}`}>
        <Header isSidebarCollapsed={isSidebarCollapsed} />
        <main className={styles.contentArea}>
          {children}
        </main>
      </div>
    </div>
  );
});

Layout.displayName = 'Layout';

export default Layout;
