import React, { useState } from 'react';
import { HiSearch, HiFilter } from 'react-icons/hi';
import styles from './AttendanceFilters.module.css';

const AttendanceFilters = ({ onFilterChange, onSearch }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleFilterApply = () => {
    onFilterChange({
      dateRange: { start: startDate, end: endDate },
      status
    });
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  return (
    <div className={styles.filtersContainer}>
      <div className={styles.searchBox}>
        <HiSearch className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search by employee name..."
          value={searchQuery}
          onChange={handleSearchChange}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.filters}>
        <div className={styles.dateFilters}>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={styles.dateInput}
          />
          <span className={styles.dateSeparator}>to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className={styles.dateInput}
          />
        </div>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className={styles.statusSelect}
        >
          <option value="all">All Status</option>
          <option value="present">Present</option>
          <option value="absent">Absent</option>
          <option value="late">Late</option>
        </select>

        <button
          onClick={handleFilterApply}
          className={styles.applyButton}
        >
          <HiFilter className="w-5 h-5 mr-2" />
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default AttendanceFilters;
