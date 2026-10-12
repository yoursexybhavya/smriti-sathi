/**
 * Herodotus Heritage Guide — 4-Tier Automated Verification Runner
 * 
 * Architecture:
 * - Tier 1: Feature Coverage (>=5 tests per feature across R1-R6)
 * - Tier 2: Boundary & Corner Cases (>=5 tests per feature area)
 * - Tier 3: Cross-Feature Combinations (Pairwise coverage)
 * - Tier 4: Real-World Application Workload Scenarios
 * 
 * Executable via:
 *   node scripts/verify_herodotus.js
 *   npm test
 */

import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

// ----------------------------------------------------------------------------
// Test Runner Harness
// ----------------------------------------------------------------------------
class TestRunner {
  constructor() {
    this.currentTier = '';
    this.currentSuite = '';
    this.results = [];
    this.startTime = Date.now();
  }

  setTier(name) {
    this.currentTier = name;
    console.log(`\n\x1b[1m\x1b[36m================================================================================\x1b[0m`);
    console.log(`\x1b[1m\x1b[35m🏛️  ${name}\x1b[0m`);
    console.log(`\x1b[1m\x1b[36m================================================================================\x1b[0m`);
  }

  suite(name) {
    this.currentSuite = name;
    console.log(`\n\x1b[1m\x1b[33m▶ Suite: ${name}\x1b[0m`);
  }

  test(description, fn) {
    const testRecord = {
      tier: this.currentTier,
      suite: this.currentSuite,
      description,
      passed: false,
      error: null,
      durationMs: 0
    };

    const start = performance.now();
    try {
      fn();
      testRecord.passed = true;
      testRecord.durationMs = +(performance.now() - start).toFixed(2);
      console.log(`  \x1b[32m✔ PASS\x1b[0m ${description} \x1b[90m(${testRecord.durationMs}ms)\x1b[0m`);
    } catch (err) {
      testRecord.passed = false;
      testRecord.error = err.message || String(err);
      testRecord.durationMs = +(performance.now() - start).toFixed(2);
      console.log(`  \x1b[31m✖ FAIL\x1b[0m ${description}`);
      console.log(`    \x1b[31mError: ${testRecord.error}\x1b[0m`);
    }
    this.results.push(testRecord);
  }

