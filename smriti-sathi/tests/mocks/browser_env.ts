/**
 * Browser Environment Mock for Smriti Sathi E2E Testing
 * Provides high-fidelity simulation of DOM, Navigator (Vibration),
 * MediaDevices, MediaRecorder, Audio, and Object URLs in Node.js.
 */

export interface MockVibrateCall {
  pattern: number | number[];
  timestamp: number;
}

export class MockDOMTokenList {
  private classes = new Set<string>();

  constructor(initial: string = '') {
    if (initial) {
      initial.split(/\s+/).filter(Boolean).forEach((c) => this.classes.add(c));
    }
  }

  add(...tokens: string[]) {
    tokens.forEach((t) => this.classes.add(t));
  }

  remove(...tokens: string[]) {
    tokens.forEach((t) => this.classes.delete(t));
  }

  contains(token: string): boolean {
    return this.classes.has(token);
  }

  toggle(token: string, force?: boolean): boolean {
    if (force !== undefined) {
      if (force) this.classes.add(token);
      else this.classes.delete(token);
      return force;
    }
    if (this.classes.has(token)) {
      this.classes.delete(token);
      return false;
    }
    this.classes.add(token);
    return true;
  }

  toString(): string {
    return Array.from(this.classes).join(' ');
  }
}

export class MockElement {
  tagName: string;
  id: string = '';
  style: Record<string, string> = {};
  attributes = new Map<string, string>();
  children: MockElement[] = [];
  parentElement: MockElement | null = null;
  textContent: string = '';
  disabled: boolean = false;
  classList: MockDOMTokenList;
  eventListeners: Record<string, Array<(event: unknown) => void>> = {};

  constructor(tagName: string) {
    this.tagName = tagName.toUpperCase();
    this.classList = new MockDOMTokenList();
  }

  get className(): string {
    return this.classList.toString();
  }

  set className(val: string) {
    this.classList = new MockDOMTokenList(val);
  }

  setAttribute(name: string, value: string) {
    this.attributes.set(name, value);
    if (name === 'id') this.id = value;
    if (name === 'class') this.className = value;
    if (name === 'disabled') this.disabled = true;
  }

  getAttribute(name: string): string | null {
    if (name === 'id') return this.id || null;
    if (name === 'class') return this.className || null;
    if (name === 'disabled') return this.disabled ? '' : null;
    return this.attributes.get(name) || null;
  }

  removeAttribute(name: string) {
    this.attributes.delete(name);
    if (name === 'id') this.id = '';
    if (name === 'class') this.className = '';
    if (name === 'disabled') this.disabled = false;
  }

  hasAttribute(name: string): boolean {
    return this.attributes.has(name) || (name === 'disabled' && this.disabled);
  }

  appendChild<T extends MockElement>(child: T): T {
    child.parentElement = this;
    this.children.push(child);
    return child;
  }

  removeChild<T extends MockElement>(child: T): T {
    const idx = this.children.indexOf(child);
    if (idx !== -1) {
      this.children.splice(idx, 1);
      child.parentElement = null;
    }
    return child;
  }

  addEventListener(type: string, listener: (event: unknown) => void) {
    if (!this.eventListeners[type]) this.eventListeners[type] = [];
    this.eventListeners[type].push(listener);
  }

  removeEventListener(type: string, listener: (event: unknown) => void) {
    if (!this.eventListeners[type]) return;
    this.eventListeners[type] = this.eventListeners[type].filter((l) => l !== listener);
  }

  dispatchEvent(event: { type: string }): boolean {
    const listeners = this.eventListeners[event.type] || [];
    for (const listener of listeners) {
      listener(event);
    }
    return true;
  }

  click() {
    if (this.disabled || this.style.pointerEvents === 'none') {
      return;
    }
    this.dispatchEvent({ type: 'click' });
  }

  querySelector(selector: string): MockElement | null {
    for (const child of this.children) {
      if (matchesSelector(child, selector)) return child;
      const found = child.querySelector(selector);
      if (found) return found;
    }
    return null;
  }

  querySelectorAll(selector: string): MockElement[] {
    const results: MockElement[] = [];
    for (const child of this.children) {
      if (matchesSelector(child, selector)) results.push(child);
      results.push(...child.querySelectorAll(selector));
    }
    return results;
  }

  getBoundingClientRect(): { width: number; height: number; top: number; left: number; right: number; bottom: number } {
    const width = parseFloat(this.style.width || '100') || 100;
    const height = parseFloat(this.style.height || '68') || 68;
    return { width, height, top: 0, left: 0, right: width, bottom: height };
  }
}

