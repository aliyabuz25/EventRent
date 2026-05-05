import express from 'express';
import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const app = express();
const PORT = Number(process.env.PORT || 4320);
const CONTENT_FILE_PATH = path.resolve('data/site-content.json');

app.use(express.json({ limit: '1mb' }));
app.use('/uploads', express.static(path.resolve('uploads')));

async function ensureContentFile() {
  const directory = path.dirname(CONTENT_FILE_PATH);
  if (!existsSync(directory)) {
    await fs.mkdir(directory, { recursive: true });
  }
  if (!existsSync(CONTENT_FILE_PATH)) {
    await fs.writeFile(CONTENT_FILE_PATH, '{}\n', 'utf8');
  }
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/api/content', async (_req, res) => {
  try {
    await ensureContentFile();
    const content = await fs.readFile(CONTENT_FILE_PATH, 'utf8');
    res.type('application/json').send(content);
  } catch {
    res.status(500).json({ error: 'Content could not be loaded.' });
  }
});

app.put('/api/content', async (req, res) => {
  try {
    await ensureContentFile();
    await fs.writeFile(CONTENT_FILE_PATH, JSON.stringify(req.body ?? {}, null, 2), 'utf8');
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: 'Content could not be saved.' });
  }
});

app.post('/api/content', async (req, res) => {
  try {
    await ensureContentFile();
    await fs.writeFile(CONTENT_FILE_PATH, JSON.stringify(req.body ?? {}, null, 2), 'utf8');
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: 'Content could not be saved.' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`API listening on ${PORT}`);
});
