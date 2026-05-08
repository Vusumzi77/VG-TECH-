const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const emailService = require('../services/emailService');
const pdfService = require('../services/pdfService');

const ORDER_LOG = path.join(__dirname, '../../data/orders.json');
const RECEIPTS_DIR = path.join(__dirname, '../../data/receipts');

// Ensure the receipts directory exists
if (!fs.existsSync(RECEIPTS_DIR)) fs.mkdirSync(RECEIPTS_DIR, { recursive: true });

// POST /api/orders/submit
router.post('/submit', async (req, res, next) => {
  try {
    const order = req.body;

    if (!order || !order.email || !order.items) {
      return res.status(400).json({ success: false, message: 'Invalid order data.' });
    }

    // Persist order to data/orders.json
    const orders = fs.existsSync(ORDER_LOG)
      ? JSON.parse(fs.readFileSync(ORDER_LOG, 'utf8'))
      : [];
    orders.push(order);
    fs.writeFileSync(ORDER_LOG, JSON.stringify(orders, null, 2));

    // Generate PDF receipt
    const pdfPath = path.join(RECEIPTS_DIR, `${order.id}.pdf`);
    await pdfService.generate(order, pdfPath);

    // Email the receipt to the customer
    await emailService.sendOrderReceipt(order.email, pdfPath);

    res.status(200).json({ success: true });
  } catch (err) {
    next(err); // passes to errorHandler middleware
  }
});

module.exports = router;
