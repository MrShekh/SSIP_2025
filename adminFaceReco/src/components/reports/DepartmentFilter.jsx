import React from 'react';
import { HiOfficeBuilding } from 'react-icons/hi';
import styles from './DepartmentFilter.module.css';
import { 
  employeeData, 
  attendanceData, 
  payrollData, 
  leaveData 
} from './data/mockReportData';

const DepartmentFilter = ({ selectedDepartment, onDepartmentChange }) => {
  // Get unique departments from all data sources
  const departments = React.useMemo(() => {
    const deptSet = new Set(['all']);
    
    // Add departments from all data sources
    employeeData.forEach(item => deptSet.add(item.department));
    attendanceData.forEach(item => deptSet.add(item.department));
    payrollData.forEach(item => deptSet.add(item.department));
    leaveData.forEach(item => deptSet.add(item.department));
    
    // Convert to array and sort alphabetically, keeping 'all' at the start
    return Array.from(deptSet).sort((a, b) => {
      if (a === 'all') return -1;
      if (b === 'all') return 1;
      return a.localeCompare(b);
    });
  }, []);

  return (
    <div className={styles.filterContainer}>
      <div className={styles.filterHeader}>
        <HiOfficeBuilding className={styles.filterIcon} />
        <span className={styles.filterTitle}>Department</span>
      </div>
      <div className={styles.departmentGrid}>
        {departments.map(dept => (
          <button
            key={dept}
            className={`${styles.departmentButton} ${
              selectedDepartment === dept ? styles.selected : ''
            }`}
            onClick={() => onDepartmentChange(dept)}
          >
            {dept === 'all' ? 'All Departments' : dept}
            <span className={styles.departmentCount}>
              ({employeeData.filter(e => dept === 'all' ? true : e.department === dept).length})
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DepartmentFilter; 