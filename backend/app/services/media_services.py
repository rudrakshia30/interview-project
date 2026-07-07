import os
import shutil
import subprocess
from pathlib import Path
from fastapi import UploadFile

CHUNK_SIZE = 1024 * 1024