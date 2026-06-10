const { test, expect } = require('@playwright/test');

test.describe('GameTracker E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Set up test environment variables
    await page.goto('http://localhost:5173');
  });

  test.describe('Authentication', () => {
    test('should allow user to login', async ({ page }) => {
      await page.goto('http://localhost:5173/login');
      
      // Fill in login form
      await page.fill('input[type="email"]', 'test@example.com');
      await page.fill('input[type="password"]', 'password123');
      await page.click('button[type="submit"]');
      
      // Should redirect to dashboard
      await expect(page).toHaveURL(/.*dashboard/);
      await expect(page.locator('h1')).toContainText('GameTracker');
    });

    test('should show error for invalid credentials', async ({ page }) => {
      await page.goto('http://localhost:5173/login');
      
      // Fill in invalid credentials
      await page.fill('input[type="email"]', 'invalid@example.com');
      await page.fill('input[type="password"]', 'wrongpassword');
      await page.click('button[type="submit"]');
      
      // Should show error message
      await expect(page.locator('.error-message')).toBeVisible();
      await expect(page.locator('.error-message')).toContainText('Invalid credentials');
    });
  });

  test.describe('Navigation', () => {
    test.beforeEach(async ({ page }) => {
      // Login before each test
      await page.goto('http://localhost:5173/login');
      await page.fill('input[type="email"]', 'test@example.com');
      await page.fill('input[type="password"]', 'password123');
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*dashboard/);
    });

    test('should navigate between tabs correctly', async ({ page }) => {
      // Test Live Game tab
      await page.click('[data-testid="tab-live-game"]');
      await expect(page.locator('h2')).toContainText('Live Game Scoring');
      
      // Test Team tab
      await page.click('[data-testid="tab-team"]');
      await expect(page.locator('h2')).toContainText('Team Roster');
      
      // Test Schedule tab
      await page.click('[data-testid="tab-schedule"]');
      await expect(page.locator('h2')).toContainText('Game Schedule');
      
      // Test Stats tab
      await page.click('[data-testid="tab-stats"]');
      await expect(page.locator('h2')).toContainText('Team Statistics');
      
      // Test Dashboard tab
      await page.click('[data-testid="tab-dashboard"]');
      await expect(page.locator('h2')).toContainText('Dashboard');
      
      // Test AI Insights tab
      await page.click('[data-testid="tab-ai-insights"]');
      await expect(page.locator('h2')).toContainText('AI-Powered Insights');
      
      // Test Admin tab
      await page.click('[data-testid="tab-admin"]');
      await expect(page.locator('h2')).toContainText('Admin Dashboard');
      
      // Test Gamification tab
      await page.click('[data-testid="tab-gamification"]');
      await expect(page.locator('h2')).toContainText('Gamification & Achievements');
      
      // Test Security tab
      await page.click('[data-testid="tab-security"]');
      await expect(page.locator('h2')).toContainText('Security Center');
    });

    test('should highlight active tab', async ({ page }) => {
      await page.click('[data-testid="tab-team"]');
      
      const teamTab = page.locator('[data-testid="tab-team"]');
      await expect(teamTab).toHaveClass(/active/);
    });
  });

  test.describe('Live Game Scoring', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('http://localhost:5173/login');
      await page.fill('input[type="email"]', 'test@example.com');
      await page.fill('input[type="password"]', 'password123');
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*dashboard/);
      await page.click('[data-testid="tab-live-game"]');
    });

    test('should start a new game', async ({ page }) => {
      await page.click('button:has-text("Start Game")');
      
      // Should show game controls
      await expect(page.locator('[data-testid="game-controls"]')).toBeVisible();
      await expect(page.locator('button:has-text("End Game")')).toBeVisible();
    });

    test('should record pitch results', async ({ page }) => {
      await page.click('button:has-text("Start Game")');
      
      // Record a strike
      await page.click('button:has-text("Strike")');
      await expect(page.locator('[data-testid="pitch-count"]')).toContainText('1-0');
      
      // Record a ball
      await page.click('button:has-text("Ball")');
      await expect(page.locator('[data-testid="pitch-count"]')).toContainText('1-1');
    });

    test('should record at-bat results', async ({ page }) => {
      await page.click('button:has-text("Start Game")');
      
      // Record a hit
      await page.click('button:has-text("Single")');
      await expect(page.locator('[data-testid="at-bat-result"]')).toContainText('Single');
    });

    test('should show real-time collaboration', async ({ page }) => {
      await page.click('button:has-text("Start Game")');
      
      // Should show collaboration panel
      await expect(page.locator('[data-testid="real-time-collaboration"]')).toBeVisible();
      await expect(page.locator('[data-testid="active-users"]')).toBeVisible();
    });
  });

  test.describe('Team Management', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('http://localhost:5173/login');
      await page.fill('input[type="email"]', 'test@example.com');
      await page.fill('input[type="password"]', 'password123');
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*dashboard/);
      await page.click('[data-testid="tab-team"]');
    });

    test('should display team roster', async ({ page }) => {
      await expect(page.locator('[data-testid="team-roster"]')).toBeVisible();
      await expect(page.locator('[data-testid="player-list"]')).toBeVisible();
    });

    test('should add new player', async ({ page }) => {
      await page.click('button:has-text("Add Player")');
      
      // Fill in player details
      await page.fill('input[name="name"]', 'John Doe');
      await page.fill('input[name="number"]', '42');
      await page.selectOption('select[name="position"]', 'P');
      
      await page.click('button:has-text("Save")');
      
      // Should show new player in roster
      await expect(page.locator('text=John Doe')).toBeVisible();
      await expect(page.locator('text=42')).toBeVisible();
    });

    test('should edit player information', async ({ page }) => {
      await page.click('[data-testid="player-1"] button:has-text("Edit")');
      
      // Edit player details
      await page.fill('input[name="name"]', 'Jane Doe');
      await page.click('button:has-text("Save")');
      
      // Should show updated player information
      await expect(page.locator('text=Jane Doe')).toBeVisible();
    });

    test('should remove player', async ({ page }) => {
      await page.click('[data-testid="player-1"] button:has-text("Remove")');
      
      // Confirm removal
      await page.click('button:has-text("Confirm")');
      
      // Player should be removed from roster
      await expect(page.locator('[data-testid="player-1"]')).not.toBeVisible();
    });
  });

  test.describe('Schedule Management', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('http://localhost:5173/login');
      await page.fill('input[type="email"]', 'test@example.com');
      await page.fill('input[type="password"]', 'password123');
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*dashboard/);
      await page.click('[data-testid="tab-schedule"]');
    });

    test('should display game schedule', async ({ page }) => {
      await expect(page.locator('[data-testid="game-schedule"]')).toBeVisible();
      await expect(page.locator('[data-testid="game-list"]')).toBeVisible();
    });

    test('should add new game', async ({ page }) => {
      await page.click('button:has-text("Add Game")');
      
      // Fill in game details
      await page.fill('input[name="opponent"]', 'Test Team');
      await page.fill('input[name="date"]', '2024-06-15');
      await page.fill('input[name="time"]', '19:00');
      await page.selectOption('select[name="location"]', 'Home');
      
      await page.click('button:has-text("Save")');
      
      // Should show new game in schedule
      await expect(page.locator('text=Test Team')).toBeVisible();
    });

    test('should edit game details', async ({ page }) => {
      await page.click('[data-testid="game-1"] button:has-text("Edit")');
      
      // Edit game details
      await page.fill('input[name="opponent"]', 'Updated Team');
      await page.click('button:has-text("Save")');
      
      // Should show updated game details
      await expect(page.locator('text=Updated Team')).toBeVisible();
    });
  });

  test.describe('Statistics', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('http://localhost:5173/login');
      await page.fill('input[type="email"]', 'test@example.com');
      await page.fill('input[type="password"]', 'password123');
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*dashboard/);
      await page.click('[data-testid="tab-stats"]');
    });

    test('should display team statistics', async ({ page }) => {
      await expect(page.locator('[data-testid="team-stats"]')).toBeVisible();
      await expect(page.locator('[data-testid="batting-stats"]')).toBeVisible();
      await expect(page.locator('[data-testid="pitching-stats"]')).toBeVisible();
    });

    test('should filter statistics by date range', async ({ page }) => {
      await page.selectOption('select[name="dateRange"]', 'Last 30 Days');
      
      // Should update statistics
      await expect(page.locator('[data-testid="stats-summary"]')).toBeVisible();
    });
  });

  test.describe('AI Insights', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('http://localhost:5173/login');
      await page.fill('input[type="email"]', 'test@example.com');
      await page.fill('input[type="password"]', 'password123');
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*dashboard/);
      await page.click('[data-testid="tab-ai-insights"]');
    });

    test('should display AI-powered insights', async ({ page }) => {
      await expect(page.locator('[data-testid="ai-insights"]')).toBeVisible();
      await expect(page.locator('[data-testid="performance-insights"]')).toBeVisible();
      await expect(page.locator('[data-testid="predictions"]')).toBeVisible();
    });

    test('should show detailed insight when clicked', async ({ page }) => {
      await page.click('[data-testid="insight-1"]');
      
      // Should show insight modal
      await expect(page.locator('[data-testid="insight-modal"]')).toBeVisible();
    });
  });

  test.describe('Admin Dashboard', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('http://localhost:5173/login');
      await page.fill('input[type="email"]', 'admin@example.com');
      await page.fill('input[type="password"]', 'adminpassword');
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*dashboard/);
      await page.click('[data-testid="tab-admin"]');
    });

    test('should display admin dashboard', async ({ page }) => {
      await expect(page.locator('[data-testid="admin-dashboard"]')).toBeVisible();
      await expect(page.locator('[data-testid="user-management"]')).toBeVisible();
      await expect(page.locator('[data-testid="revenue-analytics"]')).toBeVisible();
    });

    test('should manage users', async ({ page }) => {
      await page.click('[data-testid="user-management"]');
      
      // Should show user list
      await expect(page.locator('[data-testid="user-list"]')).toBeVisible();
      
      // Test user actions
      await page.click('[data-testid="user-1"] button:has-text("Edit")');
      await expect(page.locator('[data-testid="user-edit-modal"]')).toBeVisible();
    });
  });

  test.describe('Gamification', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('http://localhost:5173/login');
      await page.fill('input[type="email"]', 'test@example.com');
      await page.fill('input[type="password"]', 'password123');
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*dashboard/);
      await page.click('[data-testid="tab-gamification"]');
    });

    test('should display gamification system', async ({ page }) => {
      await expect(page.locator('[data-testid="gamification-system"]')).toBeVisible();
      await expect(page.locator('[data-testid="level-progress"]')).toBeVisible();
      await expect(page.locator('[data-testid="achievements"]')).toBeVisible();
    });

    test('should show leaderboard', async ({ page }) => {
      await page.click('[data-testid="leaderboard-tab"]');
      
      await expect(page.locator('[data-testid="leaderboard"]')).toBeVisible();
      await expect(page.locator('[data-testid="rank-list"]')).toBeVisible();
    });

    test('should unlock achievement', async ({ page }) => {
      await page.click('[data-testid="achievement-1"]');
      
      // Should show achievement details
      await expect(page.locator('[data-testid="achievement-modal"]')).toBeVisible();
    });
  });

  test.describe('Security Center', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('http://localhost:5173/login');
      await page.fill('input[type="email"]', 'test@example.com');
      await page.fill('input[type="password"]', 'password123');
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*dashboard/);
      await page.click('[data-testid="tab-security"]');
    });

    test('should display security center', async ({ page }) => {
      await expect(page.locator('[data-testid="security-center"]')).toBeVisible();
      await expect(page.locator('[data-testid="security-score"]')).toBeVisible();
      await expect(page.locator('[data-testid="audit-logs"]')).toBeVisible();
    });

    test('should enable 2FA', async ({ page }) => {
      await page.click('[data-testid="2fa-tab"]');
      await page.click('button:has-text("Enable 2FA")');
      
      // Should show 2FA setup modal
      await expect(page.locator('[data-testid="2fa-modal"]')).toBeVisible();
    });

    test('should show active sessions', async ({ page }) => {
      await page.click('[data-testid="sessions-tab"]');
      
      await expect(page.locator('[data-testid="active-sessions"]')).toBeVisible();
      await expect(page.locator('[data-testid="session-list"]')).toBeVisible();
    });
  });

  test.describe('Responsive Design', () => {
    const viewports = [
      { name: 'Mobile', width: 375, height: 667 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Desktop', width: 1920, height: 1080 },
    ];

    viewports.forEach(({ name, width, height }) => {
      test(`should work correctly on ${name}`, async ({ page }) => {
        await page.setViewportSize({ width, height });
        
        await page.goto('http://localhost:5173/login');
        await page.fill('input[type="email"]', 'test@example.com');
        await page.fill('input[type="password"]', 'password123');
        await page.click('button[type="submit"]');
        await page.waitForURL(/.*dashboard/);
        
        // Test navigation
        await page.click('[data-testid="tab-team"]');
        await expect(page.locator('h2')).toContainText('Team Roster');
        
        // Test live game
        await page.click('[data-testid="tab-live-game"]');
        await expect(page.locator('h2')).toContainText('Live Game Scoring');
      });
    });
  });

  test.describe('Performance', () => {
    test('should load within performance budget', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto('http://localhost:5173/login');
      await page.fill('input[type="email"]', 'test@example.com');
      await page.fill('input[type="password"]', 'password123');
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*dashboard/);
      
      const loadTime = Date.now() - startTime;
      
      // Should load within 3 seconds
      expect(loadTime).toBeLessThan(3000);
    });

    test('should handle large data sets efficiently', async ({ page }) => {
      await page.goto('http://localhost:5173/login');
      await page.fill('input[type="email"]', 'test@example.com');
      await page.fill('input[type="password"]', 'password123');
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*dashboard/);
      await page.click('[data-testid="tab-stats"]');
      
      // Should handle large statistics data
      await expect(page.locator('[data-testid="team-stats"]')).toBeVisible();
    });
  });

  test.describe('Error Handling', () => {
    test('should handle network errors gracefully', async ({ page }) => {
      // Simulate network offline
      await page.context().setOffline(true);
      
      await page.goto('http://localhost:5173/login');
      await page.fill('input[type="email"]', 'test@example.com');
      await page.fill('input[type="password"]', 'password123');
      await page.click('button[type="submit"]');
      
      // Should show network error message
      await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
      
      // Restore network
      await page.context().setOffline(false);
    });

    test('should handle API errors gracefully', async ({ page }) => {
      // Mock API error
      await page.route('**/api/**', route => {
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Internal Server Error' }),
        });
      });
      
      await page.goto('http://localhost:5173/login');
      await page.fill('input[type="email"]', 'test@example.com');
      await page.fill('input[type="password"]', 'password123');
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*dashboard/);
      await page.click('[data-testid="tab-stats"]');
      
      // Should show error message
      await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    });
  });

  test.describe('Accessibility', () => {
    test('should be keyboard navigable', async ({ page }) => {
      await page.goto('http://localhost:5173/login');
      await page.fill('input[type="email"]', 'test@example.com');
      await page.fill('input[type="password"]', 'password123');
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*dashboard/);
      
      // Test keyboard navigation
      await page.keyboard.press('Tab');
      await expect(page.locator(':focus')).toBeVisible();
      
      // Test tab navigation
      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');
      await expect(page.locator('h2')).toContainText('Team Roster');
    });

    test('should have proper ARIA labels', async ({ page }) => {
      await page.goto('http://localhost:5173/login');
      await page.fill('input[type="email"]', 'test@example.com');
      await page.fill('input[type="password"]', 'password123');
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*dashboard/);
      
      // Check for proper ARIA labels
      await expect(page.locator('[role="navigation"]')).toBeVisible();
      await expect(page.locator('[role="main"]')).toBeVisible();
      await expect(page.locator('[aria-label="Team Roster"]')).toBeVisible();
    });
  });
});
