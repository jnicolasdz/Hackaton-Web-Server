import sys
from pathlib import Path
from fastapi import FastAPI
import uvicorn


if __package__ is None or __package__ == "":
	sys.path.append(str(Path(__file__).resolve().parent.parent))

from app.api.routes import router

app = FastAPI(title="Exercise Service")
app.include_router(router, prefix="/api/v1")
