import React, { useMemo, forwardRef, useImperativeHandle } from 'react';
import { HiUsers, HiOfficeBuilding } from 'react-icons/hi';
import styles from './ReportTable.module.css';
import { 
  employeeData, 
  attendanceData, 
  payrollData, 
  leaveData 
} from './data/mockReportData';

const ReportTable = forwardRef(({ types = [], filters }, ref) => {
  // Get filtered data and stats
  const { groupedData, stats } = useMemo(() => {
    let combinedData = [];
    let totalCount = 0;
    
    // Combine data from all selected report types
    types.forEach(type => {
      let typeData = [];
      switch (type) {
        case 'employee':
          typeData = employeeData.map(item => ({ ...item, reportType: 'employee' }));
          break;
        case 'attendance':
          typeData = attendanceData.map(item => ({ ...item, reportType: 'attendance' }));
          break;
        case 'payroll':
          typeData = payrollData.map(item => ({ ...item, reportType: 'payroll' }));
          break;
        case 'leave':
          typeData = leaveData.map(item => ({ ...item, reportType: 'leave' }));
          break;
        default:
          break;
      }
      combinedData = [...combinedData, ...typeData];
    });

    totalCount = combinedData.length;
    let filtered = [...combinedData];

    // Apply department filter
    if (filters.department && filters.department !== 'all') {
      filtered = filtered.filter(item => 
        item.department.toLowerCase() === filters.department.toLowerCase()
      );
    }

    // Apply employee name filter
    if (filters.employee && filters.employee.trim() !== '') {
      filtered = filtered.filter(item => 
        item.employeeName?.toLowerCase().includes(filters.employee.toLowerCase().trim()) ||
        item.name?.toLowerCase().includes(filters.employee.toLowerCase().trim())
      );
    }

    // Apply status filter
    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter(item => {
        if (item.reportType === 'attendance' || item.reportType === 'leave') {
          return filters.status.includes(item.status.toLowerCase());
        }
        return true;
      });
    }

    // Group data by employee
    const grouped = filtered.reduce((acc, item) => {
      const employeeId = item.id || item.employeeId;
      const employeeName = item.name || item.employeeName;
      
      if (!acc[employeeId]) {
        acc[employeeId] = {
          id: employeeId,
          name: employeeName,
          department: item.department,
          reports: {}
        };
      }
      
      acc[employeeId].reports[item.reportType] = item;
      return acc;
    }, {});

    return {
      groupedData: Object.values(grouped),
      stats: {
        total: totalCount,
        filtered: filtered.length,
        department: filters.department || 'all'
      }
    };
  }, [types, filters]);

  // Expose data through ref
  useImperativeHandle(ref, () => ({
    getData: () => groupedData
  }));

  const renderTableHeaders = () => {
    return (
      <tr>
        <th>Employee Name</th>
        <th>Department</th>
        {types.includes('employee') && <th>Employment Details</th>}
        {types.includes('attendance') && <th>Attendance</th>}
        {types.includes('payroll') && <th>Payroll</th>}
        {types.includes('leave') && <th>Leave</th>}
      </tr>
    );
  };

  const renderEmployeeDetails = (data) => {
    if (!data) return '-';
    return (
      <div className={styles.detailsCell}>
        <div>Status: {data.employmentStatus}</div>
        <div>Role: {data.designation}</div>
        <div>Location: {data.workLocation}</div>
      </div>
    );
  };

  const renderAttendanceDetails = (data) => {
    if (!data) return '-';
    return (
      <div className={styles.detailsCell}>
        <div>Date: {new Date(data.date).toLocaleDateString()}</div>
        <div>Time: {data.checkIn} - {data.checkOut}</div>
        <div>
          Status: <span className={`${styles.status} ${styles[data.status.toLowerCase()]}`}>
            {data.status}
          </span>
        </div>
      </div>
    );
  };

  const renderPayrollDetails = (data) => {
    if (!data) return '-';
    return (
      <div className={styles.detailsCell}>
        <div>Net Salary: ₹{data.netSalary.toLocaleString()}</div>
        <div>Base: ₹{data.basePay.toLocaleString()}</div>
        <div>OT: ₹{data.overtime.toLocaleString()}</div>
      </div>
    );
  };

  const renderLeaveDetails = (data) => {
    if (!data) return '-';
    return (
      <div className={styles.detailsCell}>
        <div>{data.leaveType}</div>
        <div>{new Date(data.startDate).toLocaleDateString()} - {new Date(data.endDate).toLocaleDateString()}</div>
        <div>
          Status: <span className={`${styles.status} ${styles[data.status.toLowerCase()]}`}>
            {data.status}
          </span>
        </div>
      </div>
    );
  };

  const renderTableRow = (employee) => {
    return (
      <tr key={employee.id}>
        <td>{employee.name}</td>
        <td>
          <span className={styles.departmentTag}>{employee.department}</span>
        </td>
        {types.includes('employee') && (
          <td>{renderEmployeeDetails(employee.reports.employee)}</td>
        )}
        {types.includes('attendance') && (
          <td>{renderAttendanceDetails(employee.reports.attendance)}</td>
        )}
        {types.includes('payroll') && (
          <td>{renderPayrollDetails(employee.reports.payroll)}</td>
        )}
        {types.includes('leave') && (
          <td>{renderLeaveDetails(employee.reports.leave)}</td>
        )}
      </tr>
    );
  };

  if (groupedData.length === 0) {
    return (
      <div className={styles.noData}>
        <p>No data available for the selected filters</p>
        {filters.department && filters.department !== 'all' && (
          <p className={styles.filterInfo}>
            No records found in {filters.department} department
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={styles.tableWrapper}>
      <div className={styles.tableStats}>
        <div className={styles.statItem}>
          <HiUsers className={styles.statIcon} />
          <div className={styles.statText}>
            <span className={styles.statLabel}>Showing</span>
            <span className={styles.statValue}>
              {groupedData.length} Employees
            </span>
          </div>
        </div>
        {stats.department !== 'all' && (
          <div className={styles.statItem}>
            <HiOfficeBuilding className={styles.statIcon} />
            <div className={styles.statText}>
              <span className={styles.statLabel}>Filtered by Department</span>
              <span className={styles.statValue}>{stats.department}</span>
            </div>
          </div>
        )}
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.reportTable}>
          <thead>{renderTableHeaders()}</thead>
          <tbody>
            {groupedData.map(employee => renderTableRow(employee))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

export default ReportTable; 