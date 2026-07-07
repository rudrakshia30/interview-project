import os
from pathlib import Path
from app.services.groq_services import (get_groq_client)

class TranscriptionError(Exception):
    """Raised when Groq cannot transcribe an interview answer."""

def transcribe_answer_audio(audio_path: Path,question: str) -> str:

    client = get_groq_client()

    model = os.getenv("GROQ_TRANSCRIPTION_MODEL","whisper-large-v3-turbo")

    language = os.getenv("GROQ_TRANSCRIPTION_LANGUAGE","en").strip()

    request_data = {"model": model,"response_format": "json","temperature": 0.0}

    if language:
        request_data["language"] = language

    clean_question = question.strip()

    if clean_question:
        request_data["prompt"] = (clean_question[:500])

    try:
        with audio_path.open("rb") as audio_file:
            transcription = (client.audio.transcriptions.create(file=(audio_path.name,audio_file.read()),**request_data))

    except Exception as error:
        raise TranscriptionError("Groq could not transcribe this answer.") from error

    transcript = (transcription.text.strip())

    if not transcript:
        raise TranscriptionError("No speech was detected in the recording.")

    return transcript