import React, { useState, useCallback, useEffect } from 'react';

const PlayerDevelopment = ({ 
  processedRoster, 
  calculatePlayerMetrics,
  showPlayerDevelopment, 
  setShowPlayerDevelopment 
}) => {
  const [playerDevelopmentData, setPlayerDevelopmentData] = useState({});
  const [developmentGoals, setDevelopmentGoals] = useState({});
  const [achievementSystem, setAchievementSystem] = useState({});
  const [selectedPlayerForDevelopment, setSelectedPlayerForDevelopment] = useState(null);
  const [developmentLoading, setDevelopmentLoading] = useState(false);
  const [newGoal, setNewGoal] = useState('');
  const [goalCategory, setGoalCategory] = useState('hitting');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalDeadline, setGoalDeadline] = useState('');

  const calculatePlayerDevelopment = useCallback((playerId) => {
    const player = processedRoster.find(p => p.id === playerId);
    if (!player) return {};

    const currentMetrics = calculatePlayerMetrics(playerId);
    const historicalData = generateMockHistoricalData(playerId);
    
    const hittingProgress = calculateSkillProgression(historicalData, 'hitting');
    const fieldingProgress = calculateSkillProgression(historicalData, 'fielding');
    const baseRunningProgress = calculateSkillProgression(historicalData, 'baseRunning');
    
    const strengths = identifyStrengths(currentMetrics);
    const weaknesses = identifyWeaknesses(currentMetrics);
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
    
    for (let i = 12; i >= 0; i--) {
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
    
    const recent = historicalData.slice(-3);
    const older = historicalData.slice(-6, -3);
    
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
    
    addAchievement(playerId, 'goal_setter', 'First Development Goal Set');
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
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const developmentData = {};
      processedRoster.forEach(player => {
        developmentData[player.id] = calculatePlayerDevelopment(player.id);
      });
      
      setPlayerDevelopmentData(developmentData);
      
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

  useEffect(() => {
    if (showPlayerDevelopment && Object.keys(playerDevelopmentData).length === 0) {
      loadPlayerDevelopmentData();
    }
  }, [showPlayerDevelopment, playerDevelopmentData, loadPlayerDevelopmentData]);

  if (!showPlayerDevelopment) return null;

  return (
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
  );
};

export default PlayerDevelopment;
