// scripts/catalog/build_and_validate.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { delhiMonuments } from './delhi_monuments.js';
import { agraMonuments } from './agra_monuments.js';
import { jaipurMonuments } from './jaipur_monuments.js';
import { nationalMonuments1 } from './national_monuments_1.js';
import { nationalMonuments2 } from './national_monuments_2.js';
import { circuitsData } from './circuits_data.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

console.log('🏛️ Compiling and Validating Herodotus 50-Monument Spatial Catalog & Circuits Dataset...\n');

const allMonuments = [
  ...delhiMonuments,
  ...agraMonuments,
  ...jaipurMonuments,
  ...nationalMonuments1,
  ...nationalMonuments2
];

// Validation checks
function assert(condition, message) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`✅ ${message}`);
}

// 1. Check count
assert(allMonuments.length === 50, `Catalog contains exactly 50 monuments (found: ${allMonuments.length})`);

// 2. Check IDs uniqueness
const ids = new Set();
allMonuments.forEach(m => {
  assert(!ids.has(m.id), `Unique monument ID check: "${m.id}" is not duplicated`);
  ids.add(m.id);
});

// 3. Schema validation
const requiredKeys = [
  'id', 'name', 'hindiName', 'alternateNames', 'category', 'coordinates',
  'state', 'city', 'district', 'asiCircle', 'unesco', 'dynasty', 'era', 'foundedYear',
  'shortDescription', 'fullNarrative', 'architecturalHighlights', 'timeline',
  'timings', 'tariffs', 'eTicketUrl', 'heroImage', 'galleryImages', 'audioNarrations'
];

const requiredCategories = [
  'Fort & Palace', 'Temple', 'Tomb & Mausoleum', 'Mosque',
  'Stepwell', 'Caves & Rock-cut', 'Memorial & Gate', 'Ancient University'
];

const requiredLangs = ['en', 'hi', 'ta', 'te', 'bn'];

allMonuments.forEach((m, idx) => {
  for (const k of requiredKeys) {
    assert(m[k] !== undefined && m[k] !== null, `Monument #${idx + 1} (${m.id}) has required field "${k}"`);
  }

  // Category
  assert(requiredCategories.includes(m.category), `Monument ${m.id} has valid category "${m.category}"`);

  // Coordinates
  assert(typeof m.coordinates.lat === 'number' && typeof m.coordinates.lng === 'number', `Monument ${m.id} has numeric coordinates`);
  assert(m.coordinates.lat >= 6.0 && m.coordinates.lat <= 36.0, `Monument ${m.id} lat (${m.coordinates.lat}) is within India bounds [6, 36]`);
  assert(m.coordinates.lng >= 68.0 && m.coordinates.lng <= 98.0, `Monument ${m.id} lng (${m.coordinates.lng}) is within India bounds [68, 98]`);

  // Highlights and Timeline
  assert(Array.isArray(m.architecturalHighlights) && m.architecturalHighlights.length >= 4, `Monument ${m.id} has >= 4 highlights (${m.architecturalHighlights.length})`);
  assert(Array.isArray(m.timeline) && m.timeline.length >= 3, `Monument ${m.id} has >= 3 timeline milestones (${m.timeline.length})`);
  m.timeline.forEach(t => {
    assert(typeof t.year === 'string' && typeof t.event === 'string', `Monument ${m.id} timeline entry has string year and event`);
  });

  // Tariffs
  assert(typeof m.tariffs.indianRupees === 'number', `Monument ${m.id} has numeric indianRupees`);
  assert(typeof m.tariffs.saarcRupees === 'number', `Monument ${m.id} has numeric saarcRupees`);
  assert(typeof m.tariffs.foreignRupees === 'number', `Monument ${m.id} has numeric foreignRupees`);
  assert(typeof m.tariffs.entryFreeUnder15 === 'boolean', `Monument ${m.id} has boolean entryFreeUnder15`);

  // Images
  assert(typeof m.heroImage === 'string' && m.heroImage.length > 5, `Monument ${m.id} has valid heroImage string`);
  assert(Array.isArray(m.galleryImages) && m.galleryImages.length >= 2, `Monument ${m.id} has >= 2 galleryImages`);

  // Audio narrations
  for (const lang of requiredLangs) {
    const audio = m.audioNarrations[lang];
    assert(!!audio, `Monument ${m.id} has audioNarration for language "${lang}"`);
    assert(audio.language === lang, `Monument ${m.id} audio "${lang}" language matches`);
    assert(typeof audio.title === 'string' && audio.title.length > 3, `Monument ${m.id} audio "${lang}" has valid title`);
    assert(typeof audio.durationSeconds === 'number' && audio.durationSeconds >= 60, `Monument ${m.id} audio "${lang}" duration >= 60s (${audio.durationSeconds}s)`);
    assert(typeof audio.narrationText === 'string' && audio.narrationText.length >= 100, `Monument ${m.id} audio "${lang}" narrationText has sufficient length (${audio.narrationText.length} chars)`);
  }
});

