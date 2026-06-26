import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import type { IncomingMessage, ServerResponse } from 'node:http';
import path from 'path';
import { defineConfig, loadEnv, Plugin } from 'vite';
import { DEFAULT_SITE_CONTENT } from './src/content.default';
import type { SiteContent } from './src/types';

const CONTENT_FILE_PATH = path.resolve(__dirname, 'data/site-content.json');

function isSiteContent(value: unknown): value is SiteContent {
  return Boolean(value && typeof value === 'object' && (value as SiteContent).home && (value as SiteContent).services);
}

async function ensureContentFile() {
  const directory = path.dirname(CONTENT_FILE_PATH);
  if (!existsSync(directory)) {
    await fs.mkdir(directory, { recursive: true });
  }

  if (!existsSync(CONTENT_FILE_PATH)) {
    await fs.writeFile(CONTENT_FILE_PATH, JSON.stringify(DEFAULT_SITE_CONTENT, null, 2), 'utf8');
  }
}

async function readContentFile(): Promise<SiteContent> {
  await ensureContentFile();
  const fileContent = await fs.readFile(CONTENT_FILE_PATH, 'utf8');

  try {
    const parsed = JSON.parse(fileContent);
    if (isSiteContent(parsed)) {
      return parsed;
    }
  } catch {
  }

  await fs.writeFile(CONTENT_FILE_PATH, JSON.stringify(DEFAULT_SITE_CONTENT, null, 2), 'utf8');
  return DEFAULT_SITE_CONTENT;
}

async function writeContentFile(content: SiteContent) {
  await ensureContentFile();
  await fs.writeFile(CONTENT_FILE_PATH, JSON.stringify(content, null, 2), 'utf8');
}

async function readJsonBody(request: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let body = '';

    request.on('data', (chunk) => {
      body += chunk.toString('utf8');
    });

    request.on('end', () => {
      if (!body.trim()) {
        resolve(null);
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });

    request.on('error', (error) => {
      reject(error);
    });
  });
}

function sendJson(response: ServerResponse, statusCode: number, payload: unknown) {
  response.statusCode = statusCode;
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.end(JSON.stringify(payload));
}

function createContentApiPlugin(): Plugin {
  const middleware = async (request: IncomingMessage, response: ServerResponse, next: () => void) => {
    if (!request.url?.startsWith('/api/content')) {
      next();
      return;
    }

    if (request.method === 'OPTIONS') {
      response.statusCode = 204;
      response.setHeader('Allow', 'GET, PUT, POST, OPTIONS');
      response.end();
      return;
    }

    if (request.method === 'GET') {
      try {
        const content = await readContentFile();
        sendJson(response, 200, content);
      } catch {
        sendJson(response, 500, { error: 'Content could not be loaded.' });
      }
      return;
    }

    if (request.method === 'PUT' || request.method === 'POST') {
      try {
        const body = await readJsonBody(request);
        if (!isSiteContent(body)) {
          sendJson(response, 400, { error: 'Invalid content payload.' });
          return;
        }

        await writeContentFile(body);
        sendJson(response, 200, { ok: true });
      } catch {
        sendJson(response, 500, { error: 'Content could not be saved.' });
      }
      return;
    }

    sendJson(response, 405, { error: 'Method not allowed.' });
  };

  return {
    name: 'local-content-api',
    configureServer(server) {
      server.middlewares.use(middleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware);
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  return {
    plugins: [react(), tailwindcss(), createContentApiPlugin()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 5050,
      strictPort: true,
      allowedHosts: ['eventrent2.octotech.az'],
      hmr: process.env.DISABLE_HMR !== 'true',
    },
    preview: {
      host: '0.0.0.0',
      port: 5051,
      strictPort: true,
    },
  };
});
