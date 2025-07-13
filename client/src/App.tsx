import { useEffect, useState } from "react";
import { useAudio } from "./lib/stores/useAudio";
import { useAuth } from "./lib/stores/useAuth";
import MainMenu from "./components/MainMenu";
import LevelSelection from "./components/LevelSelection";
import Settings from "./components/Settings";
import Auth from "./components/Auth";
import Multiplayer from "./components/Multiplayer";
import { useMenu } from "./lib/stores/useMenu";
import "./styles/geometry-dash.css";

function App() {
  const { setBackgroundMusic } = useAudio();
  const { currentScreen, setCurrentScreen } = useMenu();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Load background music
    const audio = new Audio("/sounds/background.mp3");
    audio.loop = true;
    audio.volume = 0.3;
    setBackgroundMusic(audio);
  }, [setBackgroundMusic]);

  // Global escape key handler for game screen
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && currentScreen === 'game') {
        setCurrentScreen('main');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentScreen, setCurrentScreen]);

  return (
    <div className="geometry-dash-app">
      {/* Render current screen without 3D for instant loading */}
      {currentScreen === "main" && <MainMenu />}
      {currentScreen === "levels" && <LevelSelection />}
      {currentScreen === "settings" && <Settings />}
      {currentScreen === "auth" && <Auth />}
      {currentScreen === "multiplayer" && <Multiplayer />}
      {currentScreen === "game" && (
        <div className="game-placeholder">
          <div className="game-placeholder-content">
            <h1 className="section-title">STEREO MADNESS</h1>
            <div className="game-loading-bar">
              <div className="loading-fill"></div>
            </div>
            <p className="game-instructions">
              Press ESC to return to menu
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;