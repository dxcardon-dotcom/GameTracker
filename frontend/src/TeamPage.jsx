import React, { useEffect, useState } from 'react';
import './TeamPage.css';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

function sportEmoji(sport) {
  return sport === 'Softball' ? '🥎' : '⚾';
}

function avg(player) {
  const ab = Number(player.ab || 0);
  if (!ab) return '.000';
  return (Number(player.hits || 0) / ab).toFixed(3).replace(/^0/, '');
}

function era(player) {
  const ip = Number(player.ip || 0);
  if (!ip) return '-.--';
  return ((Number(player.er || 0) * 9) / ip).toFixed(2);
}

export default function TeamPage() {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('loading');
  const [copied, setCopied] = useState(false);

  const params = new URLSearchParams(window.location.search);
  const seasonId = params.get('season');

  useEffect(() => {
    if (!seasonId) { setStatus('missing'); return; }
    fetch(`${apiBaseUrl}/api/public/seasons/${encodeURIComponent(seasonId)}`)
      .then(r => r.json())
      .then(d => { setData(d); setStatus('ok'); })
      .catch(() => setStatus('error'));
  }, [seasonId]);

  const shareUrl = window.location.href;

  const copyShare = () => {
    navigator.clipboard?.writeText(shareUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (status === 'loading') return <div className="teamPage"><div className="loadingState">Loading team page…</div></div>;
  if (status === 'missing') return <div className="teamPage"><div className="loadingState">No season specified. Add ?season=YOUR_SEASON_ID to the URL.</div></div>;
  if (status === 'error') return <div className="teamPage"><div className="loadingState">Could not load team data.</div></div>;

  const profile = data.teamProfile || {};
  const roster = data.roster || [];
  const schedule = data.schedule || [];
  const sport = profile.sport || 'Baseball';

  const finalGames = schedule.filter(g => g.status === 'Final');
  const wins = finalGames.filter(g => g.result === 'W').length;
  const losses = finalGames.filter(g => g.result === 'L').length;
  const runsScored = finalGames.reduce((s, g) => s + Number(g.ourScore || 0), 0);
  const runsAllowed = finalGames.reduce((s, g) => s + Number(g.theirScore || 0), 0);

  const totalAb = roster.reduce((s, p) => s + Number(p.ab || 0), 0);
  const totalHits = roster.reduce((s, p) => s + Number(p.hits || 0), 0);
  const teamAvg = totalAb ? (totalHits / totalAb).toFixed(3).replace(/^0/, '') : '.000';

  const sortedRoster = [...roster].sort((a, b) => Number(a.jersey || 99) - Number(b.jersey || 99));

  const topHitters = [...roster]
    .filter(p => Number(p.ab || 0) >= 5)
    .sort((a, b) => (Number(b.hits || 0) / Number(b.ab || 1)) - (Number(a.hits || 0) / Number(a.ab || 1)))
    .slice(0, 3);

  const sortedSchedule = [...schedule].sort((a, b) => String(a.date || '').localeCompare(String(b.date || '')));

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className="teamPage">

      {/* HERO */}
      <div className="hero">
        {profile.logoUrl
          ? <img src={profile.logoUrl} alt="Team logo" className="heroLogo" />
          : <div className="heroLogoPlaceholder">{sportEmoji(sport)}</div>
        }
        <div className="heroInfo">
          <h1>{profile.teamName || 'Team'}</h1>
          <div className="heroMeta">
            {profile.sport && <span className="heroBadge">{sportEmoji(sport)} {profile.sport}</span>}
            {profile.teamType && <span className="heroBadge">{profile.teamType}</span>}
            {profile.ageGroup && <span className="heroBadge">{profile.ageGroup}</span>}
            {profile.location && <span className="heroBadge">📍 {profile.location}</span>}
            {seasonId && <span className="heroBadge">📅 {seasonId}</span>}
          </div>
          <div className="heroRecord">
            <div className="recordBox">
              <span>W</span>
              <strong style={{ color: '#22c55e' }}>{wins}</strong>
            </div>
            <div className="recordDivider">–</div>
            <div className="recordBox">
              <span>L</span>
              <strong style={{ color: '#ef4444' }}>{losses}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* STAT RIBBON */}
      <div className="statRibbon">
        {[
          ['RS', runsScored],
          ['RA', runsAllowed],
          ['TEAM AVG', teamAvg],
          ['ROSTER', roster.length],
          ['GAMES', schedule.length],
        ].map(([label, val]) => (
          <div className="statRibbonItem" key={label}>
            <span>{label}</span>
            <strong>{val}</strong>
          </div>
        ))}
      </div>

      {/* MAIN CONTENT */}
      <div className="pageContent">

        {/* LEFT: schedule */}
        <div>
          <div className="schedulePanel">
            <p className="sectionTitle">📅 Season Schedule</p>
            {sortedSchedule.length === 0
              ? <p style={{ color: '#475569', fontSize: '13px' }}>No games scheduled yet.</p>
              : sortedSchedule.map((game, i) => (
                <div className="gameRow" key={game.id || i}>
                  <div className="gameDate">{game.date || 'TBD'}</div>
                  <div className="gameOpponent">
                    <span style={{ color: '#64748b', fontSize: '12px', marginRight: '4px' }}>
                      {game.location === 'Away' ? '@' : 'vs'}
                    </span>
                    {game.opponent || 'Opponent TBD'}
                    <small>{game.type}{game.venue ? ` · ${game.venue}` : ''}</small>
                  </div>
                  <div className="gameResult">
                    {game.status === 'Final' ? (
                      <>
                        <div className={`resultBadge ${game.result === 'W' ? 'win' : 'loss'}`}>
                          {game.result}
                        </div>
                        <span className="scoreText">{game.ourScore ?? '-'}-{game.theirScore ?? '-'}</span>
                      </>
                    ) : game.status === 'Live' ? (
                      <span className="live">● LIVE</span>
                    ) : (
                      <span className="scheduled">{game.status || 'Scheduled'}</span>
                    )}
                  </div>
                </div>
              ))
            }
          </div>
        </div>

        {/* RIGHT: sidebar */}
        <div className="sidebar">

          {/* Roster */}
          <div className="sidePanel">
            <p className="sectionTitle">👥 Roster</p>
            {sortedRoster.length === 0
              ? <p style={{ color: '#475569', fontSize: '13px' }}>No roster yet.</p>
              : sortedRoster.map((p, i) => (
                <div className="rosterRow" key={p.id || i}>
                  <div className="rosterJersey">#{p.jersey || '-'}</div>
                  <div className="rosterName">
                    {p.firstName} {p.lastName}
                  </div>
                  <div className="rosterPos">{p.primaryPosition || '-'}</div>
                  <div className="rosterAvg">{avg(p)}</div>
                </div>
              ))
            }
          </div>

          {/* Top Hitters */}
          {topHitters.length > 0 && (
            <div className="sidePanel">
              <p className="sectionTitle">🏆 Top Hitters</p>
              {topHitters.map((p, i) => (
                <div className="leaderRow" key={p.id || i}>
                  <span className="leaderRank">{medals[i]}</span>
                  <span className="leaderName">{p.firstName} {p.lastName}</span>
                  <span className="leaderVal">{avg(p)}</span>
                </div>
              ))}
            </div>
          )}

          {/* About */}
          <div className="sidePanel" style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.6' }}>
            <p className="sectionTitle">ℹ️ About</p>
            <p style={{ margin: '0 0 6px' }}>
              {sportEmoji(sport)} {profile.teamName || 'This team'} is tracked live on <strong style={{ color: '#94a3b8' }}>GameTracker</strong> — pitch-by-pitch scoring, stats, and recruiting for baseball &amp; softball.
            </p>
            <p style={{ margin: 0 }}>
              Coaches, players, and families follow along in real time.
            </p>
          </div>

        </div>
      </div>

      {/* SEO FOOTER */}
      <div className="seoFooter">
        Powered by <strong>GameTracker</strong> — Live baseball &amp; softball scoring, stats, and recruiting.
        <br />
        {profile.teamName} · {sport} · {seasonId}
      </div>

      {/* STICKY SHARE BAR */}
      <div className="shareBar">
        <span>Share this team page</span>
        <button className="shareBtn" onClick={copyShare}>
          {copied ? '✓ Copied!' : '🔗 Copy Link'}
        </button>
      </div>

    </div>
  );
}
