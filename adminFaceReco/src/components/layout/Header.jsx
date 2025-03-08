import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  AiOutlineBell, 
  AiOutlineUser,
  AiOutlineDown,
  AiOutlineSetting,
  AiOutlineLogout
} from 'react-icons/ai';
import styles from './Header.module.css';

const Header = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'New Login',
      message: 'New login detected from your device',
      time: '2 minutes ago',
      read: false,
    },
    {
      id: 2,
      title: 'Profile Update',
      message: 'Your profile has been updated successfully',
      time: '1 hour ago',
      read: false,
    },
    {
      id: 3,
      title: 'System Update',
      message: 'System maintenance scheduled for tomorrow',
      time: '2 hours ago',
      read: false,
    },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleSettingsClick = () => {
    navigate('/settings');
    setShowProfileMenu(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Search..."
            className={styles.searchInput}
          />
        </div>

        <div className={styles.headerRight}>
          <div className={styles.notificationWrapper} ref={notificationRef}>
            <button
              className={styles.notificationButton}
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <AiOutlineBell className={styles.bellIcon} />
              {unreadCount > 0 && (
                <span className={styles.notificationBadge}>{unreadCount}</span>
              )}
            </button>
            {showNotifications && (
              <div className={styles.notificationDropdown}>
                <div className={styles.notificationHeader}>
                  <h3 className={styles.notificationTitle}>Notifications</h3>
                  <span className={styles.notificationCount}>
                    {unreadCount} New
                  </span>
                </div>
                <div className={styles.notificationList}>
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`${styles.notificationItem} ${
                        !notification.read ? styles.unread : ''
                      }`}
                    >
                      <h4 className={styles.notificationItemTitle}>
                        {notification.title}
                      </h4>
                      <p className={styles.notificationMessage}>
                        {notification.message}
                      </p>
                      <span className={styles.notificationTime}>
                        {notification.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className={styles.profileWrapper} ref={profileRef}>
            <button
              className={styles.profileButton}
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <div className={styles.profileInfo}>
                <AiOutlineUser className={styles.profileIcon} />
                <div className={styles.profileTextContent}>
                  <span className={styles.profileName}>
                    {user?.name || 'User Name'}
                  </span>
                  <span className={styles.profileRole}>
                    {user?.role || 'Admin'}
                  </span>
                </div>
                <AiOutlineDown className={styles.chevronIcon} />
              </div>
            </button>
            {showProfileMenu && (
              <div className={styles.profileMenu}>
                <div className={styles.profileHeader}>
                  <div className={styles.profileAvatar}>
                    <AiOutlineUser className={styles.avatarIcon} />
                  </div>
                  <div className={styles.profileDetails}>
                    <span className={styles.profileFullName}>
                      {user?.name || 'User Name'}
                    </span>
                    <span className={styles.profileEmail}>
                      {user?.email || 'user@example.com'}
                    </span>
                  </div>
                </div>
                <div className={styles.menuItems}>
                  <button
                    className={styles.menuItem}
                    onClick={handleSettingsClick}
                  >
                    <AiOutlineSetting className={styles.menuIcon} />
                    Settings
                  </button>
                  <button
                    className={`${styles.menuItem} ${styles.logoutItem}`}
                    onClick={handleLogout}
                  >
                    <AiOutlineLogout className={styles.menuIcon} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
