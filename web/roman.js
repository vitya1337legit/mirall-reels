// web/roman.js
import * as THREE from 'three';
import { createCardNdMaterial } from './toon.js';

export const OUTFITS = {
  // Главный герой: Джером Джекобсон, начальник охраны типографии (тёмная форма охраны, бейдж)
  jacobson_guard: {
    silhouette: 'broad_uniform',
    headScaleX: 1.02,
    headScaleY: 1.04,
    chinShape: 'square',
    noseType: 'aquiline',
    browThickness: 9,
    coatColor: '#1b2436',
    coatShade: '#101622',
    accentColor: '#d9b13b',
    hatType: 'guard_cap',
    hatColor: '#141b29',
    skinColor: '#e6b284',
    skinShade: '#c99163',
    badgeText: 'SECURITY',
    facialHair: 'mustache_90s',
    prop: 'tickets_and_keys',
  },
  // Подставной победитель #1 (костюм 1990-х, спортивная ветровка / пиджак)
  winner_1: {
    silhouette: 'jacket_90s',
    headScaleX: 1.08,
    headScaleY: 0.96,
    chinShape: 'round',
    noseType: 'bulbous',
    browThickness: 8,
    coatColor: '#287a6c',
    coatShade: '#1b544a',
    accentColor: '#e85d38',
    hatType: 'baseball_cap',
    hatColor: '#1c2b4a',
    skinColor: '#eab98e',
    skinShade: '#cc986c',
    facialHair: 'goatee',
    prop: 'envelope_cash',
  },
  // Подставной победитель #2 (пиджак 1990-х с широкими плечами)
  winner_2: {
    silhouette: 'suit_90s',
    headScaleX: 0.94,
    headScaleY: 1.05,
    chinShape: 'pointed',
    noseType: 'hook',
    browThickness: 8,
    coatColor: '#6e3848',
    coatShade: '#4a2430',
    accentColor: '#e6c86e',
    hatType: 'hair_parted',
    hatColor: '#2e221a',
    skinColor: '#e2ae82',
    skinShade: '#c48d60',
    facialHair: 'none',
    prop: 'winning_ticket',
  },
  // Подставной победитель #3 (родственник, спаливший схему)
  winner_3: {
    silhouette: 'jacket_90s',
    headScaleX: 1.04,
    headScaleY: 1.0,
    chinShape: 'round',
    noseType: 'button',
    browThickness: 7,
    coatColor: '#c4842d',
    coatShade: '#8f5e1d',
    accentColor: '#254a7c',
    hatType: 'hair_curly',
    hatColor: '#3a281c',
    skinColor: '#eab98e',
    skinShade: '#cc986c',
    facialHair: 'sideburns',
    prop: 'envelope_cash',
  },
  // Агент ФБР #1 (плащ, жетон ФБР)
  fbi_agent_1: {
    silhouette: 'trench_coat',
    headScaleX: 0.95,
    headScaleY: 1.06,
    chinShape: 'square',
    noseType: 'aquiline',
    browThickness: 9,
    coatColor: '#3d3934',
    coatShade: '#262320',
    accentColor: '#1a2f57',
    hatType: 'hair_parted',
    hatColor: '#1e1b18',
    skinColor: '#e4b288',
    skinShade: '#c49066',
    badgeText: 'ФБР',
    facialHair: 'none',
    prop: 'fbi_badge',
  },
  // Агент ФБР #2 (светлый тренч, жетон ФБР, очки)
  fbi_agent_2: {
    silhouette: 'trench_coat',
    headScaleX: 1.02,
    headScaleY: 1.02,
    chinShape: 'square',
    noseType: 'hook',
    browThickness: 8,
    coatColor: '#8c7d65',
    coatShade: '#635846',
    accentColor: '#1a2f57',
    hatType: 'hair_parted',
    hatColor: '#423326',
    skinColor: '#dfb086',
    skinShade: '#bf8e65',
    badgeText: 'ФБР',
    glasses: true,
    facialHair: 'mustache_90s',
    prop: 'fbi_folder',
  },
  // Рабочий типографии / прохожий 1990-х
  printer_worker: {
    silhouette: 'broad_uniform',
    headScaleX: 1.06,
    headScaleY: 0.98,
    chinShape: 'round',
    noseType: 'bulbous',
    browThickness: 8,
    coatColor: '#334d6e',
    coatShade: '#22344d',
    accentColor: '#d4822a',
    hatType: 'baseball_cap',
    hatColor: '#252930',
    skinColor: '#e6b488',
    skinShade: '#c99467',
    facialHair: 'mustache_90s',
    prop: 'paper_roll',
  },
};

