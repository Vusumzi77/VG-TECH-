let userCurrency = 'ZAR';
let userLocale = 'en-ZA';

try {
  const region = Intl.DateTimeFormat().resolvedOptions().locale;
  if (region.startsWith('en-US')) {
    userCurrency = 'USD';
    userLocale = 'en-US';
  } else if (region.startsWith('en-GB')) {
    userCurrency = 'GBP';
    userLocale = 'en-GB';
  } else if (region.startsWith('en-KE')) {
    userCurrency = 'KES';
    userLocale = 'en-KE';
  } else {
    userCurrency = 'ZAR';
    userLocale = 'en-ZA';
  }
} catch (error) {
  console.warn("Could not auto-detect locale. Defaulting to ZAR.");
}

document.addEventListener('DOMContentLoaded', () => {
  const productsContainer = document.getElementById('productGrid');
  const searchInput = document.getElementById('searchBar');
  const specSearch = document.getElementById('specSearch');
  const categoryFilter = document.getElementById('categoryFilter');
  const minPrice = document.getElementById('minPrice');
  const maxPrice = document.getElementById('maxPrice');
  const minPriceValue = document.getElementById('minPriceValue');
  const maxPriceValue = document.getElementById('maxPriceValue');

  let allProducts = [];

  function formatCurrency(value, currency = 'ZAR', locale = 'en-ZA') {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(value);
  }

  function getImagePath(imagesArray) {
  if (imagesArray && imagesArray.length > 0) {
    const path = imagesArray[0];
    return path.startsWith('/') ? path : `/uploads/${path}`;
  }
  return 'img/placeholder.jpg'; // or wherever your placeholder is
}

  function renderProducts(products) {
    productsContainer.innerHTML = '';
    if (products.length === 0) {
      productsContainer.innerHTML = '<p>No products found.</p>';
      return;
    }

    products.forEach(product => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <div class="product-image">
          <img src="${getImagePath(product.images)}" alt="${product.name}">
        </div>
        <h3 class="product-title">${product.name}</h3>
        <p class="product-price">${formatCurrency(product.price, userCurrency, userLocale)}</p>
        <a href="product.html?id=${product.id}" class="btn">View Product</a>
      `;
      productsContainer.appendChild(card);
    });
  }

  function applyFilters() {
    const searchText = searchInput.value.toLowerCase();
    const specText = specSearch.value.toLowerCase();
    const selectedCategory = categoryFilter.value;
    const min = parseInt(minPrice.value);
    const max = parseInt(maxPrice.value);

    const filtered = allProducts.filter(p => {
      const nameMatch = p.name.toLowerCase().includes(searchText);
      const descMatch = p.description?.toLowerCase().includes(searchText);
      const specMatch = p.specs?.toLowerCase().includes(specText);
      const categoryMatch = selectedCategory ? p.category === selectedCategory : true;
      const priceMatch = p.price >= min && p.price <= max;

      return (nameMatch || descMatch) && specMatch && categoryMatch && priceMatch;
    });

    renderProducts(filtered);
  }

  function loadProducts() {
    fetch('products.json')
      .then(response => response.json())
      .then(products => {
        allProducts = products;
        renderProducts(products);

        searchInput.addEventListener('input', applyFilters);
        specSearch.addEventListener('input', applyFilters);
        categoryFilter.addEventListener('change', applyFilters);
        minPrice.addEventListener('input', () => {
          minPriceValue.textContent = minPrice.value;
          applyFilters();
        });
        maxPrice.addEventListener('input', () => {
          maxPriceValue.textContent = maxPrice.value;
          applyFilters();
        });
      })
      .catch(error => {
        console.error('Error loading products:', error);
        productsContainer.innerHTML = '<p>Error loading products.</p>';
      });
  }

  loadProducts();
});

document.addEventListener("DOMContentLoaded", () => {
  const minSlider = document.getElementById("minPrice");
  const maxSlider = document.getElementById("maxPrice");
  const minDisplay = document.getElementById("minPriceDisplay");
  const maxDisplay = document.getElementById("maxPriceDisplay");

  if (minSlider && maxSlider && minDisplay && maxDisplay) {
    minSlider.addEventListener("input", () => {
      minDisplay.textContent = "R" + minSlider.value;
    });

    maxSlider.addEventListener("input", () => {
      maxDisplay.textContent = "R" + maxSlider.value;
    });
  }
});
