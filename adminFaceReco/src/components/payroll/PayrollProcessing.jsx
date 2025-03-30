import React, { useState } from 'react';
import { AiOutlineCalculator, AiOutlineWarning, AiOutlineTrophy } from 'react-icons/ai';
import styles from './PayrollProcessing.module.css';

const PayrollProcessing = () => {
  const [selectedMonth, setSelectedMonth] = useState('');
  const [processingStatus, setProcessingStatus] = useState('pending');

  const employees = [
    {
      id: 1,
      name: 'Abhishek',
      position: 'Software Engineer',
      baseSalary: 5000,
      hourlyRate: 30,
      hoursWorked: 168,
      lateArrivals: 2,
      overtime: 5,
      deductions: 100,
      bonus: 200
    },
    {
      id: 1,
      name: 'Abhinay',
      position: 'Software Engineer',
      baseSalary: 5000,
      hourlyRate: 30,
      hoursWorked: 160,
      lateArrivals: 3,
      overtime: 6,
      deductions: 100,
      bonus: 150
    },
    // Add more sample employees
  ];

  const handleProcessPayroll = () => {
    // Implement payroll processing logic
    setProcessingStatus('processing');
    setTimeout(() => setProcessingStatus('completed'), 2000);
  };

  return (
    <div className={styles.payrollProcessing}>
      <div className={styles.controls}>
        <div className={styles.periodSelection}>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className={styles.monthSelect}
          >
            <option value="">Select Pay Period</option>
            <option value="2024-03">March 2024</option>
            <option value="2024-02">February 2024</option>
            <option value="2024-01">January 2024</option>
          </select>
          <button
            className={styles.processButton}
            onClick={handleProcessPayroll}
            disabled={!selectedMonth || processingStatus === 'processing'}
          >
            <AiOutlineCalculator />
            {processingStatus === 'processing' ? 'Processing...' : 'Process Payroll'}
          </button>
        </div>
      </div>

      <div className={styles.summaryCards}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <AiOutlineCalculator className={styles.cardIcon} />
            <h3>Base Salary</h3>
          </div>
          <div className={styles.cardContent}>
            <span className={styles.amount}>$75,000</span>
            <span className={styles.description}>Total base salary for all employees</span>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <AiOutlineWarning className={styles.cardIcon} />
            <h3>Deductions</h3>
          </div>
          <div className={styles.cardContent}>
            <span className={styles.amount}>$2,500</span>
            <span className={styles.description}>Total deductions for late arrivals</span>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <AiOutlineTrophy className={styles.cardIcon} />
            <h3>Bonuses</h3>
          </div>
          <div className={styles.cardContent}>
            <span className={styles.amount}>$5,000</span>
            <span className={styles.description}>Total bonuses for overtime</span>
          </div>
        </div>
      </div>

      <div className={styles.payrollTable}>
        <table>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Position</th>
              <th>Base Salary</th>
              <th>Hours Worked</th>
              <th>Late Arrivals</th>
              <th>Overtime</th>
              <th>Deductions</th>
              <th>Bonus</th>
              <th>Net Salary</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(employee => (
              <tr key={employee.id}>
                <td>{employee.name}</td>
                <td>{employee.position}</td>
                <td>${employee.baseSalary}</td>
                <td>{employee.hoursWorked}h</td>
                <td>{employee.lateArrivals}</td>
                <td>{employee.overtime}h</td>
                <td>-${employee.deductions}</td>
                <td>+${employee.bonus}</td>
                <td>
                  ${employee.baseSalary + employee.bonus - employee.deductions}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PayrollProcessing; 