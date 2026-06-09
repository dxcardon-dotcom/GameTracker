import React, { useEffect, useState, useMemo } from 'react';
import './DiscoverPage.css';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

const POSITIONS = ['', 'P', 'C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF', 'DH', 'UTIL'];
const CLASS_YEARS = ['', '2025', '2026', '2027', '2028', '2029', '2030'];
const SPORTS = ['', 'Baseball', 'Softball'];
const RC_STATUSES = ['', 'Open', 'Committed', 'Signed', 'Verbal Commitment', 'Not Looking'];
const SORT_OPTIONS = [
  { key: 'avg', label: 'AVG' },
  { key: 'hr', label: 'HR' },
  { key: 'rbi', label: 'RBI' },
  { key: 'so', label: 'K' },
  { key: 'era', label: 'ERA' },
];

function rcColor(status) {
  return { Committed: '#22c55e', Signed: '#3b82f6', 'Verbal Commitment': '#a855f7', Open: '#f59e0b', 'Not Looking': '#475569' }[status] || '#475569';
}

function fmtAvg(v) {
  if (!v && v !== 0) return '—';
  return Number(v).toFixed(3).replace(/^0/, '');
}

function fmtEra(v) {
  if (v === null || v === undefined) return '—';
  return Number(v).toFixed(2);
}

