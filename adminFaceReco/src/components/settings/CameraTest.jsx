import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
import {
  Close as CloseIcon,
  Camera as CameraIcon,
  Replay as ReplayIcon,
  Check as CheckIcon,
} from '@mui/icons-material';
import styles from './Settings.module.css';

const CameraTest = ({ open, onClose, onCapture }) => {
  const [stream, setStream] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const startCamera = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
          frameRate: { ideal: 30 }
        },
        audio: false
      });

      streamRef.current = mediaStream;
      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        // Wait for video to be ready
        await new Promise((resolve) => {
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play().then(resolve);
          };
        });
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError(err.message || 'Could not access camera');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setStream(null);
  }, []);

  const handleClose = () => {
    stopCamera();
    setCapturedImage(null);
    setError(null);
    onClose();
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      setCapturedImage(imageData);
      stopCamera();
    }
  };

  const handleRetake = async () => {
    setCapturedImage(null);
    await startCamera();
  };

  const handleUseImage = () => {
    if (capturedImage && onCapture) {
      onCapture(capturedImage);
    }
    handleClose();
  };

  useEffect(() => {
    let mounted = true;

    if (open && mounted) {
      startCamera();
    }

    return () => {
      mounted = false;
      stopCamera();
    };
  }, [open, startCamera, stopCamera]);

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      classes={{ paper: styles.cameraDialog }}
    >
      <DialogTitle className={styles.cameraDialogTitle}>
        <Typography variant="h6">Camera Test</Typography>
        <IconButton onClick={handleClose} size="small" className={styles.closeButton}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className={styles.cameraDialogContent}>
        <Box className={styles.cameraContainer}>
          {isLoading && (
            <div className={styles.cameraLoading}>
              <CircularProgress size={48} />
              <Typography variant="body1" style={{ marginTop: '1rem' }}>
                Initializing camera...
              </Typography>
            </div>
          )}
          {error && (
            <div className={styles.cameraError}>
              <Typography variant="body1" color="error">
                {error}
              </Typography>
              <Button
                variant="contained"
                onClick={startCamera}
                className={styles.retryButton}
              >
                Retry
              </Button>
            </div>
          )}
          {!capturedImage ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className={`${styles.cameraPreview} ${isLoading ? styles.hidden : ''}`}
            />
          ) : (
            <img
              src={capturedImage}
              alt="Captured"
              className={styles.capturedImage}
            />
          )}
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </Box>
      </DialogContent>
      <DialogActions className={styles.cameraDialogActions}>
        {!capturedImage ? (
          <Button
            variant="contained"
            color="primary"
            startIcon={<CameraIcon />}
            onClick={captureImage}
            className={styles.captureButton}
            disabled={isLoading || error}
          >
            Capture
          </Button>
        ) : (
          <>
            <Button
              variant="outlined"
              startIcon={<ReplayIcon />}
              onClick={handleRetake}
              className={styles.retakeButton}
            >
              Retake
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<CheckIcon />}
              onClick={handleUseImage}
              className={styles.useButton}
            >
              Use This
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CameraTest;
