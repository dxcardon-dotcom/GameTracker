import React, { useEffect, useMemo, useState, useCallback } from 'react';
import './FanGameStream.css';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
const defaultLiveGameId = import.meta.env.VITE_DEFAULT_LIVE_GAME_ID || 'irvin-rockets-live';
const fallbackTeamName = 'Irvin Rockets';

function sumRuns(innings = []) {
  return innings.reduce((total, runs) => total + Number(runs || 0), 0);
}

function formatRecord(record) {
  if (!record) return 'Live Game';
  return record;
}

function formatPlayerName(player) {
  if (!player) return 'Player';
  return `${player.firstName || ''} ${player.lastName || ''}`.trim() || player.name || 'Player';
}

function formatEventLabel(event) {
  const label = event.correctedLabel || event.label || event.result || event.eventType || 'Play recorded';
  return String(label).replaceAll('_', ' ');
}

function eventTimestamp(event) {
  const value = event.createdAt;
  if (!value) return '';
  if (typeof value === 'string') return new Date(value).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  if (value._seconds) return new Date(value._seconds * 1000).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  return '';
}

function statAverage(player) {
  const atBats = Number(player.ab || 0);
  if (!atBats) return '.000';
  return (Number(player.hits || 0) / atBats).toFixed(3).replace(/^0/, '');
}

const EVENT_COLORS = {
  home_run:       { bg: 'rgba(245,158,11,0.15)',  border: 'rgba(245,158,11,0.5)',  label: '💥 HOME RUN',   color: '#f59e0b' },
  single:         { bg: 'rgba(34,197,94,0.1)',    border: 'rgba(34,197,94,0.4)',   label: '✔ Single',      color: '#22c55e' },
  double:         { bg: 'rgba(56,189,248,0.1)',   border: 'rgba(56,189,248,0.4)',  label: '✔ Double',      color: '#38bdf8' },
  triple:         { bg: 'rgba(167,139,250,0.1)',  border: 'rgba(167,139,250,0.4)', label: '✔ Triple',      color: '#a78bfa' },
  strikeout:      { bg: 'rgba(239,68,68,0.08)',   border: 'rgba(239,68,68,0.35)',  label: '✗ Strikeout',   color: '#ef4444' },
  walk:           { bg: 'rgba(96,165,250,0.08)',  border: 'rgba(96,165,250,0.3)',  label: '🚶 Walk',       color: '#60a5fa' },
  hit_by_pitch:   { bg: 'rgba(96,165,250,0.08)',  border: 'rgba(96,165,250,0.3)',  label: '🩹 HBP',        color: '#60a5fa' },
  run:            { bg: 'rgba(251,191,36,0.12)',  border: 'rgba(251,191,36,0.45)', label: '🏃 Run Scores', color: '#fbbf24' },
  correction:     { bg: 'rgba(250,204,21,0.07)',  border: 'rgba(250,204,21,0.4)',  label: '✏ Correction',  color: '#facc15' },
};

function eventStyle(event) {
  const result = event.result || event.eventType || '';
  for (const [key, val] of Object.entries(EVENT_COLORS)) {
    if (result.includes(key)) return val;
  }
  return { bg: 'rgba(2,6,23,0.6)', border: '#1e293b', label: null, color: '#94a3b8' };
}

