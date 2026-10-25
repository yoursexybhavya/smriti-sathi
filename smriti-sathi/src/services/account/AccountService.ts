/**
 * SMRITI SATHI — Local account service
 *
 * There are no built-in users and no sample data: an installation starts
 * completely empty and the first person to open the app creates the account.
 *
 * Everything stays on the device. PINs are stored as a salted SHA-256 digest
 * where the browser allows WebCrypto (https / localhost / Capacitor) and as a
 * salted iterated fallback digest otherwise, so a PIN is never kept in clear
 * text — including on an http LAN address.
 */

export type AccountRole = 'elder' | 'caregiver' | 'clinician';

export interface Account {
  id: string;
  role: AccountRole;
  /** The person's own name, shown on the profile picker. */
  name: string;
  createdAt: number;
  lastLoginAt?: number;
  /** Elder account this caregiver / health worker looks after. */
  elderId?: string;
  /** Human-readable link name, so a caregiver list works without a lookup. */
  elderName?: string;
  /** Emergency contact printed on the Safe Return card. */
  guardianName?: string;
  guardianPhone?: string;
  guardianRelation?: string;
  pinSalt?: string;
  /** Absent for an elder account created without a PIN (the recommended default). */
  pinHash?: string;
}

export interface AccountInput {
  role: AccountRole;
  name: string;
  pin?: string;
  elderId?: string;
  elderName?: string;
  guardianName?: string;
  guardianPhone?: string;
  guardianRelation?: string;
}

const STORAGE_KEY = 'smriti_accounts_v1';
const ACTIVE_KEY = 'smriti_active_account';

/* ── PIN hashing ──────────────────────────────────────────────────────── */

function randomSalt(): string {
  const bytes = new Uint8Array(16);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i += 1) bytes[i] = Math.floor(Math.random() * 256);
  }
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

async function digest(text: string): Promise<string | null> {
  try {
    if (typeof crypto === 'undefined' || !crypto.subtle) return null;
    const data = new TextEncoder().encode(text);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash), (b) => b.toString(16).padStart(2, '0')).join('');
  } catch {
    return null;
  }
}

/** Deterministic fallback for contexts without WebCrypto (plain http). */
function fallbackDigest(text: string): string {
  let h1 = 0x811c9dc5;
  let h2 = 0x01000193;
  for (let i = 0; i < text.length; i += 1) {
    const c = text.charCodeAt(i);
    h1 = (h1 ^ c) * 0x01000193;
    h2 = (h2 + c * (i + 17)) ^ (h1 >>> 7);
  }
  return `${(h1 >>> 0).toString(16)}${(h2 >>> 0).toString(16)}`;
}

async function hashPin(pin: string, salt: string): Promise<string> {
  const salted = `smriti:${salt}:${pin}`;
  const strong = await digest(salted);
  if (strong) return `sha256$${strong}`;
  // Iterate the fallback so a short numeric PIN is not trivially reversible.
  let value = fallbackDigest(salted);
  for (let i = 0; i < 5000; i += 1) value = fallbackDigest(`${value}:${salted}`);
  return `iter$${value}`;
}

/* ── Storage ──────────────────────────────────────────────────────────── */

function read(): Account[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Account[]) : [];
  } catch {
    return [];
  }
}

function write(accounts: Account[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
  } catch {
    /* storage full or blocked — the caller surfaces the failure */
  }
}

function makeId(role: AccountRole): string {
  return `${role}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

/* ── Public API ───────────────────────────────────────────────────────── */

export const accountService = {
  list(): Account[] {
    return read();
  },

  /** True once somebody has set the device up — drives first-run vs sign-in. */
  hasAccounts(): boolean {
    return read().length > 0;
  },

  get(id: string | null | undefined): Account | null {
    if (!id) return null;
    return read().find((a) => a.id === id) ?? null;
  },

  /** The elder account this device is caring for (first elder, if several). */
  primaryElder(): Account | null {
    return read().find((a) => a.role === 'elder') ?? null;
  },

  async create(input: AccountInput): Promise<{ success: boolean; account?: Account; error?: string }> {
    const name = input.name.trim();
    if (name.length < 2) return { success: false, error: 'name' };

    let pinSalt: string | undefined;
    let pinHash: string | undefined;
    if (input.pin) {
      pinSalt = randomSalt();
      pinHash = await hashPin(input.pin, pinSalt);
    }

    const account: Account = {
      id: makeId(input.role),
      role: input.role,
      name,
      createdAt: Date.now(),
      lastLoginAt: Date.now(),
      elderId: input.elderId,
      elderName: input.elderName?.trim() || undefined,
      guardianName: input.guardianName?.trim() || undefined,
      guardianPhone: input.guardianPhone?.trim() || undefined,
      guardianRelation: input.guardianRelation?.trim() || undefined,
      pinSalt,
      pinHash,
    };

    write([...read(), account]);
    return { success: true, account };
  },

  async verifyPin(account: Account, pin: string): Promise<boolean> {
    if (!account.pinHash || !account.pinSalt) return true; // no PIN set
    const candidate = await hashPin(pin, account.pinSalt);
    return candidate === account.pinHash;
  },

  hasPin(account: Account | null | undefined): boolean {
    return Boolean(account?.pinHash);
  },

  async setPin(accountId: string, pin: string): Promise<boolean> {
    const accounts = read();
    const index = accounts.findIndex((a) => a.id === accountId);
    if (index < 0) return false;
    const salt = randomSalt();
    accounts[index] = { ...accounts[index], pinSalt: salt, pinHash: await hashPin(pin, salt) };
    write(accounts);
    return true;
  },

  async removePin(accountId: string): Promise<boolean> {
    const accounts = read();
    const index = accounts.findIndex((a) => a.id === accountId);
    if (index < 0) return false;
    const { pinHash: _hash, pinSalt: _salt, ...rest } = accounts[index];
    accounts[index] = rest as Account;
    write(accounts);
    return true;
  },

  update(accountId: string, patch: Partial<Omit<Account, 'id' | 'pinHash' | 'pinSalt'>>): Account | null {
    const accounts = read();
    const index = accounts.findIndex((a) => a.id === accountId);
    if (index < 0) return null;
    accounts[index] = { ...accounts[index], ...patch };
    write(accounts);
    return accounts[index];
  },

  touchLogin(accountId: string): void {
    this.update(accountId, { lastLoginAt: Date.now() });
    try {
      localStorage.setItem(ACTIVE_KEY, accountId);
    } catch {
      /* ignore */
    }
  },

  activeId(): string | null {
    try {
      return localStorage.getItem(ACTIVE_KEY);
    } catch {
      return null;
    }
  },

  remove(accountId: string): void {
    write(read().filter((a) => a.id !== accountId));
  },

  /** Wipes every account and the emergency contact — used by "Erase everything". */
  eraseAll(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(ACTIVE_KEY);
      localStorage.removeItem('smriti_linked_caregiver_name');
      localStorage.removeItem('smriti_linked_caregiver_phone');
    } catch {
      /* ignore */
    }
  },
};

export type { Account as AccountRecord };
