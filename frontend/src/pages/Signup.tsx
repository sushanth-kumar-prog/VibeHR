import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../stores/auth'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'

export default function Signup(){
  const [form,setForm]=useState({companyName:'', adminFirstName:'', adminLastName:'', email:'', phone:'', password:'', confirm:''})
  const [err,setErr]=useState('')
  const [loading,setLoading]=useState(false)
  const { signupCompany } = useAuth()
  const nav = useNavigate()
  const update=(k:string,v:string)=> setForm(s=>({...s,[k]:v}))
  const submit=async(e:React.FormEvent)=>{
    e.preventDefault(); setErr('')
    if(form.password!==form.confirm) return setErr('Passwords do not match')
    setLoading(true)
    try{
      await signupCompany({companyName: form.companyName, adminFirstName: form.adminFirstName, adminLastName: form.adminLastName, email: form.email, phone: form.phone, password: form.password})
      nav('/')
    }catch(ex:any){ setErr(ex.response?.data?.detail || 'Signup failed')}
    finally{ setLoading(false)}
  }
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Sign Up — Create Company</CardTitle>
          <p className="text-center text-xs text-zinc-500">First account becomes Admin / HR Officer</p>
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
            <Input placeholder="Password" type="password" value={form.password} onChange={e=>update('password',e.target.value)} required/>
            <Input placeholder="Confirm Password" type="password" value={form.confirm} onChange={e=>update('confirm',e.target.value)} required/>
            <div className="text-xs text-zinc-500">Company logo can be uploaded later in Company Settings. Employee ID (e.g., OS0001) will be auto-generated.</div>
            {err && <div className="text-sm text-red-400">{err}</div>}
            <Button type="submit" disabled={loading} className="w-full">{loading?'Creating...':'Create Company & Sign In'}</Button>
            <div className="text-center text-sm text-zinc-500">Already have an account? <Link to="/login" className="text-[#a855f7]">Sign In</Link></div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
