/* Ronak panel — static SPA + minimal session auth */
import express from "express";
import crypto from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.set("trust proxy", 1);
app.disable("x-powered-by");
app.use(express.json({ limit: "32kb" }));

const PORT = Number(process.env.PORT || 3000);
const USER = process.env.RONAK_USER || "admin";
const PASS = process.env.RONAK_PASS || "ronak-demo";
const SECRET = process.env.RONAK_SECRET || crypto.randomBytes(32).toString("hex");
const TTL_MS = 12 * 60 * 60 * 1000;
const COOKIE = "ronak_sess";

const sha = (s) => crypto.createHash("sha256").update(String(s)).digest();
const sign = (payload) => crypto.createHmac("sha256", SECRET).update(payload).digest("base64url");

function issue() {
  const exp = Date.now() + TTL_MS;
  const payload = `${USER}.${exp}`;
  return `${payload}.${sign(payload)}`;
}

function verify(token) {
  if (!token) return null;
  const parts = String(token).split(".");
  if (parts.length !== 3) return null;
  const [u, exp, sig] = parts;
  if (u !== USER) return null;
  const n = Number(exp);
  if (!Number.isFinite(n) || n < Date.now()) return null;
  const expected = sign(`${u}.${exp}`);
  if (sig.length !== expected.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  return u;
}

function readCookie(req, name) {
  const raw = req.headers.cookie || "";
  for (const part of raw.split(";")) {
    const i = part.indexOf("=");
    if (i < 0) continue;
    if (part.slice(0, i).trim() === name) return decodeURIComponent(part.slice(i + 1).trim());
  }
  return null;
}

function setCookie(res, value, maxAgeSec) {
  const secure = "Secure";
  res.append(
    "Set-Cookie",
    `${COOKIE}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAgeSec}; ${secure}`,
  );
}

/* brute-force guard: 12 attempts / 10 min per IP */
const attempts = new Map();
function throttled(ip) {
  const now = Date.now();
  const list = (attempts.get(ip) || []).filter((t) => now - t < 10 * 60 * 1000);
  list.push(now);
  attempts.set(ip, list);
  if (attempts.size > 5000) attempts.clear();
  return list.length > 12;
}

app.get("/api/health", (_req, res) => res.json({ ok: true, app: "ronak-panel" }));

app.get("/api/session", (req, res) => {
  const user = verify(readCookie(req, COOKIE));
  if (!user) return res.status(401).json({ ok: false });
  res.json({ ok: true, user });
});

app.post("/api/login", (req, res) => {
  const ip = req.ip || "unknown";
  if (throttled(ip)) return res.status(429).json({ ok: false, error: "تلاش زیاد؛ چند دقیقه بعد دوباره امتحان کنید." });
  const { username, password } = req.body || {};
  const okUser = crypto.timingSafeEqual(sha(username || ""), sha(USER));
  const okPass = crypto.timingSafeEqual(sha(password || ""), sha(PASS));
  if (!okUser || !okPass) return res.status(401).json({ ok: false, error: "نام کاربری یا رمز عبور اشتباه است." });
  setCookie(res, issue(), TTL_MS / 1000);
  res.json({ ok: true, user: USER });
});

app.post("/api/logout", (_req, res) => {
  setCookie(res, "", 0);
  res.json({ ok: true });
});

const dist = path.join(__dirname, "dist");
app.use(express.static(dist, { index: false, maxAge: "1h", etag: true }));

app.get("*", (req, res) => {
  if (req.path.startsWith("/api/")) return res.status(404).json({ ok: false });
  const authed = !!verify(readCookie(req, COOKIE));
  if (!authed && req.path !== "/login") return res.redirect("/login");
  if (authed && req.path === "/login") return res.redirect("/");
  res.sendFile(path.join(dist, "index.html"));
});

const listenPorts = [...new Set([PORT, 80])];
for (const p of listenPorts) {
  app
    .listen(p, "0.0.0.0", () => console.log(`ronak-panel listening on :${p}`))
    .on("error", (err) => console.error(`listen :${p} failed — ${err.message}`));
}
