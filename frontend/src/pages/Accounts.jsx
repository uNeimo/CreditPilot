import { useState, useEffect } from 'react'
import api from '../api/client'

const s = {
  page: { padding: '2rem', minHeight: 'calc(100vh - 60px)', background: '#0f172a' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  heading: { fontSize: '1.5rem', fontWeight: '700', color: '#f1f5f9' },
  btn: { background: '#38bdf8', color: '#0f172a', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' },
  card: { background: '#1e293b', borderRadius: '12px', padding: '1.5rem', border: '1px solid #334155' },
  cardName: { fontWeight: '700', fontSize: '1.1rem', color: '#f1f5f9', marginBottom: '0.8rem' },
  row: { display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.9rem', marginBottom: '0.4rem' },
  bar: { height: '6px', background: '#334155', borderRadius: '3px', marginTop: '0.8rem', overflow: 'hidden' },
  barFill: (pct) => ({ height: '100%', width: `${Math.min(pct, 100)}%`, background: pct > 70 ? '#ef4444' : pct > 30 ? '#f59e0b' : '#22c55e', borderRadius: '3px' }),
  actions: { display: 'flex', gap: '0.5rem', marginTop: '1rem' },
  delBtn: { background: '#ef444420', color: '#ef4444', border: '1px solid #ef4444', padding: '0.3rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' },
  payBtn: { background: '#38bdf820', color: '#38bdf8', border: '1px solid #38bdf8', padding: '0.3rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' },
  modal: { position: 'fixed', inset: 0, background: '#00000080', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 },
  modalCard: { background: '#1e293b', borderRadius: '12px', padding: '2rem', width: '400px', border: '1px solid #334155' },
  modalTitle: { fontWeight: '700', fontSize: '1.2rem', color: '#f1f5f9', marginBottom: '1.2rem' },
  label: { display: 'block', color: '#94a3b8', fontSize: '0.85rem', marginBottom: '0.3rem' },
  input: { width: '100%', padding: '0.6rem 0.9rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#e2e8f0', fontSize: '0.9rem', marginBottom: '1rem', outline: 'none' },
  modalBtns: { display: 'flex', gap: '0.8rem', justifyContent: 'flex-end', marginTop: '0.5rem' },
  cancelBtn: { background: 'transparent', color: '#94a3b8', border: '1px solid #334155', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer' },
  submitBtn: { background: '#38bdf8', color: '#0f172a', border: 'none', padding: '0.5rem 1.2rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
}

export default function Accounts() {
  const [accounts, setAccounts] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [showPayModal, setShowPayModal] = useState(null)
  const [form, setForm] = useState({ name: '', credit_limit: '', current_balance: '', due_date: '' })
  const [payAmount, setPayAmount] = useState('')

  const load = () => api.get('/accounts/').then(r => setAccounts(r.data))
  useEffect(() => { load() }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    await api.post('/accounts/', { name: form.name, credit_limit: +form.credit_limit, current_balance: +form.current_balance, due_date: form.due_date ? +form.due_date : null })
    setShowModal(false)
    setForm({ name: '', credit_limit: '', current_balance: '', due_date: '' })
    load()
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this account?')) return
    await api.delete(`/accounts/${id}`)
    load()
  }

  const handlePay = async (e) => {
    e.preventDefault()
    await api.post(`/accounts/${showPayModal}/payments`, { amount: +payAmount })
    setShowPayModal(null)
    setPayAmount('')
    load()
  }

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div style={s.heading}>Credit Accounts</div>
        <button style={s.btn} onClick={() => setShowModal(true)}>+ Add Account</button>
      </div>

      <div style={s.grid}>
        {accounts.length === 0 && <div style={{ color: '#64748b' }}>No accounts yet. Add one to get started.</div>}
        {accounts.map(acc => {
          const pct = acc.credit_limit > 0 ? (acc.current_balance / acc.credit_limit) * 100 : 0
          return (
            <div key={acc.id} style={s.card}>
              <div style={s.cardName}>{acc.name}</div>
              <div style={s.row}><span>Balance</span><span>${acc.current_balance.toLocaleString()}</span></div>
              <div style={s.row}><span>Limit</span><span>${acc.credit_limit.toLocaleString()}</span></div>
              <div style={s.row}><span>Utilization</span><span style={{ color: pct > 70 ? '#ef4444' : pct > 30 ? '#f59e0b' : '#22c55e' }}>{pct.toFixed(1)}%</span></div>
              {acc.due_date && <div style={s.row}><span>Due Day</span><span>{acc.due_date}</span></div>}
              <div style={s.bar}><div style={s.barFill(pct)} /></div>
              <div style={s.actions}>
                <button style={s.payBtn} onClick={() => setShowPayModal(acc.id)}>Log Payment</button>
                <button style={s.delBtn} onClick={() => handleDelete(acc.id)}>Delete</button>
              </div>
            </div>
          )
        })}
      </div>

      {showModal && (
        <div style={s.modal}>
          <div style={s.modalCard}>
            <div style={s.modalTitle}>Add Credit Account</div>
            <form onSubmit={handleCreate}>
              <label style={s.label}>Account Name</label>
              <input style={s.input} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="Chase Sapphire" />
              <label style={s.label}>Credit Limit ($)</label>
              <input style={s.input} type="number" value={form.credit_limit} onChange={e => setForm({ ...form, credit_limit: e.target.value })} required placeholder="5000" />
              <label style={s.label}>Current Balance ($)</label>
              <input style={s.input} type="number" value={form.current_balance} onChange={e => setForm({ ...form, current_balance: e.target.value })} placeholder="0" />
              <label style={s.label}>Due Date (day of month)</label>
              <input style={s.input} type="number" min="1" max="31" value={form.due_date} onChange={e => setForm({ ...form, due_date: e.target.value })} placeholder="15" />
              <div style={s.modalBtns}>
                <button type="button" style={s.cancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" style={s.submitBtn}>Add Account</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showPayModal && (
        <div style={s.modal}>
          <div style={s.modalCard}>
            <div style={s.modalTitle}>Log Payment</div>
            <form onSubmit={handlePay}>
              <label style={s.label}>Payment Amount ($)</label>
              <input style={s.input} type="number" value={payAmount} onChange={e => setPayAmount(e.target.value)} required placeholder="200" />
              <div style={s.modalBtns}>
                <button type="button" style={s.cancelBtn} onClick={() => setShowPayModal(null)}>Cancel</button>
                <button type="submit" style={s.submitBtn}>Log Payment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
