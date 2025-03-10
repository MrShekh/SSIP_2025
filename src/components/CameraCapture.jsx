import React, { useRef, useEffect, useState } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { Close, CheckCircle } from '@mui/icons-material';
import styles from './CameraCapture.module.css';

const CameraCapture = ({ onCapture, onClose }) => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isFaceDetected, setIsFaceDetected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsLoading(false);
      // Simulate face detection after 2 seconds
      setTimeout(() => setIsFaceDetected(true), 2000);
    } catch (err) {
      console.error('Error accessing camera:', err);
      setIsLoading(false);
    }
  };

  const handleCapture = () => {
    if (videoRef.current && isFaceDetected) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg');
      onCapture(dataUrl);
    }
  };

  return (
    <Box className={styles.cameraContainer}>
      {/* Header */}
      <Box className={styles.header}>
        <Typography variant="h4" className={styles.title}>
          Live Face Detection
        </Typography>
        <Typography variant="body1" className={styles.subtitle}>
          Please position your face in the center
        </Typography>
      </Box>

      {/* Camera View */}
      <Box className={styles.cameraView}>
        {isLoading ? (
          <CircularProgress className={styles.loading} />
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={styles.video}
          />
        )}
      </Box>

      {/* Face Detection Status */}
      <Box className={styles.statusContainer}>
        <Box className={`${styles.statusBadge} ${isFaceDetected ? styles.detected : ''}`}>
          <CheckCircle className={styles.statusIcon} />
          <Typography>
            {isFaceDetected ? 'Face Detected' : 'Detecting Face...'}
          </Typography>
        </Box>
      </Box>

      {/* Controls */}
      <Box className={styles.controls}>
        <Button
          variant="contained"
          onClick={onClose}
          className={styles.closeButton}
          startIcon={<Close />}
        >
          Close Camera
        </Button>
      </Box>
    </Box>
  );
};

export default CameraCapture; 