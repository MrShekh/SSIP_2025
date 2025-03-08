import React, { useState } from 'react';
import {
  HiPlus,
  HiDocument,
  HiClock,
  HiUserAdd,
  HiX
} from 'react-icons/hi';
import styles from './QuickActions.module.css';

const QuickActions = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const actions = [
    {
      id: 'add-employee',
      icon: HiUserAdd,
      label: 'Add Employee',
      onClick: () => console.log('Add Employee clicked')
    },
    {
      id: 'generate-report',
      icon: HiDocument,
      label: 'Generate Report',
      onClick: () => console.log('Generate Report clicked')
    },
    {
      id: 'view-logs',
      icon: HiClock,
      label: 'View Logs',
      onClick: () => console.log('View Logs clicked')
    }
  ];

  return (
    <div className={styles.quickActionsContainer}>
      <button
        className={`${styles.mainButton} ${isExpanded ? styles.active : ''}`}
        onClick={() => setIsExpanded(!isExpanded)}
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
};

export default QuickActions;
