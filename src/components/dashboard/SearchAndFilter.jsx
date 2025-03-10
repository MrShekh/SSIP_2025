import React, { useState } from 'react';
import { HiSearch, HiFilter } from 'react-icons/hi';
import styles from './SearchAndFilter.module.css';

const SearchAndFilter = ({ onSearch, onFilter }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    date: '',
    status: '',
    department: ''
  });

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    onFilter({ ...filters, [name]: value });
  };

  return (
    <div className={styles.searchFilterContainer}>
      <form onSubmit={handleSearch} className={styles.searchForm}>
        <div className={styles.searchBox}>
          <HiSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        
        <div className={styles.filterGroup}>
          <div className={styles.filterItem}>
            <select
              name="date"
              value={filters.date}
              onChange={handleFilterChange}
              className={styles.filterSelect}
            >
              <option value="">Select Date</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="thisWeek">This Week</option>
              <option value="thisMonth">This Month</option>
            </select>
          </div>

          <div className={styles.filterItem}>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className={styles.filterSelect}
            >
              <option value="">Select Status</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
            </select>
          </div>

          <div className={styles.filterItem}>
            <select
              name="department"
              value={filters.department}
              onChange={handleFilterChange}
              className={styles.filterSelect}
            >
              <option value="">Select Department</option>
              <option value="engineering">Engineering</option>
              <option value="hr">HR</option>
              <option value="marketing">Marketing</option>
              <option value="sales">Sales</option>
            </select>
          </div>

          <button type="submit" className={styles.applyButton}>
            <HiFilter className={styles.filterIcon} />
            Apply Filters
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchAndFilter;
