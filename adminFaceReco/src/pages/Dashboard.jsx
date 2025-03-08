import React, { useState } from 'react';
import DashboardCard from '../components/dashboard/DashboardCard';
import SearchAndFilter from '../components/dashboard/SearchAndFilter';
import AttendanceHeatmap from '../components/dashboard/AttendanceHeatmap';
import QuickActions from '../components/dashboard/QuickActions';
import AttendanceTable from '../components/attendance/AttendanceTable';
import { 
  AiOutlineTeam,
  AiOutlineUser,
  AiOutlineClockCircle,
  AiOutlineClose
} from 'react-icons/ai';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});

  const dashboardStats = [
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
      title: 'Late Arrivals',
      value: '8',
      description: '5.3% of total employees',
      icon: AiOutlineClockCircle,
      type: 'late'
    },
    {
      title: 'Absent Today',
      value: '10',
      description: '6.7% of total employees',
      icon: AiOutlineClose,
      type: 'absent'
    }
  ];

  const handleSearch = (term) => {
    setSearchTerm(term);
    // Implement search logic
  };

  const handleFilter = (filterData) => {
    setFilters(filterData);
    // Implement filter logic
  };

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

      <SearchAndFilter 
        onSearch={handleSearch}
        onFilter={handleFilter}
      />

      <AttendanceHeatmap />

      <div className={styles.attendanceSection}>
        <h2 className={styles.sectionTitle}>Recent Attendance</h2>
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
