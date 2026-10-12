/**
 * Herodotus Spatial & Discovery Adversarial Stress Harness
 * 
 * Empirically challenges:
 * 1. Indian territory polygon & GPS coordinate validity across all 50 monuments
 * 2. Rapid search fuzzing (empty, injection, unicode, regex, extreme length)
 * 3. Category filtering combinatorial testing (chips, overlaps, empty sets)
 * 4. Haversine formula extreme inputs (antipodal, pole-to-pole, micro, invalid)
 * 5. Curated circuits referential integrity & route distance realism
 * 6. Application bundle size & build output verification
 */

import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import ts from 'typescript';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const ROOT = path.resolve(process.cwd());

// ----------------------------------------------------------------------------
// Helper: Load TypeScript module dynamically from source
// ----------------------------------------------------------------------------
function loadTsModule(relPath) {
  const fullPath = path.join(ROOT, relPath);
  const code = fs.readFileSync(fullPath, 'utf8');
  const js = ts.transpileModule(code, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }
  }).outputText;
  const mod = { exports: {} };
  const fn = new Function('require', 'exports', 'module', js);
  fn(require, mod.exports, mod);
  return mod.exports;
}

const haversineLib = loadTsModule('src/lib/haversine.ts');
const searchLib = loadTsModule('src/lib/search.ts');

const { calculateDistanceKm, formatDistance, formatCoordinates } = haversineLib;
const { searchMonuments, normalizeSearchString } = searchLib;

const monumentsPath = path.join(ROOT, 'src/data/monuments.json');
const monuments = JSON.parse(fs.readFileSync(monumentsPath, 'utf8'));

const circuitsPath = path.join(ROOT, 'src/data/circuits.json');
const circuits = JSON.parse(fs.readFileSync(circuitsPath, 'utf8'));

// ----------------------------------------------------------------------------
// Adversarial Test Runner Framework
// ----------------------------------------------------------------------------
class AdversarialRunner {
  constructor() {
    this.currentSuite = '';
    this.results = [];
    this.startTime = Date.now();
  }

  suite(name) {
    this.currentSuite = name;
    console.log(`\n\x1b[1m\x1b[35m▶ SUITE: ${name}\x1b[0m`);
    console.log('\x1b[90m' + '─'.repeat(78) + '\x1b[0m');
  }

  assert(condition, message) {
    if (!condition) {
      throw new Error(`Assertion Failed: ${message}`);
    }
  }

  test(name, fn) {
    const start = performance.now();
    try {
      fn();
      const duration = (performance.now() - start).toFixed(2);
      this.results.push({ suite: this.currentSuite, name, passed: true, duration });
      console.log(`  \x1b[32m✔ PASS\x1b[0m ${name} \x1b[90m(${duration}ms)\x1b[0m`);
    } catch (err) {
      const duration = (performance.now() - start).toFixed(2);
      this.results.push({ suite: this.currentSuite, name, passed: false, duration, error: err.message });
      console.log(`  \x1b[31m✖ FAIL\x1b[0m ${name} \x1b[90m(${duration}ms)\x1b[0m`);
      console.log(`     \x1b[33mError: ${err.message}\x1b[0m`);
    }
  }

  summary() {
    const total = this.results.length;
    const passed = this.results.filter(r => r.passed).length;
    const failed = this.results.filter(r => !r.passed).length;
    const duration = ((Date.now() - this.startTime) / 1000).toFixed(2);

    console.log(`\n\x1b[1m\x1b[36m================================================================================\x1b[0m`);
    console.log(`\x1b[1m🏁 ADVERSARIAL STRESS CHALLENGE SUMMARY\x1b[0m`);
    console.log(`\x1b[1m\x1b[36m================================================================================\x1b[0m`);
    console.log(`Total Assertions: ${total} | \x1b[32mPassed: ${passed}\x1b[0m | \x1b[31mFailed: ${failed}\x1b[0m | Duration: ${duration}s`);
    
    if (failed > 0) {
      console.log(`\n\x1b[31mIdentified Failure Modes:\x1b[0m`);
      for (const r of this.results.filter(r => !r.passed)) {
        console.log(`  - [${r.suite}] ${r.name}: ${r.error}`);
      }
    }
    console.log(`================================================================================\n`);
    return { total, passed, failed, duration, results: this.results };
  }
}

const runner = new AdversarialRunner();

// ============================================================================
// SUITE 1: GPS Coordinate Validity & Indian Territory Boundaries
// ============================================================================
runner.suite('1. GPS Coordinate Validity & Indian Territory Boundaries');

