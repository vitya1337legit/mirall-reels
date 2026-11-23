// web/paint.js
import * as THREE from 'three';

export const rng = (seed) => {
  let s = (seed >>> 0) || 1;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
};

function createCanvas(w, h) {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  return { canvas, ctx: canvas.getContext('2d') };
}

export function makeTexture(canvas, repeatX = 1, repeatY = 1, clamp = false) {
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = clamp ? THREE.ClampToEdgeWrapping : THREE.RepeatWrapping;
  tex.wrapT = clamp ? THREE.ClampToEdgeWrapping : THREE.RepeatWrapping;
  tex.repeat.set(repeatX, repeatY);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  tex.needsUpdate = true;
  return tex;
}

export function paintConcreteTexture(rx = 4, ry = 4) {
  const { canvas, ctx } = createCanvas(512, 512);
  const r = rng(101);
  ctx.fillStyle = '#3d4148';
  ctx.fillRect(0, 0, 512, 512);

  for (let y = 0; y < 512; y += 128) {
    for (let x = 0; x < 512; x += 128) {
      const v = 56 + Math.floor(r() * 16);
      ctx.fillStyle = `rgb(${v}, ${v + 3}, ${v + 8})`;
      ctx.fillRect(x + 2, y + 2, 124, 124);
      ctx.strokeStyle = '#181a1f';
      ctx.lineWidth = 3;
      ctx.strokeRect(x + 2, y + 2, 124, 124);
    }
  }
  for (let i = 0; i < 420; i++) {
    ctx.fillStyle = r() > 0.5 ? 'rgba(20,22,26,0.28)' : 'rgba(95,102,112,0.18)';
    ctx.fillRect(r() * 512, r() * 512, 3 + r() * 8, 2 + r() * 4);
  }
  return makeTexture(canvas, rx, ry);
}

export function paintBrickWallTexture(rx = 4, ry = 2) {
  const { canvas, ctx } = createCanvas(512, 512);
  const r = rng(202);
  ctx.fillStyle = '#252328';
  ctx.fillRect(0, 0, 512, 512);

  const rows = 12;
  const cols = 6;
  const rw = 512 / cols;
  const rh = 512 / rows;
  for (let row = 0; row < rows; row++) {
    const off = (row % 2) * (rw * 0.5);
    for (let col = -1; col <= cols; col++) {
      const shade = 58 + Math.floor(r() * 24);
      ctx.fillStyle = `rgb(${shade + 18}, ${shade - 4}, ${shade - 8})`;
      ctx.fillRect(col * rw + off + 2, row * rh + 2, rw - 4, rh - 4);
      ctx.strokeStyle = '#141216';
      ctx.lineWidth = 2;
      ctx.strokeRect(col * rw + off + 2, row * rh + 2, rw - 4, rh - 4);
    }
  }
  return makeTexture(canvas, rx, ry);
}

export function paintPressRollerTexture() {
  const { canvas, ctx } = createCanvas(512, 512);
  ctx.fillStyle = '#6f7985';
  ctx.fillRect(0, 0, 512, 512);

  for (let y = 0; y < 512; y += 32) {
    ctx.fillStyle = y % 64 === 0 ? '#57606b' : '#85909e';
    ctx.fillRect(0, y, 512, 16);
  }
  // Печатные клише с логотипами и полосами билетов на валу
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const x = col * 128 + 14;
      const y = row * 128 + 18;
      ctx.fillStyle = '#c83428';
      ctx.fillRect(x, y, 100, 92);
      ctx.strokeStyle = '#121010';
      ctx.lineWidth = 4;
      ctx.strokeRect(x, y, 100, 92);

      ctx.fillStyle = '#f5c531';
      ctx.font = 'bold 42px Arial Black, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('M', x + 50, y + 52);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 18px Arial Black, sans-serif';
      ctx.fillText('$1M', x + 50, y + 78);
    }
  }
  return makeTexture(canvas, 2, 2);
}

