require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');

const orderRoutes = require('./routes/orders');
const productRoutes = require('./routes/products');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// ── Middleware ─────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Static assets (CSS, JS, images) ───────────────────────
app.use(express.static(path.join(__dirname, '../public')));
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// ── Page routes (clean URLs) ───────────────────────────────
const pages = path.join(__dirname, '../public/pages');

app.get('/',             (req, res) => res.sendFile(path.join(pages, 'index.html')));
app.get('/shop',         (req, res) => res.sendFile(path.join(pages, 'shop.html')));
app.get('/product',      (req, res) => res.sendFile(path.join(pages, 'product.html')));
app.get('/cart',         (req, res) => res.sendFile(path.join(pages, 'cart.html')));
app.get('/checkout',     (req, res) => res.sendFile(path.join(pages, 'checkout.html')));
app.get('/sell',         (req, res) => res.sendFile(path.join(pages, 'sell.html')));
app.get('/how-it-works', (req, res) => res.sendFile(path.join(pages, 'how-it-works.html')));
app.get('/success',      (req, res) => res.sendFile(path.join(pages, 'success.html')));

// ── API routes ─────────────────────────────────────────────
app.use('/api/orders',   orderRoutes);
app.use('/api/products', productRoutes);

// ── 404 — unknown routes go back to homepage ───────────────
app.use((req, res) => {
  res.status(404).sendFile(path.join(pages, 'index.html'));
});

// ── Error handler (must be last) ───────────────────────────
app.use(errorHandler);

module.exports = app;
