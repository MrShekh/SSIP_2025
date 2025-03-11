from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
from database.connection import db
import shutil
import os
import cv2
import numpy as np
from datetime import datetime, timedelta, time
import face_recognition
from bson import ObjectId
from fastapi import APIRouter, Query
# from fastapi import FastAPI, WebSocket, WebSocketDisconnect
import json

router = APIRouter()

# List of connected WebSocket clients
# connected_clients = set()

UPLOAD_DIR = "dataset/"
os.makedirs(UPLOAD_DIR, exist_ok=True)  # Ensure dataset directory exists

# Load known faces once at startup
known_face_encodings = []
known_emp_ids = []
recent_attendance = {}  # Dictionary to store last attendance time for each emp_id
# Add these constants at the top of the file with other imports
OFFICE_START_TIME = time(9, 0)  # 9:00 AM
OFFICE_END_TIME = time(17, 00)   # 5:00 PM
LAST_CHECK_IN_TIME = time(9, 30)  # 9:30 AM
ON_TIME_LIMIT = time(9, 15)     # 9:15 AM

def load_known_faces():
    global known_face_encodings, known_emp_ids
    known_face_encodings.clear()
    known_emp_ids.clear()
    try:
        for filename in os.listdir(UPLOAD_DIR):
            if filename.endswith(".jpg"):
                image_path = os.path.join(UPLOAD_DIR, filename)
                img = face_recognition.load_image_file(image_path)
                encoding = face_recognition.face_encodings(img)
                if encoding:
                    known_face_encodings.append(encoding[0])
                    known_emp_ids.append(filename.split(".")[0])
    except Exception as e:
        print(f"Error loading known faces: {str(e)}")

# Load known faces initially
load_known_faces()

@router.post("/add-user")
async def add_user(
    emp_id: str = Form(...),
    name: str = Form(...),
    role: str = Form(...),
    department: str = Form("Not Specified"),
    photo: UploadFile = File(...)
):
    """API to add a new user with a photo"""
    try:
        file_path = os.path.join(UPLOAD_DIR, f"{emp_id}.jpg")
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(photo.file, buffer)

        user = {
            "emp_id": emp_id,
            "name": name,
            "role": role,
            "department": department,
            "photo": file_path,
        }
        await db.users.insert_one(user)  # Save in MongoDB
        load_known_faces()  # Reload known faces after adding a new user

        return {"message": "User added successfully", "file_path": file_path}
    except Exception as e:
        return {"error": str(e)}

def recognize_face(frame):
    """Recognize face from camera frame and match with stored images"""
    emp_id = "Unknown"
    try:
        small_frame = cv2.resize(frame, (0, 0), fx=0.5, fy=0.5)
        rgb_frame = cv2.cvtColor(small_frame, cv2.COLOR_BGR2RGB)
        face_locations = face_recognition.face_locations(rgb_frame)
        face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)
        
        for face_encoding in face_encodings:
            if known_face_encodings:
                face_distances = face_recognition.face_distance(known_face_encodings, face_encoding)
                best_match_index = np.argmin(face_distances)
                if face_distances[best_match_index] < 0.5:
                    emp_id = known_emp_ids[best_match_index]
                    break  # Stop checking once a match is found
    except Exception as e:
        print(f"Face Recognition Error: {str(e)}")
    
    return frame, emp_id

# async def notify_clients(attendance_entry):
#     for client in connected_clients:
#         await client.send_text(json.dumps({"new_attendance": attendance_entry}))