class Pen {
  constructor(ctx) {
    this.ctx = ctx;
  }

  stroke(width = 11, color = '#12100e') {
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = width;
    this.ctx.lineJoin = 'round';
    this.ctx.lineCap = 'round';
    this.ctx.stroke();
  }

  limb(x0, y0, cx, cy, x1, y1, width = 15, color = '#141210') {
    this.ctx.beginPath();
    this.ctx.moveTo(x0, y0);
    this.ctx.quadraticCurveTo(cx, cy, x1, y1);
    this.stroke(width, color);
  }

  shoe(x, y, dir = 1) {
    const ctx = this.ctx;
    ctx.fillStyle = '#181615';
    ctx.beginPath();
    ctx.moveTo(x - 13 * dir, y - 16);
    ctx.lineTo(x + 14 * dir, y - 16);
    ctx.quadraticCurveTo(x + 38 * dir, y - 14, x + 40 * dir, y);
    ctx.lineTo(x - 15 * dir, y);
    ctx.closePath();
    ctx.fill();
    this.stroke(9);
  }
}

function drawHeadBlob(ctx, pen, cx, cy, o) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(o.headScaleX, o.headScaleY);

  const jawSpread = o.chinShape === 'square' ? 76 : o.chinShape === 'round' ? 78 : 58;
  const chinY = o.chinShape === 'pointed' ? 92 : 84;

  const traceBean = () => {
    ctx.beginPath();
    ctx.moveTo(0, -82);
    ctx.bezierCurveTo(58, -84, 74, -38, 62, -4);
    ctx.bezierCurveTo(jawSpread, 32, jawSpread * 0.82, chinY, 0, chinY + 2);
    ctx.bezierCurveTo(-jawSpread * 0.82, chinY, -jawSpread, 32, -62, -4);
    ctx.bezierCurveTo(-74, -38, -58, -84, 0, -82);
    ctx.closePath();
  };

  traceBean();
  ctx.fillStyle = o.skinColor;
  ctx.fill();

  ctx.save();
  ctx.clip();
  ctx.fillStyle = o.skinShade;
  ctx.beginPath();
  ctx.ellipse(42, 18, 38, 76, 0.15, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  traceBean();
  pen.stroke(11);

  // Уши
  ctx.fillStyle = o.skinColor;
  ctx.beginPath();
  ctx.arc(-63, 8, 14, Math.PI * 0.4, Math.PI * 1.6);
  ctx.fill();
  pen.stroke(9);

  ctx.beginPath();
  ctx.arc(63, 8, 14, -Math.PI * 0.6, Math.PI * 0.6);
  ctx.fill();
  pen.stroke(9);

  ctx.restore();
}

