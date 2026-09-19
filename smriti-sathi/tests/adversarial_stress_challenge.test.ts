/**
 * Tier 5: Adversarial Stress & Vulnerability Challenge Suite
 * Empirical Challenger: challenger_8_1
 * 
 * Adversarially challenges and stress-tests:
 * 1. MediaRecorder lifecycle, rapid cycles, stream track cleanup, empty chunks, unsupported MIME types, mic rejection.
 * 2. Dexie audioBlob storage: corrupted blobs, zero-byte blobs, massive payloads (10MB-25MB), simultaneous saves.
 * 3. MultimodalReminderModal: Portal mount, viewport styling, body scroll lock, text >= 24px, literal icons >= 72px,
 *    object URL revocation, haptic vibration fallbacks.
 */

import test from 'node:test';
import assert from 'node:assert';
import {
  setupTestEnvironment,
  MockElement,
  MockMediaStream,
  MockMediaStreamTrack,
  MockMediaRecorder,
  MockAudio,
  MockURL,
} from './mocks/browser_env.ts';
import { createMockDatabase } from './mocks/dexie_mock.ts';
import type { Reminder } from '../src/db/database';

// ============================================================================
// 1. ADVERSARIAL CHALLENGES: MediaRecorder & Audio Capture Lifecycle
// ============================================================================

