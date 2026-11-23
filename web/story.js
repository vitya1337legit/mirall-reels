// web/story.js
export const STORY = {
  fps: 30,
  totalFrames: 1350,
  width: 1080,
  height: 1920,
  shots: [
    // 0–170 — типография, низкий угол
    {
      id: 1,
      name: 'Типография: низкий угол на печатный пресс, конвейер и Джекобсона',
      startFrame: 0,
      endFrame: 170,
      set: 'printshop',
      light: 'printshop_red',
      grade: { sat: 1.12, vig: 0.26, px: 2.4 },
      camFrom: { pos: [5.2, 2.8, 9.8], look: [0.2, 1.8, 1.2], fov: 48 },
      camTo: { pos: [4.2, 2.4, 8.4], look: [0.2, 1.8, 1.2], fov: 44 },
      actors: {
        jacobson: { x: 1.6, y: 0, z: 3.2, emotion: 'smirk', speaking: true, walking: true },
        worker1: { x: -2.45, y: 0, z: -0.4, emotion: 'neutral', speaking: false, walking: true },
        worker2: { x: 2.85, y: 0, z: -1.4, emotion: 'neutral', speaking: false },
      },
    },
    // 170–340 — макро билета
    {
      id: 2,
      name: 'Макро билета: перфорация, WIN, $1 000 000, тиснение',
      startFrame: 170,
      endFrame: 340,
      set: 'macroTicket',
      light: 'macro_spot',
      grade: { sat: 1.15, vig: 0.2, px: 2.2 },
      camFrom: { pos: [0.0, 3.2, 5.2], look: [0.0, 0.55, 0.4], fov: 40 },
      camTo: { pos: [0.25, 2.8, 4.4], look: [0.0, 0.55, 0.4], fov: 36 },
      actors: {},
    },
    // 340–520 — валы и бумага
    {
      id: 3,
      name: 'Валы и бумага: печатный процесс и начальник охраны у ленты',
      startFrame: 340,
      endFrame: 520,
      set: 'printshop',
      light: 'printshop_red',
      grade: { sat: 1.12, vig: 0.25, px: 2.35 },
      camFrom: { pos: [2.2, 1.65, 3.1], look: [-0.2, 2.45, -1.1], fov: 38 },
      camTo: { pos: [1.15, 2.15, 1.85], look: [-0.1, 2.65, -1.25], fov: 31 },
      actors: {
        jacobson: { x: -1.35, y: 0, z: 0.85, emotion: 'persuade', speaking: true },
        worker1: { x: -3.1, y: 0, z: -1.5, emotion: 'neutral', speaking: false },
      },
    },
    // 520–720 — офис, Джекобсон
    {
      id: 4,
      name: 'Офис Джекобсона: стол, сейф, пачки денег, лампа, карта США',
      startFrame: 520,
      endFrame: 720,
      set: 'office',
      light: 'warm_office',
      grade: { sat: 1.1, vig: 0.26, px: 2.35 },
      camFrom: { pos: [3.0, 2.4, 6.6], look: [0.2, 1.25, 1.2], fov: 42 },
      camTo: { pos: [2.0, 2.1, 5.4], look: [0.2, 1.25, 1.2], fov: 38 },
      actors: {
        jacobson: { x: 0.2, y: 0, z: 1.6, emotion: 'triumph', speaking: true },
      },
    },
    // 720–930 — билеты/конверты/деньги (схема с подставными победителями)
    {
      id: 5,
      name: 'Схема: Джекобсон отдаёт билеты подставным победителям за пачки денег',
      startFrame: 720,
      endFrame: 930,
      set: 'scheme',
      light: 'warm_office',
      grade: { sat: 1.12, vig: 0.24, px: 2.35 },
      camFrom: { pos: [0.0, 2.0, 6.4], look: [0.0, 1.15, 1.3], fov: 46 },
      camTo: { pos: [0.0, 1.8, 5.2], look: [0.0, 1.1, 1.3], fov: 42 },
      actors: {
        jacobson: { x: -1.5, y: 0, z: 1.5, emotion: 'smirk', speaking: true },
        winner1: { x: -0.35, y: 0, z: 1.5, emotion: 'triumph', speaking: false, walking: true },
        winner2: { x: 0.9, y: 0, z: 1.5, emotion: 'persuade', speaking: true, walking: true },
        winner3: { x: 2.0, y: 0, z: 1.8, emotion: 'shock', speaking: false },
      },
    },
    // 930–1090 — $24 000 000
    {
      id: 6,
      name: '$24 000 000: стены из денег и счётчик 12 лет',
      startFrame: 930,
      endFrame: 1090,
      set: 'vault24m',
      light: 'gold_vault',
      grade: { sat: 1.16, vig: 0.22, px: 2.3 },
      camFrom: { pos: [0.0, 3.0, 8.6], look: [0.0, 4.2, -3.2], fov: 50 },
      camTo: { pos: [0.0, 3.4, 7.2], look: [0.0, 4.3, -3.2], fov: 46 },
      actors: {
        jacobson: { x: 0.0, y: 0, z: -1.35, emotion: 'triumph', speaking: false },
      },
    },
    // 1090–1210 — ФБР
    {
      id: 7,
      name: 'ФБР: стол, папки, жетон «ФБР», холодная лампа, агенты',
      startFrame: 1090,
      endFrame: 1210,
      set: 'fbiRoom',
      light: 'cold_fbi',
      grade: { sat: 1.05, vig: 0.26, px: 2.4 },
      camFrom: { pos: [0.0, 2.4, 7.0], look: [0.0, 1.35, 1.0], fov: 46 },
      camTo: { pos: [0.0, 2.1, 6.0], look: [0.0, 1.3, 1.0], fov: 42 },
      actors: {
        fbi1: { x: -1.15, y: 0, z: 1.4, emotion: 'strict', speaking: true, walking: true },
        fbi2: { x: 1.15, y: 0, z: 1.4, emotion: 'angry', speaking: false, walking: true },
        winner3: { x: 2.3, y: 0, z: 1.7, emotion: 'shock', speaking: false },
      },
    },
    // 1210–1300 — арест
    {
      id: 8,
      name: 'Арест 2001: ночная улица, полицейская машина, наручники, толпа',
      startFrame: 1210,
      endFrame: 1300,
      set: 'arrestStreet',
      light: 'street_neon',
      grade: { sat: 1.14, vig: 0.28, px: 2.4 },
      camFrom: { pos: [1.0, 2.6, 8.6], look: [0.0, 1.15, -0.6], fov: 50 },
      camTo: { pos: [0.6, 2.2, 7.4], look: [0.0, 1.15, -0.6], fov: 46 },
      actors: {
        jacobson: { x: 0.0, y: 0, z: -0.25, emotion: 'shock', speaking: false, cuffed: true },
        fbi1: { x: -1.25, y: 0, z: -0.45, emotion: 'strict', speaking: true },
        fbi2: { x: 1.25, y: 0, z: -0.55, emotion: 'strict', speaking: false },
        winner1: { x: -2.4, y: 0, z: -1.6, emotion: 'shock', speaking: false },
        winner2: { x: 2.55, y: 0, z: -1.7, emotion: 'shock', speaking: false },
      },
    },
    // 1300–1350 — финал
    {
      id: 9,
      name: 'Финал: билет падает, «3 года», «деньги не вернули»',
      startFrame: 1300,
      endFrame: 1350,
      set: 'finaleSet',
      light: 'gold_vault',
      grade: { sat: 1.12, vig: 0.26, px: 2.35 },
      camFrom: { pos: [0.0, 3.8, 11.0], look: [0.0, 2.3, -1.8], fov: 52 },
      camTo: { pos: [0.0, 3.4, 10.0], look: [0.0, 2.2, -1.8], fov: 48 },
      actors: {},
    },
  ],
};