runner.test('GPS-01: Exactly 50 monuments loaded with complete coordinate objects', () => {
  runner.assert(monuments.length === 50, `Expected 50 monuments, found ${monuments.length}`);
  for (const m of monuments) {
    runner.assert(m.coordinates && typeof m.coordinates.lat === 'number' && typeof m.coordinates.lng === 'number',
      `Monument ${m.id} (${m.name}) lacks valid coordinates object`);
    runner.assert(!isNaN(m.coordinates.lat) && !isNaN(m.coordinates.lng),
      `Monument ${m.id} has NaN coordinates`);
    runner.assert(isFinite(m.coordinates.lat) && isFinite(m.coordinates.lng),
      `Monument ${m.id} has non-finite coordinates`);
  }
});

runner.test('GPS-02: Bounding Box bounds within sovereign Indian territory (lat: 6.0°–37.5° N, lng: 68.0°–97.5° E)', () => {
  for (const m of monuments) {
    const { lat, lng } = m.coordinates;
    runner.assert(lat >= 6.0 && lat <= 37.5,
      `Monument ${m.id} (${m.name}) latitude ${lat} outside Indian territory [6.0, 37.5]`);
    runner.assert(lng >= 68.0 && lng <= 97.5,
      `Monument ${m.id} (${m.name}) longitude ${lng} outside Indian territory [68.0, 97.5]`);
  }
});

runner.test('GPS-03: Lat/Lng transposition check (no swapped coordinates)', () => {
  for (const m of monuments) {
    const { lat, lng } = m.coordinates;
    // In India, lat is always between 8 and 36, and lng is always between 68 and 98.
    // If swapped, lat would be > 68 and lng would be < 36.
    runner.assert(lat < 40.0 && lng > 60.0,
      `Possible coordinate swap detected on ${m.id} (${m.name}): lat=${lat}, lng=${lng}`);
  }
});

runner.test('GPS-04: Non-null island check (no (0,0) or default uninitialized points)', () => {
  for (const m of monuments) {
    const { lat, lng } = m.coordinates;
    runner.assert(Math.abs(lat) > 0.01 && Math.abs(lng) > 0.01,
      `Monument ${m.id} is placed at or near null island (0, 0)`);
  }
});

runner.test('GPS-05: State geographic bounding consistency check', () => {
  const stateBounds = {
    'Delhi': { minLat: 28.3, maxLat: 28.9, minLng: 76.8, maxLng: 77.4 },
    'Uttar Pradesh': { minLat: 26.0, maxLat: 28.5, minLng: 77.0, maxLng: 84.5 },
    'Rajasthan': { minLat: 23.0, maxLat: 30.5, minLng: 69.5, maxLng: 78.5 },
    'Karnataka': { minLat: 11.5, maxLat: 18.5, minLng: 74.0, maxLng: 78.5 },
    'Tamil Nadu': { minLat: 8.0, maxLat: 13.6, minLng: 76.0, maxLng: 80.5 },
    'Maharashtra': { minLat: 15.5, maxLat: 22.0, minLng: 72.5, maxLng: 81.0 },
    'Madhya Pradesh': { minLat: 21.0, maxLat: 26.9, minLng: 74.0, maxLng: 82.5 },
    'Gujarat': { minLat: 20.0, maxLat: 24.8, minLng: 68.0, maxLng: 74.5 },
    'Bihar': { minLat: 24.3, maxLat: 27.5, minLng: 83.3, maxLng: 88.3 },
    'Odisha': { minLat: 17.8, maxLat: 22.6, minLng: 81.4, maxLng: 87.5 },
    'Telangana': { minLat: 15.8, maxLat: 19.9, minLng: 77.2, maxLng: 81.8 },
    'West Bengal': { minLat: 21.5, maxLat: 27.2, minLng: 85.8, maxLng: 89.9 }
  };

  for (const m of monuments) {
    const b = stateBounds[m.state];
    runner.assert(b, `Unknown state bounds for ${m.state}`);
    const { lat, lng } = m.coordinates;
    runner.assert(lat >= b.minLat && lat <= b.maxLat && lng >= b.minLng && lng <= b.maxLng,
      `Monument ${m.id} (${m.name}) in ${m.state} has coordinates (${lat}, ${lng}) outside state bounds`);
  }
});

