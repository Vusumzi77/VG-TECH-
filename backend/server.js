// server.js
const express = require("express");
const fs = require("fs");
const orderRoutes = require("./routes/orders");
const path = require("path");
const multer = require("multer");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use("/api/orders", orderRoutes);
app.use(express.static(path.join(__dirname, "public")));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));


// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  }
});

const upload = multer({ storage });

// Utility to get next product ID
function getNextProductId() {
  const filePath = path.join(__dirname, "products.json");
  if (!fs.existsSync(filePath)) return "ET101";
  const products = JSON.parse(fs.readFileSync(filePath));
  if (!products.length) return "ET101";

  const lastId = products[products.length - 1].id;
  const num = parseInt(lastId.replace("ET", ""));
  return "ET" + (num + 1);
}

// Endpoint to handle product upload
app.post("/upload", upload.array("images", 5), (req, res) => {
  try {
    const { name, price, description, benefits, specs } = req.body;
    const files = req.files;

    console.log("🟡 Upload received:", { name, price, description, benefits, specs });
    console.log("🟡 Files uploaded:", files.map(f => f.filename));

    let parsedSpecs = {};
    try {
      parsedSpecs = JSON.parse(specs);
    } catch (e) {
      console.error("❌ Failed to parse specs:", specs);
      return res.status(400).json({ message: "Invalid specs format", specs });
    }

    const imagePaths = files.map(file => `/uploads/${file.filename}`);

    const product = {
      id: getNextProductId(),
      name,
      price,
      description,
      benefits,
      specs: parsedSpecs,
      images: imagePaths,
    };

    const filePath = path.join(__dirname, "products.json");
    let products = [];
    if (fs.existsSync(filePath)) {
      products = JSON.parse(fs.readFileSync(filePath));
    }

    products.push(product);
    fs.writeFileSync(filePath, JSON.stringify(products, null, 2));

    console.log("✅ Product saved:", product);

    res.status(200).json({ message: "Product added", product });
  } catch (error) {
    console.error("❌ Server crash error:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

// Serve products.json
app.get("/products", (req, res) => {
  const filePath = path.join(__dirname, "products.json");
  if (fs.existsSync(filePath)) {
    const products = JSON.parse(fs.readFileSync(filePath));
    res.json(products);
  } else {
    res.json([]);
  }
});

// Serve uploads statically

// Expose uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