const ALT = {
  1: { pos: [3.4, 1.25, 6.4], look: [0.0, 1.9, 1.2], fov: 50 },
  2: { pos: [0.0, 4.6, 3.4], look: [0.0, 0.6, 0.5], fov: 42 },
  3: { pos: [3.8, 1.9, 4.8], look: [0.0, 2.1, 0.3], fov: 44 },
  4: { pos: [1.9, 1.75, 3.9], look: [0.2, 1.3, 1.3], fov: 42 },
  5: { pos: [0.0, 1.65, 4.1], look: [0.0, 1.15, 1.3], fov: 44 },
  6: { pos: [0.0, 0.95, 6.2], look: [0.0, 3.6, -3.0], fov: 52 },
  7: { pos: [0.0, 1.85, 3.7], look: [0.0, 1.55, 1.1], fov: 38 },
  8: { pos: [3.2, 1.15, 5.2], look: [0.0, 1.2, -0.1], fov: 46 },
  9: { pos: [0.0, 3.2, 9.0], look: [0.0, 2.1, -1.4], fov: 50 },
};

function smoothstep(t) {
  return t * t * (3 - 2 * t);
}

export function applyFrame(frame, camera, world) {
  const shot =
    STORY.shots.find((s) => frame >= s.startFrame && frame < s.endFrame) ||
    STORY.shots[STORY.shots.length - 1];

  const mid = (shot.startFrame + shot.endFrame) / 2;
  const alt = ALT[shot.id];
  const useAlt = !!(alt && frame >= mid);
  const halfStart = useAlt ? mid : shot.startFrame;
  const halfEnd = useAlt ? shot.endFrame : mid;
  const rawT = Math.min(1, Math.max(0, (frame - halfStart) / Math.max(1, halfEnd - halfStart)));
  const t = smoothstep(rawT);
  const timeSec = frame / STORY.fps;
  const cf = useAlt ? alt : shot.camFrom;
  const ct = useAlt ? alt : shot.camTo;

  // Лёгкое кинематографическое дыхание камеры
  const driftX = Math.sin(frame * 0.045) * 0.022;
  const driftY = Math.cos(frame * 0.035) * 0.016;

  camera.position.set(
    cf.pos[0] + (ct.pos[0] - cf.pos[0]) * t + driftX,
    cf.pos[1] + (ct.pos[1] - cf.pos[1]) * t + driftY,
    cf.pos[2] + (ct.pos[2] - cf.pos[2]) * t
  );
  camera.fov = cf.fov + (ct.fov - cf.fov) * t;
  camera.updateProjectionMatrix();

  const lookTarget = [
    cf.look[0] + (ct.look[0] - cf.look[0]) * t,
    cf.look[1] + (ct.look[1] - cf.look[1]) * t,
    cf.look[2] + (ct.look[2] - cf.look[2]) * t,
  ];
  camera.lookAt(lookTarget[0], lookTarget[1], lookTarget[2]);

  world.setActiveSet(shot.set);
  world.setLightingMode(shot.light, timeSec);

  // Анимация элементов внутри сцен
  if (shot.set === 'printshop') {
    world.rollerTop.rotation.x = timeSec * 3.4;
    world.rollerBot.rotation.x = -timeSec * 3.4;
    world.webArch.material.map.offset.y = -(timeSec * 0.55) % 1;
    world.steamPuffs.forEach((p, idx) => {
      const cycle = (timeSec * 0.65 + idx * 0.17) % 1;
      p.position.y = 3.5 + cycle * 2.4;
      p.position.x = -1.8 + (idx % 5) * 0.9 + Math.sin(timeSec * 2 + idx) * 0.18;
      const sc = 0.6 + Math.sin(cycle * Math.PI) * 0.7;
      p.scale.setScalar(sc);
    });
  } else if (shot.set === 'macroTicket') {
    world.heroTicketGroup.rotation.y = 0.12 + Math.sin(timeSec * 1.6) * 0.14;
    world.heroTicketGroup.rotation.z = -0.06 + Math.cos(timeSec * 1.4) * 0.05;
    world.heroTicketGroup.position.y = 0.56 + Math.sin(timeSec * 2.2) * 0.03;
  } else if (shot.set === 'scheme') {
    world.schemeEnvelopes.forEach((env, idx) => {
      env.position.x = -0.35 + idx * 0.42 + Math.sin(timeSec * 2.4 + idx) * 0.18;
    });
  } else if (shot.set === 'vault24m') {
    world.moneyTowers.forEach((tw) => {
      const grow = 0.72 + 0.28 * Math.min(1, rawT * 1.35);
      tw.scale.y = grow;
      tw.position.y = 0.16 + (tw.userData.baseH * grow) * 0.5;
    });
  } else if (shot.set === 'fbiRoom') {
    world.fbiBadgeMesh.position.y = 1.52 + Math.sin(timeSec * 2.6) * 0.03;
    world.fbiBadgeMesh.rotation.y = -0.14 + Math.sin(timeSec * 1.8) * 0.08;
  } else if (shot.set === 'arrestStreet') {
    const flash = Math.sin(timeSec * 14) > 0;
    world.sirenRed.material.color.set(flash ? '#ff2b22' : '#4a1010');
    world.sirenBlue.material.color.set(!flash ? '#2b88ff' : '#10244a');
  } else if (shot.set === 'finaleSet') {
    world.fallingTicket.position.y = 2.35 - rawT * 1.45;
    world.fallingTicket.rotation.x = 0.35 + rawT * 1.15;
    world.fallingTicket.rotation.z = Math.sin(rawT * Math.PI * 2) * 0.28;
    world.fallingTicket.rotation.y = rawT * 0.65;
  }

  // Персонажи
  Object.entries(world.chars).forEach(([key, charObj]) => {
    const cfg = shot.actors[key];
    if (!cfg) {
      charObj.mesh.visible = false;
      return;
    }
    charObj.mesh.visible = true;
    charObj.mesh.position.set(cfg.x, cfg.y ?? 0, cfg.z);
    charObj.state.emotion = cfg.emotion || 'neutral';
    charObj.state.speaking = !!cfg.speaking;
    charObj.state.walking = !!cfg.walking;
    charObj.state.cuffed = !!cfg.cuffed;
    charObj.update(timeSec, camera);
  });

  return shot.grade;
}