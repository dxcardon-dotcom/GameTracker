import React, { useState, useEffect } from 'react';
import AnimatedStatsCard from './AnimatedStatsCard';
import AnimatedCard from './AnimatedCard';
import AnimatedButton from './AnimatedButton';
import LoadingSpinner from './LoadingSpinner';
import { colors, spacing, borderRadius, typography, transitions } from '../styles/designSystem';

const ModernDashboard = ({ 
  teamData, 
  seasonData, 
  recentGames, 
  playerStats,
  isLoading = false 
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState('season');
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    setAnimated(true);
  }, []);

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px',
        flexDirection: 'column',
        gap: spacing[4]
      }}>
        <LoadingSpinner size="lg" />
        <div style={{ color: colors.neutral[500], fontSize: typography.fontSize.lg }}>
          Loading dashboard...
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalGames = seasonData?.schedule?.length || 0;
  const wins = seasonData?.wins || 0;
  const losses = seasonData?.losses || 0;
  const winPercentage = totalGames > 0 ? ((wins / totalGames) * 100).toFixed(1) : 0;
  
  const totalPlayers = playerStats?.length || 0;
  const avgBattingAvg = playerStats?.reduce((sum, p) => sum + (p.avg || 0), 0) / totalPlayers || 0;
  const totalHomeRuns = playerStats?.reduce((sum, p) => sum + (p.hr || 0), 0) || 0;
  const totalRBIs = playerStats?.reduce((sum, p) => sum + (p.rbi || 0), 0) || 0;

  const recentPerformance = recentGames?.slice(-5).map(game => ({
    date: game.date,
    result: game.result,
    opponent: game.opponent,
    score: game.score
  })) || [];

  const topPerformers = {
    battingAvg: playerStats?.sort((a, b) => (b.avg || 0) - (a.avg || 0)).slice(0, 3) || [],
    homeRuns: playerStats?.sort((a, b) => (b.hr || 0) - (a.hr || 0)).slice(0, 3) || [],
    rbis: playerStats?.sort((a, b) => (b.rbi || 0) - (a.rbi || 0)).slice(0, 3) || []
  };

  return (
    <div style={{ 
      padding: spacing[6], 
      backgroundColor: colors.neutral[50],
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{ 
        marginBottom: spacing[8], 
        textAlign: 'center' 
      }}>
        <h1 style={{ 
          fontSize: typography.fontSize['4xl'], 
          fontWeight: typography.fontWeight.bold,
          color: colors.neutral[900],
          marginBottom: spacing[2]
        }}>
          Team Dashboard
        </h1>
        <p style={{ 
          fontSize: typography.fontSize.lg, 
          color: colors.neutral[600],
          marginBottom: spacing[6]
        }}>
          Real-time performance metrics and insights
        </p>
        
        {/* Period Selector */}
        <div style={{ 
          display: 'flex', 
          gap: spacing[2], 
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          {['week', 'month', 'season'].map(period => (
            <AnimatedButton
              key={period}
              variant={selectedPeriod === period ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
              style={{
                textTransform: 'capitalize',
                borderRadius: borderRadius.full,
                padding: `${spacing[2]} ${spacing[4]}`
              }}
            >
              {period}
            </AnimatedButton>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: spacing[6],
        marginBottom: spacing[8]
      }}>
        <AnimatedStatsCard
          title="Win Rate"
          value={winPercentage}
          subtitle={`${wins}W - ${losses}L`}
          trend={5.2}
          icon="🏆"
          color={colors.success}
          size="lg"
          animated={animated}
        />
        
        <AnimatedStatsCard
          title="Total Games"
          value={totalGames}
          subtitle="This season"
          trend={12.5}
          icon="📊"
          color={colors.primary[600]}
          size="lg"
          animated={animated}
        />
        
        <AnimatedStatsCard
          title="Team Batting Avg"
          value={avgBattingAvg.toFixed(3)}
          subtitle="Across all players"
          trend={2.8}
          icon="⚾"
          color={colors.warning}
          size="lg"
          animated={animated}
        />
        
        <AnimatedStatsCard
          title="Total Home Runs"
          value={totalHomeRuns}
          subtitle="Team power hitting"
          trend={8.1}
          icon="💣"
          color={colors.error}
          size="lg"
          animated={animated}
        />
      </div>

      {/* Recent Performance */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
        gap: spacing[6],
        marginBottom: spacing[8]
      }}>
        <AnimatedCard>
          <h3 style={{ 
            fontSize: typography.fontSize.xl, 
            fontWeight: typography.fontWeight.bold,
            color: colors.neutral[900],
            marginBottom: spacing[4]
          }}>
            📈 Recent Performance
          </h3>
          
          <div style={{ spaceY: spacing[3] }}>
            {recentPerformance.map((game, index) => (
              <div key={index} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: spacing[3],
                backgroundColor: index % 2 === 0 ? colors.neutral[50] : 'white',
                borderRadius: borderRadius.lg,
                transition: transitions.all,
                cursor: 'pointer'
              }}>
                <div>
                  <div style={{ 
                    fontWeight: typography.fontWeight.medium,
                    color: colors.neutral[900],
                    marginBottom: spacing[1]
                  }}>
                    vs {game.opponent}
                  </div>
                  <div style={{ 
                    fontSize: typography.fontSize.sm,
                    color: colors.neutral[500]
                  }}>
                    {game.date}
                  </div>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.bold,
                    color: game.result === 'W' ? colors.success : colors.error,
                    marginBottom: spacing[1]
                  }}>
                    {game.result}
                  </div>
                  <div style={{ 
                    fontSize: typography.fontSize.sm,
                    color: colors.neutral[600]
                  }}>
                    {game.score}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </AnimatedCard>

        {/* Top Performers */}
        <AnimatedCard>
          <h3 style={{ 
            fontSize: typography.fontSize.xl, 
            fontWeight: typography.fontWeight.bold,
            color: colors.neutral[900],
            marginBottom: spacing[4]
          }}>
            ⭐ Top Performers
          </h3>
          
          <div style={{ spaceY: spacing[4] }}>
            {/* Batting Average Leaders */}
            <div>
              <h4 style={{ 
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.semibold,
                color: colors.neutral[700],
                marginBottom: spacing[2],
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Batting Average
              </h4>
              {topPerformers.battingAvg.map((player, index) => (
                <div key={player.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: `${spacing[2]} 0`,
                  borderBottom: index < 2 ? `1px solid ${colors.neutral[200]}` : 'none'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
                    <span style={{ 
                      fontSize: typography.fontSize.sm,
                      fontWeight: typography.fontWeight.bold,
                      color: colors.neutral[500]
                    }}>
                      #{index + 1}
                    </span>
                    <span style={{ 
                      fontSize: typography.fontSize.sm,
                      color: colors.neutral[900]
                    }}>
                      {player.name}
                    </span>
                  </div>
                  <span style={{ 
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.bold,
                    color: colors.primary[600]
                  }}>
                    {player.avg?.toFixed(3) || '.000'}
                  </span>
                </div>
              ))}
            </div>

            {/* Home Run Leaders */}
            <div>
              <h4 style={{ 
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.semibold,
                color: colors.neutral[700],
                marginBottom: spacing[2],
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Home Runs
              </h4>
              {topPerformers.homeRuns.map((player, index) => (
                <div key={player.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: `${spacing[2]} 0`,
                  borderBottom: index < 2 ? `1px solid ${colors.neutral[200]}` : 'none'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
                    <span style={{ 
                      fontSize: typography.fontSize.sm,
                      fontWeight: typography.fontWeight.bold,
                      color: colors.neutral[500]
                    }}>
                      #{index + 1}
                    </span>
                    <span style={{ 
                      fontSize: typography.fontSize.sm,
                      color: colors.neutral[900]
                    }}>
                      {player.name}
                    </span>
                  </div>
                  <span style={{ 
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.bold,
                    color: colors.error
                  }}>
                    {player.hr || 0}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </AnimatedCard>
      </div>

      {/* Quick Actions */}
      <AnimatedCard>
        <h3 style={{ 
          fontSize: typography.fontSize.xl, 
          fontWeight: typography.fontWeight.bold,
          color: colors.neutral[900],
          marginBottom: spacing[4]
        }}>
          🚀 Quick Actions
        </h3>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: spacing[4]
        }}>
          <AnimatedButton
            variant="primary"
            onClick={() => window.showNotification?.('info', 'Starting new game setup...', 'Game Setup')}
          >
            🎮 Start New Game
          </AnimatedButton>
          
          <AnimatedButton
            variant="secondary"
            onClick={() => window.showNotification?.('success', 'Generating team report...', 'Reports')}
          >
            📊 Generate Report
          </AnimatedButton>
          
          <AnimatedButton
            variant="success"
            onClick={() => window.showNotification?.('info', 'Opening roster management...', 'Roster')}
          >
            👥 Manage Roster
          </AnimatedButton>
          
          <AnimatedButton
            variant="ghost"
            onClick={() => window.showNotification?.('warning', 'Export feature coming soon!', 'Export')}
          >
            📤 Export Data
          </AnimatedButton>
        </div>
      </AnimatedCard>
    </div>
  );
};

export default ModernDashboard;
