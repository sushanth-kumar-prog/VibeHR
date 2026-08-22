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

  const fetchToday = async()=> {
    try { const {data}=await api.get('/attendance/today'); setToday(data)} catch {}
  }
  useEffect(()=>{ fetchToday() },[loc.pathname])

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
            {!today?.checked_in ? (
              <Button size="sm" disabled={checking} onClick={()=>handleCheck('in')}>Check In</Button>
            ) : !today?.checked_out ? (
              <Button size="sm" variant="outline" disabled={checking} onClick={()=>handleCheck('out')}>Check Out</Button>
            ) : (
              <span className="text-xs text-zinc-500">Done for today • {today?.working_hours ?? '-'}h • {today?.status}</span>
            )}
            <div className="relative">
              <button onClick={()=>setShowProfile(s=>!s)} className="h-8 w-8 rounded-full bg-[#a855f7] flex items-center justify-center text-sm font-bold">
                {(user?.first_name?.[0]||'U')}{(user?.last_name?.[0]||'')}
              </button>
              {showProfile && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg border border-zinc-800 bg-zinc-900 p-2 shadow-xl">
                  <div className="px-2 py-1 text-xs text-zinc-400">{user?.employee_id} • {user?.role}</div>
                  <div className="px-2 py-1 text-sm font-medium">{user?.first_name} {user?.last_name}</div>
                  <div className="px-2 text-xs text-zinc-500 truncate">{user?.email}</div>
                  <div className="my-2 border-t border-zinc-800"/>
                  <Link to="/me" onClick={()=>setShowProfile(false)} className="block px-2 py-1.5 text-sm hover:bg-zinc-800 rounded">My Profile</Link>
                  <button onClick={()=>{logout(); nav('/login')}} className="w-full text-left px-2 py-1.5 text-sm hover:bg-zinc-800 rounded">Log Out</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-[1400px] px-4 py-6">
        <Outlet/>
      </main>
    </div>
  )
}
