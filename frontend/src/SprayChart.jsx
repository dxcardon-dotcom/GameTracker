import React from 'react';

const isHit = r => ['single','double','triple','home_run'].includes(r);
const dotLabel = r => ({ single:'1B', double:'2B', triple:'3B', home_run:'HR', groundout:'GO', flyout:'FO', lineout:'LO', strikeout:'K', error:'E', fielder_choice:'FC', sac_fly:'SF' }[r] || r?.slice(0,2).toUpperCase());

export default function SprayChart({
  sprayDots, setSprayDots,
  sprayChartPlayer, setSprayChartPlayer,
  sprayPending, setSprayPending,
  editingSprayDot, setEditingSprayDot,
  showHotZones, setShowHotZones,
  currentBatter, user,
  processedRoster,
}) {
  const playerList = ['team', ...processedRoster.map(p => `${p.firstName} ${p.lastName}`)];
  const playerIdx = playerList.indexOf(sprayChartPlayer);
  const prevPlayer = () => setSprayChartPlayer(playerList[Math.max(0, playerIdx - 1)]);
  const nextPlayer = () => setSprayChartPlayer(playerList[Math.min(playerList.length - 1, playerIdx + 1)]);
  const playerLabel = sprayChartPlayer === 'team' ? 'All Players' : (() => {
    const p = processedRoster.find(p => `${p.firstName} ${p.lastName}` === sprayChartPlayer);
    return p ? `${p.firstName} ${p.lastName}${p.jersey ? ', #' + p.jersey : ''}` : sprayChartPlayer;
  })();

  const filteredDots = sprayChartPlayer === 'team'
    ? sprayDots
    : sprayDots.filter(d => d.batter === sprayChartPlayer);

  const W = 360, H = 300;
  const HX = W / 2, HY = H - 10;
  const R_OUT = 270, R_IN = 110;

  const handleFieldClick = (e) => {
    if (!user) return;
    if (editingSprayDot) { setEditingSprayDot(null); return; }
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
    const yPct = ((e.clientY - rect.top) / rect.height * 100).toFixed(1);
    setSprayPending({ xPct, yPct });
  };

  const commitSprayDot = (result) => {
    if (!sprayPending) return;
    const batter = sprayChartPlayer === 'team' ? (currentBatter || 'Unknown') : sprayChartPlayer;
    setSprayDots(prev => [...prev, { x: sprayPending.xPct, y: sprayPending.yPct, result, batter, id: Date.now() }]);
    setSprayPending(null);
  };

  const zones = [
    { id:'LF-deep', x1:5,  y1:3,  x2:35, y2:35 },
    { id:'CF-deep', x1:35, y1:3,  x2:65, y2:35 },
    { id:'RF-deep', x1:65, y1:3,  x2:95, y2:35 },
    { id:'LF-mid',  x1:10, y1:35, x2:38, y2:58 },
    { id:'CF-mid',  x1:38, y1:35, x2:62, y2:58 },
    { id:'RF-mid',  x1:62, y1:35, x2:90, y2:58 },
    { id:'3B-side', x1:15, y1:58, x2:42, y2:78 },
    { id:'middle',  x1:42, y1:58, x2:58, y2:78 },
    { id:'1B-side', x1:58, y1:58, x2:85, y2:78 },
  ];

  return (
    <div style={{ padding: '16px 20px', maxWidth: '700px' }}>

      {/* ── PLAYER SWITCHER ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', background: '#0f172a', border: '1px solid #1e293b', borderRadius: '10px', padding: '10px 14px' }}>
        <button onClick={prevPlayer} disabled={playerIdx <= 0}
          style={{ background: 'none', border: 'none', color: playerIdx <= 0 ? '#1e293b' : '#64748b', fontSize: '20px', cursor: playerIdx <= 0 ? 'default' : 'pointer', padding: '0 8px' }}>‹</button>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '15px', fontWeight: '800', color: '#fff' }}>{playerLabel}</div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '4px', fontSize: '12px', color: '#475569' }}>
            <span style={{ color: '#22c55e' }}>● Hit</span>
            <span style={{ color: '#ef4444' }}>● Out</span>
          </div>
        </div>
        <button onClick={nextPlayer} disabled={playerIdx >= playerList.length - 1}
          style={{ background: 'none', border: 'none', color: playerIdx >= playerList.length - 1 ? '#1e293b' : '#64748b', fontSize: '20px', cursor: playerIdx >= playerList.length - 1 ? 'default' : 'pointer', padding: '0 8px' }}>›</button>
        <button onClick={() => setShowHotZones(v => !v)}
          style={{ background: showHotZones ? 'rgba(239,68,68,0.15)' : 'transparent', border: `1px solid ${showHotZones ? '#ef4444' : '#334155'}`, borderRadius: '6px', color: showHotZones ? '#ef4444' : '#475569', cursor: 'pointer', fontSize: '11px', fontWeight: '800', padding: '4px 8px', whiteSpace: 'nowrap' }}>
          {showHotZones ? '🔥 Zones ON' : '🔥 Zones'}
        </button>
      </div>

      {/* ── FAN-FIELD SVG ── */}
      <div style={{ position: 'relative', width: '100%', maxWidth: `${W}px`, margin: '0 auto' }}>
        <svg viewBox={`0 0 ${W} ${H}`}
          style={{ width: '100%', display: 'block', cursor: user ? 'crosshair' : 'default', borderRadius: '12px', overflow: 'visible' }}
          onClick={handleFieldClick}
        >
          <path d={`M ${HX} ${HY} L ${HX - R_OUT * Math.sin(Math.PI * 0.42)} ${HY - R_OUT * Math.cos(Math.PI * 0.42)} A ${R_OUT} ${R_OUT} 0 0 1 ${HX + R_OUT * Math.sin(Math.PI * 0.42)} ${HY - R_OUT * Math.cos(Math.PI * 0.42)} Z`} fill="#166534" opacity="0.9" />
          <path d={`M ${HX} ${HY} L ${HX - R_IN * Math.sin(Math.PI * 0.42)} ${HY - R_IN * Math.cos(Math.PI * 0.42)} A ${R_IN} ${R_IN} 0 0 1 ${HX + R_IN * Math.sin(Math.PI * 0.42)} ${HY - R_IN * Math.cos(Math.PI * 0.42)} Z`} fill="#92400e" opacity="0.7" />
          <polygon points={`${HX},${HY - 20} ${HX - 72},${HY - 115} ${HX},${HY - 175} ${HX + 72},${HY - 115}`} fill="#15803d" opacity="0.8" />
          <line x1={HX} y1={HY} x2={HX - R_OUT * Math.sin(Math.PI * 0.42)} y2={HY - R_OUT * Math.cos(Math.PI * 0.42)} stroke="#fff" strokeWidth="1" opacity="0.3" />
          <line x1={HX} y1={HY} x2={HX + R_OUT * Math.sin(Math.PI * 0.42)} y2={HY - R_OUT * Math.cos(Math.PI * 0.42)} stroke="#fff" strokeWidth="1" opacity="0.3" />
          <path d={`M ${HX - R_OUT * Math.sin(Math.PI * 0.42)} ${HY - R_OUT * Math.cos(Math.PI * 0.42)} A ${R_OUT} ${R_OUT} 0 0 1 ${HX + R_OUT * Math.sin(Math.PI * 0.42)} ${HY - R_OUT * Math.cos(Math.PI * 0.42)}`} fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.25" />
          {[{ cx: HX, cy: HY - 175, label: '2B' }, { cx: HX + 72, cy: HY - 115, label: '1B' }, { cx: HX - 72, cy: HY - 115, label: '3B' }].map(({ cx, cy, label }) => (
            <g key={label}>
              <rect x={cx - 7} y={cy - 7} width="14" height="14" fill="#f5f5f5" transform={`rotate(45,${cx},${cy})`} />
              <text x={cx} y={cy + 22} textAnchor="middle" fill="#ffffff88" fontSize="9" fontWeight="bold">{label}</text>
            </g>
          ))}
          <polygon points={`${HX},${HY - 14} ${HX + 8},${HY - 8} ${HX + 8},${HY} ${HX - 8},${HY} ${HX - 8},${HY - 8}`} fill="#fff" opacity="0.9" />
          <circle cx={HX} cy={HY - 105} r="7" fill="#92400e" stroke="#a16207" strokeWidth="1" />

          {/* Lines from home to hit location */}
          {filteredDots.map(dot => {
            const tx = dot.x / 100 * W, ty = dot.y / 100 * H;
            return <line key={dot.id + '_line'} x1={HX} y1={HY} x2={tx} y2={ty} stroke={isHit(dot.result) ? '#22c55e' : '#ef4444'} strokeWidth="1.5" opacity="0.55" />;
          })}

          {/* Hot zones */}
          {showHotZones && zones.map(z => {
            const cx1 = z.x1/100*W, cy1 = z.y1/100*H, cx2 = z.x2/100*W, cy2 = z.y2/100*H;
            const hits = filteredDots.filter(d => isHit(d.result) && Number(d.x) >= z.x1 && Number(d.x) <= z.x2 && Number(d.y) >= z.y1 && Number(d.y) <= z.y2).length;
            const total = filteredDots.filter(d => Number(d.x) >= z.x1 && Number(d.x) <= z.x2 && Number(d.y) >= z.y1 && Number(d.y) <= z.y2).length;
            const pct = total > 0 ? hits / total : 0;
            const color = pct > 0.6 ? '#22c55e' : pct > 0.35 ? '#f59e0b' : total > 0 ? '#ef4444' : 'transparent';
            return (
              <g key={z.id}>
                <rect x={cx1} y={cy1} width={cx2-cx1} height={cy2-cy1} fill={color} opacity={total > 0 ? 0.22 : 0} rx="4" />
                {total > 0 && <text x={(cx1+cx2)/2} y={(cy1+cy2)/2+4} textAnchor="middle" fill="#fff" fontSize="8" fontWeight="800" opacity="0.7">{hits}/{total}</text>}
              </g>
            );
          })}

          {/* Dots */}
          {filteredDots.map(dot => {
            const tx = dot.x / 100 * W, ty = dot.y / 100 * H;
            const hit = isHit(dot.result);
            const editing = editingSprayDot === dot.id;
            return (
              <g key={dot.id} style={{ cursor: 'pointer' }} onClick={e => { e.stopPropagation(); setEditingSprayDot(editing ? null : dot.id); setSprayPending(null); }}>
                <circle cx={tx} cy={ty} r="11" fill={hit ? '#22c55e' : '#ef4444'} opacity="0.9" stroke={editing ? '#fff' : 'none'} strokeWidth="2" />
                <text x={tx} y={ty + 4} textAnchor="middle" fill="#fff" fontSize="8" fontWeight="900">{dotLabel(dot.result)}</text>
              </g>
            );
          })}

          {sprayPending && (
            <circle cx={sprayPending.xPct / 100 * W} cy={sprayPending.yPct / 100 * H} r="13" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4,3" opacity="0.9" />
          )}
        </svg>

        {/* Dot edit popover */}
        {editingSprayDot && (() => {
          const dot = filteredDots.find(d => d.id === editingSprayDot);
          if (!dot) return null;
          return (
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: '#0f172a', border: '1px solid #64748b', borderRadius: '12px', padding: '12px 14px', zIndex: 25, minWidth: '200px', boxShadow: '0 8px 32px rgba(0,0,0,0.8)' }}>
              <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '8px', textAlign: 'center' }}>
                <strong style={{ color: '#fff' }}>{dot.batter}</strong> — {dot.result}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '5px', marginBottom: '8px' }}>
                {['single','double','triple','home_run','groundout','flyout','lineout','strikeout'].map(r => (
                  <button key={r} onClick={() => { setSprayDots(prev => prev.map(d => d.id === editingSprayDot ? { ...d, result: r } : d)); setEditingSprayDot(null); }}
                    style={{ background: dot.result === r ? 'rgba(56,189,248,0.2)' : '#0f172a', border: `1px solid ${dot.result === r ? '#38bdf8' : '#334155'}`, borderRadius: '6px', color: dot.result === r ? '#38bdf8' : '#64748b', cursor: 'pointer', fontSize: '11px', fontWeight: '800', padding: '6px 2px' }}>
                    {dotLabel(r)}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button onClick={() => { setSprayDots(prev => prev.filter(d => d.id !== editingSprayDot)); setEditingSprayDot(null); }}
                  style={{ flex: 1, background: 'rgba(239,68,68,0.1)', border: '1px solid #ef4444', borderRadius: '6px', color: '#ef4444', cursor: 'pointer', fontSize: '11px', fontWeight: '800', padding: '6px' }}>
                  Delete
                </button>
                <button onClick={() => setEditingSprayDot(null)}
                  style={{ flex: 1, background: 'transparent', border: '1px solid #334155', borderRadius: '6px', color: '#475569', cursor: 'pointer', fontSize: '11px', padding: '6px' }}>
                  Cancel
                </button>
              </div>
            </div>
          );
        })()}

        {/* Result picker */}
        {sprayPending && (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: '#0f172a', border: '1px solid #38bdf8', borderRadius: '12px', padding: '12px 14px', zIndex: 20, minWidth: '220px', boxShadow: '0 8px 32px rgba(0,0,0,0.7)' }}>
            <div style={{ fontSize: '11px', color: '#38bdf8', fontWeight: '800', textTransform: 'uppercase', marginBottom: '8px', textAlign: 'center' }}>Select result</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', marginBottom: '8px' }}>
              {[
                { r: 'single', label: '1B', color: '#22c55e' }, { r: 'double', label: '2B', color: '#22c55e' },
                { r: 'triple', label: '3B', color: '#22c55e' }, { r: 'home_run', label: 'HR', color: '#22c55e' },
                { r: 'groundout', label: 'GO', color: '#ef4444' }, { r: 'flyout', label: 'FO', color: '#ef4444' },
                { r: 'lineout', label: 'LO', color: '#ef4444' }, { r: 'strikeout', label: 'K', color: '#ef4444' },
              ].map(({ r, label, color }) => (
                <button key={r} onClick={() => commitSprayDot(r)}
                  style={{ background: `${color}18`, border: `1.5px solid ${color}66`, borderRadius: '8px', color, cursor: 'pointer', fontWeight: '900', fontSize: '13px', padding: '8px 4px', textAlign: 'center' }}>
                  {label}
                </button>
              ))}
            </div>
            <button onClick={() => setSprayPending(null)}
              style={{ width: '100%', background: 'transparent', border: '1px solid #1e293b', borderRadius: '6px', color: '#475569', cursor: 'pointer', fontSize: '12px', padding: '5px' }}>
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Play history list */}
      <div style={{ marginTop: '16px', background: '#0f172a', border: '1px solid #1e293b', borderRadius: '10px', overflow: 'hidden' }}>
        <div style={{ padding: '10px 14px', borderBottom: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', color: '#475569', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Play History</span>
          <button onClick={() => setSprayDots(prev => sprayChartPlayer === 'team' ? [] : prev.filter(d => d.batter !== sprayChartPlayer))}
            disabled={!user || filteredDots.length === 0}
            style={{ background: 'transparent', border: '1px solid #334155', borderRadius: '6px', color: '#475569', cursor: filteredDots.length > 0 ? 'pointer' : 'default', fontSize: '11px', padding: '3px 10px' }}>
            Clear
          </button>
        </div>
        {filteredDots.length === 0 ? (
          <div style={{ padding: '20px 14px', fontSize: '13px', color: '#334155', textAlign: 'center' }}>
            {user ? 'Click the field above to log a hit location.' : 'Log in to add spray chart data.'}
          </div>
        ) : filteredDots.map((dot, i) => {
          const hit = isHit(dot.result);
          const label = { single: 'Singles', double: 'Doubles', triple: 'Triples', home_run: 'Home run', groundout: 'Grounds out', flyout: 'Flies out', lineout: 'Lines out', strikeout: 'Strikes out', error: 'Reaches on error', fielder_choice: "Fielder's choice", sac_fly: 'Sacrifice fly' }[dot.result] || dot.result;
          return (
            <div key={dot.id} style={{ padding: '9px 14px', borderBottom: '1px solid #0f172a', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '12px', color: '#334155', fontFamily: 'monospace', width: '18px', flexShrink: 0 }}>{i + 1}.</span>
              <span style={{ fontSize: '13px', color: '#94a3b8', flex: 1 }}>
                <strong style={{ color: '#cbd5e1' }}>{dot.batter}</strong> — {label}
              </span>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: hit ? '#22c55e' : '#ef4444', flexShrink: 0 }} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
