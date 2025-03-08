import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import styles from './AttendanceGraphs.module.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AttendanceGraphs = ({ view }) => {
  // Mock data - replace with actual data
  const dailyData = {
    labels: ['9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM'],
    datasets: [
      {
        label: 'Present',
        data: [40, 42, 45, 45, 43, 45, 44, 45, 45],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
      },
      {
        label: 'Absent',
        data: [5, 3, 0, 0, 2, 0, 1, 0, 0],
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
      },
      {
        label: 'Late',
        data: [3, 2, 0, 0, 0, 0, 0, 0, 0],
        borderColor: '#F59E0B',
        backgroundColor: 'rgba(245, 158, 11, 0.5)',
      },
    ],
  };

  const weeklyData = {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    datasets: [
      {
        label: 'Attendance Rate (%)',
        data: [85, 88, 90, 80, 95, 78, 82],
        borderColor: '#1E3A8A',
        backgroundColor: 'rgba(30, 58, 138, 0.5)',
        tension: 0.4,
      },
    ],
  };

  const monthlyData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Present',
        data: [90, 92, 88, 95],
        backgroundColor: '#10B981',
      },
      {
        label: 'Absent',
        data: [5, 4, 7, 3],
        backgroundColor: '#EF4444',
      },
      {
        label: 'Late',
        data: [5, 4, 5, 2],
        backgroundColor: '#F59E0B',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: view === 'daily' 
          ? 'Today\'s Attendance Trend'
          : view === 'weekly'
            ? 'Weekly Attendance Overview'
            : 'Monthly Attendance Distribution',
        font: {
          size: 16,
          weight: 'bold',
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: view === 'daily' ? 50 : 100,
        ticks: {
          callback: (value) => view === 'daily' ? value : value + '%',
        },
      },
    },
  };

  const renderGraph = () => {
    switch (view) {
      case 'daily':
        return <Line data={dailyData} options={options} height={300} />;
      case 'weekly':
        return <Line data={weeklyData} options={options} height={300} />;
      case 'monthly':
        return <Bar data={monthlyData} options={options} height={300} />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.graphContainer}>
      {renderGraph()}
    </div>
  );
};

export default AttendanceGraphs;
