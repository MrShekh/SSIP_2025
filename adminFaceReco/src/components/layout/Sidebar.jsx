import React, { useState, useMemo, memo, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Dashboard, 
  People, 
  CreditCard, 
  InsertChart, 
  Menu,
  ChevronLeft,
  MonetizationOn
} from '@mui/icons-material';
import styles from './Sidebar.module.css';

// Optimize Sidebar with memo to prevent unnecessary re-renders
const Sidebar = memo(({ onCollapse }) => {
  const [collapsed, setCollapsed] = useState(false);

  // Optimize navigation toggle with useCallback
  const toggleCollapse = useCallback(() => {
    setCollapsed(prev => {
      const newState = !prev;
      if (onCollapse) onCollapse(newState);
      return newState;
    });
  }, [onCollapse]);

  // Memoize navigation items to prevent recreation on each render
  const navigationItems = useMemo(() => [
    { path: '/dashboard', name: 'Dashboard', icon: <Dashboard /> },
    { path: '/employees', name: 'Employees', icon: <People /> },
    { path: '/attendance', name: 'Attendance', icon: <CreditCard /> },
    { path: '/payroll', name: 'Payroll', icon: <MonetizationOn /> },
    { path: '/reports', name: 'Reports', icon: <InsertChart /> },
  ], []);

  return (
    <div className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
      <div className={styles.sidebarHeader}>
        {!collapsed && <h2 className={styles.sidebarLogo}>Admin Dashboard</h2>}
        <button 
          className={styles.collapseButton}
          onClick={toggleCollapse}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <Menu className={styles.navIcon} /> : <ChevronLeft className={styles.navIcon} />}
        </button>
      </div>

      <nav className={styles.navigation}>
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `${styles.navItem} ${isActive ? styles.active : ''}`
            }
            title={collapsed ? item.name : ''}
            end={item.path === '/'}
          >
            <span className={styles.navIcon}>{item.icon}</span>
            {!collapsed && <span className={styles.navText}>{item.name}</span>}
          </NavLink>
        ))}
      </nav>
    </div>
  );
});

Sidebar.displayName = 'Sidebar';

export default Sidebar;