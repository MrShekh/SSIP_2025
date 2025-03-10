import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  Dialog,
  IconButton,
  Chip,
  Card,
  CardContent,
  Avatar,
  Fade,
} from '@mui/material';
import {
  Camera,
  Close,
  CheckCircle,
  AccessTime,
  CalendarToday,
  LocationOn,
} from '@mui/icons-material';
import styles from './Attendance.module.css';
import { useAuth } from '../../context/AuthContext';
import CameraCapture from '../CameraCapture';

const Attendance = () => {
  const { user } = useAuth();
  const [openCamera, setOpenCamera] = useState(false);
  const [lastAttendance, setLastAttendance] = useState({
    time: new Date().toLocaleTimeString(),
    date: new Date().toLocaleDateString(),
    location: 'Office Location',
    status: 'Checked In',
  });

  const toggleCamera = () => {
    setOpenCamera(!openCamera);
  };

  const handleCapture = (dataUrl) => {
    console.log('Captured image:', dataUrl);
    setOpenCamera(false);
    setLastAttendance({
      ...lastAttendance,
      time: new Date().toLocaleTimeString(),
      date: new Date().toLocaleDateString(),
    });
  };

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
        <Grid item xs={12} md={4}>
          <Card className={styles.attendanceCard}>
            <CardContent>
              <Box className={styles.userInfo}>
                <Avatar
                  src={user?.avatar || '/default-avatar.jpg'}
                  alt={user?.name}
                  sx={{ width: 80, height: 80, mb: 2 }}
                />
                <Typography variant="h6" gutterBottom>
                  {user?.name || 'User Name'}
                </Typography>
                <Chip
                  label={lastAttendance.status}
                  color="success"
                  variant="outlined"
                  size="small"
                  icon={<CheckCircle />}
                />
              </Box>

              <Box className={styles.attendanceInfo}>
                <Box className={styles.infoItem}>
                  <AccessTime className={styles.infoIcon} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Last Check-in Time
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {lastAttendance.time}
                    </Typography>
                  </Box>
                </Box>

                <Box className={styles.infoItem}>
                  <CalendarToday className={styles.infoIcon} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Date
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {lastAttendance.date}
                    </Typography>
                  </Box>
                </Box>

                <Box className={styles.infoItem}>
                  <LocationOn className={styles.infoIcon} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Location
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {lastAttendance.location}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Button
                variant="contained"
                startIcon={openCamera ? <Close /> : <Camera />}
                fullWidth
                onClick={toggleCamera}
                className={`${styles.markAttendanceButton} ${openCamera ? styles.closeButton : ''}`}
              >
                {openCamera ? 'Close Camera' : 'Mark Attendance'}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Section - Camera Module */}
        <Grid item xs={12} md={8}>
          <Paper className={styles.historySection}>
            <Box className={styles.cameraSection}>
              {openCamera ? (
                <Box className={styles.fullScreenCamera}>
                  <IconButton
                    className={styles.cameraCloseButton}
                    onClick={toggleCamera}
                    size="large"
                  >
                    <Close />
                  </IconButton>
                  <CameraCapture onCapture={handleCapture} />
                </Box>
              ) : (
                <Box className={styles.emptyState}>
                  <Box className={styles.emptyStateContent}>
                    <Camera sx={{ fontSize: 48, color: '#6366f1', mb: 2 }} />
                    <Typography variant="h6" gutterBottom color="text.primary">
                      Ready to Mark Attendance
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      Click the "Mark Attendance" button to start face detection
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Attendance;