function drawCharacterCard(ctx, state) {
  const { outfitKey, emotion, blink, talkPhase, sway, walkPhase, timeSec, cuffed } = state;
  const o = OUTFITS[outfitKey] || OUTFITS.jacobson_guard;
  const pen = new Pen(ctx);

  ctx.clearRect(0, 0, 512, 768);
  ctx.save();

  ctx.translate(256, 744);
  ctx.rotate(sway * 0.03);
  ctx.translate(-256, -744);

  const bob = Math.abs(Math.sin(talkPhase * 1.4)) * 5.5;
  const stride = Math.sin(walkPhase || 0) * 18;
  const coatLag = Math.sin(timeSec * 3.0 - 0.6) * 12 + sway * 7;

  // 1. Ноги (брюки 90-х)
  const hipSpread = 32;
  const hipY = 562 + bob;
  const footY = 742;
  pen.limb(256 - hipSpread, hipY, 256 - hipSpread - 5 - stride * 0.4, 652, 256 - hipSpread - 9 - stride, footY - 4, 22, '#171b24');
  pen.limb(256 + hipSpread, hipY, 256 + hipSpread + 5 + stride * 0.4, 652, 256 + hipSpread + 9 + stride, footY - 4, 22, '#171b24');
  pen.shoe(256 - hipSpread - 9 - stride, footY, -1);
  pen.shoe(256 + hipSpread + 9 + stride, footY, 1);

  // 2. Торс и костюм 1990-х / форма охраны / плащ ФБР
  const shoulderY = 336 + bob;
  const hemY = o.silhouette === 'trench_coat' ? 635 + bob : 584 + bob;
  const topHalfW = o.silhouette === 'broad_uniform' || o.silhouette === 'suit_90s' ? 68 : 60;
  const botHalfW = o.silhouette === 'trench_coat' ? 124 : 108;

  const traceBody = () => {
    ctx.beginPath();
    ctx.moveTo(256 - topHalfW, shoulderY);
    ctx.quadraticCurveTo(256, shoulderY - 12, 256 + topHalfW, shoulderY);
    ctx.bezierCurveTo(
      256 + topHalfW + 24,
      430 + bob,
      256 + botHalfW - 6 + coatLag * 0.4,
      525 + bob,
      256 + botHalfW + coatLag,
      hemY
    );
    ctx.quadraticCurveTo(256 + coatLag * 0.5, hemY + 14, 256 - botHalfW + coatLag * 0.6, hemY);
    ctx.bezierCurveTo(
      256 - botHalfW + 6 + coatLag * 0.3,
      525 + bob,
      256 - topHalfW - 24,
      430 + bob,
      256 - topHalfW,
      shoulderY
    );
    ctx.closePath();
  };

  traceBody();
  ctx.fillStyle = o.coatColor;
  ctx.fill();

  ctx.save();
  ctx.clip();
  ctx.fillStyle = o.coatShade;
  ctx.beginPath();
  ctx.moveTo(274, shoulderY - 10);
  ctx.lineTo(410, shoulderY - 10);
  ctx.lineTo(410, hemY + 25);
  ctx.lineTo(292, hemY + 25);
  ctx.closePath();
  ctx.fill();

  // Воротник, рубашка и галстук
  ctx.fillStyle = '#f2f4f8';
  ctx.beginPath();
  ctx.moveTo(224, shoulderY - 2);
  ctx.lineTo(288, shoulderY - 2);
  ctx.lineTo(256, shoulderY + 76);
  ctx.closePath();
  ctx.fill();
  pen.stroke(7);

  ctx.fillStyle = o.accentColor;
  ctx.beginPath();
  ctx.moveTo(248, shoulderY + 14);
  ctx.lineTo(264, shoulderY + 14);
  ctx.lineTo(268, shoulderY + 112);
  ctx.lineTo(256, shoulderY + 126);
  ctx.lineTo(244, shoulderY + 112);
  ctx.closePath();
  ctx.fill();
  pen.stroke(6);

  // Ремень формы охраны / плаща
  ctx.fillStyle = '#141210';
  ctx.fillRect(140, 486 + bob, 232, 24);
  ctx.fillStyle = '#f0c43c';
  ctx.fillRect(240, 483 + bob, 32, 30);
  ctx.strokeRect(240, 483 + bob, 32, 30);

  // Погоны для формы охраны
  if (o.silhouette === 'broad_uniform') {
    ctx.fillStyle = '#111622';
    ctx.fillRect(184, shoulderY, 44, 18);
    ctx.fillRect(284, shoulderY, 44, 18);
    ctx.fillStyle = '#f0c43c';
    ctx.beginPath();
    ctx.arc(206, shoulderY + 9, 4, 0, Math.PI * 2);
    ctx.arc(306, shoulderY + 9, 4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  traceBody();
  pen.stroke(11);

  // Нагрудный жетон охраны или ФБР
  if (o.badgeText) {
    ctx.fillStyle = '#f5c63b';
    ctx.beginPath();
    ctx.moveTo(298, shoulderY + 42);
    ctx.lineTo(332, shoulderY + 54);
    ctx.quadraticCurveTo(334, shoulderY + 92, 298, shoulderY + 108);
    ctx.quadraticCurveTo(262, shoulderY + 92, 264, shoulderY + 54);
    ctx.closePath();
    ctx.fill();
    pen.stroke(6);

    ctx.fillStyle = '#141110';
    ctx.font = '900 13px Arial Black, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(o.badgeText, 298, shoulderY + 80);
  }

  // 3. Руки + наручники при аресте
  const gesture = Math.sin(talkPhase * 2.2) * 22;
  const armStartL = 256 - topHalfW - 6;
  const armStartR = 256 + topHalfW + 6;

  let leftHandX = armStartL - 36;
  let leftHandY = 488 + bob;
  let rightHandX = armStartR + 40 + Math.cos(talkPhase * 1.8) * 12;
  let rightHandY = 468 + bob - gesture;

  if (cuffed) {
    leftHandX = 232;
    leftHandY = 492 + bob;
    rightHandX = 280;
    rightHandY = 492 + bob;
  }

  pen.limb(armStartL, shoulderY + 24, armStartL - 44, 420 + bob, leftHandX, leftHandY, 16, o.coatColor);
  pen.limb(armStartL, shoulderY + 24, armStartL - 44, 420 + bob, leftHandX, leftHandY, 22, '#12100e');
  pen.limb(armStartL, shoulderY + 24, armStartL - 44, 420 + bob, leftHandX, leftHandY, 12, o.coatColor);

  pen.limb(armStartR, shoulderY + 24, armStartR + 44, 405 + bob - gesture * 0.4, rightHandX, rightHandY, 22, '#12100e');
  pen.limb(armStartR, shoulderY + 24, armStartR + 44, 405 + bob - gesture * 0.4, rightHandX, rightHandY, 12, o.coatColor);

  ctx.fillStyle = o.skinColor;
  ctx.beginPath();
  ctx.arc(leftHandX, leftHandY, 15, 0, Math.PI * 2);
  ctx.fill();
  pen.stroke(8);

  ctx.beginPath();
  ctx.arc(rightHandX, rightHandY, 15, 0, Math.PI * 2);
  ctx.fill();
  pen.stroke(8);

  if (cuffed) {
    ctx.strokeStyle = '#c8d0db';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(leftHandX + 4, leftHandY, 16, 0, Math.PI * 2);
    ctx.moveTo(leftHandX + 20, leftHandY);
    ctx.lineTo(rightHandX - 20, rightHandY);
    ctx.arc(rightHandX - 4, rightHandY, 16, 0, Math.PI * 2);
    ctx.stroke();
  }

  // 4. Пропсы в руках
  if (!cuffed) {
    if (o.prop === 'tickets_and_keys' || o.prop === 'winning_ticket') {
      ctx.save();
      ctx.translate(rightHandX + 12, rightHandY - 14);
      ctx.rotate(-0.15 + Math.sin(talkPhase * 2) * 0.1);
      ctx.fillStyle = '#d42c24';
      ctx.fillRect(-30, -44, 60, 88);
      pen.stroke(7);
      ctx.fillStyle = '#fff8e6';
      ctx.fillRect(-20, -24, 40, 48);
      ctx.fillStyle = '#141110';
      ctx.font = '900 16px Arial Black, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('WIN', 0, -4);
      ctx.fillText('$1M', 0, 16);
      ctx.restore();
    } else if (o.prop === 'envelope_cash') {
      ctx.save();
      ctx.translate(rightHandX + 10, rightHandY - 10);
      ctx.rotate(0.14);
      ctx.fillStyle = '#e5cf9b';
      ctx.fillRect(-36, -26, 72, 52);
      pen.stroke(7);
      ctx.fillStyle = '#3b7a47';
      ctx.fillRect(-26, -34, 52, 16);
      pen.stroke(5);
      ctx.restore();
    } else if (o.prop === 'fbi_badge') {
      ctx.save();
      ctx.translate(rightHandX + 12, rightHandY - 16);
      ctx.fillStyle = '#1a1c22';
      ctx.fillRect(-28, -38, 56, 76);
      pen.stroke(7);
      ctx.fillStyle = '#f5c63b';
      ctx.beginPath();
      ctx.arc(0, 0, 18, 0, Math.PI * 2);
      ctx.fill();
      pen.stroke(5);
      ctx.fillStyle = '#141110';
      ctx.font = '900 13px Arial Black, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('ФБР', 0, 5);
      ctx.restore();
    } else if (o.prop === 'fbi_folder') {
      ctx.save();
      ctx.translate(rightHandX + 10, rightHandY - 8);
      ctx.fillStyle = '#d9b97c';
      ctx.fillRect(-32, -40, 64, 80);
      pen.stroke(7);
      ctx.fillStyle = '#c4271d';
      ctx.font = '900 16px Arial Black, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('ФБР', 0, 4);
      ctx.restore();
    }
  }

  // 5. Голова, причёска/фуражка 90-х, мимика и моргание
  const headX = 256;
  const headY = 234 + bob * 0.8;
  ctx.save();
  ctx.translate(headX, headY + 75);
  ctx.rotate(Math.sin(talkPhase * 1.3) * 0.045);
  ctx.translate(-headX, -(headY + 75));

  drawHeadBlob(ctx, pen, headX, headY, o);

  // Глаза + моргание
  const eyeY = headY - 8;
  if (blink) {
    ctx.beginPath();
    ctx.moveTo(212, eyeY);
    ctx.quadraticCurveTo(230, eyeY + 9, 246, eyeY);
    ctx.moveTo(266, eyeY);
    ctx.quadraticCurveTo(284, eyeY + 9, 300, eyeY);
    pen.stroke(8);
  } else {
    const eyeR = emotion === 'shock' ? 19 : 16;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(230, eyeY, eyeR, eyeR * 1.12, 0, 0, Math.PI * 2);
    ctx.fill();
    pen.stroke(7);

    ctx.beginPath();
    ctx.ellipse(282, eyeY, eyeR, eyeR * 1.12, 0, 0, Math.PI * 2);
    ctx.fill();
    pen.stroke(7);

    const pupilR = emotion === 'shock' ? 5 : 6.5;
    const lookShift = emotion === 'smirk' ? 3 : emotion === 'strict' ? -2 : 0;
    ctx.fillStyle = '#12100e';
    ctx.beginPath();
    ctx.arc(232 + lookShift, eyeY, pupilR, 0, Math.PI * 2);
    ctx.arc(284 + lookShift, eyeY, pupilR, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(234 + lookShift, eyeY - 3, 2.3, 0, Math.PI * 2);
    ctx.arc(286 + lookShift, eyeY - 3, 2.3, 0, Math.PI * 2);
    ctx.fill();
  }

  if (o.glasses) {
    ctx.strokeStyle = '#141110';
    ctx.lineWidth = 5;
    ctx.strokeRect(208, eyeY - 18, 44, 34);
    ctx.strokeRect(260, eyeY - 18, 44, 34);
    ctx.beginPath();
    ctx.moveTo(252, eyeY - 4);
    ctx.lineTo(260, eyeY - 4);
    ctx.stroke();
  }

  // Брови
  const browY =
    emotion === 'shock'
      ? eyeY - 28
      : emotion === 'angry' || emotion === 'strict'
      ? eyeY - 17
      : eyeY - 22;
  const tilt =
    emotion === 'angry' || emotion === 'strict'
      ? 11
      : emotion === 'smirk' || emotion === 'persuade'
      ? -7
      : 0;

  ctx.beginPath();
  ctx.moveTo(208, browY - tilt);
  ctx.lineTo(246, browY + tilt * 0.6);
  ctx.moveTo(266, browY + tilt * 0.6);
  ctx.lineTo(304, browY - tilt);
  pen.stroke(o.browThickness);

  // Нос
  ctx.fillStyle = o.skinShade;
  ctx.beginPath();
  if (o.noseType === 'bulbous') {
    ctx.arc(256, eyeY + 20, 13, 0, Math.PI * 2);
  } else if (o.noseType === 'button') {
    ctx.arc(256, eyeY + 18, 8, 0, Math.PI * 2);
  } else {
    ctx.moveTo(256, eyeY + 4);
    ctx.quadraticCurveTo(276, eyeY + 26, 254, eyeY + 30);
  }
  ctx.fill();
  pen.stroke(6);

  // Усы / бородка 90-х
  if (o.facialHair === 'mustache_90s') {
    ctx.fillStyle = '#2d231c';
    ctx.beginPath();
    ctx.moveTo(228, headY + 34);
    ctx.quadraticCurveTo(256, headY + 22, 284, headY + 34);
    ctx.quadraticCurveTo(256, headY + 42, 228, headY + 34);
    ctx.fill();
    pen.stroke(5);
  } else if (o.facialHair === 'goatee') {
    ctx.fillStyle = '#2b2019';
    ctx.beginPath();
    ctx.arc(256, headY + 66, 16, 0, Math.PI);
    ctx.fill();
    pen.stroke(5);
  }

  // Рот
  const open = Math.abs(Math.sin(talkPhase * 3.5)) * 12;
  const mouthY = headY + 50;
  ctx.beginPath();
  if (emotion === 'smirk' || emotion === 'triumph' || emotion === 'persuade') {
    ctx.moveTo(232, mouthY);
    ctx.quadraticCurveTo(260, mouthY + 14 + open * 0.4, 288, mouthY - 8);
    pen.stroke(7);
  } else if (emotion === 'angry' || emotion === 'strict') {
    ctx.moveTo(232, mouthY + 8);
    ctx.quadraticCurveTo(256, mouthY - 8, 280, mouthY + 8);
    pen.stroke(7);
  } else if (emotion === 'shock') {
    ctx.fillStyle = '#6e1d19';
    ctx.ellipse(256, mouthY + 2, 13, 17, 0, 0, Math.PI * 2);
    ctx.fill();
    pen.stroke(7);
  } else {
    ctx.moveTo(236, mouthY);
    ctx.quadraticCurveTo(256, mouthY + open, 276, mouthY);
    pen.stroke(7);
  }

  // Головные уборы и причёски 90-х
  const hatY = headY - 64;
  ctx.fillStyle = o.hatColor;
  if (o.hatType === 'guard_cap') {
    ctx.beginPath();
    ctx.ellipse(256, hatY - 12, 82, 28, 0, Math.PI, 0);
    ctx.fill();
    pen.stroke(9);
    ctx.fillStyle = '#11141c';
    ctx.beginPath();
    ctx.ellipse(256, hatY - 4, 78, 13, 0, 0, Math.PI);
    ctx.fill();
    pen.stroke(8);
    ctx.fillStyle = '#f5c63b';
    ctx.beginPath();
    ctx.arc(256, hatY - 22, 11, 0, Math.PI * 2);
    ctx.fill();
    pen.stroke(4);
  } else if (o.hatType === 'baseball_cap') {
    ctx.beginPath();
    ctx.arc(256, hatY + 8, 66, Math.PI, 0);
    ctx.fill();
    pen.stroke(9);
    ctx.beginPath();
    ctx.ellipse(274, hatY + 8, 64, 12, 0.06, 0, Math.PI);
    ctx.fill();
    pen.stroke(8);
  } else {
    // Причёска 1990-х с пробором
    ctx.beginPath();
    ctx.moveTo(192, headY - 24);
    ctx.quadraticCurveTo(196, headY - 94, 256, headY - 92);
    ctx.quadraticCurveTo(318, headY - 94, 320, headY - 24);
    ctx.quadraticCurveTo(286, headY - 54, 256, headY - 50);
    ctx.quadraticCurveTo(224, headY - 54, 192, headY - 24);
    ctx.fill();
    pen.stroke(9);
  }

  ctx.restore();
  ctx.restore();
}

export function createRomanFrontCharacter(scene, config) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 768;
  const ctx = canvas.getContext('2d');

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;

  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    alphaTest: 0.14,
    side: THREE.DoubleSide,
  });

  const height = config.height || 1.9;
  const width = height * (512 / 768);
  const geo = new THREE.PlaneGeometry(width, height);
  geo.translate(0, height * 0.5, 0);

  const mesh = new THREE.Mesh(geo, material);
  mesh.userData.nd = createCardNdMaterial(texture);
  mesh.castShadow = true;
  mesh.position.set(config.x || 0, config.y || 0, config.z || 0);

  const shadowGeo = new THREE.CircleGeometry(0.52, 24);
  shadowGeo.rotateX(-Math.PI / 2);
  const shadowMat = new THREE.MeshBasicMaterial({
    color: 0x0e0c0a,
    transparent: true,
    opacity: 0.45,
    depthWrite: false,
  });
  const shadow = new THREE.Mesh(shadowGeo, shadowMat);
  shadow.userData.ndSkip = true;
  shadow.position.set(0, 0.015, 0);
  mesh.add(shadow);

  scene.add(mesh);

  const state = {
    outfitKey: config.outfit || 'jacobson_guard',
    emotion: config.emotion || 'neutral',
    blink: false,
    talkPhase: 0,
    sway: 0,
    walkPhase: 0,
    timeSec: 0,
    speaking: false,
    walking: false,
    cuffed: false,
  };

  function update(timeSec, camera) {
    state.timeSec = timeSec;
    const cycle = (timeSec + (config.seed || 0)) % 2.9;
    state.blink = cycle > 2.74;
    state.sway = Math.sin(timeSec * 2.1 + (config.seed || 0));
    state.talkPhase = state.speaking ? timeSec * 4.8 : timeSec * 1.1;
    state.walkPhase = state.walking ? timeSec * 6.4 : 0;

    drawCharacterCard(ctx, state);
    texture.needsUpdate = true;

    if (camera) {
      mesh.lookAt(camera.position.x, mesh.position.y, camera.position.z);
    }
  }

  update(0, null);
  return { mesh, state, update };
}