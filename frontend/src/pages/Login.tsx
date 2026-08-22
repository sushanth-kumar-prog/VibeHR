import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../stores/auth'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import {
  Eye, EyeOff, ArrowRight, ShieldCheck, Clock, Users, Lock, CheckCircle2, Building2, Sparkles
} from 'lucide-react'

export default function Login(){
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [showPw,setShowPw]=useState(false)
  const [err,setErr]=useState('')
  const [loading,setLoading]=useState(false)
  const { login } = useAuth()
  const nav = useNavigate()
  const submit = async(e:React.FormEvent)=>{
    e.preventDefault(); setErr(''); setLoading(true)
    try{ await login(email,password); nav('/dashboard') } catch(ex:any){ setErr(ex.response?.data?.detail || 'Invalid credentials — check Login ID/Email and Password')}
    finally{ setLoading(false)}
  }
  return (
    <div className="h-screen overflow-hidden flex bg-white dark:bg-zinc-950">
      {/* Left — Branding / Visual (split) */}
      <div className="hidden lg:flex w-[52%] relative overflow-hidden bg-[#714B67] text-white flex-col">
        <div className="absolute inset-0 bg-gradient-to-br from-[#714B67] via-[#7a5771] to-[#8a6582]" />
        <div className="absolute inset-0 opacity-[0.08]" style={{backgroundImage:`linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)`, backgroundSize:'48px 48px'}} />
        <div className="absolute -top-32 -right-32 h-[520px] w-[520px] rounded-full bg-white/10 blur-[80px]" />
        <div className="absolute -bottom-40 -left-40 h-[600px] w-[600px] rounded-full bg-black/20 blur-[90px]" />

        <div className="relative z-10 flex flex-col h-full p-10 xl:p-12">
          {/* top brand */}
          <Link to="/" className="flex items-center gap-3">
            <span className="h-9 w-9 rounded-xl bg-white flex items-center justify-center text-sm font-bold text-[#714B67] shadow">DF</span>
            <span className="font-bold text-xl tracking-tight">Dayflow</span>
            <span className="ml-1 text-[10px] tracking-[0.16em] border border-white/30 rounded-full px-2 py-0.5 opacity-80">HRMS</span>
          </Link>

          <div className="flex-1 flex flex-col justify-center max-w-[520px] mx-auto w-full py-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 border border-white/20 px-3 py-1.5 text-xs backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-green-300 animate-pulse" />
              Trusted by 2,400+ teams worldwide
              <Sparkles className="h-3 w-3 opacity-70" />
            </div>
            <h1 className="mt-6 text-[38px] xl:text-[44px] font-bold tracking-tight leading-[0.95]">
              Every workday,<br />
              <span className="text-white/90">perfectly aligned.</span>
            </h1>
            <p className="mt-4 text-[15px] leading-relaxed text-white/80">
              Sign in to your workspace. Manage attendance, leaves and payroll — securely isolated by company.
            </p>

            {/* feature bullets */}
            <div className="mt-8 grid grid-cols-2 gap-3">
              {[
                {icon: Clock, title:'Smart Attendance', desc:'Geo + IP, auto hours'},
                {icon: Users, title:'Employee Grid', desc:'3×3 directory & profiles'},
                {icon: ShieldCheck, title:'Role Access', desc:'Admin / HR / Employee'},
                {icon: Lock, title:'Secure & Isolated', desc:'Company_id scoped'},
              ].map(f=>(
                <div key={f.title} className="rounded-xl bg-white/10 border border-white/15 backdrop-blur p-3 flex gap-3">
                  <div className="h-8 w-8 rounded-lg bg-white text-[#714B67] flex items-center justify-center shrink-0"><f.icon className="h-4 w-4" /></div>
                  <div><div className="text-sm font-medium leading-none">{f.title}</div><div className="text-xs text-white/70 mt-1">{f.desc}</div></div>
                </div>
              ))}
            </div>

            {/* mock card */}
            <div className="mt-8 rounded-2xl bg-white p-4 shadow-[0_20px_60px_rgba(0,0,0,0.25)] text-zinc-900">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-medium text-zinc-700"><Building2 className="h-4 w-4 text-[#714B67]" /> Olive Systems Pvt. Ltd.</div>
                <span className="text-[11px] px-2 py-1 rounded-full bg-green-50 border border-green-200 text-green-700 flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-green-500" />Live</span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl bg-zinc-50 border border-zinc-200 p-2.5"><div className="text-lg font-bold">24</div><div className="text-[11px] text-zinc-500">Employees</div></div>
                <div className="rounded-xl bg-green-50 border border-green-200 p-2.5"><div className="text-lg font-bold text-green-600">21</div><div className="text-[11px] text-zinc-500">Present</div></div>
                <div className="rounded-xl bg-amber-50 border border-amber-200 p-2.5"><div className="text-lg font-bold text-amber-600">2</div><div className="text-[11px] text-zinc-500">Half-day</div></div>
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-zinc-500"><CheckCircle2 className="h-3.5 w-3.5 text-green-600" /> Payroll computed • 24 payslips ready</div>
            </div>
          </div>

          <div className="text-xs text-white/60 flex items-center justify-between">
            <span>© 2026 Dayflow Technologies</span>
            <span className="flex items-center gap-1.5">SOC2-ready • AES-256 • 99.9% uptime</span>
          </div>
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex flex-col bg-zinc-50 dark:bg-zinc-950">
        {/* mobile header */}
        <div className="lg:hidden h-14 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 font-bold"><span className="h-7 w-7 rounded-lg bg-[#714B67] flex items-center justify-center text-xs font-bold text-white">DF</span> Dayflow</Link>
          <Link to="/signup" className="text-sm text-[#714B67] font-medium">Create Company</Link>
        </div>

        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-[440px]">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-6 sm:p-8">
              <div className="space-y-1.5">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Welcome back</h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Sign in with your Employee ID or work email.</p>
              </div>

              <form onSubmit={submit} className="mt-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Login ID / Email</label>
                  <Input value={email} onChange={e=>setEmail(e.target.value)} placeholder="OS0001 or email@company.com" required autoComplete="username" className="h-11" />
                  <p className="text-xs text-zinc-500">Use auto-generated ID (e.g., OS0001) or your registered email.</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Password</label>
                    <button type="button" className="text-xs text-[#714B67] hover:underline" onClick={()=> alert('Please contact your Admin to reset password via invite flow.')}>Forgot?</button>
                  </div>
                  <div className="relative">
                    <Input type={showPw ? 'text' : 'password'} value={password} onChange={e=>setPassword(e.target.value)} required autoComplete="current-password" className="h-11 pr-10" placeholder="••••••••" />
                    <button type="button" onClick={()=>setShowPw(v=>!v)} className="absolute right-2.5 top-1/2 -translate-y-1/2 h-7 w-7 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center text-zinc-500">
                      {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {err && <div className="text-sm text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 p-3 rounded-xl">{err}</div>}

                <Button type="submit" disabled={loading} className="w-full h-11 text-[15px] rounded-xl">
                  {loading ? 'Signing in...' : <><span>Sign In</span> <ArrowRight className="ml-2 h-4 w-4" /></>}
                </Button>

                <div className="relative py-1">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-200 dark:border-zinc-800" /></div>
                  <div className="relative flex justify-center"><span className="bg-white dark:bg-zinc-900 px-2 text-xs text-zinc-500">New to Dayflow?</span></div>
                </div>

                <div className="text-center text-sm text-zinc-600 dark:text-zinc-400">No company yet? <Link to="/signup" className="text-[#714B67] font-semibold hover:underline">Create Company — Free</Link></div>

                <div className="rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 p-3 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                  <div className="font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5"><Lock className="h-3.5 w-3.5" /> Wireframe note</div>
                  <div className="mt-1">Employee ID auto-generated (e.g., <span className="font-mono font-medium">OS0001</span> — Olive System initials + seq). Employees are invited by Admin/HR — temp password auto-generated. Verification required. Check In/Out flips status dot.</div>
                </div>
              </form>
            </div>

            <div className="mt-4 text-center text-xs text-zinc-500 dark:text-zinc-500">
              By signing in you agree to our <a href="#" className="underline">Terms</a> and <a href="#" className="underline">Privacy</a>.
            </div>

            <div className="hidden lg:flex mt-6 items-center justify-center gap-2 text-xs text-zinc-400">
              <Link to="/" className="hover:text-zinc-600 dark:hover:text-zinc-300">← Back to home</Link>
              <span>•</span>
              <span>Need help? support@Dayflow.co</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
