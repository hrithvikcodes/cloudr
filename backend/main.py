
from fastapi import FastAPI, Request
from app.core import db
from contextlib import asynccontextmanager
import time 
import logging
from fastapi.middleware.cors import CORSMiddleware
from app.routers import song, liked, user, recent

@asynccontextmanager

async def lifespan(app: FastAPI):
    yield
    await db.engine.dispose()

app = FastAPI(lifespan=lifespan)
logger = logging.getLogger("timing")
logging.basicConfig(level=logging.INFO)
@app.middleware("http")
async def add_timing_header(request: Request, call_next):
    start = time.perf_counter()
    response = await call_next(request)
    duration = time.perf_counter() - start
    logger.info(f"{request.method} {request.url.path} took {duration:.3f}s")
    response.headers["X-Process-Time"] = f"{duration:.3f}"
    return response

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://172.19.255.104:5173", "https://cloudr.pages.dev"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



app.include_router(song.router)

app.include_router(user.router)
app.include_router(liked.router)
app.include_router(recent.router)
@app.get("/health")
async def health_check():
    return {"status": "OK"}