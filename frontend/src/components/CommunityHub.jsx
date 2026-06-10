import React, { useState, useEffect, useMemo } from 'react';
import AnimatedCard from './AnimatedCard';
import AnimatedStatsCard from './AnimatedStatsCard';
import AnimatedButton from './AnimatedButton';
import LoadingSpinner from './LoadingSpinner';
import { colors, spacing, borderRadius, typography, transitions } from '../styles/designSystem';

const CommunityHub = ({ 
  user, 
  communityData, 
  onPostCreate,
  onFollow,
  onLike,
  isLoading = false 
}) => {
  const [activeSection, setActiveSection] = useState('feed');
  const [posts, setPosts] = useState([]);
  const [teams, setTeams] = useState([]);
  const [events, setEvents] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', tags: [] });

  // Mock data for demonstration
  useEffect(() => {
    if (!isLoading) {
      setPosts([
        {
          id: 1,
          author: { name: 'Sarah Wilson', avatar: '👩‍💼', team: 'Springfield High' },
          title: 'Amazing comeback victory today!',
          content: 'Our team showed incredible heart today coming back from 5 runs down in the 7th inning. The players never gave up and the crowd was electric!',
          likes: 45,
          comments: 12,
          shares: 8,
          timestamp: '2 hours ago',
          tags: ['comeback', 'victory', 'teamwork'],
          image: 'https://picsum.photos/seed/game1/600/400.jpg',
          liked: false
        },
        {
          id: 2,
          author: { name: 'Mike Johnson', avatar: '👨‍💻', team: 'Riverside Baseball' },
          title: 'New pitching drill that really works',
          content: 'Been using this new drill with our pitchers and the results have been fantastic. Focus on mechanics and follow-through. Happy to share details!',
          likes: 32,
          comments: 18,
          shares: 15,
          timestamp: '4 hours ago',
          tags: ['pitching', 'drills', 'coaching'],
          liked: true
        },
        {
          id: 3,
          author: { name: 'Lisa Davis', avatar: '👩‍🎨', team: 'Thunder Softball' },
          title: 'Team bonding event was a huge success',
          content: 'Organized a team picnic this weekend and it was amazing to see the players connect outside of practice. Team chemistry is everything!',
          likes: 28,
          comments: 9,
          shares: 6,
          timestamp: '6 hours ago',
          tags: ['team-bonding', 'chemistry', 'fun'],
          image: 'https://picsum.photos/seed/picnic/600/400.jpg',
          liked: false
        }
      ]);

      setTeams([
        { id: 1, name: 'Springfield High School', sport: 'Baseball', members: 245, posts: 89, avatar: '⚾' },
        { id: 2, name: 'Riverside Baseball Club', sport: 'Baseball', members: 156, posts: 67, avatar: '🥎' },
        { id: 3, name: 'Thunder Softball Academy', sport: 'Softball', members: 98, posts: 45, avatar: '⚡' },
        { id: 4, name: 'Eagles Youth Baseball', sport: 'Baseball', members: 78, posts: 34, avatar: '🦅' },
        { id: 5, name: 'Comets Fastpitch', sport: 'Softball', members: 112, posts: 56, avatar: '☄️' }
      ]);

      setEvents([
        {
          id: 1,
          title: 'National Coaching Summit',
          date: '2024-07-15',
          location: 'Chicago, IL',
          attendees: 500,
          type: 'conference',
          description: 'Join coaches from across the country for 3 days of learning and networking'
        },
        {
          id: 2,
          title: 'Youth Baseball Tournament',
          date: '2024-06-20',
          location: 'Austin, TX',
          attendees: 200,
          type: 'tournament',
          description: 'Annual tournament for teams U12-U14'
        },
        {
          id: 3,
          title: 'Coaching Webinar: Advanced Stats',
          date: '2024-06-25',
          location: 'Online',
          attendees: 150,
          type: 'webinar',
          description: 'Learn how to use advanced statistics to improve player development'
        }
      ]);

      setFollowers([
        { id: 1, name: 'John Smith', avatar: '👨‍🏫', team: 'West High', mutual: true },
        { id: 2, name: 'Emma Wilson', avatar: '👩‍🔬', team: 'North Academy', mutual: false },
        { id: 3, name: 'Chris Brown', avatar: '👨‍🔧', team: 'East Eagles', mutual: true }
      ]);

      setFollowing([
        { id: 1, name: 'Sarah Johnson', avatar: '👩‍💼', team: 'Central High', posts: 45 },
        { id: 2, name: 'Tom Davis', avatar: '👨‍🎭', team: 'South Panthers', posts: 32 },
        { id: 3, name: 'Amy Chen', avatar: '👩‍💻', team: 'North Stars', posts: 28 }
      ]);
    }
  }, [isLoading, user]);

  // Handle post creation
  const handleCreatePost = () => {
    if (newPost.title && newPost.content) {
      const post = {
        id: posts.length + 1,
        author: { name: user?.displayName || 'Anonymous', avatar: '👤', team: 'Your Team' },
        title: newPost.title,
        content: newPost.content,
        likes: 0,
        comments: 0,
        shares: 0,
        timestamp: 'Just now',
        tags: newPost.tags,
        liked: false
      };
      setPosts([post, ...posts]);
      setNewPost({ title: '', content: '', tags: [] });
      setShowCreatePost(false);
    }
  };

  // Handle like toggle
  const handleLike = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  // Render community feed
  const renderFeed = () => (
    <div style={{ display: 'grid', gap: spacing[6] }}>
      {/* Create Post Button */}
      <AnimatedCard>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: spacing[3],
          padding: spacing[4],
          backgroundColor: colors.neutral[50],
          borderRadius: borderRadius.lg,
          cursor: 'pointer',
          transition: transitions.colors
        }}
        onClick={() => setShowCreatePost(true)}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = colors.neutral[100];
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = colors.neutral[50];
        }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            borderRadius: '50%',
            backgroundColor: colors.primary[100],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: typography.fontSize.lg
          }}>
            👤
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ 
              fontSize: typography.fontSize.base,
              color: colors.neutral[500],
              fontWeight: typography.fontWeight.medium
            }}>
              Share your coaching insights...
            </div>
          </div>
          <AnimatedButton variant="primary" size="sm">
            Post
          </AnimatedButton>
        </div>
      </AnimatedCard>

      {/* Posts Feed */}
      {posts.map((post) => (
        <AnimatedCard key={post.id}>
          <div style={{ marginBottom: spacing[4] }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: spacing[3],
              marginBottom: spacing[3]
            }}>
              <div style={{ 
                width: '48px', 
                height: '48px', 
                borderRadius: '50%',
                backgroundColor: colors.neutral[100],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: typography.fontSize.xl
              }}>
                {post.author.avatar}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ 
                  fontSize: typography.fontSize.base,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.neutral[900],
                  marginBottom: spacing[1]
                }}>
                  {post.author.name}
                </div>
                <div style={{ 
                  fontSize: typography.fontSize.sm,
                  color: colors.neutral[600],
                  marginBottom: spacing[1]
                }}>
                  {post.author.team} • {post.timestamp}
                </div>
              </div>
              <AnimatedButton variant="ghost" size="sm">
                ⋯
              </AnimatedButton>
            </div>

            <h3 style={{ 
              fontSize: typography.fontSize.lg,
              fontWeight: typography.fontWeight.semibold,
              color: colors.neutral[900],
              marginBottom: spacing[2]
            }}>
              {post.title}
            </h3>

            <p style={{ 
              fontSize: typography.fontSize.base,
              color: colors.neutral[700],
              lineHeight: 1.6,
              marginBottom: spacing[3]
            }}>
              {post.content}
            </p>

            {post.image && (
              <div style={{ 
                width: '100%',
                height: '300px',
                borderRadius: borderRadius.lg,
                overflow: 'hidden',
                marginBottom: spacing[3]
              }}>
                <img 
                  src={post.image} 
                  alt={post.title}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover' 
                  }}
                />
              </div>
            )}

            {post.tags.length > 0 && (
              <div style={{ 
                display: 'flex', 
                gap: spacing[2], 
                marginBottom: spacing[3],
                flexWrap: 'wrap'
              }}>
                {post.tags.map((tag, index) => (
                  <span key={index} style={{
                    fontSize: typography.fontSize.xs,
                    padding: `${spacing[1]} ${spacing[2]}`,
                    borderRadius: borderRadius.full,
                    backgroundColor: colors.primary[100],
                    color: colors.primary[700],
                    fontWeight: typography.fontWeight.medium
                  }}>
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              paddingTop: spacing[3],
              borderTop: `1px solid ${colors.neutral[200]}`
            }}>
              <div style={{ display: 'flex', gap: spacing[4] }}>
                <AnimatedButton
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLike(post.id)}
                  style={{ 
                    color: post.liked ? colors.error[600] : colors.neutral[600],
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing[1]
                  }}
                >
                  {post.liked ? '❤️' : '🤍'} {post.likes}
                </AnimatedButton>
                <AnimatedButton variant="ghost" size="sm" style={{ 
                  color: colors.neutral[600],
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing[1]
                }}>
                  💬 {post.comments}
                </AnimatedButton>
                <AnimatedButton variant="ghost" size="sm" style={{ 
                  color: colors.neutral[600],
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing[1]
                }}>
                  🔄 {post.shares}
                </AnimatedButton>
              </div>
              <AnimatedButton variant="ghost" size="sm" style={{ color: colors.neutral[600] }}>
                🔖
              </AnimatedButton>
            </div>
          </div>
        </AnimatedCard>
      ))}
    </div>
  );

  // Render teams directory
  const renderTeams = () => (
    <div style={{ display: 'grid', gap: spacing[6] }}>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: spacing[4]
      }}>
        {teams.map((team) => (
          <AnimatedCard key={team.id}>
            <div style={{ textAlign: 'center', marginBottom: spacing[4] }}>
              <div style={{ 
                fontSize: typography.fontSize['4xl'],
                marginBottom: spacing[2]
              }}>
                {team.avatar}
              </div>
              <h3 style={{ 
                fontSize: typography.fontSize.lg,
                fontWeight: typography.fontWeight.semibold,
                color: colors.neutral[900],
                marginBottom: spacing[1]
              }}>
                {team.name}
              </h3>
              <div style={{ 
                fontSize: typography.fontSize.sm,
                color: colors.neutral[600],
                marginBottom: spacing[3]
              }}>
                {team.sport}
              </div>
            </div>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: spacing[3],
              marginBottom: spacing[4]
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  fontSize: typography.fontSize.xl,
                  fontWeight: typography.fontWeight.bold,
                  color: colors.primary[600]
                }}>
                  {team.members}
                </div>
                <div style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>
                  Members
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  fontSize: typography.fontSize.xl,
                  fontWeight: typography.fontWeight.bold,
                  color: colors.success[600]
                }}>
                  {team.posts}
                </div>
                <div style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>
                  Posts
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: spacing[2] }}>
              <AnimatedButton variant="primary" size="sm" style={{ flex: 1 }}>
                Follow
              </AnimatedButton>
              <AnimatedButton variant="ghost" size="sm" style={{ flex: 1 }}>
                View
              </AnimatedButton>
            </div>
          </AnimatedCard>
        ))}
      </div>
    </div>
  );

  // Render events
  const renderEvents = () => (
    <div style={{ display: 'grid', gap: spacing[6] }}>
      {events.map((event) => (
        <AnimatedCard key={event.id}>
          <div style={{ 
            display: 'flex', 
            gap: spacing[4],
            alignItems: 'flex-start'
          }}>
            <div style={{
              minWidth: '80px',
              padding: spacing[3],
              backgroundColor: colors.primary[100],
              borderRadius: borderRadius.lg,
              textAlign: 'center'
            }}>
              <div style={{ 
                fontSize: typography.fontSize.xs,
                color: colors.primary[700],
                fontWeight: typography.fontWeight.semibold,
                marginBottom: spacing[1]
              }}>
                {new Date(event.date).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
              </div>
              <div style={{ 
                fontSize: typography.fontSize.xl,
                fontWeight: typography.fontWeight.bold,
                color: colors.primary[900]
              }}>
                {new Date(event.date).getDate()}
              </div>
            </div>
            
            <div style={{ flex: 1 }}>
              <h3 style={{ 
                fontSize: typography.fontSize.lg,
                fontWeight: typography.fontWeight.semibold,
                color: colors.neutral[900],
                marginBottom: spacing[2]
              }}>
                {event.title}
              </h3>
              
              <div style={{ 
                fontSize: typography.fontSize.sm,
                color: colors.neutral[600],
                marginBottom: spacing[2]
              }}>
                📍 {event.location} • 👥 {event.attendees} attending
              </div>
              
              <p style={{ 
                fontSize: typography.fontSize.base,
                color: colors.neutral[700],
                lineHeight: 1.5,
                marginBottom: spacing[3]
              }}>
                {event.description}
              </p>
              
              <div style={{ display: 'flex', gap: spacing[2] }}>
                <AnimatedButton variant="primary" size="sm">
                  Register
                </AnimatedButton>
                <AnimatedButton variant="ghost" size="sm">
                  Learn More
                </AnimatedButton>
                <span style={{
                  fontSize: typography.fontSize.xs,
                  padding: `${spacing[1]} ${spacing[2]}`,
                  borderRadius: borderRadius.full,
                  backgroundColor: 
                    event.type === 'conference' ? colors.neutral[100] :
                    event.type === 'tournament' ? colors.success[100] :
                    colors.warning[100],
                  color: 
                    event.type === 'conference' ? colors.neutral[700] :
                    event.type === 'tournament' ? colors.success[700] :
                    colors.warning[700],
                  fontWeight: typography.fontWeight.medium,
                  textTransform: 'capitalize'
                }}>
                  {event.type}
                </span>
              </div>
            </div>
          </div>
        </AnimatedCard>
      ))}
    </div>
  );

  // Render network
  const renderNetwork = () => (
    <div style={{ display: 'grid', gap: spacing[6] }}>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: spacing[6]
      }}>
        {/* Followers */}
        <div>
          <h3 style={{ 
            fontSize: typography.fontSize.xl,
            fontWeight: typography.fontWeight.bold,
            color: colors.neutral[900],
            marginBottom: spacing[4]
          }}>
            Followers ({followers.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[3] }}>
            {followers.map((follower) => (
              <div key={follower.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing[3],
                padding: spacing[3],
                backgroundColor: colors.neutral[50],
                borderRadius: borderRadius.lg
              }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '50%',
                  backgroundColor: colors.neutral[100],
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: typography.fontSize.lg
                }}>
                  {follower.avatar}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    fontSize: typography.fontSize.base,
                    fontWeight: typography.fontWeight.semibold,
                    color: colors.neutral[900],
                    marginBottom: spacing[1]
                  }}>
                    {follower.name}
                  </div>
                  <div style={{ 
                    fontSize: typography.fontSize.sm,
                    color: colors.neutral[600]
                  }}>
                    {follower.team}
                  </div>
                </div>
                {follower.mutual && (
                  <span style={{
                    fontSize: typography.fontSize.xs,
                    padding: `${spacing[1]} ${spacing[2]}`,
                    borderRadius: borderRadius.full,
                    backgroundColor: colors.success[100],
                    color: colors.success[700],
                    fontWeight: typography.fontWeight.medium
                  }}>
                    Mutual
                  </span>
                )}
                <AnimatedButton variant="ghost" size="sm">
                  Follow Back
                </AnimatedButton>
              </div>
            ))}
          </div>
        </div>

        {/* Following */}
        <div>
          <h3 style={{ 
            fontSize: typography.fontSize.xl,
            fontWeight: typography.fontWeight.bold,
            color: colors.neutral[900],
            marginBottom: spacing[4]
          }}>
            Following ({following.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[3] }}>
            {following.map((followingUser) => (
              <div key={followingUser.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing[3],
                padding: spacing[3],
                backgroundColor: colors.neutral[50],
                borderRadius: borderRadius.lg
              }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '50%',
                  backgroundColor: colors.neutral[100],
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: typography.fontSize.lg
                }}>
                  {followingUser.avatar}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    fontSize: typography.fontSize.base,
                    fontWeight: typography.fontWeight.semibold,
                    color: colors.neutral[900],
                    marginBottom: spacing[1]
                  }}>
                    {followingUser.name}
                  </div>
                  <div style={{ 
                    fontSize: typography.fontSize.sm,
                    color: colors.neutral[600]
                  }}>
                    {followingUser.team} • {followingUser.posts} posts
                  </div>
                </div>
                <AnimatedButton variant="ghost" size="sm" style={{ color: colors.error[600] }}>
                  Unfollow
                </AnimatedButton>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Render create post modal
  const renderCreatePostModal = () => {
    if (!showCreatePost) return null;

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
      onClick={() => setShowCreatePost(false)}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: borderRadius.xl,
          padding: spacing[6],
          maxWidth: '600px',
          width: '100%'
        }}
        onClick={(e) => e.stopPropagation()}>
          <h3 style={{ 
            fontSize: typography.fontSize.xl,
            fontWeight: typography.fontWeight.bold,
            color: colors.neutral[900],
            marginBottom: spacing[4]
          }}>
            Create Post
          </h3>
          
          <div style={{ marginBottom: spacing[4] }}>
            <input
              type="text"
              placeholder="Post title..."
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              style={{
                width: '100%',
                padding: spacing[3],
                border: `1px solid ${colors.neutral[300]}`,
                borderRadius: borderRadius.lg,
                fontSize: typography.fontSize.base,
                marginBottom: spacing[3]
              }}
            />
            
            <textarea
              placeholder="Share your thoughts..."
              value={newPost.content}
              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              style={{
                width: '100%',
                minHeight: '120px',
                padding: spacing[3],
                border: `1px solid ${colors.neutral[300]}`,
                borderRadius: borderRadius.lg,
                fontSize: typography.fontSize.base,
                resize: 'vertical'
              }}
            />
          </div>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center'
          }}>
            <input
              type="text"
              placeholder="Add tags (comma separated)..."
              value={newPost.tags.join(', ')}
              onChange={(e) => setNewPost({ 
                ...newPost, 
                tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
              })}
              style={{
                flex: 1,
                padding: spacing[2],
                border: `1px solid ${colors.neutral[300]}`,
                borderRadius: borderRadius.lg,
                fontSize: typography.fontSize.sm,
                marginRight: spacing[3]
              }}
            />
            
            <div style={{ display: 'flex', gap: spacing[2] }}>
              <AnimatedButton
                variant="ghost"
                onClick={() => setShowCreatePost(false)}
              >
                Cancel
              </AnimatedButton>
              <AnimatedButton
                variant="primary"
                onClick={handleCreatePost}
              >
                Post
              </AnimatedButton>
            </div>
          </div>
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
          Loading community hub...
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
          🌐 Community Hub
        </h1>
        <p style={{ 
          fontSize: typography.fontSize.lg, 
          color: colors.neutral[600],
          marginBottom: spacing[6]
        }}>
          Connect with coaches, share insights, and grow together
        </p>
      </div>

      {/* Tab Navigation */}
      <div style={{ 
        display: 'flex', 
        gap: spacing[2], 
        justifyContent: 'center',
        marginBottom: spacing[8],
        flexWrap: 'wrap'
      }}>
        <AnimatedButton
          variant={activeSection === 'feed' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setActiveSection('feed')}
          style={{
            borderRadius: borderRadius.lg,
            padding: `${spacing[3]} ${spacing[4]}`
          }}
        >
          📰 Feed
        </AnimatedButton>
        <AnimatedButton
          variant={activeSection === 'teams' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setActiveSection('teams')}
          style={{
            borderRadius: borderRadius.lg,
            padding: `${spacing[3]} ${spacing[4]}`
          }}
        >
          🏟️ Teams
        </AnimatedButton>
        <AnimatedButton
          variant={activeSection === 'events' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setActiveSection('events')}
          style={{
            borderRadius: borderRadius.lg,
            padding: `${spacing[3]} ${spacing[4]}`
          }}
        >
          📅 Events
        </AnimatedButton>
        <AnimatedButton
          variant={activeSection === 'network' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setActiveSection('network')}
          style={{
            borderRadius: borderRadius.lg,
            padding: `${spacing[3]} ${spacing[4]}`
          }}
        >
          👥 Network
        </AnimatedButton>
      </div>

      {/* Content */}
      {activeSection === 'feed' && renderFeed()}
      {activeSection === 'teams' && renderTeams()}
      {activeSection === 'events' && renderEvents()}
      {activeSection === 'network' && renderNetwork()}

      {/* Create Post Modal */}
      {renderCreatePostModal()}
    </div>
  );
};

export default CommunityHub;
