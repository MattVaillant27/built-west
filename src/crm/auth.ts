// CRM authentication: scrypt password + TOTP code, HMAC-signed session cookie, CSRF tokens,
// and a global lockout after repeated failures. Secrets come from Netlify env vars (see scripts/crm-setup.mjs).
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import type { AstroCookies } from 'astro';
import * as OTPAuth from 'otpauth';
import { store } from './store';

export const SESSION_COOKIE = 'bw_crm';
const SESSION_DAYS = 30;
const MAX_FAILURES = 5;
const LOCK_MINUTES = 15;

const env = (k: string) => {
  const v = process.env[k];
  if (!v) throw new Error(`Missing environment variable ${k}`);
  return v;
};

export const configured = () =>
  ['CRM_PASSWORD_HASH', 'CRM_TOTP_SECRET', 'CRM_SESSION_SECRET', 'CRM_CALENDAR_TOKEN'].every((k) => !!process.env[k]);

const safeEqual = (a: string, b: string) => {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
};

const hmac = (data: string) => createHmac('sha256', env('CRM_SESSION_SECRET')).update(data).digest('base64url');

/* ---------- Password + TOTP ---------- */

/** Format: scrypt:<salt hex>:<hash hex> (N=16384, r=8, p=1, 64-byte key). */
export function hashPassword(password: string) {
  const salt = randomBytes(16);
  return `scrypt:${salt.toString('hex')}:${scryptSync(password, salt, 64).toString('hex')}`;
}

function checkPassword(password: string) {
  const [scheme, saltHex, hashHex] = env('CRM_PASSWORD_HASH').split(':');
  if (scheme !== 'scrypt' || !saltHex || !hashHex) return false;
  const got = scryptSync(password, Buffer.from(saltHex, 'hex'), 64);
  const want = Buffer.from(hashHex, 'hex');
  return got.length === want.length && timingSafeEqual(got, want);
}

const totp = () =>
  new OTPAuth.TOTP({ issuer: 'Built West', label: 'CRM', digits: 6, period: 30, secret: OTPAuth.Secret.fromBase32(env('CRM_TOTP_SECRET')) });

/* ---------- Lockout ---------- */

interface Throttle { failures: number; lockedUntil?: number; lastCounter?: number }
const THROTTLE_KEY = 'meta/login';
const readThrottle = async () => ((await store().get(THROTTLE_KEY, { type: 'json' })) as Throttle | null) ?? { failures: 0 };

export async function lockedFor(): Promise<number> {
  const t = await readThrottle();
  return t.lockedUntil && t.lockedUntil > Date.now() ? Math.ceil((t.lockedUntil - Date.now()) / 60000) : 0;
}

/** Returns true when both factors are valid. Counts failures and locks the login after too many. */
export async function attemptLogin(password: string, code: string): Promise<boolean> {
  const t = await readThrottle();
  const counter = totp().validate({ token: code.replace(/\s/g, ''), window: 1 });
  const currentCounter = counter === null ? null : Math.floor(Date.now() / 30000) + counter;
  const replay = currentCounter !== null && t.lastCounter !== undefined && currentCounter <= t.lastCounter;
  const ok = checkPassword(password) && currentCounter !== null && !replay;
  if (ok) {
    await store().setJSON(THROTTLE_KEY, { failures: 0, lastCounter: currentCounter } satisfies Throttle);
  } else {
    const failures = t.failures + 1;
    await store().setJSON(THROTTLE_KEY, {
      ...t,
      failures: failures >= MAX_FAILURES ? 0 : failures,
      lockedUntil: failures >= MAX_FAILURES ? Date.now() + LOCK_MINUTES * 60000 : t.lockedUntil,
    } satisfies Throttle);
  }
  return ok;
}

/* ---------- Session ---------- */

interface Session { sid: string; exp: number }

export function startSession(cookies: AstroCookies, secure: boolean) {
  const session: Session = { sid: randomBytes(18).toString('base64url'), exp: Date.now() + SESSION_DAYS * 86400000 };
  const payload = Buffer.from(JSON.stringify(session)).toString('base64url');
  cookies.set(SESSION_COOKIE, `${payload}.${hmac(payload)}`, {
    httpOnly: true,
    secure,
    sameSite: 'strict',
    path: '/crm',
    maxAge: SESSION_DAYS * 86400,
  });
}

export function readSession(cookies: AstroCookies): Session | null {
  const raw = cookies.get(SESSION_COOKIE)?.value;
  if (!raw || !process.env.CRM_SESSION_SECRET) return null;
  const [payload, sig] = raw.split('.');
  if (!payload || !sig || !safeEqual(sig, hmac(payload))) return null;
  try {
    const s = JSON.parse(Buffer.from(payload, 'base64url').toString()) as Session;
    return s.exp > Date.now() ? s : null;
  } catch {
    return null;
  }
}

export const endSession = (cookies: AstroCookies) => cookies.delete(SESSION_COOKIE, { path: '/crm' });

/* ---------- CSRF ---------- */

/** Per-session token for authenticated forms. */
export const csrfToken = (s: Session) => hmac(`csrf:${s.sid}`);

export const checkCsrf = (s: Session, token: FormDataEntryValue | null) =>
  typeof token === 'string' && safeEqual(token, csrfToken(s));

/** API token check for /crm/api (used by Claude chats to add contacts). */
export const apiTokenOk = (token: string) => !!process.env.CRM_API_TOKEN && token.length > 0 && safeEqual(token, env('CRM_API_TOKEN'));

/** Calendar feed token check (the feed URL can't carry a cookie). */
export const calendarTokenOk = (token: string) => !!process.env.CRM_CALENDAR_TOKEN && safeEqual(token, env('CRM_CALENDAR_TOKEN'));
