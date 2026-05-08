const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const PRODUCTS_FILE = path.join(__dirname, '../../data/products.json');
const UPLOADS_DIR = path.join(__dirname, '../../public/uploads');

// ── Multer config ──────────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${unique}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });

// ── Helpers ────────────────────────────────────────────────────────────────
function readProducts() {
  if (!fs.existsSync(PRODUCTS_FILE)) return [];
  return JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf8'));
}

function nextId(products) {
  if (!products.length) return 'ET101';
  const last = products[products.length - 1].id;
  return 'ET' + (parseInt(last.replace('ET', '')) + 1);
}

// ── Routes ─────────────────────────────────────────────────────────────────

// GET /api/products
router.get('/', (_req, res) => {
  res.json(readProducts());
});

// GET /api/products/:id
router.get('/:id', (req, res) => {
  const product = readProducts().find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found.' });
  res.json(product);
});

// POST /api/products  (admin upload)
router.post('/', upload.array('images', 5), (req, res, next) => {
  try {
    const { name, price, description, benefits, specs } = req.body;

    let parsedSpecs = {};
    try {
      parsedSpecs = JSON.parse(specs);
    } catch {
      return res.status(400).json({ message: 'Invalid specs JSON.' });
    }

    const products = readProducts();
    const product = {
      id: nextId(products),
      name,
      price,
      description,
      benefits,
      specs: parsedSpecs,
      images: req.files.map(f => `/uploads/${f.filename}`),
    };

    products.push(product);
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));

    res.status(201).json({ message: 'Product added.', product });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
