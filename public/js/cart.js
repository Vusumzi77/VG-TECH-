document.addEventListener('DOMContentLoaded', () => {
  const cartContainer = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');

  function renderCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cartContainer.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;

      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${item.name}</td>
        <td>R${item.price}</td>
        <td>
          <input type="number" value="${item.quantity}" min="1" data-index="${index}" class="quantity-input">
        </td>
        <td>R${itemTotal}</td>
        <td><button data-index="${index}" class="remove-btn">Remove</button></td>
      `;
      cartContainer.appendChild(row);
    });

    cartTotal.textContent = 'R' + total;

    // Quantity update
    document.querySelectorAll('.quantity-input').forEach(input => {
      input.addEventListener('change', (e) => {
        const index = e.target.dataset.index;
        cart[index].quantity = parseInt(e.target.value);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
      });
    });

    // Remove item
    document.querySelectorAll('.remove-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = e.target.dataset.index;
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
      });
    });
  }

  renderCart();
});
























