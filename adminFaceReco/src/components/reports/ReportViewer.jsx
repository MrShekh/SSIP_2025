import React, { useRef, useState } from 'react';
import {
  HiX,
  HiMail,
  HiDocumentDownload,
  HiInformationCircle
} from 'react-icons/hi';
import ReportTable from './ReportTable';
import EmailReportModal from './EmailReportModal';
import styles from './ReportViewer.module.css';
import { exportToExcel } from '../../utils/excelExport';
import * as XLSX from 'xlsx';
import { sendReportEmail } from '../../utils/emailService';

const ReportViewer = ({ 
  isOpen, 
  onClose, 
  filters,
  selectedReportTypes,
  onFilterChange
}) => {
  const tableRef = useRef(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailSendResult, setEmailSendResult] = useState(null);
  const [showDirectAttachInfo, setShowDirectAttachInfo] = useState(false);

  if (!isOpen) return null;

  // Only render if there are selected report types
  if (selectedReportTypes.length === 0) {
    return null;
  }

  const handleExport = (format) => {
    if (format === 'xlsx' && tableRef.current?.getData) {
      const data = tableRef.current.getData();
      exportToExcel(data, selectedReportTypes, filters);
    } else {
      console.log(`Exporting as ${format}`);
    }
  };

  // Function to generate Excel file for sending
  const generateExcelFile = (data) => {
    // Create worksheet
    const headers = ['Employee Name', 'Department'];
    
    if (selectedReportTypes.includes('employee')) {
      headers.push('Employment Status', 'Role', 'Work Location');
    }
    if (selectedReportTypes.includes('attendance')) {
      headers.push('Attendance Date', 'Check In', 'Check Out', 'Work Hours', 'Status');
    }
    if (selectedReportTypes.includes('payroll')) {
      headers.push('Net Salary', 'Base Pay', 'Overtime', 'Allowances', 'Deductions');
    }
    if (selectedReportTypes.includes('leave')) {
      headers.push('Leave Type', 'Start Date', 'End Date', 'Status', 'Approving Manager');
    }

    // Transform data for Excel
    const excelData = data.map(employee => {
      const row = [
        employee.name,
        employee.department
      ];

      // Add specific report data based on selectedReportTypes
      if (selectedReportTypes.includes('employee')) {
        const empData = employee.reports?.employee || {};
        row.push(
          empData.employmentStatus || '-',
          empData.designation || '-',
          empData.workLocation || '-'
        );
      }
      
      if (selectedReportTypes.includes('attendance')) {
        const attData = employee.reports?.attendance || {};
        row.push(
          attData.date || '-',
          attData.checkIn || '-',
          attData.checkOut || '-',
          attData.workHours || '-',
          attData.status || '-'
        );
      }
      
      if (selectedReportTypes.includes('payroll')) {
        const payData = employee.reports?.payroll || {};
        row.push(
          payData.netSalary || '-',
          payData.basePay || '-',
          payData.overtime || '-',
          payData.allowances || '-',
          payData.deductions || '-'
        );
      }
      
      if (selectedReportTypes.includes('leave')) {
        const leaveData = employee.reports?.leave || {};
        row.push(
          leaveData.leaveType || '-',
          leaveData.startDate || '-',
          leaveData.endDate || '-',
          leaveData.status || '-',
          leaveData.approvingManager || '-'
        );
      }

      return row;
    });

    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet([headers, ...excelData]);
    
    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Report');
    
    // Generate filename with filters info
    let filename = 'Report';
    if (filters.department && filters.department !== 'all') {
      filename += `_${filters.department}`;
    }
    if (filters.timeRange) {
      filename += `_${filters.timeRange}`;
    }
    filename += '_' + new Date().toISOString().split('T')[0];
    filename += '.xlsx';
    
    return {
      workbook: wb,
      filename: filename
    };
  };

  const handleEmailSend = async (senderEmail, receiverEmail) => {
    if (!tableRef.current?.getData) {
      throw new Error('No data available');
    }

    try {
      // Generate the Excel file
      const data = tableRef.current.getData();
      const { workbook, filename } = generateExcelFile(data);

      // Show instructions modal
      setShowDirectAttachInfo(true);
      
      // Trigger email sending process with both sender and receiver
      await sendReportEmail(senderEmail, receiverEmail, workbook, filename, selectedReportTypes, filters);
      
      // Set success message
      setEmailSendResult({ 
        success: true, 
        message: `Report has been downloaded and email has been opened in a new tab.` 
      });
      
      // Close the email modal after a delay
      setTimeout(() => {
        setIsEmailModalOpen(false);
        // Automatically close the direct attach info modal after a short delay
        setTimeout(() => {
          setShowDirectAttachInfo(false);
        }, 5000); // Close after 5 seconds
      }, 2000);
      
      return true;
    } catch (error) {
      console.error('Error sending report:', error);
      setEmailSendResult({ 
        success: false, 
        message: error.message || 'Failed to generate report' 
      });
      throw error;
    }
  };

  const closeDirectAttachInfo = () => {
    setShowDirectAttachInfo(false);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <h2 className={styles.title}>Generated Report</h2>
            <p className={styles.subtitle}>Generated on {new Date().toLocaleDateString()}</p>
          </div>
          <div className={styles.actions}>
            <button 
              className={styles.actionButton}
              onClick={() => setIsEmailModalOpen(true)}
            >
              <HiMail className={styles.actionIcon} />
              Email Report
            </button>
            <button 
              className={styles.actionButton}
              onClick={() => handleExport('xlsx')}
            >
              <HiDocumentDownload className={styles.actionIcon} />
              Export to Excel
            </button>
            <button className={styles.closeButton} onClick={onClose}>
              <HiX className={styles.closeIcon} />
            </button>
          </div>
        </header>

        <div className={styles.content}>
          {emailSendResult && (
            <div className={`${styles.alertBox} ${emailSendResult.success ? styles.success : styles.error}`}>
              {emailSendResult.message}
            </div>
          )}
          <div className={styles.reportSection}>
            <h3 className={styles.reportTitle}>
              Combined Report
            </h3>
            <ReportTable 
              ref={tableRef}
              types={selectedReportTypes} 
              filters={filters} 
            />
          </div>
        </div>

        <EmailReportModal
          isOpen={isEmailModalOpen}
          onClose={() => setIsEmailModalOpen(false)}
          onSend={handleEmailSend}
          downloadMode={true}
        />

        {showDirectAttachInfo && (
          <div className={styles.directAttachOverlay} onClick={closeDirectAttachInfo}>
            <div className={styles.directAttachModal} onClick={e => e.stopPropagation()}>
              <div className={styles.directAttachHeader}>
                <h4 className={styles.directAttachTitle}>
                  <HiInformationCircle className={styles.directAttachIcon} />
                  Email Your Report
                </h4>
                <button className={styles.directAttachCloseButton} onClick={closeDirectAttachInfo}>
                  <HiX />
                </button>
              </div>
              <div className={styles.directAttachContent}>
                <p className={styles.directAttachMessage}>
                  Your report has been downloaded to your device. Your web email service will open in a new tab.
                </p>
                <div className={styles.directAttachSteps}>
                  <div className={styles.directAttachStep}>
                    <span className={styles.directAttachStepNumber}>1</span>
                    <span className={styles.directAttachStepText}>A new tab will open with your web email service based on the email address you entered</span>
                  </div>
                  <div className={styles.directAttachStep}>
                    <span className={styles.directAttachStepNumber}>2</span>
                    <span className={styles.directAttachStepText}>If you're not already logged in, you'll need to sign in to that account</span>
                  </div>
                  <div className={styles.directAttachStep}>
                    <span className={styles.directAttachStepNumber}>3</span>
                    <span className={styles.directAttachStepText}>The compose window will open with the recipient's email address pre-filled</span>
                  </div>
                  <div className={styles.directAttachStep}>
                    <span className={styles.directAttachStepNumber}>4</span>
                    <span className={styles.directAttachStepText}>Click the attachment button (paperclip icon) in your email</span>
                  </div>
                  <div className={styles.directAttachStep}>
                    <span className={styles.directAttachStepNumber}>5</span>
                    <span className={styles.directAttachStepText}>Select the report file that was just downloaded to your device</span>
                  </div>
                  <div className={styles.directAttachStep}>
                    <span className={styles.directAttachStepNumber}>6</span>
                    <span className={styles.directAttachStepText}>Review the email and click Send</span>
                  </div>
                </div>
                <p className={styles.autoCloseNote}>This message will automatically close after you send your email.</p>
              </div>
              <div className={styles.directAttachActions}>
                <button className={styles.directAttachButton} onClick={closeDirectAttachInfo}>
                  I understand
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportViewer;
