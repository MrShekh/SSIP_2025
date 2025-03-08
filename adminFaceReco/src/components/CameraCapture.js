import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";

const CameraCapture = () => {
  const webcamRef = useRef(null);
  const [isFaceDetected, setIsFaceDetected] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);

  // ✅ Load models when component mounts
  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models"); // Load detection model
      setModelsLoaded(true);
    };
    loadModels();
  }, []);

  // ✅ Run face detection when models are loaded
  useEffect(() => {
    if (!modelsLoaded) return;

    const detectFace = async () => {
      if (webcamRef.current && webcamRef.current.video) {
        const video = webcamRef.current.video;
        if (!video || video.readyState !== 4) return; // Ensure video is ready

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

    const interval = setInterval(detectFace, 2000); // Run detection every 2 seconds
    return () => clearInterval(interval);
  }, [modelsLoaded]);

  // ✅ Capture frame & send to FastAPI backend
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
    <div>
      <h2>Live Face Detection Attendance</h2>
      <Webcam ref={webcamRef} videoConstraints={{ facingMode: "user" }} />
      <p>{isFaceDetected ? "Face detected ✅" : "No face detected ❌"}</p>
    </div>
  );
};

export default CameraCapture;