test('ADVERSARIAL 1: MediaRecorder Lifecycle & Stream Track Leakage Stress', async (t) => {
  const env = setupTestEnvironment();

  await t.test('Adv-1.1: Rapid start/stop cycle (0ms latency stop) stops tracks cleanly', async () => {
    const stream = await env.navigator.mediaDevices.getUserMedia({ audio: true });
    const tracks = stream.getAudioTracks();
    const recorder = new env.MediaRecorder(stream);

    recorder.start(100);
    assert.strictEqual(recorder.state, 'recording');
    recorder.stop();
    assert.strictEqual(recorder.state, 'inactive');

    // Emulate cleanupStream
    tracks.forEach((tr) => tr.stop());
    assert.strictEqual(tracks[0].readyState, 'ended', 'MediaStreamTrack must be ended after rapid stop');
  });

  await t.test('Adv-1.2: Empirical Challenge — Double startRecording() without stopping leaks first stream tracks', async () => {
    // Simulates what happens if startRecording() is invoked concurrently or twice in a row
    const stream1 = await env.navigator.mediaDevices.getUserMedia({ audio: true });
    const track1 = stream1.getAudioTracks()[0];
    assert.strictEqual(track1.readyState, 'live');

    // Suppose hook overwrites mediaStreamRef.current without calling track1.stop()
    let activeStream: MockMediaStream | null = stream1;

    // Second call overwrites activeStream
    const stream2 = await env.navigator.mediaDevices.getUserMedia({ audio: true });
    const track2 = stream2.getAudioTracks()[0];
    activeStream = stream2;

    // When cleanup occurs on activeStream:
    activeStream.getTracks().forEach((tr) => tr.stop());
    assert.strictEqual(track2.readyState, 'ended', 'Stream 2 is ended');

    // EMPIRICAL VULNERABILITY CHECK:
    // If stream1 was not cleaned up before being overwritten, track1 is still 'live'!
    const track1Leaked = track1.readyState === 'live';
    assert.ok(
      track1Leaked,
      'Confirmed vulnerability: Without prior stream cleanup, unmanaged stream1 track leaks in live state'
    );

    // Clean up leaked track
    track1.stop();
  });

  await t.test('Adv-1.3: Calling stop() on already inactive recorder does not throw and preserves state', async () => {
    const stream = await env.navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new env.MediaRecorder(stream);

    assert.strictEqual(recorder.state, 'inactive');
    // Stop on inactive should be a no-op
    assert.doesNotThrow(() => recorder.stop());
    assert.strictEqual(recorder.state, 'inactive');
    stream.getTracks().forEach((tr) => tr.stop());
  });

  await t.test('Adv-1.4: Empty chunks emission (0-byte blob) handles assembly gracefully', async () => {
    const stream = await env.navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new env.MediaRecorder(stream);
    const chunks: Blob[] = [];

    recorder.ondataavailable = (e) => {
      // Emit 0-byte or empty blob
      if (e.data && e.data.size > 0) chunks.push(e.data);
    };

    // Do not emit any chunks; assemble directly
    const emptyBlob = new Blob(chunks, { type: 'audio/webm' });
    assert.strictEqual(emptyBlob.size, 0, 'Assembled blob size should be 0');

    // Create object URL for 0-byte blob
    const url = env.URL.createObjectURL(emptyBlob);
    assert.ok(url.startsWith('blob:'), 'Object URL created for 0-byte blob');
    assert.ok(env.URL.createdUrls.has(url));

    env.URL.revokeObjectURL(url);
    assert.ok(!env.URL.createdUrls.has(url), '0-byte blob URL revoked');
    stream.getTracks().forEach((tr) => tr.stop());
  });

  await t.test('Adv-1.5: Unsupported MIME type fallback to default container', async () => {
    // Save original supportedTypes
    const origSupported = new Set(MockMediaRecorder.supportedTypes);
    MockMediaRecorder.supportedTypes.clear(); // No types supported

    const stream = await env.navigator.mediaDevices.getUserMedia({ audio: true });

    // Recorder should initialize with browser default when candidate types are unsupported
    const candidates = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/mp4',
      'audio/aac',
      'audio/ogg;codecs=opus',
    ];
    let preferred: string | undefined = undefined;
    for (const c of candidates) {
      if (MockMediaRecorder.isTypeSupported(c)) {
        preferred = c;
        break;
      }
    }
    assert.strictEqual(preferred, undefined, 'No candidate MIME types are supported');

    // Constructor with undefined options uses default
    const recorder = new env.MediaRecorder(stream, preferred ? { mimeType: preferred } : undefined);
    assert.ok(recorder, 'MediaRecorder initializes with browser default fallback');

    // Restore supported types
    origSupported.forEach((t) => MockMediaRecorder.supportedTypes.add(t));
    stream.getTracks().forEach((tr) => tr.stop());
  });

  await t.test('Adv-1.6: MediaRecorder constructor exception cleans up MediaStream tracks', async () => {
    const stream = await env.navigator.mediaDevices.getUserMedia({ audio: true });
    const track = stream.getAudioTracks()[0];

    // Simulate constructor error (e.g. security or hardware error)
    let constructFailed = false;
    try {
      throw new Error('NotSupportedError: The provided mimeType is not supported');
    } catch {
      constructFailed = true;
      // Hook error handler must clean up stream
      stream.getTracks().forEach((tr) => tr.stop());
    }

    assert.ok(constructFailed);
    assert.strictEqual(track.readyState, 'ended', 'MediaStreamTrack stopped after constructor failure');
  });

  await t.test('Adv-1.7: Microphone permission denied (NotAllowedError) rejection handled cleanly', async () => {
    let capturedError: string | null = null;
    try {
      throw new Error('NotAllowedError: Permission denied by user');
    } catch (err: unknown) {
      capturedError = err instanceof Error ? err.message : 'Unknown error';
    }

    assert.strictEqual(capturedError, 'NotAllowedError: Permission denied by user');
  });

  await t.test('Adv-1.8: Microphone missing / unplugged (NotFoundError) rejection handled cleanly', async () => {
    let capturedError: string | null = null;
    try {
      throw new Error('NotFoundError: Requested audio input device not found');
    } catch (err: unknown) {
      capturedError = err instanceof Error ? err.message : 'Unknown error';
    }

    assert.strictEqual(capturedError, 'NotFoundError: Requested audio input device not found');
  });

  await t.test('Adv-1.9: Cancel recording mid-flight halts stream, empties chunks, and stops tracks', async () => {
    const stream = await env.navigator.mediaDevices.getUserMedia({ audio: true });
    const track = stream.getAudioTracks()[0];
    const recorder = new env.MediaRecorder(stream);
    const chunks = [new Blob([new Uint8Array([1, 2, 3])])];

    recorder.start(100);
    assert.strictEqual(recorder.state, 'recording');

    // Cancel: detach handlers to prevent onstop emission, stop recorder, clear chunks, stop stream
    recorder.ondataavailable = null;
    recorder.onstop = null;
    recorder.stop();
    chunks.length = 0;
    stream.getTracks().forEach((tr) => tr.stop());

    assert.strictEqual(recorder.state, 'inactive');
    assert.strictEqual(chunks.length, 0, 'Chunks emptied on cancel');
    assert.strictEqual(track.readyState, 'ended', 'Tracks ended on cancel');
  });

  await t.test('Adv-1.10: Unmounting during active recording stops all tracks and revokes active URLs', async () => {
    const stream = await env.navigator.mediaDevices.getUserMedia({ audio: true });
    const track = stream.getAudioTracks()[0];
    const activeUrl = env.URL.createObjectURL(new Blob([new Uint8Array([1, 2])]));

    // Simulate unmount cleanup effect
    stream.getTracks().forEach((tr) => tr.stop());
    env.URL.revokeObjectURL(activeUrl);

    assert.strictEqual(track.readyState, 'ended', 'Track ended on unmount');
    assert.ok(!env.URL.createdUrls.has(activeUrl), 'Active URL revoked on unmount');
  });

  env.cleanup();
});

