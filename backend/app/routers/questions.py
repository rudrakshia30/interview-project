from fastapi import APIRouter, HTTPException
from app.schemas import (QuestionGenerationRequest, QuestionGenerationResponse)
from app.services.groq_services import generate_interview_questions

router = APIRouter(prefix="/api/questions", tags=["Interview Questions"])