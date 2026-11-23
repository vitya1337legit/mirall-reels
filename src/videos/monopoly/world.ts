import * as THREE from 'three';
import { SHOTS, shotAt } from './story';
import { Pool, Actor } from '../bridge/cast';
import { bodyFront, townsfolk, Outfit } from '../bridge/toon';
import { planksHD, brick, stoneHD, cobbleHD, rep } from '../bridge/paint';
import { boxGeo, V } from '../bridge/build';

const gradData = new Uint8Array([60, 130, 200, 255]);
const grad = new THREE.DataTexture(gradData, gradData.length, 1, THREE.RedFormat);
grad.minFilter = grad.magFilter = THREE.NearestFilter;
grad.needsUpdate = true;

const mat = (color: string) => new THREE.MeshToonMaterial({ color, gradientMap: grad });
const tmat = (map: THREE.Texture) => new THREE.MeshToonMaterial({ map, gradientMap: grad });
const woodT = planksHD(); rep(woodT, 24, 24);
const brickT = brick(); rep(brickT, 18, 10);
const stoneT = stoneHD(); rep(stoneT, 12, 12);
const cobbleT = cobbleHD(); rep(cobbleT, 20, 20);
const TM = { wood: tmat(woodT), brick: tmat(brickT), stone: tmat(stoneT), cobble: tmat(cobbleT) };
const ink = new THREE.LineBasicMaterial({ color: '#0b0a0c', transparent: true, opacity: 0.85 });

function edges(m: THREE.Mesh) {
  m.add(new THREE.LineSegments(new THREE.EdgesGeometry(m.geometry, 30), ink));
  return m;
}
function box(w: number, h: number, d: number, color: string | THREE.Material, x: number, y: number, z: number, p: THREE.Group) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), typeof color === 'string' ? mat(color) : color);
  m.position.set(x, y, z); m.castShadow = m.receiveShadow = true; p.add(edges(m)); return m;
}

function tbox(w: number, h: number, d: number, material: THREE.Material, x: number, y: number, z: number, p: THREE.Group, tile = 1) {
  const geo = boxGeo(V(x - w / 2, y - h / 2, z - d / 2), V(x + w / 2, y + h / 2, z + d / 2), tile);
  const m = new THREE.Mesh(geo, material);
  m.castShadow = m.receiveShadow = true; p.add(m); return m;
}

function cyl(rt: number, rb: number, h: number, color: string, x: number, y: number, z: number, p: THREE.Group, rot?: [number, number, number]) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, 24), mat(color));
  m.position.set(x, y, z); if (rot) m.rotation.set(...rot); m.castShadow = m.receiveShadow = true; p.add(edges(m)); return m;
}
function sph(r: number, color: string, x: number, y: number, z: number, p: THREE.Group) {
  const m = new THREE.Mesh(new THREE.SphereGeometry(r, 18, 14), mat(color));
  m.position.set(x, y, z); m.castShadow = true; p.add(m); return m;
}
function texCanvas(w: number, h: number, draw: (c: CanvasRenderingContext2D) => void) {
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
  draw(cv.getContext('2d')!);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t;
}
function plane(w: number, h: number, texture: THREE.Texture, x: number, y: number, z: number, p: THREE.Group, rot?: [number, number, number]) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide }));
  m.position.set(x, y, z); if (rot) m.rotation.set(...rot); p.add(m); return m;
}
function figure(color: string, skin: string, x: number, z: number, p: THREE.Group, scale = 1, hat = '#14141a') {
  const g = new THREE.Group();
  cyl(0.28, 0.34, 1.0, color, 0, 0.9, 0, g);
  sph(0.28, skin, 0, 1.58, 0, g);
  cyl(0.3, 0.3, 0.1, hat, 0, 1.8, 0, g);
  sph(0.28, hat, 0, 1.87, 0, g);
  sph(0.045, '#f8f4ea', -0.09, 1.62, 0.245, g);
  sph(0.045, '#f8f4ea', 0.09, 1.62, 0.245, g);
  sph(0.022, '#111116', -0.09, 1.62, 0.285, g);
  sph(0.022, '#111116', 0.09, 1.62, 0.285, g);
  cyl(0.08, 0.08, 0.8, color, -0.32, 1.15, 0, g, [0, 0, 0.18]);
  cyl(0.08, 0.08, 0.8, color, 0.32, 1.15, 0, g, [0, 0, -0.18]);
  cyl(0.09, 0.09, 0.75, '#1a1a20', -0.13, 0.38, 0, g);
  cyl(0.09, 0.09, 0.75, '#1a1a20', 0.13, 0.38, 0, g);
  g.position.set(x, 0, z); g.scale.setScalar(scale); p.add(g); return g;
}

