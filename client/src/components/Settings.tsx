import { useRef, useEffect, useState } from "react";
import { useMenu } from "../lib/stores/useMenu";
import { useAudio } from "../lib/stores/useAudio";
import NeonButton from "./NeonButton";

export default function Settings() {
  const { setCurrentScreen } = useMenu();
  const { isMuted, toggleMute } = useAudio();
  const [musicVolume, setMusicVolume] = useState(30);
  const [sfxVolume, setSfxVolume] = useState(50);
  const [showGrid, setShowGrid] = useState(false);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setCurrentScreen("main");
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setCurrentScreen]);

  return (
    <div className="settings">
      <div className="settings-header">
        <h1 className="section-title">SETTINGS</h1>
      </div>

      <div className="settings-content">
        <div className="settings-section">
          <h3 className="settings-section-title">AUDIO</h3>
          
          <div className="setting-item">
            <label className="setting-label">Master Volume</label>
            <div className="setting-control">
              <NeonButton 
                onClick={toggleMute}
                color={isMuted ? "red" : "green"}
                size="small"
              >
                {isMuted ? "MUTED" : "ON"}
              </NeonButton>
            </div>
          </div>

          <div className="setting-item">
            <label className="setting-label">Music Volume</label>
            <div className="setting-control">
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={musicVolume}
                onChange={(e) => setMusicVolume(parseInt(e.target.value))}
                className="volume-slider"
              />
              <span className="volume-value">{musicVolume}%</span>
            </div>
          </div>

          <div className="setting-item">
            <label className="setting-label">SFX Volume</label>
            <div className="setting-control">
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={sfxVolume}
                onChange={(e) => setSfxVolume(parseInt(e.target.value))}
                className="volume-slider"
              />
              <span className="volume-value">{sfxVolume}%</span>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h3 className="settings-section-title">VISUAL</h3>
          
          <div className="setting-item">
            <label className="setting-label">Show Grid (G key)</label>
            <div className="setting-control">
              <NeonButton 
                onClick={() => setShowGrid(!showGrid)}
                color={showGrid ? "green" : "gray"}
                size="small"
              >
                {showGrid ? "ON" : "OFF"}
              </NeonButton>
            </div>
          </div>

          <div className="setting-item">
            <label className="setting-label">Particle Effects</label>
            <div className="setting-control">
              <NeonButton 
                onClick={() => console.log("Toggle particles")}
                color="green"
                size="small"
              >
                HIGH
              </NeonButton>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h3 className="settings-section-title">CONTROLS</h3>
          
          <div className="setting-item">
            <label className="setting-label">Jump</label>
            <div className="setting-control">
              <span className="key-binding">SPACE / UP ARROW</span>
            </div>
          </div>

          <div className="setting-item">
            <label className="setting-label">Menu Navigation</label>
            <div className="setting-control">
              <span className="key-binding">ARROW KEYS</span>
            </div>
          </div>
        </div>
      </div>

      <div className="settings-controls">
        <NeonButton 
          onClick={() => setCurrentScreen("main")}
          color="blue"
          size="large"
        >
          BACK TO MENU
        </NeonButton>
      </div>
    </div>
  );
}
