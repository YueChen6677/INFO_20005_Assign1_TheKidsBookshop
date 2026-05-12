function updateCartCountBadges() {
  var cart = getCart();
  var total = cart.reduce(function(sum, item) { return sum + item.qty; }, 0);
  document.querySelectorAll('.cart-count').forEach(function(el) {
    el.textContent = total;
  });
  // Also update the banner count if on cart page
  var bannerCount = document.getElementById('bannerItemCount');
  if (bannerCount) {
    bannerCount.textContent = total + ' Item' + (total !== 1 ? 's' : '') + ' in bag';
  }
}
