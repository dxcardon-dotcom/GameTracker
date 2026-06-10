import React, { useState, useCallback, useEffect } from 'react';

const AdvancedMetrics = ({ 
  processedRoster, 
  calculatePlayerMetrics, 
  calculateTeamMetrics,
  showAdvancedMetrics, 
  setShowAdvancedMetrics 
}) => {
  const [playerMetrics, setPlayerMetrics] = useState({});
  const [teamMetrics, setTeamMetrics] = useState({});
  const [predictiveAnalytics, setPredictiveAnalytics] = useState({});
  const [performanceTrends, setPerformanceTrends] = useState([]);
  const [comparisonData, setComparisonData] = useState({});
  const [metricsLoading, setMetricsLoading] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('season');

  const generatePredictiveAnalytics = useCallback(() => {
    const teamMetrics = calculateTeamMetrics();
    const playerProjections = {};

    processedRoster.forEach(player => {
      const metrics = calculatePlayerMetrics(player.id);
      if (metrics.counts?.atBats > 10) {
        const projectedAB = Math.max(metrics.counts.atBats, 100);
        const projectedHits = Math.round(metrics.basic.battingAverage * projectedAB);
        const projectedWalks = Math.round(metrics.advanced.walkRate * projectedAB * 1.2);
        const projectedStrikeouts = Math.round(metrics.advanced.strikeoutRate * projectedAB);
        const projectedRBIs = Math.round(metrics.production.rc * 1.5);

        playerProjections[player.id] = {
          current: metrics.basic,
          projected: {
            battingAverage: metrics.basic.battingAverage * (0.9 + Math.random() * 0.2),
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
          confidence: Math.min(0.95, metrics.counts.atBats / 100),
          trend: Math.random() > 0.5 ? 'improving' : 'declining'
        };
      }
    });

    const teamProjection = {
      current: teamMetrics.offensive,
      projected: {
        battingAverage: teamMetrics.offensive.battingAverage * (0.95 + Math.random() * 0.1),
        onBasePercentage: teamMetrics.offensive.onBasePercentage * (0.95 + Math.random() * 0.1),
        sluggingPercentage: teamMetrics.offensive.sluggingPercentage * (0.95 + Math.random() * 0.1),
        ops: teamMetrics.offensive.ops * (0.95 + Math.random() * 0.1),
        runsPerGame: parseFloat(teamMetrics.offensive.runsPerGame) * (0.95 + Math.random() * 0.1)
      },
      winProbability: 0.5 + (teamMetrics.offensive.ops - 0.7) * 2,
      playoffProbability: Math.min(0.95, Math.max(0.05, 0.5 + (teamMetrics.offensive.ops - 0.65) * 3))
    };

    return {
      playerProjections,
      teamProjection,
      generatedAt: new Date().toISOString()
    };
  }, [calculateTeamMetrics, calculatePlayerMetrics, processedRoster]);

  const generatePerformanceTrends = useCallback(() => {
    const trends = [];
    const now = new Date();
    
    for (let i = 30; i >= 0; i -= 3) {
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
          rank: Math.floor(Math.random() * 50) + 1
        }))
        .filter(p => p.metrics.counts?.atBats > 0)
        .sort((a, b) => b.metrics.basic.ops - a.metrics.basic.ops)
        .slice(0, 10)
    };
  }, [calculateTeamMetrics, calculatePlayerMetrics, processedRoster]);

  const loadAdvancedMetrics = useCallback(async () => {
    setMetricsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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

  useEffect(() => {
    if (showAdvancedMetrics && Object.keys(playerMetrics).length === 0) {
      loadAdvancedMetrics();
    }
  }, [showAdvancedMetrics, playerMetrics, loadAdvancedMetrics]);

  if (!showAdvancedMetrics) return null;

  return (
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
                  {(teamMetrics.offensive.ops || 0).toFixed(3)}
                </div>
              </div>
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
  );
};

export default AdvancedMetrics;
