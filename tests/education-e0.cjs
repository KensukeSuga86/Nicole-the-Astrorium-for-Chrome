/* Run: npm install --no-save playwright; npx playwright install chromium;
   node tests/education-e0.cjs
   Optional: E0_BROWSER_EXECUTABLE and E0_BROWSER_ARGS (JSON array).
   Starts its own static server; does not need a running external server. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '..');
const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  let file = path.resolve(root, '.' + pathname);
  if (file !== root && !file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
  if (pathname.endsWith('/')) file = path.join(file, 'index.html');
  try {
    const body = fs.readFileSync(file);
    const types = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.webmanifest': 'application/manifest+json', '.png': 'image/png', '.json': 'application/json' };
    res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
    res.end(body);
  } catch { res.writeHead(404).end(); }
});
(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  let browser;
  const errors = [];
  const observe = page => {
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  };
  try {
    browser = await chromium.launch({ headless: true,
      ...(process.env.E0_BROWSER_EXECUTABLE ? { executablePath: process.env.E0_BROWSER_EXECUTABLE } : {}),
      args: process.env.E0_BROWSER_ARGS ? JSON.parse(process.env.E0_BROWSER_ARGS) : ['--no-sandbox'] });
    const context = await browser.newContext();
    await context.addInitScript(() => {
      const original = HTMLCanvasElement.prototype.getContext;
      window.__e0GPUContexts = [];
      HTMLCanvasElement.prototype.getContext = function(type, ...args) {
        const result = original.call(this, type, ...args);
        if (result && /webgl/.test(type)) window.__e0GPUContexts.push(result);
        return result;
      };
    });
    const page = await context.newPage(); observe(page);
    await page.goto(base + '/');
    for (const name of ['小学校', '中学校', '高等学校']) {
      await page.getByRole('button', { name, exact: true }).click();
      assert.equal(await page.locator('#lessons button').count(), 8);
      assert.equal(await page.getByRole('button', { name, exact: true }).getAttribute('aria-pressed'), 'true');
      await page.getByRole('button', { name: '太陽と影', exact: true }).click();
      assert.match(await page.locator('#notice').textContent(), /この教材は現在準備中です/);
    }
    await page.evaluate(() => navigator.serviceWorker.ready.then(() => true));
    await page.reload();
    await page.getByRole('link', { name: '自由に星空を見る →' }).click();
    await page.waitForFunction(() => window.NicoleEducationDiagnostics?.renderer().frames > 3);
    assert.equal(await page.locator('#toggles input').count(), 6);
    const initial = await page.evaluate(() => NicoleEducationDiagnostics.renderer());
    assert.ok(initial.frames > 0);
    if (initial.gpu) { assert.equal(initial.gpu.ready, true); assert.equal(initial.fallbackFrames, 0); }
    assert.equal(await page.getByRole('button', { name: /メディア|星座編集|ペン|カメラ|ショートカット/ }).count(), 0);
    await page.locator('[data-layer=lines]').check();
    await page.locator('[data-layer=names]').check();
    await page.locator('#lat').fill('35'); await page.locator('#lat').press('Tab');
    await page.waitForFunction(() => NicoleEducationDiagnostics.state().location.lat === 35);
    await page.getByRole('button', { name: '▶ 動かす' }).click();
    const before = await page.evaluate(() => new Date(NicoleEducationDiagnostics.state().time).getTime());
    await page.waitForFunction(t => new Date(NicoleEducationDiagnostics.state().time).getTime() > t, before);
    await page.getByRole('button', { name: 'Ⅱ 止める' }).click();
    assert.equal(await page.evaluate(() => NicoleEducationDiagnostics.state().running), false);
    // View each object above the horizon and verify that toggling its layer changes pixels.
    for (const [id, key] of [['Sun','sun'], ['Moon','moon'], ['Jupiter','planets'], ['Sirius','stars']]) {
      const date = await page.evaluate(id => {
        const s = NicoleEducationDiagnostics.state();
        for (let hour=0;hour<24;hour++) {
          const d=new Date(s.time);d.setHours(hour,0,0,0);
          const p=NicoleEducationDiagnostics.position(id,d);
          const sun=NicoleEducationDiagnostics.position('Sun',d);
          if(NicoleEducationDiagnostics.altaz(p.ra,p.dec,d).alt>20 && (id!=='Sirius'||NicoleEducationDiagnostics.altaz(sun.ra,sun.dec,d).alt < -10))return d.getTime();
        }
        return new Date(s.time).getTime();
      }, id);
      const local = await page.evaluate(t => { const d=new Date(t),p=n=>String(n).padStart(2,'0');return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`; }, date);
      await page.locator('#date').fill(local); await page.locator('#date').press('Tab');
      const pos=await page.evaluate(id=>{const p=NicoleEducationDiagnostics.position(id);return NicoleEducationDiagnostics.altaz(p.ra,p.dec);},id);
      assert.ok(Number.isFinite(pos.az) && Number.isFinite(pos.alt));
      for(const [field,value] of [['az',pos.az],['alt',Math.max(-20,pos.alt)],['fov',20]]) {
        await page.locator('#'+field).fill(String(Math.round(value))); await page.locator('#'+field).press('Tab');
      }
      await page.waitForTimeout(500);
      const on=await page.locator('#sky').screenshot();
      await page.locator(`[data-layer=${key}]`).uncheck(); await page.waitForTimeout(550);
      const off=await page.locator('#sky').screenshot();
      assert.ok(pos.alt>0,`${id} test must be above the horizon`);
      assert.notDeepEqual(on,off,`${id} layer should change the rendered sky`);
      await page.locator(`[data-layer=${key}]`).check();
    }
    if(initial.gpu) {
      await page.evaluate(() => { for(const gl of window.__e0GPUContexts)if(!gl.isContextLost())gl.getExtension('WEBGL_lose_context')?.loseContext(); });
      await page.waitForFunction(() => NicoleEducationDiagnostics.renderer().fallbackFrames > 0);
    }
    await context.setOffline(true); await page.reload();
    await page.waitForFunction(() => window.NicoleEducationDiagnostics?.renderer().frames > 2);
    await page.goto(base + '/');
    await page.getByRole('button', { name: '小学校', exact: true }).click();
    assert.equal(await page.locator('#lessons button').count(), 8);
    await context.setOffline(false);
    await page.goto(base + '/presenter.html');
    await page.waitForFunction(() => window.AstroriumDiagnostics);
    assert.equal(await page.evaluate(() => AstroriumDiagnostics.selfCheck().ok), true);
    const fallback=await browser.newContext();
    await fallback.addInitScript(() => { const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return /webgl/.test(type)?null:original.call(this,type,...args);}; });
    const fp=await fallback.newPage(); observe(fp);
    await fp.goto(base+'/education-sky.html');
    await fp.waitForFunction(() => window.NicoleEducationDiagnostics?.renderer().frames > 2);
    assert.equal(await fp.evaluate(() => NicoleEducationDiagnostics.renderer().backend),'canvas2d');
    await fp.setViewportSize({width:390,height:844});
    assert.equal(await fp.locator('#sky').isVisible(),true);
    assert.equal(await fp.evaluate(() => document.documentElement.scrollWidth > innerWidth),false);
    assert.deepEqual(errors,[]);
    console.log(JSON.stringify({home:'PASS',lessons:'PASS',controls:'PASS',solarBodies:'PASS',webgl:initial.gpu?'PASS':'UNAVAILABLE',contextLoss:initial.gpu?'PASS':'UNAVAILABLE',canvas:'PASS',offline:'PASS',legacy:'PASS',mobileLayout:'PASS',consoleErrors:errors},null,2));
  } finally { if(browser)await browser.close();await new Promise(resolve=>server.close(resolve)); }
})().catch(error=>{console.error(error);process.exitCode=1;});
