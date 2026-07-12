import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.questions import router as questions_router
from app.routers import video

load_dotenv()

app = FastAPI(
    title="AI Interview API",
    description=("Backend API for generating role-specific interview questions."),
    version="1.0.0"
)

frontend_origin = os.getenv("FRONTEND_ORIGIN","http://localhost:5173")
allowed_origins = [frontend_origin,"http://127.0.0.1:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(questions_router)
app.include_router(video.router)

@app.get("/")

def root():
    return {"message": "AI Interview API is running"}

@app.get("/health")

def health_check():
    return {
        "status": "healthy"
    }