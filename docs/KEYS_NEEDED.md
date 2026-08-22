# Dayflow — Keys & Env Vars Needed (Give These Later)

> Backend is already running on `postgresql+asyncpg://postgres.axhiwzngefjkerrmimyk:***@aws-0-ap-south-1.pooler.supabase.com:5432/postgres` (pooler).
> Everything below is **already wired** — paste values into `backend/.env` and `frontend/.env` and restart.

## 1) Supabase (Project `axhiwzngefjkerrmimyk`)
Get from **Supabase Dashboard → Project Settings → API** + **Database**:

- `SUPABASE_URL` — e.g. `https://axhiwzngefjkerrmimyk.supabase.co` (inferred, confirm)
- `SUPABASE_ANON_KEY` — `anon` public key (for frontend `VITE_SUPABASE_ANON_KEY` + storage public URLs)
- `SUPABASE_SERVICE_KEY` — `service_role` secret (backend `supabase-py` → buckets `company-logos`, `avatars`, `employee-documents`, `leave-docs` — otherwise local `uploads/` fallback is used)
- `DATABASE_URL` — **already provided** (pooler 5432). Keep `postgresql+asyncpg://...` prefix in `backend/.env`. For Supavisor `session` vs `transaction` pooler, use `5432` (we use).

Create **Storage buckets** in Supabase → Storage (or they auto-fallback local):
`company-logos` (public), `avatars` (public), `employee-documents` (private), `leave-docs` (private)

## 2) SMTP — Brevo (you gave these, but login fails 535 — please regenerate)
Current `backend/.env` has:
- `SMTP_HOST=smtp-relay.brevo.com`
- `SMTP_PORT=465`
- `SMTP_USER=a2301b001@smtp-brevo.com`
- `SMTP_PASSWORD=<REDACTED>` ← **Auth failed 535** on 465/587 — please go Brevo → Transactional → SMTP → Regenerate key and re-share
- `SMTP_FROM_EMAIL=noreply@Dayflow.susindran.in` (domain must be authenticated in Brevo → Senders & Domains → verify SPF/DKIM or use a verified Brevo sender)
- `SMTP_USE_TLS=false`
- `SMTP_USE_SSL=true`

## 3) JWT / Backend Core (already in `backend/.env`, change for prod)
- `SECRET_KEY` — 32+ random chars (currently `dev-secret-change-...-prod-32`)
- `ALGORITHM=HS256`
- `ACCESS_TOKEN_EXPIRE_MINUTES=60`
- `REFRESH_TOKEN_EXPIRE_DAYS=7`
- `CORS_ORIGINS=http://localhost:5173,http://localhost:3000,https://Dayflow.susindran.in`

Optional:
- `REQUIRE_EMAIL_VERIFICATION=true|false` — if `true`, `POST /auth/login` returns 403 until verified (currently soft banner only)

## 4) Frontend `frontend/.env`
- `VITE_API_URL=http://localhost:8000/api/v1` (local) or `https://api.Dayflow.susindran.in/api/v1` (prod)
- `VITE_SUPABASE_URL` — same as `SUPABASE_URL` (for `lib/supabase.ts` direct public URL helpers)
- `VITE_SUPABASE_ANON_KEY` — same as `SUPABASE_ANON_KEY`
- Optional for verification link: `VITE_APP_URL=https://Dayflow.susindran.in` (used in `verify_url`)

## 5) How to Give Later
Paste either:
- The 3 Supabase keys + regenerated Brevo `SMTP_PASSWORD` (and confirm `SMTP_USER`/`HOST`), or
- A fresh `.env` file content, or
- Brevo API key if you prefer API over SMTP (we support `sib-api-v3-sdk` alternative)

> I'm continuing on other tasks (verification gate, weekly ISO, per-employee dot batch, Company Settings, printable PDF slip, Resume full) while you gather keys — no block.