  printSummary() {
    const totalDuration = ((Date.now() - this.startTime) / 1000).toFixed(2);
    const total = this.results.length;
    const passed = this.results.filter(r => r.passed).length;
    const failed = this.results.filter(r => !r.passed).length;

    // Group by Tier
    const tierMap = new Map();
    for (const r of this.results) {
      if (!tierMap.has(r.tier)) {
        tierMap.set(r.tier, { total: 0, passed: 0, failed: 0 });
      }
      const st = tierMap.get(r.tier);
      st.total++;
      if (r.passed) st.passed++;
      else st.failed++;
    }

    console.log(`\n\x1b[1m\x1b[36m================================================================================\x1b[0m`);
    console.log(`\x1b[1m\x1b[37m📊 HERODOTUS 4-TIER VERIFICATION AUDIT SUMMARY\x1b[0m`);
    console.log(`\x1b[1m\x1b[36m================================================================================\x1b[0m`);
    console.log(`\x1b[1m%-48s | %-6s | %-6s | %-6s | %-8s\x1b[0m`
      .replace('%-48s', 'Tier Name'.padEnd(46))
      .replace('%-6s', 'Total'.padEnd(6))
      .replace('%-6s', 'Pass'.padEnd(6))
      .replace('%-6s', 'Fail'.padEnd(6))
      .replace('%-8s', 'Rate'.padEnd(8))
    );
    console.log(`-`.repeat(80));

    for (const [tierName, stats] of tierMap.entries()) {
      const passRate = ((stats.passed / stats.total) * 100).toFixed(1) + '%';
      const color = stats.failed === 0 ? '\x1b[32m' : '\x1b[31m';
      console.log(
        `${tierName.padEnd(46)} | ` +
        `${String(stats.total).padEnd(6)} | ` +
        `\x1b[32m${String(stats.passed).padEnd(6)}\x1b[0m | ` +
        `${color}${String(stats.failed).padEnd(6)}\x1b[0m | ` +
        `${passRate.padEnd(8)}`
      );
    }
    console.log(`-`.repeat(80));
    console.log(`\x1b[1mTotal Tests: ${total} | Passed: \x1b[32m${passed}\x1b[0m | Failed: ${failed > 0 ? `\x1b[31m${failed}\x1b[0m` : '0'} | Duration: ${totalDuration}s\x1b[0m`);

    if (failed > 0) {
      console.log(`\n\x1b[1m\x1b[31m🚨 IMPLEMENTATION DEFECTS DISCOVERED (ESCALATION LOG):\x1b[0m`);
      let defectIdx = 1;
      for (const r of this.results) {
        if (!r.passed) {
          console.log(`\x1b[31m[Defect #${defectIdx++}] [${r.tier}] ${r.description}\x1b[0m`);
          console.log(`  \x1b[33mDetail:\x1b[0m ${r.error}`);
        }
      }
      console.log(`\n\x1b[33mNote: These defects reflect genuine implementation gaps in monuments.json / application code to be escalated to implementing agents for Milestone M7 hardening.\x1b[0m\n`);
    } else {
      console.log(`\n\x1b[1m\x1b[32m🎉 100% OF ALL 4-TIER VERIFICATION TESTS PASSED SUCCESSFULLY!\x1b[0m\n`);
    }

    return failed;
  }
}

// ----------------------------------------------------------------------------
// Assertions & Helpers
// ----------------------------------------------------------------------------
function expect(actual) {
  return {
    toBe(expected, msg = '') {
      if (actual !== expected) {
        throw new Error(`${msg} Expected ${JSON.stringify(expected)}, but got ${JSON.stringify(actual)}`);
      }
    },
    toEqual(expected, msg = '') {
      const a = JSON.stringify(actual);
      const b = JSON.stringify(expected);
      if (a !== b) {
        throw new Error(`${msg} Expected deep equality. Expected ${b}, got ${a}`);
      }
    },
    toBeGreaterThanOrEqual(min, msg = '') {
      if (actual < min) {
        throw new Error(`${msg} Expected value >= ${min}, but got ${actual}`);
      }
    },
    toBeLessThanOrEqual(max, msg = '') {
      if (actual > max) {
        throw new Error(`${msg} Expected value <= ${max}, but got ${actual}`);
      }
    },
    toBeBetween(min, max, msg = '') {
      if (actual < min || actual > max) {
        throw new Error(`${msg} Expected value in range [${min}, ${max}], but got ${actual}`);
      }
    },
    toBeTruthy(msg = '') {
      if (!actual) {
        throw new Error(`${msg} Expected truthy value, but got ${actual}`);
      }
    },
    toBeFalsy(msg = '') {
      if (actual) {
        throw new Error(`${msg} Expected falsy value, but got ${actual}`);
      }
    },
    toContain(substr, msg = '') {
      if (!actual || !actual.includes(substr)) {
        throw new Error(`${msg} Expected to contain "${substr}"`);
      }
    },
    toMatch(regex, msg = '') {
      if (!regex.test(actual)) {
        throw new Error(`${msg} Expected ${actual} to match pattern ${regex}`);
      }
    }
  };
}

// Helper: Resolve paths relative to herodotus directory
const ROOT = fs.existsSync(path.resolve('src/data/monuments.json'))
  ? process.cwd()
  : path.resolve('herodotus');

function resolvePath(rel) {
  return path.join(ROOT, rel);
}

// Haversine formula ground truth implementation
function toRad(deg) {
  return (deg * Math.PI) / 180;
}

function calculateDistanceKm(c1, c2) {
  const R = 6371; // Earth mean radius in km
  const dLat = toRad(c2.lat - c1.lat);
  const dLng = toRad(c2.lng - c1.lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(c1.lat)) *
      Math.cos(toRad(c2.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function formatDistance(distKm) {
  if (distKm < 1) {
    return `${Math.round(distKm * 1000)} m away`;
  }
  return `${distKm.toFixed(1)} km away`;
}

// Voice matching simulation matching src/hooks/useSpeech.ts
function selectVoiceForLanguage(lang, voices) {
  const langCodes = {
    en: ['en-IN', 'en-GB', 'en-US', 'en'],
    hi: ['hi-IN', 'hi', 'hi_IN'],
    ta: ['ta-IN', 'ta', 'ta_LK'],
    te: ['te-IN', 'te'],
    bn: ['bn-IN', 'bn-BD', 'bn']
  };

  const targetCodes = langCodes[lang] || ['en'];

  for (const code of targetCodes) {
    const match = voices.find(v =>
      v.lang.toLowerCase().replace('_', '-').startsWith(code.toLowerCase())
    );
    if (match) return match;
  }
  return voices.find(v => v.default) || voices[0] || null;
}

// ----------------------------------------------------------------------------
// Execution
// ----------------------------------------------------------------------------
const runner = new TestRunner();

console.log(`\x1b[1m\x1b[33m
  _    _                 _       _             
 | |  | |               | |     | |            
 | |__| | ___ _ __ ___  __| | ___ | |_ _   _ ___ 
 |  __  |/ _ \\ '__/ _ \\/ _\` |/ _ \\| __| | | / __|
 | |  | |  __/ | | (_) | (_| | (_) | |_| |_| \\__ \\
 |_|  |_|\\___|_|  \\___/ \\__,_|\\___/ \\__|\\__,_|___/
  HERODOTUS HISTORICAL MONUMENT GUIDE — 4-TIER TEST SUITE
\x1b[0m`);

// ============================================================================
// TIER 1: FEATURE COVERAGE (>=5 tests per feature across R1-R6)
// ============================================================================
runner.setTier('Tier 1: Feature Coverage (R1-R6 Specification Conformance)');

// --- R1: Cinematic Heritage Frontend & PWA App Shell ---
runner.suite('R1: Cinematic Heritage Frontend & PWA App Shell');

runner.test('T1.1: PWA manifest.json exists and is valid JSON', () => {
  const manifestPath = resolvePath('public/manifest.json');
  expect(fs.existsSync(manifestPath)).toBeTruthy('public/manifest.json must exist');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  expect(typeof manifest).toBe('object');
});

runner.test('T1.2: PWA manifest defines app identity and start URL', () => {
  const manifest = JSON.parse(fs.readFileSync(resolvePath('public/manifest.json'), 'utf-8'));
  expect(manifest.name).toContain('Herodotus');
  expect(manifest.short_name).toBe('Herodotus');
  expect(manifest.start_url).toBe('/');
});

runner.test('T1.3: PWA manifest specifies standalone display and portrait orientation', () => {
  const manifest = JSON.parse(fs.readFileSync(resolvePath('public/manifest.json'), 'utf-8'));
  expect(manifest.display).toBe('standalone');
  expect(manifest.orientation).toBe('portrait-primary');
});

runner.test('T1.4: PWA manifest adheres to authentic theme tokens (#C69214 and #0D0B09)', () => {
  const manifest = JSON.parse(fs.readFileSync(resolvePath('public/manifest.json'), 'utf-8'));
  expect(manifest.theme_color.toUpperCase()).toBe('#C69214');
  expect(manifest.background_color.toUpperCase()).toBe('#0D0B09');
});

runner.test('T1.5: PWA manifest specifies icon assets for 192x192 and 512x512', () => {
  const manifest = JSON.parse(fs.readFileSync(resolvePath('public/manifest.json'), 'utf-8'));
  expect(Array.isArray(manifest.icons)).toBeTruthy();
  expect(manifest.icons.length).toBeGreaterThanOrEqual(2);
  const sizes = manifest.icons.map(i => i.sizes);
  expect(sizes.includes('192x192')).toBeTruthy();
  expect(sizes.includes('512x512')).toBeTruthy();
});

runner.test('T1.6: Service worker public/sw.js exists and defines cache storage name', () => {
  const swPath = resolvePath('public/sw.js');
  expect(fs.existsSync(swPath)).toBeTruthy();
  const swContent = fs.readFileSync(swPath, 'utf-8');
  expect(swContent).toContain('CACHE_NAME');
  expect(swContent).toContain('herodotus-v1');
});

runner.test('T1.7: Service worker defines static caching array and implements fetch interception', () => {
  const swContent = fs.readFileSync(resolvePath('public/sw.js'), 'utf-8');
  expect(swContent).toContain('STATIC_ASSETS');
  expect(swContent).toContain("addEventListener('fetch'");
  expect(swContent).toContain('caches.match');
  expect(swContent).toContain('/data/monuments.json');
});

// --- R2: 50-Monument Spatial Catalog & Comprehensive Schema ---
runner.suite('R2: 50-Monument Spatial Catalog & Comprehensive Schema');

let monumentsData = [];
runner.test('T1.8: src/data/monuments.json exists and parses as a valid array', () => {
  const datasetPath = resolvePath('src/data/monuments.json');
  expect(fs.existsSync(datasetPath)).toBeTruthy();
  monumentsData = JSON.parse(fs.readFileSync(datasetPath, 'utf-8'));
  expect(Array.isArray(monumentsData)).toBeTruthy();
});

runner.test('T1.9: Monument catalog contains at least 50 monuments (verifies count >= 50)', () => {
  expect(monumentsData.length).toBeGreaterThanOrEqual(50);
});

runner.test('T1.10: Every monument contains all 23 required schema fields', () => {
  const requiredFields = [
    'id', 'name', 'hindiName', 'alternateNames', 'category', 'coordinates',
    'state', 'city', 'district', 'asiCircle', 'unesco', 'dynasty', 'era',
    'foundedYear', 'shortDescription', 'fullNarrative', 'architecturalHighlights',
    'timeline', 'timings', 'tariffs', 'eTicketUrl', 'heroImage', 'galleryImages',
    'audioNarrations'
  ];

  monumentsData.forEach((m, idx) => {
    for (const f of requiredFields) {
      if (m[f] === undefined || m[f] === null) {
        throw new Error(`Monument #${idx} (${m.id || 'unidentified'}) is missing required field "${f}"`);
      }
    }
  });
});

runner.test('T1.11: Dual-script naming (English name and Devanagari hindiName) is complete across all monuments', () => {
  const devanagariRegex = /[\u0900-\u097F]/;
  monumentsData.forEach(m => {
    expect(typeof m.name === 'string' && m.name.trim().length > 0).toBeTruthy(`Missing name for ${m.id}`);
    expect(typeof m.hindiName === 'string' && m.hindiName.trim().length > 0).toBeTruthy(`Missing hindiName for ${m.id}`);
    expect(devanagariRegex.test(m.hindiName)).toBeTruthy(`hindiName for ${m.id} (${m.hindiName}) lacks Devanagari characters`);
    expect(Array.isArray(m.alternateNames)).toBeTruthy(`alternateNames must be array for ${m.id}`);
  });
});

runner.test('T1.12: Rich storytelling fields exist and are non-empty for all monuments', () => {
  monumentsData.forEach(m => {
    expect(m.shortDescription.length).toBeGreaterThanOrEqual(20, `shortDescription too brief for ${m.id}`);
    expect(m.fullNarrative.length).toBeGreaterThanOrEqual(100, `fullNarrative too brief for ${m.id}`);
    expect(Array.isArray(m.architecturalHighlights) && m.architecturalHighlights.length >= 2).toBeTruthy(
      `architecturalHighlights must have >= 2 items for ${m.id}`
    );
    expect(Array.isArray(m.timeline) && m.timeline.length >= 2).toBeTruthy(
      `timeline must have >= 2 milestones for ${m.id}`
    );
  });
});

runner.test('T1.13: Official visitor logistics are fully populated for all monuments', () => {
  monumentsData.forEach(m => {
    expect(typeof m.timings.open === 'string' && m.timings.open.length > 0).toBeTruthy(`Missing timings.open for ${m.id}`);
    expect(typeof m.timings.close === 'string' && m.timings.close.length > 0).toBeTruthy(`Missing timings.close for ${m.id}`);
    expect(typeof m.timings.bestTimeToVisit === 'string' && m.timings.bestTimeToVisit.length > 0).toBeTruthy(
      `Missing timings.bestTimeToVisit for ${m.id}`
    );
    expect(typeof m.tariffs.indianRupees === 'number').toBeTruthy(`Missing tariffs.indianRupees for ${m.id}`);
    expect(typeof m.tariffs.saarcRupees === 'number').toBeTruthy(`Missing tariffs.saarcRupees for ${m.id}`);
    expect(typeof m.tariffs.foreignRupees === 'number').toBeTruthy(`Missing tariffs.foreignRupees for ${m.id}`);
    expect(typeof m.tariffs.entryFreeUnder15 === 'boolean').toBeTruthy(`Missing entryFreeUnder15 for ${m.id}`);
    expect(typeof m.eTicketUrl === 'string' && m.eTicketUrl.startsWith('http')).toBeTruthy(
      `Invalid eTicketUrl for ${m.id}: ${m.eTicketUrl}`
    );
  });
});

runner.test('T1.14: Audio narrations are present for all 5 official languages (en, hi, ta, te, bn)', () => {
  const expectedLangs = ['en', 'hi', 'ta', 'te', 'bn'];
  monumentsData.forEach(m => {
    expect(typeof m.audioNarrations === 'object').toBeTruthy(`Missing audioNarrations for ${m.id}`);
    for (const lang of expectedLangs) {
      const audio = m.audioNarrations[lang];
      expect(!!audio).toBeTruthy(`Monument ${m.id} missing audio narration for language "${lang}"`);
      expect(typeof audio.narrationText === 'string' && audio.narrationText.length > 0).toBeTruthy(
        `Monument ${m.id} language "${lang}" has empty narrationText`
      );
      expect(typeof audio.durationSeconds === 'number' && audio.durationSeconds > 0).toBeTruthy(
        `Monument ${m.id} language "${lang}" has invalid durationSeconds`
      );
    }
  });
});

// --- R3: Interactive Spatial Cartography Engine ---
runner.suite('R3: Interactive Spatial Cartography Engine');

runner.test('T1.15: Every monument has numeric coordinates.lat and coordinates.lng', () => {
  monumentsData.forEach(m => {
    expect(typeof m.coordinates?.lat === 'number').toBeTruthy(`Invalid lat on ${m.id}`);
    expect(typeof m.coordinates?.lng === 'number').toBeTruthy(`Invalid lng on ${m.id}`);
  });
});

runner.test('T1.16: Monument coordinates are non-zero and non-NaN', () => {
  monumentsData.forEach(m => {
    expect(!isNaN(m.coordinates.lat) && m.coordinates.lat !== 0).toBeTruthy(`Zero/NaN lat on ${m.id}`);
    expect(!isNaN(m.coordinates.lng) && m.coordinates.lng !== 0).toBeTruthy(`Zero/NaN lng on ${m.id}`);
  });
});

runner.test('T1.17: Every monument category belongs to the recognized taxonomy', () => {
  const validCategories = new Set([
    'Fort & Palace',
    'Temple',
    'Tomb & Mausoleum',
    'Mosque',
    'Stepwell',
    'Caves & Rock-cut',
    'Memorial & Gate',
    'Ancient University'
  ]);

  monumentsData.forEach(m => {
    expect(validCategories.has(m.category)).toBeTruthy(
      `Monument ${m.id} has unrecognized category "${m.category}"`
    );
  });
});

runner.test('T1.18: Monument IDs are unique non-empty strings', () => {
  const seenIds = new Set();
  monumentsData.forEach(m => {
    expect(typeof m.id === 'string' && m.id.length > 0).toBeTruthy('Monument ID must be non-empty string');
    expect(!seenIds.has(m.id)).toBeTruthy(`Duplicate monument ID found: ${m.id}`);
    seenIds.add(m.id);
  });
});

runner.test('T1.19: Core Golden Triangle anchors exist (Taj Mahal, Amer Fort, Qutub Minar, Red Fort)', () => {
  const requiredAnchors = ['IN-UP-001', 'IN-RJ-001', 'IN-DL-001', 'IN-DL-003'];
  const ids = new Set(monumentsData.map(m => m.id));
  requiredAnchors.forEach(req => {
    expect(ids.has(req)).toBeTruthy(`Required Golden Triangle anchor ${req} is missing from catalog`);
  });
});

runner.test('T1.20: Every monument has verified heroImage and galleryImages non-empty arrays', () => {
  monumentsData.forEach(m => {
    expect(typeof m.heroImage === 'string' && m.heroImage.length > 0).toBeTruthy(`Missing heroImage on ${m.id}`);
    expect(Array.isArray(m.galleryImages) && m.galleryImages.length > 0).toBeTruthy(
      `Missing or empty galleryImages on ${m.id}`
    );
  });
});

// --- R4: Multilingual Audio Narration Engine ---
runner.suite('R4: Multilingual Audio Narration Engine');

runner.test('T1.21: Audio narration titles are defined and non-empty for all languages', () => {
  const langs = ['en', 'hi', 'ta', 'te', 'bn'];
  monumentsData.forEach(m => {
    for (const l of langs) {
      const title = m.audioNarrations[l]?.title;
      expect(typeof title === 'string' && title.trim().length > 0).toBeTruthy(
        `Missing audio title for ${m.id} [${l}]`
      );
    }
  });
});

runner.test('T1.22: Audio narration durations are positive numbers (durationSeconds > 0)', () => {
  const langs = ['en', 'hi', 'ta', 'te', 'bn'];
  monumentsData.forEach(m => {
    for (const l of langs) {
      const dur = m.audioNarrations[l]?.durationSeconds;
      expect(typeof dur === 'number' && dur > 0).toBeTruthy(
        `Invalid audio duration for ${m.id} [${l}]: ${dur}`
      );
    }
  });
});

runner.test('T1.23: English audio narrations contain valid non-empty English prose', () => {
  monumentsData.forEach(m => {
    const text = m.audioNarrations.en?.narrationText || '';
    expect(text.length).toBeGreaterThanOrEqual(40, `English narration too short for ${m.id}`);
    expect(/[A-Za-z]/.test(text)).toBeTruthy(`English narration for ${m.id} lacks Latin characters`);
  });
});

runner.test('T1.24: Hindi audio narrations contain valid Devanagari script Unicode characters', () => {
  const devanagariRegex = /[\u0900-\u097F]/;
  monumentsData.forEach(m => {
    const text = m.audioNarrations.hi?.narrationText || '';
    expect(devanagariRegex.test(text)).toBeTruthy(`Hindi narration for ${m.id} lacks Devanagari characters`);
  });
});

runner.test('T1.25: Tamil audio narrations contain valid Tamil script Unicode characters', () => {
  const tamilRegex = /[\u0B80-\u0BFF]/;
  monumentsData.forEach(m => {
    const text = m.audioNarrations.ta?.narrationText || '';
    expect(tamilRegex.test(text)).toBeTruthy(`Tamil narration for ${m.id} lacks Tamil characters`);
  });
});

runner.test('T1.26: Telugu audio narrations contain valid Telugu script Unicode characters', () => {
  const teluguRegex = /[\u0C00-\u0C7F]/;
  monumentsData.forEach(m => {
    const text = m.audioNarrations.te?.narrationText || '';
    expect(teluguRegex.test(text)).toBeTruthy(`Telugu narration for ${m.id} lacks Telugu characters`);
  });
});

runner.test('T1.27: Bengali audio narrations contain valid Bengali script Unicode characters', () => {
  const bengaliRegex = /[\u0980-\u09FF]/;
  monumentsData.forEach(m => {
    const text = m.audioNarrations.bn?.narrationText || '';
    expect(bengaliRegex.test(text)).toBeTruthy(`Bengali narration for ${m.id} lacks Bengali characters`);
  });
});

// --- R5: Search, Filter, Geolocation & Circuits ---
runner.suite('R5: Search, Filter, Geolocation & Circuits');

runner.test('T1.28: Curated circuits dataset src/data/circuits.ts exists', () => {
  const circuitsPath = resolvePath('src/data/circuits.ts');
  expect(fs.existsSync(circuitsPath)).toBeTruthy('src/data/circuits.ts must exist');
});

runner.test('T1.29: Curated circuits define at least 4 thematic heritage routes', () => {
  const circuitsCode = fs.readFileSync(resolvePath('src/data/circuits.ts'), 'utf-8');
  const circuitIdMatches = [...circuitsCode.matchAll(/id:\s*["']([^"']+)["']/g)].map(m => m[1]);
  expect(circuitIdMatches.length).toBeGreaterThanOrEqual(4, 'Must define at least 4 circuits');
  expect(circuitIdMatches.includes('golden-triangle')).toBeTruthy('Must include golden-triangle circuit');
  expect(circuitIdMatches.includes('unesco-world-heritage')).toBeTruthy('Must include unesco circuit');
});

runner.test('T1.30: Every circuit defines id, name, subtitle, description, monumentIds, and approxDays', () => {
  const circuitsCode = fs.readFileSync(resolvePath('src/data/circuits.ts'), 'utf-8');
  expect(circuitsCode).toContain('name:');
  expect(circuitsCode).toContain('subtitle:');
  expect(circuitsCode).toContain('description:');
  expect(circuitsCode).toContain('monumentIds:');
  expect(circuitsCode).toContain('approxDays:');
});

runner.test('T1.31: All monument references in circuits resolve to existing monument IDs in monuments.json', () => {
  const circuitsCode = fs.readFileSync(resolvePath('src/data/circuits.ts'), 'utf-8');
  const referencedIds = [...circuitsCode.matchAll(/"(IN-[A-Z]{2}-\d{3})"/g)].map(x => x[1]);
  const catalogIds = new Set(monumentsData.map(m => m.id));
  const missing = referencedIds.filter(id => !catalogIds.has(id));
  expect(missing.length === 0).toBeTruthy(
    `Circuits refer to non-existent monument IDs: ${missing.join(', ')}`
  );
});

runner.test('T1.32: Search indexing fields (name, hindiName, city, state, dynasty, category) are strings', () => {
  monumentsData.forEach(m => {
    expect(typeof m.name === 'string').toBeTruthy();
    expect(typeof m.hindiName === 'string').toBeTruthy();
    expect(typeof m.city === 'string').toBeTruthy();
    expect(typeof m.state === 'string').toBeTruthy();
    expect(typeof m.dynasty === 'string').toBeTruthy();
    expect(typeof m.category === 'string').toBeTruthy();
  });
});

runner.test('T1.33: Category filter chip values match monument dataset categories', () => {
  const monumentCategories = new Set(monumentsData.map(m => m.category));
  expect(monumentCategories.has('Fort & Palace')).toBeTruthy();
  expect(monumentCategories.has('Temple')).toBeTruthy();
  expect(monumentCategories.has('Tomb & Mausoleum')).toBeTruthy();
  expect(monumentCategories.has('Stepwell')).toBeTruthy();
});

// --- R6: BigQuery AI/ML Analytics Suite ---
runner.suite('R6: BigQuery AI/ML Analytics Suite');

runner.test('T1.34: bigquery/ directory exists and contains all 4 required SQL scripts', () => {
  const bqDir = resolvePath('bigquery');
  expect(fs.existsSync(bqDir)).toBeTruthy('bigquery/ directory must exist');
  const expectedFiles = [
    '01_schema_monuments.sql',
    '02_semantic_search.sql',
    '03_visitor_forecasting.sql',
    '04_multilingual_narrative_gen.sql'
  ];
  expectedFiles.forEach(f => {
    expect(fs.existsSync(path.join(bqDir, f))).toBeTruthy(`Missing BigQuery SQL file: ${f}`);
  });
});

runner.test('T1.35: 01_schema_monuments.sql defines monuments_master clustered table', () => {
  const sql = fs.readFileSync(resolvePath('bigquery/01_schema_monuments.sql'), 'utf-8');
  expect(sql).toContain('CREATE SCHEMA');
  expect(sql).toContain('CREATE TABLE');
  expect(sql).toContain('CLUSTER BY');
  expect(sql).toContain('monuments_master');
  expect(sql).toContain('coordinates GEOGRAPHY');
});

runner.test('T1.36: 01_schema_monuments.sql defines visitor_telemetry_daily partitioned by date', () => {
  const sql = fs.readFileSync(resolvePath('bigquery/01_schema_monuments.sql'), 'utf-8');
  expect(sql).toContain('visitor_telemetry_daily');
  expect(sql).toContain('PARTITION BY');
  expect(sql).toContain('CLUSTER BY');
});

runner.test('T1.37: 02_semantic_search.sql creates text-embedding-004 model and calls VECTOR_SEARCH with COSINE', () => {
  const sql = fs.readFileSync(resolvePath('bigquery/02_semantic_search.sql'), 'utf-8');
  expect(sql).toContain('CREATE OR REPLACE MODEL');
  expect(sql).toContain('text-embedding-004');
  expect(sql).toContain('ML.GENERATE_EMBEDDING');
  expect(sql).toContain('VECTOR_SEARCH');
  expect(sql).toContain('COSINE');
});

runner.test('T1.38: 03_visitor_forecasting.sql defines ARIMA_PLUS model with HOLIDAY_REGION = IN and calls ML.FORECAST', () => {
  const sql = fs.readFileSync(resolvePath('bigquery/03_visitor_forecasting.sql'), 'utf-8');
  expect(sql).toContain('MODEL_TYPE = \'ARIMA_PLUS\'');
  expect(sql).toContain("HOLIDAY_REGION = 'IN'");
  expect(sql).toContain('ML.FORECAST');
  expect(sql).toContain('TIME_SERIES_TIMESTAMP_COL');
});

runner.test('T1.39: 04_multilingual_narrative_gen.sql defines gemini-1.5-pro model and calls ML.GENERATE_TEXT with Hindi prompt', () => {
  const sql = fs.readFileSync(resolvePath('bigquery/04_multilingual_narrative_gen.sql'), 'utf-8');
  expect(sql).toContain('gemini-1.5-pro');
  expect(sql).toContain('ML.GENERATE_TEXT');
  expect(sql).toContain('hindi_devanagari');
  expect(sql).toContain('full_narrative_hi');
});

// ============================================================================
// TIER 2: BOUNDARY & CORNER CASES (>=5 tests per feature area)
// ============================================================================
runner.setTier('Tier 2: Boundary & Corner Cases (Stress, Bounds & Limit Validation)');

// --- GPS Coordinate Boundaries ---
runner.suite('GPS Coordinate Boundaries (Strict Indian Geopolitical Bounding Box)');

runner.test('T2.1: Latitude strict lower bound: Every monument lat >= 6.0° N (Southernmost India)', () => {
  monumentsData.forEach(m => {
    expect(m.coordinates.lat).toBeGreaterThanOrEqual(6.0, `Latitude out of southern bounds for ${m.id}`);
  });
});

runner.test('T2.2: Latitude strict upper bound: Every monument lat <= 36.0° N (Northernmost India)', () => {
  monumentsData.forEach(m => {
    expect(m.coordinates.lat).toBeLessThanOrEqual(36.0, `Latitude out of northern bounds for ${m.id}`);
  });
});

runner.test('T2.3: Longitude strict lower bound: Every monument lng >= 68.0° E (Westernmost India)', () => {
  monumentsData.forEach(m => {
    expect(m.coordinates.lng).toBeGreaterThanOrEqual(68.0, `Longitude out of western bounds for ${m.id}`);
  });
});

runner.test('T2.4: Longitude strict upper bound: Every monument lng <= 98.0° E (Easternmost India)', () => {
  monumentsData.forEach(m => {
    expect(m.coordinates.lng).toBeLessThanOrEqual(98.0, `Longitude out of eastern bounds for ${m.id}`);
  });
});

runner.test('T2.5: Coordinate precision boundary: Every coordinate is a non-integer decimal number with valid geographic precision', () => {
  monumentsData.forEach(m => {
    const lat = m.coordinates.lat;
    const lng = m.coordinates.lng;
    expect(Number.isFinite(lat) && !Number.isInteger(lat)).toBeTruthy(
      `Lat precision defect on ${m.id} (${lat})`
    );
    expect(Number.isFinite(lng) && !Number.isInteger(lng)).toBeTruthy(
      `Lng precision defect on ${m.id} (${lng})`
    );
  });
});

runner.test('T2.6: Geographic dispersion: Bounding box spans at least 15 degrees latitude and 15 degrees longitude', () => {
  const lats = monumentsData.map(m => m.coordinates.lat);
  const lngs = monumentsData.map(m => m.coordinates.lng);
  const latSpan = Math.max(...lats) - Math.min(...lats);
  const lngSpan = Math.max(...lngs) - Math.min(...lngs);
  expect(latSpan).toBeGreaterThanOrEqual(15.0, `Lat span too narrow: ${latSpan.toFixed(2)}°`);
  expect(lngSpan).toBeGreaterThanOrEqual(15.0, `Lng span too narrow: ${lngSpan.toFixed(2)}°`);
});

// --- Audio Script Length & Content Boundaries ---
runner.suite('Audio Script Length & Content Boundaries');

runner.test('T2.7: English audio narrative minimum length: Every monument English script contains >= 40 words', () => {
  monumentsData.forEach(m => {
    const words = (m.audioNarrations.en?.narrationText || '').trim().split(/\s+/);
    expect(words.length).toBeGreaterThanOrEqual(40, `Monument ${m.id} English narration has only ${words.length} words`);
  });
});

runner.test('T2.8: Absolute non-triviality guard: No audio script has < 8 words or < 40 characters across any language', () => {
  const langs = ['en', 'hi', 'ta', 'te', 'bn'];
  monumentsData.forEach(m => {
    for (const l of langs) {
      const text = (m.audioNarrations[l]?.narrationText || '').trim();
      const words = text.split(/\s+/);
      expect(words.length).toBeGreaterThanOrEqual(8, `Monument ${m.id} [${l}] has trivial script (${words.length} words)`);
      expect(text.length).toBeGreaterThanOrEqual(40, `Monument ${m.id} [${l}] has trivial length (${text.length} chars)`);
    }
  });
});

runner.test('T2.9: Audio duration realism boundary: Estimated duration is between 30 and 300 seconds per script', () => {
  const langs = ['en', 'hi', 'ta', 'te', 'bn'];
  monumentsData.forEach(m => {
    for (const l of langs) {
      const dur = m.audioNarrations[l]?.durationSeconds;
      expect(dur).toBeBetween(30, 300, `Audio duration out of bounds for ${m.id} [${l}]: ${dur}s`);
    }
  });
});

runner.test('T2.10: Audio narration speech tempo ratio: Word count to duration ratio is between 0.05 and 2.0 words/sec', () => {
  const langs = ['en', 'hi', 'ta', 'te', 'bn'];
  monumentsData.forEach(m => {
    for (const l of langs) {
      const text = (m.audioNarrations[l]?.narrationText || '').trim();
      const wc = text.split(/\s+/).length;
      const dur = m.audioNarrations[l]?.durationSeconds || 1;
      const ratio = wc / dur;
      expect(ratio).toBeBetween(0.05, 2.0, `Unnatural tempo ratio for ${m.id} [${l}]: ${ratio.toFixed(2)} wps`);
    }
  });
});

runner.test('T2.11: Audio title length bounds: Audio titles are between 5 and 100 characters', () => {
  const langs = ['en', 'hi', 'ta', 'te', 'bn'];
  monumentsData.forEach(m => {
    for (const l of langs) {
      const title = m.audioNarrations[l]?.title || '';
      expect(title.length).toBeBetween(5, 100, `Title length out of bounds for ${m.id} [${l}]: "${title}"`);
    }
  });
});

runner.test('T2.12: Multilingual regional script length validation: Asserts that audio scripts across all 5 languages contain >= 40 words', () => {
  const langs = ['hi', 'ta', 'te', 'bn'];
  const under40 = [];
  monumentsData.forEach(m => {
    for (const l of langs) {
      const words = (m.audioNarrations[l]?.narrationText || '').trim().split(/\s+/);
      if (words.length < 40) {
        under40.push(`${m.id} [${l}]: ${words.length} words`);
      }
    }
  });
  if (under40.length > 0) {
    throw new Error(
      `Discovered ${under40.length} regional audio scripts with word count < 40 words (Sample: ${under40.slice(0, 5).join('; ')}). Target specification requires >= 40 words across all languages.`
    );
  }
});

// --- Timings & Tariffs Boundaries ---
runner.suite('Timings & Tariffs Integrity & Compliance');

runner.test('T2.13: Time format validation: Every open and close time conforms to HH:MM format', () => {
  const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;
  monumentsData.forEach(m => {
    expect(timeRegex.test(m.timings.open)).toBeTruthy(
      `Invalid timings.open on ${m.id}: "${m.timings.open}"`
    );
    expect(timeRegex.test(m.timings.close)).toBeTruthy(
      `Invalid timings.close on ${m.id}: "${m.timings.close}"`
    );
  });
});

runner.test('T2.14: Chronological order: Daily opening time is chronologically earlier than closing time', () => {
  monumentsData.forEach(m => {
    const [openH, openM] = m.timings.open.split(':').map(Number);
    const [closeH, closeM] = m.timings.close.split(':').map(Number);
    const openMinutes = openH * 60 + openM;
    const closeMinutes = closeH * 60 + closeM;
    expect(openMinutes).toBeLessThanOrEqual(closeMinutes, `Open time after close time on ${m.id}`);
  });
});

runner.test('T2.15: Tariff non-negativity: Domestic, SAARC, and Foreign fees are non-negative (>= 0)', () => {
  monumentsData.forEach(m => {
    expect(m.tariffs.indianRupees).toBeGreaterThanOrEqual(0, `Negative domestic tariff on ${m.id}`);
    expect(m.tariffs.saarcRupees).toBeGreaterThanOrEqual(0, `Negative SAARC tariff on ${m.id}`);
    expect(m.tariffs.foreignRupees).toBeGreaterThanOrEqual(0, `Negative foreign tariff on ${m.id}`);
  });
});

runner.test('T2.16: Tariff equity boundary: Foreign visitor fee is greater than or equal to domestic fee', () => {
  monumentsData.forEach(m => {
    expect(m.tariffs.foreignRupees).toBeGreaterThanOrEqual(
      m.tariffs.indianRupees,
      `Foreign tariff lower than Indian tariff on ${m.id}`
    );
  });
});

runner.test('T2.17: Statutory Child Exemption: Every monument explicitly defines entryFreeUnder15 === true', () => {
  monumentsData.forEach(m => {
    expect(m.tariffs.entryFreeUnder15).toBe(true, `entryFreeUnder15 must be true on ${m.id}`);
  });
});

runner.test('T2.18: Closed days array boundary: When defined, closedDays contains valid days of the week', () => {
  const validDays = new Set(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);
  monumentsData.forEach(m => {
    if (m.timings.closedDays) {
      expect(Array.isArray(m.timings.closedDays)).toBeTruthy(`closedDays must be array on ${m.id}`);
      m.timings.closedDays.forEach(d => {
        expect(validDays.has(d)).toBeTruthy(`Invalid closed day "${d}" on ${m.id}`);
      });
    }
  });
});

// --- Haversine Distance Unit Test against Ground Truth ---
runner.suite('Haversine Great-Circle Distance Unit Test against Ground Truth');

runner.test('T2.19: Delhi to Agra distance equals ~180 km (assert within [175, 210] km)', () => {
  const delhi = { lat: 28.6139, lng: 77.2090 };
  const agra = { lat: 27.1751, lng: 78.0421 };
  const dist = calculateDistanceKm(delhi, agra);
  expect(dist).toBeBetween(175, 210, `Delhi to Agra calculated ${dist.toFixed(1)} km`);
});

runner.test('T2.20: Delhi to Jaipur distance equals ~235 km (assert within [230, 270] km)', () => {
  const delhi = { lat: 28.6139, lng: 77.2090 };
  const jaipur = { lat: 26.9124, lng: 75.7873 };
  const dist = calculateDistanceKm(delhi, jaipur);
  expect(dist).toBeBetween(230, 270, `Delhi to Jaipur calculated ${dist.toFixed(1)} km`);
});

runner.test('T2.21: Agra to Jaipur distance equals ~225 km (assert within [220, 250] km)', () => {
  const agra = { lat: 27.1751, lng: 78.0421 };
  const jaipur = { lat: 26.9124, lng: 75.7873 };
  const dist = calculateDistanceKm(agra, jaipur);
  expect(dist).toBeBetween(220, 250, `Agra to Jaipur calculated ${dist.toFixed(1)} km`);
});

runner.test('T2.22: Zero-distance boundary: Distance from a coordinate to itself is strictly 0.0 km', () => {
  const pt = { lat: 28.6139, lng: 77.2090 };
  const dist = calculateDistanceKm(pt, pt);
  expect(dist).toBe(0, 'Self distance must equal 0.0');
});

runner.test('T2.23: Global distance boundary: Long-range calculations produce finite positive numbers', () => {
  const delhi = { lat: 28.6139, lng: 77.2090 };
  const london = { lat: 51.5074, lng: -0.1278 };
  const dist = calculateDistanceKm(delhi, london);
  expect(dist).toBeBetween(6500, 7000, `Delhi to London calculated ${dist.toFixed(1)} km`);
});

runner.test('T2.24: Distance format boundary: Distance < 1 km formats in meters, >= 1 km formats in kilometers', () => {
  expect(formatDistance(0.45)).toBe('450 m away');
  expect(formatDistance(0.05)).toBe('50 m away');
  expect(formatDistance(1.234)).toBe('1.2 km away');
  expect(formatDistance(180.7)).toBe('180.7 km away');
});

// --- Search Normalization & Diacritic Insensitivity ---
runner.suite('Search Normalization & Diacritic Insensitivity');

function searchMonuments(query, list) {
  const q = query.toLowerCase().trim();
  if (!q) return list;
  return list.filter(m => {
    const matchName = m.name.toLowerCase().includes(q);
    const matchHindi = m.hindiName.includes(q);
    const matchCity = m.city.toLowerCase().includes(q);
    const matchState = m.state.toLowerCase().includes(q);
    const matchDynasty = m.dynasty.toLowerCase().includes(q);
    const matchCat = m.category.toLowerCase().includes(q);
    const matchAlt = m.alternateNames.some(alt => alt.toLowerCase().includes(q));
    return matchName || matchHindi || matchCity || matchState || matchDynasty || matchCat || matchAlt;
  });
}

function searchMonumentsNormalized(query, list) {
  const clean = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/['’]/g, '').replace(/[-]/g, ' ').toLowerCase().trim();
  const q = clean(query);
  if (!q) return list;
  return list.filter(m => {
    const fields = [m.name, m.city, m.state, m.dynasty, m.category, ...m.alternateNames];
    return fields.some(f => clean(f).includes(q)) || m.hindiName.includes(query.trim());
  });
}

runner.test('T2.25: Case-insensitivity: TAJ MAHAL matches identically to taj mahal', () => {
  const r1 = searchMonuments('TAJ MAHAL', monumentsData);
  const r2 = searchMonuments('taj mahal', monumentsData);
  expect(r1.length).toBe(1);
  expect(r1[0].id).toBe('IN-UP-001');
  expect(r1.length).toBe(r2.length);
});

runner.test('T2.26: Devanagari script matching: Devanagari query ताज matches Taj Mahal', () => {
  const r = searchMonuments('ताज', monumentsData);
  expect(r.length).toBeGreaterThanOrEqual(1);
  expect(r.some(m => m.id === 'IN-UP-001')).toBeTruthy();
});

runner.test('T2.27: Alternate alias resolution: Baby Taj resolves to Tomb of I\'timad-ud-Daulah', () => {
  const r = searchMonuments('Baby Taj', monumentsData);
  expect(r.length).toBe(1);
  expect(r[0].id).toBe('IN-UP-004');
});

runner.test('T2.28: Substring token matching: Single-word query Fort matches multiple monuments', () => {
  const r = searchMonuments('Fort', monumentsData);
  expect(r.length).toBeGreaterThanOrEqual(5);
});

runner.test('T2.29: Empty and whitespace query tolerance: Query with "" returns complete dataset', () => {
  const r1 = searchMonuments('', monumentsData);
  const r2 = searchMonuments('   ', monumentsData);
  expect(r1.length).toBe(monumentsData.length);
  expect(r2.length).toBe(monumentsData.length);
});

runner.test('T2.30: Diacritic and apostrophe normalization test: Evaluates normalized matching for Itimad vs I\'timad', () => {
  const rNormalized = searchMonumentsNormalized('Itimad', monumentsData);
  expect(rNormalized.some(m => m.id === 'IN-UP-004')).toBeTruthy(
    'Normalized search for "Itimad" must find Tomb of I\'timad-ud-Daulah'
  );
});

// ============================================================================
// TIER 3: CROSS-FEATURE COMBINATIONS (Pairwise Coverage)
// ============================================================================
runner.setTier('Tier 3: Cross-Feature Combinations (Pairwise & Integration)');

// --- Category Filter Combinations & Partitioning ---
runner.suite('Category Filter Combinations & Partitioning');

runner.test('T3.1: Fort & Palace filter isolates only monuments categorized as Fort & Palace', () => {
  const forts = monumentsData.filter(m => m.category === 'Fort & Palace');
  expect(forts.length).toBeGreaterThanOrEqual(10);
  forts.forEach(m => expect(m.category).toBe('Fort & Palace'));
});

runner.test('T3.2: Temple filter isolates only temple monuments', () => {
  const temples = monumentsData.filter(m => m.category === 'Temple');
  expect(temples.length).toBeGreaterThanOrEqual(8);
  temples.forEach(m => expect(m.category).toBe('Temple'));
});

runner.test('T3.3: UNESCO Sites filter isolates only monuments with unesco === true', () => {
  const unesco = monumentsData.filter(m => m.unesco === true);
  expect(unesco.length).toBeGreaterThanOrEqual(20);
  unesco.forEach(m => expect(m.unesco).toBe(true));
});

runner.test('T3.4: Stepwell filter isolates ancient stepwells', () => {
  const stepwells = monumentsData.filter(m => m.category === 'Stepwell');
  expect(stepwells.length).toBeGreaterThanOrEqual(3);
  stepwells.forEach(m => expect(m.category).toBe('Stepwell'));
});

runner.test('T3.5: Tomb & Mausoleum / Mosque filter isolates funerary and Islamic architecture', () => {
  const tombsMosques = monumentsData.filter(
    m => m.category === 'Tomb & Mausoleum' || m.category === 'Mosque'
  );
  expect(tombsMosques.length).toBeGreaterThanOrEqual(6);
  tombsMosques.forEach(m => {
    expect(m.category === 'Tomb & Mausoleum' || m.category === 'Mosque').toBeTruthy();
  });
});

runner.test('T3.6: Exhaustive category coverage: Every monument belongs to exactly one primary category', () => {
  const allCategories = [
    'Fort & Palace', 'Temple', 'Tomb & Mausoleum', 'Mosque',
    'Stepwell', 'Caves & Rock-cut', 'Memorial & Gate', 'Ancient University'
  ];
  let sum = 0;
  allCategories.forEach(cat => {
    sum += monumentsData.filter(m => m.category === cat).length;
  });
  expect(sum).toBe(monumentsData.length, 'Sum of all categories must equal total catalog size');
});

// --- Circuit Monuments Referential Integrity & Multi-State Spans ---
runner.suite('Circuit Monuments Referential Integrity & Multi-State Spans');

runner.test('T3.7: Golden Triangle Circuit: All 15 referenced monuments exist and span Delhi, UP, and Rajasthan', () => {
  const goldenTriangleIds = [
    'IN-DL-001', 'IN-DL-002', 'IN-DL-003', 'IN-DL-004',
    'IN-UP-001', 'IN-UP-002', 'IN-UP-003', 'IN-UP-004', 'IN-UP-005',
    'IN-RJ-001', 'IN-RJ-002', 'IN-RJ-003', 'IN-RJ-004', 'IN-RJ-005', 'IN-RJ-006'
  ];
  const catalogMap = new Map(monumentsData.map(m => [m.id, m]));
  const circuitMonuments = goldenTriangleIds.map(id => {
    const found = catalogMap.get(id);
    expect(!!found).toBeTruthy(`Missing Golden Triangle monument: ${id}`);
    return found;
  });
  const states = new Set(circuitMonuments.map(m => m.state));
  expect(states.has('Delhi')).toBeTruthy('Circuit must span Delhi');
  expect(states.has('Uttar Pradesh')).toBeTruthy('Circuit must span Uttar Pradesh');
  expect(states.has('Rajasthan')).toBeTruthy('Circuit must span Rajasthan');
});

runner.test('T3.8: UNESCO World Heritage Trail: All 20 referenced monuments exist, span >= 6 states, 100% unesco: true', () => {
  const unescoTrailIds = [
    'IN-UP-001', 'IN-UP-002', 'IN-UP-003',
    'IN-RJ-001', 'IN-RJ-002', 'IN-RJ-003',
    'IN-DL-001', 'IN-DL-002', 'IN-DL-003',
    'IN-KA-001', 'IN-KA-002', 'IN-OR-001', 'IN-TN-001', 'IN-TN-002',
    'IN-MP-001', 'IN-MP-002', 'IN-MH-001', 'IN-MH-002', 'IN-GJ-001', 'IN-BR-001'
  ];
  const catalogMap = new Map(monumentsData.map(m => [m.id, m]));
  const trailMonuments = unescoTrailIds.map(id => {
    const found = catalogMap.get(id);
    expect(!!found).toBeTruthy(`Missing UNESCO Trail monument: ${id}`);
    expect(found.unesco).toBe(true, `Monument ${id} in UNESCO Trail has unesco !== true`);
    return found;
  });
  const states = new Set(trailMonuments.map(m => m.state));
  expect(states.size).toBeGreaterThanOrEqual(6, `UNESCO Trail spans only ${states.size} states`);
});

runner.test('T3.9: Royal Rajput Forts Circuit: All 6 referenced monuments exist and are 100% in Rajasthan', () => {
  const rajputFortsIds = [
    'IN-RJ-001', 'IN-RJ-002', 'IN-RJ-003', 'IN-RJ-004', 'IN-RJ-005', 'IN-RJ-006'
  ];
  const catalogMap = new Map(monumentsData.map(m => [m.id, m]));
  rajputFortsIds.forEach(id => {
    const m = catalogMap.get(id);
    expect(!!m).toBeTruthy(`Missing Rajput fort: ${id}`);
    expect(m.state).toBe('Rajasthan');
  });
});

runner.test('T3.10: Southern Dynasties Sacred Trail: All 5 referenced monuments exist in Karnataka and Tamil Nadu', () => {
  const southernIds = ['IN-KA-001', 'IN-KA-002', 'IN-KA-003', 'IN-TN-001', 'IN-TN-002'];
  const catalogMap = new Map(monumentsData.map(m => [m.id, m]));
  southernIds.forEach(id => {
    const m = catalogMap.get(id);
    expect(!!m).toBeTruthy(`Missing Southern monument: ${id}`);
    expect(m.state === 'Karnataka' || m.state === 'Tamil Nadu').toBeTruthy(
      `Southern monument ${id} not in KA/TN: ${m.state}`
    );
  });
});

runner.test('T3.11: Circuit duration realism: Every circuit specifies approxDays between 1 and 21 days', () => {
  const circuitsCode = fs.readFileSync(resolvePath('src/data/circuits.ts'), 'utf-8');
  const daysMatches = [...circuitsCode.matchAll(/approxDays:\s*(\d+)/g)].map(m => Number(m[1]));
  expect(daysMatches.length).toBeGreaterThanOrEqual(4);
  daysMatches.forEach(days => {
    expect(days).toBeBetween(1, 21, `approxDays out of range: ${days}`);
  });
});

// --- Audio Voice Selection & Fallback Combinations ---
runner.suite('Audio Voice Selection & Fallback Combinations');

runner.test('T3.12: Exact locale match: When voice with en-IN is present, selectVoiceForLanguage("en") selects en-IN', () => {
  const voices = [{ lang: 'en-US' }, { lang: 'en-IN' }, { lang: 'hi-IN' }];
  const matched = selectVoiceForLanguage('en', voices);
  expect(matched.lang).toBe('en-IN');
});

runner.test('T3.13: Language prefix match: When voice with hi-IN is present, selectVoiceForLanguage("hi") matches hi-IN', () => {
  const voices = [{ lang: 'en-US' }, { lang: 'hi-IN' }];
  const matched = selectVoiceForLanguage('hi', voices);
  expect(matched.lang).toBe('hi-IN');
});

runner.test('T3.14: Missing regional voice fallback: When requested voice is absent, falls back to default voice', () => {
  const voices = [{ lang: 'en-US', default: true }, { lang: 'hi-IN' }];
  const matched = selectVoiceForLanguage('ta', voices); // Tamil voice missing
  expect(matched.lang).toBe('en-US');
});

runner.test('T3.15: Dialect code normalization: Locales with underscores (te_IN) are normalized and matched', () => {
  const voices = [{ lang: 'en-US' }, { lang: 'te_IN' }];
  const matched = selectVoiceForLanguage('te', voices);
  expect(matched.lang).toBe('te_IN');
});

runner.test('T3.16: Empty system voices array handling: Returns null gracefully without throwing an exception', () => {
  const matched = selectVoiceForLanguage('en', []);
  expect(matched).toBe(null);
});

// ============================================================================
// TIER 4: REAL-WORLD APPLICATION WORKLOAD SCENARIOS
// ============================================================================
runner.setTier('Tier 4: Real-World Application Workload Scenarios');

// --- Golden Triangle Tour Workflow Simulation ---
runner.suite('Golden Triangle Tour Traveler Workflow Simulation');

runner.test('T4.1: Tour itinerary resolution: Successfully loads Delhi, Agra, and Jaipur anchors', () => {
  const qutub = monumentsData.find(m => m.id === 'IN-DL-001');
  const taj = monumentsData.find(m => m.id === 'IN-UP-001');
  const amer = monumentsData.find(m => m.id === 'IN-RJ-001');

  expect(!!qutub).toBeTruthy('Qutub Minar must exist');
  expect(!!taj).toBeTruthy('Taj Mahal must exist');
  expect(!!amer).toBeTruthy('Amer Fort must exist');
});

runner.test('T4.2: Step-by-step traveler flow: Verifies timings, closed day rules, and direct ASI ticketing links', () => {
  const taj = monumentsData.find(m => m.id === 'IN-UP-001');
  expect(taj.timings.closedDays?.includes('Friday')).toBeTruthy('Taj Mahal must note Friday closure');
  expect(taj.eTicketUrl).toContain('payumoney.com');

  const amer = monumentsData.find(m => m.id === 'IN-RJ-001');
  expect(amer.timings.open).toBe('08:00');
  expect(amer.timings.close).toBe('17:30');
});

runner.test('T4.3: Cumulative travel distance: Calculates total travel loop (Delhi -> Agra -> Jaipur -> Delhi)', () => {
  const qutub = monumentsData.find(m => m.id === 'IN-DL-001');
  const taj = monumentsData.find(m => m.id === 'IN-UP-001');
  const amer = monumentsData.find(m => m.id === 'IN-RJ-001');

  const leg1 = calculateDistanceKm(qutub.coordinates, taj.coordinates);
  const leg2 = calculateDistanceKm(taj.coordinates, amer.coordinates);
  const leg3 = calculateDistanceKm(amer.coordinates, qutub.coordinates);
  const totalLoopKm = leg1 + leg2 + leg3;

  expect(leg1).toBeBetween(165, 185, `Delhi to Agra leg: ${leg1.toFixed(1)} km`);
  expect(leg2).toBeBetween(210, 230, `Agra to Jaipur leg: ${leg2.toFixed(1)} km`);
  expect(leg3).toBeBetween(210, 230, `Jaipur to Delhi leg: ${leg3.toFixed(1)} km`);
  expect(totalLoopKm).toBeBetween(590, 640, `Total triangle loop: ${totalLoopKm.toFixed(1)} km`);
});

runner.test('T4.4: Storytelling availability: Verifies that full narrative, timeline milestones, and audio guides exist for all stops', () => {
  const stops = ['IN-DL-001', 'IN-UP-001', 'IN-RJ-001'];
  stops.forEach(id => {
    const m = monumentsData.find(x => x.id === id);
    expect(m.fullNarrative.length).toBeGreaterThanOrEqual(150);
    expect(m.timeline.length).toBeGreaterThanOrEqual(3);
    expect(m.audioNarrations.en.narrationText.length).toBeGreaterThanOrEqual(50);
    expect(m.audioNarrations.hi.narrationText.length).toBeGreaterThanOrEqual(50);
  });
});

// --- Offline PWA Cache Manifest Checklist ---
runner.suite('Offline PWA Cache Manifest Checklist');

runner.test('T4.5: Static assets manifest verification: All assets listed in sw.js STATIC_ASSETS exist as physical files', () => {
  const swCode = fs.readFileSync(resolvePath('public/sw.js'), 'utf-8');
  const assetMatches = [...swCode.matchAll(/'([^']+)'/g)].map(m => m[1]);
  const staticAssets = assetMatches.filter(a => a.startsWith('/') && !a.includes('v1'));

  expect(staticAssets.length).toBeGreaterThanOrEqual(5);
  staticAssets.forEach(assetPath => {
    if (assetPath === '/' || assetPath === '/index.html') {
      const exists = fs.existsSync(resolvePath('index.html')) || fs.existsSync(resolvePath('dist/index.html'));
      expect(exists).toBeTruthy(`Root index HTML must exist for ${assetPath}`);
    } else {
      const diskPath = resolvePath(path.join('public', assetPath));
      expect(fs.existsSync(diskPath)).toBeTruthy(`Asset ${assetPath} missing on disk at ${diskPath}`);
    }
  });
});

runner.test('T4.6: High-resolution image assets verification: All icon and preview image assets exist and are non-empty', () => {
  const imgDir = resolvePath('public/images');
  expect(fs.existsSync(imgDir)).toBeTruthy('public/images directory must exist');
  const files = fs.readdirSync(imgDir);
  expect(files.length).toBeGreaterThanOrEqual(4);
  files.forEach(f => {
    const st = fs.statSync(path.join(imgDir, f));
    expect(st.size).toBeGreaterThanOrEqual(500, `Image asset ${f} is empty or suspiciously small: ${st.size} bytes`);
  });
});

runner.test('T4.7: Service worker cache strategies: Service worker code implements install, activate, and fetch listeners', () => {
  const swCode = fs.readFileSync(resolvePath('public/sw.js'), 'utf-8');
  expect(swCode).toContain("addEventListener('install'");
  expect(swCode).toContain("addEventListener('activate'");
  expect(swCode).toContain("addEventListener('fetch'");
  expect(swCode).toContain('skipWaiting');
  expect(swCode).toContain('clients.claim');
});

// --- Production Bundle Size Analyzer Check ---
runner.suite('Production Bundle Budget & Analyzer Check (< 500 KB Gzipped)');

runner.test('T4.8: Production build artifacts exist: dist/index.html and dist/assets/ are present on disk', () => {
  expect(fs.existsSync(resolvePath('dist/index.html'))).toBeTruthy('dist/index.html must exist');
  expect(fs.existsSync(resolvePath('dist/assets'))).toBeTruthy('dist/assets must exist');
});

runner.test('T4.9: Production asset enumeration: At least one JavaScript bundle and one CSS bundle are present', () => {
  const assets = fs.readdirSync(resolvePath('dist/assets'));
  const jsFiles = assets.filter(f => f.endsWith('.js'));
  const cssFiles = assets.filter(f => f.endsWith('.css'));
  expect(jsFiles.length).toBeGreaterThanOrEqual(1, 'Must have at least one JS bundle in dist/assets');
  expect(cssFiles.length).toBeGreaterThanOrEqual(1, 'Must have at least one CSS bundle in dist/assets');
});

runner.test('T4.10: Individual bundle budget: Core JS bundle is < 350 KB gzipped; CSS bundle is < 50 KB gzipped', () => {
  const assets = fs.readdirSync(resolvePath('dist/assets'));
  const jsFiles = assets.filter(f => f.endsWith('.js'));
  const cssFiles = assets.filter(f => f.endsWith('.css'));

  jsFiles.forEach(f => {
    const raw = fs.readFileSync(resolvePath(path.join('dist/assets', f)));
    const gz = zlib.gzipSync(raw);
    const gzKb = gz.length / 1024;
    expect(gzKb).toBeLessThanOrEqual(350, `JS bundle ${f} exceeds 350 KB gzipped (${gzKb.toFixed(1)} KB)`);
  });

  cssFiles.forEach(f => {
    const raw = fs.readFileSync(resolvePath(path.join('dist/assets', f)));
    const gz = zlib.gzipSync(raw);
    const gzKb = gz.length / 1024;
    expect(gzKb).toBeLessThanOrEqual(50, `CSS bundle ${f} exceeds 50 KB gzipped (${gzKb.toFixed(1)} KB)`);
  });
});

runner.test('T4.11: Total gzipped payload budget: Total gzipped payload of all initial JS + CSS is strictly < 500 KB', () => {
  const assets = fs.readdirSync(resolvePath('dist/assets'));
  let totalGzipBytes = 0;

  assets.forEach(f => {
    if (f.endsWith('.js') || f.endsWith('.css')) {
      const raw = fs.readFileSync(resolvePath(path.join('dist/assets', f)));
      const gz = zlib.gzipSync(raw);
      totalGzipBytes += gz.length;
    }
  });

  const totalGzipKb = totalGzipBytes / 1024;
  expect(totalGzipBytes).toBeLessThanOrEqual(
    512000,
    `Total initial gzipped bundle exceeds 500 KB: ${totalGzipKb.toFixed(2)} KB (${totalGzipBytes} bytes)`
  );
  console.log(`    \x1b[35mℹ Total initial production bundle size:\x1b[0m ${totalGzipKb.toFixed(2)} KB gzipped (${totalGzipBytes} bytes)`);
});

// ----------------------------------------------------------------------------
// Finish and Exit
// ----------------------------------------------------------------------------
const failedCount = runner.printSummary();

const allowDefects = process.argv.includes('--allow-defects') || process.env.ALLOW_DEFECTS === '1';

// Exit code matches test result
if (failedCount > 0 && !allowDefects) {
  process.exit(1);
} else {
  process.exit(0);
}

