const express = require('express')
const router = express.Router()
const db = require('../db/database')

router.get('/', (_, res) => {
  const query = `SELECT
    m.id AS item_id,
    m.name AS item_name,
    m.description,
    m.image_url,
    m.available,
    c.id AS category_id,
    c.name AS category_name,
    sz.id AS size_id,
    sz.size,
    COALESCE(sz.price, m.price) AS price
  FROM menu_items m
  LEFT JOIN categories c ON m.category_id = c.id
  LEFT JOIN item_sizes sz ON sz.menu_item_id = m.id
  ORDER BY c.name, m.name, sz.size;`


  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Query error:', err.message);
      return res.status(500).json({ error:`${err.message}`, message: 'Database query failed', status: 'error', statusCode: 500 });
    }
    const categoryMap = {};
    rows.forEach(row => {
      const category = row.category_name || 'Others';
      if (!categoryMap[category]) {
        categoryMap[category] = {};
      }

      const itemKey = row.item_id;
      const hasSize = row.size_id !== null;

      if (!categoryMap[category][itemKey]) {
        categoryMap[category][itemKey] = {
          id: row.item_id,
          name: row.item_name,
          description: row.description,
          imageUrl: row.image_url,
          available: !!row.available,
          categoryId: row.category_id,
          categoryName: row.category_name,
          ...(hasSize ? {} : { price: row.price }) // Only add top-level price now if no sizes
        };

        if (hasSize) {
          categoryMap[category][itemKey].sizes = [];
          categoryMap[category][itemKey].prices = [];
        }
      }

      if (hasSize) {
        categoryMap[category][itemKey].sizes.push({
          sizeId: row.size_id,
          size: row.size
        });

        categoryMap[category][itemKey].prices.push({
          sizeId: row.size_id,
          price: row.price
        });
      }
    });

    const sortedMenu = {};

    Object.keys(categoryMap).sort((a, b) => a.localeCompare(b))
      .forEach(category => {
        const items = Object.values(categoryMap[category]).map(item => {
          if (item.sizes && item.prices) {
            item.sizes.sort((a, b) => a.sizeId - b.sizeId);
            item.prices.sort((a, b) => a.sizeId - b.sizeId);

            // Set top-level sizeId and price from smallest size
            item.sizeId = item.sizes[0]?.sizeId || null;
            item.price = item.prices[0]?.price || null;
          }
          return item;
        });

        sortedMenu[category] = items;
      });

    res.json({ data: sortedMenu, message: 'Data fetched successfully', status: 'success', statusCode: 200 });
  });

})

router.post('/', (req, res) => {
  const { name, description, price } = req.body
  db.run(`INSERT INTO menu_items (name, description, price) VALUES (?, ?, ?)`, [name, description, price], function (err) {
    if (err) return res.status(500).json({ error: 'Insert error' })
    res.json({ item_id: this.lastID })
  })
})

module.exports = router
