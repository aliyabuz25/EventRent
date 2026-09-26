import express from 'express';
import fs from 'node:fs/promises';
import { existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import crypto from 'node:crypto';

// dotenv modülünü güvenli import et ve sadece bir kere çalıştır
let dotenv;
try {
    dotenv = await import('dotenv');
    if (dotenv && dotenv.default) {
        dotenv.default.config();
    } else if (dotenv && dotenv.config) {
        dotenv.config();
    }
} catch (e) {
    console.log("dotenv error (ignored)");
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require   = createRequire(import.meta.url);

const app  = express();
const PORT = Number(process.env.PORT || 4320);
const CONTENT_FILE_PATH = path.resolve('data/site-content.json');
const DB_PATH = path.resolve(process.env.DB_PATH || 'data/eventrent.db');
const JWT_SECRET = process.env.JWT_SECRET || 'ev3ntr3nt_s3cr3t_' + Date.now();

app.use((req, res, next) => {
    express.json({ limit: '4mb' })(req, res, (err) => {
        if (err) {
            console.error('JSON Parse Error:', err.message);
            return res.status(400).json({ error: 'Invalid JSON payload format' });
        }
        next();
    });
});
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.resolve('uploads')));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

/* ══════════════════════════════════════════
   SQLite init
══════════════════════════════════════════ */
let db;

