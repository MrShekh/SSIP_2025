import React, { useState } from 'react';
import {
  HiDocument,
  HiEye,
  HiMail,
} from 'react-icons/hi';
import ReportFilters from './ReportFilters';
import ReportScheduler from './ReportScheduler';
import ReportExport from './ReportExport';
import ReportViewer from './ReportViewer';
import styles from './Reports.module.css';

const Reports = () => {
  const [filters, setFilters] = useState({
    timeRange: 'week',
    startDate: null,
    endDate: null,
    department: '',
    employee: '',
    status: []
  });

  const [scheduleSettings, setScheduleSettings] = useState({
    enabled: false,
    frequency: 'weekly',
    time: '09:00',
    email: ''
  });

  const [isViewerOpen, setIsViewerOpen] = useState(false);

  // Mock summary data - replace with actual data
  const summaryData = {
    totalEmployees: 150,
    presentToday: 135,
    lateToday: 10,
    absentToday: 5,
    attendanceRate: 96.67,
    onTimeRate: 93.10,
    averageLateTime: '18 mins',
    departmentData: {
      Engineering: { present: 45, late: 3, absent: 2 },
      Marketing: { present: 30, late: 2, absent: 1 },
      Sales: { present: 25, late: 2, absent: 1 },
      HR: { present: 15, late: 1, absent: 0 },
      Finance: { present: 20, late: 2, absent: 1 }
    },
    weeklyTrend: [
      { date: '2025-02-13', rate: 95 },
      { date: '2025-02-14', rate: 92 },
      { date: '2025-02-15', rate: 94 },
      { date: '2025-02-16', rate: 93 },
      { date: '2025-02-17', rate: 96 },
      { date: '2025-02-18', rate: 95 },
      { date: '2025-02-19', rate: 94 }
    ]
  };

  const handleExport = async (format) => {
    console.log(`Exporting in ${format} format`);
  };

  const handleViewReport = () => {
    setIsViewerOpen(true);
  };

  const handleEmail = () => {
    console.log('Sending report via email');
  };

  return (
    <div className={styles.reportsContainer}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>
            <HiDocument className={styles.titleIcon} />
            Attendance Reports
          </h1>
          <p className={styles.subtitle}>Configure and generate attendance reports</p>
        </div>
        
        <div className={styles.quickActions}>
          <button 
            className={`${styles.actionButton} ${styles.viewButton}`}
            onClick={handleViewReport}
          >
            <HiEye className={styles.actionIcon} />
            View Report
          </button>
          
          <button 
            className={`${styles.actionButton} ${styles.emailButton}`}
            onClick={handleEmail}
          >
            <HiMail className={styles.actionIcon} />
            Email Report
          </button>

          <ReportExport filters={filters} onExport={handleExport} />
        </div>
      </header>

      <div className={styles.content}>
        <div className={styles.filtersContainer}>
          <ReportFilters 
            filters={filters}
            onChange={setFilters}
          />
          
          <ReportScheduler
            settings={scheduleSettings}
            onSettingsChange={setScheduleSettings}
          />
        </div>
      </div>

      <ReportViewer
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        reportData={summaryData}
        filters={filters}
      />
    </div>
  );
};

export default Reports;
