require('dotenv').config();
const nodemailer = require('nodemailer');

async function sendOrderEmail(toEmail, pdfPath) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.afrihost.co.za', // Afrihost SMTP host
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: 'Your Easytec Order Receipt',
    text: 'Thanks for your order. Please find your receipt attached.',
    attachments: [{ filename: 'easytec-order.pdf', path: pdfPath }]
  };

  return transporter.sendMail(mailOptions);
}

module.exports = sendOrderEmail;
