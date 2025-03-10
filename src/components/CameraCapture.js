import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import { Box, Typography, CircularProgress } from '@mui/material';
import { CheckCircle, HighlightOff } from '@mui/icons-material';
import styles from './CameraCapture.module.css';

const CameraCapture = () => {
  const webcamRef = useRef(null);
  const [isFaceDetected, setIsFaceDetected] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);

  // Load models when component mounts
  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      setModelsLoaded(true);
    };
    loadModels();
  }, []);

  // Run face detection when models are loaded
  useEffect(() => {
    if (!modelsLoaded) return;

    const detectFace = async () => {
      if (webcamRef.current && webcamRef.current.video) {
        const video = webcamRef.current.video;
        if (!video || video.readyState !== 4) return;

        const detections = await faceapi.detectAllFaces(
          video,
          new faceapi.TinyFaceDetectorOptions()
        );

        if (detections.length > 0) {
          setIsFaceDetected(true);
          sendFrameToBackend(video);
        } else {
          setIsFaceDetected(false);
        }
      }
    };

    const interval = setInterval(detectFace, 2000);
    return () => clearInterval(interval);
  }, [modelsLoaded]);

  const sendFrameToBackend = async (video) => {
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/jpeg")
    );

    const formData = new FormData();
    formData.append("file", blob, "image.jpg");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/mark-attendance", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log(data.message);
    } catch (error) {
      console.error("Error sending frame:", error);
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
            videoConstraints={{ facingMode: "user" }}
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
              <Typography>No Face Detected</Typography>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default CameraCapture;
