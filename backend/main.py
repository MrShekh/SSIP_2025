from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.attendance import router as attendance_router
from database.connection import db  # Ensure the database connection is imported

app = FastAPI()

# Enable CORS for HTTP requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (change this in production)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(attendance_router, prefix="/api")

@app.get("/")
async def home():
    return {"message": "AI Attendance System Backend is Running"}
