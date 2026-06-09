import React from 'react';
import BroadcastConsole from './BroadcastConsole';
import FanGameStream from './FanGameStream';
import PlayerProfile from './PlayerProfile';

function App() {
  const params = new URLSearchParams(window.location.search);
  const isFanView = window.location.pathname.startsWith('/fan') || params.get('view') === 'fan';
  const isPlayerView = window.location.pathname.startsWith('/player') || params.get('view') === 'player';

  return (
    <div className="w-full min-h-screen bg-slate-900 m-0 p-0 box-border">
      {isPlayerView ? <PlayerProfile /> : isFanView ? <FanGameStream /> : <BroadcastConsole />}
    </div>
  );
}

export default App;
