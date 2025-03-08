import React from 'react';
import styles from './Profile.module.css';

const Profile = () => {
  // Mock user data (replace with actual user data from your authentication system)
  const userData = {
    employeeId: "EMP001",
    name: "John Doe",
    position: "Senior Developer",
    department: "Engineering",
    email: "john.doe@company.com",
    phone: "+1 234-567-8900",
    joinDate: "2023-01-15",
    location: "New York",
    manager: "Jane Smith",
    skills: ["React", "JavaScript", "Node.js", "Python"]
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <h1>Employee Profile</h1>
      </div>
      
      <div className={styles.profileCard}>
        <div className={styles.avatarSection}>
          <div className={styles.avatar}>
            {userData.name.charAt(0)}
          </div>
          <h2>{userData.name}</h2>
          <p className={styles.position}>{userData.position}</p>
        </div>

        <div className={styles.infoSection}>
          <div className={styles.infoGroup}>
            <h3>Personal Information</h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <label>Employee ID</label>
                <p>{userData.employeeId}</p>
              </div>
              <div className={styles.infoItem}>
                <label>Department</label>
                <p>{userData.department}</p>
              </div>
              <div className={styles.infoItem}>
                <label>Email</label>
                <p>{userData.email}</p>
              </div>
              <div className={styles.infoItem}>
                <label>Phone</label>
                <p>{userData.phone}</p>
              </div>
            </div>
          </div>

          <div className={styles.infoGroup}>
            <h3>Employment Details</h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <label>Join Date</label>
                <p>{userData.joinDate}</p>
              </div>
              <div className={styles.infoItem}>
                <label>Location</label>
                <p>{userData.location}</p>
              </div>
              <div className={styles.infoItem}>
                <label>Manager</label>
                <p>{userData.manager}</p>
              </div>
            </div>
          </div>

          <div className={styles.infoGroup}>
            <h3>Skills</h3>
            <div className={styles.skillsContainer}>
              {userData.skills.map((skill, index) => (
                <span key={index} className={styles.skillBadge}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
