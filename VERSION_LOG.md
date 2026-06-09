# Version Log

## 2026-06-05 - GameChanger Research Checkpoint

Created a recoverable project snapshot before expanding the GameTracker roadmap from public GameChanger help-center research.

Snapshot:

- `versions/gametracker-checkpoint-2026-06-05-gamechanger-research.tar.gz`

Research document:

- `GAMECHANGER_RESEARCH_ROADMAP.md`

Current direction:

- Finish Team Setup Hub.
- Then build Roster Manager, Schedule/Game Details, Lineup Builder, Live Scoring, Play Log Edit/Undo, and Fan GameStream.

## 2026-06-05 - Team Setup Hub

Added a visible Team Setup Hub modeled from GameChanger's create-team flow.

Fields added:

- Sport
- Team type
- Age / level
- Location
- Team name
- Season
- Visibility

Verification:

- Frontend build passed.
- Preview verified at `http://127.0.0.1:5176/`.

## 2026-06-05 - Roster Manager

Added a visible Roster Manager inside Game Setup.

Fields added:

- First name
- Last name
- Jersey
- Primary position
- Bats
- Throws
- Class year
- Family contact

Actions added:

- Add player
- Edit player
- Remove player
- Clear form
- Expanded bulk import support for position, bats, throws, class, and family contact

Verification:

- Frontend build passed.
- Preview verified at `http://127.0.0.1:5177/`.

## 2026-06-05 - Schedule / Game Details

Added a coach-facing schedule workspace.

Fields added:

- Date
- Start time
- Opponent
- Home / away
- Game type
- Field / location
- Status
- Notes

Actions added:

- Add game
- Edit game
- Remove game
- Load scheduled game into live scoring
- Show scheduled/live/final status in the season schedule

Verification:

- Frontend build passed.
- Preview verified at `http://127.0.0.1:5178/`.

## 2026-06-05 - Lineup Builder

Added a visible Lineup Builder inside Game Setup.

Features added:

- Build lineup from roster
- Use previous lineup
- Save lineup
- Batting order rows
- Defensive position assignment
- Starter / bench / sub status
- Move players up or down
- Remove players from lineup card
- Add available bench players to lineup
- Save current batter and pitcher into the live scorer

Verification:

- Frontend build passed.
- Preview verified at `http://127.0.0.1:5179/`.

## 2026-06-05 - Undo / Edit Play Log

Added a correction-focused play log for live scorekeeping.

Features added:

- Full play log panel
- Undo last play
- Correction note field
- Correct play label
- Restore game state from a saved play snapshot
- Keep correction and undo events in history
- Removed the duplicate Recent Pitches block

Verification:

- Frontend build passed.
- Preview verified at `http://127.0.0.1:5180/`.

## 2026-06-05 - Fan GameStream

Added a read-only fan-facing live game view.

Features added:

- Public `/fan` view for live games
- Public backend stream endpoint for live game state, events, roster, schedule, team profile, and branding
- Live scoreboard with home/away score
- Inning, half-inning, count, outs, pitch count, and batting team
- Base runner diamond
- Batter and pitcher matchup
- Live play feed
- Lineup card
- Player leaders
- Copy share link action
- Fan View shortcut from the coach console

Verification:

- Frontend build passed.
- Backend syntax check passed.
- Browser file preview was blocked by the local-file safety policy, so final browser verification should be done after restarting the normal local dev server.

## 2026-06-05 - Player Profile Pages

Added public, shareable player profile pages.

Features added:

- Public `/player` route
- Player hero with jersey number, name, team, position, bats/throws, and class year
- Hitting stat card
- Pitching stat card
- Fielding stat card
- Recruiting snapshot card
- Placeholder area for future video, highlights, verified metrics, and coach notes
- Copy profile link action
- Player profile links from the Fan GameStream lineup and player leaders
- Profile shortcut from the coach roster manager

Verification:

- Frontend build passed.

## 2026-06-05 - Recruiting Fields and Highlight Links

Added editable recruiting information and video/highlight links to player profiles.

Features added:

- Height
- Weight
- GPA
- Player email
- Player phone
- Recruiting status
- Committed / target school
- NCAA ID
- Coach / recruiting notes
- Main highlight link
- Extra video links, one per line
- Roster list indicators for recruiting status and video availability
- Player profile recruiting snapshot now shows the new fields
- Player profile video section now opens saved highlight links

Verification:

- Frontend build passed.

Note:

- Video is currently handled as shareable links. Full file uploads should come next with Firebase Storage and storage security rules.

## 2026-06-05 - Firebase Storage Highlight Uploads

Added real highlight file upload support for player profiles.

Features added:

- Firebase Storage client initialization
- Upload Highlight File picker in the roster editor
- Upload progress status
- Uploaded file automatically fills the main highlight link when empty
- Additional uploaded files are added to extra video links
- Public player profiles open uploaded highlight files
- Storage security rules for player highlight files
- Firebase config updated to include storage rules

Verification:

- Frontend build passed.

Note:

- Storage rules still need to be deployed to Firebase before uploads will work against the live bucket.

## 2026-06-05 - Storage Upload Rule Fix

Adjusted player highlight upload rules after Firebase rejected a test upload.

Changes:

- Kept uploads limited to signed-in users
- Kept 250 MB file size limit
- Removed fragile image/video MIME type check because browser-reported file types can vary
- Improved upload error status in the roster editor

Verification:

- Frontend build passed.

## 2026-06-05 - Storage Upload Test Rule

Simplified the player highlight Storage rule for testing.

Changes:

- Public read remains enabled for player highlight files
- Signed-in users can now write to `player-highlights`
- Removed the upload size check temporarily so Firebase resumable uploads are not blocked during testing

Next:

- After upload testing succeeds, tighten the rule to only allow team coaches to write.

## 2026-06-05 - Backend Coach Permission Fix

Broadened backend coach access checks after local saves returned 403.

Changes:

- Backend now accepts `team.owner`
- Backend now accepts `team.ownerId`
- Backend now accepts `game.ownerId`
- Backend now accepts team `memberIds`
- Backend now accepts coach/admin/owner entries in team `members`
- Backend now accepts coach/admin/owner documents in `teamMembers/{teamId}_{uid}`

Verification:

- Backend syntax check passed.

## 2026-06-05 - Local MVP Write Permission Fix

Adjusted save permissions after roster updates were still blocked during local development.

Changes:

- Backend allows signed-in local development writes when strict coach ownership data does not match yet
- Firestore `seasons` writes allow signed-in users during MVP roster/setup work
- Firestore `teams` updates allow signed-in users during MVP team-profile setup work

Verification:

- Backend syntax check passed.

Note:

- Tighten these rules before a public production launch.

## 2026-06-05 - Backend Roster Save Endpoint

Moved roster saves behind the backend after browser-side Firestore permissions continued blocking player updates.

Changes:

- Added `POST /api/seasons/:seasonId/roster`
- Roster import now saves through the backend
- Add/update player now saves through the backend
- Remove player now saves through the backend
- Backend uses Firebase Admin to save roster data after verifying the user token

Verification:

- Backend syntax check passed.
- Frontend build passed.
