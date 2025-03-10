import React, { useState } from 'react';
import { HiDocumentDownload } from 'react-icons/hi';
import { generateReportData, exportReportToExcel } from '../../utils/reportData';
import styles from './Reports.module.css';

const ReportExport = ({ filters }) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const reportData = generateReportData(
        filters?.startDate || '2024-01-01',
        filters?.endDate || '2024-12-31'
      );
      
      const fileName = exportReportToExcel(
        reportData,
        filters?.startDate || '2024-01-01',
        filters?.endDate || '2024-12-31'
      );
      
      console.log(`Report exported successfully: ${fileName}`);
    } catch (error) {
      console.error('Error exporting report:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      className={`${styles.actionButton} ${styles.exportButton}`}
      onClick={handleExport}
      disabled={isExporting}
    >
      <HiDocumentDownload className={styles.actionIcon} />
      {isExporting ? 'Exporting...' : 'Export to Excel'}
    </button>
  );
};

export default ReportExport;
