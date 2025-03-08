import React, { useState, useEffect } from "react";
import CameraCapture from "../CameraCapture"; // Camera Component
import AttendanceTable from "./AttendanceTable"; // Attendance Table

export default function Attendance() {
  const [showCamera, setShowCamera] = useState(false);
  const [locationAllowed, setLocationAllowed] = useState(false);
  const [userCoords, setUserCoords] = useState(null);

  // ✅ Allowed GPS Coordinates (Example: College Location)
  const allowedLatitude = 22.2887936;  // Change to your required latitude
  const allowedLongitude = 70.7854336; // Change to your required longitude
  const allowedRadius = 0.1; // Radius in km (adjust as needed)

  // ✅ Function to Check User's GPS Location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserCoords({ latitude, longitude });

        // Check if user is within allowed radius
        if (isWithinAllowedRadius(latitude, longitude)) {
          setLocationAllowed(true);
        } else {
          setLocationAllowed(false);
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        setLocationAllowed(false);
      },
      { enableHighAccuracy: true }
    );
  }, [showCamera]); // Run this when user tries to open camera

  // ✅ Function to Check if User is in Allowed Radius
  function isWithinAllowedRadius(lat, lon) {
    const distance = getDistanceFromLatLonInKm(lat, lon, allowedLatitude, allowedLongitude);
    return distance <= allowedRadius;
  }

  // ✅ Function to Calculate Distance Between Two GPS Coordinates
  function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  }

  return (
    <div>
      <h2>Attendance Page</h2>

      {/* Show User's GPS Coordinates
      {userCoords && (
        <p>Your Location: {userCoords.latitude}, {userCoords.longitude}</p>
      )} */}

      {/* Mark Attendance Button */}
      <button onClick={() => setShowCamera(true)}>Mark Attendance</button>

      {/* Show Camera Only if Location is Allowed */}
      {showCamera && (
        <div>
          {locationAllowed ? (
            <>
              <button onClick={() => setShowCamera(false)}>Close Camera</button>
              <CameraCapture />
            </>
          ) : (
            <p style={{ color: "red" }}>❌ You are not in the allowed location. Move closer to mark attendance.</p>
          )}
        </div>
      )}

      {/* Attendance Table */}
      <AttendanceTable />
    </div>
  );
}
