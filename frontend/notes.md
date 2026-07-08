const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

// Connect to SQLite database
const dbPath = path.join(__dirname, 'db', 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) return console.error('DB connection error:', err.message);
    console.log('Connected to SQLite database.');
});

// GET /menu - returns all menu items with category
app.get('/menu', (req, res) => {
    const query = `
        SELECT 
            m.id AS item_id,
            m.name AS item_name,
            m.description,
            m.price,
            m.available,
            c.id AS category_id,
            c.name AS category_name
        FROM menu_items m
        LEFT JOIN categories c ON m.category_id = c.id
        ORDER BY c.name, m.name;
    `;

    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Query error:', err.message);
            return res.status(500).json({ error: 'Database query failed' });
        }

        // Optional: group by category in the response
        const menu = {};
        rows.forEach(row => {
            const category = row.category_name || 'Uncategorized';
            if (!menu[category]) menu[category] = [];
            menu[category].push({
                id: row.item_id,
                name: row.item_name,
                description: row.description,
                price: row.price,
                available: !!row.available
            });
        });

        res.json(menu);
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
