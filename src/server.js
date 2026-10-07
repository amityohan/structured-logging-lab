const express = require('express');
const { randomUUID } = require('node:crypto');
const { connectDb } = require('./db');
const ordersRouter = require('./routes/orders');
const { processPayment } = require('./payment');
const { logger } = require('./logger');

const app = express();
const port = 3000;

app.use((req, res, next) => {
  req.id = randomUUID();
  req.log = logger.child({ reqId: req.id });
  res.setHeader('X-Request-ID', req.id);
  const startedAt = Date.now();

  req.log.info({ method: req.method, path: req.path }, 'request.started');
  res.on('finish', () => {
    req.log.info({
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      durationMs: Date.now() - startedAt,
    }, 'request.completed');
  });

  next();
});

app.use(express.json());

connectDb();

app.get('/', (req, res) => {
  req.log.info('healthcheck.ok');
  res.send('Orders API is running');
});

app.use('/orders', ordersRouter);

app.post('/payments', (req, res) => {
  processPayment(req.log);
  res.send('Payment processed');
});

app.get('/simulate-error', (req, res) => {
  req.log.error({ operation: 'simulate-error' }, 'request.failed');
  res.status(500).send('Internal Server Error');
});

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.status || 500;
  req.log[statusCode >= 500 ? 'error' : 'warn']({
    error: err.name,
    statusCode,
  }, 'request.rejected');

  res.status(statusCode).send(statusCode >= 500 ? 'Internal Server Error' : 'Invalid request body');
});

app.listen(port, () => {
  logger.info({ port }, 'server.started');
});
