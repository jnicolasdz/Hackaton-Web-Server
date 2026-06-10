import sys
from pathlib import Path
from fastapi import FastAPI


if __package__ is None or __package__ == "":
	sys.path.append(str(Path(__file__).resolve().parent.parent))

from app.api.routes import router
from app.core.cors import add_cors_middleware

app = FastAPI(title="Exercise Service")
add_cors_middleware(app)
app.include_router(router, prefix="/api/v1")

