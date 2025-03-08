import React from 'react';
import { 
  HiUserGroup, 
  HiXCircle, 
  HiClock,
  HiChartBar,
  HiCalendar 
} from 'react-icons/hi';
import styles from './AttendanceSummaryCards.module.css';

const AttendanceSummaryCards = ({ data }) => {
  const cards = [
    {
      title: 'Total Attendance Today',
      value: `${data.totalPresent} Present`,
      icon: HiUserGroup,
      color: 'green',
      gradient: 'from-green-500 to-green-600'
    },
    {
      title: 'Absent Count Today',
      value: `${data.totalAbsent} Absent`,
      icon: HiXCircle,
      color: 'red',
      gradient: 'from-red-500 to-red-600'
    },
    {
      title: 'Late Arrivals Today',
      value: `${data.totalLate} Late`,
      icon: HiClock,
      color: 'orange',
      gradient: 'from-yellow-500 to-yellow-600'
    },
    {
      title: 'Weekly Average',
      value: `${data.weeklyAverage}%`,
      icon: HiChartBar,
      color: 'blue',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Monthly Rate',
      value: `${data.monthlyRate}%`,
      icon: HiCalendar,
      color: 'purple',
      gradient: 'from-purple-500 to-purple-600'
    }
  ];

  return (
    <div className={styles.cardsContainer}>
      {cards.map((card, index) => (
        <div 
          key={index} 
          className={`${styles.card} ${styles[card.color]}`}
        >
          <div className={styles.iconContainer}>
            <card.icon className={`${styles.icon} bg-gradient-to-r ${card.gradient}`} />
          </div>
          <div className={styles.content}>
            <h3 className={styles.title}>{card.title}</h3>
            <p className={styles.value}>{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AttendanceSummaryCards;
