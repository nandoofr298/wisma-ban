// db/database.js
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./db/wismaBan.db", (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to the SQLite database.");
  }
});

// Initialize the database with products if not exists
db.serialize(() => {
  db.run(
    "CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY, name TEXT, price INTEGER, quantity INTEGER)"
  );

  const stmt = db.prepare(
    "INSERT OR IGNORE INTO products (name, price, quantity) VALUES (?, ?, ?)"
  );

  const products = [
    ["a", 1000, 10],
    ["b", 2000, 10],
    ["c", 3000, 10],
    ["d", 4000, 10],
    ["e", 5000, 10],
  ];

  products.forEach(([name, price, quantity]) => {
    stmt.run(name, price, quantity);
  });

  stmt.finalize();
});

module.exports = db;