export function paintTicketWebTexture() {
  const { canvas, ctx } = createCanvas(512, 1024);
  ctx.fillStyle = '#f6efe0';
  ctx.fillRect(0, 0, 512, 1024);

  const cols = 3;
  const rows = 4;
  const cw = 512 / cols;
  const ch = 1024 / rows;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * cw + 10;
      const y = r * ch + 12;
      const w = cw - 20;
      const h = ch - 24;
      const isWinner = (r + c) % 2 === 0;

      ctx.fillStyle = isWinner ? '#d42c24' : '#264d8c';
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 10);
      ctx.fill();
      ctx.strokeStyle = '#12100e';
      ctx.lineWidth = 5;
      ctx.stroke();

      ctx.fillStyle = '#fff9eb';
      ctx.fillRect(x + 12, y + 14, w - 24, 48);
      ctx.fillStyle = '#12100e';
      ctx.font = 'bold 20px Arial Black, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('BOARDWALK', x + w * 0.5, y + 45);

      ctx.fillStyle = '#ffd038';
      ctx.font = 'bold 34px Arial Black, sans-serif';
      ctx.fillText(isWinner ? 'WIN!' : 'PLAY', x + w * 0.5, y + 112);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px Arial Black, sans-serif';
      ctx.fillText(isWinner ? '$1 000 000' : 'FREE FRIES', x + w * 0.5, y + 156);

      // Перфорация по краям
      ctx.setLineDash([6, 6]);
      ctx.strokeStyle = '#141210';
      ctx.lineWidth = 3;
      ctx.strokeRect(x - 4, y - 4, w + 8, h + 8);
      ctx.setLineDash([]);
    }
  }
  return makeTexture(canvas, 1, 2);
}

