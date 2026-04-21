import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/client'

const s = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a' },
  card: { background: '#1e293b', padding: '2.5rem', borderRadius: '12px', width: '100%', maxWidth: '400px', border: '1px solid #334155' },
  title: { fontSize: '1.8rem', fontWeight: '700', color: '#38bdf8', marginBottom: '0.5rem' },
  sub: { color: '#64748b', marginBottom: '2rem', fontSize: '0.9rem' },
  label: { display: 'block', color: '#94a3b8', fontSize: '0.85rem', marginBottom: '0.4rem' },
  input: { width: '100%', padding: '0.7rem 1rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#e2e8f0', fontSize: '0.95rem', marginBottom: '1.2rem', outline: 'none' },
  btn: { width: '100%', padding: '0.8rem', background: '#38bdf8', color: '#0f172a', fontWeight: '700', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem' },
  err: { color: '#f87171', marginBottom: '1rem', fontSize: '0.9rem' },
  link: { color: '#38bdf8', textDecoration: 'none' },
  footer: { textAlign: 'center', marginTop: '1.5rem', color: '#64748b', fontSize: '0.9rem' },
}

export default function Register() {
  const [form, setForm] = useState({ email: '', username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await api.post('/auth/register', form)
      const res = await api.post('/auth/login', { email: form.email, password: form.password })
      localStorage.setItem('token', res.data.access_token)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.title}>💳 CreditPilot</div>
        <div style={s.sub}>Create your account</div>
        {error && <div style={s.err}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <label style={s.label}>Email</label>
          <input style={s.input} type="email" name="email" value={form.email} onChange={handleChange} required placeholder="you@email.com" />
          <label style={s.label}>Username</label>
          <input style={s.input} type="text" name="username" value={form.username} onChange={handleChange} required placeholder="yourname" />
          <label style={s.label}>Password</label>
          <input style={s.input} type="password" name="password" value={form.password} onChange={handleChange} required placeholder="••••••••" />
          <button style={s.btn} type="submit" disabled={loading}>{loading ? 'Creating account...' : 'Create Account'}</button>
        </form>
        <div style={s.footer}>Already have an account? <Link to="/login" style={s.link}>Sign in</Link></div>
      </div>
    </div>
  )
}
