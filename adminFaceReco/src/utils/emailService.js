/**
 * Email Service Utility
 * 
 * This service provides helper functions for handling email-related tasks
 * in a browser environment.
 */

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

/**
 * Gets the web email service URL based on the email domain
 * @param {string} email - Email address to determine the service
 * @returns {Object} - Object containing service URL and name
 */
const getEmailService = (email) => {
  const domain = email.split('@')[1].toLowerCase();
  
  const services = {
    'gmail.com': {
      url: 'https://mail.google.com/mail/?view=cm',
      name: 'Gmail'
    },
    'outlook.com': {
      url: 'https://outlook.live.com/owa/?path=/mail/action/compose',
      name: 'Outlook'
    },
    'yahoo.com': {
      url: 'https://compose.mail.yahoo.com/',
      name: 'Yahoo Mail'
    },
    'hotmail.com': {
      url: 'https://outlook.live.com/owa/?path=/mail/action/compose',
      name: 'Outlook'
    }
  };

  return services[domain] || {
    url: 'https://mail.google.com/mail/?view=cm', // Default to Gmail
    name: 'Gmail'
  };
};

/**
 * Prepares an Excel file and triggers the download
 * @param {Object} workbook - The XLSX workbook object
 * @param {string} filename - The filename for the download
 * @returns {Promise<Boolean>} - Promise resolving to true on successful download
 */
export const downloadExcelFile = (workbook, filename) => {
  return new Promise((resolve, reject) => {
    try {
      // Convert workbook to binary string
      const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });
      
      // Convert binary to Blob
      const buf = new ArrayBuffer(wbout.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < wbout.length; i++) {
        view[i] = wbout.charCodeAt(i) & 0xFF;
      }
      
      const blob = new Blob([buf], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });

      // Use FileSaver to trigger download
      saveAs(blob, filename);
      
      // Resolve after a short delay to ensure download has started
      setTimeout(() => resolve(true), 300);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Opens the web-based email client with pre-filled details
 * @param {string} from - Sender email address
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} body - Email body text
 * @returns {Promise<Boolean>} - Promise resolving to true when email client is opened
 */
export const openEmailClient = (from, to, subject, body) => {
  return new Promise((resolve) => {
    const service = getEmailService(from);
    
    // Encode the parameters for the URL
    const encodedTo = encodeURIComponent(to);
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);
    
    // Construct the URL based on the email service
    // Note: Web mail clients typically ignore the 'from' parameter in URLs for security reasons
    // The user must be logged into their account, which determines the 'from' address
    let url;
    if (service.name === 'Gmail') {
      url = `${service.url}&to=${encodedTo}&su=${encodedSubject}&body=${encodedBody}`;
    } else if (service.name === 'Outlook') {
      url = `${service.url}&to=${encodedTo}&subject=${encodedSubject}&body=${encodedBody}`;
    } else if (service.name === 'Yahoo Mail') {
      url = `${service.url}&to=${encodedTo}&subject=${encodedSubject}&body=${encodedBody}`;
    }
    
    // Open the web email client in a new tab
    window.open(url, '_blank');
    
    // Resolve after a short delay
    setTimeout(() => resolve(true), 300);
  });
};

/**
 * Creates a formatted email body for report emails
 * @param {Array} reportTypes - Array of report type names
 * @param {Object} filters - Report filters
 * @param {string} senderEmail - Sender's email address
 * @returns {string} - Formatted email body
 */
export const createReportEmailBody = (reportTypes, filters, senderEmail) => {
  return `
Hello,

Please find attached the requested report containing data for: ${reportTypes.join(', ')}.

Generated on: ${new Date().toLocaleDateString()}
${filters.timeRange ? `Time period: ${filters.timeRange}` : ''}
${filters.department ? `Department: ${filters.department}` : ''}

This report was generated from the Face Recognition Attendance System.

Note: Please attach the downloaded report file to this email before sending.

Best regards,
${senderEmail.split('@')[0]}
  `.trim();
};

/**
 * Sends a report email by downloading the Excel file and opening web email client
 * @param {string} senderEmail - Sender's email address
 * @param {string} receiverEmail - Recipient's email address
 * @param {Object} workbook - XLSX workbook object
 * @param {string} filename - Filename for the Excel file
 * @param {Array} reportTypes - Array of report type names
 * @param {Object} filters - Report filters
 * @returns {Promise<Boolean>} - Promise resolving to true when process completes
 */
export const sendReportEmail = async (senderEmail, receiverEmail, workbook, filename, reportTypes, filters) => {
  try {
    // Download the Excel file
    await downloadExcelFile(workbook, filename);
    
    // Create email subject
    const subject = `Report: ${reportTypes.join(', ')}`;
    
    // Create email body with sender information
    const body = createReportEmailBody(reportTypes, filters, senderEmail);
    
    // Open web email client with both sender and receiver
    await openEmailClient(senderEmail, receiverEmail, subject, body);
    
    return true;
  } catch (error) {
    console.error('Error sending report email:', error);
    throw error;
  }
}; 