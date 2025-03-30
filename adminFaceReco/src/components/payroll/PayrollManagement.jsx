import React, { useState } from 'react';
import { AiOutlineDollarCircle, AiOutlineCalendar } from 'react-icons/ai';
import styles from './PayrollManagement.module.css';
import PayrollProcessing from './PayrollProcessing';
import LeaveManagement from './LeaveManagement';

const PayrollManagement = () => {
  const [activeTab, setActiveTab] = useState('payroll');

  const renderContent = () => {
    switch (activeTab) {
      case 'payroll':
        return <PayrollProcessing />;
      case 'leave':
        return <LeaveManagement />;
      default:
        return <PayrollProcessing />;
    }
  };

  return (
    <div className={styles.payrollManagement}>
      <div className={styles.header}>
        <h1>Payroll Management</h1>
        <div className={styles.actions}>
          <button
            className={`${styles.actionButton} ${activeTab === 'payroll' ? styles.active : ''}`}
            onClick={() => setActiveTab('payroll')}
          >
            <AiOutlineDollarCircle /> Payroll Processing
          </button>
          <button
            className={`${styles.actionButton} ${activeTab === 'leave' ? styles.active : ''}`}
            onClick={() => setActiveTab('leave')}
          >
            <AiOutlineCalendar /> Leave Management
          </button>
        </div>
      </div>
      <div className={styles.content}>
        {renderContent()}
      </div>
    </div>
  );
};

export default PayrollManagement; 