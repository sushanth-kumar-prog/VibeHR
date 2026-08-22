import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../stores/auth'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { api } from '../api/client'

export default function Signup(){
  const [form,setForm]=useState({companyName:'', adminFirstName:'', adminLastName:'', email:'', phone:'', password:'', confirm:''})
  const [logo,setLogo]=useState<File|null>(null)
  const [err,setErr]=useState('')
  const [loading,setLoading]=useState(false)
  const { signupCompany } = useAuth()
  const nav = useNavigate()
  const update=(k:string,v:string)=> setForm(s=>({...s,[k]:v}))
  const submit=async(e:React.FormEvent)=>{
    e.preventDefault(); setErr('')
    if(form.password!==form.confirm) return setErr('Passwords do not match')
    if(form.password.length<8) return setErr('Password must be 8+ chars with uppercase, lowercase, number, special')
    setLoading(true)
    try{
      await signupCompany({companyName: form.companyName, adminFirstName: form.adminFirstName, adminLastName: form.adminLastName, email: form.email, phone: form.phone, password: form.password})
      if(logo){
        const fd = new FormData()
        fd.append('file', logo)
        try{ await api.post('/companies/logo', fd, {headers: {'Content-Type':'multipart/form-data'}})} catch(e){ console.warn('logo upload failed', e)}
      }
      nav('/dashboard')
    }catch(ex:any){ setErr(ex.response?.data?.detail || 'Signup failed')}
    finally{ setLoading(false)}
  }
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <Link to="/" className="mb-6 flex items-center gap-2 text-sm text-zinc-400 hover:text-white"><span className="h-7 w-7 rounded-lg bg-[#a855f7] flex items-center justify-center text-xs font-bold text-white">VH</span> VibeHR <span className="text-zinc-600">•</span> Back to home</Link>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Sign Up — Create Company</CardTitle>
          <p className="text-center text-xs text-zinc-500">Company creation → First Admin OS0001 (per wireframe). Employees invited by Admin, not self-register.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-3">
            <Input placeholder="Company Name" value={form.companyName} onChange={e=>update('companyName',e.target.value)} required/>
            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="First Name" value={form.adminFirstName} onChange={e=>update('adminFirstName',e.target.value)} required/>
              <Input placeholder="Last Name" value={form.adminLastName} onChange={e=>update('adminLastName',e.target.value)} required/>
            </div>
            <Input placeholder="Work Email" type="email" value={form.email} onChange={e=>update('email',e.target.value)} required/>
            <Input placeholder="Phone" value={form.phone} onChange={e=>update('phone',e.target.value)} />
            <div>
              <label className="text-xs text-zinc-500">Upload Logo (optional, wireframe)</label>
              <input type="file" accept="image/*" onChange={e=>setLogo(e.target.files?.[0]||null)} className="mt-1 block w-full text-sm text-zinc-400 file:mr-2 file:rounded file:border-0 file:bg-[#a855f7] file:px-3 file:py-1 file:text-white"/>
              {logo && <div className="text-xs text-zinc-500 mt-1">Selected: {logo.name}</div>}
            </div>
            <Input placeholder="Password (8+ chars, U/l, number, special)" type="password" value={form.password} onChange={e=>update('password',e.target.value)} required/>
            <Input placeholder="Confirm Password" type="password" value={form.confirm} onChange={e=>update('confirm',e.target.value)} required/>
            <div className="text-xs text-zinc-500">Password rules: 8+ chars, uppercase, lowercase, number, special char. Email verification required — token sent after signup (mock via /auth/verify-token).</div>
            {err && <div className="text-sm text-red-400">{err}</div>}
            <Button type="submit" disabled={loading} className="w-full">{loading?'Creating...':'Create Company & Sign In'}</Button>
            <div className="text-center text-sm text-zinc-500">Already have an account? <Link to="/login" className="text-[#a855f7]">Sign In</Link></div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