function initDb() {
  const Database = require('better-sqlite3');
  const dataDir  = path.dirname(DB_PATH);
  if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });
  db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      name       TEXT NOT NULL,
      email      TEXT NOT NULL UNIQUE,
      password   TEXT NOT NULL,
      role       TEXT NOT NULL DEFAULT 'viewer',
      active     INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS orders (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      name       TEXT NOT NULL,
      phone      TEXT NOT NULL,
      email      TEXT DEFAULT '',
      event_date TEXT DEFAULT '',
      location   TEXT DEFAULT '',
      note       TEXT DEFAULT '',
      status     TEXT NOT NULL DEFAULT 'new',
      items      TEXT NOT NULL DEFAULT '[]',
      user_id    TEXT DEFAULT '',
      source     TEXT DEFAULT 'admin',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS smtp_config (
      id         INTEGER PRIMARY KEY DEFAULT 1,
      host       TEXT DEFAULT '',
      port       INTEGER DEFAULT 587,
      secure     INTEGER DEFAULT 0,
      user_email TEXT DEFAULT '',
      password   TEXT DEFAULT '',
      from_name  TEXT DEFAULT 'Eventrent',
      from_email TEXT DEFAULT '',
      notify_to  TEXT DEFAULT '',
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    INSERT OR IGNORE INTO smtp_config (id) VALUES (1);
    CREATE TABLE IF NOT EXISTS products (
      id            TEXT PRIMARY KEY,
      name          TEXT NOT NULL,
      category      TEXT DEFAULT '',
      description   TEXT DEFAULT '',
      technical_specs TEXT DEFAULT '{}',
      images        TEXT DEFAULT '[]',
      tags          TEXT DEFAULT '[]',
      related_products TEXT DEFAULT '[]',
      active        INTEGER DEFAULT 1,
      sort_order    INTEGER DEFAULT 0,
      created_at    TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS support_tickets (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id    INTEGER DEFAULT 0,
      user_name  TEXT DEFAULT '',
      user_email TEXT DEFAULT '',
      subject    TEXT NOT NULL,
      message    TEXT NOT NULL,
      status     TEXT NOT NULL DEFAULT 'open',
      priority   TEXT NOT NULL DEFAULT 'normal',
      reply      TEXT DEFAULT '',
      replied_at TEXT DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS tb_games (
      id          TEXT PRIMARY KEY,
      name        TEXT NOT NULL,
      category    TEXT NOT NULL DEFAULT 'Indoor',
      image       TEXT DEFAULT '',
      description TEXT DEFAULT '',
      details     TEXT DEFAULT '',
      sort_order  INTEGER DEFAULT 0,
      active      INTEGER DEFAULT 1,
      created_at  TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS tb_concepts (
      id          TEXT PRIMARY KEY,
      name        TEXT NOT NULL,
      image       TEXT DEFAULT '',
      sort_order  INTEGER DEFAULT 0,
      active      INTEGER DEFAULT 1,
      created_at  TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS leads (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      name       TEXT NOT NULL,
      phone      TEXT NOT NULL DEFAULT '',
      email      TEXT NOT NULL DEFAULT '',
      event_date TEXT DEFAULT '',
      location   TEXT DEFAULT '',
      note       TEXT DEFAULT '',
      status     TEXT NOT NULL DEFAULT 'new',
      items      TEXT NOT NULL DEFAULT '[]',
      user_id    TEXT DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  /* seed first admin if table empty */
  const count = db.prepare('SELECT COUNT(*) as c FROM users').get();
  if (count.c === 0) {
    const bcrypt = require('bcryptjs');
    const hashed = bcrypt.hashSync('admin123', 10);
    db.prepare(`INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'admin')`)
      .run('Admin', 'admin@eventrent.az', hashed);
    console.log('✓ Default admin created: admin@eventrent.az / admin123');
  }
  console.log('✓ SQLite ready:', DB_PATH);
}

initDb();

/* ══════════════════════════════════════════
   JWT middleware
══════════════════════════════════════════ */
function signToken(payload) {
  const jwt = require('jsonwebtoken');
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

function verifyToken(token) {
  const jwt = require('jsonwebtoken');
  try { return jwt.verify(token, JWT_SECRET); }
  catch { return null; }
}

function authMiddleware(req, res, next) {
  const header = req.headers.authorization || '';
  const token  = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  const payload = verifyToken(token);
  if (!payload) return res.status(401).json({ error: 'Invalid token' });
  const user = db.prepare('SELECT * FROM users WHERE id=? AND active=1').get(payload.id);
  if (!user) return res.status(401).json({ error: 'User not found or inactive' });
  req.user = user;
  next();
}

function adminOnly(req, res, next) {
  if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Admin required' });
  next();
}

/* ══════════════════════════════════════════
   Nodemailer
══════════════════════════════════════════ */
let transporter = null;

async function buildTransporter(cfg = null) {
  try {
    const nodemailer = require('nodemailer');
    const row = cfg || db.prepare('SELECT * FROM smtp_config WHERE id=1').get();
    const host   = row?.host       || process.env.SMTP_HOST || '';
    const port   = Number(row?.port ?? process.env.SMTP_PORT ?? 587);
    const secure = !!(row?.secure  ?? (process.env.SMTP_SECURE === 'true'));
    const user   = row?.user_email || process.env.SMTP_USER || '';
    const pass   = row?.password   || process.env.SMTP_PASS || '';
    if (!host || !user || !pass) { transporter = null; return false; }
    const t = nodemailer.createTransport({ host, port, secure, auth: { user, pass } });
    await t.verify();
    transporter = t;
    console.log('✓ SMTP ready:', host);
    return true;
  } catch (err) {
    console.warn('⚠ SMTP:', err.message);
    transporter = null;
    return false;
  }
}

async function sendMail({ to, subject, html }) {
  if (!transporter) await buildTransporter();
  if (!transporter) return false;
  try {
    const row = db.prepare('SELECT * FROM smtp_config WHERE id=1').get();
    const from = `${row?.from_name || 'Eventrent'} <${row?.from_email || row?.user_email || ''}>`;
    const recipient = to || row?.notify_to || row?.user_email || '';
    if (!recipient) return false;
    await transporter.sendMail({ from, to: recipient, subject, html });
    return true;
  } catch (err) { console.warn('Mail error:', err.message); return false; }
}

function orderEmailHtml(order) {
  const items = (JSON.parse(order.items || '[]')).map(i =>
    `<tr><td style="padding:6px 10px;border-bottom:1px solid #f0f0f0">${i.productId}</td><td style="padding:6px 10px;border-bottom:1px solid #f0f0f0;text-align:center">${i.quantity}</td></tr>`
  ).join('');
  return `<div style="font-family:Inter,sans-serif;max-width:560px;margin:0 auto;background:#fff;border:1px solid #e9ecef;border-radius:12px;overflow:hidden">
    <div style="background:#e30613;padding:24px 28px"><h2 style="color:#fff;margin:0;font-size:20px;font-weight:900">Yeni Sifariş #${order.id}</h2><div style="color:rgba(255,255,255,0.75);font-size:12px;margin-top:4px">${order.created_at}</div></div>
    <div style="padding:24px 28px">
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
        <tr><td style="padding:6px 0;color:#6c757d;font-size:12px;width:120px">Ad Soyad</td><td style="font-weight:600">${order.name}</td></tr>
        <tr><td style="padding:6px 0;color:#6c757d;font-size:12px">Telefon</td><td style="font-weight:600">${order.phone}</td></tr>
        <tr><td style="padding:6px 0;color:#6c757d;font-size:12px">Email</td><td>${order.email || '—'}</td></tr>
        <tr><td style="padding:6px 0;color:#6c757d;font-size:12px">Tarix</td><td>${order.event_date || '—'}</td></tr>
        <tr><td style="padding:6px 0;color:#6c757d;font-size:12px">Yer</td><td>${order.location || '—'}</td></tr>
        ${order.note ? `<tr><td style="padding:6px 0;color:#6c757d;font-size:12px">Qeyd</td><td>${order.note}</td></tr>` : ''}
      </table>
      ${items ? `<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#adb5bd;margin-bottom:8px">Məhsullar</div><table style="width:100%;border-collapse:collapse;font-size:13px"><thead><tr style="background:#f8f9fa"><th style="padding:8px 10px;text-align:left;font-size:11px;color:#6c757d">Məhsul</th><th style="padding:8px 10px;text-align:center;font-size:11px;color:#6c757d">Ədəd</th></tr></thead><tbody>${items}</tbody></table>` : ''}
    </div>
    <div style="padding:16px 28px;background:#f8f9fa;border-top:1px solid #e9ecef;font-size:11px;color:#adb5bd">Eventrent · ${process.env.APP_URL || 'http://localhost:5050'}</div>
  </div>`;
}

/* ══════════════════════════════════════════
   AUTH ROUTES
══════════════════════════════════════════ */
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Ad, email və parol tələb olunur.' });
  if (password.length < 6) return res.status(400).json({ error: 'Parol ən az 6 simvol olmalıdır.' });
  const existing = db.prepare('SELECT id FROM users WHERE email=?').get(email.toLowerCase().trim());
  if (existing) return res.status(409).json({ error: 'Bu email artıq qeydiyyatdadır.' });
  const bcrypt = require('bcryptjs');
  const hashed = bcrypt.hashSync(password, 10);
  const result = db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)').run(name, email.toLowerCase().trim(), hashed, 'viewer');
  const user   = db.prepare('SELECT id,name,email,role,active FROM users WHERE id=?').get(result.lastInsertRowid);
  const token  = signToken({ id: user.id, email: user.email, role: user.role });
  res.status(201).json({ token, user });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email və parol tələb olunur.' });
  const user = db.prepare('SELECT * FROM users WHERE email=? AND active=1').get(email.toLowerCase().trim());
  if (!user) return res.status(401).json({ error: 'Email və ya parol yanlışdır.' });
  const bcrypt = require('bcryptjs');
  const ok = bcrypt.compareSync(password, user.password);
  if (!ok) return res.status(401).json({ error: 'Email və ya parol yanlışdır.' });
  const token = signToken({ id: user.id, email: user.email, role: user.role });
  const { password: _, ...safe } = user;
  res.json({ token, user: safe });
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
  const { password: _, ...safe } = req.user;
  res.json(safe);
});

app.put('/api/auth/profile', authMiddleware, (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) return res.status(400).json({ error: 'Ad tələb olunur.' });
  db.prepare('UPDATE users SET name=?, updated_at=datetime(\'now\') WHERE id=?').run(name.trim(), req.user.id);
  const user = db.prepare('SELECT id,name,email,role,active,created_at FROM users WHERE id=?').get(req.user.id);
  res.json(user);
});

app.post('/api/auth/change-password', authMiddleware, (req, res) => {
  const { current_password, new_password } = req.body;
  if (!current_password || !new_password) return res.status(400).json({ error: 'Mövcud və yeni parol tələb olunur.' });
  if (new_password.length < 6) return res.status(400).json({ error: 'Yeni parol ən az 6 simvol olmalıdır.' });
  const bcrypt = require('bcryptjs');
  const user = db.prepare('SELECT * FROM users WHERE id=?').get(req.user.id);
  if (!bcrypt.compareSync(current_password, user.password)) return res.status(401).json({ error: 'Mövcud parol yanlışdır.' });
  const hashed = bcrypt.hashSync(new_password, 10);
  db.prepare('UPDATE users SET password=?, updated_at=datetime(\'now\') WHERE id=?').run(hashed, req.user.id);
  res.json({ ok: true });
});

/* ══════════════════════════════════════════
   USER MANAGEMENT (admin only)
══════════════════════════════════════════ */
app.get('/api/users', authMiddleware, adminOnly, (req, res) => {
  const users = db.prepare('SELECT id,name,email,role,active,created_at,updated_at FROM users ORDER BY created_at DESC').all();
  res.json(users);
});

app.post('/api/users', authMiddleware, adminOnly, (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Ad, email və parol tələb olunur.' });
  if (password.length < 6) return res.status(400).json({ error: 'Parol ən az 6 simvol olmalıdır.' });
  const validRoles = ['admin', 'sales', 'viewer'];
  if (!validRoles.includes(role)) return res.status(400).json({ error: 'Yanlış rol.' });
  const existing = db.prepare('SELECT id FROM users WHERE email=?').get(email.toLowerCase().trim());
  if (existing) return res.status(409).json({ error: 'Bu email artıq mövcuddur.' });
  const bcrypt  = require('bcryptjs');
  const hashed  = bcrypt.hashSync(password, 10);
  const result  = db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)').run(name, email.toLowerCase().trim(), hashed, role);
  const user    = db.prepare('SELECT id,name,email,role,active,created_at FROM users WHERE id=?').get(result.lastInsertRowid);
  res.status(201).json(user);
});

app.put('/api/users/:id', authMiddleware, adminOnly, (req, res) => {
  const { name, email, role, active, password } = req.body;
  const id = Number(req.params.id);
  if (id === req.user.id && role && role !== req.user.role) return res.status(400).json({ error: 'Öz rolunuzu dəyişə bilməzsiniz.' });
  const existing = db.prepare('SELECT * FROM users WHERE id=?').get(id);
  if (!existing) return res.status(404).json({ error: 'İstifadəçi tapılmadı.' });
  let hashed = existing.password;
  if (password && password.length >= 6) {
    const bcrypt = require('bcryptjs');
    hashed = bcrypt.hashSync(password, 10);
  }
  db.prepare(`UPDATE users SET name=?,email=?,role=?,active=?,password=?,updated_at=datetime('now') WHERE id=?`)
    .run(name || existing.name, (email || existing.email).toLowerCase().trim(), role || existing.role, active !== undefined ? (active ? 1 : 0) : existing.active, hashed, id);
  const user = db.prepare('SELECT id,name,email,role,active,created_at,updated_at FROM users WHERE id=?').get(id);
  res.json(user);
});

app.delete('/api/users/:id', authMiddleware, adminOnly, (req, res) => {
  const id = Number(req.params.id);
  if (id === req.user.id) return res.status(400).json({ error: 'Öz hesabınızı silə bilməzsiniz.' });
  const adminCount = db.prepare('SELECT COUNT(*) as c FROM users WHERE role=\'admin\' AND active=1').get();
  const target = db.prepare('SELECT role FROM users WHERE id=?').get(id);
  if (target?.role === 'admin' && adminCount.c <= 1) return res.status(400).json({ error: 'Son admini silmək olmaz.' });
  db.prepare('DELETE FROM users WHERE id=?').run(id);
  res.json({ ok: true });
});

app.patch('/api/users/:id/toggle', authMiddleware, adminOnly, (req, res) => {
  const id = Number(req.params.id);
  if (id === req.user.id) return res.status(400).json({ error: 'Öz hesabınızı deaktiv edə bilməzsiniz.' });
  const user = db.prepare('SELECT * FROM users WHERE id=?').get(id);
  if (!user) return res.status(404).json({ error: 'Tapılmadı.' });
  if (user.active === 1) {
    const adminCount = db.prepare('SELECT COUNT(*) as c FROM users WHERE role=\'admin\' AND active=1').get();
    if (user.role === 'admin' && adminCount.c <= 1) return res.status(400).json({ error: 'Son aktiv admini deaktiv edə bilməzsiniz.' });
  }
  db.prepare('UPDATE users SET active=?, updated_at=datetime(\'now\') WHERE id=?').run(user.active ? 0 : 1, id);
  const updated = db.prepare('SELECT id,name,email,role,active,created_at,updated_at FROM users WHERE id=?').get(id);
  res.json(updated);
});

/* ══════════════════════════════════════════
   ORDERS (SQLite)
══════════════════════════════════════════ */
app.get('/api/orders', authMiddleware, (req, res) => {
  const orders = db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all();
  res.json(orders.map(o => ({ ...o, items: JSON.parse(o.items || '[]') })));
});

app.post('/api/orders', (req, res) => {
  const { name, phone, email, event_date, location, note, items, source } = req.body;
  const nameTrimmed  = String(name || '').trim();
  const phoneTrimmed = String(phone || '').trim();
  if (!nameTrimmed)  return res.status(400).json({ error: 'Ad tələb olunur.' });
  if (!phoneTrimmed) return res.status(400).json({ error: 'Telefon tələb olunur.' });
  // optionally attach user_id from JWT if present
  let userId = '';
  try {
    const header = req.headers.authorization || '';
    const token  = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (token) { const payload = verifyToken(token); if (payload?.id) userId = String(payload.id); }
  } catch {}
  const result = db.prepare(`INSERT INTO orders (name,phone,email,event_date,location,note,items,user_id,source) VALUES (?,?,?,?,?,?,?,?,?)`)
    .run(nameTrimmed, phoneTrimmed, email || '', event_date || '', location || '', note || '', JSON.stringify(items || []), userId, source || 'website');
  const order = db.prepare('SELECT * FROM orders WHERE id=?').get(result.lastInsertRowid);
  sendMail({ subject: `Yeni Sifariş — ${name} | Eventrent`, html: orderEmailHtml(order) }).catch(() => {});
  res.status(201).json({ ...order, items: JSON.parse(order.items || '[]') });
});

app.put('/api/orders/:id', authMiddleware, (req, res) => {
  const { name, phone, email, event_date, location, note, status, items } = req.body;
  const existing = db.prepare('SELECT * FROM orders WHERE id=?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Tapılmadı.' });
  db.prepare(`UPDATE orders SET name=?,phone=?,email=?,event_date=?,location=?,note=?,status=?,items=?,updated_at=datetime('now') WHERE id=?`)
    .run(name ?? existing.name, phone ?? existing.phone, email ?? existing.email, event_date ?? existing.event_date, location ?? existing.location, note ?? existing.note, status ?? existing.status, JSON.stringify(items ?? JSON.parse(existing.items || '[]')), req.params.id);
  const order = db.prepare('SELECT * FROM orders WHERE id=?').get(req.params.id);
  res.json({ ...order, items: JSON.parse(order.items || '[]') });
});

app.patch('/api/orders/:id/status', authMiddleware, async (req, res) => {
  const { status, send_email } = req.body;
  const validOrderStatuses = ['new','processing','contacted','won','lost','cancelled','confirmed'];
  if (!status || !validOrderStatuses.includes(status)) return res.status(400).json({ error: 'Yanlış status.' });
  const order = db.prepare('SELECT * FROM orders WHERE id=?').get(req.params.id);
  if (!order) return res.status(404).json({ error: 'Tapılmadı.' });
  db.prepare('UPDATE orders SET status=?, updated_at=datetime(\'now\') WHERE id=?').run(status, req.params.id);
  // Send status email to customer if requested and email exists
  if (send_email && order.email) {
    const statusLabels = { new:'Yeni', processing:'İcrada', won:'Tamamlandı', lost:'Ləğv edildi', contacted:'Əlaqə saxlanıldı' };
    const statusLabel = statusLabels[status] || status;
    const html = `<div style="font-family:Inter,sans-serif;max-width:560px;margin:0 auto"><div style="background:#e30613;padding:20px 24px"><h2 style="color:#fff;margin:0;font-size:18px">Sifariş #${String(order.id).padStart(4,'0')} — Status Yeniləndi</h2></div><div style="padding:24px;background:#fff;border:1px solid #e9ecef"><p>Hörmətli <b>${order.name}</b>,</p><p>Sifarişinizin statusu yeniləndi:</p><div style="background:#f8f9fa;border-left:4px solid #e30613;padding:16px;border-radius:8px;margin:16px 0;font-size:18px;font-weight:700">${statusLabel}</div><p style="color:#6c757d;font-size:13px">Sifariş tarixi: ${order.created_at}</p></div><div style="padding:12px 24px;background:#f8f9fa;font-size:11px;color:#adb5bd">Eventrent · ${process.env.APP_URL||'http://localhost:5050'}</div></div>`;
    await sendMail({ to: order.email, subject: `Sifarişiniz #${String(order.id).padStart(4,'0')} — ${statusLabel}`, html }).catch(()=>{});
  }
  res.json({ ...order, items: JSON.parse(order.items || '[]') });
});

app.delete('/api/orders/:id', authMiddleware, (req, res) => {
  db.prepare('DELETE FROM orders WHERE id=?').run(req.params.id);
  res.json({ ok: true });
});

app.post('/api/orders/:id/send-email', authMiddleware, async (req, res) => {
  const order = db.prepare('SELECT * FROM orders WHERE id=?').get(req.params.id);
  if (!order) return res.status(404).json({ error: 'Tapılmadı.' });
  const sent = await sendMail({ subject: `Sifariş #${order.id} — ${order.name}`, html: orderEmailHtml(order) });
  res.json({ ok: sent });
});

/* ══════════════════════════════════════════
   SMTP CONFIG
══════════════════════════════════════════ */
app.get('/api/smtp', authMiddleware, adminOnly, (_req, res) => {
  const row = db.prepare('SELECT * FROM smtp_config WHERE id=1').get();
  res.json({ ...row, password: row?.password ? '••••••••' : '', secure: !!(row?.secure) });
});

app.put('/api/smtp', authMiddleware, adminOnly, async (req, res) => {
  const { host, port, secure, user_email, password, from_name, from_email, notify_to } = req.body;
  const existing = db.prepare('SELECT password FROM smtp_config WHERE id=1').get();
  const realPass = (password && password !== '••••••••') ? password : (existing?.password || '');
  db.prepare(`INSERT INTO smtp_config (id,host,port,secure,user_email,password,from_name,from_email,notify_to,updated_at) VALUES (1,?,?,?,?,?,?,?,?,datetime('now')) ON CONFLICT(id) DO UPDATE SET host=?,port=?,secure=?,user_email=?,password=?,from_name=?,from_email=?,notify_to=?,updated_at=datetime('now')`)
    .run(host, Number(port)||587, secure?1:0, user_email, realPass, from_name, from_email, notify_to, host, Number(port)||587, secure?1:0, user_email, realPass, from_name, from_email, notify_to);
  transporter = null;
  const ok = await buildTransporter({ host, port: Number(port)||587, secure: !!secure, user_email, password: realPass, from_name, from_email, notify_to });
  res.json({ ok, connected: ok });
});

app.post('/api/smtp/test', authMiddleware, adminOnly, async (req, res) => {
  const { to } = req.body;
  const sent = await sendMail({ to, subject: 'Eventrent SMTP Test ✓', html: '<div style="font-family:sans-serif;padding:24px"><h3 style="color:#e30613">SMTP uğurla qoşuldu!</h3><p>Bu test emailidir.</p></div>' });
  res.json({ ok: sent });
});

/* ══════════════════════════════════════════
   PRODUCTS API
══════════════════════════════════════════ */
function parseProduct(p) {
  if (!p) return null;
  return {
    ...p,
    technicalSpecs:   JSON.parse(p.technical_specs  || '{}'),
    images:           JSON.parse(p.images            || '[]'),
    tags:             JSON.parse(p.tags              || '[]'),
    relatedProducts:  JSON.parse(p.related_products  || '[]'),
  };
}

app.get('/api/products', (req, res) => {
  const rows = db.prepare('SELECT * FROM products ORDER BY sort_order ASC, created_at ASC').all();
  res.json(rows.map(parseProduct));
});

app.get('/api/products/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM products WHERE id=?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Tapılmadı.' });
  res.json(parseProduct(row));
});

app.post('/api/products', authMiddleware, adminOnly, (req, res) => {
  const { name, category, description, technicalSpecs, images, tags, relatedProducts, sort_order } = req.body;
  if (!name) return res.status(400).json({ error: 'Ad tələb olunur.' });
  const id = 'prod-' + Date.now();
  db.prepare(`INSERT INTO products (id,name,category,description,technical_specs,images,tags,related_products,sort_order) VALUES (?,?,?,?,?,?,?,?,?)`)
    .run(id, name, category||'', description||'', JSON.stringify(technicalSpecs||{}), JSON.stringify(images||[]), JSON.stringify(tags||[]), JSON.stringify(relatedProducts||[]), sort_order||0);
  res.status(201).json(parseProduct(db.prepare('SELECT * FROM products WHERE id=?').get(id)));
});

app.put('/api/products/:id', authMiddleware, adminOnly, (req, res) => {
  const { name, category, description, technicalSpecs, images, tags, relatedProducts, sort_order, active } = req.body;
  const existing = db.prepare('SELECT * FROM products WHERE id=?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Tapılmadı.' });
  db.prepare(`UPDATE products SET name=?,category=?,description=?,technical_specs=?,images=?,tags=?,related_products=?,sort_order=?,active=?,updated_at=datetime('now') WHERE id=?`)
    .run(name??existing.name, category??existing.category, description??existing.description,
      JSON.stringify(technicalSpecs??JSON.parse(existing.technical_specs||'{}')),
      JSON.stringify(images??JSON.parse(existing.images||'[]')),
      JSON.stringify(tags??JSON.parse(existing.tags||'[]')),
      JSON.stringify(relatedProducts??JSON.parse(existing.related_products||'[]')),
      sort_order??existing.sort_order, active??existing.active, req.params.id);
  res.json(parseProduct(db.prepare('SELECT * FROM products WHERE id=?').get(req.params.id)));
});

app.delete('/api/products/:id', authMiddleware, adminOnly, (req, res) => {
  db.prepare('DELETE FROM products WHERE id=?').run(req.params.id);
  res.json({ ok: true });
});

/* ══════════════════════════════════════════
   LEADS API
══════════════════════════════════════════ */
app.get('/api/leads', authMiddleware, (req, res) => {
  const rows = db.prepare('SELECT * FROM leads ORDER BY created_at DESC').all();
  const parsed = rows.map(r => ({ ...r, items: JSON.parse(r.items || '[]') }));
  res.json(parsed);
});

app.post('/api/leads', (req, res) => {
  const { name, phone, email, eventDate, event_date, location, note, message, items, userId, user_id } = req.body;
  const leadName  = String(name || '').trim();
  const leadPhone = String(phone || '').trim();
  if (!leadName)  return res.status(400).json({ error: 'Ad tələb olunur.' });
  if (!leadPhone) return res.status(400).json({ error: 'Telefon tələb olunur.' });
  const edate   = eventDate || event_date || '';
  const uid     = userId || user_id || '';
  const noteVal = note || message || '';
  const result = db.prepare(
    `INSERT INTO leads (name,phone,email,event_date,location,note,items,user_id) VALUES (?,?,?,?,?,?,?,?)`
  ).run(leadName, leadPhone, email||'', edate, location||'', noteVal, JSON.stringify(items||[]), uid);
  const row = db.prepare('SELECT * FROM leads WHERE id=?').get(result.lastInsertRowid);
  const parsed = { ...row, items: JSON.parse(row.items || '[]') };

  // Admin-ə bildiriş emaili göndər
  try {
    const smtpCfg = db.prepare('SELECT * FROM smtp_config WHERE id=1').get();
    if (smtpCfg && smtpCfg.notify_to) {
      const itemsHtml = parsed.items.length
        ? `<tr><td style="padding:8px 0;font-weight:700;color:#555;vertical-align:top">Məhsullar</td><td style="padding:8px 0 8px 16px">${parsed.items.map(it => `${it.name || it.title || ''}${it.qty ? ` ×${it.qty}` : ''}`).join(', ')}</td></tr>`
        : '';
      const html = `
<div style="font-family:Inter,Arial,sans-serif;max-width:580px;margin:0 auto;border:1px solid #e9ecef;border-radius:12px;overflow:hidden">
  <div style="background:#e30613;padding:20px 28px">
    <h2 style="color:#fff;margin:0;font-size:18px;font-weight:700">📩 Yeni Müştəri Müraciəti</h2>
    <div style="color:rgba(255,255,255,0.8);font-size:12px;margin-top:4px">Eventrent — Lead #${String(row.id).padStart(4,'0')}</div>
  </div>
  <div style="padding:24px 28px;background:#fff">
    <table style="width:100%;border-collapse:collapse;font-size:14px">
      <tr><td style="padding:8px 0;font-weight:700;color:#555;width:120px">Ad Soyad</td><td style="padding:8px 0 8px 16px">${name}</td></tr>
      <tr><td style="padding:8px 0;font-weight:700;color:#555">Telefon</td><td style="padding:8px 0 8px 16px">${phone||'—'}</td></tr>
      <tr><td style="padding:8px 0;font-weight:700;color:#555">Email</td><td style="padding:8px 0 8px 16px">${email||'—'}</td></tr>
      ${edate ? `<tr><td style="padding:8px 0;font-weight:700;color:#555">Tarix</td><td style="padding:8px 0 8px 16px">${edate}</td></tr>` : ''}
      ${location ? `<tr><td style="padding:8px 0;font-weight:700;color:#555">Məkan</td><td style="padding:8px 0 8px 16px">${location}</td></tr>` : ''}
      ${noteVal ? `<tr><td style="padding:8px 0;font-weight:700;color:#555;vertical-align:top">Mesaj</td><td style="padding:8px 0 8px 16px;background:#f8f9fa;border-radius:8px;border-left:4px solid #e30613"><div style="padding:8px 12px">${noteVal}</div></td></tr>` : ''}
      ${itemsHtml}
    </table>
  </div>
  <div style="padding:12px 28px;background:#f8f9fa;font-size:11px;color:#adb5bd">
    Bu email avtomatik göndərilib · ${new Date().toLocaleString('az-AZ')}
  </div>
</div>`;
      sendMail({ to: smtpCfg.notify_to, subject: `Yeni Müraciət — ${name} | Eventrent`, html }).catch(() => {});
    }
  } catch (_) {}

  res.status(201).json(parsed);
});

// Admin lead-ə cavab göndərir (müştərinin emailinə)
app.put('/api/leads/:id/reply', authMiddleware, async (req, res) => {
  const { reply } = req.body;
  if (!reply?.trim()) return res.status(400).json({ error: 'Cavab tələb olunur.' });
  const lead = db.prepare('SELECT * FROM leads WHERE id=?').get(req.params.id);
  if (!lead) return res.status(404).json({ error: 'Lead tapılmadı.' });
  if (!lead.email) return res.status(400).json({ error: 'Müştərinin email ünvanı yoxdur.' });

  const noteVal = lead.note || '';
  const html = `
<div style="font-family:Inter,Arial,sans-serif;max-width:580px;margin:0 auto;border:1px solid #e9ecef;border-radius:12px;overflow:hidden">
  <div style="background:#e30613;padding:20px 28px">
    <h2 style="color:#fff;margin:0;font-size:18px;font-weight:700">Müraciətinizə Cavab</h2>
    <div style="color:rgba(255,255,255,0.8);font-size:12px;margin-top:4px">Eventrent</div>
  </div>
  <div style="padding:24px 28px;background:#fff">
    <p style="font-size:14px;color:#333;margin:0 0 16px">Salam, <b>${lead.name}</b>!</p>
    ${noteVal ? `<div style="background:#f8f9fa;border-radius:8px;border-left:4px solid #dee2e6;padding:12px 16px;margin-bottom:20px;font-size:13px;color:#666"><b>Müraciətiniz:</b><br>${noteVal}</div>` : ''}
    <div style="background:#e8f5e9;border-radius:8px;border-left:4px solid #198754;padding:12px 16px;font-size:14px;color:#1a1a1a;line-height:1.6">
      <b>Cavabımız:</b><br>${reply.replace(/\n/g,'<br>')}
    </div>
  </div>
  <div style="padding:12px 28px;background:#f8f9fa;font-size:11px;color:#adb5bd">
    Eventrent — ${new Date().toLocaleString('az-AZ')}
  </div>
</div>`;

  const sent = await sendMail({ to: lead.email, subject: `Müraciətinizə Cavab — Eventrent`, html });
  if (!sent) return res.status(500).json({ error: 'Email göndərilmədi. SMTP konfiqurasiyanı yoxlayın.' });
  res.json({ ok: true });
});

app.patch('/api/leads/:id/status', authMiddleware, (req, res) => {
  const { status } = req.body;
  const valid = ['new','contacted','quoted','won','lost'];
  if (!status || !valid.includes(status)) return res.status(400).json({ error: 'Yanlış status.' });
  const row = db.prepare('SELECT * FROM leads WHERE id=?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Tapılmadı.' });
  db.prepare(`UPDATE leads SET status=?,updated_at=datetime('now') WHERE id=?`).run(status, req.params.id);
  const updated = db.prepare('SELECT * FROM leads WHERE id=?').get(req.params.id);
  res.json({ ...updated, items: JSON.parse(updated.items || '[]') });
});

