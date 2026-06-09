import React, { useState } from 'react';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

const features = [
  { icon: '⚾', title: 'Live Pitch-by-Pitch Scoring', desc: 'Score every at-bat in real time — balls, strikes, outs, runs. Built for baseball and softball.' },
  { icon: '📊', title: 'Advanced Stats', desc: 'AVG, OBP, SLG, OPS, ERA, WHIP, FIP — automatically calculated from every game you score.' },
  { icon: '🔊', title: 'AI Broadcast Commentary', desc: 'Toggle on broadcast voice and hear a play-by-play call for every plate appearance.' },
  { icon: '📋', title: 'PDF Game Reports', desc: 'One click exports a full game report — box score, batting lines, pitching lines, and play log.' },
  { icon: '🔔', title: 'Fan Push Notifications', desc: 'Families get notified the moment a run scores or the game ends. No app download required.' },
  { icon: '👤', title: 'Recruiting Profiles', desc: 'Every player gets a shareable profile with stats, highlight videos, and recruiting info.' },
  { icon: '🗺️', title: 'Spray Chart', desc: 'Visual hit location chart for every batter — identify tendencies in seconds.' },
  { icon: '📅', title: 'Season Schedule & Game Log', desc: 'Track your full season, reopen past games, and see career stats per player.' },
  { icon: '📡', title: 'Fan GameStream', desc: 'Live public scoreboard page fans can follow from any device, anywhere.' },
];

const testimonials = [
  { name: 'Coach Rivera', team: 'El Paso Longhorns 14U', quote: 'GameTracker replaced three different apps for me. Scoring, stats, and recruiting all in one place.' },
  { name: 'Coach Martinez', team: 'Desert Heat Softball', quote: 'My parents love the push notifications. They get a buzz every time we score — they go crazy in the stands.' },
  { name: 'Coach Thompson', team: 'West Texas Varsity Baseball', quote: 'The PDF game report at the end of each game is something I print and review with my staff every Sunday.' },
];

const compRows = [
  ['Live pitch-by-pitch scoring',    '✅', '✅', '✅'],
  ['Advanced stats (OBP/SLG/OPS)',   '✅', '✅', '⚠️ Limited'],
  ['Recruiting profiles',            '✅', '❌', '❌'],
  ['PDF game reports',               '✅', '❌', '❌'],
  ['Fan push notifications',         '✅', '⚠️ Paid add-on', '❌'],
  ['AI broadcast commentary',        '✅', '❌', '❌'],
  ['Spray chart',                    '✅', '✅', '⚠️ Limited'],
  ['Price',                          '$0–$39/mo', '$9.99+/mo', '$7.99/mo'],
];

