import React, { useState, useEffect } from "react";
import { HiChevronLeft, HiChevronRight, HiCheckCircle, HiXCircle, HiClock } from "react-icons/hi";
import styles from "./AttendanceTable.module.css";

const AttendanceTable = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Function to get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // Extract YYYY-MM-DD
  };

  // Fetch Attendance Data
  const fetchAttendance = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/get-attendance");
      const data = await response.json();
  
      console.log("API Response:", data); // ✅ Debugging
  
      if (data.attendance) {
        console.log("Raw Attendance Data:", data.attendance);
  
        // Filter today's attendance
        const todayData = data.attendance.filter(record => {
          const recordDate = record.timestamp?.split(" ")[0]; // Extract Date
          return recordDate === getTodayDate();
        });
  
        // Sort by timestamp (latest first)
        const sortedData = todayData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
        console.log("Sorted Today’s Attendance:", sortedData); // ✅ Debugging
  
        setAttendanceData(sortedData);
      } else {
        console.warn("Attendance data missing from response.");
      }
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  };
  

  useEffect(() => {
    fetchAttendance(); // Initial fetch

    // Polling every 5 seconds to update the UI
    const interval = setInterval(fetchAttendance, 5000);
    return () => clearInterval(interval); // Cleanup
  }, []);

  return (
    <div className={styles.container}>
      <h2>Live Attendance (Today)</h2>
      <button onClick={fetchAttendance} style={{ marginBottom: "10px" }}>
        Refresh Attendance
      </button>
      <table className={styles.table}>
        <thead className={styles.tableHeader}>
          <tr>
            <th>Name</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {attendanceData.length > 0 ? (
            attendanceData.map((record) => (
              <tr key={record._id} className={styles.tableRow}>
                <td className={styles.tableCell}>{record.emp_name}</td>
                <td className={styles.tableCell}>{record.timestamp?.split(" ")[0]}</td> {/* Extract Date */}
                <td className={styles.tableCell}>{record.timestamp?.split(" ")[1] || "--"}</td> {/* Extract Time */}
                <td className={styles.tableCell}>{record.status}</td>
                <td className={styles.tableCell}>
                  {record.status === "present" && <HiCheckCircle className={styles.present} />}
                  {record.status === "absent" && <HiXCircle className={styles.absent} />}
                  {record.status === "late" && <HiClock className={styles.late} />}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className={styles.noData}>No attendance records for today.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTable;
