const express = require('express');
const router = express.Router();
const path = require('path');
const generateOrderPDF = require('../utils/pdfGenerator');
const sendOrderEmail = require('../utils/emailSender');
const fs = require('fs');

router.post('/submit', async (req, res) => {
  const order = req.body;

  // Save order log (e.g., append to a file or database)
  const orderLogPath = path.join(__dirname, '../logs/orders.json');
  const orders = fs.existsSync(orderLogPath) ? JSON.parse(fs.readFileSync(orderLogPath)) : [];
  orders.push(order);
  fs.writeFileSync(orderLogPath, JSON.stringify(orders, null, 2));

  // Create and email PDF
  const pdfPath = path.join(__dirname, `../receipts/${order.id}.pdf`);
  generateOrderPDF(order, pdfPath);

  try {
    await sendOrderEmail(order.email, pdfPath);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to send email.' });
  }
});

module.exports = router;