function matchesSelector(el: MockElement, selector: string): boolean {
  if (selector.startsWith('#')) {
    return el.id === selector.slice(1);
  }
  if (selector.startsWith('.')) {
    return el.classList.contains(selector.slice(1));
  }
  if (selector.startsWith('[') && selector.endsWith(']')) {
    const attr = selector.slice(1, -1);
    if (attr.includes('=')) {
      const [k, v] = attr.split('=').map((s) => s.replace(/['"]/g, '').trim());
      return el.getAttribute(k) === v;
    }
    return el.hasAttribute(attr);
  }
  return el.tagName.toLowerCase() === selector.toLowerCase();
}

export class MockDocument {
  body: MockElement;
  head: MockElement;
  documentElement: MockElement;
  private elementsById = new Map<string, MockElement>();

  constructor() {
    this.documentElement = new MockElement('html');
    this.head = new MockElement('head');
    this.body = new MockElement('body');
    this.documentElement.appendChild(this.head);
    this.documentElement.appendChild(this.body);

    // Standard root elements
    const root = new MockElement('div');
    root.id = 'root';
    this.body.appendChild(root);

    const modalRoot = new MockElement('div');
    modalRoot.id = 'modal-root';
    this.body.appendChild(modalRoot);
  }

  createElement(tagName: string): MockElement {
    return new MockElement(tagName);
  }

  getElementById(id: string): MockElement | null {
    return this.body.querySelector(`#${id}`) || (this.body.id === id ? this.body : null);
  }

  querySelector(selector: string): MockElement | null {
    return this.body.querySelector(selector);
  }

  querySelectorAll(selector: string): MockElement[] {
    return this.body.querySelectorAll(selector);
  }

  addEventListener(type: string, listener: (event: unknown) => void) {
    this.body.addEventListener(type, listener);
  }

  removeEventListener(type: string, listener: (event: unknown) => void) {
    this.body.removeEventListener(type, listener);
  }

  dispatchEvent(event: { type: string }): boolean {
    return this.body.dispatchEvent(event);
  }
}

export class MockMediaStreamTrack {
  kind: string = 'audio';
  enabled: boolean = true;
  readyState: 'live' | 'ended' = 'live';

  stop() {
    this.readyState = 'ended';
  }
}

export class MockMediaStream {
  private tracks: MockMediaStreamTrack[] = [new MockMediaStreamTrack()];

  getTracks(): MockMediaStreamTrack[] {
    return this.tracks;
  }

  getAudioTracks(): MockMediaStreamTrack[] {
    return this.tracks.filter((t) => t.kind === 'audio');
  }
}

export class MockMediaRecorder {
  state: 'inactive' | 'recording' | 'paused' = 'inactive';
  stream: MockMediaStream;
  mimeType: string;
  ondataavailable: ((event: { data: Blob }) => void) | null = null;
  onstop: (() => void) | null = null;
  onerror: ((event: { error: Error }) => void) | null = null;
  private timer: NodeJS.Timeout | null = null;

  static supportedTypes = new Set([
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/mp4',
    'audio/aac',
    'audio/ogg;codecs=opus',
  ]);

  static isTypeSupported(type: string): boolean {
    return MockMediaRecorder.supportedTypes.has(type);
  }

  constructor(stream: MockMediaStream, options?: { mimeType?: string }) {
    this.stream = stream;
    this.mimeType = options?.mimeType || 'audio/webm;codecs=opus';
  }

  start(timeslice?: number) {
    if (this.state !== 'inactive') {
      throw new Error(`Cannot start MediaRecorder in state: ${this.state}`);
    }
    this.state = 'recording';

    // Emit initial chunk
    if (this.ondataavailable) {
      const chunk = new Blob([new Uint8Array([1, 2, 3, 4])], { type: this.mimeType });
      this.ondataavailable({ data: chunk });
    }

    if (timeslice && timeslice > 0) {
      this.timer = setInterval(() => {
        if (this.state === 'recording' && this.ondataavailable) {
          const chunk = new Blob([new Uint8Array([5, 6, 7, 8])], { type: this.mimeType });
          this.ondataavailable({ data: chunk });
        }
      }, timeslice);
    }
  }

  pause() {
    if (this.state === 'recording') {
      this.state = 'paused';
    }
  }

  resume() {
    if (this.state === 'paused') {
      this.state = 'recording';
    }
  }

  stop() {
    if (this.state === 'inactive') return;
    this.state = 'inactive';
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    if (this.ondataavailable) {
      const finalChunk = new Blob([new Uint8Array([9, 10])], { type: this.mimeType });
      this.ondataavailable({ data: finalChunk });
    }
    if (this.onstop) {
      this.onstop();
    }
  }
}

export class MockAudio {
  src: string;
  paused: boolean = true;
  currentTime: number = 0;
  duration: number = 5.0;
  volume: number = 1.0;
  playCount: number = 0;
  pauseCount: number = 0;
  shouldRejectPlay: boolean = false;
  rejectionError: Error = new Error('NotAllowedError: play() failed because user did not interact first.');
  onended: (() => void) | null = null;
  onplay: (() => void) | null = null;
  onpause: (() => void) | null = null;
  onerror: ((err: unknown) => void) | null = null;

  constructor(src: string = '') {
    this.src = src;
    MockAudio.instances.push(this);
  }

  static instances: MockAudio[] = [];

  static resetInstances() {
    MockAudio.instances = [];
  }

  play(): Promise<void> {
    this.playCount++;
    if (this.shouldRejectPlay) {
      if (this.onerror) this.onerror(this.rejectionError);
      return Promise.reject(this.rejectionError);
    }
    this.paused = false;
    if (this.onplay) this.onplay();
    return Promise.resolve();
  }

  pause() {
    this.pauseCount++;
    this.paused = true;
    if (this.onpause) this.onpause();
  }

  load() {
    this.currentTime = 0;
  }
}

export class MockURL {
  static createdUrls = new Set<string>();
  static revokedUrls = new Set<string>();
  private static counter = 0;

  static createObjectURL(blob: Blob): string {
    MockURL.counter++;
    const url = `blob:http://localhost/mock-audio-${MockURL.counter}-${blob.type || 'audio'}`;
    MockURL.createdUrls.add(url);
    return url;
  }

  static revokeObjectURL(url: string) {
    MockURL.createdUrls.delete(url);
    MockURL.revokedUrls.add(url);
  }

  static reset() {
    MockURL.createdUrls.clear();
    MockURL.revokedUrls.clear();
    MockURL.counter = 0;
  }
}

export class MockNavigator {
  vibrateCalls: MockVibrateCall[] = [];
  vibrateSupported: boolean = true;
  shouldThrowOnVibrate: boolean = false;

  vibrate(pattern: number | number[]): boolean {
    if (!this.vibrateSupported) {
      throw new TypeError('navigator.vibrate is not supported');
    }
    if (this.shouldThrowOnVibrate) {
      throw new Error('Hardware haptics failure');
    }
    this.vibrateCalls.push({ pattern, timestamp: Date.now() });
    return true;
  }

  mediaDevices = {
    getUserMedia: async (constraints: { audio: unknown }) => {
      if (!constraints.audio) {
        throw new Error('Audio constraint must be requested');
      }
      return new MockMediaStream();
    },
  };

  reset() {
    this.vibrateCalls = [];
    this.vibrateSupported = true;
    this.shouldThrowOnVibrate = false;
  }
}

export interface TestEnvironment {
  document: MockDocument;
  navigator: MockNavigator;
  URL: typeof MockURL;
  Audio: typeof MockAudio;
  MediaRecorder: typeof MockMediaRecorder;
  cleanup: () => void;
}

export function setupTestEnvironment(): TestEnvironment {
  const doc = new MockDocument();
  const nav = new MockNavigator();

  const originalDocDesc = Object.getOwnPropertyDescriptor(globalThis, 'document');
  const originalNavDesc = Object.getOwnPropertyDescriptor(globalThis, 'navigator');
  const originalAudioDesc = Object.getOwnPropertyDescriptor(globalThis, 'Audio');
  const originalURLDesc = Object.getOwnPropertyDescriptor(globalThis, 'URL');
  const originalMediaRecorderDesc = Object.getOwnPropertyDescriptor(globalThis, 'MediaRecorder');

  MockURL.reset();
  MockAudio.resetInstances();
  nav.reset();

  Object.defineProperty(globalThis, 'document', { value: doc, configurable: true, writable: true });
  Object.defineProperty(globalThis, 'navigator', { value: nav, configurable: true, writable: true });
  Object.defineProperty(globalThis, 'Audio', { value: MockAudio, configurable: true, writable: true });
  Object.defineProperty(globalThis, 'URL', { value: MockURL, configurable: true, writable: true });
  Object.defineProperty(globalThis, 'MediaRecorder', { value: MockMediaRecorder, configurable: true, writable: true });

  return {
    document: doc,
    navigator: nav,
    URL: MockURL,
    Audio: MockAudio,
    MediaRecorder: MockMediaRecorder,
    cleanup: () => {
      if (originalDocDesc) Object.defineProperty(globalThis, 'document', originalDocDesc);
      else delete (globalThis as Record<string, unknown>).document;

      if (originalNavDesc) Object.defineProperty(globalThis, 'navigator', originalNavDesc);
      else delete (globalThis as Record<string, unknown>).navigator;

      if (originalAudioDesc) Object.defineProperty(globalThis, 'Audio', originalAudioDesc);
      else delete (globalThis as Record<string, unknown>).Audio;

      if (originalURLDesc) Object.defineProperty(globalThis, 'URL', originalURLDesc);
      else delete (globalThis as Record<string, unknown>).URL;

      if (originalMediaRecorderDesc) Object.defineProperty(globalThis, 'MediaRecorder', originalMediaRecorderDesc);
      else delete (globalThis as Record<string, unknown>).MediaRecorder;
    },
  };
}