/** Макро-текстура выигрышного билета (читается целиком, с перфорацией, тиснением, WIN и $1 000 000) */
export function paintMacroTicketTexture(subtitle = 'INSTANT WINNER • 1995') {
  const { canvas, ctx } = createCanvas(1024, 1536);

  // Бежевая подложка с перфорацией
  ctx.fillStyle = '#f8f1e0';
  ctx.fillRect(0, 0, 1024, 1536);

  // Зубчики перфорации по периметру
  ctx.fillStyle = '#191614';
  for (let x = 24; x < 1000; x += 36) {
    ctx.beginPath();
    ctx.arc(x, 18, 9, 0, Math.PI * 2);
    ctx.arc(x, 1518, 9, 0, Math.PI * 2);
    ctx.fill();
  }
  for (let y = 24; y < 1512; y += 36) {
    ctx.beginPath();
    ctx.arc(18, y, 9, 0, Math.PI * 2);
    ctx.arc(1006, y, 9, 0, Math.PI * 2);
    ctx.fill();
  }

  // Внешняя рамка билета
  ctx.fillStyle = '#c9231d';
  ctx.beginPath();
  ctx.roundRect(46, 46, 932, 1444, 34);
  ctx.fill();
  ctx.lineWidth = 14;
  ctx.strokeStyle = '#141110';
  ctx.stroke();

  // Внутренняя золотая рамка тиснения
  ctx.lineWidth = 8;
  ctx.strokeStyle = '#f7cf46';
  ctx.beginPath();
  ctx.roundRect(74, 74, 876, 1388, 22);
  ctx.stroke();

  // Верхний блок MONOPOLY / BOARDWALK
  ctx.fillStyle = '#17376e';
  ctx.beginPath();
  ctx.roundRect(102, 104, 820, 210, 16);
  ctx.fill();
  ctx.lineWidth = 8;
  ctx.strokeStyle = '#141110';
  ctx.stroke();

  ctx.fillStyle = '#ffd43b';
  ctx.font = '900 72px Arial Black, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('MONOPOLY', 512, 195);

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 48px Arial Black, sans-serif';
  ctx.fillText('BOARDWALK • #821', 512, 272);

  // Арка M (фирменный символ)
  ctx.strokeStyle = '#141110';
  ctx.lineWidth = 24;
  ctx.beginPath();
  ctx.arc(430, 480, 74, Math.PI, 0);
  ctx.arc(594, 480, 74, Math.PI, 0);
  ctx.stroke();

  ctx.strokeStyle = '#ffcf2e';
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.arc(430, 480, 74, Math.PI, 0);
  ctx.arc(594, 480, 74, Math.PI, 0);
  ctx.stroke();

  // Центральное окно выигрыша
  ctx.fillStyle = '#fff9ea';
  ctx.beginPath();
  ctx.roundRect(104, 540, 816, 560, 26);
  ctx.fill();
  ctx.lineWidth = 10;
  ctx.strokeStyle = '#141110';
  ctx.stroke();

  // Гильоширная сетка внутри окна
  ctx.strokeStyle = 'rgba(201, 35, 29, 0.14)';
  ctx.lineWidth = 3;
  for (let i = 0; i < 16; i++) {
    ctx.beginPath();
    ctx.ellipse(512, 820, 360 - i * 18, 220 - i * 10, (i % 2 ? 1 : -1) * 0.08, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Тиснение и объёмная тень надписи WIN
  ctx.fillStyle = '#141110';
  ctx.font = '900 184px Arial Black, sans-serif';
  ctx.fillText('WIN', 518, 758);
  ctx.fillStyle = '#d6221b';
  ctx.fillText('WIN', 512, 750);

  // Главный приз $1 000 000
  ctx.fillStyle = '#141110';
  ctx.font = '900 116px Arial Black, sans-serif';
  ctx.fillText('$1 000 000', 516, 938);
  ctx.fillStyle = '#176e38';
  ctx.fillText('$1 000 000', 512, 932);

  // Печать подлинности
  ctx.fillStyle = '#ffd238';
  ctx.beginPath();
  ctx.arc(512, 1235, 86, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = 8;
  ctx.strokeStyle = '#141110';
  ctx.stroke();

  ctx.fillStyle = '#141110';
  ctx.font = '900 30px Arial Black, sans-serif';
  ctx.fillText('OFFICIAL', 512, 1228);
  ctx.fillText('PRIZE', 512, 1264);

  // Нижний серийный код и подпись
  ctx.fillStyle = '#fff5d6';
  ctx.font = '900 36px Arial Black, sans-serif';
  ctx.fillText(subtitle, 512, 1405);

  return makeTexture(canvas, 1, 1, true);
}

export function paintDollarTexture(rx = 1, ry = 1) {
  const { canvas, ctx } = createCanvas(512, 256);
  ctx.fillStyle = '#c8d6bd';
  ctx.fillRect(0, 0, 512, 256);

  ctx.strokeStyle = '#254a2e';
  ctx.lineWidth = 12;
  ctx.strokeRect(14, 14, 484, 228);

  ctx.strokeStyle = '#141814';
  ctx.lineWidth = 4;
  ctx.strokeRect(24, 24, 464, 208);

  ctx.fillStyle = '#24472c';
  ctx.beginPath();
  ctx.ellipse(256, 128, 72, 84, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#e7f0df';
  ctx.font = '900 58px Arial Black, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('$100', 256, 148);

  ctx.fillStyle = '#1e3d25';
  ctx.font = '900 34px Arial Black, sans-serif';
  ctx.fillText('100', 76, 68);
  ctx.fillText('100', 436, 68);
  ctx.fillText('100', 76, 212);
  ctx.fillText('100', 436, 212);

  return makeTexture(canvas, rx, ry);
}

export function paintWoodDeskTexture(rx = 2, ry = 2) {
  const { canvas, ctx } = createCanvas(512, 512);
  ctx.fillStyle = '#694125';
  ctx.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 26; i++) {
    ctx.strokeStyle = i % 2 === 0 ? 'rgba(34,18,8,0.42)' : 'rgba(130,84,48,0.3)';
    ctx.lineWidth = 4 + (i % 4);
    ctx.beginPath();
    const y = i * 20;
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(170, y + 10, 340, y - 10, 512, y + 4);
    ctx.stroke();
  }
  return makeTexture(canvas, rx, ry);
}

export function paintUsaMapTexture() {
  const { canvas, ctx } = createCanvas(1024, 512);
  ctx.fillStyle = '#e8dfc8';
  ctx.fillRect(0, 0, 1024, 512);

  ctx.strokeStyle = '#1a1715';
  ctx.lineWidth = 10;
  ctx.strokeRect(12, 12, 1000, 488);

  // Стилизованный контур США + точки маршрутов победителей
  ctx.fillStyle = '#9db58d';
  ctx.beginPath();
  ctx.moveTo(140, 120);
  ctx.lineTo(840, 110);
  ctx.lineTo(900, 190);
  ctx.lineTo(810, 410);
  ctx.lineTo(750, 350);
  ctx.lineTo(540, 390);
  ctx.lineTo(440, 430);
  ctx.lineTo(220, 340);
  ctx.lineTo(130, 220);
  ctx.closePath();
  ctx.fill();
  ctx.lineWidth = 6;
  ctx.stroke();

  const cities = [
    [680, 280, 'ATLANTA'],
    [780, 370, 'FLORIDA'],
    [520, 320, 'TEXAS'],
    [320, 220, 'NEVADA'],
    [820, 190, 'NEW YORK'],
  ];

  ctx.strokeStyle = '#d1261d';
  ctx.lineWidth = 5;
  ctx.setLineDash([12, 8]);
  ctx.beginPath();
  cities.forEach(([cx, cy], idx) => {
    if (idx === 0) ctx.moveTo(cx, cy);
    else ctx.lineTo(cx, cy);
  });
  ctx.stroke();
  ctx.setLineDash([]);

  cities.forEach(([cx, cy, name]) => {
    ctx.fillStyle = '#d1261d';
    ctx.beginPath();
    ctx.arc(cx, cy, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#141110';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.fillStyle = '#141110';
    ctx.font = 'bold 22px Arial Black, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(name, cx, cy - 20);
  });

  return makeTexture(canvas, 1, 1, true);
}

/** 3D-жетон ФБР с чёткой надписью ФБР / FBI */
export function paintFbiBadgeTexture() {
  const { canvas, ctx } = createCanvas(512, 640);
  ctx.clearRect(0, 0, 512, 640);

  // Кожаная подложка удостоверения
  ctx.fillStyle = '#1b1d22';
  ctx.beginPath();
  ctx.roundRect(36, 24, 440, 592, 42);
  ctx.fill();
  ctx.lineWidth = 10;
  ctx.strokeStyle = '#0d0e11';
  ctx.stroke();

  // Золотой щит жетона
  ctx.fillStyle = '#f0be3d';
  ctx.beginPath();
  ctx.moveTo(256, 56);
  ctx.lineTo(416, 128);
  ctx.quadraticCurveTo(426, 360, 256, 568);
  ctx.quadraticCurveTo(86, 360, 96, 128);
  ctx.closePath();
  ctx.fill();
  ctx.lineWidth = 12;
  ctx.strokeStyle = '#141110';
  ctx.stroke();

  // Синяя эмалевая лента сверху
  ctx.fillStyle = '#17376e';
  ctx.beginPath();
  ctx.roundRect(128, 148, 256, 74, 14);
  ctx.fill();
  ctx.lineWidth = 6;
  ctx.stroke();

  ctx.fillStyle = '#ffd54a';
  ctx.font = '900 44px Arial Black, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('ФБР • FBI', 256, 200);

  // Центральный медальон
  ctx.fillStyle = '#1d4487';
  ctx.beginPath();
  ctx.arc(256, 326, 84, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = 8;
  ctx.strokeStyle = '#141110';
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 46px Arial Black, sans-serif';
  ctx.fillText('ФБР', 256, 322);
  ctx.fillStyle = '#ffd54a';
  ctx.font = '900 28px Arial Black, sans-serif';
  ctx.fillText('SPECIAL AGENT', 256, 362);

  // Нижняя лента
  ctx.fillStyle = '#17376e';
  ctx.beginPath();
  ctx.roundRect(148, 434, 216, 56, 12);
  ctx.fill();
  ctx.lineWidth = 6;
  ctx.strokeStyle = '#141110';
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 28px Arial Black, sans-serif';
  ctx.fillText('DEPT. OF JUSTICE', 256, 471);

  return makeTexture(canvas, 1, 1, true);
}

export function paintCounterDisplayTexture(topText = '12 ЛЕТ', bottomText = '$24 000 000', accent = '#ff3b30') {
  const { canvas, ctx } = createCanvas(1024, 512);
  ctx.fillStyle = '#12151c';
  ctx.fillRect(0, 0, 1024, 512);

  ctx.lineWidth = 14;
  ctx.strokeStyle = '#394152';
  ctx.strokeRect(12, 12, 1000, 488);

  ctx.fillStyle = '#1d222e';
  ctx.fillRect(42, 42, 940, 175);
  ctx.fillRect(42, 245, 940, 225);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffd43b';
  ctx.font = '900 96px Arial Black, sans-serif';
  ctx.fillText(topText, 512, 162);

  ctx.fillStyle = accent;
  ctx.font = '900 112px Arial Black, sans-serif';
  ctx.fillText(bottomText, 512, 396);

  return makeTexture(canvas, 1, 1, true);
}

export function paintAsphaltTexture(rx = 6, ry = 6) {
  const { canvas, ctx } = createCanvas(512, 512);
  const r = rng(707);
  ctx.fillStyle = '#24272e';
  ctx.fillRect(0, 0, 512, 512);

  for (let i = 0; i < 650; i++) {
    const v = 30 + Math.floor(r() * 22);
    ctx.fillStyle = `rgb(${v}, ${v + 2}, ${v + 6})`;
    ctx.fillRect(r() * 512, r() * 512, 4, 4);
  }
  // Жёлтая двойная разделительная линия
  ctx.fillStyle = '#e6b422';
  ctx.fillRect(244, 0, 8, 512);
  ctx.fillRect(260, 0, 8, 512);

  return makeTexture(canvas, rx, ry);
}