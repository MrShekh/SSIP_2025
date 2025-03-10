import React from 'react';
import { 
  HiClock,
  HiMail,
  HiCalendar,
  HiSwitchHorizontal
} from 'react-icons/hi';
import { format, addDays, addWeeks, addMonths } from 'date-fns';
import styles from './ReportScheduler.module.css';

const ReportScheduler = ({ settings, onSettingsChange }) => {
  const handleChange = (field, value) => {
    onSettingsChange({
      ...settings,
      [field]: value
    });
  };

  const getNextScheduleDate = () => {
    const today = new Date();
    switch (settings.frequency) {
      case 'daily':
        return addDays(today, 1);
      case 'weekly':
        return addWeeks(today, 1);
      case 'monthly':
        return addMonths(today, 1);
      default:
        return today;
    }
  };

  return (
    <div className={styles.schedulerPanel}>
      <h2 className={styles.panelTitle}>
        <HiClock className={styles.titleIcon} />
        Automatic Scheduling
      </h2>

      <div className={styles.scheduleSection}>
        <div className={styles.enableToggle}>
          <label className={styles.toggleLabel}>
            Enable Auto-Reports
            <div 
              className={`${styles.toggle} ${settings.enabled ? styles.enabled : ''}`}
              onClick={() => handleChange('enabled', !settings.enabled)}
            >
              <div className={styles.toggleHandle} />
            </div>
          </label>
        </div>

        {settings.enabled && (
          <>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>
                <HiCalendar className={styles.inputIcon} />
                Frequency
              </label>
              <select
                value={settings.frequency}
                onChange={(e) => handleChange('frequency', e.target.value)}
                className={styles.select}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>
                <HiClock className={styles.inputIcon} />
                Time
              </label>
              <input
                type="time"
                value={settings.time}
                onChange={(e) => handleChange('time', e.target.value)}
                className={styles.timeInput}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>
                <HiMail className={styles.inputIcon} />
                Email Recipients
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="Enter email address"
                className={styles.emailInput}
              />
            </div>

            <div className={styles.nextSchedule}>
              <HiSwitchHorizontal className={styles.scheduleIcon} />
              <div className={styles.scheduleInfo}>
                <span className={styles.scheduleLabel}>Next Report:</span>
                <span className={styles.scheduleDate}>
                  {format(getNextScheduleDate(), 'PPP')} at {settings.time}
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReportScheduler;
