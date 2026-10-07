const express = require('express');
const router = express.Router();
const { queryDb } = require('../db');

router.get('/', async (req, res) => {
  req.log.info('orders.list.started');
  try {
    const result = await queryDb('SELECT * FROM orders', [], req.log);
    req.log.info({ count: result.rowCount }, 'orders.list.completed');
    res.json(result.rows);
  } catch (err) {
    req.log.error({ operation: 'orders.list', error: err.name }, 'orders.list.failed');
    res.status(500).send('Error fetching orders');
  }
});

router.post('/', async (req, res) => {
  req.log.info('orders.create.started');
  const { product_id, quantity, customer_id } = req.body;
  
  if (!product_id || !quantity || !customer_id) {
    req.log.warn({ reason: 'missing_fields' }, 'orders.create.rejected');
    return res.status(400).send('Missing fields');
  }

  try {
    const result = await queryDb(
      'INSERT INTO orders (product_id, quantity, customer_id) VALUES ($1, $2, $3) RETURNING *',
      [product_id, quantity, customer_id],
      req.log
    );
    req.log.info({ orderId: result.rows[0].id }, 'orders.create.completed');
    res.status(201).json(result.rows[0]);
  } catch (err) {
    req.log.error({ operation: 'orders.create', error: err.name }, 'orders.create.failed');
    res.status(500).send('Error creating order');
  }
});

module.exports = router;
