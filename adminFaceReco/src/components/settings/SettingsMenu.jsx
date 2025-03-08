import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import {
  Close as CloseIcon,
  CameraAlt as FaceRecognitionIcon,
  AccessTime as AttendanceIcon,
  People as UserRoleIcon,
} from '@mui/icons-material';
import styles from './Settings.module.css';
import FaceRecognitionSettings from './FaceRecognitionSettings';
import AttendanceSettings from './AttendanceSettings';
import UserRoleSettings from './UserRoleSettings';

const SettingsMenu = ({ open, onClose, activeSection, onSectionChange }) => {
  const menuItems = [
    {
      id: 'faceRecognition',
      label: 'Face Recognition',
      icon: <FaceRecognitionIcon />,
      component: FaceRecognitionSettings,
    },
    {
      id: 'attendance',
      label: 'Attendance Rules',
      icon: <AttendanceIcon />,
      component: AttendanceSettings,
    },
    {
      id: 'userRole',
      label: 'User & Role Management',
      icon: <UserRoleIcon />,
      component: UserRoleSettings,
    },
  ];

  const ActiveComponent = menuItems.find(item => item.id === activeSection)?.component || FaceRecognitionSettings;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      classes={{ paper: styles.settingsDrawer }}
    >
      <div className={styles.settingsHeader}>
        <Typography variant="h6">Settings</Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </div>
      
      <div className={styles.settingsContent}>
        <div className={styles.settingsSidebar}>
          <List component="nav">
            {menuItems.map((item) => (
              <ListItem
                key={item.id}
                button
                onClick={() => onSectionChange(item.id)}
                className={`${styles.menuItem} ${activeSection === item.id ? styles.selected : ''}`}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
          </List>
        </div>
        
        <div className={styles.settingsMain}>
          <ActiveComponent />
        </div>
      </div>
    </Drawer>
  );
};

export default SettingsMenu;
