# VG-TECH

Buy and sell laptops platform — Node.js + Express backend, vanilla HTML/CSS/JS frontend.

## Project structure

```
VG-TECH/
├── server/                  ← Node.js backend
│   ├── app.js               ← Express app setup (middleware, routes)
│   ├── server.js            ← Entry point — starts the HTTP server
│   ├── routes/
│   │   ├── orders.js        ← POST /api/orders/submit
│   │   └── products.js      ← GET/POST /api/products
│   ├── services/
│   │   ├── emailService.js  ← Sends order receipts via Nodemailer
│   │   └── pdfService.js    ← Generates order PDFs with PDFKit
│   └── middleware/
│       └── errorHandler.js  ← Central Express error handler
│
├── public/                  ← Served statically (browser-facing)
│   ├── pages/               ← HTML pages
│   ├── css/                 ← Stylesheets
│   ├── js/                  ← Client-side JavaScript
│   └── uploads/             ← User-uploaded product images
│
├── admin/
│   └── product-uploader.html  ← Internal tool to add products
│
├── data/
│   ├── products.json        ← Product catalogue (source of truth)
│   └── orders.json          ← Order log (auto-created on first order)
│
├── .env                     ← Environment variables (never commit this)
├── .gitignore
└── package.json
```

## Setup

```bash
npm install
cp .env .env.local        # fill in your real credentials
npm run dev               # starts with nodemon for hot-reload
```

## Environment variables

| Variable    | Description                        |
|-------------|------------------------------------|
| PORT        | Server port (default 3000)         |
| SMTP_HOST   | SMTP server hostname               |
| SMTP_PORT   | SMTP port (465 for SSL)            |
| EMAIL_USER  | Sending email address              |
| EMAIL_PASS  | Email password                     |

## API endpoints

| Method | Path                   | Description                      |
|--------|------------------------|----------------------------------|
| GET    | /api/products          | Returns all products             |
| GET    | /api/products/:id      | Returns one product              |
| POST   | /api/products          | Add a product (multipart/form)   |
| POST   | /api/orders/submit     | Submit an order, send receipt    |

## Notes

- `notify.php` has been removed — payment gateway notifications should be
  handled via a Node route (`/api/notifications`) using the same SMTP setup.
- `products.json` was moved from `public/js/` to `data/` so it is not
  directly accessible by browsers. It is now served through the API only.
- `mongoose` was in the original `package.json` but was never used. It has
  been removed to keep the dependency footprint honest.
