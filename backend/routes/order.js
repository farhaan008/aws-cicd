const express = require('express');
const router = express.Router();
const db = require('../db/database');


module.exports = function (io) {

  router.get('/', (_, res) => {
    const query = `
      SELECT
      o.id AS order_id,
      o.created_at,
      o.status AS order_status,
      o.payment_status,
      mi.name AS item_name,
      isz.size AS item_size,
      oi.quantity,
      oi.kitchen_status,
      u.name AS customer_name
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN menu_items mi ON oi.item_id = mi.id
      LEFT JOIN item_sizes isz ON oi.size_id = isz.id
      LEFT JOIN users u ON o.user_id = u.id
      WHERE o.status IN ('confirmed', 'preparing', 'ready', 'served') 
      ORDER BY o.created_at DESC, o.id, oi.id;
    `;
    db.all(query, (err, rows) => {
      if (err) {
          console.error('Database error:', err.message);
          return res.status(500).json({ error:`${err.message}`, message: 'Internal server error', status: 'error', statusCode: 500 });
      }
      const ordersMap = {};

      rows.forEach(row => {
        if (!ordersMap[row.order_id]) {
          ordersMap[row.order_id] = {
              order_id: row.order_id,
              customer_name: row.customer_name,
              created_at: row.created_at,
              order_status: row.order_status,
              payment_status: row.payment_status,
              items: []
          };
        }

        ordersMap[row.order_id].items.push({
          item_name: row.item_name,
          item_size: row.item_size,
          quantity: row.quantity,
          kitchen_status: row.kitchen_status
        });
      });

      // const result = Object.values(ordersMap);
      const result = Object.values(ordersMap).sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      res.json({ data: result, message: 'Data fetched successfully', status: 'success', statusCode: 200 });

    });
    
  });
  
  router.post('/', (req, res) => {
    let { name, mobile, items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error:'Invalid order data', message: 'Invalid order data', status: 'error', statusCode: 400 });
    }
  
    if (!name) {
      name = 'Guest_' + Math.floor(1000 + Math.random() * 9000);
    }
  
    db.run(`INSERT INTO users (name, mobile) VALUES (?, ?)`, [name, mobile], function (err) {
      if (err) return res.status(500).json({ error: err, message: 'Order insert error', status: 'error', statusCode: 500 });
      const userId = this.lastID;
      db.run(`INSERT INTO orders (user_id) VALUES (?)`, [userId], function (err) {
        if (err) return res.status(500).json({
          error:`${err.message}`, message: 'Order insert error', status: 'error', statusCode: 500
        });
  
        const orderId = this.lastID;
        const stmt = db.prepare(`INSERT INTO order_items (order_id, item_id, quantity, size_id) VALUES (?, ?, ?, ?)`);
        items.forEach(item => {
          const sizeId = item.sizeId || null;
          stmt.run(orderId, item.id, item.quantity, sizeId);
        });
  
        stmt.finalize(() => {
          res.json({ data: { orderId }, message: 'Order created successfully', status: 'success', statusCode: 200 });
        });
      });
    });
  });

  router.put('/:orderId', (req, res) => {
      const { orderId } = req.params;
      const { status, payment_status } = req.body;

      if (!status || !payment_status) {
          return res.status(400).json({ error: 'Missing status or payment_status', message: 'Missing status or payment_status', status: 'error', statusCode: 400 });
      }

      const query = `UPDATE orders SET status = ?, payment_status = ? WHERE id = ?;`;
      db.run(query, [status, payment_status, orderId], function (err) {
        if (err) {
            console.error('Error updating order:', err.message);
            return res.status(500).json({ status: 'error', message: 'Database update failed' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ status: 'error', message: 'Order not found' });
        }

        if (io && io.emit) { io.emit('order_update', { orderId, status, payment_status }); }
        return res.json({
          data: { orderId, status, payment_status },
          message: `Order ${orderId} updated successfully.`,
          status: 'success',
          statusCode: 200
        });
      });
  });

  router.put('/:orderId/item/status', (req, res) => {
    const { orderId } = req.params;
    const { kitchen_status } = req.body;

    const validStatuses = ['queued', 'preparing', 'ready', 'served'];
    if (!validStatuses.includes(kitchen_status)) {
      return res.status(400).json({ error:`${err.message}`, message: 'Invalid kitchen_status value', status: 'error', statusCode: 400 });
    }

    const updateItemsQuery = `UPDATE order_items SET kitchen_status = ? WHERE order_id = ?`;

    db.run(updateItemsQuery, [kitchen_status, orderId], function (err) {
      if (err) {
        console.error('DB error (order_items):', err.message);
        return res.status(500).json({ error:`${err.message}`, message: 'Failed to update kitchen_status', status: 'error', statusCode: 500 });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error:`${err.message}`, message: 'No order_items found for the given order_id', status: 'error', statusCode: 404 });
      }

      let newOrderStatus;
      switch (kitchen_status) {
        case 'preparing':
          newOrderStatus = 'preparing';
          break;
        case 'ready':
          newOrderStatus = 'ready';
          break;
        case 'served':
          newOrderStatus = 'served';
          break;
        default:
          newOrderStatus = 'confirmed';
      }

      const updateOrderQuery = `UPDATE orders SET status = ? WHERE id = ?`;

      db.run(updateOrderQuery, [newOrderStatus, orderId], function (orderErr) {
        if (orderErr) {
          console.error('DB error (orders):', orderErr.message);
          return res.status(500).json({ 
            error:`DB error (orders): ${orderErr.message}`, message: 'Kitchen status updated, but failed to update order status',
            status: 'error', statusCode: 500
          });
        }

        const data = { order_id: orderId, kitchen_status, order_status: newOrderStatus };

        if (io && io.emit) { io.emit('order_update', data); }

        return res.status(200).json({ data: data, message: 'Kitchen and order status updated successfully', status: 'success', statusCode: 200 });
      });
    });
  });

  // router.put('/:orderId/item/:itemId/status', (req, res) => {
  //   const { orderId, itemId } = req.params;
  //   const { kitchen_status } = req.body;
  //   if (!['queued', 'preparing', 'ready', 'served'].includes(kitchen_status)) {
  //     return res.status(400).json({ error: 'Invalid kitchen_status value' });
  //   }
  //   const query = `UPDATE order_items SET kitchen_status = ? WHERE order_id = ? AND id = ?`;
  //   db.run(query, [kitchen_status, orderId, itemId], function (err) {
  //     if (err) {
  //       console.error('DB error:', err);
  //       return res.status(500).json({ error: 'Failed to update kitchen_status' });
  //     }
  //     if (this.changes === 0) {
  //       return res.status(404).json({ error: 'Order item not found' });
  //     }
  //     const data = { order_id: orderId, item_id: itemId, kitchen_status };
  //     io.emit('order_update', data);
  //     return res.json({ status: 'success', message: 'Kitchen status updated', data, statusCode: 200 });

  //   });
  // });

  return router;
};




// router.post('/:orderId', (req, res) => {
//   console.log(req.params, req.body);
//   res.json({ status: 'success', data: 'test', statusCode: 200 });
// });

// router.post('/:orderId/confirm', (req, res) => {
//   const { orderId } = req.params;
//   db.run(`UPDATE orders SET status = 'paid' WHERE id = ?`, [orderId], function (err) {
//     if (err) return res.status(500).json({ error: 'Payment confirmation failed' });
//     res.json({ message: 'Payment confirmed' });
//   });
// });

