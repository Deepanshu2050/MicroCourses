import { useEffect, useState } from 'react'
import { useAuth } from '../state/AuthContext.jsx'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

export default function CreatorDashboard() {
  const { token } = useAuth()
  const [course, setCourse] = useState({ title: '', description: '' })
  const [lesson, setLesson] = useState({ courseId: '', title: '', content: '', order: 1 })

  const createCourse = async () => {
    const r = await fetch(`${API}/creator/courses`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(course) })
    const j = await r.json()
    if (j._id) {
      alert('Course created')
      setLesson((l) => ({ ...l, courseId: j._id }))
    } else alert(j.error || 'Error')
  }

  const addLesson = async () => {
    const r = await fetch(`${API}/creator/courses/${lesson.courseId}/lessons`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ title: lesson.title, content: lesson.content, order: Number(lesson.order) }) })
    const j = await r.json()
    alert(j._id ? 'Lesson added' : j.error || 'Error')
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Creator Dashboard</h1>
      <h3>Create Course</h3>
      <input placeholder="Title" value={course.title} onChange={e => setCourse({ ...course, title: e.target.value })} />
      <br />
      <textarea placeholder="Description" value={course.description} onChange={e => setCourse({ ...course, description: e.target.value })} rows={4} style={{ width: 400 }} />
      <div><button onClick={createCourse}>Create</button></div>

      <h3 style={{ marginTop: 24 }}>Add Lesson</h3>
      <input placeholder="Course ID" value={lesson.courseId} onChange={e => setLesson({ ...lesson, courseId: e.target.value })} />
      <br />
      <input placeholder="Lesson title" value={lesson.title} onChange={e => setLesson({ ...lesson, title: e.target.value })} />
      <br />
      <textarea placeholder="Content" value={lesson.content} onChange={e => setLesson({ ...lesson, content: e.target.value })} rows={4} style={{ width: 400 }} />
      <br />
      <input type="number" placeholder="Order" value={lesson.order} onChange={e => setLesson({ ...lesson, order: e.target.value })} />
      <div><button onClick={addLesson}>Add Lesson</button></div>
    </div>
  )
}


