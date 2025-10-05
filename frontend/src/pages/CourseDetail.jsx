import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../state/AuthContext.jsx'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

export default function CourseDetail() {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const { token } = useAuth()

  useEffect(() => {
    fetch(`${API}/learner/courses/${id}`).then(r => r.json()).then(setData)
  }, [id])

  const enroll = async () => {
    await fetch(`${API}/learner/courses/${id}/enroll`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } })
    alert('Enrolled')
  }

  if (!data) return <div style={{ padding: 24 }}>Loading...</div>
  const { course, lessons } = data
  return (
    <div style={{ padding: 24 }}>
      <h1>{course.title}</h1>
      <p>{course.description}</p>
      <button onClick={enroll}>Enroll</button>
      <h3>Lessons</h3>
      <ol>
        {lessons.map(l => (
          <li key={l._id}><Link to={`/learn/${l._id}`}>{l.title}</Link></li>
        ))}
      </ol>
    </div>
  )
}


