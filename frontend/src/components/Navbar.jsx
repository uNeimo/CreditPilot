import { Link, useNavigate } from 'react-router-dom'

const styles = {
  nav: { background: '#1e293b', padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px', borderBottom: '1px solid #334155' },
  logo: { fontSize: '1.4rem', fontWeight: '700', color: '#38bdf8', textDecoration: 'none' },
  links: { display: 'flex', gap: '1.5rem', listStyle: 'none' },
  link: { color: '#94a3b8', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.2s' },
  btn: { background: '#ef4444', color: '#fff', border: 'none', padding: '0.4rem 1rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem' },
}

export default function Navbar() {
  const navigate = useNavigate()

  const logout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>💳 CreditPilot</Link>
      <ul style={styles.links}>
        <li><Link to="/" style={styles.link}>Dashboard</Link></li>
        <li><Link to="/accounts" style={styles.link}>Accounts</Link></li>
        <li><Link to="/debts" style={styles.link}>Debts</Link></li>
      </ul>
      <button style={styles.btn} onClick={logout}>Logout</button>
    </nav>
  )
}
