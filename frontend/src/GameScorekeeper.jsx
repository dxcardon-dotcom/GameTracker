import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { doc, setDoc, onSnapshot } from "firebase/firestore";

function GameScorekeeper() {
  // Game Tracking State
  const [gameState, setGameState] = useState({
    inning: 1,
    isTop: true,
    awayScore: 0,
    homeScore: 0,
    balls: 0,
    strikes: 0,
    outs: 0,
    bases: [false, false, false], // [1st, 2nd, 3rd]
    awayTeam: "Away Team",
    homeTeam: "Rockets"
  });

  // Connect to Firestore real-time updates
  useEffect(() => {
    const docRef = doc(db, "games", "live_game");
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setGameState(docSnap.data());
      }
    });
    return () => unsubscribe();
  }, []);

  // Update Firestore and Sync UI
  const updateGameDoc = async (updatedState) => {
    try {
      await setDoc(doc(db, "games", "live_game"), updatedState, { merge: true });
    } catch (error) {
      console.error("Error updating game document: ", error);
    }
  };

  // Scorekeeper Button Actions
  const handleBall = () => {
    let newBalls = gameState.balls + 1;
    if (newBalls >= 4) {
      newBalls = 0; // Walk
    }
    const nextState = { ...gameState, balls: newBalls };
    setGameState(nextState);
    updateGameDoc(nextState);
  };

  const handleStrike = () => {
    let newStrikes = gameState.strikes + 1;
    let newOuts = gameState.outs;
    let newBalls = gameState.balls;
    
    if (newStrikes >= 3) {
      newStrikes = 0;
      newBalls = 0;
      newOuts += 1;
      if (newOuts >= 3) {
        newOuts = 0;
        // Switch sides
        return handleInningSwitch();
      }
    }
    const nextState = { ...gameState, strikes: newStrikes, balls: newBalls, outs: newOuts };
    setGameState(nextState);
    updateGameDoc(nextState);
  };

  const handleOut = () => {
    let newOuts = gameState.outs + 1;
    let newStrikes = 0;
    let newBalls = 0;

    if (newOuts >= 3) {
      return handleInningSwitch();
    }
    const nextState = { ...gameState, outs: newOuts, strikes: newStrikes, balls: newBalls };
    setGameState(nextState);
    updateGameDoc(nextState);
  };

  const handleInningSwitch = () => {
    const nextState = {
      ...gameState,
      balls: 0,
      strikes: 0,
      outs: 0,
      bases: [false, false, false],
      isTop: !gameState.isTop,
      inning: gameState.isTop ? gameState.inning : gameState.inning + 1
    };
    setGameState(nextState);
    updateGameDoc(nextState);
  };

  const toggleBase = (index) => {
    const updatedBases = [...gameState.bases];
    updatedBases[index] = !updatedBases[index];
    const nextState = { ...gameState, bases: updatedBases };
    setGameState(nextState);
    updateGameDoc(nextState);
  };

  const adjustScore = (team, amount) => {
    const nextState = {
      ...gameState,
      [team === "home" ? "homeScore" : "awayScore"]: Math.max(0, gameState[team === "home" ? "homeScore" : "awayScore"] + amount)
    };
    setGameState(nextState);
    updateGameDoc(nextState);
  };

  return (
    <div style={styles.container}>
      {/* Scoreboard Widget */}
      <div style={styles.scoreboard}>
        <div style={styles.teamSection}>
          <span style={styles.teamName}>{gameState.awayTeam}</span>
          <span style={styles.score}>{gameState.awayScore}</span>
          <div style={styles.scoreButtons}>
            <button onClick={() => adjustScore("away", 1)} style={styles.smallBtn}>+</button>
            <button onClick={() => adjustScore("away", -1)} style={styles.smallBtn}>-</button>
          </div>
        </div>

        <div style={styles.inningSection}>
          <div style={styles.inningIndicator}>
            {gameState.isTop ? "▲" : "▼"} Inning {gameState.inning}
          </div>
          <div style={styles.countRow}>
            <span>B: {gameState.balls}</span>
            <span>S: {gameState.strikes}</span>
            <span>O: {gameState.outs}</span>
          </div>
        </div>

        <div style={styles.teamSection}>
          <span style={styles.teamName}>{gameState.homeTeam}</span>
          <span style={styles.score}>{gameState.homeScore}</span>
          <div style={styles.scoreButtons}>
            <button onClick={() => adjustScore("home", 1)} style={styles.smallBtn}>+</button>
            <button onClick={() => adjustScore("home", -1)} style={styles.smallBtn}>-</button>
          </div>
        </div>
      </div>

      {/* Interactive Visual Diamond Field Map */}
      <div style={styles.fieldContainer}>
        <div style={styles.diamondWrapper}>
          <div 
            onClick={() => toggleBase(1)} 
            style={{...styles.base, ...styles.secondBase, backgroundColor: gameState.bases[1] ? "#ffcc00" : "#ffffff"}}
            title="Second Base"
          />
          <div 
            onClick={() => toggleBase(2)} 
            style={{...styles.base, ...styles.thirdBase, backgroundColor: gameState.bases[2] ? "#ffcc00" : "#ffffff"}}
            title="Third Base"
          />
          <div 
            onClick={() => toggleBase(0)} 
            style={{...styles.base, ...styles.firstBase, backgroundColor: gameState.bases[0] ? "#ffcc00" : "#ffffff"}}
            title="First Base"
          />
          <div style={{...styles.base, ...styles.homePlate}} title="Home Plate" />
        </div>
      </div>

      {/* Control Panel Console */}
      <div style={styles.controlsRow}>
        <button onClick={handleBall} style={{...styles.controlBtn, backgroundColor: "#28a745"}}>Ball</button>
        <button onClick={handleStrike} style={{...styles.controlBtn, backgroundColor: "#dc3545"}}>Strike</button>
        <button onClick={handleOut} style={{...styles.controlBtn, backgroundColor: "#ffc107", color: "#000"}}>Out</button>
        <button onClick={handleInningSwitch} style={{...styles.controlBtn, backgroundColor: "#17a2b8"}}>Manual Switch</button>
      </div>
    </div>
  );
}

