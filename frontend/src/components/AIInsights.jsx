import React, { useState, useEffect, useMemo } from 'react';
import AnimatedCard from './AnimatedCard';
import AnimatedStatsCard from './AnimatedStatsCard';
import LoadingSpinner from './LoadingSpinner';
import { colors, spacing, borderRadius, typography, transitions } from '../styles/designSystem';

const AIInsights = ({ 
  playerStats, 
  gameData, 
  pitchData, 
  teamData,
  isLoading = false 
}) => {
  const [insights, setInsights] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [patterns, setPatterns] = useState([]);
  const [selectedInsight, setSelectedInsight] = useState(null);

  // AI-powered analytics calculations
  useEffect(() => {
    if (!playerStats || !gameData || !pitchData) return;

    const calculateInsights = () => {
      const newInsights = [];
      const newPredictions = [];
      const newPatterns = [];

      // Player Performance Insights
      const topPerformers = analyzeTopPerformers(playerStats);
      newInsights.push(...topPerformers);

      // Pitching Patterns
      const pitchingPatterns = analyzePitchingPatterns(pitchData);
      newPatterns.push(...pitchingPatterns);

      // Batting Trends
      const battingTrends = analyzeBattingTrends(playerStats, gameData);
      newInsights.push(...battingTrends);

      // Predictive Analytics
      const gamePredictions = generatePredictions(playerStats, gameData);
      newPredictions.push(...gamePredictions);

      // Team Chemistry Analysis
      const chemistryInsights = analyzeTeamChemistry(playerStats, gameData);
      newInsights.push(...chemistryInsights);

      setInsights(newInsights);
      setPredictions(newPredictions);
      setPatterns(newPatterns);
    };

    calculateInsights();
  }, [playerStats, gameData, pitchData]);

  // Analyze top performers
  const analyzeTopPerformers = (stats) => {
    const performers = [];

    // Find batting leaders
    const battingLeaders = stats
      .filter(p => p.avg && p.atBats > 10)
      .sort((a, b) => b.avg - a.avg)
      .slice(0, 3);

    if (battingLeaders.length > 0) {
      performers.push({
        type: 'performance',
        title: '🔥 Hot Hitters',
        description: battingLeaders[0].name + ' leads with a ' + battingLeaders[0].avg?.toFixed(3) + ' batting average',
        players: battingLeaders,
        confidence: 95,
        impact: 'high',
        recommendation: 'Consider moving these players up in the batting order'
      });
    }

    // Find power hitters
    const powerLeaders = stats
      .filter(p => p.hr && p.atBats > 10)
      .sort((a, b) => (b.hr || 0) - (a.hr || 0))
      .slice(0, 3);

    if (powerLeaders.length > 0) {
      performers.push({
        type: 'performance',
        title: '💣 Power Threats',
        description: powerLeaders[0].name + ' with ' + powerLeaders[0].hr + ' home runs',
        players: powerLeaders,
        confidence: 88,
        impact: 'medium',
        recommendation: 'These players should be positioned for RBI opportunities'
      });
    }

    return performers;
  };

  // Analyze pitching patterns
  const analyzePitchingPatterns = (pitches) => {
    const patterns = [];

    if (!pitches || pitches.length === 0) return patterns;

    // Analyze pitch selection tendencies
    const pitchTypes = {};
    pitches.forEach(pitch => {
      const type = pitch.type || 'unknown';
      pitchTypes[type] = (pitchTypes[type] || 0) + 1;
    });

    const totalPitches = pitches.length;
    const dominantPitch = Object.entries(pitchTypes)
      .sort(([,a], [,b]) => b - a)[0];

    if (dominantPitch && dominantPitch[1] / totalPitches > 0.4) {
      patterns.push({
        type: 'pitching',
        title: '⚾ Pitch Selection Pattern',
        description: dominantPitch[0] + ' is thrown ' + (dominantPitch[1] / totalPitches * 100).toFixed(1) + '% of the time',
        data: {
          dominant: dominantPitch[0],
          percentage: (dominantPitch[1] / totalPitches * 100).toFixed(1),
          total: totalPitches
        },
        confidence: 92,
        recommendation: 'Mix in more pitch types to keep hitters off balance'
      });
    }

    // Analyze count patterns
    const countPatterns = {};
    pitches.forEach(pitch => {
      const count = (pitch.balls || 0) + '-' + (pitch.strikes || 0);
      countPatterns[count] = (countPatterns[count] || 0) + 1;
    });

    patterns.push({
      type: 'pitching',
      title: '📊 Count Distribution',
      description: 'Most common pitch counts identified',
      data: countPatterns,
      confidence: 85,
      recommendation: 'Focus on getting ahead in counts early'
    });

    return patterns;
  };

  // Analyze batting trends
  const analyzeBattingTrends = (stats, games) => {
    const trends = [];

    // Calculate team batting average trend
    const recentGames = games.slice(-10);
    if (recentGames.length >= 5) {
      const recentAvg = calculateRecentBattingAverage(recentGames, stats);
      const seasonAvg = stats.reduce((sum, p) => sum + (p.avg || 0), 0) / stats.length;

      if (recentAvg > seasonAvg + 0.020) {
        trends.push({
          type: 'trend',
          title: '📈 Rising Performance',
          description: 'Team batting average up ' + ((recentAvg - seasonAvg) * 1000).toFixed(0) + ' points recently',
          confidence: 78,
          impact: 'positive',
          recommendation: 'Current approach is working well'
        });
      } else if (recentAvg < seasonAvg - 0.020) {
        trends.push({
          type: 'trend',
          title: '📉 Slumping Performance',
          description: 'Team batting average down ' + ((seasonAvg - recentAvg) * 1000).toFixed(0) + ' points recently',
          confidence: 82,
          impact: 'negative',
          recommendation: 'Consider batting practice or lineup adjustments'
        });
      }
    }

    return trends;
  };

  // Generate predictions
  const generatePredictions = (stats, games) => {
    const predictions = [];

    // Predict next game outcome
    if (games.length >= 5) {
      const recentPerformance = analyzeRecentPerformance(games);
      const winProbability = calculateWinProbability(recentPerformance, stats);

      predictions.push({
        type: 'prediction',
        title: '🎯 Next Game Outlook',
        description: (winProbability > 0.6 ? 'Favorable' : winProbability > 0.4 ? 'Competitive' : 'Challenging') + ' matchup expected',
        probability: winProbability,
        confidence: 75,
        factors: recentPerformance.factors
      });
    }

    // Predict player milestones
    stats.forEach(player => {
      if (player.hr && player.hr >= 8 && player.hr < 10) {
        predictions.push({
          type: 'milestone',
          title: '🏆 Milestone Alert',
          description: player.name + ' approaching 10 home runs',
          player: player.name,
          current: player.hr,
          target: 10,
          confidence: 85,
          recommendation: 'Consider giving extra at-bats to reach milestone'
        });
      }
    });

    return predictions;
  };

  // Analyze team chemistry
  const analyzeTeamChemistry = (stats, games) => {
    const chemistry = [];

    // Calculate lineup consistency impact
    const consistentLineupGames = games.filter(game => 
      game.lineupStability > 0.8
    ).length;

    if (games.length > 0) {
      const consistencyRatio = consistentLineupGames / games.length;
      
      chemistry.push({
        type: 'chemistry',
        title: '🤝 Lineup Chemistry',
        description: 'Consistent lineup in ' + (consistencyRatio * 100).toFixed(0) + '% of games',
        confidence: 80,
        impact: consistencyRatio > 0.7 ? 'positive' : 'neutral',
        recommendation: consistencyRatio < 0.5 ? 'Consider stabilizing the lineup' : 'Current lineup consistency is good'
      });
    }

    return chemistry;
  };

  // Helper functions
  const calculateRecentBattingAverage = (games, stats) => {
    // Simplified calculation - in real implementation would use actual game data
    return stats.reduce((sum, p) => sum + (p.avg || 0), 0) / stats.length;
  };

  const analyzeRecentPerformance = (games) => {
    const wins = games.filter(g => g.result === 'W').length;
    const totalGames = games.length;
    return {
      winRate: wins / totalGames,
      factors: ['Recent form', 'Opponent strength', 'Home/away']
    };
  };

  const calculateWinProbability = (performance, stats) => {
    // Simplified probability calculation
    const teamAvg = stats.reduce((sum, p) => sum + (p.avg || 0), 0) / stats.length;
    const baseProb = performance.winRate;
    const avgBonus = (teamAvg - 0.250) * 2; // Bonus for above-average batting
    
    return Math.max(0.1, Math.min(0.9, baseProb + avgBonus));
  };

  const getInsightIcon = (type) => {
    const icons = {
      performance: '🔥',
      pitching: '⚾',
      trend: '📊',
      prediction: '🎯',
      chemistry: '🤝',
      milestone: '🏆'
    };
    return icons[type] || '💡';
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return colors.success;
    if (confidence >= 75) return colors.warning;
    return colors.error;
  };

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
          Analyzing performance data...
        </div>
      </div>
    );
  }

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
          🤖 AI-Powered Insights
        </h1>
        <p style={{ 
          fontSize: typography.fontSize.lg, 
          color: colors.neutral[600],
          marginBottom: spacing[6]
        }}>
          Advanced analytics and predictive intelligence for your team
        </p>
      </div>

      {/* Key Metrics */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: spacing[6],
        marginBottom: spacing[8]
      }}>
        <AnimatedStatsCard
          title="AI Confidence"
          value={insights.length > 0 ? Math.round(insights.reduce((sum, i) => sum + i.confidence, 0) / insights.length) : 0}
          subtitle="Average confidence score"
          icon="🧠"
          color={colors.primary[600]}
          size="md"
        />
        
        <AnimatedStatsCard
          title="Active Insights"
          value={insights.length}
          subtitle="Actionable recommendations"
          icon="💡"
          color={colors.success}
          size="md"
        />
        
        <AnimatedStatsCard
          title="Predictions"
          value={predictions.length}
          subtitle="Future outlook analysis"
          icon="🔮"
          color={colors.warning}
          size="md"
        />
        
        <AnimatedStatsCard
          title="Patterns Found"
          value={patterns.length}
          subtitle="Behavioral patterns detected"
          icon="🔍"
          color={colors.error}
          size="md"
        />
      </div>

      {/* Insights Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
        gap: spacing[6],
        marginBottom: spacing[8]
      }}>
        {/* Performance Insights */}
        <AnimatedCard>
          <h3 style={{ 
            fontSize: typography.fontSize.xl, 
            fontWeight: typography.fontWeight.bold,
            color: colors.neutral[900],
            marginBottom: spacing[4]
          }}>
            🎯 Performance Insights
          </h3>
          
          <div style={{ spaceY: spacing[4] }}>
            {insights.filter(i => i.type === 'performance').map((insight, index) => (
              <div key={index} style={{
                padding: spacing[4],
                backgroundColor: colors.neutral[50],
                borderRadius: borderRadius.lg,
                border: '1px solid ' + colors.neutral[200],
                cursor: 'pointer',
                transition: transitions.all
              }}
              onClick={() => setSelectedInsight(insight)}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = colors.neutral[100];
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = colors.neutral[50];
                e.target.style.transform = 'translateY(0)';
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  marginBottom: spacing[2]
                }}>
                  <h4 style={{ 
                    fontSize: typography.fontSize.base,
                    fontWeight: typography.fontWeight.semibold,
                    color: colors.neutral[900],
                    margin: 0
                  }}>
                    {insight.title}
                  </h4>
                  <span style={{
                    fontSize: typography.fontSize.xs,
                    padding: spacing[1] + 'px ' + spacing[2] + 'px',
                    backgroundColor: getConfidenceColor(insight.confidence),
                    color: 'white',
                    borderRadius: borderRadius.full,
                    fontWeight: typography.fontWeight.medium
                  }}>
                    {insight.confidence}%
                  </span>
                </div>
                
                <p style={{ 
                  fontSize: typography.fontSize.sm,
                  color: colors.neutral[600],
                  margin: '0 0 ' + spacing[3] + 'px 0',
                  lineHeight: 1.5
                }}>
                  {insight.description}
                </p>
                
                <div style={{
                  padding: spacing[3],
                  backgroundColor: colors.primary[50],
                  borderRadius: borderRadius.lg,
                  borderLeft: '3px solid ' + colors.primary[500]
                }}>
                  <p style={{ 
                    fontSize: typography.fontSize.sm,
                    color: colors.primary[700],
                    margin: 0,
                    fontWeight: typography.fontWeight.medium
                  }}>
                    💡 {insight.recommendation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </AnimatedCard>

        {/* Predictions */}
        <AnimatedCard>
          <h3 style={{ 
            fontSize: typography.fontSize.xl, 
            fontWeight: typography.fontWeight.bold,
            color: colors.neutral[900],
            marginBottom: spacing[4]
          }}>
            🔮 Predictions
          </h3>
          
          <div style={{ spaceY: spacing[4] }}>
            {predictions.map((prediction, index) => (
              <div key={index} style={{
                padding: spacing[4],
                background: 'linear-gradient(135deg, ' + colors.primary[50] + ', ' + colors.accent[50] + ')',
                borderRadius: borderRadius.lg,
                border: '1px solid ' + colors.primary[200]
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: spacing[2]
                }}>
                  <h4 style={{ 
                    fontSize: typography.fontSize.base,
                    fontWeight: typography.fontWeight.semibold,
                    color: colors.neutral[900],
                    margin: 0
                  }}>
                    {prediction.title}
                  </h4>
                  <span style={{
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.bold,
                    color: colors.primary[600]
                  }}>
                    {prediction.probability ? Math.round(prediction.probability * 100) + '%' : ''}
                  </span>
                </div>
                
                <p style={{ 
                  fontSize: typography.fontSize.sm,
                  color: colors.neutral[600],
                  margin: '0 0 ' + spacing[2] + 'px 0',
                  lineHeight: 1.5
                }}>
                  {prediction.description}
                </p>
                
                {prediction.factors && (
                  <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500] }}>
                    Factors: {prediction.factors.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </AnimatedCard>
      </div>

      {/* Patterns Analysis */}
      {patterns.length > 0 && (
        <AnimatedCard>
          <h3 style={{ 
            fontSize: typography.fontSize.xl, 
            fontWeight: typography.fontWeight.bold,
            color: colors.neutral[900],
            marginBottom: spacing[4]
          }}>
            📊 Pattern Analysis
          </h3>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: spacing[4]
          }}>
            {patterns.map((pattern, index) => (
              <div key={index} style={{
                padding: spacing[4],
                backgroundColor: colors.neutral[50],
                borderRadius: borderRadius.lg,
                border: '1px solid ' + colors.neutral[200]
              }}>
                <h4 style={{ 
                  fontSize: typography.fontSize.base,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.neutral[900],
                  margin: '0 0 ' + spacing[2] + 'px 0'
                }}>
                  {pattern.title}
                </h4>
                
                <p style={{ 
                  fontSize: typography.fontSize.sm,
                  color: colors.neutral[600],
                  margin: '0 0 ' + spacing[3] + 'px 0',
                  lineHeight: 1.5
                }}>
                  {pattern.description}
                </p>
                
                <div style={{
                  padding: spacing[2],
                  backgroundColor: colors.warning[50],
                  borderRadius: borderRadius.lg,
                  fontSize: typography.fontSize.sm,
                  color: colors.warning[700]
                }}>
                  💡 {pattern.recommendation}
                </div>
              </div>
            ))}
          </div>
        </AnimatedCard>
      )}

      {/* Selected Insight Detail Modal */}
      {selectedInsight && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: spacing[4]
        }}
        onClick={() => setSelectedInsight(null)}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: borderRadius.xl,
            padding: spacing[6],
            maxWidth: '600px',
            width: '100%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}
          onClick={(e) => e.stopPropagation()}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'flex-start',
              marginBottom: spacing[4]
            }}>
              <h3 style={{ 
                fontSize: typography.fontSize.xl,
                fontWeight: typography.fontWeight.bold,
                color: colors.neutral[900],
                margin: 0
              }}>
                {selectedInsight.title}
              </h3>
              <button
                onClick={() => setSelectedInsight(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: typography.fontSize['2xl'],
                  color: colors.neutral[400],
                  cursor: 'pointer',
                  padding: spacing[1]
                }}
              >
                ×
              </button>
            </div>
            
            <p style={{ 
              fontSize: typography.fontSize.base,
              color: colors.neutral[600],
              lineHeight: 1.6,
              marginBottom: spacing[4]
            }}>
              {selectedInsight.description}
            </p>
            
            <div style={{
              padding: spacing[4],
              backgroundColor: colors.primary[50],
              borderRadius: borderRadius.lg,
              borderLeft: '4px solid ' + colors.primary[500]
            }}>
              <h4 style={{ 
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.semibold,
                color: colors.primary[900],
                margin: '0 0 ' + spacing[2] + 'px 0'
              }}>
                Recommendation
              </h4>
              <p style={{ 
                fontSize: typography.fontSize.sm,
                color: colors.primary[700],
                margin: 0,
                lineHeight: 1.5
              }}>
                {selectedInsight.recommendation}
              </p>
            </div>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginTop: spacing[4],
              paddingTop: spacing[4],
              borderTop: '1px solid ' + colors.neutral[200]
            }}>
              <span style={{ 
                fontSize: typography.fontSize.sm,
                color: colors.neutral[500]
              }}>
                Confidence: {selectedInsight.confidence}%
              </span>
              <span style={{ 
                fontSize: typography.fontSize.sm,
                color: colors.neutral[500]
              }}>
                Impact: {selectedInsight.impact || 'medium'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIInsights;
