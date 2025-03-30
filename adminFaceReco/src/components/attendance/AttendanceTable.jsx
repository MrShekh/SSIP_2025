import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Button,
  CircularProgress,
  Chip,
  Alert
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Schedule as ClockIcon,
  Refresh as RefreshIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';

// Optimize the component with memo
const AttendanceTable = memo(({ searchTerm, filters }) => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to get today's date in YYYY-MM-DD format
  const getTodayDate = useCallback(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  }, []);

  // Fetch Attendance Data - optimized with useCallback
  const fetchAttendance = useCallback(async () => {
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
  }, [getTodayDate]);

  // Set up polling effect
  useEffect(() => {
    fetchAttendance(); // Initial fetch

    // Polling every 5 seconds to update the UI
    const interval = setInterval(fetchAttendance, 5000);
    return () => clearInterval(interval); // Cleanup
  }, [fetchAttendance]);

  // Memoize status mapping to prevent recreation on each render
  const statusMapping = useMemo(() => ({
    present: { color: 'success', icon: <CheckCircleIcon /> },
    absent: { color: 'error', icon: <CancelIcon /> },
    late: { color: 'warning', icon: <ClockIcon /> }
  }), []);

  // Optimize getStatusChip with useCallback
  const getStatusChip = useCallback((status) => {
    const statusProps = statusMapping[status] || { color: 'default', icon: null };

    return (
      <Chip
        icon={statusProps.icon}
        label={status.charAt(0).toUpperCase() + status.slice(1)}
        color={statusProps.color}
        size="small"
        sx={{ minWidth: 100 }}
      />
    );
  }, [statusMapping]);

  // Memoize filtered data based on searchTerm and filters
  const filteredAttendanceData = useMemo(() => {
    if (!searchTerm && Object.keys(filters).length === 0) {
      return attendanceData;
    }

    return attendanceData.filter(record => {
      // Search term filtering
      if (searchTerm && !record.emp_name?.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Add more filtering logic here based on filters object
      
      return true;
    });
  }, [attendanceData, searchTerm, filters]);

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
          size="small"
          sx={{ 
            borderRadius: '8px', 
            textTransform: 'none',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }
          }}
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </Button>
      </Box>

      {error && (
        <Alert 
          severity="warning" 
          sx={{ 
            mb: 2, 
            borderRadius: '8px',
            fontSize: '0.875rem'
          }}
        >
          {error}
        </Alert>
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
            {filteredAttendanceData.length > 0 ? (
              filteredAttendanceData.map((record) => (
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
                <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
                    <AccessTimeIcon sx={{ fontSize: 48, color: '#94A3B8' }} />
                    <Typography color="text.secondary" sx={{ fontWeight: 500 }}>
                      No attendance records for today
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ maxWidth: '300px', textAlign: 'center' }}>
                      Attendance records will appear here as employees check in
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
});

AttendanceTable.displayName = 'AttendanceTable';

export default AttendanceTable;
