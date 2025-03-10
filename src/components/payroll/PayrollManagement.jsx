import React, { useState } from 'react';
import { AiOutlineDollarCircle, AiOutlineCalendar, AiOutlineAudit } from 'react-icons/ai';
import styles from './PayrollManagement.module.css';
import PayrollProcessing from './PayrollProcessing';
import LeaveManagement from './LeaveManagement';
import ComplianceReporting from './ComplianceReporting';

const PayrollManagement = () => {
  const [activeTab, setActiveTab] = useState('payroll');

  const renderContent = () => {
    switch (activeTab) {
      case 'payroll':
        return <PayrollProcessing />;
      case 'leave':
        return <LeaveManagement />;
      case 'compliance':
        return <ComplianceReporting />;
      default:
        return <PayrollProcessing />;
    }
  };

  return (
    <div className={styles.payrollManagement}>
      <div className={styles.header}>
        <h1>Payroll & Compliance Management</h1>
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
          <button
            className={`${styles.actionButton} ${activeTab === 'compliance' ? styles.active : ''}`}
            onClick={() => setActiveTab('compliance')}
          >
            <AiOutlineAudit /> Compliance & Reports
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