export default function DiscoverPage() {
  const [allPlayers, setAllPlayers] = useState([]);
  const [loadStatus, setLoadStatus] = useState('loading');
  const [search, setSearch] = useState('');
  const [filterPos, setFilterPos] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterSport, setFilterSport] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortKey, setSortKey] = useState('avg');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setFilterPos(params.get('position') || '');
    setFilterClass(params.get('classYear') || '');
    setFilterSport(params.get('sport') || '');
    setFilterStatus(params.get('status') || '');

    const url = new URL(`${apiBaseUrl}/api/public/discover`);
    fetch(url.toString())
      .then(r => r.json())
      .then(d => { setAllPlayers(d.players || []); setLoadStatus('ok'); })
      .catch(() => setLoadStatus('error'));
  }, []);

  const filtered = useMemo(() => {
    let list = [...allPlayers];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        `${p.firstName} ${p.lastName}`.toLowerCase().includes(q) ||
        (p.teamName || '').toLowerCase().includes(q) ||
        (p.teamLocation || '').toLowerCase().includes(q)
      );
    }
    if (filterPos) list = list.filter(p => p.primaryPosition === filterPos);
    if (filterClass) list = list.filter(p => String(p.classYear) === String(filterClass));
    if (filterSport) list = list.filter(p => p.teamSport === filterSport);
    if (filterStatus) list = list.filter(p => p.recruitingStatus === filterStatus);

    list.sort((a, b) => {
      if (sortKey === 'era') {
        const av = a.era === null ? 999 : a.era;
        const bv = b.era === null ? 999 : b.era;
        return av - bv;
      }
      return (b[sortKey] || 0) - (a[sortKey] || 0);
    });
    return list;
  }, [allPlayers, search, filterPos, filterClass, filterSport, filterStatus, sortKey]);

  const clearFilters = () => {
    setSearch(''); setFilterPos(''); setFilterClass('');
    setFilterSport(''); setFilterStatus('');
  };
  const hasFilters = search || filterPos || filterClass || filterSport || filterStatus;

  const posGroups = useMemo(() => {
    const groups = {};
    filtered.forEach(p => {
      const pos = p.primaryPosition || 'UTIL';
      if (!groups[pos]) groups[pos] = 0;
      groups[pos]++;
    });
    return groups;
  }, [filtered]);

  return (
    <div className="discoverPage">

      {/* HERO */}
      <div className="discoverHero">
        <h1>⚾ College Coach Discovery Feed</h1>
        <p>Browse players from public GameTracker teams — stats, recruiting status, highlights, and direct contact.</p>
        <div className="filterBar">
          <input
            type="text"
            placeholder="Search name, team, location…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select value={filterSport} onChange={e => setFilterSport(e.target.value)}>
            <option value="">All Sports</option>
            {SPORTS.filter(Boolean).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={filterPos} onChange={e => setFilterPos(e.target.value)}>
            <option value="">All Positions</option>
            {POSITIONS.filter(Boolean).map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <select value={filterClass} onChange={e => setFilterClass(e.target.value)}>
            <option value="">All Classes</option>
            {CLASS_YEARS.filter(Boolean).map(y => <option key={y} value={y}>Class of {y}</option>)}
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="">All Statuses</option>
            {RC_STATUSES.filter(Boolean).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          {hasFilters && <button className="clearBtn" onClick={clearFilters}>✕ Clear</button>}
        </div>
      </div>

      {/* CONTENT */}
      <div className="discoverContent">

        {loadStatus === 'loading' && <div className="loadingState">Loading players…</div>}
        {loadStatus === 'error' && <div className="loadingState">Could not load players. Check back soon.</div>}

        {loadStatus === 'ok' && (
          <>
            <div className="discoverMeta">
              <span>
                <strong style={{ color: '#fff' }}>{filtered.length}</strong> players
                {Object.keys(posGroups).length > 0 && (
                  <span style={{ marginLeft: '10px', color: '#334155' }}>
                    {Object.entries(posGroups).slice(0, 5).map(([pos, n]) => `${pos}: ${n}`).join(' · ')}
                  </span>
                )}
              </span>
              <div className="sortRow">
                <span style={{ fontSize: '11px', color: '#334155', alignSelf: 'center', marginRight: '4px' }}>SORT</span>
                {SORT_OPTIONS.map(opt => (
                  <button key={opt.key} onClick={() => setSortKey(opt.key)}
                    className={`sortBtn${sortKey === opt.key ? ' sortBtnActive' : ''}`}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="playerGrid">
              {filtered.length === 0 ? (
                <div className="emptyState">
                  No players match your filters.<br />
                  <span style={{ fontSize: '13px', color: '#1e293b', marginTop: '8px', display: 'block' }}>
                    Coaches — add your players to GameTracker and set their season to Public.
                  </span>
                </div>
              ) : (
                filtered.map((p, i) => {
                  const profileUrl = `/player?season=${encodeURIComponent(p.seasonId)}&player=${encodeURIComponent(p.id)}`;
                  const rc = p.recruitingStatus || 'Open';
                  const color = rcColor(rc);
                  return (
                    <div className="playerCard" key={`${p.seasonId}-${p.id}-${i}`}>
                      {p.highlightUrl && <span className="highlightBadge">🎥 Film</span>}

                      <div className="playerCardTop">
                        <div className="playerCardAvatar">
                          #{p.jersey || '—'}
                        </div>
                        <div className="playerCardInfo">
                          <h3>{p.firstName} {p.lastName}</h3>
                          <p>
                            <strong>{p.primaryPosition || 'UTIL'}</strong>
                            {p.classYear ? ` · Class of ${p.classYear}` : ''}
                            {p.height ? ` · ${p.height}` : ''}
                          </p>
                          <p>
                            {p.teamName || 'Unknown Team'}
                            {p.teamLocation ? ` · ${p.teamLocation}` : ''}
                            {p.teamAgeGroup ? ` · ${p.teamAgeGroup}` : ''}
                          </p>
                          <p>Bats {p.bats || '?'} / Throws {p.throws || '?'}{p.gpa ? ` · GPA ${p.gpa}` : ''}</p>
                          <div className="rcBadge" style={{ background: `${color}18`, borderColor: color, color }}>
                            {rc}{p.committedSchool ? ` — ${p.committedSchool}` : ''}
                          </div>
                        </div>
                      </div>

                      <div className="playerCardStats">
                        <div className="statCell"><span>AVG</span><strong>{fmtAvg(p.avg)}</strong></div>
                        <div className="statCell"><span>HR</span><strong>{p.hr || 0}</strong></div>
                        <div className="statCell"><span>RBI</span><strong>{p.rbi || 0}</strong></div>
                        <div className="statCell"><span>ERA</span><strong>{fmtEra(p.era)}</strong></div>
                      </div>

                      {p.coachNotes && (
                        <p style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic', margin: 0, lineHeight: 1.5 }}>
                          💬 {p.coachNotes.slice(0, 100)}{p.coachNotes.length > 100 ? '…' : ''}
                        </p>
                      )}

                      <div className="playerCardCTA">
                        <a href={profileUrl} className="profileBtn">🎓 View Profile</a>
                        {p.playerEmail && (
                          <a href={`mailto:${p.playerEmail}`} className="contactBtn">📧</a>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}
      </div>

      {/* SEO FOOTER */}
      <div className="discoverFooter">
        <strong style={{ color: '#1e293b' }}>GameTracker</strong> — Baseball &amp; Softball recruiting database.
        College coaches: discover players by position, class year, and stats.
        <br />
        Coaches: <a href="/" style={{ color: '#1e3a5f' }}>add your team</a> to get your players discovered.
      </div>
    </div>
  );
}
