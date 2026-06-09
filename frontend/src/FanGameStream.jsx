import React, { useEffect, useMemo, useState } from 'react';
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

export default function FanGameStream() {
  const [stream, setStream] = useState(null);
  const [status, setStatus] = useState('Loading live stream');
  const [copied, setCopied] = useState(false);

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

  return (
    <main className="fanStreamShell">
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
          <span className={status === 'Live' ? 'fanLivePill' : 'fanOfflinePill'}>{status}</span>
          <button onClick={copyShareLink}>{copied ? 'Copied' : 'Copy Share Link'}</button>
          <a href="/">Coach Console</a>
        </div>
      </header>

      <section className="fanScoreboard">
        <div className="fanTeamScore">
          <span>Away</span>
          <strong>{awayName}</strong>
          <b>{awayRuns}</b>
        </div>
        <div className="fanGameState">
          <span>{formatRecord(game.gameType)} · {game.gameDate || 'Today'}</span>
          <strong>{game.half === 'bottom' ? 'Bottom' : 'Top'} {game.inning || 1}</strong>
          <small>{battingTeam} batting</small>
        </div>
        <div className="fanTeamScore fanTeamScoreHome">
          <span>Home</span>
          <strong>{homeName}</strong>
          <b>{homeRuns}</b>
        </div>
      </section>

      <section className="fanLiveGrid">
        <div className="fanGameCard fanFieldCard">
          <div className="fanCardHeader">
            <h2>Game State</h2>
            <span>{game.status || 'live'}</span>
          </div>
          <div className="fanCountGrid">
            <div><span>Balls</span><strong>{game.balls || 0}</strong></div>
            <div><span>Strikes</span><strong>{game.strikes || 0}</strong></div>
            <div><span>Outs</span><strong>{game.outs || 0}</strong></div>
            <div><span>Pitches</span><strong>{game.pitchCount || 0}</strong></div>
          </div>
          <div className="fanDiamond">
            <span className={game.runners?.second ? 'occupied' : ''}>2B</span>
            <span className={game.runners?.third ? 'occupied' : ''}>3B</span>
            <span className={game.runners?.first ? 'occupied' : ''}>1B</span>
            <span>HP</span>
          </div>
          <div className="fanMatchup">
            <div><span>Batter</span><strong>{game.currentBatter || 'Not set'}</strong></div>
            <div><span>Pitcher</span><strong>{game.currentPitcher || 'Not set'}</strong></div>
          </div>
        </div>

        <div className="fanGameCard fanFeedCard">
          <div className="fanCardHeader">
            <h2>Live Play Feed</h2>
            <span>{events.length} updates</span>
          </div>
          <div className="fanFeedList">
            {events.length === 0 ? (
              <p>No plays recorded yet. The feed will update once scoring begins.</p>
            ) : (
              events.map((event) => (
                <article key={event.id} className={event.eventType === 'correction' ? 'fanFeedCorrection' : ''}>
                  <div>
                    <strong>{formatEventLabel(event)}</strong>
                    <span>{event.batterLabel || 'Current batter'} vs {event.pitcherLabel || 'current pitcher'}</span>
                    {event.note ? <small>{event.note}</small> : null}
                    {event.correctionNote ? <small>Correction: {event.correctionNote}</small> : null}
                  </div>
                  <time>{eventTimestamp(event) || `#${event.sequence || '-'}`}</time>
                </article>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="fanBottomGrid">
        <div className="fanGameCard">
          <div className="fanCardHeader">
            <h2>Lineup</h2>
            <span>{lineup.length} players</span>
          </div>
          <div className="fanLineupList">
            {lineup.length === 0 ? (
              <p>No lineup posted yet.</p>
            ) : (
              lineup.map((entry) => (
                <div key={`${entry.order}-${entry.player?.id || entry.playerId}`}>
                  <b>{entry.order}</b>
                  <a href={playerProfileUrl(entry.player)}>{formatPlayerName(entry.player)}</a>
                  <span>#{entry.player?.jersey || '-'} · {entry.position || entry.player?.primaryPosition || 'UTIL'}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="fanGameCard">
          <div className="fanCardHeader">
            <h2>Player Leaders</h2>
            <span>Season</span>
          </div>
          <div className="fanLeaderList">
            {leaders.length === 0 ? (
              <p>No roster stats yet.</p>
            ) : (
              leaders.map((player) => (
                <div key={player.id || formatPlayerName(player)}>
                  <a href={playerProfileUrl(player)}>{formatPlayerName(player)}</a>
                  <span>AVG {statAverage(player)} · H {Number(player.hits || 0)} · RBI {Number(player.rbi || 0)}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
