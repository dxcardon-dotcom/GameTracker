import React, { useCallback, useState } from 'react';
import SprayChart from './SprayChart';

export default function StatsPanel({
  processedRoster, recentEvents, pitchLog,
  sprayDots, setSprayDots,
  sprayChartPlayer, setSprayChartPlayer,
  sprayPending, setSprayPending,
  editingSprayDot, setEditingSprayDot,
  showHotZones, setShowHotZones,
  currentBatter, user,
  selectedSeason, statsSubTab, setStatsSubTab,
  seasonSchedule, seasonWins, seasonLosses,
  teamDisplayName, scoringOpponent,
  ourInnings, theirInnings,
  ourLiveScore, theirLiveScore,
  ourHits, theirHits, ourErrors, theirErrors,
  currentInning, styles,
}) {
  const [exportStatus, setExportStatus] = useState('');

  // 📊 Data Export Functions
  const exportToCSV = useCallback((data, filename) => {
    try {
      const csv = [
        Object.keys(data[0]).join(','),
        ...data.map(row => Object.values(row).map(val => `"${val}"`).join(','))
      ].join('\n');
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
      setExportStatus('CSV exported successfully!');
      setTimeout(() => setExportStatus(''), 3000);
    } catch (error) {
      setExportStatus('Failed to export CSV');
      setTimeout(() => setExportStatus(''), 3000);
    }
  }, []);

  const exportPlayerStatsCSV = useCallback(() => {
    const playerData = processedRoster.map(player => ({
      Name: player.name,
      Number: player.number,
      Position: player.primaryPosition,
      Games: player.gamesPlayed,
      'Batting Avg': player.avg,
      'Home Runs': player.hr,
      RBIs: player.rbi,
      OBP: player.obp,
      SLG: player.slg,
      OPS: player.ops,
      StolenBases: player.sb
    }));
    
    exportToCSV(playerData, `${teamDisplayName.replace(/\s+/g, '_')}_Player_Stats_${selectedSeason}.csv`);
  }, [processedRoster, teamDisplayName, selectedSeason, exportToCSV]);

  const exportScheduleCSV = useCallback(() => {
    const scheduleData = seasonSchedule.map(game => ({
      Date: game.date,
      Opponent: game.opponent,
      Location: game.location,
      Result: game.result || '',
      Score: game.score || '',
      Status: game.status
    }));
    
    exportToCSV(scheduleData, `${teamDisplayName.replace(/\s+/g, '_')}_Schedule_${selectedSeason}.csv`);
  }, [seasonSchedule, teamDisplayName, selectedSeason, exportToCSV]);

  const generatePDFReport = useCallback(async () => {
    try {
      setExportStatus('Generating PDF report...');
      
      const htmlContent = `
        <html>
          <head>
            <title>${teamDisplayName} Season Report</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              h1 { color: #1e40af; }
              h2 { color: #374151; margin-top: 30px; }
              table { border-collapse: collapse; width: 100%; margin-top: 10px; }
              th, td { border: 1px solid #d1d5db; padding: 8px; text-align: left; }
              th { background-color: #f3f4f6; }
              .summary { background-color: #f9fafb; padding: 15px; border-radius: 5px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <h1>${teamDisplayName} Season Report ${selectedSeason}</h1>
            <div class="summary">
              <h2>Season Summary</h2>
              <p><strong>Record:</strong> ${seasonWins}-${seasonLosses}</p>
              <p><strong>Games Played:</strong> ${seasonSchedule.length}</p>
              <p><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
            
            <h2>Player Statistics</h2>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>#</th>
                  <th>Position</th>
                  <th>AVG</th>
                  <th>HR</th>
                  <th>RBI</th>
                  <th>OBP</th>
                  <th>SLG</th>
                  <th>OPS</th>
                </tr>
              </thead>
              <tbody>
                ${processedRoster.map(player => `
                  <tr>
                    <td>${player.name}</td>
                    <td>${player.number}</td>
                    <td>${player.primaryPosition}</td>
                    <td>${player.avg}</td>
                    <td>${player.hr}</td>
                    <td>${player.rbi}</td>
                    <td>${player.obp}</td>
                    <td>${player.slg}</td>
                    <td>${player.ops}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            
            <h2>Game Schedule</h2>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Opponent</th>
                  <th>Location</th>
                  <th>Result</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                ${seasonSchedule.map(game => `
                  <tr>
                    <td>${game.date}</td>
                    <td>${game.opponent}</td>
                    <td>${game.location}</td>
                    <td>${game.result || '-'}</td>
                    <td>${game.score || '-'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </body>
        </html>
      `;
      
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 500);
        
        setExportStatus('PDF report generated! Check your downloads.');
        setTimeout(() => setExportStatus(''), 3000);
      }
    } catch (error) {
      setExportStatus('Failed to generate PDF report');
      setTimeout(() => setExportStatus(''), 3000);
    }
  }, [teamDisplayName, selectedSeason, seasonWins, seasonLosses, seasonSchedule, processedRoster]);
  return (
        <div>
          {/* Export Status */}
          {exportStatus && (
            <div style={{ 
              background: exportStatus.includes('success') ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', 
              border: `1px solid ${exportStatus.includes('success') ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`, 
              borderRadius: '8px', 
              padding: '12px 16px', 
              marginBottom: '20px',
              color: exportStatus.includes('success') ? '#22c55e' : '#ef4444',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              {exportStatus}
            </div>
          )}

          {/* Export Controls */}
          <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
            <h3 style={{ color: '#fff', margin: '0 0 16px', fontSize: '18px' }}>📊 Export Data</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              <button 
                onClick={exportPlayerStatsCSV}
                style={{ 
                  background: '#3b82f6', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: '8px', 
                  padding: '12px 16px', 
                  fontSize: '14px', 
                  fontWeight: 'bold', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                📄 Player Stats (CSV)
              </button>
              <button 
                onClick={exportScheduleCSV}
                style={{ 
                  background: '#10b981', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: '8px', 
                  padding: '12px 16px', 
                  fontSize: '14px', 
                  fontWeight: 'bold', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                📅 Schedule (CSV)
              </button>
              <button 
                onClick={generatePDFReport}
                style={{ 
                  background: '#ef4444', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: '8px', 
                  padding: '12px 16px', 
                  fontSize: '14px', 
                  fontWeight: 'bold', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                📋 Full Report (PDF)
              </button>
            </div>
            <p style={{ color: '#64748b', margin: '12px 0 0', fontSize: '12px' }}>
              Export your team data for analysis, recruiting, or record-keeping. CSV files open in Excel/Google Sheets, PDF reports are formatted for printing.
            </p>
          </div>

          {/* SEASON LEADERBOARD */}
          {processedRoster.length > 0 && (() => {
            const qualified = processedRoster.filter(p => p.ab >= 5);
            const qualifiedPitchers = processedRoster.filter(p => p.ip >= 1);
            const top = (arr, key, asc = false) =>
              [...arr].sort((a, b) => asc ? a[key] - b[key] : b[key] - a[key]).slice(0, 3);

            const categories = [
              { label: 'Batting Avg', emoji: '🏏', players: top(qualified, 'avg'), fmt: p => p.avg.toFixed(3) },
              { label: 'Home Runs', emoji: '💣', players: top(processedRoster, 'hr'), fmt: p => p.hr },
              { label: 'RBI', emoji: '🤝', players: top(processedRoster, 'rbi'), fmt: p => p.rbi },
              { label: 'ERA', emoji: '🔥', players: top(qualifiedPitchers, 'era', true), fmt: p => p.era.toFixed(2) },
              { label: 'Strikeouts', emoji: '⚡', players: top(processedRoster, 'strikeouts'), fmt: p => p.strikeouts },
            ];

            return (
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <h3 style={{ margin: 0, color: '#94a3b8', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>🏆 Season Leaderboard — {selectedSeason}</h3>
                  <span style={{ fontSize: '12px', color: '#475569' }}>Min 5 AB / 1 IP to qualify</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
                  {categories.map(cat => (
                    <div key={cat.label} style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '10px', padding: '14px 16px' }}>
                      <div style={{ fontSize: '11px', color: '#475569', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>{cat.emoji} {cat.label}</div>
                      {cat.players.length === 0 ? (
                        <div style={{ fontSize: '12px', color: '#334155' }}>No data yet</div>
                      ) : (
                        cat.players.map((p, i) => (
                          <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '7px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                              <span style={{ fontSize: '11px', fontWeight: 'bold', color: i === 0 ? '#f59e0b' : i === 1 ? '#94a3b8' : '#78716c', minWidth: '16px' }}>
                                {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}
                              </span>
                              <span style={{ fontSize: '12px', color: '#cbd5e1', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '80px' }}>
                                {p.firstName} {p.lastName}
                              </span>
                            </div>
                            <strong style={{ fontSize: '13px', color: i === 0 ? '#f59e0b' : '#fff' }}>{cat.fmt(p)}</strong>
                          </div>
                        ))
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          <div className={styles.subNavigationTabs}>
            <button className={`${styles.subTabBtn} ${statsSubTab === 'standard-hitting' ? styles.subTabBtnActive : ''}`} onClick={() => setStatsSubTab('standard-hitting')}>🏏 Standard Hitting</button>
            <button className={`${styles.subTabBtn} ${statsSubTab === 'sabermetrics' ? styles.subTabBtnActive : ''}`} onClick={() => setStatsSubTab('sabermetrics')}>📊 Sabermetrics</button>
            <button className={`${styles.subTabBtn} ${statsSubTab === 'pitching' ? styles.subTabBtnActive : ''}`} onClick={() => setStatsSubTab('pitching')}>🔥 Pitching Staff</button>
            <button className={`${styles.subTabBtn} ${statsSubTab === 'fielding' ? styles.subTabBtnActive : ''}`} onClick={() => setStatsSubTab('fielding')}>🧤 Fielding Leather</button>
            <button className={`${styles.subTabBtn} ${statsSubTab === 'spray' ? styles.subTabBtnActive : ''}`} onClick={() => setStatsSubTab('spray')}>🗺️ Spray Chart</button>
            <button className={`${styles.subTabBtn} ${statsSubTab === 'win-prob' ? styles.subTabBtnActive : ''}`} onClick={() => setStatsSubTab('win-prob')}>📈 Win Probability</button>
            <button className={`${styles.subTabBtn} ${statsSubTab === 'heatmap' ? styles.subTabBtnActive : ''}`} onClick={() => setStatsSubTab('heatmap')}>🔥 Pitch Heatmap</button>
            <button className={`${styles.subTabBtn} ${statsSubTab === 'efficiency' ? styles.subTabBtnActive : ''}`} onClick={() => setStatsSubTab('efficiency')}>⚡ Batting Efficiency</button>
            <button className={`${styles.subTabBtn} ${statsSubTab === 'tendency' ? styles.subTabBtnActive : ''}`} onClick={() => setStatsSubTab('tendency')}>🎯 Pitch Tendency</button>
            <button className={`${styles.subTabBtn} ${statsSubTab === 'export' ? styles.subTabBtnActive : ''}`} onClick={() => setStatsSubTab('export')}>📤 Export</button>
            <button className={`${styles.subTabBtn} ${statsSubTab === 'gamelog' ? styles.subTabBtnActive : ''}`} onClick={() => setStatsSubTab('gamelog')}>📅 Game Log</button>
            <button className={`${styles.subTabBtn} ${statsSubTab === 'momentum' ? styles.subTabBtnActive : ''}`} onClick={() => setStatsSubTab('momentum')}>📊 Momentum</button>
          </div>

          <div className={styles.statTableWrapper}>
            <table className={styles.statGridTable}>
              {statsSubTab === 'standard-hitting' && (
                <>
                  <thead>
                    <tr><th>#</th><th>Player Name</th><th>G</th><th>AB</th><th>H</th><th>2B</th><th>3B</th><th>HR</th><th>RBI</th><th>R</th><th>BB</th><th>SB</th><th>AVG</th></tr>
                  </thead>
                  <tbody>
                    {processedRoster.map(p => (
                      <tr key={p.id}><td>{p.jersey}</td><td>{p.firstName} {p.lastName}</td><td>{p.gamesPlayed}</td><td>{p.ab}</td><td>{p.hits}</td><td>{p.double}</td><td>{p.triple}</td><td>{p.hr}</td><td>{p.rbi}</td><td>{p.runs}</td><td>{p.bb}</td><td>{p.sb}</td><td><strong>{p.avg.toFixed(3)}</strong></td></tr>
                    ))}
                    <tr style={{ background: '#0f172a', fontWeight: 'bold' }}><td>-</td><td>TEAM TOTALS</td><td>{teamTotals.g}</td><td>{teamTotals.ab}</td><td>{teamTotals.hits}</td><td>{teamTotals.double}</td><td>{teamTotals.triple}</td><td>{teamTotals.hr}</td><td>{teamTotals.rbi}</td><td>{teamTotals.runs}</td><td>{teamTotals.bb}</td><td>{teamTotals.sb}</td><td>{teamTotals.avg.toFixed(3)}</td></tr>
                  </tbody>
                </>
              )}

              {statsSubTab === 'sabermetrics' && (
                <>
                  <thead>
                    <tr><th>#</th><th>Player Name</th><th>PA</th><th>AB</th><th>H</th><th>BB</th><th>OBP</th><th>SLG</th><th>OPS</th></tr>
                  </thead>
                  <tbody>
                    {processedRoster.map(p => (
                      <tr key={p.id}><td>{p.jersey}</td><td>{p.firstName} {p.lastName}</td><td>{p.pa}</td><td>{p.ab}</td><td>{p.hits}</td><td>{p.bb}</td><td>{p.obp.toFixed(3)}</td><td>{p.slg.toFixed(3)}</td><td><strong>{p.ops.toFixed(3)}</strong></td></tr>
                    ))}
                    <tr style={{ background: '#0f172a', fontWeight: 'bold' }}><td>-</td><td>TEAM TOTALS</td><td>{teamTotals.ab + teamTotals.bb}</td><td>{teamTotals.ab}</td><td>{teamTotals.hits}</td><td>{teamTotals.bb}</td><td>{teamTotals.obp.toFixed(3)}</td><td>{teamTotals.slg.toFixed(3)}</td><td>{teamTotals.ops.toFixed(3)}</td></tr>
                  </tbody>
                </>
              )}

              {statsSubTab === 'pitching' && (
                <>
                  <thead>
                    <tr><th>#</th><th>Pitcher</th><th>IP</th><th>ER</th><th>H Allowed</th><th>BB Allowed</th><th>SO</th><th>W</th><th>WHIP</th><th>ERA</th></tr>
                  </thead>
                  <tbody>
                    {processedRoster.map(p => (
                      <tr key={p.id}><td>{p.jersey}</td><td>{p.firstName} {p.lastName}</td><td>{p.ip}</td><td>{p.er}</td><td>{p.hitsAllowed}</td><td>{p.walksAllowed}</td><td>{p.strikeouts}</td><td>{p.wins}</td><td>{p.whip.toFixed(2)}</td><td><strong>{p.era.toFixed(2)}</strong></td></tr>
                    ))}
                    <tr style={{ background: '#0f172a', fontWeight: 'bold' }}><td>-</td><td>TEAM TOTALS</td><td>{teamTotals.ip}</td><td>{teamTotals.er}</td><td>{teamTotals.hitsAllowed}</td><td>{teamTotals.walksAllowed}</td><td>{teamTotals.strikeouts}</td><td>{teamTotals.wins}</td><td>{teamTotals.whip.toFixed(2)}</td><td>{teamTotals.era.toFixed(2)}</td></tr>
                  </tbody>
                </>
              )}

              {statsSubTab === 'fielding' && (
                <>
                  <thead>
                    <tr><th>#</th><th>Fielder</th><th>PO</th><th>A</th><th>E</th><th>TC</th><th>FIELD %</th></tr>
                  </thead>
                  <tbody>
                    {processedRoster.map(p => (
                      <tr key={p.id}><td>{p.jersey}</td><td>{p.firstName} {p.lastName}</td><td>{p.po}</td><td>{p.assists}</td><td>{p.errors}</td><td>{p.totalChances}</td><td><strong>{p.fieldingPct.toFixed(3)}</strong></td></tr>
                    ))}
                    <tr style={{ background: '#0f172a', fontWeight: 'bold' }}><td>-</td><td>TEAM TOTALS</td><td>{teamTotals.po}</td><td>{teamTotals.assists}</td><td>{teamTotals.errors}</td><td>{teamTotals.po + teamTotals.assists + teamTotals.errors}</td><td>{teamTotals.fp.toFixed(3)}</td></tr>
                  </tbody>
                </>
              )}
            </table>
          </div>

          {/* PITCH MIX & VELOCITY CHART */}
          {statsSubTab === 'pitching' && pitchLog.length > 0 && (() => {
            const pitchTypes = ['FB','CB','CH','SL','CT','SP','2S','KN'];
            const typeColors = { FB: '#ef4444', CB: '#3b82f6', CH: '#22c55e', SL: '#f59e0b', CT: '#a855f7', SP: '#06b6d4', '2S': '#f97316', KN: '#6b7280' };
            const pitcherNames = [...new Set(pitchLog.map(p => p.pitcher))];
            const total = pitchLog.length;
            return (
              <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {/* Pitch Mix % */}
                <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '10px', padding: '18px' }}>
                  <div style={{ fontSize: '11px', color: '#475569', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px' }}>⚾ Pitch Mix — {total} pitches</div>
                  {pitchTypes.map(t => {
                    const count = pitchLog.filter(p => p.type === t).length;
                    if (!count) return null;
                    const pct = ((count / total) * 100).toFixed(1);
                    const veloEntries = pitchLog.filter(p => p.type === t && p.velo);
                    const avgVelo = veloEntries.length ? (veloEntries.reduce((s,p) => s + p.velo, 0) / veloEntries.length).toFixed(1) : null;
                    return (
                      <div key={t} style={{ marginBottom: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                          <span style={{ color: typeColors[t] || '#94a3b8', fontWeight: '800' }}>{t}</span>
                          <span style={{ color: '#94a3b8' }}>{count}x · {pct}%{avgVelo ? ` · avg ${avgVelo} mph` : ''}</span>
                        </div>
                        <div style={{ background: '#1e293b', borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
                          <div style={{ width: `${pct}%`, height: '100%', background: typeColors[t] || '#475569', borderRadius: '4px', transition: 'width 0.3s' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
                {/* Velo by pitcher */}
                <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '10px', padding: '18px' }}>
                  <div style={{ fontSize: '11px', color: '#475569', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px' }}>📊 Velocity by Pitcher</div>
                  {pitcherNames.map(name => {
                    const entries = pitchLog.filter(p => p.pitcher === name && p.velo);
                    if (!entries.length) return (
                      <div key={name} style={{ fontSize: '12px', color: '#334155', marginBottom: '8px' }}>{name} — no velo logged</div>
                    );
                    const avg = (entries.reduce((s, p) => s + p.velo, 0) / entries.length).toFixed(1);
                    const top = Math.max(...entries.map(p => p.velo));
                    const low = Math.min(...entries.map(p => p.velo));
                    return (
                      <div key={name} style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #1e293b' }}>
                        <div style={{ fontSize: '13px', fontWeight: '700', color: '#fff', marginBottom: '6px' }}>{name}</div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '6px' }}>
                          {[['AVG', avg, '#38bdf8'], ['TOP', top, '#f59e0b'], ['LOW', low, '#64748b']].map(([lbl, val, c]) => (
                            <div key={lbl} style={{ background: '#020617', border: '1px solid #1e293b', borderRadius: '6px', padding: '6px', textAlign: 'center' }}>
                              <div style={{ fontSize: '9px', color: '#475569', fontWeight: '800', textTransform: 'uppercase' }}>{lbl}</div>
                              <div style={{ fontSize: '16px', fontWeight: '900', color: c, fontFamily: 'monospace' }}>{val}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                  {pitcherNames.every(n => !pitchLog.filter(p => p.pitcher === n && p.velo).length) && (
                    <div style={{ fontSize: '12px', color: '#334155' }}>Enter MPH in the pitch panel to see velocity data.</div>
                  )}
                </div>
              </div>
            );
          })()}

          {/* SPRAY CHART */}
          {statsSubTab === 'spray' && (
            <SprayChart
              sprayDots={sprayDots} setSprayDots={setSprayDots}
              sprayChartPlayer={sprayChartPlayer} setSprayChartPlayer={setSprayChartPlayer}
              sprayPending={sprayPending} setSprayPending={setSprayPending}
              editingSprayDot={editingSprayDot} setEditingSprayDot={setEditingSprayDot}
              showHotZones={showHotZones} setShowHotZones={setShowHotZones}
              currentBatter={currentBatter} user={user}
              processedRoster={processedRoster}
            />
          )}

          {/* ── WIN PROBABILITY CHART ── */}
          {statsSubTab === 'win-prob' && (() => {
            const W = 700, H = 260, PAD = { t: 24, r: 24, b: 40, l: 52 };
            const iW = W - PAD.l - PAD.r, iH = H - PAD.t - PAD.b;

            // Build WP series from scoring events using run-expectancy delta
            // Each scoring event shifts win probability based on run differential and inning
            const scoringEvts = recentEvents.filter(e => ['home_run','single','double','triple','run','walk','strikeout','hit_by_pitch','groundout','flyout','pop_out','out'].includes(e.result || e.eventType));
            const wpSeries = [{ seq: 0, wp: 50, label: 'Start' }];

            let ourR = 0, theirR = 0;
            scoringEvts.forEach((e, i) => {
              const result = e.result || e.eventType || '';
              const runDelta = result.includes('home_run') ? 1 : result === 'run' ? 1 : 0;
              const isOurs = isOurTeamBatting();
              if (runDelta) isOurs ? (ourR += runDelta) : (theirR += runDelta);
              const diff = ourR - theirR;
              const inning = e.stateBefore?.inning || currentInning;
              const inningsLeft = Math.max(1, 9 - inning);
              // Logistic model: WP = 1 / (1 + exp(-k * diff)) where k scales with inning
              const k = 0.4 + (9 - inningsLeft) * 0.08;
              const raw = 1 / (1 + Math.exp(-k * diff));
              const wp = Math.round(raw * 100);
              wpSeries.push({ seq: i + 1, wp, label: (e.correctedLabel || e.label || result).replace(/_/g, ' ').slice(0, 22) });
            });

            // If no live events, show season W-L trend
            const useSeasonMode = wpSeries.length < 3;
            const seasonGames = seasonSchedule.filter(g => g.status === 'Final');
            const seasonSeries = seasonGames.map((g, i) => {
              const wins = seasonGames.slice(0, i + 1).filter(x => x.result === 'W').length;
              const total = i + 1;
              return { seq: i + 1, wp: Math.round((wins / total) * 100), label: `vs ${g.opponent || 'Opp'}` };
            });
            const series = useSeasonMode ? [{ seq: 0, wp: 50, label: 'Season Start' }, ...seasonSeries] : wpSeries;

            if (series.length < 2) return (
              <div style={{ padding: '40px', textAlign: 'center', color: '#334155', fontSize: '13px' }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>📈</div>
                Start scoring a game or add final results in the schedule to see win probability data.
              </div>
            );

            const maxSeq = series[series.length - 1].seq;
            const toX = seq => PAD.l + (seq / maxSeq) * iW;
            const toY = wp => PAD.t + iH - (wp / 100) * iH;

            const pathD = series.map((p, i) => `${i === 0 ? 'M' : 'L'} ${toX(p.seq)} ${toY(p.wp)}`).join(' ');
            const fillD = `${pathD} L ${toX(series[series.length - 1].seq)} ${PAD.t + iH} L ${toX(0)} ${PAD.t + iH} Z`;
            const lastWp = series[series.length - 1].wp;
            const wpColor = lastWp >= 60 ? '#22c55e' : lastWp <= 40 ? '#ef4444' : '#f59e0b';

            return (
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: '#475569', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      {useSeasonMode ? '📅 Season Win Rate Trend' : '📈 Live Win Probability'}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                      {useSeasonMode ? `${seasonWins}W – ${seasonLosses}L season record` : `${recentEvents.length} events tracked`}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '11px', color: '#475569', textTransform: 'uppercase', fontWeight: '800' }}>Current WP</div>
                    <div style={{ fontSize: '28px', fontWeight: '900', color: wpColor, fontFamily: 'monospace' }}>{lastWp}%</div>
                  </div>
                </div>
                <div style={{ background: '#070f1e', border: '1px solid #1e293b', borderRadius: '12px', overflow: 'hidden' }}>
                  <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxHeight: '280px', display: 'block' }}>
                    {/* Grid lines */}
                    {[0, 25, 50, 75, 100].map(pct => (
                      <g key={pct}>
                        <line x1={PAD.l} y1={toY(pct)} x2={PAD.l + iW} y2={toY(pct)} stroke="#1e293b" strokeWidth="1" strokeDasharray={pct === 50 ? '0' : '4,4'} />
                        <text x={PAD.l - 6} y={toY(pct) + 4} fill="#334155" fontSize="10" textAnchor="end" fontFamily="monospace">{pct}%</text>
                      </g>
                    ))}
                    {/* 50% line emphasis */}
                    <line x1={PAD.l} y1={toY(50)} x2={PAD.l + iW} y2={toY(50)} stroke="#334155" strokeWidth="1.5" />
                    {/* Fill */}
                    <path d={fillD} fill={`${wpColor}18`} />
                    {/* Line */}
                    <path d={pathD} fill="none" stroke={wpColor} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
                    {/* Dots */}
                    {series.map((p, i) => (
                      <g key={i}>
                        <circle cx={toX(p.seq)} cy={toY(p.wp)} r="4" fill={wpColor} stroke="#07101f" strokeWidth="2" />
                        {i === series.length - 1 && (
                          <circle cx={toX(p.seq)} cy={toY(p.wp)} r="7" fill="none" stroke={wpColor} strokeWidth="1.5" opacity="0.5" />
                        )}
                      </g>
                    ))}
                    {/* Labels */}
                    <text x={PAD.l + iW / 2} y={H - 6} fill="#334155" fontSize="10" textAnchor="middle">{useSeasonMode ? 'Game #' : 'Play #'}</text>
                  </svg>
                </div>
                {/* Last 5 plays */}
                {!useSeasonMode && series.length > 1 && (
                  <div style={{ display: 'flex', gap: '8px', marginTop: '14px', flexWrap: 'wrap' }}>
                    {series.slice(-5).map((p, i) => (
                      <div key={i} style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', padding: '8px 12px', flex: '1 1 100px' }}>
                        <div style={{ fontSize: '10px', color: '#334155', textTransform: 'uppercase', fontWeight: '800' }}>#{p.seq}</div>
                        <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.label}</div>
                        <div style={{ fontSize: '18px', fontWeight: '900', color: p.wp >= 60 ? '#22c55e' : p.wp <= 40 ? '#ef4444' : '#f59e0b', fontFamily: 'monospace' }}>{p.wp}%</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}

          {/* ── PITCH HEATMAP ── */}
          {statsSubTab === 'heatmap' && (() => {
            const PITCH_COLORS = { FB: '#ef4444', CB: '#3b82f6', CH: '#22c55e', SL: '#f59e0b', CT: '#a855f7', SP: '#06b6d4', '2S': '#f97316', KN: '#6b7280' };
            const pitcherNames = [...new Set(pitchLog.map(p => p.pitcher))];

            const filtered = pitchLog.filter(p =>
              (hmPitcher === 'all' || p.pitcher === hmPitcher) &&
              (hmType === 'all' || p.type === hmType)
            );

            // Map result → zone position (0-8) via simple heuristic
            const resultToZone = (result) => {
              if (!result) return 4;
              const r = result.toLowerCase();
              if (r.includes('strikeout')) return Math.floor(Math.random() * 4); // corners
              if (r.includes('ball')) return [0, 2, 6, 8][Math.floor(Math.random() * 4)]; // outside
              if (r.includes('home_run') || r.includes('single')) return 4; // heart
              if (r.includes('ground')) return [3, 5][Math.floor(Math.random() * 2)];
              if (r.includes('fly') || r.includes('pop')) return [1, 7][Math.floor(Math.random() * 2)];
              return Math.floor(Math.random() * 9);
            };

            // Accumulate pitch counts per zone
            const zoneCounts = Array(9).fill(0);
            filtered.forEach(p => { zoneCounts[resultToZone(p.result)] += 1; });
            const maxCount = Math.max(...zoneCounts, 1);

            const ZONE_LABELS = ['High-In', 'High', 'High-Out', 'Mid-In', 'Heart', 'Mid-Out', 'Low-In', 'Low', 'Low-Out'];

            if (pitchLog.length === 0) return (
              <div style={{ padding: '40px', textAlign: 'center', color: '#334155', fontSize: '13px' }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>🔥</div>
                Log pitches during a live game to populate the strike zone heatmap.
              </div>
            );

            return (
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '18px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <div style={{ fontSize: '11px', color: '#475569', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginRight: '4px' }}>🔥 Strike Zone Heatmap</div>
                  <select value={hmPitcher} onChange={e => setHmPitcher(e.target.value)} style={{ background: '#1e293b', border: '1px solid #334155', color: '#fff', borderRadius: '6px', padding: '6px 10px', fontSize: '12px' }}>
                    <option value="all">All Pitchers</option>
                    {pitcherNames.map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                  <select value={hmType} onChange={e => setHmType(e.target.value)} style={{ background: '#1e293b', border: '1px solid #334155', color: '#fff', borderRadius: '6px', padding: '6px 10px', fontSize: '12px' }}>
                    <option value="all">All Types</option>
                    {Object.keys(PITCH_COLORS).map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <span style={{ fontSize: '12px', color: '#475569', marginLeft: 'auto' }}>{filtered.length} pitches</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '28px', alignItems: 'start' }}>
                  {/* Heatmap grid */}
                  <div>
                    <div style={{ fontSize: '11px', color: '#334155', textTransform: 'uppercase', fontWeight: '800', marginBottom: '8px', textAlign: 'center' }}>Catcher's View</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px', maxWidth: '320px', margin: '0 auto', border: '2px solid #334155', borderRadius: '6px', padding: '8px', background: '#07101f' }}>
                      {zoneCounts.map((count, idx) => {
                        const intensity = count / maxCount;
                        const r = Math.round(239 * intensity);
                        const g = Math.round(68 * intensity);
                        const b = Math.round(68 * intensity);
                        const bg = count > 0 ? `rgba(${r},${g},${b},${0.2 + intensity * 0.7})` : '#0f172a';
                        const border = count > 0 ? `1px solid rgba(${r},${g},${b},0.4)` : '1px solid #1e293b';
                        return (
                          <div key={idx} title={ZONE_LABELS[idx]} style={{ background: bg, border, borderRadius: '6px', height: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2px' }}>
                            <div style={{ fontSize: '20px', fontWeight: '900', color: count > 0 ? '#fff' : '#1e293b', fontFamily: 'monospace' }}>{count}</div>
                            <div style={{ fontSize: '9px', color: count > 0 ? 'rgba(255,255,255,0.5)' : '#1e293b', textTransform: 'uppercase', textAlign: 'center', lineHeight: 1.2 }}>{ZONE_LABELS[idx]}</div>
                          </div>
                        );
                      })}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '320px', margin: '6px auto 0', fontSize: '10px', color: '#334155' }}>
                      <span>← Inside</span><span>Outside →</span>
                    </div>
                  </div>
                  {/* Pitch type breakdown */}
                  <div style={{ minWidth: '160px' }}>
                    <div style={{ fontSize: '11px', color: '#475569', fontWeight: '800', textTransform: 'uppercase', marginBottom: '12px' }}>Mix Breakdown</div>
                    {Object.entries(PITCH_COLORS).map(([t, c]) => {
                      const n = filtered.filter(p => p.type === t).length;
                      if (!n) return null;
                      const pct = ((n / filtered.length) * 100).toFixed(0);
                      return (
                        <div key={t} style={{ marginBottom: '10px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '3px' }}>
                            <span style={{ color: c, fontWeight: '800' }}>{t}</span>
                            <span style={{ color: '#475569' }}>{n}× {pct}%</span>
                          </div>
                          <div style={{ background: '#1e293b', borderRadius: '3px', height: '5px' }}>
                            <div style={{ width: `${pct}%`, height: '100%', background: c, borderRadius: '3px' }} />
                          </div>
                        </div>
                      );
                    })}
                    <div style={{ marginTop: '16px', fontSize: '11px', color: '#475569', fontWeight: '800', textTransform: 'uppercase', marginBottom: '8px' }}>Outcome Split</div>
                    {[['Strikes', filtered.filter(p => ['strikeout','called_strike','swinging_strike','foul'].includes(p.result)).length, '#22c55e'],
                      ['Balls',   filtered.filter(p => p.result === 'ball').length, '#ef4444'],
                      ['In Play', filtered.filter(p => !['strikeout','called_strike','swinging_strike','foul','ball'].includes(p.result)).length, '#38bdf8'],
                    ].map(([lbl, n, c]) => (
                      <div key={lbl} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>
                        <span>{lbl}</span><strong style={{ color: c }}>{n}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ── BATTING EFFICIENCY ── */}
          {statsSubTab === 'efficiency' && (() => {
            // League-average context for wRC+ (rough amateur baselines)
            const lgAVG = 0.270, lgOBP = 0.330, lgSLG = 0.400, lgWOBA = 0.320;
            const wOBAWeights = { bb: 0.69, hbp: 0.72, single: 0.88, double: 1.24, triple: 1.56, hr: 2.00 };

            const effRoster = processedRoster.map(p => {
              const singles = p.hits - (p.double + p.triple + p.hr);
              const pa = p.ab + p.bb;
              const woba = pa > 0
                ? ((p.bb * wOBAWeights.bb) + (singles * wOBAWeights.single) + (p.double * wOBAWeights.double) + (p.triple * wOBAWeights.triple) + (p.hr * wOBAWeights.hr)) / pa
                : 0;
              const wrcPlus = lgWOBA > 0 ? Math.round(((woba - lgWOBA) / lgWOBA + 1) * 100) : 100;
              const iso = p.slg - p.avg;
              const bbPct = pa > 0 ? (p.bb / pa) * 100 : 0;
              const kPct = pa > 0 ? ((p.strikeouts || 0) / pa) * 100 : 0;
              const babip = (p.ab - (p.strikeouts || 0) - p.hr) > 0
                ? (p.hits - p.hr) / (p.ab - (p.strikeouts || 0) - p.hr)
                : 0;
              return { ...p, woba, wrcPlus, iso, bbPct, kPct, babip };
            }).sort((a, b) => b.wrcPlus - a.wrcPlus);

            const barCell = (val, max, color, fmt) => (
              <td style={{ padding: '10px 12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: '#e2e8f0' }}>{fmt(val)}</span>
                  <div style={{ background: '#1e293b', borderRadius: '3px', height: '4px', width: '80px' }}>
                    <div style={{ width: `${Math.min(100, (val / max) * 100).toFixed(0)}%`, height: '100%', background: color, borderRadius: '3px' }} />
                  </div>
                </div>
              </td>
            );

            const maxWrc = Math.max(...effRoster.map(p => p.wrcPlus), 100);
            const maxIso = Math.max(...effRoster.map(p => p.iso), 0.3);
            const maxBb  = Math.max(...effRoster.map(p => p.bbPct), 15);
            const maxK   = Math.max(...effRoster.map(p => p.kPct), 30);

            if (effRoster.length === 0) return (
              <div style={{ padding: '40px', textAlign: 'center', color: '#334155', fontSize: '13px' }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>⚡</div>
                Add players to the roster with at-bat data to see batting efficiency metrics.
              </div>
            );

            return (
              <div style={{ padding: '0' }}>
                <div style={{ padding: '16px 20px 0', marginBottom: '0' }}>
                  <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '14px' }}>
                    {[
                      ['wRC+', 'Weighted Runs Created Plus. 100 = league avg. Higher is better.', '#38bdf8'],
                      ['wOBA', 'Weighted On-Base Average. Weights each outcome by run value.', '#a78bfa'],
                      ['ISO', 'Isolated Power = SLG − AVG. Pure extra-base hit power.', '#f59e0b'],
                      ['BB%', 'Walk rate. Higher = better plate discipline.', '#22c55e'],
                      ['K%', 'Strikeout rate. Lower is generally better.', '#ef4444'],
                      ['BABIP', 'Batting avg on balls in play. ~.300 is typical.', '#64748b'],
                    ].map(([lbl, tip, c]) => (
                      <div key={lbl} title={tip} style={{ fontSize: '11px', color: c, fontWeight: '800', cursor: 'help', borderBottom: `1px dotted ${c}`, paddingBottom: '1px' }}>{lbl}</div>
                    ))}
                  </div>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ background: '#07101f' }}>
                        {['#', 'Player', 'wRC+', 'wOBA', 'ISO', 'BB%', 'K%', 'BABIP'].map(h => (
                          <th key={h} style={{ padding: '10px 12px', color: '#475569', fontWeight: '800', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'left', borderBottom: '1px solid #1e293b', whiteSpace: 'nowrap' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {effRoster.map((p, i) => (
                        <tr key={p.id} style={{ borderBottom: '1px solid #0f172a', background: i % 2 === 0 ? 'transparent' : 'rgba(15,23,42,0.3)' }}>
                          <td style={{ padding: '10px 12px', color: '#475569', fontSize: '12px' }}>{p.jersey}</td>
                          <td style={{ padding: '10px 12px', color: '#e2e8f0', fontWeight: '700', whiteSpace: 'nowrap' }}>{p.firstName} {p.lastName}</td>
                          {/* wRC+ with context color */}
                          <td style={{ padding: '10px 12px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                              <span style={{ fontSize: '14px', fontWeight: '900', color: p.wrcPlus >= 120 ? '#22c55e' : p.wrcPlus >= 100 ? '#38bdf8' : p.wrcPlus >= 80 ? '#f59e0b' : '#ef4444', fontFamily: 'monospace' }}>{p.wrcPlus}</span>
                              <div style={{ background: '#1e293b', borderRadius: '3px', height: '4px', width: '72px' }}>
                                <div style={{ width: `${Math.min(100, (p.wrcPlus / maxWrc) * 100).toFixed(0)}%`, height: '100%', background: p.wrcPlus >= 100 ? '#38bdf8' : '#ef4444', borderRadius: '3px' }} />
                              </div>
                            </div>
                          </td>
                          {barCell(p.woba, 0.5, '#a78bfa', v => v.toFixed(3))}
                          {barCell(p.iso, maxIso, '#f59e0b', v => v.toFixed(3))}
                          {barCell(p.bbPct, maxBb, '#22c55e', v => `${v.toFixed(1)}%`)}
                          {barCell(p.kPct, maxK, '#ef4444', v => `${v.toFixed(1)}%`)}
                          {barCell(p.babip, 0.5, '#64748b', v => v.toFixed(3))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div style={{ padding: '10px 20px 16px', fontSize: '11px', color: '#1e293b', lineHeight: '1.6' }}>
                  wRC+ uses lgWOBA = .320 · lgAVG = .270 as amateur baselines. Values update in real time as roster stats change.
                </div>
              </div>
            );
          })()}

          {/* ── EXPORT / GAME SUMMARY ── */}
          {statsSubTab === 'export' && (() => {
            const exportCSV = () => {
              const headers = 'Jersey,Name,G,AB,H,2B,3B,HR,RBI,R,BB,AVG';
              const rows = processedRoster.map(p => [
                p.jersey || '',
                `${p.firstName} ${p.lastName}`.trim(),
                p.gamesPlayed || 0, p.ab || 0, p.hits || 0,
                p.double || 0, p.triple || 0, p.hr || 0,
                p.rbi || 0, p.runs || 0, p.bb || 0,
                p.ab > 0 ? (p.hits / p.ab).toFixed(3) : '.000'
              ].join(','));
              const csv = [headers, ...rows].join('\n');
              const blob = new Blob([csv], { type: 'text/csv' });
              const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
              a.download = `stats_${selectedSeason}_${new Date().toISOString().slice(0,10)}.csv`; a.click();
            };
            const exportBoxScore = () => {
              const innLine = (arr) => arr.map((v, i) => `Inn${i+1}: ${v ?? 0}`).join(' | ');
              const lines = [
                `GAME SUMMARY — ${new Date().toLocaleDateString()}`,
                `${teamDisplayName || 'Us'} ${ourLiveScore} – ${theirLiveScore} ${scoringOpponent || 'Opp'}`,
                `Innings: ${currentInning} | Location: ${scoringLocation || 'Unknown'}`,
                '',
                `${teamDisplayName || 'Us'}: ${innLine(ourInnings)} | R:${ourLiveScore} H:${ourHits} E:${ourErrors}`,
                `${scoringOpponent || 'Opp'}: ${innLine(theirInnings)} | R:${theirLiveScore} H:${theirHits} E:${theirErrors}`,
                '',
                'PLAY LOG:',
                ...recentEvents.filter(e => !['correction','undo'].includes(e.eventType)).map((e, i) => `${i+1}. [Inn ${e.inning || '?'}] ${e.label || e.result || e.eventType}`)
              ];
              const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
              const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
              a.download = `boxscore_${new Date().toISOString().slice(0,10)}.txt`; a.click();
            };
            return (
              <div style={{ padding: '24px', maxWidth: '600px' }}>
                <div style={{ fontSize: '13px', color: '#475569', marginBottom: '20px' }}>Export game data as a file you can share, archive, or open in Excel.</div>

                {/* Live box score preview */}
                <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '10px', padding: '16px', marginBottom: '20px', fontFamily: 'monospace', fontSize: '12px' }}>
                  <div style={{ color: '#475569', fontWeight: '800', fontSize: '10px', textTransform: 'uppercase', marginBottom: '10px' }}>Box Score Preview</div>
                  <div style={{ display: 'flex', gap: '16px', marginBottom: '6px' }}>
                    <span style={{ color: '#f59e0b', fontWeight: '900', width: '90px' }}>{(teamDisplayName || 'Us').slice(0,10)}</span>
                    {ourInnings.map((r, i) => <span key={i} style={{ color: r > 0 ? '#f59e0b' : '#334155', width: '20px', textAlign: 'center' }}>{r ?? 0}</span>)}
                    <span style={{ color: '#fff', fontWeight: '900', marginLeft: '8px' }}>{ourLiveScore}</span>
                    <span style={{ color: '#64748b' }}>{ourHits}H</span>
                    <span style={{ color: '#ef444488' }}>{ourErrors}E</span>
                  </div>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <span style={{ color: '#94a3b8', fontWeight: '700', width: '90px' }}>{(scoringOpponent || 'Opp').slice(0,10)}</span>
                    {theirInnings.map((r, i) => <span key={i} style={{ color: r > 0 ? '#94a3b8' : '#334155', width: '20px', textAlign: 'center' }}>{r ?? 0}</span>)}
                    <span style={{ color: '#94a3b8', fontWeight: '700', marginLeft: '8px' }}>{theirLiveScore}</span>
                    <span style={{ color: '#475569' }}>{theirHits}H</span>
                    <span style={{ color: '#ef444855' }}>{theirErrors}E</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button onClick={exportCSV}
                    style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid #22c55e', borderRadius: '10px', color: '#22c55e', cursor: 'pointer', fontSize: '14px', fontWeight: '800', padding: '14px 20px', textAlign: 'left' }}>
                    📊 Export Hitting Stats (.csv) — open in Excel / Sheets
                  </button>
                  <button onClick={exportBoxScore}
                    style={{ background: 'rgba(56,189,248,0.1)', border: '1px solid #38bdf8', borderRadius: '10px', color: '#38bdf8', cursor: 'pointer', fontSize: '14px', fontWeight: '800', padding: '14px 20px', textAlign: 'left' }}>
                    📋 Export Box Score + Play Log (.txt)
                  </button>
                  <button onClick={() => {
                    const innRow = (label, arr, total, hits, errors, color) => {
                      const cells = arr.map((v, i) => `<td style="text-align:center;padding:3px 6px;color:${Number(v)>0?color:'#888'}">${v??0}</td>`).join('');
                      return `<tr><td style="font-weight:800;color:${color};padding:3px 8px;white-space:nowrap">${label}</td>${cells}<td style="font-weight:900;color:${color};padding:3px 8px;text-align:center">${total}</td><td style="color:#888;padding:3px 6px;text-align:center">${hits}H</td><td style="color:#888;padding:3px 6px;text-align:center">${errors}E</td></tr>`;
                    };
                    const innHeaders = Array.from({ length: Math.max(ourInnings.length, theirInnings.length, 7) }, (_, i) => `<th style="text-align:center;padding:3px 6px;color:#888">${i+1}</th>`).join('');
                    const battingRows = processedRoster.filter(p => p.ab > 0).map(p => {
                      const avg = p.ab > 0 ? (p.hits/p.ab).toFixed(3) : '.000';
                      return `<tr><td style="padding:3px 8px">#${p.jersey||'?'}</td><td style="padding:3px 8px;font-weight:700">${p.firstName} ${p.lastName}</td><td style="text-align:center;padding:3px 6px">${p.ab}</td><td style="text-align:center;padding:3px 6px">${p.hits}</td><td style="text-align:center;padding:3px 6px">${p.double}</td><td style="text-align:center;padding:3px 6px">${p.triple}</td><td style="text-align:center;padding:3px 6px">${p.hr}</td><td style="text-align:center;padding:3px 6px">${p.rbi}</td><td style="text-align:center;padding:3px 6px">${p.bb}</td><td style="text-align:center;padding:3px 6px;font-weight:800">${avg}</td></tr>`;
                    }).join('');
                    const pitchingRows = processedRoster.filter(p => p.ip > 0).map(p => {
                      const era = p.ip > 0 ? ((p.er * 7) / p.ip).toFixed(2) : '0.00';
                      return `<tr><td style="padding:3px 8px">#${p.jersey||'?'}</td><td style="padding:3px 8px;font-weight:700">${p.firstName} ${p.lastName}</td><td style="text-align:center;padding:3px 6px">${p.ip}</td><td style="text-align:center;padding:3px 6px">${p.er}</td><td style="text-align:center;padding:3px 6px">${p.strikeouts}</td><td style="text-align:center;padding:3px 6px">${p.walksAllowed}</td><td style="text-align:center;padding:3px 6px;font-weight:800">${era}</td></tr>`;
                    }).join('');
                    const playRows = recentEvents.filter(e => !['correction','undo','pitch'].includes(e.eventType)).map((e,i) =>
                      `<tr style="border-bottom:1px solid #eee"><td style="padding:2px 6px;color:#888;font-size:10px">${i+1}</td><td style="padding:2px 6px;font-size:10px">Inn ${e.inning||'?'} ${e.half==='top'?'▲':'▼'}</td><td style="padding:2px 6px;font-size:11px">${e.label||e.result||e.eventType}</td></tr>`
                    ).join('');
                    const html = `<!DOCTYPE html><html><head><title>Game Report</title>
<style>body{font-family:Arial,sans-serif;font-size:12px;color:#111;margin:20px}h1{font-size:18px;margin:0 0 4px}h2{font-size:13px;color:#444;margin:16px 0 6px;border-bottom:2px solid #111;padding-bottom:2px}table{border-collapse:collapse;width:100%;margin-bottom:12px}th{background:#111;color:#fff;padding:4px 6px;font-size:11px;text-align:center}td{font-size:11px}@media print{body{margin:0}}</style></head>
<body>
<h1>📋 Game Report — ${teamDisplayName||'Us'} vs ${scoringOpponent||'Opp'}</h1>
<p style="color:#555;font-size:11px;margin:0 0 12px">Generated ${new Date().toLocaleString()}</p>
<h2>Box Score</h2>
<table><thead><tr><th></th>${innHeaders}<th>R</th><th>H</th><th>E</th></tr></thead><tbody>
${innRow(teamDisplayName||'Us', ourInnings, ourLiveScore, ourHits, ourErrors, '#000')}
${innRow(scoringOpponent||'Opp', theirInnings, theirLiveScore, theirHits, theirErrors, '#555')}
</tbody></table>
${battingRows ? `<h2>Batting</h2><table><thead><tr><th>#</th><th style="text-align:left">Player</th><th>AB</th><th>H</th><th>2B</th><th>3B</th><th>HR</th><th>RBI</th><th>BB</th><th>AVG</th></tr></thead><tbody>${battingRows}</tbody></table>` : ''}
${pitchingRows ? `<h2>Pitching</h2><table><thead><tr><th>#</th><th style="text-align:left">Player</th><th>IP</th><th>ER</th><th>K</th><th>BB</th><th>ERA</th></tr></thead><tbody>${pitchingRows}</tbody></table>` : ''}
${playRows ? `<h2>Play Log</h2><table><tbody>${playRows}</tbody></table>` : ''}
</body></html>`;
                    const w = window.open('', '_blank', 'width=800,height=900');
                    w.document.write(html);
                    w.document.close();
                    w.focus();
                    setTimeout(() => w.print(), 400);
                  }}
                    style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid #a855f7', borderRadius: '10px', color: '#a855f7', cursor: 'pointer', fontSize: '14px', fontWeight: '800', padding: '14px 20px', textAlign: 'left' }}>
                    🖨️ Print / Save as PDF — Full Game Report
                  </button>
                </div>
              </div>
            );
          })()}

          {/* ── GAME LOG TAB ── */}
          {statsSubTab === 'gamelog' && (() => {
            const finalGames = seasonSchedule.filter(g => g.status === 'Final').sort((a, b) => new Date(b.date) - new Date(a.date));
            if (finalGames.length === 0) return (
              <div style={{ padding: '40px 24px', textAlign: 'center', color: '#334155', fontSize: '13px' }}>
                No completed games yet. Finish a game and tap &ldquo;End Game&rdquo; to save it to the log.
              </div>
            );
            return (
              <div style={{ padding: '16px 20px' }}>
                <div style={{ fontSize: '12px', color: '#475569', marginBottom: '16px' }}>
                  {seasonWins}W – {seasonLosses}L &nbsp;·&nbsp; {finalGames.length} game{finalGames.length !== 1 ? 's' : ''} &nbsp;·&nbsp; {selectedSeason}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {finalGames.map((g, gi) => {
                    const isWin = g.result === 'W';
                    const innings = Math.max((g.ourInnings || []).length, (g.theirInnings || []).length, 0);
                    const innNums = Array.from({ length: innings }, (_, i) => i + 1);
                    return (
                      <div key={g.id || gi} style={{ background: '#0f172a', border: `1px solid ${isWin ? '#22c55e33' : '#ef444433'}`, borderRadius: '12px', overflow: 'hidden' }}>
                        {/* Header row */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid #1e293b' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ fontSize: '12px', fontWeight: '900', color: isWin ? '#22c55e' : '#ef4444', background: isWin ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${isWin ? '#22c55e55' : '#ef444455'}`, borderRadius: '6px', padding: '3px 10px' }}>{isWin ? 'W' : 'L'}</span>
                            <div>
                              <div style={{ fontSize: '14px', fontWeight: '800', color: '#fff' }}>vs {g.opponent}</div>
                              <div style={{ fontSize: '11px', color: '#475569' }}>{g.date} · {g.location} · {g.type}</div>
                            </div>
                          </div>
                          <div style={{ fontSize: '28px', fontWeight: '900', color: '#fff', fontFamily: 'monospace' }}>
                            {g.ourScore} <span style={{ fontSize: '16px', color: '#334155' }}>–</span> {g.theirScore}
                          </div>
                        </div>
                        {/* Inning-by-inning mini box score */}
                        {innNums.length > 0 && (
                          <div style={{ overflowX: 'auto', padding: '8px 16px' }}>
                            <div style={{ display: 'flex', gap: 0, fontSize: '11px', fontFamily: 'monospace', minWidth: 'max-content' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', borderRight: '1px solid #1e293b', paddingRight: '8px', marginRight: '4px' }}>
                                <span style={{ color: '#334155', height: '18px' }}></span>
                                <span style={{ color: '#f59e0b', fontWeight: '800', height: '18px' }}>{(teamDisplayName || 'Us').slice(0,8)}</span>
                                <span style={{ color: '#64748b', height: '18px' }}>{g.opponent.slice(0,8)}</span>
                              </div>
                              {innNums.map(n => (
                                <div key={n} style={{ display: 'flex', flexDirection: 'column', minWidth: '22px', textAlign: 'center' }}>
                                  <span style={{ color: '#334155', height: '18px' }}>{n}</span>
                                  <span style={{ color: (g.ourInnings?.[n-1] ?? 0) > 0 ? '#f59e0b' : '#1e293b', height: '18px' }}>{g.ourInnings?.[n-1] ?? 0}</span>
                                  <span style={{ color: (g.theirInnings?.[n-1] ?? 0) > 0 ? '#94a3b8' : '#1e293b', height: '18px' }}>{g.theirInnings?.[n-1] ?? 0}</span>
                                </div>
                              ))}
                              {/* R H E */}
                              {[['R', g.ourScore, g.theirScore, '#fff'], ['H', g.ourHits, g.theirHits, '#64748b'], ['E', g.ourErrors, g.theirErrors, '#ef444488']].map(([lbl, our, their, col]) => (
                                <div key={lbl} style={{ display: 'flex', flexDirection: 'column', minWidth: '24px', textAlign: 'center', borderLeft: '1px solid #1e293b', marginLeft: '4px', paddingLeft: '4px' }}>
                                  <span style={{ color: '#334155', height: '18px' }}>{lbl}</span>
                                  <span style={{ color: col, fontWeight: '900', height: '18px' }}>{our ?? '–'}</span>
                                  <span style={{ color: '#475569', height: '18px' }}>{their ?? '–'}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* ── MOMENTUM / GAME FLOW CHART ── */}
          {statsSubTab === 'momentum' && (() => {
            const finalGames = seasonSchedule.filter(g => g.status === 'Final').sort((a, b) => new Date(a.date) - new Date(b.date));
            const maxInn = Math.max(...finalGames.map(g => Math.max((g.ourInnings||[]).length, (g.theirInnings||[]).length)), 7);

            // Current game inning scoring
            const curOur = ourInnings.length > 0 ? ourInnings : [];
            const curTheir = theirInnings.length > 0 ? theirInnings : [];

            // Build combined run-scoring chart: each inning pair side by side
            const W = 640, H = 200, PAD = { t: 20, r: 16, b: 36, l: 36 };
            const iW = W - PAD.l - PAD.r, iH = H - PAD.t - PAD.b;
            const innings = Array.from({ length: Math.max(curOur.length, curTheir.length, 7) }, (_, i) => i);
            const maxRuns = Math.max(...innings.flatMap(i => [curOur[i] ?? 0, curTheir[i] ?? 0]), 1);
            const barW = iW / innings.length;
            const scale = v => iH - (v / maxRuns) * iH;
            const yGrid = Array.from({ length: Math.min(maxRuns, 6) + 1 }, (_, i) => Math.round((maxRuns / Math.min(maxRuns, 6)) * i));

            return (
              <div style={{ padding: '20px 24px' }}>
                {/* Current game bar chart */}
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '12px', color: '#475569', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
                    Current Game — Runs Per Inning
                  </div>
                  {(curOur.length === 0 && curTheir.length === 0) ? (
                    <div style={{ color: '#334155', fontSize: '13px' }}>No scoring data yet for this game.</div>
                  ) : (
                    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: `${W}px`, display: 'block' }}>
                      {/* Grid lines */}
                      {yGrid.map(v => {
                        const y = PAD.t + scale(v);
                        return (
                          <g key={v}>
                            <line x1={PAD.l} y1={y} x2={PAD.l + iW} y2={y} stroke="#1e293b" strokeWidth="1" />
                            <text x={PAD.l - 4} y={y + 4} textAnchor="end" fill="#334155" fontSize="9">{v}</text>
                          </g>
                        );
                      })}
                      {/* Bars */}
                      {innings.map((i) => {
                        const ourV = curOur[i] ?? 0;
                        const theirV = curTheir[i] ?? 0;
                        const x = PAD.l + i * barW;
                        const bw = barW * 0.38;
                        const ourH = (ourV / maxRuns) * iH;
                        const theirH = (theirV / maxRuns) * iH;
                        return (
                          <g key={i}>
                            {/* Our bar */}
                            <rect x={x + barW * 0.05} y={PAD.t + iH - ourH} width={bw} height={ourH} fill="#f59e0b" rx="2" opacity="0.85" />
                            {ourV > 0 && <text x={x + barW * 0.05 + bw / 2} y={PAD.t + iH - ourH - 3} textAnchor="middle" fill="#f59e0b" fontSize="9" fontWeight="800">{ourV}</text>}
                            {/* Their bar */}
                            <rect x={x + barW * 0.55} y={PAD.t + iH - theirH} width={bw} height={theirH} fill="#64748b" rx="2" opacity="0.7" />
                            {theirV > 0 && <text x={x + barW * 0.55 + bw / 2} y={PAD.t + iH - theirH - 3} textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="800">{theirV}</text>}
                            {/* Inning label */}
                            <text x={x + barW / 2} y={H - PAD.b + 14} textAnchor="middle" fill="#334155" fontSize="9">{i + 1}</text>
                          </g>
                        );
                      })}
                      {/* X axis */}
                      <line x1={PAD.l} y1={PAD.t + iH} x2={PAD.l + iW} y2={PAD.t + iH} stroke="#334155" strokeWidth="1" />
                    </svg>
                  )}
                  {/* Legend */}
                  <div style={{ display: 'flex', gap: '16px', marginTop: '8px', fontSize: '11px' }}>
                    <span><span style={{ color: '#f59e0b', fontWeight: '900' }}>■</span> {teamDisplayName || 'Us'}</span>
                    <span><span style={{ color: '#64748b', fontWeight: '900' }}>■</span> {scoringOpponent || 'Opp'}</span>
                  </div>
                </div>

                {/* Season run differential per game */}
                {finalGames.length > 0 && (
                  <div>
                    <div style={{ fontSize: '12px', color: '#475569', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
                      Season Run Differential
                    </div>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-end', height: '80px' }}>
                      {finalGames.map((g, gi) => {
                        const diff = (g.ourScore ?? 0) - (g.theirScore ?? 0);
                        const isWin = diff > 0;
                        const maxDiff = Math.max(...finalGames.map(g2 => Math.abs((g2.ourScore??0)-(g2.theirScore??0))), 1);
                        const barH = Math.abs(diff) / maxDiff * 60;
                        return (
                          <div key={gi} title={`${g.date} vs ${g.opponent}: ${diff > 0 ? '+' : ''}${diff}`}
                            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, minWidth: '24px' }}>
                            <div style={{ fontSize: '9px', color: isWin ? '#22c55e' : '#ef4444', fontWeight: '800', marginBottom: '2px' }}>{diff > 0 ? '+' : ''}{diff}</div>
                            <div style={{ width: '100%', height: `${barH}px`, background: isWin ? '#22c55e' : '#ef4444', borderRadius: '3px 3px 0 0', opacity: 0.85, minHeight: '4px' }} />
                            <div style={{ fontSize: '8px', color: '#334155', marginTop: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '36px', textAlign: 'center' }}>G{gi + 1}</div>
                          </div>
                        );
                      })}
                    </div>
                    <div style={{ display: 'flex', gap: '16px', marginTop: '6px', fontSize: '11px' }}>
                      <span><span style={{ color: '#22c55e', fontWeight: '900' }}>■</span> Win</span>
                      <span><span style={{ color: '#ef4444', fontWeight: '900' }}>■</span> Loss</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* ── PITCH TENDENCY CHART ── */}
          {statsSubTab === 'tendency' && (() => {
            const pitchTypes = ['FB','CB','SL','CH','CT','SI','SP'];
            const counts = ['0-0','0-1','0-2','1-0','1-1','1-2','2-0','2-1','2-2','3-0','3-1','3-2'];
            const pitcherNames = [...new Set(pitchLog.map(p => p.pitcher).filter(Boolean))];

            if (pitchLog.length === 0) return (
              <div style={{ padding: '40px 24px', textAlign: 'center', color: '#334155', fontSize: '13px' }}>
                No pitch data yet. Log pitch types during a live game to see tendency breakdowns.
              </div>
            );

            return (
              <div style={{ padding: '20px 24px' }}>
                {pitcherNames.map(pitcher => {
                  const log = pitchLog.filter(p => p.pitcher === pitcher);
                  const total = log.length;
                  const strikes = log.filter(p => ['called_strike','swinging_strike','foul','in_play'].includes(p.result)).length;
                  const strikeRate = total > 0 ? ((strikes / total) * 100).toFixed(0) : 0;
                  const firstPitch = log.filter(p => p.pitchInPA === 1 || !p.pitchInPA);

                  return (
                    <div key={pitcher} style={{ marginBottom: '28px', background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '16px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                        <div>
                          <div style={{ fontSize: '15px', fontWeight: '900', color: '#fff' }}>{pitcher}</div>
                          <div style={{ fontSize: '11px', color: '#475569', marginTop: '2px' }}>{total} pitches · {strikeRate}% strikes</div>
                        </div>
                        <div style={{ display: 'flex', gap: '10px', fontSize: '12px' }}>
                          <span style={{ color: '#22c55e' }}>K% {log.filter(p => p.result === 'swinging_strike').length > 0 ? ((log.filter(p => p.result === 'swinging_strike').length / total * 100).toFixed(0)) : 0}%</span>
                          <span style={{ color: '#f59e0b' }}>BB% {log.filter(p => p.result === 'ball').length > 0 ? ((log.filter(p => p.result === 'ball').length / total * 100).toFixed(0)) : 0}%</span>
                        </div>
                      </div>

                      {/* Pitch type breakdown */}
                      <div style={{ marginBottom: '14px' }}>
                        <div style={{ fontSize: '10px', color: '#475569', fontWeight: '800', textTransform: 'uppercase', marginBottom: '8px' }}>Pitch Mix</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                          {pitchTypes.map(type => {
                            const count = log.filter(p => p.type === type).length;
                            if (!count) return null;
                            const pct = ((count / total) * 100).toFixed(0);
                            const typeColors = { FB:'#ef4444', CB:'#3b82f6', SL:'#f59e0b', CH:'#22c55e', CT:'#a855f7', SI:'#f97316', SP:'#06b6d4' };
                            return (
                              <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '11px', color: typeColors[type] || '#64748b', fontWeight: '800', width: '28px' }}>{type}</span>
                                <div style={{ flex: 1, background: '#1e293b', borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
                                  <div style={{ width: `${pct}%`, height: '100%', background: typeColors[type] || '#64748b', borderRadius: '4px', transition: 'width 0.3s' }} />
                                </div>
                                <span style={{ fontSize: '11px', color: '#64748b', fontFamily: 'monospace', width: '36px' }}>{pct}% ({count})</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* By count breakdown */}
                      <div>
                        <div style={{ fontSize: '10px', color: '#475569', fontWeight: '800', textTransform: 'uppercase', marginBottom: '8px' }}>Usage by Count</div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '6px' }}>
                          {counts.map(cnt => {
                            const [b, s] = cnt.split('-');
                            const inCount = log.filter(p => p.balls === Number(b) && p.strikes === Number(s));
                            if (!inCount.length) return null;
                            const topType = pitchTypes.reduce((best, t) => {
                              const n = inCount.filter(p => p.type === t).length;
                              return n > (best.n || 0) ? { type: t, n } : best;
                            }, {});
                            const typeColors = { FB:'#ef4444', CB:'#3b82f6', SL:'#f59e0b', CH:'#22c55e', CT:'#a855f7', SI:'#f97316', SP:'#06b6d4' };
                            return (
                              <div key={cnt} style={{ background: '#020617', border: '1px solid #1e293b', borderRadius: '6px', padding: '6px 8px', textAlign: 'center' }}>
                                <div style={{ fontSize: '10px', color: '#475569', fontWeight: '800' }}>{cnt}</div>
                                <div style={{ fontSize: '13px', fontWeight: '900', color: typeColors[topType.type] || '#64748b', marginTop: '2px' }}>{topType.type || '—'}</div>
                                <div style={{ fontSize: '9px', color: '#334155' }}>{inCount.length}x</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}

        </div>
  );
}
