import React, { useState } from 'react';
import { 
  HiDocumentDownload,
  HiDocument,
  HiTable 
} from 'react-icons/hi';
import styles from './ReportGenerator.module.css';

const ReportGenerator = () => {
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  const handleGenerateReport = () => {
    // Implement report generation logic
    console.log('Generating report for:', dateRange);
  };

  return (
    <div className={styles.reportsSection}>
      <div className={styles.reportsHeader}>
        <h2 className={styles.reportsTitle}>Generate Reports</h2>
      </div>

      <div className={styles.reportFilters}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Start Date</label>
          <input
            type="date"
            className={styles.filterInput}
            value={dateRange.startDate}
            onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
          />
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>End Date</label>
          <input
            type="date"
            className={styles.filterInput}
            value={dateRange.endDate}
            onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
          />
        </div>
      </div>

      <button 
        className={styles.generateButton}
        onClick={handleGenerateReport}
      >
        <HiDocumentDownload className="w-5 h-5" />
        Generate Report
      </button>

      <div className={styles.exportOptions}>
        <button className={`${styles.exportButton} ${styles.pdf}`}>
          <HiDocument className="w-5 h-5" />
          Export as PDF
        </button>
        <button className={`${styles.exportButton} ${styles.excel}`}>
          <HiTable className="w-5 h-5" />
          Export as Excel
        </button>
      </div>
    </div>
  );
};

export default ReportGenerator;
