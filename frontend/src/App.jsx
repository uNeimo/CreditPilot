import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Debts from './pages/Debts'
import Accounts from './pages/Accounts'
import Navbar from './components/Navbar'

function PrivateRoute({ children }) {
  return localStorage.getItem('token') ? children : <Navigate to="/login" />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<PrivateRoute><><Navbar /><Dashboard /></></PrivateRoute>} />
        <Route path="/debts" element={<PrivateRoute><><Navbar /><Debts /></></PrivateRoute>} />
        <Route path="/accounts" element={<PrivateRoute><><Navbar /><Accounts /></></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  )
}
