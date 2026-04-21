import { useState, useEffect } from 'react'
import { RadialBarChart, RadialBar, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import api from '../api/client'

const s = {
  page: { padding: '2rem', minHeight: 'calc(100vh - 60px)', background: '#0f172a' },
  heading: { fontSize: '1.5rem', fontWeight: '700', color: '#f1f5f9', marginBottom: '1.5rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' },
  card: { background: '#1e293b', borderRadius: '12px', padding: '1.5rem', border: '1px solid #334155' },
  statLabel: { color: '#64748b', fontSize: '0.85rem', marginBottom: '0.4rem' },
  statValue: { fontSize: '1.8rem', fontWeight: '700', color: '#f1f5f9' },
  statSub: { color: '#64748b', fontSize: '0.8rem', marginTop: '0.3rem' },
  charts: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  chartCard: { background: '#1e293b', borderRadius: '12px', padding: '1.5rem', border: '1px solid #334155' },
  chartTitle: { color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1rem', fontWeight: '600' },
  badge: (color) => ({ display: 'inline-block', background: color, color: '#fff', borderRadius: '20px', padding: '0.2rem 0.7rem', fontSize: '0.8rem', fontWeight: '600' }),
}

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/dashboard/stats').then(r => { setStats(r.data); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  if (loading) return <div style={{ ...s.page, color: '#64748b' }}>Loading dashboard...</div>
  if (!stats) return <div style={{ ...s.page, color: '#f87171' }}>Failed to load stats.</div>

  const utilizationColor = stats.utilization_rate > 70 ? '#ef4444' : stats.utilization_rate > 30 ? '#f59e0b' : '#22c55e'
  const utilizationData = [{ name: 'Used', value: stats.utilization_rate, fill: utilizationColor }, { name: 'Free', value: 100 - stats.utilization_rate, fill: '#1e3a5f' }]
  const debtData = [{ name: 'Paid', value: stats.debt_payoff_progress, fill: '#38bdf8' }, { name: 'Remaining', value: 100 - stats.debt_payoff_progress, fill: '#1e3a5f' }]

  return (
    <div style={s.page}>
      <div style={s.heading}>Financial Overview</div>

      <div style={s.grid}>
        <div style={s.card}>
          <div style={s.statLabel}>Total Credit Limit</div>
          <div style={s.statValue}>${stats.total_credit_limit.toLocaleString()}</div>
          <div style={s.statSub}>{stats.accounts_count} account{stats.accounts_count !== 1 ? 's' : ''}</div>
        </div>
        <div style={s.card}>
          <div style={s.statLabel}>Current Balance</div>
          <div style={{ ...s.statValue, color: utilizationColor }}>${stats.total_balance.toLocaleString()}</div>
          <div style={s.statSub}>{stats.utilization_rate}% utilized</div>
        </div>
        <div style={s.card}>
          <div style={s.statLabel}>Total Debt Remaining</div>
          <div style={s.statValue}>${stats.total_debt_remaining.toLocaleString()}</div>
          <div style={s.statSub}>{stats.active_debts} active debt{stats.active_debts !== 1 ? 's' : ''}</div>
        </div>
        <div style={s.card}>
          <div style={s.statLabel}>Debt Payoff Progress</div>
          <div style={{ ...s.statValue, color: '#38bdf8' }}>{stats.debt_payoff_progress}%</div>
          <div style={s.statSub}>of ${stats.total_debt.toLocaleString()} total</div>
        </div>
      </div>

      <div style={s.charts}>
        <div style={s.chartCard}>
          <div style={s.chartTitle}>Credit Utilization</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <ResponsiveContainer width={160} height={160}>
              <RadialBarChart innerRadius={50} outerRadius={75} data={utilizationData} startAngle={90} endAngle={-270}>
                <RadialBar dataKey="value" cornerRadius={6} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: '700', color: utilizationColor }}>{stats.utilization_rate}%</div>
              <span style={s.badge(utilizationColor)}>{stats.utilization_rate > 70 ? 'High' : stats.utilization_rate > 30 ? 'Moderate' : 'Healthy'}</span>
              <div style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                ${stats.total_balance.toLocaleString()} / ${stats.total_credit_limit.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        <div style={s.chartCard}>
          <div style={s.chartTitle}>Debt Payoff Progress</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <ResponsiveContainer width={160} height={160}>
              <RadialBarChart innerRadius={50} outerRadius={75} data={debtData} startAngle={90} endAngle={-270}>
                <RadialBar dataKey="value" cornerRadius={6} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#38bdf8' }}>{stats.debt_payoff_progress}%</div>
              <span style={s.badge('#38bdf8')}>In Progress</span>
              <div style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                ${(stats.total_debt - stats.total_debt_remaining).toLocaleString()} paid off
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
