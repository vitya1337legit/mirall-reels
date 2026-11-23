import React from "react";
import { AbsoluteFill } from "remotion";
import { ThreeCanvas } from "@remotion/three";

const Box: React.FC = () => (
  <mesh rotation={[0.4, 0.7, 0]}>
    <boxGeometry args={[2, 2, 2]} />
    <meshStandardMaterial color="#ff3b30" />
  </mesh>
);

export const Test3D: React.FC = () => (
  <AbsoluteFill style={{ background: "#101018" }}>
    <ThreeCanvas width={1080} height={1920} camera={{ fov: 45, position: [0, 0, 6] }}>
      <ambientLight intensity={1.5} />
      <directionalLight position={[3, 4, 5]} intensity={2} />
      <Box />
    </ThreeCanvas>
  </AbsoluteFill>
);
