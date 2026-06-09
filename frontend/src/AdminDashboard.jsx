import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, getDocs, orderBy, query, limit } from 'firebase/firestore';
import { db } from './firebase';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
const auth = getAuth();

const ADMIN_EMAILS = ['dxcardon@gmail.com'];

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, proUsers: 0, orgUsers: 0, freeUsers: 0, totalGames: 0, totalSeasons: 0 });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u && ADMIN_EMAILS.includes(u.email)) {
        await loadData();
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const loadData = async () => {
    try {
      const usersSnap = await getDocs(query(collection(db, 'users'), orderBy('updatedAt', 'desc'), limit(100)));
      const usersData = usersSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      setUsers(usersData);

      const seasonsSnap = await getDocs(query(collection(db, 'seasons'), limit(200)));
      const seasonsData = seasonsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      setSeasons(seasonsData);

      const totalGames = seasonsData.reduce((sum, s) => sum + (s.schedule?.length || 0), 0);
      setStats({
        totalUsers: usersData.length,
        proUsers: usersData.filter(u => u.plan === 'pro').length,
        orgUsers: usersData.filter(u => u.plan === 'org').length,
        freeUsers: usersData.filter(u => !u.plan || u.plan === 'free').length,
        totalGames,
        totalSeasons: seasonsData.length,
      });
    } catch (e) { console.error('Admin load error', e); }
  };

  if (loading) return <div style={{ background: '#020617', color: '#64748b', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>Loading...</div>;

  if (!user || !ADMIN_EMAILS.includes(user.email)) {
    return (
      <div style={{ background: '#020617', color: '#fff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '12px' }}>
        <div style={{ fontSize: '32px' }}>🔒</div>
        <div style={{ fontSize: '16px', fontWeight: '700' }}>Admin access only</div>
        <a href="/" style={{ color: '#38bdf8', fontSize: '13px' }}>← Back to app</a>
      </div>
    );
  }

  const proRevenue = stats.proUsers * 6.99;
  const orgRevenue = stats.orgUsers * 39;
  const mrr = proRevenue + orgRevenue;

  return (
    <div style={{ background: '#020617', color: '#fff', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>

      {/* NAV */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 28px', borderBottom: '1px solid #1e293b', background: '#07101f' }}>
        <div style={{ fontSize: '16px', fontWeight: '900', color: '#38bdf8' }}>⚾ GameTracker <span style={{ color: '#475569', fontWeight: '400', fontSize: '12px' }}>/ Admin</span></div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: '#475569' }}>{user.email}</span>
          <a href="/" style={{ color: '#64748b', fontSize: '12px', textDecoration: 'none' }}>← Back to app</a>
        </div>
      </nav>

      <div style={{ padding: '28px', maxWidth: '1200px', margin: '0 auto' }}>

        {/* STATS GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          {[
            { label: 'Total Users', value: stats.totalUsers, color: '#38bdf8', icon: '👥' },
            { label: 'Pro Coaches', value: stats.proUsers, color: '#3b82f6', icon: '⭐' },
            { label: 'Org Plans', value: stats.orgUsers, color: '#a78bfa', icon: '🏟️' },
            { label: 'Free Users', value: stats.freeUsers, color: '#64748b', icon: '🆓' },
            { label: 'Games Scored', value: stats.totalGames, color: '#22c55e', icon: '⚾' },
            { label: 'Est. MRR', value: `$${mrr.toFixed(0)}`, color: '#f59e0b', icon: '💰' },
          ].map(s => (
            <div key={s.label} style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '20px 16px' }}>
              <div style={{ fontSize: '20px', marginBottom: '8px' }}>{s.icon}</div>
              <div style={{ fontSize: '28px', fontWeight: '900', color: s.color, fontFamily: 'monospace' }}>{s.value}</div>
              <div style={{ fontSize: '11px', color: '#475569', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* REVENUE BREAKDOWN */}
        <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '14px', padding: '24px', marginBottom: '28px' }}>
          <div style={{ fontSize: '11px', color: '#475569', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Revenue Breakdown</div>
          <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
            {[
              { label: 'Pro Coach ($6.99 × ' + stats.proUsers + ')', value: '$' + proRevenue.toFixed(2), color: '#3b82f6' },
              { label: 'Organization ($39 × ' + stats.orgUsers + ')', value: '$' + orgRevenue.toFixed(2), color: '#a78bfa' },
              { label: 'Total Est. MRR', value: '$' + mrr.toFixed(2), color: '#f59e0b' },
              { label: 'Annual Run Rate', value: '$' + (mrr * 12).toFixed(0), color: '#22c55e' },
            ].map(r => (
              <div key={r.label}>
                <div style={{ fontSize: '11px', color: '#475569', marginBottom: '4px' }}>{r.label}</div>
                <div style={{ fontSize: '24px', fontWeight: '900', color: r.color, fontFamily: 'monospace' }}>{r.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* USERS TABLE */}
        <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '14px', overflow: 'hidden', marginBottom: '28px' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '13px', fontWeight: '800', color: '#fff' }}>Users ({stats.totalUsers})</div>
            <button onClick={loadData} style={{ background: '#1e293b', border: 'none', color: '#64748b', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', fontSize: '12px' }}>↻ Refresh</button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr style={{ background: '#07101f' }}>
                  {['Email / UID', 'Plan', 'Stripe Customer', 'Updated'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', color: '#475569', textAlign: 'left', borderBottom: '1px solid #1e293b', fontWeight: '700', fontSize: '11px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr><td colSpan={4} style={{ padding: '24px', color: '#334155', textAlign: 'center' }}>No users found</td></tr>
                ) : users.map((u, i) => (
                  <tr key={u.id} style={{ background: i % 2 === 0 ? '#0a1628' : '#0f172a', borderBottom: '1px solid #0f172a' }}>
                    <td style={{ padding: '10px 16px', color: '#94a3b8', fontFamily: 'monospace', fontSize: '11px' }}>{u.email || u.id}</td>
                    <td style={{ padding: '10px 16px' }}>
                      <span style={{ background: u.plan === 'pro' ? 'rgba(59,130,246,0.15)' : u.plan === 'org' ? 'rgba(124,58,237,0.15)' : '#1e293b', color: u.plan === 'pro' ? '#60a5fa' : u.plan === 'org' ? '#a78bfa' : '#475569', borderRadius: '4px', padding: '2px 8px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>
                        {u.plan || 'free'}
                      </span>
                    </td>
                    <td style={{ padding: '10px 16px', color: '#334155', fontFamily: 'monospace', fontSize: '11px' }}>{u.stripeCustomerId || '—'}</td>
                    <td style={{ padding: '10px 16px', color: '#334155', fontSize: '11px' }}>{u.updatedAt ? new Date(u.updatedAt).toLocaleDateString() : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SEASONS TABLE */}
        <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '14px', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #1e293b' }}>
            <div style={{ fontSize: '13px', fontWeight: '800', color: '#fff' }}>Seasons ({stats.totalSeasons}) — {stats.totalGames} games total</div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr style={{ background: '#07101f' }}>
                  {['Season', 'Team', 'Sport', 'Games', 'Last Updated'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', color: '#475569', textAlign: 'left', borderBottom: '1px solid #1e293b', fontWeight: '700', fontSize: '11px', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {seasons.length === 0 ? (
                  <tr><td colSpan={5} style={{ padding: '24px', color: '#334155', textAlign: 'center' }}>No seasons found</td></tr>
                ) : seasons.slice(0, 50).map((s, i) => (
                  <tr key={s.id} style={{ background: i % 2 === 0 ? '#0a1628' : '#0f172a', borderBottom: '1px solid #0f172a' }}>
                    <td style={{ padding: '10px 16px', color: '#94a3b8', fontFamily: 'monospace', fontSize: '11px' }}>{s.id.slice(0, 16)}...</td>
                    <td style={{ padding: '10px 16px', color: '#fff', fontWeight: '600' }}>{s.name || '—'}</td>
                    <td style={{ padding: '10px 16px', color: '#64748b' }}>{s.sport || 'Baseball'}</td>
                    <td style={{ padding: '10px 16px', color: '#22c55e', fontWeight: '700', fontFamily: 'monospace' }}>{s.schedule?.length || 0}</td>
                    <td style={{ padding: '10px 16px', color: '#334155', fontSize: '11px' }}>{s.updatedAt ? new Date(s.updatedAt).toLocaleDateString() : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
