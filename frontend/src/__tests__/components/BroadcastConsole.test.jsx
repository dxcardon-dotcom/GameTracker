import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import BroadcastConsole from '../BroadcastConsole';

// Mock Firebase
jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  onSnapshot: jest.fn(),
}));

// Mock environment variables
const originalEnv = import.meta.env;
beforeEach(() => {
  import.meta.env = {
    ...originalEnv,
    VITE_API_BASE_URL: 'http://localhost:4000',
    VITE_DEFAULT_TEAM_ID: 'test-team-id',
    VITE_DEFAULT_LIVE_GAME_ID: 'test-game-id',
  };
});

afterEach(() => {
  import.meta.env = originalEnv;
});

// Mock user data
const mockUser = {
  uid: 'test-user-123',
  displayName: 'Test User',
  email: 'test@example.com',
};

// Mock team data
const mockTeamData = {
  id: 'test-team-id',
  name: 'Test Rockets',
  sport: 'Baseball',
  logo: 'test-logo.png',
};

// Mock season data
const mockSeasonData = {
  id: '2024-season',
  year: 2024,
  schedule: [
    {
      id: 'game-1',
      date: '2024-06-01',
      opponent: 'Test Opponent',
      location: 'Home',
      result: 'W',
      score: '5-3',
    },
  ],
  roster: [
    {
      id: 'player-1',
      name: 'John Doe',
      number: 1,
      position: 'P',
      avg: 0.300,
      hr: 5,
      rbi: 20,
    },
  ],
};