@router.post("/mark-attendance")
async def mark_attendance(file: UploadFile = File(...)):
    try:
        image_bytes = await file.read()
        np_arr = np.frombuffer(image_bytes, np.uint8)
        frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        if frame is None:
            raise HTTPException(status_code=400, detail="Invalid image format")

        _, emp_id = recognize_face(frame)
        if emp_id == "Unknown":
            return JSONResponse(content={"message": "No face recognized"})

        now = datetime.now()
        current_time = now.time()

        # Check if it's within office hours
        if current_time < OFFICE_START_TIME:
            return JSONResponse(content={"message": "Too early for attendance. Office starts at 9:00 AM"})

        # Fetch the last recorded attendance for the employee
        last_attendance = await db.attendance_collection.find_one(
            {"emp_id": emp_id}, 
            sort=[("timestamp", -1)]
        )

        # Handle Check-in logic
        if not last_attendance or last_attendance["status"] == "Check-out":
            # Only allow check-in until 9:30 AM
            if current_time > LAST_CHECK_IN_TIME:
                return JSONResponse(content={
                    "message": f"Check-in not allowed after {LAST_CHECK_IN_TIME.strftime('%I:%M %p')}"
                })
            
            attendance_status = "Check-in"
            timing_status = "On-time" if current_time <= ON_TIME_LIMIT else "Late"
        
        # Handle Check-out logic
        else:
            if last_attendance["status"] == "Check-in":
                # Don't allow check-out before 5 PM
                if current_time < OFFICE_END_TIME:
                    return JSONResponse(content={
                        "message": "Early check-out not allowed. Office ends at 10:30 am"
                    })
                attendance_status = "Check-out"
                timing_status = "N/A"

        user = await db.users.find_one({"emp_id": emp_id})
        emp_name = user["name"] if user else "Unknown"

        attendance_entry = {
            "emp_id": emp_id,
            "emp_name": emp_name,
            "timestamp": now.strftime("%Y-%m-%d %H:%M:%S"),
            "status": attendance_status,
            "timing_status": timing_status,
            "recorded_time": current_time.strftime("%H:%M:%S")
        }

        # Save the attendance record
        await db.attendance_collection.insert_one(attendance_entry)

        return JSONResponse(content={
            "message": f"{attendance_status} recorded for {emp_name} ({emp_id})",
            "timestamp": attendance_entry["timestamp"],
            "status": attendance_status,
            "timing_status": timing_status,
            "recorded_time": attendance_entry["recorded_time"]
        })

    except Exception as e:
        return JSONResponse(content={"error": str(e)})



@router.get("/get-attendance")
async def get_attendance():
    try:
        records = await db.attendance_collection.find().to_list(None)  # ✅ Corrected Collection Name

        # Convert ObjectId and datetime fields to string
        for record in records:
            record["_id"] = str(record["_id"])
            if "timestamp" in record and isinstance(record["timestamp"], datetime):
                record["timestamp"] = record["timestamp"].strftime("%Y-%m-%d %H:%M:%S")

        return JSONResponse(content={"attendance": records})
    except Exception as e:
        return JSONResponse(content={"error": str(e)})
    
# @router.post("/add-attendance")
# async def add_attendance(data: dict):
#     try:
#         # Insert into database
#         new_record = await db.attendance_collection.insert_one(data)
#         data["_id"] = str(new_record.inserted_id)

#         # Broadcast update to WebSocket clients
#         for client in connected_clients:
#             await client.send_text(json.dumps({"new_attendance": data}))

#         return {"message": "Attendance added successfully", "record": data}
#     except Exception as e:
#         return {"error": str(e)}
    
# @router.websocket("/ws")
# async def websocket_endpoint(websocket: WebSocket):
#     await websocket.accept()
#     connected_clients.add(websocket)
#     try:
#         while True:
#             await websocket.receive_text()  # Keep the connection alive
#     except WebSocketDisconnect:
#         connected_clients.remove(websocket)

        
@router.get("/get-weekly-attendance")
async def get_weekly_attendance(emp_id: str = Query(...)):
    try:
        today = datetime.utcnow()
        week_start = today - timedelta(days=today.weekday())  

        # ✅ Convert stored timestamps from string to datetime before filtering
        records = await db.attendance_collection.find({
            "emp_id": emp_id
        }).to_list(None)

        filtered_records = []
        for record in records:
            if "timestamp" in record:
                if isinstance(record["timestamp"], str):  
                    record["timestamp"] = datetime.strptime(record["timestamp"], "%Y-%m-%d %H:%M:%S")

                if record["timestamp"] >= week_start:  
                    record["_id"] = str(record["_id"])
                    record["timestamp"] = record["timestamp"].strftime("%Y-%m-%d %H:%M:%S")
                    filtered_records.append(record)

        return JSONResponse(content={"weekly_attendance": filtered_records})
    except Exception as e:
        return JSONResponse(content={"error": str(e)})

@router.get("/get-monthly-attendance")
async def get_monthly_attendance(
    emp_id: str = Query(...), 
    month: int = Query(datetime.utcnow().month), 
    year: int = Query(datetime.utcnow().year)
):
    try:
        start_date = datetime(year, month, 1)
        if month == 12:
            end_date = datetime(year + 1, 1, 1)
        else:
            end_date = datetime(year, month + 1, 1)

        print(f"Checking attendance for emp_id: {emp_id}, Month: {month}, Year: {year}")  # Debugging

        records = await db.attendance_collection.find({
            "emp_id": emp_id,
            "timestamp": {"$gte": start_date, "$lt": end_date}
        }).to_list(None)

        if not records:
            print("No records found!")  # Debugging

        for record in records:
            record["_id"] = str(record["_id"])
            if "timestamp" in record and isinstance(record["timestamp"], datetime):
                record["timestamp"] = record["timestamp"].strftime("%Y-%m-%d %H:%M:%S")

        return JSONResponse(content={"monthly_attendance": records})
    except Exception as e:
        print("Error:", str(e))  # Debugging
        return JSONResponse(content={"error": str(e)})

