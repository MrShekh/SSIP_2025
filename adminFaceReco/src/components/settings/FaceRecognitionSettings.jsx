import React, { useState } from 'react';
import {
  Box,
  Typography,
  Slider,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Tooltip,
  IconButton,
} from '@mui/material';
import {
  Info as InfoOutlined,
  PhotoCamera as CameraAlt,
} from '@mui/icons-material';
import CameraTest from './CameraTest';
import styles from './Settings.module.css';

const FaceRecognitionSettings = () => {
  const [settings, setSettings] = useState({
    accuracyThreshold: 80,
    livenessDetection: true,
    livenessMethod: 'blink',
    cameraResolution: '1080p',
    cameraAccess: true,
    minImages: 5,
    imageEnhancement: true,
    deleteOldData: false,
  });

  const [showCameraTest, setShowCameraTest] = useState(false);

  const handleChange = (key) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSliderChange = (event, newValue) => {
    setSettings(prev => ({ ...prev, accuracyThreshold: newValue }));
  };

  const handleCameraTest = () => {
    setShowCameraTest(true);
  };

  const handleCameraCapture = (imageData) => {
    // Handle the captured image
    console.log('Captured image:', imageData);
    // You can save this image or use it for testing face recognition
  };

  return (
    <Box className={styles.settingsSection}>
      <Typography variant="h6" gutterBottom>Face Recognition Settings</Typography>
      
      <div className={styles.settingItem}>
        <div className={styles.settingHeader}>
          <Typography variant="subtitle1">Recognition Accuracy Threshold</Typography>
          <Tooltip title="Higher values increase security but may reject valid users">
            <IconButton size="small"><InfoOutlined /></IconButton>
          </Tooltip>
        </div>
        <Slider
          value={settings.accuracyThreshold}
          onChange={handleSliderChange}
          valueLabelDisplay="auto"
          step={5}
          marks
          min={50}
          max={100}
        />
      </div>

      <div className={styles.settingItem}>
        <div className={styles.settingHeader}>
          <Typography variant="subtitle1">Liveness Detection</Typography>
          <Tooltip title="Prevents spoofing with photos or videos">
            <IconButton size="small"><InfoOutlined /></IconButton>
          </Tooltip>
        </div>
        <FormControlLabel
          control={
            <Switch
              checked={settings.livenessDetection}
              onChange={handleChange('livenessDetection')}
              color="primary"
            />
          }
          label="Enable Liveness Detection"
        />
        {settings.livenessDetection && (
          <FormControl fullWidth margin="normal">
            <InputLabel>Detection Method</InputLabel>
            <Select
              value={settings.livenessMethod}
              onChange={handleChange('livenessMethod')}
              label="Detection Method"
            >
              <MenuItem value="blink">Blink Detection</MenuItem>
              <MenuItem value="movement">Head Movement</MenuItem>
              <MenuItem value="expression">Expression Change</MenuItem>
            </Select>
          </FormControl>
        )}
      </div>

      <div className={styles.settingItem}>
        <div className={styles.settingHeader}>
          <Typography variant="subtitle1">Camera Settings</Typography>
          <Button
            variant="contained"
            startIcon={<CameraAlt />}
            onClick={handleCameraTest}
            size="small"
            className={styles.captureButton}
          >
            Test Camera
          </Button>
        </div>
        <FormControl fullWidth margin="normal">
          <InputLabel>Camera Resolution</InputLabel>
          <Select
            value={settings.cameraResolution}
            onChange={handleChange('cameraResolution')}
            label="Camera Resolution"
          >
            <MenuItem value="720p">HD (720p)</MenuItem>
            <MenuItem value="1080p">Full HD (1080p)</MenuItem>
            <MenuItem value="1440p">QHD (1440p)</MenuItem>
          </Select>
        </FormControl>
        <FormControlLabel
          control={
            <Switch
              checked={settings.cameraAccess}
              onChange={handleChange('cameraAccess')}
              color="primary"
            />
          }
          label="Allow Camera Access"
        />
      </div>

      <div className={styles.settingItem}>
        <div className={styles.settingHeader}>
          <Typography variant="subtitle1">Face Enrollment</Typography>
        </div>
        <TextField
          type="number"
          label="Minimum Images Required"
          value={settings.minImages}
          onChange={handleChange('minImages')}
          InputProps={{ inputProps: { min: 1, max: 10 } }}
          fullWidth
          margin="normal"
        />
        <FormControlLabel
          control={
            <Switch
              checked={settings.imageEnhancement}
              onChange={handleChange('imageEnhancement')}
              color="primary"
            />
          }
          label="Auto Image Enhancement"
        />
        <FormControlLabel
          control={
            <Switch
              checked={settings.deleteOldData}
              onChange={handleChange('deleteOldData')}
              color="primary"
            />
          }
          label="Delete Old Data on Re-enrollment"
        />
      </div>

      <CameraTest
        open={showCameraTest}
        onClose={() => setShowCameraTest(false)}
        onCapture={handleCameraCapture}
      />
    </Box>
  );
};

export default FaceRecognitionSettings;
