from fastapi import APIRouter, HTTPException
from app.schemas import (QuestionGenerationRequest, QuestionGenerationResponse)
from app.services.groq_services import generate_interview_questions

router = APIRouter(prefix="/api/questions", tags=["Interview Questions"])

@router.post("/generate",response_model=QuestionGenerationResponse)
def create_interview_questions(request: QuestionGenerationRequest):
    
    try:
        questions = generate_interview_questions(role=request.role, difficulty=request.difficulty, question_count=request.question_count)

        return {
            "role": request.role,
            "difficulty": request.difficulty,
            "questions": questions
        }

    except RuntimeError as error:
        raise HTTPException(
            status_code=502,
            detail=str(error)
        ) from error

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred "
                   "while generating questions."
        ) from error