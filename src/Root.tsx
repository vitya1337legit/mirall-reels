import React from "react";
import { Composition } from "remotion";
import { BridgeShort, BRIDGE_FRAMES } from "./videos/bridge/Bridge";
import { Test3D } from "./Test3D";

export const RemotionRoot: React.FC = () => (
  <>
  <Composition
    id="BridgeShort"
    component={BridgeShort}
    durationInFrames={BRIDGE_FRAMES}
    fps={30}
    width={1080}
    height={1920}
  />
  <Composition id="Test3D" component={Test3D} durationInFrames={30} fps={30} width={1080} height={1920} />
  </>
);
