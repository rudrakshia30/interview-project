from pathlib import Path
from tempfile import TemporaryDirectory
from fastapi import (APIRouter,File,Form,HTTPException,UploadFile)
from starlette.concurrency import (run_in_threadpool)
from app.services.media_services import (ALLOWED_VIDEO_EXTENSIONS,MediaProcessingError,extract_compressed_audio,save_uploaded_video)
from app.services.transcript_services import (TranscriptionError,transcribe_answer_audio)

router = APIRouter(prefix="/api/video",tags=["Video answers"])

@router.post("/process-answer")
async def process_answer_video(
    video: UploadFile = File(...),
    question: str = Form(...),
    question_index: int = Form(...)
):

    original_filename = (video.filename or "answer.webm")

    video_extension = (Path(original_filename).suffix.lower())

    if (video_extension not in ALLOWED_VIDEO_EXTENSIONS):
        raise HTTPException(status_code=400,
            detail=(
                "Unsupported video format. "
                "Use WebM, MP4, MOV, M4V, "
                "MKV, MPEG, or MPG."
            )
        )

    try:
        
        with TemporaryDirectory(prefix="interview-answer-") as temporary_directory:
            temporary_path = Path(temporary_directory)
            video_path = (temporary_path/(f"answer-{question_index}{video_extension}"))

            audio_path = (temporary_path/(f"answer-{question_index}.mp3"))

            video_size_bytes = (await save_uploaded_video(video,video_path))

            await run_in_threadpool(extract_compressed_audio,video_path,audio_path)

            audio_size_bytes = (audio_path.stat().st_size)

            transcript = (await run_in_threadpool(transcribe_answer_audio,audio_path,question))

            return {
                "question_index":question_index,
                "transcript":transcript,
                "video_size_bytes":video_size_bytes,
                "audio_size_bytes":audio_size_bytes,
                "audio_format":"mp3",
                "audio_sample_rate":16000,
                "audio_bitrate":"32k"
            }

    except (
        MediaProcessingError,
        TranscriptionError
    ) as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        ) from error

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=(
                "The answer video "
                "could not be processed."
            )
        ) from error

    finally:
        await video.close()
        