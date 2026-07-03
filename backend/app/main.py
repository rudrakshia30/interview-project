import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.questions import router as questions_router

load_dotenv()

app = FastAPI(
    title="AI Interview API",
    description=(
        "Backend API for generating "
        "role-specific interview questions."
    ),
    version="1.0.0"
)

frontend_origin = os.getenv(
    "FRONTEND_ORIGIN",
    "http://localhost:5173"
)