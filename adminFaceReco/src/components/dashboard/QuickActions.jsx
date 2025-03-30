import React, { useState, useMemo, useCallback, memo } from 'react';
import {
  HiPlus,
  HiDocument,
  HiClock,
  HiUserAdd,
  HiX
} from 'react-icons/hi';
import styles from './QuickActions.module.css';

// Optimize with memo to prevent unnecessary re-renders
const QuickActions = memo(() => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Memoize toggle function
  const toggleExpanded = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  // Optimize action callbacks
  const handleAddEmployee = useCallback(() => {
    console.log('Add Employee clicked');
  }, []);

  const handleGenerateReport = useCallback(() => {
    console.log('Generate Report clicked');
  }, []);

  const handleViewLogs = useCallback(() => {
    console.log('View Logs clicked');
  }, []);

  // Memoize actions array
  const actions = useMemo(() => [
    {
      id: 'add-employee',
      icon: HiUserAdd,
      label: 'Add Employee',
      onClick: handleAddEmployee
    },
    {
      id: 'generate-report',
      icon: HiDocument,
      label: 'Generate Report',
      onClick: handleGenerateReport
    },
    {
      id: 'view-logs',
      icon: HiClock,
      label: 'View Logs',
      onClick: handleViewLogs
    }
  ], [handleAddEmployee, handleGenerateReport, handleViewLogs]);

  return (
    <div className={styles.quickActionsContainer}>
      <button
        className={`${styles.mainButton} ${isExpanded ? styles.active : ''}`}
        onClick={toggleExpanded}
      >
        {isExpanded ? (
          <HiX className={styles.buttonIcon} />
        ) : (
          <HiPlus className={styles.buttonIcon} />
        )}
      </button>

      {isExpanded && (
        <div className={styles.actionsList}>
          {actions.map((action) => (
            <button
              key={action.id}
              className={styles.actionButton}
              onClick={action.onClick}
              title={action.label}
            >
              <action.icon className={styles.actionIcon} />
              <span className={styles.actionLabel}>{action.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
});

QuickActions.displayName = 'QuickActions';

export default QuickActions;
