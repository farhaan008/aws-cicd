const express = require('express');
const router = express.Router();
const db = require('../db/database');

router.get('/', (_, res) => {
  const query = `
    SELECT c.id AS category_id, c.name AS category_name, COUNT(m.id) AS item_count
    FROM categories c
    LEFT JOIN menu_items m ON m.category_id = c.id
    GROUP BY c.id, c.name
    ORDER BY c.name;`;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Query error:', err.message);
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.json(rows);
  });
});