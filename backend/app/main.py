from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings
from .db.session import engine, Base
from .routers import auth, users, attendance, leave, payroll
# import models to register
from .models import company, user, attendance as att_model, leave as leave_model, payroll as payroll_model

app = FastAPI(title="VibeHR API", version="1.0.0", description="HRMS - React FastAPI Supabase")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1")
app.include_router(users.router, prefix="/api/v1")
app.include_router(attendance.router, prefix="/api/v1")
app.include_router(leave.router, prefix="/api/v1")
app.include_router(payroll.router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "VibeHR API running", "docs": "/docs"}

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.on_event("startup")
async def on_startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

# For local dev: uvicorn app.main:app --reload
