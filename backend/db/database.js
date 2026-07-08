const sqlite3 = require('sqlite3').verbose()
const path = require('path')

// Load existing DB file
const db = new sqlite3.Database(path.resolve(__dirname, './food_order_db_1.db'), (err) => {
  if (err) {
    console.error('❌ Failed to connect to DB:', err.message)
  } else {
    console.log('✅ Connected to existing SQLite database')
  }
})

// Do NOT recreate tables here (assuming schema is already defined)

module.exports = db

// db.serialize(() => {
//   db.run(`CREATE TABLE IF NOT EXISTS users (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     name TEXT NOT NULL,
//     mobile TEXT
//   )`)

//   db.run(`CREATE TABLE IF NOT EXISTS menu_items (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     name TEXT NOT NULL,
//     description TEXT,
//     price REAL NOT NULL,
//     available INTEGER DEFAULT 1,
//   )`)

//   db.run(`CREATE TABLE IF NOT EXISTS orders (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     user_id INTEGER,
//     status TEXT DEFAULT 'pending',
//     created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//     FOREIGN KEY (user_id) REFERENCES users(id)
//   )`)

//   db.run(`CREATE TABLE IF NOT EXISTS order_items (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     order_id INTEGER,
//     item_id INTEGER,
//     quantity INTEGER,
//     FOREIGN KEY (order_id) REFERENCES orders(id),
//     FOREIGN KEY (item_id) REFERENCES menu_items(id)
//   )`)
// })
