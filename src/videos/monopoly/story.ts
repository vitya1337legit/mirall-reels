export const TOTAL = 1350;
export const FPS = 30;

export type Shot = {
  id: number;
  set: string;
  a: number;
  b: number;
  light: 'print' | 'office' | 'vault' | 'fbi' | 'street' | 'final';
  camFrom: { pos: [number, number, number]; look: [number, number, number]; fov: number };
  camTo: { pos: [number, number, number]; look: [number, number, number]; fov: number };
};

export const SHOTS: Shot[] = [
  { id: 1, set: 'print', a: 0, b: 150, light: 'print', camFrom: { pos: [6.0, 2.6, 10.5], look: [0, 1.4, 2.0], fov: 46 }, camTo: { pos: [5.0, 2.2, 9.0], look: [0, 1.4, 2.0], fov: 42 } },
  { id: 2, set: 'ticket', a: 150, b: 320, light: 'office', camFrom: { pos: [0, 3.0, 6.2], look: [0, 0.6, 0.4], fov: 42 }, camTo: { pos: [0.2, 2.5, 5.0], look: [0, 0.6, 0.4], fov: 36 } },
  { id: 3, set: 'print', a: 320, b: 500, light: 'print', camFrom: { pos: [-6.0, 2.6, 10.0], look: [0, 1.4, 2.0], fov: 46 }, camTo: { pos: [-5.0, 2.2, 8.6], look: [0, 1.4, 2.0], fov: 42 } },
  { id: 4, set: 'office', a: 500, b: 700, light: 'office', camFrom: { pos: [2.8, 2.0, 5.6], look: [0.2, 1.2, 1.8], fov: 42 }, camTo: { pos: [1.8, 1.8, 4.6], look: [0.2, 1.2, 1.8], fov: 38 } },
  { id: 5, set: 'scheme', a: 700, b: 900, light: 'office', camFrom: { pos: [0, 2.8, 9.6], look: [0, 1.1, 1.5], fov: 54 }, camTo: { pos: [0, 2.1, 6.6], look: [0, 1.1, 1.5], fov: 46 } },
  { id: 6, set: 'vault', a: 900, b: 1050, light: 'vault', camFrom: { pos: [0, 3.0, 8.8], look: [0, 4.2, -3.2], fov: 50 }, camTo: { pos: [0, 3.4, 7.4], look: [0, 4.2, -3.2], fov: 46 } },
  { id: 7, set: 'fbi', a: 1050, b: 1180, light: 'fbi', camFrom: { pos: [0, 2.2, 6.2], look: [0, 1.15, 1.2], fov: 50 }, camTo: { pos: [0, 2.0, 5.6], look: [0, 1.3, 1.0], fov: 40 } },
  { id: 8, set: 'street', a: 1180, b: 1280, light: 'street', camFrom: { pos: [1.0, 2.4, 8.6], look: [0, 1.1, -0.4], fov: 48 }, camTo: { pos: [0.6, 2.0, 7.2], look: [0, 1.1, -0.4], fov: 44 } },
  { id: 9, set: 'final', a: 1280, b: 1350, light: 'final', camFrom: { pos: [0, 3.2, 7.6], look: [0, 1.7, 0.4], fov: 42 }, camTo: { pos: [0, 2.6, 6.4], look: [0, 1.6, 0.4], fov: 38 } },
];

export const shotAt = (f: number) => SHOTS.find((s) => f >= s.a && f < s.b) ?? SHOTS[SHOTS.length - 1];
export const layersAt = (f: number) => [{ id: shotAt(f).id, alpha: 1 }];
export const dofAt = (f: number) => {
  const s = shotAt(f);
  return { cInf: s.set === 'ticket' ? 15 : s.set === 'vault' || s.set === 'street' ? 0 : 10 };
};
