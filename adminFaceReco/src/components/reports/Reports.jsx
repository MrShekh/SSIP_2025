import React, { useState } from 'react';
import {
  HiDocument,
  HiEye,
  HiClipboardCheck,
  HiUserGroup,
  HiCash,
  HiCalendar
} from 'react-icons/hi';
import ReportFilters from './ReportFilters';
import ReportScheduler from './ReportScheduler';
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

  const [selectedReportTypes, setSelectedReportTypes] = useState([]);

  const reportTypes = [
    { id: 'employee', label: 'Employee Report', icon: HiUserGroup },
    { id: 'attendance', label: 'Attendance Report', icon: HiClipboardCheck },
    { id: 'payroll', label: 'Payroll and Salary Report', icon: HiCash },
    { id: 'leave', label: 'Leave and Absent Report', icon: HiCalendar }
  ];

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

  const handleViewReport = () => {
    if (selectedReportTypes.length === 0) {
      alert('Please select at least one report type');
      return;
    }
    setIsViewerOpen(true);
  };

  const handleReportTypeToggle = (reportId) => {
    setSelectedReportTypes(prev => {
      if (prev.includes(reportId)) {
        return prev.filter(id => id !== reportId);
      }
      return [...prev, reportId];
    });
  };

  return (
    <div className={styles.reportsContainer}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>
            <HiDocument className={styles.titleIcon} />
            Reports
          </h1>
          <p className={styles.subtitle}>Configure and generate reports</p>
        </div>
        
        <div className={styles.quickActions}>
          <button 
            className={`${styles.actionButton} ${styles.viewButton}`}
            onClick={handleViewReport}
          >
            <HiEye className={styles.actionIcon} />
            View Report
          </button>
        </div>
      </header>

      <div className={styles.content}>
        <div className={styles.filtersContainer}>
          <ReportFilters 
            filters={filters}
            onChange={setFilters}
          />

          <div className={styles.reportTypesSection}>
            <h3 className={styles.sectionTitle}>
              <HiDocument className={styles.sectionIcon} />
              Type of Report
            </h3>
            <div className={styles.reportTypeOptions}>
              {reportTypes.map(type => (
                <label key={type.id} className={styles.reportTypeOption}>
                  <input
                    type="checkbox"
                    checked={selectedReportTypes.includes(type.id)}
                    onChange={() => handleReportTypeToggle(type.id)}
                    className={styles.reportTypeCheckbox}
                  />
                  <type.icon className={styles.reportTypeIcon} />
                  <span className={styles.reportTypeLabel}>{type.label}</span>
                </label>
              ))}
            </div>
          </div>
          
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
        selectedReportTypes={selectedReportTypes}
      />
    </div>
  );
};

export default Reports;
