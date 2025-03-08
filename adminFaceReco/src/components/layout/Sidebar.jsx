import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { 
  AiOutlineHome,
  AiOutlineTeam,
  AiOutlineFileText,
  AiOutlineLeft,
  AiOutlineRight
} from 'react-icons/ai';
import styles from './Sidebar.module.css';

const Sidebar = ({ onCollapse }) => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { title: 'Dashboard', path: '/', icon: AiOutlineHome },
    { title: 'Attendance', path: '/attendance', icon: AiOutlineTeam },
    { title: 'Reports', path: '/reports', icon: AiOutlineFileText },
  ];

  const toggleSidebar = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    onCollapse?.(newCollapsed);
  };

  return (
    <div className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
      <div className={styles.sidebarHeader}>
        {!isCollapsed && <h2 className={styles.sidebarLogo}>Admin Dashboard</h2>}
        <button 
          className={styles.collapseButton}
          onClick={toggleSidebar}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <AiOutlineRight className={styles.navIcon} /> : <AiOutlineLeft className={styles.navIcon} />}
        </button>
      </div>
      
      <nav className={styles.navigation}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`${styles.navItem} ${isActive ? styles.active : ''}`}
              title={isCollapsed ? item.title : ''}
            >
              <Icon className={styles.navIcon} />
              {!isCollapsed && <span className={styles.navText}>{item.title}</span>}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

Sidebar.propTypes = {
  onCollapse: PropTypes.func
};

export default Sidebar;