app.delete('/api/leads/:id', authMiddleware, adminOnly, (req, res) => {
  db.prepare('DELETE FROM leads WHERE id=?').run(req.params.id);
  res.json({ ok: true });
});

/* ══════════════════════════════════════════
   SUPPORT TICKETS API
══════════════════════════════════════════ */
app.get('/api/support', authMiddleware, adminOnly, (req, res) => {
  const rows = db.prepare('SELECT * FROM support_tickets ORDER BY created_at DESC').all();
  res.json(rows);
});

app.get('/api/support/my', authMiddleware, (req, res) => {
  const rows = db.prepare('SELECT * FROM support_tickets WHERE user_id=? ORDER BY created_at DESC').all(req.user.id);
  res.json(rows);
});

app.post('/api/support', authMiddleware, (req, res) => {
  const { subject, message, priority } = req.body;
  if (!String(subject || '').trim() || !String(message || '').trim()) return res.status(400).json({ error: 'Mövzu və mesaj tələb olunur.' });
  const result = db.prepare('INSERT INTO support_tickets (user_id,user_name,user_email,subject,message,priority) VALUES (?,?,?,?,?,?)')
    .run(req.user.id, req.user.name, req.user.email, subject, message, priority||'normal');
  const ticket = db.prepare('SELECT * FROM support_tickets WHERE id=?').get(result.lastInsertRowid);
  res.status(201).json(ticket);
});

