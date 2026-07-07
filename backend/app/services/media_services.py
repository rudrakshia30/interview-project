import os
import shutil
import subprocess
from pathlib import Path
from fastapi import UploadFile

CHUNK_SIZE = 1024 * 1024
MAX_VIDEO_SIZE_BYTES = int(os.getenv("MAX_VIDEO_UPLOAD_MB","200")) * 1024 * 1024
ALLOWED_VIDEO_EXTENSIONS = {".webm",".mp4",".mov",".m4v",".mkv",".mpeg",".mpg"}