const nodemailer = require('nodemailer');

// The transporter is created once and reused (not once per request)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.afrihost.co.za',
  port: parseInt(process.env.SMTP_PORT, 10) || 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Sends an order receipt PDF to the customer.
 * @param {string} toEmail  - customer email address
 * @param {string} pdfPath  - absolute path to the generated PDF
 */
async function sendOrderReceipt(toEmail, pdfPath) {
  return transporter.sendMail({
    from: `"VG-TECH Orders" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Your VG-TECH Order Receipt',
    text: 'Thank you for your order. Please find your receipt attached.',
    attachments: [{ filename: 'vgtech-order.pdf', path: pdfPath }],
  });
}

module.exports = { sendOrderReceipt };
