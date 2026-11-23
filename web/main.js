// web/main.js
import * as THREE from 'three';
import { toonMat } from './toon.js';
import {
  paintConcreteTexture,
  paintBrickWallTexture,
  paintPressRollerTexture,
  paintTicketWebTexture,
  paintMacroTicketTexture,
  paintDollarTexture,
  paintWoodDeskTexture,
  paintUsaMapTexture,
  paintFbiBadgeTexture,
  paintCounterDisplayTexture,
  paintAsphaltTexture,
} from './paint.js';
import { createRomanFrontCharacter } from './roman.js';
import { STORY } from './story.js';

export function buildWorld(scene, renderer) {
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;

  const M = {
    concrete: toonMat({ map: paintConcreteTexture(5, 5) }),
    brick: toonMat({ map: paintBrickWallTexture(5, 3) }),
    steel: toonMat({ color: '#6b7582' }),
    darkSteel: toonMat({ color: '#2b3038' }),
    brass: toonMat({ color: '#d9a83b' }),
    roller: toonMat({ map: paintPressRollerTexture() }),
    ticketWeb: toonMat({ map: paintTicketWebTexture(), side: THREE.DoubleSide }),
    macroTicket: toonMat({ map: paintMacroTicketTexture('INSTANT WINNER • 1995'), side: THREE.DoubleSide }),
    finalTicket: toonMat({ map: paintMacroTicketTexture('3 ГОДА • ДЕНЬГИ НЕ ВЕРНУЛИ'), side: THREE.DoubleSide }),
    dollar: toonMat({ map: paintDollarTexture(2, 2) }),
    woodDesk: toonMat({ map: paintWoodDeskTexture(2, 2) }),
    woodDark: toonMat({ color: '#3b2414' }),
    paperStack: toonMat({ color: '#ebe2ce' }),
    folderTan: toonMat({ color: '#d4b475' }),
    redLamp: new THREE.MeshBasicMaterial({ color: '#ff2b22' }),
    warmLamp: new THREE.MeshBasicMaterial({ color: '#ffd98a' }),
    coldLamp: new THREE.MeshBasicMaterial({ color: '#bfe2ff' }),
    neonRed: new THREE.MeshBasicMaterial({ color: '#ff362b' }),
    neonBlue: new THREE.MeshBasicMaterial({ color: '#3388ff' }),
    fbiBadge: toonMat({ map: paintFbiBadgeTexture(), transparent: true, alphaTest: 0.2, side: THREE.DoubleSide }),
    usaMap: toonMat({ map: paintUsaMapTexture() }),
    asphalt: toonMat({ map: paintAsphaltTexture(6, 6) }),
    policeBody: toonMat({ color: '#171b24' }),
    policeWhite: toonMat({ color: '#f2f4f8' }),
    glassDark: toonMat({ color: '#1b2c3d' }),
  };

  function addBox(w, h, d, mat, x, y, z, parent) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }

  function addCyl(rt, rb, h, segs, mat, x, y, z, parent) {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, segs), mat);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }

  // Группы 3D-сетов
  const sets = {
    printshop: new THREE.Group(),
    macroTicket: new THREE.Group(),
    office: new THREE.Group(),
    scheme: new THREE.Group(),
    vault24m: new THREE.Group(),
    fbiRoom: new THREE.Group(),
    arrestStreet: new THREE.Group(),
    finaleSet: new THREE.Group(),
  };
  Object.values(sets).forEach((g) => scene.add(g));

  // =========================================================================
  // СЕТ 1: ТИПОГРАФИЯ (два огромных вала, полотно, конвейер, стопки, красные лампы, пар)
  // =========================================================================
  const ps = sets.printshop;
  addBox(22, 0.4, 22, M.concrete, 0, -0.2, 0, ps);
  addBox(22, 9, 0.5, M.brick, 0, 4.5, -6.5, ps);
  addBox(0.5, 9, 22, M.brick, -8.5, 4.5, 0, ps);
  addBox(0.5, 9, 22, M.brick, 8.5, 4.5, 0, ps);

  // Станина печатного пресса
  addBox(4.8, 4.6, 3.2, M.darkSteel, 0, 2.3, -1.6, ps);
  addBox(5.4, 0.45, 3.6, M.steel, 0, 0.22, -1.6, ps);
  [-2.2, 2.2].forEach((sx) => {
    addBox(0.35, 5.2, 2.8, M.steel, sx, 2.6, -1.6, ps);
  });

  // Два огромных печатных вала
  const rollerTop = addCyl(0.78, 0.78, 3.8, 28, M.roller, 0, 3.55, -1.35, ps);
  rollerTop.rotation.z = Math.PI / 2;
  const rollerBot = addCyl(0.78, 0.78, 3.8, 28, M.roller, 0, 1.92, -1.35, ps);
  rollerBot.rotation.z = Math.PI / 2;

  // Бумажное полотно с билетами, выходящее из валов на конвейер
  const webArch = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 3.8, 1, 16), M.ticketWeb);
  webArch.position.set(0, 2.65, 0.2);
  webArch.rotation.x = 0.68;
  webArch.castShadow = true;
  ps.add(webArch);

  // Конвейерная лента и ролики (10+ пропсов)
  addBox(3.8, 0.35, 6.2, M.darkSteel, 0, 1.05, 2.6, ps);
  for (let z = -0.2; z <= 5.4; z += 0.55) {
    const r = addCyl(0.11, 0.11, 3.6, 12, M.steel, 0, 1.24, z, ps);
    r.rotation.z = Math.PI / 2;
  }
  [-1.7, 1.7].forEach((lx) => {
    [0.2, 2.6, 5.0].forEach((lz) => {
      addBox(0.2, 1.1, 0.2, M.darkSteel, lx, 0.55, lz, ps);
    });
  });

  // Паллеты и высокие стопки отпечатанных листов
  [
    [-4.4, 1.6, 2.1],
    [-4.4, 3.6, 1.6],
    [4.3, 1.2, 2.4],
    [4.5, 3.4, 1.8],
    [-3.8, -3.4, 2.6],
    [3.9, -3.2, 2.2],
  ].forEach(([px, pz, h]) => {
    addBox(1.6, 0.18, 1.4, M.woodDark, px, 0.09, pz, ps);
    addBox(1.45, h, 1.25, M.paperStack, px, 0.18 + h * 0.5, pz, ps);
  });

  // Индустриальные трубы и вентиляция
  [-5.8, 5.8].forEach((tx) => {
    addCyl(0.24, 0.24, 8.5, 14, M.steel, tx, 4.2, -5.6, ps);
    const hPipe = addCyl(0.2, 0.2, 11, 14, M.steel, tx, 6.2, -0.5, ps);
    hPipe.rotation.x = Math.PI / 2;
  });

  // Красные сигнальные лампы над цехом
  const redLamps = [];
  [-3.2, 0, 3.2].forEach((lx) => {
    addCyl(0.06, 0.06, 1.6, 8, M.darkSteel, lx, 6.8, 0.6, ps);
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.24, 14, 14), M.redLamp);
    bulb.position.set(lx, 5.95, 0.6);
    bulb.userData.ndSkip = true;
    ps.add(bulb);
    redLamps.push(bulb);
  });

  // Клубы пара (объёмные toon-сферы над прессом, двигаются в анимации)
  const steamPuffs = [];
  for (let i = 0; i < 12; i++) {
    const puff = new THREE.Mesh(
      new THREE.DodecahedronGeometry(0.32 + (i % 3) * 0.14, 1),
      toonMat({ color: '#8d96a6' })
    );
    puff.position.set(-1.8 + (i % 5) * 0.9, 3.8 + (i % 4) * 0.55, -1.8);
    ps.add(puff);
    steamPuffs.push(puff);
  }

  // =========================================================================
  // СЕТ 2: МАКРО БИЛЕТА (3D-билет с перфорацией, тиснением, WIN, $1 000 000, пропсы стола)
  // =========================================================================
  const mt = sets.macroTicket;
  addBox(14, 0.4, 14, M.woodDesk, 0, -0.2, 0, mt);
  addBox(14, 8, 0.4, M.brick, 0, 4, -5.5, mt);

  // Главный 3D-билет с объёмной толщиной и подложкой
  const heroTicketGroup = new THREE.Group();
  const ticketBacking = addBox(1.56, 0.04, 2.32, M.paperStack, 0, 0, 0, heroTicketGroup);
  const ticketFace = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 2.24), M.macroTicket);
  ticketFace.rotation.x = -Math.PI / 2;
  ticketFace.position.y = 0.024;
  ticketFace.userData.ndSkip = true;
  heroTicketGroup.add(ticketFace);
  heroTicketGroup.position.set(0, 0.55, 0.4);
  heroTicketGroup.rotation.set(0.55, 0.12, -0.06);
  mt.add(heroTicketGroup);

  // Окружение на монтажном столе типографии (10+ пропсов вокруг билета)
  for (let i = 0; i < 6; i++) {
    const tCopy = addBox(1.3, 0.03, 1.9, M.paperStack, -2.2 + (i % 2) * 4.4, 0.02 + Math.floor(i / 2) * 0.035, -0.8 + Math.floor(i / 2) * 0.9, mt);
    tCopy.rotation.y = (i - 2.5) * 0.16;
  }
  // Лупа криминалиста / печатника
  const loupe = new THREE.Group();
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.05, 10, 24), M.brass);
  rim.rotation.x = Math.PI / 2;
  loupe.add(rim);
  const handle = addCyl(0.045, 0.055, 0.75, 10, M.woodDark, 0.55, -0.02, 0.55, loupe);
  handle.rotation.z = Math.PI / 2;
  handle.rotation.y = -Math.PI / 4;
  loupe.position.set(-1.35, 0.08, 1.15);
  mt.add(loupe);

  // Красный штамп, линейка, пачка купюр, карандаши
  addCyl(0.16, 0.2, 0.36, 14, M.woodDark, 1.45, 0.18, 1.05, mt);
  addBox(2.4, 0.03, 0.24, M.steel, 0.2, 0.02, -1.45, mt).rotation.y = 0.08;
  addBox(0.75, 0.34, 0.36, M.dollar, 1.65, 0.17, -0.55, mt).rotation.y = -0.25;
  addBox(0.75, 0.34, 0.36, M.dollar, 1.72, 0.51, -0.52, mt).rotation.y = -0.18;

  // =========================================================================
  // СЕТ 3: ОФИС ДЖЕКОБСОНА (стол, сейф, пачки денег, лампа, окно, карта США)
  // =========================================================================
  const of = sets.office;
  addBox(14, 0.4, 14, M.woodDark, 0, -0.2, 0, of);
  addBox(14, 7.5, 0.4, toonMat({ color: '#473c33' }), 0, 3.75, -4.8, of);
  addBox(0.4, 7.5, 14, toonMat({ color: '#3b322b' }), -5.8, 3.75, 0, of);

  // Окно с жалюзи и ночным видом
  addBox(3.4, 2.8, 0.2, M.glassDark, -2.4, 3.2, -4.55, of);
  for (let by = 2.0; by <= 4.4; by += 0.28) {
    addBox(3.2, 0.05, 0.14, M.brass, -2.4, by, -4.42, of).rotation.x = 0.35;
  }

  // Карта США со схемой городов на стене
  addBox(3.8, 2.1, 0.12, M.usaMap, 2.2, 3.3, -4.55, of);

  // Массивный сейф начальника охраны
  const safeGroup = new THREE.Group();
  addBox(1.8, 2.4, 1.5, M.darkSteel, 0, 1.2, 0, safeGroup);
  addBox(1.56, 2.16, 0.14, M.steel, 0, 1.2, 0.78, safeGroup);
  const wheel = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.04, 8, 18), M.brass);
  wheel.position.set(0.25, 1.25, 0.9);
  safeGroup.add(wheel);
  safeGroup.position.set(-3.6, 0, -2.8);
  safeGroup.rotation.y = 0.35;
  of.add(safeGroup);

  // Письменный стол Джекобсона + пачки денег, билеты, настольная лампа, папки (12+ пропсов)
  addBox(3.6, 0.18, 1.7, M.woodDesk, 0.4, 1.05, 0.5, of);
  [-1.1, 1.9].forEach((lx) => {
    [-0.1, 1.1].forEach((lz) => {
      addBox(0.22, 1.05, 0.22, M.woodDark, lx, 0.52, lz, of);
    });
  });

  // Зелёная настольная лампа
  addCyl(0.18, 0.24, 0.08, 14, M.brass, -0.95, 1.18, 0.2, of);
  addCyl(0.03, 0.03, 0.55, 10, M.brass, -0.95, 1.46, 0.2, of);
  const shade = addBox(0.55, 0.22, 0.32, toonMat({ color: '#1f6e43' }), -0.95, 1.74, 0.2, of);
  const warmGlow = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 10), M.warmLamp);
  warmGlow.position.set(-0.95, 1.65, 0.2);
  warmGlow.userData.ndSkip = true;
  of.add(warmGlow);

  // Пачки долларов и папка с билетами на столе
  for (let i = 0; i < 8; i++) {
    const stack = addBox(0.46, 0.22, 0.24, M.dollar, 0.2 + (i % 4) * 0.48, 1.24 + Math.floor(i / 4) * 0.22, 0.35 + (i % 2) * 0.34, of);
    stack.rotation.y = (i - 3.5) * 0.12;
  }
  addBox(0.65, 0.06, 0.85, M.folderTan, -0.25, 1.17, 0.72, of).rotation.y = 0.2;
  addBox(0.5, 0.02, 0.72, M.macroTicket, -0.22, 1.21, 0.72, of).rotation.y = 0.25;

  // =========================================================================
  // СЕТ 4: СХЕМА (стол передачи, конверты с билетами, пачки наличных, кейс)
  // =========================================================================
  const sc = sets.scheme;
  addBox(16, 0.4, 16, toonMat({ color: '#3b332d' }), 0, -0.2, 0, sc);
  addBox(16, 7.5, 0.4, toonMat({ color: '#594b3e' }), 0, 3.75, -5.2, sc);
  addBox(3.6, 2.2, 0.12, M.usaMap, 0, 3.4, -4.95, sc);

  // Длинный стол переговоров / передачи билетов
  addBox(4.8, 0.18, 1.8, M.woodDesk, 0, 1.02, 0.3, sc);
  [-2.1, 2.1].forEach((lx) => {
    addBox(0.24, 1.02, 1.4, M.woodDark, lx, 0.51, 0.3, sc);
  });

  // Открытый дипломат с деньгами
  addBox(1.1, 0.24, 0.75, M.darkSteel, -1.35, 1.23, 0.3, sc);
  const caseLid = addBox(1.1, 0.72, 0.08, M.darkSteel, -1.35, 1.66, -0.05, sc);
  caseLid.rotation.x = -0.25;
  for (let b = 0; b < 6; b++) {
    addBox(0.32, 0.16, 0.2, M.dollar, -1.6 + (b % 3) * 0.32, 1.38, 0.18 + Math.floor(b / 3) * 0.26, sc);
  }

  // Анимируемые конверты и выигрышные билеты на столе (12+ пропсов)
  const schemeEnvelopes = [];
  for (let i = 0; i < 6; i++) {
    const env = addBox(0.56, 0.05, 0.38, M.folderTan, -0.2 + i * 0.42, 1.14 + (i % 2) * 0.05, 0.2 + (i % 3) * 0.24, sc);
    env.rotation.y = (i - 2.5) * 0.22;
    schemeEnvelopes.push(env);
  }
  for (let i = 0; i < 4; i++) {
    const tk = addBox(0.36, 0.02, 0.52, M.macroTicket, 0.4 + i * 0.38, 1.16, 0.65, sc);
    tk.rotation.y = -0.3 + i * 0.18;
  }

  // =========================================================================
  // СЕТ 5: $24 000 000 (стены из денег, паллеты купюр, 3D-счётчик 12 ЛЕТ / $24 000 000)
  // =========================================================================
  const v24 = sets.vault24m;
  addBox(18, 0.4, 18, M.darkSteel, 0, -0.2, 0, v24);
  addBox(18, 9, 0.4, toonMat({ color: '#1b2029' }), 0, 4.5, -5.8, v24);

  // Огромное электронное табло «12 ЛЕТ / $24 000 000»
  const counterTex = paintCounterDisplayTexture('12 ЛЕТ • 1989–2001', '$24 000 000', '#ff3b30');
  const counterBoard = addBox(5.2, 2.5, 0.28, toonMat({ map: counterTex }), 0, 4.8, -3.4, v24);

  // Стены и башни из пачек денег (24+ массивных блока наличных)
  const moneyTowers = [];
  const positions = [
    [-3.4, -2.4, 3.8],
    [-2.1, -2.7, 4.4],
    [2.1, -2.7, 4.4],
    [3.4, -2.4, 3.8],
    [-2.8, -0.5, 2.4],
    [2.8, -0.5, 2.4],
    [-1.4, -0.8, 1.5],
    [1.4, -0.8, 1.5],
    [-2.3, 1.3, 1.1],
    [2.3, 1.3, 1.1],
    [-3.7, 0.8, 2.9],
    [3.7, 0.8, 2.9],
  ];
  positions.forEach(([mx, mz, mh], idx) => {
    addBox(1.15, 0.16, 1.15, M.woodDark, mx, 0.08, mz, v24);
    const tower = addBox(1.06, mh, 1.06, M.dollar, mx, 0.16 + mh * 0.5, mz, v24);
    tower.userData.baseH = mh;
    tower.userData.idx = idx;
    moneyTowers.push(tower);
  });

  // =========================================================================
  // СЕТ 6: ФБР (стол, папки дел, 3D-жетон ФБР с надписью, холодная лампа, доска улик)
  // =========================================================================
  const fbi = sets.fbiRoom;
  addBox(16, 0.4, 16, toonMat({ color: '#2b323d' }), 0, -0.2, 0, fbi);
  addBox(16, 8, 0.4, toonMat({ color: '#394352' }), 0, 4, -5.2, fbi);

  // Доска расследования ФБР на стене
  addBox(4.4, 2.3, 0.14, toonMat({ color: '#dfe4ec' }), 0, 3.5, -4.9, fbi);
  addBox(1.1, 0.8, 0.05, M.usaMap, -1.2, 3.7, -4.8, fbi);
  addBox(0.9, 1.1, 0.05, M.macroTicket, 0.2, 3.6, -4.8, fbi);
  addBox(1.1, 0.8, 0.05, M.folderTan, 1.4, 3.5, -4.8, fbi);

  // Стол допросной / штаба ФБР
  addBox(4.6, 0.18, 1.9, M.steel, 0, 1.02, 0.4, fbi);
  [-1.9, 1.9].forEach((lx) => {
    addBox(0.22, 1.02, 1.5, M.darkSteel, lx, 0.51, 0.4, fbi);
  });

  // Подвесная холодная лампа
  addCyl(0.05, 0.05, 2.2, 8, M.darkSteel, 0, 5.4, 0.4, fbi);
  addBox(2.2, 0.16, 0.48, M.darkSteel, 0, 4.25, 0.4, fbi);
  const coldBulb = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.08, 0.36), M.coldLamp);
  coldBulb.position.set(0, 4.14, 0.4);
  coldBulb.userData.ndSkip = true;
  fbi.add(coldBulb);

  // 3D-жетон ФБР на первом плане (крупный, читаемый)
  const fbiBadgeMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.92, 1.15), M.fbiBadge);
  fbiBadgeMesh.position.set(0.15, 1.52, 1.12);
  fbiBadgeMesh.rotation.set(-0.32, -0.14, 0.04);
  fbiBadgeMesh.userData.ndSkip = true;
  fbi.add(fbiBadgeMesh);

  // Стопки папок ФБР, билеты-улики и диктофон на столе (12+ пропсов)
  for (let i = 0; i < 6; i++) {
    const fldr = addBox(0.68, 0.14, 0.88, M.folderTan, -1.45 + (i % 2) * 0.78, 1.18 + Math.floor(i / 2) * 0.14, 0.25 + (i % 2) * 0.22, fbi);
    fldr.rotation.y = (i - 2) * 0.14;
  }
  addBox(0.45, 0.02, 0.64, M.macroTicket, 0.95, 1.12, 0.55, fbi).rotation.y = 0.24;
  addBox(0.45, 0.02, 0.64, M.macroTicket, 1.25, 1.13, 0.35, fbi).rotation.y = -0.18;
  addBox(0.32, 0.12, 0.48, M.darkSteel, -0.45, 1.17, 0.85, fbi);

  // =========================================================================
  // СЕТ 7: АРЕСТ (улица, полицейская машина, мигалки, фонари, здания, неон)
  // =========================================================================
  const ar = sets.arrestStreet;
  addBox(28, 0.4, 28, M.asphalt, 0, -0.2, 0, ar);
  addBox(28, 0.25, 6, M.concrete, 0, 0.12, -5.5, ar);

  // Здания на заднем плане улицы + неоновые вывески
  [
    [-6.5, -9.5, 5.5, 8.5, 4.5, '#2b3240'],
    [0.0, -10.2, 6.2, 9.5, 4.5, '#332b38'],
    [6.6, -9.5, 5.5, 8.2, 4.5, '#26343d'],
  ].forEach(([bx, bz, bw, bh, bd, col], idx) => {
    addBox(bw, bh, bd, toonMat({ color: col }), bx, bh * 0.5, bz, ar);
    for (let wy = 2.2; wy < bh - 1.2; wy += 1.6) {
      [-1.4, 0, 1.4].forEach((wx) => {
        addBox(0.75, 1.0, 0.12, idx === 1 ? M.warmLamp : M.glassDark, bx + wx, wy, bz + bd * 0.5 + 0.04, ar);
      });
    }
  });

  // Неоновые вывески
  const sign1 = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.65, 0.16), M.neonRed);
  sign1.position.set(-4.2, 4.2, -7.1);
  sign1.userData.ndSkip = true;
  ar.add(sign1);

  const sign2 = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.65, 0.16), M.neonBlue);
  sign2.position.set(4.5, 4.6, -7.1);
  sign2.userData.ndSkip = true;
  ar.add(sign2);

  // Уличные фонари и гидрант (12+ пропсов)
  [-4.8, 4.8].forEach((lx) => {
    addCyl(0.09, 0.13, 4.8, 10, M.darkSteel, lx, 2.4, -3.2, ar);
    const globe = new THREE.Mesh(new THREE.SphereGeometry(0.28, 12, 12), M.warmLamp);
    globe.position.set(lx, 4.95, -3.2);
    globe.userData.ndSkip = true;
    ar.add(globe);
  });
  addCyl(0.18, 0.22, 0.72, 10, toonMat({ color: '#c42b22' }), -3.4, 0.48, -3.0, ar);

  // Полицейская машина 2001 года
  const copCar = new THREE.Group();
  addBox(4.4, 0.85, 1.95, M.policeBody, 0, 0.65, 0, copCar);
  addBox(1.8, 0.86, 1.98, M.policeWhite, 0, 0.65, 0, copCar);
  addBox(2.2, 0.72, 1.72, M.policeWhite, -0.15, 1.38, 0, copCar);
  addBox(2.05, 0.56, 1.76, M.glassDark, -0.15, 1.38, 0, copCar);
  [
    [-1.35, -0.96],
    [1.35, -0.96],
    [-1.35, 0.96],
    [1.35, 0.96],
  ].forEach(([wx, wz]) => {
    const tire = addCyl(0.38, 0.38, 0.26, 16, M.darkSteel, wx, 0.38, wz, copCar);
    tire.rotation.x = Math.PI / 2;
  });

  // Мигалка на крыше
  const sirenRed = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.18, 0.55), M.neonRed);
  sirenRed.position.set(-0.15, 1.84, -0.35);
  sirenRed.userData.ndSkip = true;
  copCar.add(sirenRed);

  const sirenBlue = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.18, 0.55), M.neonBlue);
  sirenBlue.position.set(-0.15, 1.84, 0.35);
  sirenBlue.userData.ndSkip = true;
  copCar.add(sirenBlue);

  copCar.position.set(2.3, 0, -1.6);
  copCar.rotation.y = -0.32;
  ar.add(copCar);

  // =========================================================================
  // СЕТ 8: ФИНАЛ (падающий билет «3 ГОДА / ДЕНЬГИ НЕ ВЕРНУЛИ», 3D-табло приговора, пропсы)
  // =========================================================================
  const fn = sets.finaleSet;
  addBox(16, 0.4, 16, M.concrete, 0, -0.2, 0, fn);
  addBox(16, 8, 0.4, M.brick, 0, 4, -5.2, fn);

  const verdictTex = paintCounterDisplayTexture('ПРИГОВОР: 3 ГОДА', '$24 МЛН НЕ ВЕРНУЛИ', '#ffd43b');
  addBox(4.8, 2.2, 0.24, toonMat({ map: verdictTex }), 0, 3.6, -3.6, fn);

  // Падающий в слоу-мо выигрышный билет в центре кадра
  const fallingTicket = new THREE.Group();
  addBox(1.35, 0.035, 2.05, M.paperStack, 0, 0, 0, fallingTicket);
  const fFace = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 1.98), M.finalTicket);
  fFace.rotation.x = -Math.PI / 2;
  fFace.position.y = 0.022;
  fFace.userData.ndSkip = true;
  fallingTicket.add(fFace);
  fallingTicket.position.set(0, 1.75, 0.8);
  fn.add(fallingTicket);

  // Вокруг на полу — рассыпанные папки дел, пустые мешки и пачки купюр (10+ пропсов)
  for (let i = 0; i < 6; i++) {
    const f = addBox(0.65, 0.06, 0.85, M.folderTan, -2.1 + i * 0.84, 0.04, -0.6 + (i % 2) * 1.1, fn);
    f.rotation.y = (i - 2.5) * 0.35;
  }
  for (let i = 0; i < 6; i++) {
    const m = addBox(0.45, 0.2, 0.24, M.dollar, -1.8 + i * 0.72, 0.1, 1.35 - (i % 2) * 0.5, fn);
    m.rotation.y = i * 0.4;
  }

  // =========================================================================
  // СВЕТ (тёмный цех, красные лампы, тёплый офис, холодный ФБР, уличный неон)
  // =========================================================================
  const ambient = new THREE.AmbientLight(0xdfe8f5, 0.65);
  scene.add(ambient);

  const hemi = new THREE.HemisphereLight(0xdbe8ff, 0x38322c, 0.75);
  scene.add(hemi);

  const keyLight = new THREE.DirectionalLight(0xfff1dc, 2.2);
  keyLight.position.set(8, 14, 10);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(2048, 2048);
  keyLight.shadow.camera.near = 1;
  keyLight.shadow.camera.far = 45;
  const d = 14;
  keyLight.shadow.camera.left = -d;
  keyLight.shadow.camera.right = d;
  keyLight.shadow.camera.top = d;
  keyLight.shadow.camera.bottom = -d;
  scene.add(keyLight);

  const accentPoint = new THREE.PointLight(0xff3322, 2.4, 18);
  accentPoint.position.set(0, 5.2, 0.8);
  scene.add(accentPoint);

  const accentPoint2 = new THREE.PointLight(0x3377ff, 1.8, 18);
  accentPoint2.position.set(2.5, 3.2, -1.2);
  scene.add(accentPoint2);

  scene.fog = new THREE.FogExp2(0x11151f, 0.018);

  // =========================================================================
  // ПЕРСОНАЖИ (romanFront: Джекобсон, 3 подставных победителя, 2 агента ФБР, рабочие)
  // =========================================================================
  const chars = {
    jacobson: createRomanFrontCharacter(scene, { outfit: 'jacobson_guard', x: 0, y: 0, z: 0, seed: 0.3 }),
    winner1: createRomanFrontCharacter(scene, { outfit: 'winner_1', x: -1.6, y: 0, z: 0, seed: 1.1 }),
    winner2: createRomanFrontCharacter(scene, { outfit: 'winner_2', x: 1.6, y: 0, z: 0, seed: 2.2 }),
    winner3: createRomanFrontCharacter(scene, { outfit: 'winner_3', x: 2.4, y: 0, z: 0, seed: 3.3 }),
    fbi1: createRomanFrontCharacter(scene, { outfit: 'fbi_agent_1', x: -1.4, y: 0, z: 0, seed: 4.1 }),
    fbi2: createRomanFrontCharacter(scene, { outfit: 'fbi_agent_2', x: 1.5, y: 0, z: 0, seed: 5.2 }),
    worker1: createRomanFrontCharacter(scene, { outfit: 'printer_worker', x: -2.8, y: 0, z: -1.2, seed: 6.1 }),
    worker2: createRomanFrontCharacter(scene, { outfit: 'printer_worker', x: 2.9, y: 0, z: -1.5, seed: 7.4 }),
  };

  function setActiveSet(setName) {
    Object.entries(sets).forEach(([k, grp]) => {
      grp.visible = k === setName;
    });
  }

  function setLightingMode(mode, timeSec = 0) {
    if (mode === 'printshop_red') {
      scene.background = new THREE.Color('#131722');
      scene.fog.color.set('#131722');
      scene.fog.density = 0.024;
      ambient.color.set('#9ab0d4');
      ambient.intensity = 0.58;
      hemi.color.set('#b8ccf0');
      hemi.groundColor.set('#2b2024');
      keyLight.color.set('#dce8ff');
      keyLight.intensity = 1.65;
      keyLight.position.set(6, 12, 9);
      accentPoint.color.set('#ff2e24');
      accentPoint.intensity = 3.2 + Math.sin(timeSec * 8) * 0.45;
      accentPoint.position.set(0, 5.4, 0.8);
      accentPoint2.color.set('#ff6a33');
      accentPoint2.intensity = 1.4;
      accentPoint2.position.set(-3.2, 4.2, 1.5);
    } else if (mode === 'macro_spot') {
      scene.background = new THREE.Color('#1a1715');
      scene.fog.color.set('#1a1715');
      scene.fog.density = 0.014;
      ambient.color.set('#fff0d9');
      ambient.intensity = 0.72;
      keyLight.color.set('#fff5e0');
      keyLight.intensity = 2.6;
      keyLight.position.set(3.5, 8, 5);
      accentPoint.color.set('#ffbe55');
      accentPoint.intensity = 2.1;
      accentPoint.position.set(-1.5, 3.0, 1.8);
      accentPoint2.intensity = 0.4;
    } else if (mode === 'warm_office') {
      scene.background = new THREE.Color('#1f1914');
      scene.fog.color.set('#1f1914');
      scene.fog.density = 0.018;
      ambient.color.set('#ffd9a8');
      ambient.intensity = 0.68;
      hemi.color.set('#ffe4be');
      hemi.groundColor.set('#362619');
      keyLight.color.set('#ffcf87');
      keyLight.intensity = 2.25;
      keyLight.position.set(5, 9, 8);
      accentPoint.color.set('#ffaa44');
      accentPoint.intensity = 2.8;
      accentPoint.position.set(-0.95, 2.2, 0.4);
      accentPoint2.color.set('#446699');
      accentPoint2.intensity = 1.1;
      accentPoint2.position.set(-2.4, 3.2, -3.8);
    } else if (mode === 'gold_vault') {
      scene.background = new THREE.Color('#141c18');
      scene.fog.color.set('#141c18');
      scene.fog.density = 0.015;
      ambient.color.set('#e8f7e4');
      ambient.intensity = 0.75;
      keyLight.color.set('#fff3cc');
      keyLight.intensity = 2.4;
      keyLight.position.set(6, 12, 10);
      accentPoint.color.set('#ffd23f');
      accentPoint.intensity = 2.5;
      accentPoint.position.set(0, 4.5, 1.5);
      accentPoint2.color.set('#38b068');
      accentPoint2.intensity = 1.8;
      accentPoint2.position.set(0, 2.5, -2.5);
    } else if (mode === 'cold_fbi') {
      scene.background = new THREE.Color('#161e29');
      scene.fog.color.set('#161e29');
      scene.fog.density = 0.016;
      ambient.color.set('#c4dcff');
      ambient.intensity = 0.74;
      hemi.color.set('#d9eaff');
      hemi.groundColor.set('#28313d');
      keyLight.color.set('#e3f0ff');
      keyLight.intensity = 2.35;
      keyLight.position.set(4, 11, 8);
      accentPoint.color.set('#9ec8ff');
      accentPoint.intensity = 2.6;
      accentPoint.position.set(0, 3.8, 0.8);
      accentPoint2.intensity = 0.6;
    } else if (mode === 'street_neon') {
      scene.background = new THREE.Color('#0d121d');
      scene.fog.color.set('#0d121d');
      scene.fog.density = 0.02;
      ambient.color.set('#9ab4e0');
      ambient.intensity = 0.62;
      keyLight.color.set('#d4e3ff');
      keyLight.intensity = 1.75;
      keyLight.position.set(-5, 11, 8);
      const blinkSide = Math.sin(timeSec * 14) > 0;
      accentPoint.color.set(blinkSide ? '#ff2419' : '#1e78ff');
      accentPoint.intensity = 3.8;
      accentPoint.position.set(2.1, 2.6, -1.2);
      accentPoint2.color.set('#ffaa44');
      accentPoint2.intensity = 1.8;
      accentPoint2.position.set(-4.5, 4.5, -2.8);
    }
  }

  return {
    sets,
    chars,
    rollerTop,
    rollerBot,
    webArch,
    steamPuffs,
    heroTicketGroup,
    schemeEnvelopes,
    moneyTowers,
    fbiBadgeMesh,
    fallingTicket,
    sirenRed,
    sirenBlue,
    setActiveSet,
    setLightingMode,
    story: STORY,
  };
}