import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Plugin } from 'vite';
import { handleAgentInvokeHttp } from '../server/ai-gateway/index.ts';

async function readJsonBody(req: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.from(chunk));
  }
  const raw = Buffer.concat(chunks).toString('utf8');
  if (!raw.trim()) return {};
  return JSON.parse(raw) as unknown;
}

function sendJson(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
}

/** Vite dev middleware — mirrors Vercel `/api/agents/invoke` locally. */
export function civicApiDevPlugin(): Plugin {
  return {
    name: 'civic-api-dev',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/agents/invoke')) {
          next();
          return;
        }

        if (req.method === 'OPTIONS') {
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
          res.statusCode = 204;
          res.end();
          return;
        }

        if (req.method !== 'POST') {
          sendJson(res, 405, { error: 'Method not allowed', code: 'METHOD_NOT_ALLOWED' });
          return;
        }

        try {
          const body = await readJsonBody(req);
          const result = await handleAgentInvokeHttp(body);
          res.setHeader('Access-Control-Allow-Origin', '*');
          sendJson(res, result.status, result.body);
        } catch {
          sendJson(res, 500, { error: 'Internal gateway error', code: 'INTERNAL_ERROR' });
        }
      });
    },
  };
}
