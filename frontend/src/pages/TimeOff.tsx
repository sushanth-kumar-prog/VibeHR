import { useEffect, useState } from 'react'
import { api } from '../api/client'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { useAuth } from '../stores/auth'

export default function TimeOff(){
  const { user } = useAuth()
  const isAdmin = user?.role==='admin' || user?.role==='hr'
  const [myLeaves,setMyLeaves]=useState<any[]>([])
  const [queue,setQueue]=useState<any[]>([])
  const [balances,setBalances]=useState<any>(null)
  const [form,setForm]=useState({type:'paid', start_date:'', end_date:'', reason:'', doc_url:''})
  const [msg,setMsg]=useState('')

  const loadMy = async()=>{
    const {data}=await api.get('/leave/my')
    setMyLeaves(data)
    try{ const b=await api.get('/leave/balances'); setBalances(b.data)}catch{}
  }
  const loadQueue = async()=>{
    if(!isAdmin) return
    const {data}=await api.get('/leave/queue')
    setQueue(data)
  }
  useEffect(()=>{ loadMy(); loadQueue() },[])

  const submit = async(e:React.FormEvent)=>{
    e.preventDefault(); setMsg('')
    try{
      await api.post('/leave/request', form)
      setMsg('Request submitted — Pending approval')
      setForm({type:'paid', start_date:'', end_date:'', reason:'', doc_url:''})
      loadMy()
    }catch(ex:any){ setMsg(ex.response?.data?.detail || 'Failed')}
  }

  const decide = async(id:string, action:'approve'|'reject')=>{
    await api.post(`/leave/${id}/${action}`, {comment: action})
    loadQueue()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Time Off</h1>
      {balances && <div className="text-sm text-zinc-400">Balances — Paid: {balances.paid_remaining} days • Sick: {balances.sick_remaining} days • Unpaid taken: {balances.unpaid_taken}</div>}

      {isAdmin ? (
        <Card className="overflow-auto">
          <div className="p-3 flex justify-between items-center">
            <h3 className="font-semibold">Leave Queue — Admin/HR (All Employees)</h3>
            <Button size="sm" variant="outline" onClick={loadQueue}>Refresh</Button>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-zinc-900 text-zinc-400 text-xs"><tr><th className="text-left p-2">Employee</th><th className="text-left p-2">Type</th><th className="text-left p-2">Start</th><th className="text-left p-2">End</th><th className="text-left p-2">Days</th><th className="text-left p-2">Status</th><th className="text-left p-2">Action</th></tr></thead>
            <tbody>
              {queue.map(q=>(
                <tr key={q.id} className="border-t border-zinc-800">
                  <td className="p-2"><div className="font-medium">{q.name}</div><div className="text-xs text-zinc-500">{q.employee_id}</div></td>
                  <td className="p-2">{q.type}</td>
                  <td className="p-2">{q.start_date}</td>
                  <td className="p-2">{q.end_date}</td>
                  <td className="p-2">{q.days}</td>
                  <td className="p-2"><span className={`px-2 py-0.5 rounded text-xs ${q.status==='pending'?'bg-amber-900 text-amber-200': q.status==='approved'?'bg-green-900 text-green-200':'bg-red-900 text-red-200'}`}>{q.status}</span></td>
                  <td className="p-2 flex gap-1">{q.status==='pending' && <><Button size="sm" onClick={()=>decide(q.id,'approve')}>Approve</Button><Button size="sm" variant="outline" onClick={()=>decide(q.id,'reject')}>Reject</Button></>}</td>
                </tr>
              ))}
              {queue.length===0 && <tr><td colSpan={7} className="p-6 text-center text-zinc-500">No leave requests</td></tr>}
            </tbody>
          </table>
        </Card>
      ) : null}

      <div className="grid lg:grid-cols-[1fr_380px] gap-4">
        <Card className="p-4">
          <h3 className="font-semibold mb-3">My Time Off — Calendar View</h3>
          <div className="grid grid-cols-3 gap-2 text-xs">
            {Array.from({length:12}).map((_,i)=>{
              const month = new Date(0,i).toLocaleString('default',{month:'short'})
              const monthLeaves = myLeaves.filter(l=>{
                const d = new Date(l.start_date)
                return d.getMonth()===i
              })
              return (
                <div key={i} className="border border-zinc-800 rounded p-2 bg-zinc-900/30">
                  <div className="font-medium">{month}</div>
                  {monthLeaves.map(l=>(
                    <div key={l.id} className={`mt-1 px-1 py-0.5 rounded text-[10px] ${l.status==='pending'?'bg-amber-900': l.status==='approved'?'bg-green-900':'bg-red-900'}`}>{l.start_date.slice(5)} → {l.end_date.slice(5)} {l.type}</div>
                  ))}
                </div>
              )
            })}
          </div>
          <div className="mt-4 space-y-2">
            <h4 className="text-sm font-medium">My Requests</h4>
            {myLeaves.map(l=>(
              <div key={l.id} className="flex justify-between items-center border border-zinc-800 rounded p-2 text-sm">
                <div>{l.start_date} → {l.end_date} • {l.type} • {l.days}d</div>
                <span className={`px-2 py-0.5 rounded text-xs ${l.status==='pending'?'bg-amber-900': l.status==='approved'?'bg-green-900':'bg-red-900'}`}>{l.status}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4 space-y-3 h-fit">
          <h3 className="font-semibold">Time-off Type Request</h3>
          <form onSubmit={submit} className="space-y-3">
            <select value={form.type} onChange={e=>setForm({...form, type:e.target.value})} className="w-full h-10 rounded-md border border-zinc-800 bg-zinc-900 px-3 text-sm">
              <option value="paid">Paid Time Off</option>
              <option value="sick">Sick Leave</option>
              <option value="unpaid">Unpaid Leave</option>
            </select>
            <div>
              <label className="text-xs text-zinc-500">Validity Period</label>
              <div className="flex gap-2">
                <Input type="date" value={form.start_date} onChange={e=>setForm({...form, start_date:e.target.value})} required/>
                <Input type="date" value={form.end_date} onChange={e=>setForm({...form, end_date:e.target.value})} required/>
              </div>
            </div>
            <Input placeholder="Reason / description" value={form.reason} onChange={e=>setForm({...form, reason:e.target.value})}/>
            <Input placeholder="Doc URL (optional, for sick cert)" value={form.doc_url} onChange={e=>setForm({...form, doc_url:e.target.value})}/>
            <div className="text-xs text-zinc-500">Types: Paid • Sick • Unpaid | Paid 24 days / Sick 7 days per year. Attachment required for sick if &gt;2 days.</div>
            <Button type="submit" className="w-full">Request</Button>
            {msg && <div className="text-sm p-2 rounded bg-zinc-900 border border-zinc-800">{msg}</div>}
          </form>
          <div className="rounded bg-zinc-900 border border-zinc-800 p-3 text-xs text-zinc-400">
            <div className="font-semibold text-zinc-300">Note</div>
            <div>Employees can only see their own time-off records, while Admins and HR Officers can view & approve/reject for all employees.</div>
          </div>
        </Card>
      </div>
    </div>
  )
}
