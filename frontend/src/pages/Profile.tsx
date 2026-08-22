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

  const canViewSalary = me?.role !== 'employee' || me?.id === id
  const canEditSalary = me?.role === 'admin' || me?.role === 'hr'

  const load = async()=>{
    if(!id) return
    const {data} = await api.get(`/users/${id}`)
    setUser(data)
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

  if(!user) return <div className="text-zinc-500">Loading...</div>

  return (
    <div className="space-y-4">
      <Link to="/" className="text-sm text-zinc-400 hover:text-white">← Back to Employees</Link>
      <Card className="p-6">
        <div className="flex gap-4">
          <div className="h-16 w-16 rounded-full bg-[#a855f7]/30 border border-[#a855f7]/50 flex items-center justify-center text-xl font-bold">{user.first_name[0]}{user.last_name[0]}</div>
          <div>
            <h2 className="text-xl font-bold">{user.first_name} {user.last_name}</h2>
            <div className="text-sm text-zinc-500">{user.employee_id} • {user.role} • {user.job_title || '—'}</div>
            <div className="text-xs text-zinc-500">{user.email} • {user.department || 'No dept'}</div>
          </div>
        </div>
        <div className="flex gap-2 mt-4 border-t border-zinc-800 pt-4">
          <Button variant={tab==='resume'?'default':'ghost'} size="sm" onClick={()=>setTab('resume')}>Resume</Button>
          <Button variant={tab==='private'?'default':'ghost'} size="sm" onClick={()=>setTab('private')}>Private Info</Button>
          <Button variant={tab==='salary'?'default':'ghost'} size="sm" onClick={()=>setTab('salary')} disabled={!canViewSalary}>Salary Info {(!canViewSalary) && '(Admin only)'}</Button>
        </div>
      </Card>

      {tab==='resume' && (
        <Card className="p-6 space-y-2">
          <h3 className="font-semibold">About & Experience</h3>
          <p className="text-sm text-zinc-400">Resume data would go here (experience, skills, education, certifications). Edit limited fields below.</p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><span className="text-zinc-500">Address:</span> {user.address || '—'}</div>
            <div><span className="text-zinc-500">Phone:</span> {user.phone || '—'}</div>
            <div><span className="text-zinc-500">Date of Joining:</span> {user.date_of_joining || '—'}</div>
            <div><span className="text-zinc-500">Department:</span> {user.department || '—'}</div>
          </div>
        </Card>
      )}

      {tab==='private' && (
        <Card className="p-6">
          <h3 className="font-semibold mb-3">Private Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input defaultValue={user.phone||''} placeholder="Phone" onBlur={async e=>{ await api.patch(`/users/${id}`, {phone:e.target.value}); }} />
            <Input defaultValue={user.address||''} placeholder="Address" onBlur={async e=>{ await api.patch(`/users/${id}`, {address:e.target.value}); }} />
          </div>
          <div className="text-xs text-zinc-500 mt-2">Employees can edit limited fields (phone, address, avatar). Admin can edit all via PATCH /users.</div>
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
            {msg && <div className="text-sm p-2 rounded bg-zinc-900 border border-zinc-800">{msg}</div>}
            {salary?.breakdown && (
              <div className="border border-zinc-800 rounded-lg overflow-hidden">
                <div className="bg-zinc-900 px-3 py-2 text-sm font-medium">Breakdown — Net Pay ₹{salary.breakdown.net_pay} / month</div>
                <table className="w-full text-sm">
                  <thead className="bg-zinc-900/50 text-zinc-400 text-xs"><tr><th className="text-left p-2">Component</th><th className="text-right p-2">Type</th><th className="text-right p-2">Monthly</th><th className="text-right p-2">Yearly</th></tr></thead>
                  <tbody>
                    {salary.breakdown.breakdown.map((b:any,i:number)=>(
                      <tr key={i} className="border-t border-zinc-800"><td className="p-2">{b.name}</td><td className="p-2 text-right text-xs">{b.type}</td><td className="p-2 text-right">₹{b.amount_monthly}</td><td className="p-2 text-right">₹{b.amount_yearly}</td></tr>
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
