# Dayflow — Human Resource Management System

**Stack: React (Vite + TS + Tailwind + shadcn) + FastAPI + Supabase (Postgres + Storage)**

> Every workday, perfectly aligned. Based on Dayflow spec + wireframes.

## Quick Start

### 1. Supabase — Create fresh project
- Create project at supabase.com, copy `URL`, `anon key`, `service_role key`, and `Database URL` (postgres connection string).
- Enable Storage buckets: `company-logos`, `avatars`, `employee-documents`, `leave-docs` (create via dashboard or SQL).
- Or use local: `npx supabase start`

### 2. Backend
```bash
cd backend
cp .env.example .env  # fill DATABASE_URL, SUPABASE_URL, SUPABASE_SERVICE_KEY, SECRET_KEY
pip install -r requirements.txt
uvicorn app.main:app --reload  # http://localhost:8000/docs
# migrations (auto-creates tables on startup; or alembic upgrade head)
```

### 3. Frontend
```bash
cd frontend
cp .env.example .env  # VITE_API_URL=http://localhost:8000/api/v1
npm install
npm run dev  # http://localhost:5173
```

### 4. Docker (alternative)
```bash
docker-compose up --build
```

## Features Implemented
- **Auth:** Company Sign-Up (first Admin OS0001) + Login via email/employee_id + JWT (FastAPI), invite flow with temp password + auto Employee ID (OS0001 format).
- **Multi-tenant:** All data scoped by company_id.
- **Dashboard:** Employee grid (3x3), status dots, search, invite (admin/hr).
- **Profile:** Resume / Private Info / Salary Info (Salary visible only to admin/hr). Employees edit phone/address only.
- **Attendance (Advanced):** Check-In/Out with geolocation + IP, working hours calc, status (present/absent/half_day/leave, <4h absent, 4-6 half-day), list view with filters. Attendance as basis for payroll.
- **Leave:** Request (paid/sick/unpaid) with calendar view for employees, queue with Approve/Reject for admin/hr, balances.
- **Payroll Full Engine:** Components (earning/deduction, fixed/% of wage/basic), compute API, breakdown, warnings if earnings exceed wage, per-user salary structure. Seed defaults included.
- **Reports & Analytics:** Interactive reports module for comprehensive tracking of workforce metrics (attendance, leaves, payroll).
- **Document Management:** Centralized handling of employee documents, resumes, and HR files.
- **Notifications Engine:** System notifications and alerts for organizational events and leave request updates.
- **User Customization:** Avatar uploads and personalized user profiles seamlessly integrated with Supabase storage.

## API Docs
- FastAPI Swagger: http://localhost:8000/docs
- Health: http://localhost:8000/health

## Env Vars
See `backend/.env.example` and `frontend/.env.example`.

## Project Structure
```
backend/app/{core,db,models,routers,services}
frontend/src/{api,components,stores,pages}
supabase/migrations
```

## Default Salary Components (seed)
Basic 40% of wage, HRA 20%, Conveyance fixed, Special Allowance, PF 12% of basic, Professional Tax 200.

## Employee ID
Generated as `<Initials><seq>` e.g., Olive System + 1 → OS0001. Uniqueness per company.

---
Built as Dayflow — plan committed features incrementally.
