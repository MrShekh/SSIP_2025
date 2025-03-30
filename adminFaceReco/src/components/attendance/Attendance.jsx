import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  Chip,
  Card,
  CardContent,
  Avatar,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
} from '@mui/material';
import {
  Camera,
  Close,
  CheckCircle,
  AccessTime,
  CalendarToday,
  Warning,
  Timer,
} from '@mui/icons-material';
import styles from './Attendance.module.css';
import { useAuth } from '../../context/AuthContext';
import CameraCapture from './CameraCapture.js';

const formatDate = (date) => {
  const d = new Date(date);
  const day = d.getDate();
  const month = d.toLocaleString('default', { month: 'short' });
  const year = d.getFullYear();
  
  // Add ordinal suffix to day
  const suffix = ['th', 'st', 'nd', 'rd'];
  const v = day % 100;
  const ordinal = suffix[(v - 20) % 10] || suffix[v] || suffix[0];
  
  return `${day}${ordinal} ${month} ${year}`;
};

const calculateWorkDuration = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return null;
  const diff = checkOut.getTime() - checkIn.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours} hours ${minutes} minutes`;
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'On-Time':
      return <CheckCircle fontSize="small" />;
    case 'Late':
      return <Warning fontSize="small" />;
    case 'Checked In':
      return <CheckCircle fontSize="small" />;
    default:
      return null;
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'On-Time':
      return 'success';
    case 'Late':
      return 'warning';
    case 'Checked In':
      return 'success';
    case 'Not Checked In':
      return 'default';
    case 'Checked Out':
      return 'info';
    default:
      return 'default';
  }
};

const Attendance = () => {
  const { user } = useAuth();
  const [openCamera, setOpenCamera] = useState(false);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [workDuration, setWorkDuration] = useState(null);
  const [attendance, setAttendance] = useState({
    checkInTime: null,
    checkOutTime: null,
    date: new Date(),
    status: 'Not Checked In'
  });

  const determineStatus = useCallback((checkInTime) => {
    if (!checkInTime) return 'Not Checked In';
    
    const checkInHour = checkInTime.getHours();
    const checkInMinutes = checkInTime.getMinutes();
    const totalMinutes = checkInHour * 60 + checkInMinutes;
    
    if (totalMinutes <= 555) return 'On-Time'; // Before 9:15 AM
    if (totalMinutes <= 600) return 'Late'; // Before 10:00 AM
    return 'Checked In';
  }, []);

  const isCheckInDisabled = useCallback(() => {
    if (!attendance.checkOutTime) return false;
    const now = new Date();
    const checkOutDate = new Date(attendance.checkOutTime);
    return now.toDateString() === checkOutDate.toDateString();
  }, [attendance.checkOutTime]);

  const handleCheckInOut = useCallback(() => {
    if (isCheckedIn) {
      setOpenConfirmDialog(true);
    } else {
      setOpenCamera(true);
    }
  }, [isCheckedIn]);

  const handleConfirmCheckOut = useCallback(() => {
    setOpenConfirmDialog(false);
    setOpenCamera(true);
  }, []);

  const handleCapture = useCallback(async (dataUrl) => {
    try {
      // Simulate face detection API call
      const faceDetected = true; // This would be the result from your API

      if (faceDetected) {
        setOpenCamera(false);
        const now = new Date();
        
        if (!isCheckedIn) {
          // Check In
          const status = determineStatus(now);
          setAttendance(prev => ({
            ...prev,
            checkInTime: now,
            status: status
          }));
          setIsCheckedIn(true);
        } else {
          // Check Out
          const checkOutTime = now;
          setAttendance(prev => ({
            ...prev,
            checkOutTime: checkOutTime,
            status: 'Checked Out'
          }));
          setIsCheckedIn(false);
          const duration = calculateWorkDuration(attendance.checkInTime, checkOutTime);
          setWorkDuration(duration);
        }
        setShowSuccess(true);
      } else {
        alert('No face detected. Please try again.');
      }
    } catch (error) {
      console.error('Error during face detection:', error);
      alert('Error during face detection. Please try again.');
    }
  }, [isCheckedIn, determineStatus, attendance.checkInTime]);

  const handleCloseSuccess = useCallback((event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowSuccess(false);
  }, []);

  // Reset check-in status at midnight
  useEffect(() => {
    const resetAttendance = () => {
      setIsCheckedIn(false);
      setAttendance(prev => ({
        ...prev,
        checkInTime: null,
        checkOutTime: null,
        status: 'Not Checked In',
        date: new Date()
      }));
      setWorkDuration(null);
    };

    // Calculate time until midnight
    const calculateMidnightTimeout = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      return midnight.getTime() - now.getTime();
    };

    // Set a timeout for midnight
    const timeoutId = setTimeout(resetAttendance, calculateMidnightTimeout());
    
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box className={styles.headerSection}>
        <Typography variant="h4" component="h1" className={styles.title}>
          Attendance Management
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Mark your attendance using facial recognition
        </Typography>
      </Box>

      {/* Main Content */}
      <Grid container spacing={4}>
        {/* Left Section - Attendance Card */}
        <Grid item xs={12} md={5}>
          <Card 
            className={styles.attendanceCard}
            sx={{ 
              height: '100%',
              minHeight: '600px',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <Box className={styles.userInfo}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: '100%',
                  gap: 1
                }}>
                  <Avatar
                    src={user?.avatar || '/default-avatar.jpg'}
                    alt={user?.name}
                    sx={{ 
                      width: 100, 
                      height: 100,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Typography 
                    variant="h6" 
                    gutterBottom 
                    sx={{ 
                      fontWeight: 600,
                      color: '#1a1a1a',
                      mt: 1
                    }}
                  >
                    {user?.name || 'User Name'}
                  </Typography>
                  <Chip
                    label={attendance.status}
                    color={getStatusColor(attendance.status)}
                    variant="outlined"
                    size="small"
                    icon={getStatusIcon(attendance.status)}
                    sx={{ 
                      borderRadius: '16px',
                      mt: 0.5
                    }}
                  />
                </Box>
              </Box>

              <Box className={styles.attendanceInfo} sx={{ flex: 1, my: 3 }}>
                <Box className={styles.infoItem} sx={{ mb: 3 }}>
                  <AccessTime className={styles.infoIcon} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Last Check-in
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {attendance.checkInTime ? attendance.checkInTime.toLocaleTimeString() : 'Not checked in yet'}
                    </Typography>
                    {attendance.checkOutTime && (
                      <>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                          Last Check-out
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {attendance.checkOutTime.toLocaleTimeString()}
                        </Typography>
                      </>
                    )}
                  </Box>
                </Box>

                <Box className={styles.infoItem} sx={{ mb: 3 }}>
                  <CalendarToday className={styles.infoIcon} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Date
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {formatDate(attendance.date)}
                    </Typography>
                  </Box>
                </Box>

                {workDuration && (
                  <Box className={styles.infoItem} sx={{ mb: 3 }}>
                    <Timer className={styles.infoIcon} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Work Duration
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {workDuration}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Box>

              <Tooltip title={
                isCheckInDisabled() 
                  ? "You have already checked out for today" 
                  : ""
              }>
                <span>
                  <Button
                    variant="contained"
                    startIcon={openCamera ? <Close /> : <Camera />}
                    fullWidth
                    onClick={handleCheckInOut}
                    disabled={isCheckInDisabled()}
                    className={`${styles.markAttendanceButton} ${openCamera ? styles.closeButton : ''}`}
                    sx={{
                      borderRadius: '8px',
                      py: 1.5,
                      textTransform: 'none',
                      fontSize: '1rem'
                    }}
                  >
                    {openCamera 
                      ? 'Close Camera' 
                      : isCheckInDisabled() 
                        ? 'Checked Out for Today'
                        : isCheckedIn 
                          ? 'Check-Out' 
                          : 'Check-In'
                    }
                  </Button>
                </span>
              </Tooltip>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Section - Camera Module */}
        <Grid item xs={12} md={7}>
          <Paper 
            className={styles.historySection}
            sx={{ 
              height: '100%',
              minHeight: '600px',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: '12px',
              overflow: 'hidden'
            }}
          >
            <Box className={styles.cameraSection} sx={{ flex: 1 }}>
              {openCamera ? (
                <Box className={styles.cameraContainer}>
                  <CameraCapture onCapture={handleCapture} />
                </Box>
              ) : (
                <Box className={styles.emptyState} sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Box className={styles.emptyStateContent} sx={{ textAlign: 'center' }}>
                    <Camera sx={{ fontSize: 48, color: '#6366f1', mb: 2 }} />
                    <Typography variant="h6" gutterBottom color="text.primary">
                      Ready to {isCheckedIn ? 'Check-Out' : 'Check-In'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      {isCheckInDisabled() 
                        ? 'You have already checked out for today'
                        : `Click the "${isCheckedIn ? 'Check-Out' : 'Check-In'}" button to start face detection`
                      }
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Check-out Confirmation Dialog */}
      <Dialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
      >
        <DialogTitle>Confirm Check-Out</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to check out? This action cannot be undone for today.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDialog(false)}>Cancel</Button>
          <Button onClick={handleConfirmCheckOut} color="primary" variant="contained">
            Confirm Check-Out
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
          {isCheckedIn ? 'Successfully checked in!' : 'Successfully checked out!'}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Attendance;
