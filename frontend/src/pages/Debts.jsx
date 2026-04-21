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
  barFill: (pct) => ({ height: '100%', width: `${Math.min(pct, 100)}%`, background: '#38bdf8', borderRadius: '3px', transition: 'width 0.3s' }),
  badge: (done) => ({ display: 'inline-block', background: done ? '#22c55e20' : '#f59e0b20', color: done ? '#22c55e' : '#f59e0b', border: `1px solid ${done ? '#22c55e' : '#f59e0b'}`, borderRadius: '20px', padding: '0.2rem 0.7rem', fontSize: '0.8rem', marginBottom: '0.8rem' }),
  actions: { display: 'flex', gap: '0.5rem', marginTop: '1rem' },
  delBtn: { background: '#ef444420', color: '#ef4444', border: '1px solid #ef4444', padding: '0.3rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' },
  payBtn: { background: '#38bdf820', color: '#38bdf8', border: '1px solid #38bdf8', padding: '0.3rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' },
  modal: { position: 'fixed', inset: 0, background: '#00000080', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 },
  modalCard: { background: '#1e293b', borderRadius: '12px', padding: '2rem', width: '420px', border: '1px solid #334155', maxHeight: '90vh', overflowY: 'auto' },
  modalTitle: { fontWeight: '700', fontSize: '1.2rem', color: '#f1f5f9', marginBottom: '1.2rem' },
  label: { display: 'block', color: '#94a3b8', fontSize: '0.85rem', marginBottom: '0.3rem' },
  input: { width: '100%', padding: '0.6rem 0.9rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#e2e8f0', fontSize: '0.9rem', marginBottom: '1rem', outline: 'none' },
  modalBtns: { display: 'flex', gap: '0.8rem', justifyContent: 'flex-end', marginTop: '0.5rem' },
  cancelBtn: { background: 'transparent', color: '#94a3b8', border: '1px solid #334155', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer' },
  submitBtn: { background: '#38bdf8', color: '#0f172a', border: 'none', padding: '0.5rem 1.2rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
}

export default function Debts() {
  const [debts, setDebts] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [showPayModal, setShowPayModal] = useState(null)
  const [form, setForm] = useState({ name: '', total_amount: '', remaining_amount: '', interest_rate: '', minimum_payment: '', due_date: '' })
  const [payAmount, setPayAmount] = useState('')

  const load = () => api.get('/debts/').then(r => setDebts(r.data))
  useEffect(() => { load() }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    await api.post('/debts/', {
      name: form.name,
      total_amount: +form.total_amount,
      remaining_amount: +form.remaining_amount,
      interest_rate: +form.interest_rate || 0,
      minimum_payment: +form.minimum_payment || 0,
      due_date: form.due_date ? +form.due_date : null,
    })
    setShowModal(false)
    setForm({ name: '', total_amount: '', remaining_amount: '', interest_rate: '', minimum_payment: '', due_date: '' })
    load()
  }

  const handlePay = async (e) => {
    e.preventDefault()
    const debt = debts.find(d => d.id === showPayModal)
    const newRemaining = Math.max(0, debt.remaining_amount - +payAmount)
    await api.put(`/debts/${showPayModal}`, { remaining_amount: newRemaining, is_paid_off: newRemaining === 0 })
    setShowPayModal(null)
    setPayAmount('')
    load()
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this debt?')) return
    await api.delete(`/debts/${id}`)
    load()
  }

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div style={s.heading}>Debt Tracker</div>
        <button style={s.btn} onClick={() => setShowModal(true)}>+ Add Debt</button>
      </div>

      <div style={s.grid}>
        {debts.length === 0 && <div style={{ color: '#64748b' }}>No debts tracked. Add one to start tracking payoff progress.</div>}
        {debts.map(debt => {
          const paid = debt.total_amount - debt.remaining_amount
          const pct = debt.total_amount > 0 ? (paid / debt.total_amount) * 100 : 0
          return (
            <div key={debt.id} style={s.card}>
              <div style={s.cardName}>{debt.name}</div>
              <div style={s.badge(debt.is_paid_off)}>{debt.is_paid_off ? '✓ Paid Off' : 'In Progress'}</div>
              <div style={s.row}><span>Remaining</span><span style={{ color: '#f87171' }}>${debt.remaining_amount.toLocaleString()}</span></div>
              <div style={s.row}><span>Total</span><span>${debt.total_amount.toLocaleString()}</span></div>
              <div style={s.row}><span>Interest Rate</span><span>{debt.interest_rate}%</span></div>
              <div style={s.row}><span>Min Payment</span><span>${debt.minimum_payment}/mo</span></div>
              {debt.due_date && <div style={s.row}><span>Due Day</span><span>{debt.due_date}</span></div>}
              <div style={s.bar}><div style={s.barFill(pct)} /></div>
              <div style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '0.4rem' }}>{pct.toFixed(1)}% paid off</div>
              {!debt.is_paid_off && (
                <div style={s.actions}>
                  <button style={s.payBtn} onClick={() => setShowPayModal(debt.id)}>Log Payment</button>
                  <button style={s.delBtn} onClick={() => handleDelete(debt.id)}>Delete</button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {showModal && (
        <div style={s.modal}>
          <div style={s.modalCard}>
            <div style={s.modalTitle}>Add Debt</div>
            <form onSubmit={handleCreate}>
              <label style={s.label}>Debt Name</label>
              <input style={s.input} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="Student Loan" />
              <label style={s.label}>Total Amount ($)</label>
              <input style={s.input} type="number" value={form.total_amount} onChange={e => setForm({ ...form, total_amount: e.target.value })} required placeholder="10000" />
              <label style={s.label}>Remaining Amount ($)</label>
              <input style={s.input} type="number" value={form.remaining_amount} onChange={e => setForm({ ...form, remaining_amount: e.target.value })} required placeholder="8000" />
              <label style={s.label}>Interest Rate (%)</label>
              <input style={s.input} type="number" step="0.01" value={form.interest_rate} onChange={e => setForm({ ...form, interest_rate: e.target.value })} placeholder="5.5" />
              <label style={s.label}>Minimum Monthly Payment ($)</label>
              <input style={s.input} type="number" value={form.minimum_payment} onChange={e => setForm({ ...form, minimum_payment: e.target.value })} placeholder="150" />
              <label style={s.label}>Due Date (day of month)</label>
              <input style={s.input} type="number" min="1" max="31" value={form.due_date} onChange={e => setForm({ ...form, due_date: e.target.value })} placeholder="1" />
              <div style={s.modalBtns}>
                <button type="button" style={s.cancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" style={s.submitBtn}>Add Debt</button>
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
              <label style={s.label}>Amount Paid ($)</label>
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
