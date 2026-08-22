import { Link } from 'react-router-dom'
import { useState } from 'react'
import {
  Clock, CalendarCheck, Wallet, Users, ShieldCheck, Bell,
  ArrowRight, Check, Sparkles, Building2, UserPlus, BarChart3,
  MapPin, Timer, FileText, Layers, TrendingUp, Lock, Globe, Zap, Menu, X, Play, ChevronRight, Star
} from 'lucide-react'
import { useAuth } from '../stores/auth'
import ThemeToggle from '../components/ThemeToggle'

const BRAND = '#714B67'

export default function Landing() {
  const { token } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white text-zinc-900 selection:bg-[#714B67]/15">
      {/* ---------- NAV - always white (landing white-only) ---------- */}
      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 h-[64px] flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-[#714B67] flex items-center justify-center font-bold text-sm text-white">DF</div>
              <span className="font-bold text-[18px] tracking-tight text-zinc-900">Dayflow</span>
              <span className="hidden sm:inline text-[10px] tracking-[0.14em] text-zinc-500 border border-zinc-200 rounded-full px-2 py-0.5 ml-1 bg-zinc-50">HRMS</span>
            </Link>
            <nav className="hidden lg:flex items-center gap-1 text-sm">
              <a href="#features" className="px-3 py-2 text-zinc-600 hover:text-zinc-900 transition">Features</a>
              <a href="#how-it-works" className="px-3 py-2 text-zinc-600 hover:text-zinc-900 transition">How it works</a>
              <a href="#roles" className="px-3 py-2 text-zinc-600 hover:text-zinc-900 transition">For Teams</a>
              <a href="#pricing" className="px-3 py-2 text-zinc-600 hover:text-zinc-900 transition">Pricing</a>
            </nav>
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <ThemeToggle />
            {token ? (
              <Link to="/dashboard">
                <button className="inline-flex items-center justify-center rounded-full h-8 px-5 text-sm font-medium bg-[#714B67] text-white hover:bg-[#5f4057] shadow">
                  Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-sm text-zinc-600 hover:text-zinc-900 px-3 py-2">Sign In</Link>
                <Link to="/signup">
                  <button className="inline-flex items-center justify-center rounded-full h-8 px-5 text-sm font-medium bg-[#714B67] text-white hover:bg-[#5f4057] shadow">
                    Create Company <ArrowRight className="ml-1.5 h-4 w-4" />
                  </button>
                </Link>
              </>
            )}
          </div>

          <button className="lg:hidden h-9 w-9 rounded-md border border-zinc-200 bg-white flex items-center justify-center text-zinc-700" onClick={() => setMobileOpen(v => !v)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {mobileOpen && (
          <div className="lg:hidden border-t border-zinc-200 bg-white px-4 py-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-600">Theme</span><ThemeToggle />
            </div>
            <a href="#features" onClick={() => setMobileOpen(false)} className="block py-2 text-sm text-zinc-700">Features</a>
            <a href="#how-it-works" onClick={() => setMobileOpen(false)} className="block py-2 text-sm text-zinc-700">How it works</a>
            <a href="#pricing" onClick={() => setMobileOpen(false)} className="block py-2 text-sm text-zinc-700">Pricing</a>
            <div className="pt-3 flex flex-col gap-2">
              {token ? <Link to="/dashboard" onClick={() => setMobileOpen(false)}><button className="w-full inline-flex items-center justify-center rounded-md h-10 px-4 font-medium bg-[#714B67] text-white">Go to Dashboard</button></Link>
                : <>
                  <Link to="/login" onClick={() => setMobileOpen(false)}><button className="w-full inline-flex items-center justify-center rounded-md h-10 px-4 font-medium border border-zinc-200 bg-white">Sign In</button></Link>
                  <Link to="/signup" onClick={() => setMobileOpen(false)}><button className="w-full inline-flex items-center justify-center rounded-md h-10 px-4 font-medium bg-[#714B67] text-white">Create Company</button></Link>
                </>}
            </div>
          </div>
        )}
      </header>

      {/* ---------- HERO ---------- */}
      <section className="relative overflow-hidden bg-white">
        {/* soft glows - light */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[700px] w-[900px] rounded-full bg-[#714B67]/[0.07] blur-[100px]" />
          <div className="absolute top-32 -right-40 h-[500px] w-[500px] rounded-full bg-[#8a6b82]/[0.08] blur-[80px]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)] bg-[size:64px_64px] opacity-[0.18]" />
        </div>

        <div className="relative mx-auto max-w-[1280px] px-4 sm:px-6 pt-12 sm:pt-20 pb-12">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-8 items-center">
            {/* left */}
            <div className="space-y-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white shadow-sm px-3 py-1.5 text-xs">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-zinc-700 font-medium">Now live — Payroll Engine v2 + Attendance Geolocation</span>
                <ChevronRight className="h-3 w-3 text-zinc-400" />
              </div>

              <div className="space-y-4">
                <h1 className="text-[34px] sm:text-[48px] lg:text-[56px] font-bold tracking-tight leading-[0.95] text-zinc-900">
                  Every workday,<br />
                  <span className="bg-gradient-to-r from-[#714B67] via-[#9d6f94] to-[#714B67] bg-clip-text text-transparent">perfectly aligned.</span>
                </h1>
                <p className="text-[15px] sm:text-[17px] leading-relaxed text-zinc-600 max-w-[560px]">
                  Dayflow is the modern HRMS for growing teams. Manage employees, attendance, leave and payroll — multi-tenant, secure, and beautifully simple.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link to="/signup">
                  <button className="inline-flex items-center justify-center rounded-full px-7 h-11 text-[15px] font-medium bg-[#714B67] text-white hover:bg-[#5f4057] shadow-[0_4px_24px_rgba(113,75,103,0.25)]">
                    Start Free — Create Company <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                </Link>
                <Link to="/login">
                  <button className="inline-flex items-center justify-center rounded-full px-7 h-11 font-medium border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-900">
                    <Play className="mr-2 h-4 w-4" /> See Live Demo
                  </button>
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500">
                <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-green-600" /> No credit card</span>
                <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-green-600" /> Setup in 60 seconds</span>
                <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-green-600" /> Free for up to 5 employees</span>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <div className="flex -space-x-2">
                  <img src="https://i.pravatar.cc/80?img=12" alt="avatar" className="h-7 w-7 rounded-full border-2 border-white shadow-sm" />
                  <img src="https://i.pravatar.cc/80?img=32" alt="avatar" className="h-7 w-7 rounded-full border-2 border-white shadow-sm" />
                  <img src="https://i.pravatar.cc/80?img=15" alt="avatar" className="h-7 w-7 rounded-full border-2 border-white shadow-sm" />
                  <div className="h-7 w-7 rounded-full bg-[#714B67] border-2 border-white flex items-center justify-center text-[10px] font-bold text-white shadow-sm">+2k</div>
                </div>
                <div className="text-xs">
                  <div className="flex items-center gap-0.5 text-amber-500"><Star className="h-3 w-3 fill-amber-500" /><Star className="h-3 w-3 fill-amber-500" /><Star className="h-3 w-3 fill-amber-500" /><Star className="h-3 w-3 fill-amber-500" /><Star className="h-3 w-3 fill-amber-500" /><span className="ml-1 text-zinc-700 font-medium">4.9/5</span></div>
                  <div className="text-zinc-500">Trusted by 2,400+ teams worldwide</div>
                </div>
              </div>
            </div>

            {/* right mock - light */}
            <div className="relative lg:pl-6">
              <div className="relative rounded-[20px] border border-zinc-200 bg-white p-2 sm:p-3 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
                {/* window bar */}
                <div className="flex items-center justify-between px-3 py-2">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                  </div>
                  <div className="hidden sm:flex items-center gap-1 text-[11px] text-zinc-500">
                    <span className="h-6 px-2 rounded-full bg-zinc-100 border border-zinc-200 flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-green-500" /> Attendance: present</span>
                    <span className="hidden md:inline">Dayflow.app/dashboard</span>
                  </div>
                  <div className="h-6 w-6 rounded-full bg-[#714B67] flex items-center justify-center text-xs font-bold text-white">OS</div>
                </div>

                {/* stats row */}
                <div className="grid grid-cols-4 gap-2 sm:gap-3 px-1 sm:px-2">
                  <div className="rounded-xl bg-zinc-50 border border-zinc-200 p-3 text-center">
                    <div className="text-lg font-bold text-zinc-900">24</div><div className="text-[11px] text-zinc-500">Employees</div>
                  </div>
                  <div className="rounded-xl bg-white border border-zinc-200 p-3 text-center shadow-sm">
                    <div className="text-lg font-bold text-green-600">21</div><div className="text-[11px] text-zinc-500">Present</div>
                  </div>
                  <div className="rounded-xl bg-white border border-zinc-200 p-3 text-center shadow-sm">
                    <div className="text-lg font-bold text-amber-600">2</div><div className="text-[11px] text-zinc-500">Half-day</div>
                  </div>
                  <div className="rounded-xl bg-white border border-zinc-200 p-3 text-center shadow-sm">
                    <div className="text-lg font-bold text-red-600">1</div><div className="text-[11px] text-zinc-500">Absent</div>
                  </div>
                </div>

                {/* employee grid */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-3 px-1 sm:px-2 pb-2">
                  {[
                    { n: 'Aarav Sharma', id: 'OS0002', role: 'Engineering', color: 'bg-green-500', img: 'https://i.pravatar.cc/100?img=11' },
                    { n: 'Priya Nair', id: 'OS0003', role: 'Design', color: 'bg-green-500', img: 'https://i.pravatar.cc/100?img=5' },
                    { n: 'Kenji Tanaka', id: 'OS0004', role: 'HR', color: 'bg-amber-500', img: 'https://i.pravatar.cc/100?img=8' },
                    { n: 'Sofia Lee', id: 'OS0005', role: 'Sales', color: 'bg-red-500', img: 'https://i.pravatar.cc/100?img=9' },
                  ].map(e => (
                    <div key={e.id} className="rounded-xl border border-zinc-200 bg-white p-3 flex gap-3 relative overflow-hidden hover:border-zinc-300 transition shadow-sm">
                      <span className={`absolute top-2.5 right-2.5 h-2.5 w-2.5 rounded-full ${e.color} ring-2 ring-white`} />
                      <img src={e.img} alt={e.n} className="h-10 w-10 rounded-full object-cover shrink-0" />
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate text-zinc-900">{e.n}</div>
                        <div className="text-[11px] text-zinc-500">{e.id} • {e.role}</div>
                        <div className="text-[11px] text-zinc-400 truncate">{e.n.toLowerCase().replace(' ', '.')}@Dayflow.co</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* bottom bar */}
                <div className="mx-1 sm:mx-2 mt-1 rounded-xl bg-gradient-to-r from-[#714B67] to-[#8a6582] p-3 flex items-center justify-between text-white">
                  <div>
                    <div className="text-sm font-semibold flex items-center gap-2"><Wallet className="h-4 w-4" /> Payroll ready</div>
                    <div className="text-xs opacity-90">March computed • 24 payslips • Tap to view</div>
                  </div>
                  <ChevronRight className="h-5 w-5 opacity-80" />
                </div>
              </div>

              {/* floating cards - light */}
              <div className="hidden sm:flex absolute -left-6 bottom-10 rounded-xl border border-zinc-200 bg-white p-3 shadow-[0_12px_32px_rgba(0,0,0,0.08)] items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-green-50 border border-green-200 flex items-center justify-center"><Clock className="h-5 w-5 text-green-600" /></div>
                <div>
                  <div className="text-xs font-medium text-zinc-900">Checked in — 09:12 AM</div>
                  <div className="text-[11px] text-zinc-500 flex items-center gap-1"><MapPin className="h-3 w-3" /> Bengaluru • IP verified</div>
                </div>
              </div>
              <div className="hidden sm:flex absolute -right-4 -top-2 rounded-xl border border-zinc-200 bg-white p-3 shadow-[0_12px_32px_rgba(0,0,0,0.08)] items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-[#714B67] flex items-center justify-center text-white"><CalendarCheck className="h-4 w-4" /></div>
                <div>
                  <div className="text-xs font-medium text-zinc-900">Leave approved ✓</div>
                  <div className="text-[11px] text-zinc-500">Paid • 12 → 14 Mar</div>
                </div>
              </div>
            </div>
          </div>

          {/* trust strip - light */}
          <div className="mt-12 sm:mt-16 border-y border-zinc-200 bg-zinc-50/80 backdrop-blur -mx-4 sm:-mx-6 px-4 sm:px-6 py-4">
            <div className="mx-auto max-w-[1280px] flex flex-wrap items-center justify-between gap-4 text-xs text-zinc-500">
              <span className="uppercase tracking-[0.14em] font-semibold">Trusted infrastructure</span>
              <div className="flex flex-wrap items-center gap-6">
                <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-zinc-500" /> SOC2-ready</span>
                <span className="flex items-center gap-2"><Lock className="h-4 w-4 text-zinc-500" /> AES-256 Encrypted</span>
                <span className="flex items-center gap-2"><Globe className="h-4 w-4 text-zinc-500" /> Multi-tenant isolation</span>
                <span className="flex items-center gap-2"><Zap className="h-4 w-4 text-zinc-500" /> 99.9% uptime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- FEATURES ---------- */}
      <section id="features" className="mx-auto max-w-[1280px] px-4 sm:px-6 py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-2xl text-center space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#714B67]/10 border border-[#714B67]/15 px-3 py-1 text-xs text-[#714B67] font-medium"><Sparkles className="h-3.5 w-3.5" /> Everything HR needs</div>
          <h2 className="text-[28px] sm:text-4xl font-bold tracking-tight text-zinc-900">One platform for every HR workflow</h2>
          <p className="text-sm sm:text-[15px] text-zinc-600">From Day-1 onboarding to payroll day — Dayflow keeps your data consistent, your compliance clean, and your people happy.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mt-10">
          {[
            {
              icon: Timer, title: 'Smart Attendance', desc: 'Check-in/out with geolocation + IP, auto working-hours and status (present / half-day / absent / leave). <4h → absent, 4-6h → half-day.',
              points: ['Geolocation + IP capture', 'Working hours calc', 'Attendance → payroll basis']
            },
            {
              icon: CalendarCheck, title: 'Leave Management', desc: 'Calendar view for employees, approval queue for managers. Paid / Sick / Unpaid with live balances and notifications.',
              points: ['Paid / Sick / Unpaid', 'Manager Approve / Reject', 'Balances & history']
            },
            {
              icon: Wallet, title: 'Payroll Engine', desc: 'Components = earning/deduction, fixed / % of wage/basic. Breakdown, warnings if earnings exceed wage, per-user salary structure.',
              points: ['Basic 40% • HRA 20% • PF 12%', 'Per-user salary structure', 'Compute API + breakdown']
            },
            {
              icon: Users, title: 'Employee Directory', desc: 'Beautiful 3×3 grid, status dots, search, department filters. Click any card for full profile.',
              points: ['Grid + searchable', 'Status dot (live today)', 'Profile: Resume / Private / Salary']
            },
            {
              icon: ShieldCheck, title: 'Role-based Access', desc: 'Admin / HR / Employee roles. Salary visible only to admin/hr. Employees edit only phone/address. All data scoped by company_id.',
              points: ['Company-scoped multi-tenant', 'OS0001 auto-ID per company', 'Granular permissions']
            },
            {
              icon: Bell, title: 'Invites & Alerts', desc: 'Admin invites with auto Employee ID + temp password. Email verification + in-app notifications for invites, leaves, payroll.',
              points: ['Temp password + verify', 'Notifications + Email', 'Invite via Admin/HR']
            },
          ].map(f => (
            <div key={f.title} className="rounded-xl border border-zinc-200 bg-white p-5 sm:p-6 hover:border-zinc-300 hover:shadow-sm transition group">
              <div className="h-10 w-10 rounded-xl bg-[#714B67]/10 border border-[#714B67]/10 flex items-center justify-center group-hover:bg-[#714B67]/15 transition"><f.icon className="h-5 w-5 text-[#714B67]" /></div>
              <h3 className="mt-4 font-semibold text-zinc-900">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">{f.desc}</p>
              <ul className="mt-4 space-y-1.5">
                {f.points.map(p => <li key={p} className="flex items-center gap-2 text-xs text-zinc-600"><Check className="h-3.5 w-3.5 text-green-600" /> {p}</li>)}
              </ul>
            </div>
          ))}
        </div>

        {/* secondary highlight - light */}
        <div className="grid lg:grid-cols-3 gap-4 mt-6">
          <div className="rounded-xl border border-zinc-200 bg-gradient-to-br from-zinc-50 to-white p-6 lg:col-span-2">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-[#714B67] flex items-center justify-center shrink-0"><Layers className="h-5 w-5 text-white" /></div>
              <div>
                <h3 className="font-semibold text-zinc-900">Built for multi-company scale</h3>
                <p className="text-sm text-zinc-600 mt-1">Every row scoped by <code className="bg-zinc-100 border border-zinc-200 px-1.5 py-0.5 rounded text-xs">company_id</code>. Create a company → you become Admin <span className="text-zinc-900 font-medium">OS0001</span> (Olive System initials + sequence). Invite flow prevents self-registration sprawl.</p>
                <div className="flex flex-wrap gap-2 mt-3 text-xs">
                  <span className="px-2.5 py-1 rounded-full bg-white border border-zinc-200 shadow-sm">Supabase Postgres</span>
                  <span className="px-2.5 py-1 rounded-full bg-white border border-zinc-200 shadow-sm">Storage: avatars / docs / logos</span>
                  <span className="px-2.5 py-1 rounded-full bg-white border border-zinc-200 shadow-sm">FastAPI + JWT</span>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-6 flex flex-col justify-between shadow-sm">
            <div>
              <TrendingUp className="h-6 w-6 text-[#714B67]" />
              <h3 className="font-semibold mt-3 text-zinc-900">Reports that matter</h3>
              <p className="text-sm text-zinc-600 mt-1">Attendance analytics, leave trends, payroll summaries — filtered by date, department, and employee.</p>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-zinc-500"><BarChart3 className="h-4 w-4" /> Daily • Weekly • Monthly</div>
          </div>
        </div>
      </section>

      {/* ---------- HOW IT WORKS ---------- */}
      <section id="how-it-works" className="border-y border-zinc-200 bg-zinc-50">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 py-16 sm:py-20">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs text-zinc-600 shadow-sm">How it works • 3 steps</div>
              <h2 className="mt-3 text-[28px] sm:text-4xl font-bold tracking-tight text-zinc-900">From zero to payroll in minutes</h2>
            </div>
            <p className="text-sm text-zinc-600 max-w-md">No spreadsheets. No manual IDs. Dayflow automates the busywork so you can focus on people.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-10 relative">
            <div className="hidden md:block absolute top-[34px] left-[14%] right-[14%] h-[2px] bg-gradient-to-r from-[#714B67]/0 via-[#714B67]/20 to-[#714B67]/0" />
            {[
              { step: '01', icon: Building2, title: 'Create Company', desc: 'Sign up with company name + admin details. You auto-become Admin OS0001. Upload logo, set password (8+ chars, upper/lower/number/special).' },
              { step: '02', icon: UserPlus, title: 'Invite Employees', desc: 'Admin/HR invite by email. System generates Employee ID (Initials + sequence) and temp password. Email verification required — mock via /verify-token.' },
              { step: '03', icon: FileText, title: 'Track & Pay', desc: 'Employees check-in/out daily. Managers approve leaves. Run Payroll Compute — get breakdown per user, warnings if earnings exceed wage.' },
            ].map(s => (
              <div key={s.step} className="relative">
                <div className="mx-auto md:mx-0 h-10 w-10 rounded-full bg-[#714B67] flex items-center justify-center text-sm font-bold shadow-md shadow-[#714B67]/15 relative z-10 text-white"><s.icon className="h-5 w-5" /></div>
                <div className="mt-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
                  <div className="text-xs tracking-widest text-[#714B67] font-semibold">STEP {s.step}</div>
                  <h3 className="mt-1 font-semibold text-zinc-900">{s.title}</h3>
                  <p className="mt-2 text-sm text-zinc-600 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- ROLES ---------- */}
      <section id="roles" className="mx-auto max-w-[1280px] px-4 sm:px-6 py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-[28px] sm:text-4xl font-bold tracking-tight text-zinc-900">Designed for every role</h2>
          <p className="mt-3 text-sm text-zinc-600">Admins get control. HR gets speed. Employees get clarity.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-5 mt-10">
          {[
            { role: 'Admin', badge: 'OS0001', icon: ShieldCheck, color: 'from-[#714B67] to-[#8a6582]', items: ['Full directory + invite HR/Employee', 'Company settings & logo', 'Attendance batch view & payroll compute', 'Approve leaves & edit salary structures'] },
            { role: 'HR Manager', badge: 'HR', icon: Users, color: 'from-[#5b7fa6] to-[#7aa0c4]', items: ['Invite employees & manage profiles', 'Queue: Approve/Reject leaves', 'Configure payroll components', 'Attendance filters & reports'] },
            { role: 'Employee', badge: 'Self', icon: Sparkles, color: 'from-[#d98a5c] to-[#e8a87c]', items: ['My Profile — Resume / Private / Salary (read-only salary)', 'Check-in/out + today status', 'Calendar: apply Paid/Sick/Unpaid', 'My Payslip — read-only breakdown'] },
          ].map(r => (
            <div key={r.role} className="rounded-xl border border-zinc-200 bg-white p-6 flex flex-col shadow-sm hover:shadow-md transition">
              <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${r.color} flex items-center justify-center`}><r.icon className="h-5 w-5 text-white" /></div>
              <div className="mt-4 flex items-center gap-2"><h3 className="font-semibold text-zinc-900">{r.role}</h3><span className="text-[10px] px-2 py-0.5 rounded-full border border-zinc-200 bg-zinc-50 text-zinc-600">{r.badge}</span></div>
              <ul className="mt-4 space-y-2 flex-1">
                {r.items.map(i => <li key={i} className="flex gap-2 text-sm text-zinc-600"><Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" /> {i}</li>)}
              </ul>
              <Link to="/signup" className="mt-6 text-sm text-[#714B67] flex items-center gap-1 hover:gap-2 transition-all font-medium">Get started <ArrowRight className="h-4 w-4" /></Link>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- PRICING ---------- */}
      <section id="pricing" className="border-y border-zinc-200 bg-zinc-50">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 py-16 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-[28px] sm:text-4xl font-bold tracking-tight text-zinc-900">Simple pricing, scale as you grow</h2>
            <p className="mt-3 text-sm text-zinc-600">Start free. Upgrade when your team does. All plans include multi-tenant isolation and JWT auth.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5 mt-10 max-w-5xl mx-auto">
            {[
              { name: 'Starter', price: 'Free', sub: 'Up to 5 employees', cta: 'Create Free Company', featured: false, features: ['Employee directory (grid)', 'Attendance + IP/geo', 'Leave (3 types)', 'Payroll components + compute', 'Email verification'] },
              { name: 'Growth', price: '₹199', sub: 'per employee / month', cta: 'Start Growth', featured: true, features: ['Everything in Starter', 'Advanced reports & exports', 'Storage: 100GB (docs/avatars)', 'Priority email support', 'Custom payroll components'] },
              { name: 'Enterprise', price: 'Custom', sub: 'Unlimited employees', cta: 'Contact Sales', featured: false, features: ['Everything in Growth', 'SSO + audit logs', 'Dedicated infra & SLA', 'On-prem Supabase option', 'White-label logo & domain'] },
            ].map(p => (
              <div key={p.name} className={`rounded-xl border bg-white p-6 flex flex-col relative shadow-sm ${p.featured ? 'border-[#714B67]/30 bg-gradient-to-b from-[#714B67]/[0.06] to-white shadow-[0_12px_32px_rgba(113,75,103,0.12)]' : 'border-zinc-200'}`}>
                {p.featured && <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-semibold bg-[#714B67] text-white px-3 py-1 rounded-full">Most popular</div>}
                <h3 className="font-semibold text-zinc-900">{p.name}</h3>
                <div className="mt-2 flex items-baseline gap-1"><span className="text-3xl font-bold text-zinc-900">{p.price}</span>{p.price !== 'Free' && p.price !== 'Custom' && <span className="text-sm text-zinc-500">{p.sub}</span>}</div>
                { (p.price==='Free' || p.price==='Custom') && <div className="text-xs text-zinc-500">{p.sub}</div>}
                <ul className="mt-6 space-y-2 flex-1">
                  {p.features.map(f => <li key={f} className="flex gap-2 text-sm text-zinc-700"><Check className="h-4 w-4 text-green-600 shrink-0" /> {f}</li>)}
                </ul>
                <Link to="/signup" className="mt-6">
                  <button className={`w-full inline-flex items-center justify-center rounded-full h-10 px-4 font-medium ${p.featured ? 'bg-[#714B67] text-white hover:bg-[#5f4057] shadow' : 'border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-900'}`}>{p.cta}</button>
                </Link>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-zinc-500 mt-6">All prices in INR. GST extra. Cancel anytime. Seed salary components included: Basic 40%, HRA 20%, Conveyance, Special Allowance, PF 12% of basic, PT 200.</p>
        </div>
      </section>

      {/* ---------- TESTIMONIALS ---------- */}
      <section className="mx-auto max-w-[1280px] px-4 sm:px-6 py-16 bg-white">
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { q: 'Dayflow cut our payroll time from 3 days to 30 minutes. The breakdown warnings alone saved us lakhs.', a: 'Ananya R.', r: 'Head of People, Olive Systems' },
            { q: 'Attendance with geo + IP finally gave us trust. No more manual registers. Employees love the one-tap check-in.', a: 'Rahul M.', r: 'HR Manager, FinLoom' },
            { q: 'Cleanest HRMS I’ve used. Multi-tenant just works — we spun up a second company in seconds.', a: 'Sara K.', r: 'Founder, Dayflow Labs' },
          ].map(t => (
            <div key={t.a} className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="flex gap-1 text-amber-500"><Star className="h-4 w-4 fill-amber-500" /><Star className="h-4 w-4 fill-amber-500" /><Star className="h-4 w-4 fill-amber-500" /><Star className="h-4 w-4 fill-amber-500" /><Star className="h-4 w-4 fill-amber-500" /></div>
              <p className="mt-3 text-sm leading-relaxed text-zinc-700">“{t.q}”</p>
              <div className="mt-4 text-xs font-medium text-zinc-900">{t.a} <span className="text-zinc-500 font-normal">• {t.r}</span></div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- FINAL CTA ---------- */}
      <section className="mx-4 sm:mx-6 mb-16">
        <div className="mx-auto max-w-[1280px] rounded-[24px] border border-[#714B67]/15 bg-gradient-to-br from-[#714B67] via-[#7a5771] to-[#8a6582] p-[1px]">
          <div className="rounded-[23px] bg-gradient-to-br from-[#714B67] via-[#7d5a72] to-[#8a6582] px-6 sm:px-10 py-10 sm:py-14 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:48px_48px] opacity-30" />
            <div className="relative">
              <h2 className="text-2xl sm:text-4xl font-bold text-white">Ready to harmonize your workday?</h2>
              <p className="mt-3 text-sm sm:text-base text-white/85 max-w-2xl mx-auto">Create your company in 60 seconds. Invite your team. Watch attendance, leaves and payroll align — every workday.</p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link to="/signup"><button className="inline-flex items-center justify-center rounded-full bg-white text-[#714B67] hover:bg-zinc-100 px-8 h-11 font-medium">Create Company — Free <ArrowRight className="ml-2 h-4 w-4" /></button></Link>
                <Link to="/login"><button className="inline-flex items-center justify-center rounded-full bg-transparent border border-white/30 text-white hover:bg-white/10 px-8 h-11 font-medium">Sign In</button></Link>
              </div>
              <div className="mt-4 text-xs text-white/70">Free for up to 5 employees • No credit card • Cancel anytime</div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- FOOTER - light ---------- */}
      <footer className="border-t border-zinc-200 bg-zinc-50">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 py-10">
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2"><div className="h-7 w-7 rounded-lg bg-[#714B67] flex items-center justify-center text-xs font-bold text-white">DF</div><span className="font-bold text-zinc-900">Dayflow</span><span className="text-xs text-zinc-500">Every workday, perfectly aligned.</span></div>
              <p className="mt-3 text-sm text-zinc-600 max-w-sm">Modern HRMS — React (Vite + TS + Tailwind) + FastAPI + Supabase. Multi-tenant, role-based, payroll-ready. Based on Dayflow spec.</p>
              <div className="mt-4 text-xs text-zinc-500">© 2026 Dayflow Technologies Pvt. Ltd. All rights reserved.</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-zinc-900">Product</div>
              <ul className="mt-3 space-y-2 text-sm text-zinc-600">
                <li><a href="#features" className="hover:text-zinc-900">Features</a></li>
                <li><a href="#pricing" className="hover:text-zinc-900">Pricing</a></li>
                <li><a href="#how-it-works" className="hover:text-zinc-900">How it works</a></li>
                <li><Link to="/login" className="hover:text-zinc-900">Live Demo</Link></li>
              </ul>
            </div>
            <div>
              <div className="text-sm font-semibold text-zinc-900">Resources</div>
              <ul className="mt-3 space-y-2 text-sm text-zinc-600">
                <li><a href="#" className="hover:text-zinc-900">API Docs (/docs)</a></li>
                <li><a href="#" className="hover:text-zinc-900">Supabase Setup</a></li>
                <li><a href="#" className="hover:text-zinc-900">Health Check</a></li>
              </ul>
            </div>
            <div>
              <div className="text-sm font-semibold text-zinc-900">Company</div>
              <ul className="mt-3 space-y-2 text-sm text-zinc-600">
                <li><a href="#" className="hover:text-zinc-900">About</a></li>
                <li><a href="#" className="hover:text-zinc-900">Contact</a></li>
                <li><a href="#" className="hover:text-zinc-900">Privacy</a></li>
                <li><a href="#" className="hover:text-zinc-900">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500">
            <span>Made with care for HR teams everywhere.</span>
            <span className="flex items-center gap-2">Built with <span className="text-[#714B67]">♥</span> • React + FastAPI + Supabase</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