// Layout Dashboard Styling Configuration
const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    backgroundColor: "#2d2d38",
    borderRadius: "12px",
    padding: "25px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.3)"
  },
  scoreboard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#111",
    padding: "20px",
    borderRadius: "8px",
    border: "2px solid #444",
    fontFamily: "monospace"
  },
  teamSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "30%"
  },
  teamName: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    marginBottom: "5px",
    color: "#aaa"
  },
  score: {
    fontSize: "3rem",
    fontWeight: "bold",
    color: "#00ff00"
  },
  scoreButtons: {
    display: "flex",
    gap: "5px",
    marginTop: "5px"
  },
  smallBtn: {
    padding: "2px 8px",
    cursor: "pointer",
    backgroundColor: "#333",
    color: "#fff",
    border: "1px solid #555",
    borderRadius: "4px"
  },
  inningSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "35%"
  },
  inningIndicator: {
    fontSize: "1.4rem",
    color: "#ffcc00",
    marginBottom: "10px"
  },
  countRow: {
    display: "flex",
    gap: "15px",
    fontSize: "1.2rem"
  },
  fieldContainer: {
    display: "flex",
    justifyContent: "center",
    margin: "40px 0"
  },
  diamondWrapper: {
    position: "relative",
    width: "200px",
    height: "200px",
    border: "2px dashed #555",
    transform: "rotate(45deg)"
  },
  base: {
    position: "absolute",
    width: "24px",
    height: "24px",
    border: "2px solid #333",
    cursor: "pointer",
    transition: "background-color 0.2s ease"
  },
  firstBase: {
    bottom: "-12px",
    right: "-12px",
    transform: "rotate(-45deg)"
  },
  secondBase: {
    top: "-12px",
    right: "-12px",
    transform: "rotate(-45deg)"
  },
  thirdBase: {
    top: "-12px",
    left: "-12px",
    transform: "rotate(-45deg)"
  },
  homePlate: {
    bottom: "-12px",
    left: "-12px",
    backgroundColor: "#ffffff",
    clipPath: "polygon(50% 0%, 100% 50%, 100% 100%, 0% 100%, 0% 50%)",
    transform: "rotate(-45deg)"
  },
  controlsRow: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    flexWrap: "wrap",
    marginTop: "20px"
  },
  controlBtn: {
    padding: "12px 24px",
    fontSize: "1.1rem",
    fontWeight: "bold",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    boxShadow: "0 4px 6px rgba(0,0,0,0.2)"
  }
};

export default GameScorekeeper;