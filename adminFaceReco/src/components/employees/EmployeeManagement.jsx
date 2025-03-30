import React, { useState } from 'react';
import { AiOutlineUserAdd, AiOutlineUpload, AiOutlineTeam } from 'react-icons/ai';
import styles from './EmployeeManagement.module.css';
import EmployeeList from './EmployeeList';
import AddEmployeeForm from './AddEmployeeForm';
import BulkImport from './BulkImport';
import RoleManagement from './RoleManagement';

const EmployeeManagement = () => {
  const [activeTab, setActiveTab] = useState('list');
  // const [selectedEmployee, setSelectedEmployee] = useState(null);

  const renderContent = () => {
    switch (activeTab) {
      case 'list':
        return <EmployeeList />;
      case 'add':
        return <AddEmployeeForm />;
      case 'import':
        return <BulkImport />;
      case 'roles':
        return <RoleManagement />;
      default:
        return <EmployeeList />;
    }
  };

  return (
    <div className={styles.employeeManagement}>
      <div className={styles.header}>
        <h1>Employee Management</h1>
        <div className={styles.actions}>
          <button
            className={`${styles.actionButton} ${activeTab === 'list' ? styles.active : ''}`}
            onClick={() => setActiveTab('list')}
          >
            <AiOutlineTeam /> View Employees
          </button>
          <button
            className={`${styles.actionButton} ${activeTab === 'add' ? styles.active : ''}`}
            onClick={() => setActiveTab('add')}
          >
            <AiOutlineUserAdd /> Add Employee
          </button>
          <button
            className={`${styles.actionButton} ${activeTab === 'import' ? styles.active : ''}`}
            onClick={() => setActiveTab('import')}
          >
            <AiOutlineUpload /> Bulk Import
          </button>
        </div>
      </div>
      <div className={styles.content}>
        {renderContent()}
      </div>
    </div>
  );
};

export default EmployeeManagement; 