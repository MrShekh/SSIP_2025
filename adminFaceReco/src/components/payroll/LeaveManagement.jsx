import React, { useState, useCallback, useMemo, memo } from 'react';
import { AiOutlineCheck, AiOutlineClose, AiOutlineCalendar } from 'react-icons/ai';
import styles from './LeaveManagement.module.css';

// Optimize with memo to prevent unnecessary re-renders
const LeaveManagement = memo(() => {
  const [activeView, setActiveView] = useState('requests');
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [leaveRequests, setLeaveRequests] = useState([
    {
      id: 1,
      employee: 'John Doe',
      type: 'Annual Leave',
      startDate: '2024-03-15',
      endDate: '2024-03-20',
      status: 'pending',
      reason: 'Family vacation'
    },
    {
      id: 2,
      employee: 'Abhishek',
      type: 'Medical Leave',
      startDate: '2024-03-15',
      endDate: '2024-03-20',
      status: 'pending',
      reason: 'Family vacation'
    }
  ]);

  const [holidays, setHolidays] = useState([
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
  ]);

  const [newHoliday, setNewHoliday] = useState({
    name: '',
    date: '',
    teams: 'all'
  });

  // Handle view toggle
  const handleViewToggle = useCallback((view) => {
    setActiveView(view);
  }, []);

  // Handle team selection
  const handleTeamChange = useCallback((e) => {
    setSelectedTeam(e.target.value);
  }, []);

  // Handle leave action (approve/reject)
  const handleLeaveAction = useCallback((requestId, action) => {
    setLeaveRequests(prevRequests =>
      prevRequests.map(request => {
        if (request.id === requestId) {
          // If request is already rejected, don't allow approval
          if (request.status === 'rejected' && action === 'approve') {
            return request;
          }
          return {
            ...request,
            status: action === 'approve' ? 'approved' : 'rejected'
          };
        }
        return request;
      })
    );
  }, []);

  // Handle holiday input change
  const handleHolidayInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setNewHoliday(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  // Handle adding new holiday
  const handleAddHoliday = useCallback((event) => {
    event.preventDefault();
    
    if (!newHoliday.name || !newHoliday.date) {
      alert('Please fill in all required fields');
      return;
    }

    const newHolidayEntry = {
      id: holidays.length + 1,
      name: newHoliday.name,
      date: newHoliday.date,
      teams: [newHoliday.teams]
    };

    setHolidays(prev => [...prev, newHolidayEntry]);
    
    // Reset form
    setNewHoliday({
      name: '',
      date: '',
      teams: 'all'
    });
  }, [holidays, newHoliday]);

  // Handle deleting a holiday
  const handleDeleteHoliday = useCallback((holidayId) => {
    if (window.confirm('Are you sure you want to delete this holiday?')) {
      setHolidays(prev => prev.filter(holiday => holiday.id !== holidayId));
    }
  }, []);

  // Memoize filtered holidays based on selected team
  const filteredHolidays = useMemo(() => {
    if (selectedTeam === 'all') {
      return holidays;
    } else {
      return holidays.filter(holiday => 
        holiday.teams.includes('all') || holiday.teams.includes(selectedTeam)
      );
    }
  }, [holidays, selectedTeam]);

  return (
    <div className={styles.leaveManagement}>
      <div className={styles.controls}>
        <div className={styles.viewToggle}>
          <button
            className={`${styles.toggleButton} ${activeView === 'requests' ? styles.active : ''}`}
            onClick={() => handleViewToggle('requests')}
          >
            Leave Requests
          </button>
          <button
            className={`${styles.toggleButton} ${activeView === 'holidays' ? styles.active : ''}`}
            onClick={() => handleViewToggle('holidays')}
          >
            Holidays
          </button>
        </div>

        {activeView === 'holidays' && (
          <div className={styles.teamFilter}>
            <select
              value={selectedTeam}
              onChange={handleTeamChange}
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
                      {request.status !== 'rejected' && (
                        <button
                          className={`${styles.actionButton} ${styles.approve}`}
                          onClick={() => handleLeaveAction(request.id, 'approve')}
                          disabled={request.status === 'approved'}
                          title={request.status === 'approved' ? 'Already approved' : 'Approve request'}
                        >
                          <AiOutlineCheck />
                        </button>
                      )}
                      {request.status !== 'rejected' && (
                        <button
                          className={`${styles.actionButton} ${styles.reject}`}
                          onClick={() => handleLeaveAction(request.id, 'reject')}
                          title="Reject request"
                        >
                          <AiOutlineClose />
                        </button>
                      )}
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
                name="name"
                placeholder="Holiday Name"
                className={styles.input}
                value={newHoliday.name}
                onChange={handleHolidayInputChange}
                required
              />
              <input
                type="date"
                name="date"
                className={styles.input}
                value={newHoliday.date}
                onChange={handleHolidayInputChange}
                required
              />
              <select 
                name="teams"
                className={styles.input}
                value={newHoliday.teams}
                onChange={handleHolidayInputChange}
              >
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
              {filteredHolidays.map(holiday => (
                <tr key={holiday.id}>
                  <td>{holiday.name}</td>
                  <td>{holiday.date}</td>
                  <td>{holiday.teams.join(', ')}</td>
                  <td>
                    <button 
                      className={`${styles.actionButton} ${styles.delete}`}
                      onClick={() => handleDeleteHoliday(holiday.id)}
                    >
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
});

LeaveManagement.displayName = 'LeaveManagement';

export default LeaveManagement; 