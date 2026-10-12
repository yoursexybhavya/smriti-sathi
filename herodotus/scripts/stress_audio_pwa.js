/**
 * Herodotus — Comprehensive Empirical Stress Test Harness
 * 
 * Target: Audio Engine Lifecycle, 5-Language Switching, Audio Scripts Quality, and PWA SW Simulation
 * Author: orchestrator_14_challenger_2 (Adversarial Empirical Challenger)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { EventEmitter } from 'events';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const HERODOTUS_ROOT = path.resolve(__dirname, '..');

// ANSI Colors
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const GRAY = '\x1b[90m';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failures = [];

function assert(condition, testId, description, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ${GREEN}✔ PASS${RESET} ${BOLD}${testId}${RESET}: ${description}`);
  } else {
    failedTests++;
    const failObj = { testId, description, details };
    failures.push(failObj);
    console.log(`  ${RED}✖ FAIL${RESET} ${BOLD}${testId}${RESET}: ${description}`);
    if (details) {
      console.log(`    ${YELLOW}↳ Finding: ${details}${RESET}`);
    }
  }
}

function printHeader(title) {
  console.log(`\n${BOLD}${CYAN}================================================================================${RESET}`);
  console.log(`${BOLD}${CYAN}⚡ STRESS SUITE: ${title}${RESET}`);
  console.log(`${BOLD}${CYAN}================================================================================${RESET}\n`);
}

// ============================================================================
// SIMULATION ENVIRONMENT: W3C Web Speech API Mock Engine
// ============================================================================
class MockSpeechSynthesisUtterance extends EventEmitter {
  constructor(text = '') {
    super();
    this.text = text;
    this.lang = 'en-IN';
    this.voice = null;
    this.rate = 1.0;
    this.pitch = 1.0;
    this.volume = 1.0;
    this.onstart = null;
    this.onend = null;
    this.onerror = null;
    this.onpause = null;
    this.onresume = null;
    this.onboundary = null;
    this._cancelled = false;
  }
}

class MockSpeechSynthesis extends EventEmitter {
  constructor() {
    super();
    this.speaking = false;
    this.paused = false;
    this.pending = false;
    this._queue = [];
    this._currentUtterance = null;
    this._voices = [];
    this.onvoiceschanged = null;
  }

  getVoices() {
    return this._voices;
  }

  speak(utterance) {
    this._queue.push(utterance);
    this.pending = this._queue.length > 1;
    if (!this.speaking && !this.paused) {
      this._processQueue();
    }
  }

  _processQueue() {
    if (this._queue.length === 0) {
      this.speaking = false;
      this.pending = false;
      this._currentUtterance = null;
      return;
    }

    const utt = this._queue.shift();
    this._currentUtterance = utt;
    this.speaking = true;
    this.pending = this._queue.length > 0;

    // Asynchronously dispatch start
    setImmediate(() => {
      if (utt._cancelled) return;
      if (utt.onstart) utt.onstart({ type: 'start', utterance: utt });
    });
  }

  pause() {
    if (this.speaking && !this.paused) {
      this.paused = true;
      if (this._currentUtterance && this._currentUtterance.onpause) {
        this._currentUtterance.onpause({ type: 'pause' });
      }
    }
  }

  resume() {
    if (this.paused) {
      this.paused = false;
      if (this._currentUtterance && this._currentUtterance.onresume) {
        this._currentUtterance.onresume({ type: 'resume' });
      }
    }
  }

  cancel() {
    const cancelledUtterances = [...this._queue];
    if (this._currentUtterance) {
      cancelledUtterances.unshift(this._currentUtterance);
    }

    this._queue = [];
    this._currentUtterance = null;
    this.speaking = false;
    this.paused = false;
    this.pending = false;

    // Asynchronously dispatch 'canceled' error events in compliance with W3C spec
    for (const utt of cancelledUtterances) {
      utt._cancelled = true;
      setImmediate(() => {
        if (utt.onerror) {
          utt.onerror({ type: 'error', error: 'canceled', utterance: utt });
        }
      });
    }
  }

  _completeCurrent() {
    if (this._currentUtterance) {
      const utt = this._currentUtterance;
      this._currentUtterance = null;
      this.speaking = false;
      if (utt.onend) {
        utt.onend({ type: 'end', utterance: utt });
      }
      this._processQueue();
    }
  }
}

// Setup global browser simulation
const mockSpeechSynthesis = new MockSpeechSynthesis();
globalThis.window = {
  speechSynthesis: mockSpeechSynthesis,
};
globalThis.SpeechSynthesisUtterance = MockSpeechSynthesisUtterance;

// Populate realistic Indian voices
mockSpeechSynthesis._voices = [
  { name: 'Google हिन्दी', lang: 'hi-IN', default: false, localService: true },
  { name: 'Google தமிழ்', lang: 'ta-IN', default: false, localService: true },
  { name: 'Google తెలుగు', lang: 'te-IN', default: false, localService: true },
  { name: 'Google বাংলা', lang: 'bn-IN', default: false, localService: true },
  { name: 'Google English (India)', lang: 'en-IN', default: true, localService: true },
  { name: 'Google US English', lang: 'en-US', default: false, localService: true },
];

async function runAllStressTests() {
  console.log(`${BOLD}================================================================================${RESET}`);
  console.log(`${BOLD}🛡️  HERODOTUS ADVERSARIAL CHALLENGER STRESS HARNESS${RESET}`);
  console.log(`${BOLD}Target: Audio Lifecycle, 5-Language Switching, 50-Monument Dataset, PWA SW${RESET}`);
  console.log(`${BOLD}================================================================================${RESET}`);

  // ==========================================================================
  // SECTION 1: 50-MONUMENT DATASET & AUDIO SCRIPT INTEGRITY STRESS
  // ==========================================================================
  printHeader('1. 50-Monument Catalog & 5-Language Audio Script Stress Audit');

  const monumentsPath = path.resolve(HERODOTUS_ROOT, 'src/data/monuments.json');
  const monuments = JSON.parse(fs.readFileSync(monumentsPath, 'utf-8'));
  const langs = ['en', 'hi', 'ta', 'te', 'bn'];

  assert(
    monuments.length >= 50,
    'S1.1',
    `Catalog scale: Contains at least 50 monuments (Actual: ${monuments.length})`
  );

  let missingLangs = 0;
  let emptyScripts = 0;
  let shortScripts = [];
  let scriptWordCounts = { en: [], hi: [], ta: [], te: [], bn: [] };
  let scriptCharCounts = { en: [], hi: [], ta: [], te: [], bn: [] };

  const unicodeRanges = {
    hi: /[\u0900-\u097F]/, // Devanagari
    ta: /[\u0B80-\u0BFF]/, // Tamil
    te: /[\u0C00-\u0C7F]/, // Telugu
    bn: /[\u0980-\u09FF]/, // Bengali
    en: /[a-zA-Z]/,        // Latin
  };
  let unicodeViolations = [];

  monuments.forEach((m) => {
    if (!m.audioNarrations) {
      missingLangs += 5;
      return;
    }

    langs.forEach((lang) => {
      const audio = m.audioNarrations[lang];
      if (!audio || !audio.narrationText || audio.narrationText.trim() === '') {
        emptyScripts++;
        return;
      }

      const text = audio.narrationText.trim();
      const words = text.split(/\s+/).filter(Boolean).length;
      const chars = text.length;

      scriptWordCounts[lang].push(words);
      scriptCharCounts[lang].push(chars);

      if (words < 40) {
        shortScripts.push({ id: m.id, lang, words, snippet: text.slice(0, 40) });
      }

      const regex = unicodeRanges[lang];
      if (!regex.test(text)) {
        unicodeViolations.push({ id: m.id, lang, snippet: text.slice(0, 30) });
      }
    });
  });

  assert(
    missingLangs === 0 && emptyScripts === 0,
    'S1.2',
    `Audio script completeness: 250/250 scripts present and non-empty (Missing: ${missingLangs}, Empty: ${emptyScripts})`
  );

  assert(
    shortScripts.length === 0,
    'S1.3',
    `Regional audio script word count threshold: All scripts contain >= 40 words (Short: ${shortScripts.length})`,
    shortScripts.length > 0 ? `Found ${shortScripts.length} scripts with < 40 words: ${JSON.stringify(shortScripts.slice(0, 3))}` : ''
  );

  assert(
    unicodeViolations.length === 0,
    'S1.4',
    `Native Unicode script compliance: All regional scripts use authentic scripts (Devanagari, Tamil, Telugu, Bengali) (Violations: ${unicodeViolations.length})`,
    unicodeViolations.length > 0 ? `Violations: ${JSON.stringify(unicodeViolations.slice(0, 3))}` : ''
  );

  let duplicateScriptsCount = 0;
  langs.forEach((lang) => {
    const textSet = new Set();
    monuments.forEach((m) => {
      const text = m.audioNarrations?.[lang]?.narrationText?.trim();
      if (text) {
        if (textSet.has(text)) duplicateScriptsCount++;
        textSet.add(text);
      }
    });
  });

  assert(
    duplicateScriptsCount === 0,
    'S1.5',
    `Script distinctness: All 250 scripts are unique across monuments (Duplicates: ${duplicateScriptsCount})`
  );

  let tempoViolations = [];
  monuments.forEach((m) => {
    langs.forEach((lang) => {
      const audio = m.audioNarrations?.[lang];
      if (audio) {
        const words = audio.narrationText.trim().split(/\s+/).filter(Boolean).length;
        const dur = audio.durationSeconds;
        const wps = words / dur;
        if (wps < 0.1 || wps > 3.0) {
          tempoViolations.push({ id: m.id, lang, words, dur, wps: wps.toFixed(2) });
        }
      }
    });
  });

  assert(
    tempoViolations.length === 0,
    'S1.6',
    `Audio duration realism: Tempo ratio within 0.1–3.0 words/sec across all 250 scripts (Violations: ${tempoViolations.length})`,
    tempoViolations.length > 0 ? `Sample violations: ${JSON.stringify(tempoViolations.slice(0, 3))}` : ''
  );

  // ==========================================================================
  // SECTION 2: WEB SPEECH API LIFECYCLE & STATE MACHINE STRESS
  // ==========================================================================
  printHeader('2. Web Speech API Lifecycle & State Transition Stress');

  // Transpile speech.ts using esbuild
  const compiledJs = execSync(
    'npx esbuild src/lib/speech.ts --format=esm --target=es2022',
    { cwd: HERODOTUS_ROOT, encoding: 'utf-8' }
  );

  const tempModulePath = path.resolve(HERODOTUS_ROOT, 'scripts', '_temp_speech.mjs');
  fs.writeFileSync(tempModulePath, compiledJs, 'utf-8');

  let speechLib;
  try {
    speechLib = await import(`file://${tempModulePath}?t=${Date.now()}`);
  } finally {
    try { fs.unlinkSync(tempModulePath); } catch {}
  }

  // Test 2.1: Voice selection fidelity
  speechLib.initSpeechEngine();
  const enVoice = speechLib.selectVoiceForLanguage('en');
  const hiVoice = speechLib.selectVoiceForLanguage('hi');
  const taVoice = speechLib.selectVoiceForLanguage('ta');

  assert(
    enVoice?.lang === 'en-IN' && hiVoice?.lang === 'hi-IN' && taVoice?.lang === 'ta-IN',
    'S2.1',
    `Voice selection: Exact regional voice match (EN: ${enVoice?.lang}, HI: ${hiVoice?.lang}, TA: ${taVoice?.lang})`
  );

  // Test 2.2: Standard sequential lifecycle
  let stateHistory = [];
  const stateTracker = (st) => stateHistory.push(st);

  speechLib.playNarration('Testing Herodotus Speech Audio Lifecycle', 'en', 1.0, {
    onStateChange: stateTracker,
  });

  await new Promise((r) => setTimeout(r, 10));

  assert(
    stateHistory.includes('playing'),
    'S2.2',
    `Speech initiation: playNarration transitions state to 'playing'`
  );

  speechLib.pauseNarration({ onStateChange: stateTracker });
  assert(
    stateHistory[stateHistory.length - 1] === 'paused',
    'S2.3',
    `Speech pause: pauseNarration transitions state to 'paused'`
  );

  speechLib.resumeNarration({ onStateChange: stateTracker });
  assert(
    stateHistory[stateHistory.length - 1] === 'playing',
    'S2.4',
    `Speech resume: resumeNarration transitions state back to 'playing'`
  );

  speechLib.stopNarration({ onStateChange: stateTracker });
  assert(
    stateHistory[stateHistory.length - 1] === 'stopped',
    'S2.5',
    `Speech termination: stopNarration transitions state to 'stopped'`
  );

  // Test 2.6: Rate Clamping Stress
  let testUtt;
  const originalSpeak = mockSpeechSynthesis.speak.bind(mockSpeechSynthesis);
  mockSpeechSynthesis.speak = (utt) => {
    testUtt = utt;
    originalSpeak(utt);
  };

  speechLib.playNarration('Rate test underflow', 'en', 0.1);
  assert(testUtt?.rate === 0.75, 'S2.6', `Rate clamping underflow: rate 0.1 clamped to 0.75 (Actual: ${testUtt?.rate})`);

  speechLib.playNarration('Rate test overflow', 'en', 5.0);
  assert(testUtt?.rate === 1.5, 'S2.7', `Rate clamping overflow: rate 5.0 clamped to 1.5 (Actual: ${testUtt?.rate})`);

  // Test 2.8: Rapid State Machine Stress (100 rapid random transitions)
  let rapidErrors = 0;
  const actions = ['play', 'pause', 'resume', 'stop'];
  for (let i = 0; i < 100; i++) {
    const act = actions[Math.floor(Math.random() * actions.length)];
    try {
      if (act === 'play') speechLib.playNarration(`Stress sentence ${i}`, 'hi', 1.0);
      else if (act === 'pause') speechLib.pauseNarration();
      else if (act === 'resume') speechLib.resumeNarration();
      else if (act === 'stop') speechLib.stopNarration();
    } catch (e) {
      rapidErrors++;
    }
  }
  speechLib.stopNarration();
  await new Promise((r) => setTimeout(r, 20));

  assert(
    rapidErrors === 0,
    'S2.8',
    `State machine stress: 100 rapid random transitions execute without uncaught exceptions (Errors: ${rapidErrors})`
  );

  // ==========================================================================
  // SECTION 3: RAPID LANGUAGE SWITCHING & ASYNCHRONOUS CANCELLATION RACE CONDITION
  // ==========================================================================
  printHeader('3. Rapid Language Switching & Asynchronous Cancellation Race Condition');

  let u2StateHistory = [];
  speechLib.playNarration('English active narration text that is currently playing', 'en', 1.0, {
    onStateChange: (s) => {},
  });
  await new Promise((r) => setTimeout(r, 10));

  speechLib.playNarration('हिन्दी भाषा में सक्रिय ऐतिहासिक कथन', 'hi', 1.0, {
    onStateChange: (s) => u2StateHistory.push(s),
  });

  await new Promise((r) => setTimeout(r, 50));

  const hasPrematureIdle = u2StateHistory.includes('idle') && mockSpeechSynthesis.speaking;

  assert(
    !hasPrematureIdle,
    'S3.1',
    `Asynchronous cancellation isolation: Utterance 1 cancellation does not prematurely force Utterance 2 into 'idle' state`,
    hasPrematureIdle ? `Utterance 2 received 'idle' state while speech was still active! History: ${JSON.stringify(u2StateHistory)}` : ''
  );

  // Test 3.2: Rapid cycle through all 5 languages without overlapping speech
  mockSpeechSynthesis.cancel();
  await new Promise((r) => setTimeout(r, 20));

  let overlapCount = 0;
  const langSwitchList = ['en', 'hi', 'ta', 'te', 'bn', 'en'];
  for (const l of langSwitchList) {
    speechLib.playNarration(`Testing speech queueing in ${l}`, l, 1.0);
    if (mockSpeechSynthesis._queue.length > 1) {
      overlapCount++;
    }
  }
  speechLib.stopNarration();
  await new Promise((r) => setTimeout(r, 20));

  assert(
    overlapCount === 0,
    'S3.2',
    `Utterance overlap prevention: Active utterance cancelled cleanly before new language begins (Overlaps: ${overlapCount})`
  );

  // Test 3.3: Component conflict inspection in AudioPlayer.tsx
  const audioPlayerSource = fs.readFileSync(
    path.resolve(HERODOTUS_ROOT, 'src/components/AudioPlayer/AudioPlayer.tsx'),
    'utf-8'
  );

  const hasConflictingStop = /onLanguageChange\([^)]+\);\s*if\s*\([^)]+\)\s*onStop\(\)/.test(audioPlayerSource);

  assert(
    !hasConflictingStop,
    'S3.3',
    `AudioPlayer language tab conflict: Tab switch does not call onStop() immediately after onLanguageChange()`,
    hasConflictingStop ? `AudioPlayer.tsx line 114 executes 'if (isActive) onStop();' immediately after 'onLanguageChange(lang.code);', which aborts speech that App.tsx initiated!` : ''
  );

  // ==========================================================================
  // SECTION 4: PWA SERVICE WORKER CACHING & OFFLINE RESILIENCE
  // ==========================================================================
  printHeader('4. PWA Service Worker & Offline Caching Simulation');

  const swPath = path.resolve(HERODOTUS_ROOT, 'public/sw.js');
  const manifestPath = path.resolve(HERODOTUS_ROOT, 'public/manifest.json');
  const swCode = fs.readFileSync(swPath, 'utf-8');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

  assert(
    manifest.display === 'standalone' &&
    manifest.start_url === '/' &&
    manifest.theme_color === '#C69214' &&
    manifest.icons?.length >= 2,
    'S4.1',
    `Manifest schema: Valid standalone PWA manifest with amber gold theme and standard icons`
  );

  let missingIcons = [];
  manifest.icons.forEach((ic) => {
    const iconRel = ic.src.startsWith('/') ? ic.src.slice(1) : ic.src;
    const iconAbs = path.resolve(HERODOTUS_ROOT, 'public', iconRel);
    if (!fs.existsSync(iconAbs)) {
      missingIcons.push(ic.src);
    }
  });

  assert(
    missingIcons.length === 0,
    'S4.2',
    `Manifest icon physical presence: All icons exist on disk (Missing: ${missingIcons.length})`,
    missingIcons.length > 0 ? `Missing icons: ${missingIcons.join(', ')}` : ''
  );

  const staticAssetsMatch = swCode.match(/const STATIC_ASSETS\s*=\s*\[([\s\S]*?)\];/);
  let staticAssets = [];
  if (staticAssetsMatch) {
    staticAssets = eval(`[${staticAssetsMatch[1]}]`);
  }

  assert(
    staticAssets.length > 0,
    'S4.3',
    `Service Worker STATIC_ASSETS enumeration: Extracted ${staticAssets.length} cached static asset URLs`
  );

  let missingStaticAssets = [];
  staticAssets.forEach((assetUrl) => {
    if (assetUrl === '/' || assetUrl === '/index.html') {
      const idxDist = path.resolve(HERODOTUS_ROOT, 'index.html');
      if (!fs.existsSync(idxDist)) missingStaticAssets.push(assetUrl);
    } else {
      const cleanUrl = assetUrl.startsWith('/') ? assetUrl.slice(1) : assetUrl;
      const pubPath = path.resolve(HERODOTUS_ROOT, 'public', cleanUrl);
      if (!fs.existsSync(pubPath)) {
        missingStaticAssets.push(assetUrl);
      }
    }
  });

  assert(
    missingStaticAssets.length === 0,
    'S4.4',
    `Service worker static asset physical presence: All STATIC_ASSETS exist on disk (Missing: ${missingStaticAssets.length})`,
    missingStaticAssets.length > 0 ? `Missing assets: ${missingStaticAssets.join(', ')}` : ''
  );

  const hasPromiseOrBug = /caches\.match\(['"][^'"]+['"]\)\s*\|\|\s*caches\.match\(['"][^'"]+['"]\)/.test(swCode);

  assert(
    !hasPromiseOrBug,
    'S4.5',
    `Service worker offline navigate fallback syntax: Proper Promise chain instead of invalid 'Promise || Promise'`,
    hasPromiseOrBug ? `sw.js line 73 uses 'caches.match("/") || caches.match("/index.html")'. Since caches.match() returns a Promise (truthy object), the RHS is dead code and unresolved match returns undefined!` : ''
  );

  class MockCache {
    constructor(name) {
      this.name = name;
      this.store = new Map();
    }
    async add(url) {
      this.store.set(url, new Response(`Content of ${url}`, { status: 200 }));
    }
    async match(req) {
      const url = typeof req === 'string' ? req : req.url;
      return this.store.get(url) || null;
    }
    async put(req, res) {
      const url = typeof req === 'string' ? req : req.url;
      this.store.set(url, res);
    }
  }

  const mockCache = new MockCache('herodotus-v1');
  for (const a of staticAssets) {
    await mockCache.add(a);
  }

  const monumentsCachedRes = await mockCache.match('/data/monuments.json');
  assert(
    monumentsCachedRes !== null,
    'S4.6',
    `PWA Cache Storage simulation: Offline fetch for '/data/monuments.json' returns cached response`
  );

  // ==========================================================================
  // SECTION 5: PRODUCTION BUILD & ASSET BUDGET VERIFICATION
  // ==========================================================================
  printHeader('5. Production Build Output & Payload Budget');

  const distPath = path.resolve(HERODOTUS_ROOT, 'dist');
  const distExists = fs.existsSync(distPath);
  assert(distExists, 'S5.1', `Production build directory exists at herodotus/dist/`);

  let distAssets = [];
  if (distExists) {
    const assetsDir = path.resolve(distPath, 'assets');
    if (fs.existsSync(assetsDir)) {
      distAssets = fs.readdirSync(assetsDir);
    }
  }

  const hasJsBundle = distAssets.some((f) => f.endsWith('.js'));
  const hasCssBundle = distAssets.some((f) => f.endsWith('.css'));

  assert(
    hasJsBundle && hasCssBundle,
    'S5.2',
    `Production bundle enumeration: Found compiled JS and CSS bundles in dist/assets/`
  );

  // ==========================================================================
  // FINAL HARNESS SUMMARY & VERDICT GENERATION
  // ==========================================================================
  console.log(`\n${BOLD}================================================================================${RESET}`);
  console.log(`${BOLD}📊 STRESS HARNESS SUMMARY REPORT${RESET}`);
  console.log(`${BOLD}================================================================================${RESET}`);
  console.log(`Total Invocations: ${totalTests}`);
  console.log(`Passed Assertions: ${GREEN}${passedTests}${RESET}`);
  console.log(`Failed Assertions: ${failedTests > 0 ? RED : GREEN}${failedTests}${RESET}`);
  console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%\n`);

  if (failures.length > 0) {
    console.log(`${BOLD}${RED}🚨 CONFIRMED IMPLEMENTATION DEFECTS (${failures.length}):${RESET}`);
    failures.forEach((f, idx) => {
      console.log(`  ${idx + 1}. [${f.testId}] ${f.description}`);
      console.log(`     ${YELLOW}Details: ${f.details}${RESET}`);
    });
    console.log(`\n${BOLD}${RED}RECOMMENDED VERDICT: REQUEST_CHANGES${RESET}\n`);
  } else {
    console.log(`${BOLD}${GREEN}🎉 ALL ADVERSARIAL STRESS CHECKS PASSED WITH ZERO DEFECTS!${RESET}`);
    console.log(`\n${BOLD}${GREEN}RECOMMENDED VERDICT: APPROVE${RESET}\n`);
  }

  return { totalTests, passedTests, failedTests, failures };
}

runAllStressTests().then((res) => {
  if (res.failedTests > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}).catch((err) => {
  console.error('Fatal stress harness exception:', err);
  process.exit(2);
});
