import { useEffect, useState } from 'react'
import { api } from '../api/client'
import { Card } from '../components/ui/card'
import Profile from './Profile'
import { useAuth } from '../stores/auth'

export default function Me(){
  const { user } = useAuth()
  const [meData, setMeData] = useState<any>(null)
  useEffect(()=>{ if(user) window.location.hash = `/profile/${user.id}` },[user])
  // redirect to profile page
  if(!user) return <div>Not logged in</div>
  window.location.replace(`/#/profile/${user.id}`)
  return null
}