export default function FanGameStream() {
  const [stream, setStream] = useState(null);
  const [status, setStatus] = useState('Loading live stream');
  const [copied, setCopied] = useState(false);
  const [mobileTab, setMobileTab] = useState('game');
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [notifStatus, setNotifStatus] = useState(() =>
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );

  const gameId = new URLSearchParams(window.location.search).get('game') || defaultLiveGameId;
  const shareUrl = `${window.location.origin}/fan?game=${encodeURIComponent(gameId)}`;
  const playerProfileUrl = (player) => `/player?game=${encodeURIComponent(gameId)}&player=${encodeURIComponent(player?.id || '')}`;

  useEffect(() => {
    let alive = true;

    const loadStream = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/public/games/${encodeURIComponent(gameId)}/stream`);
        const data = await response.json();

        if (!response.ok) throw new Error(data.error || 'Could not load fan stream');
        if (!alive) return;

        setStream(data);
        setStatus('Live');
      } catch (error) {
        if (!alive) return;
        console.error(error);
        setStatus('Could not connect');
      }
    };

    loadStream();
    const interval = window.setInterval(loadStream, 4000);

    return () => {
      alive = false;
      window.clearInterval(interval);
    };
  }, [gameId]);

  const game = stream?.game || {};
  const roster = stream?.roster || [];
  const events = stream?.events || [];
  const teamProfile = stream?.teamProfile || game.teamProfile || {};
  const teamName = teamProfile.name || game.teamProfile?.name || fallbackTeamName;
  const opponentName = game.opponentName || 'Opponent';
  const isHome = game.location !== 'Away';
  const homeName = isHome ? teamName : opponentName;
  const awayName = isHome ? opponentName : teamName;
  const homeRuns = isHome ? sumRuns(game.ourInnings) : sumRuns(game.theirInnings);
  const awayRuns = isHome ? sumRuns(game.theirInnings) : sumRuns(game.ourInnings);
  const battingTeam = game.location === 'Away'
    ? (game.half === 'top' ? teamName : opponentName)
    : (game.half === 'top' ? opponentName : teamName);

  const lineup = useMemo(() => {
    const rosterLookup = roster.reduce((lookup, player) => ({ ...lookup, [player.id]: player }), {});
    if (game.lineupEntries?.length) {
      return game.lineupEntries
        .map((entry, index) => ({
          ...entry,
          order: entry.battingOrder || index + 1,
          player: rosterLookup[entry.playerId],
        }))
        .filter((entry) => entry.player)
        .sort((a, b) => Number(a.order) - Number(b.order));
    }

    return roster.slice(0, 9).map((player, index) => ({
      order: index + 1,
      position: player.primaryPosition || '',
      player,
    }));
  }, [game.lineupEntries, roster]);

  const leaders = useMemo(() => {
    return [...roster]
      .sort((a, b) => Number(b.hits || 0) - Number(a.hits || 0))
      .slice(0, 5);
  }, [roster]);

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  const copyPlayerCard = useCallback(async (player) => {
    const url = `${window.location.origin}${playerProfileUrl(player)}`;
    const text = `Check out ${formatPlayerName(player)} — AVG ${statAverage(player)} · ${Number(player.hr || 0)} HR · ${Number(player.rbi || 0)} RBI. GameTracker Live: ${url}`;
    try { await navigator.clipboard.writeText(text); } catch {}
  }, [gameId]);

  const subscribeNotifs = async () => {
    if (typeof Notification === 'undefined' || !('serviceWorker' in navigator)) {
      setNotifStatus('unsupported');
      return;
    }
    try {
      const permission = await Notification.requestPermission();
      setNotifStatus(permission);
      if (permission !== 'granted') return;

      // Register SW if not yet registered
      let reg = await navigator.serviceWorker.getRegistration('/sw.js');
      if (!reg) reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
      await navigator.serviceWorker.ready;

      // Fetch VAPID public key from server
      const keyRes = await fetch(`${apiBaseUrl}/api/vapid-public-key`);
      const { publicKey } = await keyRes.json();
      if (!publicKey) { setNotifStatus('denied'); return; }

      // Subscribe with push manager
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });

      // Send subscription to server
      await fetch(`${apiBaseUrl}/api/games/${encodeURIComponent(gameId)}/push-subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sub.toJSON()),
      });

      setNotifStatus('granted');
    } catch (e) {
      console.error('Push subscribe error:', e);
      setNotifStatus('denied');
    }
  };

  function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = atob(base64);
    return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)));
  }

  const recentPitches = useMemo(() => {
    return events.filter(e => e.eventType === 'pitch' && e.pitchType).slice(-8).reverse();
  }, [events]);

  const PITCH_COLORS = { FB: '#ef4444', CB: '#3b82f6', CH: '#22c55e', SL: '#f59e0b', CT: '#a855f7', SP: '#06b6d4', '2S': '#f97316', KN: '#6b7280' };

  const innings = game.ourInnings || [];
  const theirInnings2 = game.theirInnings || [];
  const maxInnings = Math.max(innings.length, theirInnings2.length, 7);

  return (
    <main className="fanStreamShell">

      {/* PLAYER STAT CARD OVERLAY */}
      {selectedPlayer && (
        <div className="fanCardOverlay" onClick={() => setSelectedPlayer(null)}>
          <div className="fanStatCard" onClick={e => e.stopPropagation()}>
            <button className="fanStatCardClose" onClick={() => setSelectedPlayer(null)}>×</button>
            <div className="fanStatCardHero">
              <div className="fanStatCardAvatar">#{selectedPlayer.jersey || '?'}</div>
              <div>
                <div className="fanStatCardName">{formatPlayerName(selectedPlayer)}</div>
                <div className="fanStatCardMeta">{selectedPlayer.primaryPosition || 'Player'} · {selectedPlayer.classYear ? `Class of ${selectedPlayer.classYear}` : teamName}</div>
              </div>
            </div>
            <div className="fanStatCardGrid">
              {[['AVG', statAverage(selectedPlayer)], ['HR', selectedPlayer.hr || 0], ['RBI', selectedPlayer.rbi || 0], ['H', selectedPlayer.hits || 0], ['BB', selectedPlayer.bb || 0], ['SB', selectedPlayer.sb || 0]].map(([lbl, val]) => (
                <div key={lbl} className="fanStatCardStat">
                  <span>{lbl}</span>
                  <strong>{val}</strong>
                </div>
              ))}
            </div>
            {(selectedPlayer.ip > 0) && (
              <div className="fanStatCardGrid" style={{ marginTop: '8px' }}>
                {[['IP', selectedPlayer.ip], ['ERA', selectedPlayer.ip ? ((selectedPlayer.er * 9) / selectedPlayer.ip).toFixed(2) : '—'], ['K', selectedPlayer.strikeouts || 0]].map(([lbl, val]) => (
                  <div key={lbl} className="fanStatCardStat">
                    <span>{lbl}</span>
                    <strong>{val}</strong>
                  </div>
                ))}
              </div>
            )}
            <div className="fanStatCardActions">
              <a href={playerProfileUrl(selectedPlayer)} className="fanStatCardBtn fanStatCardBtnPrimary">🎓 Recruiting Profile</a>
              <button className="fanStatCardBtn" onClick={() => copyPlayerCard(selectedPlayer)}>📋 Copy Share Card</button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <header className="fanHero">
        <div className="fanBrand">
          {stream?.brandingLogo ? (
            <img src={stream.brandingLogo} alt={`${teamName} logo`} />
          ) : (
            <div className="fanLogoMark">GT</div>
          )}
          <div>
            <p>GameTracker Live</p>
            <h1>{teamName}</h1>
          </div>
        </div>
        <div className="fanHeroActions">
          <span className={status === 'Live' ? 'fanLivePill' : 'fanOfflinePill'}>{status === 'Live' ? '🔴 LIVE' : status}</span>
          {notifStatus !== 'granted' ? (
            <button onClick={subscribeNotifs} className="fanSubBtn">🔔 Subscribe</button>
          ) : (
            <span className="fanSubbedPill">🔔 Subscribed</span>
          )}
          <button onClick={copyShareLink}>{copied ? '✓ Copied!' : '🔗 Share'}</button>
          <a href="/">Coach Console</a>
        </div>
      </header>

      {/* SCOREBOARD */}
      <section className="fanScoreboard">
        <div className="fanTeamScore">
          <span>Away</span>
          <strong>{awayName}</strong>
          <b>{awayRuns}</b>
        </div>
        <div className="fanGameState">
          <span>{formatRecord(game.gameType)} · {game.gameDate || 'Today'}</span>
          <strong>{game.half === 'bottom' ? '▼' : '▲'} {game.inning || 1}</strong>
          <small>{battingTeam} batting</small>
          <div className="fanBasesRow">
            <div className={`fanBase fanBase2B ${game.runners?.second ? 'fanBaseOn' : ''}`} />
            <div className={`fanBase fanBase3B ${game.runners?.third ? 'fanBaseOn' : ''}`} />
            <div className={`fanBase fanBase1B ${game.runners?.first ? 'fanBaseOn' : ''}`} />
          </div>
          <div className="fanCountRow">
            <span>{game.balls || 0}-{game.strikes || 0} <small>B-S</small></span>
            <span>{game.outs || 0} <small>OUT{game.outs !== 1 ? 'S' : ''}</small></span>
          </div>
        </div>
        <div className="fanTeamScore fanTeamScoreHome">
          <span>Home</span>
          <strong>{homeName}</strong>
          <b>{homeRuns}</b>
        </div>
      </section>

      {/* INNING BOX SCORE */}
      <div className="fanBoxScoreWrap">
        <table className="fanBoxScore">
          <thead>
            <tr>
              <th>Team</th>
              {Array.from({ length: maxInnings }, (_, i) => <th key={i}>{i + 1}</th>)}
              <th className="fanBoxR">R</th>
              <th>H</th>
              <th>E</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="fanBoxTeam">{awayName}</td>
              {Array.from({ length: maxInnings }, (_, i) => <td key={i}>{isHome ? (theirInnings2[i] ?? '') : (innings[i] ?? '')}</td>)}
              <td className="fanBoxR">{awayRuns}</td>
              <td>{isHome ? (game.theirHits || 0) : (game.ourHits || 0)}</td>
              <td>{isHome ? (game.theirErrors || 0) : (game.ourErrors || 0)}</td>
            </tr>
            <tr>
              <td className="fanBoxTeam">{homeName}</td>
              {Array.from({ length: maxInnings }, (_, i) => <td key={i}>{isHome ? (innings[i] ?? '') : (theirInnings2[i] ?? '')}</td>)}
              <td className="fanBoxR">{homeRuns}</td>
              <td>{isHome ? (game.ourHits || 0) : (game.theirHits || 0)}</td>
              <td>{isHome ? (game.ourErrors || 0) : (game.theirErrors || 0)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* MOBILE TAB BAR */}
      <div className="fanMobileTabs">
        {[['game','⚾ Game'],['feed','📡 Feed'],['lineup','📋 Lineup'],['stats','📊 Stats']].map(([id, label]) => (
          <button key={id} className={mobileTab === id ? 'fanMobileTabActive' : ''} onClick={() => setMobileTab(id)}>{label}</button>
        ))}
      </div>

      {/* MAIN GRID */}
      <section className={`fanLiveGrid ${mobileTab !== 'game' && mobileTab !== 'feed' ? 'fanHideOnMobile' : ''}`}>

        {/* GAME STATE CARD */}
        <div className={`fanGameCard fanFieldCard ${mobileTab === 'feed' ? 'fanHideOnMobile' : ''}`}>
          <div className="fanCardHeader">
            <h2>Game State</h2>
            <span>{game.pitchCount || 0} pitches</span>
          </div>
          <div className="fanMatchup">
            <div><span>Batter</span><strong>{game.currentBatter || '—'}</strong></div>
            <div><span>Pitcher</span><strong>{game.currentPitcher || '—'}</strong></div>
          </div>
          {recentPitches.length > 0 && (
            <div className="fanPitchStrip">
              <div className="fanPitchStripLabel">Recent pitches</div>
              <div className="fanPitchDots">
                {recentPitches.map((p, i) => (
                  <div key={p.id || i} className="fanPitchDot" style={{ background: PITCH_COLORS[p.pitchType] || '#475569' }} title={`${p.pitchType}${p.pitchVelo ? ` ${p.pitchVelo}mph` : ''} — ${p.result?.replace(/_/g,' ')}`}>
                    <span>{p.pitchType}</span>
                    {p.pitchVelo && <small>{p.pitchVelo}</small>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* PLAY FEED CARD */}
        <div className={`fanGameCard fanFeedCard ${mobileTab === 'game' ? 'fanHideOnMobile' : ''}`}>
          <div className="fanCardHeader">
            <h2>Live Play Feed</h2>
            <span>{events.filter(e => e.eventType !== 'pitch').length} plays</span>
          </div>
          <div className="fanFeedList">
            {events.length === 0 ? (
              <p className="fanEmptyState">No plays recorded yet. Feed updates live as scoring begins.</p>
            ) : (
              events.filter(e => e.eventType !== 'pitch').map((event) => {
                const style = eventStyle(event);
                return (
                  <article key={event.id} style={{ background: style.bg, borderColor: style.border }}>
                    <div>
                      {style.label && <div className="fanEventBadge" style={{ color: style.color }}>{style.label}</div>}
                      <strong>{formatEventLabel(event)}</strong>
                      <span>{event.batterLabel || 'Current batter'} vs {event.pitcherLabel || 'current pitcher'}</span>
                      {event.note ? <small>📝 {event.note}</small> : null}
                      {event.correctionNote ? <small>✏ {event.correctionNote}</small> : null}
                    </div>
                    <time>{eventTimestamp(event) || `#${event.sequence || '-'}`}</time>
                  </article>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* BOTTOM GRID */}
      <section className="fanBottomGrid">
        <div className={`fanGameCard ${mobileTab !== 'lineup' && mobileTab !== 'game' ? 'fanHideOnMobile' : ''}`}>
          <div className="fanCardHeader">
            <h2>Lineup</h2>
            <span>{lineup.length} players</span>
          </div>
          <div className="fanLineupList">
            {lineup.length === 0 ? (
              <p className="fanEmptyState">No lineup posted yet.</p>
            ) : (
              lineup.map((entry) => (
                <div key={`${entry.order}-${entry.player?.id || entry.playerId}`} className="fanLineupRow" onClick={() => entry.player && setSelectedPlayer(entry.player)}>
                  <b>{entry.order}</b>
                  <div>
                    <span className="fanLineupName">{formatPlayerName(entry.player)}</span>
                    <span className="fanLineupMeta">#{entry.player?.jersey || '-'} · {entry.position || entry.player?.primaryPosition || 'UTIL'}</span>
                  </div>
                  <span className="fanLineupAvg">{statAverage(entry.player)}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className={`fanGameCard ${mobileTab !== 'stats' && mobileTab !== 'game' ? 'fanHideOnMobile' : ''}`}>
          <div className="fanCardHeader">
            <h2>Player Leaders</h2>
            <span>Tap for stat card</span>
          </div>
          <div className="fanLeaderList">
            {leaders.length === 0 ? (
              <p className="fanEmptyState">No roster stats yet.</p>
            ) : (
              leaders.map((player) => (
                <div key={player.id || formatPlayerName(player)} className="fanLeaderRow" onClick={() => setSelectedPlayer(player)}>
                  <div className="fanLeaderAvatar">#{player.jersey || '?'}</div>
                  <div>
                    <span className="fanLeaderName">{formatPlayerName(player)}</span>
                    <span className="fanLeaderStats">AVG {statAverage(player)} · {Number(player.hr || 0)} HR · {Number(player.rbi || 0)} RBI</span>
                  </div>
                  <span className="fanLeaderArrow">›</span>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
