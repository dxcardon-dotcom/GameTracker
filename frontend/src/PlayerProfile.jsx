import React, { useEffect, useMemo, useState } from 'react';
import './PlayerProfile.css';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
const defaultLiveGameId = import.meta.env.VITE_DEFAULT_LIVE_GAME_ID || 'irvin-rockets-live';
const fallbackTeamName = 'Irvin Rockets';

function playerName(player) {
  return `${player?.firstName || ''} ${player?.lastName || ''}`.trim() || player?.name || 'Player';
}

function numberValue(value) {
  return Number(value || 0);
}

function decimal(value, places = 3) {
  return Number(value || 0).toFixed(places).replace(/^0/, '');
}

function calculatePlayerStats(player) {
  const ab = numberValue(player.ab);
  const hits = numberValue(player.hits);
  const doubles = numberValue(player.double);
  const triples = numberValue(player.triple);
  const hr = numberValue(player.hr);
  const bb = numberValue(player.bb);
  const ip = numberValue(player.ip);
  const er = numberValue(player.er);
  const hitsAllowed = numberValue(player.hitsAllowed);
  const walksAllowed = numberValue(player.walksAllowed);
  const po = numberValue(player.po);
  const assists = numberValue(player.assists);
  const errors = numberValue(player.errors);

  const singles = Math.max(0, hits - doubles - triples - hr);
  const totalBases = singles + doubles * 2 + triples * 3 + hr * 4;
  const plateAppearances = ab + bb;
  const fieldingChances = po + assists + errors;

  return {
    avg: ab ? hits / ab : 0,
    obp: plateAppearances ? (hits + bb) / plateAppearances : 0,
    slg: ab ? totalBases / ab : 0,
    ops: (plateAppearances ? (hits + bb) / plateAppearances : 0) + (ab ? totalBases / ab : 0),
    era: ip ? (er * 7) / ip : 0,
    whip: ip ? (hitsAllowed + walksAllowed) / ip : 0,
    fieldingPct: fieldingChances ? (po + assists) / fieldingChances : 1,
  };
}

