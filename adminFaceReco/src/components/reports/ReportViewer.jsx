import React from 'react';
import {
  HiX,
  HiDownload,
  HiUserGroup,
  HiChartBar,
  HiClock,
  HiCalendar,
  HiOfficeBuilding,
  HiUser,
  HiFilter,
} from 'react-icons/hi';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import styles from './ReportViewer.module.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const ReportViewer = ({ isOpen, onClose, reportData, filters }) => {
  if (!isOpen) return null;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const weeklyTrendConfig = {
    labels: reportData.weeklyTrend.map(day => formatDate(day.date)),
    datasets: [{
      label: 'Attendance Rate',
      data: reportData.weeklyTrend.map(day => day.rate),
      borderColor: '#1E3A8A',
      backgroundColor: 'rgba(30, 58, 138, 0.1)',
      tension: 0.4,
      fill: true,
    }]
  };

  const departmentDataConfig = {
    labels: Object.keys(reportData.departmentData),
    datasets: [
      {
        label: 'Present',
        data: Object.values(reportData.departmentData).map(d => d.present),
        backgroundColor: '#10B981',
      },
      {
        label: 'Late',
        data: Object.values(reportData.departmentData).map(d => d.late),
        backgroundColor: '#F59E0B',
      },
      {
        label: 'Absent',
        data: Object.values(reportData.departmentData).map(d => d.absent),
        backgroundColor: '#EF4444',
      }
    ]
  };

  const attendanceDistributionConfig = {
    labels: ['Present', 'Late', 'Absent'],
    datasets: [{
      data: [
        reportData.presentToday,
        reportData.lateToday,
        reportData.absentToday
      ],
      backgroundColor: [
        '#10B981',
        '#F59E0B',
        '#EF4444'
      ],
      borderWidth: 0,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  const barChartOptions = {
    ...chartOptions,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <h2 className={styles.title}>Attendance Report</h2>
            <p className={styles.subtitle}>Generated on {new Date().toLocaleDateString()}</p>
          </div>
          <div className={styles.actions}>
            <button className={styles.downloadButton}>
              <HiDownload className={styles.actionIcon} />
              Download PDF
            </button>
            <button className={styles.closeButton} onClick={onClose}>
              <HiX className={styles.closeIcon} />
            </button>
          </div>
        </header>

        <div className={styles.content}>
          <div className={styles.filters}>
            <div className={styles.filterItem}>
              <HiCalendar className={styles.filterIcon} />
              <div className={styles.filterText}>
                <span className={styles.filterLabel}>Time Range</span>
                <span className={styles.filterValue}>{filters.timeRange}</span>
              </div>
            </div>
            {filters.department && (
              <div className={styles.filterItem}>
                <HiOfficeBuilding className={styles.filterIcon} />
                <div className={styles.filterText}>
                  <span className={styles.filterLabel}>Department</span>
                  <span className={styles.filterValue}>{filters.department}</span>
                </div>
              </div>
            )}
            {filters.employee && (
              <div className={styles.filterItem}>
                <HiUser className={styles.filterIcon} />
                <div className={styles.filterText}>
                  <span className={styles.filterLabel}>Employee</span>
                  <span className={styles.filterValue}>{filters.employee}</span>
                </div>
              </div>
            )}
            {filters.status.length > 0 && (
              <div className={styles.filterItem}>
                <HiFilter className={styles.filterIcon} />
                <div className={styles.filterText}>
                  <span className={styles.filterLabel}>Status</span>
                  <span className={styles.filterValue}>{filters.status.join(', ')}</span>
                </div>
              </div>
            )}
          </div>

          <div className={styles.summary}>
            <div className={styles.summaryCard}>
              <div className={styles.summaryHeader}>
                <h3>Employee Overview</h3>
                <HiUserGroup className={styles.summaryIcon} />
              </div>
              <div className={styles.summaryStats}>
                <div className={styles.stat}>
                  <span className={styles.statLabel}>Total Employees</span>
                  <span className={styles.statValue}>{reportData.totalEmployees}</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statLabel}>Present Today</span>
                  <span className={`${styles.statValue} ${styles.present}`}>
                    {reportData.presentToday}
                  </span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statLabel}>Absent Today</span>
                  <span className={`${styles.statValue} ${styles.absent}`}>
                    {reportData.absentToday}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.summaryCard}>
              <div className={styles.summaryHeader}>
                <h3>Attendance Metrics</h3>
                <HiChartBar className={styles.summaryIcon} />
              </div>
              <div className={styles.summaryStats}>
                <div className={styles.stat}>
                  <span className={styles.statLabel}>Attendance Rate</span>
                  <span className={styles.statValue}>{reportData.attendanceRate}%</span>
                  <div className={styles.progressBar}>
                    <div 
                      className={styles.progressFill}
                      style={{ width: `${reportData.attendanceRate}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.summaryCard}>
              <div className={styles.summaryHeader}>
                <h3>Punctuality</h3>
                <HiClock className={styles.summaryIcon} />
              </div>
              <div className={styles.summaryStats}>
                <div className={styles.stat}>
                  <span className={styles.statLabel}>On-Time Rate</span>
                  <span className={styles.statValue}>{reportData.onTimeRate}%</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statLabel}>Late Today</span>
                  <span className={`${styles.statValue} ${styles.late}`}>
                    {reportData.lateToday}
                  </span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statLabel}>Average Late Time</span>
                  <span className={styles.statValue}>{reportData.averageLateTime}</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.charts}>
            <div className={styles.chartCard}>
              <h3>Weekly Attendance Trend</h3>
              <div className={styles.chartContainer}>
                <Line data={weeklyTrendConfig} options={chartOptions} />
              </div>
            </div>

            <div className={styles.chartCard}>
              <h3>Department-wise Attendance</h3>
              <div className={styles.chartContainer}>
                <Bar data={departmentDataConfig} options={barChartOptions} />
              </div>
            </div>

            <div className={styles.chartCard}>
              <h3>Today's Attendance Distribution</h3>
              <div className={styles.chartContainer}>
                <Doughnut data={attendanceDistributionConfig} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportViewer;
