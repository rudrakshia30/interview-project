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