export default function PlayerProfile() {
  const [stream, setStream] = useState(null);
  const [status, setStatus] = useState('Loading profile');
  const [copied, setCopied] = useState(false);

  const params = new URLSearchParams(window.location.search);
  const gameId = params.get('game') || defaultLiveGameId;
  const playerId = params.get('player') || '';
  const shareUrl = `${window.location.origin}/player?game=${encodeURIComponent(gameId)}&player=${encodeURIComponent(playerId)}`;

  useEffect(() => {
    let alive = true;

    const loadProfile = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/public/games/${encodeURIComponent(gameId)}/stream`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Could not load player profile');
        if (!alive) return;
        setStream(data);
        setStatus('Live profile');
      } catch (error) {
        if (!alive) return;
        console.error(error);
        setStatus('Could not connect');
      }
    };

    loadProfile();

    return () => {
      alive = false;
    };
  }, [gameId]);

  const roster = stream?.roster || [];
  const teamProfile = stream?.teamProfile || stream?.game?.teamProfile || {};
  const teamName = teamProfile.name || fallbackTeamName;
  const player = roster.find((item) => String(item.id) === String(playerId)) || roster[0] || null;
  const stats = useMemo(() => calculatePlayerStats(player || {}), [player]);
  const schedule = stream?.schedule || [];
  const finalGames = schedule.filter((game) => game.status === 'Final');
  const videoLinks = [
    player?.highlightUrl,
    ...(Array.isArray(player?.videoLinks) ? player.videoLinks : [])
  ].filter(Boolean);

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  if (!player) {
    return (
      <main className="playerProfileShell">
        <section className="playerEmptyState">
          <h1>No Player Found</h1>
          <p>Add players to the roster, then open a profile from the fan page or coach roster.</p>
          <a href={`/fan?game=${encodeURIComponent(gameId)}`}>Back to Fan View</a>
        </section>
      </main>
    );
  }

  return (
    <main className="playerProfileShell">
      <header className="playerHero">
        <div className="playerIdentity">
          <div className="playerAvatar">#{player.jersey || '--'}</div>
          <div>
            <p>{teamName}</p>
            <h1>{playerName(player)}</h1>
            <span>
              {player.primaryPosition || 'UTIL'} · Bats {player.bats || '-'} / Throws {player.throws || '-'}
              {player.classYear ? ` · Class of ${player.classYear}` : ''}
            </span>
          </div>
        </div>
        <div className="playerHeroActions">
          <span className={status === 'Live profile' ? 'playerLivePill' : 'playerOfflinePill'}>{status}</span>
          <button onClick={copyShareLink}>{copied ? 'Copied' : 'Copy Profile Link'}</button>
          <a href={`/fan?game=${encodeURIComponent(gameId)}`}>Fan View</a>
        </div>
      </header>

      <section className="playerSummaryGrid">
        <div>
          <span>AVG</span>
          <strong>{decimal(stats.avg)}</strong>
        </div>
        <div>
          <span>OPS</span>
          <strong>{decimal(stats.ops)}</strong>
        </div>
        <div>
          <span>RBI</span>
          <strong>{numberValue(player.rbi)}</strong>
        </div>
        <div>
          <span>ERA</span>
          <strong>{stats.era ? stats.era.toFixed(2) : '0.00'}</strong>
        </div>
      </section>

      <section className="playerContentGrid">
        <div className="playerCard">
          <div className="playerCardHeader">
            <h2>Hitting</h2>
            <span>Season</span>
          </div>
          <div className="playerStatTable">
            <span>G</span><strong>{numberValue(player.gamesPlayed) || finalGames.length}</strong>
            <span>AB</span><strong>{numberValue(player.ab)}</strong>
            <span>H</span><strong>{numberValue(player.hits)}</strong>
            <span>2B</span><strong>{numberValue(player.double)}</strong>
            <span>3B</span><strong>{numberValue(player.triple)}</strong>
            <span>HR</span><strong>{numberValue(player.hr)}</strong>
            <span>R</span><strong>{numberValue(player.runs)}</strong>
            <span>RBI</span><strong>{numberValue(player.rbi)}</strong>
            <span>BB</span><strong>{numberValue(player.bb)}</strong>
            <span>SB</span><strong>{numberValue(player.sb)}</strong>
            <span>OBP</span><strong>{decimal(stats.obp)}</strong>
            <span>SLG</span><strong>{decimal(stats.slg)}</strong>
          </div>
        </div>

        <div className="playerCard">
          <div className="playerCardHeader">
            <h2>Pitching</h2>
            <span>Season</span>
          </div>
          <div className="playerStatTable">
            <span>IP</span><strong>{numberValue(player.ip)}</strong>
            <span>W</span><strong>{numberValue(player.wins)}</strong>
            <span>ER</span><strong>{numberValue(player.er)}</strong>
            <span>H</span><strong>{numberValue(player.hitsAllowed)}</strong>
            <span>BB</span><strong>{numberValue(player.walksAllowed)}</strong>
            <span>K</span><strong>{numberValue(player.strikeouts)}</strong>
            <span>ERA</span><strong>{stats.era ? stats.era.toFixed(2) : '0.00'}</strong>
            <span>WHIP</span><strong>{stats.whip ? stats.whip.toFixed(2) : '0.00'}</strong>
          </div>
        </div>

        <div className="playerCard">
          <div className="playerCardHeader">
            <h2>Fielding</h2>
            <span>Season</span>
          </div>
          <div className="playerStatTable">
            <span>PO</span><strong>{numberValue(player.po)}</strong>
            <span>A</span><strong>{numberValue(player.assists)}</strong>
            <span>E</span><strong>{numberValue(player.errors)}</strong>
            <span>FPCT</span><strong>{decimal(stats.fieldingPct)}</strong>
          </div>
        </div>

        <div className="playerCard playerRecruitingCard">
          <div className="playerCardHeader">
            <h2>Recruiting Snapshot</h2>
            <span>Profile</span>
          </div>
          <dl>
            <div><dt>Primary Position</dt><dd>{player.primaryPosition || 'Not set'}</dd></div>
            <div><dt>Class Year</dt><dd>{player.classYear || 'Not set'}</dd></div>
            <div><dt>Height / Weight</dt><dd>{player.height || 'Not set'} / {player.weight || 'Not set'}</dd></div>
            <div><dt>GPA</dt><dd>{player.gpa || 'Not set'}</dd></div>
            <div><dt>Recruiting Status</dt><dd>{player.recruitingStatus || 'Open'}</dd></div>
            <div><dt>Committed / Target School</dt><dd>{player.committedSchool || 'Not listed'}</dd></div>
            <div><dt>NCAA ID</dt><dd>{player.ncaaId || 'Not listed'}</dd></div>
            <div><dt>Player Contact</dt><dd>{player.playerEmail || player.playerPhone || 'Not listed'}</dd></div>
            <div><dt>Family Contact</dt><dd>{player.familyContact || 'Not listed'}</dd></div>
            <div><dt>Share Status</dt><dd>Public profile link ready</dd></div>
          </dl>
        </div>
      </section>

      <section className="playerMediaPlaceholder">
        <div>
          <h2>Video, Highlights, and Verified Notes</h2>
          <p>{player.coachNotes || 'Add highlight links and coach notes from the roster manager to build this recruiting profile.'}</p>
        </div>
        {videoLinks.length ? (
          <div className="playerVideoLinks">
            {videoLinks.map((link, index) => (
              <a key={`${link}-${index}`} href={link} target="_blank" rel="noreferrer">
                {index === 0 ? 'Main Highlight' : `Video ${index + 1}`}
              </a>
            ))}
          </div>
        ) : (
          <button disabled>No videos yet</button>
        )}
      </section>
    </main>
  );
}
