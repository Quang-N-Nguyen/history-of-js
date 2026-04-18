/**
 * Local dev proxy: browser → POST /chat → OpenRouter.
 * Keeps OPENROUTER_API_KEY off the client.
 *
 * Run:
 *   npm run proxy         # requires OPENROUTER_API_KEY in env
 *   npm run proxy:dev     # loads .env via --env-file
 */
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const DEFAULT_MODEL = process.env.OPENROUTER_MODEL || 'openrouter/free';
const PORT = parseInt(process.env.PROXY_PORT || '3001', 10) || 3001;

type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string };
type ChatBody = { messages?: ChatMessage[]; model?: string };

const app = new Hono();

app.use('*', cors({ origin: '*', allowMethods: ['POST'] }));

app.post('/chat', async (c) => {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) {
    return c.text(
      'Missing OPENROUTER_API_KEY. export it or run: npm run proxy:dev\n',
      500,
    );
  }

  let body: ChatBody;
  try {
    body = await c.req.json<ChatBody>();
  } catch {
    return c.text('Invalid JSON', 400);
  }

  if (!body.messages || !Array.isArray(body.messages)) {
    return c.text(
      'Expected JSON: { "messages": [ { "role": "user", "content": "..." } ] }',
      400,
    );
  }

  const upstream = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.OPENROUTER_SITE_URL || 'http://localhost:8080',
      'X-Title': process.env.OPENROUTER_APP_NAME || 'history-of-js',
    },
    body: JSON.stringify({ model: body.model || DEFAULT_MODEL, messages: body.messages }),
  }).catch((e: unknown) => e as Error);

  if (upstream instanceof Error) {
    return c.text(`Upstream fetch failed: ${upstream.message}`, 502);
  }

  const text = await upstream.text();
  return new Response(text, {
    status: upstream.status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
});

serve({ fetch: app.fetch, port: PORT }, (info) => {
  console.log(`OpenRouter proxy at http://127.0.0.1:${info.port}/chat (POST)`);
});
