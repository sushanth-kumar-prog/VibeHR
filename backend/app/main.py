from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings
from .db.session import engine, Base
from .routers import auth, users, attendance, leave, payroll, documents, reports, companies, avatars, notifications
# import models to register
from .models import company, user, attendance as att_model, leave as leave_model, payroll as payroll_model, document as doc_model
from fastapi.staticfiles import StaticFiles
import os

app = FastAPI(title="Dayflow API", version="1.0.0", description="HRMS - React FastAPI Supabase")

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
app.include_router(documents.router, prefix="/api/v1")
app.include_router(reports.router, prefix="/api/v1")
app.include_router(companies.router, prefix="/api/v1")
app.include_router(avatars.router, prefix="/api/v1")
app.include_router(notifications.router, prefix="/api/v1")

# serve local uploads fallback (for dev when Supabase not configured)
if os.path.exists("uploads"):
    app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.get("/")
async def root():
    return {"message": "Dayflow API running", "docs": "/docs"}

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.on_event("startup")
async def on_startup():
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
    except Exception as e:
        print(f"[startup] DB auto-create skipped (configure DATABASE_URL): {e}")

# For local dev: uvicorn app.main:app --reload
