import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom'
import { useAuth } from '../stores/auth'
import { Button } from './ui/button'
import { useEffect, useState } from 'react'
import { api } from '../api/client'

export default function Layout(){
  const { user, logout } = useAuth()
  const nav = useNavigate()
  const loc = useLocation()
  const [showProfile, setShowProfile] = useState(false)
  const [today, setToday] = useState<any>(null)
  const [checking, setChecking] = useState(false)
  const [notifs, setNotifs] = useState<any[]>([])
  const [showNotifs, setShowNotifs] = useState(false)

  const fetchToday = async()=> {
    try { const {data}=await api.get('/attendance/today'); setToday(data)} catch {}
  }
  const fetchNotifs = async()=>{ try{ const {data}=await api.get('/notifications'); setNotifs(data)}catch{}}
  useEffect(()=>{ fetchToday(); fetchNotifs() },[loc.pathname])

  const handleCheck = async(type:'in'|'out')=>{
    setChecking(true)
    try{
      const pos = await new Promise<GeolocationPosition>((res, rej)=>{
        if(!navigator.geolocation) return rej('no geo')
        navigator.geolocation.getCurrentPosition(res, rej, {timeout: 5000})
      }).catch(()=> null as any)
      const payload = pos ? {lat: pos.coords.latitude, lng: pos.coords.longitude} : {}
      if(type==='in') await api.post('/attendance/check-in', payload)
      else await api.post('/attendance/check-out', payload)
      await fetchToday()
    } catch(e:any){ alert(e.response?.data?.detail || e.message || 'Failed')}
    finally{ setChecking(false)}
  }

  const tabs = [
    {label:'Employees', path:'/'},
    {label:'Attendance', path:'/attendance'},
    {label:'Time Off', path:'/time-off'},
    {label:'Reports', path:'/reports'},
  ]

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-zinc-800 bg-[#0a0a0f]/90 backdrop-blur">
        <div className="mx-auto max-w-[1400px] px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="font-bold text-lg tracking-tight">VibeHR</Link>
            <nav className="hidden md:flex items-center gap-1">
              {tabs.map(t=>(
                <Link key={t.path} to={t.path} className={`px-3 py-1.5 rounded-md text-sm ${loc.pathname===t.path ? 'bg-zinc-900 text-white' : 'text-zinc-400 hover:text-white'}`}>{t.label}</Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button onClick={()=>setShowNotifs(s=>!s)} className="relative h-8 w-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xs">🔔{notifs.length>0 && <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] flex items-center justify-center text-white">{notifs.length}</span>}</button>
              {showNotifs && (
                <div className="absolute right-0 mt-2 w-80 rounded-lg border border-zinc-800 bg-zinc-900 p-3 shadow-xl max-h-80 overflow-auto">
                  <div className="font-medium text-sm mb-2">Notifications & Email Alerts</div>
                  {notifs.length===0 ? <div className="text-xs text-zinc-500">No alerts — invite/leave actions appear here (mock email via Supabase SMTP would send)</div> :
                    notifs.map(n=>(
                      <div key={n.id} className="border-t border-zinc-800 py-2">
                        <div className="text-xs font-medium">{n.title} <span className="text-zinc-500">• {new Date(n.created_at).toLocaleString()}</span></div>
                        <div className="text-xs text-zinc-400">{n.message}</div>
                      </div>
                    ))}
                </div>
              )}
            </div>
            {!today?.checked_in ? (
              <Button size="sm" disabled={checking} onClick={()=>handleCheck('in')}>Check In ({today?.status || 'absent'})</Button>
            ) : !today?.checked_out ? (
              <Button size="sm" variant="outline" disabled={checking} onClick={()=>handleCheck('out')}>Check Out • {today?.status}</Button>
            ) : (
              <span className="text-xs text-zinc-500">Done today • {today?.working_hours ?? '-'}h • {today?.status}</span>
            )}
            <div className="relative">
              <button onClick={()=>setShowProfile(s=>!s)} className="h-8 w-8 rounded-full bg-[#a855f7] flex items-center justify-center text-sm font-bold">
                {(user?.first_name?.[0]||'U')}{(user?.last_name?.[0]||'')}
                <span className={`absolute -top-1 -right-1 h-3 w-3 rounded-full border-2 border-[#0a0a0f] ${today?.status==='present' ? 'bg-green-500' : today?.status==='half_day' ? 'bg-amber-500' : today?.status==='leave' ? 'bg-yellow-500' : 'bg-red-500'}`} />
              </button>
              {showProfile && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg border border-zinc-800 bg-zinc-900 p-2 shadow-xl">
                  <div className="px-2 py-1 text-xs text-zinc-400">{user?.employee_id} • {user?.role}</div>
                  <div className="px-2 py-1 text-sm font-medium">{user?.first_name} {user?.last_name}</div>
                  <div className="px-2 text-xs text-zinc-500 truncate">{user?.email}</div>
                  <div className="my-2 border-t border-zinc-800"/>
                  <Link to="/me" onClick={()=>setShowProfile(false)} className="block px-2 py-1.5 text-sm hover:bg-zinc-800 rounded">My Profile</Link>
                  <Link to="/reports" onClick={()=>setShowProfile(false)} className="block px-2 py-1.5 text-sm hover:bg-zinc-800 rounded">Reports</Link>
                  <button onClick={()=>{logout(); nav('/login')}} className="w-full text-left px-2 py-1.5 text-sm hover:bg-zinc-800 rounded">Log Out</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      {(user as any)?.email_verified===false && (
        <div className="bg-amber-900/50 border-b border-amber-800 text-amber-200 text-xs px-4 py-2 flex justify-between">
          <span>Email verification required — check your invite email or fetch token via API /auth/verify-token/{user?.id}</span>
          <button onClick={async()=>{ const t=await api.get(`/auth/verify-token/${user?.id}`); await api.post('/auth/verify-email',{token:t.data.token}); alert('Verified!'); window.location.reload()}} className="underline">Verify Now (mock)</button>
        </div>
      )}
      <main className="mx-auto max-w-[1400px] px-4 py-6">
        <Outlet/>
      </main>
    </div>
  )
}
