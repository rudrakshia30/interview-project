import json
import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

def get_groq_client() -> Groq:

    api_key = os.getenv("GROQ_API_KEY")

    if not api_key:
        raise RuntimeError(
            "GROQ_API_KEY was not found. "
            "Add it to the backend .env file."
        )

    return Groq(api_key=api_key)

def generate_interview_questions(role: str,difficulty: str,question_count: int) -> list[dict]:

    client = get_groq_client()

    model = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")

    system_prompt = """
You are an experienced technical interviewer.

Generate professional interview questions for the role selected by the user.

Rules:
1. Questions must match the selected role.
2. Questions must match the selected difficulty.
3. Do not include answers.
4. Do not include explanations.
5. Do not repeat questions.
6. Include a useful category for every question.
7. Return only valid JSON.
8. Use exactly the requested number of questions.

Use this exact JSON structure:

{
  "questions": [
    {
      "id": 1,
      "question": "Question text",
      "category": "Category name"
    }
  ]
}
"""

    user_prompt = f"""
Generate {question_count} interview questions.

Role: {role}
Difficulty: {difficulty}

Create a balanced interview containing:
- Role-specific technical questions
- Practical problem-solving questions
- At least one communication, project, or behavioural question

Return exactly {question_count} questions.
"""

    response = client.chat.completions.create(
        model=model,
        messages=[
            {
                "role": "system",
                "content": system_prompt
            },
            {
                "role": "user",
                "content": user_prompt
            }
        ],
        temperature=0.5,
        max_completion_tokens=2000,
        response_format={
            "type": "json_object"
        }
    )

    content = response.choices[0].message.content

    if not content:
        raise RuntimeError(
            "Groq returned an empty response."
        )

    try:
        parsed_response = json.loads(content)
    except json.JSONDecodeError as error:
        raise RuntimeError(
            "Groq did not return valid JSON."
        ) from error

    raw_questions = parsed_response.get("questions")

    if not isinstance(raw_questions, list):
        raise RuntimeError(
            "Groq response did not contain a questions list."
        )

    cleaned_questions = []

    for index, item in enumerate(raw_questions, start=1):
        if not isinstance(item, dict):
            continue

        question_text = str(
            item.get("question", "")
        ).strip()

        category = str(
            item.get("category", "General")
        ).strip()

        if not question_text:
            continue

        cleaned_questions.append(
            {
                "id": index,
                "question": question_text,
                "category": category or "General"
            }
        )

    if len(cleaned_questions) != question_count:
        raise RuntimeError(
            f"Expected {question_count} questions, "
            f"but received {len(cleaned_questions)} valid questions."
        )


    return cleaned_questions