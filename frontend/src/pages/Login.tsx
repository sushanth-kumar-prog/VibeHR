import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../stores/auth'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'

export default function Login(){
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
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
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <Link to="/" className="mb-6 flex items-center gap-2 text-sm text-zinc-400 hover:text-white"><span className="h-7 w-7 rounded-lg bg-[#a855f7] flex items-center justify-center text-xs font-bold text-white">DF</span> Dayflow <span className="text-zinc-600">•</span> Back to home</Link>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-center">Sign In</CardTitle>
          <p className="text-center text-xs text-zinc-500">Dayflow — Human Resource Management</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm">Login ID / Email</label>
              <Input value={email} onChange={e=>setEmail(e.target.value)} placeholder="OS0001 or email@company.com" required/>
            </div>
            <div className="space-y-2">
              <label className="text-sm">Password</label>
              <Input type="password" value={password} onChange={e=>setPassword(e.target.value)} required/>
            </div>
            {err && <div className="text-sm text-red-400 bg-red-950/30 border border-red-900 p-2 rounded">{err}</div>}
            <Button type="submit" disabled={loading} className="w-full">{loading ? 'Signing in...' : 'Sign In'}</Button>
            <div className="text-center text-sm text-zinc-500">Don't have an account? <Link to="/signup" className="text-[#a855f7]">Create Company</Link></div>
            <div className="rounded-md bg-zinc-900 border border-zinc-800 p-3 text-xs text-zinc-400">
              <div className="font-semibold text-zinc-300">Note (per wireframe)</div>
              <div>Login ID auto-generated (e.g., OS0001 — Olive System initials + seq). Overall users cannot register — Admin creates via invite. Temp password auto-generated for first time; change on first login. Email verification required.</div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
