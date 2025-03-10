import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import styles from './ReportVisuals.module.css';

const ReportVisuals = ({ filters }) => {
  const attendanceChartRef = useRef(null);
  const trendChartRef = useRef(null);
  const distributionChartRef = useRef(null);

  useEffect(() => {
    // Sample data - replace with actual data from your backend
    const attendanceData = {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      datasets: [
        {
          label: 'Present',
          data: [42, 45, 40, 44, 43],
          backgroundColor: '#10B981',
        },
        {
          label: 'Absent',
          data: [3, 2, 5, 1, 2],
          backgroundColor: '#EF4444',
        },
        {
          label: 'Late',
          data: [5, 3, 5, 5, 5],
          backgroundColor: '#F59E0B',
        },
      ],
    };

    const trendData = {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      datasets: [
        {
          label: 'Attendance Rate',
          data: [95, 92, 94, 93],
          borderColor: '#1E3A8A',
          tension: 0.4,
          fill: false,
        },
      ],
    };

    const distributionData = {
      labels: ['On Time', 'Late', 'Absent'],
      datasets: [
        {
          data: [75, 15, 10],
          backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
        },
      ],
    };

    // Destroy existing charts
    if (attendanceChartRef.current?.chart) {
      attendanceChartRef.current.chart.destroy();
    }
    if (trendChartRef.current?.chart) {
      trendChartRef.current.chart.destroy();
    }
    if (distributionChartRef.current?.chart) {
      distributionChartRef.current.chart.destroy();
    }

    // Create new charts
    const attendanceChart = new Chart(attendanceChartRef.current, {
      type: 'bar',
      data: attendanceData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Daily Attendance Breakdown',
            font: { size: 16, weight: 'bold' },
          },
          legend: {
            position: 'bottom',
          },
        },
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true,
            beginAtZero: true,
          },
        },
      },
    });

    const trendChart = new Chart(trendChartRef.current, {
      type: 'line',
      data: trendData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Attendance Trend',
            font: { size: 16, weight: 'bold' },
          },
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: false,
            min: 80,
            max: 100,
          },
        },
      },
    });

    const distributionChart = new Chart(distributionChartRef.current, {
      type: 'doughnut',
      data: distributionData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Attendance Distribution',
            font: { size: 16, weight: 'bold' },
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    });

    // Store chart instances for cleanup
    attendanceChartRef.current.chart = attendanceChart;
    trendChartRef.current.chart = trendChart;
    distributionChartRef.current.chart = distributionChart;

    // Cleanup function
    return () => {
      attendanceChart.destroy();
      trendChart.destroy();
      distributionChart.destroy();
    };
  }, [filters]); // Re-render charts when filters change

  return (
    <div className={styles.visualsContainer}>
      <div className={styles.chartRow}>
        <div className={styles.chartCard}>
          <canvas ref={attendanceChartRef} />
        </div>
        <div className={styles.chartCard}>
          <canvas ref={trendChartRef} />
        </div>
      </div>
      <div className={styles.chartRow}>
        <div className={styles.chartCard}>
          <canvas ref={distributionChartRef} />
        </div>
      </div>
    </div>
  );
};

export default ReportVisuals;
