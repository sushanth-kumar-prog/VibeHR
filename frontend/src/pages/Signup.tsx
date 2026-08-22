import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../stores/auth'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { api } from '../api/client'
import {
  ArrowRight, ArrowLeft, Upload, Building2, User, Lock, Check, ShieldCheck, Globe, Users, Sparkles, Eye, EyeOff, Image as ImageIcon, X, Info
} from 'lucide-react'

type Form = {
  companyName: string
  industry: string
  companySize: string
  website: string
  logo: File | null
  logoPreview: string | null
  firstName: string
  lastName: string
  email: string
  phone: string
  jobTitle: string
  department: string
  address: string
  password: string
  confirm: string
  agree: boolean
}

const industries = ['Technology','Finance','Healthcare','Education','Manufacturing','Retail','Consulting','Hospitality','Construction','Other']
const sizes = ['1-5','6-20','21-50','51-200','201-500','500+']

export default function Signup(){
  const [step,setStep]=useState(0)
  const [form,setForm]=useState<Form>({
    companyName:'', industry:'', companySize:'', website:'', logo:null, logoPreview:null,
    firstName:'', lastName:'', email:'', phone:'', jobTitle:'Administrator', department:'Administration', address:'',
    password:'', confirm:'', agree:false
  })
  const [showPw,setShowPw]=useState(false)
  const [err,setErr]=useState('')
  const [loading,setLoading]=useState(false)
  const { signupCompany } = useAuth()
  const nav = useNavigate()
  const update=(k:string,v:any)=> setForm(s=>({...s,[k]:v}))

  const passwordChecks = useMemo(()=>{
    const p=form.password
    return {
      len: p.length>=8,
      upper: /[A-Z]/.test(p),
      lower: /[a-z]/.test(p),
      num: /[0-9]/.test(p),
      special: /[^A-Za-z0-9]/.test(p),
    }
  },[form.password])
  const pwScore = Object.values(passwordChecks).filter(Boolean).length
  const canStep0 = form.companyName.trim().length>=2
  const canStep1 = form.firstName.trim() && form.lastName.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
  const canStep2 = pwScore===5 && form.password===form.confirm && form.agree

  const handleLogo = (f: File | null)=>{
    if(!f){ update('logo',null); update('logoPreview',null); return }
    update('logo',f)
    const url = URL.createObjectURL(f)
    update('logoPreview',url)
  }

  const next = ()=>{
    setErr('')
    if(step===0 && !canStep0) return setErr('Company name is required (min 2 characters).')
    if(step===1 && !canStep1) return setErr('Please provide first name, last name and a valid work email.')
    setStep(s=> Math.min(s+1,2))
  }
  const back = ()=> { setErr(''); setStep(s=> Math.max(s-1,0)) }

  const submit=async(e:React.FormEvent)=>{
    e.preventDefault(); setErr('')
    if(!canStep0) { setStep(0); return setErr('Complete company details.') }
    if(!canStep1) { setStep(1); return setErr('Complete administrator profile.') }
    if(!canStep2) return setErr('Fix password requirements, confirm it, and accept Terms.')
    setLoading(true)
    try{
      await signupCompany({
        companyName: form.companyName.trim(),
        adminFirstName: form.firstName.trim(),
        adminLastName: form.lastName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        password: form.password,
        industry: form.industry || undefined,
        companySize: form.companySize || undefined,
        website: form.website.trim() || undefined,
        jobTitle: form.jobTitle || undefined,
        department: form.department || undefined,
        address: form.address.trim() || undefined,
        agreeTerms: form.agree
      })
      if(form.logo){
        const fd = new FormData()
        fd.append('file', form.logo)
        try{ await api.post('/companies/logo', fd, {headers: {'Content-Type':'multipart/form-data'}})} catch(e){ console.warn('logo upload failed', e)}
      }
      nav('/dashboard')
    }catch(ex:any){ setErr(ex.response?.data?.detail || 'Signup failed — try a different email or company name.')}
    finally{ setLoading(false)}
  }

  const steps = [
    {title:'Company', desc:'Workspace identity', icon:Building2},
    {title:'Administrator', desc:'First admin OS0001', icon: User},
    {title:'Security', desc:'Password & finish', icon: Lock},
  ]

  return (
    <div className="min-h-screen flex bg-white dark:bg-zinc-950">
      {/* Left — brand + stepper */}
      <div className="hidden lg:flex w-[46%] relative overflow-hidden bg-[#714B67] text-white flex-col">
        <div className="absolute inset-0 bg-gradient-to-br from-[#714B67] via-[#7a5771] to-[#8a6582]" />
        <div className="absolute inset-0 opacity-[0.08]" style={{backgroundImage:`linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)`, backgroundSize:'48px 48px'}} />
        <div className="absolute -top-32 -right-32 h-[520px] w-[520px] rounded-full bg-white/10 blur-[80px]" />
        <div className="relative z-10 flex flex-col h-full p-10 xl:p-12">
          <Link to="/" className="flex items-center gap-3">
            <span className="h-9 w-9 rounded-xl bg-white flex items-center justify-center text-sm font-bold text-[#714B67]">DF</span>
            <span className="font-bold text-xl tracking-tight">Dayflow</span>
            <span className="ml-1 text-[10px] tracking-[0.16em] border border-white/30 rounded-full px-2 py-0.5 opacity-80">HRMS</span>
          </Link>

          <div className="mt-10 max-w-[480px]">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 border border-white/20 px-3 py-1.5 text-xs backdrop-blur">
              <Sparkles className="h-3 w-3" /> New workspace in 60 seconds
            </div>
            <h1 className="mt-4 text-[36px] font-bold tracking-tight leading-[0.95]">Create your<br/>company workspace</h1>
            <p className="mt-3 text-sm leading-relaxed text-white/80">You become Admin <span className="font-mono bg-white/15 px-1.5 py-0.5 rounded text-white">OS0001</span>. Employees are invited — not self-register.</p>
          </div>

          {/* Stepper */}
          <div className="mt-8 space-y-4">
            {steps.map((s,i)=>{
              const active = i===step
              const done = i < step
              return (
                <div key={s.title} className={`flex gap-4 rounded-xl border p-4 transition ${active ? 'bg-white text-zinc-900 border-white shadow-lg' : done ? 'bg-white/10 border-white/20 text-white' : 'bg-white/[0.06] border-white/15 text-white/80'}`}>
                  <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 border ${active ? 'bg-[#714B67] text-white border-[#714B67]' : done ? 'bg-green-500 text-white border-green-500' : 'bg-white/10 border-white/20'}`}>
                    {done ? <Check className="h-5 w-5" /> : <s.icon className="h-5 w-5" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold tracking-widest opacity-60">STEP 0{i+1}</span>
                      {done && <span className="text-[11px] bg-green-500 text-white px-1.5 py-0.5 rounded-full">done</span>}
                      {active && <span className="text-[11px] bg-[#714B67] text-white px-1.5 py-0.5 rounded-full">current</span>}
                    </div>
                    <div className={`text-sm font-semibold ${active ? 'text-zinc-900' : ''}`}>{s.title}</div>
                    <div className={`text-xs ${active ? 'text-zinc-600' : 'text-white/70'}`}>{s.desc}</div>
                  </div>
                  <div className={`hidden xl:flex items-center text-xs ${active ? 'text-zinc-400' : 'text-white/40'}`}>0{i+1} / 03</div>
                </div>
              )
            })}
          </div>

          {/* preview card */}
          <div className="mt-auto pt-8">
            <div className="rounded-2xl bg-white p-4 shadow-[0_20px_60px_rgba(0,0,0,0.25)] text-zinc-900">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center overflow-hidden">
                  {form.logoPreview ? <img src={form.logoPreview} alt="logo" className="h-full w-full object-cover" /> : <Building2 className="h-5 w-5 text-zinc-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate">{form.companyName || 'Your Company'}</div>
                  <div className="text-xs text-zinc-500 truncate">{form.industry || 'Industry'} • {form.companySize || 'Size'} {form.website && `• ${form.website}`}</div>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-[#714B67] text-white">OS0001</span>
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-zinc-600"><Globe className="h-3.5 w-3.5" /> {form.email || 'admin@company.com'} <span className="text-zinc-300">•</span> {form.firstName || 'Admin'} {form.lastName}</div>
            </div>
            <div className="mt-4 text-xs text-white/60 flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5" /> Multi-tenant isolation • JWT • Storage: company-logos / avatars / docs</div>
          </div>
        </div>
      </div>

      {/* Right — form panels */}
      <div className="flex-1 flex flex-col bg-zinc-50 dark:bg-zinc-950">
        <div className="lg:hidden h-14 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 font-bold"><span className="h-7 w-7 rounded-lg bg-[#714B67] flex items-center justify-center text-xs font-bold text-white">DF</span> Dayflow</Link>
          <Link to="/login" className="text-sm text-[#714B67] font-medium">Sign In</Link>
        </div>

        <div className="flex-1 flex items-start lg:items-center justify-center p-3 sm:p-6 lg:p-8 overflow-auto">
          <div className="w-full max-w-[560px]">
            {/* mobile progress */}
            <div className="lg:hidden mb-4">
              <div className="flex items-center gap-2">
                {steps.map((_,i)=>(
                  <div key={i} className={`h-1.5 flex-1 rounded-full ${i<=step ? 'bg-[#714B67]' : 'bg-zinc-200 dark:bg-zinc-800'}`} />
                ))}
              </div>
              <div className="mt-2 text-xs text-zinc-500">Step {step+1} of 3 — {steps[step].title}</div>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
              {/* header */}
              <div className="px-6 sm:px-8 pt-6 sm:pt-8 pb-4 border-b border-zinc-100 dark:border-zinc-800">
                <div className="hidden lg:flex items-center gap-2 text-xs">
                  {steps.map((s,i)=>(
                    <div key={s.title} className="flex items-center gap-2">
                      <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold border ${i===step ? 'bg-[#714B67] text-white border-[#714B67]' : i<step ? 'bg-green-500 text-white border-green-500' : 'bg-white dark:bg-zinc-900 text-zinc-400 border-zinc-200 dark:border-zinc-700'}`}>{i<step ? <Check className="h-3.5 w-3.5" /> : i+1}</span>
                      <span className={`text-sm ${i===step ? 'font-semibold text-zinc-900 dark:text-white' : 'text-zinc-500'}`}>{s.title}</span>
                      {i<2 && <span className="mx-1 text-zinc-300">—</span>}
                    </div>
                  ))}
                </div>
                <h2 className="mt-3 text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                  {step===0 && 'Tell us about your company'}
                  {step===1 && 'Who is the administrator?'}
                  {step===2 && 'Secure your workspace'}
                </h2>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {step===0 && 'This creates your isolated workspace. You will be OS0001.'}
                  {step===1 && 'First Admin — you can invite HR & employees after.'}
                  {step===2 && 'Set a strong password. Logo can be changed later in Settings.'}
                </p>
              </div>

              <form onSubmit={submit} className="px-6 sm:px-8 py-6 space-y-5">
                {/* STEP 0 */}
                {step===0 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Company Name <span className="text-red-500">*</span></label>
                      <Input placeholder="Olive Systems Pvt. Ltd." value={form.companyName} onChange={e=>update('companyName',e.target.value)} className="h-11" required />
                      <p className="text-xs text-zinc-500">Slug auto-generated: <span className="font-mono bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">{form.companyName ? form.companyName.toLowerCase().replace(/[^a-z0-9]+/g,'-').slice(0,24) || '—' : '—'}</span> • ID prefix: <span className="font-mono">{form.companyName ? form.companyName.split(' ').map(w=>w[0]).join('').slice(0,3).toUpperCase() : 'OS'}0001</span></p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Industry</label>
                        <select value={form.industry} onChange={e=>update('industry',e.target.value)} className="flex h-11 w-full rounded-md border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/50 px-3 text-sm">
                          <option value="">Select industry</option>
                          {industries.map(i=> <option key={i} value={i}>{i}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Company Size</label>
                        <select value={form.companySize} onChange={e=>update('companySize',e.target.value)} className="flex h-11 w-full rounded-md border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/50 px-3 text-sm">
                          <option value="">Select size</option>
                          {sizes.map(s=> <option key={s} value={s}>{s} employees</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Website (optional)</label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                        <Input placeholder="https://example.com" value={form.website} onChange={e=>update('website',e.target.value)} className="h-11 pl-9" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2"><ImageIcon className="h-4 w-4" /> Company Logo <span className="text-xs font-normal text-zinc-500">(optional — wireframe)</span></label>
                      <div className={`rounded-xl border-2 border-dashed p-4 flex flex-col sm:flex-row items-center gap-4 ${form.logoPreview ? 'border-[#714B67]/30 bg-[#714B67]/5' : 'border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/30'}`}>
                        <div className="h-16 w-16 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center overflow-hidden shrink-0">
                          {form.logoPreview ? <img src={form.logoPreview} alt="preview" className="h-full w-full object-cover" /> : <Building2 className="h-7 w-7 text-zinc-400" />}
                        </div>
                        <div className="flex-1 text-center sm:text-left">
                          <div className="text-sm font-medium">{form.logo ? form.logo.name : 'Upload logo'}</div>
                          <div className="text-xs text-zinc-500">PNG, JPG up to 5MB. Stored in Supabase bucket <span className="font-mono">company-logos</span> or local fallback.</div>
                          <div className="mt-2 flex gap-2 justify-center sm:justify-start">
                            <label className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full bg-[#714B67] text-white text-xs font-medium cursor-pointer">
                              <Upload className="h-3.5 w-3.5" /> {form.logo ? 'Change' : 'Choose file'}
                              <input type="file" accept="image/*" className="hidden" onChange={e=>handleLogo(e.target.files?.[0]||null)} />
                            </label>
                            {form.logo && <button type="button" onClick={()=>handleLogo(null)} className="h-8 px-3 rounded-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs flex items-center gap-1"><X className="h-3.5 w-3.5" /> Remove</button>}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 p-3 flex gap-2 text-xs text-amber-800 dark:text-amber-200">
                      <Info className="h-4 w-4 shrink-0 mt-0.5" />
                      <span>You will be <span className="font-semibold">OS0001</span> — first Admin. Company slug is unique; if taken we append -1, -2.</span>
                    </div>
                  </div>
                )}

                {/* STEP 1 */}
                {step===1 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">First Name <span className="text-red-500">*</span></label>
                        <Input placeholder="Aarav" value={form.firstName} onChange={e=>update('firstName',e.target.value)} className="h-11" required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Last Name <span className="text-red-500">*</span></label>
                        <Input placeholder="Sharma" value={form.lastName} onChange={e=>update('lastName',e.target.value)} className="h-11" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Work Email <span className="text-red-500">*</span></label>
                      <Input placeholder="admin@olivesys.com" type="email" value={form.email} onChange={e=>update('email',e.target.value)} className="h-11" required />
                      <p className="text-xs text-zinc-500">Verification email sent after creation (Brevo SMTP). In dev use <span className="font-mono">GET /auth/verify-token/{'{id}'}</span>.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Phone</label>
                        <Input placeholder="+91 98765 43210" value={form.phone} onChange={e=>update('phone',e.target.value)} className="h-11" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Job Title</label>
                        <Input value={form.jobTitle} onChange={e=>update('jobTitle',e.target.value)} className="h-11" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Department</label>
                        <Input placeholder="Administration" value={form.department} onChange={e=>update('department',e.target.value)} className="h-11" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Address (optional)</label>
                        <Input placeholder="Bengaluru, Karnataka" value={form.address} onChange={e=>update('address',e.target.value)} className="h-11" />
                      </div>
                    </div>
                    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 p-3 flex gap-3">
                      <div className="h-9 w-9 rounded-full bg-[#714B67] text-white flex items-center justify-center font-bold text-sm shrink-0">{(form.firstName[0]||'A')}{(form.lastName[0]||'A')}</div>
                      <div className="text-sm">
                        <div className="font-medium">{form.firstName||'First'} {form.lastName||'Last'} • <span className="font-mono text-xs bg-zinc-200 dark:bg-zinc-700 px-1.5 py-0.5 rounded">OS0001</span></div>
                        <div className="text-xs text-zinc-500">{form.email||'email@company.com'} • {form.phone||'phone'}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2 */}
                {step===2 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Password <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <Input type={showPw ? 'text':'password'} placeholder="8+ chars, upper/lower/number/special" value={form.password} onChange={e=>update('password',e.target.value)} className="h-11 pr-10" required />
                        <button type="button" onClick={()=>setShowPw(v=>!v)} className="absolute right-2.5 top-1/2 -translate-y-1/2 h-7 w-7 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center text-zinc-500">{showPw ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}</button>
                      </div>
                      {/* strength */}
                      <div className="flex gap-1">
                        {[0,1,2,3,4].map(i=> <div key={i} className={`h-1.5 flex-1 rounded-full ${i < pwScore ? (pwScore===5 ? 'bg-green-500' : pwScore>=3 ? 'bg-amber-500' : 'bg-red-500') : 'bg-zinc-200 dark:bg-zinc-700'}`} />)}
                      </div>
                      <ul className="grid grid-cols-2 gap-1 text-xs">
                        {[
                          ['len','8+ characters'],
                          ['upper','Uppercase (A-Z)'],
                          ['lower','Lowercase (a-z)'],
                          ['num','Number (0-9)'],
                          ['special','Special char'],
                        ].map(([k,label])=>(
                          <li key={k} className={`flex items-center gap-1 ${ (passwordChecks as any)[k] ? 'text-green-600' : 'text-zinc-500'}`}>
                            <Check className={`h-3 w-3 ${ (passwordChecks as any)[k] ? 'opacity-100' : 'opacity-30'}`} /> {label}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Confirm Password <span className="text-red-500">*</span></label>
                      <Input type={showPw ? 'text':'password'} value={form.confirm} onChange={e=>update('confirm',e.target.value)} className="h-11" required />
                      {form.confirm && form.password!==form.confirm && <p className="text-xs text-red-600">Passwords do not match</p>}
                      {form.confirm && form.password===form.confirm && form.password && <p className="text-xs text-green-600 flex items-center gap-1"><Check className="h-3 w-3" /> Passwords match</p>}
                    </div>

                    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 space-y-3 bg-zinc-50 dark:bg-zinc-800/30">
                      <div className="text-sm font-semibold flex items-center gap-2"><Users className="h-4 w-4 text-[#714B67]" /> Review — what you’re creating</div>
                      <div className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400 space-y-1">
                        <div><span className="font-medium text-zinc-900 dark:text-white">Company:</span> {form.companyName || '—'} {form.industry && `• ${form.industry}`} {form.companySize && `• ${form.companySize}`}</div>
                        <div><span className="font-medium text-zinc-900 dark:text-white">Admin:</span> {form.firstName} {form.lastName} • {form.email} • {form.phone || 'no phone'} • OS0001</div>
                        <div><span className="font-medium text-zinc-900 dark:text-white">Workspace:</span> Isolated by company_id, JWT auth, storage buckets ready.</div>
                      </div>
                    </div>

                    <label className="flex gap-3 p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 cursor-pointer">
                      <input type="checkbox" checked={form.agree} onChange={e=>update('agree',e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-zinc-300 text-[#714B67] focus:ring-[#714B67]" />
                      <span className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">I agree to the <a href="#" className="underline text-[#714B67]">Terms</a> and <a href="#" className="underline text-[#714B67]">Privacy Policy</a>, and confirm this company and admin email are owned by me. I understand Employee ID <span className="font-mono font-medium">OS0001</span> is auto-assigned.</span>
                    </label>
                  </div>
                )}

                {err && <div className="text-sm text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 p-3 rounded-xl">{err}</div>}

                <div className="flex gap-3 pt-2">
                  {step>0 && <Button type="button" variant="outline" onClick={back} className="h-11 px-6 rounded-xl"><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>}
                  {step<2 ? (
                    <Button type="button" onClick={next} className="flex-1 h-11 rounded-xl text-[15px]">Continue <ArrowRight className="ml-2 h-4 w-4" /></Button>
                  ) : (
                    <Button type="submit" disabled={loading || !canStep2} className="flex-1 h-11 rounded-xl text-[15px]">{loading?'Creating workspace...':'Create Company & Sign In'} <ArrowRight className="ml-2 h-4 w-4" /></Button>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-zinc-500 pt-2 border-t border-zinc-100 dark:border-zinc-800 mt-2">
                  <span>Step {step+1} of 3</span>
                  <span className="flex items-center gap-1">{step===0 && !canStep0 && 'Company name required'} {step===1 && !canStep1 && 'Admin details incomplete'} {step===2 && !canStep2 && 'Complete password & terms'} {((step===0&&canStep0)||(step===1&&canStep1)||(step===2&&canStep2)) && <span className="text-green-600 flex items-center gap-1"><Check className="h-3 w-3" /> Ready</span>}</span>
                </div>
              </form>

              <div className="px-6 sm:px-8 pb-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
                Already have an account? <Link to="/login" className="text-[#714B67] font-semibold hover:underline">Sign In</Link>
                <span className="mx-2 text-zinc-300">•</span>
                <Link to="/" className="hover:underline">Back to home</Link>
              </div>
            </div>
            <div className="mt-3 text-center text-xs text-zinc-500">© 2026 Dayflow • Free for up to 5 employees • No credit card</div>
          </div>
        </div>
      </div>
    </div>
  )
}
