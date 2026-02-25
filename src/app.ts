import { type Context, Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import db from './lib/db';
import _logger from './lib/logger';
import routes from './routes/index';

const app = new Hono();

app.use(logger());
app.use(cors());

app.route('/', routes);
app.notFound((c: Context) => {
  return c.json({ success: false, message: 'Route does not exist' }, 404);
});
app.onError((err: Error, c: Context) => {
  _logger.error(err.message);
  const payload: { success: false; message: string; stack?: string } = {
    success: false,
    message: err.message,
  };
  if (process.env.NODE_ENV !== 'production') {
    payload.stack = err.stack;
  }
  return c.json(payload, 500);
});

const port = +(process.env.PORT || 2002);

if (import.meta.main && typeof Bun !== 'undefined') {
 

  console.log(`Server running on port ${port}`);

  async function graceful() {
    // server.stop();
    await db.main.connection.close();
    _logger.info('Shutdown gracefully');
    process.exit(0);
  }

  process.on('SIGTERM', graceful);
  process.on('SIGINT', graceful);
}

export default app;


 // const server = Bun.serve({
  //   port,
  //   fetch: app.fetch,
  // });




// import { Hono } from 'hono';

// const app = new Hono();
// app.get('/', (c) => c.json({ success: true, message: 'Hello world' }));

// export default app;
