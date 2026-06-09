# GameTracker Platform Foundation

GameTracker uses an event-first model. Every pitch and scoring action is stored
as an immutable event under a game. Scoreboards, statistics, broadcasts, and
recruiting profiles should be derived from those events.

## Primary collections

- `organizations`: schools, clubs, leagues, and media programs.
- `teams`: team identity, owner, member IDs, and organization link.
- `teamMembers`: normalized membership and roles.
- `athletes`: roster identity and public profile controls.
- `seasons`: team season metadata. Legacy roster and schedule arrays remain
  temporarily for compatibility.
- `games`: current scoreboard state and matchup metadata.
- `games/{gameId}/events`: ordered pitch-by-pitch and play-by-play events.
- `games/{gameId}/lineups`: batting order and defensive alignment.
- `posts`: team announcements and public stories.
- `messages`: private team communication.
- `media`: video, photos, clips, and timestamps.
- `recruitingProfiles`: athlete-controlled public recruiting information.

## Event shape

Each game event should include:

```json
{
  "teamId": "team-id",
  "gameId": "game-id",
  "sequence": 1,
  "eventType": "pitch",
  "result": "called_strike",
  "inning": 1,
  "half": "top",
  "ballsBefore": 0,
  "strikesBefore": 0,
  "outsBefore": 0,
  "batterId": null,
  "pitcherId": null,
  "createdBy": "firebase-uid",
  "createdAt": "server timestamp"
}
```

Never rewrite old events during normal scoring. Corrections should create a
new correction event so the scoring history remains auditable.
