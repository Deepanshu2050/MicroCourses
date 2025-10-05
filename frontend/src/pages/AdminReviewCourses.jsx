import { useEffect, useState } from 'react'
import { useAuth } from '../state/AuthContext.jsx'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

export default function AdminReviewCourses() {
  const { token } = useAuth()
  const [apps, setApps] = useState([])
  const [courseId, setCourseId] = useState('')

  const load = async () => {
    const r = await fetch(`${API}/admin/creator-applications`, { headers: { Authorization: `Bearer ${token}` } })
    const j = await r.json()
    setApps(Array.isArray(j) ? j : [])
  }

  useEffect(() => { load() }, [])

  const approve = async (id) => {
    await fetch(`${API}/admin/creator-applications/${id}/approve`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } })
    await load()
  }

  const publish = async () => {
    const r = await fetch(`${API}/admin/courses/${courseId}/publish`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } })
    const j = await r.json()
    alert(j._id ? 'Published' : j.error || 'Error')
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Admin Review</h1>
      <h3>Creator Applications</h3>
      <ul>
        {apps.map(a => (
          <li key={a._id}>
            {a.user?.email} — {a.bio}
            <button style={{ marginLeft: 8 }} onClick={() => approve(a._id)}>Approve</button>
          </li>
        ))}
      </ul>
      <h3 style={{ marginTop: 24 }}>Publish Course</h3>
      <input placeholder="Course ID" value={courseId} onChange={e => setCourseId(e.target.value)} />
      <button onClick={publish}>Publish</button>
    </div>
  )
}


