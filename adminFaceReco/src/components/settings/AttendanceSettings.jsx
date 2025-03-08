import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
  Grid,
} from '@mui/material';
import { Info as InfoOutlined } from '@mui/icons-material';
import styles from './Settings.module.css';

const AttendanceSettings = () => {
  const [settings, setSettings] = useState({
    lateThreshold: 15,
    sendNotifications: true,
    autoLogoutDuration: 30,
    workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    workingHoursStart: '09:00',
    workingHoursEnd: '17:00',
    breakTimeStart: '13:00',
    breakTimeEnd: '14:00',
    manualApproval: true,
    approvalRoles: ['admin', 'hr'],
  });

  const handleChange = (key) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const daysOfWeek = [
    'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
  ];

  return (
    <Box className={styles.settingsSection}>
      <Typography variant="h6" gutterBottom>Attendance Rules & Policies</Typography>

      <div className={styles.settingItem}>
        <div className={styles.settingHeader}>
          <Typography variant="subtitle1">Late Marking Settings</Typography>
          <Tooltip title="Define when to mark attendance as late">
            <IconButton size="small"><InfoOutlined /></IconButton>
          </Tooltip>
        </div>
        <TextField
          type="number"
          label="Late Threshold (minutes)"
          value={settings.lateThreshold}
          onChange={handleChange('lateThreshold')}
          InputProps={{ inputProps: { min: 0, max: 60 } }}
          fullWidth
          margin="normal"
        />
        <FormControlLabel
          control={
            <Switch
              checked={settings.sendNotifications}
              onChange={handleChange('sendNotifications')}
              color="primary"
            />
          }
          label="Send Late Arrival Notifications"
        />
      </div>

      <div className={styles.settingItem}>
        <div className={styles.settingHeader}>
          <Typography variant="subtitle1">Session Settings</Typography>
        </div>
        <FormControl fullWidth margin="normal">
          <InputLabel>Auto-Logout Duration</InputLabel>
          <Select
            value={settings.autoLogoutDuration}
            onChange={handleChange('autoLogoutDuration')}
            label="Auto-Logout Duration"
          >
            <MenuItem value={10}>10 minutes</MenuItem>
            <MenuItem value={30}>30 minutes</MenuItem>
            <MenuItem value={60}>1 hour</MenuItem>
          </Select>
        </FormControl>
      </div>

      <div className={styles.settingItem}>
        <div className={styles.settingHeader}>
          <Typography variant="subtitle1">Working Hours</Typography>
        </div>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Working Days</InputLabel>
              <Select
                multiple
                value={settings.workingDays}
                onChange={handleChange('workingDays')}
                label="Working Days"
                renderValue={(selected) => selected.map(day => day.charAt(0).toUpperCase() + day.slice(1)).join(', ')}
              >
                {daysOfWeek.map((day) => (
                  <MenuItem key={day} value={day}>
                    {day.charAt(0).toUpperCase() + day.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <TextField
              type="time"
              label="Work Hours Start"
              value={settings.workingHoursStart}
              onChange={handleChange('workingHoursStart')}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              type="time"
              label="Work Hours End"
              value={settings.workingHoursEnd}
              onChange={handleChange('workingHoursEnd')}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              type="time"
              label="Break Time Start"
              value={settings.breakTimeStart}
              onChange={handleChange('breakTimeStart')}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              type="time"
              label="Break Time End"
              value={settings.breakTimeEnd}
              onChange={handleChange('breakTimeEnd')}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
      </div>

      <div className={styles.settingItem}>
        <div className={styles.settingHeader}>
          <Typography variant="subtitle1">Approval Settings</Typography>
        </div>
        <FormControlLabel
          control={
            <Switch
              checked={settings.manualApproval}
              onChange={handleChange('manualApproval')}
              color="primary"
            />
          }
          label="Enable Manual Attendance Approval"
        />
        {settings.manualApproval && (
          <FormControl fullWidth margin="normal">
            <InputLabel>Approval Roles</InputLabel>
            <Select
              multiple
              value={settings.approvalRoles}
              onChange={handleChange('approvalRoles')}
              label="Approval Roles"
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="hr">HR Manager</MenuItem>
              <MenuItem value="supervisor">Supervisor</MenuItem>
            </Select>
          </FormControl>
        )}
      </div>
    </Box>
  );
};

export default AttendanceSettings;
