import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Attendance from './pages/Attendance'
import TimeOff from './pages/TimeOff'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import Layout from './components/Layout'
import { useAuth } from './stores/auth'

const qc = new QueryClient()

function ThemeInit(){
  // ensure saved theme is applied even on pages without ThemeToggle
  // (Landing is white-only visually, but underlying html class still dictates app theme)
  if(typeof window !== 'undefined'){
    const saved = localStorage.getItem('Dayfloww-theme')
    if(saved === 'dark') document.documentElement.classList.add('dark')
    else if(saved === 'light') document.documentElement.classList.remove('dark')
  }
  return null
}

function Protected({children}:{children:React.ReactNode}){
  const { token } = useAuth()
  if(!token) return <Navigate to="/login" replace/>
  return <>{children}</>
}

export default function App(){
  return (
    <QueryClientProvider client={qc}>
      <ThemeInit/>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/signup" element={<Signup/>}/>
          <Route element={<Protected><Layout/></Protected>}>
            <Route path="/dashboard" element={<Dashboard/>}/>
            <Route path="/profile/:id" element={<Profile/>}/>
            <Route path="/me" element={<Profile/>}/>
            <Route path="/attendance" element={<Attendance/>}/>
            <Route path="/time-off" element={<TimeOff/>}/>
            <Route path="/reports" element={<Reports/>}/>
            <Route path="/settings" element={<Settings/>}/>
          </Route>
          <Route path="*" element={<Navigate to="/" replace/>}/>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
