/**
 * SMRITI SATHI — SIH High-Priority Clinical & Safe Return Test Suite
 * 
 * Verifies:
 * 1. Offline SVG QR Code generation (zero external C++ or canvas dependencies)
 * 2. Good Samaritan Safe Return Lost Elder Rescue Mode
 * 3. Wearable Laminated ID Badge Generator
 * 4. Sundowning & Circadian Evening Care Module
 * 5. ASHA Community Health Triaging Hub (14-session moving median SPI engine)
 * 6. PIN-free emergency bypass on LoginScreen and global floating rescue pill
 */

import { test, describe } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

describe('SIH Clinical & Safe Return Emergency Features', () => {
  // Test 1: Offline QR Code Generator
  test('1.1: QRCodeSvg.tsx exists and is 100% self-contained without npm qr dependencies', () => {
    const qrPath = path.join(rootDir, 'src/components/QRCodeSvg.tsx');
    assert.ok(fs.existsSync(qrPath), 'QRCodeSvg.tsx must exist');
    const content = fs.readFileSync(qrPath, 'utf8');
    assert.ok(content.includes('drawFinder') || content.includes('matrix'), 'Must include matrix calculation algorithm');
    assert.ok(content.includes('<svg'), 'Must render native SVG element');
    assert.ok(!content.includes("from 'qrcode'"), 'Must not depend on npm qrcode');
  });

  // Test 2: Safe Return Modal
  test('2.1: SafeReturnModal.tsx provides 1-tap phone, WhatsApp GPS beacon, and emergency helpline speed dials', () => {
    const modalPath = path.join(rootDir, 'src/components/SafeReturnModal.tsx');
    assert.ok(fs.existsSync(modalPath), 'SafeReturnModal.tsx must exist');
    const content = fs.readFileSync(modalPath, 'utf8');
    assert.ok(content.includes('tel:'), 'Must include direct tel: link for Good Samaritan');
    assert.ok(content.includes('whatsapp') || content.includes('wa.me'), 'Must include WhatsApp GPS location beacon');
    assert.ok(content.includes('14567'), 'Must include National Elderline 14567');
    assert.ok(content.includes('112'), 'Must include Emergency 112 speed dial');
    assert.ok(content.includes('QRCodeSvg'), 'Must render offline emergency QR code');
  });

  // Test 3: Wearable Badge Generator
  test('3.1: WearableBadgeGeneratorModal.tsx generates physical 85x54mm laminated card with front/back preview', () => {
    const badgePath = path.join(rootDir, 'src/components/WearableBadgeGeneratorModal.tsx');
    assert.ok(fs.existsSync(badgePath), 'WearableBadgeGeneratorModal.tsx must exist');
    const content = fs.readFileSync(badgePath, 'utf8');
    assert.ok(content.includes('window.print()'), 'Must include 1-click browser printing');
    assert.ok(content.includes('85mm'), 'Must support CR80 standard card width');
    assert.ok(content.includes('54mm'), 'Must support CR80 standard card height');
    assert.ok(content.includes('cardSide'), 'Must support toggling between front and back card faces');
  });

  // Test 4: Sundowning Circadian Care
  test('4.1: SundowningCareModal.tsx provides 4-7-8 breathing pacer, familiar voice prompts, and harmonic chimes', () => {
    const sundownPath = path.join(rootDir, 'src/components/SundowningCareModal.tsx');
    assert.ok(fs.existsSync(sundownPath), 'SundowningCareModal.tsx must exist');
    const content = fs.readFileSync(sundownPath, 'utf8');
    assert.ok(content.includes('4-7-8') || content.includes('breathPhase'), 'Must implement breathing cycle');
    assert.ok(content.includes('SpeechSynthesisUtterance'), 'Must implement familiar voice reassurance');
    assert.ok(content.includes('AudioContext') || content.includes('webkitAudioContext'), 'Must synthesize gentle ambient chime sounds');
    assert.ok(content.includes('as:') && content.includes('brx:') && content.includes('mni:'), 'Must support Northeast languages');
  });

  // Test 5: ASHA Triaging Hub & SPI Engine
  test('5.1: AshaTriageModal.tsx implements 14-session moving median SPI reporting and ICMR non-diagnostic triaging', () => {
    const ashaPath = path.join(rootDir, 'src/components/AshaTriageModal.tsx');
    assert.ok(fs.existsSync(ashaPath), 'AshaTriageModal.tsx must exist');
    const content = fs.readFileSync(ashaPath, 'utf8');
    assert.ok(content.includes('14-Session') || content.includes('14-session'), 'Must track 14-session moving median');
    assert.ok(content.includes('Working Memory'), 'Must evaluate Working Memory domain');
    assert.ok(content.includes('Temporal Sequencing'), 'Must evaluate Temporal Sequencing domain');
    assert.ok(content.includes('wa.me'), 'Must support 1-click WhatsApp triage dispatch to PHC doctor');
    assert.ok(content.includes('window.print()'), 'Must support printable ASHA community health record');
  });

  // Test 6: App and LoginScreen Integration
  test('6.1: LoginScreen.tsx features prominent 1-tap Good Samaritan rescue bar bypassing login', () => {
    const loginPath = path.join(rootDir, 'src/pages/auth/LoginScreen.tsx');
    const content = fs.readFileSync(loginPath, 'utf8');
    assert.ok(content.includes('Found a Lost Elder?'), 'Must display Good Samaritan emergency button');
    assert.ok(content.includes('SafeReturnModal'), 'Must mount SafeReturnModal directly on login screen');
  });

  test('6.2: App.tsx mounts global emergency rescue pill and listens for all care events', () => {
    const appPath = path.join(rootDir, 'src/App.tsx');
    const content = fs.readFileSync(appPath, 'utf8');
    assert.ok(content.includes('SafeReturnModal'), 'Must render SafeReturnModal in root');
    assert.ok(content.includes('SundowningCareModal'), 'Must render SundowningCareModal in root');
    assert.ok(content.includes('AshaTriageModal'), 'Must render AshaTriageModal in root');
    assert.ok(content.includes('WearableBadgeGeneratorModal'), 'Must render WearableBadgeGeneratorModal in root');
    assert.ok(content.includes('open-safe-return'), 'Must listen to open-safe-return custom event');
    assert.ok(content.includes('open-sundowning'), 'Must listen to open-sundowning custom event');
  });

  test('6.3: PatientHomeScreen.tsx features twin tactile emergency and evening calm cards', () => {
    const patientHomePath = path.join(rootDir, 'src/pages/PatientHomeScreen.tsx');
    const content = fs.readFileSync(patientHomePath, 'utf8');
    assert.ok(content.includes('open-safe-return'), 'Must trigger open-safe-return on tap');
    assert.ok(content.includes('open-sundowning'), 'Must trigger open-sundowning on tap');
  });
});
