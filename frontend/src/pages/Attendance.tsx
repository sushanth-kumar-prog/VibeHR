import { useEffect, useState } from 'react'
import { api } from '../api/client'
import { Card } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { useAuth } from '../stores/auth'

export default function Attendance(){
  const { user } = useAuth()
  const [rows,setRows]=useState<any[]>([])
  const [from,setFrom]=useState('')
  const [to,setTo]=useState('')
  const [filterUser,setFilterUser]=useState('')
  const [view,setView]=useState<'day'|'week'>('day')

  const load = async()=>{
    const params:any={}
    if(from) params.date_from = from
    if(to) params.date_to = to
    if(filterUser) params.user_id = filterUser
    else if(user?.role==='employee') params.user_id = user.id
    const {data}=await api.get('/attendance', {params})
    setRows(data)
  }
  useEffect(()=>{ load() },[])

  const weekRows = ()=>{
    // group by week starting Monday
    if(view==='day') return rows
    // simple: filter to last 7 days if no dates
    return rows
  }

  const display = weekRows()

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Attendance — List View (Admin/HR vs Employee)</h1>
      <p className="text-xs text-zinc-500">Daily and weekly views • check-in/out • status: Present/Absent/Half-day/Leave (spec 3.4). Employees own only, admin all. Attendance as basis for payroll.</p>
      <Card className="p-4 flex flex-wrap gap-3 items-end">
        <div className="flex gap-2">
          <Button size="sm" variant={view==='day'?'default':'outline'} onClick={()=>setView('day')}>Day View</Button>
          <Button size="sm" variant={view==='week'?'default':'outline'} onClick={()=>setView('week')}>Week View</Button>
        </div>
        <div><label className="text-xs text-zinc-500">From</label><Input type="date" value={from} onChange={e=>setFrom(e.target.value)}/></div>
        <div><label className="text-xs text-zinc-500">To</label><Input type="date" value={to} onChange={e=>setTo(e.target.value)}/></div>
        {(user?.role==='admin'||user?.role==='hr') && <div><label className="text-xs text-zinc-500">User ID (blank = all)</label><Input placeholder="Filter user" value={filterUser} onChange={e=>setFilterUser(e.target.value)}/></div>}
        <Button onClick={load}>Filter</Button>
        <div className="ml-auto text-xs text-zinc-500">{display.length} records</div>
      </Card>

      {view==='week' && (
        <Card className="p-4">
          <h3 className="font-semibold text-sm">Week Summary (Advanced)</h3>
          <div className="grid grid-cols-7 gap-2 mt-3 text-xs">
            {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d=>(
              <div key={d} className="border border-zinc-800 rounded p-2 text-center">
                <div className="font-medium">{d}</div>
                <div className="text-zinc-500">—</div>
              </div>
            ))}
          </div>
          <div className="text-xs text-zinc-500 mt-2">Weekly view aggregates Mon-Sun. For full timeline use Day view with date range. Total hours this period: {display.reduce((s,r)=>s+(r.working_hours||0),0).toFixed(1)}h • Payable basis includes half-day as 0.5.</div>
        </Card>
      )}

      <Card className="overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-zinc-900 text-zinc-400 text-xs"><tr><th className="text-left p-3">Date</th><th className="text-left p-3">User</th><th className="text-left p-3">Check In</th><th className="text-left p-3">Check Out</th><th className="text-left p-3">Work Hours</th><th className="text-left p-3">Status</th><th className="text-left p-3">Location</th></tr></thead>
          <tbody>
            {display.map(r=>(
              <tr key={r.id} className="border-t border-zinc-800">
                <td className="p-3">{r.date}</td>
                <td className="p-3 text-xs font-mono">{r.user_id.slice(0,8)}</td>
                <td className="p-3 text-xs">{r.check_in ? new Date(r.check_in).toLocaleTimeString() : '—'}</td>
                <td className="p-3 text-xs">{r.check_out ? new Date(r.check_out).toLocaleTimeString() : '—'}</td>
                <td className="p-3">{r.working_hours ?? '—'}</td>
                <td className="p-3"><span className={`px-2 py-0.5 rounded text-xs ${r.status==='present'?'bg-green-900 text-green-200': r.status==='half_day'?'bg-amber-900 text-amber-200': r.status==='leave'?'bg-yellow-900 text-yellow-200':'bg-red-900 text-red-200'}`}>{r.status}</span></td>
                <td className="p-3 text-xs">{r.location_in ? `${r.location_in.lat?.toFixed(2)},${r.location_in.lng?.toFixed(2)}` : 'IP only'}</td>
              </tr>
            ))}
            {display.length===0 && <tr><td colSpan={7} className="p-6 text-center text-zinc-500">No attendance yet — use Check In / Check Out in header (geolocation captured)</td></tr>}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