app.post('/api/support/guest', (req, res) => {
  const { subject, message, user_name, user_email, priority } = req.body;
  if (!String(subject || '').trim() || !String(message || '').trim()) return res.status(400).json({ error: 'Mövzu və mesaj tələb olunur.' });
  const result = db.prepare('INSERT INTO support_tickets (user_id,user_name,user_email,subject,message,priority) VALUES (?,?,?,?,?,?)')
    .run(0, user_name||'', user_email||'', subject, message, priority||'normal');
  res.status(201).json(db.prepare('SELECT * FROM support_tickets WHERE id=?').get(result.lastInsertRowid));
});

app.put('/api/support/:id/reply', authMiddleware, adminOnly, (req, res) => {
  const { reply, status } = req.body;
  if (!reply || !String(reply).trim()) return res.status(400).json({ error: 'Cavab tələb olunur.' });
  db.prepare(`UPDATE support_tickets SET reply=?,status=?,replied_at=datetime('now'),updated_at=datetime('now') WHERE id=?`)
    .run(reply, status||'answered', req.params.id);
  const ticket = db.prepare('SELECT * FROM support_tickets WHERE id=?').get(req.params.id);
  if (!ticket) return res.status(404).json({ error: 'Tapılmadı.' });
  // send email if user has email
  if (ticket.user_email) {
    const html = `<div style="font-family:Inter,sans-serif;max-width:560px;margin:0 auto"><div style="background:#e30613;padding:20px 24px"><h2 style="color:#fff;margin:0;font-size:18px">Dəstək Sorğunuza Cavab</h2></div><div style="padding:24px;background:#fff;border:1px solid #e9ecef"><p><b>Mövzu:</b> ${ticket.subject}</p><p><b>Cavab:</b></p><p style="background:#f8f9fa;padding:16px;border-radius:8px;border-left:4px solid #e30613">${reply}</p></div><div style="padding:12px 24px;background:#f8f9fa;font-size:11px;color:#adb5bd">Eventrent</div></div>`;
    sendMail({ to: ticket.user_email, subject: `Dəstək: ${ticket.subject}`, html }).catch(()=>{});
  }
  res.json(ticket);
});

