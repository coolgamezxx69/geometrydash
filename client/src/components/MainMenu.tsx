import { useRef, useEffect } from "react";
import { useMenu } from "../lib/stores/useMenu";
import { useAudio } from "../lib/stores/useAudio";
import { useAuth } from "../lib/stores/useAuth";
import NeonButton from "./NeonButton";

export default function MainMenu() {
  const { setCurrentScreen, selectedMenuItem, setSelectedMenuItem } = useMenu();
  const { backgroundMusic, isMuted } = useAudio();
  const { isAuthenticated, user, logout } = useAuth();

  const menuItems = isAuthenticated 
    ? ['PLAY', 'MULTIPLAYER', 'SETTINGS', 'LOGOUT'] 
    : ['PLAY', 'LOGIN', 'SETTINGS', 'QUIT'];

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          setSelectedMenuItem(Math.max(0, selectedMenuItem - 1));
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          setSelectedMenuItem(Math.min(menuItems.length - 1, selectedMenuItem + 1));
          break;
        case 'Enter':
        case ' ':
          handleMenuSelect();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedMenuItem, setSelectedMenuItem]);

  // Play background music when menu loads
  useEffect(() => {
    if (backgroundMusic && !isMuted) {
      backgroundMusic.play().catch(console.log);
    }
  }, [backgroundMusic, isMuted]);

  const handleMenuSelect = (index?: number) => {
    const menuIndex = index !== undefined ? index : selectedMenuItem;
    
    if (isAuthenticated) {
      switch (menuIndex) {
        case 0: // PLAY
          setCurrentScreen("levels");
          break;
        case 1: // MULTIPLAYER
          setCurrentScreen("multiplayer");
          break;
        case 2: // SETTINGS
          setCurrentScreen("settings");
          break;
        case 3: // LOGOUT
          logout();
          break;
      }
    } else {
      switch (menuIndex) {
        case 0: // PLAY
          setCurrentScreen("levels");
          break;
        case 1: // LOGIN
          setCurrentScreen("auth");
          break;
        case 2: // SETTINGS
          setCurrentScreen("settings");
          break;
        case 3: // QUIT
          console.log("Quit game");
          break;
      }
    }
  };

  return (
    <div className="main-menu">
      <div className="title-container">
        <h1 className="main-title">
          <span className="title-word geometry">GEOMETRY</span>
          <span className="title-word dash">DASH</span>
        </h1>
        <div className="title-underline"></div>
      </div>

      <div className="menu-buttons">
        {menuItems.map((item, index) => (
          <NeonButton 
            key={item}
            onClick={() => {
              setSelectedMenuItem(index);
              handleMenuSelect(index);
            }}
            color={
              index === 0 ? "orange" : 
              index === 1 ? "purple" : "red"
            }
            size={index === 0 ? "large" : "medium"}
            disabled={false}
          >
            <span className={index === selectedMenuItem ? "selected-menu-item" : ""}>
              {item}
            </span>
          </NeonButton>
        ))}
      </div>

      <div className="menu-footer">
        {isAuthenticated && user && (
          <div className="user-info">
            <p className="username">Welcome, {user.username}!</p>
            <p className="friend-code">Friend Code: {user.friendCode}</p>
          </div>
        )}
        <p className="version-text">Geometry Dash Grid v1.0</p>
        <p className="controls-hint">Press ENTER to Start • ↑/↓ to navigate</p>
      </div>
    </div>
  );
}
