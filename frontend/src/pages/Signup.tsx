import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../stores/auth'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { api } from '../api/client'
import {
  ArrowRight, ArrowLeft, Upload, Building2, Check, ShieldCheck, Globe, Users, Eye, EyeOff, Image as ImageIcon, X, Star, Quote
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
    {title:'Company', desc:'Your workspace'},
    {title:'Administrator', desc:'Your leadership profile'},
    {title:'Security', desc:'Protect access'},
  ]

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden flex flex-col lg:flex-row bg-white dark:bg-zinc-950">
      {/* Left — Executive Branding + Stepper */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden bg-[#3d1f36] text-white flex-col shrink-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#3d1f36] via-[#5a2e4d] to-[#714B67]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        <div className="absolute -top-24 -right-24 h-[560px] w-[560px] rounded-full bg-white/[0.06] blur-[90px]" />
        <div className="absolute -bottom-32 -left-32 h-[520px] w-[520px] rounded-full bg-[#8a6582]/20 blur-[80px]" />

        <div className="relative z-10 flex flex-col h-full px-10 xl:px-12 py-8">
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <img src="/logo.svg" alt="Dayflow logo" className="h-9 w-9 rounded-xl" />
            <span className="font-bold text-xl tracking-tight">Dayflow</span>
          </Link>

          <div className="mt-8 max-w-[440px]">
            <div className="text-[11px] tracking-[0.16em] font-semibold text-white/60">SETUP IN 60 SECONDS</div>
            <h1 className="mt-3 text-[30px] xl:text-[34px] font-bold tracking-tight leading-[0.95]">Create your<br/><span className="font-light italic text-white/80">company workspace</span></h1>
            <p className="mt-3 text-sm leading-relaxed text-white/70">A private, secure home for your entire workforce. You’ll be the owner — invite your team when you’re ready.</p>
          </div>

          <div className="mt-8 flex-1 min-h-0 relative">
            <div className="absolute left-[15px] top-[14px] bottom-[14px] w-px bg-white/15" />
            <div className="space-y-6 relative">
              {steps.map((s,i)=>{
                const active = i===step
                const done = i < step
                return (
                  <div key={s.title} className="flex gap-4">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 border-2 transition ${active ? 'bg-white text-[#4A2C40] border-white shadow-lg' : done ? 'bg-white text-[#4A2C40] border-white' : 'bg-transparent text-white/60 border-white/25'}`}>
                      {done ? <Check className="h-4 w-4" /> : <span className="text-xs font-bold">{i+1}</span>}
                    </div>
                    <div className="pt-0.5">
                      <div className={`text-sm font-semibold leading-none ${active ? 'text-white' : done ? 'text-white/80' : 'text-white/60'}`}>{s.title}</div>
                      <div className={`text-xs mt-1 ${active ? 'text-white/70' : 'text-white/45'}`}>{s.desc}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="mt-6 shrink-0 space-y-3">
            <div className="rounded-2xl bg-white p-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)] text-zinc-900">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center overflow-hidden shrink-0">
                  {form.logoPreview ? <img src={form.logoPreview} alt="logo" className="h-full w-full object-cover" /> : <Building2 className="h-5 w-5 text-zinc-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate leading-tight">{form.companyName || 'Your Company'}</div>
                  <div className="text-xs text-zinc-500 truncate">{form.industry || 'Industry'} • {form.companySize || 'Size'}</div>
                </div>
                {form.companyName && <span className="h-6 px-2 rounded-full bg-green-50 border border-green-200 text-green-700 text-[11px] font-medium flex items-center gap-1 shrink-0"><span className="h-1.5 w-1.5 rounded-full bg-green-500" />Ready</span>}
              </div>
              {(form.firstName || form.email) && (
                <div className="mt-3 flex items-center gap-2 text-xs text-zinc-600 border-t border-zinc-100 pt-3">
                  <div className="h-7 w-7 rounded-full bg-[#714B67] text-white flex items-center justify-center font-bold text-xs shrink-0">{(form.firstName[0]||'A')}{(form.lastName[0]||'A')}</div>
                  <span className="truncate font-medium">{form.firstName} {form.lastName}</span>
                  <span className="text-zinc-300">•</span>
                  <span className="truncate text-zinc-500">{form.email || 'admin@company.com'}</span>
                </div>
              )}
            </div>
            <div className="rounded-xl bg-white/10 border border-white/15 backdrop-blur p-3 flex gap-3">
              <Quote className="h-4 w-4 text-white/40 shrink-0 mt-0.5" />
              <div>
                <div className="flex gap-0.5 text-amber-300"><Star className="h-3 w-3 fill-amber-300" /><Star className="h-3 w-3 fill-amber-300" /><Star className="h-3 w-3 fill-amber-300" /><Star className="h-3 w-3 fill-amber-300" /><Star className="h-3 w-3 fill-amber-300" /></div>
                <p className="text-xs leading-relaxed text-white/80 mt-1">“We set up Dayflow in an afternoon. Our board finally has one source of truth.”</p>
                <div className="text-[11px] text-white/50 mt-1">— Director, FinLoom • 120 employees</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-white/50">
              <ShieldCheck className="h-3.5 w-3.5" /> Your data stays private and protected. Enterprise security from day one.
            </div>
          </div>
        </div>
      </div>

      {/* Right — 50% Side Panel Card - no outer space */}
        <div className="flex-1 lg:w-[48%] lg:shrink-0 flex flex-col bg-white dark:bg-zinc-900 lg:bg-white lg:dark:bg-zinc-900 lg:overflow-auto">
        <div className="lg:hidden h-12 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-between px-4 shrink-0">
          <Link to="/" className="flex items-center gap-2 font-bold text-sm"><img src="/logo.svg" alt="Dayflow logo" className="h-6 w-6 rounded-lg" /> Dayflow</Link>
          <Link to="/login" className="text-xs text-[#714B67] font-medium">Sign In</Link>
        </div>

        {/* Side Panel Card — flush, no outer gap/border */}
        <div className="flex flex-col flex-1 bg-white dark:bg-zinc-900 overflow-hidden">
          {/* header */}
          <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
            <div className="hidden lg:flex items-center gap-1.5 text-xs">
              {steps.map((s,i)=>(
                <div key={s.title} className="flex items-center gap-1.5">
                  <span className={`h-5 w-5 rounded-full flex items-center justify-center text-[11px] font-bold border ${i===step ? 'bg-[#714B67] text-white border-[#714B67]' : i<step ? 'bg-green-500 text-white border-green-500' : 'bg-white dark:bg-zinc-900 text-zinc-400 border-zinc-200 dark:border-zinc-700'}`}>{i<step ? <Check className="h-3 w-3" /> : i+1}</span>
                  <span className={`text-xs ${i===step ? 'font-semibold text-zinc-900 dark:text-white' : 'text-zinc-500'}`}>{s.title}</span>
                  {i<2 && <span className="mx-1 text-zinc-300">—</span>}
                </div>
              ))}
            </div>
            <div className="lg:hidden flex items-center gap-1.5 mb-2">
              {steps.map((_,i)=>(
                <div key={i} className={`h-1 flex-1 rounded-full ${i<=step ? 'bg-[#714B67]' : 'bg-zinc-200 dark:bg-zinc-800'}`} />
              ))}
            </div>
            <h2 className="text-[17px] font-bold tracking-tight text-zinc-900 dark:text-white leading-tight">
              {step===0 && 'Tell us about your company'}
              {step===1 && 'Who is the administrator?'}
              {step===2 && 'Secure your workspace'}
            </h2>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-tight">
              {step===0 && 'This creates your private workspace.'}
              {step===1 && 'The owner who will invite your team.'}
              {step===2 && 'Set a strong password — you can update it anytime.'}
            </p>
          </div>

          <form onSubmit={submit} className="px-6 py-4 space-y-4">
            {step===0 && (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium">Company Name <span className="text-red-500">*</span></label>
                  <Input placeholder="Olive Systems Pvt. Ltd." value={form.companyName} onChange={e=>update('companyName',e.target.value)} className="h-9 text-sm" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium">Industry</label>
                    <select value={form.industry} onChange={e=>update('industry',e.target.value)} className="flex h-9 w-full rounded-md border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/50 px-2.5 text-xs">
                      <option value="">Select industry</option>
                      {industries.map(i=> <option key={i} value={i}>{i}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium">Company Size</label>
                    <select value={form.companySize} onChange={e=>update('companySize',e.target.value)} className="flex h-9 w-full rounded-md border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/50 px-2.5 text-xs">
                      <option value="">Select size</option>
                      {sizes.map(s=> <option key={s} value={s}>{s} employees</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium">Website (optional)</label>
                  <div className="relative">
                    <Globe className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
                    <Input placeholder="https://example.com" value={form.website} onChange={e=>update('website',e.target.value)} className="h-9 pl-8 text-sm" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium flex items-center gap-1.5"><ImageIcon className="h-3.5 w-3.5" /> Company Logo <span className="text-[11px] font-normal text-zinc-500">(optional)</span></label>
                  <div className={`border border-dashed p-2.5 flex items-center gap-3 ${form.logoPreview ? 'border-[#714B67]/30 bg-[#714B67]/5' : 'border-zinc-200 dark:border-zinc-700'}`}>
                    <div className="h-12 w-12 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center overflow-hidden shrink-0">
                      {form.logoPreview ? <img src={form.logoPreview} alt="preview" className="h-full w-full object-cover" /> : <Building2 className="h-5 w-5 text-zinc-400" />}
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <div className="text-xs font-medium truncate">{form.logo ? form.logo.name : 'Upload logo'}</div>
                      <div className="text-[11px] text-zinc-500 leading-tight">PNG or JPG, up to 5MB</div>
                      <div className="mt-1.5 flex gap-1.5">
                        <label className="inline-flex items-center gap-1 h-7 px-2.5 bg-[#714B67] text-white text-[11px] font-medium cursor-pointer">
                          <Upload className="h-3 w-3" /> {form.logo ? 'Change' : 'Choose file'}
                          <input type="file" accept="image/*" className="hidden" onChange={e=>handleLogo(e.target.files?.[0]||null)} />
                        </label>
                        {form.logo && <button type="button" onClick={()=>handleLogo(null)} className="h-7 px-2.5 border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-[11px] flex items-center gap-1"><X className="h-3 w-3" /> Remove</button>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step===1 && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium">First Name <span className="text-red-500">*</span></label>
                    <Input placeholder="Aarav" value={form.firstName} onChange={e=>update('firstName',e.target.value)} className="h-9 text-sm" required />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium">Last Name <span className="text-red-500">*</span></label>
                    <Input placeholder="Sharma" value={form.lastName} onChange={e=>update('lastName',e.target.value)} className="h-9 text-sm" required />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium">Work Email <span className="text-red-500">*</span></label>
                  <Input placeholder="admin@olivesys.com" type="email" value={form.email} onChange={e=>update('email',e.target.value)} className="h-9 text-sm" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium">Phone</label>
                    <Input placeholder="+91 98765 43210" value={form.phone} onChange={e=>update('phone',e.target.value)} className="h-9 text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium">Job Title</label>
                    <Input value={form.jobTitle} onChange={e=>update('jobTitle',e.target.value)} className="h-9 text-sm" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium">Department</label>
                    <Input placeholder="Administration" value={form.department} onChange={e=>update('department',e.target.value)} className="h-9 text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium">Address (optional)</label>
                    <Input placeholder="Bengaluru, Karnataka" value={form.address} onChange={e=>update('address',e.target.value)} className="h-9 text-sm" />
                  </div>
                </div>
                <div className="border-t border-zinc-200 dark:border-zinc-800 pt-2.5 flex gap-2.5 items-center">
                  <div className="h-8 w-8 rounded-full bg-[#714B67] text-white flex items-center justify-center font-bold text-xs shrink-0">{(form.firstName[0]||'A')}{(form.lastName[0]||'A')}</div>
                  <div className="text-xs min-w-0">
                    <div className="font-medium truncate">{form.firstName||'First'} {form.lastName||'Last'}</div>
                    <div className="text-[11px] text-zinc-500 truncate">{form.email||'email@company.com'} • {form.phone||'phone'}</div>
                  </div>
                </div>
              </div>
            )}

            {step===2 && (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium">Password <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Input type={showPw ? 'text':'password'} placeholder="8+ chars, upper/lower/number/special" value={form.password} onChange={e=>update('password',e.target.value)} className="h-9 pr-9 text-sm" required />
                    <button type="button" onClick={()=>setShowPw(v=>!v)} className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center text-zinc-500">{showPw ? <EyeOff className="h-3.5 w-3.5"/> : <Eye className="h-3.5 w-3.5"/>}</button>
                  </div>
                  <div className="flex gap-1.5 pt-1">
                    {[0,1,2,3,4].map(i=> <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i < pwScore ? (pwScore===5 ? 'bg-green-500' : pwScore>=3 ? 'bg-amber-500' : 'bg-red-500') : 'bg-zinc-200 dark:bg-zinc-700'}`} />)}
                  </div>
                  <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px] pt-1">
                    {[
                      ['len','8+ chars'],
                      ['upper','Uppercase'],
                      ['lower','Lowercase'],
                      ['num','Number'],
                      ['special','Special'],
                    ].map(([k,label])=>(
                      <li key={k} className={`flex items-center gap-1.5 ${ (passwordChecks as any)[k] ? 'text-green-600' : 'text-zinc-500'}`}>
                        <Check className={`h-3 w-3 shrink-0 ${ (passwordChecks as any)[k] ? 'opacity-100' : 'opacity-30'}`} /> {label}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium">Confirm Password <span className="text-red-500">*</span></label>
                  <Input type={showPw ? 'text':'password'} value={form.confirm} onChange={e=>update('confirm',e.target.value)} className="h-9 text-sm" required />
                  {form.confirm && form.password!==form.confirm && <p className="text-[11px] text-red-600">Passwords do not match</p>}
                  {form.confirm && form.password===form.confirm && form.password && <p className="text-[11px] text-green-600 flex items-center gap-1"><Check className="h-3 w-3" /> Match</p>}
                </div>

                <div className="border-t border-zinc-200 dark:border-zinc-800 pt-2.5 space-y-1.5">
                  <div className="text-xs font-semibold flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-[#714B67]" /> Review</div>
                  <div className="text-[11px] leading-relaxed text-zinc-600 dark:text-zinc-400 space-y-0.5">
                    <div><span className="font-medium text-zinc-900 dark:text-white">Company:</span> {form.companyName || '—'} {form.industry && `• ${form.industry}`} {form.companySize && `• ${form.companySize}`}</div>
                    <div><span className="font-medium text-zinc-900 dark:text-white">Admin:</span> {form.firstName} {form.lastName} • {form.email}</div>
                  </div>
                </div>

                <label className="flex gap-2.5 py-2.5 border-t border-zinc-200 dark:border-zinc-700 cursor-pointer">
                  <input type="checkbox" checked={form.agree} onChange={e=>update('agree',e.target.checked)} className="mt-0.5 h-3.5 w-3.5 rounded border-zinc-300 text-[#714B67] focus:ring-[#714B67] shrink-0" />
                  <span className="text-[11px] leading-snug text-zinc-600 dark:text-zinc-400">I agree to <a href="#" className="underline text-[#714B67]">Terms</a> and <a href="#" className="underline text-[#714B67]">Privacy</a> and confirm I am authorized to create this workspace.</span>
                </label>
              </div>
            )}

            {err && <div className="text-xs text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 p-2.5 leading-tight">{err}</div>}

            <div className="flex gap-2 pt-1">
              {step>0 && <Button type="button" variant="outline" onClick={back} className="h-9 px-4 text-sm"><ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Back</Button>}
              {step<2 ? (
                <Button type="button" onClick={next} className="flex-1 h-9 text-sm">Continue <ArrowRight className="ml-1.5 h-3.5 w-3.5" /></Button>
              ) : (
                <Button type="submit" disabled={loading || !canStep2} className="flex-1 h-9 text-sm">{loading?'Creating...':'Create Company & Sign In'} <ArrowRight className="ml-1.5 h-3.5 w-3.5" /></Button>
              )}
            </div>

            <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <span>Step {step+1} of 3</span>
              <span className="flex items-center gap-1">{step===0 && !canStep0 && 'Company name required'} {step===1 && !canStep1 && 'Admin details incomplete'} {step===2 && !canStep2 && 'Complete password & terms'} {((step===0&&canStep0)||(step===1&&canStep1)||(step===2&&canStep2)) && <span className="text-green-600 flex items-center gap-1"><Check className="h-3 w-3" /> Ready</span>}</span>
            </div>
          </form>

          <div className="px-6 py-3 border-t border-zinc-100 dark:border-zinc-800 text-center text-xs text-zinc-600 dark:text-zinc-400 shrink-0">
            Already have an account? <Link to="/login" className="text-[#714B67] font-semibold hover:underline">Sign In</Link>
            <span className="mx-2 text-zinc-300">•</span>
            <Link to="/" className="hover:underline">Back to home</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