describe('BroadcastConsole', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock Firebase responses
    doc.mockReturnValue({});
    getDoc.mockResolvedValue({
      exists: true,
      data: () => mockTeamData,
    });
    setDoc.mockResolvedValue({});
  });

  const renderComponent = (props = {}) => {
    return render(
      <BrowserRouter>
        <BroadcastConsole
          user={mockUser}
          team={mockTeamData}
          {...props}
        />
      </BrowserRouter>
    );
  };

  describe('Component Rendering', () => {
    it('renders without crashing', () => {
      expect(() => renderComponent()).not.toThrow();
    });

    it('displays the correct team name', () => {
      renderComponent();
      expect(screen.getByText('Test Rockets')).toBeInTheDocument();
    });

    it('shows all navigation tabs', () => {
      renderComponent();
      
      const tabs = [
        'live-game',
        'team',
        'schedule',
        'stats',
        'dashboard',
        'ai-insights',
        'admin',
        'gamification',
        'security',
        'leaderboard',
        'analytics',
        'team-chat',
        'tournaments',
        'live-stream',
        'upgrade',
      ];

      tabs.forEach(tab => {
        expect(screen.getByTestId(`tab-${tab}`)).toBeInTheDocument();
      });
    });
  });

  describe('Tab Navigation', () => {
    it('switches to team tab when clicked', () => {
      renderComponent();
      
      const teamTab = screen.getByTestId('tab-team');
      fireEvent.click(teamTab);
      
      expect(screen.getByText('Team Roster')).toBeInTheDocument();
    });

    it('switches to schedule tab when clicked', () => {
      renderComponent();
      
      const scheduleTab = screen.getByTestId('tab-schedule');
      fireEvent.click(scheduleTab);
      
      expect(screen.getByText('Game Schedule')).toBeInTheDocument();
    });

    it('switches to stats tab when clicked', () => {
      renderComponent();
      
      const statsTab = screen.getByTestId('tab-stats');
      fireEvent.click(statsTab);
      
      expect(screen.getByText('Team Statistics')).toBeInTheDocument();
    });

    it('switches to dashboard tab when clicked', () => {
      renderComponent();
      
      const dashboardTab = screen.getByTestId('tab-dashboard');
      fireEvent.click(dashboardTab);
      
      expect(screen.getByText('📊 Dashboard')).toBeInTheDocument();
    });

    it('switches to AI insights tab when clicked', () => {
      renderComponent();
      
      const aiTab = screen.getByTestId('tab-ai-insights');
      fireEvent.click(aiTab);
      
      expect(screen.getByText('🤖 AI-Powered Insights')).toBeInTheDocument();
    });

    it('switches to admin tab when clicked', () => {
      renderComponent();
      
      const adminTab = screen.getByTestId('tab-admin');
      fireEvent.click(adminTab);
      
      expect(screen.getByText('🛠️ Admin Dashboard')).toBeInTheDocument();
    });

    it('switches to gamification tab when clicked', () => {
      renderComponent();
      
      const gamificationTab = screen.getByTestId('tab-gamification');
      fireEvent.click(gamificationTab);
      
      expect(screen.getByText('🎮 Gamification & Achievements')).toBeInTheDocument();
    });

    it('switches to security tab when clicked', () => {
      renderComponent();
      
      const securityTab = screen.getByTestId('tab-security');
      fireEvent.click(securityTab);
      
      expect(screen.getByText('🔒 Security Center')).toBeInTheDocument();
    });
  });

  describe('Live Game Tab', () => {
    it('displays live game interface', () => {
      renderComponent();
      
      expect(screen.getByText('Live Game Scoring')).toBeInTheDocument();
      expect(screen.getByText('Start Game')).toBeInTheDocument();
    });

    it('shows real-time collaboration component', () => {
      renderComponent();
      
      expect(screen.getByTestId('real-time-collaboration')).toBeInTheDocument();
    });

    it('starts game when start button is clicked', async () => {
      renderComponent();
      
      const startButton = screen.getByText('Start Game');
      fireEvent.click(startButton);
      
      await waitFor(() => {
        expect(screen.getByText('Game in Progress')).toBeInTheDocument();
      });
    });
  });

  describe('Team Tab', () => {
    it('displays team roster', () => {
      renderComponent();
      
      fireEvent.click(screen.getByTestId('tab-team'));
      
      expect(screen.getByText('Team Roster')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('shows player statistics', () => {
      renderComponent();
      
      fireEvent.click(screen.getByTestId('tab-team'));
      
      expect(screen.getByText('.300')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument(); // HR
      expect(screen.getByText('20')).toBeInTheDocument(); // RBI
    });
  });

  describe('Schedule Tab', () => {
    it('displays game schedule', () => {
      renderComponent();
      
      fireEvent.click(screen.getByTestId('tab-schedule'));
      
      expect(screen.getByText('Game Schedule')).toBeInTheDocument();
      expect(screen.getByText('Test Opponent')).toBeInTheDocument();
      expect(screen.getByText('W')).toBeInTheDocument();
      expect(screen.getByText('5-3')).toBeInTheDocument();
    });
  });

  describe('Stats Tab', () => {
    it('displays team statistics', () => {
      renderComponent();
      
      fireEvent.click(screen.getByTestId('tab-stats'));
      
      expect(screen.getByText('Team Statistics')).toBeInTheDocument();
    });
  });

  describe('Dashboard Tab', () => {
    it('displays modern dashboard', () => {
      renderComponent();
      
      fireEvent.click(screen.getByTestId('tab-dashboard'));
      
      expect(screen.getByText('📊 Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Team Performance')).toBeInTheDocument();
    });
  });

  describe('AI Insights Tab', () => {
    it('displays AI insights', () => {
      renderComponent();
      
      fireEvent.click(screen.getByTestId('tab-ai-insights'));
      
      expect(screen.getByText('🤖 AI-Powered Insights')).toBeInTheDocument();
      expect(screen.getByText('🔥 Hot Hitters')).toBeInTheDocument();
    });
  });

  describe('Admin Tab', () => {
    it('displays admin dashboard', () => {
      renderComponent();
      
      fireEvent.click(screen.getByTestId('tab-admin'));
      
      expect(screen.getByText('🛠️ Admin Dashboard')).toBeInTheDocument();
      expect(screen.getByText('📊 Overview')).toBeInTheDocument();
    });
  });

  describe('Gamification Tab', () => {
    it('displays gamification system', () => {
      renderComponent();
      
      fireEvent.click(screen.getByTestId('tab-gamification'));
      
      expect(screen.getByText('🎮 Gamification & Achievements')).toBeInTheDocument();
      expect(screen.getByText('Level 1')).toBeInTheDocument();
    });
  });

  describe('Security Tab', () => {
    it('displays security center', () => {
      renderComponent();
      
      fireEvent.click(screen.getByTestId('tab-security'));
      
      expect(screen.getByText('🔒 Security Center')).toBeInTheDocument();
      expect(screen.getByText('📊 Overview')).toBeInTheDocument();
    });
  });

  describe('User Authentication', () => {
    it('shows login form when user is not authenticated', () => {
      renderComponent({ user: null });
      
      expect(screen.getByText('Login')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Password')).toBeInTheDocument();
    });

    it('hides login form when user is authenticated', () => {
      renderComponent({ user: mockUser });
      
      expect(screen.queryByText('Login')).not.toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('renders correctly on mobile viewport', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
      
      renderComponent();
      
      expect(screen.getByText('Test Rockets')).toBeInTheDocument();
    });

    it('renders correctly on tablet viewport', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });
      
      renderComponent();
      
      expect(screen.getByText('Test Rockets')).toBeInTheDocument();
    });

    it('renders correctly on desktop viewport', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });
      
      renderComponent();
      
      expect(screen.getByText('Test Rockets')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('handles Firebase errors gracefully', async () => {
      getDoc.mockRejectedValue(new Error('Firebase error'));
      
      renderComponent();
      
      await waitFor(() => {
        expect(screen.getByText(/Error loading team data/)).toBeInTheDocument();
      });
    });

    it('handles network errors gracefully', async () => {
      // Mock network error
      global.fetch = jest.fn(() =>
        Promise.reject(new Error('Network error'))
      );
      
      renderComponent();
      
      await waitFor(() => {
        expect(screen.getByText(/Network error/)).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels', () => {
      renderComponent();
      
      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('supports keyboard navigation', () => {
      renderComponent();
      
      const firstTab = screen.getByTestId('tab-live-game');
      firstTab.focus();
      
      expect(firstTab).toHaveFocus();
      
      fireEvent.keyDown(firstTab, { key: 'ArrowRight' });
      
      // Check that focus moved to next tab
      expect(screen.getByTestId('tab-team')).toHaveFocus();
    });
  });

  describe('Performance', () => {
    it('renders within performance budget', async () => {
      const startTime = performance.now();
      
      renderComponent();
      
      await waitFor(() => {
        expect(screen.getByText('Test Rockets')).toBeInTheDocument();
      });
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // Should render within 2 seconds
      expect(renderTime).toBeLessThan(2000);
    });
  });

  describe('Integration Tests', () => {
    it('integrates with all components correctly', () => {
      renderComponent();
      
      // Test that all major components are present
      expect(screen.getByTestId('notification-system')).toBeInTheDocument();
      expect(screen.getByTestId('real-time-collaboration')).toBeInTheDocument();
      
      // Test tab switching
      fireEvent.click(screen.getByTestId('tab-dashboard'));
      expect(screen.getByTestId('modern-dashboard')).toBeInTheDocument();
      
      fireEvent.click(screen.getByTestId('tab-ai-insights'));
      expect(screen.getByTestId('ai-insights')).toBeInTheDocument();
      
      fireEvent.click(screen.getByTestId('tab-admin'));
      expect(screen.getByTestId('admin-dashboard')).toBeInTheDocument();
      
      fireEvent.click(screen.getByTestId('tab-gamification'));
      expect(screen.getByTestId('gamification-system')).toBeInTheDocument();
      
      fireEvent.click(screen.getByTestId('tab-security'));
      expect(screen.getByTestId('security-center')).toBeInTheDocument();
    });
  });
});