const ticketTex = () => texCanvas(700, 980, (c) => {
  c.fillStyle = '#f8f0dd'; c.fillRect(0, 0, 700, 980);
  c.strokeStyle = '#c9231d'; c.lineWidth = 18; c.strokeRect(18, 18, 664, 944);
  c.fillStyle = '#17376e'; c.fillRect(50, 50, 600, 150);
  c.fillStyle = '#ffd43b'; c.font = '900 64px Arial Black'; c.textAlign = 'center'; c.fillText('MONOPOLY', 350, 150);
  c.fillStyle = '#d6221b'; c.font = '900 190px Arial Black'; c.fillText('WIN', 350, 430);
  c.fillStyle = '#176e38'; c.font = '900 74px Arial Black'; c.fillText('$1 000 000', 350, 550);
  c.fillStyle = '#141110'; c.font = '700 28px Arial'; c.fillText('INSTANT WINNER • 1995', 350, 700);
  for (let i = 0; i < 20; i++) c.fillRect(60 + i * 30, 820, 8, 80);
});

const ALT: Record<number, { pos: [number, number, number]; look: [number, number, number]; fov: number }> = {
  5: { pos: [0.6, 1.35, 2.6], look: [0.6, 1.12, 0.8], fov: 30 },
  6: { pos: [0.0, 3.9, 4.8], look: [0.0, 4.4, -3.2], fov: 38 },
  7: { pos: [1.2, 1.6, 2.2], look: [1.2, 1.5, 0.2], fov: 30 },
  8: { pos: [1.6, 1.1, 4.2], look: [0.2, 0.9, -0.6], fov: 38 },
};

export class World {
  root = new THREE.Group();
  sets: Record<string, THREE.Group> = {};
  rollers: THREE.Mesh[] = [];
  ticket!: THREE.Mesh;
  money: THREE.Mesh[] = [];
  car!: THREE.Group;
  cuffs!: THREE.Mesh[];
  finalTicket!: THREE.Mesh;
  pool = new Pool();
  actors: Record<string, { a: Actor; o: Outfit }> = {};

  constructor() {
    this.root.add(new THREE.HemisphereLight('#dbe8ff', '#2b2420', 0.9));
    const sun = new THREE.DirectionalLight('#fff1dc', 2.0); sun.position.set(6, 10, 8); sun.castShadow = true; this.root.add(sun);
    for (const s of SHOTS) { const g = new THREE.Group(); g.visible = false; this.root.add(g); this.sets[s.set] = g; }
    this.mkActor('jacobson', { jacket: '#1b2436', pants: '#1a1e2a', boots: '#111116', hat: 'cap', cap: '#141b29', skin: '#e6b284', belt: '#d9b13b' });
    this.mkActor('worker', { jacket: '#334d6e', pants: '#222a36', boots: '#1a1a20', hat: 'cap', cap: '#252930', skin: '#e6b488' });
    this.mkActor('winner1', { jacket: '#287a6c', pants: '#1b3a34', boots: '#161616', hat: 'cap', cap: '#1c2b4a', skin: '#eab98e' });
    this.mkActor('winner2', { jacket: '#6e3848', pants: '#2a1a20', boots: '#161616', hat: 'hair', hair: '#2e221a', skin: '#e2ae82' });
    this.mkActor('fbi1', { jacket: '#3d3934', pants: '#262320', boots: '#111', hat: 'hair', hair: '#1e1b18', skin: '#e4b288' });
    this.mkActor('fbi2', { jacket: '#8c7d65', pants: '#3a322a', boots: '#111', hat: 'hair', hair: '#423326', skin: '#dfb086' });
    this.mkActor('crowd1', townsfolk(1));
    this.mkActor('crowd2', townsfolk(2));
    this.buildPrint();
    this.buildTicket();
    this.buildOffice();
    this.buildScheme();
    this.buildVault();
    this.buildFbi();
    this.buildStreet();
    this.buildFinal();
  }

