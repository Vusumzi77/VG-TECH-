const PDFDocument = require('pdfkit');
const fs = require('fs');

function generateOrderPDF(orderData, filepath) {
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(filepath));

  // Mimic the text-based 'easytec' logo
  doc
    .fontSize(28)
    .fillColor('#0056b3') // Your logo color
    .font('Helvetica-Bold')
    .text('easytec', { align: 'center' });

  doc.moveDown();

  // Customer details
  doc.fillColor('black').fontSize(12);
  doc.text(`Order ID: ${orderData.id}`);
  doc.text(`Customer Name: ${orderData.name}`);
  doc.text(`Email: ${orderData.email}`);
  doc.text(`Phone: ${orderData.phone}`);
  doc.text(`Address: ${orderData.address}`);
  doc.moveDown();

  // Items
  doc.text('Items:');
  orderData.items.forEach(item => {
    doc.text(`- ${item.quantity} x ${item.name} @ R${item.price}`);
  });

  doc.moveDown();
  doc.fontSize(14).text(`Total: R${orderData.total}`, { align: 'right' });

  doc.end();
}

module.exports = generateOrderPDF;