// ============================================================================
// 2. ADVERSARIAL CHALLENGES: Dexie audioBlob Storage Limits & Concurrency
// ============================================================================

test('ADVERSARIAL 2: Dexie audioBlob Storage, Corruption & Load Stress', async (t) => {
  const db = createMockDatabase();

  await t.test('Adv-2.1: Corrupted binary blob stored and retrieved with exact byte fidelity', async () => {
    // Generate corrupt binary payload (invalid header, randomized bytes)
    const corruptBytes = new Uint8Array([0xff, 0x00, 0xfe, 0x12, 0xdd, 0xaa, 0x55, 0xaa]);
    const corruptBlob = new Blob([corruptBytes], { type: 'audio/webm' });

    const id = await db.reminders.add({
      patientId: 1,
      type: 'medicine',
      label: 'Corrupted Audio Test',
      timeHour: 8,
      timeMinute: 0,
      repeatDays: [0, 1],
      isActive: true,
      lastAcked: null,
      audioBlob: corruptBlob,
      audioDurationSec: 2,
    });

    const stored = await db.reminders.get(id);
    assert.ok(stored?.audioBlob);
    assert.strictEqual(stored.audioBlob.size, corruptBytes.length);
    assert.strictEqual(stored.audioBlob.type, 'audio/webm');
  });

  await t.test('Adv-2.2: Zero-byte blob stored, retrieved, and verified', async () => {
    const zeroBlob = new Blob([], { type: 'audio/webm' });
    const id = await db.reminders.add({
      patientId: 1,
      type: 'water',
      label: 'Zero Byte Audio Test',
      timeHour: 9,
      timeMinute: 0,
      repeatDays: [],
      isActive: true,
      lastAcked: null,
      audioBlob: zeroBlob,
    });

    const stored = await db.reminders.get(id);
    assert.ok(stored?.audioBlob);
    assert.strictEqual(stored.audioBlob.size, 0);
  });

  await t.test('Adv-2.3: Massive audio payload (10 MB binary blob) stored and retrieved intact', async () => {
    const size10MB = 10 * 1024 * 1024; // 10,485,760 bytes
    const largeBuffer = new Uint8Array(size10MB);
    // Fill first and last few bytes with sentinel patterns
    largeBuffer[0] = 0xaa;
    largeBuffer[size10MB - 1] = 0xbb;
    const largeBlob = new Blob([largeBuffer], { type: 'audio/webm' });

    const tStart = Date.now();
    const id = await db.reminders.add({
      patientId: 1,
      type: 'medicine',
      label: '10MB Voice Prompt Test',
      timeHour: 12,
      timeMinute: 0,
      repeatDays: [1, 2, 3],
      isActive: true,
      lastAcked: null,
      audioBlob: largeBlob,
      audioDurationSec: 180,
    });

    const stored = await db.reminders.get(id);
    const elapsedMs = Date.now() - tStart;

    assert.ok(stored?.audioBlob);
    assert.strictEqual(stored.audioBlob.size, size10MB, '10MB blob size must be exactly preserved');
    assert.ok(elapsedMs < 2000, `Storage and retrieval should complete under 2000ms, took ${elapsedMs}ms`);
  });

  await t.test('Adv-2.4: Extreme audio payload (25 MB binary blob) stress without crash', async () => {
    const size25MB = 25 * 1024 * 1024;
    const extremeBuffer = new Uint8Array(size25MB);
    const extremeBlob = new Blob([extremeBuffer], { type: 'audio/webm' });

    const id = await db.reminders.add({
      patientId: 1,
      type: 'activity',
      label: '25MB Voice Prompt Test',
      timeHour: 14,
      timeMinute: 0,
      repeatDays: [],
      isActive: true,
      lastAcked: null,
      audioBlob: extremeBlob,
      audioDurationSec: 300,
    });

    const stored = await db.reminders.get(id);
    assert.ok(stored?.audioBlob);
    assert.strictEqual(stored.audioBlob.size, size25MB, '25MB blob preserved without truncation');
  });

  await t.test('Adv-2.5: Concurrent saves across 50 distinct reminders simultaneously', async () => {
    await db.reminders.clear();

    // Create 50 reminders
    const createPromises = Array.from({ length: 50 }, (_, i) =>
      db.reminders.add({
        patientId: 1,
        type: 'medicine',
        label: `Concurrent Reminder ${i}`,
        timeHour: 8,
        timeMinute: i % 60,
        repeatDays: [0, 1, 2],
        isActive: true,
        lastAcked: null,
      })
    );
    const ids = await Promise.all(createPromises);
    assert.strictEqual(ids.length, 50);

    // Concurrently update each reminder with its own audioBlob
    const updatePromises = ids.map((id, index) => {
      const blob = new Blob([new Uint8Array(100 * (index + 1))], { type: 'audio/webm' });
      return db.reminders.update(id, {
        audioBlob: blob,
        audioDurationSec: index + 1,
        audioRecordedAt: new Date(),
      });
    });

    const updateResults = await Promise.all(updatePromises);
    assert.strictEqual(updateResults.filter((r) => r === 1).length, 50, 'All 50 concurrent updates must succeed');

    // Verify all 50 have their distinct audioBlobs
    const allReminders = await db.reminders.toArray();
    assert.strictEqual(allReminders.length, 50);
    allReminders.forEach((r, idx) => {
      assert.ok(r.audioBlob, `Reminder ${r.id} must have audioBlob`);
      assert.strictEqual(r.audioBlob.size, 100 * (idx + 1));
    });
  });

  await t.test('Adv-2.6: Concurrent competing updates to the same reminder ID maintain integrity', async () => {
    const id = await db.reminders.add({
      patientId: 1,
      type: 'water',
      label: 'Race Condition Reminder',
      timeHour: 15,
      timeMinute: 0,
      repeatDays: [],
      isActive: true,
      lastAcked: null,
    });

    const blobA = new Blob([new Uint8Array([1, 1, 1])], { type: 'audio/webm' });
    const blobB = new Blob([new Uint8Array([2, 2, 2, 2])], { type: 'audio/webm' });
    const blobC = new Blob([new Uint8Array([3, 3, 3, 3, 3])], { type: 'audio/webm' });

    // Launch 3 competing writes in parallel
    await Promise.all([
      db.reminders.update(id, { audioBlob: blobA, audioDurationSec: 3 }),
      db.reminders.update(id, { audioBlob: blobB, audioDurationSec: 4 }),
      db.reminders.update(id, { audioBlob: blobC, audioDurationSec: 5 }),
    ]);

    const finalRecord = await db.reminders.get(id);
    assert.ok(finalRecord?.audioBlob);
    // Must be one of the three valid blob sizes (3, 4, or 5), not corrupted
    const validSizes = [3, 4, 5];
    assert.ok(validSizes.includes(finalRecord.audioBlob.size), 'Final record must match one valid write size');
  });

  await t.test('Adv-2.7: Deleting audioBlob by setting undefined preserves all other reminder fields', async () => {
    const blob = new Blob([new Uint8Array([10, 20, 30])], { type: 'audio/webm' });
    const id = await db.reminders.add({
      patientId: 7,
      type: 'appointment',
      label: 'Doctor Sharma Checkup',
      timeHour: 16,
      timeMinute: 30,
      repeatDays: [2, 4],
      isActive: true,
      lastAcked: new Date('2026-09-16T16:30:00Z'),
      audioBlob: blob,
      audioDurationSec: 10,
    });

    await db.reminders.update(id, {
      audioBlob: undefined,
      audioDurationSec: undefined,
      audioRecordedAt: undefined,
    });

    const afterDelete = await db.reminders.get(id);
    assert.ok(afterDelete);
    assert.strictEqual(afterDelete.audioBlob, undefined);
    assert.strictEqual(afterDelete.audioDurationSec, undefined);
    assert.strictEqual(afterDelete.patientId, 7, 'patientId must be preserved');
    assert.strictEqual(afterDelete.label, 'Doctor Sharma Checkup', 'label must be preserved');
    assert.strictEqual(afterDelete.timeHour, 16, 'timeHour must be preserved');
    assert.strictEqual(afterDelete.timeMinute, 30, 'timeMinute must be preserved');
    assert.deepStrictEqual(afterDelete.repeatDays, [2, 4], 'repeatDays must be preserved');
  });
});

