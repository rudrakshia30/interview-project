from pathlib import Path
from tempfile import TemporaryDirectory
from fastapi import (APIRouter,File,Form,HTTPException,UploadFile)
from starlette.concurrency import (run_in_threadpool)
from app.services.media_services import (ALLOWED_VIDEO_EXTENSIONS,MediaProcessingError,extract_compressed_audio,save_uploaded_video)
from app.services.transcription_services import (TranscriptionError,transcribe_answer_audio)