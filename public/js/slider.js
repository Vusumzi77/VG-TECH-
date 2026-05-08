<script>
  document.addEventListener('DOMContentLoaded', () => {
    fetch('products.json')
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to load products.json');
        }
        return res.json();
      })
      .then(data => {
        const slider = document.getElementById('sliderContainer');
        if (!slider) {
          console.error("Slider container not found in DOM.");
          return;
        }

        const specials = data.slice(0, 4); // First 4 items as specials

        specials.forEach(product => {
          if (!product || !product.images || product.images.length === 0) {
            console.warn("Skipping product due to missing image:", product);
            return;
          }

          const item = document.createElement('div');
          item.className = 'slider-item';
          item.innerHTML = `
            <img src="${product.images[0]}" alt="${product.name}" />
            <h3>${product.name}</h3>
            <p class="price">R${product.price}</p>
            <a href="product.html?id=${product.id}" class="btn btn-outline">View</a>
          `;
          slider.appendChild(item);
        });
      })
      .catch(error => {
        console.error('Error loading specials slider:', error);
      });
  });
</script>
