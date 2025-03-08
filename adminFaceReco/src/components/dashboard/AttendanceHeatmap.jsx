import React from 'react';
import styles from './AttendanceHeatmap.module.css';

const AttendanceHeatmap = ({ data }) => {
  // Mock data for demonstration
  const mockData = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(2025, 1, i + 1),
    attendance: Math.random(),
  }));

  const getColorClass = (value) => {
    if (value >= 0.8) return styles.high;
    if (value >= 0.5) return styles.moderate;
    return styles.low;
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className={styles.heatmapContainer}>
      <h3 className={styles.heatmapTitle}>Attendance Heatmap</h3>
      <div className={styles.heatmapGrid}>
        {(data || mockData).map((day, index) => (
          <div
            key={index}
            className={`${styles.heatmapCell} ${getColorClass(day.attendance)}`}
            title={`${formatDate(day.date)}: ${Math.round(day.attendance * 100)}% attendance`}
          >
            <span className={styles.tooltip}>
              {formatDate(day.date)}: {Math.round(day.attendance * 100)}% attendance
            </span>
          </div>
        ))}
      </div>
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.high}`}></div>
          <span>High Attendance (≥80%)</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.moderate}`}></div>
          <span>Moderate (50-79%)</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.low}`}></div>
          <span>Low Attendance (≤49%)</span>
        </div>
      </div>
    </div>
  );
};

export default AttendanceHeatmap;
