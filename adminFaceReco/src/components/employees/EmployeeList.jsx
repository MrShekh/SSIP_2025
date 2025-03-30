import React, { useState, useCallback, memo } from 'react';
import { FaSearch, FaEye, FaTrash, FaUserPlus, FaFilter, FaEdit } from 'react-icons/fa';
import { useEmployees } from '../../context/EmployeeContext';
import EditEmployeePanel from './EditEmployeePanel';
import styles from './EmployeeList.module.css';

// Optimize with memo to prevent unnecessary re-renders
const EmployeeList = memo(() => {
  const { employees, deleteEmployee, getEmployeeById } = useEmployees();
  const [viewEmployee, setViewEmployee] = useState(null);
  const [editEmployee, setEditEmployee] = useState(null);
  const [showViewPanel, setShowViewPanel] = useState(false);
  const [showEditPanel, setShowEditPanel] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(true);

  // Optimize handlers with useCallback
  const handleViewEmployee = useCallback((employee) => {
    // Get the most up-to-date version of the employee from storage
    const updatedEmployee = getEmployeeById(employee.id);
    setViewEmployee(updatedEmployee);
    setShowViewPanel(true);
    setIsReadOnly(true);
  }, [getEmployeeById]);

  const handleEditEmployee = useCallback((employee) => {
    // Get the most up-to-date version of the employee from storage
    const updatedEmployee = getEmployeeById(employee.id);
    setEditEmployee(updatedEmployee);
    setShowEditPanel(true);
    setIsReadOnly(false);
  }, [getEmployeeById]);

  const handleEditComplete = useCallback((updatedEmployee) => {
    // Check if this came from a read-only view wanting to edit
    if (showViewPanel && isReadOnly) {
      // Switch from view to edit mode
      setViewEmployee(null);
      setShowViewPanel(false);
      setEditEmployee(updatedEmployee);
      setShowEditPanel(true);
      setIsReadOnly(false);
      return;
    }

    // This is a normal edit completion
    // After editing is complete, update view if needed
    if (viewEmployee && viewEmployee.id === updatedEmployee.id) {
      setViewEmployee(updatedEmployee);
    }
    setShowEditPanel(false);
    setEditEmployee(null);
    
    // If we were viewing this employee before editing, show the view panel again
    if (viewEmployee && viewEmployee.id === updatedEmployee.id) {
      setShowViewPanel(true);
    }
  }, [showViewPanel, isReadOnly, viewEmployee]);

  const handleDeleteEmployee = useCallback((id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      deleteEmployee(id);
      
      // Close panels if the deleted employee was being viewed or edited
      if (viewEmployee && viewEmployee.id === id) {
        setShowViewPanel(false);
        setViewEmployee(null);
      }
      if (editEmployee && editEmployee.id === id) {
        setShowEditPanel(false);
        setEditEmployee(null);
      }
    }
  }, [deleteEmployee, viewEmployee, editEmployee]);

  const handleCloseViewPanel = useCallback(() => {
    setShowViewPanel(false);
    setViewEmployee(null);
  }, []);

  const handleCloseEditPanel = useCallback(() => {
    setShowEditPanel(false);
    setEditEmployee(null);
  }, []);

  return (
    <div className={styles.employeeList}>
      <h2>Employee List</h2>
      
      {employees.length === 0 ? (
        <div className={styles.noEmployees}>
          <p>No employees found. Add an employee to get started.</p>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Department</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id}>
                  <td>{employee.employeeId}</td>
                  <td>{employee.fullName || `${employee.firstName} ${employee.lastName}`}</td>
                  <td>{employee.companyEmail}</td>
                  <td>{employee.role}</td>
                  <td>{employee.department}</td>
                  <td className={styles.actions}>
                    <button
                      className={`${styles.actionButton} ${styles.view}`}
                      onClick={() => handleViewEmployee(employee)}
                      title="View Employee"
                    >
                      <FaEye />
                    </button>
                    <button
                      className={`${styles.actionButton} ${styles.edit}`}
                      onClick={() => handleEditEmployee(employee)}
                      title="Edit Employee"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className={`${styles.actionButton} ${styles.delete}`}
                      onClick={() => handleDeleteEmployee(employee.id)}
                      title="Delete Employee"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showViewPanel && (
        <EditEmployeePanel 
          employee={viewEmployee} 
          onClose={handleCloseViewPanel}
          onSaveComplete={handleEditComplete}
          readOnly={true}
        />
      )}

      {showEditPanel && (
        <EditEmployeePanel 
          employee={editEmployee} 
          onClose={handleCloseEditPanel}
          onSaveComplete={handleEditComplete}
          readOnly={isReadOnly}
        />
      )}
    </div>
  );
});

EmployeeList.displayName = 'EmployeeList';

export default EmployeeList; 