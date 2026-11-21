export const SESSION_COOKIE_NAME = "yuval_session";
const DEFAULT_SESSION_TTL_SECONDS = 60 * 60 * 24 * 14; // 14 days
const MIN_SESSION_SECRET_LENGTH = 32;

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET?.trim() ?? "";
  if (secret.length < MIN_SESSION_SECRET_LENGTH) {
    throw new Error("SESSION_SECRET must be set and at least 32 characters long.");
  }
  return secret;
}

function getAppPassword(): string {
  const password = process.env.APP_PASSWORD ?? "";
  if (!password) {
    throw new Error("APP_PASSWORD environment variable is required.");
  }
  return password;
}

function getCronSecret(): string {
  const secret = process.env.CRON_SECRET?.trim() ?? "";
  if (!secret) {
    throw new Error("CRON_SECRET environment variable is required.");
  }
  return secret;
}

/**
 * Constant-time string comparison safe for Edge and Node runtimes.
 */
export function constantTimeEqual(a: string, b: string): boolean {
  const enc = new TextEncoder();
  const aBytes = enc.encode(a);
  const bBytes = enc.encode(b);
  const maxLen = Math.max(aBytes.length, bBytes.length);
  let diff = aBytes.length ^ bBytes.length;
  for (let i = 0; i < maxLen; i += 1) {
    const x = i < aBytes.length ? aBytes[i] : 0;
    const y = i < bBytes.length ? bBytes[i] : 0;
    diff |= x ^ y;
  }
  return diff === 0;
}

async function importHmacKey(secret: string, usage: KeyUsage[]): Promise<CryptoKey> {
  const keyBytes = new TextEncoder().encode(secret);
  return crypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: "HMAC", hash: "SHA-256" },
    false,
    usage
  );
}

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function fromHex(hex: string): Uint8Array | null {
  if (!/^[0-9a-fA-F]+$/.test(hex) || hex.length % 2 !== 0) {
    return null;
  }
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i += 1) {
    out[i] = Number.parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

/**
 * Verify the submitted password against APP_PASSWORD using constant-time comparison.
 */
export function verifyPassword(candidate: string): boolean {
  if (!candidate) {
    return false;
  }
  const expected = getAppPassword();
  return constantTimeEqual(candidate, expected);
}

/**
 * Create an HMAC-SHA256 signed session token valid for `ttlSeconds`.
 */
export async function createSessionToken(
  ttlSeconds = DEFAULT_SESSION_TTL_SECONDS
): Promise<string> {
  const secret = getSessionSecret();
  const expiresAt = Math.floor(Date.now() / 1000) + ttlSeconds;
  const nonceBytes = crypto.getRandomValues(new Uint8Array(16));
  const nonce = toHex(nonceBytes.buffer);
  const payload = `${expiresAt}.${nonce}`;

  const key = await importHmacKey(secret, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return `${payload}.${toHex(signature)}`;
}

/**
 * Verify an HMAC-SHA256 signed session token and check expiration.
 */
export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token || typeof token !== "string") {
    return false;
  }
  const parts = token.split(".");
  if (parts.length !== 3) {
    return false;
  }
  const [expStr, nonce, sigHex] = parts;
  const expiresAt = Number.parseInt(expStr, 10);
  if (!Number.isFinite(expiresAt) || expiresAt <= Math.floor(Date.now() / 1000) || !nonce) {
    return false;
  }

  const sigBytes = fromHex(sigHex);
  if (!sigBytes) {
    return false;
  }

  try {
    const secret = getSessionSecret();
    const key = await importHmacKey(secret, ["verify"]);
    const payload = `${expStr}.${nonce}`;
    return await crypto.subtle.verify(
      "HMAC",
      key,
      sigBytes.buffer as ArrayBuffer,
      new TextEncoder().encode(payload)
    );
  } catch {
    return false;
  }
}

/**
 * Verify Bearer CRON_SECRET header with fail-closed behavior if secret is unset.
 */
export function verifyCronAuthorization(authHeader: string | null): boolean {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return false;
  }
  try {
    const secret = getCronSecret();
    const candidate = authHeader.slice("Bearer ".length).trim();
    return constantTimeEqual(candidate, secret);
  } catch {
    return false;
  }
}

export function getSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: DEFAULT_SESSION_TTL_SECONDS,
  };
}
