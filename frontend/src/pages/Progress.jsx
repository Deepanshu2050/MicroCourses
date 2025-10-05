import { useEffect, useState } from 'react'
import { useAuth } from '../state/AuthContext.jsx'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

export default function Progress() {
  const { token } = useAuth()
  const [items, setItems] = useState([])
  useEffect(() => {
    fetch(`${API}/learner/progress`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(setItems)
  }, [token])
  const issue = async (courseId) => {
    const r = await fetch(`${API}/learner/courses/${courseId}/certificate`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } })
    const j = await r.json()
    alert(j.serialHash ? `Certificate: ${j.serialHash}` : (j.error || 'Error'))
  }
  return (
    <div style={{ padding: 24 }}>
      <h1>My Progress</h1>
      <ul>
        {items.map(e => (
          <li key={e._id}>
            {e.course?.title} — {e.progressPercent}%
            {e.progressPercent === 100 && (
              <button style={{ marginLeft: 8 }} onClick={() => issue(e.course._id)}>Get Certificate</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}


