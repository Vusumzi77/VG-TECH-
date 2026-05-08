const PDFDocument = require('pdfkit');
const fs = require('fs');

/**
 * Generates an order receipt PDF and writes it to `filepath`.
 * Returns a Promise that resolves when the file is fully written.
 *
 * @param {object} order    - order data object
 * @param {string} filepath - absolute destination path for the PDF
 */
function generate(order, filepath) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filepath);

    doc.pipe(stream);

    // ── Header ────────────────────────────────────────────────────────────
    doc
      .fontSize(28)
      .fillColor('#0056b3')
      .font('Helvetica-Bold')
      .text('VG-TECH', { align: 'center' });

    doc.moveDown();

    // ── Customer details ──────────────────────────────────────────────────
    doc.fillColor('black').fontSize(12);
    doc.text(`Order ID: ${order.id}`);
    doc.text(`Name: ${order.name}`);
    doc.text(`Email: ${order.email}`);
    doc.text(`Phone: ${order.phone}`);
    doc.text(`Address: ${order.address}`);
    doc.moveDown();

    // ── Items ─────────────────────────────────────────────────────────────
    doc.text('Items ordered:');
    (order.items || []).forEach(item => {
      doc.text(`  • ${item.quantity} × ${item.name}  @  R${item.price}`);
    });

    doc.moveDown();
    doc.fontSize(14).text(`Total: R${order.total}`, { align: 'right' });

    doc.end();

    stream.on('finish', resolve);
    stream.on('error', reject);
  });
}

module.exports = { generate };
