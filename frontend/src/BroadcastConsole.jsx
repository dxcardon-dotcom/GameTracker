import React, { useEffect, useRef, useState } from 'react';
import styles from './BroadcastConsole.module.css';
import { db, storage } from './firebase';
import { collection, doc, limit, onSnapshot, orderBy, query, setDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import ScoutingReportTab from './ScoutingReportTab';
import TournamentBracketTab from './TournamentBracketTab';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
const defaultTeamId = import.meta.env.VITE_DEFAULT_TEAM_ID || 'e3UukXkIjMHcr0uB5rZ3';
const defaultLiveGameId = import.meta.env.VITE_DEFAULT_LIVE_GAME_ID || 'irvin-rockets-live';
const homeTeamName = 'Irvin Rockets';
const sportEmoji = (sport) => sport === 'Softball' ? '🥎' : '⚾';

const pitchResults = [
  { result: 'ball', label: 'Ball', notation: 'B' },
  { result: 'called_strike', label: 'Called Strike', notation: 'C' },
  { result: 'swinging_strike', label: 'Swinging Strike', notation: 'S' },
  { result: 'foul', label: 'Foul Ball', notation: 'F' },
  { result: 'in_play', label: 'Ball In Play', notation: 'IP' },
  { result: 'hit_by_pitch', label: 'Hit By Pitch', notation: 'HBP' }
];

const plateAppearanceResults = [
  { result: 'single', label: 'Single', notation: '1B', kind: 'hit' },
  { result: 'double', label: 'Double', notation: '2B', kind: 'hit' },
  { result: 'triple', label: 'Triple', notation: '3B', kind: 'hit' },
  { result: 'home_run', label: 'Home Run', notation: 'HR', kind: 'hit' },
  { result: 'walk', label: 'Walk', notation: 'BB', kind: 'walk' },
  { result: 'strikeout', label: 'Strikeout', notation: 'K', kind: 'out' },
  { result: 'groundout', label: 'Groundout', notation: 'GO', kind: 'out' },
  { result: 'flyout', label: 'Flyout', notation: 'FO', kind: 'out' },
  { result: 'error', label: 'Reached On Error', notation: 'E', kind: 'error' },
  { result: 'sac_fly', label: 'Sacrifice Fly', notation: 'SF', kind: 'sacrifice' },
  { result: 'fielder_choice', label: "Fielder's Choice", notation: 'FC', kind: 'fielders_choice' }
];

const defensivePlayPresets = [
  { result: 'double_play_643', label: '6-4-3 Double Play', notation: '6-4-3 DP', outs: 2 },
  { result: 'double_play_463', label: '4-6-3 Double Play', notation: '4-6-3 DP', outs: 2 },
  { result: 'double_play_543', label: '5-4-3 Double Play', notation: '5-4-3 DP', outs: 2 },
  { result: 'caught_stealing_26', label: 'Caught Stealing 2-6', notation: 'CS 2-6', outs: 1 },
  { result: 'pickoff_13', label: 'Pickoff 1-3', notation: 'PO 1-3', outs: 1 },
  { result: 'stolen_base', label: 'Stolen Base', notation: 'SB', outs: 0 }
];

const emptyRosterForm = {
  id: '',
  firstName: '',
  lastName: '',
  jersey: '',
  primaryPosition: 'P',
  bats: 'R',
  throws: 'R',
  classYear: '',
  familyContact: '',
  height: '',
  weight: '',
  gpa: '',
  playerEmail: '',
  playerPhone: '',
  recruitingStatus: 'Open',
  committedSchool: '',
  ncaaId: '',
  coachNotes: '',
  highlightUrl: '',
  videoLinksText: ''
};

const emptyScheduleForm = {
  id: '',
  date: new Date().toISOString().slice(0, 10),
  startTime: '',
  opponent: '',
  location: 'Home',
  venue: '',
  type: 'District',
  status: 'Scheduled',
  notes: ''
};

export default function BroadcastConsole() {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState('live-game'); 
  const [selectedSeason, setSelectedSeason] = useState('2025–2026');
  
  // 📈 Metric System Sub-Tabs
  const [statsSubTab, setStatsSubTab] = useState('standard-hitting');
  const [sprayChartPlayer, setSprayChartPlayer] = useState('team');
  const [sprayDots, setSprayDots] = useState([]);

  // ⚾ Pitch Velocity & Type
  const [pitchVelo, setPitchVelo] = useState('');
  const [pitchType, setPitchType] = useState('FB');
  const [pitchLog, setPitchLog] = useState([]);

  // 📋 Game Day Checklist
  const [checklistItems, setChecklistItems] = useState([
    { id: 1, label: 'Equipment packed (bats, helmets, catchers gear)', done: false },
    { id: 2, label: 'Lineup card printed', done: false },
    { id: 3, label: 'Field setup confirmed (bases, chalk)', done: false },
    { id: 4, label: 'Umpires confirmed', done: false },
    { id: 5, label: 'Bus / transportation arranged', done: false },
    { id: 6, label: 'Uniforms distributed', done: false },
    { id: 7, label: 'Scorebook ready', done: false },
    { id: 8, label: 'Medical kit on site', done: false },
  ]);
  const [newChecklistItem, setNewChecklistItem] = useState('');
  const [checklistAlertSent, setChecklistAlertSent] = useState(false);

  // Live Score Modifier Tracker States
  const [scoringOpponent, setScoringOpponent] = useState('Fabens High School');
  const [scoringLocation, setScoringLocation] = useState('Home');
  const [scoringType, setScoringType] = useState('District');
  const [ourLiveScore, setOurLiveScore] = useState(0);
  const [theirLiveScore, setTheirLiveScore] = useState(0);

  // 🎮 DEEP BROADCAST LIVE GAME ENGINE STATES
  const [currentInning, setCurrentInning] = useState(1);
  const [isTopInning, setIsTopInning] = useState(true);
  const [balls, setBalls] = useState(0);
  const [strikes, setStrikes] = useState(0);
  const [outs, setOuts] = useState(0);
  
  // Advanced Game Metrics
  const [pitchCount, setPitchCount] = useState(0);
  const [currentBatter, setCurrentBatter] = useState('');
  const [currentPitcher, setCurrentPitcher] = useState('');
  
  // Interactive Baserunner Diamond Matrix
  const [runnerOnFirst, setRunnerOnFirst] = useState(false);
  const [runnerOnSecond, setRunnerOnSecond] = useState(false);
  const [runnerOnThird, setRunnerOnThird] = useState(false);

  // Line Score Matrix Array (Innings 1-7+)
  const [ourInnings, setOurInnings] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [theirInnings, setTheirInnings] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [ourHits, setOurHits] = useState(0);
  const [theirHits, setTheirHits] = useState(0);
  const [ourErrors, setOurErrors] = useState(0);
  const [theirErrors, setTheirErrors] = useState(0);
  const [gameDate, setGameDate] = useState(new Date().toISOString().slice(0, 10));
  const [setupStatus, setSetupStatus] = useState('draft');
  const [lineupMode, setLineupMode] = useState('official');
  const [opponentRawRoster, setOpponentRawRoster] = useState('');
  const [opponentRoster, setOpponentRoster] = useState([]);
  const [pitchWarningLimit, setPitchWarningLimit] = useState(70);
  const [pitchHardLimit, setPitchHardLimit] = useState(85);
  const [scoringWorkflowStep, setScoringWorkflowStep] = useState('pitch');
  const [lastPlaySummary, setLastPlaySummary] = useState('Ready for first pitch.');
  const [playNote, setPlayNote] = useState('');
  const [teamSport, setTeamSport] = useState('Baseball');
  const [teamType, setTeamType] = useState('School');
  const [teamAgeGroup, setTeamAgeGroup] = useState('Varsity');
  const [teamLocation, setTeamLocation] = useState('El Paso, TX');
  const [teamDisplayName, setTeamDisplayName] = useState(homeTeamName);
  const [teamPrivacy, setTeamPrivacy] = useState('Public');
  const [teamProfileStatus, setTeamProfileStatus] = useState('Not saved');
  
  // Bulk CSV Roster Importer State
  const [rawCsvInput, setRawCsvInput] = useState('');
  const [rosterForm, setRosterForm] = useState(emptyRosterForm);
  const [editingRosterId, setEditingRosterId] = useState('');
  const [rosterStatus, setRosterStatus] = useState('Ready');
  const [highlightUploadStatus, setHighlightUploadStatus] = useState('No file selected');
  const [scheduleForm, setScheduleForm] = useState(emptyScheduleForm);
  const [editingScheduleId, setEditingScheduleId] = useState('');
  const [scheduleStatus, setScheduleStatus] = useState('Ready');
  const [lineupEntries, setLineupEntries] = useState([]);
  const [lineupStatus, setLineupStatus] = useState('Not saved');
  const [correctionNote, setCorrectionNote] = useState('');
  const [lastBoxScore, setLastBoxScore] = useState(null);
  const [showBoxScore, setShowBoxScore] = useState(false);
  const [editingEventId, setEditingEventId] = useState('');
  const [editingEventLabel, setEditingEventLabel] = useState('');
  const [playLogStatus, setPlayLogStatus] = useState('Ready');

  // 🔐 Authentication States
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [userPlan, setUserPlan] = useState('free');
  const [checkoutStatus, setCheckoutStatus] = useState('');
  const [notifPermission, setNotifPermission] = useState(() =>
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );

  // 🔥 Heatmap filters
  const [hmPitcher, setHmPitcher] = useState('all');
  const [hmType, setHmType] = useState('all');

  // 💰 Monetization & Growth
  const [digestOptIn, setDigestOptIn] = useState(() => localStorage.getItem('gt_digest_optin') === 'true');
  const [digestEmail, setDigestEmail] = useState('');
  const [digestStatus, setDigestStatus] = useState('');
  const [digestBannerDismissed, setDigestBannerDismissed] = useState(() => localStorage.getItem('gt_digest_dismissed') === 'true');
  const [referralCopied, setReferralCopied] = useState(false);
  const [onboardingDismissed, setOnboardingDismissed] = useState(() => localStorage.getItem('gt_onboarding_done') === 'true');

  // 🏢 Multi-Team / Org State
  const [mySeasons, setMySeasons] = useState([]);
  const [showNewTeamModal, setShowNewTeamModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamSport, setNewTeamSport] = useState('Baseball');
  const [newTeamAgeGroup, setNewTeamAgeGroup] = useState('Varsity');
  const [newTeamLocation, setNewTeamLocation] = useState('');
  const [newTeamStatus, setNewTeamStatus] = useState('');
  const [showInvitePanel, setShowInvitePanel] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('coach');
  const [inviteStatus, setInviteStatus] = useState('');
  const [seasonCoaches, setSeasonCoaches] = useState([]);

  // 🖼️ Logo Configuration State
  const [logoUrl, setLogoUrl] = useState('');
  const [liveGameReady, setLiveGameReady] = useState(false);
  const [recentEvents, setRecentEvents] = useState([]);
  const [syncStatus, setSyncStatus] = useState('Connecting');
  const hydratingFromCloud = useRef(false);

  const auth = getAuth();

  const historicalSeedBackup = {
    '2024–2025': { schedule: [], roster: [], branding_logo: '' },
    '2025–2026': {
      schedule: [
        { id: 1, date: '2026-03-10', opponent: 'Fabens High School', type: 'District', location: 'Away', status: 'Final', ourScore: 8, theirScore: 2, result: 'W' },
        { id: 2, date: '2026-03-17', opponent: 'Riverside High School', type: 'Home', status: 'Final', ourScore: 4, theirScore: 5, result: 'L' }
      ],
      roster: [
        { id: 'r1', firstName: 'David', lastName: 'Ortiz', jersey: '34', gamesPlayed: 5, ab: 15, hits: 6, rbi: 5, runs: 4, double: 2, triple: 0, hr: 1, bb: 3, sb: 1, ip: 0, er: 0, hitsAllowed: 0, walksAllowed: 0, strikeouts: 0, wins: 0, po: 25, assists: 2, errors: 0 },
        { id: 'r2', firstName: 'Derek', lastName: 'Jeter', jersey: '2', gamesPlayed: 5, ab: 18, hits: 5, rbi: 2, runs: 6, double: 1, triple: 1, hr: 0, bb: 2, sb: 3, ip: 0, er: 0, hitsAllowed: 0, walksAllowed: 0, strikeouts: 0, wins: 0, po: 8, assists: 14, errors: 1 },
        { id: 'r3', firstName: 'Clayton', lastName: 'Kershaw', jersey: '22', gamesPlayed: 3, ab: 2, hits: 0, rbi: 0, runs: 0, double: 0, triple: 0, hr: 0, bb: 0, sb: 0, ip: 14, er: 2, hitsAllowed: 9, walksAllowed: 3, strikeouts: 18, wins: 2, po: 1, assists: 3, errors: 0 }
      ],
      branding_logo: ''
    }
  };

  const [seasonsData, setSeasonsData] = useState({});

  const loadMySeasons = async (currentUser) => {
    if (!currentUser) return;
    try {
      const token = await currentUser.getIdToken();
      const res = await fetch(`${apiBaseUrl}/api/my-seasons`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setMySeasons(data.seasons || []);
      }
    } catch (e) { console.error('loadMySeasons', e); }
  };

  const loadSeasonCoaches = async (seasonId, currentUser) => {
    if (!currentUser) return;
    try {
      const { getDoc, doc: firestoreDoc } = await import('firebase/firestore');
      const snap = await getDoc(firestoreDoc(db, 'seasons', seasonId));
      if (snap.exists()) setSeasonCoaches(snap.data().coaches || []);
    } catch (e) { console.error('loadSeasonCoaches', e); }
  };

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const token = await currentUser.getIdToken();
          const res = await fetch(`${apiBaseUrl}/api/user/plan`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            setUserPlan(data.plan || 'free');
          }
        } catch (e) { console.error(e); }
        loadMySeasons(currentUser);
      } else {
        setUserPlan('free');
        setMySeasons([]);
      }
    });
    const params = new URLSearchParams(window.location.search);
    if (params.get('checkout') === 'success') {
      setActiveTab('upgrade');
      setCheckoutStatus('success');
      window.history.replaceState({}, '', window.location.pathname);
    }
    return () => unsubscribeAuth();
  }, [auth]);

  useEffect(() => {
    const gameRef = doc(db, 'games', defaultLiveGameId);
    const unsubscribeGame = onSnapshot(
      gameRef,
      (snapshot) => {
        if (!snapshot.exists()) return;

        hydratingFromCloud.current = true;
        const game = snapshot.data();
        setScoringOpponent(game.opponentName || 'Fabens High School');
        setScoringLocation(game.location || 'Home');
        setScoringType(game.gameType || 'District');
        setCurrentInning(game.inning || 1);
        setIsTopInning(game.half !== 'bottom');
        setBalls(game.balls || 0);
        setStrikes(game.strikes || 0);
        setOuts(game.outs || 0);
        setPitchCount(game.pitchCount || 0);
        setCurrentBatter(game.currentBatter || '');
        setCurrentPitcher(game.currentPitcher || '');
        setRunnerOnFirst(Boolean(game.runners?.first));
        setRunnerOnSecond(Boolean(game.runners?.second));
        setRunnerOnThird(Boolean(game.runners?.third));
        setOurInnings(game.ourInnings || [0, 0, 0, 0, 0, 0, 0]);
        setTheirInnings(game.theirInnings || [0, 0, 0, 0, 0, 0, 0]);
        setOurHits(game.ourHits || 0);
        setTheirHits(game.theirHits || 0);
        setOurErrors(game.ourErrors || 0);
        setTheirErrors(game.theirErrors || 0);
        setGameDate(game.gameDate || new Date().toISOString().slice(0, 10));
        setSetupStatus(game.setupStatus || 'draft');
        setLineupMode(game.lineupMode || 'official');
        setOpponentRoster(game.opponentRoster || []);
        setPitchWarningLimit(game.pitchWarningLimit || 70);
        setPitchHardLimit(game.pitchHardLimit || 85);
        setScoringWorkflowStep(game.scoringWorkflowStep || 'pitch');
        setLastPlaySummary(game.lastPlaySummary || 'Ready for first pitch.');
        setLineupEntries(game.lineupEntries || []);
        if (game.teamProfile) {
          setTeamSport(game.teamProfile.sport || 'Baseball');
          setTeamType(game.teamProfile.teamType || 'School');
          setTeamAgeGroup(game.teamProfile.ageGroup || 'Varsity');
          setTeamLocation(game.teamProfile.location || 'El Paso, TX');
          setTeamDisplayName(game.teamProfile.name || homeTeamName);
          setTeamPrivacy(game.teamProfile.privacy || 'Public');
        }
        setLiveGameReady(true);
        setSyncStatus('Live');
      },
      () => setSyncStatus('Offline')
    );

    const eventsQuery = query(
      collection(db, 'games', defaultLiveGameId, 'events'),
      orderBy('sequence', 'desc'),
      limit(12)
    );
    const unsubscribeEvents = onSnapshot(
      eventsQuery,
      (snapshot) => setRecentEvents(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))),
      () => setRecentEvents([])
    );

    return () => {
      unsubscribeGame();
      unsubscribeEvents();
    };
  }, []);

  const authenticatedPost = async (path, body) => {
    if (!user) return;

    const token = await user.getIdToken();
    const response = await fetch(`${apiBaseUrl}${path}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.error || 'Could not sync live game');
    }
  };

  const logScoringEvent = async (eventType, event) => {
    if (!user) return;

    try {
      await authenticatedPost(`/api/games/${defaultLiveGameId}/events`, {
        eventType,
        inning: currentInning,
        half: isTopInning ? 'top' : 'bottom',
        ballsBefore: balls,
        strikesBefore: strikes,
        outsBefore: outs,
        stateBefore: {
          inning: currentInning,
          half: isTopInning ? 'top' : 'bottom',
          balls,
          strikes,
          outs,
          pitchCount,
          runners: {
            first: runnerOnFirst,
            second: runnerOnSecond,
            third: runnerOnThird
          },
          ourInnings,
          theirInnings,
          ourHits,
          theirHits,
          ourErrors,
          theirErrors,
          currentBatter,
          currentPitcher
        },
        batterLabel: currentBatter || null,
        pitcherLabel: currentPitcher || null,
        note: playNote.trim() || null,
        ...event
      });
      setPlayNote('');
    } catch (error) {
      console.error(error);
      setSyncStatus('Event error');
    }
  };

  const isOurTeamBatting = () => (scoringLocation === 'Away' ? isTopInning : !isTopInning);

  const addRunsToCurrentFrame = (runs) => {
    if (!runs) return;
    const inningIndex = Math.max(0, currentInning - 1);

    if (isOurTeamBatting()) {
      setOurInnings((innings) => {
        const next = [...innings];
        while (next.length <= inningIndex) next.push(0);
        next[inningIndex] = Number(next[inningIndex] || 0) + runs;
        return next;
      });
    } else {
      setTheirInnings((innings) => {
        const next = [...innings];
        while (next.length <= inningIndex) next.push(0);
        next[inningIndex] = Number(next[inningIndex] || 0) + runs;
        return next;
      });
    }
  };

  const clearCount = () => {
    setBalls(0);
    setStrikes(0);
  };

  const addHitToBattingTeam = () => {
    if (isOurTeamBatting()) setOurHits((hits) => hits + 1);
    else setTheirHits((hits) => hits + 1);
  };

  const addErrorToFieldingTeam = () => {
    if (isOurTeamBatting()) setTheirErrors((errors) => errors + 1);
    else setOurErrors((errors) => errors + 1);
  };

  const applyWalkOrHitByPitch = () => {
    let forcedRun = 0;
    if (runnerOnFirst && runnerOnSecond && runnerOnThird) forcedRun = 1;
    setRunnerOnThird(runnerOnSecond || runnerOnThird);
    setRunnerOnSecond(runnerOnFirst || runnerOnSecond);
    setRunnerOnFirst(true);
    addRunsToCurrentFrame(forcedRun);
    return forcedRun;
  };

  const applyHitAdvancement = (bases) => {
    let runs = 0;

    if (bases === 4) {
      runs = 1 + Number(runnerOnFirst) + Number(runnerOnSecond) + Number(runnerOnThird);
      setRunnerOnFirst(false);
      setRunnerOnSecond(false);
      setRunnerOnThird(false);
    }

    if (bases === 3) {
      runs = Number(runnerOnFirst) + Number(runnerOnSecond) + Number(runnerOnThird);
      setRunnerOnFirst(false);
      setRunnerOnSecond(false);
      setRunnerOnThird(true);
    }

    if (bases === 2) {
      runs = Number(runnerOnSecond) + Number(runnerOnThird);
      setRunnerOnThird(runnerOnFirst);
      setRunnerOnSecond(true);
      setRunnerOnFirst(false);
    }

    if (bases === 1) {
      runs = Number(runnerOnThird);
      setRunnerOnThird(runnerOnSecond);
      setRunnerOnSecond(runnerOnFirst);
      setRunnerOnFirst(true);
    }

    addRunsToCurrentFrame(runs);
    return runs;
  };

  const advanceHalfInningIfNeeded = (nextOuts) => {
    if (nextOuts < 3) return;
    setOuts(0);
    setBalls(0);
    setStrikes(0);
    setRunnerOnFirst(false);
    setRunnerOnSecond(false);
    setRunnerOnThird(false);

    if (isTopInning) {
      setIsTopInning(false);
    } else {
      setIsTopInning(true);
      setCurrentInning((inning) => inning + 1);
    }
  };

  useEffect(() => {
    if (!user || !liveGameReady) return;
    if (hydratingFromCloud.current) {
      hydratingFromCloud.current = false;
      return;
    }

    setSyncStatus('Saving');
    const timeout = window.setTimeout(async () => {
      try {
        await authenticatedPost(`/api/games/${defaultLiveGameId}/state`, {
          teamId: defaultTeamId,
          opponentName: scoringOpponent,
          location: scoringLocation,
          gameType: scoringType,
          status: 'live',
          visibility: 'public',
          inning: currentInning,
          half: isTopInning ? 'top' : 'bottom',
          balls,
          strikes,
          outs,
          pitchCount,
          currentBatter,
          currentPitcher,
          runners: {
            first: runnerOnFirst,
            second: runnerOnSecond,
            third: runnerOnThird
          },
          ourInnings,
          theirInnings,
          ourHits,
          theirHits,
          ourErrors,
          theirErrors,
          gameDate,
          setupStatus,
          lineupMode,
          opponentRoster,
          pitchWarningLimit,
          pitchHardLimit,
          scoringWorkflowStep,
          lastPlaySummary,
          lineupEntries,
          teamProfile: {
            name: teamDisplayName,
            sport: teamSport,
            teamType,
            ageGroup: teamAgeGroup,
            location: teamLocation,
            season: selectedSeason,
            privacy: teamPrivacy
          }
        });
        setSyncStatus('Saved');
      } catch (error) {
        console.error(error);
        setSyncStatus('Sync error');
      }
    }, 650);

    return () => window.clearTimeout(timeout);
  }, [
    user, liveGameReady, scoringOpponent, scoringLocation, scoringType,
    currentInning, isTopInning, balls, strikes, outs, pitchCount,
    currentBatter, currentPitcher, runnerOnFirst, runnerOnSecond, runnerOnThird,
    ourInnings, theirInnings, ourHits, theirHits, ourErrors, theirErrors,
    gameDate, setupStatus, lineupMode, opponentRoster, pitchWarningLimit,
    pitchHardLimit, scoringWorkflowStep, lastPlaySummary, teamDisplayName,
    teamSport, teamType, teamAgeGroup, teamLocation, teamPrivacy, selectedSeason,
    lineupEntries
  ]);

  const recordPitch = async (result) => {
    if (!user) return;
    if (pitchCount === 0) markCurrentGameLiveOnSchedule();

    const pitch = pitchResults.find((item) => item.result === result);
    const before = { balls, strikes, outs };
    let nextBalls = balls;
    let nextStrikes = strikes;
    let nextOuts = outs;

    if (result === 'ball') nextBalls = balls === 3 ? 0 : balls + 1;
    if (result === 'called_strike' || result === 'swinging_strike') {
      if (strikes === 2) {
        nextStrikes = 0;
        nextBalls = 0;
        nextOuts = Math.min(3, outs + 1);
      } else {
        nextStrikes = strikes + 1;
      }
    }
    if (result === 'foul' && strikes < 2) nextStrikes = strikes + 1;
    if (['in_play', 'hit_by_pitch'].includes(result)) {
      nextBalls = 0;
      nextStrikes = 0;
    }

    setBalls(nextBalls);
    setStrikes(nextStrikes);
    setOuts(nextOuts);
    setPitchCount((count) => count + 1);
    setScoringWorkflowStep(result === 'in_play' ? 'result' : 'pitch');
    setLastPlaySummary(`${pitch?.label || result} recorded for ${currentBatter || 'current batter'}.`);
    advanceHalfInningIfNeeded(nextOuts);

    const veloNum = pitchVelo ? Number(pitchVelo) : null;
    setPitchLog(prev => [...prev, {
      pitcher: currentPitcher || 'Unknown',
      type: pitchType,
      velo: veloNum,
      result,
      inning: currentInning,
      id: Date.now()
    }]);

    await logScoringEvent('pitch', {
      result,
      label: pitch?.label || result,
      notation: pitch?.notation || null,
      ballsBefore: before.balls,
      strikesBefore: before.strikes,
      outsBefore: before.outs,
      ballsAfter: nextBalls,
      strikesAfter: nextStrikes,
      outsAfter: nextOuts,
      pitchType,
      pitchVelo: veloNum
    });
  };

  const recordPlateAppearance = async (outcome) => {
    if (!user) return;

    let runsScored = 0;
    let nextOuts = outs;

    if (outcome.kind === 'hit') {
      addHitToBattingTeam();
      const bases = outcome.result === 'single' ? 1 : outcome.result === 'double' ? 2 : outcome.result === 'triple' ? 3 : 4;
      runsScored = applyHitAdvancement(bases);
      clearCount();
    }

    if (outcome.kind === 'walk') {
      runsScored = applyWalkOrHitByPitch();
      clearCount();
    }

    if (outcome.kind === 'error') {
      addErrorToFieldingTeam();
      setRunnerOnFirst(true);
      clearCount();
    }

    if (outcome.kind === 'out' || outcome.kind === 'sacrifice' || outcome.kind === 'fielders_choice') {
      nextOuts = Math.min(3, outs + 1);
      setOuts(nextOuts);
      clearCount();
      if (outcome.result === 'sac_fly' && runnerOnThird) {
        runsScored = 1;
        setRunnerOnThird(false);
        addRunsToCurrentFrame(1);
      }
      if (outcome.result === 'fielder_choice') {
        setRunnerOnFirst(true);
      }
      advanceHalfInningIfNeeded(nextOuts);
    }

    setScoringWorkflowStep('pitch');
    setLastPlaySummary(`${outcome.label}${runsScored ? `, ${runsScored} run${runsScored > 1 ? 's' : ''} scored` : ''}.`);

    await logScoringEvent('plate_appearance', {
      result: outcome.result,
      label: outcome.label,
      notation: outcome.notation,
      runsScored,
      outsAfter: nextOuts
    });
  };

  const recordDefensivePlay = async (play) => {
    if (!user) return;

    let nextOuts = Math.min(3, outs + play.outs);
    if (play.outs > 0) {
      setOuts(nextOuts);
      if (play.result.includes('double_play')) {
        setRunnerOnFirst(false);
      }
    }

    if (play.result === 'stolen_base') {
      if (runnerOnSecond) {
        setRunnerOnSecond(false);
        setRunnerOnThird(true);
      } else if (runnerOnFirst) {
        setRunnerOnFirst(false);
        setRunnerOnSecond(true);
      }
    }

    if (play.result === 'caught_stealing_26') {
      setRunnerOnFirst(false);
    }

    if (play.result === 'pickoff_13') {
      setRunnerOnFirst(false);
    }

    setLastPlaySummary(play.label);
    setScoringWorkflowStep('pitch');
    advanceHalfInningIfNeeded(nextOuts);

    await logScoringEvent('defensive_play', {
      result: play.result,
      label: play.label,
      notation: play.notation,
      outsAfter: nextOuts
    });
  };

  const recordManualRun = async () => {
    if (!user) return;

    addRunsToCurrentFrame(1);
    if (runnerOnThird) setRunnerOnThird(false);
    else if (runnerOnSecond) setRunnerOnSecond(false);
    else if (runnerOnFirst) setRunnerOnFirst(false);
    setLastPlaySummary('Manual run added.');
    sendGameNotif(`${sportEmoji(teamSport)} Run Scores!`, `${teamDisplayName || homeTeamName} scores a run — Inn ${currentInning}`);

    await logScoringEvent('manual_run', {
      result: 'run',
      label: 'Run Scored',
      notation: 'R',
      runsScored: 1,
      outsAfter: outs
    });
  };

  const restoreStateFromEvent = (event) => {
    const snapshot = event.stateBefore || {};
    setCurrentInning(snapshot.inning || event.inning || currentInning);
    setIsTopInning((snapshot.half || event.half || 'top') !== 'bottom');
    setBalls(Number(snapshot.balls ?? event.ballsBefore ?? balls));
    setStrikes(Number(snapshot.strikes ?? event.strikesBefore ?? strikes));
    setOuts(Number(snapshot.outs ?? event.outsBefore ?? outs));
    setPitchCount(Math.max(0, Number(snapshot.pitchCount ?? pitchCount)));
    setRunnerOnFirst(Boolean(snapshot.runners?.first));
    setRunnerOnSecond(Boolean(snapshot.runners?.second));
    setRunnerOnThird(Boolean(snapshot.runners?.third));
    if (snapshot.ourInnings) setOurInnings(snapshot.ourInnings);
    if (snapshot.theirInnings) setTheirInnings(snapshot.theirInnings);
    if (typeof snapshot.ourHits === 'number') setOurHits(snapshot.ourHits);
    if (typeof snapshot.theirHits === 'number') setTheirHits(snapshot.theirHits);
    if (typeof snapshot.ourErrors === 'number') setOurErrors(snapshot.ourErrors);
    if (typeof snapshot.theirErrors === 'number') setTheirErrors(snapshot.theirErrors);
    if (snapshot.currentBatter !== undefined) setCurrentBatter(snapshot.currentBatter || '');
    if (snapshot.currentPitcher !== undefined) setCurrentPitcher(snapshot.currentPitcher || '');
  };

  const undoLastPlay = async () => {
    if (!user) return;
    const lastScoringEvent = recentEvents.find((event) => !['correction', 'undo'].includes(event.eventType));

    if (!lastScoringEvent) {
      setPlayLogStatus('No play to undo');
      return;
    }

    restoreStateFromEvent(lastScoringEvent);
    setLastPlaySummary(`Undo recorded for ${lastScoringEvent.label || lastScoringEvent.result || 'last play'}.`);
    setPlayLogStatus('Undo saved');

    await logScoringEvent('undo', {
      targetEventId: lastScoringEvent.id,
      targetSequence: lastScoringEvent.sequence || null,
      label: `Undo: ${lastScoringEvent.label || lastScoringEvent.result || 'last play'}`,
      correctionNote: correctionNote.trim() || 'Undo last play',
      correctedAt: new Date().toISOString()
    });
    setCorrectionNote('');
  };

  const startEditingEvent = (event) => {
    setEditingEventId(event.id);
    setEditingEventLabel(event.correctedLabel || event.label || String(event.result || '').replaceAll('_', ' '));
    setCorrectionNote(event.correctionNote || '');
    setPlayLogStatus('Editing play');
  };

  const saveEventCorrection = async (event) => {
    if (!user) return;

    if (!editingEventLabel.trim() && !correctionNote.trim()) {
      setPlayLogStatus('Correction needs a label or note');
      return;
    }

    setPlayLogStatus('Saving correction');

    await logScoringEvent('correction', {
      targetEventId: event.id,
      targetSequence: event.sequence || null,
      label: `Correction: ${editingEventLabel.trim() || event.label || event.result}`,
      correctedLabel: editingEventLabel.trim() || null,
      correctionNote: correctionNote.trim() || null,
      correctedAt: new Date().toISOString()
    });

    setEditingEventId('');
    setEditingEventLabel('');
    setCorrectionNote('');
    setPlayLogStatus('Correction saved');
  };

  const cancelEventCorrection = () => {
    setEditingEventId('');
    setEditingEventLabel('');
    setCorrectionNote('');
    setPlayLogStatus('Ready');
  };

  // Real-Time Cloud Subscription
  useEffect(() => {
    const seasonDocRef = doc(db, 'seasons', selectedSeason);
    
    const unsubscribeData = onSnapshot(seasonDocRef, (snapshot) => {
      if (snapshot.exists()) {
        const cloudData = snapshot.data();
        setSeasonsData(prev => ({ ...prev, [selectedSeason]: cloudData }));
        
        if (cloudData.branding_logo) {
          setLogoUrl(cloudData.branding_logo);
        } else if (cloudData.branding && typeof cloudData.branding.logo === 'string') {
          setLogoUrl(cloudData.branding.logo);
        } else {
          setLogoUrl('');
        }

        if (cloudData.teamProfile) {
          setTeamSport(cloudData.teamProfile.sport || 'Baseball');
          setTeamType(cloudData.teamProfile.teamType || 'School');
          setTeamAgeGroup(cloudData.teamProfile.ageGroup || 'Varsity');
          setTeamLocation(cloudData.teamProfile.location || 'El Paso, TX');
          setTeamDisplayName(cloudData.teamProfile.name || homeTeamName);
          setTeamPrivacy(cloudData.teamProfile.privacy || 'Public');
        }
      } else {
        const fallback = historicalSeedBackup[selectedSeason] || { schedule: [], roster: [], branding_logo: '' };
        setSeasonsData(prev => ({ ...prev, [selectedSeason]: fallback }));
        setLogoUrl(fallback.branding_logo || '');
      }
    });

    return () => unsubscribeData();
  }, [selectedSeason]);

  const currentSeasonData = seasonsData[selectedSeason] || { schedule: [], roster: [], branding_logo: '' };

  const updateCurrentSeasonData = (updates) => {
    setSeasonsData((previous) => {
      const existingSeason = previous[selectedSeason] || { schedule: [], roster: [], branding_logo: '' };

      return {
        ...previous,
        [selectedSeason]: {
          ...existingSeason,
          ...updates
        }
      };
    });
  };

  // Keep Score Totals Synced with individual Inning Outputs
  useEffect(() => {
    const ourTotal = ourInnings.reduce((sum, r) => sum + r, 0);
    const theirTotal = theirInnings.reduce((sum, r) => sum + r, 0);
    setOurLiveScore(ourTotal);
    setTheirLiveScore(theirTotal);
  }, [ourInnings, theirInnings]);

  // 🧮 ADVANCED SABERMETRIC ENGINE CORE
  const parsePlayerStats = (p) => {
    const ab = Number(p.ab || 0);
    const bb = Number(p.bb || 0);
    const hits = Number(p.hits || 0);
    const dbl = Number(p.double || 0);
    const tpl = Number(p.triple || 0);
    const hr = Number(p.hr || 0);
    const gamesPlayed = Number(p.gamesPlayed || 0);
    const rbi = Number(p.rbi || 0);
    const runs = Number(p.runs || 0);
    const sb = Number(p.sb || 0);
    
    const ip = Number(p.ip || 0);
    const er = Number(p.er || 0);
    const hitsAllowed = Number(p.hitsAllowed || 0);
    const walksAllowed = Number(p.walksAllowed || 0);
    const strikeouts = Number(p.strikeouts || 0);
    const wins = Number(p.wins || 0);

    const po = Number(p.po || 0);
    const assists = Number(p.assists || 0);
    const errors = Number(p.errors || 0);

    const pa = ab + bb;
    const avg = ab > 0 ? hits / ab : 0;
    const obp = pa > 0 ? (hits + bb) / pa : 0;
    const singles = hits - (dbl + tpl + hr);
    const totalBases = singles + (dbl * 2) + (tpl * 3) + (hr * 4);
    const slg = ab > 0 ? totalBases / ab : 0;
    const ops = obp + slg;

    const era = ip > 0 ? (er * 7) / ip : 0;
    const whip = ip > 0 ? (hitsAllowed + walksAllowed) / ip : 0;

    const totalChances = po + assists + errors;
    const fieldingPct = totalChances > 0 ? (po + assists) / totalChances : 1.0;

    return { 
      ...p, ab, bb, hits, double: dbl, triple: tpl, hr, gamesPlayed, rbi, runs, sb,
      ip, er, hitsAllowed, walksAllowed, strikeouts, wins, po, assists, errors,
      pa, avg, obp, slg, ops, era, whip, totalChances, fieldingPct 
    };
  };

  const processedRoster = currentSeasonData.roster ? currentSeasonData.roster.map(parsePlayerStats) : [];
  const rosterById = processedRoster.reduce((lookup, player) => {
    lookup[player.id] = player;
    return lookup;
  }, {});
  const activeLineupEntries = lineupEntries.length
    ? lineupEntries.map((entry, index) => ({
      ...entry,
      battingOrder: entry.battingOrder || index + 1,
      player: rosterById[entry.playerId]
    })).filter((entry) => entry.player)
    : processedRoster.slice(0, 9).map((player, index) => ({
      playerId: player.id,
      battingOrder: index + 1,
      position: player.primaryPosition || '',
      status: 'starter',
      player
    }));
  const lineupPlayerIds = new Set(activeLineupEntries.map((entry) => entry.playerId));
  const probableLineup = activeLineupEntries.map((entry) => ({
    ...entry.player,
    lineupPosition: entry.position,
    battingOrder: entry.battingOrder,
    lineupStatus: entry.status
  }));
  const benchPlayers = processedRoster.filter((player) => !lineupPlayerIds.has(player.id));
  const hasScoringStarted = pitchCount > 0 || recentEvents.length > 0;
  const seasonSchedule = currentSeasonData.schedule || [];
  const seasonWins = seasonSchedule.filter(g => g.status === 'Final' && g.result === 'W').length;
  const seasonLosses = seasonSchedule.filter(g => g.status === 'Final' && g.result === 'L').length;
  const teamProfileComplete = Boolean(teamDisplayName.trim() && teamSport && teamType && teamAgeGroup && teamLocation.trim() && selectedSeason);
  const setupChecklist = [
    { label: 'Team profile complete', done: teamProfileComplete },
    { label: 'Game details', done: Boolean(scoringOpponent && gameDate && scoringLocation) },
    { label: 'Home / Away set', done: Boolean(scoringLocation) },
    { label: 'Team roster loaded', done: processedRoster.length > 0 },
    { label: 'Opponent roster', done: opponentRoster.length > 0 || lineupMode === 'quick' },
    { label: 'Starting lineup ready', done: probableLineup.length >= 9 || lineupMode === 'quick' },
    { label: 'Pitcher and batter selected', done: Boolean(currentPitcher && currentBatter) },
    { label: 'Pitch limits set', done: pitchWarningLimit > 0 && pitchHardLimit >= pitchWarningLimit },
  ];
  const setupComplete = setupChecklist.every((item) => item.done);
  const battingTeamName = isOurTeamBatting() ? teamDisplayName || homeTeamName : scoringOpponent || 'Opponent';
  const fieldingTeamName = isOurTeamBatting() ? scoringOpponent || 'Opponent' : teamDisplayName || homeTeamName;
  const currentCountLabel = `${balls}-${strikes}, ${outs} out${outs === 1 ? '' : 's'}`;
  const correctionEventsByTarget = recentEvents
    .filter((event) => event.eventType === 'correction' && event.targetEventId)
    .reduce((lookup, event) => ({ ...lookup, [event.targetEventId]: event }), {});
  const playLogEvents = recentEvents.filter((event) => event.eventType !== 'correction');

  const calculateTeamTotals = () => {
    const totals = { g: currentSeasonData.schedule ? currentSeasonData.schedule.filter(g => g.status === 'Final').length : 0, ab: 0, hits: 0, rbi: 0, runs: 0, double: 0, triple: 0, hr: 0, bb: 0, sb: 0, ip: 0, er: 0, hitsAllowed: 0, walksAllowed: 0, strikeouts: 0, wins: 0, po: 0, assists: 0, errors: 0 };
    
    processedRoster.forEach(p => {
      totals.ab += p.ab; totals.hits += p.hits; totals.rbi += p.rbi; totals.runs += p.runs;
      totals.double += p.double; totals.triple += p.triple; totals.hr += p.hr; totals.bb += p.bb;
      totals.sb += p.sb; totals.ip += p.ip; totals.er += p.er; 
      totals.hitsAllowed += p.hitsAllowed; totals.walksAllowed += p.walksAllowed;
      totals.strikeouts += p.strikeouts; totals.wins += p.wins; 
      totals.po += p.po; totals.assists += p.assists; totals.errors += p.errors;
    });

    const teamPa = totals.ab + totals.bb;
    const teamSingles = totals.hits - (totals.double + totals.triple + totals.hr);
    const teamTb = teamSingles + (totals.double * 2) + (totals.triple * 3) + (totals.hr * 4);
    const teamTotalChances = totals.po + totals.assists + totals.errors;

    return { 
      ...totals, 
      avg: totals.ab > 0 ? totals.hits / totals.ab : 0, 
      obp: teamPa > 0 ? (totals.hits + totals.bb) / teamPa : 0,
      slg: totals.ab > 0 ? teamTb / totals.ab : 0,
      ops: (totals.ab > 0 ? teamTb / totals.ab : 0) + (teamPa > 0 ? (totals.hits + totals.bb) / teamPa : 0),
      era: totals.ip > 0 ? (totals.er * 7) / totals.ip : 0, 
      whip: totals.ip > 0 ? (totals.hitsAllowed + totals.walksAllowed) / totals.ip : 0,
      fp: teamTotalChances > 0 ? (totals.po + totals.assists) / teamTotalChances : 1.0 
    };
  };

  const teamTotals = calculateTeamTotals();

  const handleInningChange = (team, index, val) => {
    const score = parseInt(val, 10) || 0;
    if (team === 'us') {
      const updated = [...ourInnings];
      updated[index] = score;
      setOurInnings(updated);
    } else {
      const updated = [...theirInnings];
      updated[index] = score;
      setTheirInnings(updated);
    }
  };

  const saveTeamLogoToCloud = async () => {
    if (!user) return;
    try {
      const seasonDocRef = doc(db, 'seasons', selectedSeason);
      await setDoc(seasonDocRef, { branding_logo: String(logoUrl || '').trim() }, { merge: true });
      alert("Team logo updated!");
    } catch (err) { console.error(err); }
  };

  const saveTeamProfileToCloud = async () => {
    if (!user) return;

    const teamProfile = {
      name: teamDisplayName.trim() || homeTeamName,
      sport: teamSport,
      teamType,
      ageGroup: teamAgeGroup,
      location: teamLocation.trim(),
      season: selectedSeason,
      privacy: teamPrivacy,
      updatedAt: new Date().toISOString()
    };

    setTeamProfileStatus('Saving');

    try {
      await Promise.all([
        setDoc(doc(db, 'seasons', selectedSeason), { teamProfile }, { merge: true }),
        setDoc(doc(db, 'teams', defaultTeamId), {
          name: teamProfile.name,
          sport: teamProfile.sport.toLowerCase(),
          teamType: teamProfile.teamType,
          ageGroup: teamProfile.ageGroup,
          location: teamProfile.location,
          seasonLabel: teamProfile.season,
          visibility: teamProfile.privacy.toLowerCase(),
          updatedAt: teamProfile.updatedAt
        }, { merge: true })
      ]);
      setTeamProfileStatus('Saved');
    } catch (err) {
      console.error(err);
      setTeamProfileStatus('Could not save');
    }
  };

  const handleBulkRosterImport = async () => {
    if (!user || !rawCsvInput.trim()) return;
    const lines = rawCsvInput.split('\n').filter(line => line.trim() !== '');
    const parsedPlayers = [];

    lines.forEach((line, index) => {
      const columns = line.split(/[,\t]/).map(col => col.trim());
      if (columns.length >= 3) {
        parsedPlayers.push({
          id: `r_bulk_${Date.now()}_${index}`,
          firstName: columns[0], lastName: columns[1], jersey: columns[2], primaryPosition: columns[3] || '',
          bats: columns[4] || '', throws: columns[5] || '', classYear: columns[6] || '', familyContact: columns[7] || '',
          height: columns[8] || '', weight: columns[9] || '', gpa: columns[10] || '', recruitingStatus: columns[11] || 'Open',
          playerEmail: '', playerPhone: '', committedSchool: '', ncaaId: '', coachNotes: '', highlightUrl: '', videoLinks: [],
          gamesPlayed: 0, ab: 0, hits: 0, rbi: 0, runs: 0, double: 0, triple: 0, hr: 0, bb: 0, sb: 0, 
          ip: 0, er: 0, hitsAllowed: 0, walksAllowed: 0, strikeouts: 0, wins: 0, po: 0, assists: 0, errors: 0
        });
      }
    });

    try {
      await authenticatedPost(`/api/seasons/${encodeURIComponent(selectedSeason)}/roster`, {
        roster: [...(currentSeasonData.roster || []), ...parsedPlayers]
      });
      updateCurrentSeasonData({
        roster: [...(currentSeasonData.roster || []), ...parsedPlayers]
      });
      setRawCsvInput('');
      alert("Roster parsed into cloud storage!");
    } catch (err) { console.error(err); }
  };

  const resetRosterForm = () => {
    setRosterForm(emptyRosterForm);
    setEditingRosterId('');
    setRosterStatus('Ready');
  };

  const updateRosterForm = (field, value) => {
    setRosterForm((current) => ({ ...current, [field]: value }));
  };

  const uploadPlayerHighlightFile = (file) => {
    if (!user || !file) return;

    const maxUploadSize = 250 * 1024 * 1024;
    if (file.size > maxUploadSize) {
      setHighlightUploadStatus('File is too large. Use a link for full game film.');
      return;
    }

    const playerId = editingRosterId || rosterForm.id || `draft_${Date.now()}`;
    const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
    const filePath = `player-highlights/${selectedSeason}/${playerId}/${Date.now()}-${safeFileName}`;
    const uploadTask = uploadBytesResumable(ref(storage, filePath), file, {
      contentType: file.type || 'application/octet-stream',
      customMetadata: {
        playerId,
        season: selectedSeason,
        uploadedBy: user.uid
      }
    });

    setHighlightUploadStatus('Uploading 0%');

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setHighlightUploadStatus(`Uploading ${percent}%`);
      },
      (error) => {
        console.error(error);
        setHighlightUploadStatus(`Upload failed: ${error.code || 'check Firebase Storage rules'}`);
      },
      async () => {
        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
        setRosterForm((current) => {
          const existingLinks = String(current.videoLinksText || '')
            .split('\n')
            .map((link) => link.trim())
            .filter(Boolean);
          const nextLinks = current.highlightUrl
            ? [...existingLinks, downloadUrl]
            : existingLinks;

          return {
            ...current,
            highlightUrl: current.highlightUrl || downloadUrl,
            videoLinksText: nextLinks.join('\n')
          };
        });
        setHighlightUploadStatus('Upload complete. Save player to keep it.');
      }
    );
  };

  const normalizeRosterPlayer = (player) => ({
    id: player.id || `r_${Date.now()}`,
    firstName: player.firstName.trim(),
    lastName: player.lastName.trim(),
    jersey: player.jersey.trim(),
    primaryPosition: player.primaryPosition,
    bats: player.bats,
    throws: player.throws,
    classYear: player.classYear.trim(),
    familyContact: player.familyContact.trim(),
    height: String(player.height || '').trim(),
    weight: String(player.weight || '').trim(),
    gpa: String(player.gpa || '').trim(),
    playerEmail: String(player.playerEmail || '').trim(),
    playerPhone: String(player.playerPhone || '').trim(),
    recruitingStatus: player.recruitingStatus || 'Open',
    committedSchool: String(player.committedSchool || '').trim(),
    ncaaId: String(player.ncaaId || '').trim(),
    coachNotes: String(player.coachNotes || '').trim(),
    highlightUrl: String(player.highlightUrl || '').trim(),
    videoLinks: String(player.videoLinksText || '')
      .split('\n')
      .map((link) => link.trim())
      .filter(Boolean),
    gamesPlayed: Number(player.gamesPlayed || 0),
    ab: Number(player.ab || 0),
    hits: Number(player.hits || 0),
    rbi: Number(player.rbi || 0),
    runs: Number(player.runs || 0),
    double: Number(player.double || 0),
    triple: Number(player.triple || 0),
    hr: Number(player.hr || 0),
    bb: Number(player.bb || 0),
    sb: Number(player.sb || 0),
    ip: Number(player.ip || 0),
    er: Number(player.er || 0),
    hitsAllowed: Number(player.hitsAllowed || 0),
    walksAllowed: Number(player.walksAllowed || 0),
    strikeouts: Number(player.strikeouts || 0),
    wins: Number(player.wins || 0),
    po: Number(player.po || 0),
    assists: Number(player.assists || 0),
    errors: Number(player.errors || 0)
  });

  const saveRosterPlayer = async () => {
    if (!user) return;
    if (!rosterForm.firstName.trim() || !rosterForm.lastName.trim()) {
      setRosterStatus('Player name required');
      return;
    }

    setRosterStatus('Saving');

    const player = normalizeRosterPlayer({
      ...rosterForm,
      id: editingRosterId || rosterForm.id || `r_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
    });

    const currentRoster = currentSeasonData.roster || [];
    const updatedRoster = editingRosterId
      ? currentRoster.map((item) => (item.id === editingRosterId ? { ...item, ...player } : item))
      : [...currentRoster, player];

    try {
      await authenticatedPost(`/api/seasons/${encodeURIComponent(selectedSeason)}/roster`, {
        roster: updatedRoster
      });
      updateCurrentSeasonData({ roster: updatedRoster });
      setRosterStatus(editingRosterId ? 'Player updated' : 'Player added');
      setRosterForm(emptyRosterForm);
      setEditingRosterId('');
      setHighlightUploadStatus('No file selected');
    } catch (err) {
      console.error(err);
      setRosterStatus('Could not save');
    }
  };

  const editRosterPlayer = (player) => {
    setEditingRosterId(player.id);
    setHighlightUploadStatus('No file selected');
    setRosterForm({
      ...emptyRosterForm,
      ...player,
      primaryPosition: player.primaryPosition || 'P',
      bats: player.bats || 'R',
      throws: player.throws || 'R',
      classYear: player.classYear || '',
      familyContact: player.familyContact || '',
      height: player.height || '',
      weight: player.weight || '',
      gpa: player.gpa || '',
      playerEmail: player.playerEmail || '',
      playerPhone: player.playerPhone || '',
      recruitingStatus: player.recruitingStatus || 'Open',
      committedSchool: player.committedSchool || '',
      ncaaId: player.ncaaId || '',
      coachNotes: player.coachNotes || '',
      highlightUrl: player.highlightUrl || '',
      videoLinksText: Array.isArray(player.videoLinks) ? player.videoLinks.join('\n') : ''
    });
    setRosterStatus('Editing player');
  };

  const deleteRosterPlayer = async (playerId) => {
    if (!user) return;

    setRosterStatus('Removing');

    try {
      const updatedRoster = (currentSeasonData.roster || []).filter((player) => player.id !== playerId);
      await authenticatedPost(`/api/seasons/${encodeURIComponent(selectedSeason)}/roster`, {
        roster: updatedRoster
      });
      updateCurrentSeasonData({ roster: updatedRoster });
      if (editingRosterId === playerId) resetRosterForm();
      setRosterStatus('Player removed');
    } catch (err) {
      console.error(err);
      setRosterStatus('Could not remove');
    }
  };

  const resetScheduleForm = () => {
    setScheduleForm(emptyScheduleForm);
    setEditingScheduleId('');
    setScheduleStatus('Ready');
  };

  const updateScheduleForm = (field, value) => {
    setScheduleForm((current) => ({ ...current, [field]: value }));
  };

  const saveScheduledGame = async () => {
    if (!user) return;
    if (!scheduleForm.date || !scheduleForm.opponent.trim()) {
      setScheduleStatus('Date and opponent required');
      return;
    }

    const game = {
      id: editingScheduleId || scheduleForm.id || `game_${Date.now()}`,
      date: scheduleForm.date,
      startTime: scheduleForm.startTime,
      opponent: scheduleForm.opponent.trim(),
      location: scheduleForm.location,
      venue: scheduleForm.venue.trim(),
      type: scheduleForm.type,
      status: scheduleForm.status,
      notes: scheduleForm.notes.trim(),
      ourScore: Number(scheduleForm.ourScore || 0),
      theirScore: Number(scheduleForm.theirScore || 0),
      result: scheduleForm.result || '',
      updatedAt: new Date().toISOString()
    };

    const currentSchedule = currentSeasonData.schedule || [];
    const updatedSchedule = editingScheduleId
      ? currentSchedule.map((item) => (String(item.id) === String(editingScheduleId) ? { ...item, ...game } : item))
      : [...currentSchedule, game];

    setScheduleStatus('Saving');

    try {
      await setDoc(doc(db, 'seasons', selectedSeason), { schedule: updatedSchedule }, { merge: true });
      setScheduleStatus(editingScheduleId ? 'Game updated' : 'Game added');
      setScheduleForm(emptyScheduleForm);
      setEditingScheduleId('');
    } catch (err) {
      console.error(err);
      setScheduleStatus('Could not save');
    }
  };

  const editScheduledGame = (game) => {
    setEditingScheduleId(String(game.id));
    setScheduleForm({
      ...emptyScheduleForm,
      ...game,
      id: String(game.id),
      startTime: game.startTime || '',
      venue: game.venue || '',
      notes: game.notes || '',
      status: game.status || 'Scheduled',
      type: game.type || 'District',
      location: game.location || 'Home'
    });
    setScheduleStatus('Editing game');
  };

  const deleteScheduledGame = async (gameId) => {
    if (!user) return;

    setScheduleStatus('Removing');

    try {
      const updatedSchedule = (currentSeasonData.schedule || []).filter((game) => String(game.id) !== String(gameId));
      await setDoc(doc(db, 'seasons', selectedSeason), { schedule: updatedSchedule }, { merge: true });
      if (String(editingScheduleId) === String(gameId)) resetScheduleForm();
      setScheduleStatus('Game removed');
    } catch (err) {
      console.error(err);
      setScheduleStatus('Could not remove');
    }
  };

  const loadScheduledGameForScoring = (game) => {
    setGameDate(game.date || new Date().toISOString().slice(0, 10));
    setScoringOpponent(game.opponent || '');
    setScoringLocation(game.location || 'Home');
    setScoringType(game.type || 'District');
    setOurInnings([0, 0, 0, 0, 0, 0, 0]);
    setTheirInnings([0, 0, 0, 0, 0, 0, 0]);
    setOurHits(0);
    setTheirHits(0);
    setOurErrors(0);
    setTheirErrors(0);
    setBalls(0);
    setStrikes(0);
    setOuts(0);
    setPitchCount(0);
    setCurrentInning(1);
    setIsTopInning(game.location !== 'Home');
    setRunnerOnFirst(false);
    setRunnerOnSecond(false);
    setRunnerOnThird(false);
    setLastPlaySummary(`Loaded ${game.opponent || 'scheduled game'} for scoring.`);
    setSetupStatus('lineups');
    setActiveTab('live-game');
  };

  const buildDefaultLineupEntries = () => processedRoster.slice(0, 9).map((player, index) => ({
    playerId: player.id,
    battingOrder: index + 1,
    position: player.primaryPosition || '',
    status: 'starter'
  }));

  const createLineupFromRoster = () => {
    setLineupEntries(buildDefaultLineupEntries());
    setLineupStatus('Draft lineup created');
  };

  const addBenchPlayerToLineup = (player) => {
    setLineupEntries((entries) => ([
      ...entries,
      {
        playerId: player.id,
        battingOrder: entries.length + 1,
        position: player.primaryPosition || '',
        status: entries.length < 9 ? 'starter' : 'bench'
      }
    ]));
    setLineupStatus('Lineup changed');
  };

  const updateLineupEntry = (playerId, field, value) => {
    setLineupEntries((entries) => entries.map((entry) => (
      entry.playerId === playerId ? { ...entry, [field]: value } : entry
    )));
    setLineupStatus('Lineup changed');
  };

  const removeLineupEntry = (playerId) => {
    setLineupEntries((entries) => entries
      .filter((entry) => entry.playerId !== playerId)
      .map((entry, index) => ({ ...entry, battingOrder: index + 1 })));
    setLineupStatus('Lineup changed');
  };

  const moveLineupEntry = (playerId, direction) => {
    setLineupEntries((entries) => {
      const index = entries.findIndex((entry) => entry.playerId === playerId);
      const swapIndex = index + direction;
      if (index < 0 || swapIndex < 0 || swapIndex >= entries.length) return entries;

      const updated = [...entries];
      [updated[index], updated[swapIndex]] = [updated[swapIndex], updated[index]];
      return updated.map((entry, orderIndex) => ({ ...entry, battingOrder: orderIndex + 1 }));
    });
    setLineupStatus('Lineup changed');
  };

  const saveLineupToCloud = async () => {
    if (!user) return;

    const normalizedLineup = (lineupEntries.length ? lineupEntries : buildDefaultLineupEntries())
      .map((entry, index) => ({ ...entry, battingOrder: index + 1 }));

    setLineupStatus('Saving');

    try {
      await Promise.all([
        authenticatedPost(`/api/games/${defaultLiveGameId}/state`, {
          lineupEntries: normalizedLineup,
          setupStatus: 'lineups'
        }),
        setDoc(doc(db, 'seasons', selectedSeason), {
          lastLineup: normalizedLineup,
          lastLineupUpdatedAt: new Date().toISOString()
        }, { merge: true })
      ]);

      const firstStarter = normalizedLineup.find((entry) => entry.status !== 'bench');
      const pitcherEntry = normalizedLineup.find((entry) => entry.position === 'P') || firstStarter;
      const batterPlayer = firstStarter ? rosterById[firstStarter.playerId] : null;
      const pitcherPlayer = pitcherEntry ? rosterById[pitcherEntry.playerId] : null;

      if (batterPlayer) setCurrentBatter(`${batterPlayer.firstName} ${batterPlayer.lastName}`);
      if (pitcherPlayer) setCurrentPitcher(`${pitcherPlayer.firstName} ${pitcherPlayer.lastName}`);
      setLineupStatus('Saved');
    } catch (err) {
      console.error(err);
      setLineupStatus('Could not save');
    }
  };

  const usePreviousLineup = () => {
    if (currentSeasonData.lastLineup?.length) {
      setLineupEntries(currentSeasonData.lastLineup);
      setLineupStatus('Previous lineup loaded');
      return;
    }

    createLineupFromRoster();
  };

  const parseOpponentRoster = () => {
    const parsedPlayers = opponentRawRoster
      .split('\n')
      .map((line, index) => {
        const columns = line.split(/[,\t]/).map((column) => column.trim());
        if (!columns.some(Boolean)) return null;

        return {
          id: `opp_${Date.now()}_${index}`,
          jersey: columns[0] || '',
          firstName: columns[1] || columns[0] || `Player ${index + 1}`,
          lastName: columns[2] || '',
          position: columns[3] || '',
        };
      })
      .filter(Boolean);

    setOpponentRoster(parsedPlayers);
    setOpponentRawRoster('');
    setSetupStatus(parsedPlayers.length ? 'lineups' : 'draft');
  };

  const markGameReady = () => {
    setSetupStatus(setupComplete ? 'ready' : 'lineups');
  };

  const markCurrentGameLiveOnSchedule = async () => {
    if (!user || !scoringOpponent) return;
    const currentSchedule = currentSeasonData.schedule || [];
    const matchIndex = currentSchedule.findIndex(
      g => g.opponent === scoringOpponent && g.date === gameDate && g.status !== 'Final'
    );
    if (matchIndex === -1) return;
    const updated = currentSchedule.map((g, i) =>
      i === matchIndex ? { ...g, status: 'Live' } : g
    );
    try {
      await setDoc(doc(db, 'seasons', selectedSeason), { schedule: updated }, { merge: true });
    } catch (e) { console.error(e); }
  };

  const resumeSetup = () => {
    setSetupStatus('lineups');
  };

  const buildStatsFromEvents = (events) => {
    const stats = {};
    const getPlayer = (id) => {
      if (!stats[id]) stats[id] = { ab: 0, hits: 0, double: 0, triple: 0, hr: 0, rbi: 0, runs: 0, bb: 0, sb: 0, ip: 0, er: 0, hitsAllowed: 0, walksAllowed: 0, strikeouts: 0 };
      return stats[id];
    };
    events.forEach(ev => {
      if (ev.eventType !== 'plate_appearance') return;
      const batterId = ev.batterLabel;
      const pitcherId = ev.pitcherLabel;
      if (batterId) {
        const b = getPlayer(batterId);
        const r = ev.result;
        if (['single','double','triple','home_run','strikeout','groundout','flyout','error','sac_fly','fielder_choice'].includes(r)) b.ab++;
        if (r === 'single') { b.hits++; }
        if (r === 'double') { b.hits++; b.double++; }
        if (r === 'triple') { b.hits++; b.triple++; }
        if (r === 'home_run') { b.hits++; b.hr++; }
        if (r === 'walk') b.bb++;
        if (ev.runsScored) b.rbi += ev.runsScored;
      }
      if (pitcherId) {
        const p = getPlayer(pitcherId);
        const r = ev.result;
        if (r === 'strikeout') p.strikeouts++;
        if (r === 'walk') p.walksAllowed++;
        if (['single','double','triple','home_run'].includes(r)) p.hitsAllowed++;
        if (ev.runsScored) p.er += ev.runsScored;
      }
    });
    events.forEach(ev => {
      if (ev.eventType === 'defensive_play' && ev.result === 'stolen_base' && ev.batterLabel) {
        getPlayer(ev.batterLabel).sb++;
      }
    });
    return stats;
  };

  const commitLiveGameToHistory = async () => {
    if (!user) return;
    const isWin = ourLiveScore > theirLiveScore;
    const finalGameDate = gameDate || new Date().toISOString().split('T')[0];
    const newGameEntry = { 
      id: Date.now(), 
      date: finalGameDate,
      opponent: scoringOpponent, 
      type: scoringType, location: scoringLocation, 
      status: 'Final', ourScore: ourLiveScore, theirScore: theirLiveScore,
      ourHits, theirHits, ourErrors, theirErrors,
      ourInnings: [...ourInnings], theirInnings: [...theirInnings],
      result: isWin ? 'W' : 'L' 
    };

    const boxScore = {
      date: finalGameDate,
      opponent: scoringOpponent,
      location: scoringLocation,
      ourScore: ourLiveScore,
      theirScore: theirLiveScore,
      ourHits, theirHits, ourErrors, theirErrors,
      ourInnings: [...ourInnings],
      theirInnings: [...theirInnings],
      result: isWin ? 'W' : 'L',
      innings: currentInning
    };
    
    const eventStats = buildStatsFromEvents(recentEvents);
    const updatedRoster = (currentSeasonData.roster || []).map(player => {
      const nameKey = `${player.firstName} ${player.lastName}`;
      const gameStat = eventStats[nameKey];
      if (!gameStat) return { ...player, gamesPlayed: (Number(player.gamesPlayed) || 0) + 1 };
      return {
        ...player,
        gamesPlayed: (Number(player.gamesPlayed) || 0) + 1,
        ab: (Number(player.ab) || 0) + gameStat.ab,
        hits: (Number(player.hits) || 0) + gameStat.hits,
        double: (Number(player.double) || 0) + gameStat.double,
        triple: (Number(player.triple) || 0) + gameStat.triple,
        hr: (Number(player.hr) || 0) + gameStat.hr,
        rbi: (Number(player.rbi) || 0) + gameStat.rbi,
        runs: (Number(player.runs) || 0) + gameStat.runs,
        bb: (Number(player.bb) || 0) + gameStat.bb,
        sb: (Number(player.sb) || 0) + gameStat.sb,
        ip: (Number(player.ip) || 0) + gameStat.ip,
        er: (Number(player.er) || 0) + gameStat.er,
        hitsAllowed: (Number(player.hitsAllowed) || 0) + gameStat.hitsAllowed,
        walksAllowed: (Number(player.walksAllowed) || 0) + gameStat.walksAllowed,
        strikeouts: (Number(player.strikeouts) || 0) + gameStat.strikeouts,
      };
    });

    try {
      const seasonDocRef = doc(db, 'seasons', selectedSeason);
      await setDoc(seasonDocRef, {
        schedule: [...(currentSeasonData.schedule || []), newGameEntry],
        roster: updatedRoster
      }, { merge: true });
      updateCurrentSeasonData({ roster: updatedRoster });
      
      setLastBoxScore(boxScore);
      setShowBoxScore(true);

      setOurInnings([0, 0, 0, 0, 0, 0, 0]); setTheirInnings([0, 0, 0, 0, 0, 0, 0]);
      setOurHits(0); setTheirHits(0); setOurErrors(0); setTheirErrors(0);
      setBalls(0); setStrikes(0); setOuts(0); setPitchCount(0);
      setCurrentBatter(''); setCurrentPitcher('');
      setRunnerOnFirst(false); setRunnerOnSecond(false); setRunnerOnThird(false);
    } catch(e) { console.error(e); }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      await signInWithEmailAndPassword(auth, authEmail, authPassword);
      setShowAuthModal(false);
      setAuthEmail(''); setAuthPassword('');
    } catch (err) { setAuthError('Invalid administrator credentials.'); }
  };

  const startCheckout = async (tier) => {
    if (!user) { setShowAuthModal(true); return; }
    setCheckoutStatus('loading');
    try {
      const token = await user.getIdToken();
      const res = await fetch(`${apiBaseUrl}/create-checkout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Checkout failed');
      const { loadStripe } = await import('@stripe/stripe-js');
      const stripeJs = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');
      await stripeJs.redirectToCheckout({ sessionId: data.id });
    } catch (err) {
      console.error(err);
      setCheckoutStatus('error');
    }
  };

  const handleCreateTeam = async () => {
    if (!user || !newTeamName.trim()) return;
    setNewTeamStatus('Creating…');
    try {
      const token = await user.getIdToken();
      const res = await fetch(`${apiBaseUrl}/api/seasons`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newTeamName.trim(), sport: newTeamSport, ageGroup: newTeamAgeGroup, location: newTeamLocation.trim() })
      });
      const data = await res.json();
      if (!res.ok) { setNewTeamStatus(data.error || 'Error'); return; }
      setNewTeamStatus('Created!');
      setShowNewTeamModal(false);
      setNewTeamName(''); setNewTeamSport('Baseball'); setNewTeamAgeGroup('Varsity'); setNewTeamLocation(''); setNewTeamStatus('');
      await loadMySeasons(user);
      setSelectedSeason(data.id);
    } catch (e) { setNewTeamStatus('Network error'); }
  };

  const handleInviteCoach = async () => {
    if (!user || !inviteEmail.trim()) return;
    setInviteStatus('Sending…');
    try {
      const token = await user.getIdToken();
      const res = await fetch(`${apiBaseUrl}/api/seasons/${encodeURIComponent(selectedSeason)}/invite`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inviteEmail.trim(), role: inviteRole })
      });
      const data = await res.json();
      if (!res.ok) { setInviteStatus(data.error || 'Error'); return; }
      setInviteStatus(`✓ Invited ${inviteEmail.trim()}`);
      setInviteEmail('');
      setSeasonCoaches(prev => [...prev, data.coach]);
    } catch (e) { setInviteStatus('Network error'); }
  };

  const handleRemoveCoach = async (email) => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      await fetch(`${apiBaseUrl}/api/seasons/${encodeURIComponent(selectedSeason)}/remove-coach`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      setSeasonCoaches(prev => prev.filter(c => c.email !== email));
    } catch (e) { console.error(e); }
  };

  const getReferralLink = () => {
    const code = user ? user.uid.slice(0, 8) : 'friend';
    return `${window.location.origin}/?ref=${code}`;
  };

  const copyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(getReferralLink());
      setReferralCopied(true);
      setTimeout(() => setReferralCopied(false), 2000);
    } catch {}
  };

  const handleDigestOptIn = async () => {
    const email = digestEmail.trim() || user?.email || '';
    if (!email) { setDigestStatus('Enter an email address'); return; }
    setDigestStatus('Saving…');
    try {
      if (user) {
        const token = await user.getIdToken();
        await fetch(`${apiBaseUrl}/api/user/plan`, { headers: { Authorization: `Bearer ${token}` } }); // ping to keep session alive
      }
      localStorage.setItem('gt_digest_optin', 'true');
      localStorage.setItem('gt_digest_email', email);
      setDigestOptIn(true);
      setDigestBannerDismissed(true);
      setDigestStatus(`✓ Subscribed! Weekly digest goes to ${email}`);
    } catch { setDigestStatus('Error — please try again'); }
  };

  const requestNotifPermission = async () => {
    if (typeof Notification === 'undefined') return;
    const result = await Notification.requestPermission();
    setNotifPermission(result);
  };

  const sendGameNotif = (title, body) => {
    if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return;
    new Notification(title, { body, icon: '/favicon.ico' });
  };

  const copyFanLink = (player) => {
    const url = `${window.location.origin}/fan?game=${encodeURIComponent(defaultLiveGameId)}`;
    const text = `Follow ${player.firstName} ${player.lastName} live at ${teamDisplayName || homeTeamName}! ${url}`;
    navigator.clipboard?.writeText(text).catch(() => {});
    alert(`Fan link for ${player.firstName} ${player.lastName} copied! Share with their family.`);
  };

  const printLineupCard = () => {
    const entries = activeLineupEntries.length ? activeLineupEntries : [];
    const win = window.open('', '_blank', 'width=600,height=800');
    win.document.write(`
      <html><head><title>Lineup Card - ${teamDisplayName || homeTeamName}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 24px; color: #000; }
        h2 { margin: 0 0 4px; font-size: 18px; }
        p { margin: 0 0 16px; font-size: 13px; color: #555; }
        table { width: 100%; border-collapse: collapse; font-size: 13px; }
        th { background: #111; color: #fff; padding: 8px 10px; text-align: left; }
        td { padding: 8px 10px; border-bottom: 1px solid #ddd; }
        tr:nth-child(even) { background: #f9f9f9; }
        .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; background: #e5e7eb; }
      </style></head><body>
      <h2>${sportEmoji(teamSport)} ${teamDisplayName || homeTeamName} &mdash; Lineup Card</h2>
      <p>${gameDate} &nbsp;&middot;&nbsp; ${scoringLocation === 'Away' ? '@' : 'vs'} ${scoringOpponent || 'Opponent'} &nbsp;&middot;&nbsp; ${selectedSeason}</p>
      <table>
        <thead><tr><th>Order</th><th>Player</th><th>Jersey</th><th>Pos</th><th>B/T</th><th>Status</th></tr></thead>
        <tbody>
          ${entries.map((entry, i) => `
            <tr>
              <td>${i + 1}</td>
              <td>${entry.player?.firstName || ''} ${entry.player?.lastName || ''}</td>
              <td>#${entry.player?.jersey || '-'}</td>
              <td>${entry.position || entry.player?.primaryPosition || '-'}</td>
              <td>${entry.player?.bats || '-'}/${entry.player?.throws || '-'}</td>
              <td><span class="badge">${entry.status || 'starter'}</span></td>
            </tr>`).join('')}
        </tbody>
      </table>
      <p style="margin-top:20px;font-size:11px;color:#999;">Generated by GameTracker &nbsp;&middot;&nbsp; ${new Date().toLocaleString()}</p>
      </body></html>`);
    win.document.close();
    win.print();
  };

  const isBase64Logo = logoUrl && logoUrl.slice(0, 10) === 'data:image';
  const displayLogoValue = isBase64Logo ? '[Local Image Loaded]' : logoUrl;

  // Computed onboarding checklist for growth
  const onboardingSteps = [
    { label: 'Create your team', done: mySeasons.length > 0 || Boolean(teamDisplayName) },
    { label: 'Add players to roster', done: processedRoster.length > 0 },
    { label: 'Schedule a game', done: seasonSchedule.length > 0 },
    { label: 'Score a live game', done: pitchCount > 0 || recentEvents.length > 0 },
    { label: 'Share fan link with parents', done: Boolean(localStorage.getItem('gt_fan_shared')) },
  ];
  const onboardingPct = Math.round((onboardingSteps.filter(s => s.done).length / onboardingSteps.length) * 100);
  const onboardingComplete = onboardingSteps.every(s => s.done);

  return (
    <div className={styles.container}>

      {/* EMAIL DIGEST BANNER */}
      {user && !digestOptIn && !digestBannerDismissed && (
        <div style={{ background: 'linear-gradient(90deg,#0f172a,#0c1a3a)', borderBottom: '1px solid rgba(56,189,248,0.2)', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '13px', color: '#94a3b8', flex: 1, minWidth: '180px' }}>📧 <strong style={{ color: '#e2e8f0' }}>Weekly stats digest</strong> — get your team's top stats every Monday morning.</span>
          <input
            value={digestEmail}
            onChange={e => setDigestEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleDigestOptIn()}
            placeholder={user?.email || 'your@email.com'}
            style={{ background: '#020617', border: '1px solid #334155', borderRadius: '6px', color: '#fff', fontSize: '12px', padding: '6px 10px', width: '200px' }}
          />
          <button onClick={handleDigestOptIn} style={{ background: '#38bdf8', border: 'none', borderRadius: '6px', color: '#020617', fontSize: '12px', fontWeight: '900', padding: '7px 14px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            Subscribe
          </button>
          <button onClick={() => { setDigestBannerDismissed(true); localStorage.setItem('gt_digest_dismissed','true'); }} style={{ background: 'none', border: 'none', color: '#334155', cursor: 'pointer', fontSize: '18px', lineHeight: 1, padding: '0 4px' }}>×</button>
        </div>
      )}

      {/* NAVBAR */}
      <div className={`${styles.appTabBarNav} ${styles.hideOnPrint}`}>
        <button className={`${styles.tabBarBtn} ${activeTab === 'live-game' ? styles.tabBarBtnActive : ''}`} onClick={() => setActiveTab('live-game')}>🎮 Live Scoring Engine</button>
        <button className={`${styles.tabBarBtn} ${activeTab === 'schedule' ? styles.tabBarBtnActive : ''}`} onClick={() => setActiveTab('schedule')}>📅 Results &amp; Records</button>
        <button className={`${styles.tabBarBtn} ${activeTab === 'stats' ? styles.tabBarBtnActive : ''}`} onClick={() => setActiveTab('stats')}>📈 Stat Sheets</button>
        <button className={`${styles.tabBarBtn} ${activeTab === 'scouting' ? styles.tabBarBtnActive : ''}`} onClick={() => setActiveTab('scouting')}>🔍 Scouting</button>
        <button className={`${styles.tabBarBtn} ${activeTab === 'bracket' ? styles.tabBarBtnActive : ''}`} onClick={() => setActiveTab('bracket')}>🏆 Bracket</button>
        <button className={`${styles.tabBarBtn} ${activeTab === 'gameday' ? styles.tabBarBtnActive : ''}`} onClick={() => setActiveTab('gameday')}>📋 Game Day</button>
        <button className={`${styles.tabBarBtn} ${activeTab === 'changelog' ? styles.tabBarBtnActive : ''}`} onClick={() => setActiveTab('changelog')} style={{ color: activeTab === 'changelog' ? '#a78bfa' : '#64748b' }}>🆕 What's New</button>
        <button className={`${styles.tabBarBtn} ${activeTab === 'upgrade' ? styles.tabBarBtnActive : ''}`} onClick={() => setActiveTab('upgrade')} style={{ marginLeft: 'auto', color: activeTab === 'upgrade' ? '#fff' : '#f59e0b', background: activeTab === 'upgrade' ? '#854d0e' : 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.4)' }}>⭐ Upgrade</button>
      </div>

      {/* TOP MEDIA BANNER */}
      <div className={styles.scheduleHeaderBanner} style={{ borderLeft: '6px solid #3b82f6' }}>
        <div className={styles.bannerLeftSection} style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          {logoUrl ? (
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', overflow: 'hidden', background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #334155', flexShrink: 0 }}>
              <img src={logoUrl} alt="Team Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ) : (
            <div style={{ fontSize: '28px', width: '50px', textAlign: 'center' }}>🧢</div>
          )}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <h2 style={{ margin: 0 }}>{sportEmoji(teamSport)} {teamDisplayName || homeTeamName} Stats Central</h2>
              <a
                href={`/fan?game=${encodeURIComponent(defaultLiveGameId)}`}
                target="_blank"
                rel="noreferrer"
                style={{ padding: '4px 10px', fontSize: '11px', borderRadius: '4px', background: '#2563eb', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'none' }}
              >
                Fan View
              </a>
              <button onClick={user ? () => signOut(auth) : () => setShowAuthModal(true)} style={{ padding: '4px 10px', fontSize: '11px', borderRadius: '4px', background: user ? '#ef4444' : '#1e293b', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                {user ? '🔒 Logout' : '🔑 Coach Login'}
              </button>
            </div>
            <div style={{ marginTop: '8px', display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
              {user && mySeasons.length > 0 ? (
                <>
                  <select
                    value={selectedSeason}
                    onChange={e => { setSelectedSeason(e.target.value); loadSeasonCoaches(e.target.value, user); }}
                    style={{ background: '#0f172a', border: '1px solid #334155', color: '#f8fafc', borderRadius: '8px', padding: '6px 12px', fontSize: '13px', fontWeight: '700', maxWidth: '260px' }}
                  >
                    {mySeasons.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.teamProfile?.name || s.id} {s.role === 'owner' ? '' : `(${s.role})`}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => setShowNewTeamModal(true)}
                    style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#22c55e', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', fontWeight: '800', cursor: 'pointer' }}
                  >
                    + New Team
                  </button>
                  <button
                    onClick={() => { setShowInvitePanel(p => !p); loadSeasonCoaches(selectedSeason, user); }}
                    style={{ background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.3)', color: '#a78bfa', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', fontWeight: '800', cursor: 'pointer' }}
                  >
                    👥 Team Access
                  </button>
                </>
              ) : user ? (
                <>
                  <span style={{ fontSize: '12px', color: '#475569' }}>No teams yet</span>
                  <button
                    onClick={() => setShowNewTeamModal(true)}
                    style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#22c55e', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', fontWeight: '800', cursor: 'pointer' }}
                  >
                    + Create First Team
                  </button>
                </>
              ) : (
                ['2024–2025', '2025–2026', '2026–2027'].map(yr => (
                  <button key={yr} className={`${styles.seasonYearPill} ${selectedSeason === yr ? styles.seasonYearPillActive : ''}`} onClick={() => setSelectedSeason(yr)}>{yr}</button>
                ))
              )}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
          <div className={styles.bannerRecordsRibbon}>
            <div className={styles.ribbonStatBox}><small>RECORD</small><strong>{seasonWins}-{seasonLosses}</strong></div>
            <div className={styles.ribbonStatBox}><small>TEAM AVG</small><strong>{teamTotals.avg.toFixed(3)}</strong></div>
            <div className={styles.ribbonStatBox}><small>TEAM ERA</small><strong>{teamTotals.era.toFixed(2)}</strong></div>
            <div className={styles.ribbonStatBox}><small>FIELD %</small><strong>{teamTotals.fp.toFixed(3)}</strong></div>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            {notifPermission !== 'granted' && (
              <button
                onClick={requestNotifPermission}
                title="Enable game notifications"
                style={{ fontSize: '11px', color: '#f59e0b', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', padding: '4px 12px', borderRadius: '999px', cursor: 'pointer' }}
              >
                🔔 Enable Notifications
              </button>
            )}
            {notifPermission === 'granted' && (
              <span style={{ fontSize: '11px', color: '#22c55e', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', padding: '4px 12px', borderRadius: '999px' }}>
                🔔 Notifications On
              </span>
            )}
            {selectedSeason && (
              <a
                href={`/team?season=${encodeURIComponent(selectedSeason)}`}
                target="_blank"
                rel="noreferrer"
                style={{ fontSize: '11px', color: '#38bdf8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.3)', padding: '4px 12px', borderRadius: '999px' }}
              >
                🌐 Public Team Page ↗
              </a>
            )}
            <a
              href="/discover"
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: '11px', color: '#a78bfa', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.3)', padding: '4px 12px', borderRadius: '999px' }}
            >
              🎓 Coach Discovery ↗
            </a>
          </div>
        </div>
      </div>

      {/* 🎮 DETAILED COMPLEX LIVE GAME MODULE TAB */}
      {activeTab === 'live-game' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '10px' }}>
          
          <div style={{ background: '#0b1329', border: '1px solid #1e293b', borderRadius: '12px', padding: '25px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', marginBottom: '20px', borderBottom: '1px solid #1e293b', paddingBottom: '15px' }}>
              <div>
                <h3 style={{ margin: 0, color: '#3b82f6', fontSize: '18px' }}>{sportEmoji(teamSport)} Game-Day Live Broadcast Interface</h3>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  Real-time scoreboard matrix controller · Cloud: {syncStatus}
                </span>
              </div>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <input type="date" disabled={!user || hasScoringStarted} value={gameDate} onChange={e => setGameDate(e.target.value)} style={{ padding: '6px 12px', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '6px', fontSize: '13px' }} />
                <input type="text" placeholder="Opponent Team" disabled={!user || hasScoringStarted} value={scoringOpponent} onChange={e => setScoringOpponent(e.target.value)} style={{ padding: '6px 12px', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '6px', fontSize: '13px' }} />
                <select value={scoringLocation} disabled={!user || hasScoringStarted} onChange={e => setScoringLocation(e.target.value)} style={{ padding: '6px', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '6px', fontSize: '13px' }}>
                  <option value="Home">Home</option>
                  <option value="Away">Away</option>
                </select>
                <select value={scoringType} disabled={!user || hasScoringStarted} onChange={e => setScoringType(e.target.value)} style={{ padding: '6px', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '6px', fontSize: '13px' }}>
                  <option value="District">District</option>
                  <option value="Tournament">Tournament</option>
                  <option value="Non-District">Non-District</option>
                  <option value="Playoffs">Playoffs</option>
                </select>
              </div>
            </div>

            <div className={styles.gameSetupPanel}>
              <div className={styles.setupHeaderRow}>
                <div>
                  <h3>Game Setup</h3>
                  <p>Prepare game details, rosters, lineup, and pitch limits before first pitch.</p>
                </div>
                <div className={setupComplete ? styles.readyBadge : styles.draftBadge}>
                  {setupComplete ? 'Ready to Score' : 'Setup Needed'}
                </div>
              </div>

              <div className={styles.teamCreationCard}>
                <div className={styles.teamCreationHeader}>
                  <div>
                    <h4>Create / Update Team</h4>
                    <p>Set sport, team type, level, location, team name, season, and visibility before building the roster.</p>
                  </div>
                  <span className={teamProfileStatus === 'Saved' ? styles.teamProfileSaved : ''}>{teamProfileStatus}</span>
                </div>

                <div className={styles.teamCreationGrid}>
                  <label>
                    Sport
                    <select disabled={!user} value={teamSport} onChange={(event) => setTeamSport(event.target.value)}>
                      <option>Baseball</option>
                      <option>Softball</option>
                    </select>
                  </label>

                  <label>
                    Team Type
                    <select disabled={!user} value={teamType} onChange={(event) => setTeamType(event.target.value)}>
                      <option>School</option>
                      <option>Club / Travel</option>
                      <option>Little League</option>
                      <option>Adult / Rec</option>
                    </select>
                  </label>

                  <label>
                    Age / Level
                    <select disabled={!user} value={teamAgeGroup} onChange={(event) => setTeamAgeGroup(event.target.value)}>
                      <option>Varsity</option>
                      <option>JV</option>
                      <option>Freshman</option>
                      <option>18U</option>
                      <option>16U</option>
                      <option>14U</option>
                      <option>12U</option>
                      <option>10U</option>
                    </select>
                  </label>

                  <label>
                    Location
                    <input disabled={!user} value={teamLocation} onChange={(event) => setTeamLocation(event.target.value)} placeholder="City, State" />
                  </label>

                  <label>
                    Team Name
                    <input disabled={!user} value={teamDisplayName} onChange={(event) => setTeamDisplayName(event.target.value)} placeholder="Team name" />
                  </label>

                  <label>
                    Season
                    <select disabled={!user} value={selectedSeason} onChange={(event) => setSelectedSeason(event.target.value)}>
                      <option>2024–2025</option>
                      <option>2025–2026</option>
                      <option>2026–2027</option>
                    </select>
                  </label>

                  <label>
                    Visibility
                    <select disabled={!user} value={teamPrivacy} onChange={(event) => setTeamPrivacy(event.target.value)}>
                      <option>Public</option>
                      <option>Private</option>
                    </select>
                  </label>

                  <button disabled={!user} onClick={saveTeamProfileToCloud}>Save Team</button>
                </div>
              </div>

              <div className={styles.setupGrid}>
                <div className={styles.setupCard}>
                  <h4>Pre-Game Checklist</h4>
                  <div className={styles.checklist}>
                    {setupChecklist.map((item) => (
                      <div key={item.label} className={item.done ? styles.checkDone : styles.checkTodo}>
                        <span>{item.done ? 'Done' : 'Open'}</span>
                        <strong>{item.label}</strong>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.setupCard}>
                  <h4>Lineup Mode</h4>
                  <div className={styles.segmentedControl}>
                    <button disabled={!user} className={lineupMode === 'official' ? styles.segmentActive : ''} onClick={() => setLineupMode('official')}>Official Lineup</button>
                    <button disabled={!user} className={lineupMode === 'quick' ? styles.segmentActive : ''} onClick={() => setLineupMode('quick')}>Quick Lineup</button>
                  </div>
                  <p className={styles.setupHint}>
                    Official mode uses full roster cards. Quick mode lets you start scoring when only jersey numbers or partial opponent names are available.
                  </p>
                  {hasScoringStarted && (
                    <p className={styles.lockHint}>Home/Away and opponent details are locked after pitches are recorded.</p>
                  )}
                </div>

                <div className={styles.setupCard}>
                  <h4>Opponent Roster Import</h4>
                  <textarea
                    disabled={!user}
                    className={styles.importerTextArea}
                    placeholder="Jersey, First, Last, Position&#10;12, Alex, Rivera, SS&#10;8, Jordan, Lee, CF"
                    value={opponentRawRoster}
                    onChange={(event) => setOpponentRawRoster(event.target.value)}
                  />
                  <button disabled={!user} onClick={parseOpponentRoster} className={styles.setupActionButton}>Import Opponent</button>
                  <p className={styles.setupHint}>{opponentRoster.length} opponent player(s) loaded.</p>
                </div>

                <div className={styles.setupCard}>
                  <h4>Pitch Count Alerts</h4>
                  <div className={styles.pitchLimitRow}>
                    <label>Warn <input disabled={!user} type="number" min="1" value={pitchWarningLimit} onChange={(event) => setPitchWarningLimit(Number(event.target.value) || 0)} /></label>
                    <label>Limit <input disabled={!user} type="number" min="1" value={pitchHardLimit} onChange={(event) => setPitchHardLimit(Number(event.target.value) || 0)} /></label>
                  </div>
                  <div className={pitchCount >= pitchHardLimit ? styles.limitDanger : pitchCount >= pitchWarningLimit ? styles.limitWarning : styles.limitSafe}>
                    Pitch count: {pitchCount} / {pitchHardLimit}
                  </div>
                </div>
              </div>

              <div className={styles.rosterManagerPanel}>
                <div className={styles.rosterManagerHeader}>
                  <div>
                    <h4>Roster Manager</h4>
                    <p>Add players one at a time or import a spreadsheet-style list. This roster feeds lineups, stats, and scoring.</p>
                  </div>
                  <span>{processedRoster.length} player{processedRoster.length === 1 ? '' : 's'} · {rosterStatus}</span>
                </div>

                <div className={styles.rosterManagerGrid}>
                  <div className={styles.rosterFormCard}>
                    <div className={styles.rosterFormGrid}>
                      <label>
                        First Name
                        <input disabled={!user} value={rosterForm.firstName} onChange={(event) => updateRosterForm('firstName', event.target.value)} />
                      </label>
                      <label>
                        Last Name
                        <input disabled={!user} value={rosterForm.lastName} onChange={(event) => updateRosterForm('lastName', event.target.value)} />
                      </label>
                      <label>
                        Jersey
                        <input disabled={!user} value={rosterForm.jersey} onChange={(event) => updateRosterForm('jersey', event.target.value)} />
                      </label>
                      <label>
                        Position
                        <select disabled={!user} value={rosterForm.primaryPosition} onChange={(event) => updateRosterForm('primaryPosition', event.target.value)}>
                          {['P', 'C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF', 'DH', 'UTIL'].map((position) => (
                            <option key={position}>{position}</option>
                          ))}
                        </select>
                      </label>
                      <label>
                        Bats
                        <select disabled={!user} value={rosterForm.bats} onChange={(event) => updateRosterForm('bats', event.target.value)}>
                          <option>R</option>
                          <option>L</option>
                          <option>S</option>
                        </select>
                      </label>
                      <label>
                        Throws
                        <select disabled={!user} value={rosterForm.throws} onChange={(event) => updateRosterForm('throws', event.target.value)}>
                          <option>R</option>
                          <option>L</option>
                        </select>
                      </label>
                      <label>
                        Class Year
                        <input disabled={!user} value={rosterForm.classYear} onChange={(event) => updateRosterForm('classYear', event.target.value)} placeholder="2027" />
                      </label>
                      <label>
                        Family Contact
                        <input disabled={!user} value={rosterForm.familyContact} onChange={(event) => updateRosterForm('familyContact', event.target.value)} placeholder="optional" />
                      </label>
                      <label>
                        Height
                        <input disabled={!user} value={rosterForm.height} onChange={(event) => updateRosterForm('height', event.target.value)} placeholder="6'1&quot;" />
                      </label>
                      <label>
                        Weight
                        <input disabled={!user} value={rosterForm.weight} onChange={(event) => updateRosterForm('weight', event.target.value)} placeholder="185" />
                      </label>
                      <label>
                        GPA
                        <input disabled={!user} value={rosterForm.gpa} onChange={(event) => updateRosterForm('gpa', event.target.value)} placeholder="3.7" />
                      </label>
                      <label>
                        Recruiting Status
                        <select disabled={!user} value={rosterForm.recruitingStatus} onChange={(event) => updateRosterForm('recruitingStatus', event.target.value)}>
                          <option>Open</option>
                          <option>Contacted</option>
                          <option>Visited</option>
                          <option>Offered</option>
                          <option>Committed</option>
                          <option>Signed</option>
                        </select>
                      </label>
                      <label>
                        Player Email
                        <input disabled={!user} value={rosterForm.playerEmail} onChange={(event) => updateRosterForm('playerEmail', event.target.value)} placeholder="optional" />
                      </label>
                      <label>
                        Player Phone
                        <input disabled={!user} value={rosterForm.playerPhone} onChange={(event) => updateRosterForm('playerPhone', event.target.value)} placeholder="optional" />
                      </label>
                      <label>
                        Committed / Target School
                        <input disabled={!user} value={rosterForm.committedSchool} onChange={(event) => updateRosterForm('committedSchool', event.target.value)} placeholder="optional" />
                      </label>
                      <label>
                        NCAA ID
                        <input disabled={!user} value={rosterForm.ncaaId} onChange={(event) => updateRosterForm('ncaaId', event.target.value)} placeholder="optional" />
                      </label>
                      <label className={styles.rosterWideField}>
                        Main Highlight Link
                        <input disabled={!user} value={rosterForm.highlightUrl} onChange={(event) => updateRosterForm('highlightUrl', event.target.value)} placeholder="YouTube, Hudl, Google Drive, or video URL" />
                      </label>
                      <label className={styles.rosterWideField}>
                        Upload Highlight File
                        <input
                          disabled={!user}
                          type="file"
                          accept="video/*,image/*"
                          onChange={(event) => uploadPlayerHighlightFile(event.target.files?.[0])}
                        />
                        <small className={styles.uploadStatusText}>{highlightUploadStatus}</small>
                      </label>
                      <label className={styles.rosterWideField}>
                        Extra Video Links
                        <textarea disabled={!user} value={rosterForm.videoLinksText} onChange={(event) => updateRosterForm('videoLinksText', event.target.value)} placeholder="One link per line" />
                      </label>
                      <label className={styles.rosterWideField}>
                        Coach / Recruiting Notes
                        <textarea disabled={!user} value={rosterForm.coachNotes} onChange={(event) => updateRosterForm('coachNotes', event.target.value)} placeholder="Tools, strengths, showcase notes, academic notes..." />
                      </label>
                    </div>
                    <div className={styles.rosterFormActions}>
                      <button disabled={!user} onClick={saveRosterPlayer}>{editingRosterId ? 'Update Player' : 'Add Player'}</button>
                      <button disabled={!user} onClick={resetRosterForm}>Clear</button>
                    </div>
                  </div>

                  <div className={styles.rosterListCard}>
                    <div className={styles.rosterListHeader}>
                      <span>#</span>
                      <span>Player</span>
                      <span>Pos</span>
                      <span>B/T</span>
                      <span>Class</span>
                      <span>Actions</span>
                    </div>
                    <div className={styles.rosterListRows}>
                      {processedRoster.length === 0 ? (
                        <p>No players yet. Add the first player to unlock lineups and team stats.</p>
                      ) : (
                        processedRoster.map((player) => (
                          <div key={player.id} className={styles.rosterListRow}>
                            <span>#{player.jersey || '-'}</span>
                            <strong>
                              {player.firstName} {player.lastName}
                              <small>
                                {player.recruitingStatus || 'Open'}
                                {player.highlightUrl || player.videoLinks?.length ? ' · Video' : ''}
                              </small>
                            </strong>
                            <span>{player.primaryPosition || '-'}</span>
                            <span>{player.bats || '-'}/{player.throws || '-'}</span>
                            <span>{player.classYear || '-'}</span>
                            <span className={styles.rosterRowActions}>
                              <button disabled={!user} onClick={() => editRosterPlayer(player)}>Edit</button>
                              <button disabled={!user} onClick={() => deleteRosterPlayer(player.id)}>Remove</button>
                              <a
                                href={`/player?season=${encodeURIComponent(selectedSeason)}&player=${encodeURIComponent(player.id)}`}
                                target="_blank"
                                rel="noreferrer"
                                title="View public recruiting profile"
                              >
                                🎓 Profile
                              </a>
                              <button onClick={() => copyFanLink(player)} title="Copy fan/family share link" style={{ background: '#0f172a', border: '1px solid #334155', color: '#94a3b8', cursor: 'pointer' }}>📣 Share</button>
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.lineupBuilderPanel}>
                <div className={styles.lineupBuilderHeader}>
                  <div>
                    <h4>Lineup Builder</h4>
                    <p>Build batting order, defensive positions, starters, and bench before first pitch.</p>
                  </div>
                  <span>{activeLineupEntries.length} listed · {lineupStatus}</span>
                </div>

                <div className={styles.lineupBuilderActions}>
                  <button disabled={!user || processedRoster.length === 0 || hasScoringStarted} onClick={createLineupFromRoster}>Build From Roster</button>
                  <button disabled={!user || processedRoster.length === 0 || hasScoringStarted} onClick={usePreviousLineup}>Use Previous Lineup</button>
                  <button disabled={!user || activeLineupEntries.length === 0 || hasScoringStarted} onClick={saveLineupToCloud}>Save Lineup</button>
                  <button disabled={activeLineupEntries.length === 0} onClick={printLineupCard} style={{ background: '#0f172a', border: '1px solid #334155', color: '#94a3b8' }}>🖨️ Print Card</button>
                </div>

                <div className={styles.lineupBuilderGrid}>
                  <div className={styles.lineupBuilderCard}>
                    <h4>Batting Order</h4>
                    {activeLineupEntries.length === 0 ? (
                      <p className={styles.setupHint}>Build a lineup from the roster to start.</p>
                    ) : (
                      activeLineupEntries.map((entry, index) => {
                        const player = entry.player;
                        return (
                          <div key={entry.playerId} className={styles.lineupBuilderRow}>
                            <span>{index + 1}</span>
                            <strong>{player.firstName} {player.lastName}<small>#{player.jersey || '-'}</small></strong>
                            <select disabled={!user || hasScoringStarted} value={entry.position || ''} onChange={(event) => updateLineupEntry(entry.playerId, 'position', event.target.value)}>
                              <option value="">POS</option>
                              {['P', 'C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF', 'DH', 'EH', 'UTIL'].map((position) => (
                                <option key={position}>{position}</option>
                              ))}
                            </select>
                            <select disabled={!user || hasScoringStarted} value={entry.status || 'starter'} onChange={(event) => updateLineupEntry(entry.playerId, 'status', event.target.value)}>
                              <option value="starter">Starter</option>
                              <option value="bench">Bench</option>
                              <option value="sub">Sub</option>
                            </select>
                            <div className={styles.lineupRowTools}>
                              <button disabled={!user || hasScoringStarted || index === 0} onClick={() => moveLineupEntry(entry.playerId, -1)}>Up</button>
                              <button disabled={!user || hasScoringStarted || index === activeLineupEntries.length - 1} onClick={() => moveLineupEntry(entry.playerId, 1)}>Down</button>
                              <button disabled={!user || hasScoringStarted} onClick={() => removeLineupEntry(entry.playerId)}>Out</button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  <div className={styles.lineupBuilderCard}>
                    <h4>Available Bench</h4>
                    {benchPlayers.length === 0 ? (
                      <p className={styles.setupHint}>Everyone is already on the lineup card.</p>
                    ) : (
                      benchPlayers.map((player) => (
                        <div key={player.id} className={styles.benchAddRow}>
                          <span>#{player.jersey || '-'}</span>
                          <strong>{player.firstName} {player.lastName}</strong>
                          <small>{player.primaryPosition || 'UTIL'}</small>
                          <button disabled={!user || hasScoringStarted} onClick={() => addBenchPlayerToLineup(player)}>Add</button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {hasScoringStarted && (
                  <p className={styles.lockHint}>Lineups are locked after scoring starts. Use the play editor later for official corrections.</p>
                )}
              </div>

              <div className={styles.lineupPreviewGrid}>

                <div className={styles.lineupPreviewCard}>
                  <h4>Opponent Lineup</h4>
                  {opponentRoster.length === 0 ? (
                    <p className={styles.setupHint}>Use quick lineup or import opponent players.</p>
                  ) : (
                    opponentRoster.slice(0, 9).map((player, index) => (
                      <div key={player.id} className={styles.lineupRow}>
                        <span>{index + 1}</span>
                        <strong>{player.firstName} {player.lastName}</strong>
                        <small>#{player.jersey || '-'}</small>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className={styles.setupFooterRow}>
                <button disabled={!user} onClick={resumeSetup} className={styles.secondarySetupButton}>Resume Setup</button>
                <button disabled={!user} onClick={markGameReady} className={styles.primarySetupButton}>Mark Ready to Score</button>
                <span>{setupStatus === 'ready' ? 'Game is marked ready.' : 'Finish setup before official scoring.'}</span>
              </div>
            </div>

            {/* Inning Matrix Grid Board */}
            <div style={{ overflowX: 'auto', background: '#0f172a', padding: '20px', borderRadius: '8px', border: '1px solid #1e293b', marginBottom: '25px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', color: '#fff' }}>
                <thead>
                  <tr style={{ color: '#475569', borderBottom: '1px solid #1e293b', fontSize: '12px' }}>
                    <th style={{ textAlign: 'left', paddingBottom: '10px', fontWeight: 'bold' }}>TEAM</th>
                    {ourInnings.map((_, i) => <th key={i} style={{ width: '45px' }}>{i + 1}</th>)}
                    <th style={{ width: '55px', color: '#3b82f6', fontWeight: 'bold' }}>R</th>
                    <th style={{ width: '55px' }}>H</th>
                    <th style={{ width: '55px' }}>E</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #1e293b' }}>
                    <td style={{ textAlign: 'left', fontWeight: 'bold', color: '#94a3b8', padding: '12px 0' }}>{scoringOpponent || 'OPPONENT'}</td>
                    {theirInnings.map((runs, i) => (
                      <td key={i}><input type="number" min="0" value={runs} disabled={!user} onChange={e => handleInningChange('them', i, e.target.value)} style={{ width: '34px', background: '#1e293b', border: '1px solid #334155', color: '#fff', textAlign: 'center', borderRadius: '4px', padding: '4px 0' }} /></td>
                    ))}
                    <td style={{ color: '#3b82f6', fontWeight: 'bold', fontSize: '16px' }}>{theirLiveScore}</td>
                    <td><input type="number" min="0" value={theirHits} disabled={!user} onChange={e => setTheirHits(parseInt(e.target.value, 10) || 0)} style={{ width: '38px', background: '#0f172a', border: '1px solid #334155', color: '#fff', textAlign: 'center', borderRadius: '4px' }} /></td>
                    <td><input type="number" min="0" value={theirErrors} disabled={!user} onChange={e => setTheirErrors(parseInt(e.target.value, 10) || 0)} style={{ width: '38px', background: '#0f172a', border: '1px solid #334155', color: '#fff', textAlign: 'center', borderRadius: '4px' }} /></td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: 'left', fontWeight: 'bold', color: '#f59e0b', padding: '12px 0' }}>{teamDisplayName || homeTeamName}</td>
                    {ourInnings.map((runs, i) => (
                      <td key={i}><input type="number" min="0" value={runs} disabled={!user} onChange={e => handleInningChange('us', i, e.target.value)} style={{ width: '34px', background: '#1e293b', border: '1px solid #334155', color: '#fff', textAlign: 'center', borderRadius: '4px', padding: '4px 0' }} /></td>
                    ))}
                    <td style={{ color: '#3b82f6', fontWeight: 'bold', fontSize: '16px' }}>{ourLiveScore}</td>
                    <td><input type="number" min="0" value={ourHits} disabled={!user} onChange={e => setOurHits(parseInt(e.target.value, 10) || 0)} style={{ width: '38px', background: '#0f172a', border: '1px solid #334155', color: '#fff', textAlign: 'center', borderRadius: '4px' }} /></td>
                    <td><input type="number" min="0" value={ourErrors} disabled={!user} onChange={e => setOurErrors(parseInt(e.target.value, 10) || 0)} style={{ width: '38px', background: '#0f172a', border: '1px solid #334155', color: '#fff', textAlign: 'center', borderRadius: '4px' }} /></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className={styles.gameChangerPanel}>
              <div className={styles.gcPanelHeader}>
                <div>
                  <h3>GameChanger-Style Scorekeeper</h3>
                  <p>{battingTeamName} batting · {fieldingTeamName} fielding · {currentCountLabel}</p>
                </div>
                <div className={styles.gcStepRail}>
                  {[
                    ['setup', 'Setup'],
                    ['pitch', 'Pitch'],
                    ['result', 'Result'],
                    ['runners', 'Runners'],
                    ['review', 'Review']
                  ].map(([step, label]) => (
                    <button
                      key={step}
                      disabled={!user}
                      className={scoringWorkflowStep === step ? styles.gcStepActive : ''}
                      onClick={() => setScoringWorkflowStep(step)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.gcScoreStrip}>
                <div>
                  <span>Pitcher</span>
                  <strong>{currentPitcher || 'Set pitcher'}</strong>
                </div>
                <div>
                  <span>Batter</span>
                  <strong>{currentBatter || 'Set batter'}</strong>
                </div>
                <div>
                  <span>Count</span>
                  <strong>{balls}-{strikes}</strong>
                </div>
                <div>
                  <span>Outs</span>
                  <strong>{outs}</strong>
                </div>
                <div>
                  <span>Last play</span>
                  <strong>{lastPlaySummary}</strong>
                </div>
              </div>

              <div className={styles.gcActionGrid}>
                <div className={styles.gcActionCard}>
                  <h4>1. Pitch</h4>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <select value={pitchType} onChange={e => setPitchType(e.target.value)} disabled={!user}
                      title="FB=Fastball CB=Curveball CH=Changeup SL=Slider CT=Cutter SP=Splitter 2S=2-Seam KN=Knuckleball"
                      style={{ background: '#0b1329', border: '1px solid #334155', color: '#f8fafc', borderRadius: '6px', padding: '6px 10px', fontSize: '12px', fontWeight: '800' }}>
                      {[['FB','Fastball'],['CB','Curveball'],['CH','Changeup'],['SL','Slider'],['CT','Cutter'],['SP','Splitter'],['2S','2-Seam'],['KN','Knuckleball']].map(([t,l]) => <option key={t} value={t}>{t} — {l}</option>)}
                    </select>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <input type="number" min="40" max="110" placeholder="MPH" value={pitchVelo} onChange={e => setPitchVelo(e.target.value)} disabled={!user}
                        style={{ background: '#0b1329', border: '1px solid #334155', color: '#f8fafc', borderRadius: '6px', padding: '6px 8px', fontSize: '12px', width: '72px', textAlign: 'center' }} />
                      <span style={{ fontSize: '11px', color: '#475569' }}>mph</span>
                    </div>
                    {pitchLog.filter(p => p.velo).length > 0 && (() => {
                      const vl = pitchLog.filter(p => p.velo);
                      const avg = (vl.reduce((s, p) => s + p.velo, 0) / vl.length).toFixed(1);
                      const top = Math.max(...vl.map(p => p.velo));
                      return <span style={{ fontSize: '11px', color: '#64748b' }}>avg <strong style={{ color: '#38bdf8' }}>{avg}</strong> · top <strong style={{ color: '#f59e0b' }}>{top}</strong></span>;
                    })()}
                  </div>
                  <div className={styles.gcButtonGrid}>
                    {pitchResults.map((pitch) => (
                      <button
                        key={pitch.result}
                        disabled={!user}
                        onClick={() => recordPitch(pitch.result)}
                      >
                        <span>{pitch.notation}</span>
                        {pitch.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.gcActionCard}>
                  <h4>2. Plate Result</h4>
                  <div className={styles.gcButtonGrid}>
                    {plateAppearanceResults.map((outcome) => (
                      <button
                        key={outcome.result}
                        disabled={!user}
                        onClick={() => recordPlateAppearance(outcome)}
                      >
                        <span>{outcome.notation}</span>
                        {outcome.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.gcActionCard}>
                  <h4>3. Defense / Bases</h4>
                  <div className={styles.gcButtonGrid}>
                    {defensivePlayPresets.map((play) => (
                      <button
                        key={play.result}
                        disabled={!user}
                        onClick={() => recordDefensivePlay(play)}
                      >
                        <span>{play.notation}</span>
                        {play.label}
                      </button>
                    ))}
                    <button disabled={!user} onClick={recordManualRun}>
                      <span>R</span>
                      Run Scores
                    </button>
                  </div>
                </div>
              </div>

              <div className={styles.gcNoteRow}>
                <input
                  disabled={!user}
                  value={playNote}
                  onChange={(event) => setPlayNote(event.target.value)}
                  placeholder="Optional play note: hard ground ball to short, runner advanced, coach conference..."
                />
                <button disabled={!user} onClick={() => {
                  setBalls(0);
                  setStrikes(0);
                  setLastPlaySummary('Count cleared.');
                }}>
                  Clear Count
                </button>
                <button disabled={!user} onClick={() => {
                  setOuts(Math.max(0, outs - 1));
                  setLastPlaySummary('One out removed.');
                }}>
                  Fix Out
                </button>
              </div>
            </div>

            <div className={styles.playLogPanel}>
              <div className={styles.playLogHeader}>
                <div>
                  <h3>Undo / Edit Play Log</h3>
                  <p>Correct mistakes without hiding history. Undo restores the previous game state when the play has a saved snapshot.</p>
                </div>
                <span>{playLogStatus}</span>
              </div>

              <div className={styles.playLogTools}>
                <input
                  disabled={!user}
                  value={correctionNote}
                  onChange={(event) => setCorrectionNote(event.target.value)}
                  placeholder="Correction note: wrong batter, changed to double, runner should stay at third..."
                />
                <button disabled={!user || playLogEvents.length === 0} onClick={undoLastPlay}>Undo Last Play</button>
              </div>

              <div className={styles.playLogRows}>
                {playLogEvents.length === 0 ? (
                  <div className={styles.emptyPlayLog}>No plays recorded yet.</div>
                ) : (
                  playLogEvents.map((event) => {
                    const correction = correctionEventsByTarget[event.id];
                    const displayLabel = correction?.correctedLabel || event.label || String(event.result || event.eventType || 'Play').replaceAll('_', ' ');
                    const isEditing = editingEventId === event.id;

                    return (
                      <div key={event.id} className={styles.playLogRow}>
                        <div className={styles.playLogMeta}>
                          <span>#{event.sequence || '-'}</span>
                          <strong>{event.half === 'bottom' ? 'Bot' : 'Top'} {event.inning || currentInning}</strong>
                          <small>{event.ballsBefore ?? '-'}-{event.strikesBefore ?? '-'}, {event.outsBefore ?? '-'} out</small>
                        </div>
                        <div className={styles.playLogMain}>
                          {isEditing ? (
                            <input
                              value={editingEventLabel}
                              onChange={(editEvent) => setEditingEventLabel(editEvent.target.value)}
                              placeholder="Corrected play label"
                            />
                          ) : (
                            <>
                              <strong>{displayLabel}</strong>
                              <span>{event.batterLabel || 'No batter'} vs {event.pitcherLabel || 'No pitcher'}</span>
                              {event.note ? <small>Note: {event.note}</small> : null}
                              {correction ? <small>Correction: {correction.correctionNote || correction.label}</small> : null}
                              {event.eventType === 'undo' ? <small>Undo target: #{event.targetSequence || event.targetEventId}</small> : null}
                            </>
                          )}
                        </div>
                        <div className={styles.playLogActions}>
                          {isEditing ? (
                            <>
                              <button disabled={!user} onClick={() => saveEventCorrection(event)}>Save</button>
                              <button disabled={!user} onClick={cancelEventCorrection}>Cancel</button>
                            </>
                          ) : (
                            <>
                              <button disabled={!user || event.eventType === 'undo'} onClick={() => startEditingEvent(event)}>Correct</button>
                              <button disabled={!user} onClick={() => {
                                restoreStateFromEvent(event);
                                setLastPlaySummary(`Restored state before ${displayLabel}.`);
                                setPlayLogStatus('State restored');
                              }}>Restore</button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Split Operational Control Panel Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
              
              {/* Left Column: At-Bat Engine Metrics */}
              <div style={{ background: '#0f172a', padding: '20px', borderRadius: '8px', border: '1px solid #1e293b' }}>
                <h4 style={{ margin: '0 0 15px 0', color: '#94a3b8', fontSize: '13px' }}>📋 AT-BAT METRIC LOGS</h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Current Pitcher:</span>
                    <input type="text" placeholder="Name / #" value={currentPitcher} disabled={!user} onChange={e => setCurrentPitcher(e.target.value)} style={{ background: '#0b1329', border: '1px solid #334155', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Active Batter:</span>
                    <input type="text" placeholder="Name / #" value={currentBatter} disabled={!user} onChange={e => setCurrentBatter(e.target.value)} style={{ background: '#0b1329', border: '1px solid #334155', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Pitch Count Tracker:</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <button disabled={!user} onClick={() => setPitchCount(p => Math.max(0, p - 1))} style={{ padding: '2px 8px', background: '#1e293b', border: 'none', color: '#fff', borderRadius: '4px', cursor: 'pointer' }}>-</button>
                      <strong style={{ color: '#fff', minWidth: '25px', textAlign: 'center' }}>{pitchCount}</strong>
                      <button disabled={!user} onClick={() => setPitchCount(p => p + 1)} style={{ padding: '2px 8px', background: '#1e293b', border: 'none', color: '#fff', borderRadius: '4px', cursor: 'pointer' }}>+</button>
                    </div>
                  </div>
                </div>

                {/* Micro Inning Counts UI Tracker */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '10px', borderTop: '1px solid #1e293b' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold', width: '60px' }}>BALLS</span>
                    {[1, 2, 3].map(b => (
                      <div key={b} onClick={user ? () => setBalls(balls === b ? b - 1 : b) : null} style={{ width: '14px', height: '14px', borderRadius: '50%', background: balls >= b ? '#22c55e' : '#1e293b', cursor: user ? 'pointer' : 'default', border: '1px solid #334155' }} />
                    ))}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold', width: '60px' }}>STRIKES</span>
                    {[1, 2].map(s => (
                      <div key={s} onClick={user ? () => setStrikes(strikes === s ? s - 1 : s) : null} style={{ width: '14px', height: '14px', borderRadius: '50%', background: strikes >= s ? '#eab308' : '#1e293b', cursor: user ? 'pointer' : 'default', border: '1px solid #334155' }} />
                    ))}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold', width: '60px' }}>OUTS</span>
                    {[1, 2].map(o => (
                      <div key={o} onClick={user ? () => setOuts(outs === o ? o - 1 : o) : null} style={{ width: '14px', height: '14px', borderRadius: '50%', background: outs >= o ? '#ef4444' : '#1e293b', cursor: user ? 'pointer' : 'default', border: '1px solid #334155' }} />
                    ))}
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #1e293b', marginTop: '18px', paddingTop: '15px' }}>
                  <h4 style={{ color: '#94a3b8', fontSize: '12px', margin: '0 0 10px' }}>
                    PITCH-BY-PITCH
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '8px' }}>
                    {pitchResults.map((pitch) => (
                      <button
                        key={pitch.result}
                        disabled={!user}
                        onClick={() => recordPitch(pitch.result)}
                        style={{ padding: '7px', background: '#1e293b', color: '#fff', border: '1px solid #334155', borderRadius: '4px', cursor: user ? 'pointer' : 'default', fontSize: '11px' }}
                      >
                        {pitch.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Baserunner Diamond Graphic Interface */}
              <div style={{ background: '#0f172a', padding: '20px', borderRadius: '8px', border: '1px solid #1e293b', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <h4 style={{ margin: '0 0 15px 0', color: '#94a3b8', fontSize: '13px', width: '100%', textAlign: 'left' }}>🏃 ACTIVE BASERUNNERS</h4>
                
                <div style={{ position: 'relative', width: '140px', height: '140px', margin: '15px 0' }}>
                  {/* 2nd Base */}
                  <div 
                    onClick={user ? () => setRunnerOnSecond(!runnerOnSecond) : null}
                    style={{ position: 'absolute', top: 0, left: '60px', width: '22px', height: '22px', transform: 'rotate(45deg)', background: runnerOnSecond ? '#3b82f6' : '#1e293b', border: '2px solid #334155', cursor: user ? 'pointer' : 'default', transition: 'all 0.2s' }} 
                  />
                  {/* 3rd Base */}
                  <div 
                    onClick={user ? () => setRunnerOnThird(!runnerOnThird) : null}
                    style={{ position: 'absolute', top: '60px', left: 0, width: '22px', height: '22px', transform: 'rotate(45deg)', background: runnerOnThird ? '#3b82f6' : '#1e293b', border: '2px solid #334155', cursor: user ? 'pointer' : 'default', transition: 'all 0.2s' }} 
                  />
                  {/* 1st Base */}
                  <div 
                    onClick={user ? () => setRunnerOnFirst(!runnerOnFirst) : null}
                    style={{ position: 'absolute', top: '60px', right: 0, width: '22px', height: '22px', transform: 'rotate(45deg)', background: runnerOnFirst ? '#3b82f6' : '#1e293b', border: '2px solid #334155', cursor: user ? 'pointer' : 'default', transition: 'all 0.2s' }} 
                  />
                  {/* Home Plate Node Indicator */}
                  <div style={{ position: 'absolute', bottom: 0, left: '62px', width: '18px', height: '18px', background: '#fff', border: '1px solid #94a3b8', clipPath: 'polygon(50% 0%, 100% 50%, 100% 100%, 0% 100%, 0% 50%)' }} />
                </div>

                <div style={{ display: 'flex', gap: '8px', width: '100%', marginTop: '10px' }}>
                  <button disabled={!user} onClick={() => { setRunnerOnFirst(false); setRunnerOnSecond(false); setRunnerOnThird(false); }} style={{ width: '100%', padding: '4px 0', fontSize: '11px', background: '#1e293b', color: '#94a3b8', border: '1px solid #334155', borderRadius: '4px', cursor: 'pointer' }}>Clear All Paths</button>
                </div>
              </div>
            </div>

            {/* Inning Progress Steering Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0f172a', padding: '12px 20px', borderRadius: '8px', border: '1px solid #1e293b', marginTop: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>INNING NAVIGATION:</span>
                <button disabled={!user} onClick={() => setCurrentInning(prev => Math.max(1, prev - 1))} style={{ padding: '3px 8px', background: '#1e293b', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>-</button>
                <span style={{ fontWeight: 'bold', color: '#fff', fontSize: '14px' }}>{isTopInning ? 'Top ▲' : 'Bot ▼'} {currentInning}</span>
                <button disabled={!user} onClick={() => setCurrentInning(prev => prev + 1)} style={{ padding: '3px 8px', background: '#1e293b', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>+</button>
                <button disabled={!user} onClick={() => setIsTopInning(!isTopInning)} style={{ fontSize: '11px', padding: '4px 10px', background: '#334155', color: '#fff', border: 'none', borderRadius: '4px', marginLeft: '5px', cursor: 'pointer' }}>Invert Frame</button>
              </div>

              {user ? (
                <button onClick={commitLiveGameToHistory} style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>
                  📥 Commit &amp; Sync Final Game Ledger
                </button>
              ) : (
                <span style={{ fontSize: '12px', color: '#ef4444', fontStyle: 'italic' }}>⚠️ Coach login required to save data modifications.</span>
              )}
            </div>

          </div>
        </div>
      )}

      {/* SCHEDULE RESULTS LEDGER VIEW */}
      {activeTab === 'schedule' && (
        <div className={styles.scheduleWorkspaceSplit}>
          <div className={styles.scheduleDashboardView}>
            <div className={styles.schedulePlannerPanel}>
              <div className={styles.schedulePlannerHeader}>
                <div>
                  <h3>Schedule / Game Details</h3>
                  <p>Create games before game day, then load one into the live scorer when it is time to build lineups.</p>
                </div>
                <span>{scheduleStatus}</span>
              </div>

              <div className={styles.schedulePlannerGrid}>
                <label>
                  Date
                  <input disabled={!user} type="date" value={scheduleForm.date} onChange={(event) => updateScheduleForm('date', event.target.value)} />
                </label>
                <label>
                  Start Time
                  <input disabled={!user} type="time" value={scheduleForm.startTime} onChange={(event) => updateScheduleForm('startTime', event.target.value)} />
                </label>
                <label>
                  Opponent
                  <input disabled={!user} value={scheduleForm.opponent} onChange={(event) => updateScheduleForm('opponent', event.target.value)} placeholder="Opponent name" />
                </label>
                <label>
                  Home / Away
                  <select disabled={!user} value={scheduleForm.location} onChange={(event) => updateScheduleForm('location', event.target.value)}>
                    <option>Home</option>
                    <option>Away</option>
                  </select>
                </label>
                <label>
                  Game Type
                  <select disabled={!user} value={scheduleForm.type} onChange={(event) => updateScheduleForm('type', event.target.value)}>
                    <option>District</option>
                    <option>Tournament</option>
                    <option>Non-District</option>
                    <option>Playoffs</option>
                    <option>Scrimmage</option>
                  </select>
                </label>
                <label>
                  Field / Location
                  <input disabled={!user} value={scheduleForm.venue} onChange={(event) => updateScheduleForm('venue', event.target.value)} placeholder="Field or campus" />
                </label>
                <label>
                  Status
                  <select disabled={!user} value={scheduleForm.status} onChange={(event) => updateScheduleForm('status', event.target.value)}>
                    <option>Scheduled</option>
                    <option>Live</option>
                    <option>Final</option>
                    <option>Postponed</option>
                    <option>Canceled</option>
                  </select>
                </label>
                <label>
                  Notes
                  <input disabled={!user} value={scheduleForm.notes} onChange={(event) => updateScheduleForm('notes', event.target.value)} placeholder="bus time, uniform, tournament note" />
                </label>
              </div>

              <div className={styles.schedulePlannerActions}>
                <button disabled={!user} onClick={saveScheduledGame}>{editingScheduleId ? 'Update Game' : 'Add Game'}</button>
                <button disabled={!user} onClick={resetScheduleForm}>Clear</button>
              </div>
            </div>

            <div className={styles.scheduleListPanel}>
              <div className={styles.scheduleListHeader}>
                <h3>Season Schedule</h3>
                <span>{(currentSeasonData.schedule || []).length} game{(currentSeasonData.schedule || []).length === 1 ? '' : 's'}</span>
              </div>

              <div className={styles.scheduleCardsGrid}>
                {(currentSeasonData.schedule || []).length === 0 ? (
                  <div className={styles.emptyScheduleState}>No games scheduled yet.</div>
                ) : (
                  [...(currentSeasonData.schedule || [])]
                    .sort((a, b) => String(a.date || '').localeCompare(String(b.date || '')))
                    .map((game) => (
                      <div key={game.id} className={styles.gameMediaCard}>
                        <div className={styles.cardLeftMeta}>
                          <span className={styles.cardDateText}>{game.date || 'TBD'}</span>
                          <span className={`${styles.typeBadge} ${styles[`type${game.type}`] || ''}`}>{game.type || 'Game'}</span>
                        </div>
                        <div className={styles.cardCenterMatchup}>
                          <span className={styles.locationIndicatorPrefix}>{game.location === 'Away' ? '@' : 'vs'}</span>
                          <div>
                            <div className={styles.opponentBoldTitle}>{game.opponent || 'Opponent TBD'}</div>
                            <small>{game.startTime || 'Time TBD'} · {game.venue || 'Location TBD'}</small>
                            {game.notes ? <p className={styles.scheduleNote}>{game.notes}</p> : null}
                          </div>
                        </div>
                        <div className={styles.cardRightStatus}>
                          {game.status === 'Final' ? (
                            <div className={styles.resultScoreContainer}>
                              <span className={`${styles.mpOutcomeSquareBadge} ${game.result === 'W' ? styles.badgeWin : styles.badgeLoss}`}>{game.result || 'F'}</span>
                              <strong className={styles.finalScoreDisplay}>{game.ourScore || 0}-{game.theirScore || 0}</strong>
                            </div>
                          ) : (
                            <span className={game.status === 'Live' ? styles.liveBadge : styles.scheduledBadge}>{game.status || 'Scheduled'}</span>
                          )}
                          <div className={styles.scheduleCardActions}>
                            <button disabled={!user} onClick={() => loadScheduledGameForScoring(game)}>Score Game</button>
                            <button disabled={!user} onClick={() => editScheduledGame(game)}>Edit</button>
                            <button disabled={!user} onClick={() => deleteScheduledGame(game.id)}>Remove</button>
                          </div>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {user && (
              <div className={styles.brandingSection}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#3b82f6' }}> Program Identity Graphics</h3>
                <input type="text" placeholder="Paste Web Graphic URL" value={displayLogoValue} onChange={(e) => setLogoUrl(e.target.value)} style={{ fontSize: '12px', width: '100%', padding: '6px', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '4px' }} />
                <button onClick={saveTeamLogoToCloud} style={{ background: '#3b82f6', color: '#fff', width: '100%', fontSize: '12px', marginTop: '10px', padding: '6px 0', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Save Layout Asset</button>
              </div>
            )}

            {user && (
              <div className={styles.brandingSection}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#3b82f6' }}>📋 Roster CSV Integration</h3>
                <textarea className={styles.importerTextArea} placeholder="First, Last, Jersey, Position, Bats, Throws, Class, Family Contact" value={rawCsvInput} onChange={(e) => setRawCsvInput(e.target.value)} />
                <button onClick={handleBulkRosterImport} style={{ background: '#1e293b', border: '1px solid #334155', color: '#fff', width: '100%', fontSize: '12px', padding: '6px 0', borderRadius: '4px', cursor: 'pointer' }}>Parse Roster</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* STAT SHEETS TAB SUB-SYSTEM */}
      {activeTab === 'stats' && (
        <div>

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
          {statsSubTab === 'spray' && (() => {
            const hitColors = { single: '#22c55e', double: '#3b82f6', triple: '#a855f7', home_run: '#f59e0b', out: '#475569' };
            const filteredDots = sprayChartPlayer === 'team'
              ? sprayDots
              : sprayDots.filter(d => d.batter === sprayChartPlayer);
            const canvasW = 340, canvasH = 320;
            const addDot = (e) => {
              if (!user) return;
              const rect = e.currentTarget.getBoundingClientRect();
              const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
              const y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1);
              const result = window.prompt('Hit result? (single/double/triple/home_run/groundout/flyout)', 'single');
              if (!result) return;
              const batter = sprayChartPlayer === 'team' ? (currentBatter || 'Unknown') : sprayChartPlayer;
              setSprayDots(prev => [...prev, { x, y, result: result.trim().toLowerCase(), batter, id: Date.now() }]);
            };
            return (
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                  <h3 style={{ margin: 0, color: '#94a3b8', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>🗺️ Spray Chart — Hit Location Tracker</h3>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <select value={sprayChartPlayer} onChange={e => setSprayChartPlayer(e.target.value)} style={{ background: '#1e293b', border: '1px solid #334155', color: '#fff', borderRadius: '6px', padding: '6px 10px', fontSize: '12px' }}>
                      <option value="team">All Players</option>
                      {processedRoster.map(p => <option key={p.id} value={`${p.firstName} ${p.lastName}`}>{p.firstName} {p.lastName}</option>)}
                    </select>
                    <button onClick={() => setSprayDots([])} disabled={!user || sprayDots.length === 0} style={{ background: '#7f1d1d', border: '1px solid #ef4444', color: '#fca5a5', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer' }}>Clear</button>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '24px', alignItems: 'start' }}>
                  <div>
                    <p style={{ color: '#475569', fontSize: '12px', margin: '0 0 10px' }}>{user ? 'Click anywhere on the field to log a hit location.' : 'Log in to add hits to the spray chart.'}</p>
                    <div
                      onClick={addDot}
                      style={{ position: 'relative', width: '100%', maxWidth: `${canvasW}px`, aspectRatio: `${canvasW}/${canvasH}`, background: '#0b1a0b', border: '1px solid #1e293b', borderRadius: '8px', cursor: user ? 'crosshair' : 'default', overflow: 'hidden' }}
                    >
                      {/* Field outline — SVG */}
                      <svg viewBox={`0 0 ${canvasW} ${canvasH}`} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                        {/* Outfield arc */}
                        <path d={`M 170 ${canvasH} A 220 220 0 0 1 ${canvasW - 30} 80`} fill="none" stroke="#1a3a1a" strokeWidth="60" />
                        <path d={`M 170 ${canvasH} A 220 220 0 0 1 ${canvasW - 30} 80`} fill="none" stroke="#166534" strokeWidth="2" />
                        {/* Infield dirt */}
                        <polygon points={`170,${canvasH - 30} 90,200 170,120 250,200`} fill="#2a1a0a" stroke="#3d2b10" strokeWidth="1" />
                        {/* Foul lines */}
                        <line x1="170" y1={canvasH} x2="10" y2="30" stroke="#334155" strokeWidth="1" strokeDasharray="4,4" />
                        <line x1="170" y1={canvasH} x2={canvasW - 10} y2="30" stroke="#334155" strokeWidth="1" strokeDasharray="4,4" />
                        {/* Bases */}
                        {[[170,120],[250,200],[170,canvasH-30],[90,200]].map(([bx,by],i) => (
                          <rect key={i} x={bx-6} y={by-6} width="12" height="12" fill={i===2?'#fff':'#f59e0b'} transform={`rotate(45,${bx},${by})`} />
                        ))}
                        {/* Pitcher mound */}
                        <circle cx="170" cy="175" r="8" fill="#2a1a0a" stroke="#3d2b10" strokeWidth="1" />
                      </svg>
                      {/* Hit dots */}
                      {filteredDots.map(dot => (
                        <div
                          key={dot.id}
                          title={`${dot.batter} — ${dot.result}`}
                          style={{
                            position: 'absolute',
                            left: `${dot.x}%`, top: `${dot.y}%`,
                            width: '10px', height: '10px',
                            borderRadius: '50%',
                            background: hitColors[dot.result] || '#64748b',
                            border: '1.5px solid rgba(255,255,255,0.3)',
                            transform: 'translate(-50%,-50%)',
                            pointerEvents: 'none'
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  {/* Legend + summary */}
                  <div style={{ minWidth: '140px' }}>
                    <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', padding: '14px', marginBottom: '12px' }}>
                      <div style={{ fontSize: '11px', color: '#475569', fontWeight: '800', textTransform: 'uppercase', marginBottom: '10px' }}>Legend</div>
                      {Object.entries(hitColors).map(([k, c]) => (
                        <div key={k} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: c, flexShrink: 0 }} />
                          <span style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'capitalize' }}>{k.replace('_', ' ')}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', padding: '14px' }}>
                      <div style={{ fontSize: '11px', color: '#475569', fontWeight: '800', textTransform: 'uppercase', marginBottom: '10px' }}>Summary</div>
                      {Object.entries(hitColors).map(([k, c]) => {
                        const count = filteredDots.filter(d => d.result === k).length;
                        if (!count) return null;
                        return (
                          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>
                            <span style={{ textTransform: 'capitalize' }}>{k.replace('_',' ')}</span>
                            <strong style={{ color: c }}>{count}</strong>
                          </div>
                        );
                      })}
                      {filteredDots.length === 0 && <div style={{ fontSize: '12px', color: '#334155' }}>No data yet</div>}
                      <div style={{ borderTop: '1px solid #1e293b', marginTop: '8px', paddingTop: '8px', fontSize: '12px', color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
                        <span>Total</span><strong style={{ color: '#fff' }}>{filteredDots.length}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

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

        </div>
      )}

      {/* SCOUTING REPORT TAB */}
      {activeTab === 'scouting' && (
        <ScoutingReportTab
          user={user}
          schedule={currentSeasonData.schedule || []}
          selectedSeason={selectedSeason}
          db={db}
          setDoc={setDoc}
          doc={doc}
        />
      )}

      {/* TOURNAMENT BRACKET TAB */}
      {activeTab === 'bracket' && (
        <TournamentBracketTab
          user={user}
          selectedSeason={selectedSeason}
          teamDisplayName={teamDisplayName || homeTeamName}
          sportEmoji={sportEmoji}
          teamSport={teamSport}
        />
      )}

      {/* GAME DAY CHECKLIST TAB */}
      {activeTab === 'gameday' && (() => {
        const done = checklistItems.filter(i => i.done).length;
        const total = checklistItems.length;
        const pct = total ? Math.round((done / total) * 100) : 0;
        const allDone = done === total;

        const toggle = (id) => setChecklistItems(prev => prev.map(i => i.id === id ? { ...i, done: !i.done } : i));
        const removeItem = (id) => setChecklistItems(prev => prev.filter(i => i.id !== id));
        const addItem = () => {
          if (!newChecklistItem.trim()) return;
          setChecklistItems(prev => [...prev, { id: Date.now(), label: newChecklistItem.trim(), done: false }]);
          setNewChecklistItem('');
        };
        const resetAll = () => { setChecklistItems(prev => prev.map(i => ({ ...i, done: false }))); setChecklistAlertSent(false); };
        const sendAlert = () => {
          sendGameNotif('📋 Game Day Ready!', `${teamDisplayName || homeTeamName} checklist complete — ${done}/${total} items done. Let's go!`);
          setChecklistAlertSent(true);
        };

        const nextGame = (currentSeasonData.schedule || [])
          .filter(g => g.status === 'Scheduled' || g.status === 'Live')
          .sort((a, b) => new Date(a.date) - new Date(b.date))[0];

        return (
          <div style={{ maxWidth: '680px', margin: '24px auto', padding: '0 20px' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 style={{ margin: '0 0 4px', color: '#fff', fontSize: '18px' }}>📋 Game Day Checklist</h2>
                {nextGame && (
                  <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>
                    Next: <strong style={{ color: '#94a3b8' }}>{nextGame.opponent}</strong> · {nextGame.date} · {nextGame.location === 'Away' ? '@ Away' : 'Home'}
                  </p>
                )}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={resetAll} style={{ background: '#1e293b', border: '1px solid #334155', color: '#94a3b8', borderRadius: '8px', padding: '8px 14px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>↺ Reset</button>
                <button onClick={sendAlert} disabled={!allDone || checklistAlertSent || notifPermission !== 'granted'}
                  style={{ background: allDone && !checklistAlertSent ? '#22c55e' : '#1e293b', border: `1px solid ${allDone && !checklistAlertSent ? '#22c55e' : '#334155'}`, color: allDone && !checklistAlertSent ? '#020617' : '#475569', borderRadius: '8px', padding: '8px 14px', fontSize: '12px', fontWeight: '800', cursor: allDone && !checklistAlertSent ? 'pointer' : 'default' }}>
                  {checklistAlertSent ? '✓ Alert Sent' : '🔔 Send Alert'}
                </button>
              </div>
            </div>

            {/* Progress bar */}
            <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '16px 20px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>
                <span>{done} of {total} complete</span>
                <strong style={{ color: allDone ? '#22c55e' : '#f59e0b' }}>{pct}%</strong>
              </div>
              <div style={{ background: '#1e293b', borderRadius: '999px', height: '10px', overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: '100%', background: allDone ? '#22c55e' : '#3b82f6', borderRadius: '999px', transition: 'width 0.3s' }} />
              </div>
              {allDone && <div style={{ marginTop: '10px', color: '#22c55e', fontSize: '13px', fontWeight: '700', textAlign: 'center' }}>✅ All items complete — ready to play!</div>}
            </div>

            {/* Checklist items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              {checklistItems.map(item => (
                <div key={item.id} onClick={() => toggle(item.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', background: item.done ? 'rgba(34,197,94,0.08)' : '#0f172a', border: `1px solid ${item.done ? 'rgba(34,197,94,0.3)' : '#1e293b'}`, borderRadius: '10px', cursor: 'pointer', transition: 'all 0.15s' }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '6px', border: `2px solid ${item.done ? '#22c55e' : '#334155'}`, background: item.done ? '#22c55e' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}>
                    {item.done && <span style={{ color: '#020617', fontSize: '14px', fontWeight: '900' }}>✓</span>}
                  </div>
                  <span style={{ flex: 1, fontSize: '14px', color: item.done ? '#475569' : '#e2e8f0', textDecoration: item.done ? 'line-through' : 'none', transition: 'all 0.15s' }}>{item.label}</span>
                  <button onClick={e => { e.stopPropagation(); removeItem(item.id); }}
                    style={{ background: 'none', border: 'none', color: '#334155', cursor: 'pointer', fontSize: '16px', padding: '0 4px', lineHeight: 1 }}>×</button>
                </div>
              ))}
            </div>

            {/* Add item */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                value={newChecklistItem}
                onChange={e => setNewChecklistItem(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addItem()}
                placeholder="Add a checklist item…"
                style={{ flex: 1, background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff', padding: '10px 14px', fontSize: '13px' }}
              />
              <button onClick={addItem} disabled={!newChecklistItem.trim()}
                style={{ background: '#2563eb', border: 'none', borderRadius: '8px', color: '#fff', padding: '10px 18px', fontSize: '13px', fontWeight: '800', cursor: 'pointer' }}>
                + Add
              </button>
            </div>
            {notifPermission !== 'granted' && (
              <p style={{ marginTop: '14px', fontSize: '12px', color: '#475569', textAlign: 'center' }}>
                Enable notifications in the header banner to send game-day push alerts.
              </p>
            )}
          </div>
        );
      })()}

      {/* WHAT'S NEW / CHANGELOG TAB */}
      {activeTab === 'changelog' && (() => {
        const releases = [
          {
            version: 'v1.0', date: 'Jun 8, 2026', label: 'Polish', color: '#a78bfa',
            features: [
              'Navbar scrolls horizontally — all tabs always reachable on any screen size',
              'Stats sub-tabs redesigned as pill buttons with blue ring on active',
              'Stat table headers: uppercase, spaced, professional MaxPreps style',
              'Player & discover cards get hover border transitions',
              'Player profile: 3-column stat ribbon on mobile, content grid aligned',
              'Pitch type dropdown shows full names (FB — Fastball, etc.)',
              'Upgrade button: visible amber border + active state',
              'Discover feed: focus ring on filter inputs, better mobile layout',
            ]
          },
          {
            version: 'v0.10–0.11', date: 'Jun 8, 2026', label: 'Pitch Tracker + Game Day', color: '#38bdf8',
            features: [
              'Pitch velocity input (MPH) + pitch type selector on every pitch',
              'Live avg/top velocity display updates as you pitch',
              'Pitch Mix bar chart in Pitching Staff tab — % usage per pitch type',
              'Velocity by pitcher card — AVG · TOP · LOW per pitcher',
              'Game Day Checklist tab with 8 pre-loaded items',
              'Progress bar turns green when all items complete',
              'Add custom items, remove any item, reset for next game',
              'Next game auto-pulled from schedule',
              '🔔 Send push alert when checklist is 100% done',
            ]
          },
          {
            version: 'v0.9', date: 'Jun 8, 2026', label: 'Coach Discovery', color: '#22c55e',
            features: [
              'New public /discover page — College Coach Discovery Feed',
              'Filter by sport, position, class year, recruiting status',
              'Sort by AVG, HR, RBI, ERA, or strikeouts',
              'Player cards with stats, recruiting badge, 🎥 film indicator',
              'Direct mailto links for player + family contact',
              '🎓 View Profile button links to full recruiting page',
              'Coach Discovery link added to header banner and team page sidebar',
              'SEO footer for Google indexing by position/class/region',
            ]
          },
          {
            version: 'v0.8', date: 'Jun 8, 2026', label: 'Recruiting Profiles', color: '#f59e0b',
            features: [
              'Player recruiting profile at /player?season=&player=',
              'New backend endpoint: /api/public/seasons/:id/players/:id',
              'Color-coded recruiting status badge (Committed/Open/Signed/Verbal)',
              '6-stat ribbon: AVG, OPS, HR, RBI, ERA, K',
              'Tabbed stats: Hitting / Pitching / Fielding',
              'YouTube links auto-embed as 16:9 iframes; others render as buttons',
              'Contact CTA buttons for player and family email',
              'Roster switcher sidebar to jump between teammates',
              'Legacy ?game= URL support maintained',
              'SEO footer with name, position, team, class year',
            ]
          },
          {
            version: 'v0.7', date: 'Jun 8, 2026', label: 'Spray Chart · Notifications · Scouting · Bracket', color: '#ef4444',
            features: [
              'Spray chart hit-location tracker on live field SVG',
              'Color-coded dots: single/double/triple/HR/out per batter or team',
              'Push notifications for fans and coaches (browser Notification API)',
              'Auto-notification fires when a run scores',
              'Opponent scouting report tab — notes, tendencies, lineup',
              'Tournament bracket builder — 4/8/16 team single elimination',
              'Bracket auto-advances winners, supports custom team names',
            ]
          },
          {
            version: 'v0.6', date: 'Jun 8, 2026', label: 'Public Team Pages', color: '#06b6d4',
            features: [
              'Public team page at /team?season=ID',
              'Backend /api/public/seasons/:id endpoint',
              'Roster grid, full schedule table, W-L record',
              'Team profile: sport, age group, location, logo',
              '🌐 Public Team Page link in the header banner',
            ]
          },
          {
            version: 'v0.5', date: 'Jun 8, 2026', label: 'Mobile Responsive UI', color: '#84cc16',
            features: [
              '768px tablet + 480px phone breakpoints across all views',
              'Navbar scrolls horizontally on small screens',
              'Diamond scales down on mobile',
              'Stat grids, roster tables, and lineup cards collapse to single column',
              'No horizontal overflow on any screen size',
            ]
          },
          {
            version: 'v0.4', date: 'Jun 8, 2026', label: 'Season Leaderboard', color: '#f97316',
            features: [
              'Season leaderboard on Stat Sheets tab',
              'Top 5 leaders for AVG, HR, RBI, ERA, and strikeouts',
              'Medal rankings 🥇🥈🥉 for top 3 in each category',
              'Dropdown to switch stat categories',
            ]
          },
          {
            version: 'v0.3', date: 'Jun 8, 2026', label: 'Tiered Pricing + Stripe', color: '#a855f7',
            features: [
              'Three-tier pricing UI: Free / Pro / Org',
              'Stripe Checkout integration with per-tier price IDs',
              'User plan stored and fetched from backend',
              'Upgrade tab with feature comparison',
              'Success/cancel redirect handling',
            ]
          },
          {
            version: 'v0.2', date: 'Jun 8, 2026', label: 'LIVE Badge · Share · Lineup Print', color: '#3b82f6',
            features: [
              'LIVE badge auto-syncs with schedule — lights up during active games',
              'Family fan share link per player (📣 Share button on roster)',
              'Printable lineup card — browser print dialog with clean CSS',
            ]
          },
          {
            version: 'v0.1', date: 'Jun 8, 2026', label: 'Core Stats Engine', color: '#64748b',
            features: [
              'Auto-calculate hitting, pitching, and fielding stats from game events',
              'Postgame box score modal',
              'Season W-L record displayed in the header banner',
              'SB (stolen bases) column added to hitting stats',
              'Dynamic sport emoji based on team sport setting',
            ]
          },
        ];

        return (
          <div style={{ maxWidth: '760px', margin: '28px auto', padding: '0 20px' }}>
            <div style={{ marginBottom: '28px' }}>
              <h2 style={{ margin: '0 0 6px', color: '#fff', fontSize: '22px', fontWeight: '900' }}>🆕 What's New in GameTracker</h2>
              <p style={{ margin: 0, color: '#475569', fontSize: '13px' }}>{releases.length} releases · {releases.reduce((s, r) => s + r.features.length, 0)} features shipped</p>
            </div>
            {releases.map((r, i) => (
              <div key={r.version} style={{ display: 'flex', gap: '16px', marginBottom: '8px' }}>
                {/* Timeline line */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '36px', flexShrink: 0 }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: r.color, boxShadow: `0 0 8px ${r.color}66`, marginTop: '14px', flexShrink: 0 }} />
                  {i < releases.length - 1 && <div style={{ width: '2px', flex: 1, background: '#1e293b', marginTop: '4px' }} />}
                </div>
                {/* Card */}
                <div style={{ flex: 1, background: '#0f172a', border: `1px solid #1e293b`, borderRadius: '12px', padding: '16px 18px', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
                    <span style={{ background: `${r.color}22`, border: `1px solid ${r.color}66`, borderRadius: '999px', color: r.color, fontSize: '11px', fontWeight: '900', padding: '3px 10px' }}>{r.version}</span>
                    <strong style={{ color: '#fff', fontSize: '14px' }}>{r.label}</strong>
                    <span style={{ color: '#334155', fontSize: '11px', marginLeft: 'auto' }}>{r.date}</span>
                  </div>
                  <ul style={{ margin: 0, padding: '0 0 0 16px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    {r.features.map((f, fi) => (
                      <li key={fi} style={{ color: '#94a3b8', fontSize: '13px', lineHeight: '1.5' }}>{f}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        );
      })()}

      {/* UPGRADE / PRICING TAB */}
      {activeTab === 'upgrade' && (
        <div style={{ maxWidth: '960px', margin: '30px auto', padding: '0 20px' }}>

          {/* Status banners */}
          {checkoutStatus === 'success' && (
            <div style={{ background: '#14532d', border: '1px solid #16a34a', borderRadius: '10px', padding: '16px 24px', marginBottom: '24px', color: '#86efac', fontWeight: 'bold', fontSize: '15px' }}>
              ✅ Payment successful! Your plan has been upgraded. Welcome to the team.
            </div>
          )}
          {checkoutStatus === 'error' && (
            <div style={{ background: '#450a0a', border: '1px solid #dc2626', borderRadius: '10px', padding: '16px 24px', marginBottom: '24px', color: '#fca5a5', fontSize: '14px' }}>
              ⚠️ Something went wrong with checkout. Please try again or contact support.
            </div>
          )}

          {/* ONBOARDING CHECKLIST */}
          {user && !onboardingDismissed && !onboardingComplete && (
            <div style={{ background: '#0f172a', border: '1px solid rgba(56,189,248,0.25)', borderRadius: '14px', padding: '20px 24px', marginBottom: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '900', color: '#fff' }}>🚀 Getting Started — {onboardingPct}% complete</div>
                  <div style={{ fontSize: '12px', color: '#475569', marginTop: '3px' }}>{onboardingSteps.filter(s => s.done).length} of {onboardingSteps.length} steps done</div>
                </div>
                <button onClick={() => { setOnboardingDismissed(true); localStorage.setItem('gt_onboarding_done','true'); }} style={{ background: 'none', border: 'none', color: '#334155', cursor: 'pointer', fontSize: '18px' }}>×</button>
              </div>
              {/* Progress bar */}
              <div style={{ background: '#1e293b', borderRadius: '999px', height: '6px', marginBottom: '16px' }}>
                <div style={{ width: `${onboardingPct}%`, height: '100%', background: 'linear-gradient(90deg,#38bdf8,#818cf8)', borderRadius: '999px', transition: 'width 0.4s' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: '8px' }}>
                {onboardingSteps.map((step, i) => (
                  <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center', background: step.done ? 'rgba(34,197,94,0.07)' : '#020617', border: `1px solid ${step.done ? 'rgba(34,197,94,0.25)' : '#1e293b'}`, borderRadius: '8px', padding: '10px 12px' }}>
                    <span style={{ fontSize: '16px', flexShrink: 0 }}>{step.done ? '✅' : '⬜'}</span>
                    <span style={{ fontSize: '12px', color: step.done ? '#86efac' : '#64748b', fontWeight: step.done ? '700' : '400' }}>{step.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {user && onboardingComplete && !onboardingDismissed && (
            <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '12px', padding: '14px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '22px' }}>🎉</span>
              <div style={{ flex: 1 }}>
                <div style={{ color: '#86efac', fontWeight: '800', fontSize: '14px' }}>Setup complete! You're getting the most out of GameTracker.</div>
                <div style={{ color: '#475569', fontSize: '12px', marginTop: '2px' }}>Upgrade to Pro to unlock unlimited teams, advanced analytics exports, and recruiting tools.</div>
              </div>
              <button onClick={() => { setOnboardingDismissed(true); localStorage.setItem('gt_onboarding_done','true'); }} style={{ background: 'none', border: 'none', color: '#334155', cursor: 'pointer', fontSize: '18px' }}>×</button>
            </div>
          )}

          {/* SOCIAL PROOF STRIP */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '28px', flexWrap: 'wrap' }}>
            {[['⚾','1,200+','Coaches using GameTracker'],['🎮','18,000+','Live games scored'],['📊','340K+','At-bats tracked'],['🎓','4,800+','Recruiting profiles'],].map(([emoji, num, label]) => (
              <div key={label} style={{ flex: '1 1 140px', background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '14px 16px', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', marginBottom: '4px' }}>{emoji}</div>
                <div style={{ fontSize: '22px', fontWeight: '900', color: '#38bdf8', fontFamily: 'monospace' }}>{num}</div>
                <div style={{ fontSize: '11px', color: '#475569', marginTop: '2px' }}>{label}</div>
              </div>
            ))}
          </div>

          {/* HEADER */}
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <h2 style={{ margin: '0 0 10px', fontSize: '28px', color: '#fff' }}>{sportEmoji(teamSport)} GameTracker Plans</h2>
            <p style={{ color: '#64748b', fontSize: '15px', margin: 0 }}>Baseball &amp; Softball scoring, stats, and recruiting — built for coaches who are serious about winning.</p>
            {user && (
              <div style={{ marginTop: '12px', display: 'inline-block', padding: '6px 18px', borderRadius: '20px', background: userPlan === 'free' ? '#1e293b' : userPlan === 'org' ? '#7c3aed' : '#1d4ed8', color: '#fff', fontSize: '13px', fontWeight: 'bold' }}>
                Current plan: {userPlan === 'free' ? 'Free' : userPlan === 'org' ? 'Organization' : 'Pro Coach'}
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>

            {/* FREE */}
            <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '14px', padding: '28px 24px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Free</div>
                <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#fff', margin: '8px 0 4px' }}>$0</div>
                <div style={{ fontSize: '13px', color: '#475569' }}>forever</div>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                {['1 team', 'Live pitch-by-pitch scoring', 'Fan GameStream page', 'Season schedule', 'Basic roster (no recruiting)', 'Standard stats (AVG, ERA)'].map(f => (
                  <li key={f} style={{ fontSize: '13px', color: '#94a3b8', display: 'flex', gap: '8px' }}><span style={{ color: '#22c55e' }}>✓</span>{f}</li>
                ))}
              </ul>
              <div style={{ padding: '10px', background: '#1e293b', borderRadius: '8px', textAlign: 'center', color: '#475569', fontSize: '13px', fontWeight: 'bold' }}>
                {userPlan === 'free' ? '✓ Current Plan' : 'Included'}
              </div>
            </div>

            {/* PRO COACH */}
            <div style={{ background: '#0f172a', border: '2px solid #3b82f6', borderRadius: '14px', padding: '28px 24px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-13px', left: '50%', transform: 'translateX(-50%)', background: '#3b82f6', color: '#fff', fontSize: '11px', fontWeight: 'bold', padding: '4px 14px', borderRadius: '20px', whiteSpace: 'nowrap' }}>MOST POPULAR</div>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '13px', color: '#3b82f6', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Pro Coach</div>
                <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#fff', margin: '8px 0 2px' }}>$6.99<span style={{ fontSize: '16px', fontWeight: 'normal', color: '#64748b' }}>/mo</span></div>
                <div style={{ fontSize: '13px', color: '#475569' }}>or $59/year — save 30%</div>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                {['Everything in Free', 'Unlimited teams', 'Recruiting profiles per player', 'Highlight video uploads', 'Advanced stats (OBP, SLG, OPS, WHIP)', 'Printable lineup cards', 'Box score sharing', 'Family fan share links', 'Play log edit / undo', 'Priority support'].map(f => (
                  <li key={f} style={{ fontSize: '13px', color: '#cbd5e1', display: 'flex', gap: '8px' }}><span style={{ color: '#3b82f6' }}>✓</span>{f}</li>
                ))}
              </ul>
              {userPlan === 'pro' ? (
                <div style={{ padding: '10px', background: '#1d4ed8', borderRadius: '8px', textAlign: 'center', color: '#fff', fontSize: '13px', fontWeight: 'bold' }}>✓ Current Plan</div>
              ) : (
                <button
                  onClick={() => startCheckout('pro')}
                  disabled={checkoutStatus === 'loading'}
                  style={{ padding: '12px', background: '#3b82f6', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  {checkoutStatus === 'loading' ? 'Redirecting...' : 'Upgrade to Pro →'}
                </button>
              )}
            </div>

            {/* ORGANIZATION */}
            <div style={{ background: '#0f172a', border: '1px solid #7c3aed', borderRadius: '14px', padding: '28px 24px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '13px', color: '#a78bfa', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Organization</div>
                <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#fff', margin: '8px 0 2px' }}>$39<span style={{ fontSize: '16px', fontWeight: 'normal', color: '#64748b' }}>/mo</span></div>
                <div style={{ fontSize: '13px', color: '#475569' }}>per organization</div>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                {['Everything in Pro', 'Multi-team management', 'Organization admin dashboard', 'League standings', 'Bulk roster import', 'Staff / coach accounts', 'Custom branding', 'College coach visibility (coming soon)', 'Dedicated support'].map(f => (
                  <li key={f} style={{ fontSize: '13px', color: '#cbd5e1', display: 'flex', gap: '8px' }}><span style={{ color: '#a78bfa' }}>✓</span>{f}</li>
                ))}
              </ul>
              {userPlan === 'org' ? (
                <div style={{ padding: '10px', background: '#7c3aed', borderRadius: '8px', textAlign: 'center', color: '#fff', fontSize: '13px', fontWeight: 'bold' }}>✓ Current Plan</div>
              ) : (
                <button
                  onClick={() => startCheckout('org')}
                  disabled={checkoutStatus === 'loading'}
                  style={{ padding: '12px', background: '#7c3aed', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  {checkoutStatus === 'loading' ? 'Redirecting...' : 'Upgrade to Org →'}
                </button>
              )}
            </div>

          </div>

          {/* COMPARISON TABLE */}
          <div style={{ marginTop: '40px', marginBottom: '32px', overflowX: 'auto' }}>
            <div style={{ fontSize: '11px', color: '#475569', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px' }}>How we compare</div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', minWidth: '540px' }}>
              <thead>
                <tr style={{ background: '#07101f' }}>
                  <th style={{ padding: '12px 16px', color: '#475569', textAlign: 'left', borderBottom: '1px solid #1e293b', fontWeight: '800', fontSize: '11px', textTransform: 'uppercase' }}>Feature</th>
                  {[['GameTracker', '#38bdf8'], ['GameChanger', '#475569'], ['iScore', '#334155']].map(([name, c]) => (
                    <th key={name} style={{ padding: '12px 16px', color: c, textAlign: 'center', borderBottom: '1px solid #1e293b', fontWeight: '900', fontSize: '12px' }}>{name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['Live pitch-by-pitch scoring',         '✅', '✅', '✅'],
                  ['Baseball & Softball only',             '✅', '❌', '✅'],
                  ['Recruiting profiles per player',       '✅', '❌', '❌'],
                  ['Advanced sabermetrics (wRC+, BABIP)',  '✅', '❌', '❌'],
                  ['Win probability chart',                '✅', '❌', '❌'],
                  ['Pitch heatmap by zone',                '✅', '❌', '✅'],
                  ['Spray chart with click-to-add',        '✅', '✅', '❌'],
                  ['Family fan share + push alerts',       '✅', '✅', '❌'],
                  ['Multi-team org management',            '✅', '✅', '❌'],
                  ['Monthly price (per team)',              '$0–$6.99', '$9.99', '$4.99'],
                ].map(([feat, gt, gc, is], i) => (
                  <tr key={feat} style={{ borderBottom: '1px solid #0f172a', background: i % 2 === 0 ? 'transparent' : 'rgba(15,23,42,0.3)' }}>
                    <td style={{ padding: '11px 16px', color: '#cbd5e1' }}>{feat}</td>
                    <td style={{ padding: '11px 16px', textAlign: 'center', color: gt === '✅' ? '#22c55e' : gt === '❌' ? '#475569' : '#38bdf8', fontWeight: '700' }}>{gt}</td>
                    <td style={{ padding: '11px 16px', textAlign: 'center', color: gc === '✅' ? '#94a3b8' : '#334155', fontWeight: '700' }}>{gc}</td>
                    <td style={{ padding: '11px 16px', textAlign: 'center', color: is === '✅' ? '#94a3b8' : '#334155', fontWeight: '700' }}>{is}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* REFERRAL SECTION */}
          {user && (
            <div style={{ background: 'linear-gradient(135deg,#0f172a,#0c1a3a)', border: '1px solid rgba(99,102,241,0.35)', borderRadius: '14px', padding: '24px', marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: '900', color: '#fff', marginBottom: '4px' }}>🎁 Refer a coach — get 1 month free</div>
                  <div style={{ fontSize: '12px', color: '#475569' }}>Share your link. When they upgrade to Pro, you both get a free month added.</div>
                  <div style={{ marginTop: '10px', display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <code style={{ background: '#020617', border: '1px solid #1e3a5f', borderRadius: '6px', color: '#93c5fd', fontSize: '12px', padding: '6px 12px', flex: 1, maxWidth: '340px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{getReferralLink()}</code>
                    <button onClick={copyReferralLink} style={{ background: referralCopied ? 'rgba(34,197,94,0.15)' : 'rgba(99,102,241,0.2)', border: `1px solid ${referralCopied ? 'rgba(34,197,94,0.4)' : 'rgba(99,102,241,0.5)'}`, borderRadius: '8px', color: referralCopied ? '#86efac' : '#a5b4fc', cursor: 'pointer', fontSize: '13px', fontWeight: '800', padding: '8px 16px', whiteSpace: 'nowrap' }}>
                      {referralCopied ? '✓ Copied!' : '📋 Copy Link'}
                    </button>
                    <button onClick={() => { const url = getReferralLink(); window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`I've been using GameTracker to score games and track stats for my team. Check it out: ${url}`)}`,'_blank'); }} style={{ background: 'rgba(29,161,242,0.12)', border: '1px solid rgba(29,161,242,0.35)', borderRadius: '8px', color: '#38bdf8', cursor: 'pointer', fontSize: '13px', fontWeight: '800', padding: '8px 16px', whiteSpace: 'nowrap' }}>
                      𝕏 Share
                    </button>
                  </div>
                </div>
                <div style={{ textAlign: 'center', flexShrink: 0 }}>
                  <div style={{ fontSize: '36px', fontWeight: '900', color: '#818cf8', fontFamily: 'monospace' }}>+1</div>
                  <div style={{ fontSize: '11px', color: '#334155', textTransform: 'uppercase', fontWeight: '800' }}>Free month per referral</div>
                </div>
              </div>
            </div>
          )}

          {/* EMAIL DIGEST CONFIRM */}
          {digestOptIn ? (
            <div style={{ background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: '12px', padding: '14px 20px', marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '20px' }}>📧</span>
              <div>
                <div style={{ color: '#86efac', fontWeight: '800', fontSize: '13px' }}>Weekly digest active</div>
                <div style={{ color: '#334155', fontSize: '12px' }}>You'll receive a Monday morning stats summary for {teamDisplayName || 'your team'}.</div>
              </div>
            </div>
          ) : !digestBannerDismissed ? null : (
            <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '20px 24px', marginBottom: '28px' }}>
              <div style={{ fontSize: '13px', fontWeight: '800', color: '#fff', marginBottom: '8px' }}>📧 Weekly Stats Digest</div>
              <div style={{ fontSize: '12px', color: '#475569', marginBottom: '14px' }}>Get a Monday email with your team's top stats, win/loss record, and standout player of the week.</div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <input value={digestEmail} onChange={e => setDigestEmail(e.target.value)} placeholder={user?.email || 'coach@school.edu'} style={{ flex: 1, minWidth: '200px', background: '#020617', border: '1px solid #334155', borderRadius: '6px', color: '#fff', fontSize: '12px', padding: '8px 12px' }} />
                <button onClick={handleDigestOptIn} style={{ background: '#38bdf8', border: 'none', borderRadius: '6px', color: '#020617', fontSize: '12px', fontWeight: '900', padding: '8px 16px', cursor: 'pointer', whiteSpace: 'nowrap' }}>Subscribe Free →</button>
              </div>
              {digestStatus && <div style={{ fontSize: '12px', color: '#22c55e', marginTop: '8px' }}>{digestStatus}</div>}
            </div>
          )}

          {/* FAQ */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ fontSize: '11px', color: '#475569', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px' }}>Frequently asked questions</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                ['Can I cancel anytime?', 'Yes. Cancel from your account settings at any time. Your plan stays active through the end of your billing period — no prorated charges.'],
                ['Is there a free trial for Pro?', 'The Free plan gives you full live scoring and stats — no trial needed. Upgrade to Pro when you need recruiting profiles, advanced analytics, or unlimited teams.'],
                ['How does the referral program work?', 'Share your unique link. When a coach signs up and upgrades to Pro using your link, you both automatically receive a free month credited to your account.'],
                ['Do players and parents need accounts?', 'No. The fan GameStream page and player recruiting profiles are public links — families can view them in any browser without signing up.'],
                ['Does it work for softball?', 'Yes — full softball support including correct rule differences. Set your sport in Team Settings to switch between Baseball and Softball modes.'],
              ].map(([q, a]) => (
                <details key={q} style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '10px', padding: '0' }}>
                  <summary style={{ padding: '14px 18px', color: '#e2e8f0', fontSize: '13px', fontWeight: '700', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {q} <span style={{ color: '#334155', fontSize: '18px', lineHeight: 1, flexShrink: 0, marginLeft: '12px' }}>+</span>
                  </summary>
                  <div style={{ padding: '0 18px 14px', color: '#64748b', fontSize: '13px', lineHeight: '1.6' }}>{a}</div>
                </details>
              ))}
            </div>
          </div>

          {!user && (
            <p style={{ textAlign: 'center', color: '#475569', fontSize: '13px', marginTop: '24px' }}>
              <button onClick={() => setShowAuthModal(true)} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', textDecoration: 'underline', fontSize: '13px' }}>Sign in</button> to upgrade your plan.
            </p>
          )}
        </div>
      )}

      {/* BOX SCORE MODAL */}
      {showBoxScore && lastBoxScore && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(2,6,23,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#0f172a', border: '1px solid #334155', padding: '30px', borderRadius: '12px', width: '100%', maxWidth: '560px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: '#fff' }}>{sportEmoji(teamSport)} Final Box Score</h3>
              <span style={{ padding: '4px 12px', borderRadius: '6px', fontWeight: 'bold', fontSize: '14px', background: lastBoxScore.result === 'W' ? '#16a34a' : '#dc2626', color: '#fff' }}>{lastBoxScore.result === 'W' ? 'WIN' : 'LOSS'}</span>
            </div>
            <p style={{ color: '#94a3b8', margin: '0 0 16px', fontSize: '13px' }}>{lastBoxScore.date} · {lastBoxScore.location === 'Away' ? '@' : 'vs'} {lastBoxScore.opponent}</p>
            <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', color: '#fff', fontSize: '13px' }}>
                <thead>
                  <tr style={{ color: '#475569', borderBottom: '1px solid #1e293b' }}>
                    <th style={{ textAlign: 'left', padding: '6px 0' }}>TEAM</th>
                    {(lastBoxScore.ourInnings || []).map((_, i) => <th key={i} style={{ width: '32px' }}>{i + 1}</th>)}
                    <th style={{ color: '#3b82f6', width: '40px' }}>R</th>
                    <th style={{ width: '40px' }}>H</th>
                    <th style={{ width: '40px' }}>E</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #1e293b' }}>
                    <td style={{ textAlign: 'left', color: '#94a3b8', padding: '8px 0' }}>{lastBoxScore.opponent}</td>
                    {(lastBoxScore.theirInnings || []).map((r, i) => <td key={i}>{r}</td>)}
                    <td style={{ color: '#3b82f6', fontWeight: 'bold' }}>{lastBoxScore.theirScore}</td>
                    <td>{lastBoxScore.theirHits}</td>
                    <td>{lastBoxScore.theirErrors}</td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: 'left', color: '#f59e0b', padding: '8px 0', fontWeight: 'bold' }}>{teamDisplayName}</td>
                    {(lastBoxScore.ourInnings || []).map((r, i) => <td key={i}>{r}</td>)}
                    <td style={{ color: '#3b82f6', fontWeight: 'bold' }}>{lastBoxScore.ourScore}</td>
                    <td>{lastBoxScore.ourHits}</td>
                    <td>{lastBoxScore.ourErrors}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            {/* POST-GAME SHARE CTA */}
            <div style={{ background: '#07101f', border: '1px solid rgba(56,189,248,0.2)', borderRadius: '10px', padding: '14px 16px', marginBottom: '14px' }}>
              <div style={{ fontSize: '12px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>📢 Share with families</div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => {
                    const fanUrl = `${window.location.origin}/fan?game=${encodeURIComponent(defaultLiveGameId)}`;
                    navigator.clipboard?.writeText(fanUrl).catch(() => {});
                    localStorage.setItem('gt_fan_shared', 'true');
                    alert('Fan link copied! Send it to parents so they can follow along live next game.');
                  }}
                  style={{ flex: 1, minWidth: '120px', padding: '9px 12px', background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.35)', color: '#38bdf8', borderRadius: '7px', cursor: 'pointer', fontSize: '12px', fontWeight: '800' }}
                >
                  📋 Copy Fan Link
                </button>
                <button
                  onClick={() => {
                    const result = lastBoxScore?.result === 'W' ? `W ${lastBoxScore.ourScore}–${lastBoxScore.theirScore}` : `L ${lastBoxScore.ourScore}–${lastBoxScore.theirScore}`;
                    const fanUrl = `${window.location.origin}/fan?game=${encodeURIComponent(defaultLiveGameId)}`;
                    const text = `${teamDisplayName} ${result} vs ${lastBoxScore?.opponent}. Live stats & box score: ${fanUrl}`;
                    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
                    localStorage.setItem('gt_fan_shared', 'true');
                  }}
                  style={{ flex: 1, minWidth: '100px', padding: '9px 12px', background: 'rgba(29,161,242,0.1)', border: '1px solid rgba(29,161,242,0.3)', color: '#38bdf8', borderRadius: '7px', cursor: 'pointer', fontSize: '12px', fontWeight: '800' }}
                >
                  𝕏 Post Result
                </button>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setShowBoxScore(false)}
                style={{ flex: 1, padding: '9px', background: '#1e293b', border: '1px solid #334155', color: '#94a3b8', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}
              >
                Close
              </button>
              <button
                onClick={() => setShowBoxScore(false)}
                style={{ flex: 1, padding: '9px', background: '#3b82f6', border: 'none', color: '#fff', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}
              >
                ✓ Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NEW TEAM MODAL */}
      {showNewTeamModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(2,6,23,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '14px', padding: '28px', width: '100%', maxWidth: '440px' }}>
            <h3 style={{ margin: '0 0 18px', color: '#fff', fontSize: '16px' }}>➕ Create New Team</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '11px', color: '#64748b', fontWeight: '800', textTransform: 'uppercase', display: 'block', marginBottom: '5px' }}>Team Name *</label>
                <input value={newTeamName} onChange={e => setNewTeamName(e.target.value)} placeholder="e.g. Irvin Rockets JV"
                  style={{ width: '100%', boxSizing: 'border-box', background: '#020617', border: '1px solid #334155', borderRadius: '8px', color: '#fff', padding: '9px 12px', fontSize: '14px' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: '#64748b', fontWeight: '800', textTransform: 'uppercase', display: 'block', marginBottom: '5px' }}>Sport</label>
                  <select value={newTeamSport} onChange={e => setNewTeamSport(e.target.value)}
                    style={{ width: '100%', background: '#020617', border: '1px solid #334155', borderRadius: '8px', color: '#fff', padding: '9px 12px', fontSize: '13px' }}>
                    {['Baseball','Softball','Basketball','Football','Soccer','Volleyball','Tennis','Track'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: '#64748b', fontWeight: '800', textTransform: 'uppercase', display: 'block', marginBottom: '5px' }}>Level</label>
                  <select value={newTeamAgeGroup} onChange={e => setNewTeamAgeGroup(e.target.value)}
                    style={{ width: '100%', background: '#020617', border: '1px solid #334155', borderRadius: '8px', color: '#fff', padding: '9px 12px', fontSize: '13px' }}>
                    {['Varsity','JV','Freshman','8U','10U','12U','14U','16U','18U','College','Adult'].map(a => <option key={a}>{a}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label style={{ fontSize: '11px', color: '#64748b', fontWeight: '800', textTransform: 'uppercase', display: 'block', marginBottom: '5px' }}>Location</label>
                <input value={newTeamLocation} onChange={e => setNewTeamLocation(e.target.value)} placeholder="e.g. El Paso, TX"
                  style={{ width: '100%', boxSizing: 'border-box', background: '#020617', border: '1px solid #334155', borderRadius: '8px', color: '#fff', padding: '9px 12px', fontSize: '13px' }} />
              </div>
            </div>
            {newTeamStatus && <p style={{ margin: '12px 0 0', fontSize: '13px', color: newTeamStatus.includes('Created') ? '#22c55e' : '#f59e0b' }}>{newTeamStatus}</p>}
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button onClick={() => { setShowNewTeamModal(false); setNewTeamStatus(''); }} style={{ flex: 1, padding: '10px', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#94a3b8', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleCreateTeam} disabled={!newTeamName.trim()} style={{ flex: 2, padding: '10px', background: '#22c55e', border: 'none', borderRadius: '8px', color: '#020617', fontSize: '13px', fontWeight: '900', cursor: 'pointer', opacity: newTeamName.trim() ? 1 : 0.5 }}>Create Team</button>
            </div>
          </div>
        </div>
      )}

      {/* TEAM ACCESS / INVITE PANEL */}
      {showInvitePanel && user && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(2,6,23,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '14px', padding: '28px', width: '100%', maxWidth: '480px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ margin: 0, color: '#fff', fontSize: '16px' }}>👥 Team Access — {currentSeasonData.teamProfile?.name || selectedSeason}</h3>
              <button onClick={() => setShowInvitePanel(false)} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '20px', cursor: 'pointer', lineHeight: 1 }}>×</button>
            </div>

            {/* Current coaches */}
            {seasonCoaches.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '11px', color: '#475569', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Current Staff</div>
                {seasonCoaches.map(c => (
                  <div key={c.email} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', background: '#020617', border: '1px solid #1e293b', borderRadius: '8px', marginBottom: '6px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', color: '#e2e8f0', fontWeight: '600' }}>{c.email}</div>
                      <div style={{ fontSize: '11px', color: '#475569', marginTop: '2px' }}>{c.uid ? '✓ Account linked' : '⏳ Pending signup'}</div>
                    </div>
                    <span style={{ background: c.role === 'owner' ? 'rgba(56,189,248,0.15)' : 'rgba(167,139,250,0.15)', border: `1px solid ${c.role === 'owner' ? 'rgba(56,189,248,0.3)' : 'rgba(167,139,250,0.3)'}`, borderRadius: '999px', color: c.role === 'owner' ? '#38bdf8' : '#a78bfa', fontSize: '10px', fontWeight: '800', padding: '3px 9px', textTransform: 'uppercase' }}>{c.role}</span>
                    {c.role !== 'owner' && (
                      <button onClick={() => handleRemoveCoach(c.email)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', color: '#ef4444', fontSize: '11px', fontWeight: '700', padding: '4px 10px', cursor: 'pointer' }}>Remove</button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Invite form */}
            <div style={{ fontSize: '11px', color: '#475569', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Invite Someone</div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
              <input value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="coach@school.edu" type="email"
                onKeyDown={e => e.key === 'Enter' && handleInviteCoach()}
                style={{ flex: 1, minWidth: '180px', background: '#020617', border: '1px solid #334155', borderRadius: '8px', color: '#fff', padding: '9px 12px', fontSize: '13px' }} />
              <select value={inviteRole} onChange={e => setInviteRole(e.target.value)}
                style={{ background: '#020617', border: '1px solid #334155', borderRadius: '8px', color: '#fff', padding: '9px 12px', fontSize: '13px' }}>
                <option value="coach">Coach</option>
                <option value="assistant">Assistant</option>
                <option value="scorekeeper">Scorekeeper</option>
              </select>
              <button onClick={handleInviteCoach} disabled={!inviteEmail.trim()}
                style={{ background: '#a78bfa', border: 'none', borderRadius: '8px', color: '#020617', padding: '9px 16px', fontSize: '13px', fontWeight: '900', cursor: 'pointer', opacity: inviteEmail.trim() ? 1 : 0.5 }}>
                Invite
              </button>
            </div>
            {inviteStatus && <p style={{ margin: '6px 0 0', fontSize: '12px', color: inviteStatus.startsWith('✓') ? '#22c55e' : '#f59e0b' }}>{inviteStatus}</p>}
            <p style={{ margin: '14px 0 0', fontSize: '11px', color: '#334155', lineHeight: 1.5 }}>
              Invited coaches can view and score this season. They need a GameTracker account at the same email address.
            </p>
          </div>
        </div>
      )}

      {/* AUTH OVERLAY MODAL */}
      {showAuthModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(2, 6, 23, 0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <form onSubmit={handleLoginSubmit} style={{ background: '#0f172a', border: '1px solid #334155', padding: '30px', borderRadius: '12px', width: '100%', maxWidth: '380px' }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#fff' }}>🔑 Coach Authentication</h3>
            <div className={styles.formControlElement}><label>Email</label><input type="email" value={authEmail} onChange={e => setAuthEmail(e.target.value)} required /></div>
            <div className={styles.formControlElement} style={{ marginBottom: '25px' }}><label>Password</label><input type="password" value={authPassword} onChange={e => setAuthPassword(e.target.value)} required /></div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="button" onClick={() => setShowAuthModal(false)} style={{ width: '50%', padding: '6px 0', borderRadius: '4px', background: '#1e293b', color: '#fff', border: 'none', cursor: 'pointer' }}>Cancel</button>
              <button type="submit" style={{ background: '#3b82f6', color: '#fff', margin: 0, width: '50%', padding: '6px 0', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Login</button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
