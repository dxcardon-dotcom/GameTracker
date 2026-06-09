import React from 'react';
import BroadcastConsole from './BroadcastConsole';
import FanGameStream from './FanGameStream';
import PlayerProfile from './PlayerProfile';
import TeamPage from './TeamPage';
import DiscoverPage from './DiscoverPage';

function App() {
  const params = new URLSearchParams(window.location.search);
  const path = window.location.pathname;
  const isFanView = path.startsWith('/fan') || params.get('view') === 'fan';
  const isPlayerView = path.startsWith('/player') || params.get('view') === 'player';
  const isTeamView = path.startsWith('/team') || params.get('view') === 'team';
  const isDiscoverView = path.startsWith('/discover') || params.get('view') === 'discover';

  return (
    <div className="w-full min-h-screen bg-slate-900 m-0 p-0 box-border">
      {isDiscoverView ? <DiscoverPage /> : isTeamView ? <TeamPage /> : isPlayerView ? <PlayerProfile /> : isFanView ? <FanGameStream /> : <BroadcastConsole />}
    </div>
  );
}

export default App;
