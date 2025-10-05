import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import { AuthProvider } from './state/AuthContext.jsx'
import App from './App.jsx'
import Courses from './pages/Courses.jsx'
import CourseDetail from './pages/CourseDetail.jsx'
import LearnLesson from './pages/LearnLesson.jsx'
import Progress from './pages/Progress.jsx'
import CreatorApply from './pages/CreatorApply.jsx'
import CreatorDashboard from './pages/CreatorDashboard.jsx'
import AdminReviewCourses from './pages/AdminReviewCourses.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Courses /> },
      { path: 'courses', element: <Courses /> },
      { path: 'courses/:id', element: <CourseDetail /> },
      { path: 'learn/:lessonId', element: <LearnLesson /> },
      { path: 'progress', element: <Progress /> },
      { path: 'creator/apply', element: <CreatorApply /> },
      { path: 'creator/dashboard', element: <CreatorDashboard /> },
      { path: 'admin/review/courses', element: <AdminReviewCourses /> }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
