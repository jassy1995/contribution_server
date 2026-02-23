export const config = { runtime: 'nodejs' };

import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import routes from '../src/routes/index.ts';
import '../src/lib/db.ts';
import _logger from '../src/lib/logger.ts';

const app = new Hono();

app.route('/', routes);

app.notFound((c) => {
  return c.json({ success: false, message: 'Route does not exist' }, 404);
});

app.onError((err, c) => {
  _logger.error(err.message);
  return c.json({ success: false, message: err.message, stack: err.stack }, 500);
});

export default handle(app);
