import React, { useState } from 'react';

const SIZES = [4, 8, 16];

function emptyBracket(size) {
  const teams = Array.from({ length: size }, (_, i) => ({ name: '', seed: i + 1 }));
  return { size, teams, results: {}, name: '', createdAt: new Date().toISOString() };
}

function matchupsForRound(round, size) {
  const matchCount = size / Math.pow(2, round);
  return Array.from({ length: matchCount }, (_, i) => i);
}

function getTeamName(bracket, round, matchIndex, side) {
  if (round === 1) {
    const idx = side === 'top' ? matchIndex * 2 : matchIndex * 2 + 1;
    return bracket.teams[idx]?.name || `Seed ${idx + 1}`;
  }
  const prevKey = `r${round - 1}_m${matchIndex * 2 + (side === 'top' ? 0 : 1)}`;
  return bracket.results[prevKey] || '?';
}

export default function TournamentBracketTab({ user, teamDisplayName, sportEmoji, teamSport }) {
  const [bracket, setBracket] = useState(null);
  const [bracketSize, setBracketSize] = useState(8);
  const [bracketName, setBracketName] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  const rounds = bracket ? Math.log2(bracket.size) : 0;

  const startBracket = () => {
    const b = emptyBracket(bracketSize);
    b.name = bracketName || `${teamDisplayName} Tournament`;
    setBracket(b);
  };

  const updateTeam = (idx, name) => {
    setBracket(prev => {
      const teams = [...prev.teams];
      teams[idx] = { ...teams[idx], name };
      return { ...prev, teams };
    });
  };

  const pickWinner = (roundNum, matchIndex, winner) => {
    if (!user) return;
    const key = `r${roundNum}_m${matchIndex}`;
    setBracket(prev => ({ ...prev, results: { ...prev.results, [key]: winner } }));
  };

  const shareBracket = () => {
    const encoded = btoa(JSON.stringify(bracket));
    const url = `${window.location.origin}${window.location.pathname}?view=team&bracket=${encoded}`;
    navigator.clipboard?.writeText(url).catch(() => {});
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (!bracket) {
    return (
      <div style={{ maxWidth: '600px', margin: '40px auto', padding: '0 20px' }}>
        <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '14px', padding: '32px' }}>
          <h2 style={{ margin: '0 0 6px', color: '#fff', fontSize: '20px' }}>🏆 Tournament Bracket Builder</h2>
          <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 28px' }}>Build a bracket, record results as games are scored, and share a public link.</p>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>Bracket Name</label>
            <input
              value={bracketName}
              onChange={e => setBracketName(e.target.value)}
              placeholder={`${teamDisplayName} Spring Tournament`}
              style={{ width: '100%', background: '#0b1329', border: '1px solid #334155', borderRadius: '6px', color: '#fff', padding: '10px', fontSize: '13px', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>Number of Teams</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {SIZES.map(s => (
                <button key={s} onClick={() => setBracketSize(s)}
                  style={{ flex: 1, padding: '10px', borderRadius: '8px', fontWeight: '800', fontSize: '14px', cursor: 'pointer', background: bracketSize === s ? '#2563eb' : '#1e293b', border: bracketSize === s ? '2px solid #60a5fa' : '1px solid #334155', color: bracketSize === s ? '#fff' : '#94a3b8' }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          {!user && <p style={{ color: '#f59e0b', fontSize: '12px', marginBottom: '12px' }}>⚠️ Log in to create and save brackets.</p>}
          <button onClick={startBracket}
            style={{ width: '100%', background: '#22c55e', border: 'none', color: '#020617', padding: '12px', fontSize: '14px', fontWeight: '800', borderRadius: '8px', cursor: 'pointer' }}>
            Create {bracketSize}-Team Bracket →
          </button>
        </div>
      </div>
    );
  }

  const totalRounds = Math.log2(bracket.size);

  return (
    <div style={{ padding: '20px', overflowX: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ margin: '0 0 4px', color: '#fff', fontSize: '18px' }}>🏆 {bracket.name}</h2>
          <p style={{ margin: 0, color: '#475569', fontSize: '12px' }}>{sportEmoji(teamSport)} {bracket.size}-team bracket · Click a team name to advance them</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={shareBracket} style={{ background: '#1e293b', border: '1px solid #334155', color: '#94a3b8', borderRadius: '6px', padding: '8px 14px', fontSize: '12px', fontWeight: '800', cursor: 'pointer' }}>
            {copiedLink ? '✓ Copied!' : '🔗 Share Bracket'}
          </button>
          <button onClick={() => setBracket(null)} style={{ background: '#7f1d1d', border: '1px solid #ef4444', color: '#fca5a5', borderRadius: '6px', padding: '8px 14px', fontSize: '12px', fontWeight: '800', cursor: 'pointer' }}>
            New Bracket
          </button>
        </div>
      </div>

      {/* Seed Entry (first time only) */}
      {bracket.teams.some(t => !t.name) && (
        <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
          <p style={{ margin: '0 0 14px', color: '#94a3b8', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase' }}>Enter Team Names (Seeds 1–{bracket.size})</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '8px' }}>
            {bracket.teams.map((t, i) => (
              <input key={i} value={t.name} onChange={e => updateTeam(i, e.target.value)}
                placeholder={`Seed ${i + 1}`}
                style={{ background: '#0b1329', border: '1px solid #334155', borderRadius: '6px', color: '#fff', padding: '8px 10px', fontSize: '12px', width: '100%', boxSizing: 'border-box' }} />
            ))}
          </div>
        </div>
      )}

      {/* Bracket Grid */}
      <div style={{ display: 'flex', gap: '0', alignItems: 'center', minWidth: `${totalRounds * 200}px` }}>
        {Array.from({ length: totalRounds }, (_, ri) => {
          const roundNum = ri + 1;
          const matchCount = bracket.size / Math.pow(2, roundNum);
          const roundLabel = roundNum === totalRounds ? 'Championship' : roundNum === totalRounds - 1 ? 'Semifinals' : roundNum === totalRounds - 2 ? 'Quarterfinals' : `Round ${roundNum}`;
          return (
            <div key={roundNum} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ fontSize: '11px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.05em' }}>{roundLabel}</div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', height: `${matchCount * 80}px`, width: '100%', gap: '8px' }}>
                {Array.from({ length: matchCount }, (_, mi) => {
                  const topTeam = getTeamName(bracket, roundNum, mi, 'top');
                  const botTeam = getTeamName(bracket, roundNum, mi, 'bottom');
                  const key = `r${roundNum}_m${mi}`;
                  const winner = bracket.results[key];
                  return (
                    <div key={mi} style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', overflow: 'hidden', margin: '0 6px' }}>
                      {[topTeam, botTeam].map((team, si) => {
                        const isWinner = winner === team;
                        const isLoser = winner && winner !== team;
                        return (
                          <div key={si} onClick={() => pickWinner(roundNum, mi, team)}
                            style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: user ? 'pointer' : 'default', borderBottom: si === 0 ? '1px solid #1e293b' : 'none', background: isWinner ? 'rgba(34,197,94,0.12)' : 'transparent', opacity: isLoser ? 0.4 : 1, transition: 'all 0.15s' }}>
                            <span style={{ fontSize: '12px', fontWeight: isWinner ? '800' : '500', color: isWinner ? '#22c55e' : '#cbd5e1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '120px' }}>
                              {team || '—'}
                            </span>
                            {isWinner && <span style={{ fontSize: '10px', color: '#22c55e' }}>✓</span>}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Champion display */}
        {(() => {
          const champKey = `r${totalRounds}_m0`;
          const champ = bracket.results[champKey];
          return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 12px' }}>
              <div style={{ fontSize: '11px', fontWeight: '800', color: '#f59e0b', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.05em' }}>🏆 Champion</div>
              <div style={{ background: champ ? 'rgba(245,158,11,0.12)' : '#0f172a', border: `2px solid ${champ ? '#f59e0b' : '#1e293b'}`, borderRadius: '10px', padding: '12px 18px', textAlign: 'center', minWidth: '110px' }}>
                <div style={{ fontSize: '13px', fontWeight: '900', color: champ ? '#f59e0b' : '#334155' }}>{champ || '?'}</div>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
