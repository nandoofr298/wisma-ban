// server.js
const express = require("express");
const next = require("next");
const db = require("./db/database");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Middleware for parsing JSON request bodies
  server.use(express.json());

  // Login route
  server.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    if (username === "admin" && password === "admin") {
      return res.status(200).json({ message: "Login successful" });
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  });

  // Products route
  server.get("/api/products", (req, res) => {
    db.all("SELECT * FROM products", [], (err, rows) => {
      if (err) {
        return res.status(500).json({ message: "Failed to fetch products" });
      }
      res.status(200).json(rows);
    });
  });

  // Checkout route
  server.post("/api/checkout", (req, res) => {
    const { products } = req.body;
    let total = 0;

    // Calculate the total price for selected products
    products.forEach(({ id, quantity }) => {
      db.get(
        "SELECT price, quantity FROM products WHERE id = ?",
        [id],
        (err, row) => {
          if (err || !row) {
            return res
              .status(500)
              .json({ message: "Failed to fetch product data" });
          }

          if (row.quantity < quantity) {
            return res
              .status(400)
              .json({ message: `Not enough stock for product ${id}` });
          }

          total += row.price * quantity;

          // Update the quantity in the database
          db.run("UPDATE products SET quantity = quantity - ? WHERE id = ?", [
            quantity,
            id,
          ]);
        }
      );
    });

    return res.status(200).json({ total });
  });

  // Catch all for handling Next.js pages
  server.all("*", (req, res) => {
    return handle(req, res);
  });

  // Change from localhost to 0.0.0.0 to listen on all network interfaces
  server.listen(3001, "0.0.0.0", (err) => {
    if (err) throw err;
    console.log("> Ready on http://0.0.0.0:3001");
  });
});
