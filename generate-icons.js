/**
 * generate-icons.js
 * Jalankan dengan Node.js untuk generate semua icon PWA
 * 
 * Install dulu: npm install canvas
 * Lalu jalankan: node generate-icons.js
 */

const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const outputDir = path.join(__dirname, 'icons');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

sizes.forEach(size => {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Background
  const grad = ctx.createLinearGradient(0, 0, size, size);
  grad.addColorStop(0, '#2C7A7B');
  grad.addColorStop(1, '#319795');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.roundRect(0, 0, size, size, size * 0.2);
  ctx.fill();

  // Ikon hujan (tetesan)
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.22;

  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.beginPath();
  ctx.arc(cx, cy - r * 0.3, r, Math.PI, 0);
  ctx.bezierCurveTo(cx + r, cy - r * 0.3, cx + r * 0.4, cy + r * 0.8, cx, cy + r * 1.2);
  ctx.bezierCurveTo(cx - r * 0.4, cy + r * 0.8, cx - r, cy - r * 0.3, cx - r, cy - r * 0.3);
  ctx.closePath();
  ctx.fill();

  // Tetesan kecil kiri
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  const r2 = size * 0.09;
  const cx2 = cx - r * 1.1;
  const cy2 = cy + r * 0.1;
  ctx.beginPath();
  ctx.arc(cx2, cy2 - r2 * 0.3, r2, Math.PI, 0);
  ctx.bezierCurveTo(cx2 + r2, cy2 - r2 * 0.3, cx2 + r2 * 0.4, cy2 + r2 * 0.8, cx2, cy2 + r2 * 1.2);
  ctx.bezierCurveTo(cx2 - r2 * 0.4, cy2 + r2 * 0.8, cx2 - r2, cy2 - r2 * 0.3, cx2 - r2, cy2 - r2 * 0.3);
  ctx.closePath();
  ctx.fill();

  // Tetesan kecil kanan
  const cx3 = cx + r * 1.1;
  ctx.beginPath();
  ctx.arc(cx3, cy2 - r2 * 0.3, r2, Math.PI, 0);
  ctx.bezierCurveTo(cx3 + r2, cy2 - r2 * 0.3, cx3 + r2 * 0.4, cy2 + r2 * 0.8, cx3, cy2 + r2 * 1.2);
  ctx.bezierCurveTo(cx3 - r2 * 0.4, cy2 + r2 * 0.8, cx3 - r2, cy2 - r2 * 0.3, cx3 - r2, cy2 - r2 * 0.3);
  ctx.closePath();
  ctx.fill();

  const buffer = canvas.toBuffer('image/png');
  const filePath = path.join(outputDir, `icon-${size}.png`);
  fs.writeFileSync(filePath, buffer);
  console.log(`✅ icon-${size}.png dibuat`);
});

console.log('\n🎉 Semua icon berhasil digenerate di folder icons/');