app.patch('/api/support/:id/status', authMiddleware, adminOnly, (req, res) => {
  const { status } = req.body;
  db.prepare(`UPDATE support_tickets SET status=?,updated_at=datetime('now') WHERE id=?`).run(status, req.params.id);
  res.json(db.prepare('SELECT * FROM support_tickets WHERE id=?').get(req.params.id));
});

app.delete('/api/support/:id', authMiddleware, adminOnly, (req, res) => {
  db.prepare('DELETE FROM support_tickets WHERE id=?').run(req.params.id);
  res.json({ ok: true });
});

/* ══════════════════════════════════════════
   TEAMBUILDING API
══════════════════════════════════════════ */
// Games
app.get('/api/tb/games', (req, res) => {
  const rows = db.prepare('SELECT * FROM tb_games ORDER BY sort_order ASC, created_at ASC').all();
  res.json(rows);
});
app.post('/api/tb/games', authMiddleware, adminOnly, (req, res) => {
  const { name, category, image, description, details, sort_order } = req.body;
  if (!name) return res.status(400).json({ error: 'Ad tələb olunur.' });
  const id = 'game-' + Date.now();
  db.prepare('INSERT INTO tb_games (id,name,category,image,description,details,sort_order) VALUES (?,?,?,?,?,?,?)')
    .run(id, name, category || 'Indoor', image || '', description || '', details || '', sort_order || 0);
  res.json(db.prepare('SELECT * FROM tb_games WHERE id=?').get(id));
});
app.put('/api/tb/games/:id', authMiddleware, adminOnly, (req, res) => {
  const { name, category, image, description, details, sort_order, active } = req.body;
  const existing = db.prepare('SELECT * FROM tb_games WHERE id=?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Tapılmadı.' });
  if (name !== undefined && !String(name || '').trim()) return res.status(400).json({ error: 'Ad boş ola bilməz.' });
  db.prepare('UPDATE tb_games SET name=?,category=?,image=?,description=?,details=?,sort_order=?,active=? WHERE id=?')
    .run(name ?? existing.name, category ?? existing.category, image ?? existing.image, description ?? existing.description, details ?? existing.details, sort_order ?? existing.sort_order, active ?? existing.active, req.params.id);
  res.json(db.prepare('SELECT * FROM tb_games WHERE id=?').get(req.params.id));
});
app.delete('/api/tb/games/:id', authMiddleware, adminOnly, (req, res) => {
  db.prepare('DELETE FROM tb_games WHERE id=?').run(req.params.id);
  res.json({ ok: true });
});

