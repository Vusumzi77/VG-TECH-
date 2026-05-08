// Fetch products and display them
fetch('/api/products')
  .then(res => res.json())
  .then(products => {
    const productGrid = document.getElementById('productGrid');
    products.slice(0, 4).forEach(product => {
      const imageUrl = product.images?.[0] || 'placeholder.jpg'; // Safely get first image

      const card = document.createElement('div');
      card.className = 'product-card';

      card.innerHTML = `
        <img src="${imageUrl}" alt="${product.name}" />
        <h3>${product.name}</h3>
        <p>${product.specs?.processor || ''}</p>
        <span class="price">R${product.price}</span>
        <a href="product.html?id=${product.id}" class="btn btn-outline">View Product</a>
      `;

      productGrid.appendChild(card);
    });
  })
  .catch(error => {
    console.error('Error loading products:', error);
  });
