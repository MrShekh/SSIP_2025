import * as faceapi from 'face-api.js';

// Flag to track if models are loaded
let modelsLoaded = false;

// Preload model function
export const loadFaceDetectionModels = async () => {
  if (modelsLoaded) return true;
  
  try {
    // The problem might be with the URI, try both approaches
    try {
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
    } catch (err) {
      await faceapi.nets.tinyFaceDetector.loadFromUri('models');
    }
    
    // Validate models loaded correctly
    if (faceapi.nets.tinyFaceDetector.isLoaded) {
      modelsLoaded = true;
      return true;
    } else {
      console.error('Face detection models did not load properly');
      return false;
    }
  } catch (error) {
    console.error('Error loading face detection models:', error);
    return false;
  }
};

// Function to detect faces
export const detectFaces = async (videoElement) => {
  if (!modelsLoaded) {
    const loaded = await loadFaceDetectionModels();
    if (!loaded) return [];
  }
  
  if (!videoElement) return [];
  
  try {
    // Use optimal settings for better performance
    const options = new faceapi.TinyFaceDetectorOptions({ 
      inputSize: 224,
      scoreThreshold: 0.2
    });
    
    // Get face detections
    const detections = await faceapi.detectSingleFace(videoElement, options);
    
    return detections ? [detections] : [];
  } catch (error) {
    console.error('Error during face detection:', error);
    return [];
  }
};

// Create a lightweight version of face-api
export const faceApiService = {
  loadModels: loadFaceDetectionModels,
  detectFaces
};

export default faceApiService; 