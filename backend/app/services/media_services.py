import os
import shutil
import subprocess
from pathlib import Path
from fastapi import UploadFile

CHUNK_SIZE = 1024 * 1024
MAX_VIDEO_SIZE_BYTES = int(os.getenv("MAX_VIDEO_UPLOAD_MB","200")) * 1024 * 1024
ALLOWED_VIDEO_EXTENSIONS = {".webm",".mp4",".mov",".m4v",".mkv",".mpeg",".mpg"}

class MediaProcessingError(Exception):
    '''Raised when an uploaded video cannot be processed.'''

async def save_uploaded_video(uploaded_video: UploadFile,destination: Path) -> int:
    total_size = 0
    with destination.open("wb") as output_file:
        while True:
            chunk = await uploaded_video.read(CHUNK_SIZE)
            if not chunk:
                break

            total_size += len(chunk)

            if total_size > MAX_VIDEO_SIZE_BYTES:
                maximum_size_mb = (MAX_VIDEO_SIZE_BYTES//(1024 * 1024))

                raise MediaProcessingError(f"The video is too large. Maximum allowed size is {maximum_size_mb} MB.")

            output_file.write(chunk)

    if total_size == 0:
        raise MediaProcessingError("The uploaded video is empty.")

    return total_size

def extract_compressed_audio(video_path: Path,audio_path: Path) -> None:
    
    ffmpeg_path = shutil.which("ffmpeg")

    if not ffmpeg_path:
        raise MediaProcessingError("FFmpeg was not found. Install FFmpeg and add it to PATH.")

    command = [ffmpeg_path,
               "-nostdin",
               "-hide_banner",
               "-loglevel",
               "error",
               "-y",
               "-i",
               str(video_path),
               "-map",
               "0:a:0",
               "-vn",
               "-ac",
               "1",
               "-ar",
               "16000",
               "-c:a",
               "libmp3lame",
               "-b:a",
               "32k",
               str(audio_path)
               ]

    result = subprocess.run(command,capture_output=True,text=True,check=False)

    if result.returncode != 0:
        ffmpeg_error = result.stderr.strip()

        raise MediaProcessingError(f"Audio could not be extracted from the video. FFmpeg error: {ffmpeg_error or 'Unknown error.'} ")

    if (not audio_path.exists() or audio_path.stat().st_size == 0 ):
    
        raise MediaProcessingError("FFmpeg did not create a valid audio file.")