import { useRef, useEffect, useState } from "react";
import { useMenu } from "../lib/stores/useMenu";
import NeonButton from "./NeonButton";

interface Level {
  id: number;
  name: string;
  difficulty: "Easy" | "Normal" | "Hard" | "Harder" | "Insane" | "Demon";
  stars: number;
  unlocked: boolean;
}

export default function LevelSelection() {
  const { setCurrentScreen } = useMenu();
  const [selectedLevel, setSelectedLevel] = useState(0);

  // Fixed level data - exactly the same for every player
  const levels: Level[] = [
    { id: 1, name: "Stereo Madness", difficulty: "Easy", stars: 1, unlocked: true },
    { id: 2, name: "Back On Track", difficulty: "Easy", stars: 2, unlocked: false },
    { id: 3, name: "Polargeist", difficulty: "Normal", stars: 3, unlocked: false },
    { id: 4, name: "Dry Out", difficulty: "Normal", stars: 4, unlocked: false },
    { id: 5, name: "Base After Base", difficulty: "Hard", stars: 5, unlocked: false },
    { id: 6, name: "Can't Let Go", difficulty: "Hard", stars: 6, unlocked: false },
    { id: 7, name: "Jumper", difficulty: "Harder", stars: 7, unlocked: false },
    { id: 8, name: "Time Machine", difficulty: "Harder", stars: 8, unlocked: false },
    { id: 9, name: "Cycles", difficulty: "Insane", stars: 9, unlocked: false },
    { id: 10, name: "xStep", difficulty: "Insane", stars: 10, unlocked: false },
    { id: 11, name: "Clutterfunk", difficulty: "Hard", stars: 6, unlocked: false },
    { id: 12, name: "Theory of Everything", difficulty: "Harder", stars: 8, unlocked: false },
    { id: 13, name: "Electroman Adventures", difficulty: "Insane", stars: 10, unlocked: false },
    { id: 14, name: "Clubstep", difficulty: "Demon", stars: 10, unlocked: false },
    { id: 15, name: "Electrodynamix", difficulty: "Insane", stars: 10, unlocked: false },
    { id: 16, name: "Hexagon Force", difficulty: "Harder", stars: 8, unlocked: false },
    { id: 17, name: "Blast Processing", difficulty: "Hard", stars: 6, unlocked: false },
    { id: 18, name: "TOE 2", difficulty: "Demon", stars: 10, unlocked: false },
    { id: 19, name: "Geometrical Dominator", difficulty: "Harder", stars: 8, unlocked: false },
    { id: 20, name: "Deadlocked", difficulty: "Demon", stars: 10, unlocked: false }
  ];

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
          setSelectedLevel(prev => Math.max(0, prev - 1));
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          setSelectedLevel(prev => Math.min(levels.length - 1, prev + 1));
          break;
        case 'Escape':
          setCurrentScreen("main");
          break;
        case 'Enter':
        case ' ':
          if (levels[selectedLevel]?.unlocked) {
            console.log(`Starting ${levels[selectedLevel].name}`);
            setCurrentScreen("game");
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedLevel, setCurrentScreen, levels]);



  const getDifficultyColor = (difficulty: Level["difficulty"]) => {
    switch (difficulty) {
      case "Easy": return "#4ade80";
      case "Normal": return "#3b82f6";
      case "Hard": return "#f59e0b";
      case "Harder": return "#ef4444";
      case "Insane": return "#a855f7";
      case "Demon": return "#dc2626";
      default: return "#6b7280";
    }
  };

  return (
    <div className="level-selection">
      <div className="level-header">
        <h1 className="section-title">LEVEL SELECTION</h1>
        <div className="level-counter">
          {selectedLevel + 1} / {levels.length}
        </div>
      </div>

      <div className="level-grid">
        {levels.map((level, index) => (
          <div 
            key={level.id}
            className={`level-card ${index === selectedLevel ? 'selected' : ''} ${!level.unlocked ? 'locked' : ''}`}
            onClick={() => setSelectedLevel(index)}
          >
            <div className="level-number">{level.id}</div>
            <div className="level-name">{level.name}</div>
            <div 
              className="level-difficulty"
              style={{ color: getDifficultyColor(level.difficulty) }}
            >
              {level.difficulty}
            </div>
            <div className="level-stars">
              {"★".repeat(level.stars)}
            </div>
            {!level.unlocked && <div className="lock-overlay">🔒</div>}
          </div>
        ))}
      </div>

      <div className="level-info">
        {levels[selectedLevel] && (
          <div className="selected-level-info">
            <h3>{levels[selectedLevel].name}</h3>
            <p>Difficulty: <span style={{ color: getDifficultyColor(levels[selectedLevel].difficulty) }}>
              {levels[selectedLevel].difficulty}
            </span></p>
            <p>Stars: {levels[selectedLevel].stars}</p>
          </div>
        )}
      </div>

      <div className="level-controls">
        <NeonButton 
          onClick={() => setCurrentScreen("main")}
          color="red"
          size="medium"
        >
          BACK
        </NeonButton>
        
        <NeonButton 
          onClick={() => {
            if (levels[selectedLevel]?.unlocked) {
              console.log(`Starting ${levels[selectedLevel].name}`);
              setCurrentScreen("game");
              // Simulate game start
              setTimeout(() => {
                alert(`${levels[selectedLevel].name} completed! You earned 1 coin!`);
                setCurrentScreen("levels");
              }, 3000);
            }
          }}
          color="green"
          size="large"
          disabled={!levels[selectedLevel]?.unlocked}
        >
          START
        </NeonButton>
      </div>
    </div>
  );
}
