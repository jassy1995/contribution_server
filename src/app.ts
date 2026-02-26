import { type Context, Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import db from './lib/db.ts';
import _logger from './lib/logger.ts';
import routes from './routes/index.ts';

const app = new Hono();

app.use(logger());
app.use(cors());

app.route('/', routes);
app.notFound((c: Context) => {
  return c.json({ success: false, message: 'Route does not exist' }, 404);
});
app.onError((err: Error, c: Context) => {
  _logger.error(err.message);
  return c.json({ success: false, message: err.message, stack: err.stack }, 500);
});

const port = +(process.env.PORT || 2002);

const server = Bun.serve({
  port,
  fetch: app.fetch,
});

console.log(`Server running on port ${port}`);

async function graceful() {
  server.stop();
  await db.main.connection.close();
  _logger.info('Shutdown gracefully');
  process.exit(0);
}

process.on('SIGTERM', graceful);
process.on('SIGINT', graceful);