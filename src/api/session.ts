import { env } from "~/lib/env";

/**
 * Sessions signées simples — HMAC SHA-256 sur `expiresAt`.
 *
 * Le cookie `shenron_session=<base64url payload>.<base64url sig>` est posé après
 * un POST /auth/login réussi (token == API_ADMIN_TOKEN). Vérifié à chaque
 * requête via `verifySession()`.
 *
 * Pas de DB, pas de stockage côté serveur — stateless. Si l'admin token tourne,
 * toutes les sessions sont invalidées (le secret HMAC dérive du token).
 */

const TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 jours

interface SessionPayload {
  v: 1;
  expiresAt: number;
  createdAt: number;
}

function getSecret(): string {
  if (!env.API_ADMIN_TOKEN) throw new Error("API_ADMIN_TOKEN absent");
  return env.API_ADMIN_TOKEN;
}

function b64url(buf: ArrayBuffer | Uint8Array): string {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlDecode(s: string): Uint8Array {
  const norm = s.replace(/-/g, "+").replace(/_/g, "/");
  const pad = norm.length % 4 ? 4 - (norm.length % 4) : 0;
  const bin = atob(norm + "=".repeat(pad));
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

async function hmac(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return b64url(sig);
}

export async function createSession(): Promise<string> {
  const payload: SessionPayload = {
    v: 1,
    createdAt: Date.now(),
    expiresAt: Date.now() + TTL_MS,
  };
  const json = JSON.stringify(payload);
  const encoded = b64url(new TextEncoder().encode(json));
  const sig = await hmac(encoded);
  return `${encoded}.${sig}`;
}

export async function verifySession(cookie: string | null): Promise<SessionPayload | null> {
  if (!cookie) return null;
  const [encoded, sig] = cookie.split(".");
  if (!encoded || !sig) return null;
  try {
    const expected = await hmac(encoded);
    // Comparaison constant-time
    if (sig.length !== expected.length) return null;
    let diff = 0;
    for (let i = 0; i < sig.length; i++) diff |= sig.charCodeAt(i) ^ expected.charCodeAt(i);
    if (diff !== 0) return null;
    const json = new TextDecoder().decode(b64urlDecode(encoded));
    const payload = JSON.parse(json) as SessionPayload;
    if (payload.expiresAt < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export function buildSessionCookie(value: string): string {
  const maxAge = Math.floor(TTL_MS / 1000);
  return `shenron_session=${value}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`;
}

export function buildLogoutCookie(): string {
  return `shenron_session=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;
}

export function readCookie(req: Request, name: string): string | null {
  const header = req.headers.get("cookie");
  if (!header) return null;
  for (const part of header.split(";")) {
    const [k, ...rest] = part.trim().split("=");
    if (k === name) return rest.join("=");
  }
  return null;
}
