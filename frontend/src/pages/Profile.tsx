import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { api } from '../api/client'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { useAuth } from '../stores/auth'

export default function Profile(){
  const { id: paramId } = useParams()
  const { user: me } = useAuth()
  const id = paramId || me?.id
  const [user, setUser] = useState<any>(null)
  const [tab, setTab] = useState<'resume'|'private'|'salary'>('resume')
  const [salary, setSalary] = useState<any>(null)
  const [formSalary, setFormSalary] = useState('50000')
  const [components, setComponents] = useState<any[]>([])
  const [msg, setMsg] = useState('')
  const [docs, setDocs] = useState<any[]>([])
  const [pwd, setPwd] = useState({old:'', next:'', confirm:''})
  const [editField, setEditField] = useState<any>({phone: '', address: '', job_title: '', department: ''})
  const [company, setCompany] = useState<any>(null)

  const canViewSalary = me?.role !== 'employee' || me?.id === id
  const canEditSalary = me?.role === 'admin' || me?.role === 'hr'
  const canEditAll = canEditSalary || me?.id === id

  const load = async()=>{
    if(!id) return
    const {data} = await api.get(`/users/${id}`)
    setUser(data)
    setEditField({phone: data.phone||'', address: data.address||'', job_title: data.job_title||'', department: data.department||''})
    if(canViewSalary){
      try{
        const s = await api.get(`/payroll/salary/${id}`)
        setSalary(s.data)
        if(s.data?.monthly_wage) setFormSalary(String(s.data.monthly_wage))
      }catch{}
      try{
        const c = await api.get('/payroll/components')
        setComponents(c.data)
      }catch{}
    }
    try{
      const d = await api.get(`/documents/${id}`)
      setDocs(d.data)
    }catch{}
    try{
      const c = await api.get('/companies/me')
      setCompany(c.data)
    }catch{}
  }
  useEffect(()=>{ load() },[id])

  const saveSalary = async()=>{
    setMsg('')
    try{
      const {data}= await api.post(`/payroll/salary/${id}`, {monthly_wage: parseFloat(formSalary)})
      setSalary(data)
      setMsg('Saved: Net Pay ' + data.breakdown.net_pay)
    }catch(e:any){ setMsg(e.response?.data?.detail || 'Failed')}
  }

  const seed = async()=>{
    await api.post('/payroll/seed-defaults')
    const c = await api.get('/payroll/components')
    setComponents(c.data)
  }

  const uploadDoc = async(e:React.ChangeEvent<HTMLInputElement>)=>{
    const file = e.target.files?.[0]
    if(!file) return
    const fd = new FormData()
    fd.append('file', file)
    await api.post(`/documents/upload/${id}`, fd, {headers: {'Content-Type':'multipart/form-data'}})
    const d = await api.get(`/documents/${id}`)
    setDocs(d.data)
  }

  const saveProfile = async()=>{
    await api.patch(`/users/${id}`, editField)
    load()
    setMsg('Profile updated')
  }

  const changePwd = async()=>{
    if(pwd.next !== pwd.confirm) return setMsg('New passwords mismatch')
    try{
      await api.post('/auth/change-password', {old_password: pwd.old, new_password: pwd.next})
      setMsg('Password changed — re-login recommended')
      setPwd({old:'', next:'', confirm:''})
    }catch(e:any){ setMsg(e.response?.data?.detail || 'Failed')}
  }

  const uploadAvatar = async(e:React.ChangeEvent<HTMLInputElement>)=>{
    const file = e.target.files?.[0]
    if(!file) return
    const fd = new FormData()
    fd.append('file', file)
    await api.post(`/users/${id}/avatar`, fd, {headers:{'Content-Type':'multipart/form-data'}})
    load()
  }

  if(!user) return <div className="text-zinc-500">Loading...</div>

  return (
    <div className="space-y-4">
      <Link to="/" className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">← Back to Employees</Link>
      <Card className="p-6">
        <div className="flex gap-4">
          <div className="h-16 w-16 rounded-full bg-[#714B67]/30 border border-[#714B67]/50 flex items-center justify-center text-xl font-bold overflow-hidden">
            {user.avatar_url ? <img src={user.avatar_url.startsWith('/uploads') ? `http://localhost:8000${user.avatar_url}` : user.avatar_url} alt="avatar" className="h-full w-full object-cover"/> : `${user.first_name[0]}${user.last_name[0]}`}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold">{user.first_name} {user.last_name}</h2>
            <div className="text-sm text-zinc-500">{user.employee_id} • {user.role} • {user.job_title || '—'} {company?.name && `• ${company.name}`}</div>
            <div className="text-xs text-zinc-500">{user.email} • {user.department || 'No dept'} {company?.logo_url && <span>• <a href={company.logo_url.startsWith('/uploads') ? `http://localhost:8000${company.logo_url}` : company.logo_url} target="_blank" className="text-[#714B67]">Company Logo</a></span>}</div>
            {(me?.id===id || me?.role!=='employee') && <div className="mt-2"><label className="text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded cursor-pointer">Change Avatar<input type="file" accept="image/*" onChange={uploadAvatar} className="hidden"/></label></div>}
          </div>
        </div>
        <div className="flex gap-2 mt-4 border-t border-zinc-200 dark:border-zinc-800 pt-4">
          <Button variant={tab==='resume'?'default':'ghost'} size="sm" onClick={()=>setTab('resume')}>Resume</Button>
          <Button variant={tab==='private'?'default':'ghost'} size="sm" onClick={()=>setTab('private')}>Private Info</Button>
          <Button variant={tab==='salary'?'default':'ghost'} size="sm" onClick={()=>setTab('salary')} disabled={!canViewSalary}>Salary Info {(!canViewSalary) && '(Admin only)'}</Button>
        </div>
      </Card>

      {tab==='resume' && (
        <div className="space-y-4">
          <Card className="p-6 space-y-3">
            <h3 className="font-semibold">About</h3>
            <p className="text-sm text-zinc-400">Resume view — personal + job + docs as per spec 3.3.1 (personal details, job details, salary structure, documents, profile picture). Admin edits all via Private Info; Salary in next tab.</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-zinc-500">Full Name:</span> {user.first_name} {user.last_name}</div>
              <div><span className="text-zinc-500">Employee ID:</span> {user.employee_id}</div>
              <div><span className="text-zinc-500">Email:</span> {user.email}</div>
              <div><span className="text-zinc-500">Phone:</span> {user.phone || '—'}</div>
              <div><span className="text-zinc-500">Address:</span> {user.address || '—'}</div>
              <div><span className="text-zinc-500">Department:</span> {user.department || '—'}</div>
              <div><span className="text-zinc-500">Job Title:</span> {user.job_title || '—'}</div>
              <div><span className="text-zinc-500">Date of Joining:</span> {user.date_of_joining || '—'}</div>
              <div><span className="text-zinc-500">Company:</span> {company?.name || '—'} {company?.slug && `(${company.slug})`}</div>
              <div><span className="text-zinc-500">Role:</span> {user.role}</div>
            </div>
          </Card>
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="p-6">
              <h4 className="font-medium">Experience & Skills</h4>
              <ul className="text-sm text-zinc-400 list-disc ml-5 mt-2 space-y-1">
                <li>Experience data placeholder — integrate HRIS later</li>
                <li>Skills: React, FastAPI, Supabase (example)</li>
                <li>Education: B.E. Computer Science (example)</li>
              </ul>
            </Card>
            <Card className="p-6">
              <h4 className="font-medium">Certifications & Documents</h4>
              <div className="text-sm text-zinc-400 mt-2">{docs.length} document(s) uploaded</div>
              <div className="mt-2 space-y-1">
                {docs.slice(0,3).map((d:any)=>(<div key={d.id} className="text-xs truncate">{d.name}</div>))}
                {docs.length===0 && <div className="text-xs text-zinc-500">No certs yet — upload in Private Info</div>}
              </div>
              <Button size="sm" variant="outline" className="mt-3" onClick={()=>setTab('private')}>Manage Docs</Button>
            </Card>
          </div>
        </div>
      )}

      {tab==='private' && (
        <Card className="p-6 space-y-4">
          <h3 className="font-semibold">Private Info & Job Details (spec 3.3)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div><label className="text-xs text-zinc-500">Phone {me?.role==='employee'?'(editable)':''}</label><Input value={editField.phone} onChange={e=>setEditField({...editField, phone:e.target.value})} placeholder="Phone"/></div>
            <div><label className="text-xs text-zinc-500">Address</label><Input value={editField.address} onChange={e=>setEditField({...editField, address:e.target.value})} placeholder="Address"/></div>
            <div><label className="text-xs text-zinc-500">Job Title {canEditSalary ? '(admin editable)' : ''}</label><Input value={editField.job_title} onChange={e=>setEditField({...editField, job_title:e.target.value})} disabled={!canEditSalary && me?.id!==id} placeholder="Developer"/></div>
            <div><label className="text-xs text-zinc-500">Department</label><Input value={editField.department} onChange={e=>setEditField({...editField, department:e.target.value})} disabled={!canEditSalary && me?.id!==id} placeholder="Engineering"/></div>
          </div>
          <Button size="sm" onClick={saveProfile}>Save Profile</Button>
          <div className="text-xs text-zinc-500">Employees can edit limited fields (phone, address, avatar). Admin can edit all employee details (job, dept, role). Salary structure visible in Salary Info tab.</div>

          <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4 space-y-3">
            <h4 className="font-medium">Documents</h4>
            <input type="file" onChange={uploadDoc} className="text-sm"/>
            <div className="space-y-1">
              {docs.map((d:any)=>(
                <div key={d.id} className="flex justify-between items-center text-sm border border-zinc-200 dark:border-zinc-800 rounded p-2">
                  <div>{d.name} <span className="text-xs text-zinc-500">{d.mime_type}</span></div>
                  <a href={d.file_url} target="_blank" className="text-xs text-[#714B67]">View</a>
                </div>
              ))}
              {docs.length===0 && <div className="text-xs text-zinc-500">No documents — upload resume, ID, etc.</div>}
            </div>
          </div>

          <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4 space-y-3">
            <h4 className="font-medium">Change Password {user.is_temp_password && <span className="text-amber-400 text-xs">— temp password, change required</span>}</h4>
            <div className="grid md:grid-cols-3 gap-3">
              <Input type="password" placeholder="Current" value={pwd.old} onChange={e=>setPwd({...pwd, old:e.target.value})}/>
              <Input type="password" placeholder="New (8+ U/l, num, special)" value={pwd.next} onChange={e=>setPwd({...pwd, next:e.target.value})}/>
              <Input type="password" placeholder="Confirm new" value={pwd.confirm} onChange={e=>setPwd({...pwd, confirm:e.target.value})}/>
            </div>
            <Button size="sm" variant="outline" onClick={changePwd}>Change Password</Button>
          </div>
          {msg && <div className="text-sm p-2 rounded bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">{msg}</div>}
        </Card>
      )}

      {tab==='salary' && canViewSalary && (
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-4">
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Salary Info {canEditSalary ? '' : '(Read-only)'}</h3>
              {canEditSalary && <Button size="sm" variant="outline" onClick={seed}>Seed Default Components</Button>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-zinc-500">Monthly Wage</label>
                <Input value={formSalary} onChange={e=>setFormSalary(e.target.value)} disabled={!canEditSalary}/>
              </div>
              <div>
                <label className="text-xs text-zinc-500">Yearly Wage</label>
                <Input value={String((parseFloat(formSalary)||0)*12)} disabled />
              </div>
            </div>
            {components.length>0 && <div className="text-xs text-zinc-500">Template components: {components.map(c=>`${c.name} ${c.value_type==='percentage'?c.value+'%': '₹'+c.value} (${c.type})`).join(' • ')}</div>}
            {canEditSalary && <Button onClick={saveSalary}>Compute & Save Salary</Button>}
            {msg && <div className="text-sm p-2 rounded bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">{msg}</div>}
            {salary?.breakdown && (
              <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
                <div className="bg-zinc-50 dark:bg-zinc-900 px-3 py-2 text-sm font-medium">Breakdown — Net Pay ₹{salary.breakdown.net_pay} / month</div>
                <table className="w-full text-sm">
                  <thead className="bg-zinc-100 dark:bg-zinc-900/50 text-zinc-400 text-xs"><tr><th className="text-left p-2">Component</th><th className="text-right p-2">Type</th><th className="text-right p-2">Monthly</th><th className="text-right p-2">Yearly</th></tr></thead>
                  <tbody>
                    {salary.breakdown.breakdown.map((b:any,i:number)=>(
                      <tr key={i} className="border-t border-zinc-200 dark:border-zinc-800"><td className="p-2">{b.name}</td><td className="p-2 text-right text-xs">{b.type}</td><td className="p-2 text-right">₹{b.amount_monthly}</td><td className="p-2 text-right">₹{b.amount_yearly}</td></tr>
                    ))}
                  </tbody>
                </table>
                {salary.breakdown.warnings?.length>0 && <div className="p-2 text-xs text-amber-400">{salary.breakdown.warnings.join(', ')}</div>}
              </div>
            )}
          </Card>
          <Card className="p-6 bg-amber-950/20 border-amber-900/50">
            <h4 className="font-semibold text-amber-200">Important</h4>
            <div className="text-xs text-amber-100/80 space-y-2 mt-2 leading-relaxed">
              <p>Salary components can be Fixed Amount or % of Wage/Basic. Total earnings must not exceed defined Wage. PF 12% of Basic, PT ₹200, etc.</p>
              <p>Example: Wage 700k, Basic 40% → 280k. PF 12% of Basic → 33.6k/year.</p>
              <p>This tab is only visible to Admin/HR. Employees see their own salary read-only.</p>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
