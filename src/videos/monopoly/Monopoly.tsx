import React, { useMemo } from "react";
import * as THREE from "three";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { EffectComposer } from "@react-three/postprocessing";
import { InkPass } from "../bridge/ink";
import { KuwaharaEffect } from "./Kuwahara";
import { World } from "./world";
import { TOTAL, shotAt } from "./story";

const Inner: React.FC = () => {
  const f = useCurrentFrame();
  const { camera, scene } = useThree();
  const world = useMemo(() => new World(), []);
  const ink = useMemo(() => new InkPass(scene, camera as THREE.PerspectiveCamera), [scene, camera]);
  const kuwahara = useMemo(() => new KuwaharaEffect(2.2), []);
  world.update(shotAt(f).id, f, camera as THREE.PerspectiveCamera);
  return (
    <>
      <primitive object={world.root} dispose={null} />
      <EffectComposer multisampling={0}>
        <primitive object={ink} dispose={null} />
        <primitive object={kuwahara} dispose={null} />
      </EffectComposer>
    </>
  );
};

export const MonopolyShort: React.FC = () => (
  <AbsoluteFill style={{ background: "#11151f" }}>
    <ThreeCanvas width={1080} height={1920} shadows gl={{ antialias: false, stencil: false }} camera={{ fov: 42, near: 0.1, far: 200 }}>
      <Inner />
    </ThreeCanvas>
  </AbsoluteFill>
);
