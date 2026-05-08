require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');

const orderRoutes = require('./routes/orders');
const productRoutes = require('./routes/products');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// ── Middleware ─────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Static files ───────────────────────────────────────────────────────────
// Serve the public folder (HTML pages, CSS, client-side JS)
app.use(express.static(path.join(__dirname, '../public')));

// Uploaded product images are served under /uploads
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// ── API routes ─────────────────────────────────────────────────────────────
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);

// ── Error handling (must be last) ──────────────────────────────────────────
app.use(errorHandler);

module.exports = app;
