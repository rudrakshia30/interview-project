from typing import Literal
from pydantic import BaseModel, Field

class QuestionGenerationRequest(BaseModel):
    role: str = Field(
        ...,
        min_length=2,
        max_length=100
    )

    difficulty: Literal[
        "beginner",
        "intermediate",
        "advanced"
    ] = "intermediate"

    question_count: int = Field(
        default=5,
        ge=3,
        le=10
    )


class InterviewQuestion(BaseModel):
    id: int
    question: str
    category: str


class QuestionGenerationResponse(BaseModel):
    role: str
    difficulty: str
    questions: list[InterviewQuestion]