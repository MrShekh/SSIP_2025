import React from 'react';
import {
  HiCalendar,
  HiUser,
  HiOfficeBuilding,
  HiFilter,
} from 'react-icons/hi';
import styles from './ReportFilters.module.css';

const ReportFilters = ({ filters, onChange }) => {
  const handleTimeRangeClick = (range) => {
    onChange({ ...filters, timeRange: range });
  };

  const handleStatusToggle = (status) => {
    const newStatuses = filters.status.includes(status)
      ? filters.status.filter(s => s !== status)
      : [...filters.status, status];
    onChange({ ...filters, status: newStatuses });
  };

  const handleChange = (field, value) => {
    onChange({ ...filters, [field]: value });
  };

  return (
    <div className={styles.filtersPanel}>
      <h2 className={styles.panelTitle}>
        <HiFilter className={styles.titleIcon} />
        Filter Report
      </h2>

      <div className={styles.filterSection}>
        <label className={styles.filterLabel}>Time Range</label>
        <div className={styles.timeRangeSelector}>
          <button
            className={`${styles.timeRangeButton} ${
              filters.timeRange === 'day' ? styles.active : ''
            }`}
            onClick={() => handleTimeRangeClick('day')}
          >
            Today
          </button>
          <button
            className={`${styles.timeRangeButton} ${
              filters.timeRange === 'week' ? styles.active : ''
            }`}
            onClick={() => handleTimeRangeClick('week')}
          >
            This Week
          </button>
          <button
            className={`${styles.timeRangeButton} ${
              filters.timeRange === 'month' ? styles.active : ''
            }`}
            onClick={() => handleTimeRangeClick('month')}
          >
            This Month
          </button>
          <button
            className={`${styles.timeRangeButton} ${
              filters.timeRange === 'custom' ? styles.active : ''
            }`}
            onClick={() => handleTimeRangeClick('custom')}
          >
            Custom
          </button>
        </div>

        {filters.timeRange === 'custom' && (
          <div className={styles.dateInputs}>
            <div className={styles.dateField}>
              <HiCalendar className={styles.fieldIcon} />
              <input
                type="date"
                className={styles.dateInput}
                value={filters.startDate || ''}
                onChange={(e) => handleChange('startDate', e.target.value)}
              />
            </div>
            <div className={styles.dateField}>
              <HiCalendar className={styles.fieldIcon} />
              <input
                type="date"
                className={styles.dateInput}
                value={filters.endDate || ''}
                onChange={(e) => handleChange('endDate', e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      <div className={styles.filterSection}>
        <label className={styles.filterLabel}>Department</label>
        <div className={styles.inputField}>
          <HiOfficeBuilding className={styles.fieldIcon} />
          <select
            className={styles.select}
            value={filters.department}
            onChange={(e) => handleChange('department', e.target.value)}
          >
            <option value="">All Departments</option>
            <option value="engineering">Engineering</option>
            <option value="marketing">Marketing</option>
            <option value="sales">Sales</option>
            <option value="hr">HR</option>
            <option value="finance">Finance</option>
          </select>
        </div>
      </div>

      <div className={styles.filterSection}>
        <label className={styles.filterLabel}>Employee</label>
        <div className={styles.inputField}>
          <HiUser className={styles.fieldIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search employee..."
            value={filters.employee}
            onChange={(e) => handleChange('employee', e.target.value)}
          />
        </div>
      </div>

      <div className={styles.filterSection}>
        <label className={styles.filterLabel}>Status</label>
        <div className={styles.statusButtons}>
          <button
            className={`${styles.statusButton} ${styles.present} ${
              filters.status.includes('present') ? styles.active : ''
            }`}
            onClick={() => handleStatusToggle('present')}
          >
            Present
          </button>
          <button
            className={`${styles.statusButton} ${styles.late} ${
              filters.status.includes('late') ? styles.active : ''
            }`}
            onClick={() => handleStatusToggle('late')}
          >
            Late
          </button>
          <button
            className={`${styles.statusButton} ${styles.absent} ${
              filters.status.includes('absent') ? styles.active : ''
            }`}
            onClick={() => handleStatusToggle('absent')}
          >
            Absent
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportFilters;
