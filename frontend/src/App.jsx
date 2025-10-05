import './App.css'
import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useAuth } from './state/AuthContext.jsx'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

function App() {
  const { token, setToken, role, setRole } = useAuth()
  const [email, setEmail] = useState('user@example.com')
  const [password, setPassword] = useState('password')
  const [name, setName] = useState('User')

  const signup = async () => {
    await fetch(`${API}/creator/auth/signup`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, password }) })
    alert('Signed up. Now login')
  }
  const login = async () => {
    const r = await fetch(`${API}/creator/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) })
    const j = await r.json()
    if (j.token) { setToken(j.token); setRole(j.role) } else { alert(j.error || 'Error') }
  }
  const logout = () => { setToken(''); setRole('learner') }

  return (
    <>
      <div style={{ padding: 12, borderBottom: '1px solid #ddd', display: 'flex', gap: 8, alignItems: 'center' }}>
        {token ? (
          <>
            <span>Logged in as {role}</span>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
            <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
            <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
            <button onClick={signup}>Signup</button>
            <button onClick={login}>Login</button>
          </>
        )}
      </div>
      <Outlet />
    </>
  )
}

export default App
