import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

export default function Courses() {
  const [courses, setCourses] = useState([])
  useEffect(() => {
    fetch(`${API}/learner/courses`).then(r => r.json()).then(setCourses)
  }, [])
  return (
    <div style={{ padding: 24 }}>
      <h1>Courses</h1>
      <ul>
        {courses.map(c => (
          <li key={c._id}>
            <Link to={`/courses/${c._id}`}>{c.title}</Link>
          </li>
        ))}
      </ul>
      <div style={{ marginTop: 16 }}>
        <Link to="/progress">My Progress</Link>
      </div>
    </div>
  )
}


