import React, { useState, useMemo, useCallback } from 'react';
import DashboardCard from './DashboardCard';
import QuickActions from './QuickActions';
import AttendanceTable from '../attendance/AttendanceTable';
import { 
  AiOutlineTeam,
  AiOutlineUser,
  AiOutlineClose,
  AiOutlineLaptop
} from 'react-icons/ai';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});

  // Memoize dashboard stats to prevent recreation on each render
  const dashboardStats = useMemo(() => [
    {
      title: 'Total Employees',
      value: '150',
      description: 'Active employees in the system',
      icon: AiOutlineTeam,
      type: 'total'
    },
    {
      title: 'Present Today',
      value: '132',
      description: '88% attendance rate',
      icon: AiOutlineUser,
      type: 'present'
    },
    {
      title: 'Absent Today',
      value: '10',
      description: '6.7% of total employees',
      icon: AiOutlineClose,
      type: 'absent'
    },
    {
      title: 'Late Today',
      value: '8',
      description: '5.3% of total employees',
      icon: AiOutlineLaptop,
      type: 'late'
    }
  ], []);

  // Optimize handlers with useCallback
  // const handleSearch = useCallback((term) => {
  //   setSearchTerm(term);
  //   // Implement search logic
  // }, []);

  return (
    <div className={styles.dashboard}>
      <div className={styles.dashboardHeader}>
        <h1 className={styles.dashboardTitle}>Dashboard Overview</h1>
      </div>

      <div className={styles.statsGrid}>
        {dashboardStats.map((stat, index) => (
          <DashboardCard
            key={index}
            title={stat.title}
            value={stat.value}
            description={stat.description}
            icon={stat.icon}
            type={stat.type}
          />
        ))}
      </div>

      <div className={styles.attendanceSection}>
        <h2 className={styles.sectionTitle}>Live Attendance (Today)</h2>
        <AttendanceTable 
          searchTerm={searchTerm}
          filters={filters}
        />
      </div>

      <QuickActions />
    </div>
  );
};

export default Dashboard;
