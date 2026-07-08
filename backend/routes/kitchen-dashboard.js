const express = require('express');
const router = express.Router();
const db = require('../db/database');

router.get('/', (req, res) => {
  const query = `
    SELECT
        o.id AS order_id,
        o.status AS order_status,
        o.created_at,
        mi.name AS item_name,
        isz.size AS item_size,
        oi.id,
        oi.quantity,
        oi.kitchen_status
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN menu_items mi ON oi.item_id = mi.id
    LEFT JOIN item_sizes isz ON oi.size_id = isz.id
    WHERE o.status IN ('confirmed', 'preparing', 'ready', 'served')
    ORDER BY datetime(o.created_at) DESC, o.id, oi.id;
  `;

  db.all(query, [], (err, rows) => {
    // console.log('Sorted rows:', rows.map(r => r.created_at));
    if (err) {
        console.error('Database error:', err.message);
        return res.status(500).json({ error:'Internal server error', message: 'Internal server error', status: 'error', statusCode: 500 });
    }

    const ordersMap = {};
    rows.forEach(row => {
      if (!ordersMap[row.order_id]) {
          ordersMap[row.order_id] = {
              order_id: row.order_id,
              order_status: row.order_status,
              created_at: row.created_at,
              items: []
          };
      }
      ordersMap[row.order_id].items.push({
          id: row.id,
          item_name: row.item_name,
          item_size: row.item_size,
          quantity: row.quantity,
          kitchen_status: row.kitchen_status
      });
    });

    const result = Object.values(ordersMap).sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
    res.json({ data: result, message:'Data fetched successfully', status: 'success', statusCode: 200 });

  });

});

module.exports = router;




// app.get('/api/kitchen-dashboard', (req, res) => {
//     const query = `
//         SELECT
//             o.id AS order_id,
//             o.created_at,
//             mi.name AS item_name,
//             isz.size AS item_size,
//             oi.quantity,
//             oi.kitchen_status
//         FROM orders o
//         JOIN order_items oi ON o.id = oi.order_id
//         JOIN menu_items mi ON oi.item_id = mi.id
//         LEFT JOIN item_sizes isz ON oi.size_id = isz.id
//         WHERE o.status != 'cancelled' -- optional: exclude cancelled
//         ORDER BY o.created_at ASC, o.id, oi.id;
//     `;

//     db.all(query, [], (err, rows) => {
//         if (err) {
//             console.error('Database error:', err.message);
//             return res.status(500).json({ error: 'Internal server error' });
//         }

//         const ordersMap = {};

//         rows.forEach(row => {
//             if (!ordersMap[row.order_id]) {
//                 ordersMap[row.order_id] = {
//                     order_id: row.order_id,
//                     created_at: row.created_at,
//                     items: []
//                 };
//             }

//             ordersMap[row.order_id].items.push({
//                 item_name: row.item_name,
//                 item_size: row.item_size,
//                 quantity: row.quantity,
//                 kitchen_status: row.kitchen_status
//             });
//         });

//         res.json(Object.values(ordersMap));
//     });
// });
