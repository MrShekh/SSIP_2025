import React, { useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Button,
  Grid,
  Typography,
  IconButton,
  Chip,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  Download as DownloadIcon,
  FilterList as FilterListIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  AccessTime as AccessTimeIcon,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import styles from './AttendanceReport.module.css';

// Mock data - replace with actual data from your API
const mockAttendance = [
  {
    id: 1,
    employeeName: 'John Doe',
    checkIn: '09:00 AM',
    checkOut: '06:00 PM',
    totalHours: '9h',
    status: 'Present',
    date: '2024-03-11',
  },
  // Add more mock data
];

const attendanceStats = [
  { name: 'Mon', present: 45, late: 5, absent: 2 },
  { name: 'Tue', present: 42, late: 7, absent: 3 },
  { name: 'Wed', present: 48, late: 3, absent: 1 },
  { name: 'Thu', present: 44, late: 4, absent: 4 },
  { name: 'Fri', present: 46, late: 2, absent: 4 },
];

const AttendanceReport = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedDate, setSelectedDate] = useState(null);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleExport = (format) => {
    // Implement export functionality
    console.log(`Exporting as ${format}`);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'present':
        return 'success';
      case 'late':
        return 'warning';
      case 'absent':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box className={styles.attendanceReport}>
      {/* Header Section */}
      <Box className={styles.reportHeader}>
        <Typography variant="h5" component="h2">
          Reports
        </Typography>
        <Box className={styles.actions}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={() => handleExport('csv')}
          >
            Export CSV
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={() => handleExport('pdf')}
          >
            Export PDF
          </Button>
        </Box>
      </Box>

      {/* Stats Section */}
      <Grid container spacing={3} className={styles.statsSection}>
        <Grid item xs={12}>
          <Paper className={styles.chartPaper}>
            <Typography variant="h6" gutterBottom>
              Weekly Attendance Overview
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={attendanceStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="present" fill="#4caf50" name="Present" />
                <Bar dataKey="late" fill="#ff9800" name="Late" />
                <Bar dataKey="absent" fill="#f44336" name="Absent" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Filters Section */}
      <Paper className={styles.filterSection}>
        <DatePicker
          label="Select Date"
          value={selectedDate}
          onChange={(newValue) => setSelectedDate(newValue)}
          renderInput={(params) => <TextField {...params} size="small" />}
        />
        <IconButton>
          <FilterListIcon />
        </IconButton>
      </Paper>

      {/* Table Section */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Employee Name</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Check In</TableCell>
              <TableCell>Check Out</TableCell>
              <TableCell>Total Hours</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockAttendance.map((record) => (
              <TableRow key={record.id} hover>
                <TableCell>{record.employeeName}</TableCell>
                <TableCell>{record.date}</TableCell>
                <TableCell>
                  <Box className={styles.timeCell}>
                    <AccessTimeIcon fontSize="small" color="action" />
                    {record.checkIn}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box className={styles.timeCell}>
                    <AccessTimeIcon fontSize="small" color="action" />
                    {record.checkOut}
                  </Box>
                </TableCell>
                <TableCell>{record.totalHours}</TableCell>
                <TableCell>
                  <Chip
                    label={record.status}
                    color={getStatusColor(record.status)}
                    size="small"
                    icon={record.status === 'Present' ? <CheckCircleIcon /> : <CancelIcon />}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={mockAttendance.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Box>
  );
};

export default AttendanceReport; 