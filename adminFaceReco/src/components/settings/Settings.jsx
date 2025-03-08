import React, { useState } from 'react';
import { SaveIcon } from '@heroicons/react/outline';
import styles from './Settings.module.css';

const Settings = () => {
  const [settings, setSettings] = useState({
    faceRecognitionThreshold: 0.8,
    attendanceTimeWindow: 30,
    enableNotifications: true,
    autoGenerateReports: false
  });

  const handleSaveSettings = () => {
    // Implement settings save logic
    console.log('Saving settings:', settings);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>System Settings</h2>
        <p className={styles.description}>
          Configure your face recognition and attendance system settings
        </p>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Face Recognition Settings</h3>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>
            Recognition Threshold
            <span className={`${styles.textSm} ${styles.textGray} ${styles.ml2}`}>
              (Higher value = stricter matching)
            </span>
          </label>
          <input
            type="range"
            min="0.5"
            max="0.95"
            step="0.05"
            className={styles.formInput}
            value={settings.faceRecognitionThreshold}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              faceRecognitionThreshold: parseFloat(e.target.value)
            }))}
          />
          <span className={styles.textSm}>{settings.faceRecognitionThreshold}</span>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Attendance Settings</h3>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>
            Attendance Time Window (minutes)
          </label>
          <input
            type="number"
            className={styles.formInput}
            value={settings.attendanceTimeWindow}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              attendanceTimeWindow: parseInt(e.target.value)
            }))}
          />
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Notifications</h3>
        <div className={styles.formGroup}>
          <label className={styles.toggleContainer}>
            <div className={styles.toggleSwitch}>
              <input
                type="checkbox"
                className={styles.toggleInput}
                checked={settings.enableNotifications}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  enableNotifications: e.target.checked
                }))}
              />
              <span className={styles.toggleSlider}></span>
            </div>
            Enable Email Notifications
          </label>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.toggleContainer}>
            <div className={styles.toggleSwitch}>
              <input
                type="checkbox"
                className={styles.toggleInput}
                checked={settings.autoGenerateReports}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  autoGenerateReports: e.target.checked
                }))}
              />
              <span className={styles.toggleSlider}></span>
            </div>
            Auto-generate Daily Reports
          </label>
        </div>
      </div>

      <button 
        className={styles.saveButton}
        onClick={handleSaveSettings}
      >
        <SaveIcon className="w-5 h-5" />
        Save Settings
      </button>
    </div>
  );
};

export default Settings;
