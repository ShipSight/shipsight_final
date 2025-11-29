import type { VercelRequest, VercelResponse } from "@vercel/node";
import crypto from "crypto";

type PlainUser = { username: string; email: string; password: string; displayName: string };
const DEFAULT_USERS_PLAINTEXT: PlainUser[] = [
  { username: "oora", email: "oora@shipsight.com", password: "OoraShip2025!", displayName: "Oora" },
  { username: "as international", email: "as.international@shipsight.com", password: "AsIntl2025!", displayName: "AS International" },
  { username: "ss international", email: "ss.international@shipsight.com", password: "SsIntl2025!", displayName: "SS International" },
  { username: "admin", email: "admin@shipsight.com", password: "AdminShip2025!", displayName: "Administrator" },
  { username: "rohit", email: "rohit@shipsight.com", password: "RohitShip2025!", displayName: "Rohit" },
];

function pbkdf2(password: string, saltB64: string, iterations: number) {
  const salt = Buffer.from(saltB64, "base64");
  const buf = crypto.pbkdf2Sync(password, salt, iterations, 32, "sha256");
  return buf.toString("base64");
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "method" });
  const { email, username, displayName, oldPassword, newPassword } = (req.body || {}) as {
    email?: string;
    username?: string;
    displayName?: string;
    oldPassword?: string;
    newPassword?: string;
  };
  const id = String(email || username || "").toLowerCase();
  if (!id || !newPassword) return res.status(400).json({ error: "bad" });

  const kvUrl = process.env.KV_REST_API_URL || "";
  const kvToken = process.env.KV_REST_API_TOKEN || "";
  const ns = process.env.KV_NAMESPACE || "shipsight_passwords";

  let existing: any = null;
  if (kvUrl && kvToken) {
    try {
      const r = await fetch(`${kvUrl}/get/${ns}:${id}`, { headers: { Authorization: `Bearer ${kvToken}` } });
      if (r.ok) {
        const j = await r.json();
        existing = j?.result || null;
      }
    } catch {}
  }

  let ok = true;
  if (oldPassword) {
    if (existing && existing.salt && existing.iterations && existing.hash) {
      const check = pbkdf2(oldPassword, existing.salt, Number(existing.iterations));
      ok = check === existing.hash;
    } else {
      const du = DEFAULT_USERS_PLAINTEXT.find((u) => u.email.toLowerCase() === id || u.username.toLowerCase() === id);
      ok = du ? du.password === oldPassword : false;
    }
  }
  if (!ok) return res.status(401).json({ ok: false });

  const iterations = existing?.iterations ? Number(existing.iterations) : 100000;
  const salt = crypto.randomBytes(16).toString("base64");
  const hash = pbkdf2(newPassword, salt, iterations);
  const payload = { email: id, username, displayName, iterations, salt, hash };

  if (kvUrl && kvToken) {
    try {
      const r = await fetch(`${kvUrl}/set/${ns}:${id}/${encodeURIComponent(JSON.stringify(payload))}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${kvToken}` },
      });
      if (r.ok) return res.status(200).json({ ok: true });
    } catch {}
  }

  return res.status(501).json({ ok: false });
}