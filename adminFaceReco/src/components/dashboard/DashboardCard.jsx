import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styles from './DashboardCard.module.css';

// Memoize the component to prevent unnecessary re-renders
const DashboardCard = memo(({ title, value, description, icon: Icon, type }) => {
  return (
    <div className={`${styles.card} ${styles[type]}`}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>{title}</h3>
        <div className={styles.cardIcon}>
          <Icon />
        </div>
      </div>
      <div className={styles.cardValue}>{value}</div>
      <p className={styles.cardDescription}>{description}</p>
    </div>
  );
});

DashboardCard.displayName = 'DashboardCard';

DashboardCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  description: PropTypes.string,
  icon: PropTypes.elementType.isRequired,
  type: PropTypes.oneOf(['present', 'absent', 'late']).isRequired,
};

export default DashboardCard;
