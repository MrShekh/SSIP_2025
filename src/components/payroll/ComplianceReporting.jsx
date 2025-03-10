import React, { useState } from 'react';
import { AiOutlineDownload, AiOutlineFile, AiOutlineCheck, AiOutlineWarning } from 'react-icons/ai';
import styles from './ComplianceReporting.module.css';

const ComplianceReporting = () => {
  const [selectedReport, setSelectedReport] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const complianceStatus = [
    {
      id: 1,
      category: 'Labor Laws',
      status: 'compliant',
      lastChecked: '2024-03-01',
      details: 'All employee contracts up to date'
    },
    {
      id: 2,
      category: 'Working Hours',
      status: 'warning',
      lastChecked: '2024-03-01',
      details: '3 employees exceeded maximum overtime hours'
    },
    {
      id: 3,
      category: 'Payroll Taxes',
      status: 'compliant',
      lastChecked: '2024-03-01',
      details: 'All tax deductions properly calculated and filed'
    }
  ];

  const availableReports = [
    { id: 'payroll', name: 'Payroll Summary Report' },
    { id: 'tax', name: 'Tax Compliance Report' },
    { id: 'labor', name: 'Labor Law Compliance Report' },
    { id: 'attendance', name: 'Attendance & Leave Report' }
  ];

  const handleGenerateReport = () => {
    // Implement report generation logic
    console.log('Generating report:', selectedReport, dateRange);
  };

  return (
    <div className={styles.complianceReporting}>
      <div className={styles.complianceStatus}>
        <h2>Compliance Status</h2>
        <div className={styles.statusGrid}>
          {complianceStatus.map(item => (
            <div key={item.id} className={styles.statusCard}>
              <div className={styles.statusHeader}>
                <h3>{item.category}</h3>
                <span className={`${styles.statusIndicator} ${styles[item.status]}`}>
                  {item.status === 'compliant' ? (
                    <AiOutlineCheck />
                  ) : (
                    <AiOutlineWarning />
                  )}
                </span>
              </div>
              <p className={styles.statusDetails}>{item.details}</p>
              <span className={styles.lastChecked}>
                Last checked: {item.lastChecked}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.reportGeneration}>
        <h2>Generate Reports</h2>
        <div className={styles.reportControls}>
          <select
            value={selectedReport}
            onChange={(e) => setSelectedReport(e.target.value)}
            className={styles.reportSelect}
          >
            <option value="">Select Report Type</option>
            {availableReports.map(report => (
              <option key={report.id} value={report.id}>
                {report.name}
              </option>
            ))}
          </select>

          <div className={styles.dateRangeInputs}>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className={styles.dateInput}
            />
            <span>to</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className={styles.dateInput}
            />
          </div>

          <button
            className={styles.generateButton}
            onClick={handleGenerateReport}
            disabled={!selectedReport || !dateRange.start || !dateRange.end}
          >
            <AiOutlineDownload /> Generate Report
          </button>
        </div>
      </div>

      <div className={styles.recentReports}>
        <h2>Recent Reports</h2>
        <table className={styles.reportsTable}>
          <thead>
            <tr>
              <th>Report Name</th>
              <th>Generated Date</th>
              <th>Period</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div className={styles.reportName}>
                  <AiOutlineFile />
                  <span>February 2024 Payroll Summary</span>
                </div>
              </td>
              <td>2024-03-01</td>
              <td>Feb 2024</td>
              <td>
                <span className={`${styles.status} ${styles.completed}`}>
                  Completed
                </span>
              </td>
              <td>
                <button className={styles.downloadButton}>
                  <AiOutlineDownload /> Download
                </button>
              </td>
            </tr>
            {/* Add more recent reports */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComplianceReporting; 