// Concepts
app.get('/api/tb/concepts', (req, res) => {
  const rows = db.prepare('SELECT * FROM tb_concepts ORDER BY sort_order ASC, created_at ASC').all();
  res.json(rows);
});
app.post('/api/tb/concepts', authMiddleware, adminOnly, (req, res) => {
  const { name, image, sort_order } = req.body;
  if (!name) return res.status(400).json({ error: 'Ad tələb olunur.' });
  const id = 'concept-' + Date.now();
  db.prepare('INSERT INTO tb_concepts (id,name,image,sort_order) VALUES (?,?,?,?)').run(id, name, image || '', sort_order || 0);
  res.json(db.prepare('SELECT * FROM tb_concepts WHERE id=?').get(id));
});
app.put('/api/tb/concepts/:id', authMiddleware, adminOnly, (req, res) => {
  const { name, image, sort_order, active } = req.body;
  const existing = db.prepare('SELECT * FROM tb_concepts WHERE id=?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Tapılmadı.' });
  if (name !== undefined && !String(name || '').trim()) return res.status(400).json({ error: 'Ad boş ola bilməz.' });
  db.prepare('UPDATE tb_concepts SET name=?,image=?,sort_order=?,active=? WHERE id=?')
    .run(name ?? existing.name, image ?? existing.image, sort_order ?? existing.sort_order, active ?? existing.active, req.params.id);
  res.json(db.prepare('SELECT * FROM tb_concepts WHERE id=?').get(req.params.id));
});
app.delete('/api/tb/concepts/:id', authMiddleware, adminOnly, (req, res) => {
  db.prepare('DELETE FROM tb_concepts WHERE id=?').run(req.params.id);
  res.json({ ok: true });
});

