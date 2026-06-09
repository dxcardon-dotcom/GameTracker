# GameTracker Competitive Research Roadmap

Checkpoint created before this research:

- `versions/gametracker-checkpoint-2026-06-05-gamechanger-research.tar.gz`

This document translates public GameChanger help-center workflows into a GameTracker build plan. Do not copy their UI or wording directly. Use these as product patterns and build our own baseball-first experience.

## Public Pages Reviewed

- GameChanger Help Center: https://help.gc.com/hc/en-us
- Creating Your Team: https://help.gc.com/hc/en-us/articles/115005448866-Creating-Your-Team
- Getting Started as a Coach: https://help.gc.com/hc/en-us/articles/32554750828301-Getting-Started-as-a-Coach
- Adding Players: https://help.gc.com/hc/en-us/articles/115005444183-Adding-Players
- Scorekeeping and Stats: https://help.gc.com/hc/en-us/articles/360039839812-Scorekeeping-and-Stats
- Basic Scorekeeping: https://help.gc.com/hc/en-us/articles/30710418133005-Basic-Scorekeeping
- Starting Lineups: https://help.gc.com/hc/en-us/articles/360033202792-Starting-Lineups
- Share Starting Lineups for Baseball & Softball: https://help.gc.com/hc/en-us/articles/25102463562509-Share-Starting-Lineups-for-Baseball-Softball
- Adding Extra Fielders and Batters: https://help.gc.com/hc/en-us/articles/360031204651-Adding-Extra-Fielders-and-Batters
- Viewing a GameStream: https://help.gc.com/hc/en-us/articles/360039865532-Viewing-a-GameStream
- Viewing a Live Video Stream: https://help.gc.com/hc/en-us/articles/360057524931-Viewing-a-Live-Video-Stream

## Product Lessons

### 1. Team Setup Comes First

GameChanger's create-team flow captures sport, team type, age/level, location, team name, and season. After the team is created, the coach is moved toward schedule and roster setup.

GameTracker build:

- Add a guided Team Setup Hub.
- Required fields: sport, team type, level, location, name, season, visibility.
- Show setup completion status.
- Let coaches create additional teams later.
- Store this cleanly on the team and season records.

### 2. Coach Onboarding Should Feel Like A Season Checklist

The coach guide emphasizes creating the team, adding roster, adding staff, inviting family/community, scheduling events, and then running game day.

GameTracker build:

- Add a Season Launch Checklist:
  - Team profile complete
  - Roster imported
  - Staff invited
  - Family/fan access configured
  - Schedule created
  - First game lineup ready
  - Live scoring tested
- Put this on the main coach dashboard.

### 3. Roster Is More Than Names

The player flow centers on player name, jersey number, family members, and staff-only editing.

GameTracker build:

- Build a real Roster Manager.
- Player fields: first name, last name, jersey, position, throws/bats, class year, family contacts, recruiting profile flag.
- Add bulk import and single-player add.
- Add family/fan invitations later.
- Keep edit permissions staff-only.

### 4. Lineups Need Their Own Pre-Game Workflow

Starting lineups can be created from game details, reused from a previous game, exported as a lineup card, shared by QR code, and locked once scoring begins.

GameTracker build:

- Create a Lineup Builder before each game.
- Allow drag/drop batting order.
- Assign defensive positions.
- Support EH, DH, DP/FLEX later.
- Add "Use Previous Lineup".
- Lock lineup once first pitch is recorded.
- Add printable lineup card.
- Add share/import lineup later with QR or code link.

### 5. Scorekeeping Is A Guided Flow, Not Just Buttons

Basic scorekeeping uses lineups, common pitch results below the field, a Pitch menu for less common outcomes, automatic walk/strikeout behavior, Ball In Play, outcome selection, and ball-location tracking.

GameTracker build:

- Keep our new GameChanger-style scoring panel.
- Add a field map for hit location and spray chart data.
- Add "common" versus "advanced" scoring controls.
- Add undo/edit play.
- Add automatic lineup advancement.
- Add automatic ball/walk and strikeout behavior.
- Add runner advancement confirmation after ball in play.

### 6. Live GameStream Is The Fan Product

GameStream is separate from live video. It gives fans live play updates, stats, scores, and game status. Fans access it from notifications, home live badge, schedule live event, or team search.

GameTracker build:

- Build a public Fan GameStream page.
- Include scoreboard, inning, count, outs, bases, play-by-play, player highlights, and game status.
- Add public team search later.
- Add "LIVE" badge on schedule rows.
- Add staff-only spray charts.

### 7. Video Is A Separate Media Layer

Live video access can be controlled by audience level. Streams are discoverable from notifications, schedule, home tab, team video tab, and archives.

GameTracker build:

- Add media layer after scorekeeping is reliable.
- Start with video upload/archive, not live streaming.
- Later add live stream access levels:
  - Staff only
  - Players and family
  - Public
- Link highlights to plays and player profiles.

## Recommended Build Order

### Phase 1: Foundation We Should Finish Now

1. Team Setup Hub
2. Roster Manager
3. Schedule/Game Details
4. Lineup Builder
5. Live Scoring Workflow
6. Play Log Edit/Undo
7. Fan GameStream Page

### Phase 2: Competitive Baseball Features

1. Spray chart and hit location
2. Pitch chart and pitch types
3. Player stat auto-calculation
4. Postgame box score
5. Season leaderboards
6. Printable/exportable lineup card
7. Shared lineup import

### Phase 3: Hudl / MaxPreps / SportsYou Layer

1. Video library
2. Play-linked highlights
3. Player recruiting profiles
4. Public team pages
5. Announcements and team messaging
6. Parent/fan roles
7. Premium subscription controls

## Immediate Next Implementation

Finish the visible Team Setup Hub that was started from the Creating Your Team article:

- Show fields for sport, team type, level, location, team name, season, and visibility.
- Save the profile to Firestore.
- Use the saved team name throughout the scoreboard and fan view.
- Add a setup checklist item for Team profile complete.