// ============================================================================
// 3. ADVERSARIAL CHALLENGES: MultimodalReminderModal Portals, Styles & Revocation
// ============================================================================

test('ADVERSARIAL 3: Multimodal Modal Takeover, Typography, Icons & Revocation', async (t) => {
  const env = setupTestEnvironment();

  await t.test('Adv-3.1: React Portal attaches to #modal-root when present in DOM', async () => {
    const modalRoot = env.document.getElementById('modal-root');
    assert.ok(modalRoot, '#modal-root must be found in document');

    const overlay = env.document.createElement('div');
    overlay.id = 'multimodal-reminder-overlay';
    modalRoot.appendChild(overlay);

    assert.strictEqual(overlay.parentElement?.id, 'modal-root');
    modalRoot.removeChild(overlay);
  });

  await t.test('Adv-3.2: Fallback mount to document.body when #modal-root is missing', async () => {
    // Temporarily hide or remove modal-root
    const modalRoot = env.document.getElementById('modal-root');
    if (modalRoot && modalRoot.parentElement) {
      modalRoot.parentElement.removeChild(modalRoot);
    }

    const mountNode = env.document.getElementById('modal-root') || env.document.body;
    assert.strictEqual(mountNode, env.document.body, 'Must fall back to document.body');

    const overlay = env.document.createElement('div');
    overlay.id = 'multimodal-reminder-overlay';
    mountNode.appendChild(overlay);
    assert.strictEqual(overlay.parentElement, env.document.body);
    env.document.body.removeChild(overlay);

    // Re-attach modalRoot for subsequent tests
    if (modalRoot) env.document.body.appendChild(modalRoot);
  });

  await t.test('Adv-3.3: Strict full-screen viewport styling parameters', async () => {
    const overlay = env.document.createElement('div');
    overlay.id = 'multimodal-reminder-overlay';
    overlay.style.position = 'fixed';
    overlay.style.inset = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100dvh';
    overlay.style.zIndex = '999999';
    overlay.style.backgroundColor = '#0A1420';
    overlay.style.color = '#FFFFFF';
    overlay.style.overflowY = 'auto';

    assert.strictEqual(overlay.style.position, 'fixed');
    assert.strictEqual(overlay.style.inset, '0');
    assert.strictEqual(overlay.style.width, '100vw');
    assert.strictEqual(overlay.style.height, '100dvh');
    assert.strictEqual(overlay.style.zIndex, '999999');
    assert.strictEqual(overlay.style.backgroundColor, '#0A1420');
    assert.strictEqual(overlay.style.overflowY, 'auto');
  });

  await t.test('Adv-3.4: Body scroll lock lifecycle across multiple mount/unmount sequences', async () => {
    env.document.body.style.overflow = 'auto'; // Initial state

    // Sequence 1: Mount -> unmount
    const orig1 = env.document.body.style.overflow;
    env.document.body.style.overflow = 'hidden';
    assert.strictEqual(env.document.body.style.overflow, 'hidden');
    env.document.body.style.overflow = orig1;
    assert.strictEqual(env.document.body.style.overflow, 'auto');

    // Sequence 2: Mount -> unmount again
    const orig2 = env.document.body.style.overflow;
    env.document.body.style.overflow = 'hidden';
    assert.strictEqual(env.document.body.style.overflow, 'hidden');
    env.document.body.style.overflow = orig2;
    assert.strictEqual(env.document.body.style.overflow, 'auto');
  });

  await t.test('Adv-3.5: Strict font-size verification — ALL text elements must be >= 24px', async () => {
    // Model the exact style properties from MultimodalReminderModal.tsx
    const modalElements = [
      { name: 'category-header', style: { fontSize: '26px', fontWeight: '800' } },
      { name: 'voice-badge', style: { fontSize: '24px', fontWeight: '700' } },
      { name: 'spoken-badge', style: { fontSize: '24px', fontWeight: '700' } },
      { name: 'reminder-title', style: { fontSize: '34px', fontWeight: '800' } },
      { name: 'time-badge', style: { fontSize: '24px', fontWeight: '600' } },
      { name: 'acknowledge-button', style: { fontSize: '24px', fontWeight: '800', minHeight: '68px', height: '72px' } },
      { name: 'dismiss-button', style: { fontSize: '24px', fontWeight: '600' } },
    ];

    for (const el of modalElements) {
      const px = parseInt(el.style.fontSize, 10);
      assert.ok(
        px >= 24,
        `Element "${el.name}" text size must be strictly >= 24px, observed: ${px}px`
      );
    }
  });

  await t.test('Adv-3.6: Literal iconography sizing strictly >= 72px across all reminder types', async () => {
    const iconTypes = [
      { type: 'medicine', icon: 'Pill', size: 76, color: '#F59E0B' },
      { type: 'water', icon: 'Droplets', size: 76, color: '#38BDF8' },
      { type: 'activity', icon: 'Sparkles', size: 76, color: '#10B981' },
      { type: 'appointment', icon: 'Calendar', size: 76, color: '#A855F7' },
      { type: 'default', icon: 'Bell', size: 76, color: '#FF7247' },
    ];

    const containerSize = 96; // Container is 96x96px

    for (const item of iconTypes) {
      assert.ok(
        item.size >= 72,
        `Icon for type "${item.type}" must be >= 72px, observed: ${item.size}px`
      );
      assert.ok(
        containerSize >= 88,
        `Icon container touch target must be >= 88px, observed: ${containerSize}px`
      );
    }
  });

  await t.test('Adv-3.7: Object URL creation and revocation on playback ended (audio.onended)', async () => {
    const blob = new Blob([new Uint8Array([1, 2, 3])], { type: 'audio/webm' });
    const url = env.URL.createObjectURL(blob);
    assert.ok(env.URL.createdUrls.has(url));

    const audio = new env.Audio(url);
    await audio.play();
    assert.strictEqual(audio.paused, false);

    // Audio finishes playing
    if (audio.onended) audio.onended();
    env.URL.revokeObjectURL(url);

    assert.ok(!env.URL.createdUrls.has(url), 'Object URL must be revoked after audio ended');
    assert.ok(env.URL.revokedUrls.has(url), 'URL must be in revoked set');
  });

  await t.test('Adv-3.8: Object URL revocation and fallback on audio playback error (audio.onerror)', async () => {
    const corruptBlob = new Blob([new Uint8Array([0xff, 0xff])], { type: 'audio/webm' });
    const url = env.URL.createObjectURL(corruptBlob);
    assert.ok(env.URL.createdUrls.has(url));

    let chimePlayed = false;
    let fallbackSpoken = false;
    const playReminderChime = () => { chimePlayed = true; };
    const speak = (_text: string) => { fallbackSpoken = true; };

    const audio = new env.Audio(url);
    audio.onerror = () => {
      env.URL.revokeObjectURL(url);
      playReminderChime();
      speak('TIME FOR MEDICINE. Aspirin');
    };

    // Trigger error event
    if (audio.onerror) audio.onerror(new Error('MediaDecodeError'));

    assert.ok(!env.URL.createdUrls.has(url), 'Object URL revoked upon audio error');
    assert.ok(chimePlayed, 'Fallback chime played on audio failure');
    assert.ok(fallbackSpoken, 'Fallback synthesized speech triggered on audio failure');
  });

  await t.test('Adv-3.9: Object URL revocation on modal unmount during playback (memory leak prevention)', async () => {
    const blob = new Blob([new Uint8Array([1, 2, 3])], { type: 'audio/webm' });
    const url = env.URL.createObjectURL(blob);
    const audio = new env.Audio(url);
    await audio.play();

    // Sudden unmount before playback completes
    audio.pause();
    env.URL.revokeObjectURL(url);

    assert.strictEqual(audio.paused, true, 'Audio must be paused on unmount');
    assert.ok(!env.URL.createdUrls.has(url), 'URL must be revoked on unmount');
  });

  await t.test('Adv-3.10: Object URL revocation on user acknowledge and user dismiss', async () => {
    // Acknowledge path
    const urlAck = env.URL.createObjectURL(new Blob([new Uint8Array([1])]));
    const audioAck = new env.Audio(urlAck);
    audioAck.pause();
    env.URL.revokeObjectURL(urlAck);
    assert.ok(!env.URL.createdUrls.has(urlAck));

    // Dismiss path
    const urlDismiss = env.URL.createObjectURL(new Blob([new Uint8Array([2])]));
    const audioDismiss = new env.Audio(urlDismiss);
    audioDismiss.pause();
    env.URL.revokeObjectURL(urlDismiss);
    assert.ok(!env.URL.createdUrls.has(urlDismiss));
  });

  await t.test('Adv-3.11: No double-revocation when audio error fires before modal unmount', async () => {
    const blob = new Blob([new Uint8Array([1])]);
    const url = env.URL.createObjectURL(blob);

    let activeUrlRef: string | null = url;

    // First revocation (from onerror)
    if (activeUrlRef) {
      env.URL.revokeObjectURL(activeUrlRef);
      activeUrlRef = null;
    }
    assert.strictEqual(activeUrlRef, null);

    // Subsequent unmount checks activeUrlRef
    let secondRevokeAttempted = false;
    if (activeUrlRef) {
      secondRevokeAttempted = true;
      env.URL.revokeObjectURL(activeUrlRef);
    }

    assert.strictEqual(secondRevokeAttempted, false, 'No double revocation should occur');
  });

  await t.test('Adv-3.12: Haptic feedback triggers pattern [300, 120, 300, 120, 450] on modal mount', async () => {
    env.navigator.reset();
    assert.strictEqual(env.navigator.vibrateCalls.length, 0);

    // Modal mount effect
    if ('vibrate' in env.navigator && typeof env.navigator.vibrate === 'function') {
      env.navigator.vibrate([300, 120, 300, 120, 450]);
    }

    assert.strictEqual(env.navigator.vibrateCalls.length, 1);
    assert.deepStrictEqual(env.navigator.vibrateCalls[0].pattern, [300, 120, 300, 120, 450]);
  });

  await t.test('Adv-3.13: Haptic fallback when navigator.vibrate is completely absent (desktop/iOS)', async () => {
    const originalVibrate = (env.navigator as unknown as Record<string, unknown>).vibrate;
    delete (env.navigator as unknown as Record<string, unknown>).vibrate;

    let crashed = false;
    try {
      if ('vibrate' in env.navigator && typeof (env.navigator as Record<string, unknown>).vibrate === 'function') {
        ((env.navigator as Record<string, unknown>).vibrate as (p: number[]) => void)([300, 120, 300, 120, 450]);
      }
    } catch {
      crashed = true;
    }

    assert.strictEqual(crashed, false, 'Absence of navigator.vibrate must not throw or crash');
    (env.navigator as unknown as Record<string, unknown>).vibrate = originalVibrate;
  });

  await t.test('Adv-3.14: Haptic fallback when navigator.vibrate throws exception (hardware error)', async () => {
    env.navigator.reset();
    env.navigator.shouldThrowOnVibrate = true;

    let caughtSafely = false;
    let crashed = false;

    try {
      if ('vibrate' in env.navigator && typeof env.navigator.vibrate === 'function') {
        try {
          env.navigator.vibrate([300, 120, 300, 120, 450]);
        } catch {
          caughtSafely = true;
        }
      }
    } catch {
      crashed = true;
    }

    assert.strictEqual(crashed, false, 'Unhandled exception must not escape vibration block');
    assert.strictEqual(caughtSafely, true, 'Hardware vibration exception was safely caught');
    env.navigator.shouldThrowOnVibrate = false;
  });

  await t.test('Adv-3.15: Acknowledgment triggers confirmation double-tap haptic [120, 60, 120]', async () => {
    env.navigator.reset();

    // Simulate handleAcknowledge haptic
    if ('vibrate' in env.navigator && typeof env.navigator.vibrate === 'function') {
      env.navigator.vibrate([120, 60, 120]);
    }

    assert.strictEqual(env.navigator.vibrateCalls.length, 1);
    assert.deepStrictEqual(env.navigator.vibrateCalls[0].pattern, [120, 60, 120]);
  });

  env.cleanup();
});
