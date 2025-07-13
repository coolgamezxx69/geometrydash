import { useFrame } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import { useKeyboardControls, Html } from "@react-three/drei";
import { useMenu } from "../lib/stores/useMenu";
import ParticleBackground from "./ParticleBackground";
import MainMenu from "./MainMenu";
import LevelSelection from "./LevelSelection";
import Settings from "./Settings";
import * as THREE from "three";

export default function GeometryDashMenu() {
  const { currentScreen, setCurrentScreen } = useMenu();
  const groupRef = useRef<THREE.Group>(null);
  const [subscribe] = useKeyboardControls();

  // Handle global ESC key to return to main menu from game
  useEffect(() => {
    const unsubscribeBack = subscribe(
      (state) => state.back,
      (pressed) => {
        if (pressed && currentScreen === "game") {
          setCurrentScreen("main");
        }
      }
    );
    return unsubscribeBack;
  }, [subscribe, currentScreen, setCurrentScreen]);

  // Gentle rotation animation for the entire scene
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.1) * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Animated particle background */}
      <ParticleBackground />
      
      {/* Render current menu screen */}
      {currentScreen === "main" && <MainMenu />}
      {currentScreen === "levels" && <LevelSelection />}
      {currentScreen === "settings" && <Settings />}
      {currentScreen === "game" && (
        <Html center position={[0, 0, 0]}>
          <div className="game-placeholder">
            <h1 className="section-title">GAME LOADING...</h1>
            <p style={{color: 'white', textAlign: 'center', marginTop: '20px'}}>
              Press ESC to return to menu
            </p>
          </div>
        </Html>
      )}
    </group>
  );
}
