import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Attendance from './pages/Attendance'
import TimeOff from './pages/TimeOff'
import Reports from './pages/Reports'
import Layout from './components/Layout'
import { useAuth } from './stores/auth'

const qc = new QueryClient()

function Protected({children}:{children:React.ReactNode}){
  const { token } = useAuth()
  if(!token) return <Navigate to="/login" replace/>
  return <>{children}</>
}

export default function App(){
  return (
    <QueryClientProvider client={qc}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login/>}/>
          <Route path="/signup" element={<Signup/>}/>
          <Route element={<Protected><Layout/></Protected>}>
            <Route path="/" element={<Dashboard/>}/>
            <Route path="/profile/:id" element={<Profile/>}/>
            <Route path="/me" element={<Profile/>}/>
            <Route path="/attendance" element={<Attendance/>}/>
            <Route path="/time-off" element={<TimeOff/>}/>
            <Route path="/reports" element={<Reports/>}/>
          </Route>
          <Route path="*" element={<Navigate to="/" replace/>}/>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