// 4. Validate circuits
assert(Array.isArray(circuitsData) && circuitsData.length === 4, `Curated circuits has exactly 4 circuits (found: ${circuitsData.length})`);
const circuitIds = [
  'circuit-golden-triangle', 'golden-triangle',
  'circuit-unesco-trail', 'unesco-world-heritage',
  'circuit-sacred-architecture', 'southern-dynasties',
  'circuit-desert-forts', 'royal-rajput-forts'
];
circuitsData.forEach(c => {
  assert(circuitIds.includes(c.id), `Circuit ID "${c.id}" matches required circuit IDs`);
  assert(typeof c.name === 'string' && c.name.length > 3, `Circuit "${c.id}" has valid name`);
  assert(typeof c.subtitle === 'string' && c.subtitle.length > 3, `Circuit "${c.id}" has valid subtitle`);
  assert(typeof c.description === 'string' && c.description.length > 10, `Circuit "${c.id}" has valid description`);
  assert(typeof c.approxDays === 'number' && c.approxDays > 0, `Circuit "${c.id}" has valid approxDays`);
  assert(Array.isArray(c.monumentIds) && c.monumentIds.length >= 4, `Circuit "${c.id}" has >= 4 monuments (${c.monumentIds.length})`);
  
  // Verify all monumentIds in circuit exist in monuments catalog
  c.monumentIds.forEach(mId => {
    assert(ids.has(mId), `Circuit "${c.id}" references valid monument ID: "${mId}"`);
  });
});

console.log('\nWriting datasets to disk...');

// File destinations
const srcDataDir = path.join(projectRoot, 'src/data');
const pubDataDir = path.join(projectRoot, 'public/data');

if (!fs.existsSync(srcDataDir)) fs.mkdirSync(srcDataDir, { recursive: true });
if (!fs.existsSync(pubDataDir)) fs.mkdirSync(pubDataDir, { recursive: true });

// 1. src/data/monuments.json
const monumentsJsonPath = path.join(srcDataDir, 'monuments.json');
fs.writeFileSync(monumentsJsonPath, JSON.stringify(allMonuments, null, 2), 'utf-8');
console.log(`✅ Saved ${monumentsJsonPath} (${(fs.statSync(monumentsJsonPath).size / 1024).toFixed(1)} KB)`);

// 2. public/data/monuments.json (for Service Worker cache)
const pubMonumentsJsonPath = path.join(pubDataDir, 'monuments.json');
fs.writeFileSync(pubMonumentsJsonPath, JSON.stringify(allMonuments, null, 2), 'utf-8');
console.log(`✅ Saved ${pubMonumentsJsonPath} (${(fs.statSync(pubMonumentsJsonPath).size / 1024).toFixed(1)} KB)`);

// 3. src/data/circuits.json
const circuitsJsonPath = path.join(srcDataDir, 'circuits.json');
fs.writeFileSync(circuitsJsonPath, JSON.stringify(circuitsData, null, 2), 'utf-8');
console.log(`✅ Saved ${circuitsJsonPath} (${(fs.statSync(circuitsJsonPath).size / 1024).toFixed(1)} KB)`);

// 4. src/data/circuits.ts (typed literal array matching Circuit interface)
const circuitsTsPath = path.join(srcDataDir, 'circuits.ts');
const circuitsTsFormatted = circuitsData.map(c => `  {
    id: ${JSON.stringify(c.id)},
    name: ${JSON.stringify(c.name)},
    subtitle: ${JSON.stringify(c.subtitle)},
    monumentIds: ${JSON.stringify(c.monumentIds, null, 6).replace(/\n\s*\]/, '\n    ]')},
    description: ${JSON.stringify(c.description)},
    approxDays: ${c.approxDays}
  }`).join(',\n');

const circuitsTsContent = `import { Circuit } from '../types/monument';

export const CIRCUITS: Circuit[] = [
${circuitsTsFormatted}
];
`;
fs.writeFileSync(circuitsTsPath, circuitsTsContent, 'utf-8');
console.log(`✅ Saved ${circuitsTsPath}`);


console.log('\n📊 Dataset Statistics:');
console.log(`- Total Monuments: ${allMonuments.length}`);
console.log(`- Delhi Cluster: ${delhiMonuments.length}`);
console.log(`- Agra Cluster: ${agraMonuments.length}`);
console.log(`- Jaipur/Rajasthan Cluster: ${jaipurMonuments.length}`);
console.log(`- Marquee National: ${nationalMonuments1.length + nationalMonuments2.length}`);
console.log(`- UNESCO Inscribed: ${allMonuments.filter(m => m.unesco).length}`);
console.log(`- Total Languages Supported: 5 (en, hi, ta, te, bn) across all 50 monuments (250 localized scripts)`);
console.log(`- Curated Circuits: ${circuitsData.length} (${circuitsData.map(c => c.name).join(', ')})`);
console.log('\n🎉 ALL CATALOG AND CIRCUITS CHECKS PASSED PERFECTLY!\n');