@router.get("/get-yearly-attendance")
async def get_yearly_attendance(
    emp_id: str = Query(...), 
    year: int = Query(datetime.utcnow().year)
):
    try:
        start_date = datetime(year, 1, 1)
        end_date = datetime(year + 1, 1, 1)

        print(f"Checking attendance for emp_id: {emp_id}, Year: {year}")  # Debugging

        records = await db.attendance_collection.find({
            "emp_id": emp_id,
            "timestamp": {"$gte": start_date, "$lt": end_date}
        }).to_list(None)

        if not records:
            print("No records found!")  # Debugging

        for record in records:
            record["_id"] = str(record["_id"])
            if "timestamp" in record and isinstance(record["timestamp"], datetime):
                record["timestamp"] = record["timestamp"].strftime("%Y-%m-%d %H:%M:%S")

        return JSONResponse(content={"yearly_attendance": records})
    except Exception as e:
        print("Error:", str(e))  # Debugging
        return JSONResponse(content={"error": str(e)})
    

@router.get("/get-total-hours")
async def get_total_hours(emp_id: str = Query(...), period: str = Query("daily")):
    """
    Calculate total working hours for an employee based on actual check-in/check-out times.
    """
    try:
        today = datetime.now()  # Use local time instead of UTC
        start_date, end_date = None, None

        # Set date range based on period
        if period == "daily":
            start_date = today.replace(hour=0, minute=0, second=0, microsecond=0)
            end_date = today.replace(hour=23, minute=59, second=59, microsecond=999999)
            expected_hours = 8
        # ... rest of the period conditions remain same ...

        # Fetch attendance records for the period
        pipeline = [
            {
                "$match": {
                    "emp_id": emp_id,
                    "timestamp": {
                        "$gte": start_date.strftime("%Y-%m-%d %H:%M:%S"),
                        "$lte": end_date.strftime("%Y-%m-%d %H:%M:%S")
                    }
                }
            },
            {
                "$sort": {"timestamp": 1}  # Sort by timestamp ascending
            }
        ]
        
        records = await db.attendance_collection.find({
            "emp_id": emp_id,
            "timestamp": {
                "$gte": start_date.strftime("%Y-%m-%d %H:%M:%S"),
                "$lte": end_date.strftime("%Y-%m-%d %H:%M:%S")
            }
        }).sort("timestamp", 1).to_list(None)

        total_minutes = 0
        late_count = 0
        check_in_time = None

        # Process each record chronologically
        for record in records:
            # Convert timestamp string to datetime
            if isinstance(record["timestamp"], str):
                current_time = datetime.strptime(record["timestamp"], "%Y-%m-%d %H:%M:%S")
            else:
                current_time = record["timestamp"]

            if record["status"] == "Check-in":
                check_in_time = current_time
                if record["timing_status"] == "Late":
                    late_count += 1
            elif record["status"] == "Check-out" and check_in_time:
                # Calculate minutes between check-in and check-out
                duration = current_time - check_in_time
                total_minutes += duration.total_seconds() / 60
                check_in_time = None

        # Calculate hours and remaining minutes
        hours = int(total_minutes // 60)
        minutes = int(total_minutes % 60)
        hours_worked = hours + (minutes / 60)
        
        # Calculate attendance percentage
        attendance_percentage = (hours_worked / expected_hours * 100) if expected_hours > 0 else 0

        status = "Excellent" if attendance_percentage >= 95 else \
                "Good" if attendance_percentage >= 85 else \
                "Average" if attendance_percentage >= 75 else "Poor"

        return JSONResponse(content={
            "emp_id": emp_id,
            "period": period,
            "total_working_hours": f"{hours}h {minutes}m",
            "expected_hours": f"{expected_hours}h",
            "attendance_percentage": f"{attendance_percentage:.1f}%",
            "status": status,
            "statistics": {
                "late_arrivals": late_count,
                "actual_hours_worked": round(hours_worked, 2),
                "expected_hours": expected_hours,
                "check_in_out_pairs": len(records) // 2  # Number of complete check-in/out pairs
            }
        })

    except Exception as e:
        print(f"Error calculating hours: {str(e)}")  # Debug log
        return JSONResponse(content={"error": str(e)})