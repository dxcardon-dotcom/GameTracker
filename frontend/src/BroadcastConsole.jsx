import React, { useEffect, useRef, useState } from 'react';
import styles from './BroadcastConsole.module.css';
import { db, storage } from './firebase';
import { collection, doc, limit, onSnapshot, orderBy, query, setDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

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
      } else {
        setUserPlan('free');
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

    await logScoringEvent('pitch', {
      result,
      label: pitch?.label || result,
      notation: pitch?.notation || null,
      ballsBefore: before.balls,
      strikesBefore: before.strikes,
      outsBefore: before.outs,
      ballsAfter: nextBalls,
      strikesAfter: nextStrikes,
      outsAfter: nextOuts
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

  return (
    <div className={styles.container}>
      
      {/* NAVBAR */}
      <div className={`${styles.appTabBarNav} ${styles.hideOnPrint}`}>
        <button className={`${styles.tabBarBtn} ${activeTab === 'live-game' ? styles.tabBarBtnActive : ''}`} onClick={() => setActiveTab('live-game')}>🎮 Live Scoring Engine</button>
        <button className={`${styles.tabBarBtn} ${activeTab === 'schedule' ? styles.tabBarBtnActive : ''}`} onClick={() => setActiveTab('schedule')}>📅 Results &amp; Records</button>
        <button className={`${styles.tabBarBtn} ${activeTab === 'stats' ? styles.tabBarBtnActive : ''}`} onClick={() => setActiveTab('stats')}>📈 Stat Sheets</button>
        <button className={`${styles.tabBarBtn} ${activeTab === 'upgrade' ? styles.tabBarBtnActive : ''}`} onClick={() => setActiveTab('upgrade')} style={{ marginLeft: 'auto', color: '#f59e0b', borderColor: '#f59e0b' }}>⭐ Upgrade</button>
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
            <div style={{ marginTop: '8px' }}>
              {['2024–2025', '2025–2026', '2026–2027'].map(yr => (
                <button key={yr} className={`${styles.seasonYearPill} ${selectedSeason === yr ? styles.seasonYearPillActive : ''}`} onClick={() => setSelectedSeason(yr)}>{yr}</button>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.bannerRecordsRibbon}>
          <div className={styles.ribbonStatBox}><small>RECORD</small><strong>{seasonWins}-{seasonLosses}</strong></div>
          <div className={styles.ribbonStatBox}><small>TEAM AVG</small><strong>{teamTotals.avg.toFixed(3)}</strong></div>
          <div className={styles.ribbonStatBox}><small>TEAM ERA</small><strong>{teamTotals.era.toFixed(2)}</strong></div>
          <div className={styles.ribbonStatBox}><small>FIELD %</small><strong>{teamTotals.fp.toFixed(3)}</strong></div>
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
                                href={`/player?game=${encodeURIComponent(defaultLiveGameId)}&player=${encodeURIComponent(player.id)}`}
                                target="_blank"
                                rel="noreferrer"
                              >
                                Profile
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
        </div>
      )}

      {/* UPGRADE / PRICING TAB */}
      {activeTab === 'upgrade' && (
        <div style={{ maxWidth: '900px', margin: '30px auto', padding: '0 20px' }}>

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

          <div style={{ marginTop: '40px', background: '#0b1329', border: '1px solid #1e293b', borderRadius: '12px', padding: '24px' }}>
            <h3 style={{ margin: '0 0 16px', color: '#94a3b8', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Why coaches choose GameTracker over GameChanger</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              {[
                ['⚾ Baseball & Softball Only', 'Purpose-built for diamond sports — no basketball, soccer, or watered-down multi-sport features.'],
                ['🎓 Built-in Recruiting Profiles', 'Every player gets a shareable recruiting page with stats, video links, and NCAA ID — GameChanger doesn\'t offer this.'],
                ['📊 Real Stats From Real Plays', 'Stats are auto-calculated from live pitch-by-pitch events, not manual entry.']
              ].map(([title, desc]) => (
                <div key={title} style={{ padding: '16px', background: '#0f172a', borderRadius: '8px', border: '1px solid #1e293b' }}>
                  <div style={{ fontWeight: 'bold', color: '#fff', marginBottom: '8px', fontSize: '14px' }}>{title}</div>
                  <div style={{ color: '#64748b', fontSize: '13px', lineHeight: '1.5' }}>{desc}</div>
                </div>
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
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => {
                  const url = window.location.href;
                  navigator.clipboard?.writeText(url).catch(() => {});
                  alert('Share link copied!');
                }}
                style={{ flex: 1, padding: '8px', background: '#1e293b', border: '1px solid #334155', color: '#fff', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}
              >
                Copy Share Link
              </button>
              <button
                onClick={() => setShowBoxScore(false)}
                style={{ flex: 1, padding: '8px', background: '#3b82f6', border: 'none', color: '#fff', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}
              >
                Done
              </button>
            </div>
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