/* ══════════════════════════════════════════
   MEDIA UPLOAD
══════════════════════════════════════════ */
const UPLOAD_DIR = path.resolve('uploads');
if (!existsSync(UPLOAD_DIR)) mkdirSync(UPLOAD_DIR, { recursive: true });

app.post('/api/media/upload', authMiddleware, async (req, res) => {
  try {
    const multer = require('multer');
    const storage = multer.diskStorage({
      destination: UPLOAD_DIR,
      filename: (_req, file, cb) => {
        const ext  = path.extname(file.originalname).toLowerCase();
        const name = path.basename(file.originalname, ext).replace(/[^a-z0-9]/gi, '-').toLowerCase();
        cb(null, `${name}-${Date.now()}${ext}`);
      },
    });
    const upload = multer({
      storage,
      limits: { fileSize: 200 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        const allowed = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.ico', '.mp4', '.webm', '.mov', '.avi'];
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, allowed.includes(ext));
      },
    }).single('file');

    await new Promise((resolve, reject) => upload(req, res, err => err ? reject(err) : resolve(null)));
    if (!req.file) return res.status(400).json({ error: 'Fayl yüklənmədi.' });
    const url = `/uploads/${req.file.filename}`;
    res.json({ ok: true, url, filename: req.file.filename, size: req.file.size });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/media', authMiddleware, async (_req, res) => {
  try {
    const files = await fs.readdir(UPLOAD_DIR);
    const items = await Promise.all(
      files.filter(f => /\.(jpg|jpeg|png|gif|webp|svg|ico|mp4|webm|mov|avi)$/i.test(f)).map(async f => {
        const stat = await fs.stat(path.join(UPLOAD_DIR, f));
        return { filename: f, url: `/uploads/${f}`, size: stat.size, created_at: stat.birthtime };
      })
    );
    items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    res.json(items);
  } catch { res.json([]); }
});

