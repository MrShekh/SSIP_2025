import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Box,
  Button,
  CircularProgress,
  Chip
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Schedule as ClockIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

const AttendanceTable = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  // Fetch Attendance Data
  const fetchAttendance = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/get-attendance");
      const data = await response.json();

      if (data.attendance) {
        // Filter today's attendance
        const todayData = data.attendance.filter(record => {
          const recordDate = record.timestamp?.split(" ")[0];
          return recordDate === getTodayDate();
        });

        // Sort by timestamp (latest first)
        const sortedData = todayData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setAttendanceData(sortedData);
      } else {
        setError("No attendance data available");
      }
    } catch (error) {
      setError("Error fetching attendance data");
      console.error("Error fetching attendance:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance(); // Initial fetch

    // Polling every 5 seconds to update the UI
    const interval = setInterval(fetchAttendance, 5000);
    return () => clearInterval(interval); // Cleanup
  }, []);

  const getStatusChip = (status) => {
    const statusProps = {
      present: { color: 'success', icon: <CheckCircleIcon /> },
      absent: { color: 'error', icon: <CancelIcon /> },
      late: { color: 'warning', icon: <ClockIcon /> }
    }[status] || { color: 'default', icon: null };

    return (
      <Chip
        icon={statusProps.icon}
        label={status.charAt(0).toUpperCase() + status.slice(1)}
        color={statusProps.color}
        size="small"
        sx={{ minWidth: 100 }}
      />
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
          Live Attendance (Today)
        </Typography>
        <Button
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <RefreshIcon />}
          onClick={fetchAttendance}
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </Button>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Time</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {attendanceData.length > 0 ? (
              attendanceData.map((record) => (
                <TableRow
                  key={record._id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell>{record.emp_name}</TableCell>
                  <TableCell>{record.timestamp?.split(" ")[0]}</TableCell>
                  <TableCell>{record.timestamp?.split(" ")[1] || "--"}</TableCell>
                  <TableCell>
                    {getStatusChip(record.status)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                  <Typography color="text.secondary">
                    No attendance records for today.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AttendanceTable;
