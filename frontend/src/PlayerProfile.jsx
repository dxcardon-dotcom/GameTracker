import React, { useEffect, useMemo, useState } from 'react';
import './PlayerProfile.css';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
const defaultLiveGameId = import.meta.env.VITE_DEFAULT_LIVE_GAME_ID || 'irvin-rockets-live';
const fallbackTeamName = 'Irvin Rockets';

function playerName(player) {
  return `${player?.firstName || ''} ${player?.lastName || ''}`.trim() || player?.name || 'Player';
}

function nv(value) { return Number(value || 0); }

function dec(value, places = 3) {
  return Number(value || 0).toFixed(places).replace(/^0/, '');
}

function calcStats(p) {
  const ab = nv(p.ab), hits = nv(p.hits), dbl = nv(p.double), tri = nv(p.triple),
    hr = nv(p.hr), bb = nv(p.bb), ip = nv(p.ip), er = nv(p.er),
    ha = nv(p.hitsAllowed), wa = nv(p.walksAllowed),
    po = nv(p.po), ast = nv(p.assists), err = nv(p.errors);
  const singles = Math.max(0, hits - dbl - tri - hr);
  const tb = singles + dbl * 2 + tri * 3 + hr * 4;
  const pa = ab + bb;
  const fc = po + ast + err;
  return {
    avg: ab ? hits / ab : 0,
    obp: pa ? (hits + bb) / pa : 0,
    slg: ab ? tb / ab : 0,
    ops: (pa ? (hits + bb) / pa : 0) + (ab ? tb / ab : 0),
    era: ip ? (er * 9) / ip : 0,
    whip: ip ? (ha + wa) / ip : 0,
    fp: fc ? (po + ast) / fc : 1,
  };
}