app.delete('/api/media/:filename', authMiddleware, adminOnly, async (req, res) => {
  try {
    const file = path.join(UPLOAD_DIR, path.basename(req.params.filename));
    if (existsSync(file)) await fs.unlink(file);
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* ══════════════════════════════════════════
   CONTENT API (JSON file)
══════════════════════════════════════════ */
async function ensureContentFile() {
  const dir = path.dirname(CONTENT_FILE_PATH);
  if (!existsSync(dir)) await fs.mkdir(dir, { recursive: true });
  if (!existsSync(CONTENT_FILE_PATH)) await fs.writeFile(CONTENT_FILE_PATH, '{}\n', 'utf8');
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, smtp: !!transporter });
});

app.get('/api/content', async (_req, res) => {
  try {
    await ensureContentFile();
    res.type('application/json').send(await fs.readFile(CONTENT_FILE_PATH, 'utf8'));
  } catch { res.status(500).json({ error: 'Content could not be loaded.' }); }
});

app.put('/api/content', authMiddleware, adminOnly, async (req, res) => {
  try {
    await ensureContentFile();
    await fs.writeFile(CONTENT_FILE_PATH, JSON.stringify(req.body ?? {}, null, 2), 'utf8');
    res.json({ ok: true });
  } catch { res.status(500).json({ error: 'Content could not be saved.' }); }
});

app.post('/api/content', authMiddleware, adminOnly, async (req, res) => {
  try {
    await ensureContentFile();
    await fs.writeFile(CONTENT_FILE_PATH, JSON.stringify(req.body ?? {}, null, 2), 'utf8');
    res.json({ ok: true });
  } catch { res.status(500).json({ error: 'Content could not be saved.' }); }
});

/* ══════════════════════════════════════════
   Start
══════════════════════════════════════════ */
await buildTransporter();
app.listen(PORT, '0.0.0.0', () => console.log(`✓ API :${PORT}  DB: ${DB_PATH}`));