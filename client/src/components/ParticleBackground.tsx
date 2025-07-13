import { useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

export default function ParticleBackground() {
  const particlesRef = useRef<THREE.Points>(null);
  
  // Minimal particle data for fastest loading
  const particleData = useMemo(() => {
    const count = 20; // Drastically reduced for speed
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    // Simple fixed pattern
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (i % 5 - 2) * 10;
      positions[i * 3 + 1] = Math.floor(i / 5) * 8 - 12;
      positions[i * 3 + 2] = 0;
      
      // Simple orange color
      colors[i * 3] = 1;
      colors[i * 3 + 1] = 0.42;
      colors[i * 3 + 2] = 0.21;
      
      sizes[i] = 0.2;
    }
    
    return { positions, colors, sizes };
  }, []);

  // Minimal animation for performance
  useFrame(() => {
    if (particlesRef.current) {
      // Simple rotation only
      particlesRef.current.rotation.z += 0.001;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleData.positions.length / 3}
          array={particleData.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleData.colors.length / 3}
          array={particleData.colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={particleData.sizes.length}
          array={particleData.sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        sizeAttenuation={true}
        vertexColors={true}
        blending={THREE.AdditiveBlending}
        transparent={true}
        opacity={0.8}
      />
    </points>
  );
}
