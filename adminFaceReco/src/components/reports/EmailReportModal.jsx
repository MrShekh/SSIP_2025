import React, { useState } from 'react';
import { HiMail, HiX, HiInformationCircle, HiUser } from 'react-icons/hi';
import styles from './EmailReportModal.module.css';

const EmailReportModal = ({ isOpen, onClose, onSend, downloadMode = false }) => {
  const [senderEmail, setSenderEmail] = useState('');
  const [receiverEmail, setReceiverEmail] = useState('');
  const [error, setError] = useState('');
  const [isSending, setIsSending] = useState(false);

  if (!isOpen) return null;

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!senderEmail.trim() || !receiverEmail.trim()) {
      setError('Please enter both sender and receiver email addresses');
      return;
    }

    if (!validateEmail(senderEmail) || !validateEmail(receiverEmail)) {
      setError('Please enter valid email addresses');
      return;
    }

    setIsSending(true);
    try {
      await onSend(senderEmail, receiverEmail);
      // Don't close modal automatically - it will be handled by the timeout in ReportViewer
    } catch (err) {
      setError('Failed to process request. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h3 className={styles.title}>
            <HiMail className={styles.titleIcon} />
            Send Report via Email
          </h3>
          <button className={styles.closeButton} onClick={onClose}>
            <HiX />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.infoBox}>
            <HiInformationCircle className={styles.infoIcon} />
            <p className={styles.infoText}>
              Enter your email service address and the recipient's email. You will need to be logged in to that email service in your browser. The report will be downloaded and your web email service will open automatically in a new tab.
            </p>
          </div>
          
          <div className={styles.emailFields}>
            <div className={styles.inputGroup}>
              <label htmlFor="senderEmail" className={styles.label}>
                <HiUser className={styles.labelIcon} />
                Email Service to Use
              </label>
              <input
                id="senderEmail"
                type="email"
                className={styles.input}
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                placeholder="e.g., your.email@gmail.com"
                disabled={isSending}
              />
              <small className={styles.helperText}>
                Supported services: Gmail, Outlook, Yahoo Mail (you must be logged in to this account)
              </small>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="receiverEmail" className={styles.label}>
                <HiMail className={styles.labelIcon} />
                Recipient's Email Address
              </label>
              <input
                id="receiverEmail"
                type="email"
                className={styles.input}
                value={receiverEmail}
                onChange={(e) => setReceiverEmail(e.target.value)}
                placeholder="Enter recipient's email address"
                disabled={isSending}
              />
            </div>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
              disabled={isSending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.sendButton}
              disabled={isSending}
            >
              {isSending ? 'Processing...' : 'Send Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmailReportModal; 