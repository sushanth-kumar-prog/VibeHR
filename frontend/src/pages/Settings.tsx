import { useEffect, useState } from 'react'
import { api } from '../api/client'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { useAuth } from '../stores/auth'

export default function Settings(){
  const { user } = useAuth()
  const isAdmin = user?.role==='admin' || user?.role==='hr'
  const [company,setCompany]=useState<any>(null)
  const [name,setName]=useState('')
  const [msg,setMsg]=useState('')
  const [logoFile,setLogoFile]=useState<File|null>(null)
  const [pwd,setPwd]=useState({old:'', next:'', confirm:''})

  const load = async()=>{
    try{ const {data}=await api.get('/companies/me'); setCompany(data); setName(data.name)}catch(e:any){ setMsg(e.response?.data?.detail||'load failed')}
  }
  useEffect(()=>{ load() },[])

  const saveName = async()=>{
    setMsg('')
    try{ const {data}=await api.patch('/companies/me', {name}); setCompany(data); setMsg('Company name updated')} catch(e:any){ setMsg(e.response?.data?.detail||'failed')}
  }
  const uploadLogo = async()=>{
    if(!logoFile) return setMsg('Pick image first')
    const fd=new FormData(); fd.append('file', logoFile)
    try{ const {data}=await api.post('/companies/logo', fd, {headers:{'Content-Type':'multipart/form-data'}}); setCompany((c:any)=> ({...c, logo_url:data.logo_url})); setMsg('Logo uploaded')} catch(e:any){ setMsg(e.response?.data?.detail||'upload failed')}
  }
  const changePwd = async()=>{
    if(pwd.next!==pwd.confirm) return setMsg('Next passwords mismatch')
    try{ await api.post('/auth/change-password', {old_password: pwd.old, new_password: pwd.next}); setMsg('Password changed — re-login'); setPwd({old:'',next:'',confirm:''})}catch(e:any){ setMsg(e.response?.data?.detail||'failed')}
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-bold">Company Settings</h1>
      <p className="text-sm text-zinc-500">Admin/HR only can edit company.Logo stored via Supabase Storage `company-logos` (fallback `uploads/company-logos`).</p>
      {company ? (
        <Card className="p-6 space-y-4">
          <div>
            <label className="text-sm">Company Name (slug: {company.slug})</label>
            <div className="flex gap-2 mt-1">
              <Input value={name} onChange={e=>setName(e.target.value)} disabled={!isAdmin}/>
              <Button onClick={saveName} disabled={!isAdmin}>Save</Button>
            </div>
          </div>
          <div>
            <label className="text-sm">Company Logo</label>
            {company.logo_url && <img src={company.logo_url.startsWith('/uploads') ? `http://localhost:8000${company.logo_url}` : company.logo_url} alt="logo" className="h-16 mt-2 border border-zinc-200 dark:border-zinc-800 rounded"/>}
            <div className="flex gap-2 mt-2">
              <input type="file" accept="image/*" onChange={e=>setLogoFile(e.target.files?.[0]||null)} className="text-sm"/>
              <Button size="sm" variant="outline" onClick={uploadLogo} disabled={!isAdmin}>Upload Logo</Button>
            </div>
          </div>
          <div className="text-xs text-zinc-500">Wireframe Sign Up `Upload Logo` → this stored as `logo_url` on Company.</div>
        </Card>
      ): <div className="text-sm text-zinc-500">Loading company...</div>}

      <Card className="p-6 space-y-3">
        <h3 className="font-semibold">Change Password (forced if temp)</h3>
        <div className="grid md:grid-cols-3 gap-3">
          <Input type="password" placeholder="Current" value={pwd.old} onChange={e=>setPwd({...pwd, old:e.target.value})}/>
          <Input type="password" placeholder="New 8+ U/l, num, special" value={pwd.next} onChange={e=>setPwd({...pwd, next:e.target.value})}/>
          <Input type="password" placeholder="Confirm new" value={pwd.confirm} onChange={e=>setPwd({...pwd, confirm:e.target.value})}/>
        </div>
        <Button size="sm" onClick={changePwd}>Change Password</Button>
      </Card>
      {msg && <div className="text-sm p-3 rounded bg-zinc-900 border border-zinc-200 dark:border-zinc-800">{msg}</div>}
      {!isAdmin && <div className="text-sm text-amber-400">You are {user?.role} — only admin/hr can edit company settings.</div>}
    </div>
  )
}
