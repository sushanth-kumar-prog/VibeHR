import { useEffect, useState } from 'react'
import { api } from '../api/client'
import { Link } from 'react-router-dom'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { useAuth } from '../stores/auth'

type Employee = {
  id: string, employee_id: string, email: string, first_name: string, last_name: string, role: string, avatar_url?: string, department?: string, job_title?: string
}

export default function Dashboard(){
  const { user } = useAuth()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [search,setSearch]=useState('')
  const [invite,setInvite]=useState({firstName:'',lastName:'',email:'',jobTitle:'',department:'', role:'employee'})
  const [msg,setMsg]=useState('')
  const [stats,setStats]=useState<any>(null)
  const [todayMap,setTodayMap]=useState<Record<string,string>>({})

  const load = async()=>{
    const {data} = await api.get('/users', {params: {search: search || undefined}})
    setEmployees(data)
    try{
      const r = await api.get('/reports/attendance')
      setStats(r.data)
    }catch{}
    // per-employee today dot (admin batch)
    if(user?.role!=='employee'){
      try{
        const b=await api.get('/attendance/today/batch')
        const m:Record<string,string>={}
        b.data.forEach((x:any)=> m[x.user_id]=x.status)
        setTodayMap(m)
      }catch{}
    }
  }
  useEffect(()=>{ load() },[search])

  const doInvite = async(e:React.FormEvent)=>{
    e.preventDefault(); setMsg('')
    try{
      const {data}=await api.post('/auth/invite', invite)
      setMsg(`Invited ${data.employee_id} — temp password: ${data.temp_password} — Email verification required`)
      setInvite({firstName:'',lastName:'',email:'',jobTitle:'',department:'', role:'employee'})
      load()
    }catch(ex:any){ setMsg(ex.response?.data?.detail || 'Invite failed')}
  }

  const isEmployee = user?.role === 'employee'

  if(isEmployee){
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard — Every workday, perfectly aligned.</h1>
          <p className="text-sm text-zinc-500">Quick-access cards as per spec 3.2.1 Employee Dashboard</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to={`/profile/${user?.id}`}><Card className="p-6 hover:border-[#714B67] text-center space-y-2"><div className="mx-auto h-10 w-10 rounded bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">👤</div><div className="font-medium">My Profile</div><div className="text-xs text-zinc-500">View personal/job/salary details</div></Card></Link>
          <Link to="/attendance"><Card className="p-6 hover:border-[#714B67] text-center space-y-2"><div className="mx-auto h-10 w-10 rounded bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">⏰</div><div className="font-medium">Attendance</div><div className="text-xs text-zinc-500">{stats ? `${stats.present} present • ${stats.absent} absent` : 'Daily/weekly view'}</div></Card></Link>
          <Link to="/time-off"><Card className="p-6 hover:border-[#714B67] text-center space-y-2"><div className="mx-auto h-10 w-10 rounded bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">🗓️</div><div className="font-medium">Leave Requests</div><div className="text-xs text-zinc-500">Apply Paid/Sick/Unpaid</div></Card></Link>
          <Link to="/reports"><Card className="p-6 hover:border-[#714B67] text-center space-y-2"><div className="mx-auto h-10 w-10 rounded bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">💰</div><div className="font-medium">My Payslip</div><div className="text-xs text-zinc-500">Read-only payroll view</div></Card></Link>
        </div>
        <Card className="p-4">
          <h3 className="font-semibold">Recent Activity</h3>
          <div className="text-sm text-zinc-400 mt-2">Welcome, {user?.first_name}! Your Employee ID is {user?.employee_id}. Check-in via header to mark attendance. Contact HR for any profile updates.</div>
          <div className="mt-3 text-xs text-zinc-500">Alerts: Email verification {user?.employee_id ? '— pending if not verified' : ''} • Temp password must be changed in Profile if invited.</div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Employees — Admin / HR Dashboard</h1>
          <p className="text-sm text-zinc-500">Employee list • Attendance records • Leave approvals • Switch between employees (spec 3.2.2). Click cards for profile.</p>
        </div>
        <div className="flex gap-2">
          <Input placeholder="Search employee..." value={search} onChange={e=>setSearch(e.target.value)} className="w-64"/>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-4 gap-3 text-sm">
          <Card className="p-3 text-center"><div className="text-2xl font-bold">{employees.length}</div><div className="text-xs text-zinc-500">Employees</div></Card>
          <Card className="p-3 text-center"><div className="text-2xl font-bold text-green-400">{stats.present}</div><div className="text-xs text-zinc-500">Present records</div></Card>
          <Card className="p-3 text-center"><div className="text-2xl font-bold text-amber-400">{stats.half_day}</div><div className="text-xs text-zinc-500">Half-days</div></Card>
          <Card className="p-3 text-center"><div className="text-2xl font-bold text-red-400">{stats.absent}</div><div className="text-xs text-zinc-500">Absents</div></Card>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {employees.map(emp=>{
          const st=todayMap[emp.id]||'absent'
          const color=st==='present'?'bg-green-500':st==='half_day'?'bg-amber-500':st==='leave'?'bg-yellow-500':'bg-red-500'
          return (
          <Link key={emp.id} to={`/profile/${emp.id}`}>
            <Card className="p-4 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors h-full relative group">
              <div className={`absolute top-3 right-3 h-3 w-3 rounded-full ${color} ring-2 ring-white dark:ring-zinc-900`} title={`Attendance: ${st}`} />
              <div className="flex gap-3">
                <div className="h-12 w-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden text-zinc-600 dark:text-zinc-200">
                  {emp.avatar_url ? <img src={emp.avatar_url.startsWith('/uploads')?`http://localhost:8000${emp.avatar_url}`:emp.avatar_url} className="h-full w-full object-cover"/> : `${emp.first_name[0]}${emp.last_name[0]}`}
                </div>
                <div className="min-w-0">
                  <div className="font-medium truncate">{emp.first_name} {emp.last_name}</div>
                  <div className="text-xs text-zinc-500 truncate">{emp.employee_id} • {emp.role}</div>
                  <div className="text-xs text-zinc-400 truncate">{emp.department || '—'} • {emp.job_title || ''}</div>
                  <div className="text-xs text-zinc-500 truncate">{emp.email}</div>
                </div>
              </div>
            </Card>
          </Link>
        )})}
      </div>

      <Card className="p-6">
        <h3 className="font-semibold mb-3">Invite Employee (Admin/HR only) — auto Employee ID OS0001 + temp password</h3>
        <p className="text-xs text-zinc-500 mb-3">Employees cannot self-register (per wireframe Note). Admin creates via this form; email verification required.</p>
        <form onSubmit={doInvite} className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Input placeholder="First Name" value={invite.firstName} onChange={e=>setInvite({...invite, firstName:e.target.value})} required/>
          <Input placeholder="Last Name" value={invite.lastName} onChange={e=>setInvite({...invite, lastName:e.target.value})} required/>
          <Input placeholder="Email" type="email" value={invite.email} onChange={e=>setInvite({...invite, email:e.target.value})} required/>
          <Input placeholder="Job Title" value={invite.jobTitle} onChange={e=>setInvite({...invite, jobTitle:e.target.value})} />
          <Input placeholder="Department" value={invite.department} onChange={e=>setInvite({...invite, department:e.target.value})} />
          <select value={invite.role} onChange={e=>setInvite({...invite, role:e.target.value})} className="h-10 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 text-sm">
            <option value="employee">Employee</option>
            <option value="hr">HR</option>
            <option value="admin">Admin</option>
          </select>
          <Button type="submit" className="md:col-span-3">Invite & Generate ID</Button>
        </form>
        {msg && <div className="mt-3 text-sm p-2 rounded bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">{msg}</div>}
      </Card>
    </div>
  )
}
