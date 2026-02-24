export const config = { runtime: 'nodejs' };

import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import routes from '../src/routes/index';
import '../src/lib/db';
import _logger from '../src/lib/logger';

const app = new Hono();

app.get('/health', (c) => c.json({ ok: true }));

app.route('/', routes);

app.notFound((c) => {
  return c.json({ success: false, message: 'Route does not exist' }, 404);
});

app.onError((err, c) => {
  _logger.error(err.message);
  return c.json({ success: false, message: err.message, stack: err.stack }, 500);
});

export default handle(app);
