import http from 'http';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Find latest compiled CSS
const distAssets = path.join(rootDir, 'dist/assets');
if (!fs.existsSync(distAssets)) {
  console.error('dist/assets does not exist. Run npm run build first.');
  process.exit(1);
}
const cssFile = fs.readdirSync(distAssets).find(f => f.startsWith('index-') && f.endsWith('.css'));
if (!cssFile) {
  console.error('Could not find index-*.css in dist/assets');
  process.exit(1);
}
const cssContent = fs.readFileSync(path.join(distAssets, cssFile), 'utf-8');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Theme Engine Empirical Verification Harness</title>
  <style>
    ${cssContent}
  </style>
</head>
<body>
  <div id="root">
    <div id="test-card" class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white p-6 rounded-2xl">
      <h1 id="test-heading" class="text-xl font-bold">Theme Engine Test Surface</h1>
      <p id="test-muted" class="text-slate-500 dark:text-slate-400">Testing dark hierarchy</p>
      <button id="test-btn" class="bg-indigo-600 dark:bg-indigo-500 text-white dark:text-slate-100">Action Button</button>
      <div id="test-amber" class="text-amber-600 dark:text-amber-400">Amber Alert</div>
      <div id="test-emerald" class="text-emerald-600 dark:text-emerald-400">Emerald Success</div>
    </div>
    <div id="nested-isolated-container">
      <div id="nested-test-item" class="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50">
        Nested isolated element
      </div>
    </div>
  </div>

  <div id="results" data-done="false"></div>

  <script>
    function getColors(el) {
      const style = window.getComputedStyle(el);
      return {
        backgroundColor: style.backgroundColor,
        backgroundImage: style.backgroundImage,
        color: style.color,
        borderColor: style.borderColor,
      };
    }

    function getVar(name) {
      return window.getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    }

    function resetDOM() {
      document.documentElement.className = '';
      document.body.className = '';
      const nested = document.getElementById('nested-isolated-container');
      nested.className = '';
    }

    // Color matcher that handles rgb or oklch representations in Chromium
    function isSlate900(color) {
      return color === 'rgb(15, 23, 42)' || color.includes('0.208 0.042 265.755');
    }
    function isSlate800(color) {
      return color === 'rgb(30, 41, 59)' || color.includes('0.279 0.041 260.031');
    }
    function isEmerald400(color) {
      return color === 'rgb(52, 211, 153)' || color.includes('0.765 0.177 163.223');
    }
    function isAmber400(color) {
      return color === 'rgb(251, 191, 36)' || color.includes('0.828 0.189 84.429');
    }
    function isWhite(color) {
      return color === 'rgb(255, 255, 255)' || color === 'white';
    }

    const testRuns = [];

    // Helper assertion
    function assert(name, condition, details) {
      testRuns.push({
        name,
        passed: Boolean(condition),
        details: details || {}
      });
    }

    // --- SUITE 1: LIGHT MODE (DEFAULT / THEME-LIGHT) ---
    resetDOM();
    let rootColors = getColors(document.getElementById('root'));
    let cardColors = getColors(document.getElementById('test-card'));
    let headingColors = getColors(document.getElementById('test-heading'));

    assert('1.1: Default Light Mode: #root background is clean light canvas (rgb(248, 250, 252))', 
      rootColors.backgroundColor === 'rgb(248, 250, 252)', 
      { actual: rootColors.backgroundColor, expected: 'rgb(248, 250, 252)' }
    );
    assert('1.2: Default Light Mode: #root has NO gradient bleed', 
      rootColors.backgroundImage === 'none', 
      { actual: rootColors.backgroundImage, expected: 'none' }
    );
    assert('1.3: Default Light Mode: card has pure white background', 
      isWhite(cardColors.backgroundColor), 
      { actual: cardColors.backgroundColor }
    );
    assert('1.4: Default Light Mode: dark:bg-slate-900 does NOT activate', 
      !isSlate900(cardColors.backgroundColor), 
      { actual: cardColors.backgroundColor }
    );

    // Test explicit html.theme-light
    resetDOM();
    document.documentElement.classList.add('theme-light');
    document.body.classList.add('theme-light');
    rootColors = getColors(document.getElementById('root'));
    cardColors = getColors(document.getElementById('test-card'));

    assert('1.5: Explicit theme-light: #root background remains #F8FAFC', 
      rootColors.backgroundColor === 'rgb(248, 250, 252)', 
      { actual: rootColors.backgroundColor, expected: 'rgb(248, 250, 252)' }
    );
    assert('1.6: Explicit theme-light: #root has zero background gradient bleed', 
      rootColors.backgroundImage === 'none', 
      { actual: rootColors.backgroundImage, expected: 'none' }
    );
    assert('1.7: Explicit theme-light: CSS variable --color-bg is #F8FAFC', 
      getVar('--color-bg').toUpperCase() === '#F8FAFC', 
      { actual: getVar('--color-bg') }
    );
    assert('1.8: Explicit theme-light: CSS variable --color-text is #0F172A', 
      getVar('--color-text').toUpperCase() === '#0F172A', 
      { actual: getVar('--color-text') }
    );

    // --- SUITE 2: DARK MODE VIA html.dark ---
    resetDOM();
    document.documentElement.classList.add('dark');
    rootColors = getColors(document.getElementById('root'));
    cardColors = getColors(document.getElementById('test-card'));
    let amberColors = getColors(document.getElementById('test-amber'));
    let emeraldColors = getColors(document.getElementById('test-emerald'));

    assert('2.1: Root .dark: #root background changes to dark canvas #0B0F17 (rgb(11, 15, 23))', 
      rootColors.backgroundColor === 'rgb(11, 15, 23)', 
      { actual: rootColors.backgroundColor, expected: 'rgb(11, 15, 23)' }
    );
    assert('2.2: Root .dark: #root has NO gradient bleed', 
      rootColors.backgroundImage === 'none', 
      { actual: rootColors.backgroundImage, expected: 'none' }
    );
    assert('2.3: Root .dark: card background triggers dark:bg-slate-900', 
      isSlate900(cardColors.backgroundColor), 
      { actual: cardColors.backgroundColor }
    );
    assert('2.4: Root .dark: card border triggers dark:border-slate-800', 
      isSlate800(cardColors.borderColor), 
      { actual: cardColors.borderColor }
    );
    assert('2.5: Root .dark: card text triggers dark:text-white', 
      isWhite(cardColors.color), 
      { actual: cardColors.color }
    );
    assert('2.6: Root .dark: functional dark:text-amber-400 triggers', 
      isAmber400(amberColors.color), 
      { actual: amberColors.color }
    );
    assert('2.7: Root .dark: functional dark:text-emerald-400 triggers', 
      isEmerald400(emeraldColors.color), 
      { actual: emeraldColors.color }
    );

    // --- SUITE 3: DARK MODE VIA html.theme-dark (App.tsx Root Implementation) ---
    resetDOM();
    document.documentElement.classList.add('theme-dark');
    rootColors = getColors(document.getElementById('root'));
    cardColors = getColors(document.getElementById('test-card'));
    amberColors = getColors(document.getElementById('test-amber'));
    emeraldColors = getColors(document.getElementById('test-emerald'));

    assert('3.1: Root .theme-dark: #root background changes to dark canvas #0B0F17', 
      rootColors.backgroundColor === 'rgb(11, 15, 23)', 
      { actual: rootColors.backgroundColor, expected: 'rgb(11, 15, 23)' }
    );
    assert('3.2: Root .theme-dark: #root has NO gradient bleed', 
      rootColors.backgroundImage === 'none', 
      { actual: rootColors.backgroundImage, expected: 'none' }
    );
    assert('3.3: Root .theme-dark: card background triggers dark:bg-slate-900', 
      isSlate900(cardColors.backgroundColor), 
      { actual: cardColors.backgroundColor }
    );
    assert('3.4: Root .theme-dark: card border triggers dark:border-slate-800', 
      isSlate800(cardColors.borderColor), 
      { actual: cardColors.borderColor }
    );
    assert('3.5: Root .theme-dark: card text triggers dark:text-white', 
      isWhite(cardColors.color), 
      { actual: cardColors.color }
    );
    assert('3.6: Root .theme-dark: CSS variable --color-bg is #0B0F17', 
      getVar('--color-bg').toUpperCase() === '#0B0F17', 
      { actual: getVar('--color-bg') }
    );
    assert('3.7: Root .theme-dark: functional dark:text-amber-400 triggers', 
      isAmber400(amberColors.color), 
      { actual: amberColors.color }
    );
    assert('3.8: Root .theme-dark: functional dark:text-emerald-400 triggers', 
      isEmerald400(emeraldColors.color), 
      { actual: emeraldColors.color }
    );

    // --- SUITE 4: DARK MODE VIA body.dark ---
    resetDOM();
    document.body.classList.add('dark');
    cardColors = getColors(document.getElementById('test-card'));

    assert('4.1: Body .dark: card triggers dark:bg-slate-900', 
      isSlate900(cardColors.backgroundColor), 
      { actual: cardColors.backgroundColor }
    );
    assert('4.2: Body .dark: card triggers dark:text-white', 
      isWhite(cardColors.color), 
      { actual: cardColors.color }
    );

    // --- SUITE 5: DARK MODE VIA body.theme-dark (App.tsx Body Implementation) ---
    resetDOM();
    document.body.classList.add('theme-dark');
    cardColors = getColors(document.getElementById('test-card'));

    assert('5.1: Body .theme-dark: card triggers dark:bg-slate-900', 
      isSlate900(cardColors.backgroundColor), 
      { actual: cardColors.backgroundColor }
    );
    assert('5.2: Body .theme-dark: card triggers dark:text-white', 
      isWhite(cardColors.color), 
      { actual: cardColors.color }
    );

    // --- SUITE 6: DUAL ROOT + BODY CLASSES (as applied simultaneously by App.tsx) ---
    resetDOM();
    document.documentElement.classList.add('theme-dark');
    document.body.classList.add('theme-dark');
    rootColors = getColors(document.getElementById('root'));
    cardColors = getColors(document.getElementById('test-card'));

    assert('6.1: Dual html.theme-dark + body.theme-dark: #root is #0B0F17', 
      rootColors.backgroundColor === 'rgb(11, 15, 23)', 
      { actual: rootColors.backgroundColor, expected: 'rgb(11, 15, 23)' }
    );
    assert('6.2: Dual html.theme-dark + body.theme-dark: #root has NO gradient bleed', 
      rootColors.backgroundImage === 'none', 
      { actual: rootColors.backgroundImage, expected: 'none' }
    );
    assert('6.3: Dual html.theme-dark + body.theme-dark: card is dark:bg-slate-900', 
      isSlate900(cardColors.backgroundColor), 
      { actual: cardColors.backgroundColor }
    );

    // --- SUITE 7: NESTED CONTAINER SCOPING ---
    resetDOM();
    const nested = document.getElementById('nested-isolated-container');
    const nestedItem = document.getElementById('nested-test-item');
    
    // Light mode baseline for nested
    assert('7.1: Isolated nested element in light mode has white background', 
      isWhite(getColors(nestedItem).backgroundColor), 
      { actual: getColors(nestedItem).backgroundColor }
    );

    // Scoped container with .dark
    nested.className = 'dark';
    assert('7.2: Container with .dark scopes dark:bg-slate-800 to nested children', 
      isSlate800(getColors(nestedItem).backgroundColor), 
      { actual: getColors(nestedItem).backgroundColor }
    );

    // Scoped container with .theme-dark
    nested.className = 'theme-dark';
    assert('7.3: Container with .theme-dark scopes dark:bg-slate-800 to nested children', 
      isSlate800(getColors(nestedItem).backgroundColor), 
      { actual: getColors(nestedItem).backgroundColor }
    );

    // --- SUITE 8: DYNAMIC THEME SWITCHING (REVERSIBILITY STRESS TEST) ---
    resetDOM();
    document.documentElement.classList.add('theme-dark');
    document.body.classList.add('theme-dark');
    // Rapid toggle
    for (let i = 0; i < 20; i++) {
      if (i % 2 === 0) {
        document.documentElement.className = 'theme-light';
        document.body.className = 'theme-light';
      } else {
        document.documentElement.className = 'theme-dark';
        document.body.className = 'theme-dark';
      }
    }
    // Settle on light mode
    document.documentElement.className = 'theme-light';
    document.body.className = 'theme-light';
    rootColors = getColors(document.getElementById('root'));
    cardColors = getColors(document.getElementById('test-card'));

    assert('8.1: Reversibility: After 20 rapid flips settling on theme-light, #root is #F8FAFC', 
      rootColors.backgroundColor === 'rgb(248, 250, 252)', 
      { actual: rootColors.backgroundColor }
    );
    assert('8.2: Reversibility: After flips, #root has ZERO gradient bleed', 
      rootColors.backgroundImage === 'none', 
      { actual: rootColors.backgroundImage }
    );
    assert('8.3: Reversibility: Card returns cleanly to rgb(255, 255, 255)', 
      isWhite(cardColors.backgroundColor), 
      { actual: cardColors.backgroundColor }
    );

    // Write results to DOM for scraper
    const resultsEl = document.getElementById('results');
    resultsEl.setAttribute('data-results', JSON.stringify(testRuns));
    resultsEl.setAttribute('data-done', 'true');
  </script>
