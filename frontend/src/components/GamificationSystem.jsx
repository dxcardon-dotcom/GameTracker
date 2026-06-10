import React, { useState, useEffect, useMemo } from 'react';
import AnimatedCard from './AnimatedCard';
import AnimatedStatsCard from './AnimatedStatsCard';
import AnimatedButton from './AnimatedButton';
import LoadingSpinner from './LoadingSpinner';
import { colors, spacing, borderRadius, typography, transitions } from '../styles/designSystem';

const GamificationSystem = ({ 
  user, 
  userStats, 
  teamData, 
  achievements,
  onAchievementUnlock,
  isLoading = false 
}) => {
  const [userLevel, setUserLevel] = useState(1);
  const [userXP, setUserXP] = useState(0);
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [showAchievementModal, setShowAchievementModal] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [activeTab, setActiveTab] = useState('achievements');

  // Calculate user level and XP
  useEffect(() => {
    if (userStats) {
      const totalXP = calculateUserXP(userStats);
      const level = calculateLevel(totalXP);
      setUserXP(totalXP);
      setUserLevel(level);
    }
  }, [userStats]);

  // Mock leaderboard data
  useEffect(() => {
    setLeaderboard([
      { rank: 1, name: 'Sarah Wilson', xp: 2850, level: 12, avatar: '👩‍💼', achievements: 45 },
      { rank: 2, name: 'Mike Johnson', xp: 2620, level: 11, avatar: '👨‍💻', achievements: 42 },
      { rank: 3, name: 'John Doe', xp: 2390, level: 10, avatar: '👨‍🏫', achievements: 38 },
      { rank: 4, name: 'Jane Smith', xp: 2180, level: 9, avatar: '👩‍🔬', achievements: 35 },
      { rank: 5, name: 'Tom Brown', xp: 1950, level: 8, avatar: '👨‍🔧', achievements: 32 },
      { rank: 6, name: 'Lisa Davis', xp: 1720, level: 7, avatar: '👩‍🎨', achievements: 28 },
      { rank: 7, name: 'Chris Wilson', xp: 1580, level: 6, avatar: '👨‍🎭', achievements: 25 },
      { rank: 8, name: 'Amy Chen', xp: 1420, level: 5, avatar: '👩‍💻', achievements: 22 },
    ]);
  }, []);

  // Achievement definitions
  const achievementDefinitions = [
    {
      id: 'first_game',
      title: '🎮 First Game',
      description: 'Score your first game',
      icon: '🎮',
      xp: 50,
      rarity: 'common',
      category: 'milestone',
      unlocked: userStats?.gamesScored > 0
    },
    {
      id: 'score_10_games',
      title: '📊 Score Master',
      description: 'Score 10 games',
      icon: '📊',
      xp: 200,
      rarity: 'common',
      category: 'milestone',
      unlocked: userStats?.gamesScored >= 10
    },
    {
      id: 'perfect_game',
      title: '⭐ Perfect Game',
      description: 'Score a perfect game (no errors)',
      icon: '⭐',
      xp: 500,
      rarity: 'rare',
      category: 'performance',
      unlocked: userStats?.perfectGames > 0
    },
    {
      id: 'team_player',
      title: '🤝 Team Player',
      description: 'Collaborate with 5 different coaches',
      icon: '🤝',
      xp: 300,
      rarity: 'uncommon',
      category: 'social',
      unlocked: userStats?.collaborators >= 5
    },
    {
      id: 'data_whiz',
      title: '📈 Data Whiz',
      description: 'Use AI Insights 25 times',
      icon: '📈',
      xp: 400,
      rarity: 'uncommon',
      category: 'engagement',
      unlocked: userStats?.aiInsightsUsed >= 25
    },
    {
      id: 'early_bird',
      title: '🌅 Early Bird',
      description: 'Score a game before 9 AM',
      icon: '🌅',
      xp: 150,
      rarity: 'common',
      category: 'milestone',
      unlocked: userStats?.earlyGames > 0
    },
    {
      id: 'night_owl',
      title: '🦉 Night Owl',
      description: 'Score a game after 9 PM',
      icon: '🦉',
      xp: 150,
      rarity: 'common',
      category: 'milestone',
      unlocked: userStats?.lateGames > 0
    },
    {
      id: 'streak_master',
      title: '🔥 Streak Master',
      description: 'Score games for 7 consecutive days',
      icon: '🔥',
      xp: 600,
      rarity: 'epic',
      category: 'milestone',
      unlocked: userStats?.streak >= 7
    },
    {
      id: 'power_hitter',
      title: '💪 Power Hitter',
      description: 'Record 10 home runs in a season',
      icon: '💪',
      xp: 350,
      rarity: 'uncommon',
      category: 'performance',
      unlocked: userStats?.totalHomeRuns >= 10
    },
    {
      id: 'defensive_wizard',
      title: '🛡️ Defensive Wizard',
      description: 'Record 50 defensive plays',
      icon: '🛡️',
      xp: 300,
      rarity: 'uncommon',
      category: 'performance',
      unlocked: userStats?.defensivePlays >= 50
    },
    {
      id: 'speed_demon',
      title: '⚡ Speed Demon',
      description: 'Record 20 stolen bases',
      icon: '⚡',
      xp: 250,
      rarity: 'common',
      category: 'performance',
      unlocked: userStats?.stolenBases >= 20
    },
    {
      id: 'veteran_coach',
      title: '🏆 Veteran Coach',
      description: 'Score 100 games',
      icon: '🏆',
      xp: 1000,
      rarity: 'legendary',
      category: 'milestone',
      unlocked: userStats?.gamesScored >= 100
    }
  ];

  // Calculate user XP based on activities
  const calculateUserXP = (stats) => {
    let xp = 0;
    if (stats?.gamesScored) xp += stats.gamesScored * 10;
    if (stats?.perfectGames) xp += stats.perfectGames * 50;
    if (stats?.collaborators) xp += stats.collaborators * 20;
    if (stats?.aiInsightsUsed) xp += stats.aiInsightsUsed * 5;
    if (stats?.totalHomeRuns) xp += stats.totalHomeRuns * 15;
    if (stats?.defensivePlays) xp += stats.defensivePlays * 5;
    if (stats?.stolenBases) xp += stats.stolenBases * 8;
    return xp;
  };

  // Calculate level based on XP
  const calculateLevel = (xp) => {
    return Math.floor(xp / 200) + 1;
  };

  // Get XP needed for next level
  const getXPForNextLevel = (level) => {
    return level * 200;
  };

  // Get XP progress to next level
  const getXPProgress = () => {
    const currentLevelXP = (userLevel - 1) * 200;
    const nextLevelXP = userLevel * 200;
    const progress = ((userXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
    return Math.min(100, Math.max(0, progress));
  };

  // Get rarity color
  const getRarityColor = (rarity) => {
    const colors = {
      common: colors.neutral[500],
      uncommon: colors.success[500],
      rare: colors.primary[500],
      epic: colors.warning[500],
      legendary: colors.error[500]
    };
    return colors[rarity] || colors.neutral[500];
  };

  // Get rarity background
  const getRarityBackground = (rarity) => {
    const backgrounds = {
      common: colors.neutral[100],
      uncommon: colors.success[100],
      rare: colors.primary[100],
      epic: colors.warning[100],
      legendary: 'linear-gradient(135deg, #fef3c7, #fde68a)'
    };
    return backgrounds[rarity] || colors.neutral[100];
  };

  // Filter achievements by category
  const getAchievementsByCategory = (category) => {
    return achievementDefinitions.filter(achievement => 
      category === 'all' || achievement.category === category
    );
  };

  // Get unlocked achievements count
  const unlockedCount = achievementDefinitions.filter(a => a.unlocked).length;
  const totalAchievements = achievementDefinitions.length;

  // Render user level card
  const renderLevelCard = () => (
    <AnimatedCard>
      <div style={{ textAlign: 'center', marginBottom: spacing[6] }}>
        <div style={{ 
          fontSize: typography.fontSize['4xl'],
          fontWeight: typography.fontWeight.bold,
          color: colors.primary[600],
          marginBottom: spacing[2]
        }}>
          Level {userLevel}
        </div>
        <div style={{ 
          fontSize: typography.fontSize.lg,
          color: colors.neutral[600],
          marginBottom: spacing[4]
        }}>
          {userXP} Total XP
        </div>
        
        {/* XP Progress Bar */}
        <div style={{ 
          backgroundColor: colors.neutral[200],
          borderRadius: borderRadius.full,
          height: '8px',
          marginBottom: spacing[2]
        }}>
          <div style={{
            backgroundColor: colors.primary[500],
            borderRadius: borderRadius.full,
            height: '100%',
            width: getXPProgress() + '%',
            transition: transitions.all
          }} />
        </div>
        
        <div style={{ 
          fontSize: typography.fontSize.sm,
          color: colors.neutral[600]
        }}>
          {getXPForNextLevel(userLevel) - userXP} XP to Level {userLevel + 1}
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
        gap: spacing[4]
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            fontSize: typography.fontSize['2xl'],
            fontWeight: typography.fontWeight.bold,
            color: colors.warning[500]
          }}>
            {unlockedCount}
          </div>
          <div style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>
            Achievements
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            fontSize: typography.fontSize['2xl'],
            fontWeight: typography.fontWeight.bold,
            color: colors.success[500]
          }}>
            {userStats?.gamesScored || 0}
          </div>
          <div style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>
            Games Scored
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            fontSize: typography.fontSize['2xl'],
            fontWeight: typography.fontWeight.bold,
            color: colors.primary[500]
          }}>
            {userStats?.streak || 0}
          </div>
          <div style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>
            Day Streak
          </div>
        </div>
      </div>
    </AnimatedCard>
  );

  // Render achievements grid
  const renderAchievements = () => {
    const categories = ['all', 'milestone', 'performance', 'social', 'engagement'];
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[6] }}>
        {/* Category Filter */}
        <div style={{ 
          display: 'flex', 
          gap: spacing[2], 
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          {categories.map(category => (
            <AnimatedButton
              key={category}
              variant={activeTab === category ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab(category)}
              style={{
                textTransform: 'capitalize',
                borderRadius: borderRadius.full,
                padding: `${spacing[2]} ${spacing[4]}`
              }}
            >
              {category}
            </AnimatedButton>
          ))}
        </div>

        {/* Achievements Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: spacing[4]
        }}>
          {getAchievementsByCategory(activeTab).map(achievement => (
            <div
              key={achievement.id}
              style={{
                padding: spacing[4],
                borderRadius: borderRadius.xl,
                border: `2px solid ${achievement.unlocked ? getRarityColor(achievement.rarity) : colors.neutral[300]}`,
                background: achievement.unlocked ? getRarityBackground(achievement.rarity) : colors.neutral[50],
                cursor: achievement.unlocked ? 'pointer' : 'default',
                transition: transitions.all,
                opacity: achievement.unlocked ? 1 : 0.6,
                transform: achievement.unlocked ? 'scale(1)' : 'scale(0.95)'
              }}
              onClick={() => achievement.unlocked && setShowAchievementModal(achievement)}
              onMouseEnter={(e) => {
                if (achievement.unlocked) {
                  e.target.style.transform = 'scale(1.02)';
                  e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = achievement.unlocked ? 'scale(1)' : 'scale(0.95)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <div style={{ textAlign: 'center', marginBottom: spacing[3] }}>
                <div style={{ 
                  fontSize: typography.fontSize['3xl'],
                  marginBottom: spacing[2]
                }}>
                  {achievement.unlocked ? achievement.icon : '🔒'}
                </div>
                <h4 style={{ 
                  fontSize: typography.fontSize.base,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.neutral[900],
                  margin: `0 0 ${spacing[1]} 0`
                }}>
                  {achievement.title}
                </h4>
                <p style={{ 
                  fontSize: typography.fontSize.sm,
                  color: colors.neutral[600],
                  margin: 0,
                  lineHeight: 1.4
                }}>
                  {achievement.description}
                </p>
              </div>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginTop: spacing[3]
              }}>
                <span style={{
                  fontSize: typography.fontSize.xs,
                  padding: `${spacing[1]} ${spacing[2]}`,
                  borderRadius: borderRadius.full,
                  backgroundColor: getRarityColor(achievement.rarity),
                  color: 'white',
                  fontWeight: typography.fontWeight.medium,
                  textTransform: 'capitalize'
                }}>
                  {achievement.rarity}
                </span>
                <span style={{
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.bold,
                  color: getRarityColor(achievement.rarity)
                }}>
                  +{achievement.xp} XP
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render leaderboard
  const renderLeaderboard = () => (
    <AnimatedCard>
      <h3 style={{ 
        fontSize: typography.fontSize.xl, 
        fontWeight: typography.fontWeight.bold,
        color: colors.neutral[900],
        marginBottom: spacing[6],
        textAlign: 'center'
      }}>
        🏆 Global Leaderboard
      </h3>
      
      <div style={{ spaceY: spacing[3] }}>
        {leaderboard.map((player) => {
          const isCurrentUser = player.name === (user?.displayName || user?.email);
          return (
            <div
              key={player.rank}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing[3],
                padding: spacing[4],
                borderRadius: borderRadius.lg,
                backgroundColor: isCurrentUser ? colors.primary[50] : colors.neutral[50],
                border: isCurrentUser ? `2px solid ${colors.primary[300]}` : `1px solid ${colors.neutral[200]}`,
                transition: transitions.all
              }}
            >
              {/* Rank */}
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 
                  player.rank === 1 ? colors.warning[400] :
                  player.rank === 2 ? colors.neutral[400] :
                  player.rank === 3 ? colors.error[600] :
                  colors.neutral[300],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: typography.fontWeight.bold,
                color: 'white',
                fontSize: typography.fontSize.sm
              }}>
                {player.rank}
              </div>

              {/* Avatar */}
              <div style={{ fontSize: typography.fontSize['2xl'] }}>
                {player.avatar}
              </div>

              {/* Player Info */}
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: typography.fontSize.base,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.neutral[900],
                  marginBottom: spacing[1]
                }}>
                  {player.name}
                  {isCurrentUser && (
                    <span style={{
                      fontSize: typography.fontSize.xs,
                      backgroundColor: colors.primary[500],
                      color: 'white',
                      padding: `${spacing[1]} ${spacing[2]}`,
                      borderRadius: borderRadius.full,
                      marginLeft: spacing[2]
                    }}>
                      YOU
                    </span>
                  )}
                </div>
                <div style={{ 
                  fontSize: typography.fontSize.sm, 
                  color: colors.neutral[600] 
                }}>
                  Level {player.level} • {player.achievements} achievements
                </div>
              </div>

              {/* XP */}
              <div style={{ textAlign: 'right' }}>
                <div style={{
                  fontSize: typography.fontSize.lg,
                  fontWeight: typography.fontWeight.bold,
                  color: colors.primary[600]
                }}>
                  {player.xp}
                </div>
                <div style={{ 
                  fontSize: typography.fontSize.xs, 
                  color: colors.neutral[600] 
                }}>
                  XP
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AnimatedCard>
  );

  // Render achievement modal
  const renderAchievementModal = () => {
    if (!showAchievementModal) return null;

    return (
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
      onClick={() => setShowAchievementModal(null)}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: borderRadius.xl,
          padding: spacing[6],
          maxWidth: '500px',
          width: '100%',
          textAlign: 'center'
        }}
        onClick={(e) => e.stopPropagation()}>
          <div style={{ 
            fontSize: typography.fontSize['4xl'],
            marginBottom: spacing[3]
          }}>
            {showAchievementModal.icon}
          </div>
          
          <h3 style={{ 
            fontSize: typography.fontSize.xl,
            fontWeight: typography.fontWeight.bold,
            color: colors.neutral[900],
            marginBottom: spacing[2]
          }}>
            {showAchievementModal.title}
          </h3>
          
          <p style={{ 
            fontSize: typography.fontSize.base,
            color: colors.neutral[600],
            marginBottom: spacing[4],
            lineHeight: 1.5
          }}>
            {showAchievementModal.description}
          </p>
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: spacing[4],
            marginBottom: spacing[4]
          }}>
            <span style={{
              fontSize: typography.fontSize.sm,
              padding: `${spacing[1]} ${spacing[2]}`,
              borderRadius: borderRadius.full,
              backgroundColor: getRarityColor(showAchievementModal.rarity),
              color: 'white',
              fontWeight: typography.fontWeight.medium,
              textTransform: 'capitalize'
            }}>
              {showAchievementModal.rarity}
            </span>
            <span style={{
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.bold,
              color: getRarityColor(showAchievementModal.rarity)
            }}>
              +{showAchievementModal.xp} XP
            </span>
          </div>
          
          <AnimatedButton
            variant="primary"
            onClick={() => setShowAchievementModal(null)}
          >
            Awesome!
          </AnimatedButton>
        </div>
      </div>
    );
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
          Loading gamification system...
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
          🎮 Gamification & Achievements
        </h1>
        <p style={{ 
          fontSize: typography.fontSize.lg, 
          color: colors.neutral[600],
          marginBottom: spacing[6]
        }}>
          Level up, unlock achievements, and compete with coaches worldwide!
        </p>
      </div>

      {/* Level Card */}
      {renderLevelCard()}

      {/* Tab Navigation */}
      <div style={{ 
        display: 'flex', 
        gap: spacing[2], 
        justifyContent: 'center',
        marginBottom: spacing[8],
        flexWrap: 'wrap'
      }}>
        <AnimatedButton
          variant={activeTab === 'achievements' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('achievements')}
          style={{
            borderRadius: borderRadius.lg,
            padding: `${spacing[3]} ${spacing[4]}`
          }}
        >
          🏆 Achievements
        </AnimatedButton>
        <AnimatedButton
          variant={activeTab === 'leaderboard' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('leaderboard')}
          style={{
            borderRadius: borderRadius.lg,
            padding: `${spacing[3]} ${spacing[4]}`
          }}
        >
          📊 Leaderboard
        </AnimatedButton>
      </div>

      {/* Content */}
      {activeTab === 'achievements' && renderAchievements()}
      {activeTab === 'leaderboard' && renderLeaderboard()}

      {/* Achievement Modal */}
      {renderAchievementModal()}
    </div>
  );
};

export default GamificationSystem;
