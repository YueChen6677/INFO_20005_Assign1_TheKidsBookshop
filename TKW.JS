// Prod_QuantityButtons
function initQuantity() {
  const minusBtn = document.getElementById('qtyMinus');
  const plusBtn = document.getElementById('qtyPlus');
  const qtyDisplay = document.getElementById('qtyDisplay');
  if (!minusBtn || !plusBtn || !qtyDisplay) return;

  let qty = 0;

  plusBtn.addEventListener('click', function () {
    qty++;
    qtyDisplay.textContent = qty;
  });

  minusBtn.addEventListener('click', function () {
    if (qty > 0) qty--;
    qtyDisplay.textContent = qty;
  });
}

// CartCount
function initCart() {
  const addToCartBtn = document.getElementById('addToCartBtn');
  const cartCountEls = document.querySelectorAll('.cart-count');

  let count = parseInt(sessionStorage.getItem('cartCount') || '0');
  cartCountEls.forEach(function (el) { el.textContent = count; });

  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', function () {
      const qtyDisplay = document.getElementById('qtyDisplay');
      const qty = qtyDisplay ? parseInt(qtyDisplay.textContent) || 1 : 1;
      count += qty;
      sessionStorage.setItem('cartCount', count);
      cartCountEls.forEach(function (el) { el.textContent = count; });
      addToCartBtn.textContent = 'Added!';
      setTimeout(function () { addToCartBtn.textContent = 'Add to Cart'; }, 1500);
    });
  }
}

// Init_ALL
document.addEventListener('DOMContentLoaded', function () {
  initQuantity();
  initCart();
});
