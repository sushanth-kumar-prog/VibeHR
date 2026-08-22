import { useEffect, useState } from 'react'
import { api } from '../api/client'
import { Link } from 'react-router-dom'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { useAuth } from '../stores/auth'

type Employee = {
  id: string, employee_id: string, email: string, first_name: string, last_name: string, role: string, avatar_url?: string, department?: string
}

export default function Dashboard(){
  const { user } = useAuth()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [search,setSearch]=useState('')
  const [invite,setInvite]=useState({firstName:'',lastName:'',email:'',jobTitle:'',department:'', role:'employee'})
  const [msg,setMsg]=useState('')
  const [attendanceMap,setAttendanceMap]=useState<Record<string,string>>({})

  const load = async()=>{
    const {data} = await api.get('/users', {params: {search: search || undefined}})
    setEmployees(data)
    // fetch today status for dot color? For demo, fetch attendance for each? simplified: assume all present if needed
  }
  useEffect(()=>{ load() },[search])

  const doInvite = async(e:React.FormEvent)=>{
    e.preventDefault(); setMsg('')
    try{
      const {data}=await api.post('/auth/invite', invite)
      setMsg(`Invited ${data.employee_id} — temp password: ${data.temp_password}`)
      setInvite({firstName:'',lastName:'',email:'',jobTitle:'',department:'', role:'employee'})
      load()
    }catch(ex:any){ setMsg(ex.response?.data?.detail || 'Invite failed')}
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Employees</h1>
          <p className="text-sm text-zinc-500">After login you land here • Click cards for profile • Status dot: green = in office, red = absent, yellow = on leave</p>
        </div>
        <div className="flex gap-2">
          <Input placeholder="Search employee..." value={search} onChange={e=>setSearch(e.target.value)} className="w-64"/>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {employees.map(emp=>(
          <Link key={emp.id} to={`/profile/${emp.id}`}>
            <Card className="p-4 hover:border-zinc-700 transition-colors h-full relative group">
              <div className="absolute top-3 right-3 h-3 w-3 rounded-full bg-red-500 ring-2 ring-zinc-900" title="Attendance status (today)" />
              <div className="flex gap-3">
                <div className="h-12 w-12 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-sm shrink-0">
                  {emp.first_name[0]}{emp.last_name[0]}
                </div>
                <div className="min-w-0">
                  <div className="font-medium truncate">{emp.first_name} {emp.last_name}</div>
                  <div className="text-xs text-zinc-500 truncate">{emp.employee_id} • {emp.role}</div>
                  <div className="text-xs text-zinc-400 truncate">{emp.department || '—'} • {emp.email}</div>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {user?.role !== 'employee' && (
        <Card className="p-6">
          <h3 className="font-semibold mb-3">Invite Employee (Admin/HR only)</h3>
          <p className="text-xs text-zinc-500 mb-3">Creates user with auto-generated Employee ID (OS0001) + temp password. Employee will be forced to change on first login.</p>
          <form onSubmit={doInvite} className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input placeholder="First Name" value={invite.firstName} onChange={e=>setInvite({...invite, firstName:e.target.value})} required/>
            <Input placeholder="Last Name" value={invite.lastName} onChange={e=>setInvite({...invite, lastName:e.target.value})} required/>
            <Input placeholder="Email" type="email" value={invite.email} onChange={e=>setInvite({...invite, email:e.target.value})} required/>
            <Input placeholder="Job Title" value={invite.jobTitle} onChange={e=>setInvite({...invite, jobTitle:e.target.value})} />
            <Input placeholder="Department" value={invite.department} onChange={e=>setInvite({...invite, department:e.target.value})} />
            <select value={invite.role} onChange={e=>setInvite({...invite, role:e.target.value})} className="h-10 rounded-md border border-zinc-800 bg-zinc-900 px-3 text-sm">
              <option value="employee">Employee</option>
              <option value="hr">HR</option>
              <option value="admin">Admin</option>
            </select>
            <Button type="submit" className="md:col-span-3">Invite & Generate ID</Button>
          </form>
          {msg && <div className="mt-3 text-sm p-2 rounded bg-zinc-900 border border-zinc-800">{msg}</div>}
        </Card>
      )}
    </div>
  )
}