</body>
</html>`;

// Ephemeral server
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(htmlContent);
});

server.listen(0, '127.0.0.1', () => {
  const port = server.address().port;
  const testUrl = `http://127.0.0.1:${port}`;

  const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  const chromeArgs = [
    '--headless=new',
    '--dump-dom',
    '--disable-gpu',
    testUrl
  ];

  const child = spawn(chromePath, chromeArgs);
  let stdout = '';
  let stderr = '';

  child.stdout.on('data', chunk => { stdout += chunk; });
  child.stderr.on('data', chunk => { stderr += chunk; });

  child.on('close', code => {
    server.close();
    if (code !== 0) {
      console.error('Chrome process exited with code', code);
      console.error(stderr);
      process.exit(1);
    }

    const match = stdout.match(/data-results="([^"]+)"/);
    if (!match) {
      console.error('Failed to extract data-results from rendered DOM.');
      console.error('DOM Output preview:\n', stdout.slice(0, 500));
      process.exit(1);
    }

    const unescaped = match[1].replace(/&quot;/g, '"');
    const results = JSON.parse(unescaped);

    console.log('\n======================================================================');
    console.log('🧪 EMPIRICAL BROWSER THEME ENGINE & CSS INTEGRATION CHALLENGE');
    console.log('   Headless Google Chrome (macOS arm64) Real Engine Verification');
    console.log('======================================================================\n');

    let allPassed = true;
    let passCount = 0;
    let failCount = 0;

    for (const t of results) {
      const icon = t.passed ? '✅ PASS' : '❌ FAIL';
      console.log(`  ${icon}  ${t.name}`);
      if (!t.passed) {
        allPassed = false;
        failCount++;
        console.log(`         Details:`, JSON.stringify(t.details));
      } else {
        passCount++;
      }
    }

    console.log('\n----------------------------------------------------------------------');
    console.log(`Total Empirical Checks: ${results.length}`);
    console.log(`Passed Checks:          ${passCount}`);
    console.log(`Failed Checks:          ${failCount}`);
    console.log('----------------------------------------------------------------------\n');

    if (!allPassed) {
      console.error('💥 EMPIRICAL THEME VERIFICATION FAILED!\n');
      process.exit(1);
    } else {
      console.log('🎉 ALL EMPIRICAL THEME & CSS CHECKS PASSED!\n');
      process.exit(0);
    }
  });
});
