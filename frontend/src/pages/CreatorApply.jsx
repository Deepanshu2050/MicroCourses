import { useState } from 'react'
import { useAuth } from '../state/AuthContext.jsx'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

export default function CreatorApply() {
  const { token } = useAuth()
  const [bio, setBio] = useState('')
  const apply = async () => {
    const r = await fetch(`${API}/creator/apply`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ bio }) })
    const j = await r.json()
    alert(j._id ? 'Applied' : j.error || 'Error')
  }
  return (
    <div style={{ padding: 24 }}>
      <h1>Apply as Creator</h1>
      <textarea value={bio} onChange={e => setBio(e.target.value)} rows={6} style={{ width: 400 }} />
      <div>
        <button onClick={apply}>Submit</button>
      </div>
    </div>
  )
}


