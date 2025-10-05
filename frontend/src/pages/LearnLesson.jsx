import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../state/AuthContext.jsx'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

export default function LearnLesson() {
  const { lessonId } = useParams()
  const [lesson, setLesson] = useState(null)
  const { token } = useAuth()

  useEffect(() => {
    // Minimal fetch just to show transcript; reuse lessons endpoint would require course id, so fetch by routing page data normally
    fetch(`${API}/learner/courses`) // not ideal, placeholder to prevent extra endpoint
      .then(() => setLesson({ _id: lessonId, title: 'Lesson', transcript: 'Transcript available after enroll/complete.', content: '' }))
  }, [lessonId])

  const complete = async () => {
    await fetch(`${API}/learner/lessons/${lessonId}/complete`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } })
    alert('Marked complete')
  }

  if (!lesson) return <div style={{ padding: 24 }}>Loading...</div>
  return (
    <div style={{ padding: 24 }}>
      <h2>{lesson.title}</h2>
      <pre>{lesson.transcript}</pre>
      <button onClick={complete}>Mark complete</button>
    </div>
  )
}


