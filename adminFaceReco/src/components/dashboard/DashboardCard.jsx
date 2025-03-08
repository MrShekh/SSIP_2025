import React from 'react';
import PropTypes from 'prop-types';
import styles from './DashboardCard.module.css';

const DashboardCard = ({ title, value, description, icon: Icon, type }) => {
  return (
    <div className={`${styles.card} ${styles[type]}`}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>{title}</h3>
        <div className={styles.cardIcon}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <div className={styles.cardValue}>{value}</div>
      <p className={styles.cardDescription}>{description}</p>
    </div>
  );
};

DashboardCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  description: PropTypes.string,
  icon: PropTypes.elementType.isRequired,
  type: PropTypes.oneOf(['present', 'absent', 'late']).isRequired,
};

export default DashboardCard;
