// render.mjs
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const args = process.argv.slice(2);
const isStills = args.includes('--stills');
const isMotion = args.includes('--motion');
const rootDir = process.cwd();

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
};

function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const urlPath = (req.url || '/').split('?')[0];
      let rel = urlPath === '/' ? '/web/index.html' : urlPath;
      if (!rel.startsWith('/web/') && !rel.startsWith('/node_modules/')) {
        rel = '/web' + rel;
      }
      const filePath = path.join(rootDir, rel);
      if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        res.writeHead(404);
        res.end('Not found: ' + rel);
        return;
      }
      const ext = path.extname(filePath);
      res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
      fs.createReadStream(filePath).pipe(res);
    });
    server.listen(0, '127.0.0.1', () => {
      resolve({ server, port: server.address().port });
    });
  });
}

async function run() {
  const { server, port } = await startServer();
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome',
    headless: true,
    args: [
      '--use-gl=angle',
      '--use-angle=swiftshader',
      '--enable-webgl',
      '--ignore-gpu-blocklist',
      '--no-sandbox',
    ],
  });

  try {
    const page = await browser.newPage({
      viewport: { width: 1080, height: 1920 },
      deviceScaleFactor: 1,
    });
    await page.goto(`http://127.0.0.1:${port}/web/index.html?render=1`, {
      waitUntil: 'networkidle',
    });
    await page.setDefaultTimeout(180000);
    await page.waitForFunction(() => window.__ready === true, null, { timeout: 180000 });

    if (isStills) {
      fs.mkdirSync('stills', { recursive: true });
      // По 1 ключевому кадру на каждый из 9 шотов
      const keyFrames = [85, 255, 430, 620, 825, 1010, 1150, 1255, 1328];
      const dataUrls = [];

      for (let i = 0; i < keyFrames.length; i++) {
        const f = keyFrames[i];
        await page.evaluate((frame) => window.__setFrame(frame), f);
        const outFile = path.join('stills', `${String(i + 1).padStart(2, '0')}.png`);
        await page.screenshot({ path: outFile, type: 'png' });
        const b64 = fs.readFileSync(outFile).toString('base64');
        dataUrls.push({ frame: f, url: `data:image/png;base64,${b64}` });
        console.log(`Saved ${outFile}`);
      }

      // Контакт-лист sheet_100.jpg (3x3)
      const sheetBase64 = await page.evaluate(async (items) => {
        const cols = 3;
        const rows = 3;
        const cellW = 540;
        const cellH = 960;
        const pad = 16;
        const canvas = document.createElement('canvas');
        canvas.width = cols * cellW + (cols + 1) * pad;
        canvas.height = rows * cellH + (rows + 1) * pad;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#0e1015';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < items.length; i++) {
          const img = new Image();
          img.src = items[i].url;
          await img.decode();
          const c = i % cols;
          const r = Math.floor(i / cols);
          const x = pad + c * (cellW + pad);
          const y = pad + r * (cellH + pad);
          ctx.drawImage(img, x, y, cellW, cellH);

          ctx.fillStyle = 'rgba(0,0,0,0.72)';
          ctx.fillRect(x + 12, y + 12, 190, 40);
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 24px sans-serif';
          ctx.fillText(`Shot ${i + 1} (f${items[i].frame})`, x + 22, y + 40);
        }
        return canvas.toDataURL('image/jpeg', 0.92).split(',')[1];
      }, dataUrls);

      fs.writeFileSync('sheet_100.jpg', Buffer.from(sheetBase64, 'base64'));
      console.log('Contact sheet generated: sheet_100.jpg');
    } else if (isMotion) {
      fs.mkdirSync('motion_frames', { recursive: true });
      const startFrame = 170;
      const count = 150;
      for (let i = 0; i < count; i++) {
        await page.evaluate((frame) => window.__setFrame(frame), startFrame + i);
        const outFrame = path.join('motion_frames', `${String(i).padStart(5, '0')}.png`);
        await page.screenshot({ path: outFrame, type: 'png' });
        if (i % 30 === 0) console.log(`Motion test frame ${i} / ${count}`);
      }
      console.log('5s motion test frames rendered.');
    } else {
      fs.mkdirSync('frames', { recursive: true });
      const meta = await page.evaluate(() => window.__meta);
      const SF = Number(process.env.START_FRAME || 0);
      const EF = Number(process.env.END_FRAME || meta.totalFrames - 1);
      for (let f = SF; f <= EF; f++) {
        await page.evaluate((frame) => window.__setFrame(frame), f);
        const outFrame = path.join('frames', `${String(f).padStart(5, '0')}.png`);
        await page.screenshot({ path: outFrame, type: 'png' });
        if (f % 60 === 0) {
          console.log(`Rendered frame ${f} / ${meta.totalFrames}`);
        }
      }
      console.log('Full frame render complete.');
    }
  } finally {
    await browser.close();
    server.close();
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});