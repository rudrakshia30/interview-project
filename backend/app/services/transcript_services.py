import os
from pathlib import Path
from app.services.groq_services import (get_groq_client)

class TranscriptionError(Exception):
    """Raised when Groq cannot transcribe an interview answer."""
    