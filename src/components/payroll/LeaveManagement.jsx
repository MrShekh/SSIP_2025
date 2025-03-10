import React, { useState } from 'react';
import { AiOutlineCheck, AiOutlineClose, AiOutlineCalendar } from 'react-icons/ai';
import styles from './LeaveManagement.module.css';

const LeaveManagement = () => {
  const [activeView, setActiveView] = useState('requests');
  const [selectedTeam, setSelectedTeam] = useState('all');

  const leaveRequests = [
    {
      id: 1,
      employee: 'John Doe',
      type: 'Annual Leave',
      startDate: '2024-03-15',
      endDate: '2024-03-20',
      status: 'pending',
      reason: 'Family vacation'
    },
    // Add more sample requests
  ];

  const holidays = [
    {
      id: 1,
      name: 'New Year\'s Day',
      date: '2024-01-01',
      teams: ['all']
    },
    {
      id: 2,
      name: 'Christmas Day',
      date: '2024-12-25',
      teams: ['all']
    }
  ];

  const handleLeaveAction = (requestId, action) => {
    // Implement leave approval/rejection logic
    console.log(`${action} leave request:`, requestId);
  };

  const handleAddHoliday = (event) => {
    event.preventDefault();
    // Implement holiday addition logic
  };

  return (
    <div className={styles.leaveManagement}>
      <div className={styles.controls}>
        <div className={styles.viewToggle}>
          <button
            className={`${styles.toggleButton} ${activeView === 'requests' ? styles.active : ''}`}
            onClick={() => setActiveView('requests')}
          >
            Leave Requests
          </button>
          <button
            className={`${styles.toggleButton} ${activeView === 'holidays' ? styles.active : ''}`}
            onClick={() => setActiveView('holidays')}
          >
            Holidays
          </button>
        </div>

        {activeView === 'holidays' && (
          <div className={styles.teamFilter}>
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className={styles.teamSelect}
            >
              <option value="all">All Teams</option>
              <option value="engineering">Engineering</option>
              <option value="marketing">Marketing</option>
              <option value="sales">Sales</option>
            </select>
          </div>
        )}
      </div>

      {activeView === 'requests' ? (
        <div className={styles.leaveRequests}>
          <table className={styles.requestsTable}>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Type</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaveRequests.map(request => (
                <tr key={request.id}>
                  <td>{request.employee}</td>
                  <td>{request.type}</td>
                  <td>{request.startDate}</td>
                  <td>{request.endDate}</td>
                  <td>{request.reason}</td>
                  <td>
                    <span className={`${styles.status} ${styles[request.status]}`}>
                      {request.status}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        className={`${styles.actionButton} ${styles.approve}`}
                        onClick={() => handleLeaveAction(request.id, 'approve')}
                      >
                        <AiOutlineCheck />
                      </button>
                      <button
                        className={`${styles.actionButton} ${styles.reject}`}
                        onClick={() => handleLeaveAction(request.id, 'reject')}
                      >
                        <AiOutlineClose />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={styles.holidays}>
          <div className={styles.addHoliday}>
            <form onSubmit={handleAddHoliday} className={styles.holidayForm}>
              <input
                type="text"
                placeholder="Holiday Name"
                className={styles.input}
              />
              <input
                type="date"
                className={styles.input}
              />
              <select className={styles.input}>
                <option value="all">All Teams</option>
                <option value="engineering">Engineering</option>
                <option value="marketing">Marketing</option>
                <option value="sales">Sales</option>
              </select>
              <button type="submit" className={styles.addButton}>
                <AiOutlineCalendar /> Add Holiday
              </button>
            </form>
          </div>

          <table className={styles.holidaysTable}>
            <thead>
              <tr>
                <th>Holiday Name</th>
                <th>Date</th>
                <th>Teams</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {holidays.map(holiday => (
                <tr key={holiday.id}>
                  <td>{holiday.name}</td>
                  <td>{holiday.date}</td>
                  <td>{holiday.teams.join(', ')}</td>
                  <td>
                    <button className={`${styles.actionButton} ${styles.delete}`}>
                      <AiOutlineClose />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LeaveManagement; 