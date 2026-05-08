document.addEventListener('DOMContentLoaded', () => {
  const summary = document.getElementById('checkout-summary');
  const confirmBtn = document.getElementById('confirm-checkout');

  function loadCheckout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    summary.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
      summary.innerHTML = "<p>Your cart is empty.</p>";
      return;
    }

    cart.forEach(item => {
      const itemTotal = (item.price * item.quantity).toFixed(2);
      total += parseFloat(itemTotal);

      const itemDiv = document.createElement('div');
      itemDiv.className = 'checkout-item';
      itemDiv.innerHTML = `
        <p><strong>${item.name}</strong> x ${item.quantity}</p>
        <p>R${itemTotal}</p>
      `;
      summary.appendChild(itemDiv);
    });

    const totalDiv = document.createElement('div');
    totalDiv.className = 'checkout-total';
    totalDiv.innerHTML = `<strong>Total: R${total.toFixed(2)}</strong>`;
    summary.appendChild(totalDiv);
  }

  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      const name = document.querySelector('input[name="name"]').value;
      const email = document.querySelector('input[name="email"]').value;
      const address = document.querySelector('input[name="address"]').value;
      const phone = document.querySelector('input[name="phone"]').value;

      if (!name || !email || !address || !phone) {
        alert("Please fill in all required fields.");
        return;
      }

const cart = JSON.parse(localStorage.getItem('cart')) || [];
const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
const orderId = `ET-${Date.now()}`;

const order = {
  id: orderId,
  name,
  email,
  phone,
  address,
  items: cart,
  total
};

fetch('/api/orders/submit', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(order)
})
.then(res => res.json())
.then(data => {
  if (data.success) {
    localStorage.removeItem('cart');
    showConfirmationMessage(name, email, address);
  } else {
    alert("Something went wrong while processing your order.");
  }
})
.catch(err => {
  console.error(err);
  alert("Error connecting to server. Please try again later.");
});

    });
  }

  loadCheckout();
  function showConfirmationMessage(name, email, address) {
  const container = document.querySelector('.checkout-container');
container.innerHTML = `
  <div class="confirmation-message">
    <h2>🎉 Congratulations, ${name}!</h2>
    <p>Your order has been received and is being processed.</p>
    <p>It will be delivered to:</p>
    <p><strong>${address}</strong></p>
    <p>A confirmation has been sent to <strong>${email}</strong>.</p>
    <p class="cash-notice">Please have your cash ready at the point of delivery.</p>
  </div>
`;
}

});