  private mkActor(key: string, outfit: Outfit) {
    const a = new Actor(this.root);
    this.actors[key] = { a, o: outfit };
  }

  buildPrint() {
    const g = this.sets.print;
    tbox(22, 0.3, 22, TM.wood, 0, -0.15, 0, g, 1.2);
    tbox(22, 9, 0.4, TM.brick, 0, 4.5, -6, g, 1.2);
    box(5.4, 4.4, 3.2, '#3b4050', 0, 2.2, -1.8, g);
    const r1 = cyl(0.8, 0.8, 4.0, '#7a8494', 0, 3.5, -1.2, g, [0, 0, Math.PI / 2]);
    const r2 = cyl(0.8, 0.8, 4.0, '#7a8494', 0, 1.9, -1.2, g, [0, 0, Math.PI / 2]);
    this.rollers = [r1, r2];
    const web = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 4.2), new THREE.MeshToonMaterial({ color: '#efe4cc', gradientMap: grad, side: THREE.DoubleSide }));
    web.position.set(0, 2.6, 0.6); web.rotation.x = 0.9; g.add(web);
    box(4.2, 0.3, 6.2, '#2a2e38', 0, 1.0, 3.0, g);
    for (let z = 0; z < 6; z++) { const r = cyl(0.1, 0.1, 3.8, '#555d6a', 0, 1.2, 0.2 + z * 0.9, g, [0, 0, Math.PI / 2]); }
    for (let i = 0; i < 4; i++) box(1.0, 0.8 + i * 0.3, 0.9, '#e7dcc4', -5 + i * 3.2, 0.4 + i * 0.15, 3.6, g);
    for (const x of [-3.2, 0, 3.2]) { cyl(0.08, 0.08, 2, '#444', x, 6.0, 1, g); const b = sph(0.2, '#ff2b22', x, 5.0, 1, g); }
  }

  buildTicket() {
    const g = this.sets.ticket;
    tbox(16, 0.3, 16, TM.wood, 0, -0.15, 0, g, 1.2);
    tbox(16, 8, 0.4, TM.brick, 0, 4, -5.5, g, 1.2);
    this.ticket = new THREE.Mesh(new THREE.PlaneGeometry(4.6, 6.4), new THREE.MeshBasicMaterial({ map: ticketTex(), side: THREE.DoubleSide }));
    this.ticket.position.set(0, 0.8, 0.6); this.ticket.rotation.set(-Math.PI / 2 + 0.12, 0, 0.06); g.add(this.ticket);
    box(5.2, 0.08, 6.8, '#5a3a22', 0, 0.05, 0.6, g);
    for (let i = 0; i < 6; i++) box(0.5, 0.25, 0.9, '#e7dcc4', -2.2 + (i % 3) * 2.2, 0.2, -2.5 + Math.floor(i / 3) * 0.9, g);
  }

  buildOffice() {
    const g = this.sets.office;
    tbox(18, 0.3, 18, TM.wood, 0, -0.15, 0, g, 1.2);
    tbox(18, 8, 0.4, TM.brick, 0, 4, -5.5, g, 1.2);
    box(5.4, 0.2, 2.4, '#5a3a22', 0, 1.1, 0.4, g);
    for (const [x, z] of [[-2.4, -0.6], [2.4, -0.6], [-2.4, 1.4], [2.4, 1.4]]) box(0.2, 1.1, 0.2, '#3a2616', x, 0.55, z, g);
    box(1.8, 2.2, 1.6, '#3b4048', -4.2, 1.1, -1.6, g);
    for (let i = 0; i < 8; i++) { const m = box(0.5, 0.2, 0.3, '#3f7a4a', 0.2 + (i % 4) * 0.5, 1.25 + Math.floor(i / 4) * 0.2, 0.5, g); this.money.push(m); }
    box(0.7, 0.1, 0.5, '#d8c07a', 0.6, 1.65, 0.5, g);
    cyl(0.2, 0.2, 0.1, '#d9a83b', -1.2, 1.2, 0.2, g); cyl(0.04, 0.04, 0.7, '#d9a83b', -1.2, 1.55, 0.2, g);
    box(0.6, 0.25, 0.35, '#1f6e43', -1.2, 1.9, 0.2, g);
    plane(3.4, 2.0, texCanvas(512, 300, (c) => { c.fillStyle = '#e8dfc8'; c.fillRect(0, 0, 512, 300); c.fillStyle = '#9db58d'; c.fillRect(30, 40, 450, 210); c.fillStyle = '#141110'; c.font = '900 32px Arial'; c.fillText('США', 220, 160); }), 2.2, 3.4, -5.25, g);
  }

  buildScheme() {
    const g = this.sets.scheme;
    tbox(16, 0.3, 16, TM.wood, 0, -0.15, 0, g, 1.2);
    tbox(16, 8, 0.4, TM.brick, 0, 4, -5.2, g, 1.2);
    box(5.4, 0.2, 1.8, '#5a3a22', 0, 1.05, 0.6, g);
    for (let i = 0; i < 6; i++) box(0.6, 0.08, 0.4, '#d4b475', -1.2 + i * 0.48, 1.2, 0.6, g);
    for (let i = 0; i < 4; i++) box(0.4, 0.04, 0.55, '#d42c24', -0.7 + i * 0.5, 1.22, 1.0, g);
    for (let i = 0; i < 4; i++) box(0.45, 0.18, 0.25, '#3f7a4a', 1.8, 1.2 + i * 0.2, 0.4, g);
  }

  buildVault() {
    const g = this.sets.vault;
    tbox(18, 0.3, 18, TM.stone, 0, -0.15, 0, g, 1.5);
    tbox(18, 9, 0.4, TM.stone, 0, 4.5, -5.8, g, 1.5);
    plane(5.4, 2.6, texCanvas(800, 400, (c) => { c.fillStyle = '#12151c'; c.fillRect(0, 0, 800, 400); c.fillStyle = '#ffd43b'; c.font = '900 64px Arial Black'; c.textAlign = 'center'; c.fillText('12 ЛЕТ • 1989–2001', 400, 120); c.fillStyle = '#ff3b30'; c.font = '900 92px Arial Black'; c.fillText('$24 000 000', 400, 280); }), 0, 4.6, -5.5, g);
    for (let i = 0; i < 10; i++) { const x = -3.6 + (i % 5) * 1.8; const z = -2 + Math.floor(i / 5) * 1.6; for (let k = 0; k < 3; k++) { const m = box(0.9, 0.8 + k * 0.6, 0.9, '#3f7a4a', x, 0.5 + k * 0.3, z, g); this.money.push(m); } }
  }

  buildFbi() {
    const g = this.sets.fbi;
    tbox(16, 0.3, 16, TM.stone, 0, -0.15, 0, g, 1.5);
    tbox(16, 8, 0.4, TM.stone, 0, 4, -5.2, g, 1.5);
    box(5.2, 0.2, 2.0, '#3a414c', 0, 1.05, 0.5, g);
    for (let i = 0; i < 6; i++) box(0.7, 0.12, 0.9, '#d4b475', -1.6 + (i % 3) * 0.8, 1.2 + Math.floor(i / 3) * 0.12, 0.4, g);
    plane(1.2, 1.5, texCanvas(512, 640, (c) => { c.fillStyle = '#f0be3d'; c.beginPath(); c.moveTo(256, 40); c.lineTo(440, 130); c.quadraticCurveTo(450, 380, 256, 600); c.quadraticCurveTo(62, 380, 72, 130); c.closePath(); c.fill(); c.strokeStyle = '#141110'; c.lineWidth = 16; c.stroke(); c.fillStyle = '#17376e'; c.fillRect(140, 160, 232, 80); c.fillStyle = '#ffd54a'; c.font = '900 42px Arial Black'; c.textAlign = 'center'; c.fillText('ФБР • FBI', 256, 214); }), 1.2, 1.55, 0.2, g);
  }

  buildStreet() {
    const g = this.sets.street;
    tbox(28, 0.3, 28, TM.cobble, 0, -0.15, 0, g, 1.0);
    for (let i = 0; i < 4; i++) box(6, 9, 4, i % 2 ? '#2c2b30' : '#343038', -9 + i * 6, 4.5, -8, g);
    for (let i = 0; i < 8; i++) box(0.6, 0.9, 0.05, '#ffd06a', -10 + i * 2.6, 3 + (i % 3) * 1.2, -5.9, g);
    this.car = new THREE.Group();
    box(4.4, 0.8, 2, '#171b24', 0, 0.6, 0, this.car);
    box(2.2, 0.7, 1.8, '#f2f4f8', -0.2, 1.3, 0, this.car);
    for (const [x, z] of [[-1.3, -0.9], [1.3, -0.9], [-1.3, 0.9], [1.3, 0.9]]) cyl(0.35, 0.35, 0.25, '#1b1b20', x, 0.35, z, this.car, [Math.PI / 2, 0, 0]);
    this.car.position.set(3, 0, -2); this.car.rotation.y = -0.3; g.add(this.car);
  }

  buildFinal() {
    const g = this.sets.final;
    tbox(16, 0.3, 16, TM.wood, 0, -0.15, 0, g, 1.2);
    box(16, 8, 0.4, '#2b2b33', 0, 4, -5.2, g);
    this.finalTicket = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 4.5), new THREE.MeshBasicMaterial({ map: ticketTex(), side: THREE.DoubleSide }));
    this.finalTicket.position.set(0, 2.0, 0.8); this.finalTicket.rotation.set(-0.4, 0.2, 0.2); g.add(this.finalTicket);
  }

  update(id: number, f: number, camera: THREE.PerspectiveCamera) {
    const s = SHOTS[id - 1];
    for (const k in this.sets) this.sets[k].visible = k === s.set;
    const mid = (s.a + s.b) / 2;
    const cut = ALT[id] && f >= mid;
    const A = cut ? ALT[id] : null;
    const from = A ? { pos: A.pos, look: A.look, fov: A.fov } : s.camFrom;
    const to = A ? { pos: A.pos, look: A.look, fov: A.fov } : s.camTo;
    const u = cut ? 0.5 : Math.min(1, Math.max(0, (f - s.a) / Math.max(1, mid - s.a)));
    const t = u * u * (3 - 2 * u);
    camera.position.set(from.pos[0] + (to.pos[0] - from.pos[0]) * t, from.pos[1] + (to.pos[1] - from.pos[1]) * t, from.pos[2] + (to.pos[2] - from.pos[2]) * t);
    const look = new THREE.Vector3(from.look[0] + (to.look[0] - from.look[0]) * t, from.look[1] + (to.look[1] - from.look[1]) * t, from.look[2] + (to.look[2] - from.look[2]) * t);
    camera.lookAt(look);
    camera.fov = from.fov + (to.fov - from.fov) * t;
    camera.updateProjectionMatrix();
    const time = f / 30;
    Object.values(this.actors).forEach((x) => (x.a.mesh.visible = false));
    const place = (key: string, x: number, z: number, expr: any, facing: -1 | 0 | 1 = 0, sc = 1, mode: any = 'stand') => {
      const rec = this.actors[key]; if (!rec) return;
      const blink = (Math.floor(time * 1.7 + x) % 3) === 0;
      const walk = mode === 'stroll';
      const ph = time * (walk ? 3.2 : 1.2);
      rec.a.r = this.pool.req(`${key}-${expr}-${facing}-${blink}-${walk}`, 600, 1000, 1, (p) => bodyFront(p, rec.o, { phase: ph, expr, mode, facing, blink, light: 0.8, wave: walk ? 0 : 0.15 }));
      rec.a.mesh.visible = true;
      const wob = walk ? Math.sin(time * 2.2 + x) * 0.18 : 0;
      rec.a.mesh.position.set(x + wob, 0.02, z);
      rec.a.mesh.scale.setScalar(sc);
      rec.a.mesh.rotation.y = Math.atan2(camera.position.x - x, camera.position.z - z);
    };
    const hide = !!(cut && (id === 5 || id === 7));
    if (!hide) {
    if (id === 1) { place('worker', -1.8, 2.8, 'neutral', 0, 1, 'stroll'); place('jacobson', 2.4, 3.0, 'grin', 0, 1, 'stand'); place('crowd1', -3.6, 1.2, 'neutral', 0, 0.95, 'stroll'); place('crowd2', 4.0, 1.6, 'neutral', 0, 0.95, 'stroll'); }
    if (id === 3) { place('worker', -2.2, 2.8, 'neutral', 0, 1, 'stroll'); }
    if (id === 4) { place('jacobson', 0.2, 1.8, 'grin', 0, 1.05, 'stand'); }
    if (id === 5) { place('jacobson', -1.2, 0.0, 'grin', 0, 1, 'stand'); place('winner1', -0.1, 1.5, 'grin', 0, 1, 'stand'); place('winner2', 1.0, 1.5, 'whistle', 0, 1, 'stand'); }
    if (id === 6) { place('jacobson', 0.2, 1.7, 'grin', 0, 0.85, 'stand'); }
    if (id === 7) { place('fbi1', -0.8, 0.0, 'stern', 0, 1, 'stand'); place('fbi2', 0.8, 0.0, 'stern', 0, 1, 'stand'); }
    if (id === 8) { place('jacobson', 0, 1.6, 'shock', 0, 1, 'stroll'); place('fbi1', -1.4, 1.2, 'stern', 0, 1, 'stand'); place('crowd1', -3.2, 2.4, 'neutral', 0, 0.9, 'stroll'); place('crowd2', 3.2, 2.2, 'neutral', 0, 0.9, 'stroll'); }
    }
    this.pool.flush();
    Object.values(this.actors).forEach((x) => { if (x.a.mesh.visible) x.a.bind(); });
    this.rollers.forEach((r) => (r.rotation.y = time * 2));
    if (this.ticket) this.ticket.rotation.z = 0.06 + Math.sin(time * 1.5) * 0.04;
    this.money.forEach((m, i) => (m.position.y += Math.sin(time * 2 + i) * 0.0005));
    if (this.car) this.car.position.x = 3 + Math.sin(time * 0.5) * 0.2;
    if (this.finalTicket) { this.finalTicket.position.y = 2.6 - u * 1.2; this.finalTicket.rotation.z = 0.2 + u * 0.8; }
    return look;
  }
}