runner.test('GPS-06: Simplified Indian mainland territorial polygon point-in-polygon test', () => {
  // Coarse convex hull enclosing mainland India
  const indiaPolygon = [
    [35.5, 74.8], // Kashmir North
    [32.0, 78.5], // Himachal / Tibet border
    [28.5, 80.0], // Uttarakhand border
    [27.5, 88.0], // Sikkim / Bengal
    [27.0, 92.0], // Assam / East
    [24.0, 89.0], // Bangladesh border
    [22.0, 89.0], // Sundarbans
    [19.0, 85.0], // Odisha coast
    [15.0, 80.5], // Andhra coast
    [10.0, 79.8], // Tamil Nadu coast
    [8.0, 77.5],  // Kanyakumari
    [10.0, 76.0], // Kerala coast
    [15.0, 73.8], // Goa coast
    [19.0, 72.8], // Mumbai / Konkan
    [23.0, 68.5], // Rann of Kutch
    [27.0, 70.0], // Rajasthan Thar border
    [31.5, 74.5]  // Punjab border
  ];

  function pointInPolygon(point, vs) {
    const x = point[1], y = point[0]; // x=lng, y=lat
    let inside = false;
    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
      const xi = vs[i][1], yi = vs[i][0];
      const xj = vs[j][1], yj = vs[j][0];
      const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  for (const m of monuments) {
    const inside = pointInPolygon([m.coordinates.lat, m.coordinates.lng], indiaPolygon);
    runner.assert(inside, `Monument ${m.id} (${m.name}) at (${m.coordinates.lat}, ${m.coordinates.lng}) failed mainland polygon check`);
  }
});

runner.test('GPS-07: Real-world geodetic ground truth checks for marquee icons', () => {
  const groundTruths = [
    { id: 'IN-UP-001', name: 'Taj Mahal', expLat: 27.1751, expLng: 78.0421 },
    { id: 'IN-DL-001', name: 'Qutub Minar', expLat: 28.5245, expLng: 77.1855 },
    { id: 'IN-RJ-001', name: 'Amer Fort', expLat: 26.9855, expLng: 75.8513 },
    { id: 'IN-KA-001', name: 'Virupaksha Hampi', expLat: 15.3353, expLng: 76.4600 },
    { id: 'IN-OR-001', name: 'Sun Temple Konark', expLat: 19.8876, expLng: 86.0945 },
    { id: 'IN-TN-001', name: 'Brihadisvara Thanjavur', expLat: 10.7828, expLng: 79.1318 },
    { id: 'IN-MH-001', name: 'Ajanta Caves', expLat: 20.5519, expLng: 75.7033 },
    { id: 'IN-GJ-001', name: 'Rani ki Vav', expLat: 23.8589, expLng: 72.1017 }
  ];

  for (const gt of groundTruths) {
    const m = monuments.find(x => x.id === gt.id);
    runner.assert(m, `Ground truth monument ${gt.id} not found in catalog`);
    const dist = calculateDistanceKm(m.coordinates.lat, m.coordinates.lng, gt.expLat, gt.expLng);
    runner.assert(dist < 0.2, `Monument ${gt.id} (${m.name}) deviates ${dist.toFixed(3)} km from ground truth`);
  }
});

// ============================================================================
// SUITE 2: Haversine Formula Boundaries, Extremes & Numerical Stability
// ============================================================================
runner.suite('2. Haversine Formula Boundaries, Extremes & Numerical Stability');

runner.test('HAV-01: Identity / Zero-distance consistency: calculateDistanceKm(P, P) === 0', () => {
  for (const m of monuments.slice(0, 10)) {
    const d1 = calculateDistanceKm(m.coordinates, m.coordinates);
    const d2 = calculateDistanceKm(m.coordinates.lat, m.coordinates.lng, m.coordinates.lat, m.coordinates.lng);
    runner.assert(d1 === 0, `Object overload returned non-zero (${d1}) for identical point`);
    runner.assert(d2 === 0, `Scalar overload returned non-zero (${d2}) for identical point`);
  }
});

runner.test('HAV-02: Micro-distance resolution (< 1 meter) and sub-millimeter precision', () => {
  const baseLat = 28.5245;
  const baseLng = 77.1855;
  // 1e-5 degrees lat is ~1.11 meters
  const microDist = calculateDistanceKm(baseLat, baseLng, baseLat + 0.000005, baseLng + 0.000005);
  runner.assert(!isNaN(microDist), 'Micro-distance returned NaN');
  runner.assert(microDist > 0 && microDist < 0.002, `Expected micro-distance < 2m, got ${microDist * 1000}m`);
  
  // Test sub-millimeter offset
  const nanoDist = calculateDistanceKm(baseLat, baseLng, baseLat + 1e-8, baseLng + 1e-8);
  runner.assert(!isNaN(nanoDist) && nanoDist >= 0, `Sub-millimeter calculation yielded invalid distance: ${nanoDist}`);
});

runner.test('HAV-03: Pole-to-pole boundary calculation: (90, 0) to (-90, 0)', () => {
  const d = calculateDistanceKm(90, 0, -90, 0);
  const expectedPoleDist = Math.PI * 6371; // ~20015.087 km
  runner.assert(!isNaN(d), 'Pole-to-pole returned NaN');
  runner.assert(Math.abs(d - expectedPoleDist) < 0.01,
    `Pole-to-pole distance ${d} deviates from theoretical half-circumference ${expectedPoleDist}`);
});

runner.test('HAV-04: Equatorial antipodal calculation: (0, 0) to (0, 180)', () => {
  const d = calculateDistanceKm(0, 0, 0, 180);
  const expected = Math.PI * 6371;
  runner.assert(!isNaN(d), 'Equator antipodal returned NaN');
  runner.assert(Math.abs(d - expected) < 0.01,
    `Equator antipodal distance ${d} deviates from ${expected}`);
});

runner.test('HAV-05: Stress test against 10,000 randomized antipodal pairs for floating-point NaN overshoot', () => {
  let nanCount = 0;
  const failingPairs = [];

  for (let i = 0; i < 10000; i++) {
    const lat1 = (Math.random() * 180) - 90;
    const lon1 = (Math.random() * 360) - 180;
    const lat2 = -lat1;
    const lon2 = lon1 > 0 ? lon1 - 180 : lon1 + 180;

    const dist = calculateDistanceKm(lat1, lon1, lat2, lon2);
    if (isNaN(dist)) {
      nanCount++;
      if (failingPairs.length < 3) {
        failingPairs.push({ lat1, lon1, lat2, lon2, dist });
      }
    }
  }

  runner.assert(nanCount === 0,
    `CRITICAL NUMERICAL DEFECT: Haversine returned NaN on ${nanCount}/10,000 antipodal pairs! Sample: ${JSON.stringify(failingPairs[0])}`);
});

runner.test('HAV-06: Direct verification of isolated antipodal coordinate bug', () => {
  // Known floating-point overshoot coordinates:
  const bugPair = {
    lat1: -87.51052787592211,
    lon1: -128.4495766391693,
    lat2: 87.51052787592211,
    lon2: 51.550423360830706
  };
  const dist = calculateDistanceKm(bugPair.lat1, bugPair.lon1, bugPair.lat2, bugPair.lon2);
  runner.assert(!isNaN(dist),
    `Haversine formula produced NaN on antipodal coordinate pair: ${JSON.stringify(bugPair)} (result: ${dist})`);
});

runner.test('HAV-07: Monument antipodal calculation (no catalog monument antipodal yields NaN)', () => {
  for (const m of monuments) {
    const antiLat = -m.coordinates.lat;
    const antiLng = m.coordinates.lng > 0 ? m.coordinates.lng - 180 : m.coordinates.lng + 180;
    const dist = calculateDistanceKm(m.coordinates.lat, m.coordinates.lng, antiLat, antiLng);
    runner.assert(!isNaN(dist), `Monument ${m.id} (${m.name}) antipodal distance evaluated to NaN`);
  }
});

runner.test('HAV-08: formatDistance threshold boundary checks', () => {
  runner.assert(formatDistance(0) === '0 m away', `0 km formatted as "${formatDistance(0)}"`);
  runner.assert(formatDistance(0.0001) === '0 m away', `0.0001 km formatted as "${formatDistance(0.0001)}"`);
  runner.assert(formatDistance(0.500) === '500 m away', `0.5 km formatted as "${formatDistance(0.5)}"`);
  runner.assert(formatDistance(0.999) === '999 m away', `0.999 km formatted as "${formatDistance(0.999)}"`);
  runner.assert(formatDistance(1.0) === '1.0 km away', `1.0 km formatted as "${formatDistance(1.0)}"`);
  runner.assert(formatDistance(1.04) === '1.0 km away', `1.04 km formatted as "${formatDistance(1.04)}"`);
  runner.assert(formatDistance(1.06) === '1.1 km away', `1.06 km formatted as "${formatDistance(1.06)}"`);
});

runner.test('HAV-09: formatCoordinates directional hemisphere formatting', () => {
  runner.assert(formatCoordinates(28.5245, 77.1855) === '28.5245° N · 77.1855° E', 'NE format mismatch');
  runner.assert(formatCoordinates(-33.8688, 151.2093) === '33.8688° S · 151.2093° E', 'SE format mismatch');
  runner.assert(formatCoordinates(40.7128, -74.0060) === '40.7128° N · 74.0060° W', 'NW format mismatch');
  runner.assert(formatCoordinates(-22.9068, -43.1729) === '22.9068° S · 43.1729° W', 'SW format mismatch');
});

// ============================================================================
// SUITE 3: Rapid Search Fuzzing & Injection Resilience
// ============================================================================
runner.suite('3. Rapid Search Fuzzing & Injection Resilience');

runner.test('FUZZ-01: Empty & whitespace query handling', () => {
  const emptyRes = searchMonuments(monuments, '');
  runner.assert(emptyRes.length === 50, 'Empty string did not return full dataset');
  
  const spaceRes = searchMonuments(monuments, '     ');
  runner.assert(spaceRes.length === 50, 'Multi-space did not return full dataset');

  const tabNewlineRes = searchMonuments(monuments, '\t\n\r  ');
  runner.assert(tabNewlineRes.length === 50, 'Whitespace escape characters did not return full dataset');
});

runner.test('FUZZ-02: Special characters & punctuation fuzzing', () => {
  const specialChars = [
    '!@#$%^&*()_+-=[]{}|;:\'",.<>/?`~',
    '\\',
    '/',
    '\'',
    '"',
    '`',
    '#@!$*&',
    '---',
    '***',
    '???',
    '...'
  ];

  for (const sc of specialChars) {
    let res;
    try {
      res = searchMonuments(monuments, sc);
    } catch (e) {
      runner.assert(false, `Search threw exception on punctuation query "${sc}": ${e.message}`);
    }
    runner.assert(Array.isArray(res), `Search did not return array for "${sc}"`);
  }
});

runner.test('FUZZ-03: Regex injection & ReDoS attack payloads', () => {
  const regexAttacks = [
    '.*',
    '(',
    '[',
    '\\',
    '+',
    '?',
    '^.*$',
    '([a-zA-Z]+)*',
    '((a+)+)+$',
    '(a|aa)+',
    '\\p{L}+',
    '(?=.*[a-z])',
    '/^.*$/i'
  ];

  for (const pattern of regexAttacks) {
    let res;
    try {
      res = searchMonuments(monuments, pattern);
    } catch (e) {
      runner.assert(false, `Search vulnerable to Regex injection syntax error on "${pattern}": ${e.message}`);
    }
    runner.assert(Array.isArray(res), `Failed to handle regex string safely: ${pattern}`);
  }
});

runner.test('FUZZ-04: SQL injection & XSS attack payloads', () => {
  const injections = [
    '\' OR \'1\'=\'1',
    '1; DROP TABLE monuments; --',
    '\' UNION SELECT * FROM users --',
    '<script>alert("XSS")</script>',
    '<img src=x onerror=alert(1)>',
    'javascript:void(0)',
    '${7*7}',
    '{{7*7}}',
    '<!--#exec cmd="ls"-->'
  ];

  for (const payload of injections) {
    const res = searchMonuments(monuments, payload);
    runner.assert(Array.isArray(res), `Injection payload caused non-array return: ${payload}`);
  }
});

runner.test('FUZZ-05: Multilingual non-Latin script search resolution', () => {
  // Devanagari Hindi
  const tajHindi = searchMonuments(monuments, 'ताज महल');
  runner.assert(tajHindi.length >= 1 && tajHindi.some(m => m.id === 'IN-UP-001'),
    'Failed to resolve Taj Mahal via Hindi Devanagari query "ताज महल"');

  const qutubHindi = searchMonuments(monuments, 'क़ुतुब');
  runner.assert(qutubHindi.length >= 1 && qutubHindi.some(m => m.id === 'IN-DL-001'),
    'Failed to resolve Qutub Minar via Hindi Devanagari query "क़ुतुब"');

  // Regional languages: Tamil, Telugu, Bengali
  const tajTamil = searchMonuments(monuments, 'தாஜ் மஹால்');
  console.log(`    ℹ Multilingual search result for Tamil "தாஜ் மஹால்": ${tajTamil.length} matches`);
  
  const tajTelugu = searchMonuments(monuments, 'తాజ్ మహల్');
  console.log(`    ℹ Multilingual search result for Telugu "తాజ్ మహల్": ${tajTelugu.length} matches`);

  const tajBengali = searchMonuments(monuments, 'তাজমহল');
  console.log(`    ℹ Multilingual search result for Bengali "তাজমহল": ${tajBengali.length} matches`);
});

runner.test('FUZZ-06: Extreme query length stress testing (1k, 10k, 100k chars)', () => {
  const str1k = 'fort '.repeat(200);
  const start1k = performance.now();
  const res1k = searchMonuments(monuments, str1k);
  const dur1k = performance.now() - start1k;
  runner.assert(dur1k < 20, `1k-char search too slow: ${dur1k.toFixed(2)}ms`);

  const str10k = 'a'.repeat(10000);
  const start10k = performance.now();
  const res10k = searchMonuments(monuments, str10k);
  const dur10k = performance.now() - start10k;
  runner.assert(dur10k < 50, `10k-char search too slow: ${dur10k.toFixed(2)}ms`);

  const str100k = 'b'.repeat(100000);
  const start100k = performance.now();
  const res100k = searchMonuments(monuments, str100k);
  const dur100k = performance.now() - start100k;
  runner.assert(dur100k < 200, `100k-char search too slow: ${dur100k.toFixed(2)}ms`);
  runner.assert(res100k.length === 0, 'Expected 0 results for 100k non-matching query');
});

runner.test('FUZZ-07: Diacritic normalization resilience (Itimad vs I\'timad)', () => {
  const res1 = searchMonuments(monuments, 'Itimad');
  const res2 = searchMonuments(monuments, 'I\'timad');
  const res3 = searchMonuments(monuments, 'I’timad'); // curly apostrophe
  const res4 = searchMonuments(monuments, 'I`timad'); // backtick

  runner.assert(res1.length >= 1 && res1.some(m => m.id === 'IN-UP-004'), 'Itimad failed');
  runner.assert(res2.length >= 1 && res2.some(m => m.id === 'IN-UP-004'), 'I\'timad failed');
  runner.assert(res3.length >= 1 && res3.some(m => m.id === 'IN-UP-004'), 'I’timad curly quote failed');
  runner.assert(res4.length >= 1 && res4.some(m => m.id === 'IN-UP-004'), 'I`timad backtick failed');
});

runner.test('FUZZ-08: Multi-token intersection logic (AND matching across targets)', () => {
  const resMughalAgra = searchMonuments(monuments, 'Mughal Agra');
  runner.assert(resMughalAgra.length >= 2, 'Expected at least 2 Mughal monuments in Agra');
  for (const m of resMughalAgra) {
    runner.assert(m.city === 'Agra' || m.district === 'Agra' || m.state === 'Uttar Pradesh',
      `Monument ${m.name} matched "Mughal Agra" but is not in Agra`);
  }

  // Impossible conjunction
  const resImpossible = searchMonuments(monuments, 'Mughal Madurai');
  runner.assert(resImpossible.length === 0, 'Impossible query "Mughal Madurai" should yield 0 results');
});

runner.test('FUZZ-09: Null and undefined input robustness', () => {
  let nullRes, undefRes;
  try {
    nullRes = searchMonuments(monuments, null);
    undefRes = searchMonuments(monuments, undefined);
  } catch (err) {
    runner.assert(false, `searchMonuments crashed on null/undefined query: ${err.message}`);
  }
  runner.assert(nullRes.length === 50, 'null query should return all monuments');
  runner.assert(undefRes.length === 50, 'undefined query should return all monuments');
});

// ============================================================================
// SUITE 4: Category Filtering Combinatorial Testing
// ============================================================================
runner.suite('4. Category Filtering Combinatorial Testing');

const DEFAULT_CHIPS = [
  { label: 'All Monuments', value: 'all' },
  { label: '🏰 Forts & Palaces', value: 'Fort & Palace' },
  { label: '🛕 Temples', value: 'Temple' },
  { label: '✨ UNESCO Sites', value: 'unesco' },
  { label: '🏛️ Tombs & Mosques', value: 'Tombs & Mosques' },
  { label: '🪜 Stepwells', value: 'Stepwell' },
];

function filterMonuments(dataset, { category = 'all', circuit = null, query = '' }) {
  let result = dataset;

  if (circuit) {
    result = result.filter(m => circuit.monumentIds.includes(m.id));
  }

  if (category === 'unesco') {
    result = result.filter(m => m.unesco);
  } else if (category === 'Tombs & Mosques') {
    result = result.filter(m => m.category === 'Tomb & Mausoleum' || m.category === 'Mosque');
  } else if (category !== 'all') {
    result = result.filter(m => m.category === category);
  }

  if (query && query.trim()) {
    result = searchMonuments(result, query);
  }

  return result;
}

runner.test('CAT-01: Discrete category chip counts and integrity', () => {
  for (const chip of DEFAULT_CHIPS) {
    const filtered = filterMonuments(monuments, { category: chip.value });
    console.log(`    ℹ Chip "${chip.label}" (${chip.value}): ${filtered.length} monuments`);
    if (chip.value === 'all') {
      runner.assert(filtered.length === 50, 'All chip must yield 50');
    } else {
      runner.assert(filtered.length > 0, `Category chip ${chip.value} yielded 0 monuments`);
    }
  }
});

runner.test('CAT-02: Forts & Palaces filter isolates only forts and palaces', () => {
  const forts = filterMonuments(monuments, { category: 'Fort & Palace' });
  runner.assert(forts.length >= 10, `Expected >= 10 forts, got ${forts.length}`);
  for (const f of forts) {
    runner.assert(f.category === 'Fort & Palace', `Found non-fort in fort category: ${f.name} (${f.category})`);
  }
});

runner.test('CAT-03: Tombs & Mosques combined chip correctly unions Tomb & Mausoleum + Mosque', () => {
  const combined = filterMonuments(monuments, { category: 'Tombs & Mosques' });
  const tombs = monuments.filter(m => m.category === 'Tomb & Mausoleum');
  const mosques = monuments.filter(m => m.category === 'Mosque');
  runner.assert(combined.length === tombs.length + mosques.length,
    `Combined length ${combined.length} != sum of tombs (${tombs.length}) and mosques (${mosques.length})`);
  for (const m of combined) {
    runner.assert(m.category === 'Tomb & Mausoleum' || m.category === 'Mosque',
      `Unexpected category in combined filter: ${m.category}`);
  }
});

runner.test('CAT-04: Combinatorial Filter: Category + Search query', () => {
  // Temples in Tamil Nadu
  const tnTemples = filterMonuments(monuments, { category: 'Temple', query: 'Tamil Nadu' });
  runner.assert(tnTemples.length >= 3, `Expected >= 3 temples in TN, got ${tnTemples.length}`);
  for (const t of tnTemples) {
    runner.assert(t.state === 'Tamil Nadu' && t.category === 'Temple', `Mismatched temple: ${t.name}`);
  }

  // Forts with UNESCO tag
  const unescoForts = filterMonuments(monuments, { category: 'Fort & Palace', query: 'UNESCO' });
  runner.assert(unescoForts.length >= 4, `Expected >= 4 UNESCO forts, got ${unescoForts.length}`);
  for (const f of unescoForts) {
    runner.assert(f.unesco === true, `Fort ${f.name} is not UNESCO`);
  }
});

runner.test('CAT-05: Empty category result handling (Stepwells in Southern Dynasties circuit)', () => {
  const southCircuit = circuits.find(c => c.id === 'southern-dynasties');
  runner.assert(southCircuit, 'southern-dynasties circuit not found');
  
  const stepwellsInSouth = filterMonuments(monuments, { circuit: southCircuit, category: 'Stepwell' });
  runner.assert(Array.isArray(stepwellsInSouth) && stepwellsInSouth.length === 0,
    'Expected 0 stepwells in southern-dynasties circuit');
});

runner.test('CAT-06: Rapid category switching stress simulation (1,000 iterations)', () => {
  const start = performance.now();
  for (let i = 0; i < 1000; i++) {
    const chip = DEFAULT_CHIPS[i % DEFAULT_CHIPS.length];
    const res = filterMonuments(monuments, { category: chip.value });
    runner.assert(res.length >= 0, 'Filter returned invalid state');
  }
  const dur = performance.now() - start;
  runner.assert(dur < 100, `1000 category switches took ${dur.toFixed(2)}ms (expected < 100ms)`);
});

// ============================================================================
// SUITE 5: Curated Circuits Integrity & Route Realism
// ============================================================================
runner.suite('5. Curated Circuits Integrity & Route Realism');

runner.test('CIR-01: Exactly 4 circuits defined matching project specifications', () => {
  runner.assert(circuits.length === 4, `Expected 4 circuits, got ${circuits.length}`);
  const expectedIds = ['golden-triangle', 'unesco-world-heritage', 'royal-rajput-forts', 'southern-dynasties'];
  for (const id of expectedIds) {
    runner.assert(circuits.some(c => c.id === id), `Missing required circuit id: ${id}`);
  }
});

runner.test('CIR-02: Monument count threshold (every circuit contains >= 3 monuments)', () => {
  for (const c of circuits) {
    runner.assert(Array.isArray(c.monumentIds) && c.monumentIds.length >= 3,
      `Circuit ${c.id} contains fewer than 3 monuments (${c.monumentIds.length})`);
  }
});

runner.test('CIR-03: Referential integrity: 100% of monumentIds exist in monuments.json', () => {
  const validIds = new Set(monuments.map(m => m.id));
  for (const c of circuits) {
    for (const id of c.monumentIds) {
      runner.assert(validIds.has(id),
        `Circuit ${c.id} references non-existent monument ID: "${id}"`);
    }
  }
});

runner.test('CIR-04: Route distance realism & plausibility check', () => {
  const monumentMap = new Map(monuments.map(m => [m.id, m]));

  for (const c of circuits) {
    let totalDist = 0;
    for (let i = 1; i < c.monumentIds.length; i++) {
      const m1 = monumentMap.get(c.monumentIds[i - 1]);
      const m2 = monumentMap.get(c.monumentIds[i]);
      totalDist += calculateDistanceKm(m1.coordinates, m2.coordinates);
    }
    console.log(`    ℹ Circuit "${c.name}" (${c.id}): ${c.monumentIds.length} stops, ${Math.round(totalDist)} km, ${c.approxDays} days`);

    runner.assert(totalDist > 0, `Circuit ${c.id} total route distance must be > 0`);
    runner.assert(!isNaN(totalDist), `Circuit ${c.id} total route distance evaluated to NaN`);

    // Golden Triangle must be between 400 and 700 km
    if (c.id === 'golden-triangle') {
      runner.assert(totalDist >= 400 && totalDist <= 700,
        `Golden triangle sequential route distance ${Math.round(totalDist)} km outside expected range [400, 700] km`);
    }
  }
});

runner.test('CIR-05: Circuit approxDays realism boundary (between 1 and 21 days)', () => {
  for (const c of circuits) {
    runner.assert(typeof c.approxDays === 'number' && c.approxDays >= 1 && c.approxDays <= 21,
      `Circuit ${c.id} has unrealistic approxDays: ${c.approxDays}`);
  }
});

// ============================================================================
// SUITE 6: Production Bundle Size & Build Output Verification
// ============================================================================
runner.suite('6. Production Bundle Size & Build Output Verification');

runner.test('BLD-01: Production build artifacts exist in dist/', () => {
  const distHtml = path.join(ROOT, 'dist/index.html');
  const distAssets = path.join(ROOT, 'dist/assets');
  runner.assert(fs.existsSync(distHtml), 'dist/index.html does not exist');
  runner.assert(fs.existsSync(distAssets), 'dist/assets directory does not exist');
});

runner.test('BLD-02: Total production bundle payload < 500 KB gzipped initial budget', () => {
  const assetsDir = path.join(ROOT, 'dist/assets');
  const files = fs.readdirSync(assetsDir);

  let totalGzipBytes = 0;
  console.log('    ℹ Enumerating production assets:');
  for (const f of files) {
    if (f.endsWith('.js') || f.endsWith('.css')) {
      const fullPath = path.join(assetsDir, f);
      const raw = fs.readFileSync(fullPath);
      const gzipped = zlib.gzipSync(raw);
      totalGzipBytes += gzipped.length;
      console.log(`      - ${f}: ${(raw.length / 1024).toFixed(2)} KB raw | ${(gzipped.length / 1024).toFixed(2)} KB gzipped`);
    }
  }

  const totalGzipKb = (totalGzipBytes / 1024).toFixed(2);
  console.log(`    ℹ Total Initial Gzipped Payload: ${totalGzipKb} KB / 500 KB Limit`);
  runner.assert(totalGzipBytes < 500 * 1024,
    `Total initial gzipped payload (${totalGzipKb} KB) exceeds 500 KB limit!`);
});

// ============================================================================
// Execute Runner & Export Summary
// ============================================================================
const auditSummary = runner.summary();
if (auditSummary.failed > 0) {
  process.exitCode = 1;
}
