import React, { useRef, useEffect, useState, useCallback, memo, useMemo } from "react";
import Webcam from "react-webcam";
import { Box, Typography, CircularProgress } from '@mui/material';
import { CheckCircle, HighlightOff } from '@mui/icons-material';
import styles from './CameraCapture.module.css';
import faceApiService from '../../utils/faceApiService';

// Optimize with memo to prevent unnecessary re-renders
const CameraCapture = memo(({ onCapture }) => {
  const webcamRef = useRef(null);
  const [isFaceDetected, setIsFaceDetected] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const timeoutRef = useRef(null);
  const detectionIntervalRef = useRef(null);

  // Load models when component mounts
  useEffect(() => {
    const loadModels = async () => {
      try {
        const success = await faceApiService.loadModels();
        setModelsLoaded(success);
      } catch (error) {
        console.error("Error loading face detection models:", error);
      }
    };
    loadModels();
  }, []);

  // Handle camera ready state
  const handleUserMedia = useCallback(() => {
    setCameraReady(true);
  }, []);

  // Handle camera errors
  const handleUserMediaError = useCallback((err) => {
    console.error("Camera error:", err);
    setCameraReady(false);
  }, []);

  // Cleanup function for timeouts
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
    };
  }, []);

  // Memoize the face detection function
  const detectFace = useCallback(async () => {
    // Simple check if webcam reference exists
    if (!webcamRef.current) return;

    try {
      // Pass the video element directly without further checks
      const detections = await faceApiService.detectFaces(webcamRef.current.video);
      const faceFound = detections.length > 0;
      
      if (faceFound !== isFaceDetected) {
        setIsFaceDetected(faceFound);
      }

      if (faceFound) {
        // Clear any existing timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        // If face is detected, wait for a brief moment to ensure it's stable
        timeoutRef.current = setTimeout(() => {
          if (webcamRef.current && typeof webcamRef.current.getScreenshot === 'function') {
            try {
              const imageSrc = webcamRef.current.getScreenshot();
              if (imageSrc && onCapture) {
                onCapture(imageSrc);
              }
            } catch (error) {
              console.error("Error capturing screenshot:", error);
            }
          }
        }, 500);
      }
    } catch (error) {
      console.error("Error during face detection:", error);
      setIsFaceDetected(false);
    }
  }, [isFaceDetected, onCapture]);

  // Run face detection when models are loaded and camera is ready
  useEffect(() => {
    if (!modelsLoaded || !cameraReady) return;
    
    // Run detection immediately once and then set interval
    detectFace();
    detectionIntervalRef.current = setInterval(detectFace, 1000);
    
    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [modelsLoaded, cameraReady, detectFace]);

  // Memoize video constraints
  const videoConstraints = useMemo(() => ({
    facingMode: "user",
    width: { ideal: 640 },
    height: { ideal: 480 }
  }), []);

  return (
    <Box className={styles.cameraContainer}>
      {/* Camera View */}
      <Box className={styles.cameraView}>
        {!modelsLoaded ? (
          <Box className={styles.loadingContainer}>
            <CircularProgress className={styles.loading} />
            <Typography variant="body1" className={styles.loadingText}>
              Loading face detection...
            </Typography>
          </Box>
        ) : (
          <Webcam
            ref={webcamRef}
            className={styles.video}
            videoConstraints={videoConstraints}
            mirrored={true}
            screenshotFormat="image/jpeg"
            audio={false}
            onUserMedia={handleUserMedia}
            onUserMediaError={handleUserMediaError}
          />
        )}
      </Box>

      {/* Face Detection Status */}
      <Box className={styles.statusContainer}>
        <Box className={`${styles.statusBadge} ${isFaceDetected ? styles.detected : styles.notDetected}`}>
          {isFaceDetected ? (
            <>
              <CheckCircle className={styles.statusIcon} />
              <Typography>Face Detected</Typography>
            </>
          ) : (
            <>
              <HighlightOff className={styles.statusIcon} />
              <Typography>Position your face in the frame</Typography>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
});

CameraCapture.displayName = 'CameraCapture';

export default CameraCapture;
