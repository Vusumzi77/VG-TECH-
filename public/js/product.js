document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get('id');
  console.log('Product ID from URL:', productId);

  fetch('products.json')
    .then(response => response.json())
    .then(products => {
      console.log('Loaded products:', products);
      const product = products.find(p => p.id === productId);
      console.log('Matched product:', product);

      if (!product) {
        console.warn(`Product with ID "${productId}" not found.`);
        document.getElementById('productName').textContent = 'Product not found';
        return;
      }

      // Image
      const imageUrl = product.images && product.images.length > 0 ? product.images[0] : 'images/placeholder.jpg';
      const imageContainer = document.getElementById('productImage');
      imageContainer.innerHTML = `
        <img src="${imageUrl}" alt="${product.name}" onerror="this.src='images/placeholder.jpg'" />
      `;

      // Basic info
      document.getElementById('productName').textContent = product.name;
      document.getElementById('productPrice').textContent = 'R' + product.price;
      document.getElementById('productDescription').textContent = product.description;

      // Long description
      const longDesc = product.benefits || 'This is a great choice for performance and reliability.';
      const longDescElement = document.getElementById('productLongDescription');
      longDescElement.textContent = longDesc;
      longDescElement.classList.remove('expanded');

      const readMoreBtn = document.getElementById('readMoreBtn');
      readMoreBtn.style.display = longDesc.length > 200 ? 'inline-block' : 'none';

      // Specs
      const specs = product.specs || {};
      const specsList = document.getElementById('productSpecs');
      specsList.innerHTML = '';

      const addSpec = (label, value) => {
        if (value && value.trim() !== '') {
          specsList.innerHTML += `<li><strong>${label}:</strong> ${value}</li>`;
        }
      };

      addSpec('Processor', specs.processor);
      addSpec('RAM', specs.ram);
      addSpec('Storage', specs.storage);
      addSpec('Display', specs.display);
      addSpec('Graphics', specs.graphics);
      addSpec('Other', specs.other);
    })
    .catch(error => {
      console.error('Error loading product:', error);
    });
});

// ✅ Move these to the global scope
function addToCart() {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get('id');

  fetch('products.json')
    .then(response => response.json())
    .then(products => {
      const product = products.find(p => p.id === productId);
      if (!product) return alert("Product not found");

      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      const existing = cart.find(p => p.id === product.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      alert(`${product.name} added to cart.`);
    });
}

function buyNow() {
  addToCart();
  window.location.href = 'checkout.html';
}

function toggleWhy() {
  const desc = document.getElementById('productLongDescription');
  desc.classList.toggle('expanded');
}

function expandWhy() {
  const desc = document.getElementById('productLongDescription');
  desc.classList.add('expanded');
  const btn = document.getElementById('readMoreBtn');
  btn.style.display = 'none';
}