export default function LandingPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSignup = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{ background: '#020617', color: '#fff', fontFamily: 'system-ui, -apple-system, sans-serif', minHeight: '100vh' }}>

      {/* ── NAV ── */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 32px', borderBottom: '1px solid #1e293b', position: 'sticky', top: 0, background: '#020617', zIndex: 100 }}>
        <div style={{ fontSize: '20px', fontWeight: '900', color: '#38bdf8' }}>⚾ GameTracker</div>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <a href="#features" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '14px' }}>Features</a>
          <a href="#pricing" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '14px' }}>Pricing</a>
          <a href="#compare" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '14px' }}>Compare</a>
          <a href="/" style={{ background: '#38bdf8', color: '#020617', borderRadius: '8px', padding: '8px 18px', fontWeight: '800', fontSize: '14px', textDecoration: 'none' }}>Open App →</a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ textAlign: 'center', padding: '80px 24px 60px', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'inline-block', background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.3)', borderRadius: '20px', padding: '6px 18px', fontSize: '12px', color: '#38bdf8', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '24px' }}>
          Built for Baseball &amp; Softball Coaches
        </div>
        <h1 style={{ fontSize: '52px', fontWeight: '900', lineHeight: 1.1, margin: '0 0 20px', background: 'linear-gradient(135deg, #fff 0%, #38bdf8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          The Scoring App<br />Coaches Actually Use
        </h1>
        <p style={{ fontSize: '18px', color: '#64748b', margin: '0 0 40px', lineHeight: 1.6 }}>
          Live pitch-by-pitch scoring, advanced stats, recruiting profiles, and fan push notifications — all in one place. Free to start.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/" style={{ background: '#38bdf8', color: '#020617', borderRadius: '10px', padding: '14px 32px', fontWeight: '900', fontSize: '16px', textDecoration: 'none' }}>Start Scoring Free →</a>
          <a href="#features" style={{ background: 'transparent', color: '#94a3b8', border: '1px solid #334155', borderRadius: '10px', padding: '14px 32px', fontWeight: '700', fontSize: '16px', textDecoration: 'none' }}>See Features</a>
        </div>

        {/* Social proof */}
        <div style={{ display: 'flex', gap: '32px', justifyContent: 'center', marginTop: '48px', flexWrap: 'wrap' }}>
          {[['1,200+', 'Coaches'], ['18,000+', 'Games Scored'], ['340K+', 'At-Bats Tracked']].map(([n, l]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: '900', color: '#38bdf8', fontFamily: 'monospace' }}>{n}</div>
              <div style={{ fontSize: '12px', color: '#475569', marginTop: '2px' }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ padding: '80px 24px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ fontSize: '11px', color: '#475569', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '12px' }}>Everything you need</div>
          <h2 style={{ fontSize: '36px', fontWeight: '900', margin: 0 }}>Built for winning coaches</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {features.map(f => (
            <div key={f.title} style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '14px', padding: '24px' }}>
              <div style={{ fontSize: '28px', marginBottom: '12px' }}>{f.icon}</div>
              <div style={{ fontSize: '15px', fontWeight: '800', color: '#fff', marginBottom: '8px' }}>{f.title}</div>
              <div style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: '80px 24px', background: '#07101f' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: '900', margin: 0 }}>Coaches love it</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
            {testimonials.map(t => (
              <div key={t.name} style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '14px', padding: '24px' }}>
                <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.7, marginBottom: '16px' }}>"{t.quote}"</div>
                <div style={{ fontSize: '13px', fontWeight: '800', color: '#fff' }}>{t.name}</div>
                <div style={{ fontSize: '11px', color: '#475569', marginTop: '2px' }}>{t.team}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" style={{ padding: '80px 24px', maxWidth: '960px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ fontSize: '11px', color: '#475569', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '12px' }}>Simple pricing</div>
          <h2 style={{ fontSize: '36px', fontWeight: '900', margin: 0 }}>Start free. Upgrade when ready.</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {[
            { name: 'Free', price: '$0', sub: 'forever', color: '#64748b', border: '#1e293b', features: ['1 team', 'Live scoring', 'Fan GameStream', 'Season schedule', 'Basic stats'], cta: 'Get Started', href: '/', highlight: false },
            { name: 'Pro Coach', price: '$6.99', sub: '/mo', color: '#38bdf8', border: '#38bdf8', features: ['Everything in Free', 'Unlimited teams', 'Recruiting profiles', 'Advanced stats', 'PDF game reports', 'Push notifications', 'Broadcast voice', 'Priority support'], cta: 'Upgrade to Pro', href: '/?tab=upgrade', highlight: true },
            { name: 'Organization', price: '$39', sub: '/mo', color: '#a78bfa', border: '#7c3aed', features: ['Everything in Pro', 'Multi-team management', 'Staff accounts', 'Bulk roster import', 'League standings', 'Custom branding', 'Dedicated support'], cta: 'Upgrade to Org', href: '/?tab=upgrade', highlight: false },
          ].map(p => (
            <div key={p.name} style={{ background: '#0f172a', border: `2px solid ${p.border}`, borderRadius: '14px', padding: '28px 24px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
              {p.highlight && <div style={{ position: 'absolute', top: '-13px', left: '50%', transform: 'translateX(-50%)', background: '#38bdf8', color: '#020617', fontSize: '11px', fontWeight: '900', padding: '4px 14px', borderRadius: '20px', whiteSpace: 'nowrap' }}>MOST POPULAR</div>}
              <div style={{ fontSize: '13px', color: p.color, fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>{p.name}</div>
              <div style={{ fontSize: '36px', fontWeight: '900', color: '#fff', marginBottom: '4px' }}>{p.price}<span style={{ fontSize: '14px', color: '#64748b', fontWeight: '400' }}>{p.sub}</span></div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '20px 0 24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {p.features.map(f => <li key={f} style={{ fontSize: '13px', color: '#94a3b8', display: 'flex', gap: '8px' }}><span style={{ color: p.color }}>✓</span>{f}</li>)}
              </ul>
              <a href={p.href} style={{ display: 'block', textAlign: 'center', background: p.highlight ? '#38bdf8' : 'transparent', border: `1px solid ${p.border}`, color: p.highlight ? '#020617' : p.color, borderRadius: '8px', padding: '12px', fontWeight: '800', fontSize: '14px', textDecoration: 'none' }}>{p.cta}</a>
            </div>
          ))}
        </div>
      </section>

      {/* ── COMPARE ── */}
      <section id="compare" style={{ padding: '80px 24px', background: '#07101f' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: '900', margin: 0 }}>How we compare</h2>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#0f172a' }}>
                  <th style={{ padding: '12px 16px', color: '#475569', textAlign: 'left', borderBottom: '1px solid #1e293b', fontWeight: '800', fontSize: '11px', textTransform: 'uppercase' }}>Feature</th>
                  {[['GameTracker', '#38bdf8'], ['GameChanger', '#475569'], ['iScore', '#334155']].map(([n, c]) => (
                    <th key={n} style={{ padding: '12px 16px', color: c, textAlign: 'center', borderBottom: '1px solid #1e293b', fontWeight: '900', fontSize: '12px' }}>{n}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {compRows.map((row, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? '#0a1628' : '#0f172a' }}>
                    {row.map((cell, j) => (
                      <td key={j} style={{ padding: '11px 16px', color: j === 0 ? '#94a3b8' : j === 1 ? '#fff' : '#475569', textAlign: j === 0 ? 'left' : 'center', borderBottom: '1px solid #1e293b', fontWeight: j === 1 ? '700' : '400' }}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '560px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '36px', fontWeight: '900', margin: '0 0 16px' }}>Ready to coach smarter?</h2>
          <p style={{ color: '#64748b', fontSize: '16px', margin: '0 0 32px' }}>Join 1,200+ coaches using GameTracker. Free to start, no credit card required.</p>
          {submitted ? (
            <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid #22c55e', borderRadius: '12px', padding: '16px 24px', color: '#86efac', fontWeight: '700' }}>✅ You're on the list! We'll be in touch.</div>
          ) : (
            <form onSubmit={handleSignup} style={{ display: 'flex', gap: '10px', maxWidth: '420px', margin: '0 auto', flexWrap: 'wrap' }}>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required
                style={{ flex: 1, background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '10px', padding: '12px 16px', fontSize: '14px', minWidth: '200px' }} />
              <button type="submit" style={{ background: '#38bdf8', color: '#020617', border: 'none', borderRadius: '10px', padding: '12px 24px', fontWeight: '900', fontSize: '14px', cursor: 'pointer', whiteSpace: 'nowrap' }}>Get Early Access</button>
            </form>
          )}
          <div style={{ marginTop: '32px' }}>
            <a href="/" style={{ background: '#1e293b', color: '#94a3b8', borderRadius: '10px', padding: '14px 32px', fontWeight: '700', fontSize: '15px', textDecoration: 'none' }}>Or open the app now →</a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid #1e293b', padding: '32px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: '18px', fontWeight: '900', color: '#38bdf8', marginBottom: '8px' }}>⚾ GameTracker</div>
        <div style={{ fontSize: '12px', color: '#334155' }}>Built for coaches. © {new Date().getFullYear()} GameTracker. All rights reserved.</div>
        <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', marginTop: '16px' }}>
          <a href="/" style={{ color: '#334155', fontSize: '12px', textDecoration: 'none' }}>App</a>
          <a href="#pricing" style={{ color: '#334155', fontSize: '12px', textDecoration: 'none' }}>Pricing</a>
          <a href="#features" style={{ color: '#334155', fontSize: '12px', textDecoration: 'none' }}>Features</a>
        </div>
      </footer>

    </div>
  );
}
