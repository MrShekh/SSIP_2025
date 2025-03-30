import React, { useState } from 'react';
import { AiOutlineUpload, AiOutlineFile } from 'react-icons/ai';
import styles from './BulkImport.module.css';

const BulkImport = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Read and preview CSV file
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        const rows = text.split('\n').slice(0, 6); // Show first 5 rows + header
        setPreview(rows.map(row => row.split(',')));
      };
      reader.readAsText(selectedFile);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (file) {
      // Implement CSV import logic
      console.log('Importing file:', file);
    }
  };

  return (
    <div className={styles.bulkImport}>
      <h2>Bulk Import Employees</h2>
      
      <div className={styles.instructions}>
        <h3>Instructions</h3>
        <ol>
          <li>Prepare your CSV file with the following columns:
            <ul>
              <li>First Name</li>
              <li>Last Name</li>
              <li>Email</li>
              <li>Role (Admin/HR/Manager/Employee)</li>
              <li>Department</li>
            </ul>
          </li>
          <li>Make sure all required fields are filled</li>
          <li>Upload the CSV file using the form below</li>
        </ol>
      </div>

      <form onSubmit={handleSubmit} className={styles.uploadForm}>
        <div className={styles.fileInput}>
          <input
            type="file"
            id="csvFile"
            accept=".csv"
            onChange={handleFileChange}
            className={styles.hiddenInput}
          />
          <label htmlFor="csvFile" className={styles.fileLabel}>
            <AiOutlineFile className={styles.fileIcon} />
            <span>{file ? file.name : 'Choose CSV file'}</span>
          </label>
        </div>

        {preview.length > 0 && (
          <div className={styles.preview}>
            <h3>Preview</h3>
            <div className={styles.previewTable}>
              <table>
                <tbody>
                  {preview.map((row, index) => (
                    <tr key={index}>
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={!file}
        >
          <AiOutlineUpload />
          Import Employees
        </button>
      </form>

      <div className={styles.downloadTemplate}>
        <button className={styles.templateLink} onClick={() => alert('Template download will be available soon')}>
          Download CSV Template
        </button>
      </div>
    </div>
  );
};

export default BulkImport; 