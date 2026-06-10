import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import styles from './BroadcastConsole.module.css';
import { db, storage } from './firebase';
import { collection, doc, limit, onSnapshot, orderBy, query, setDoc, deleteDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import ScoutingReportTab from './ScoutingReportTab';
import TournamentBracketTab from './TournamentBracketTab';
import SprayChart from './SprayChart';
import StatsPanel from './StatsPanel';
import AnimatedButton from './components/AnimatedButton';
import AnimatedCard from './components/AnimatedCard';
import LoadingSpinner from './components/LoadingSpinner';
import NotificationSystem from './components/NotificationSystem';
import AnimatedStatsCard from './components/AnimatedStatsCard';
import ModernDashboard from './components/ModernDashboard';
import RealTimeCollaboration from './components/RealTimeCollaboration';
import AIInsights from './components/AIInsights';
import AdminDashboard from './components/AdminDashboard';
import GamificationSystem from './components/GamificationSystem';
import SecurityCenter from './components/SecurityCenter';
import CommunityHub from './components/CommunityHub';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import { colors, spacing, borderRadius, transitions, typography } from './styles/designSystem';

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

function SubForm({ subModal, onConfirm, onCancel }) {
  const [subName, setSubName] = useState(subModal.name);
  const [subJersey, setSubJersey] = useState('');
  const [subPos, setSubPos] = useState('');
  return (
    <div style={{ marginTop: '10px', background: '#0f172a', border: '1px solid #38bdf8', borderRadius: '10px', padding: '12px 14px' }}>
      <div style={{ fontSize: '11px', color: '#38bdf8', fontWeight: '800', marginBottom: '8px' }}>
        SUB into slot {subModal.idx + 1} — replacing {subModal.name}
      </div>
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        <input value={subName} onChange={e => setSubName(e.target.value)} placeholder="New player name"
          style={{ flex: 2, minWidth: '120px', background: '#020617', border: '1px solid #334155', color: '#fff', borderRadius: '6px', padding: '6px 8px', fontSize: '12px' }} />
        <input value={subJersey} onChange={e => setSubJersey(e.target.value)} placeholder="#"
          style={{ width: '50px', background: '#020617', border: '1px solid #334155', color: '#fff', borderRadius: '6px', padding: '6px 8px', fontSize: '12px' }} />
        <input value={subPos} onChange={e => setSubPos(e.target.value)} placeholder="Pos"
          style={{ width: '60px', background: '#020617', border: '1px solid #334155', color: '#fff', borderRadius: '6px', padding: '6px 8px', fontSize: '12px' }} />
      </div>
      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
        <button onClick={() => onConfirm(subModal.idx, subName, subJersey, subPos)}
          style={{ background: '#1d4ed8', border: 'none', borderRadius: '6px', color: '#fff', cursor: 'pointer', fontSize: '12px', fontWeight: '800', padding: '6px 16px' }}>
          Confirm Sub
        </button>
        <button onClick={onCancel}
          style={{ background: 'transparent', border: '1px solid #334155', borderRadius: '6px', color: '#475569', cursor: 'pointer', fontSize: '12px', padding: '6px 12px' }}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function BroadcastConsole() {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState('live-game'); 
  const [selectedSeason, setSelectedSeason] = useState('2025–2026');
  
  // 📈 Metric System Sub-Tabs
  const [statsSubTab, setStatsSubTab] = useState('standard-hitting');
  const [sprayChartPlayer, setSprayChartPlayer] = useState('team');
  const [sprayDots, setSprayDots] = useState([]);
  const [sprayPending, setSprayPending] = useState(null); // { xPct, yPct } — pending click on spray chart

  // ⚾ Enhanced Pitch Velocity & Type Tracking
  const [pitchVelo, setPitchVelo] = useState('');
  const [pitchType, setPitchType] = useState('FB');
  const [pitchLog, setPitchLog] = useState([]);
  const [showPitchDetails, setShowPitchDetails] = useState(false);
  const [pitchLocation, setPitchLocation] = useState(''); // 'high', 'low', 'inside', 'outside', 'middle'
  const [pitchResult, setPitchResult] = useState(''); // 'swinging', 'looking', 'foul', 'contact'
  const [atBatCount, setAtBatCount] = useState(0);
  const [pitcherStats, setPitcherStats] = useState({ strikes: 0, balls: 0, kCount: 0, bbCount: 0 });

  // 📝 Play Log Edit/Undo System
  const [editingEvent, setEditingEvent] = useState(null);
  const [showPlayLog, setShowPlayLog] = useState(false);
  const [eventHistory, setEventHistory] = useState([]);
  const [correctionMode, setCorrectionMode] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState([]);

  // 📋 Lineup Templates & Presets
  const [lineupTemplates, setLineupTemplates] = useState([]);
  const [showTemplateManager, setShowTemplateManager] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateType, setTemplateType] = useState('batting'); // 'batting' or 'fielding'
  const [opponentType, setOpponentType] = useState('generic'); // 'lefty', 'righty', 'generic'

  // 📊 Advanced Analytics Dashboard
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [analyticsView, setAnalyticsView] = useState('overview'); // 'overview', 'hitting', 'pitching', 'fielding'
  const [selectedTimeRange, setSelectedTimeRange] = useState('season'); // 'season', 'last10', 'last5'
  const [playerAnalytics, setPlayerAnalytics] = useState([]);
  const [teamAnalytics, setTeamAnalytics] = useState({});
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  // 🎯 Pitch Chart Visualization
  const [showPitchChart, setShowPitchChart] = useState(false);
  const [pitchChartView, setPitchChartView] = useState('spray'); // 'spray', 'zone', 'heatmap'
  const [selectedPitchChartPlayer, setSelectedPitchChartPlayer] = useState('');
  const [pitchData, setPitchData] = useState([]);
  const [pitchChartLoading, setPitchChartLoading] = useState(false);

  // 📝 Game Recap Generator
  const [showRecapGenerator, setShowRecapGenerator] = useState(false);
  const [recapFormat, setRecapFormat] = useState('summary'); // 'summary', 'detailed', 'highlights'
  const [generatedRecap, setGeneratedRecap] = useState('');
  const [recapLoading, setRecapLoading] = useState(false);
  const [recapCopied, setRecapCopied] = useState(false);

  // 💬 Team Communication Features
  const [showTeamChat, setShowTeamChat] = useState(false);
  const [teamMessages, setTeamMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [messageType, setMessageType] = useState('general'); // 'general', 'announcement', 'coach'
  const [selectedRecipient, setSelectedRecipient] = useState('all'); // 'all' or specific player
  const [unreadCount, setUnreadCount] = useState(0);
  const [messageLoading, setMessageLoading] = useState(false);

  // 🎥 Video Integration Features
  const [showVideoPanel, setShowVideoPanel] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedClips, setRecordedClips] = useState([]);
  const [videoStream, setVideoStream] = useState(null);
  const [recordingStartTime, setRecordingStartTime] = useState(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [selectedClip, setSelectedClip] = useState(null);
  const [videoAnalysis, setVideoAnalysis] = useState({});
  const [clipTags, setClipTags] = useState([]);
  const [newTag, setNewTag] = useState('');

  // 🔄 Real-time Synchronization Features
  const [lastSyncTime, setLastSyncTime] = useState(new Date());
  const [connectedDevices, setConnectedDevices] = useState([]);
  const [syncConflicts, setSyncConflicts] = useState([]);
  const [pendingSync, setPendingSync] = useState([]);
  const [websocket, setWebsocket] = useState(null);
  const [syncProgress, setSyncProgress] = useState(0);

  // 📊 Advanced Performance Metrics
  const [showAdvancedMetrics, setShowAdvancedMetrics] = useState(false);
  const [playerMetrics, setPlayerMetrics] = useState({});
  const [teamMetrics, setTeamMetrics] = useState({});
  const [predictiveAnalytics, setPredictiveAnalytics] = useState({});
  const [performanceTrends, setPerformanceTrends] = useState([]);
  const [comparisonData, setComparisonData] = useState({});
  const [metricsLoading, setMetricsLoading] = useState(false);

  // 🎯 Player Development Tracking
  const [showPlayerDevelopment, setShowPlayerDevelopment] = useState(false);
  const [playerDevelopmentData, setPlayerDevelopmentData] = useState({});
  const [developmentGoals, setDevelopmentGoals] = useState({});
  const [skillProgress, setSkillProgress] = useState({});
  const [achievementSystem, setAchievementSystem] = useState({});
  const [selectedPlayerForDevelopment, setSelectedPlayerForDevelopment] = useState(null);
  const [developmentLoading, setDevelopmentLoading] = useState(false);
  const [newGoal, setNewGoal] = useState('');
  const [goalCategory, setGoalCategory] = useState('hitting'); // 'hitting', 'fielding', 'pitching', 'baseRunning'
  const [goalTarget, setGoalTarget] = useState('');
  const [goalDeadline, setGoalDeadline] = useState('');

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
  const [speakEnabled, setSpeakEnabled] = useState(false);
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
  const [lineupBatterIndex, setLineupBatterIndex] = useState(0);
  const [gcScoringMode, setGcScoringMode] = useState(false);
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 480);
  const [liveGameId, setLiveGameId] = useState(defaultLiveGameId);
  const [showFieldView, setShowFieldView] = useState(false);
  const [runnerToast, setRunnerToast] = useState(null); // { first, second, third, label, timer }
  const [gameClockMs, setGameClockMs] = useState(0);
  const [gameClockRunning, setGameClockRunning] = useState(false);
  const [opponentPitcher, setOpponentPitcher] = useState('');
  const gameClockRef = React.useRef(null);
  const [inningBreak, setInningBreak] = useState(null); // { runsThisHalf, wasTop, inning } — shown between half-innings
  const [showLineupSetup, setShowLineupSetup] = useState(false);
  const [redoStack, setRedoStack] = useState([]); // forward state snapshots for redo
  const [subModal, setSubModal] = useState(null); // { idx, name } — lineup slot being subbed
  const [dragIdx, setDragIdx] = useState(null); // index being dragged in lineup reorder
  const [editingSprayDot, setEditingSprayDot] = useState(null); // dot id being edited
  const [showHotZones, setShowHotZones] = useState(false);
  const [pitchAlert, setPitchAlert] = useState(null); // 'warning' | 'limit' | null
  const [gameOver, setGameOver] = useState(false);
  const [gameOverReason, setGameOverReason] = useState('');
  const [showBoxScoreStrip, setShowBoxScoreStrip] = useState(true);
  const [oppScoringMode, setOppScoringMode] = useState(false); // quick opp PA scoring
  const [oppBatterName, setOppBatterName] = useState('');
  const [errorModal, setErrorModal] = useState(false); // show E1-E9 picker
  const [currentPASequence, setCurrentPASequence] = useState([]); // pitches in current PA
  const [fcDpModal, setFcDpModal] = useState(null); // { type:'FC'|'DP', play } — routing picker
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
  const [userLimits, setUserLimits] = useState({ maxGames: 3, maxTeams: 1, recruiting: false, pushNotifications: false, pdfReports: false, advancedStats: false });
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [checkoutStatus, setCheckoutStatus] = useState('');
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [myReferralCode, setMyReferralCode] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [couponStatus, setCouponStatus] = useState('');
  const [notifPermission, setNotifPermission] = useState(() =>
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );
  const [selectedAnalyticsPlayer, setSelectedAnalyticsPlayer] = useState('');
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [announcementText, setAnnouncementText] = useState('');

  // 🔥 Heatmap filters
  const [hmPitcher, setHmPitcher] = useState('all');
  const [hmType, setHmType] = useState('all');

  // 💰 Monetization & Growth
  const [digestOptIn, setDigestOptIn] = useState(() => localStorage.getItem('gt_digest_optin') === 'true');
  const [digestEmail, setDigestEmail] = useState('');
  const [digestStatus, setDigestStatus] = useState('');
  const [digestBannerDismissed, setDigestBannerDismissed] = useState(() => localStorage.getItem('gt_digest_dismissed') === 'true');

  // 📱 Offline Mode
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineQueue, setOfflineQueue] = useState(() => {
    const saved = localStorage.getItem('gt_offline_queue');
    return saved ? JSON.parse(saved) : [];
  });
  const [offlineData, setOfflineData] = useState(() => {
    const saved = localStorage.getItem('gt_offline_data');
    return saved ? JSON.parse(saved) : {};
  });

  // 📊 Data Export
  const [exportStatus, setExportStatus] = useState('');
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
  const [syncStatus, setSyncStatus] = useState('connected'); // 'connected', 'syncing', 'offline', 'error'
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

  // ── BROADCAST CALL GENERATOR ─────────────────────────────────────────────
  const broadcastCall = (outcome, batter, runsScored, inning, isTop, teamName, opp) => {
    const b = batter || 'The batter';
    const inn = `${isTop ? 'top' : 'bottom'} of the ${inning}${inning === 1 ? 'st' : inning === 2 ? 'nd' : inning === 3 ? 'rd' : 'th'}`;
    const runLine = runsScored === 1 ? 'A run scores!' : runsScored > 1 ? `${runsScored} runs score!` : '';
    const calls = {
      single:          [`Base hit! ${b} lines a single${runLine ? ' — ' + runLine : ''}`, `Singles through the infield — ${b} on first.`, `${b} slaps one through the gap for a base hit!`],
      double:          [`${b} doubles! Ball in the gap — two bases!${runLine ? ' ' + runLine : ''}`, `Extra-base hit, ${b} is standing on second!`],
      triple:          [`TRIPLE! ${b} rounds second, heading to third — ${runLine || 'big play'}!`, `Three-bagger for ${b}! That's a triple!`],
      home_run:        [`GONE! ${b} PUTS IT OVER THE FENCE! HOME RUN!${runLine ? ' ' + runLine : ''}`, `That ball is OUTTA HERE — home run, ${b}!`],
      strikeout:       [`Strike three — ${b} goes down swinging.`, `Caught looking — ${b} is rung up.`, `Strikeout, ${b} heads back to the dugout.`],
      groundout:       [`Ground ball, ${b} thrown out at first.`, `${b} hits it on the ground — out at first.`],
      flyout:          [`Fly ball caught in the outfield — ${b} is out.`, `${b} flies out to end the at-bat.`],
      lineout:         [`Line drive — caught! ${b} is retired.`, `Rope right at 'em — lineout, ${b}.`],
      pop_out:         [`${b} pops it up — caught for the out.`, `Pop fly, infield makes the play on ${b}.`],
      walk:            [`Ball four — ${b} takes the walk.`, `${b} works a walk, takes first base.`],
      hit_by_pitch:    [`${b} is hit by the pitch — takes first base.`],
      sac_fly:         [`Sacrifice fly! ${runLine || 'Runner tags and scores'} — ${b} with the RBI.`],
      fielder_choice:  [`Fielder's choice — ${b} reaches on the play.`],
      error:           [`Error on the play — ${b} reaches base safely.`],
    };
    const opts = calls[outcome?.result] || [`${outcome?.label || 'Play recorded'} — ${b}.`];
    return opts[Math.floor(Math.random() * opts.length)];
  };

  useEffect(() => {
    if (!speakEnabled || !lastPlaySummary || lastPlaySummary === 'Ready for first pitch.') return;
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(lastPlaySummary);
    utt.rate = 1.1;
    utt.pitch = 1.0;
    window.speechSynthesis.speak(utt);
  }, [lastPlaySummary, speakEnabled]);

  // 📱 Offline Mode Functions
  const saveToOfflineStorage = useCallback((key, data) => {
    try {
      const offlineKey = `offline_${selectedSeason}_${key}`;
      localStorage.setItem(offlineKey, JSON.stringify(data));
      setOfflineData(prev => ({ ...prev, [offlineKey]: data }));
    } catch (error) {
      console.error('Failed to save offline data:', error);
    }
  }, [selectedSeason]);

  const loadFromOfflineStorage = useCallback((key) => {
    try {
      const offlineKey = `offline_${selectedSeason}_${key}`;
      const saved = localStorage.getItem(offlineKey);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Failed to load offline data:', error);
      return null;
    }
  }, [selectedSeason]);

  const addToOfflineQueue = useCallback((action, data) => {
    const queueItem = {
      id: Date.now().toString(),
      action,
      data,
      timestamp: new Date().toISOString(),
      synced: false
    };
    
    const newQueue = [...offlineQueue, queueItem];
    setOfflineQueue(newQueue);
    localStorage.setItem('gt_offline_queue', JSON.stringify(newQueue));
    
    // Try to sync if online
    if (isOnline) {
      syncOfflineQueue();
    }
  }, [offlineQueue, isOnline]);

  const syncOfflineQueue = useCallback(async () => {
    if (!isOnline || offlineQueue.length === 0) return;
    
    try {
      const unsyncedItems = offlineQueue.filter(item => !item.synced);
      
      for (const item of unsyncedItems) {
        // Here you would sync with Firebase
        console.log('Syncing offline item:', item);
        // Mark as synced
        item.synced = true;
      }
      
      // Update queue
      const syncedQueue = offlineQueue.map(item => 
        unsyncedItems.find(u => u.id === item.id) ? { ...item, synced: true } : item
      );
      setOfflineQueue(syncedQueue);
      localStorage.setItem('gt_offline_queue', JSON.stringify(syncedQueue));
      
    } catch (error) {
      console.error('Failed to sync offline queue:', error);
    }
  }, [offlineQueue, isOnline]);

  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncOfflineQueue();
    };
    
    const handleOffline = () => {
      setIsOnline(false);
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [syncOfflineQueue]);

  // Auto-sync when coming back online
  useEffect(() => {
    if (isOnline && offlineQueue.length > 0) {
      syncOfflineQueue();
    }
  }, [isOnline, offlineQueue.length, syncOfflineQueue]);

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
      
      // Create a simple HTML template for the PDF
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
      
      // Create a temporary window and print to PDF
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

  // ─────────────────────────────────────────────────────────────────────────

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
          // Ensure referral code exists
          await ensureReferralCode(currentUser.uid);
          // Handle referral if present in URL
          const params = new URLSearchParams(window.location.search);
          const refCode = params.get('ref');
          if (refCode && refCode.length === 6) {
            try {
              await fetch(`${apiBaseUrl}/api/user/referral-claim`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ referralCode: refCode })
              });
              // Clean URL after claiming
              window.history.replaceState({}, document.title, window.location.pathname);
            } catch (e) {
              console.error('Failed to claim referral:', e);
            }
          }
          const limRes = await fetch(`${apiBaseUrl}/api/user/limits`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (limRes.ok) {
            const limData = await limRes.json();
            setUserLimits(limData.limits || {});
            setGamesPlayed(limData.gamesPlayed || 0);
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
    const onResize = () => setIsMobile(window.innerWidth <= 480);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const gameRef = doc(db, 'games', liveGameId);
    const unsubscribeGame = onSnapshot(
      gameRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          // Fallback: try to restore from localStorage if cloud doc is missing
          try {
            const cached = localStorage.getItem(`gc_game_${liveGameId}`);
            if (cached) {
              const game = JSON.parse(cached);
              hydratingFromCloud.current = true;
              if (game.inning) setCurrentInning(game.inning);
              if (game.half !== undefined) setIsTopInning(game.half !== 'bottom');
              if (game.balls !== undefined) setBalls(game.balls);
              if (game.strikes !== undefined) setStrikes(game.strikes);
              if (game.outs !== undefined) setOuts(game.outs);
              if (game.pitchCount !== undefined) setPitchCount(game.pitchCount);
              if (game.currentBatter) setCurrentBatter(game.currentBatter);
              if (game.currentPitcher) setCurrentPitcher(game.currentPitcher);
              if (game.runners) { setRunnerOnFirst(!!game.runners.first); setRunnerOnSecond(!!game.runners.second); setRunnerOnThird(!!game.runners.third); }
              if (game.ourInnings) setOurInnings(game.ourInnings);
              if (game.theirInnings) setTheirInnings(game.theirInnings);
              if (game.ourHits !== undefined) setOurHits(game.ourHits);
              if (game.theirHits !== undefined) setTheirHits(game.theirHits);
              if (game.ourErrors !== undefined) setOurErrors(game.ourErrors);
              if (game.theirErrors !== undefined) setTheirErrors(game.theirErrors);
              if (game.opponentName) setScoringOpponent(game.opponentName);
              setSyncStatus('☇ Restored from local cache');
            }
          } catch (_) {}
          return;
        }

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
      collection(db, 'games', liveGameId, 'events'),
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
      // Enhanced play-by-play data with detailed metrics
      const enhancedEvent = {
        ...event,
        // Enhanced pitch tracking data
        pitchData: event.pitchSequence ? {
          sequence: event.pitchSequence,
          avgVelocity: pitchLog.slice(-event.pitchSequence.length).reduce((sum, p) => sum + (p.velocity || 0), 0) / event.pitchSequence.length || 0,
          pitchTypes: [...new Set(pitchLog.slice(-event.pitchSequence.length).map(p => p.type))],
          locations: [...new Set(pitchLog.slice(-event.pitchSequence.length).map(p => p.location).filter(Boolean))]
        } : null,
        // Game context
        gameContext: {
          score: { our: ourLiveScore, their: theirLiveScore },
          inning: currentInning,
          half: isTopInning ? 'top' : 'bottom',
          count: { balls, strikes },
          outs,
          runners: { first: runnerOnFirst, second: runnerOnSecond, third: runnerOnThird },
          pitcherStats,
          atBatCount
        },
        // Timestamp and metadata
        timestamp: new Date().toISOString(),
        gameId: liveGameId,
        season: selectedSeason,
        // Enhanced player context
        playerContext: {
          batter: currentBatter,
          pitcher: currentPitcher,
          battingOrder: lineupBatterIndex + 1,
          lineupPosition: lineupEntries[lineupBatterIndex]?.position || ''
        }
      };

      const response = await authenticatedPost(`/api/games/${liveGameId}/events`, {
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
        ...enhancedEvent
      });
      
      // Add to event history for undo functionality
      if (response.eventId) {
        setEventHistory(prev => [...prev, {
          id: response.eventId,
          type: eventType,
          data: enhancedEvent,
          timestamp: new Date().toISOString()
        }]);
      }
      
      setPlayNote('');
    } catch (error) {
      console.error(error);
      setSyncStatus('Event error');
    }
  };

  // 📝 Play Log Edit Functions
  const deleteEvent = async (eventId) => {
    if (!user || !eventId) return;
    
    try {
      await authenticatedPost(`/api/games/${liveGameId}/events/${eventId}/delete`, {});
      setEventHistory(prev => prev.filter(e => e.id !== eventId));
      setLastPlaySummary('Event deleted');
    } catch (error) {
      console.error('Failed to delete event:', error);
      setSyncStatus('Delete error');
    }
  };

  const editEvent = async (eventId, updatedData) => {
    if (!user || !eventId) return;
    
    try {
      await authenticatedPost(`/api/games/${liveGameId}/events/${eventId}/edit`, {
        ...updatedData,
        editedAt: new Date().toISOString()
      });
      
      setEventHistory(prev => prev.map(e => 
        e.id === eventId ? { ...e, data: { ...e.data, ...updatedData } } : e
      ));
      
      setLastPlaySummary('Event updated');
      setEditingEvent(null);
    } catch (error) {
      console.error('Failed to edit event:', error);
      setSyncStatus('Edit error');
    }
  };

  const correctEvent = async (eventId, correctionType, correctionData) => {
    if (!user || !eventId) return;
    
    try {
      await authenticatedPost(`/api/games/${liveGameId}/events/${eventId}/correct`, {
        correctionType,
        correctionData,
        correctedAt: new Date().toISOString()
      });
      
      setLastPlaySummary(`Correction applied: ${correctionType}`);
      setCorrectionMode(false);
      setSelectedEvents([]);
    } catch (error) {
      console.error('Failed to correct event:', error);
      setSyncStatus('Correction error');
    }
  };

  const revertToEvent = async (eventId) => {
    if (!user || !eventId) return;
    
    try {
      const eventIndex = eventHistory.findIndex(e => e.id === eventId);
      if (eventIndex === -1) return;
      
      // Restore state from this event point
      const targetEvent = eventHistory[eventIndex];
      const stateAfter = targetEvent.data.stateBefore;
      
      // Apply the restored state
      setCurrentInning(stateAfter.inning);
      setIsTopInning(stateAfter.half === 'top');
      setBalls(stateAfter.balls);
      setStrikes(stateAfter.strikes);
      setOuts(stateAfter.outs);
      setPitchCount(stateAfter.pitchCount);
      setRunnerOnFirst(stateAfter.runners.first);
      setRunnerOnSecond(stateAfter.runners.second);
      setRunnerOnThird(stateAfter.runners.third);
      setOurInnings(stateAfter.ourInnings);
      setTheirInnings(stateAfter.theirInnings);
      setOurHits(stateAfter.ourHits);
      setTheirHits(stateAfter.theirHits);
      setOurErrors(stateAfter.ourErrors);
      setTheirErrors(stateAfter.theirErrors);
      setCurrentBatter(stateAfter.currentBatter);
      setCurrentPitcher(stateAfter.currentPitcher);
      
      // Remove events after this point
      const eventsToKeep = eventHistory.slice(0, eventIndex + 1);
      setEventHistory(eventsToKeep);
      
      setLastPlaySummary(`Reverted to event at ${targetEvent.timestamp}`);
    } catch (error) {
      console.error('Failed to revert to event:', error);
      setSyncStatus('Revert error');
    }
  };

  // 📋 Lineup Template Functions
  const saveLineupTemplate = async () => {
    if (!user || !templateName.trim()) return;
    
    try {
      const template = {
        id: Date.now().toString(),
        name: templateName.trim(),
        type: templateType,
        opponentType,
        createdAt: new Date().toISOString(),
        season: selectedSeason,
        lineup: activeLineupEntries.map(entry => ({
          playerId: entry.player?.id,
          position: entry.position,
          battingOrder: entry.battingOrder,
          status: entry.status
        }))
      };
      
      // Save to Firestore
      await setDoc(doc(db, 'seasons', selectedSeason, 'lineupTemplates', template.id), template);
      
      // Update local state
      setLineupTemplates(prev => [...prev, template]);
      setTemplateName('');
      setLastPlaySummary(`Lineup template "${template.name}" saved`);
    } catch (error) {
      console.error('Failed to save lineup template:', error);
      setSyncStatus('Template save error');
    }
  };

  const loadLineupTemplate = async (templateId) => {
    if (!user) return;
    
    try {
      const template = lineupTemplates.find(t => t.id === templateId);
      if (!template) return;
      
      // Apply template to current lineup
      const newLineupEntries = template.lineup.map((templateEntry, index) => {
        const player = processedRoster.find(p => p.id === templateEntry.playerId);
        return {
          id: `lineup-${index}`,
          player,
          position: templateEntry.position || player?.primaryPosition || '',
          battingOrder: templateEntry.battingOrder || index + 1,
          status: templateEntry.status || 'starter'
        };
      });
      
      setLineupEntries(newLineupEntries);
      setLastPlaySummary(`Loaded lineup template "${template.name}"`);
      setShowTemplateManager(false);
    } catch (error) {
      console.error('Failed to load lineup template:', error);
      setSyncStatus('Template load error');
    }
  };

  const deleteLineupTemplate = async (templateId) => {
    if (!user) return;
    
    try {
      await deleteDoc(doc(db, 'seasons', selectedSeason, 'lineupTemplates', templateId));
      setLineupTemplates(prev => prev.filter(t => t.id !== templateId));
      setLastPlaySummary('Lineup template deleted');
    } catch (error) {
      console.error('Failed to delete lineup template:', error);
      setSyncStatus('Template delete error');
    }
  };

  const createQuickTemplate = (type) => {
    const templates = {
      'vs-lefty': {
        name: 'vs LHP',
        opponentType: 'lefty',
        lineup: generateOptimalLineup('lefty')
      },
      'vs-righty': {
        name: 'vs RHP',
        opponentType: 'righty',
        lineup: generateOptimalLineup('righty')
      },
      'tournament': {
        name: 'Tournament',
        opponentType: 'generic',
        lineup: generateOptimalLineup('generic')
      }
    };
    
    const template = templates[type];
    if (template) {
      setTemplateName(template.name);
      setOpponentType(template.opponentType);
      // Apply the lineup immediately
      const newLineupEntries = template.lineup.map((player, index) => ({
        id: `lineup-${index}`,
        player,
        position: player.primaryPosition || '',
        battingOrder: index + 1,
        status: 'starter'
      }));
      setLineupEntries(newLineupEntries);
      setLastPlaySummary(`Applied ${template.name} template`);
    }
  };

  const generateOptimalLineup = (opponentType) => {
    // Simple lineup optimization based on player stats
    const sortedPlayers = [...processedRoster]
      .filter(p => p.availability !== 'unavailable')
      .sort((a, b) => {
        // Sort by batting average, then by experience
        const aAvg = parseFloat(a.avg || '0');
        const bAvg = parseFloat(b.avg || '0');
        if (bAvg !== aAvg) return bAvg - aAvg;
        return (a.classYear || 0) - (b.classYear || 0);
      });
    
    // Return top 9 players
    return sortedPlayers.slice(0, 9);
  };

  // Load templates from Firestore
  useEffect(() => {
    if (!user || !selectedSeason) return;
    
    const templatesRef = collection(db, 'seasons', selectedSeason, 'lineupTemplates');
    const unsubscribe = onSnapshot(templatesRef, (snapshot) => {
      const templates = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setLineupTemplates(templates);
    });
    
    return unsubscribe;
  }, [user, selectedSeason]);

  // 📊 Analytics Calculation Functions
  const calculatePlayerAnalytics = useCallback((player, timeRange = 'season') => {
    const games = currentSeasonData.schedule || [];
    let relevantGames = games;
    
    if (timeRange === 'last5') {
      relevantGames = games.slice(-5);
    } else if (timeRange === 'last10') {
      relevantGames = games.slice(-10);
    }
    
    // Calculate advanced hitting metrics
    const avg = parseFloat(player.avg || '0');
    const obp = player.ab && player.ab + player.bb + player.hbp > 0 
      ? ((player.hits || 0) + (player.bb || 0) + (player.hbp || 0)) / (player.ab + player.bb + player.hbp)
      : 0;
    const slg = player.ab > 0 
      ? ((player.hits || 0) + 2 * (player.double || 0) + 3 * (player.triple || 0) + 4 * (player.hr || 0)) / player.ab
      : 0;
    const ops = obp + slg;
    
    // Calculate recent performance trend
    const recentAvg = player.recentAvg || avg;
    const trend = avg - recentAvg;
    
    return {
      ...player,
      avg: avg.toFixed(3),
      obp: obp.toFixed(3),
      slg: slg.toFixed(3),
      ops: ops.toFixed(3),
      trend: trend > 0.050 ? 'hot' : trend < -0.050 ? 'cold' : 'stable',
      gamesPlayed: relevantGames.filter(g => g.status === 'Final').length,
      qualityStarts: player.ip >= 6 && player.er <= 3 ? (player.qualityStarts || 0) : 0,
      whip: player.ip > 0 ? ((player.hitsAllowed || 0) + (player.walksAllowed || 0)) / player.ip : 0,
      era: player.ip > 0 ? (player.er * 9) / player.ip : 0
    };
  }, [currentSeasonData.schedule]);

  const calculateTeamAnalytics = useCallback(() => {
    const games = currentSeasonData.schedule || [];
    const completedGames = games.filter(g => g.status === 'Final');
    
    // Team hitting stats
    const totalHits = processedRoster.reduce((sum, p) => sum + (p.hits || 0), 0);
    const totalAB = processedRoster.reduce((sum, p) => sum + (p.ab || 0), 0);
    const totalRuns = processedRoster.reduce((sum, p) => sum + (p.runs || 0), 0);
    const totalHR = processedRoster.reduce((sum, p) => sum + (p.hr || 0), 0);
    const totalRBI = processedRoster.reduce((sum, p) => sum + (p.rbi || 0), 0);
    const totalBB = processedRoster.reduce((sum, p) => sum + (p.bb || 0), 0);
    
    // Team pitching stats
    const totalIP = processedRoster.reduce((sum, p) => sum + (p.ip || 0), 0);
    const totalER = processedRoster.reduce((sum, p) => sum + (p.er || 0), 0);
    const totalSO = processedRoster.reduce((sum, p) => sum + (p.strikeouts || 0), 0);
    const totalHitsAllowed = processedRoster.reduce((sum, p) => sum + (p.hitsAllowed || 0), 0);
    const totalWalksAllowed = processedRoster.reduce((sum, p) => sum + (p.walksAllowed || 0), 0);
    
    // Calculate team averages
    const teamAvg = totalAB > 0 ? (totalHits / totalAB) : 0;
    const teamERA = totalIP > 0 ? (totalER * 9) / totalIP : 0;
    const teamWHIP = totalIP > 0 ? (totalHitsAllowed + totalWalksAllowed) / totalIP : 0;
    
    // Win/loss record
    const wins = completedGames.filter(g => g.result === 'W').length;
    const losses = completedGames.filter(g => g.result === 'L').length;
    const winPercentage = completedGames.length > 0 ? wins / completedGames.length : 0;
    
    return {
      record: { wins, losses, winPercentage: (winPercentage * 100).toFixed(1) },
      hitting: {
        avg: teamAvg.toFixed(3),
        runs: totalRuns,
        hits: totalHits,
        hr: totalHR,
        rbi: totalRBI,
        bb: totalBB,
        runsPerGame: completedGames.length > 0 ? (totalRuns / completedGames.length).toFixed(1) : 0
      },
      pitching: {
        era: teamERA.toFixed(2),
        whip: teamWHIP.toFixed(2),
        ip: totalIP,
        so: totalSO,
        hitsAllowed: totalHitsAllowed,
        walksAllowed: totalWalksAllowed,
        strikeoutsPer9: totalIP > 0 ? ((totalSO * 9) / totalIP).toFixed(1) : 0
      },
      fielding: {
        errors: processedRoster.reduce((sum, p) => sum + (p.errors || 0), 0),
        assists: processedRoster.reduce((sum, p) => sum + (p.assists || 0), 0),
        putouts: processedRoster.reduce((sum, p) => sum + (p.po || 0), 0),
        fieldingPct: (() => {
          const totalChances = processedRoster.reduce((sum, p) => 
            sum + (p.errors || 0) + (p.assists || 0) + (p.po || 0), 0);
          const totalOuts = processedRoster.reduce((sum, p) => 
            sum + (p.assists || 0) + (p.po || 0), 0);
          return totalChances > 0 ? ((totalOuts / totalChances) * 100).toFixed(1) : '0.0';
        })()
      }
    };
  }, [currentSeasonData.schedule, processedRoster]);

  // Load analytics data
  useEffect(() => {
    if (!showAnalytics) return;
    
    setAnalyticsLoading(true);
    
    // Calculate player analytics
    const playersWithAnalytics = processedRoster.map(player => 
      calculatePlayerAnalytics(player, selectedTimeRange)
    );
    setPlayerAnalytics(playersWithAnalytics);
    
    // Calculate team analytics
    setTeamAnalytics(calculateTeamAnalytics());
    
    setAnalyticsLoading(false);
  }, [showAnalytics, selectedTimeRange, processedRoster, calculatePlayerAnalytics, calculateTeamAnalytics]);

  // 🎯 Pitch Chart Functions
  const generatePitchData = useCallback(() => {
    // Generate sample pitch data for visualization
    const pitchTypes = ['FB', 'CB', 'CH', 'SL', 'CT', 'SP'];
    const outcomes = ['hit', 'strike', 'ball', 'foul', 'out'];
    
    const data = [];
    for (let i = 0; i < 100; i++) {
      data.push({
        id: i,
        type: pitchTypes[Math.floor(Math.random() * pitchTypes.length)],
        velocity: 70 + Math.random() * 30,
        location: {
          x: (Math.random() - 0.5) * 2, // -1 to 1 (horizontal)
          y: (Math.random() - 0.5) * 2  // -1 to 1 (vertical)
        },
        outcome: outcomes[Math.floor(Math.random() * outcomes.length)],
        batter: selectedPitchChartPlayer || 'All Batters',
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
      });
    }
    
    return data;
  }, [selectedPitchChartPlayer]);

  const calculateSprayChart = useCallback((pitches) => {
    // Calculate spray chart data from pitch locations
    return pitches.map(pitch => ({
      ...pitch,
      angle: Math.atan2(pitch.location.y, pitch.location.x) * (180 / Math.PI),
      distance: Math.sqrt(pitch.location.x ** 2 + pitch.location.y ** 2),
      quadrant: getQuadrant(pitch.location.x, pitch.location.y)
    }));
  }, []);

  const calculateStrikeZone = useCallback((pitches) => {
    // Calculate strike zone analysis
    const strikeZonePitches = pitches.filter(p => 
      Math.abs(p.location.x) <= 0.5 && Math.abs(p.location.y) <= 0.5
    );
    
    const zones = {
      'high-inside': 0, 'high-middle': 0, 'high-outside': 0,
      'middle-inside': 0, 'middle-middle': 0, 'middle-outside': 0,
      'low-inside': 0, 'low-middle': 0, 'low-outside': 0,
      'outside': 0
    };
    
    pitches.forEach(pitch => {
      const x = pitch.location.x;
      const y = pitch.location.y;
      
      if (Math.abs(x) <= 0.5 && Math.abs(y) <= 0.5) {
        const vertical = y > 0.17 ? 'high' : y < -0.17 ? 'low' : 'middle';
        const horizontal = x < -0.17 ? 'inside' : x > 0.17 ? 'outside' : 'middle';
        zones[`${vertical}-${horizontal}`]++;
      } else {
        zones['outside']++;
      }
    });
    
    return {
      total: pitches.length,
      strikeZone: strikeZonePitches.length,
      zones,
      strikeRate: (strikeZonePitches.length / pitches.length * 100).toFixed(1)
    };
  }, []);

  const calculateHeatMap = useCallback((pitches) => {
    // Create heat map grid data
    const gridSize = 10;
    const grid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(0));
    
    pitches.forEach(pitch => {
      const x = Math.floor((pitch.location.x + 1) * gridSize / 2);
      const y = Math.floor((pitch.location.y + 1) * gridSize / 2);
      
      if (x >= 0 && x < gridSize && y >= 0 && y < gridSize) {
        grid[y][x]++;
      }
    });
    
    // Find max value for normalization
    const maxValue = Math.max(...grid.flat());
    
    return {
      grid: grid.map(row => row.map(value => maxValue > 0 ? value / maxValue : 0)),
      gridSize,
      maxValue
    };
  }, []);

  const getQuadrant = (x, y) => {
    if (x >= 0 && y >= 0) return 'pull';
    if (x < 0 && y >= 0) return 'opposite';
    if (x < 0 && y < 0) return 'opposite';
    return 'pull';
  };

  // Load pitch chart data
  useEffect(() => {
    if (!showPitchChart) return;
    
    setPitchChartLoading(true);
    
    // Generate or load pitch data
    const data = generatePitchData();
    setPitchData(data);
    
    setPitchChartLoading(false);
  }, [showPitchChart, generatePitchData]);

  // 📝 Game Recap Functions
  const generateGameRecap = useCallback(() => {
    setRecapLoading(true);
    
    const teamName = currentSeasonData.teamProfile?.name || 'Our Team';
    const opponentName = game.opponentName || 'Opponent';
    const isHome = game.location !== 'Away';
    const ourRuns = isHome ? sumRuns(game.ourInnings) : sumRuns(game.theirInnings);
    const theirRuns = isHome ? sumRuns(game.theirInnings) : sumRuns(game.ourInnings);
    const result = ourRuns > theirRuns ? 'WON' : ourRuns < theirRuns ? 'LOST' : 'TIED';
    
    let recap = '';
    
    if (recapFormat === 'summary') {
      recap = `${teamName} ${result} ${ourRuns}-${theirRuns} against ${opponentName}\n\n`;
      recap += `📊 Final Score: ${teamName} ${ourRuns} - ${opponentName} ${theirRuns}\n`;
      recap += `🏟️ Location: ${game.location || 'Away'}\n`;
      recap += `📅 Date: ${game.gameDate || new Date().toLocaleDateString()}\n\n`;
      recap += `🔑 Key Stats:\n`;
      recap += `• Total Hits: ${ourHits || 0}\n`;
      recap += `• Total Errors: ${ourErrors || 0}\n`;
      recap += `• Innings Played: ${currentInning || 7}\n`;
    } else if (recapFormat === 'detailed') {
      recap = `📝 GAME RECAP - ${teamName} vs ${opponentName}\n`;
      recap += `${'='.repeat(50)}\n\n`;
      recap += `🏆 Final Result: ${teamName} ${result} ${ourRuns}-${theirRuns}\n`;
      recap += `📅 Date: ${game.gameDate || new Date().toLocaleDateString()}\n`;
      recap += `🏟️ Location: ${game.location || 'Away'} Game\n\n`;
      
      recap += `📊 INNING BY INNING:\n`;
      const maxInnings = Math.max(game.ourInnings?.length || 0, game.theirInnings?.length || 0);
      for (let i = 0; i < maxInnings; i++) {
        const ourScore = game.ourInnings?.[i] || 0;
        const theirScore = game.theirInnings?.[i] || 0;
        recap += `Inning ${i + 1}: ${teamName} ${ourScore} - ${opponentName} ${theirScore}\n`;
      }
      
      recap += `\n🔑 TEAM STATISTICS:\n`;
      recap += `• Hits: ${ourHits || 0}\n`;
      recap += `• Errors: ${ourErrors || 0}\n`;
      recap += `• Walks: ${processedRoster.reduce((sum, p) => sum + (p.bb || 0), 0)}\n`;
      recap += `• Strikeouts: ${processedRoster.reduce((sum, p) => sum + (p.strikeouts || 0), 0)}\n`;
    } else if (recapFormat === 'highlights') {
      recap = `🌟 GAME HIGHLIGHTS - ${teamName} ${ourRuns} vs ${opponentName} ${theirRuns}\n`;
      recap += `${'='.repeat(60)}\n\n`;
      
      recap += `🏆 FINAL: ${teamName} ${result} ${ourRuns}-${theirRuns}\n\n`;
      
      recap += `⭐ TOP PERFORMERS:\n`;
      const topHitters = processedRoster
        .filter(p => p.hits > 0)
        .sort((a, b) => b.hits - a.hits)
        .slice(0, 3);
      
      topHitters.forEach((player, index) => {
        recap += `${index + 1}. ${player.firstName} ${player.lastName}: ${player.hits} hits, `;
        recap += `${player.rbi || 0} RBI, .${player.avg || '000'} avg\n`;
      });
      
      recap += `\n🎯 KEY MOMENTS:\n`;
      recap += `• Final Score: ${ourRuns}-${theirRuns}\n`;
      recap += `• Total Team Hits: ${ourHits || 0}\n`;
      recap += `• Fielding: ${ourErrors || 0} errors\n`;
      recap += `• Game Duration: ${currentInning || 7} innings\n`;
    }
    
    setGeneratedRecap(recap);
    setRecapLoading(false);
  }, [recapFormat, game, currentSeasonData, processedRoster, ourHits, ourErrors, currentInning]);

  const copyRecapToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedRecap);
      setRecapCopied(true);
      setTimeout(() => setRecapCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy recap:', error);
    }
  };

  // 💬 Team Communication Functions
  const sendMessage = useCallback(async () => {
    if (!newMessage.trim() || !user) return;
    
    setMessageLoading(true);
    
    const message = {
      id: Date.now(),
      text: newMessage.trim(),
      sender: user.displayName || 'Coach',
      senderId: user.uid,
      type: messageType,
      recipient: selectedRecipient,
      timestamp: new Date().toISOString(),
      read: false,
      gameContext: {
        gameId: liveGameId,
        inning: currentInning,
        isTopInning,
        score: {
          our: sumRuns(game.ourInnings),
          their: sumRuns(game.theirInnings)
        }
      }
    };
    
    try {
      // Add message to local state
      setTeamMessages(prev => [message, ...prev]);
      setNewMessage('');
      
      // In production, save to Firestore
      // await addDoc(collection(db, 'teams', currentSeasonData.teamProfile.id, 'messages'), message);
      
      // Update unread count for other users
      if (selectedRecipient === 'all') {
        setUnreadCount(prev => prev + processedRoster.length - 1);
      }
      
    } catch (error) {
      console.error('Failed to send message:', error);
    }
    
    setMessageLoading(false);
  }, [newMessage, user, messageType, selectedRecipient, liveGameId, currentInning, isTopInning, game, processedRoster]);

  const markMessagesAsRead = useCallback(() => {
    setTeamMessages(prev => prev.map(msg => ({ ...msg, read: true })));
    setUnreadCount(0);
  }, []);

  const getQuickMessages = () => [
    { text: "Great game today team!", type: "general" },
    { text: "Remember our defensive positioning", type: "coach" },
    { text: "Game starts in 30 minutes", type: "announcement" },
    { text: "Nice hitting everyone!", type: "general" },
    { text: "Let's focus this inning", type: "coach" },
    { text: "Bring your A-game today", type: "general" }
  ];

  const sendQuickMessage = (quickMsg) => {
    setNewMessage(quickMsg.text);
    setMessageType(quickMsg.type);
    setTimeout(() => sendMessage(), 100);
  };

  // Load team messages
  useEffect(() => {
    if (!showTeamChat) return;
    
    // In production, load from Firestore
    // const q = query(collection(db, 'teams', currentSeasonData.teamProfile.id, 'messages'), orderBy('timestamp', 'desc'));
    // const unsubscribe = onSnapshot(q, (snapshot) => {
    //   const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    //   setTeamMessages(messages);
    // });
    
    // Mock messages for demo
    const mockMessages = [
      {
        id: 1,
        text: "Great practice today everyone!",
        sender: "Coach Smith",
        senderId: "coach1",
        type: "general",
        recipient: "all",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        read: false
      },
      {
        id: 2,
        text: "Don't forget about tomorrow's game at 4pm",
        sender: "Coach Smith",
        senderId: "coach1",
        type: "announcement",
        recipient: "all",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        read: true
      },
      {
        id: 3,
        text: "Remember to work on your batting stance",
        sender: "Coach Johnson",
        senderId: "coach2",
        type: "coach",
        recipient: "all",
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        read: true
      }
    ];
    
    setTeamMessages(mockMessages);
    setUnreadCount(mockMessages.filter(m => !m.read).length);
    
    return () => {
      // unsubscribe();
    };
  }, [showTeamChat]);

  // 🎥 Video Integration Functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }, 
        audio: true 
      });
      
      setVideoStream(stream);
      setIsRecording(true);
      setRecordingStartTime(Date.now());
      
      // Start recording duration timer
      const durationTimer = setInterval(() => {
        setRecordingDuration(Math.floor((Date.now() - Date.now()) / 1000));
      }, 1000);
      
      // In production, use MediaRecorder API
      // const mediaRecorder = new MediaRecorder(stream);
      // mediaRecorder.start();
      
    } catch (error) {
      console.error('Failed to start recording:', error);
      alert('Camera access denied or not available');
    }
  };

  const stopRecording = () => {
    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop());
      setVideoStream(null);
    }
    
    setIsRecording(false);
    
    // Create a mock clip for demonstration
    const newClip = {
      id: Date.now(),
      title: `Clip ${recordedClips.length + 1}`,
      duration: recordingDuration,
      timestamp: new Date().toISOString(),
      gameContext: {
        gameId: liveGameId,
        inning: currentInning,
        isTopInning,
        score: {
          our: sumRuns(game.ourInnings),
          their: sumRuns(game.theirInnings)
        }
      },
      tags: ['game-action'],
      url: '#mock-video-url',
      thumbnail: '#mock-thumbnail'
    };
    
    setRecordedClips(prev => [newClip, ...prev]);
    setRecordingDuration(0);
    setRecordingStartTime(null);
  };

  const deleteClip = (clipId) => {
    setRecordedClips(prev => prev.filter(clip => clip.id !== clipId));
    if (selectedClip?.id === clipId) {
      setSelectedClip(null);
    }
  };

  const addTagToClip = (clipId, tag) => {
    if (!tag.trim()) return;
    
    setRecordedClips(prev => prev.map(clip => 
      clip.id === clipId 
        ? { ...clip, tags: [...new Set([...clip.tags, tag.trim()])] }
        : clip
    ));
    setNewTag('');
  };

  const removeTagFromClip = (clipId, tagToRemove) => {
    setRecordedClips(prev => prev.map(clip => 
      clip.id === clipId 
        ? { ...clip, tags: clip.tags.filter(tag => tag !== tagToRemove) }
        : clip
    ));
  };

  const analyzeClip = (clip) => {
    // Mock video analysis
    const analysis = {
      pitchCount: Math.floor(Math.random() * 20) + 5,
      swingCount: Math.floor(Math.random() * 15) + 3,
      hitQuality: ['Excellent', 'Good', 'Average', 'Poor'][Math.floor(Math.random() * 4)],
      mechanics: ['Smooth', 'Needs Work', 'Improving', 'Excellent'][Math.floor(Math.random() * 4)],
      recommendations: [
        'Focus on hip rotation',
        'Keep eye on the ball',
        'Improve follow-through',
        'Work on timing'
      ].slice(0, Math.floor(Math.random() * 3) + 1)
    };
    
    setVideoAnalysis(prev => ({ ...prev, [clip.id]: analysis }));
  };

  const exportClip = (clip) => {
    // Mock export functionality
    const exportData = {
      clip: clip,
      analysis: videoAnalysis[clip.id],
      exportDate: new Date().toISOString(),
      format: 'mp4'
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `video-clip-${clip.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getPopularTags = () => {
    const tagCounts = {};
    recordedClips.forEach(clip => {
      clip.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    
    return Object.entries(tagCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([tag]) => tag);
  };

  // Recording duration timer
  useEffect(() => {
    let timer;
    if (isRecording && recordingStartTime) {
      timer = setInterval(() => {
        setRecordingDuration(Math.floor((Date.now() - recordingStartTime) / 1000));
      }, 1000);
    }
    
    return () => clearInterval(timer);
  }, [isRecording, recordingStartTime]);

  // 🔄 Real-time Synchronization Functions
  const initializeWebSocket = useCallback(() => {
    if (!user || !liveGameId) return;

    // In production, connect to your WebSocket server
    // const ws = new WebSocket(`wss://your-server.com/ws/${liveGameId}`);
    
    // Mock WebSocket for demonstration
    const mockWebSocket = {
      send: (data) => {
        console.log('WebSocket send:', data);
        // Simulate broadcast to other devices
        setTimeout(() => {
          handleIncomingMessage(JSON.parse(data));
        }, 100);
      },
      close: () => {
        console.log('WebSocket closed');
        setSyncStatus('offline');
      }
    };

    setWebsocket(mockWebSocket);
    setSyncStatus('connected');

    // Mock connection events
    setTimeout(() => {
      setConnectedDevices([
        { id: 'tablet-1', name: 'Scoreboard Tablet', type: 'tablet', lastSeen: new Date() },
        { id: 'phone-1', name: "Coach's Phone", type: 'phone', lastSeen: new Date() }
      ]);
    }, 2000);

    return mockWebSocket;
  }, [user, liveGameId]);

  const handleIncomingMessage = useCallback((message) => {
    switch (message.type) {
      case 'game_update':
        // Handle game state updates from other devices
        if (message.timestamp > lastSyncTime) {
          // Apply updates with conflict resolution
          applyGameUpdate(message.data);
          setLastSyncTime(new Date(message.timestamp));
        }
        break;
      
      case 'device_status':
        // Update connected devices list
        setConnectedDevices(prev => {
          const updated = prev.filter(d => d.id !== message.data.id);
          return [...updated, message.data];
        });
        break;
      
      case 'sync_request':
        // Handle synchronization requests
        handleSyncRequest(message.data);
        break;
      
      default:
        console.log('Unknown message type:', message.type);
    }
  }, [lastSyncTime]);

  const applyGameUpdate = useCallback((updateData) => {
    // Apply updates with conflict resolution
    try {
      if (updateData.ourInnings) {
        setOurInnings(updateData.ourInnings);
      }
      if (updateData.theirInnings) {
        setTheirInnings(updateData.theirInnings);
      }
      if (updateData.currentInning) {
        setCurrentInning(updateData.currentInning);
      }
      if (updateData.processedRoster) {
        setProcessedRoster(updateData.processedRoster);
      }
    } catch (error) {
      console.error('Error applying game update:', error);
      setSyncConflicts(prev => [...prev, {
        id: Date.now(),
        type: 'game_update',
        data: updateData,
        timestamp: new Date(),
        resolved: false
      }]);
    }
  }, []);

  const broadcastUpdate = useCallback((updateType, data) => {
    if (!websocket || syncStatus !== 'connected') {
      // Queue for later sync
      setPendingSync(prev => [...prev, {
        type: updateType,
        data,
        timestamp: new Date().toISOString()
      }]);
      return;
    }

    const message = {
      type: updateType,
      data,
      timestamp: new Date().toISOString(),
      deviceId: 'broadcast-console',
      gameId: liveGameId
    };

    websocket.send(JSON.stringify(message));
    setLastSyncTime(new Date());
  }, [websocket, syncStatus, liveGameId]);

  const handleSyncRequest = useCallback((requestData) => {
    // Send current game state to requesting device
    const currentState = {
      ourInnings,
      theirInnings,
      currentInning,
      processedRoster,
      isTopInning,
      scoringLocation,
      game
    };

    broadcastUpdate('sync_response', {
      requestId: requestData.requestId,
      state: currentState
    });
  }, [ourInnings, theirInnings, currentInning, processedRoster, isTopInning, scoringLocation, game, broadcastUpdate]);

  const resolveConflict = useCallback((conflictId, resolution) => {
    setSyncConflicts(prev => prev.map(conflict => 
      conflict.id === conflictId 
        ? { ...conflict, resolved: true, resolution }
        : conflict
    ));
  }, []);

  const syncPendingData = useCallback(async () => {
    if (pendingSync.length === 0) return;
    
    setSyncStatus('syncing');
    setSyncProgress(0);

    for (let i = 0; i < pendingSync.length; i++) {
      const item = pendingSync[i];
      
      try {
        await new Promise(resolve => setTimeout(resolve, 100)); // Simulate network delay
        broadcastUpdate(item.type, item.data);
        setSyncProgress(((i + 1) / pendingSync.length) * 100);
      } catch (error) {
        console.error('Sync failed for item:', item, error);
      }
    }

    setPendingSync([]);
    setSyncStatus('connected');
    setLastSyncTime(new Date());
  }, [pendingSync, broadcastUpdate]);

  const forceSync = useCallback(() => {
    // Force full synchronization with all devices
    setSyncStatus('syncing');
    
    // Broadcast current state
    broadcastUpdate('force_sync', {
      ourInnings,
      theirInnings,
      currentInning,
      processedRoster,
      isTopInning,
      scoringLocation,
      game
    });

    setTimeout(() => {
      setSyncStatus('connected');
      setLastSyncTime(new Date());
    }, 2000);
  }, [ourInnings, theirInnings, currentInning, processedRoster, isTopInning, scoringLocation, game, broadcastUpdate]);

  // Initialize WebSocket connection
  useEffect(() => {
    if (!websocket && user && liveGameId) {
      const ws = initializeWebSocket();
      
      return () => {
        if (ws) {
          ws.close();
        }
      };
    }
  }, [user, liveGameId, websocket, initializeWebSocket]);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (pendingSync.length > 0) {
        syncPendingData();
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setSyncStatus('offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [pendingSync, syncPendingData]);

  // Auto-sync on game changes
  useEffect(() => {
    if (websocket && syncStatus === 'connected') {
      broadcastUpdate('game_update', {
        ourInnings,
        theirInnings,
        currentInning,
        processedRoster,
        isTopInning,
        scoringLocation,
        game
      });
    }
  }, [ourInnings, theirInnings, currentInning, isTopInning, scoringLocation, websocket, syncStatus, broadcastUpdate]);

  // 📊 Advanced Performance Metrics Functions
  const calculatePlayerMetrics = useCallback((playerId) => {
    if (!processedRoster.length) return {};

    const player = processedRoster.find(p => p.id === playerId);
    if (!player) return {};

    // Calculate advanced batting metrics
    const atBats = player.atBats || 0;
    const hits = player.hits || 0;
    const singles = player.singles || 0;
    const doubles = player.doubles || 0;
    const triples = player.triples || 0;
    const homeRuns = player.homeRuns || 0;
    const walks = player.walks || 0;
    const strikeouts = player.strikeouts || 0;
    const rbis = player.rbis || 0;
    const stolenBases = player.stolenBases || 0;

    // Advanced calculations
    const battingAverage = atBats > 0 ? (hits / atBats) : 0;
    const onBasePercentage = (atBats + walks) > 0 ? ((hits + walks) / (atBats + walks)) : 0;
    const sluggingPercentage = atBats > 0 ? (
      (singles + 2 * doubles + 3 * triples + 4 * homeRuns) / atBats
    ) : 0;
    const ops = onBasePercentage + sluggingPercentage;
    
    // Rate stats
    const strikeoutRate = atBats > 0 ? (strikeouts / atBats) : 0;
    const walkRate = (atBats + walks) > 0 ? (walks / (atBats + walks)) : 0;
    const babip = atBats > 0 ? ((hits - homeRuns) / (atBats - strikeouts - homeRuns + 0.4 * walks)) : 0;

    // Production metrics
    const rc = (hits + walks) * ((totalBases || 0) + (stolenBases * 0.6)) / (atBats + walks + 0.7 * walks);
    const wOBA = 0.69 * walks + 0.87 * singles + 1.16 * doubles + 1.52 * triples + 1.94 * homeRuns;
    const wOBA_rate = (atBats + walks) > 0 ? (wOBA / (atBats + walks)) : 0;

    return {
      basic: {
        battingAverage,
        onBasePercentage,
        sluggingPercentage,
        ops
      },
      advanced: {
        strikeoutRate,
        walkRate,
        babip,
        isoP: sluggingPercentage - battingAverage,
        isoD: onBasePercentage - battingAverage
      },
      production: {
        rc,
        wOBA: wOBA_rate,
        runsCreatedPer27: rc * 27 / (atBats + walks),
        xr: (singles * 0.5) + (doubles * 0.72) + (triples * 1.04) + (homeRuns * 1.44) + 
            (walks * 0.32) + (stolenBases * 0.18) - (strikeouts * 0.09)
      },
      counts: {
        atBats,
        hits,
        walks,
        strikeouts,
        rbis,
        stolenBases
      }
    };
  }, [processedRoster]);

  const calculateTeamMetrics = useCallback(() => {
    if (!processedRoster.length) return {};

    const teamStats = processedRoster.reduce((acc, player) => {
      const metrics = calculatePlayerMetrics(player.id);
      return {
        totalAtBats: acc.totalAtBats + (metrics.counts?.atBats || 0),
        totalHits: acc.totalHits + (metrics.counts?.hits || 0),
        totalWalks: acc.totalWalks + (metrics.counts?.walks || 0),
        totalStrikeouts: acc.totalStrikeouts + (metrics.counts?.strikeouts || 0),
        totalRBIs: acc.totalRBIs + (metrics.counts?.rbis || 0),
        totalStolenBases: acc.totalStolenBases + (metrics.counts?.stolenBases || 0),
        totalBases: acc.totalBases + (
          (player.singles || 0) + 2 * (player.doubles || 0) + 
          3 * (player.triples || 0) + 4 * (player.homeRuns || 0)
        ),
        opsSum: acc.opsSum + (metrics.basic?.ops || 0),
        playersWithAB: acc.playersWithAB + ((metrics.counts?.atBats || 0) > 0 ? 1 : 0)
      };
    }, {
      totalAtBats: 0, totalHits: 0, totalWalks: 0, totalStrikeouts: 0,
      totalRBIs: 0, totalStolenBases: 0, totalBases: 0, opsSum: 0, playersWithAB: 0
    });

    const teamBattingAverage = teamStats.totalAtBats > 0 ? (teamStats.totalHits / teamStats.totalAtBats) : 0;
    const teamOnBasePercentage = (teamStats.totalAtBats + teamStats.totalWalks) > 0 ? 
      ((teamStats.totalHits + teamStats.totalWalks) / (teamStats.totalAtBats + teamStats.totalWalks)) : 0;
    const teamSluggingPercentage = teamStats.totalAtBats > 0 ? (teamStats.totalBases / teamStats.totalAtBats) : 0;
    const teamOPS = teamOnBasePercentage + teamSluggingPercentage;
    const avgOPS = teamStats.playersWithAB > 0 ? (teamStats.opsSum / teamStats.playersWithAB) : 0;

    return {
      offensive: {
        battingAverage: teamBattingAverage,
        onBasePercentage: teamOnBasePercentage,
        sluggingPercentage: teamSluggingPercentage,
        ops: teamOPS,
        avgOPS,
        runsPerGame: (sumRuns(ourInnings) / Math.max(1, ourInnings.filter(i => i > 0).length)).toFixed(2)
      },
      discipline: {
        walkRate: (teamStats.totalAtBats + teamStats.totalWalks) > 0 ? 
          (teamStats.totalWalks / (teamStats.totalAtBats + teamStats.totalWalks)) : 0,
        strikeoutRate: teamStats.totalAtBats > 0 ? (teamStats.totalStrikeouts / teamStats.totalAtBats) : 0,
        bbKRatio: teamStats.totalStrikeouts > 0 ? (teamStats.totalWalks / teamStats.totalStrikeouts) : 0
      },
      production: {
        rbiPerAB: teamStats.totalAtBats > 0 ? (teamStats.totalRBIs / teamStats.totalAtBats) : 0,
        sbRate: (teamStats.totalAtBats + teamStats.totalWalks) > 0 ? 
          (teamStats.totalStolenBases / (teamStats.totalAtBats + teamStats.totalWalks)) : 0,
        powerFactor: teamStats.totalHits > 0 ? (teamStats.totalBases / teamStats.totalHits) : 0
      },
      totals: teamStats
    };
  }, [processedRoster, calculatePlayerMetrics, ourInnings]);

  const generatePredictiveAnalytics = useCallback(() => {
    const teamMetrics = calculateTeamMetrics();
    const playerProjections = {};

    processedRoster.forEach(player => {
      const metrics = calculatePlayerMetrics(player.id);
      if (metrics.counts?.atBats > 10) { // Only project players with sufficient data
        // Simple projection based on current performance
        const projectedAB = Math.max(metrics.counts.atBats, 100);
        const projectedHits = Math.round(metrics.basic.battingAverage * projectedAB);
        const projectedWalks = Math.round(metrics.advanced.walkRate * projectedAB * 1.2);
        const projectedStrikeouts = Math.round(metrics.advanced.strikeoutRate * projectedAB);
        const projectedRBIs = Math.round(metrics.production.rc * 1.5);

        playerProjections[player.id] = {
          current: metrics.basic,
          projected: {
            battingAverage: metrics.basic.battingAverage * (0.9 + Math.random() * 0.2), // +/- 10%
            onBasePercentage: metrics.basic.onBasePercentage * (0.9 + Math.random() * 0.2),
            sluggingPercentage: metrics.basic.sluggingPercentage * (0.9 + Math.random() * 0.2),
            ops: metrics.basic.ops * (0.9 + Math.random() * 0.2),
            counts: {
              atBats: projectedAB,
              hits: projectedHits,
              walks: projectedWalks,
              strikeouts: projectedStrikeouts,
              rbis: projectedRBIs
            }
          },
          confidence: Math.min(0.95, metrics.counts.atBats / 100), // Confidence based on sample size
          trend: Math.random() > 0.5 ? 'improving' : 'declining' // Mock trend
        };
      }
    });

    // Team projections
    const teamProjection = {
      current: teamMetrics.offensive,
      projected: {
        battingAverage: teamMetrics.offensive.battingAverage * (0.95 + Math.random() * 0.1),
        onBasePercentage: teamMetrics.offensive.onBasePercentage * (0.95 + Math.random() * 0.1),
        sluggingPercentage: teamMetrics.offensive.sluggingPercentage * (0.95 + Math.random() * 0.1),
        ops: teamMetrics.offensive.ops * (0.95 + Math.random() * 0.1),
        runsPerGame: parseFloat(teamMetrics.offensive.runsPerGame) * (0.95 + Math.random() * 0.1)
      },
      winProbability: 0.5 + (teamMetrics.offensive.ops - 0.7) * 2, // Mock win probability
      playoffProbability: Math.min(0.95, Math.max(0.05, 0.5 + (teamMetrics.offensive.ops - 0.65) * 3))
    };

    return {
      playerProjections,
      teamProjection,
      generatedAt: new Date().toISOString()
    };
  }, [calculateTeamMetrics, calculatePlayerMetrics, processedRoster]);

  const generatePerformanceTrends = useCallback(() => {
    // Generate mock trend data over time
    const trends = [];
    const now = new Date();
    
    for (let i = 30; i >= 0; i -= 3) { // Every 3 days for last 30 days
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      const trendData = {
        date: date.toISOString().split('T')[0],
        teamMetrics: {
          battingAverage: 0.25 + Math.random() * 0.1,
          onBasePercentage: 0.32 + Math.random() * 0.08,
          sluggingPercentage: 0.38 + Math.random() * 0.12,
          ops: 0.70 + Math.random() * 0.15
        },
        gamesPlayed: Math.floor(Math.random() * 4) + 1,
        streak: Math.random() > 0.5 ? 'W' : 'L'
      };
      
      trends.push(trendData);
    }
    
    return trends;
  }, []);

  const generateComparisonData = useCallback(() => {
    const teamMetrics = calculateTeamMetrics();
    
    // Mock league averages and percentiles
    const leagueAverages = {
      battingAverage: 0.245,
      onBasePercentage: 0.315,
      sluggingPercentage: 0.395,
      ops: 0.710
    };

    const calculatePercentile = (value, average, stdDev = 0.05) => {
      const zScore = (value - average) / stdDev;
      return Math.min(99, Math.max(1, Math.round(50 + zScore * 15)));
    };

    return {
      teamVsLeague: {
        battingAverage: {
          team: teamMetrics.offensive.battingAverage,
          league: leagueAverages.battingAverage,
          percentile: calculatePercentile(teamMetrics.offensive.battingAverage, leagueAverages.battingAverage)
        },
        onBasePercentage: {
          team: teamMetrics.offensive.onBasePercentage,
          league: leagueAverages.onBasePercentage,
          percentile: calculatePercentile(teamMetrics.offensive.onBasePercentage, leagueAverages.onBasePercentage)
        },
        sluggingPercentage: {
          team: teamMetrics.offensive.sluggingPercentage,
          league: leagueAverages.sluggingPercentage,
          percentile: calculatePercentile(teamMetrics.offensive.sluggingPercentage, leagueAverages.sluggingPercentage)
        },
        ops: {
          team: teamMetrics.offensive.ops,
          league: leagueAverages.ops,
          percentile: calculatePercentile(teamMetrics.offensive.ops, leagueAverages.ops)
        }
      },
      playerRankings: processedRoster
        .map(player => ({
          id: player.id,
          name: `${player.firstName} ${player.lastName}`,
          metrics: calculatePlayerMetrics(player.id),
          rank: Math.floor(Math.random() * 50) + 1 // Mock ranking
        }))
        .filter(p => p.metrics.counts?.atBats > 0)
        .sort((a, b) => b.metrics.basic.ops - a.metrics.basic.ops)
        .slice(0, 10)
    };
  }, [calculateTeamMetrics, calculatePlayerMetrics, processedRoster]);

  const loadAdvancedMetrics = useCallback(async () => {
    setMetricsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Calculate all metrics
      const newPlayerMetrics = {};
      processedRoster.forEach(player => {
        newPlayerMetrics[player.id] = calculatePlayerMetrics(player.id);
      });
      
      setPlayerMetrics(newPlayerMetrics);
      setTeamMetrics(calculateTeamMetrics());
      setPredictiveAnalytics(generatePredictiveAnalytics());
      setPerformanceTrends(generatePerformanceTrends());
      setComparisonData(generateComparisonData());
      
    } catch (error) {
      console.error('Failed to load advanced metrics:', error);
    } finally {
      setMetricsLoading(false);
    }
  }, [processedRoster, calculatePlayerMetrics, calculateTeamMetrics, generatePredictiveAnalytics, generatePerformanceTrends, generateComparisonData]);

  // Load metrics when panel is opened
  useEffect(() => {
    if (showAdvancedMetrics && Object.keys(playerMetrics).length === 0) {
      loadAdvancedMetrics();
    }
  }, [showAdvancedMetrics, playerMetrics, loadAdvancedMetrics]);

  // 🎯 Player Development Tracking Functions
  const calculatePlayerDevelopment = useCallback((playerId) => {
    const player = processedRoster.find(p => p.id === playerId);
    if (!player) return {};

    const currentMetrics = calculatePlayerMetrics(playerId);
    const historicalData = generateMockHistoricalData(playerId);
    
    // Calculate skill progressions
    const hittingProgress = calculateSkillProgression(historicalData, 'hitting');
    const fieldingProgress = calculateSkillProgression(historicalData, 'fielding');
    const baseRunningProgress = calculateSkillProgression(historicalData, 'baseRunning');
    
    // Identify strengths and weaknesses
    const strengths = identifyStrengths(currentMetrics);
    const weaknesses = identifyWeaknesses(currentMetrics);
    
    // Generate development recommendations
    const recommendations = generateDevelopmentRecommendations(currentMetrics, weaknesses);
    
    return {
      playerId,
      playerName: `${player.firstName} ${player.lastName}`,
      currentMetrics,
      historicalData,
      skillProgress: {
        hitting: hittingProgress,
        fielding: fieldingProgress,
        baseRunning: baseRunningProgress
      },
      strengths,
      weaknesses,
      recommendations,
      overallProgress: calculateOverallProgress(hittingProgress, fieldingProgress, baseRunningProgress),
      lastUpdated: new Date().toISOString()
    };
  }, [processedRoster, calculatePlayerMetrics]);

  const generateMockHistoricalData = useCallback((playerId) => {
    const data = [];
    const now = new Date();
    
    for (let i = 12; i >= 0; i--) { // Last 12 months
      const date = new Date(now);
      date.setMonth(date.getMonth() - i);
      
      data.push({
        date: date.toISOString().split('T')[0],
        battingAverage: 0.200 + Math.random() * 0.200,
        onBasePercentage: 0.280 + Math.random() * 0.150,
        sluggingPercentage: 0.300 + Math.random() * 0.250,
        fieldingPercentage: 0.900 + Math.random() * 0.095,
        stolenBases: Math.floor(Math.random() * 5),
        errors: Math.floor(Math.random() * 3),
        gamesPlayed: Math.floor(Math.random() * 15) + 5
      });
    }
    
    return data;
  }, []);

  const calculateSkillProgression = useCallback((historicalData, skillType) => {
    if (historicalData.length < 2) return { trend: 'stable', change: 0, trajectory: [] };
    
    const recent = historicalData.slice(-3); // Last 3 months
    const older = historicalData.slice(-6, -3); // Previous 3 months
    
    let recentAvg = 0;
    let olderAvg = 0;
    
    switch (skillType) {
      case 'hitting':
        recentAvg = recent.reduce((sum, d) => sum + d.battingAverage, 0) / recent.length;
        olderAvg = older.reduce((sum, d) => sum + d.battingAverage, 0) / older.length;
        break;
      case 'fielding':
        recentAvg = recent.reduce((sum, d) => sum + d.fieldingPercentage, 0) / recent.length;
        olderAvg = older.reduce((sum, d) => sum + d.fieldingPercentage, 0) / older.length;
        break;
      case 'baseRunning':
        recentAvg = recent.reduce((sum, d) => sum + d.stolenBases, 0) / recent.length;
        olderAvg = older.reduce((sum, d) => sum + d.stolenBases, 0) / older.length;
        break;
    }
    
    const change = recentAvg - olderAvg;
    let trend = 'stable';
    
    if (Math.abs(change) > 0.02) {
      trend = change > 0 ? 'improving' : 'declining';
    }
    
    return {
      trend,
      change,
      trajectory: historicalData.map(d => ({
        date: d.date,
        value: skillType === 'hitting' ? d.battingAverage : 
               skillType === 'fielding' ? d.fieldingPercentage : 
               d.stolenBases
      }))
    };
  }, []);

  const identifyStrengths = useCallback((metrics) => {
    const strengths = [];
    
    if (metrics.basic?.battingAverage > 0.300) {
      strengths.push({ type: 'hitting', metric: 'Batting Average', value: metrics.basic.battingAverage, level: 'excellent' });
    }
    
    if (metrics.basic?.onBasePercentage > 0.380) {
      strengths.push({ type: 'discipline', metric: 'On-Base Percentage', value: metrics.basic.onBasePercentage, level: 'excellent' });
    }
    
    if (metrics.advanced?.walkRate > 0.10) {
      strengths.push({ type: 'discipline', metric: 'Plate Discipline', value: metrics.advanced.walkRate, level: 'excellent' });
    }
    
    if (metrics.basic?.sluggingPercentage > 0.450) {
      strengths.push({ type: 'power', metric: 'Power Hitting', value: metrics.basic.sluggingPercentage, level: 'excellent' });
    }
    
    return strengths;
  }, []);

  const identifyWeaknesses = useCallback((metrics) => {
    const weaknesses = [];
    
    if (metrics.basic?.battingAverage < 0.250) {
      weaknesses.push({ type: 'hitting', metric: 'Batting Average', value: metrics.basic.battingAverage, priority: 'high' });
    }
    
    if (metrics.advanced?.strikeoutRate > 0.25) {
      weaknesses.push({ type: 'discipline', metric: 'Strikeout Rate', value: metrics.advanced.strikeoutRate, priority: 'high' });
    }
    
    if (metrics.basic?.onBasePercentage < 0.320) {
      weaknesses.push({ type: 'discipline', metric: 'On-Base Percentage', value: metrics.basic.onBasePercentage, priority: 'medium' });
    }
    
    if (metrics.basic?.sluggingPercentage < 0.350) {
      weaknesses.push({ type: 'power', metric: 'Power Hitting', value: metrics.basic.sluggingPercentage, priority: 'medium' });
    }
    
    return weaknesses;
  }, []);

  const generateDevelopmentRecommendations = useCallback((metrics, weaknesses) => {
    const recommendations = [];
    
    weaknesses.forEach(weakness => {
      switch (weakness.metric) {
        case 'Batting Average':
          recommendations.push({
            category: 'hitting',
            title: 'Improve Bat Contact',
            description: 'Focus on tee work and soft toss drills to improve bat-to-ball contact',
            exercises: ['Tee work (100 reps daily)', 'Soft toss drills', 'Bat speed training'],
            timeframe: '4-6 weeks',
            priority: weakness.priority
          });
          break;
          
        case 'Strikeout Rate':
          recommendations.push({
            category: 'discipline',
            title: 'Reduce Strikeouts',
            description: 'Work on two-strike approach and pitch recognition',
            exercises: ['Two-strike hitting drills', 'Pitch recognition training', 'Opposite field hitting'],
            timeframe: '3-4 weeks',
            priority: weakness.priority
          });
          break;
          
        case 'On-Base Percentage':
          recommendations.push({
            category: 'discipline',
            title: 'Improve Plate Discipline',
            description: 'Focus on taking walks and working counts',
            exercises: ['Count awareness drills', 'Taking pitches practice', 'Situational hitting'],
            timeframe: '4-5 weeks',
            priority: weakness.priority
          });
          break;
          
        case 'Power Hitting':
          recommendations.push({
            category: 'power',
            title: 'Increase Power Output',
            description: 'Develop strength and improve swing mechanics for more power',
            exercises: ['Strength training', 'Mechanical adjustments', 'Launch angle optimization'],
            timeframe: '6-8 weeks',
            priority: weakness.priority
          });
          break;
      }
    });
    
    return recommendations;
  }, []);

  const calculateOverallProgress = useCallback((hitting, fielding, baseRunning) => {
    const scores = [];
    
    if (hitting.trend === 'improving') scores.push(1);
    else if (hitting.trend === 'stable') scores.push(0.5);
    else scores.push(0);
    
    if (fielding.trend === 'improving') scores.push(1);
    else if (fielding.trend === 'stable') scores.push(0.5);
    else scores.push(0);
    
    if (baseRunning.trend === 'improving') scores.push(1);
    else if (baseRunning.trend === 'stable') scores.push(0.5);
    else scores.push(0);
    
    const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    
    return {
      score: average,
      level: average >= 0.8 ? 'excellent' : average >= 0.6 ? 'good' : average >= 0.4 ? 'fair' : 'needs_improvement',
      trend: average >= 0.6 ? 'positive' : 'needs_attention'
    };
  }, []);

  const addDevelopmentGoal = useCallback((playerId, goalData) => {
    const newGoal = {
      id: Date.now(),
      playerId,
      ...goalData,
      status: 'active',
      progress: 0,
      createdAt: new Date().toISOString(),
      milestones: []
    };
    
    setDevelopmentGoals(prev => ({
      ...prev,
      [playerId]: [...(prev[playerId] || []), newGoal]
    }));
    
    // Add achievement for setting goals
    addAchievement(playerId, 'goal_setter', 'First Development Goal Set');
  }, []);

  const updateGoalProgress = useCallback((playerId, goalId, progress) => {
    setDevelopmentGoals(prev => ({
      ...prev,
      [playerId]: prev[playerId].map(goal => 
        goal.id === goalId 
          ? { ...goal, progress, lastUpdated: new Date().toISOString() }
          : goal
      )
    }));
    
    // Check for goal completion
    if (progress >= 100) {
      addAchievement(playerId, 'goal_achiever', 'Development Goal Completed');
    }
  }, []);

  const addAchievement = useCallback((playerId, achievementType, description) => {
    const newAchievement = {
      id: Date.now(),
      type: achievementType,
      description,
      unlockedAt: new Date().toISOString(),
      icon: getAchievementIcon(achievementType)
    };
    
    setAchievementSystem(prev => ({
      ...prev,
      [playerId]: [...(prev[playerId] || []), newAchievement]
    }));
  }, []);

  const getAchievementIcon = useCallback((type) => {
    const icons = {
      goal_setter: '🎯',
      goal_achiever: '🏆',
      streak_holder: '🔥',
      improvement_leader: '📈',
      team_player: '🤝',
      defensive_star: '⭐',
      power_hitter: '💪',
      speed_demon: '⚡'
    };
    return icons[type] || '🎖️';
  }, []);

  const loadPlayerDevelopmentData = useCallback(async () => {
    setDevelopmentLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      const developmentData = {};
      processedRoster.forEach(player => {
        developmentData[player.id] = calculatePlayerDevelopment(player.id);
      });
      
      setPlayerDevelopmentData(developmentData);
      
      // Load existing goals and achievements (mock data)
      const mockGoals = {};
      const mockAchievements = {};
      
      processedRoster.forEach(player => {
        mockGoals[player.id] = [
          {
            id: 1,
            title: 'Improve Batting Average',
            category: 'hitting',
            target: '0.300',
            current: '0.275',
            progress: 75,
            deadline: '2026-07-01',
            status: 'active'
          }
        ];
        
        mockAchievements[player.id] = [
          {
            id: 1,
            type: 'improvement_leader',
            description: 'Most Improved Player',
            unlockedAt: new Date().toISOString(),
            icon: '📈'
          }
        ];
      });
      
      setDevelopmentGoals(mockGoals);
      setAchievementSystem(mockAchievements);
      
    } catch (error) {
      console.error('Failed to load player development data:', error);
    } finally {
      setDevelopmentLoading(false);
    }
  }, [processedRoster, calculatePlayerDevelopment]);

  // Load development data when panel is opened
  useEffect(() => {
    if (showPlayerDevelopment && Object.keys(playerDevelopmentData).length === 0) {
      loadPlayerDevelopmentData();
    }
  }, [showPlayerDevelopment, playerDevelopmentData, loadPlayerDevelopmentData]);

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
      // Walk-off: home team scores in bottom half to go ahead in 7th+ with 2 outs
      const newOurScore = ourLiveScore + runs;
      if (!isTopInning && currentInning >= 7 && newOurScore > theirLiveScore && scoringLocation !== 'Away') {
        setTimeout(() => { setGameOverReason('Walk-off!'); setGameOver(true); }, 300);
      }
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
    // Capture runs this half before clearing state
    const runsThisHalf = isTopInning ? ourLiveScore : theirLiveScore;
    setInningBreak({ runsThisHalf, wasTop: isTopInning, inning: currentInning });
  };

  const confirmInningBreak = () => {
    // Mercy rule check: 10+ run lead after 4+ innings
    const runDiff = Math.abs(ourLiveScore - theirLiveScore);
    if (currentInning >= 4 && runDiff >= 10) {
      const leader = ourLiveScore > theirLiveScore ? (teamDisplayName || 'Us') : (scoringOpponent || 'Opp');
      setGameOverReason(`Mercy rule — ${leader} leads by ${runDiff}`);
      setGameOver(true);
      setInningBreak(null);
      return;
    }
    setInningBreak(null);
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

  const recordRunnerAdvance = async (type) => {
    if (!user) return;
    // Advance the lead runner one base (closest to scoring first)
    let label = type;
    if (type === 'WP' || type === 'PB' || type === 'SB') {
      if (runnerOnThird) {
        setRunnerOnThird(false);
        addRunsToCurrentFrame(1);
        label = `${type} — runner scores from 3rd`;
      } else if (runnerOnSecond) {
        setRunnerOnSecond(false);
        setRunnerOnThird(true);
        label = `${type} — runner advances to 3rd`;
      } else if (runnerOnFirst) {
        setRunnerOnFirst(false);
        setRunnerOnSecond(true);
        label = `${type} — runner advances to 2nd`;
      } else {
        label = `${type} — no runners on base`;
      }
    }
    setLastPlaySummary(label);
    await logScoringEvent('defensive_play', { result: type.toLowerCase(), label, notation: type, outsAfter: outs });
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
        await authenticatedPost(`/api/games/${liveGameId}/state`, {
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
        // Offline fallback: mirror to localStorage
        try {
          localStorage.setItem(`gc_game_${liveGameId}`, JSON.stringify({
            inning: currentInning, half: isTopInning ? 'top' : 'bottom',
            balls, strikes, outs, pitchCount, currentBatter, currentPitcher,
            runners: { first: runnerOnFirst, second: runnerOnSecond, third: runnerOnThird },
            ourInnings, theirInnings, ourHits, theirHits, ourErrors, theirErrors,
            opponentName: scoringOpponent, location: scoringLocation, gameType: scoringType,
            savedAt: Date.now()
          }));
        } catch (_) {}
      } catch (error) {
        console.error(error);
        setSyncStatus('Offline — saved locally');
        try {
          localStorage.setItem(`gc_game_${liveGameId}`, JSON.stringify({
            inning: currentInning, half: isTopInning ? 'top' : 'bottom',
            balls, strikes, outs, pitchCount, currentBatter, currentPitcher,
            runners: { first: runnerOnFirst, second: runnerOnSecond, third: runnerOnThird },
            ourInnings, theirInnings, ourHits, theirHits, ourErrors, theirErrors,
            opponentName: scoringOpponent, location: scoringLocation, gameType: scoringType,
            savedAt: Date.now()
          }));
        } catch (_) {}
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

  // Game clock ticker
  useEffect(() => {
    if (gameClockRunning) {
      gameClockRef.current = setInterval(() => setGameClockMs(ms => ms + 1000), 1000);
    } else {
      clearInterval(gameClockRef.current);
    }
    return () => clearInterval(gameClockRef.current);
  }, [gameClockRunning]);

  const formatClock = (ms) => {
    const totalSec = Math.floor(ms / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  };

  const advanceBatterInLineup = () => {
    if (!lineupEntries || lineupEntries.length === 0) return;
    const nextIdx = (lineupBatterIndex + 1) % lineupEntries.length;
    setLineupBatterIndex(nextIdx);
    const nextBatter = lineupEntries[nextIdx];
    if (nextBatter) {
      const name = [nextBatter.firstName, nextBatter.lastName].filter(Boolean).join(' ') || nextBatter.name || '';
      if (name) setCurrentBatter(name);
    }
  };

  const recordPitch = async (result) => {
    if (!user) return;
    if (pitchCount === 0) markCurrentGameLiveOnSchedule();

    const pitch = pitchResults.find((item) => item.result === result);
    const before = { balls, strikes, outs };
    let nextBalls = balls;
    let nextStrikes = strikes;
    let nextOuts = outs;
    let autoResult = null; // 'walk' or 'strikeout'

    // Enhanced pitch tracking data
    const pitchData = {
      type: pitchType,
      result,
      velocity: pitchVelo ? Number(pitchVelo) : null,
      location: pitchLocation,
      count: { balls, strikes },
      timestamp: new Date().toISOString(),
      pitcher: currentPitcher,
      batter: currentBatter,
      inning: currentInning,
      isTopInning
    };

    if (result === 'ball') {
      if (balls === 3) {
        // Auto-walk
        autoResult = 'walk';
        nextBalls = 0;
        nextStrikes = 0;
        setPitcherStats(prev => ({ ...prev, bbCount: prev.bbCount + 1 }));
      } else {
        nextBalls = balls + 1;
      }
      setPitcherStats(prev => ({ ...prev, balls: prev.balls + 1 }));
    }
    if (result === 'called_strike' || result === 'swinging_strike') {
      if (strikes === 2) {
        // Auto-strikeout
        autoResult = 'strikeout';
        nextStrikes = 0;
        nextBalls = 0;
        nextOuts = Math.min(3, outs + 1);
        setPitcherStats(prev => ({ ...prev, kCount: prev.kCount + 1 }));
      } else {
        nextStrikes = strikes + 1;
      }
      setPitcherStats(prev => ({ ...prev, strikes: prev.strikes + 1 }));
      setPitchResult(result === 'called_strike' ? 'looking' : 'swinging');
    }
    if (result === 'foul' && strikes < 2) {
      nextStrikes = strikes + 1;
      setPitchResult('foul');
    }
    if (['in_play', 'hit_by_pitch'].includes(result)) {
      nextBalls = 0;
      nextStrikes = 0;
      setPitchResult('contact');
    }
    if (result === 'hit_by_pitch') {
      // Treat like walk for baserunners
      autoResult = 'hbp';
      setPitcherStats(prev => ({ ...prev, bbCount: prev.bbCount + 1 }));
    }

    setBalls(nextBalls);
    setStrikes(nextStrikes);
    setOuts(nextOuts);
    setPitchCount((count) => {
      const next = count + 1;
      if (next >= pitchHardLimit) setPitchAlert('limit');
      else if (next >= pitchWarningLimit) setPitchAlert('warning');
      return next;
    });
    
    // Enhanced pitch logging
    setPitchLog(prev => [...prev, pitchData]);
    setCurrentPASequence(prev => [...prev, { type: pitchType, result, balls, strikes }]);
    setAtBatCount(prev => prev + 1);

    if (autoResult === 'walk' || autoResult === 'hbp') {
      applyWalkOrHitByPitch();
      advanceBatterInLineup();
      setScoringWorkflowStep('pitch');
      setLastPlaySummary(autoResult === 'hbp' ? `HBP — ${currentBatter || 'batter'} takes first.` : `Walk — ${currentBatter || 'batter'} takes first.`);
      advanceHalfInningIfNeeded(nextOuts);
    } else if (autoResult === 'strikeout') {
      advanceBatterInLineup();
      setScoringWorkflowStep('pitch');
      setLastPlaySummary(`Strikeout — ${currentBatter || 'batter'} out.`);
      advanceHalfInningIfNeeded(nextOuts);
    } else {
      setScoringWorkflowStep(result === 'in_play' ? 'result' : 'pitch');
      setLastPlaySummary(`${pitch?.label || result} recorded for ${currentBatter || 'current batter'}.`);
      advanceHalfInningIfNeeded(nextOuts);
    }

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

      // Compute proposed runner state for the confirm toast
      let pFirst = false, pSecond = false, pThird = false;
      if (bases === 4) { pFirst = false; pSecond = false; pThird = false; }
      else if (bases === 3) { pFirst = false; pSecond = false; pThird = true; }
      else if (bases === 2) { pFirst = false; pSecond = true; pThird = runnerOnFirst; }
      else { pFirst = true; pSecond = runnerOnFirst; pThird = runnerOnSecond; }

      runsScored = applyHitAdvancement(bases);
      clearCount();

      // Show runner confirm toast (auto-dismiss after 4s)
      if (runnerToast?.timer) clearTimeout(runnerToast.timer);
      const timer = setTimeout(() => setRunnerToast(null), 4000);
      setRunnerToast({ first: pFirst, second: pSecond, third: pThird, label: outcome.label, timer });
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

    // Auto-populate spray chart dot — realistic zones per outcome
    (() => {
      const rand = (min, max) => (Math.random() * (max - min) + min).toFixed(1);
      // Fan field SVG: home plate at bottom-center (50%, ~97%), outfield top ~3%
      // x=0 is left foul, x=100 is right foul; y=0 is outfield wall, y=100 is home plate
      const zones = {
        single:         () => ({ x: rand(25, 75), y: rand(48, 68) }),  // shallow outfield / gap
        double:         () => ({ x: rand(15, 85), y: rand(28, 50) }),  // deep gap
        triple:         () => ({ x: rand(10, 90), y: rand(15, 35) }),  // warning track
        home_run:       () => ({ x: rand(20, 80), y: rand(5, 22)  }),  // over wall
        groundout:      () => ({ x: rand(30, 70), y: rand(68, 85) }),  // infield
        flyout:         () => ({ x: rand(20, 80), y: rand(35, 58) }),  // outfield
        lineout:        () => ({ x: rand(25, 75), y: rand(50, 68) }),  // shallow / line drives
        sac_fly:        () => ({ x: rand(15, 85), y: rand(32, 52) }),  // deep outfield
        fielder_choice: () => ({ x: rand(30, 70), y: rand(65, 82) }),  // infield
        error:          () => ({ x: rand(28, 72), y: rand(58, 78) }),  // infield / short hop
      };
      const zone = zones[outcome.result];
      if (!zone) return;
      const { x, y } = zone();
      const batter = currentBatter || 'Unknown';
      setSprayDots(prev => [...prev, { x, y, result: outcome.result, batter, id: Date.now() }]);
    })();

    advanceBatterInLineup();
    setScoringWorkflowStep('pitch');
    setLastPlaySummary(broadcastCall(outcome, currentBatter, runsScored, currentInning, isTopInning, teamDisplayName, scoringOpponent));

    const pitchSeq = [...currentPASequence];
    setCurrentPASequence([]);

    await logScoringEvent('plate_appearance', {
      result: outcome.result,
      label: outcome.label,
      notation: outcome.notation,
      runsScored,
      outsAfter: nextOuts,
      pitchSequence: pitchSeq,
    });
  };

  const recordError = async (position) => {
    if (!user) return;
    const notation = `E${position}`;
    const posNames = { 1:'P', 2:'C', 3:'1B', 4:'2B', 5:'3B', 6:'SS', 7:'LF', 8:'CF', 9:'RF' };
    const label = `Error — ${posNames[position] || position} (${notation})`;
    if (isOurTeamBatting()) setTheirErrors(e => e + 1);
    else setOurErrors(e => e + 1);
    setLastPlaySummary(label);
    setErrorModal(false);
    await logScoringEvent('defensive_play', { result: 'error', label, notation, position, outsAfter: outs });
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

  const recordOppPA = async (outcome) => {
    if (!user) return;
    const isHitOutcome = ['single','double','triple','home_run'].includes(outcome.result);
    const isOutcome = ['groundout','flyout','strikeout','lineout','pop_out'].includes(outcome.result);
    const isWalk = ['walk','hit_by_pitch'].includes(outcome.result);

    let nextOuts = outs;
    if (isOutcome) {
      nextOuts = outs + (outcome.outs || 1);
    }

    // Opp run scoring
    if (outcome.result === 'home_run') {
      const runs = 1 + Number(runnerOnFirst) + Number(runnerOnSecond) + Number(runnerOnThird);
      setTheirInnings(prev => {
        const next = [...prev];
        const idx = Math.max(0, currentInning - 1);
        while (next.length <= idx) next.push(0);
        next[idx] = (next[idx] || 0) + runs;
        return next;
      });
      setRunnerOnFirst(false); setRunnerOnSecond(false); setRunnerOnThird(false);
    } else if (outcome.result === 'single') {
      const scored = Number(runnerOnThird);
      if (scored) setTheirInnings(prev => { const n=[...prev]; const i=Math.max(0,currentInning-1); while(n.length<=i)n.push(0); n[i]=(n[i]||0)+scored; return n; });
      setRunnerOnThird(runnerOnSecond); setRunnerOnSecond(runnerOnFirst); setRunnerOnFirst(true);
    } else if (outcome.result === 'double') {
      const scored = Number(runnerOnSecond) + Number(runnerOnThird);
      if (scored) setTheirInnings(prev => { const n=[...prev]; const i=Math.max(0,currentInning-1); while(n.length<=i)n.push(0); n[i]=(n[i]||0)+scored; return n; });
      setRunnerOnThird(runnerOnFirst); setRunnerOnSecond(true); setRunnerOnFirst(false);
    } else if (outcome.result === 'triple') {
      const scored = Number(runnerOnFirst) + Number(runnerOnSecond) + Number(runnerOnThird);
      if (scored) setTheirInnings(prev => { const n=[...prev]; const i=Math.max(0,currentInning-1); while(n.length<=i)n.push(0); n[i]=(n[i]||0)+scored; return n; });
      setRunnerOnFirst(false); setRunnerOnSecond(false); setRunnerOnThird(true);
    } else if (isWalk) {
      const scored = runnerOnFirst && runnerOnSecond && runnerOnThird ? 1 : 0;
      if (scored) setTheirInnings(prev => { const n=[...prev]; const i=Math.max(0,currentInning-1); while(n.length<=i)n.push(0); n[i]=(n[i]||0)+1; return n; });
      if (runnerOnFirst && runnerOnSecond) setRunnerOnThird(true);
      if (runnerOnFirst) setRunnerOnSecond(true);
      setRunnerOnFirst(true);
    }

    if (isOutcome) { setOuts(nextOuts); setBalls(0); setStrikes(0); }
    else { setBalls(0); setStrikes(0); }

    const label = `Opp ${oppBatterName ? oppBatterName + ' ' : ''}— ${outcome.label}`;
    setLastPlaySummary(label);
    advanceHalfInningIfNeeded(nextOuts);

    await logScoringEvent('plate_appearance', {
      result: outcome.result,
      label,
      notation: outcome.notation || outcome.result,
      batter: oppBatterName || 'Opp',
      isOpponent: true,
      outsAfter: nextOuts,
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

  const captureCurrentState = () => ({
    inning: currentInning, half: isTopInning ? 'top' : 'bottom',
    balls, strikes, outs, pitchCount,
    runners: { first: runnerOnFirst, second: runnerOnSecond, third: runnerOnThird },
    ourInnings: [...ourInnings], theirInnings: [...theirInnings],
    ourHits, theirHits, ourErrors, theirErrors,
    currentBatter, currentPitcher,
    lineupBatterIndex,
  });

  const undoLastPlay = async () => {
    if (!user) return;
    const lastScoringEvent = recentEvents.find((event) => !['correction', 'undo'].includes(event.eventType));

    if (!lastScoringEvent) {
      setPlayLogStatus('No play to undo');
      return;
    }

    // Push current state to redo stack before restoring
    setRedoStack(prev => [...prev, captureCurrentState()]);

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

  const redoLastPlay = () => {
    if (redoStack.length === 0) return;
    const snapshot = redoStack[redoStack.length - 1];
    setRedoStack(prev => prev.slice(0, -1));
    setCurrentInning(snapshot.inning);
    setIsTopInning(snapshot.half !== 'bottom');
    setBalls(snapshot.balls); setStrikes(snapshot.strikes); setOuts(snapshot.outs);
    setPitchCount(snapshot.pitchCount);
    setRunnerOnFirst(snapshot.runners.first); setRunnerOnSecond(snapshot.runners.second); setRunnerOnThird(snapshot.runners.third);
    setOurInnings(snapshot.ourInnings); setTheirInnings(snapshot.theirInnings);
    setOurHits(snapshot.ourHits); setTheirHits(snapshot.theirHits);
    setOurErrors(snapshot.ourErrors); setTheirErrors(snapshot.theirErrors);
    setCurrentBatter(snapshot.currentBatter); setCurrentPitcher(snapshot.currentPitcher);
    setLineupBatterIndex(snapshot.lineupBatterIndex);
    setLastPlaySummary('Redo applied.');
  };

  const substitutePlayer = (slotIdx, newName, newJersey, newPosition) => {
    setLineupEntries(prev => prev.map((entry, i) => i === slotIdx
      ? { ...entry, firstName: newName.split(' ')[0] || '', lastName: newName.split(' ').slice(1).join(' ') || '', jersey: newJersey || entry.jersey, position: newPosition || entry.position, name: newName }
      : entry
    ));
    if (slotIdx === lineupBatterIndex) setCurrentBatter(newName);
    setSubModal(null);
    setLastPlaySummary(`Sub: ${newName} enters at slot ${slotIdx + 1}.`);
  };

  const handleLineupDragStart = (idx) => setDragIdx(idx);
  const handleLineupDragOver = (e, idx) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx) return;
    setLineupEntries(prev => {
      const next = [...prev];
      const [moved] = next.splice(dragIdx, 1);
      next.splice(idx, 0, moved);
      return next;
    });
    if (dragIdx === lineupBatterIndex) setLineupBatterIndex(idx);
    else if (idx === lineupBatterIndex) setLineupBatterIndex(dragIdx);
    setDragIdx(idx);
  };
  const handleLineupDragEnd = () => setDragIdx(null);

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

  const processedRoster = useMemo(() => {
    return currentSeasonData.roster ? currentSeasonData.roster.map(parsePlayerStats) : [];
  }, [currentSeasonData.roster]);
  const rosterById = useMemo(() => {
    return processedRoster.reduce((lookup, player) => {
      lookup[player.id] = player;
      return lookup;
    }, {});
  }, [processedRoster]);
  const activeLineupEntries = useMemo(() => {
    return lineupEntries.length
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
  }, [lineupEntries, rosterById, processedRoster]);
  
  const lineupPlayerIds = useMemo(() => {
    return new Set(activeLineupEntries.map((entry) => entry.playerId));
  }, [activeLineupEntries]);
  const probableLineup = useMemo(() => {
    return activeLineupEntries.map((entry) => ({
      ...entry.player,
      lineupPosition: entry.position,
      battingOrder: entry.battingOrder,
      lineupStatus: entry.status
    }));
  }, [activeLineupEntries]);
  
  const benchPlayers = useMemo(() => {
    return processedRoster.filter((player) => !lineupPlayerIds.has(player.id));
  }, [processedRoster, lineupPlayerIds]);
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

  const reopenFinalGame = (game) => {
    const gameId = game.gameId || `${defaultLiveGameId}-reopen-${game.id || Date.now()}`;
    setLiveGameId(gameId);
    setGameDate(game.date || new Date().toISOString().slice(0, 10));
    setScoringOpponent(game.opponent || '');
    setScoringLocation(game.location || 'Home');
    setScoringType(game.type || 'District');
    setOurInnings(game.ourInnings?.length ? [...game.ourInnings] : [0,0,0,0,0,0,0]);
    setTheirInnings(game.theirInnings?.length ? [...game.theirInnings] : [0,0,0,0,0,0,0]);
    setOurHits(game.ourHits ?? 0);
    setTheirHits(game.theirHits ?? 0);
    setOurErrors(game.ourErrors ?? 0);
    setTheirErrors(game.theirErrors ?? 0);
    setBalls(0); setStrikes(0); setOuts(0); setPitchCount(0);
    setCurrentInning(game.ourInnings?.length || 7);
    setIsTopInning(false);
    setRunnerOnFirst(false); setRunnerOnSecond(false); setRunnerOnThird(false);
    setLastPlaySummary(`Re-opened: ${game.opponent} (${game.date})`);
    setSetupStatus('ready');
    setActiveTab('live-game');
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
        authenticatedPost(`/api/games/${liveGameId}/state`, {
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
        body: JSON.stringify({ tier, billingCycle, couponCode: couponCode.trim() || null })
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

  const openCustomerPortal = async () => {
    if (!user) { setShowAuthModal(true); return; }
    setCheckoutStatus('loading');
    try {
      const token = await user.getIdToken();
      const res = await fetch(`${apiBaseUrl}/create-portal`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not open portal');
      window.location.href = data.url;
    } catch (err) {
      console.error(err);
      setCheckoutStatus('error');
    }
  };

  // Generate a short, memorable referral code (6 chars, uppercase letters + numbers)
  const generateReferralCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  // Ensure user has a referral code; generate if missing
  const ensureReferralCode = async (uid) => {
    try {
      const token = await user.getIdToken();
      const res = await fetch(`${apiBaseUrl}/api/user/referral`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        const data = await res.json();
        setMyReferralCode(data.referralCode);
      }
    } catch (e) {
      console.error('Failed to ensure referral code:', e);
    }
  };

  const subscribeToPushNotifications = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      alert('Push notifications are not supported in this browser.');
      return;
    }
    try {
      const permission = await Notification.requestPermission();
      setNotifPermission(permission);
      if (permission !== 'granted') {
        alert('Please allow notifications to receive game alerts.');
        return;
      }
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: new Uint8Array(atob(import.meta.env.VITE_VAPID_PUBLIC_KEY || '').split('').map(c => c.charCodeAt(0)))
      });
      const token = await user.getIdToken();
      await fetch(`${apiBaseUrl}/api/user/subscribe-push`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription })
      });
      alert('✅ Notifications enabled! You\'ll get alerts for live games.');
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      alert('Failed to enable notifications. Please try again.');
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
    const url = `${window.location.origin}/fan?game=${encodeURIComponent(liveGameId)}`;
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
    { label: 'Enable push notifications', done: notifPermission === 'granted' },
  ];
  const onboardingPct = Math.round((onboardingSteps.filter(s => s.done).length / onboardingSteps.length) * 100);
  const onboardingComplete = onboardingSteps.every(s => s.done);

  return (
    <div className={styles.container}>
      {/* Notification System */}
      <NotificationSystem />
      
      {/* Real-Time Collaboration */}
      {user && activeTab === 'live-game' && (
        <RealTimeCollaboration
          gameId={defaultLiveGameId}
          userId={user.uid}
          userName={user.displayName || user.email}
          onCollaboratorJoin={(data) => {
            window.showNotification?.('info', `${data.userName} joined the game`, 'Collaboration');
          }}
          onCollaboratorLeave={(data) => {
            window.showNotification?.('info', `${data.userName} left the game`, 'Collaboration');
          }}
          onSharedAction={(data) => {
            // Handle shared actions like pitch recording, lineup changes, etc.
            console.log('Shared action:', data);
          }}
        />
      )}

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
        <AnimatedButton 
          variant={activeTab === 'live-game' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('live-game')}
          style={{ 
            backgroundColor: activeTab === 'live-game' ? colors.primary[600] : 'transparent',
            color: activeTab === 'live-game' ? 'white' : colors.neutral[400],
            border: 'none',
            borderRadius: '0.5rem',
            padding: '0.75rem 1rem',
            fontSize: '0.875rem',
            fontWeight: '600',
            transition: transitions.all,
            borderBottom: activeTab === 'live-game' ? `3px solid ${colors.primary[400]}` : '3px solid transparent',
          }}
        >
          🎮 Live Scoring Engine
        </AnimatedButton>
        <AnimatedButton 
          variant={activeTab === 'schedule' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('schedule')}
          style={{ 
            backgroundColor: activeTab === 'schedule' ? colors.primary[600] : 'transparent',
            color: activeTab === 'schedule' ? 'white' : colors.neutral[400],
            border: 'none',
            borderRadius: '0.5rem',
            padding: '0.75rem 1rem',
            fontSize: '0.875rem',
            fontWeight: '600',
            transition: transitions.all,
            borderBottom: activeTab === 'schedule' ? `3px solid ${colors.primary[400]}` : '3px solid transparent',
          }}
        >
          📅 Results &amp; Records
        </AnimatedButton>
        <AnimatedButton 
          variant={activeTab === 'stats' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('stats')}
          style={{ 
            backgroundColor: activeTab === 'stats' ? colors.primary[600] : 'transparent',
            color: activeTab === 'stats' ? 'white' : colors.neutral[400],
            border: 'none',
            borderRadius: '0.5rem',
            padding: '0.75rem 1rem',
            fontSize: '0.875rem',
            fontWeight: '600',
            transition: transitions.all,
            borderBottom: activeTab === 'stats' ? `3px solid ${colors.primary[400]}` : '3px solid transparent',
          }}
        >
          📈 Stat Sheets
        </AnimatedButton>
        <AnimatedButton 
          variant={activeTab === 'scouting' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('scouting')}
          style={{ 
            backgroundColor: activeTab === 'scouting' ? colors.primary[600] : 'transparent',
            color: activeTab === 'scouting' ? 'white' : colors.neutral[400],
            border: 'none',
            borderRadius: '0.5rem',
            padding: '0.75rem 1rem',
            fontSize: '0.875rem',
            fontWeight: '600',
            transition: transitions.all,
            borderBottom: activeTab === 'scouting' ? `3px solid ${colors.primary[400]}` : '3px solid transparent',
          }}
        >
          🔍 Scouting
        </AnimatedButton>
        <AnimatedButton 
          variant={activeTab === 'bracket' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('bracket')}
          style={{ 
            backgroundColor: activeTab === 'bracket' ? colors.primary[600] : 'transparent',
            color: activeTab === 'bracket' ? 'white' : colors.neutral[400],
            border: 'none',
            borderRadius: '0.5rem',
            padding: '0.75rem 1rem',
            fontSize: '0.875rem',
            fontWeight: '600',
            transition: transitions.all,
            borderBottom: activeTab === 'bracket' ? `3px solid ${colors.primary[400]}` : '3px solid transparent',
          }}
        >
          🏆 Bracket
        </AnimatedButton>
        <AnimatedButton 
          variant={activeTab === 'gameday' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('gameday')}
          style={{ 
            backgroundColor: activeTab === 'gameday' ? colors.primary[600] : 'transparent',
            color: activeTab === 'gameday' ? 'white' : colors.neutral[400],
            border: 'none',
            borderRadius: '0.5rem',
            padding: '0.75rem 1rem',
            fontSize: '0.875rem',
            fontWeight: '600',
            transition: transitions.all,
            borderBottom: activeTab === 'gameday' ? `3px solid ${colors.primary[400]}` : '3px solid transparent',
          }}
        >
          📋 Game Day
        </AnimatedButton>
        <AnimatedButton 
          variant={activeTab === 'lineup' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('lineup')}
          style={{ 
            backgroundColor: activeTab === 'lineup' ? colors.primary[600] : 'transparent',
            color: activeTab === 'lineup' ? 'white' : colors.neutral[400],
            border: 'none',
            borderRadius: '0.5rem',
            padding: '0.75rem 1rem',
            fontSize: '0.875rem',
            fontWeight: '600',
            transition: transitions.all,
            borderBottom: activeTab === 'lineup' ? `3px solid ${colors.primary[400]}` : '3px solid transparent',
          }}
        >
          📝 Lineup Builder
        </AnimatedButton>
        <AnimatedButton 
          variant={activeTab === 'changelog' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('changelog')}
          style={{ 
            backgroundColor: activeTab === 'changelog' ? colors.primary[600] : 'transparent',
            color: activeTab === 'changelog' ? 'white' : colors.neutral[400],
            border: 'none',
            borderRadius: '0.5rem',
            padding: '0.75rem 1rem',
            fontSize: '0.875rem',
            fontWeight: '600',
            transition: transitions.all,
            borderBottom: activeTab === 'changelog' ? `3px solid ${colors.primary[400]}` : '3px solid transparent',
          }}
        >
          🆕 What's New
        </AnimatedButton>
        <AnimatedButton 
          variant={activeTab === 'dashboard' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('dashboard')}
          style={{ 
            backgroundColor: activeTab === 'dashboard' ? colors.primary[600] : 'transparent',
            color: activeTab === 'dashboard' ? 'white' : colors.neutral[400],
            border: 'none',
            borderRadius: '0.5rem',
            padding: '0.75rem 1rem',
            fontSize: '0.875rem',
            fontWeight: '600',
            transition: transitions.all,
            borderBottom: activeTab === 'dashboard' ? `3px solid ${colors.primary[400]}` : '3px solid transparent',
          }}
        >
          📊 Dashboard
        </AnimatedButton>
        <AnimatedButton 
          variant={activeTab === 'ai-insights' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('ai-insights')}
          style={{ 
            backgroundColor: activeTab === 'ai-insights' ? colors.primary[600] : 'transparent',
            color: activeTab === 'ai-insights' ? 'white' : colors.neutral[400],
            border: 'none',
            borderRadius: '0.5rem',
            padding: '0.75rem 1rem',
            fontSize: '0.875rem',
            fontWeight: '600',
            transition: transitions.all,
            borderBottom: activeTab === 'ai-insights' ? `3px solid ${colors.primary[400]}` : '3px solid transparent',
          }}
        >
          🤖 AI Insights
        </AnimatedButton>
        <AnimatedButton 
          variant={activeTab === 'admin' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('admin')}
          style={{ 
            backgroundColor: activeTab === 'admin' ? colors.primary[600] : 'transparent',
            color: activeTab === 'admin' ? 'white' : colors.neutral[400],
            border: 'none',
            borderRadius: '0.5rem',
            padding: '0.75rem 1rem',
            fontSize: '0.875rem',
            fontWeight: '600',
            transition: transitions.all,
            borderBottom: activeTab === 'admin' ? `3px solid ${colors.primary[400]}` : '3px solid transparent',
          }}
        >
          🛠️ Admin
        </AnimatedButton>
        <AnimatedButton 
          variant={activeTab === 'gamification' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('gamification')}
          style={{ 
            backgroundColor: activeTab === 'gamification' ? colors.primary[600] : 'transparent',
            color: activeTab === 'gamification' ? 'white' : colors.neutral[400],
            border: 'none',
            borderRadius: '0.5rem',
            padding: '0.75rem 1rem',
            fontSize: '0.875rem',
            fontWeight: '600',
            transition: transitions.all,
            borderBottom: activeTab === 'gamification' ? `3px solid ${colors.primary[400]}` : '3px solid transparent',
          }}
        >
          🎮 Achievements
        </AnimatedButton>
        <AnimatedButton 
          variant={activeTab === 'security' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('security')}
          style={{ 
            backgroundColor: activeTab === 'security' ? colors.primary[600] : 'transparent',
            color: activeTab === 'security' ? 'white' : colors.neutral[400],
            border: 'none',
            borderRadius: '0.5rem',
            padding: '0.75rem 1rem',
            fontSize: '0.875rem',
            fontWeight: '600',
            transition: transitions.all,
            borderBottom: activeTab === 'security' ? `3px solid ${colors.primary[400]}` : '3px solid transparent',
          }}
        >
          🔒 Security
        </AnimatedButton>
        <AnimatedButton 
          variant={activeTab === 'community' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('community')}
          style={{ 
            backgroundColor: activeTab === 'community' ? colors.primary[600] : 'transparent',
            color: activeTab === 'community' ? 'white' : colors.neutral[400],
            border: 'none',
            borderRadius: '0.5rem',
            padding: '0.75rem 1rem',
            fontSize: '0.875rem',
            fontWeight: '600',
            transition: transitions.all,
            borderBottom: activeTab === 'community' ? `3px solid ${colors.primary[400]}` : '3px solid transparent',
          }}
        >
          🌐 Community
        </AnimatedButton>
        <AnimatedButton 
          variant={activeTab === 'analytics' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('analytics')}
          style={{ 
            backgroundColor: activeTab === 'analytics' ? colors.primary[600] : 'transparent',
            color: activeTab === 'analytics' ? 'white' : colors.neutral[400],
            border: 'none',
            borderRadius: '0.5rem',
            padding: '0.75rem 1rem',
            fontSize: '0.875rem',
            fontWeight: '600',
            transition: transitions.all,
            borderBottom: activeTab === 'analytics' ? `3px solid ${colors.primary[400]}` : '3px solid transparent',
          }}
        >
          📊 Analytics
        </AnimatedButton>
        <button className={`${styles.tabBarBtn} ${activeTab === 'leaderboard' ? styles.tabBarBtnActive : ''}`} onClick={() => setActiveTab('leaderboard')}>🏆 Leaderboard</button>
        <button className={`${styles.tabBarBtn} ${activeTab === 'analytics' ? styles.tabBarBtnActive : ''}`} onClick={() => setActiveTab('analytics')}>📊 Analytics</button>
        <button className={`${styles.tabBarBtn} ${activeTab === 'team-chat' ? styles.tabBarBtnActive : ''}`} onClick={() => setActiveTab('team-chat')}>💬 Team Chat</button>
        <button className={`${styles.tabBarBtn} ${activeTab === 'tournaments' ? styles.tabBarBtnActive : ''}`} onClick={() => setActiveTab('tournaments')}>🏟️ Tournaments</button>
        <button className={`${styles.tabBarBtn} ${activeTab === 'live-stream' ? styles.tabBarBtnActive : ''}`} onClick={() => setActiveTab('live-stream')}>📹 Live Stream</button>
        <button className={`${styles.tabBarBtn} ${activeTab === 'upgrade' ? styles.tabBarBtnActive : ''}`} onClick={() => setActiveTab('upgrade')} style={{ marginLeft: 'auto', color: activeTab === 'upgrade' ? '#fff' : '#f59e0b', background: activeTab === 'upgrade' ? '#854d0e' : 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.4)' }}>⭐ Upgrade</button>
      </div>

      {/* ── FREE PLAN LIMIT BANNER ── */}
      {user && userPlan === 'free' && userLimits.maxGames > 0 && (
        <div style={{ background: gamesPlayed >= userLimits.maxGames ? 'rgba(245,158,11,0.12)' : 'rgba(56,189,248,0.06)', borderBottom: `1px solid ${gamesPlayed >= userLimits.maxGames ? '#f59e0b44' : '#38bdf822'}`, padding: '8px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', fontSize: '12px', flexShrink: 0 }}>
          <span style={{ color: gamesPlayed >= userLimits.maxGames ? '#f59e0b' : '#64748b' }}>
            {gamesPlayed >= userLimits.maxGames
              ? `⚠️ Free plan limit reached — ${gamesPlayed}/${userLimits.maxGames} games scored. Upgrade for unlimited games.`
              : `⚾ Free plan: ${gamesPlayed}/${userLimits.maxGames} games scored`}
          </span>
          {gamesPlayed >= userLimits.maxGames && (
            <button onClick={() => setActiveTab('upgrade')}
              style={{ background: '#f59e0b', border: 'none', borderRadius: '6px', color: '#020617', fontWeight: '900', fontSize: '11px', padding: '4px 12px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              ⭐ Upgrade to Pro
            </button>
          )}
        </div>
      )}

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
                href={`/fan?game=${encodeURIComponent(liveGameId)}`}
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

            {/* ─────────────────────────────────────────────────────────
                GC-STYLE SCORING ENGINE
                Layout: [Lineup Rail] | [Scoreboard + Pitch Buttons]
                ───────────────────────────────────────────────────── */}
            <div style={{
              background: '#07101f',
              border: '1px solid #1e293b',
              borderRadius: '14px',
              overflow: 'hidden',
              position: gcScoringMode ? 'fixed' : 'relative',
              top: gcScoringMode ? 0 : 'auto',
              left: gcScoringMode ? 0 : 'auto',
              right: gcScoringMode ? 0 : 'auto',
              bottom: gcScoringMode ? 0 : 'auto',
              zIndex: gcScoringMode ? 9990 : 'auto',
              display: 'flex',
              flexDirection: 'column',
              height: gcScoringMode ? '100dvh' : 'auto',
            }}>

              {/* ── TOP SCOREBOARD BAR ── */}
              <div style={{ background: '#020617', borderBottom: '1px solid #1e293b', padding: isMobile ? '6px 10px' : '10px 16px', display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '12px', flexWrap: 'wrap', flexShrink: 0 }}>
                {/* Score */}
                <div style={{ display: 'flex', gap: '6px', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '10px', color: '#475569', textTransform: 'uppercase', fontWeight: '800' }}>{isMobile ? (teamDisplayName || homeTeamName).slice(0,6) : (teamDisplayName || homeTeamName)}</span>
                  <span style={{ fontSize: isMobile ? '22px' : '28px', fontWeight: '900', color: '#f59e0b', fontFamily: 'monospace', lineHeight: 1 }}>{ourLiveScore}</span>
                  <span style={{ fontSize: '14px', color: '#334155', fontWeight: '900' }}>–</span>
                  <span style={{ fontSize: isMobile ? '22px' : '28px', fontWeight: '900', color: '#94a3b8', fontFamily: 'monospace', lineHeight: 1 }}>{theirLiveScore}</span>
                  <span style={{ fontSize: '10px', color: '#475569', textTransform: 'uppercase', fontWeight: '800' }}>{isMobile ? (scoringOpponent || 'OPP').slice(0,6) : (scoringOpponent || 'OPP')}</span>
                </div>

                {/* Inning */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1, gap: '1px', padding: '0 8px', borderLeft: '1px solid #1e293b', borderRight: '1px solid #1e293b' }}>
                  <span style={{ fontSize: '8px', color: isTopInning ? '#38bdf8' : '#475569' }}>▲</span>
                  <span style={{ fontSize: '15px', fontWeight: '900', color: '#fff', fontFamily: 'monospace' }}>{currentInning}</span>
                  <span style={{ fontSize: '8px', color: !isTopInning ? '#38bdf8' : '#475569' }}>▼</span>
                </div>

                {/* Count */}
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '9px', color: '#475569', fontWeight: '800', textTransform: 'uppercase' }}>B</div>
                    <div style={{ display: 'flex', gap: '3px', marginTop: '2px' }}>
                      {[0,1,2,3].map(i => <div key={i} style={{ width: '10px', height: '10px', borderRadius: '50%', background: i < balls ? '#22c55e' : '#1e293b', border: '1px solid #334155' }} />)}
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '9px', color: '#475569', fontWeight: '800', textTransform: 'uppercase' }}>S</div>
                    <div style={{ display: 'flex', gap: '3px', marginTop: '2px' }}>
                      {[0,1,2].map(i => <div key={i} style={{ width: '10px', height: '10px', borderRadius: '50%', background: i < strikes ? '#eab308' : '#1e293b', border: '1px solid #334155' }} />)}
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '9px', color: '#475569', fontWeight: '800', textTransform: 'uppercase' }}>O</div>
                    <div style={{ display: 'flex', gap: '3px', marginTop: '2px' }}>
                      {[0,1,2].map(i => <div key={i} style={{ width: '10px', height: '10px', borderRadius: '50%', background: i < outs ? '#ef4444' : '#1e293b', border: '1px solid #334155' }} />)}
                    </div>
                  </div>
                </div>

                {/* Mini diamond */}
                <div style={{ position: 'relative', width: '36px', height: '36px', flexShrink: 0 }}>
                  {[
                    { on: runnerOnSecond, x: 13, y: 0, label: '2B' },
                    { on: runnerOnThird,  x: 0,  y: 13, label: '3B' },
                    { on: runnerOnFirst,  x: 26, y: 13, label: '1B' },
                  ].map(({ on, x, y, label }) => (
                    <div key={label} style={{ position: 'absolute', left: x, top: y, width: '12px', height: '12px', transform: 'rotate(45deg)', background: on ? '#f59e0b' : '#1e293b', border: `1px solid ${on ? '#f59e0b' : '#334155'}`, cursor: 'pointer' }}
                      onClick={() => { if (label === '1B') setRunnerOnFirst(v => !v); else if (label === '2B') setRunnerOnSecond(v => !v); else setRunnerOnThird(v => !v); }} />
                  ))}
                  <div style={{ position: 'absolute', left: 13, top: 26, width: '10px', height: '10px', transform: 'rotate(45deg)', background: '#334155', border: '1px solid #475569' }} />
                </div>

                {/* Batter / Pitcher */}
                <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                  <div style={{ fontSize: '13px', fontWeight: '900', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    🏏 {currentBatter || <span style={{ color: '#334155' }}>No batter set</span>}
                  </div>
                  <div style={{ fontSize: '11px', color: '#475569', display: 'flex', gap: '6px', alignItems: 'center', marginTop: '2px' }}>
                    <span>⚾</span>
                    <input
                      value={opponentPitcher}
                      onChange={e => setOpponentPitcher(e.target.value)}
                      placeholder="Opp. pitcher..."
                      style={{ background: 'transparent', border: 'none', color: '#64748b', fontSize: '11px', outline: 'none', width: '110px', padding: 0 }}
                    />
                    <span style={{ color: '#1e293b' }}>·</span>
                    <span>{pitchCount}p</span>
                  </div>
                </div>

                {/* Game clock */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', flexShrink: 0 }}>
                  <span style={{ fontSize: '14px', fontWeight: '900', color: gameClockRunning ? '#22c55e' : '#475569', fontFamily: 'monospace', letterSpacing: '1px' }}>{formatClock(gameClockMs)}</span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button onClick={() => setGameClockRunning(v => !v)}
                      style={{ background: gameClockRunning ? 'rgba(239,68,68,0.15)' : 'rgba(34,197,94,0.15)', border: `1px solid ${gameClockRunning ? '#ef4444' : '#22c55e'}`, borderRadius: '5px', color: gameClockRunning ? '#ef4444' : '#22c55e', cursor: 'pointer', fontSize: '10px', fontWeight: '800', padding: '2px 7px' }}>
                      {gameClockRunning ? '⏸' : '▶'}
                    </button>
                    <button onClick={() => { setGameClockMs(0); setGameClockRunning(false); }}
                      style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '5px', color: '#334155', cursor: 'pointer', fontSize: '10px', padding: '2px 6px' }}>
                      ↺
                    </button>
                  </div>
                </div>

                {/* Sync Status Indicator */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginRight: '8px' }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '4px',
                    padding: '2px 6px',
                    background: syncStatus === 'connected' ? '#22c55e20' : 
                               syncStatus === 'syncing' ? '#f59e0b20' : 
                               syncStatus === 'offline' ? '#ef444420' : '#334155',
                    border: `1px solid ${
                      syncStatus === 'connected' ? '#22c55e' : 
                      syncStatus === 'syncing' ? '#f59e0b' : 
                      syncStatus === 'offline' ? '#ef4444' : '#334155'
                    }`,
                    borderRadius: '4px'
                  }}>
                    <span style={{ 
                      width: '6px', 
                      height: '6px', 
                      borderRadius: '50%',
                      background: syncStatus === 'connected' ? '#22c55e' : 
                                 syncStatus === 'syncing' ? '#f59e0b' : 
                                 syncStatus === 'offline' ? '#ef4444' : '#64748b',
                      animation: syncStatus === 'syncing' ? 'pulse 1.5s infinite' : 'none'
                    }} />
                    <span style={{ fontSize: '8px', color: '#94a3b8' }}>
                      {syncStatus === 'connected' ? 'Synced' : 
                       syncStatus === 'syncing' ? 'Syncing' : 
                       syncStatus === 'offline' ? 'Offline' : 'Error'}
                    </span>
                  </div>
                  {connectedDevices.length > 0 && (
                    <span style={{ fontSize: '8px', color: '#64748b' }}>
                      {connectedDevices.length} devices
                    </span>
                  )}
                </div>

                {/* Field view + full-screen toggles */}
                <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                  <button onClick={() => setShowPlayerDevelopment(v => !v)}
                    style={{ background: showPlayerDevelopment ? 'rgba(56,189,248,0.15)' : '#0f172a', border: `1px solid ${showPlayerDevelopment ? '#38bdf8' : '#334155'}`, borderRadius: '8px', color: showPlayerDevelopment ? '#38bdf8' : '#64748b', cursor: 'pointer', fontSize: '14px', padding: '6px 9px' }} title="Player development tracking and goals">
                    🎯
                  </button>
                  <button onClick={() => setShowAdvancedMetrics(v => !v)}
                    style={{ background: showAdvancedMetrics ? 'rgba(56,189,248,0.15)' : '#0f172a', border: `1px solid ${showAdvancedMetrics ? '#38bdf8' : '#334155'}`, borderRadius: '8px', color: showAdvancedMetrics ? '#38bdf8' : '#64748b', cursor: 'pointer', fontSize: '14px', padding: '6px 9px' }} title="Advanced performance metrics and analytics">
                    📈
                  </button>
                  <button onClick={() => setShowVideoPanel(v => !v)}
                    style={{ background: showVideoPanel ? 'rgba(56,189,248,0.15)' : '#0f172a', border: `1px solid ${showVideoPanel ? '#38bdf8' : '#334155'}`, borderRadius: '8px', color: showVideoPanel ? '#38bdf8' : '#64748b', cursor: 'pointer', fontSize: '14px', padding: '6px 9px', position: 'relative' }} title="Video recording and analysis">
                    🎥
                    {isRecording && (
                      <span style={{ 
                        position: 'absolute', 
                        top: '2px', 
                        right: '2px', 
                        background: '#ef4444', 
                        borderRadius: '50%', 
                        width: '8px', 
                        height: '8px',
                        animation: 'pulse 1.5s infinite'
                      }} />
                    )}
                  </button>
                  <button onClick={() => setShowTeamChat(v => !v)}
                    style={{ background: showTeamChat ? 'rgba(56,189,248,0.15)' : '#0f172a', border: `1px solid ${showTeamChat ? '#38bdf8' : '#334155'}`, borderRadius: '8px', color: showTeamChat ? '#38bdf8' : '#64748b', cursor: 'pointer', fontSize: '14px', padding: '6px 9px', position: 'relative' }} title="Team communication">
                    💬
                    {unreadCount > 0 && (
                      <span style={{ 
                        position: 'absolute', 
                        top: '2px', 
                        right: '2px', 
                        background: '#ef4444', 
                        color: '#fff', 
                        borderRadius: '50%', 
                        width: '12px', 
                        height: '12px', 
                        fontSize: '8px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        fontWeight: 'bold'
                      }}>
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  <button onClick={() => setShowRecapGenerator(v => !v)}
                    style={{ background: showRecapGenerator ? 'rgba(56,189,248,0.15)' : '#0f172a', border: `1px solid ${showRecapGenerator ? '#38bdf8' : '#334155'}`, borderRadius: '8px', color: showRecapGenerator ? '#38bdf8' : '#64748b', cursor: 'pointer', fontSize: '14px', padding: '6px 9px' }} title="Game recap generator">
                    📄
                  </button>
                  <button onClick={() => setShowPitchChart(v => !v)}
                    style={{ background: showPitchChart ? 'rgba(56,189,248,0.15)' : '#0f172a', border: `1px solid ${showPitchChart ? '#38bdf8' : '#334155'}`, borderRadius: '8px', color: showPitchChart ? '#38bdf8' : '#64748b', cursor: 'pointer', fontSize: '14px', padding: '6px 9px' }} title="Pitch chart visualization">
                    🎯
                  </button>
                  <button onClick={() => setShowAnalytics(v => !v)}
                    style={{ background: showAnalytics ? 'rgba(56,189,248,0.15)' : '#0f172a', border: `1px solid ${showAnalytics ? '#38bdf8' : '#334155'}`, borderRadius: '8px', color: showAnalytics ? '#38bdf8' : '#64748b', cursor: 'pointer', fontSize: '14px', padding: '6px 9px' }} title="Analytics dashboard">
                    📊
                  </button>
                  <button onClick={() => setShowTemplateManager(v => !v)}
                    style={{ background: showTemplateManager ? 'rgba(56,189,248,0.15)' : '#0f172a', border: `1px solid ${showTemplateManager ? '#38bdf8' : '#334155'}`, borderRadius: '8px', color: showTemplateManager ? '#38bdf8' : '#64748b', cursor: 'pointer', fontSize: '14px', padding: '6px 9px' }} title="Lineup templates">
                    📋
                  </button>
                  <button onClick={() => setShowPlayLog(v => !v)}
                    style={{ background: showPlayLog ? 'rgba(56,189,248,0.15)' : '#0f172a', border: `1px solid ${showPlayLog ? '#38bdf8' : '#334155'}`, borderRadius: '8px', color: showPlayLog ? '#38bdf8' : '#64748b', cursor: 'pointer', fontSize: '14px', padding: '6px 9px' }} title="Toggle play log">
                    📝
                  </button>
                  <button onClick={() => setShowPitchDetails(v => !v)}
                    style={{ background: showPitchDetails ? 'rgba(56,189,248,0.15)' : '#0f172a', border: `1px solid ${showPitchDetails ? '#38bdf8' : '#334155'}`, borderRadius: '8px', color: showPitchDetails ? '#38bdf8' : '#64748b', cursor: 'pointer', fontSize: '14px', padding: '6px 9px' }} title="Toggle pitch details">
                    ⚡
                  </button>
                  <button onClick={() => setShowFieldView(v => !v)}
                    style={{ background: showFieldView ? 'rgba(56,189,248,0.15)' : '#0f172a', border: `1px solid ${showFieldView ? '#38bdf8' : '#334155'}`, borderRadius: '8px', color: showFieldView ? '#38bdf8' : '#64748b', cursor: 'pointer', fontSize: '14px', padding: '6px 9px' }} title="Toggle field view">
                    ⬡
                  </button>
                  <button onClick={() => setOppScoringMode(v => !v)}
                    style={{ background: oppScoringMode ? 'rgba(239,68,68,0.15)' : '#0f172a', border: `1px solid ${oppScoringMode ? '#ef4444' : '#334155'}`, borderRadius: '8px', color: oppScoringMode ? '#ef4444' : '#64748b', cursor: 'pointer', fontSize: '11px', fontWeight: '900', padding: '6px 9px', whiteSpace: 'nowrap' }} title="Score opponent at-bats">
                    {oppScoringMode ? '▶ OPP' : 'OPP'}
                  </button>
                  <button onClick={() => setSpeakEnabled(v => !v)}
                    style={{ background: speakEnabled ? 'rgba(56,189,248,0.12)' : '#0f172a', border: `1px solid ${speakEnabled ? '#38bdf8' : '#334155'}`, borderRadius: '8px', color: speakEnabled ? '#38bdf8' : '#64748b', cursor: 'pointer', fontSize: '15px', padding: '6px 9px' }} title="Toggle broadcast voice">
                    {speakEnabled ? '🔊' : '🔇'}
                  </button>
                  <button onClick={() => setGcScoringMode(v => !v)}
                    style={{ background: gcScoringMode ? '#1e293b' : '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#64748b', cursor: 'pointer', fontSize: '16px', padding: '6px 9px' }} title="Toggle full-screen scoring">
                    {gcScoringMode ? '⊠' : '⛶'}
                  </button>
                </div>
              </div>

              {/* ── LAST PLAY SUMMARY ── */}
              <div style={{ background: '#0b1424', borderBottom: '1px solid #1e293b', padding: '6px 16px', fontSize: '12px', color: '#64748b', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span><span style={{ color: '#38bdf8', fontWeight: '700' }}>►</span> {lastPlaySummary}</span>
                <button onClick={() => setShowLineupSetup(v => !v)}
                  style={{ background: showLineupSetup ? 'rgba(56,189,248,0.15)' : 'transparent', border: `1px solid ${showLineupSetup ? '#38bdf8' : '#1e293b'}`, borderRadius: '6px', color: showLineupSetup ? '#38bdf8' : '#334155', cursor: 'pointer', fontSize: '10px', fontWeight: '800', padding: '3px 8px', whiteSpace: 'nowrap' }}>
                  {showLineupSetup ? '✕ Close' : '☰ Lineup'}
                </button>
              </div>

              {/* ── PITCH COUNT ALERT BANNER ── */}
              {pitchAlert && (
                <div style={{ background: pitchAlert === 'limit' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.12)', borderBottom: `1px solid ${pitchAlert === 'limit' ? '#ef4444' : '#f59e0b'}`, padding: '8px 16px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '800', color: pitchAlert === 'limit' ? '#ef4444' : '#f59e0b' }}>
                    {pitchAlert === 'limit'
                      ? `⛔ Pitch limit reached (${pitchHardLimit}) — ${currentPitcher || 'pitcher'} must be removed`
                      : `⚠️ Pitch warning (${pitchCount}/${pitchHardLimit}) — ${currentPitcher || 'pitcher'} approaching limit`}
                  </span>
                  <button onClick={() => setPitchAlert(null)}
                    style={{ background: 'transparent', border: 'none', color: '#475569', cursor: 'pointer', fontSize: '16px', padding: '0 4px', flexShrink: 0 }}>✕</button>
                </div>
              )}

              {/* ── GAME OVER OVERLAY ── */}
              {gameOver && (
                <div style={{ position: 'absolute', inset: 0, zIndex: 110, background: 'rgba(2,6,23,0.98)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px', padding: '28px' }}>
                  <div style={{ fontSize: '11px', color: '#f59e0b', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2px' }}>Final Score</div>
                  <div style={{ fontSize: '56px', fontWeight: '900', color: '#fff', fontFamily: 'monospace', lineHeight: 1 }}>
                    {ourLiveScore} <span style={{ fontSize: '24px', color: '#334155' }}>–</span> {theirLiveScore}
                  </div>
                  <div style={{ fontSize: '13px', color: '#f59e0b', fontWeight: '700', textAlign: 'center' }}>{gameOverReason}</div>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <button onClick={() => { setGameOver(false); setGameClockRunning(false); }}
                      style={{ background: '#1d4ed8', border: 'none', borderRadius: '12px', color: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: '900', padding: '13px 30px' }}>
                      Keep Scoring
                    </button>
                    <button
                      onClick={() => {
                        setGameClockRunning(false);
                        const rows = recentEvents.filter(e => !['correction','undo'].includes(e.eventType)).slice(0, 40).map((e, i) => `${i+1}. ${e.label || e.result || e.eventType}`).join('\n');
                        const summary = `FINAL: ${teamDisplayName || 'Us'} ${ourLiveScore} – ${theirLiveScore} ${scoringOpponent || 'Opp'}\n${gameOverReason}\nInn ${currentInning}\n\n${rows}`;
                        const blob = new Blob([summary], { type: 'text/plain' });
                        const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
                        a.download = `game_${new Date().toISOString().slice(0,10)}.txt`; a.click();
                      }}
                      style={{ background: 'transparent', border: '1px solid #334155', borderRadius: '12px', color: '#64748b', cursor: 'pointer', fontSize: '13px', padding: '13px 22px' }}>
                      Export Game
                    </button>
                  </div>
                </div>
              )}

              {/* ── LIVE BOX SCORE STRIP ── */}
              {showBoxScoreStrip && (() => {
                const innings = Math.max(ourInnings.length, theirInnings.length, 7);
                const innNums = Array.from({ length: innings }, (_, i) => i + 1);
                return (
                  <div style={{ background: '#020617', borderBottom: '1px solid #1e293b', flexShrink: 0, overflowX: 'auto' }}>
                    <div style={{ display: 'flex', alignItems: 'stretch', minWidth: 'max-content', fontSize: '11px', fontFamily: 'monospace' }}>
                      {/* Team name col */}
                      <div style={{ display: 'flex', flexDirection: 'column', borderRight: '1px solid #1e293b' }}>
                        <div style={{ padding: '4px 10px', color: '#334155', fontWeight: '800', borderBottom: '1px solid #0f172a', height: '22px' }}></div>
                        <div style={{ padding: '4px 10px', color: '#f59e0b', fontWeight: '900', whiteSpace: 'nowrap', height: '22px' }}>{(teamDisplayName || 'Us').slice(0, 10)}</div>
                        <div style={{ padding: '4px 10px', color: '#94a3b8', fontWeight: '700', whiteSpace: 'nowrap', height: '22px' }}>{(scoringOpponent || 'Opp').slice(0, 10)}</div>
                      </div>
                      {/* Inning cols */}
                      {innNums.map(n => {
                        const isCurrent = n === currentInning;
                        return (
                          <div key={n} style={{ display: 'flex', flexDirection: 'column', borderRight: '1px solid #0f172a', minWidth: '28px' }}>
                            <div style={{ padding: '4px 6px', color: isCurrent ? '#38bdf8' : '#334155', fontWeight: '800', textAlign: 'center', borderBottom: '1px solid #0f172a', height: '22px', background: isCurrent ? 'rgba(56,189,248,0.06)' : 'transparent' }}>{n}</div>
                            <div style={{ padding: '4px 6px', textAlign: 'center', color: ourInnings[n-1] > 0 ? '#f59e0b' : '#1e293b', height: '22px', background: isCurrent && !isTopInning ? 'rgba(56,189,248,0.04)' : 'transparent' }}>{ourInnings[n-1] ?? (n < currentInning ? '0' : '-')}</div>
                            <div style={{ padding: '4px 6px', textAlign: 'center', color: theirInnings[n-1] > 0 ? '#94a3b8' : '#1e293b', height: '22px', background: isCurrent && isTopInning ? 'rgba(56,189,248,0.04)' : 'transparent' }}>{theirInnings[n-1] ?? (n < currentInning ? '0' : '-')}</div>
                          </div>
                        );
                      })}
                      {/* R H E totals */}
                      {[
                        { label: 'R', our: ourLiveScore, their: theirLiveScore, color: '#fff' },
                        { label: 'H', our: ourHits, their: theirHits, color: '#64748b' },
                        { label: 'E', our: ourErrors, their: theirErrors, color: '#ef444466' },
                      ].map(({ label, our, their, color }) => (
                        <div key={label} style={{ display: 'flex', flexDirection: 'column', borderLeft: '1px solid #1e293b', minWidth: '28px' }}>
                          <div style={{ padding: '4px 6px', color: '#475569', fontWeight: '800', textAlign: 'center', borderBottom: '1px solid #0f172a', height: '22px' }}>{label}</div>
                          <div style={{ padding: '4px 6px', textAlign: 'center', color, fontWeight: '900', height: '22px' }}>{our}</div>
                          <div style={{ padding: '4px 6px', textAlign: 'center', color: '#475569', height: '22px' }}>{their}</div>
                        </div>
                      ))}
                      {/* Toggle close */}
                      <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: '4px' }}>
                        <div style={{ height: '22px' }} />
                        <button onClick={() => setShowBoxScoreStrip(false)}
                          style={{ background: 'none', border: 'none', color: '#1e293b', cursor: 'pointer', fontSize: '12px', padding: '3px 6px', alignSelf: 'center' }}>✕</button>
                      </div>
                    </div>
                  </div>
                );
              })()}
              {!showBoxScoreStrip && (
                <button onClick={() => setShowBoxScoreStrip(true)}
                  style={{ background: '#020617', border: 'none', borderBottom: '1px solid #1e293b', color: '#334155', cursor: 'pointer', fontSize: '10px', fontWeight: '800', padding: '3px 12px', width: '100%', textAlign: 'left', flexShrink: 0 }}>
                  ▤ Show Box Score
                </button>
              )}

              {/* ── INNING BREAK OVERLAY ── */}
              {inningBreak && (
                <div style={{ position: 'absolute', inset: 0, zIndex: 100, background: 'rgba(2,6,23,0.97)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '18px', padding: '24px' }}>
                  <div style={{ fontSize: '11px', color: '#475569', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {inningBreak.wasTop ? 'End of Top' : 'End of Bottom'} {inningBreak.inning}
                  </div>
                  <div style={{ fontSize: '52px', fontWeight: '900', color: '#fff', fontFamily: 'monospace', lineHeight: 1 }}>
                    {ourLiveScore} <span style={{ fontSize: '24px', color: '#334155' }}>–</span> {theirLiveScore}
                  </div>
                  <div style={{ fontSize: '13px', color: '#64748b' }}>
                    {inningBreak.wasTop ? `${teamDisplayName || 'Us'}` : `${scoringOpponent || 'Opp'}`} scored <strong style={{ color: '#f59e0b' }}>{inningBreak.runsThisHalf}</strong> run{inningBreak.runsThisHalf !== 1 ? 's' : ''} this half
                  </div>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                    <button onClick={confirmInningBreak}
                      style={{ background: '#1d4ed8', border: 'none', borderRadius: '12px', color: '#fff', cursor: 'pointer', fontSize: '15px', fontWeight: '900', padding: '14px 36px', letterSpacing: '0.5px' }}>
                      {inningBreak.wasTop ? `▼ Start Bot ${inningBreak.inning}` : `▲ Start Top ${inningBreak.inning + 1}`}
                    </button>
                    <button onClick={() => setInningBreak(null)}
                      style={{ background: 'transparent', border: '1px solid #334155', borderRadius: '12px', color: '#475569', cursor: 'pointer', fontSize: '13px', padding: '14px 20px' }}>
                      Wait
                    </button>
                  </div>
                  <div style={{ fontSize: '11px', color: '#1e293b', marginTop: '4px' }}>Tap Wait to keep scoring without advancing the inning</div>
                </div>
              )}

              {/* ── LINEUP SETUP PANEL ── */}
              {showLineupSetup && (
                <div style={{ background: '#020a1a', borderBottom: '1px solid #1e293b', padding: '12px 16px', flexShrink: 0, maxHeight: '280px', overflowY: 'auto' }}>
                  <div style={{ fontSize: '11px', color: '#38bdf8', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>Batting Order — tap to set current batter</div>
                  {lineupEntries.length === 0 ? (
                    <div style={{ fontSize: '12px', color: '#334155', padding: '8px 0' }}>No lineup saved yet. Go to the Lineup tab to build your batting order.</div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {lineupEntries.map((entry, idx) => {
                        const name = [entry.firstName, entry.lastName].filter(Boolean).join(' ') || entry.name || `#${entry.jersey || idx + 1}`;
                        const isCurrent = idx === lineupBatterIndex;
                        const isDragging = dragIdx === idx;
                        return (
                          <div key={entry.id || idx}
                            draggable
                            onDragStart={() => handleLineupDragStart(idx)}
                            onDragOver={e => handleLineupDragOver(e, idx)}
                            onDragEnd={handleLineupDragEnd}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 10px', borderRadius: '8px', background: isDragging ? 'rgba(56,189,248,0.08)' : isCurrent ? 'rgba(56,189,248,0.12)' : '#0f172a', border: `1px solid ${isCurrent ? '#38bdf8' : '#1e293b'}`, cursor: 'grab', opacity: isDragging ? 0.5 : 1 }}>
                            <span style={{ fontSize: '14px', color: '#1e293b', cursor: 'grab', flexShrink: 0 }}>&#8942;</span>
                            <span onClick={() => { setLineupBatterIndex(idx); setCurrentBatter(name); }} style={{ fontSize: '12px', color: isCurrent ? '#38bdf8' : '#334155', fontFamily: 'monospace', width: '18px', fontWeight: '900', cursor: 'pointer' }}>{idx + 1}</span>
                            {entry.jersey && <span style={{ fontSize: '11px', color: '#475569', width: '28px' }}>#{entry.jersey}</span>}
                            <span onClick={() => { setLineupBatterIndex(idx); setCurrentBatter(name); }} style={{ fontSize: '13px', color: isCurrent ? '#fff' : '#64748b', fontWeight: isCurrent ? '800' : '400', flex: 1, cursor: 'pointer' }}>{name}</span>
                            {entry.position && <span style={{ fontSize: '10px', color: '#334155', background: '#0f172a', border: '1px solid #1e293b', borderRadius: '4px', padding: '1px 5px' }}>{entry.position}</span>}
                            {isCurrent && <span style={{ fontSize: '10px', color: '#38bdf8', fontWeight: '800' }}>AT BAT</span>}
                            <button onClick={() => setSubModal({ idx, name })} style={{ background: 'transparent', border: '1px solid #334155', borderRadius: '5px', color: '#475569', cursor: 'pointer', fontSize: '10px', padding: '2px 6px', flexShrink: 0 }}>SUB</button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {/* Sub form — rendered inline using subModal state */}
                  {subModal && (
                    <SubForm key={subModal.idx} subModal={subModal} onConfirm={substitutePlayer} onCancel={() => setSubModal(null)} />
                  )}
                  <div style={{ marginTop: '10px', display: 'flex', gap: '8px' }}>
                    <input value={currentPitcher} onChange={e => setCurrentPitcher(e.target.value)} placeholder="Our pitcher name..."
                      style={{ flex: 1, background: '#0f172a', border: '1px solid #1e293b', color: '#94a3b8', borderRadius: '6px', padding: '6px 10px', fontSize: '12px' }} />
                    <input value={opponentPitcher} onChange={e => setOpponentPitcher(e.target.value)} placeholder="Opp. pitcher name..."
                      style={{ flex: 1, background: '#0f172a', border: '1px solid #1e293b', color: '#94a3b8', borderRadius: '6px', padding: '6px 10px', fontSize: '12px' }} />
                  </div>
                </div>
              )}

              {/* ── FIELD VIEW (overhead, GC-style) ── */}
              {showFieldView && (() => {
                // Map lineup positions to x/y % coords on the field SVG (100x100 viewBox)
                const posCoords = {
                  P:   { x: 50, y: 52 }, C:   { x: 50, y: 88 },
                  '1B':{ x: 72, y: 63 }, '2B':{ x: 62, y: 45 },
                  SS:  { x: 38, y: 45 }, '3B':{ x: 28, y: 63 },
                  LF:  { x: 18, y: 22 }, CF:  { x: 50, y: 12 }, RF: { x: 82, y: 22 },
                  DH:  { x: 50, y: 78 },
                };
                const batterEntry = lineupEntries[lineupBatterIndex];
                const batterName = currentBatter ? currentBatter.split(' ').pop() : '?';
                return (
                  <div style={{ background: '#020a14', borderBottom: '1px solid #1e293b', flexShrink: 0, padding: '0' }}>
                    <svg viewBox="0 0 100 100" style={{ width: '100%', maxHeight: '260px', display: 'block' }} preserveAspectRatio="xMidYMid meet">
                      {/* Sky/background */}
                      <rect width="100" height="100" fill="#020a14" />
                      {/* Outfield grass fan */}
                      <path d="M 50 92 L 8 28 A 55 55 0 0 1 92 28 Z" fill="#166534" opacity="0.85" />
                      {/* Warning track */}
                      <path d="M 50 92 L 6 24 A 58 58 0 0 1 94 24 Z" fill="none" stroke="#78350f" strokeWidth="3" opacity="0.5" />
                      {/* Infield dirt */}
                      <polygon points="50,35 72,62 50,75 28,62" fill="#92400e" opacity="0.75" />
                      {/* Inner grass diamond */}
                      <polygon points="50,37 70,61 50,73 30,61" fill="#15803d" opacity="0.6" />
                      {/* Foul lines */}
                      <line x1="50" y1="92" x2="8" y2="28" stroke="#ffffff" strokeWidth="0.4" opacity="0.3" />
                      <line x1="50" y1="92" x2="92" y2="28" stroke="#ffffff" strokeWidth="0.4" opacity="0.3" />
                      {/* Pitcher mound */}
                      <circle cx="50" cy="55" r="3.5" fill="#92400e" stroke="#a16207" strokeWidth="0.5" />
                      {/* Bases */}
                      <rect x="47" y="32" width="6" height="6" fill={runnerOnSecond ? '#f59e0b' : '#f5f5f5'} transform="rotate(45,50,35)" opacity="0.95" />
                      <rect x="69" y="59" width="6" height="6" fill={runnerOnFirst ? '#f59e0b' : '#f5f5f5'} transform="rotate(45,72,62)" opacity="0.95" />
                      <rect x="25" y="59" width="6" height="6" fill={runnerOnThird ? '#f59e0b' : '#f5f5f5'} transform="rotate(45,28,62)" opacity="0.95" />
                      {/* Home plate */}
                      <polygon points="50,79 53,82 53,86 47,86 47,82" fill="#fff" opacity="0.9" />

                      {/* Fielders from lineup by position */}
                      {lineupEntries.map((entry, idx) => {
                        if (idx === lineupBatterIndex) return null; // batter is at plate
                        const pos = entry.position?.trim().toUpperCase();
                        const coords = posCoords[pos];
                        if (!coords) return null;
                        const lastName = (entry.lastName || entry.name || `#${entry.jersey || ''}`).split(' ').pop();
                        return (
                          <g key={entry.id || idx}>
                            <circle cx={coords.x} cy={coords.y} r="4.5" fill="#1e40af" stroke="#3b82f6" strokeWidth="0.8" />
                            <text x={coords.x} y={coords.y - 5.5} textAnchor="middle" fill="#93c5fd" fontSize="3.2" fontWeight="bold">{lastName}</text>
                            {entry.jersey && <text x={coords.x} y={coords.y + 1.5} textAnchor="middle" fill="#fff" fontSize="2.6" fontWeight="900">#{entry.jersey}</text>}
                          </g>
                        );
                      })}

                      {/* Batter at home plate */}
                      <circle cx="50" cy="88" r="4.5" fill="#f59e0b" stroke="#fbbf24" strokeWidth="0.8" />
                      <text x="50" y="82" textAnchor="middle" fill="#fef08a" fontSize="3.2" fontWeight="bold">{batterName}</text>
                      {batterEntry?.jersey && <text x="50" y="88" textAnchor="middle" fill="#fff" fontSize="2.6" fontWeight="900">#{batterEntry.jersey}</text>}

                      {/* Runner markers on occupied bases */}
                      {runnerOnSecond && <circle cx="50" cy="35" r="2.5" fill="#f59e0b" opacity="0.8" />}
                      {runnerOnFirst  && <circle cx="72" cy="62" r="2.5" fill="#f59e0b" opacity="0.8" />}
                      {runnerOnThird  && <circle cx="28" cy="62" r="2.5" fill="#f59e0b" opacity="0.8" />}

                      {/* Position labels (faint) when no lineup entry covers that spot */}
                      {Object.entries(posCoords).map(([pos, { x, y }]) => {
                        const covered = lineupEntries.some((e, i) => i !== lineupBatterIndex && e.position?.trim().toUpperCase() === pos);
                        if (covered) return null;
                        return <text key={pos} x={x} y={y + 1} textAnchor="middle" fill="#334155" fontSize="3" fontWeight="800" opacity="0.6">{pos}</text>;
                      })}
                    </svg>
                  </div>
                );
              })()}

              {/* ── OPP SCORING PANEL ── */}
              {oppScoringMode && (
                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', background: '#020617', padding: '16px' }}>
                  <div style={{ fontSize: '11px', color: '#ef4444', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
                    ▶ Scoring {scoringOpponent || 'Opponent'} — Inn {currentInning} {isTopInning ? 'Top' : 'Bot'}
                  </div>

                  {/* Opp batter: roster quick-select or free-type */}
                  {opponentRoster.length > 0 ? (
                    <select value={oppBatterName} onChange={e => setOppBatterName(e.target.value)}
                      style={{ background: '#0f172a', border: '1px solid #1e293b', color: oppBatterName ? '#fff' : '#475569', borderRadius: '8px', padding: '8px 12px', fontSize: '13px', marginBottom: '8px', width: '100%', cursor: 'pointer' }}>
                      <option value="">— Select opp batter —</option>
                      {opponentRoster.map(p => (
                        <option key={p.id} value={`${p.firstName} ${p.lastName}`.trim() || p.firstName}>
                          #{p.jersey || '?'} {p.firstName} {p.lastName} {p.position ? `· ${p.position}` : ''}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input value={oppBatterName} onChange={e => setOppBatterName(e.target.value)}
                      placeholder="Opp batter name (optional)..."
                      style={{ background: '#0f172a', border: '1px solid #1e293b', color: '#fff', borderRadius: '8px', padding: '8px 12px', fontSize: '13px', marginBottom: '8px', width: '100%' }} />
                  )}

                  {/* Scouting import — paste CSV inline */}
                  {opponentRoster.length === 0 && (
                    <details style={{ marginBottom: '14px' }}>
                      <summary style={{ fontSize: '10px', color: '#334155', cursor: 'pointer', userSelect: 'none' }}>📋 Import opponent roster (CSV)</summary>
                      <div style={{ marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <textarea value={opponentRawRoster} onChange={e => setOpponentRawRoster(e.target.value)}
                          placeholder="#, First, Last, Pos&#10;12, John, Smith, SS&#10;34, Mike, Jones, P"
                          rows={4}
                          style={{ background: '#0f172a', border: '1px solid #334155', color: '#94a3b8', borderRadius: '6px', padding: '6px 8px', fontSize: '11px', fontFamily: 'monospace', width: '100%', resize: 'vertical' }} />
                        <button onClick={parseOpponentRoster} disabled={!opponentRawRoster.trim()}
                          style={{ background: 'rgba(56,189,248,0.1)', border: '1px solid #38bdf844', borderRadius: '6px', color: '#38bdf8', cursor: 'pointer', fontSize: '11px', fontWeight: '800', padding: '6px 0' }}>
                          Parse &amp; Load Roster
                        </button>
                      </div>
                    </details>
                  )}
                  {opponentRoster.length > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                      <span style={{ fontSize: '10px', color: '#334155' }}>{opponentRoster.length} players loaded</span>
                      <button onClick={() => { setOpponentRoster([]); setOppBatterName(''); }}
                        style={{ background: 'transparent', border: 'none', color: '#334155', cursor: 'pointer', fontSize: '10px' }}>Clear</button>
                    </div>
                  )}

                  {/* B·S·O current state */}
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '14px' }}>
                    {[{ label:'B', count: balls, max:4, color:'#22c55e' }, { label:'S', count: strikes, max:3, color:'#ef4444' }, { label:'O', count: outs, max:3, color:'#f59e0b' }].map(({ label, count, max, color }) => (
                      <div key={label} style={{ display:'flex', alignItems:'center', gap:'5px' }}>
                        <span style={{ fontSize:'10px', color:'#475569', fontWeight:'800', width:'14px' }}>{label}</span>
                        {Array.from({ length: max }, (_, i) => (
                          <div key={i} style={{ width:'12px', height:'12px', borderRadius:'50%', background: i < count ? color : '#1e293b', border:`1.5px solid ${i < count ? color : '#334155'}` }} />
                        ))}
                      </div>
                    ))}
                  </div>

                  {/* Quick outcome grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '14px' }}>
                    {[
                      { result:'single',      label:'Single',     notation:'1B', outs:0, color:'#22c55e' },
                      { result:'double',      label:'Double',     notation:'2B', outs:0, color:'#22c55e' },
                      { result:'triple',      label:'Triple',     notation:'3B', outs:0, color:'#22c55e' },
                      { result:'home_run',    label:'Home Run',   notation:'HR', outs:0, color:'#f59e0b' },
                      { result:'walk',        label:'Walk',       notation:'BB', outs:0, color:'#60a5fa' },
                      { result:'hit_by_pitch',label:'HBP',        notation:'HBP',outs:0, color:'#60a5fa' },
                      { result:'strikeout',   label:'Strikeout',  notation:'K',  outs:1, color:'#ef4444' },
                      { result:'groundout',   label:'Ground Out', notation:'GO', outs:1, color:'#ef4444' },
                      { result:'flyout',      label:'Fly Out',    notation:'FO', outs:1, color:'#ef4444' },
                      { result:'lineout',     label:'Line Out',   notation:'LO', outs:1, color:'#ef4444' },
                      { result:'pop_out',     label:'Pop Out',    notation:'PO', outs:1, color:'#ef4444' },
                      { result:'sac_fly',     label:'Sac Fly',    notation:'SF', outs:1, color:'#f59e0b' },
                    ].map(outcome => (
                      <button key={outcome.result} disabled={!user} onClick={() => recordOppPA(outcome)}
                        style={{ background: `${outcome.color}18`, border: `1.5px solid ${outcome.color}55`, borderRadius: '10px', color: outcome.color, cursor: 'pointer', fontSize: '13px', fontWeight: '900', padding: '14px 6px', textAlign: 'center', lineHeight: 1.2 }}>
                        <div>{outcome.notation}</div>
                        <div style={{ fontSize: '9px', fontWeight: '400', color: '#475569', marginTop: '2px' }}>{outcome.label}</div>
                      </button>
                    ))}
                  </div>

                  {/* Manual count adjusters */}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button disabled={!user} onClick={() => setBalls(b => Math.min(3, b+1))} style={{ background:'#0f172a', border:'1px solid #22c55e44', borderRadius:'6px', color:'#22c55e', cursor:'pointer', fontSize:'11px', fontWeight:'800', padding:'5px 10px' }}>+Ball</button>
                    <button disabled={!user} onClick={() => setStrikes(s => Math.min(2, s+1))} style={{ background:'#0f172a', border:'1px solid #ef444444', borderRadius:'6px', color:'#ef4444', cursor:'pointer', fontSize:'11px', fontWeight:'800', padding:'5px 10px' }}>+Strike</button>
                    <button disabled={!user} onClick={() => setOuts(o => Math.min(3, o+1))} style={{ background:'#0f172a', border:'1px solid #f59e0b44', borderRadius:'6px', color:'#f59e0b', cursor:'pointer', fontSize:'11px', fontWeight:'800', padding:'5px 10px' }}>+Out</button>
                    <div style={{ width:'1px', background:'#1e293b' }} />
                    {['1B','2B','3B'].map((base, i) => {
                      const states = [runnerOnFirst, runnerOnSecond, runnerOnThird];
                      const setters = [setRunnerOnFirst, setRunnerOnSecond, setRunnerOnThird];
                      return (
                        <button key={base} disabled={!user} onClick={() => setters[i](v => !v)}
                          style={{ background: states[i] ? 'rgba(245,158,11,0.2)' : '#0f172a', border:`1.5px solid ${states[i] ? '#f59e0b' : '#1e293b'}`, borderRadius:'6px', color: states[i] ? '#f59e0b' : '#475569', cursor:'pointer', fontSize:'11px', fontWeight:'900', padding:'5px 10px' }}>
                          {base}
                        </button>
                      );
                    })}
                    <button disabled={!user} onClick={recordManualRun} style={{ background:'rgba(239,68,68,0.1)', border:'1px solid #ef444455', borderRadius:'6px', color:'#ef4444', cursor:'pointer', fontSize:'11px', fontWeight:'900', padding:'5px 10px' }}>+Opp Run</button>
                  </div>
                </div>
              )}

              {/* ── MAIN SCORING BODY ── */}
              <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', display: oppScoringMode ? 'none' : 'flex' }}>

                {/* LEFT: LINEUP RAIL */}
                {lineupEntries.length > 0 && !isMobile && (
                  <div style={{ width: '120px', flexShrink: 0, borderRight: '1px solid #1e293b', overflowY: 'auto', background: '#020617' }}>
                    <div style={{ padding: '8px 6px', fontSize: '9px', color: '#334155', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #0f172a' }}>Batting Order</div>
                    {lineupEntries.map((entry, idx) => {
                      const name = [entry.firstName, entry.lastName].filter(Boolean).join(' ') || entry.name || `#${entry.jersey || idx + 1}`;
                      const isCurrent = idx === lineupBatterIndex;
                      return (
                        <div key={entry.id || idx}
                          onClick={() => { setLineupBatterIndex(idx); setCurrentBatter(name); }}
                          style={{ padding: '9px 8px', borderBottom: '1px solid #0f172a', cursor: 'pointer', background: isCurrent ? 'rgba(56,189,248,0.12)' : 'transparent', borderLeft: isCurrent ? '3px solid #38bdf8' : '3px solid transparent', display: 'flex', flexDirection: 'column', gap: '1px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '9px', color: isCurrent ? '#38bdf8' : '#334155', fontWeight: '900', fontFamily: 'monospace' }}>{idx + 1}</span>
                            {entry.jersey && <span style={{ fontSize: '9px', color: '#334155', fontWeight: '700' }}>#{entry.jersey}</span>}
                          </div>
                          <span style={{ fontSize: '11px', color: isCurrent ? '#fff' : '#64748b', fontWeight: isCurrent ? '800' : '400', lineHeight: 1.2 }}>{name}</span>
                          {entry.position && <span style={{ fontSize: '9px', color: '#334155' }}>{entry.position}</span>}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* RIGHT: SCORING PANEL */}
                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 0 }}>

                  {/* ── BATTER CARD (GC-style: jersey · position · avg) ── */}
                  <div style={{ padding: '12px 16px', background: '#030d1e', borderBottom: '1px solid #1e293b', flexShrink: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {/* Jersey number badge */}
                        {lineupEntries[lineupBatterIndex]?.jersey && (
                          <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#1e293b', border: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '15px', color: '#f59e0b', fontFamily: 'monospace', flexShrink: 0 }}>
                            {lineupEntries[lineupBatterIndex].jersey}
                          </div>
                        )}
                        <div>
                          <div style={{ fontSize: '16px', fontWeight: '900', color: '#fff', lineHeight: 1.1 }}>
                            {currentBatter || <span style={{ color: '#334155', fontWeight: '400', fontSize: '13px' }}>No batter — set lineup</span>}
                          </div>
                          <div style={{ fontSize: '11px', color: '#475569', marginTop: '2px', display: 'flex', gap: '8px' }}>
                            {lineupEntries[lineupBatterIndex]?.position && <span style={{ color: '#64748b' }}>{lineupEntries[lineupBatterIndex].position}</span>}
                            <span>vs. <strong style={{ color: '#94a3b8' }}>{currentPitcher || '—'}</strong></span>
                            <span style={{ color: '#334155' }}>P#{pitchCount}</span>
                          </div>
                        </div>
                      </div>
                      {/* Pitch type + velo inline */}
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexShrink: 0 }}>
                        <select value={pitchType} onChange={e => setPitchType(e.target.value)} disabled={!user}
                          style={{ background: '#0f172a', border: '1px solid #1e293b', color: '#94a3b8', borderRadius: '6px', padding: '4px 6px', fontSize: '11px', fontWeight: '800' }}>
                          {[['FB','Fastball'],['CB','Curveball'],['CH','Changeup'],['SL','Slider'],['CT','Cutter'],['SP','Splitter'],['2S','2-Seam'],['KN','Knuckleball']].map(([t,l]) => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <input type="number" min="40" max="110" placeholder="MPH" value={pitchVelo} onChange={e => setPitchVelo(e.target.value)} disabled={!user}
                          style={{ background: '#0f172a', border: '1px solid #1e293b', color: '#f8fafc', borderRadius: '6px', padding: '4px 6px', fontSize: '11px', width: '56px', textAlign: 'center' }} />
                        {pitchLog.filter(p => p.velo).length > 0 && (() => {
                          const vl = pitchLog.filter(p => p.velo);
                          const top = Math.max(...vl.map(p => p.velo));
                          return <span style={{ fontSize: '10px', color: '#475569' }}>top <strong style={{ color: '#f59e0b' }}>{top}</strong></span>;
                        })()}
                      </div>
                    </div>

                    {/* B · S · O dots — GC-style large */}
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '10px', color: '#475569', fontWeight: '800', width: '14px' }}>B</span>
                        {[0,1,2,3].map(i => <div key={i} style={{ width: '14px', height: '14px', borderRadius: '50%', background: i < balls ? '#22c55e' : '#1e293b', border: `1.5px solid ${i < balls ? '#22c55e' : '#334155'}`, transition: 'background 0.1s' }} />)}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '10px', color: '#475569', fontWeight: '800', width: '14px' }}>S</span>
                        {[0,1,2].map(i => <div key={i} style={{ width: '14px', height: '14px', borderRadius: '50%', background: i < strikes ? '#eab308' : '#1e293b', border: `1.5px solid ${i < strikes ? '#eab308' : '#334155'}`, transition: 'background 0.1s' }} />)}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '10px', color: '#475569', fontWeight: '800', width: '14px' }}>O</span>
                        {[0,1,2].map(i => <div key={i} style={{ width: '14px', height: '14px', borderRadius: '50%', background: i < outs ? '#ef4444' : '#1e293b', border: `1.5px solid ${i < outs ? '#ef4444' : '#334155'}`, transition: 'background 0.1s' }} />)}
                      </div>
                    </div>
                  </div>

                  {/* ── GC PITCH / OUTCOME TOGGLE AREA ── */}
                  <div style={{ flex: 1, padding: '14px 14px 10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>

                    {scoringWorkflowStep !== 'result' ? (
                      /* ── PITCH BUTTONS (2-row pill layout, GC-style) ── */
                      <>
                        {/* Row 1: Ball · Called Strike · Foul */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                          {[pitchResults[0], pitchResults[1], pitchResults[3]].map((pitch) => {
                            const colorMap = { ball: '#22c55e', called_strike: '#ef4444', foul: '#eab308' };
                            const bg = colorMap[pitch.result];
                            return (
                              <button key={pitch.result} disabled={!user} onClick={() => recordPitch(pitch.result)}
                                style={{ background: `${bg}18`, border: `2px solid ${bg}66`, borderRadius: '14px', color: bg, cursor: 'pointer', fontWeight: '900', padding: '18px 8px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', fontSize: '14px', WebkitTapHighlightColor: 'transparent', transition: 'all 0.08s' }}
                                onMouseDown={e => { e.currentTarget.style.background=`${bg}33`; e.currentTarget.style.transform='scale(0.97)'; }}
                                onMouseUp={e => { e.currentTarget.style.background=`${bg}18`; e.currentTarget.style.transform='scale(1)'; }}
                                onTouchEnd={e => { e.currentTarget.style.background=`${bg}18`; e.currentTarget.style.transform='scale(1)'; }}>
                                <span style={{ fontSize: '22px', fontFamily: 'monospace', fontWeight: '900', lineHeight: 1 }}>{pitch.notation}</span>
                                <span style={{ fontSize: '10px', color: '#64748b' }}>{pitch.label}</span>
                              </button>
                            );
                          })}
                        </div>
                        {/* Row 2: Swinging Strike · In Play (wide) · HBP */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr 1fr', gap: '10px' }}>
                          {[pitchResults[2], pitchResults[4], pitchResults[5]].map((pitch) => {
                            const colorMap = { swinging_strike: '#f97316', in_play: '#38bdf8', hit_by_pitch: '#a78bfa' };
                            const bg = colorMap[pitch.result];
                            const isInPlay = pitch.result === 'in_play';
                            return (
                              <button key={pitch.result} disabled={!user} onClick={() => recordPitch(pitch.result)}
                                style={{ background: isInPlay ? `${bg}28` : `${bg}18`, border: `2px solid ${isInPlay ? bg : bg+'66'}`, borderRadius: '14px', color: bg, cursor: 'pointer', fontWeight: '900', padding: '18px 8px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', fontSize: '14px', WebkitTapHighlightColor: 'transparent', transition: 'all 0.08s' }}
                                onMouseDown={e => { e.currentTarget.style.background=`${bg}40`; e.currentTarget.style.transform='scale(0.97)'; }}
                                onMouseUp={e => { e.currentTarget.style.background=isInPlay?`${bg}28`:`${bg}18`; e.currentTarget.style.transform='scale(1)'; }}
                                onTouchEnd={e => { e.currentTarget.style.background=isInPlay?`${bg}28`:`${bg}18`; e.currentTarget.style.transform='scale(1)'; }}>
                                <span style={{ fontSize: '22px', fontFamily: 'monospace', fontWeight: '900', lineHeight: 1 }}>{pitch.notation}</span>
                                <span style={{ fontSize: '10px', color: '#64748b' }}>{pitch.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </>
                    ) : (
                      /* ── OUTCOME GRID (slides in after In Play) ── */
                      <>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                          <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>⚡ Ball In Play — select result</span>
                          <button onClick={() => setScoringWorkflowStep('pitch')} style={{ background: 'transparent', border: 'none', color: '#475569', cursor: 'pointer', fontSize: '18px', padding: '0 4px' }}>←</button>
                        </div>
                        {/* Hits row */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                          {plateAppearanceResults.filter(o => o.kind === 'hit').map((outcome) => (
                            <button key={outcome.result} disabled={!user} onClick={() => recordPlateAppearance(outcome)}
                              style={{ background: '#22c55e22', border: '2px solid #22c55e', borderRadius: '12px', color: '#22c55e', cursor: 'pointer', fontWeight: '900', padding: '16px 6px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', WebkitTapHighlightColor: 'transparent' }}
                              onMouseDown={e => { e.currentTarget.style.background='#22c55e44'; e.currentTarget.style.transform='scale(0.96)'; }}
                              onMouseUp={e => { e.currentTarget.style.background='#22c55e22'; e.currentTarget.style.transform='scale(1)'; }}
                              onTouchEnd={e => { e.currentTarget.style.background='#22c55e22'; e.currentTarget.style.transform='scale(1)'; }}>
                              <span style={{ fontSize: '20px', fontFamily: 'monospace', fontWeight: '900', lineHeight: 1 }}>{outcome.notation}</span>
                              <span style={{ fontSize: '9px', color: '#64748b' }}>{outcome.label}</span>
                            </button>
                          ))}
                        </div>
                        {/* Outs + other row */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                          {plateAppearanceResults.filter(o => o.kind !== 'hit').map((outcome) => {
                            const kindColor = { walk: '#38bdf8', out: '#ef4444', error: '#f97316', sacrifice: '#a78bfa', fielders_choice: '#eab308' };
                            const bg = kindColor[outcome.kind] || '#64748b';
                            return (
                              <button key={outcome.result} disabled={!user} onClick={() => recordPlateAppearance(outcome)}
                                style={{ background: `${bg}18`, border: `1.5px solid ${bg}66`, borderRadius: '10px', color: bg, cursor: 'pointer', fontWeight: '900', padding: '12px 4px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', WebkitTapHighlightColor: 'transparent' }}
                                onMouseDown={e => { e.currentTarget.style.background=`${bg}35`; e.currentTarget.style.transform='scale(0.96)'; }}
                                onMouseUp={e => { e.currentTarget.style.background=`${bg}18`; e.currentTarget.style.transform='scale(1)'; }}
                                onTouchEnd={e => { e.currentTarget.style.background=`${bg}18`; e.currentTarget.style.transform='scale(1)'; }}>
                                <span style={{ fontSize: '16px', fontFamily: 'monospace', fontWeight: '900', lineHeight: 1 }}>{outcome.notation}</span>
                                <span style={{ fontSize: '9px', color: '#64748b' }}>{outcome.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </>
                    )}

                    {/* ── ENHANCED PITCH TRACKING PANEL ── */}
                    {showPitchDetails && (
                      <div style={{ background: '#0a0f1f', border: '1px solid #1e293b', borderRadius: '12px', padding: '12px', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                          <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: '800', textTransform: 'uppercase' }}>⚡ Pitch Details</span>
                          <button onClick={() => setShowPitchDetails(false)} style={{ background: 'transparent', border: 'none', color: '#475569', cursor: 'pointer', fontSize: '14px' }}>✕</button>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '10px' }}>
                          <div>
                            <label style={{ fontSize: '9px', color: '#64748b', display: 'block', marginBottom: '2px' }}>Velocity</label>
                            <input 
                              type="number" 
                              value={pitchVelo} 
                              onChange={e => setPitchVelo(e.target.value)}
                              placeholder="mph"
                              style={{ 
                                background: '#0f172a', 
                                border: '1px solid #334155', 
                                borderRadius: '6px', 
                                color: '#fff', 
                                padding: '4px 6px', 
                                fontSize: '11px', 
                                width: '100%' 
                              }}
                            />
                          </div>
                          
                          <div>
                            <label style={{ fontSize: '9px', color: '#64748b', display: 'block', marginBottom: '2px' }}>Type</label>
                            <select 
                              value={pitchType} 
                              onChange={e => setPitchType(e.target.value)}
                              style={{ 
                                background: '#0f172a', 
                                border: '1px solid #334155', 
                                borderRadius: '6px', 
                                color: '#fff', 
                                padding: '4px 6px', 
                                fontSize: '11px', 
                                width: '100%' 
                              }}
                            >
                              <option value="FB">FB</option>
                              <option value="CH">CH</option>
                              <option value="CU">CU</option>
                              <option value="SL">SL</option>
                              <option value="SI">SI</option>
                              <option value="KC">KC</option>
                            </select>
                          </div>
                          
                          <div>
                            <label style={{ fontSize: '9px', color: '#64748b', display: 'block', marginBottom: '2px' }}>Location</label>
                            <select 
                              value={pitchLocation} 
                              onChange={e => setPitchLocation(e.target.value)}
                              style={{ 
                                background: '#0f172a', 
                                border: '1px solid #334155', 
                                borderRadius: '6px', 
                                color: '#fff', 
                                padding: '4px 6px', 
                                fontSize: '11px', 
                                width: '100%' 
                              }}
                            >
                              <option value="">--</option>
                              <option value="high">High</option>
                              <option value="low">Low</option>
                              <option value="inside">Inside</option>
                              <option value="outside">Outside</option>
                              <option value="middle">Middle</option>
                            </select>
                          </div>
                          
                          <div>
                            <label style={{ fontSize: '9px', color: '#64748b', display: 'block', marginBottom: '2px' }}>Result</label>
                            <select 
                              value={pitchResult} 
                              onChange={e => setPitchResult(e.target.value)}
                              style={{ 
                                background: '#0f172a', 
                                border: '1px solid #334155', 
                                borderRadius: '6px', 
                                color: '#fff', 
                                padding: '4px 6px', 
                                fontSize: '11px', 
                                width: '100%' 
                              }}
                            >
                              <option value="">--</option>
                              <option value="swinging">Swinging</option>
                              <option value="looking">Looking</option>
                              <option value="foul">Foul</option>
                              <option value="contact">Contact</option>
                            </select>
                          </div>
                        </div>
                        
                        {/* Pitcher Stats Summary */}
                        <div style={{ display: 'flex', gap: '12px', fontSize: '10px', color: '#64748b' }}>
                          <span>⚾ {pitcherStats.strikes} K</span>
                          <span>🎯 {pitcherStats.balls} B</span>
                          <span>💨 {pitcherStats.kCount} Ks</span>
                          <span>🚶 {pitcherStats.bbCount} BBs</span>
                          <span>📊 {atBatCount} PA</span>
                        </div>
                      </div>
                    )}

                    {/* ── ADVANCED SCORING SHORTCUTS ── */}
                    <div style={{ background: '#0a0f1f', border: '1px solid #1e293b', borderRadius: '12px', padding: '12px', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: '800', textTransform: 'uppercase' }}>⚡ Quick Actions</span>
                      </div>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                        {/* Common scoring shortcuts */}
                        <button
                          disabled={!user}
                          onClick={() => {
                            // Quick strikeout
                            setStrikes(2);
                            recordPitch('swinging_strike');
                          }}
                          style={{ 
                            background: '#ef4444', 
                            color: '#fff', 
                            border: 'none', 
                            borderRadius: '6px', 
                            padding: '8px 6px', 
                            fontSize: '10px', 
                            fontWeight: '700', 
                            cursor: 'pointer' 
                          }}
                        >
                          K
                        </button>
                        
                        <button
                          disabled={!user}
                          onClick={() => {
                            // Quick walk
                            setBalls(3);
                            recordPitch('ball');
                          }}
                          style={{ 
                            background: '#38bdf8', 
                            color: '#fff', 
                            border: 'none', 
                            borderRadius: '6px', 
                            padding: '8px 6px', 
                            fontSize: '10px', 
                            fontWeight: '700', 
                            cursor: 'pointer' 
                          }}
                        >
                          BB
                        </button>
                        
                        <button
                          disabled={!user}
                          onClick={() => {
                            // Quick single
                            recordPitch('in_play');
                            setTimeout(() => recordPlateAppearance(plateAppearanceResults.find(r => r.result === 'single')), 100);
                          }}
                          style={{ 
                            background: '#22c55e', 
                            color: '#fff', 
                            border: 'none', 
                            borderRadius: '6px', 
                            padding: '8px 6px', 
                            fontSize: '10px', 
                            fontWeight: '700', 
                            cursor: 'pointer' 
                          }}
                        >
                          1B
                        </button>
                        
                        <button
                          disabled={!user}
                          onClick={() => {
                            // Quick double
                            recordPitch('in_play');
                            setTimeout(() => recordPlateAppearance(plateAppearanceResults.find(r => r.result === 'double')), 100);
                          }}
                          style={{ 
                            background: '#22c55e', 
                            color: '#fff', 
                            border: 'none', 
                            borderRadius: '6px', 
                            padding: '8px 6px', 
                            fontSize: '10px', 
                            fontWeight: '700', 
                            cursor: 'pointer' 
                          }}
                        >
                          2B
                        </button>
                        
                        <button
                          disabled={!user}
                          onClick={() => {
                            // Quick groundout
                            recordPitch('in_play');
                            setTimeout(() => recordPlateAppearance(plateAppearanceResults.find(r => r.result === 'groundout')), 100);
                          }}
                          style={{ 
                            background: '#64748b', 
                            color: '#fff', 
                            border: 'none', 
                            borderRadius: '6px', 
                            padding: '8px 6px', 
                            fontSize: '10px', 
                            fontWeight: '700', 
                            cursor: 'pointer' 
                          }}
                        >
                          GO
                        </button>
                        
                        <button
                          disabled={!user}
                          onClick={() => {
                            // Quick flyout
                            recordPitch('in_play');
                            setTimeout(() => recordPlateAppearance(plateAppearanceResults.find(r => r.result === 'flyout')), 100);
                          }}
                          style={{ 
                            background: '#64748b', 
                            color: '#fff', 
                            border: 'none', 
                            borderRadius: '6px', 
                            padding: '8px 6px', 
                            fontSize: '10px', 
                            fontWeight: '700', 
                            cursor: 'pointer' 
                          }}
                        >
                          FO
                        </button>
                      </div>
                      
                      {/* Advanced controls */}
                      <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                        <button
                          disabled={!user}
                          onClick={() => {
                            // Clear count
                            setBalls(0);
                            setStrikes(0);
                            setLastPlaySummary('Count cleared');
                          }}
                          style={{ 
                            background: '#0f172a', 
                            color: '#64748b', 
                            border: '1px solid #334155', 
                            borderRadius: '6px', 
                            padding: '6px 10px', 
                            fontSize: '9px', 
                            fontWeight: '600', 
                            cursor: 'pointer' 
                          }}
                        >
                          Clear Count
                        </button>
                        
                        <button
                          disabled={!user}
                          onClick={() => {
                            // Undo last pitch
                            if (pitchLog.length > 0) {
                              const lastPitch = pitchLog[pitchLog.length - 1];
                              setPitchLog(pitchLog.slice(0, -1));
                              setPitchCount(Math.max(0, pitchCount - 1));
                              setLastPlaySummary('Last pitch removed');
                            }
                          }}
                          style={{ 
                            background: '#0f172a', 
                            color: '#64748b', 
                            border: '1px solid #334155', 
                            borderRadius: '6px', 
                            padding: '6px 10px', 
                            fontSize: '9px', 
                            fontWeight: '600', 
                            cursor: 'pointer' 
                          }}
                        >
                          Undo Pitch
                        </button>
                        
                        <button
                          disabled={!user}
                          onClick={() => {
                            // Advance batter
                            advanceBatterInLineup();
                            setBalls(0);
                            setStrikes(0);
                            setLastPlaySummary('Batter advanced');
                          }}
                          style={{ 
                            background: '#0f172a', 
                            color: '#64748b', 
                            border: '1px solid #334155', 
                            borderRadius: '6px', 
                            padding: '6px 10px', 
                            fontSize: '9px', 
                            fontWeight: '600', 
                            cursor: 'pointer' 
                          }}
                        >
                          Next Batter
                        </button>
                      </div>
                    </div>

                    {/* ── SCORING ANALYTICS PANEL ── */}
                    <div style={{ background: '#0a0f1f', border: '1px solid #1e293b', borderRadius: '12px', padding: '12px', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: '800', textTransform: 'uppercase' }}>📊 Live Analytics</span>
                      </div>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '10px' }}>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '16px', fontWeight: '900', color: '#f59e0b' }}>{pitchCount}</div>
                          <div style={{ fontSize: '9px', color: '#64748b' }}>Pitches</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '16px', fontWeight: '900', color: '#22c55e' }}>{ourLiveScore}-{theirLiveScore}</div>
                          <div style={{ fontSize: '9px', color: '#64748b' }}>Score</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '16px', fontWeight: '900', color: '#38bdf8' }}>{ourHits}-{theirHits}</div>
                          <div style={{ fontSize: '9px', color: '#64748b' }}>Hits</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '16px', fontWeight: '900', color: '#ef4444' }}>{outs}</div>
                          <div style={{ fontSize: '9px', color: '#64748b' }}>Outs</div>
                        </div>
                      </div>
                      
                      {/* Pitch Efficiency */}
                      {pitchCount > 0 && (
                        <div style={{ display: 'flex', gap: '12px', fontSize: '10px', color: '#64748b', borderTop: '1px solid #1e293b', paddingTop: '8px' }}>
                          <span>⚡ P/IP: {Math.round(pitchCount / Math.max(1, currentInning - (isTopInning ? 0 : 0.5)))}</span>
                          <span>🎯 K%: {pitcherStats.strikes > 0 ? Math.round((pitcherStats.kCount / pitcherStats.strikes) * 100) : 0}%</span>
                          <span>🚶 BB%: {pitcherStats.balls > 0 ? Math.round((pitcherStats.bbCount / pitcherStats.balls) * 100) : 0}%</span>
                        </div>
                      )}
                    </div>

                    {/* ── PLAY LOG EDIT/UNDO PANEL ── */}
                    {showPlayLog && (
                      <div style={{ background: '#0a0f1f', border: '1px solid #1e293b', borderRadius: '12px', padding: '12px', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                          <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: '800', textTransform: 'uppercase' }}>📝 Play Log</span>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button 
                              onClick={() => setCorrectionMode(!correctionMode)}
                              style={{ 
                                background: correctionMode ? 'rgba(239,68,68,0.15)' : '#0f172a', 
                                border: `1px solid ${correctionMode ? '#ef4444' : '#334155'}`, 
                                borderRadius: '6px', 
                                color: correctionMode ? '#ef4444' : '#64748b', 
                                cursor: 'pointer', 
                                fontSize: '9px', 
                                fontWeight: '600', 
                                padding: '4px 8px' 
                              }}
                            >
                              {correctionMode ? 'Exit Edit' : 'Edit Mode'}
                            </button>
                            <button onClick={() => setShowPlayLog(false)} style={{ background: 'transparent', border: 'none', color: '#475569', cursor: 'pointer', fontSize: '14px' }}>✕</button>
                          </div>
                        </div>
                        
                        {/* Event List */}
                        <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '10px' }}>
                          {eventHistory.length === 0 ? (
                            <div style={{ textAlign: 'center', color: '#64748b', fontSize: '11px', padding: '20px' }}>
                              No events recorded yet
                            </div>
                          ) : (
                            eventHistory.slice().reverse().map((event, index) => (
                              <div 
                                key={event.id} 
                                style={{ 
                                  background: selectedEvents.includes(event.id) ? 'rgba(56,189,248,0.1)' : '#0f172a', 
                                  border: `1px solid ${selectedEvents.includes(event.id) ? '#38bdf8' : '#1e293b'}`, 
                                  borderRadius: '6px', 
                                  padding: '8px', 
                                  marginBottom: '6px',
                                  cursor: correctionMode ? 'pointer' : 'default'
                                }}
                                onClick={() => {
                                  if (correctionMode) {
                                    setSelectedEvents(prev => 
                                      prev.includes(event.id) 
                                        ? prev.filter(id => id !== event.id)
                                        : [...prev, event.id]
                                    );
                                  }
                                }}
                              >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                  <span style={{ fontSize: '10px', color: '#64748b' }}>
                                    {new Date(event.timestamp).toLocaleTimeString()}
                                  </span>
                                  <span style={{ fontSize: '9px', color: '#38bdf8', fontWeight: '600' }}>
                                    Inning {event.data.gameContext?.inning || '-'} {event.data.gameContext?.half || '-'}
                                  </span>
                                </div>
                                
                                <div style={{ fontSize: '11px', color: '#e2e8f0', marginBottom: '4px' }}>
                                  {event.data.label || event.type}
                                </div>
                                
                                {event.data.playerContext && (
                                  <div style={{ fontSize: '10px', color: '#64748b' }}>
                                    {event.data.playerContext.batter} vs {event.data.playerContext.pitcher}
                                  </div>
                                )}
                                
                                {/* Edit Actions */}
                                {correctionMode && (
                                  <div style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingEvent(event);
                                      }}
                                      style={{ 
                                        background: '#38bdf8', 
                                        color: '#020617', 
                                        border: 'none', 
                                        borderRadius: '4px', 
                                        padding: '2px 6px', 
                                        fontSize: '8px', 
                                        fontWeight: '600', 
                                        cursor: 'pointer' 
                                      }}
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        deleteEvent(event.id);
                                      }}
                                      style={{ 
                                        background: '#ef4444', 
                                        color: '#fff', 
                                        border: 'none', 
                                        borderRadius: '4px', 
                                        padding: '2px 6px', 
                                        fontSize: '8px', 
                                        fontWeight: '600', 
                                        cursor: 'pointer' 
                                      }}
                                    >
                                      Delete
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        revertToEvent(event.id);
                                      }}
                                      style={{ 
                                        background: '#f59e0b', 
                                        color: '#020617', 
                                        border: 'none', 
                                        borderRadius: '4px', 
                                        padding: '2px 6px', 
                                        fontSize: '8px', 
                                        fontWeight: '600', 
                                        cursor: 'pointer' 
                                      }}
                                    >
                                      Revert
                                    </button>
                                  </div>
                                )}
                              </div>
                            ))
                          )}
                        </div>
                        
                        {/* Bulk Actions */}
                        {correctionMode && selectedEvents.length > 0 && (
                          <div style={{ borderTop: '1px solid #1e293b', paddingTop: '8px', display: 'flex', gap: '6px' }}>
                            <button
                              onClick={() => {
                                selectedEvents.forEach(eventId => deleteEvent(eventId));
                                setSelectedEvents([]);
                              }}
                              style={{ 
                                background: '#ef4444', 
                                color: '#fff', 
                                border: 'none', 
                                borderRadius: '6px', 
                                padding: '6px 10px', 
                                fontSize: '9px', 
                                fontWeight: '600', 
                                cursor: 'pointer' 
                              }}
                            >
                              Delete Selected ({selectedEvents.length})
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* ── LINEUP TEMPLATE MANAGER ── */}
                    {showTemplateManager && (
                      <div style={{ background: '#0a0f1f', border: '1px solid #1e293b', borderRadius: '12px', padding: '12px', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                          <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: '800', textTransform: 'uppercase' }}>📋 Lineup Templates</span>
                          <button onClick={() => setShowTemplateManager(false)} style={{ background: 'transparent', border: 'none', color: '#475569', cursor: 'pointer', fontSize: '14px' }}>✕</button>
                        </div>
                        
                        {/* Quick Templates */}
                        <div style={{ marginBottom: '12px' }}>
                          <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '6px', textTransform: 'uppercase' }}>Quick Templates</div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                            <button
                              onClick={() => createQuickTemplate('vs-lefty')}
                              style={{ 
                                background: '#0f172a', 
                                color: '#38bdf8', 
                                border: '1px solid #334155', 
                                borderRadius: '6px', 
                                padding: '6px 8px', 
                                fontSize: '9px', 
                                fontWeight: '600', 
                                cursor: 'pointer' 
                              }}
                            >
                              vs LHP
                            </button>
                            <button
                              onClick={() => createQuickTemplate('vs-righty')}
                              style={{ 
                                background: '#0f172a', 
                                color: '#38bdf8', 
                                border: '1px solid #334155', 
                                borderRadius: '6px', 
                                padding: '6px 8px', 
                                fontSize: '9px', 
                                fontWeight: '600', 
                                cursor: 'pointer' 
                              }}
                            >
                              vs RHP
                            </button>
                            <button
                              onClick={() => createQuickTemplate('tournament')}
                              style={{ 
                                background: '#0f172a', 
                                color: '#38bdf8', 
                                border: '1px solid #334155', 
                                borderRadius: '6px', 
                                padding: '6px 8px', 
                                fontSize: '9px', 
                                fontWeight: '600', 
                                cursor: 'pointer' 
                              }}
                            >
                              Tournament
                            </button>
                          </div>
                        </div>
                        
                        {/* Save Current Lineup */}
                        <div style={{ marginBottom: '12px' }}>
                          <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '6px', textTransform: 'uppercase' }}>Save Current Lineup</div>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <input
                              type="text"
                              value={templateName}
                              onChange={e => setTemplateName(e.target.value)}
                              placeholder="Template name"
                              style={{ 
                                background: '#0f172a', 
                                border: '1px solid #334155', 
                                borderRadius: '6px', 
                                color: '#fff', 
                                padding: '6px 8px', 
                                fontSize: '10px', 
                                flex: 1 
                              }}
                            />
                            <select
                              value={opponentType}
                              onChange={e => setOpponentType(e.target.value)}
                              style={{ 
                                background: '#0f172a', 
                                border: '1px solid #334155', 
                                borderRadius: '6px', 
                                color: '#fff', 
                                padding: '6px 8px', 
                                fontSize: '10px' 
                              }}
                            >
                              <option value="generic">Generic</option>
                              <option value="lefty">vs LHP</option>
                              <option value="righty">vs RHP</option>
                            </select>
                            <button
                              onClick={saveLineupTemplate}
                              disabled={!templateName.trim()}
                              style={{ 
                                background: templateName.trim() ? '#22c55e' : '#1e293b', 
                                color: templateName.trim() ? '#fff' : '#64748b', 
                                border: 'none', 
                                borderRadius: '6px', 
                                padding: '6px 12px', 
                                fontSize: '9px', 
                                fontWeight: '600', 
                                cursor: templateName.trim() ? 'pointer' : 'not-allowed' 
                              }}
                            >
                              Save
                            </button>
                          </div>
                        </div>
                        
                        {/* Saved Templates */}
                        <div>
                          <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '6px', textTransform: 'uppercase' }}>Saved Templates</div>
                          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                            {lineupTemplates.length === 0 ? (
                              <div style={{ textAlign: 'center', color: '#64748b', fontSize: '10px', padding: '20px' }}>
                                No saved templates yet
                              </div>
                            ) : (
                              lineupTemplates.map(template => (
                                <div 
                                  key={template.id}
                                  style={{ 
                                    background: '#0f172a', 
                                    border: '1px solid #1e293b', 
                                    borderRadius: '6px', 
                                    padding: '8px', 
                                    marginBottom: '6px' 
                                  }}
                                >
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                    <span style={{ fontSize: '11px', color: '#e2e8f0', fontWeight: '600' }}>
                                      {template.name}
                                    </span>
                                    <span style={{ fontSize: '9px', color: '#64748b', background: '#1e293b', padding: '2px 6px', borderRadius: '4px' }}>
                                      {template.opponentType}
                                    </span>
                                  </div>
                                  <div style={{ fontSize: '9px', color: '#64748b', marginBottom: '6px' }}>
                                    {template.lineup?.length || 0} players • {new Date(template.createdAt).toLocaleDateString()}
                                  </div>
                                  <div style={{ display: 'flex', gap: '4px' }}>
                                    <button
                                      onClick={() => loadLineupTemplate(template.id)}
                                      style={{ 
                                        background: '#38bdf8', 
                                        color: '#020617', 
                                        border: 'none', 
                                        borderRadius: '4px', 
                                        padding: '4px 8px', 
                                        fontSize: '8px', 
                                        fontWeight: '600', 
                                        cursor: 'pointer' 
                                      }}
                                    >
                                      Load
                                    </button>
                                    <button
                                      onClick={() => deleteLineupTemplate(template.id)}
                                      style={{ 
                                        background: '#ef4444', 
                                        color: '#fff', 
                                        border: 'none', 
                                        borderRadius: '4px', 
                                        padding: '4px 8px', 
                                        fontSize: '8px', 
                                        fontWeight: '600', 
                                        cursor: 'pointer' 
                                      }}
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ── ADVANCED ANALYTICS DASHBOARD ── */}
                    {showAnalytics && (
                      <div style={{ background: '#0a0f1f', border: '1px solid #1e293b', borderRadius: '12px', padding: '12px', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                          <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: '800', textTransform: 'uppercase' }}>📊 Analytics Dashboard</span>
                          <button onClick={() => setShowAnalytics(false)} style={{ background: 'transparent', border: 'none', color: '#475569', cursor: 'pointer', fontSize: '14px' }}>✕</button>
                        </div>
                        
                        {/* Analytics Controls */}
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                          <select
                            value={selectedTimeRange}
                            onChange={e => setSelectedTimeRange(e.target.value)}
                            style={{ 
                              background: '#0f172a', 
                              border: '1px solid #334155', 
                              borderRadius: '6px', 
                              color: '#fff', 
                              padding: '4px 8px', 
                              fontSize: '10px' 
                            }}
                          >
                            <option value="season">Full Season</option>
                            <option value="last10">Last 10 Games</option>
                            <option value="last5">Last 5 Games</option>
                          </select>
                          
                          <div style={{ display: 'flex', gap: '4px' }}>
                            {['overview', 'hitting', 'pitching', 'fielding'].map(view => (
                              <button
                                key={view}
                                onClick={() => setAnalyticsView(view)}
                                style={{ 
                                  background: analyticsView === view ? '#38bdf8' : '#0f172a', 
                                  color: analyticsView === view ? '#020617' : '#64748b', 
                                  border: '1px solid #334155', 
                                  borderRadius: '6px', 
                                  padding: '4px 8px', 
                                  fontSize: '9px', 
                                  fontWeight: '600', 
                                  cursor: 'pointer',
                                  textTransform: 'capitalize'
                                }}
                              >
                                {view}
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        {analyticsLoading ? (
                          <div style={{ textAlign: 'center', color: '#64748b', fontSize: '11px', padding: '20px' }}>
                            Loading analytics...
                          </div>
                        ) : (
                          <>
                            {/* Overview */}
                            {analyticsView === 'overview' && (
                              <div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '12px' }}>
                                  <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '6px', padding: '8px' }}>
                                    <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '4px' }}>Team Record</div>
                                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#38bdf8' }}>
                                      {teamAnalytics.record?.wins || 0}-{teamAnalytics.record?.losses || 0}
                                    </div>
                                    <div style={{ fontSize: '10px', color: '#64748b' }}>
                                      {teamAnalytics.record?.winPercentage || '0.0'}% win rate
                                    </div>
                                  </div>
                                  
                                  <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '6px', padding: '8px' }}>
                                    <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '4px' }}>Team Batting</div>
                                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#22c55e' }}>
                                      .{teamAnalytics.hitting?.avg || '000'}
                                    </div>
                                    <div style={{ fontSize: '10px', color: '#64748b' }}>
                                      {teamAnalytics.hitting?.runsPerGame || '0.0'} runs/game
                                    </div>
                                  </div>
                                  
                                  <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '6px', padding: '8px' }}>
                                    <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '4px' }}>Team Pitching</div>
                                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#ef4444' }}>
                                      {teamAnalytics.pitching?.era || '0.00'} ERA
                                    </div>
                                    <div style={{ fontSize: '10px', color: '#64748b' }}>
                                      {teamAnalytics.pitching?.whip || '0.00'} WHIP
                                    </div>
                                  </div>
                                  
                                  <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '6px', padding: '8px' }}>
                                    <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '4px' }}>Fielding</div>
                                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#f59e0b' }}>
                                      {teamAnalytics.fielding?.fieldingPct || '0.0'}%
                                    </div>
                                    <div style={{ fontSize: '10px', color: '#64748b' }}>
                                      {teamAnalytics.fielding?.errors || 0} errors
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            {/* Hitting Analytics */}
                            {analyticsView === 'hitting' && (
                              <div>
                                <div style={{ marginBottom: '12px' }}>
                                  <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '6px', textTransform: 'uppercase' }}>Top Hitters</div>
                                  <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                    {playerAnalytics
                                      .filter(p => p.ab > 0)
                                      .sort((a, b) => parseFloat(b.avg) - parseFloat(a.avg))
                                      .slice(0, 10)
                                      .map(player => (
                                        <div key={player.id} style={{ 
                                          background: '#0f172a', 
                                          border: '1px solid #1e293b', 
                                          borderRadius: '6px', 
                                          padding: '6px', 
                                          marginBottom: '4px',
                                          display: 'flex',
                                          justifyContent: 'space-between',
                                          alignItems: 'center'
                                        }}>
                                          <div>
                                            <div style={{ fontSize: '11px', color: '#e2e8f0', fontWeight: '600' }}>
                                              {player.firstName} {player.lastName}
                                            </div>
                                            <div style={{ fontSize: '9px', color: '#64748b' }}>
                                              {player.ab} AB • {player.hits} H • {player.rbi} RBI
                                            </div>
                                          </div>
                                          <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#22c55e' }}>
                                              .{player.avg}
                                            </div>
                                            <div style={{ fontSize: '9px', color: '#64748b' }}>
                                              OPS: {player.ops}
                                            </div>
                                            <div style={{ 
                                              fontSize: '8px', 
                                              color: player.trend === 'hot' ? '#22c55e' : player.trend === 'cold' ? '#ef4444' : '#64748b',
                                              fontWeight: '600'
                                            }}>
                                              {player.trend === 'hot' ? '🔥 Hot' : player.trend === 'cold' ? '❄️ Cold' : '➡️ Stable'}
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            {/* Pitching Analytics */}
                            {analyticsView === 'pitching' && (
                              <div>
                                <div style={{ marginBottom: '12px' }}>
                                  <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '6px', textTransform: 'uppercase' }}>Pitching Staff</div>
                                  <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                    {playerAnalytics
                                      .filter(p => p.ip > 0)
                                      .sort((a, b) => a.era - b.era)
                                      .slice(0, 10)
                                      .map(player => (
                                        <div key={player.id} style={{ 
                                          background: '#0f172a', 
                                          border: '1px solid #1e293b', 
                                          borderRadius: '6px', 
                                          padding: '6px', 
                                          marginBottom: '4px',
                                          display: 'flex',
                                          justifyContent: 'space-between',
                                          alignItems: 'center'
                                        }}>
                                          <div>
                                            <div style={{ fontSize: '11px', color: '#e2e8f0', fontWeight: '600' }}>
                                              {player.firstName} {player.lastName}
                                            </div>
                                            <div style={{ fontSize: '9px', color: '#64748b' }}>
                                              {player.ip} IP • {player.strikeouts} K • {player.bb} BB
                                            </div>
                                          </div>
                                          <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#ef4444' }}>
                                              {player.era.toFixed(2)} ERA
                                            </div>
                                            <div style={{ fontSize: '9px', color: '#64748b' }}>
                                              WHIP: {player.whip.toFixed(2)}
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            {/* Fielding Analytics */}
                            {analyticsView === 'fielding' && (
                              <div>
                                <div style={{ marginBottom: '12px' }}>
                                  <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '6px', textTransform: 'uppercase' }}>Fielding Leaders</div>
                                  <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                    {playerAnalytics
                                      .filter(p => (p.po + p.assists + p.errors) > 0)
                                      .sort((a, b) => {
                                        const aPct = (a.po + a.assists) / (a.po + a.assists + a.errors) || 0;
                                        const bPct = (b.po + b.assists) / (b.po + b.assists + b.errors) || 0;
                                        return bPct - aPct;
                                      })
                                      .slice(0, 10)
                                      .map(player => {
                                        const fieldingPct = ((player.po + player.assists) / (player.po + player.assists + player.errors) * 100) || 0;
                                        return (
                                          <div key={player.id} style={{ 
                                            background: '#0f172a', 
                                            border: '1px solid #1e293b', 
                                            borderRadius: '6px', 
                                            padding: '6px', 
                                            marginBottom: '4px',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                          }}>
                                            <div>
                                              <div style={{ fontSize: '11px', color: '#e2e8f0', fontWeight: '600' }}>
                                                {player.firstName} {player.lastName}
                                              </div>
                                              <div style={{ fontSize: '9px', color: '#64748b' }}>
                                                {player.primaryPosition} • {player.po} PO • {player.assists} A • {player.errors} E
                                              </div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                              <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#f59e0b' }}>
                                                {fieldingPct.toFixed(1)}%
                                              </div>
                                              <div style={{ fontSize: '9px', color: '#64748b' }}>
                                                Chances: {player.po + player.assists + player.errors}
                                              </div>
                                            </div>
                                          </div>
                                        );
                                      })}
                                  </div>
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    )}

                    {/* ── PITCH CHART VISUALIZATION ── */}
                    {showPitchChart && (
                      <div style={{ background: '#0a0f1f', border: '1px solid #1e293b', borderRadius: '12px', padding: '12px', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                          <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: '800', textTransform: 'uppercase' }}>🎯 Pitch Chart</span>
                          <button onClick={() => setShowPitchChart(false)} style={{ background: 'transparent', border: 'none', color: '#475569', cursor: 'pointer', fontSize: '14px' }}>✕</button>
                        </div>
                        
                        {/* Pitch Chart Controls */}
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                          <select
                            value={selectedPitchChartPlayer}
                            onChange={e => setSelectedPitchChartPlayer(e.target.value)}
                            style={{ 
                              background: '#0f172a', 
                              border: '1px solid #334155', 
                              borderRadius: '6px', 
                              color: '#fff', 
                              padding: '4px 8px', 
                              fontSize: '10px' 
                            }}
                          >
                            <option value="">All Players</option>
                            {processedRoster.map(player => (
                              <option key={player.id} value={`${player.firstName} ${player.lastName}`}>
                                {player.firstName} {player.lastName}
                              </option>
                            ))}
                          </select>
                          
                          <div style={{ display: 'flex', gap: '4px' }}>
                            {['spray', 'zone', 'heatmap'].map(view => (
                              <button
                                key={view}
                                onClick={() => setPitchChartView(view)}
                                style={{ 
                                  background: pitchChartView === view ? '#38bdf8' : '#0f172a', 
                                  color: pitchChartView === view ? '#020617' : '#64748b', 
                                  border: '1px solid #334155', 
                                  borderRadius: '6px', 
                                  padding: '4px 8px', 
                                  fontSize: '9px', 
                                  fontWeight: '600', 
                                  cursor: 'pointer',
                                  textTransform: 'capitalize'
                                }}
                              >
                                {view === 'spray' ? 'Spray Chart' : view === 'zone' ? 'Strike Zone' : 'Heat Map'}
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        {pitchChartLoading ? (
                          <div style={{ textAlign: 'center', color: '#64748b', fontSize: '11px', padding: '20px' }}>
                            Loading pitch data...
                          </div>
                        ) : (
                          <>
                            {/* Spray Chart */}
                            {pitchChartView === 'spray' && (
                              <div>
                                <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', padding: '16px', marginBottom: '12px' }}>
                                  <div style={{ position: 'relative', width: '100%', height: '300px' }}>
                                    {/* Baseball field visualization */}
                                    <svg viewBox="0 0 400 300" style={{ width: '100%', height: '100%' }}>
                                      {/* Field outline */}
                                      <polygon points="200,50 350,150 200,250 50,150" 
                                               fill="none" stroke="#334155" strokeWidth="2"/>
                                      
                                      {/* Bases */}
                                      <circle cx="200" cy="50" r="8" fill="#f59e0b"/> {/* Home */}
                                      <circle cx="350" cy="150" r="8" fill="#ef4444"/> {/* First */}
                                      <circle cx="200" cy="250" r="8" fill="#ef4444"/> {/* Second */}
                                      <circle cx="50" cy="150" r="8" fill="#ef4444"/> {/* Third */}
                                      
                                      {/* Pitch locations */}
                                      {calculateSprayChart(pitchData).map((pitch, index) => (
                                        <circle
                                          key={pitch.id}
                                          cx={200 + pitch.location.x * 100}
                                          cy={150 - pitch.location.y * 100}
                                          r="4"
                                          fill={
                                            pitch.outcome === 'hit' ? '#22c55e' :
                                            pitch.outcome === 'strike' ? '#ef4444' :
                                            pitch.outcome === 'ball' ? '#64748b' :
                                            pitch.outcome === 'foul' ? '#f59e0b' : '#38bdf8'
                                          }
                                          opacity="0.7"
                                        />
                                      ))}
                                      
                                      {/* Labels */}
                                      <text x="200" y="40" textAnchor="middle" fill="#e2e8f0" fontSize="12">Home</text>
                                      <text x="360" y="155" fill="#e2e8f0" fontSize="12">1B</text>
                                      <text x="200" y="270" textAnchor="middle" fill="#e2e8f0" fontSize="12">2B</text>
                                      <text x="40" y="155" textAnchor="end" fill="#e2e8f0" fontSize="12">3B</text>
                                    </svg>
                                  </div>
                                </div>
                                
                                {/* Legend */}
                                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }} />
                                    <span style={{ fontSize: '9px', color: '#64748b' }}>Hit</span>
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} />
                                    <span style={{ fontSize: '9px', color: '#64748b' }}>Strike</span>
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#64748b' }} />
                                    <span style={{ fontSize: '9px', color: '#64748b' }}>Ball</span>
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }} />
                                    <span style={{ fontSize: '9px', color: '#64748b' }}>Foul</span>
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#38bdf8' }} />
                                    <span style={{ fontSize: '9px', color: '#64748b' }}>Out</span>
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            {/* Strike Zone Analysis */}
                            {pitchChartView === 'zone' && (
                              <div>
                                <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', padding: '16px', marginBottom: '12px' }}>
                                  <div style={{ position: 'relative', width: '100%', height: '300px' }}>
                                    <svg viewBox="0 0 200 250" style={{ width: '100%', height: '100%' }}>
                                      {/* Strike zone */}
                                      <rect x="50" y="75" width="100" height="100" 
                                            fill="none" stroke="#38bdf8" strokeWidth="2"/>
                                      
                                      {/* Zone grid */}
                                      <line x1="50" y1="125" x2="150" y2="125" stroke="#1e293b" strokeWidth="1"/>
                                      <line x1="100" y1="75" x2="100" y2="175" stroke="#1e293b" strokeWidth="1"/>
                                      
                                      {/* Pitch locations */}
                                      {pitchData.map((pitch, index) => (
                                        <circle
                                          key={pitch.id}
                                          cx={100 + pitch.location.x * 50}
                                          cy={125 - pitch.location.y * 50}
                                          r="3"
                                          fill={
                                            pitch.outcome === 'hit' ? '#22c55e' :
                                            pitch.outcome === 'strike' ? '#ef4444' :
                                            pitch.outcome === 'ball' ? '#64748b' :
                                            pitch.outcome === 'foul' ? '#f59e0b' : '#38bdf8'
                                          }
                                          opacity="0.7"
                                        />
                                      ))}
                                      
                                      {/* Labels */}
                                      <text x="100" y="60" textAnchor="middle" fill="#e2e8f0" fontSize="10">Strike Zone</text>
                                      <text x="25" y="80" fill="#64748b" fontSize="8">High</text>
                                      <text x="25" y="130" fill="#64748b" fontSize="8">Middle</text>
                                      <text x="25" y="180" fill="#64748b" fontSize="8">Low</text>
                                    </svg>
                                  </div>
                                </div>
                                
                                {/* Strike Zone Stats */}
                                {(() => {
                                  const zoneAnalysis = calculateStrikeZone(pitchData);
                                  return (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                                      <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '6px', padding: '8px', textAlign: 'center' }}>
                                        <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '4px' }}>Total Pitches</div>
                                        <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#38bdf8' }}>
                                          {zoneAnalysis.total}
                                        </div>
                                      </div>
                                      <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '6px', padding: '8px', textAlign: 'center' }}>
                                        <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '4px' }}>In Zone</div>
                                        <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#22c55e' }}>
                                          {zoneAnalysis.strikeZone}
                                        </div>
                                      </div>
                                      <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '6px', padding: '8px', textAlign: 'center' }}>
                                        <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '4px' }}>Strike Rate</div>
                                        <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#ef4444' }}>
                                          {zoneAnalysis.strikeRate}%
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })()}
                              </div>
                            )}
                            
                            {/* Heat Map */}
                            {pitchChartView === 'heatmap' && (
                              <div>
                                <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', padding: '16px', marginBottom: '12px' }}>
                                  <div style={{ position: 'relative', width: '100%', height: '300px' }}>
                                    <svg viewBox="0 0 200 250" style={{ width: '100%', height: '100%' }}>
                                      {/* Heat map grid */}
                                      {(() => {
                                        const heatMap = calculateHeatMap(pitchData);
                                        return heatMap.grid.map((row, y) => 
                                          row.map((intensity, x) => (
                                            <rect
                                              key={`${x}-${y}`}
                                              x={x * 20}
                                              y={y * 25}
                                              width="20"
                                              height="25"
                                              fill={`rgba(239, 68, 68, ${intensity})`}
                                              stroke="#1e293b"
                                              strokeWidth="0.5"
                                            />
                                          ))
                                        );
                                      })()}
                                      
                                      {/* Strike zone outline */}
                                      <rect x="50" y="75" width="100" height="100" 
                                            fill="none" stroke="#38bdf8" strokeWidth="2"/>
                                      
                                      <text x="100" y="20" textAnchor="middle" fill="#e2e8f0" fontSize="10">Pitch Density Heat Map</text>
                                    </svg>
                                  </div>
                                </div>
                                
                                {/* Heat Map Legend */}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                  <span style={{ fontSize: '9px', color: '#64748b' }}>Low</span>
                                  <div style={{ display: 'flex', gap: '2px' }}>
                                    {[0, 0.25, 0.5, 0.75, 1].map(intensity => (
                                      <div key={intensity} style={{ 
                                        width: '20px', 
                                        height: '12px', 
                                        background: `rgba(239, 68, 68, ${intensity})`,
                                        border: '1px solid #1e293b'
                                      }} />
                                    ))}
                                  </div>
                                  <span style={{ fontSize: '9px', color: '#64748b' }}>High</span>
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    )}

                    {/* ── GAME RECAP GENERATOR ── */}
                    {showRecapGenerator && (
                      <div style={{ background: '#0a0f1f', border: '1px solid #1e293b', borderRadius: '12px', padding: '12px', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                          <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: '800', textTransform: 'uppercase' }}>📄 Game Recap</span>
                          <button onClick={() => setShowRecapGenerator(false)} style={{ background: 'transparent', border: 'none', color: '#475569', cursor: 'pointer', fontSize: '14px' }}>✕</button>
                        </div>
                        
                        {/* Recap Controls */}
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            {['summary', 'detailed', 'highlights'].map(format => (
                              <button
                                key={format}
                                onClick={() => setRecapFormat(format)}
                                style={{ 
                                  background: recapFormat === format ? '#38bdf8' : '#0f172a', 
                                  color: recapFormat === format ? '#020617' : '#64748b', 
                                  border: '1px solid #334155', 
                                  borderRadius: '6px', 
                                  padding: '4px 8px', 
                                  fontSize: '9px', 
                                  fontWeight: '600', 
                                  cursor: 'pointer',
                                  textTransform: 'capitalize'
                                }}
                              >
                                {format}
                              </button>
                            ))}
                          </div>
                          
                          <button
                            onClick={generateGameRecap}
                            disabled={recapLoading}
                            style={{ 
                              background: recapLoading ? '#334155' : '#22c55e', 
                              color: '#fff', 
                              border: '1px solid #334155', 
                              borderRadius: '6px', 
                              padding: '4px 12px', 
                              fontSize: '9px', 
                              fontWeight: '600', 
                              cursor: recapLoading ? 'not-allowed' : 'pointer'
                            }}
                          >
                            {recapLoading ? 'Generating...' : 'Generate Recap'}
                          </button>
                        </div>
                        
                        {/* Generated Recap Display */}
                        {generatedRecap && (
                          <div>
                            <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', padding: '12px', marginBottom: '8px' }}>
                              <pre style={{ 
                                color: '#e2e8f0', 
                                fontSize: '10px', 
                                lineHeight: '1.4', 
                                margin: 0, 
                                whiteSpace: 'pre-wrap', 
                                fontFamily: 'monospace' 
                              }}>
                                {generatedRecap}
                              </pre>
                            </div>
                            
                            {/* Action Buttons */}
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                              <button
                                onClick={copyRecapToClipboard}
                                style={{ 
                                  background: recapCopied ? '#22c55e' : '#38bdf8', 
                                  color: '#020617', 
                                  border: '1px solid #334155', 
                                  borderRadius: '6px', 
                                  padding: '6px 12px', 
                                  fontSize: '9px', 
                                  fontWeight: '600', 
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}
                              >
                                {recapCopied ? '✓ Copied!' : '📋 Copy to Clipboard'}
                              </button>
                              
                              <button
                                onClick={() => {
                                  const blob = new Blob([generatedRecap], { type: 'text/plain' });
                                  const url = URL.createObjectURL(blob);
                                  const a = document.createElement('a');
                                  a.href = url;
                                  a.download = `game-recap-${game.gameDate || new Date().toISOString().split('T')[0]}.txt`;
                                  a.click();
                                  URL.revokeObjectURL(url);
                                }}
                                style={{ 
                                  background: '#f59e0b', 
                                  color: '#020617', 
                                  border: '1px solid #334155', 
                                  borderRadius: '6px', 
                                  padding: '6px 12px', 
                                  fontSize: '9px', 
                                  fontWeight: '600', 
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}
                              >
                                💾 Download
                              </button>
                            </div>
                          </div>
                        )}
                        
                        {/* Format Info */}
                        {!generatedRecap && (
                          <div style={{ textAlign: 'center', color: '#64748b', fontSize: '10px', padding: '20px' }}>
                            <div style={{ marginBottom: '8px' }}>📝 Generate a game recap in your preferred format</div>
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                              <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '12px', marginBottom: '2px' }}>📊 Summary</div>
                                <div style={{ fontSize: '8px', color: '#475569' }}>Quick overview</div>
                              </div>
                              <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '12px', marginBottom: '2px' }}>📋 Detailed</div>
                                <div style={{ fontSize: '8px', color: '#475569' }}>Full statistics</div>
                              </div>
                              <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '12px', marginBottom: '2px' }}>⭐ Highlights</div>
                                <div style={{ fontSize: '8px', color: '#475569' }}>Top performers</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* ── TEAM COMMUNICATION CHAT ── */}
                    {showTeamChat && (
                      <div style={{ background: '#0a0f1f', border: '1px solid #1e293b', borderRadius: '12px', padding: '12px', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                          <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: '800', textTransform: 'uppercase' }}>💬 Team Chat</span>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            {unreadCount > 0 && (
                              <span style={{ 
                                background: '#ef4444', 
                                color: '#fff', 
                                borderRadius: '10px', 
                                padding: '2px 6px', 
                                fontSize: '9px', 
                                fontWeight: 'bold' 
                              }}>
                                {unreadCount} new
                              </span>
                            )}
                            <button 
                              onClick={() => {
                                markMessagesAsRead();
                                setShowTeamChat(false);
                              }} 
                              style={{ background: 'transparent', border: 'none', color: '#475569', cursor: 'pointer', fontSize: '14px' }}
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                        
                        {/* Message Input Area */}
                        <div style={{ marginBottom: '12px' }}>
                          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                            <select
                              value={messageType}
                              onChange={e => setMessageType(e.target.value)}
                              style={{ 
                                background: '#0f172a', 
                                border: '1px solid #334155', 
                                borderRadius: '6px', 
                                color: '#fff', 
                                padding: '4px 8px', 
                                fontSize: '10px' 
                              }}
                            >
                              <option value="general">💬 General</option>
                              <option value="announcement">📢 Announcement</option>
                              <option value="coach">👨‍🏫 Coach Note</option>
                            </select>
                            
                            <select
                              value={selectedRecipient}
                              onChange={e => setSelectedRecipient(e.target.value)}
                              style={{ 
                                background: '#0f172a', 
                                border: '1px solid #334155', 
                                borderRadius: '6px', 
                                color: '#fff', 
                                padding: '4px 8px', 
                                fontSize: '10px' 
                              }}
                            >
                              <option value="all">👥 All Team</option>
                              {processedRoster.map(player => (
                                <option key={player.id} value={`${player.firstName} ${player.lastName}`}>
                                  {player.firstName} {player.lastName}
                                </option>
                              ))}
                            </select>
                          </div>
                          
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <input
                              type="text"
                              value={newMessage}
                              onChange={e => setNewMessage(e.target.value)}
                              onKeyPress={e => e.key === 'Enter' && sendMessage()}
                              placeholder="Type your message..."
                              style={{ 
                                flex: 1, 
                                background: '#0f172a', 
                                border: '1px solid #334155', 
                                borderRadius: '6px', 
                                color: '#fff', 
                                padding: '6px 10px', 
                                fontSize: '10px' 
                              }}
                            />
                            <button
                              onClick={sendMessage}
                              disabled={!newMessage.trim() || messageLoading}
                              style={{ 
                                background: messageLoading ? '#334155' : '#38bdf8', 
                                color: '#020617', 
                                border: '1px solid #334155', 
                                borderRadius: '6px', 
                                padding: '6px 12px', 
                                fontSize: '9px', 
                                fontWeight: '600', 
                                cursor: messageLoading || !newMessage.trim() ? 'not-allowed' : 'pointer'
                              }}
                            >
                              {messageLoading ? 'Sending...' : 'Send'}
                            </button>
                          </div>
                        </div>
                        
                        {/* Quick Messages */}
                        <div style={{ marginBottom: '12px' }}>
                          <div style={{ fontSize: '9px', color: '#64748b', marginBottom: '4px' }}>Quick Messages:</div>
                          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                            {getQuickMessages().map((quickMsg, index) => (
                              <button
                                key={index}
                                onClick={() => sendQuickMessage(quickMsg)}
                                style={{ 
                                  background: '#1e293b', 
                                  color: '#94a3b8', 
                                  border: '1px solid #334155', 
                                  borderRadius: '4px', 
                                  padding: '2px 6px', 
                                  fontSize: '8px', 
                                  cursor: 'pointer' 
                                }}
                              >
                                {quickMsg.text}
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        {/* Messages Display */}
                        <div style={{ 
                          background: '#0f172a', 
                          border: '1px solid #1e293b', 
                          borderRadius: '8px', 
                          padding: '8px', 
                          maxHeight: '200px', 
                          overflowY: 'auto' 
                        }}>
                          {teamMessages.length === 0 ? (
                            <div style={{ textAlign: 'center', color: '#64748b', fontSize: '10px', padding: '20px' }}>
                              No messages yet. Start the conversation!
                            </div>
                          ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              {teamMessages.map(message => (
                                <div 
                                  key={message.id} 
                                  style={{ 
                                    background: message.read ? '#1e293b' : '#2563eb20', 
                                    border: `1px solid ${message.read ? '#334155' : '#38bdf8'}`, 
                                    borderRadius: '6px', 
                                    padding: '6px 8px',
                                    borderLeft: `3px solid ${
                                      message.type === 'announcement' ? '#f59e0b' :
                                      message.type === 'coach' ? '#22c55e' : '#38bdf8'
                                    }`
                                  }}
                                >
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                      <span style={{ 
                                        fontSize: '9px', 
                                        fontWeight: 'bold', 
                                        color: '#e2e8f0' 
                                      }}>
                                        {message.sender}
                                      </span>
                                      <span style={{ 
                                        fontSize: '7px', 
                                        color: '#64748b',
                                        background: '#1e293b',
                                        padding: '1px 4px',
                                        borderRadius: '3px'
                                      }}>
                                        {message.type === 'announcement' ? '📢' :
                                         message.type === 'coach' ? '👨‍🏫' : '💬'}
                                      </span>
                                      {message.recipient !== 'all' && (
                                        <span style={{ 
                                          fontSize: '7px', 
                                          color: '#f59e0b',
                                          background: '#f59e0b20',
                                          padding: '1px 4px',
                                          borderRadius: '3px'
                                        }}>
                                          To: {message.recipient}
                                        </span>
                                      )}
                                    </div>
                                    <span style={{ fontSize: '7px', color: '#64748b' }}>
                                      {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                  </div>
                                  <div style={{ fontSize: '9px', color: '#e2e8f0', lineHeight: '1.3' }}>
                                    {message.text}
                                  </div>
                                  {message.gameContext && (
                                    <div style={{ 
                                      fontSize: '7px', 
                                      color: '#64748b', 
                                      marginTop: '4px',
                                      fontStyle: 'italic'
                                    }}>
                                      🏟️ Inning {message.gameContext.inning} • Score: {message.gameContext.score.our}-{message.gameContext.score.their}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        {/* Chat Status */}
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center', 
                          marginTop: '8px',
                          fontSize: '8px', 
                          color: '#64748b' 
                        }}>
                          <span>📱 Team Chat Active</span>
                          <span>{teamMessages.length} messages</span>
                        </div>
                      </div>
                    )}

                    {/* ── VIDEO RECORDING PANEL ── */}
                    {showVideoPanel && (
                      <div style={{ background: '#0a0f1f', border: '1px solid #1e293b', borderRadius: '12px', padding: '12px', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                          <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: '800', textTransform: 'uppercase' }}>🎥 Video Recording</span>
                          <button onClick={() => setShowVideoPanel(false)} style={{ background: 'transparent', border: 'none', color: '#475569', cursor: 'pointer', fontSize: '14px' }}>✕</button>
                        </div>
                        
                        {/* Recording Controls */}
                        <div style={{ marginBottom: '12px' }}>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                            {!isRecording ? (
                              <button
                                onClick={startRecording}
                                style={{ 
                                  background: '#ef4444', 
                                  color: '#fff', 
                                  border: '1px solid #334155', 
                                  borderRadius: '6px', 
                                  padding: '6px 12px', 
                                  fontSize: '9px', 
                                  fontWeight: '600', 
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}
                              >
                                🔴 Start Recording
                              </button>
                            ) : (
                              <button
                                onClick={stopRecording}
                                style={{ 
                                  background: '#334155', 
                                  color: '#fff', 
                                  border: '1px solid #334155', 
                                  borderRadius: '6px', 
                                  padding: '6px 12px', 
                                  fontSize: '9px', 
                                  fontWeight: '600', 
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}
                              >
                                ⏹️ Stop Recording
                              </button>
                            )}
                            
                            {isRecording && (
                              <span style={{ 
                                color: '#ef4444', 
                                fontSize: '9px', 
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}>
                                <span style={{ 
                                  width: '8px', 
                                  height: '8px', 
                                  background: '#ef4444', 
                                  borderRadius: '50%',
                                  animation: 'pulse 1.5s infinite'
                                }} />
                                {Math.floor(recordingDuration / 60)}:{(recordingDuration % 60).toString().padStart(2, '0')}
                              </span>
                            )}
                          </div>
                          
                          {/* Recording Status */}
                          <div style={{ fontSize: '8px', color: '#64748b' }}>
                            {isRecording ? '🔴 Recording in progress...' : '📹 Ready to record'}
                            {recordedClips.length > 0 && ` • ${recordedClips.length} clips recorded`}
                          </div>
                        </div>
                        
                        {/* Video Preview (Mock) */}
                        {isRecording && (
                          <div style={{ 
                            background: '#000', 
                            border: '2px solid #ef4444', 
                            borderRadius: '8px', 
                            height: '120px', 
                            marginBottom: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative'
                          }}>
                            <div style={{ color: '#ef4444', fontSize: '12px', fontWeight: 'bold' }}>
                              🔴 LIVE
                            </div>
                            <div style={{ 
                              position: 'absolute', 
                              top: '4px', 
                              right: '4px', 
                              background: '#ef4444', 
                              color: '#fff', 
                              borderRadius: '4px', 
                              padding: '2px 6px', 
                              fontSize: '8px',
                              fontWeight: 'bold'
                            }}>
                              REC
                            </div>
                          </div>
                        )}
                        
                        {/* Recorded Clips */}
                        {recordedClips.length > 0 && (
                          <div style={{ marginBottom: '12px' }}>
                            <div style={{ fontSize: '10px', color: '#e2e8f0', fontWeight: '600', marginBottom: '6px' }}>📼 Recorded Clips</div>
                            <div style={{ 
                              background: '#0f172a', 
                              border: '1px solid #1e293b', 
                              borderRadius: '8px', 
                              padding: '8px', 
                              maxHeight: '200px', 
                              overflowY: 'auto' 
                            }}>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {recordedClips.map(clip => (
                                  <div 
                                    key={clip.id}
                                    onClick={() => setSelectedClip(clip)}
                                    style={{ 
                                      background: selectedClip?.id === clip.id ? '#2563eb20' : '#1e293b', 
                                      border: `1px solid ${selectedClip?.id === clip.id ? '#38bdf8' : '#334155'}`, 
                                      borderRadius: '6px', 
                                      padding: '6px 8px',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                      <span style={{ fontSize: '9px', fontWeight: 'bold', color: '#e2e8f0' }}>
                                        {clip.title}
                                      </span>
                                      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                                        <span style={{ fontSize: '7px', color: '#64748b' }}>
                                          {Math.floor(clip.duration / 60)}:{(clip.duration % 60).toString().padStart(2, '0')}
                                        </span>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            deleteClip(clip.id);
                                          }}
                                          style={{ 
                                            background: 'transparent', 
                                            border: 'none', 
                                            color: '#ef4444', 
                                            cursor: 'pointer', 
                                            fontSize: '10px' 
                                          }}
                                        >
                                          🗑️
                                        </button>
                                      </div>
                                    </div>
                                    
                                    {/* Clip Tags */}
                                    <div style={{ display: 'flex', gap: '2px', flexWrap: 'wrap', marginBottom: '4px' }}>
                                      {clip.tags.map(tag => (
                                        <span 
                                          key={tag}
                                          style={{ 
                                            background: '#334155', 
                                            color: '#94a3b8', 
                                            borderRadius: '3px', 
                                            padding: '1px 4px', 
                                            fontSize: '7px' 
                                          }}
                                        >
                                          {tag}
                                        </span>
                                      ))}
                                    </div>
                                    
                                    {/* Game Context */}
                                    <div style={{ fontSize: '7px', color: '#64748b' }}>
                                      🏟️ Inning {clip.gameContext.inning} • Score: {clip.gameContext.score.our}-{clip.gameContext.score.their}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* Clip Details and Analysis */}
                        {selectedClip && (
                          <div style={{ marginBottom: '12px' }}>
                            <div style={{ fontSize: '10px', color: '#e2e8f0', fontWeight: '600', marginBottom: '6px' }}>
                              📊 {selectedClip.title} - Analysis
                            </div>
                            <div style={{ 
                              background: '#0f172a', 
                              border: '1px solid #1e293b', 
                              borderRadius: '8px', 
                              padding: '8px' 
                            }}>
                              {/* Tag Management */}
                              <div style={{ marginBottom: '8px' }}>
                                <div style={{ fontSize: '8px', color: '#64748b', marginBottom: '4px' }}>Tags:</div>
                                <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                                  <input
                                    type="text"
                                    value={newTag}
                                    onChange={e => setNewTag(e.target.value)}
                                    onKeyPress={e => e.key === 'Enter' && addTagToClip(selectedClip.id, newTag)}
                                    placeholder="Add tag..."
                                    style={{ 
                                      flex: 1, 
                                      background: '#1e293b', 
                                      border: '1px solid #334155', 
                                      borderRadius: '4px', 
                                      color: '#fff', 
                                      padding: '2px 6px', 
                                      fontSize: '8px' 
                                    }}
                                  />
                                  <button
                                    onClick={() => addTagToClip(selectedClip.id, newTag)}
                                    style={{ 
                                      background: '#38bdf8', 
                                      color: '#020617', 
                                      border: '1px solid #334155', 
                                      borderRadius: '4px', 
                                      padding: '2px 8px', 
                                      fontSize: '8px', 
                                      cursor: 'pointer' 
                                    }}
                                  >
                                    Add
                                  </button>
                                </div>
                                <div style={{ display: 'flex', gap: '2px', flexWrap: 'wrap' }}>
                                  {selectedClip.tags.map(tag => (
                                    <span 
                                      key={tag}
                                      style={{ 
                                        background: '#334155', 
                                        color: '#94a3b8', 
                                        borderRadius: '3px', 
                                        padding: '1px 4px', 
                                        fontSize: '7px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '2px'
                                      }}
                                    >
                                      {tag}
                                      <button
                                        onClick={() => removeTagFromClip(selectedClip.id, tag)}
                                        style={{ 
                                          background: 'transparent', 
                                          border: 'none', 
                                          color: '#ef4444', 
                                          cursor: 'pointer', 
                                          fontSize: '6px',
                                          padding: '0'
                                        }}
                                      >
                                        ×
                                      </button>
                                    </span>
                                  ))}
                                </div>
                              </div>
                              
                              {/* Analysis Results */}
                              {videoAnalysis[selectedClip.id] ? (
                                <div style={{ fontSize: '8px', color: '#e2e8f0' }}>
                                  <div style={{ marginBottom: '4px' }}>
                                    <strong>Analysis Results:</strong>
                                  </div>
                                  <div style={{ marginLeft: '8px' }}>
                                    <div>• Pitches: {videoAnalysis[selectedClip.id].pitchCount}</div>
                                    <div>• Swings: {videoAnalysis[selectedClip.id].swingCount}</div>
                                    <div>• Hit Quality: {videoAnalysis[selectedClip.id].hitQuality}</div>
                                    <div>• Mechanics: {videoAnalysis[selectedClip.id].mechanics}</div>
                                    {videoAnalysis[selectedClip.id].recommendations.length > 0 && (
                                      <div style={{ marginTop: '4px' }}>
                                        <strong>Recommendations:</strong>
                                        {videoAnalysis[selectedClip.id].recommendations.map(rec => (
                                          <div key={rec} style={{ marginLeft: '8px' }}>• {rec}</div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <button
                                  onClick={() => analyzeClip(selectedClip)}
                                  style={{ 
                                    background: '#22c55e', 
                                    color: '#fff', 
                                    border: '1px solid #334155', 
                                    borderRadius: '4px', 
                                    padding: '4px 8px', 
                                    fontSize: '8px', 
                                    cursor: 'pointer' 
                                  }}
                                >
                                  📊 Analyze Clip
                                </button>
                              )}
                              
                              {/* Export Options */}
                              <div style={{ marginTop: '8px', display: 'flex', gap: '4px' }}>
                                <button
                                  onClick={() => exportClip(selectedClip)}
                                  style={{ 
                                    background: '#f59e0b', 
                                    color: '#020617', 
                                    border: '1px solid #334155', 
                                    borderRadius: '4px', 
                                    padding: '4px 8px', 
                                    fontSize: '8px', 
                                    cursor: 'pointer' 
                                  }}
                                >
                                  💾 Export
                                </button>
                                <button
                                  onClick={() => alert('Share functionality coming soon!')}
                                  style={{ 
                                    background: '#38bdf8', 
                                    color: '#020617', 
                                    border: '1px solid #334155', 
                                    borderRadius: '4px', 
                                    padding: '4px 8px', 
                                    fontSize: '8px', 
                                    cursor: 'pointer' 
                                  }}
                                >
                                  🔗 Share
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* Popular Tags */}
                        {recordedClips.length > 0 && (
                          <div style={{ fontSize: '8px', color: '#64748b' }}>
                            Popular tags: {getPopularTags().slice(0, 5).join(', ')}
                          </div>
                        )}
                      </div>
                    )}

                    {/* ── SYNCHRONIZATION PANEL ── */}
                    {(syncStatus !== 'connected' || pendingSync.length > 0 || syncConflicts.length > 0) && (
                      <div style={{ background: '#0a0f1f', border: '1px solid #1e293b', borderRadius: '12px', padding: '12px', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                          <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: '800', textTransform: 'uppercase' }}>🔄 Synchronization</span>
                          <button onClick={forceSync} style={{ background: '#38bdf8', color: '#020617', border: '1px solid #334155', borderRadius: '6px', padding: '4px 8px', fontSize: '8px', cursor: 'pointer' }}>
                            Force Sync
                          </button>
                        </div>
                        
                        {/* Sync Status */}
                        <div style={{ marginBottom: '12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                            <div style={{ 
                              width: '8px', 
                              height: '8px', 
                              borderRadius: '50%',
                              background: syncStatus === 'connected' ? '#22c55e' : 
                                         syncStatus === 'syncing' ? '#f59e0b' : 
                                         syncStatus === 'offline' ? '#ef4444' : '#64748b',
                              animation: syncStatus === 'syncing' ? 'pulse 1.5s infinite' : 'none'
                            }} />
                            <span style={{ fontSize: '9px', color: '#e2e8f0' }}>
                              Status: {syncStatus === 'connected' ? 'Connected' : 
                                       syncStatus === 'syncing' ? 'Synchronizing' : 
                                       syncStatus === 'offline' ? 'Offline' : 'Error'}
                            </span>
                          </div>
                          
                          <div style={{ fontSize: '8px', color: '#64748b' }}>
                            Last sync: {lastSyncTime.toLocaleTimeString()}
                            {connectedDevices.length > 0 && ` • ${connectedDevices.length} devices connected`}
                          </div>
                        </div>
                        
                        {/* Sync Progress */}
                        {syncStatus === 'syncing' && (
                          <div style={{ marginBottom: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                              <span style={{ fontSize: '8px', color: '#e2e8f0' }}>Sync Progress</span>
                              <span style={{ fontSize: '8px', color: '#94a3b8' }}>{Math.round(syncProgress)}%</span>
                            </div>
                            <div style={{ 
                              background: '#1e293b', 
                              borderRadius: '4px', 
                              height: '6px', 
                              overflow: 'hidden' 
                            }}>
                              <div style={{ 
                                background: '#38bdf8', 
                                height: '100%', 
                                borderRadius: '4px',
                                width: `${syncProgress}%`,
                                transition: 'width 0.3s ease'
                              }} />
                            </div>
                          </div>
                        )}
                        
                        {/* Pending Sync Items */}
                        {pendingSync.length > 0 && (
                          <div style={{ marginBottom: '12px' }}>
                            <div style={{ fontSize: '9px', color: '#f59e0b', fontWeight: '600', marginBottom: '4px' }}>
                              ⏳ Pending Sync ({pendingSync.length} items)
                            </div>
                            <div style={{ 
                              background: '#0f172a', 
                              border: '1px solid #1e293b', 
                              borderRadius: '6px', 
                              padding: '6px',
                              maxHeight: '80px',
                              overflowY: 'auto'
                            }}>
                              {pendingSync.slice(0, 3).map((item, index) => (
                                <div key={index} style={{ fontSize: '7px', color: '#94a3b8', marginBottom: '2px' }}>
                                  • {item.type} - {new Date(item.timestamp).toLocaleTimeString()}
                                </div>
                              ))}
                              {pendingSync.length > 3 && (
                                <div style={{ fontSize: '7px', color: '#64748b', fontStyle: 'italic' }}>
                                  ... and {pendingSync.length - 3} more
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {/* Connected Devices */}
                        {connectedDevices.length > 0 && (
                          <div style={{ marginBottom: '12px' }}>
                            <div style={{ fontSize: '9px', color: '#22c55e', fontWeight: '600', marginBottom: '4px' }}>
                              📱 Connected Devices
                            </div>
                            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                              {connectedDevices.map(device => (
                                <div 
                                  key={device.id}
                                  style={{ 
                                    background: '#1e293b', 
                                    border: '1px solid #334155', 
                                    borderRadius: '4px', 
                                    padding: '2px 6px',
                                    fontSize: '7px',
                                    color: '#94a3b8',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '2px'
                                  }}
                                >
                                  {device.type === 'tablet' ? '📱' : '📱'}
                                  {device.name}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Sync Conflicts */}
                        {syncConflicts.length > 0 && (
                          <div style={{ marginBottom: '12px' }}>
                            <div style={{ fontSize: '9px', color: '#ef4444', fontWeight: '600', marginBottom: '4px' }}>
                              ⚠️ Sync Conflicts ({syncConflicts.filter(c => !c.resolved).length})
                            </div>
                            <div style={{ 
                              background: '#0f172a', 
                              border: '1px solid #1e293b', 
                              borderRadius: '6px', 
                              padding: '6px',
                              maxHeight: '100px',
                              overflowY: 'auto'
                            }}>
                              {syncConflicts.filter(c => !c.resolved).map(conflict => (
                                <div key={conflict.id} style={{ marginBottom: '4px' }}>
                                  <div style={{ fontSize: '7px', color: '#e2e8f0', marginBottom: '2px' }}>
                                    {conflict.type} at {conflict.timestamp.toLocaleTimeString()}
                                  </div>
                                  <div style={{ display: 'flex', gap: '4px' }}>
                                    <button
                                      onClick={() => resolveConflict(conflict.id, 'accept_remote')}
                                      style={{ 
                                        background: '#22c55e', 
                                        color: '#fff', 
                                        border: '1px solid #334155', 
                                        borderRadius: '3px', 
                                        padding: '1px 4px', 
                                        fontSize: '6px', 
                                        cursor: 'pointer' 
                                      }}
                                    >
                                      Accept
                                    </button>
                                    <button
                                      onClick={() => resolveConflict(conflict.id, 'reject_remote')}
                                      style={{ 
                                        background: '#ef4444', 
                                        color: '#fff', 
                                        border: '1px solid #334155', 
                                        borderRadius: '3px', 
                                        padding: '1px 4px', 
                                        fontSize: '6px', 
                                        cursor: 'pointer' 
                                      }}
                                    >
                                      Reject
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Offline Mode Notice */}
                        {!isOnline && (
                          <div style={{ 
                            background: '#ef444420', 
                            border: '1px solid #ef4444', 
                            borderRadius: '6px', 
                            padding: '6px',
                            textAlign: 'center'
                          }}>
                            <div style={{ fontSize: '8px', color: '#ef4444', fontWeight: '600' }}>
                              📵 Offline Mode
                            </div>
                            <div style={{ fontSize: '7px', color: '#f87171' }}>
                              Changes will sync when connection is restored
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* ── ADVANCED METRICS PANEL ── */}
                    {showAdvancedMetrics && (
                      <div style={{ background: '#0a0f1f', border: '1px solid #1e293b', borderRadius: '12px', padding: '12px', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                          <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: '800', textTransform: 'uppercase' }}>📈 Advanced Analytics</span>
                          <button onClick={() => setShowAdvancedMetrics(false)} style={{ background: 'transparent', border: 'none', color: '#475569', cursor: 'pointer', fontSize: '14px' }}>✕</button>
                        </div>
                        
                        {/* Time Range Selector */}
                        <div style={{ marginBottom: '12px' }}>
                          <div style={{ fontSize: '9px', color: '#e2e8f0', fontWeight: '600', marginBottom: '4px' }}>Time Range</div>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            {['game', 'week', 'month', 'season'].map(range => (
                              <button
                                key={range}
                                onClick={() => setSelectedTimeRange(range)}
                                style={{ 
                                  background: selectedTimeRange === range ? '#38bdf8' : '#1e293b', 
                                  color: selectedTimeRange === range ? '#020617' : '#94a3b8', 
                                  border: '1px solid #334155', 
                                  borderRadius: '4px', 
                                  padding: '2px 6px', 
                                  fontSize: '7px', 
                                  cursor: 'pointer',
                                  textTransform: 'capitalize'
                                }}
                              >
                                {range}
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        {/* Loading State */}
                        {metricsLoading && (
                          <div style={{ 
                            textAlign: 'center', 
                            padding: '20px', 
                            color: '#64748b',
                            fontSize: '9px'
                          }}>
                            <div style={{ marginBottom: '8px' }}>📊 Loading advanced metrics...</div>
                            <div style={{ 
                              background: '#1e293b', 
                              borderRadius: '4px', 
                              height: '4px', 
                              overflow: 'hidden',
                              margin: '0 auto',
                              width: '100px'
                            }}>
                              <div style={{ 
                                background: '#38bdf8', 
                                height: '100%', 
                                borderRadius: '4px',
                                width: '60%',
                                animation: 'pulse 1.5s infinite'
                              }} />
                            </div>
                          </div>
                        )}
                        
                        {/* Team Performance Overview */}
                        {!metricsLoading && teamMetrics.offensive && (
                          <div style={{ marginBottom: '12px' }}>
                            <div style={{ fontSize: '10px', color: '#e2e8f0', fontWeight: '600', marginBottom: '6px' }}>🏆 Team Performance</div>
                            <div style={{ 
                              background: '#0f172a', 
                              border: '1px solid #1e293b', 
                              borderRadius: '8px', 
                              padding: '8px' 
                            }}>
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px', marginBottom: '8px' }}>
                                <div>
                                  <div style={{ fontSize: '7px', color: '#64748b' }}>Batting Average</div>
                                  <div style={{ fontSize: '10px', color: '#22c55e', fontWeight: 'bold' }}>
                                    {(teamMetrics.offensive.battingAverage || 0).toFixed(3)}
                                  </div>
                                </div>
                                <div>
                                  <div style={{ fontSize: '7px', color: '#64748b' }}>On-Base %</div>
                                  <div style={{ fontSize: '10px', color: '#38bdf8', fontWeight: 'bold' }}>
                                    {(teamMetrics.offensive.onBasePercentage || 0).toFixed(3)}
                                  </div>
                                </div>
                                <div>
                                  <div style={{ fontSize: '7px', color: '#64748b' }}>Slugging %</div>
                                  <div style={{ fontSize: '10px', color: '#f59e0b', fontWeight: 'bold' }}>
                                    {(teamMetrics.offensive.sluggingPercentage || 0).toFixed(3)}
                                  </div>
                                </div>
                                <div>
                                  <div style={{ fontSize: '7px', color: '#64748b' }}>OPS</div>
                                  <div style={{ fontSize: '10px', color: '#a855f7', fontWeight: 'bold' }}>
                                    {(teamMetrics.offensive.ops || 0).toFixed(3)
                                    }</div>
                                </div>
                              </div>
                              
                              {/* Discipline Metrics */}
                              <div style={{ fontSize: '8px', color: '#94a3b8', marginBottom: '4px' }}>Discipline</div>
                              <div style={{ display: 'flex', gap: '8px', fontSize: '7px', color: '#64748b' }}>
                                <span>BB/K: {(teamMetrics.discipline.bbKRatio || 0).toFixed(2)}</span>
                                <span>Walk Rate: {((teamMetrics.discipline.walkRate || 0) * 100).toFixed(1)}%</span>
                                <span>K Rate: {((teamMetrics.discipline.strikeoutRate || 0) * 100).toFixed(1)}%</span>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* Predictive Analytics */}
                        {!metricsLoading && predictiveAnalytics.teamProjection && (
                          <div style={{ marginBottom: '12px' }}>
                            <div style={{ fontSize: '10px', color: '#e2e8f0', fontWeight: '600', marginBottom: '6px' }}>🔮 Predictive Analytics</div>
                            <div style={{ 
                              background: '#0f172a', 
                              border: '1px solid #1e293b', 
                              borderRadius: '8px', 
                              padding: '8px' 
                            }}>
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px', marginBottom: '8px' }}>
                                <div>
                                  <div style={{ fontSize: '7px', color: '#64748b' }}>Projected BA</div>
                                  <div style={{ fontSize: '9px', color: '#94a3b8' }}>
                                    {(predictiveAnalytics.teamProjection.projected.battingAverage || 0).toFixed(3)}
                                  </div>
                                </div>
                                <div>
                                  <div style={{ fontSize: '7px', color: '#64748b' }}>Projected OPS</div>
                                  <div style={{ fontSize: '9px', color: '#94a3b8' }}>
                                    {(predictiveAnalytics.teamProjection.projected.ops || 0).toFixed(3)
                                    }</div>
                                </div>
                                <div>
                                  <div style={{ fontSize: '7px', color: '#64748b' }}>Win Probability</div>
                                  <div style={{ fontSize: '9px', color: '#22c55e' }}>
                                    {((predictiveAnalytics.teamProjection.winProbability || 0) * 100).toFixed(1)}%
                                  </div>
                                </div>
                                <div>
                                  <div style={{ fontSize: '7px', color: '#64748b' }}>Playoff Odds</div>
                                  <div style={{ fontSize: '9px', color: '#f59e0b' }}>
                                    {((predictiveAnalytics.teamProjection.playoffProbability || 0) * 100).toFixed(1)}%
                                  </div>
                                </div>
                              </div>
                              
                              {/* Confidence Indicator */}
                              <div style={{ fontSize: '7px', color: '#64748b', fontStyle: 'italic' }}>
                                Based on current performance trends
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* Player Performance Leaders */}
                        {!metricsLoading && comparisonData.playerRankings && comparisonData.playerRankings.length > 0 && (
                          <div style={{ marginBottom: '12px' }}>
                            <div style={{ fontSize: '10px', color: '#e2e8f0', fontWeight: '600', marginBottom: '6px' }}>👥 Performance Leaders</div>
                            <div style={{ 
                              background: '#0f172a', 
                              border: '1px solid #1e293b', 
                              borderRadius: '8px', 
                              padding: '8px',
                              maxHeight: '150px',
                              overflowY: 'auto'
                            }}>
                              {comparisonData.playerRankings.slice(0, 5).map((player, index) => (
                                <div key={player.id} style={{ 
                                  display: 'flex', 
                                  justifyContent: 'space-between', 
                                  alignItems: 'center',
                                  padding: '3px 0',
                                  borderBottom: index < 4 ? '1px solid #1e293b' : 'none'
                                }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span style={{ 
                                      fontSize: '7px', 
                                      color: '#64748b', 
                                      fontWeight: 'bold',
                                      width: '12px'
                                    }}>
                                      #{index + 1}
                                    </span>
                                    <span style={{ fontSize: '8px', color: '#e2e8f0' }}>
                                      {player.name}
                                    </span>
                                  </div>
                                  <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '8px', color: '#38bdf8', fontWeight: 'bold' }}>
                                      {(player.metrics.basic.ops || 0).toFixed(3)}
                                    </div>
                                    <div style={{ fontSize: '6px', color: '#64748b' }}>
                                      OPS
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* League Comparison */}
                        {!metricsLoading && comparisonData.teamVsLeague && (
                          <div style={{ marginBottom: '12px' }}>
                            <div style={{ fontSize: '10px', color: '#e2e8f0', fontWeight: '600', marginBottom: '6px' }}>📊 League Comparison</div>
                            <div style={{ 
                              background: '#0f172a', 
                              border: '1px solid #1e293b', 
                              borderRadius: '8px', 
                              padding: '8px' 
                            }}>
                              {Object.entries(comparisonData.teamVsLeague).map(([metric, data]) => (
                                <div key={metric} style={{ marginBottom: '6px' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                                    <span style={{ fontSize: '7px', color: '#64748b', textTransform: 'capitalize' }}>
                                      {metric.replace(/([A-Z])/g, ' $1').trim()}
                                    </span>
                                    <span style={{ fontSize: '7px', color: '#94a3b8' }}>
                                      {data.percentile}th percentile
                                    </span>
                                  </div>
                                  <div style={{ 
                                    background: '#1e293b', 
                                    borderRadius: '2px', 
                                    height: '4px', 
                                    overflow: 'hidden',
                                    position: 'relative'
                                  }}>
                                    <div style={{ 
                                      position: 'absolute',
                                      left: '0',
                                      top: '0',
                                      width: '2px',
                                      height: '100%',
                                      background: '#64748b'
                                    }} />
                                    <div style={{ 
                                      background: data.percentile >= 75 ? '#22c55e' : 
                                                 data.percentile >= 50 ? '#f59e0b' : '#ef4444', 
                                      height: '100%', 
                                      borderRadius: '2px',
                                      width: `${Math.min(100, data.percentile)}%`,
                                      marginLeft: '0'
                                    }} />
                                  </div>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '6px', color: '#64748b', marginTop: '1px' }}>
                                    <span>Team: {(data.team || 0).toFixed(3)}</span>
                                    <span>League: {(data.league || 0).toFixed(3)}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Performance Trends */}
                        {!metricsLoading && performanceTrends.length > 0 && (
                          <div style={{ marginBottom: '12px' }}>
                            <div style={{ fontSize: '10px', color: '#e2e8f0', fontWeight: '600', marginBottom: '6px' }}>📈 Performance Trends</div>
                            <div style={{ 
                              background: '#0f172a', 
                              border: '1px solid #1e293b', 
                              borderRadius: '8px', 
                              padding: '8px' 
                            }}>
                              <div style={{ fontSize: '7px', color: '#64748b', marginBottom: '4px' }}>
                                Last 30 days performance
                              </div>
                              {/* Simple trend visualization */}
                              <div style={{ display: 'flex', alignItems: 'end', gap: '2px', height: '40px' }}>
                                {performanceTrends.slice(-10).map((trend, index) => (
                                  <div
                                    key={index}
                                    style={{
                                      flex: 1,
                                      background: trend.teamMetrics.ops > 0.75 ? '#22c55e' : 
                                                 trend.teamMetrics.ops > 0.70 ? '#f59e0b' : '#ef4444',
                                      height: `${(trend.teamMetrics.ops - 0.6) * 200}%`,
                                      borderRadius: '2px 2px 0 0',
                                      minHeight: '4px'
                                    }}
                                    title={`${trend.date}: OPS ${(trend.teamMetrics.ops || 0).toFixed(3)}`}
                                  />
                                ))}
                              </div>
                              <div style={{ fontSize: '6px', color: '#64748b', marginTop: '4px', textAlign: 'center' }}>
                                Daily OPS trend
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* Export Options */}
                        {!metricsLoading && (
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <button
                              onClick={() => {
                                const exportData = {
                                  teamMetrics,
                                  playerMetrics,
                                  predictiveAnalytics,
                                  performanceTrends,
                                  comparisonData,
                                  exportedAt: new Date().toISOString(),
                                  timeRange: selectedTimeRange
                                };
                                const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = `advanced-metrics-${new Date().toISOString().split('T')[0]}.json`;
                                a.click();
                                URL.revokeObjectURL(url);
                              }}
                              style={{ 
                                background: '#f59e0b', 
                                color: '#020617', 
                                border: '1px solid #334155', 
                                borderRadius: '4px', 
                                padding: '4px 8px', 
                                fontSize: '8px', 
                                cursor: 'pointer' 
                              }}
                            >
                              💾 Export Data
                            </button>
                            <button
                              onClick={loadAdvancedMetrics}
                              style={{ 
                                background: '#38bdf8', 
                                color: '#020617', 
                                border: '1px solid #334155', 
                                borderRadius: '4px', 
                                padding: '4px 8px', 
                                fontSize: '8px', 
                                cursor: 'pointer' 
                              }}
                            >
                              🔄 Refresh
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* ── PLAYER DEVELOPMENT PANEL ── */}
                    {showPlayerDevelopment && (
                      <div style={{ background: '#0a0f1f', border: '1px solid #1e293b', borderRadius: '12px', padding: '12px', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                          <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: '800', textTransform: 'uppercase' }}>🎯 Player Development</span>
                          <button onClick={() => setShowPlayerDevelopment(false)} style={{ background: 'transparent', border: 'none', color: '#475569', cursor: 'pointer', fontSize: '14px' }}>✕</button>
                        </div>
                        
                        {/* Loading State */}
                        {developmentLoading && (
                          <div style={{ 
                            textAlign: 'center', 
                            padding: '20px', 
                            color: '#64748b',
                            fontSize: '9px'
                          }}>
                            <div style={{ marginBottom: '8px' }}>🎯 Loading development data...</div>
                            <div style={{ 
                              background: '#1e293b', 
                              borderRadius: '4px', 
                              height: '4px', 
                              overflow: 'hidden',
                              margin: '0 auto',
                              width: '100px'
                            }}>
                              <div style={{ 
                                background: '#38bdf8', 
                                height: '100%', 
                                borderRadius: '4px',
                                width: '60%',
                                animation: 'pulse 1.5s infinite'
                              }} />
                            </div>
                          </div>
                        )}
                        
                        {/* Player Selection */}
                        {!developmentLoading && (
                          <div style={{ marginBottom: '12px' }}>
                            <div style={{ fontSize: '9px', color: '#e2e8f0', fontWeight: '600', marginBottom: '4px' }}>Select Player</div>
                            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                              {processedRoster.map(player => (
                                <button
                                  key={player.id}
                                  onClick={() => setSelectedPlayerForDevelopment(player.id)}
                                  style={{ 
                                    background: selectedPlayerForDevelopment === player.id ? '#38bdf8' : '#1e293b', 
                                    color: selectedPlayerForDevelopment === player.id ? '#020617' : '#94a3b8', 
                                    border: '1px solid #334155', 
                                    borderRadius: '4px', 
                                    padding: '2px 6px', 
                                    fontSize: '7px', 
                                    cursor: 'pointer'
                                  }}
                                >
                                  {player.firstName} {player.lastName}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Player Development Details */}
                        {!developmentLoading && selectedPlayerForDevelopment && playerDevelopmentData[selectedPlayerForDevelopment] && (
                          <div style={{ marginBottom: '12px' }}>
                            {(() => {
                              const playerData = playerDevelopmentData[selectedPlayerForDevelopment];
                              return (
                                <>
                                  {/* Overall Progress */}
                                  <div style={{ marginBottom: '12px' }}>
                                    <div style={{ fontSize: '10px', color: '#e2e8f0', fontWeight: '600', marginBottom: '6px' }}>
                                      📊 {playerData.playerName} - Overall Progress
                                    </div>
                                    <div style={{ 
                                      background: '#0f172a', 
                                      border: '1px solid #1e293b', 
                                      borderRadius: '8px', 
                                      padding: '8px' 
                                    }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                                        <div style={{ 
                                          width: '40px', 
                                          height: '40px', 
                                          borderRadius: '50%',
                                          background: playerData.overallProgress.level === 'excellent' ? '#22c55e' :
                                                     playerData.overallProgress.level === 'good' ? '#38bdf8' :
                                                     playerData.overallProgress.level === 'fair' ? '#f59e0b' : '#ef4444',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          fontSize: '12px',
                                          fontWeight: 'bold',
                                          color: '#fff'
                                        }}>
                                          {Math.round(playerData.overallProgress.score * 100)}%
                                        </div>
                                        <div>
                                          <div style={{ fontSize: '9px', color: '#e2e8f0', fontWeight: '600' }}>
                                            {playerData.overallProgress.level.replace('_', ' ').toUpperCase()}
                                          </div>
                                          <div style={{ fontSize: '7px', color: '#64748b' }}>
                                            {playerData.overallProgress.trend === 'positive' ? '📈 Positive trajectory' : '⚠️ Needs attention'}
                                          </div>
                                        </div>
                                      </div>
                                      
                                      {/* Skill Progress Bars */}
                                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                                        <div>
                                          <div style={{ fontSize: '6px', color: '#64748b', marginBottom: '2px' }}>Hitting</div>
                                          <div style={{ 
                                            background: '#1e293b', 
                                            borderRadius: '2px', 
                                            height: '4px', 
                                            overflow: 'hidden' 
                                          }}>
                                            <div style={{ 
                                              background: playerData.skillProgress.hitting.trend === 'improving' ? '#22c55e' : 
                                                         playerData.skillProgress.hitting.trend === 'stable' ? '#f59e0b' : '#ef4444', 
                                              height: '100%', 
                                              borderRadius: '2px',
                                              width: playerData.skillProgress.hitting.trend === 'improving' ? '80%' : 
                                                     playerData.skillProgress.hitting.trend === 'stable' ? '50%' : '20%'
                                            }} />
                                          </div>
                                        </div>
                                        <div>
                                          <div style={{ fontSize: '6px', color: '#64748b', marginBottom: '2px' }}>Fielding</div>
                                          <div style={{ 
                                            background: '#1e293b', 
                                            borderRadius: '2px', 
                                            height: '4px', 
                                            overflow: 'hidden' 
                                          }}>
                                            <div style={{ 
                                              background: playerData.skillProgress.fielding.trend === 'improving' ? '#22c55e' : 
                                                         playerData.skillProgress.fielding.trend === 'stable' ? '#f59e0b' : '#ef4444', 
                                              height: '100%', 
                                              borderRadius: '2px',
                                              width: playerData.skillProgress.fielding.trend === 'improving' ? '80%' : 
                                                     playerData.skillProgress.fielding.trend === 'stable' ? '50%' : '20%'
                                            }} />
                                          </div>
                                        </div>
                                        <div>
                                          <div style={{ fontSize: '6px', color: '#64748b', marginBottom: '2px' }}>Base Running</div>
                                          <div style={{ 
                                            background: '#1e293b', 
                                            borderRadius: '2px', 
                                            height: '4px', 
                                            overflow: 'hidden' 
                                          }}>
                                            <div style={{ 
                                              background: playerData.skillProgress.baseRunning.trend === 'improving' ? '#22c55e' : 
                                                         playerData.skillProgress.baseRunning.trend === 'stable' ? '#f59e0b' : '#ef4444', 
                                              height: '100%', 
                                              borderRadius: '2px',
                                              width: playerData.skillProgress.baseRunning.trend === 'improving' ? '80%' : 
                                                     playerData.skillProgress.baseRunning.trend === 'stable' ? '50%' : '20%'
                                            }} />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {/* Strengths & Weaknesses */}
                                  <div style={{ marginBottom: '12px' }}>
                                    <div style={{ fontSize: '10px', color: '#e2e8f0', fontWeight: '600', marginBottom: '6px' }}>💪 Strengths & Weaknesses</div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                      {/* Strengths */}
                                      <div>
                                        <div style={{ fontSize: '8px', color: '#22c55e', fontWeight: '600', marginBottom: '4px' }}>Strengths</div>
                                        <div style={{ 
                                          background: '#0f172a', 
                                          border: '1px solid #1e293b', 
                                          borderRadius: '6px', 
                                          padding: '6px',
                                          minHeight: '60px'
                                        }}>
                                          {playerData.strengths.length > 0 ? (
                                            playerData.strengths.map((strength, index) => (
                                              <div key={index} style={{ fontSize: '7px', color: '#94a3b8', marginBottom: '2px' }}>
                                                ✅ {strength.metric}: {(strength.value || 0).toFixed(3)}
                                              </div>
                                            ))
                                          ) : (
                                            <div style={{ fontSize: '7px', color: '#64748b', fontStyle: 'italic' }}>
                                              No significant strengths identified
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                      
                                      {/* Weaknesses */}
                                      <div>
                                        <div style={{ fontSize: '8px', color: '#ef4444', fontWeight: '600', marginBottom: '4px' }}>Areas for Improvement</div>
                                        <div style={{ 
                                          background: '#0f172a', 
                                          border: '1px solid #1e293b', 
                                          borderRadius: '6px', 
                                          padding: '6px',
                                          minHeight: '60px'
                                        }}>
                                          {playerData.weaknesses.length > 0 ? (
                                            playerData.weaknesses.map((weakness, index) => (
                                              <div key={index} style={{ fontSize: '7px', color: '#94a3b8', marginBottom: '2px' }}>
                                                ⚠️ {weakness.metric}: {(weakness.value || 0).toFixed(3)}
                                              </div>
                                            ))
                                          ) : (
                                            <div style={{ fontSize: '7px', color: '#64748b', fontStyle: 'italic' }}>
                                              No major weaknesses identified
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {/* Development Goals */}
                                  <div style={{ marginBottom: '12px' }}>
                                    <div style={{ fontSize: '10px', color: '#e2e8f0', fontWeight: '600', marginBottom: '6px' }}>🎯 Development Goals</div>
                                    <div style={{ 
                                      background: '#0f172a', 
                                      border: '1px solid #1e293b', 
                                      borderRadius: '8px', 
                                      padding: '8px' 
                                    }}>
                                      {/* Existing Goals */}
                                      {developmentGoals[selectedPlayerForDevelopment] && developmentGoals[selectedPlayerForDevelopment].length > 0 && (
                                        <div style={{ marginBottom: '8px' }}>
                                          {developmentGoals[selectedPlayerForDevelopment].map(goal => (
                                            <div key={goal.id} style={{ 
                                              background: '#1e293b', 
                                              borderRadius: '4px', 
                                              padding: '6px', 
                                              marginBottom: '4px' 
                                            }}>
                                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                                <span style={{ fontSize: '8px', color: '#e2e8f0', fontWeight: '600' }}>
                                                  {goal.title}
                                                </span>
                                                <span style={{ fontSize: '6px', color: '#64748b' }}>
                                                  {goal.progress}%
                                                </span>
                                              </div>
                                              <div style={{ 
                                                background: '#0f172a', 
                                                borderRadius: '2px', 
                                                height: '3px', 
                                                overflow: 'hidden',
                                                marginBottom: '4px'
                                              }}>
                                                <div style={{ 
                                                  background: '#38bdf8', 
                                                  height: '100%', 
                                                  borderRadius: '2px',
                                                  width: `${goal.progress}%`
                                                }} />
                                              </div>
                                              <div style={{ fontSize: '6px', color: '#64748b' }}>
                                                Target: {goal.target} • Deadline: {goal.deadline}
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                      
                                      {/* Add New Goal */}
                                      <div>
                                        <div style={{ fontSize: '8px', color: '#94a3b8', fontWeight: '600', marginBottom: '4px' }}>Add New Goal</div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '4px', marginBottom: '4px' }}>
                                          <input
                                            type="text"
                                            placeholder="Goal description"
                                            value={newGoal}
                                            onChange={(e) => setNewGoal(e.target.value)}
                                            style={{ 
                                              background: '#0f172a', 
                                              border: '1px solid #334155', 
                                              borderRadius: '3px', 
                                              padding: '3px', 
                                              fontSize: '6px', 
                                              color: '#e2e8f0' 
                                            }}
                                          />
                                          <input
                                            type="text"
                                            placeholder="Target"
                                            value={goalTarget}
                                            onChange={(e) => setGoalTarget(e.target.value)}
                                            style={{ 
                                              background: '#0f172a', 
                                              border: '1px solid #334155', 
                                              borderRadius: '3px', 
                                              padding: '3px', 
                                              fontSize: '6px', 
                                              color: '#e2e8f0' 
                                            }}
                                          />
                                          <input
                                            type="date"
                                            value={goalDeadline}
                                            onChange={(e) => setGoalDeadline(e.target.value)}
                                            style={{ 
                                              background: '#0f172a', 
                                              border: '1px solid #334155', 
                                              borderRadius: '3px', 
                                              padding: '3px', 
                                              fontSize: '6px', 
                                              color: '#e2e8f0' 
                                            }}
                                          />
                                        </div>
                                        <button
                                          onClick={() => {
                                            if (newGoal && goalTarget && goalDeadline) {
                                              addDevelopmentGoal(selectedPlayerForDevelopment, {
                                                title: newGoal,
                                                category: goalCategory,
                                                target: goalTarget,
                                                deadline: goalDeadline
                                              });
                                              setNewGoal('');
                                              setGoalTarget('');
                                              setGoalDeadline('');
                                            }
                                          }}
                                          style={{ 
                                            background: '#22c55e', 
                                            color: '#fff', 
                                            border: '1px solid #334155', 
                                            borderRadius: '3px', 
                                            padding: '3px 6px', 
                                            fontSize: '6px', 
                                            cursor: 'pointer' 
                                          }}
                                        >
                                          Add Goal
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {/* Development Recommendations */}
                                  <div style={{ marginBottom: '12px' }}>
                                    <div style={{ fontSize: '10px', color: '#e2e8f0', fontWeight: '600', marginBottom: '6px' }}>📋 Development Plan</div>
                                    <div style={{ 
                                      background: '#0f172a', 
                                      border: '1px solid #1e293b', 
                                      borderRadius: '8px', 
                                      padding: '8px',
                                      maxHeight: '120px',
                                      overflowY: 'auto'
                                    }}>
                                      {playerData.recommendations.length > 0 ? (
                                        playerData.recommendations.map((rec, index) => (
                                          <div key={index} style={{ 
                                            background: '#1e293b', 
                                            borderRadius: '4px', 
                                            padding: '6px', 
                                            marginBottom: '4px' 
                                          }}>
                                            <div style={{ fontSize: '8px', color: '#e2e8f0', fontWeight: '600', marginBottom: '2px' }}>
                                              {rec.title}
                                            </div>
                                            <div style={{ fontSize: '6px', color: '#94a3b8', marginBottom: '3px' }}>
                                              {rec.description}
                                            </div>
                                            <div style={{ fontSize: '6px', color: '#64748b', marginBottom: '2px' }}>
                                              <strong>Exercises:</strong> {rec.exercises.join(', ')}
                                            </div>
                                            <div style={{ fontSize: '6px', color: '#64748b' }}>
                                              <strong>Timeframe:</strong> {rec.timeframe} • <strong>Priority:</strong> {rec.priority}
                                            </div>
                                          </div>
                                        ))
                                      ) : (
                                        <div style={{ fontSize: '7px', color: '#64748b', fontStyle: 'italic' }}>
                                          No specific recommendations at this time
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  
                                  {/* Achievements */}
                                  <div style={{ marginBottom: '12px' }}>
                                    <div style={{ fontSize: '10px', color: '#e2e8f0', fontWeight: '600', marginBottom: '6px' }}>🏆 Achievements</div>
                                    <div style={{ 
                                      background: '#0f172a', 
                                      border: '1px solid #1e293b', 
                                      borderRadius: '8px', 
                                      padding: '8px' 
                                    }}>
                                      {achievementSystem[selectedPlayerForDevelopment] && achievementSystem[selectedPlayerForDevelopment].length > 0 ? (
                                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                          {achievementSystem[selectedPlayerForDevelopment].map(achievement => (
                                            <div 
                                              key={achievement.id}
                                              style={{ 
                                                background: '#1e293b', 
                                                borderRadius: '6px', 
                                                padding: '4px 6px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px'
                                              }}
                                              title={achievement.description}
                                            >
                                              <span style={{ fontSize: '10px' }}>{achievement.icon}</span>
                                              <span style={{ fontSize: '6px', color: '#94a3b8' }}>
                                                {achievement.description}
                                              </span>
                                            </div>
                                          ))}
                                        </div>
                                      ) : (
                                        <div style={{ fontSize: '7px', color: '#64748b', fontStyle: 'italic' }}>
                                          No achievements yet. Keep working on your goals!
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </>
                              );
                            })()}
                          </div>
                        )}
                        
                        {/* Action Buttons */}
                        {!developmentLoading && (
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <button
                              onClick={loadPlayerDevelopmentData}
                              style={{ 
                                background: '#38bdf8', 
                                color: '#020617', 
                                border: '1px solid #334155', 
                                borderRadius: '4px', 
                                padding: '4px 8px', 
                                fontSize: '8px', 
                                cursor: 'pointer' 
                              }}
                            >
                              🔄 Refresh Data
                            </button>
                            <button
                              onClick={() => {
                                const exportData = {
                                  playerDevelopmentData,
                                  developmentGoals,
                                  achievementSystem,
                                  exportedAt: new Date().toISOString()
                                };
                                const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = `player-development-${new Date().toISOString().split('T')[0]}.json`;
                                a.click();
                                URL.revokeObjectURL(url);
                              }}
                              style={{ 
                                background: '#f59e0b', 
                                color: '#020617', 
                                border: '1px solid #334155', 
                                borderRadius: '4px', 
                                padding: '4px 8px', 
                                fontSize: '8px', 
                                cursor: 'pointer' 
                              }}
                            >
                              💾 Export Report
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* ── EVENT EDIT MODAL ── */}
                    {editingEvent && (
                      <div style={{ 
                        position: 'fixed', 
                        top: 0, 
                        left: 0, 
                        right: 0, 
                        bottom: 0, 
                        background: 'rgba(0,0,0,0.8)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        zIndex: 1000 
                      }}>
                        <div style={{ 
                          background: '#0f172a', 
                          border: '1px solid #334155', 
                          borderRadius: '12px', 
                          padding: '20px', 
                          maxWidth: '500px', 
                          width: '90%' 
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h3 style={{ color: '#fff', margin: 0, fontSize: '16px' }}>Edit Event</h3>
                            <button 
                              onClick={() => setEditingEvent(null)}
                              style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '18px' }}
                            >
                              ✕
                            </button>
                          </div>
                          
                          <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', color: '#94a3b8', fontSize: '12px', marginBottom: '4px' }}>Event Type</label>
                            <select 
                              value={editingEvent.type}
                              onChange={(e) => setEditingEvent(prev => ({ ...prev, type: e.target.value }))}
                              style={{ 
                                background: '#020617', 
                                border: '1px solid #334155', 
                                borderRadius: '6px', 
                                color: '#fff', 
                                padding: '8px', 
                                fontSize: '14px', 
                                width: '100%' 
                              }}
                            >
                              <option value="plate_appearance">Plate Appearance</option>
                              <option value="defensive_play">Defensive Play</option>
                              <option value="manual_run">Manual Run</option>
                            </select>
                          </div>
                          
                          <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', color: '#94a3b8', fontSize: '12px', marginBottom: '4px' }}>Description</label>
                            <input 
                              type="text"
                              value={editingEvent.data.label || ''}
                              onChange={(e) => setEditingEvent(prev => ({ 
                                ...prev, 
                                data: { ...prev.data, label: e.target.value } 
                              }))}
                              style={{ 
                                background: '#020617', 
                                border: '1px solid #334155', 
                                borderRadius: '6px', 
                                color: '#fff', 
                                padding: '8px', 
                                fontSize: '14px', 
                                width: '100%' 
                              }}
                            />
                          </div>
                          
                          <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', color: '#94a3b8', fontSize: '12px', marginBottom: '4px' }}>Notes</label>
                            <textarea 
                              value={editingEvent.data.note || ''}
                              onChange={(e) => setEditingEvent(prev => ({ 
                                ...prev, 
                                data: { ...prev.data, note: e.target.value } 
                              }))}
                              style={{ 
                                background: '#020617', 
                                border: '1px solid #334155', 
                                borderRadius: '6px', 
                                color: '#fff', 
                                padding: '8px', 
                                fontSize: '14px', 
                                width: '100%', 
                                minHeight: '60px',
                                resize: 'vertical'
                              }}
                            />
                          </div>
                          
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                            <button 
                              onClick={() => setEditingEvent(null)}
                              style={{ 
                                background: '#0f172a', 
                                color: '#64748b', 
                                border: '1px solid #334155', 
                                borderRadius: '6px', 
                                padding: '8px 16px', 
                                cursor: 'pointer' 
                              }}
                            >
                              Cancel
                            </button>
                            <button 
                              onClick={() => editEvent(editingEvent.id, editingEvent.data)}
                              style={{ 
                                background: '#38bdf8', 
                                color: '#020617', 
                                border: 'none', 
                                borderRadius: '6px', 
                                padding: '8px 16px', 
                                cursor: 'pointer',
                                fontWeight: '600'
                              }}
                            >
                              Save Changes
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* ── RUNNERS & DEFENSE (always visible below pitch/outcome) ── */}
                    <div style={{ borderTop: '1px solid #1e293b', paddingTop: '10px', display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                      <span style={{ fontSize: '10px', color: '#334155', fontWeight: '800', textTransform: 'uppercase' }}>Runners:</span>
                      {[
                        { label: '1B', state: runnerOnFirst, set: setRunnerOnFirst },
                        { label: '2B', state: runnerOnSecond, set: setRunnerOnSecond },
                        { label: '3B', state: runnerOnThird, set: setRunnerOnThird },
                      ].map(({ label, state, set }) => (
                        <button key={label} disabled={!user} onClick={() => set(v => !v)}
                          style={{ background: state ? 'rgba(245,158,11,0.22)' : '#0f172a', border: `1.5px solid ${state ? '#f59e0b' : '#1e293b'}`, borderRadius: '8px', color: state ? '#f59e0b' : '#475569', cursor: 'pointer', fontWeight: '900', fontSize: '13px', padding: '7px 14px' }}>
                          {label}
                        </button>
                      ))}
                      <div style={{ width: '1px', height: '22px', background: '#1e293b' }} />
                      {/* SB / WP / PB — one-tap lead-runner advance */}
                      {['SB','WP','PB'].map(type => (
                        <button key={type} disabled={!user} onClick={() => recordRunnerAdvance(type)}
                          style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#64748b', cursor: 'pointer', fontSize: '11px', fontWeight: '800', padding: '6px 10px' }}>
                          {type}
                        </button>
                      ))}
                      <div style={{ width: '1px', height: '22px', background: '#1e293b' }} />
                      {defensivePlayPresets.map((play) => {
                        const needsRouting = play.result.startsWith('double_play') || play.result === 'fielder_choice';
                        return (
                          <button key={play.result} disabled={!user}
                            onClick={() => needsRouting ? setFcDpModal({ play }) : recordDefensivePlay(play)}
                            style={{ background: fcDpModal?.play?.result === play.result ? 'rgba(56,189,248,0.12)' : '#0f172a', border: `1px solid ${fcDpModal?.play?.result === play.result ? '#38bdf8' : '#1e293b'}`, borderRadius: '8px', color: fcDpModal?.play?.result === play.result ? '#38bdf8' : '#475569', cursor: 'pointer', fontSize: '11px', fontWeight: '700', padding: '6px 10px', whiteSpace: 'nowrap' }}>
                            {play.notation}
                          </button>
                        );
                      })}
                      <button disabled={!user} onClick={() => setErrorModal(v => !v)}
                        style={{ background: errorModal ? 'rgba(239,68,68,0.15)' : '#0f172a', border: `1px solid ${errorModal ? '#ef4444' : '#334155'}`, borderRadius: '8px', color: errorModal ? '#ef4444' : '#64748b', cursor: 'pointer', fontSize: '11px', fontWeight: '900', padding: '6px 10px' }}>
                        Error
                      </button>
                      <button disabled={!user} onClick={recordManualRun}
                        style={{ background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.3)', borderRadius: '8px', color: '#38bdf8', cursor: 'pointer', fontSize: '11px', fontWeight: '900', padding: '6px 12px' }}>
                        +Run
                      </button>
                    </div>

                    {/* ── FC / DP ROUTING PICKER ── */}
                    {fcDpModal && (
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', padding: '8px 12px', background: 'rgba(56,189,248,0.06)', borderTop: '1px solid #38bdf822' }}>
                        <span style={{ fontSize: '10px', color: '#38bdf8', fontWeight: '800', alignSelf: 'center', whiteSpace: 'nowrap' }}>RUNNER OUT:</span>
                        {[
                          { label: 'Runner on 1st', key: '1B', clear: () => { setRunnerOnFirst(false); } },
                          { label: 'Runner on 2nd', key: '2B', clear: () => { setRunnerOnSecond(false); } },
                          { label: 'Runner on 3rd', key: '3B', clear: () => { setRunnerOnThird(false); } },
                          { label: 'Batter (out at 1st)', key: 'Batter', clear: () => {} },
                        ].filter(r => r.key === 'Batter' || (r.key === '1B' && runnerOnFirst) || (r.key === '2B' && runnerOnSecond) || (r.key === '3B' && runnerOnThird))
                          .map(runner => (
                          <button key={runner.key} disabled={!user} onClick={async () => {
                            runner.clear();
                            const nextOuts = Math.min(3, outs + (fcDpModal.play.outs || 1));
                            setOuts(nextOuts);
                            setBalls(0); setStrikes(0);
                            const label = `${fcDpModal.play.label} — ${runner.label}`;
                            setLastPlaySummary(label);
                            setFcDpModal(null);
                            advanceHalfInningIfNeeded(nextOuts);
                            await logScoringEvent('defensive_play', { result: fcDpModal.play.result, label, notation: fcDpModal.play.notation, runnerOut: runner.key, outsAfter: nextOuts });
                          }}
                            style={{ background: '#0f172a', border: '1px solid #38bdf844', borderRadius: '6px', color: '#38bdf8', cursor: 'pointer', fontSize: '11px', fontWeight: '800', padding: '5px 10px' }}>
                            {runner.key}
                          </button>
                        ))}
                        <button onClick={() => setFcDpModal(null)} style={{ background: 'transparent', border: 'none', color: '#334155', cursor: 'pointer', fontSize: '13px', padding: '4px 6px' }}>✕</button>
                      </div>
                    )}

                    {/* ── ERROR POSITION PICKER ── */}
                    {errorModal && (
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', padding: '8px 12px', background: 'rgba(239,68,68,0.06)', borderTop: '1px solid #ef444422' }}>
                        <span style={{ fontSize: '10px', color: '#ef4444', fontWeight: '800', alignSelf: 'center', whiteSpace: 'nowrap' }}>FIELDER:</span>
                        {[{n:1,p:'P'},{n:2,p:'C'},{n:3,p:'1B'},{n:4,p:'2B'},{n:5,p:'3B'},{n:6,p:'SS'},{n:7,p:'LF'},{n:8,p:'CF'},{n:9,p:'RF'}].map(({n,p}) => (
                          <button key={n} disabled={!user} onClick={() => recordError(n)}
                            style={{ background: '#0f172a', border: '1px solid #ef444444', borderRadius: '6px', color: '#ef4444', cursor: 'pointer', fontSize: '11px', fontWeight: '900', padding: '5px 9px' }}>
                            E{n} <span style={{ fontSize: '9px', color: '#475569' }}>{p}</span>
                          </button>
                        ))}
                        <button onClick={() => setErrorModal(false)} style={{ background: 'transparent', border: 'none', color: '#334155', cursor: 'pointer', fontSize: '13px', padding: '4px 6px' }}>✕</button>
                      </div>
                    )}

                    {/* ── UTILITIES ── */}
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <input disabled={!user} value={playNote} onChange={e => setPlayNote(e.target.value)} placeholder="Play note..."
                        style={{ flex: 1, minWidth: '120px', background: '#020617', border: '1px solid #1e293b', color: '#94a3b8', borderRadius: '6px', padding: '6px 10px', fontSize: '12px' }} />
                      <button disabled={!user} onClick={() => { setBalls(0); setStrikes(0); setLastPlaySummary('Count cleared.'); }}
                        style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '6px', color: '#475569', cursor: 'pointer', fontSize: '11px', padding: '6px 10px', whiteSpace: 'nowrap' }}>
                        Clear Count
                      </button>
                      <button disabled={!user} onClick={() => { setOuts(Math.max(0, outs - 1)); setLastPlaySummary('One out removed.'); }}
                        style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '6px', color: '#475569', cursor: 'pointer', fontSize: '11px', padding: '6px 10px', whiteSpace: 'nowrap' }}>
                        Fix Out
                      </button>
                    </div>
                  </div>

                  {/* RUNNER CONFIRM STRIP — appears after hits, auto-dismisses in 4s */}
                  {runnerToast && (
                    <div style={{ position: 'sticky', bottom: 0, background: '#0f2b1a', border: '1px solid #22c55e', borderTop: '2px solid #22c55e', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', zIndex: 10, animation: 'fadeIn 0.15s ease' }}>
                      <div style={{ fontSize: '11px', color: '#22c55e', fontWeight: '800', flexShrink: 0 }}>
                        ✓ {runnerToast.label} — runners auto-advanced
                      </div>
                      <div style={{ fontSize: '10px', color: '#64748b', flexShrink: 0 }}>Tap to override:</div>
                      {[
                        { label: '3B', active: runnerToast.third, toggle: () => setRunnerToast(t => ({ ...t, third: !t.third, timer: (clearTimeout(t.timer), setTimeout(() => setRunnerToast(null), 4000)) })), setter: setRunnerOnThird },
                        { label: '2B', active: runnerToast.second, toggle: () => setRunnerToast(t => ({ ...t, second: !t.second, timer: (clearTimeout(t.timer), setTimeout(() => setRunnerToast(null), 4000)) })), setter: setRunnerOnSecond },
                        { label: '1B', active: runnerToast.first, toggle: () => setRunnerToast(t => ({ ...t, first: !t.first, timer: (clearTimeout(t.timer), setTimeout(() => setRunnerToast(null), 4000)) })), setter: setRunnerOnFirst },
                      ].map(({ label, active, toggle, setter }) => (
                        <button key={label} onClick={() => { toggle(); setter(v => !v); }}
                          style={{ background: active ? 'rgba(245,158,11,0.25)' : '#0f172a', border: `1.5px solid ${active ? '#f59e0b' : '#334155'}`, borderRadius: '8px', color: active ? '#f59e0b' : '#475569', cursor: 'pointer', fontWeight: '900', fontSize: '13px', padding: '6px 14px' }}>
                          {label}
                        </button>
                      ))}
                      <button onClick={() => { clearTimeout(runnerToast.timer); setRunnerToast(null); }}
                        style={{ marginLeft: 'auto', background: 'transparent', border: 'none', color: '#334155', cursor: 'pointer', fontSize: '16px', padding: '4px 8px' }}>
                        ✕
                      </button>
                    </div>
                  )}
                </div>
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
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button disabled={!user || playLogEvents.length === 0} onClick={undoLastPlay}>Undo Last Play</button>
                  <button disabled={!user || redoStack.length === 0} onClick={redoLastPlay}
                    style={{ background: redoStack.length > 0 ? 'rgba(56,189,248,0.1)' : undefined, border: redoStack.length > 0 ? '1px solid #38bdf8' : undefined, color: redoStack.length > 0 ? '#38bdf8' : undefined }}>
                    Redo {redoStack.length > 0 ? `(${redoStack.length})` : ''}
                  </button>
                </div>
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
                              {event.pitchSequence?.length > 0 && (
                                <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap', marginTop: '4px' }}>
                                  {event.pitchSequence.map((p, pi) => {
                                    const isStrike = ['called_strike','swinging_strike','foul','in_play'].includes(p.result);
                                    const isBall = p.result === 'ball';
                                    const col = isStrike ? '#ef4444' : isBall ? '#22c55e' : '#64748b';
                                    return (
                                      <span key={pi} style={{ fontSize: '9px', color: col, fontWeight: '800', background: `${col}15`, border: `1px solid ${col}44`, borderRadius: '4px', padding: '1px 5px', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
                                        {p.type} {p.balls}-{p.strikes}
                                      </span>
                                    );
                                  })}
                                </div>
                              )}
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
                            {game.status === 'Final'
                              ? <button disabled={!user} onClick={() => reopenFinalGame(game)} style={{ color: '#f59e0b', borderColor: '#f59e0b55' }}>↩ Re-open</button>
                              : (() => {
                                  const atLimit = userPlan === 'free' && userLimits.maxGames > 0 && gamesPlayed >= userLimits.maxGames;
                                  return (
                                    <button
                                      disabled={!user || atLimit}
                                      onClick={() => atLimit ? setActiveTab('upgrade') : loadScheduledGameForScoring(game)}
                                      title={atLimit ? `Free plan: ${userLimits.maxGames} games max. Upgrade to Pro for unlimited.` : ''}
                                      style={atLimit ? { color: '#f59e0b', borderColor: '#f59e0b55', cursor: 'pointer' } : {}}>
                                      {atLimit ? '⭐ Upgrade to Score' : 'Score Game'}
                                    </button>
                                  );
                                })()
                            }
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

      {/* LINEUP BUILDER TAB */}
      {activeTab === 'lineup' && (
        <div style={{ maxWidth: '1200px', margin: '30px auto', padding: '0 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{ color: '#fff', fontSize: '28px', margin: '0 0 8px' }}>📝 Lineup Builder</h2>
            <p style={{ color: '#94a3b8', margin: 0, fontSize: '14px' }}>Create batting orders and defensive positions</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
            {/* Batting Order */}
            <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '24px' }}>
              <h3 style={{ color: '#fff', margin: '0 0 16px', fontSize: '18px' }}>🏏 Batting Order</h3>
              
              <div style={{ marginBottom: '20px' }}>
                <button 
                  disabled={!user}
                  onClick={() => {
                    const availablePlayers = (currentSeasonData.roster || []).filter(p => 
                      !lineupEntries.some(entry => entry.id === p.id)
                    );
                    if (availablePlayers.length > 0) {
                      const newEntry = {
                        id: availablePlayers[0].id,
                        name: `${availablePlayers[0].firstName} ${availablePlayers[0].lastName}`,
                        jersey: availablePlayers[0].jersey || '',
                        position: availablePlayers[0].primaryPosition || 'P',
                        battingOrder: lineupEntries.length + 1
                      };
                      setLineupEntries([...lineupEntries, newEntry]);
                    }
                  }}
                  style={{ 
                    background: user ? '#3b82f6' : '#1e293b', 
                    color: user ? '#fff' : '#475569', 
                    border: 'none', 
                    borderRadius: '8px', 
                    padding: '10px 16px', 
                    fontSize: '13px', 
                    fontWeight: '600', 
                    cursor: user ? 'pointer' : 'not-allowed',
                    width: '100%'
                  }}
                >
                  + Add Player to Lineup
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {lineupEntries.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#64748b', padding: '20px' }}>
                    No players in lineup yet
                  </div>
                ) : (
                  lineupEntries.map((entry, index) => (
                    <div 
                      key={entry.id}
                      draggable
                      onDragStart={() => handleLineupDragStart(index)}
                      onDragOver={(e) => handleLineupDragOver(e, index)}
                      onDragEnd={handleLineupDragEnd}
                      style={{ 
                        background: '#1e293b', 
                        border: '1px solid #334155', 
                        borderRadius: '8px', 
                        padding: '12px', 
                        cursor: 'move',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                      }}
                    >
                      <div style={{ 
                        background: '#3b82f6', 
                        color: '#fff', 
                        borderRadius: '50%', 
                        width: '24px', 
                        height: '24px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        fontSize: '12px', 
                        fontWeight: 'bold' 
                      }}>
                        {index + 1}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ color: '#fff', fontWeight: '600' }}>
                          {entry.name}
                        </div>
                        <div style={{ color: '#64748b', fontSize: '12px' }}>
                          #{entry.jersey} • {entry.position}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          disabled={!user}
                          onClick={() => setSubModal({ idx: index, name: entry.name })}
                          style={{ 
                            background: '#f59e0b', 
                            color: '#fff', 
                            border: 'none', 
                            borderRadius: '6px', 
                            padding: '4px 8px', 
                            fontSize: '11px', 
                            cursor: 'pointer' 
                          }}
                        >
                          Sub
                        </button>
                        <button
                          disabled={!user}
                          onClick={() => {
                            setLineupEntries(lineupEntries.filter((_, i) => i !== index));
                            if (lineupBatterIndex >= index) setLineupBatterIndex(Math.max(0, lineupBatterIndex - 1));
                          }}
                          style={{ 
                            background: '#ef4444', 
                            color: '#fff', 
                            border: 'none', 
                            borderRadius: '6px', 
                            padding: '4px 8px', 
                            fontSize: '11px', 
                            cursor: 'pointer' 
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {subModal && (
                <div style={{ marginTop: '16px' }}>
                  <SubstitutionModal 
                    subModal={subModal}
                    onConfirm={substitutePlayer}
                    onCancel={() => setSubModal(null)}
                  />
                </div>
              )}
            </div>

            {/* Defensive Positions */}
            <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '24px' }}>
              <h3 style={{ color: '#fff', margin: '0 0 16px', fontSize: '18px' }}>🧢 Defensive Positions</h3>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(3, 1fr)', 
                gap: '8px', 
                marginBottom: '20px' 
              }}>
                {[
                  { pos: 'P', label: 'Pitcher' },
                  { pos: 'C', label: 'Catcher' },
                  { pos: '1B', label: '1st Base' },
                  { pos: '2B', label: '2nd Base' },
                  { pos: '3B', label: '3rd Base' },
                  { pos: 'SS', label: 'Shortstop' },
                  { pos: 'LF', label: 'Left Field' },
                  { pos: 'CF', label: 'Center Field' },
                  { pos: 'RF', label: 'Right Field' }
                ].map(({ pos, label }) => {
                  const player = lineupEntries.find(entry => entry.position === pos);
                  return (
                    <div 
                      key={pos}
                      style={{ 
                        background: player ? '#1e293b' : '#0f172a', 
                        border: `1px solid ${player ? '#3b82f6' : '#334155'}`, 
                        borderRadius: '8px', 
                        padding: '12px', 
                        textAlign: 'center' 
                      }}
                    >
                      <div style={{ color: '#64748b', fontSize: '10px', marginBottom: '4px' }}>
                        {pos}
                      </div>
                      <div style={{ color: '#fff', fontSize: '12px', fontWeight: '600' }}>
                        {player ? player.name.split(' ').pop() : label}
                      </div>
                      {player && (
                        <div style={{ color: '#64748b', fontSize: '10px' }}>
                          #{player.jersey}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div style={{ background: '#1e293b', borderRadius: '8px', padding: '16px' }}>
                <h4 style={{ color: '#fff', margin: '0 0 12px', fontSize: '14px' }}>Field View</h4>
                <div style={{ 
                  background: '#0f172a', 
                  border: '1px solid #334155', 
                  borderRadius: '8px', 
                  height: '200px', 
                  position: 'relative', 
                  overflow: 'hidden' 
                }}>
                  {/* Simple field diagram */}
                  <div style={{ 
                    position: 'absolute', 
                    top: '50%', 
                    left: '50%', 
                    transform: 'translate(-50%, -50%)', 
                    width: '60px', 
                    height: '60px', 
                    background: '#1e293b', 
                    border: '2px solid #334155', 
                    borderRadius: '50%' 
                  }} />
                  {lineupEntries.map((entry, index) => {
                    const positions = {
                      'P': { x: 50, y: 50 },
                      'C': { x: 50, y: 85 },
                      '1B': { x: 85, y: 50 },
                      '2B': { x: 65, y: 35 },
                      '3B': { x: 15, y: 50 },
                      'SS': { x: 35, y: 35 },
                      'LF': { x: 15, y: 15 },
                      'CF': { x: 50, y: 15 },
                      'RF': { x: 85, y: 15 }
                    };
                    const pos = positions[entry.position];
                    if (!pos) return null;
                    
                    return (
                      <div
                        key={entry.id}
                        style={{
                          position: 'absolute',
                          left: `${pos.x}%`,
                          top: `${pos.y}%`,
                          transform: 'translate(-50%, -50%)',
                          background: '#3b82f6',
                          color: '#fff',
                          borderRadius: '50%',
                          width: '20px',
                          height: '20px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '10px',
                          fontWeight: 'bold'
                        }}
                        title={entry.name}
                      >
                        {entry.jersey || '?'}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Lineup Actions */}
          <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '24px' }}>
            <h3 style={{ color: '#fff', margin: '0 0 16px', fontSize: '18px' }}>⚙️ Lineup Management</h3>
            
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                disabled={!user || lineupEntries.length === 0}
                onClick={async () => {
                  setLineupStatus('Saving...');
                  try {
                    await setDoc(doc(db, 'games', liveGameId), { 
                      lineupEntries,
                      lineupBatterIndex,
                      updatedAt: new Date().toISOString()
                    }, { merge: true });
                    setLineupStatus('Saved!');
                    setTimeout(() => setLineupStatus('Ready'), 2000);
                  } catch (error) {
                    setLineupStatus('Error saving');
                    console.error(error);
                  }
                }}
                style={{ 
                  background: user && lineupEntries.length > 0 ? '#22c55e' : '#1e293b', 
                  color: user && lineupEntries.length > 0 ? '#fff' : '#475569', 
                  border: 'none', 
                  borderRadius: '8px', 
                  padding: '10px 20px', 
                  fontSize: '13px', 
                  fontWeight: '600', 
                  cursor: user && lineupEntries.length > 0 ? 'pointer' : 'not-allowed' 
                }}
              >
                💾 Save Lineup
              </button>
              
              <button
                disabled={!user}
                onClick={() => {
                  setLineupEntries([]);
                  setLineupBatterIndex(0);
                  setLineupStatus('Cleared');
                  setTimeout(() => setLineupStatus('Ready'), 2000);
                }}
                style={{ 
                  background: user ? '#ef4444' : '#1e293b', 
                  color: user ? '#fff' : '#475569', 
                  border: 'none', 
                  borderRadius: '8px', 
                  padding: '10px 20px', 
                  fontSize: '13px', 
                  fontWeight: '600', 
                  cursor: user ? 'pointer' : 'not-allowed' 
                }}
              >
                🗑️ Clear Lineup
              </button>
              
              <button
                disabled={!user}
                onClick={() => {
                  // Auto-fill lineup from roster
                  const roster = currentSeasonData.roster || [];
                  const autoLineup = roster.slice(0, 9).map((player, index) => ({
                    id: player.id,
                    name: `${player.firstName} ${player.lastName}`,
                    jersey: player.jersey || '',
                    position: player.primaryPosition || 'P',
                    battingOrder: index + 1
                  }));
                  setLineupEntries(autoLineup);
                  setLineupStatus('Auto-filled from roster');
                  setTimeout(() => setLineupStatus('Ready'), 2000);
                }}
                style={{ 
                  background: user ? '#3b82f6' : '#1e293b', 
                  color: user ? '#fff' : '#475569', 
                  border: 'none', 
                  borderRadius: '8px', 
                  padding: '10px 20px', 
                  fontSize: '13px', 
                  fontWeight: '600', 
                  cursor: user ? 'pointer' : 'not-allowed' 
                }}
              >
                🔄 Auto-Fill from Roster
              </button>
            </div>
            
            <div style={{ marginTop: '12px', color: '#64748b', fontSize: '12px' }}>
              Status: {lineupStatus}
            </div>
          </div>
        </div>
      )}

      {/* STAT SHEETS TAB SUB-SYSTEM */}
      {activeTab === 'stats' && (
        <StatsPanel
          processedRoster={processedRoster} recentEvents={recentEvents} pitchLog={pitchLog}
          sprayDots={sprayDots} setSprayDots={setSprayDots}
          sprayChartPlayer={sprayChartPlayer} setSprayChartPlayer={setSprayChartPlayer}
          sprayPending={sprayPending} setSprayPending={setSprayPending}
          editingSprayDot={editingSprayDot} setEditingSprayDot={setEditingSprayDot}
          showHotZones={showHotZones} setShowHotZones={setShowHotZones}
          currentBatter={currentBatter} user={user}
          selectedSeason={selectedSeason} statsSubTab={statsSubTab} setStatsSubTab={setStatsSubTab}
          seasonSchedule={seasonSchedule} seasonWins={seasonWins} seasonLosses={seasonLosses}
          teamDisplayName={teamDisplayName} scoringOpponent={scoringOpponent}
          ourInnings={ourInnings} theirInnings={theirInnings}
          ourLiveScore={ourLiveScore} theirLiveScore={theirLiveScore}
          ourHits={ourHits} theirHits={theirHits} ourErrors={ourErrors} theirErrors={theirErrors}
          currentInning={currentInning} styles={styles}
        />
      )}
      {/* MODERN DASHBOARD TAB */}
      {activeTab === 'dashboard' && (
        <ModernDashboard
          teamData={{ name: teamDisplayName, sport: 'Baseball' }}
          seasonData={{ 
            schedule: seasonSchedule, 
            wins: seasonWins, 
            losses: seasonLosses 
          }}
          recentGames={seasonSchedule.slice(-10)}
          playerStats={processedRoster}
          isLoading={false}
        />
      )}
      {/* AI INSIGHTS TAB */}
      {activeTab === 'ai-insights' && (
        <AIInsights
          playerStats={processedRoster}
          gameData={seasonSchedule}
          pitchData={pitchLog}
          teamData={{ name: teamDisplayName, sport: 'Baseball' }}
          isLoading={false}
        />
      )}
      {/* ADMIN DASHBOARD TAB */}
      {activeTab === 'admin' && (
        <AdminDashboard
          user={user}
          adminData={{}}
          isLoading={false}
        />
      )}
      {/* GAMIFICATION TAB */}
      {activeTab === 'gamification' && (
        <GamificationSystem
          user={user}
          userStats={{
            gamesScored: seasonSchedule?.length || 0,
            perfectGames: 2,
            collaborators: 8,
            aiInsightsUsed: 15,
            totalHomeRuns: processedRoster?.reduce((sum, p) => sum + (p.hr || 0), 0) || 0,
            defensivePlays: 45,
            stolenBases: 12,
            streak: 5,
            earlyGames: 3,
            lateGames: 2
          }}
          teamData={{ name: teamDisplayName, sport: 'Baseball' }}
          achievements={[]}
          isLoading={false}
        />
      )}
      {/* SECURITY TAB */}
      {activeTab === 'security' && (
        <SecurityCenter
          user={user}
          securitySettings={{
            strongPassword: true,
            sessionTimeout: true,
            ipWhitelist: false,
            auditLogging: true,
            encryption: true
          }}
          isLoading={false}
        />
      )}
      {/* COMMUNITY TAB */}
      {activeTab === 'community' && (
        <CommunityHub
          user={user}
          communityData={{}}
          isLoading={false}
        />
      )}
      {/* ANALYTICS TAB */}
      {activeTab === 'analytics' && (
        <AnalyticsDashboard
          user={user}
          analyticsData={{}}
          isLoading={false}
        />
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

      {/* LEADERBOARD TAB */}
      {activeTab === 'leaderboard' && (
        <div style={{ maxWidth: '1000px', margin: '30px auto', padding: '0 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{ color: '#fff', fontSize: '28px', margin: '0 0 8px' }}>🏆 Season Leaderboard</h2>
            <p style={{ color: '#94a3b8', margin: 0, fontSize: '14px' }}>Top performers across all stat categories</p>
          </div>

          {/* Stat Category Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '32px' }}>
            {[
              { key: 'avg', label: 'Batting Average', icon: '🎯' },
              { key: 'hr', label: 'Home Runs', icon: '💥' },
              { key: 'rbi', label: 'RBIs', icon: '🏃' },
              { key: 'sb', label: 'Stolen Bases', icon: '⚡' },
              { key: 'era', label: 'ERA (Pitching)', icon: '🎾' },
              { key: 'k', label: 'Strikeouts', icon: '🔥' }
            ].map(category => (
              <div key={category.key} style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '20px' }}>{category.icon}</span>
                  <h3 style={{ color: '#fff', margin: 0, fontSize: '16px' }}>{category.label}</h3>
                </div>
                <div style={{ fontSize: '13px', color: '#64748b' }}>
                  {processedRoster
                    .filter(p => {
                      const val = Number(p[category.key] || 0);
                      return category.key === 'era' ? val > 0 && p.ip > 0 : val > 0;
                    })
                    .sort((a, b) => {
                      const aVal = Number(a[category.key] || 0);
                      const bVal = Number(b[category.key] || 0);
                      return category.key === 'era' ? aVal - bVal : bVal - aVal;
                    })
                    .slice(0, 3)
                    .map((player, index) => {
                      const value = Number(player[category.key] || 0);
                      const displayValue = category.key === 'avg' ? value.toFixed(3) : 
                                         category.key === 'era' && player.ip > 0 ? (value * 9 / player.ip).toFixed(2) : 
                                         value;
                      const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉';
                      return (
                        <div key={player.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: index < 2 ? '1px solid #1e293b' : 'none' }}>
                          <span style={{ color: '#e2e8f0' }}>
                            {medal} {player.firstName} {player.lastName}
                          </span>
                          <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>
                            {displayValue}
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>

          {/* Share Button */}
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => {
                const text = `🏆 ${teamDisplayName || 'Our Team'} Season Leaders\nCheck out our top performers!\n${window.location.href}`;
                navigator.clipboard.writeText(text);
                alert('Leaderboard copied to clipboard! Share it with your team.');
              }}
              style={{ background: '#38bdf8', color: '#020617', border: 'none', borderRadius: '8px', padding: '12px 24px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              📤 Share Leaderboard
            </button>
          </div>
        </div>
      )}

      {/* ANALYTICS TAB */}
      {activeTab === 'analytics' && (
        <div style={{ maxWidth: '1200px', margin: '30px auto', padding: '0 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{ color: '#fff', fontSize: '28px', margin: '0 0 8px' }}>📊 Advanced Analytics</h2>
            <p style={{ color: '#94a3b8', margin: 0, fontSize: '14px' }}>Spray charts, pitch tracking, and performance insights</p>
          </div>

          {!userLimits.advancedStats && (
            <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '12px', padding: '20px', marginBottom: '32px', textAlign: 'center' }}>
              <h3 style={{ color: '#f59e0b', margin: '0 0 8px' }}>🔒 Premium Feature</h3>
              <p style={{ color: '#94a3b8', margin: '0 0 16px' }}>Advanced analytics require a Pro plan. Upgrade to unlock spray charts, pitch tracking, and detailed insights.</p>
              <button onClick={() => setActiveTab('upgrade')} style={{ background: '#f59e0b', color: '#020617', border: 'none', borderRadius: '8px', padding: '12px 24px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}>Upgrade to Pro</button>
            </div>
          )}

          {userLimits.advancedStats && (
            <>
              {/* Player Selection */}
              <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
                <label style={{ display: 'block', color: '#e2e8f0', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
                  Select Player
                </label>
                <select
                  value={selectedAnalyticsPlayer || ''}
                  onChange={(e) => setSelectedAnalyticsPlayer(e.target.value)}
                  style={{ width: '100%', background: '#020617', border: '1px solid #334155', borderRadius: '8px', padding: '12px', color: '#fff', fontSize: '14px' }}
                >
                  <option value="">Choose a player...</option>
                  {processedRoster.map(player => (
                    <option key={player.id} value={player.id}>
                      #{player.jersey || '?'} {player.firstName} {player.lastName}
                    </option>
                  ))}
                </select>
              </div>

              {selectedAnalyticsPlayer && (() => {
                const player = processedRoster.find(p => p.id === selectedAnalyticsPlayer);
                if (!player) return null;

                // Mock spray chart data (in real app, this comes from detailed play-by-play)
                const sprayData = [
                  { x: 45, y: 30, result: 'hit', type: 'single' },
                  { x: -20, y: 40, result: 'out', type: 'groundout' },
                  { x: 60, y: -10, result: 'hit', type: 'double' },
                  { x: -30, y: 20, result: 'hit', type: 'single' },
                  { x: 50, y: 50, result: 'hit', type: 'hr' },
                  { x: -40, y: -20, result: 'out', type: 'flyout' },
                  { x: 30, y: 10, result: 'hit', type: 'single' },
                  { x: -10, y: 45, result: 'out', type: 'groundout' },
                  { x: 55, y: 25, result: 'hit', type: 'double' },
                  { x: -25, y: 35, result: 'hit', type: 'single' }
                ];

                return (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
                    {/* Spray Chart */}
                    <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '20px' }}>
                      <h3 style={{ color: '#fff', margin: '0 0 16px', fontSize: '16px' }}>🎯 Spray Chart</h3>
                      <div style={{ position: 'relative', width: '100%', height: '300px', background: '#020617', border: '1px solid #334155', borderRadius: '8px' }}>
                        {/* Baseball field outline */}
                        <svg width="100%" height="100%" viewBox="-100 -100 200 200">
                          {/* Field lines */}
                          <line x1="0" y1="0" x2="-70" y2="70" stroke="#334155" strokeWidth="1" />
                          <line x1="0" y1="0" x2="70" y2="70" stroke="#334155" strokeWidth="1" />
                          <line x1="-70" y1="70" x2="70" y2="70" stroke="#334155" strokeWidth="1" />
                          
                          {/* Home plate */}
                          <polygon points="0,-5 5,5 0,10 -5,5" fill="#64748b" />
                          
                          {/* Hit locations */}
                          {sprayData.map((point, i) => (
                            <circle
                              key={i}
                              cx={point.x}
                              cy={point.y}
                              r="4"
                              fill={point.result === 'hit' ? '#22c55e' : '#ef4444'}
                              opacity="0.8"
                            />
                          ))}
                        </svg>
                      </div>
                      <div style={{ display: 'flex', gap: '16px', marginTop: '12px', fontSize: '12px' }}>
                        <span style={{ color: '#22c55e' }}>● Hit</span>
                        <span style={{ color: '#ef4444' }}>● Out</span>
                      </div>
                    </div>

                    {/* Pitch Location Heatmap */}
                    <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '20px' }}>
                      <h3 style={{ color: '#fff', margin: '0 0 16px', fontSize: '16px' }}>🎾 Pitch Location Heatmap</h3>
                      <div style={{ position: 'relative', width: '100%', height: '300px', background: '#020617', border: '1px solid #334155', borderRadius: '8px' }}>
                        <svg width="100%" height="100%" viewBox="-150 -150 300 300">
                          {/* Strike zone */}
                          <rect x="-50" y="-50" width="100" height="100" fill="none" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
                          
                          {/* Mock pitch data with heat intensity */}
                          {[
                            { x: 10, y: 20, intensity: 0.8 },
                            { x: -15, y: -10, intensity: 0.6 },
                            { x: 30, y: 5, intensity: 0.9 },
                            { x: -20, y: 30, intensity: 0.4 },
                            { x: 5, y: -25, intensity: 0.7 },
                            { x: -40, y: 10, intensity: 0.5 },
                            { x: 25, y: -15, intensity: 0.8 }
                          ].map((pitch, i) => (
                            <circle
                              key={i}
                              cx={pitch.x}
                              cy={pitch.y}
                              r={15 * pitch.intensity}
                              fill={`rgba(239, 68, 68, ${pitch.intensity * 0.6})`}
                            />
                          ))}
                        </svg>
                      </div>
                      <div style={{ marginTop: '12px', fontSize: '12px', color: '#64748b' }}>
                        Red zones: High pitch density
                      </div>
                    </div>

                    {/* Performance Trends */}
                    <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '20px' }}>
                      <h3 style={{ color: '#fff', margin: '0 0 16px', fontSize: '16px' }}>📈 Performance Trends</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {[
                          { label: 'Batting Average', value: '.345', trend: 'up', change: '+0.12' },
                          { label: 'On-Base %', value: '.423', trend: 'up', change: '+0.08' },
                          { label: 'Strikeout Rate', value: '18.5%', trend: 'down', change: '-3.2%' },
                          { label: 'Hard Contact %', value: '42.1%', trend: 'up', change: '+5.7%' }
                        ].map((stat, i) => (
                          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #1e293b' }}>
                            <span style={{ color: '#94a3b8', fontSize: '13px' }}>{stat.label}</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>{stat.value}</span>
                              <span style={{ color: stat.trend === 'up' ? '#22c55e' : '#ef4444', fontSize: '12px' }}>
                                {stat.trend === 'up' ? '↑' : '↓'} {stat.change}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Exit Velocity */}
                    <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '20px' }}>
                      <h3 style={{ color: '#fff', margin: '0 0 16px', fontSize: '16px' }}>⚡ Exit Velocity</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {[
                          { velocity: 92, date: 'May 15' },
                          { velocity: 87, date: 'May 12' },
                          { velocity: 95, date: 'May 8' },
                          { velocity: 89, date: 'May 5' },
                          { velocity: 91, date: 'May 2' }
                        ].map((hit, i) => (
                          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: '#94a3b8', fontSize: '13px' }}>{hit.date}</span>
                            <span style={{ 
                              color: hit.velocity >= 90 ? '#22c55e' : '#64748b', 
                              fontSize: '14px', 
                              fontWeight: 'bold' 
                            }}>
                              {hit.velocity} mph
                            </span>
                          </div>
                        ))}
                      </div>
                      <div style={{ marginTop: '12px', padding: '8px', background: '#020617', borderRadius: '6px', textAlign: 'center' }}>
                        <span style={{ color: '#38bdf8', fontSize: '12px' }}>Season Avg: 90.8 mph</span>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </>
          )}
        </div>
      )}

      {/* TEAM CHAT TAB */}
      {activeTab === 'team-chat' && (
        <div style={{ maxWidth: '800px', margin: '30px auto', padding: '0 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{ color: '#fff', fontSize: '28px', margin: '0 0 8px' }}>💬 Team Chat</h2>
            <p style={{ color: '#94a3b8', margin: 0, fontSize: '14px' }}>Stay connected with your team and families</p>
          </div>

          {!user && (
            <div style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
              <p style={{ color: '#94a3b8', margin: '0 0 16px' }}>Sign in to access team chat and announcements</p>
              <button onClick={() => setShowAuthModal(true)} style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px 24px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}>Sign In</button>
            </div>
          )}

          {user && (
            <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', height: '600px', display: 'flex', flexDirection: 'column' }}>
              {/* Chat Header */}
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ color: '#fff', margin: 0, fontSize: '16px' }}>{teamDisplayName || 'Team'} Chat</h3>
                  <p style={{ color: '#64748b', margin: 0, fontSize: '12px' }}>Coaches, players, and families</p>
                </div>
                <button
                  onClick={() => setShowAnnouncementModal(true)}
                  style={{ background: '#38bdf8', color: '#020617', border: 'none', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  📢 Announcement
                </button>
              </div>

              {/* Messages Area */}
              <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Welcome Message */}
                <div style={{ textAlign: 'center', padding: '20px', background: '#020617', borderRadius: '8px' }}>
                  <p style={{ color: '#64748b', margin: 0, fontSize: '13px' }}>
                    Welcome to Team Chat! Share updates, coordinate schedules, and celebrate wins together.
                  </p>
                </div>

                {/* Sample Messages */}
                {[
                  { id: 1, type: 'announcement', author: 'Coach Miller', message: '📅 Reminder: Practice moved to 4pm tomorrow due to field maintenance', time: '2:30 PM', isCoach: true },
                  { id: 2, type: 'message', author: 'Sarah Johnson', message: 'Great game today everyone! The teamwork was amazing 🎉', time: '3:45 PM', isCoach: false },
                  { id: 3, type: 'message', author: 'Mike Chen', message: 'Can anyone help with carpool to Saturday\'s game?', time: '4:15 PM', isCoach: false },
                  { id: 4, type: 'announcement', author: 'Coach Miller', message: '🏆 Player of the Game: Jake Rodriguez - 3 for 3 with 2 RBIs!', time: '5:00 PM', isCoach: true }
                ].map(msg => (
                  <div key={msg.id} style={{ display: 'flex', gap: '12px', maxWidth: '80%' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: msg.isCoach ? '#38bdf8' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#fff', flexShrink: 0 }}>
                      {msg.author.charAt(0)}
                    </div>
                    <div style={{ flex: 1 }}>
                      {msg.type === 'announcement' && (
                        <div style={{ background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.3)', borderRadius: '8px', padding: '12px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                            <span style={{ color: '#38bdf8', fontSize: '12px', fontWeight: 'bold' }}>📢 {msg.author}</span>
                            <span style={{ color: '#64748b', fontSize: '11px' }}>{msg.time}</span>
                          </div>
                          <p style={{ color: '#e2e8f0', margin: 0, fontSize: '13px' }}>{msg.message}</p>
                        </div>
                      )}
                      {msg.type === 'message' && (
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                            <span style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 'bold' }}>{msg.author}</span>
                            <span style={{ color: '#64748b', fontSize: '11px' }}>{msg.time}</span>
                          </div>
                          <div style={{ background: '#1e293b', borderRadius: '8px', padding: '8px 12px' }}>
                            <p style={{ color: '#e2e8f0', margin: 0, fontSize: '13px' }}>{msg.message}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div style={{ padding: '16px 20px', borderTop: '1px solid #1e293b' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="Type a message..."
                    style={{ flex: 1, background: '#020617', border: '1px solid #334155', borderRadius: '8px', padding: '10px 12px', color: '#fff', fontSize: '14px' }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        // Handle message send
                        e.target.value = '';
                      }
                    }}
                  />
                  <button style={{ background: '#38bdf8', color: '#020617', border: 'none', borderRadius: '8px', padding: '10px 16px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}>
                    Send
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Chat Guidelines */}
          <div style={{ marginTop: '24px', padding: '16px', background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}>
            <h4 style={{ color: '#fff', margin: '0 0 8px', fontSize: '14px' }}>💬 Chat Guidelines</h4>
            <ul style={{ color: '#64748b', margin: 0, paddingLeft: '16px', fontSize: '12px', lineHeight: '1.5' }}>
              <li>Be respectful and supportive of all team members</li>
              <li>Keep conversations focused on team-related topics</li>
              <li>Coaches can send official announcements (highlighted in blue)</li>
              <li>Share schedule changes, game highlights, and team celebrations</li>
            </ul>
          </div>
        </div>
      )}

      {/* TOURNAMENTS TAB */}
      {activeTab === 'tournaments' && (
        <div style={{ maxWidth: '1200px', margin: '30px auto', padding: '0 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{ color: '#fff', fontSize: '28px', margin: '0 0 8px' }}>🏟️ Tournaments & Leagues</h2>
            <p style={{ color: '#94a3b8', margin: 0, fontSize: '14px' }}>Create brackets, manage schedules, and track standings</p>
          </div>

          {!user && (
            <div style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '12px', padding: '20px', textAlign: 'center', marginBottom: '32px' }}>
              <p style={{ color: '#94a3b8', margin: '0 0 16px' }}>Sign in to create and manage tournaments</p>
              <button onClick={() => setShowAuthModal(true)} style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px 24px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}>Sign In</button>
            </div>
          )}

          {user && (
            <>
              {/* Tournament Creation */}
              <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
                <h3 style={{ color: '#fff', margin: '0 0 16px', fontSize: '18px' }}>🏆 Create New Tournament</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                  <input
                    type="text"
                    placeholder="Tournament Name"
                    style={{ background: '#020617', border: '1px solid #334155', borderRadius: '8px', padding: '12px', color: '#fff', fontSize: '14px' }}
                  />
                  <select style={{ background: '#020617', border: '1px solid #334155', borderRadius: '8px', padding: '12px', color: '#fff', fontSize: '14px' }}>
                    <option>Single Elimination</option>
                    <option>Double Elimination</option>
                    <option>Round Robin</option>
                    <option>Pool Play</option>
                  </select>
                  <input
                    type="number"
                    placeholder="Max Teams"
                    min="4"
                    max="64"
                    style={{ background: '#020617', border: '1px solid #334155', borderRadius: '8px', padding: '12px', color: '#fff', fontSize: '14px' }}
                  />
                  <input
                    type="date"
                    style={{ background: '#020617', border: '1px solid #334155', borderRadius: '8px', padding: '12px', color: '#fff', fontSize: '14px' }}
                  />
                </div>
                <button style={{ background: '#38bdf8', color: '#020617', border: 'none', borderRadius: '8px', padding: '12px 24px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}>
                  Create Tournament
                </button>
              </div>

              {/* Active Tournaments */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
                {/* Tournament 1 */}
                <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ color: '#fff', margin: 0, fontSize: '16px' }}>Spring Classic 2024</h3>
                    <span style={{ background: '#22c55e', color: '#020617', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>Active</span>
                  </div>
                  <div style={{ color: '#64748b', fontSize: '12px', marginBottom: '16px' }}>
                    Single Elimination • 16 Teams • May 15-17
                  </div>
                  
                  {/* Mini Bracket */}
                  <div style={{ background: '#020617', border: '1px solid #334155', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '8px', alignItems: 'center', fontSize: '11px' }}>
                      <div style={{ textAlign: 'right', color: '#94a3b8' }}>
                        <div>Team A</div>
                        <div>Team B</div>
                      </div>
                      <div style={{ color: '#64748b' }}>vs</div>
                      <div style={{ color: '#94a3b8' }}>
                        <div>Team C</div>
                        <div>Team D</div>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={{ flex: 1, background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', padding: '8px', color: '#94a3b8', fontSize: '12px', cursor: 'pointer' }}>
                      View Bracket
                    </button>
                    <button style={{ flex: 1, background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', padding: '8px', color: '#94a3b8', fontSize: '12px', cursor: 'pointer' }}>
                      Manage Teams
                    </button>
                  </div>
                </div>

                {/* Tournament 2 */}
                <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ color: '#fff', margin: 0, fontSize: '16px' }}>Summer Showdown</h3>
                    <span style={{ background: '#f59e0b', color: '#020617', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>Upcoming</span>
                  </div>
                  <div style={{ color: '#64748b', fontSize: '12px', marginBottom: '16px' }}>
                    Double Elimination • 8 Teams • June 1-3
                  </div>
                  
                  <div style={{ background: '#020617', border: '1px solid #334155', borderRadius: '8px', padding: '16px', marginBottom: '16px', textAlign: 'center' }}>
                    <p style={{ color: '#64748b', margin: 0, fontSize: '12px' }}>Registration Open</p>
                    <p style={{ color: '#38bdf8', margin: '4px 0 0', fontSize: '14px', fontWeight: 'bold' }}>6/8 Spots Filled</p>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={{ flex: 1, background: '#38bdf8', border: 'none', borderRadius: '6px', padding: '8px', color: '#020617', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                      Register Team
                    </button>
                    <button style={{ flex: 1, background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', padding: '8px', color: '#94a3b8', fontSize: '12px', cursor: 'pointer' }}>
                      View Details
                    </button>
                  </div>
                </div>

                {/* League Standings */}
                <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ color: '#fff', margin: 0, fontSize: '16px' }}>📊 League Standings</h3>
                    <select style={{ background: '#020617', border: '1px solid #334155', borderRadius: '4px', padding: '4px 8px', color: '#fff', fontSize: '11px' }}>
                      <option>Spring 2024</option>
                      <option>Fall 2023</option>
                    </select>
                  </div>
                  
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    {[
                      { rank: 1, team: 'Irvin Rockets', w: 12, l: 2, pct: '.857', gb: '-' },
                      { rank: 2, team: 'Westlake Warriors', w: 10, l: 4, pct: '.714', gb: '2.0' },
                      { rank: 3, team: 'Austin Colts', w: 8, l: 6, pct: '.571', gb: '4.0' },
                      { rank: 4, team: 'Lake Travis Cavs', w: 6, l: 8, pct: '.429', gb: '6.0' },
                      { rank: 5, team: 'Bowie Bulldogs', w: 4, l: 10, pct: '.286', gb: '8.0' }
                    ].map(team => (
                      <div key={team.rank} style={{ display: 'flex', gap: '8px', padding: '6px 0', borderBottom: team.rank < 5 ? '1px solid #1e293b' : 'none' }}>
                        <span style={{ color: team.rank <= 3 ? '#22c55e' : '#64748b', width: '20px' }}>#{team.rank}</span>
                        <span style={{ color: '#e2e8f0', flex: 1 }}>{team.team}</span>
                        <span style={{ color: '#94a3b8', width: '30px', textAlign: 'right' }}>{team.w}-{team.l}</span>
                        <span style={{ color: '#38bdf8', width: '35px', textAlign: 'right' }}>{team.pct}</span>
                        <span style={{ color: '#64748b', width: '25px', textAlign: 'right' }}>{team.gb}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tournament Features */}
              <div style={{ marginTop: '32px', padding: '20px', background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}>
                <h3 style={{ color: '#fff', margin: '0 0 16px', fontSize: '16px' }}>🎯 Tournament Features</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  {[
                    { icon: '🏆', title: 'Multiple Formats', desc: 'Single/double elimination, round robin, pool play' },
                    { icon: '📅', title: 'Smart Scheduling', desc: 'Automatic bracket generation and game scheduling' },
                    { icon: '📊', title: 'Live Updates', desc: 'Real-time scores and standings during tournaments' },
                    { icon: '🏅', title: 'Championship Tracking', desc: 'Trophy history and championship records' }
                  ].map((feature, i) => (
                    <div key={i} style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '24px', marginBottom: '8px' }}>{feature.icon}</div>
                      <h4 style={{ color: '#fff', margin: '0 0 4px', fontSize: '14px' }}>{feature.title}</h4>
                      <p style={{ color: '#64748b', margin: 0, fontSize: '12px' }}>{feature.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* LIVE STREAM TAB */}
      {activeTab === 'live-stream' && (
        <div style={{ maxWidth: '1200px', margin: '30px auto', padding: '0 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{ color: '#fff', fontSize: '28px', margin: '0 0 8px' }}>📹 Live Stream</h2>
            <p style={{ color: '#94a3b8', margin: 0, fontSize: '14px' }}>Broadcast games live with integrated streaming platforms</p>
          </div>

          {!user && (
            <div style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '12px', padding: '20px', textAlign: 'center', marginBottom: '32px' }}>
              <p style={{ color: '#94a3b8', margin: '0 0 16px' }}>Sign in to start live streaming games</p>
              <button onClick={() => setShowAuthModal(true)} style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px 24px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}>Sign In</button>
            </div>
          )}

          {user && userPlan !== 'org' && (
            <div style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '12px', padding: '20px', textAlign: 'center', marginBottom: '32px' }}>
              <h3 style={{ color: '#a78bfa', margin: '0 0 8px' }}>🔒 Organization Feature</h3>
              <p style={{ color: '#94a3b8', margin: '0 0 16px' }}>Live streaming requires an Organization plan for professional broadcasting tools.</p>
              <button onClick={() => setActiveTab('upgrade')} style={{ background: '#a78bfa', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px 24px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}>
                Upgrade to Organization
              </button>
            </div>
          )}

          {user && userPlan === 'org' && (
            <>
              {/* Stream Setup */}
              <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
                <h3 style={{ color: '#fff', margin: '0 0 16px', fontSize: '18px' }}>🎥 Start New Stream</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', color: '#e2e8f0', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
                      Streaming Platform
                    </label>
                    <select style={{ width: '100%', background: '#020617', border: '1px solid #334155', borderRadius: '8px', padding: '12px', color: '#fff', fontSize: '14px' }}>
                      <option>YouTube Live</option>
                      <option>Twitch</option>
                      <option>Facebook Live</option>
                      <option>Custom RTMP</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', color: '#e2e8f0', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
                      Stream Title
                    </label>
                    <input
                      type="text"
                      placeholder="Irvin Rockets vs Westlake Warriors"
                      style={{ width: '100%', background: '#020617', border: '1px solid #334155', borderRadius: '8px', padding: '12px', color: '#fff', fontSize: '14px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', color: '#e2e8f0', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
                      Quality
                    </label>
                    <select style={{ width: '100%', background: '#020617', border: '1px solid #334155', borderRadius: '8px', padding: '12px', color: '#fff', fontSize: '14px' }}>
                      <option>1080p HD</option>
                      <option>720p</option>
                      <option>480p</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px 24px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    🔴 Go Live
                  </button>
                  <button style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '12px 24px', fontSize: '14px', color: '#94a3b8', cursor: 'pointer' }}>
                    Test Stream
                  </button>
                </div>
              </div>

              {/* Active Stream Preview */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '24px' }}>
                <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '20px' }}>
                  <h3 style={{ color: '#fff', margin: '0 0 16px', fontSize: '16px' }}>📺 Stream Preview</h3>
                  <div style={{ background: '#020617', border: '1px solid #334155', borderRadius: '8px', aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '48px', marginBottom: '8px' }}>📹</div>
                      <p style={{ color: '#64748b', margin: 0, fontSize: '14px' }}>Stream preview will appear here</p>
                      <p style={{ color: '#38bdf8', margin: '4px 0 0', fontSize: '12px' }}>Connect your streaming platform to begin</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={{ flex: 1, background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', padding: '8px', color: '#94a3b8', fontSize: '12px', cursor: 'pointer' }}>
                      📊 View Stats
                    </button>
                    <button style={{ flex: 1, background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', padding: '8px', color: '#94a3b8', fontSize: '12px', cursor: 'pointer' }}>
                      💬 Chat
                    </button>
                    <button style={{ flex: 1, background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', padding: '8px', color: '#94a3b8', fontSize: '12px', cursor: 'pointer' }}>
                      ⚙️ Settings
                    </button>
                  </div>
                </div>

                <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '20px' }}>
                  <h3 style={{ color: '#fff', margin: '0 0 16px', fontSize: '16px' }}>📈 Stream Stats</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[
                      { label: 'Viewers', value: '247', change: '+12' },
                      { label: 'Watch Time', value: '45m', change: '+8m' },
                      { label: 'Peak Viewers', value: '312', change: '+25' },
                      { label: 'Chat Messages', value: '89', change: '+15' }
                    ].map((stat, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < 3 ? '1px solid #1e293b' : 'none' }}>
                        <span style={{ color: '#94a3b8', fontSize: '13px' }}>{stat.label}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>{stat.value}</span>
                          <span style={{ color: '#22c55e', fontSize: '12px' }}>↑{stat.change}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Stream Features */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>🎯</div>
                  <h4 style={{ color: '#fff', margin: '0 0 8px', fontSize: '14px' }}>Score Overlay</h4>
                  <p style={{ color: '#64748b', margin: 0, fontSize: '12px' }}>Automatic live score overlay on stream</p>
                </div>
                <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>💬</div>
                  <h4 style={{ color: '#fff', margin: '0 0 8px', fontSize: '14px' }}>Live Chat</h4>
                  <p style={{ color: '#64748b', margin: 0, fontSize: '12px' }}>Integrated chat with moderation tools</p>
                </div>
                <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>📊</div>
                  <h4 style={{ color: '#fff', margin: '0 0 8px', fontSize: '14px' }}>Analytics</h4>
                  <p style={{ color: '#64748b', margin: 0, fontSize: '12px' }}>Real-time viewer stats and engagement</p>
                </div>
                <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔗</div>
                  <h4 style={{ color: '#fff', margin: '0 0 8px', fontSize: '14px' }}>Easy Sharing</h4>
                  <p style={{ color: '#64748b', margin: 0, fontSize: '12px' }}>One-click sharing to social media</p>
                </div>
              </div>

              {/* RTMP Configuration */}
              <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '20px' }}>
                <h3 style={{ color: '#fff', margin: '0 0 16px', fontSize: '16px' }}>🔧 RTMP Configuration</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', color: '#e2e8f0', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
                      Server URL
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="text"
                        value="rtmp://live.twitch.tv/live/"
                        readOnly
                        style={{ flex: 1, background: '#020617', border: '1px solid #334155', borderRadius: '8px', padding: '12px', color: '#94a3b8', fontSize: '12px' }}
                      />
                      <button style={{ background: '#38bdf8', color: '#020617', border: 'none', borderRadius: '6px', padding: '8px 12px', fontSize: '12px', cursor: 'pointer' }}>
                        Copy
                      </button>
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', color: '#e2e8f0', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
                      Stream Key
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="password"
                        value="live_123456789_abcdef"
                        readOnly
                        style={{ flex: 1, background: '#020617', border: '1px solid #334155', borderRadius: '8px', padding: '12px', color: '#94a3b8', fontSize: '12px' }}
                      />
                      <button style={{ background: '#38bdf8', color: '#020617', border: 'none', borderRadius: '6px', padding: '8px 12px', fontSize: '12px', cursor: 'pointer' }}>
                        Show
                      </button>
                    </div>
                  </div>
                </div>
                <p style={{ color: '#64748b', margin: '12px 0 0', fontSize: '12px' }}>
                  Use these settings in OBS, Streamlabs, or other streaming software to broadcast your game.
                </p>
              </div>
            </>
          )}
        </div>
      )}

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
                    {step.label === 'Enable push notifications' && !step.done && userLimits.pushNotifications && (
                      <button onClick={subscribeToPushNotifications} style={{ background: '#38bdf8', color: '#020617', border: 'none', borderRadius: '4px', padding: '2px 8px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer', marginLeft: 'auto' }}>Enable</button>
                    )}
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
            <h2 style={{ margin: '0 0 10px', fontSize: '28px', color: '#fff' }}>{sportEmoji(teamSport)} DiamondConnectPro Plans</h2>
            <p style={{ color: '#64748b', fontSize: '15px', margin: '0 0 20px' }}>Baseball &amp; Softball scoring, stats, and recruiting — built for coaches who are serious about winning.</p>
            {/* Billing toggle */}
            <div style={{ display: 'inline-flex', background: '#0f172a', border: '1px solid #1e293b', borderRadius: '30px', padding: '4px', gap: '4px' }}>
              <button onClick={() => setBillingCycle('monthly')} style={{ padding: '6px 20px', borderRadius: '24px', border: 'none', cursor: 'pointer', fontWeight: '700', fontSize: '13px', background: billingCycle === 'monthly' ? '#1e293b' : 'transparent', color: billingCycle === 'monthly' ? '#fff' : '#475569', transition: 'all 0.2s' }}>Monthly</button>
              <button onClick={() => setBillingCycle('annual')} style={{ padding: '6px 20px', borderRadius: '24px', border: 'none', cursor: 'pointer', fontWeight: '700', fontSize: '13px', background: billingCycle === 'annual' ? '#22c55e' : 'transparent', color: billingCycle === 'annual' ? '#020617' : '#475569', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '6px' }}>Annual <span style={{ background: '#16a34a', color: '#fff', fontSize: '10px', fontWeight: '900', padding: '1px 6px', borderRadius: '10px' }}>SAVE 30%</span></button>
            </div>
            {user && (
              <div style={{ marginTop: '12px', display: 'inline-block', padding: '6px 18px', borderRadius: '20px', background: userPlan === 'free' ? '#1e293b' : userPlan === 'org' ? '#7c3aed' : '#1d4ed8', color: '#fff', fontSize: '13px', fontWeight: 'bold' }}>
                Current plan: {userPlan === 'free' ? 'Free' : userPlan === 'org' ? 'Organization' : 'Pro Coach'}
              </div>
            )}
          </div>

          {/* COUPON INPUT */}
          <div style={{ marginBottom: '32px', textAlign: 'center' }}>
            <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '8px' }}>Have a promo code?</div>
            <div style={{ display: 'inline-flex', gap: '8px', alignItems: 'center', background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '6px 12px', maxWidth: '300px' }}>
              <input
                type="text"
                placeholder="Enter code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: '14px', outline: 'none', textTransform: 'uppercase' }}
              />
              <button
                onClick={() => setCouponCode('')}
                style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '12px', padding: '2px 6px' }}
              >
                Clear
              </button>
            </div>
            {couponStatus && (
              <div style={{ fontSize: '12px', color: couponStatus.includes('invalid') ? '#ef4444' : '#22c55e', marginTop: '6px' }}>
                {couponStatus}
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
                <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#fff', margin: '8px 0 2px' }}>{billingCycle === 'annual' ? '$4.92' : '$6.99'}<span style={{ fontSize: '16px', fontWeight: 'normal', color: '#64748b' }}>/mo</span></div>
                <div style={{ fontSize: '13px', color: billingCycle === 'annual' ? '#22c55e' : '#475569' }}>{billingCycle === 'annual' ? '✓ Billed $59/yr — 2 months free' : 'or $59/yr — save 30%'}</div>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                {['Everything in Free', 'Unlimited teams', 'Recruiting profiles per player', 'Highlight video uploads', 'Advanced stats (OBP, SLG, OPS, WHIP)', 'Printable lineup cards', 'Box score sharing', 'Family fan share links', 'Play log edit / undo', 'Priority support'].map(f => (
                  <li key={f} style={{ fontSize: '13px', color: '#cbd5e1', display: 'flex', gap: '8px' }}><span style={{ color: '#3b82f6' }}>✓</span>{f}</li>
                ))}
              </ul>
              {userPlan === 'pro' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ padding: '10px', background: '#1d4ed8', borderRadius: '8px', textAlign: 'center', color: '#fff', fontSize: '13px', fontWeight: 'bold' }}>✓ Current Plan</div>
                  <button onClick={openCustomerPortal} disabled={checkoutStatus === 'loading'} style={{ padding: '10px', background: 'transparent', border: '1px solid #334155', borderRadius: '8px', color: '#64748b', fontSize: '12px', cursor: 'pointer' }}>⚙️ Manage / Cancel Subscription</button>
                </div>
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ padding: '10px', background: '#7c3aed', borderRadius: '8px', textAlign: 'center', color: '#fff', fontSize: '13px', fontWeight: 'bold' }}>✓ Current Plan</div>
                  <button onClick={openCustomerPortal} disabled={checkoutStatus === 'loading'} style={{ padding: '10px', background: 'transparent', border: '1px solid #334155', borderRadius: '8px', color: '#64748b', fontSize: '12px', cursor: 'pointer' }}>⚙️ Manage / Cancel Subscription</button>
                </div>
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

          {/* REFERRAL SECTION */}
          {user && myReferralCode && (
            <div style={{ marginTop: '48px', background: '#0f172a', border: '1px solid #1e293b', borderRadius: '14px', padding: '24px', textAlign: 'center' }}>
              <div style={{ fontSize: '14px', fontWeight: '900', color: '#fff', marginBottom: '8px' }}>🎁 Refer a Coach & Get 1 Month Free</div>
              <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 16px', lineHeight: 1.5 }}>
                Share your link with another coach. When they upgrade to Pro, you get a free month.
              </p>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center', background: '#020617', border: '1px solid #334155', borderRadius: '10px', padding: '8px 12px', maxWidth: '400px', margin: '0 auto' }}>
                <input
                  type="text"
                  readOnly
                  value={`https://diamondconnectpro.com?ref=${myReferralCode}`}
                  style={{ flex: 1, background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '12px', outline: 'none' }}
                  onClick={(e) => e.target.select()}
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`https://diamondconnectpro.com?ref=${myReferralCode}`);
                    alert('Referral link copied!');
                  }}
                  style={{ background: '#38bdf8', color: '#020617', border: 'none', borderRadius: '6px', padding: '6px 12px', fontWeight: '700', fontSize: '12px', cursor: 'pointer', whiteSpace: 'nowrap' }}
                >
                  Copy
                </button>
              </div>
            </div>
          )}

          {/* COMPARISON TABLE */}
          <div style={{ marginTop: '40px', marginBottom: '32px', overflowX: 'auto' }}>
            <div style={{ fontSize: '11px', color: '#475569', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px' }}>How we compare</div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', minWidth: '540px' }}>
              <thead>
                <tr style={{ background: '#07101f' }}>
                  <th style={{ padding: '12px 16px', color: '#475569', textAlign: 'left', borderBottom: '1px solid #1e293b', fontWeight: '800', fontSize: '11px', textTransform: 'uppercase' }}>Feature</th>
                  {[['DiamondConnectPro', '#38bdf8'], ['GameChanger', '#475569'], ['iScore', '#334155']].map(([name, c]) => (
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
                    const fanUrl = `${window.location.origin}/fan?game=${encodeURIComponent(liveGameId)}`;
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
                    const fanUrl = `${window.location.origin}/fan?game=${encodeURIComponent(liveGameId)}`;
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

    {/* ANNOUNCEMENT MODAL */}
    {showAnnouncementModal && (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
        <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '24px', maxWidth: '500px', width: '90%' }}>
          <h3 style={{ color: '#fff', margin: '0 0 16px', fontSize: '18px' }}>📢 Send Team Announcement</h3>
          <textarea
            value={announcementText}
            onChange={(e) => setAnnouncementText(e.target.value)}
            placeholder="Share important updates with the team..."
            style={{ width: '100%', height: '120px', background: '#020617', border: '1px solid #334155', borderRadius: '8px', padding: '12px', color: '#fff', fontSize: '14px', resize: 'vertical', marginBottom: '16px' }}
          />
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              onClick={() => {
                setShowAnnouncementModal(false);
                setAnnouncementText('');
              }}
              style={{ background: 'transparent', border: '1px solid #334155', borderRadius: '6px', padding: '8px 16px', color: '#94a3b8', fontSize: '14px', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              onClick={() => {
                // Handle announcement send
                console.log('Sending announcement:', announcementText);
                setShowAnnouncementModal(false);
                setAnnouncementText('');
              }}
              style={{ background: '#38bdf8', color: '#020617', border: 'none', borderRadius: '6px', padding: '8px 16px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Send Announcement
            </button>
          </div>
        </div>
      </div>
    )}

    </div>
  );
}
