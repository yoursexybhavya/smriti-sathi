/**
 * Empirical onboarding layout verification (headless Chrome via CDP, real engine).
 * Launches Chrome with remote debugging, drives the real onboarding flow
 * (welcome → profile → language) with synthetic clicks, and asserts the
 * full-bleed regressions are fixed: bounded centered panel, vertical fill,
 * capped footer buttons, elder-scale touch targets, and no clipped text.
 */
import http from 'http';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.png': 'image/png', '.svg': 'image/svg+xml', '.json': 'application/json',
};

const PROBE = `
(function () {
  var results = { started: true };
  window.__LAYOUT_RESULTS = results;
  function rect(el) { var r = el.getBoundingClientRect(); return { w: r.width, h: r.height, left: r.left, right: r.right }; }
  function byText(sel, text) {
    var els = Array.prototype.slice.call(document.querySelectorAll(sel));
    return els.find(function (e) { return (e.textContent || '').indexOf(text) !== -1; });
  }
  function setNativeValue(el, value) {
    var setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
    setter.call(el, value);
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }
  function waitFor(fn) {
    return new Promise(function (resolve) {
      var start = Date.now();
      (function poll() {
        try {
          var v = fn();
          if (v) return resolve(v);
        } catch (e) {}
        if (Date.now() - start > 12000) return resolve(null);
        setTimeout(poll, 80);
      })();
    });
  }

  async function run() {
    try {
      var frame = await waitFor(function () { return document.querySelector('.onboarding-screen-frame'); });
      if (!frame) { results.error = 'frame never rendered'; return; }
      var beginBtn = await waitFor(function () { return byText('button', 'Begin Setup'); });
      if (!beginBtn) { results.error = 'Begin Setup not found'; return; }

      var card = document.querySelector('.onboarding-card');
      var cardR = rect(card);
      results.viewportWidth = window.innerWidth;
      results.viewportHeight = window.innerHeight;
      results.frameHeight = rect(frame).h;
      results.frameWidth = rect(frame).w;
      var frameStyle = getComputedStyle(frame);
      results.framePaddingLeft = frameStyle.paddingLeft;
      results.frameMaxWidth = frameStyle.maxWidth;
      results.cardMaxWidth = getComputedStyle(card).maxWidth;
      results.bodyWidth = rect(document.body).w;
      results.cardLeft = cardR.left;
      results.cardRight = cardR.right;
      results.cardHeight = cardR.h;

      var welcomeSecondary = byText('button', 'Demo Dashboard');
      results.primaryBtnWidth = rect(beginBtn).w;
      results.primaryBtnHeight = rect(beginBtn).h;
      results.secondaryBtnWidth = welcomeSecondary ? rect(welcomeSecondary).w : 0;
      results.secondaryBtnHeight = welcomeSecondary ? rect(welcomeSecondary).h : 0;

      beginBtn.click();

      var inputs = await waitFor(function () {
        var i = document.querySelectorAll('input[type="text"], input[type="number"]');
        return i.length >= 2 ? i : null;
      });
      if (!inputs) { results.error = 'profile inputs not found'; return; }
      setNativeValue(inputs[0], 'Kamala Baa');
      setNativeValue(inputs[1], '72');

      var presets = Array.prototype.slice.call(document.querySelectorAll('button')).filter(function (b) {
        var r = rect(b);
        return /Kamala Baa|Deka Koka|Aai|Bapu/.test(b.textContent || '') && r.h > 20 && r.h < 200 && r.w < 420;
      });
      results.presetBtnMinHeight = presets.length ? Math.min.apply(null, presets.map(function (b) { return rect(b).h; })) : 0;

      var cont = await waitFor(function () { return byText('button', 'Continue to Language'); });
      if (!cont) { results.error = 'continue button not found'; return; }
      cont.click();

      var langCard = await waitFor(function () { return byText('button', 'Audio Ready'); });
      if (!langCard) { results.error = 'language cards not found'; return; }
      var cards = Array.prototype.slice.call(document.querySelectorAll('button')).filter(function (b) {
        return (b.textContent || '').indexOf('Audio Ready') !== -1;
      });
      results.langCardMinHeight = Math.min.apply(null, cards.map(function (b) { return rect(b).h; }));
      var clipped = 0; var clippedNames = [];
      cards.forEach(function (c) {
        var spans = c.querySelectorAll('span');
        var region = null;
        spans.forEach(function (s) {
          if (/Valley|Region|Standard/.test(s.textContent || '')) region = s;
        });
        if (region) {
          var r = rect(region);
          var cRect = rect(c);
          var overflowsCard = r.left < cRect.left + 2 || r.right > cRect.right - 2;
          if (region.scrollWidth > region.clientWidth + 1 || overflowsCard) { clipped++; clippedNames.push(region.textContent.trim()); }
        }
      });
      results.langRegionClipped = clipped > 0;
      results.langRegionClippedNames = clippedNames;

      var langPrimary = byText('button', 'Continue to Accessibility');
      var langSecondary = byText('button', 'Back to Profile');
      results.langPrimaryBtnWidth = langPrimary ? rect(langPrimary).w : 0;
      results.langSecondaryBtnWidth = langSecondary ? rect(langSecondary).w : 0;
      results.langSecondaryBtnHeight = langSecondary ? rect(langSecondary).h : 0;
    } catch (e) {
      results.error = String(e && e.message || e);
    }
  }
  run();
})();
`;

const indexHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');
const probedHtml = indexHtml.replace(
  '</body>',
  `<script>try { sessionStorage.setItem('smriti_splash_shown', 'true'); } catch (e) {}</script>\n<script>${PROBE}</script>\n</body>`
);

const server = http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0];
  let filePath = path.join(distDir, urlPath === '/' ? 'index.html' : urlPath);
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(distDir, 'index.html');
  }
  const ext = path.extname(filePath).toLowerCase();
  res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
  if (filePath.endsWith('index.html')) res.end(probedHtml);
  else fs.createReadStream(filePath).pipe(res);
});

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function main() {
  server.listen(0, '127.0.0.1');
  await new Promise(r => server.on('listening', r));
  const port = server.address().port;
  const testUrl = `http://127.0.0.1:${port}`;
  const debugPort = 9223;

  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    '--disable-gpu',
    `--remote-debugging-port=${debugPort}`,
    '--user-data-dir=/tmp/smriti-layout-verify-profile',
    '--no-first-run',
    '--window-size=1728,1117',
    'about:blank',
  ]);
  const cleanup = () => { try { chrome.kill(); } catch {} server.close(); };
  process.on('exit', cleanup);

  // Wait for CDP endpoint
  let version = null;
  for (let i = 0; i < 50; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${debugPort}/json/version`);
      version = await res.json();
      break;
    } catch { await sleep(200); }
  }
  if (!version) { console.error('Chrome CDP never came up'); cleanup(); process.exit(1); }

  // Open a tab
  const tabRes = await fetch(`http://127.0.0.1:${debugPort}/json/new?${encodeURIComponent(testUrl)}`, { method: 'PUT' });
  const tab = await tabRes.json();
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });

  let msgId = 0;
  const pending = new Map();
  ws.onmessage = ev => {
    const data = JSON.parse(ev.data);
    if (data.id && pending.has(data.id)) { pending.get(data.id)(data); pending.delete(data.id); }
  };
  const send = (method, params = {}) => new Promise(resolve => {
    const id = ++msgId;
    pending.set(id, resolve);
    ws.send(JSON.stringify({ id, method, params }));
  });

  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 1728, height: 1117, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: testUrl });

  // Poll for results
  let results = null;
  for (let i = 0; i < 150; i++) {
    await sleep(200);
    const evalRes = await send('Runtime.evaluate', { expression: 'JSON.stringify(window.__LAYOUT_RESULTS || null)', returnByValue: true });
    const val = evalRes.result?.result?.value;
    if (val && val !== 'null') {
      const parsed = JSON.parse(val);
      if (parsed.error || parsed.langSecondaryBtnHeight !== undefined) { results = parsed; break; }
    }
  }

  ws.close();
  cleanup();

  console.log('\n======================================================================');
  console.log('🧪 EMPIRICAL ONBOARDING LAYOUT VERIFICATION (1728×1117 desktop)');
  console.log('======================================================================\n');

  if (!results) { console.error('❌ Probe never produced results (app boot timed out).'); process.exit(1); }
  if (results.error) { console.error('❌ Probe error:', results.error); process.exit(1); }

  console.log('  [debug] frameWidth=' + results.frameWidth + ' bodyWidth=' + results.bodyWidth +
    ' framePadLeft=' + results.framePaddingLeft + ' frameMax=' + results.frameMaxWidth +
    ' cardMax=' + results.cardMaxWidth);

  let failures = 0;
  const check = (name, pass, detail) => {
    console.log(`  ${pass ? '✅' : '❌'} ${name}`);
    if (detail) console.log(`     ${detail}`);
    if (!pass) failures++;
  };

  check(
    'Frame fills full viewport height',
    results.frameHeight >= results.viewportHeight - 4,
    `frame=${results.frameHeight}px, viewport=${results.viewportHeight}px`
  );
  check(
    'Card is bounded (side margins ≥ 40px on desktop)',
    results.cardLeft >= 40 && results.cardRight <= results.viewportWidth - 40,
    `left=${results.cardLeft}px, right-gap=${results.viewportWidth - results.cardRight}px`
  );
  const centerDelta = Math.abs((results.cardLeft + results.cardRight) / 2 - results.viewportWidth / 2);
  check('Card horizontally centered', centerDelta <= 12, `center delta=${centerDelta.toFixed(1)}px`);
  check(
    'Card fills ≥ 92% of viewport height',
    results.cardHeight >= results.viewportHeight * 0.92,
    `card=${results.cardHeight}px vs viewport=${results.viewportHeight}px`
  );
  check(
    'Welcome primary CTA width capped ≤ 640px',
    results.primaryBtnWidth <= 640,
    `width=${results.primaryBtnWidth}px`
  );
  check(
    'Welcome secondary button ≤ 320px wide',
    results.secondaryBtnWidth <= 320,
    `width=${results.secondaryBtnWidth}px`
  );
  check(
    'Footer buttons ≥ 56px tall',
    results.primaryBtnHeight >= 56 && results.secondaryBtnHeight >= 56,
    `primary=${results.primaryBtnHeight}px, secondary=${results.secondaryBtnHeight}px`
  );
  check(
    'Elder preset buttons ≥ 56px tall',
    results.presetBtnMinHeight >= 56,
    `min height=${results.presetBtnMinHeight}px`
  );
  check(
    'Language card region text fully visible (no clipping)',
    results.langRegionClipped === false,
    results.langRegionClipped === false ? 'all 4 regions render fully' : `clipped: ${(results.langRegionClippedNames || []).join(', ')}`
  );
  check(
    'Language cards ≥ 56px tall',
    results.langCardMinHeight >= 56,
    `min height=${results.langCardMinHeight}px`
  );
  check(
    'Language step primary CTA capped ≤ 640px',
    results.langPrimaryBtnWidth <= 640,
    `width=${results.langPrimaryBtnWidth}px`
  );
  check(
    'Language step secondary button ≤ 320px wide',
    results.langSecondaryBtnWidth <= 320,
    `width=${results.langSecondaryBtnWidth}px`
  );

  console.log(`\n${failures === 0 ? '✅ ALL LAYOUT CHECKS PASSED' : `❌ ${failures} CHECK(S) FAILED`}\n`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch(err => { console.error(err); process.exit(1); });
