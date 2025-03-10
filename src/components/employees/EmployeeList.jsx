import React, { useState } from 'react';
import { AiOutlineEdit, AiOutlineDelete, AiOutlineLock } from 'react-icons/ai';
import styles from './EmployeeList.module.css';

const EmployeeList = ({ onSelectEmployee }) => {
  const [employees] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'Employee',
      department: 'Engineering',
      status: 'Active'
    }
    // Add more sample employees as needed
  ]);

  const handleEdit = (employee) => {
    onSelectEmployee(employee);
  };

  const handleDelete = (employeeId) => {
    // Implement delete functionality
    console.log('Delete employee:', employeeId);
  };

  const handleResetPassword = (employeeId) => {
    // Implement password reset functionality
    console.log('Reset password for:', employeeId);
  };

  return (
    <div className={styles.employeeList}>
      <div className={styles.tableHeader}>
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Search employees..."
            className={styles.searchInput}
          />
        </div>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Department</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.name}</td>
              <td>{employee.email}</td>
              <td>{employee.role}</td>
              <td>{employee.department}</td>
              <td>
                <span className={`${styles.status} ${styles[employee.status.toLowerCase()]}`}>
                  {employee.status}
                </span>
              </td>
              <td>
                <div className={styles.actions}>
                  <button
                    className={styles.actionButton}
                    onClick={() => handleEdit(employee)}
                  >
                    <AiOutlineEdit />
                  </button>
                  <button
                    className={styles.actionButton}
                    onClick={() => handleResetPassword(employee.id)}
                  >
                    <AiOutlineLock />
                  </button>
                  <button
                    className={`${styles.actionButton} ${styles.deleteButton}`}
                    onClick={() => handleDelete(employee.id)}
                  >
                    <AiOutlineDelete />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeList; 