function youtubeEmbed(url) {
  const m = url.match(/(?:v=|youtu\.be\/)([\w-]{11})/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : null;
}

function recruitingColor(status) {
  const map = { Committed: '#22c55e', Signed: '#3b82f6', 'Verbal Commitment': '#a855f7', Open: '#f59e0b', 'Not Looking': '#475569' };
  return map[status] || '#475569';
}

export default function PlayerProfile() {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('loading');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('hitting');

  const params = new URLSearchParams(window.location.search);
  const seasonId = params.get('season') || '';
  const playerId = params.get('player') || '';
  // Legacy fallback: old links used ?game= + stream endpoint
  const legacyGameId = params.get('game') || '';

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        let url, isLegacy = false;
        if (seasonId && playerId) {
          url = `${apiBaseUrl}/api/public/seasons/${encodeURIComponent(seasonId)}/players/${encodeURIComponent(playerId)}`;
        } else if (legacyGameId) {
          url = `${apiBaseUrl}/api/public/games/${encodeURIComponent(legacyGameId)}/stream`;
          isLegacy = true;
        } else {
          setStatus('missing'); return;
        }
        const res = await fetch(url);
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Not found');
        if (!alive) return;
        if (isLegacy) {
          const roster = json.roster || [];
          const p = roster.find(r => String(r.id) === String(params.get('player'))) || roster[0];
          setData({ player: p, teamProfile: json.teamProfile || json.game?.teamProfile || {}, schedule: json.schedule || [], roster });
        } else {
          setData(json);
        }
        setStatus('ok');
      } catch (e) {
        if (!alive) return;
        setStatus('error');
      }
    };
    load();
    return () => { alive = false; };
  }, [seasonId, playerId, legacyGameId]);

  const player = data?.player || null;
  const teamProfile = data?.teamProfile || {};
  const schedule = data?.schedule || [];
  const roster = data?.roster || [];
  const teamName = teamProfile.name || fallbackTeamName;
  const stats = useMemo(() => calcStats(player || {}), [player]);

  const finalGames = schedule.filter(g => g.status === 'Final');
  const videoLinks = [
    player?.highlightUrl,
    ...(typeof player?.videoLinksText === 'string' ? player.videoLinksText.split('\n').map(s => s.trim()).filter(Boolean) : []),
    ...(Array.isArray(player?.videoLinks) ? player.videoLinks : [])
  ].filter(Boolean);

  const shareUrl = seasonId && playerId
    ? `${window.location.origin}/player?season=${encodeURIComponent(seasonId)}&player=${encodeURIComponent(playerId)}`
    : window.location.href;

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const contactLine = [player?.playerEmail, player?.playerPhone].filter(Boolean).join(' · ');
  const familyContact = player?.familyContact || '';

  if (status === 'loading') return (
    <main className="playerProfileShell"><section className="playerEmptyState"><h1>Loading…</h1></section></main>
  );
  if (status === 'missing' || status === 'error' || !player) return (
    <main className="playerProfileShell">
      <section className="playerEmptyState">
        <h1>{status === 'error' ? 'Profile Not Found' : 'No Player Specified'}</h1>
        <p>Check the URL or go back to the team page.</p>
        {seasonId && <a href={`/team?season=${encodeURIComponent(seasonId)}`}>← Team Page</a>}
      </section>
    </main>
  );

  const rcStatus = player.recruitingStatus || 'Open';

  return (
    <main className="playerProfileShell">

      {/* HERO */}
      <header className="playerHero">
        <div className="playerIdentity">
          {player.photoUrl
            ? <img src={player.photoUrl} alt={playerName(player)} className="playerAvatarPhoto" />
            : <div className="playerAvatar">#{player.jersey || '--'}</div>
          }
          <div>
            <p>{teamName} {teamProfile.sport ? `· ${teamProfile.sport}` : ''} {teamProfile.ageGroup ? `· ${teamProfile.ageGroup}` : ''}</p>
            <h1>{playerName(player)}</h1>
            <span>
              {player.primaryPosition || 'UTIL'} · Bats {player.bats || '?'} / Throws {player.throws || '?'}
              {player.classYear ? ` · Class of ${player.classYear}` : ''}
              {player.height ? ` · ${player.height}` : ''}
              {player.weight ? ` / ${player.weight}` : ''}
            </span>
            {rcStatus && (
              <div className="recruitingStatusBadge" style={{ background: `${recruitingColor(rcStatus)}22`, borderColor: recruitingColor(rcStatus), color: recruitingColor(rcStatus) }}>
                {rcStatus === 'Committed' || rcStatus === 'Signed' ? '✅' : rcStatus === 'Open' ? '🔓' : '📋'} {rcStatus}
                {player.committedSchool ? ` — ${player.committedSchool}` : ''}
              </div>
            )}
          </div>
        </div>
        <div className="playerHeroActions">
          {contactLine && (
            <a href={`mailto:${player.playerEmail || ''}`} className="contactBtn">📧 Contact Player</a>
          )}
          {familyContact && (
            <a href={`mailto:${familyContact}`} className="contactBtnSecondary">👨‍👩‍👦 Contact Family</a>
          )}
          <button onClick={copyLink}>{copied ? '✓ Copied!' : '🔗 Share Profile'}</button>
          {seasonId && <a href={`/team?season=${encodeURIComponent(seasonId)}`}>← Team Page</a>}
        </div>
      </header>

      {/* KEY STATS RIBBON */}
      <section className="playerSummaryGrid">
        <div><span>AVG</span><strong>{dec(stats.avg)}</strong></div>
        <div><span>OPS</span><strong>{dec(stats.ops)}</strong></div>
        <div><span>HR</span><strong>{nv(player.hr)}</strong></div>
        <div><span>RBI</span><strong>{nv(player.rbi)}</strong></div>
        <div><span>ERA</span><strong>{stats.era ? stats.era.toFixed(2) : '—'}</strong></div>
        <div><span>K</span><strong>{nv(player.strikeouts)}</strong></div>
      </section>

      {/* CONTENT */}
      <div className="playerContentGrid">

        {/* LEFT COLUMN: stats tabs + video */}
        <div>
          {/* Stat tabs */}
          <div className="playerStatTabs">
            {['hitting','pitching','fielding','gamelog','chart'].map(t => (
              <button key={t} onClick={() => setActiveTab(t)}
                className={`playerStatTabBtn${activeTab === t ? ' playerStatTabActive' : ''}`}>
                {t === 'hitting' ? '🏏' : t === 'pitching' ? '⚾' : t === 'fielding' ? '🧤' : t === 'gamelog' ? '📅' : '📊'}{' '}
                {t === 'gamelog' ? 'Game Log' : t === 'chart' ? 'Career Chart' : t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          <div className="playerCard" style={{ marginBottom: '18px' }}>
            {activeTab === 'hitting' && (
              <div className="playerStatTable">
                <span>G</span><strong>{nv(player.gamesPlayed) || finalGames.length}</strong>
                <span>AB</span><strong>{nv(player.ab)}</strong>
                <span>H</span><strong>{nv(player.hits)}</strong>
                <span>2B</span><strong>{nv(player.double)}</strong>
                <span>3B</span><strong>{nv(player.triple)}</strong>
                <span>HR</span><strong>{nv(player.hr)}</strong>
                <span>R</span><strong>{nv(player.runs)}</strong>
                <span>RBI</span><strong>{nv(player.rbi)}</strong>
                <span>BB</span><strong>{nv(player.bb)}</strong>
                <span>SB</span><strong>{nv(player.sb)}</strong>
                <span>OBP</span><strong>{dec(stats.obp)}</strong>
                <span>SLG</span><strong>{dec(stats.slg)}</strong>
              </div>
            )}
            {activeTab === 'pitching' && (
              <div className="playerStatTable">
                <span>IP</span><strong>{nv(player.ip)}</strong>
                <span>W</span><strong>{nv(player.wins)}</strong>
                <span>ER</span><strong>{nv(player.er)}</strong>
                <span>H</span><strong>{nv(player.hitsAllowed)}</strong>
                <span>BB</span><strong>{nv(player.walksAllowed)}</strong>
                <span>K</span><strong>{nv(player.strikeouts)}</strong>
                <span>ERA</span><strong>{stats.era ? stats.era.toFixed(2) : '0.00'}</strong>
                <span>WHIP</span><strong>{stats.whip ? stats.whip.toFixed(2) : '0.00'}</strong>
              </div>
            )}
            {activeTab === 'fielding' && (
              <div className="playerStatTable">
                <span>PO</span><strong>{nv(player.po)}</strong>
                <span>A</span><strong>{nv(player.assists)}</strong>
                <span>E</span><strong>{nv(player.errors)}</strong>
                <span>FPCT</span><strong>{dec(stats.fp)}</strong>
              </div>
            )}

            {activeTab === 'gamelog' && (() => {
              if (finalGames.length === 0) return (
                <p style={{ color: '#475569', fontSize: '13px', padding: '8px 0' }}>No completed games in this season yet.</p>
              );
              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {finalGames.map((g, gi) => {
                    const isWin = g.result === 'W';
                    return (
                      <div key={gi} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', background: '#0f172a', borderRadius: '8px', border: `1px solid ${isWin ? '#22c55e33' : '#ef444433'}` }}>
                        <span style={{ fontSize: '11px', fontWeight: '900', color: isWin ? '#22c55e' : '#ef4444', minWidth: '16px' }}>{isWin ? 'W' : 'L'}</span>
                        <span style={{ fontSize: '12px', color: '#94a3b8', flex: 1 }}>{g.date} <strong style={{ color: '#cbd5e1' }}>vs {g.opponent}</strong></span>
                        <span style={{ fontSize: '13px', fontWeight: '900', color: '#fff', fontFamily: 'monospace' }}>{g.ourScore}–{g.theirScore}</span>
                      </div>
                    );
                  })}
                  <p style={{ fontSize: '11px', color: '#334155', marginTop: '4px' }}>Per-at-bat breakdowns available after integrating live event logs.</p>
                </div>
              );
            })()}

            {activeTab === 'chart' && (() => {
              const metrics = [
                { label: 'AVG', value: stats.avg, max: 0.5, fmt: v => v.toFixed(3).replace(/^0/,''), color: '#22c55e' },
                { label: 'OBP', value: stats.obp, max: 0.6, fmt: v => v.toFixed(3).replace(/^0/,''), color: '#38bdf8' },
                { label: 'SLG', value: stats.slg, max: 1.0, fmt: v => v.toFixed(3).replace(/^0/,''), color: '#f59e0b' },
                { label: 'HR',  value: nv(player.hr),  max: Math.max(20, nv(player.hr)+1), fmt: v => v, color: '#ef4444' },
                { label: 'RBI', value: nv(player.rbi), max: Math.max(60, nv(player.rbi)+1), fmt: v => v, color: '#a855f7' },
                { label: 'SB',  value: nv(player.sb),  max: Math.max(20, nv(player.sb)+1),  fmt: v => v, color: '#06b6d4' },
              ];
              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '4px 0' }}>
                  {metrics.map(m => {
                    const pct = Math.min(1, m.value / m.max);
                    return (
                      <div key={m.label} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '10px', fontWeight: '800', color: '#475569', width: '28px', textAlign: 'right' }}>{m.label}</span>
                        <div style={{ flex: 1, height: '10px', background: '#1e293b', borderRadius: '5px', overflow: 'hidden' }}>
                          <div style={{ width: `${pct * 100}%`, height: '100%', background: m.color, borderRadius: '5px', transition: 'width 0.6s ease' }} />
                        </div>
                        <span style={{ fontSize: '11px', fontWeight: '900', color: m.color, width: '36px', fontFamily: 'monospace' }}>{m.fmt(m.value)}</span>
                      </div>
                    );
                  })}
                  <p style={{ fontSize: '11px', color: '#334155', marginTop: '6px' }}>Bar width = relative to typical ceiling for that stat.</p>
                </div>
              );
            })()}
          </div>

          {/* Video / Highlights */}
          <div className="playerCard">
            <div className="playerCardHeader"><h2>🎬 Highlights & Video</h2><span>{videoLinks.length} link{videoLinks.length !== 1 ? 's' : ''}</span></div>
            {player.coachNotes && <p className="coachNoteText">💬 {player.coachNotes}</p>}
            {videoLinks.length === 0 ? (
              <p style={{ color: '#475569', fontSize: '13px' }}>No highlights added yet. Coaches add video links from the Roster Manager.</p>
            ) : (
              <div className="playerVideoSection">
                {videoLinks.map((link, i) => {
                  const embed = youtubeEmbed(link);
                  return embed ? (
                    <div key={i} className="videoEmbedWrapper">
                      <iframe src={embed} title={`Highlight ${i + 1}`} frameBorder="0" allowFullScreen />
                    </div>
                  ) : (
                    <a key={i} href={link} target="_blank" rel="noreferrer" className="videoLinkBtn">
                      🎥 {i === 0 ? 'Main Highlight' : `Video ${i + 1}`}
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: recruiting card + roster switcher */}
        <div>
          <div className="playerCard playerRecruitingCard" style={{ marginBottom: '18px' }}>
            <div className="playerCardHeader"><h2>🎓 Recruiting Profile</h2><span>Public</span></div>
            <dl>
              <div><dt>Position(s)</dt><dd>{player.primaryPosition || '—'}</dd></div>
              <div><dt>Class Year</dt><dd>{player.classYear || '—'}</dd></div>
              <div><dt>Height / Weight</dt><dd>{[player.height, player.weight].filter(Boolean).join(' / ') || '—'}</dd></div>
              <div><dt>GPA</dt><dd>{player.gpa || '—'}</dd></div>
              <div><dt>Bats / Throws</dt><dd>{player.bats || '?'} / {player.throws || '?'}</dd></div>
              <div><dt>Recruiting Status</dt><dd style={{ color: recruitingColor(rcStatus) }}>{rcStatus}</dd></div>
              {player.committedSchool && <div><dt>Committed / Target</dt><dd>{player.committedSchool}</dd></div>}
              {player.ncaaId && <div><dt>NCAA ID</dt><dd>{player.ncaaId}</dd></div>}
              {contactLine && <div><dt>Player Contact</dt><dd>{contactLine}</dd></div>}
              {familyContact && <div><dt>Family Contact</dt><dd>{familyContact}</dd></div>}
            </dl>
            {contactLine && (
              <a href={`mailto:${player.playerEmail || ''}`} className="recruitContactCTA">
                📧 Email {player.firstName || 'Player'} About Recruiting
              </a>
            )}
          </div>

          {/* Roster switcher */}
          {roster.length > 1 && (
            <div className="playerCard">
              <div className="playerCardHeader"><h2>👥 Team Roster</h2><span>{roster.length} players</span></div>
              <div className="rosterSwitcher">
                {roster.map(p => (
                  <a
                    key={p.id}
                    href={`/player?season=${encodeURIComponent(seasonId)}&player=${encodeURIComponent(p.id)}`}
                    className={`rosterSwitcherRow${String(p.id) === String(player.id) ? ' rosterSwitcherActive' : ''}`}
                  >
                    <span className="rosterSwitcherJersey">#{p.jersey || '-'}</span>
                    <span className="rosterSwitcherName">{p.firstName} {p.lastName}</span>
                    <span className="rosterSwitcherPos">{p.primaryPosition || 'UTIL'}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SEO FOOTER */}
      <footer className="playerSeoFooter">
        {playerName(player)} · {player.primaryPosition || 'Baseball'} · {teamName}
        {player.classYear ? ` · Class of ${player.classYear}` : ''}
        {teamProfile.location ? ` · ${teamProfile.location}` : ''}
        <br />Powered by <strong>GameTracker</strong> — Baseball & Softball recruiting profiles
      </footer>
    </main>
  );
}
