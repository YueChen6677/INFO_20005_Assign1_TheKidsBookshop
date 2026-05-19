
function getCart() {
  try { return JSON.parse(sessionStorage.getItem('tkwCart')) || []; }
  catch(e) { return []; }
}

function saveCart(cart) {
  sessionStorage.setItem('tkwCart', JSON.stringify(cart));
}

function cartTotalQty(cart) {
  return cart.reduce(function(s, i){ return s + i.qty; }, 0);
}

function cartSubtotal(cart) {
  return cart.reduce(function(s, i){ return s + i.price * i.qty; }, 0);
}

// Update every .cart-count badge + the cart-page banner count
function refreshBadges() {
  var cart  = getCart();
  var total = cartTotalQty(cart);

  document.querySelectorAll('.cart-count').forEach(function(el){
    el.textContent = total;
  });

  var banner = document.getElementById('bannerItemCount');
  if (banner) {
    banner.textContent = total + ' Item' + (total !== 1 ? 's' : '') + ' in bag';
  }
}

// Update the summary panel (subtotal + total) on any page that has it
function refreshSummary() {
  var cart     = getCart();
  var subtotal = cartSubtotal(cart);

  document.querySelectorAll('.js-subtotal').forEach(function(el){
    el.textContent = '$' + subtotal.toFixed(2);
  });
  document.querySelectorAll('.js-total-large').forEach(function(el){
    el.textContent = subtotal.toFixed(2);
  });
}


//ProductPage

function initQuantity() {
  var minusBtn   = document.getElementById('qtyMinus');
  var plusBtn    = document.getElementById('qtyPlus');
  var qtyDisplay = document.getElementById('qtyDisplay');
  if (!minusBtn || !plusBtn || !qtyDisplay) return;

  var qty = 0;
  plusBtn.addEventListener('click', function(){
    qty++;
    qtyDisplay.textContent = qty;
  });
  minusBtn.addEventListener('click', function(){
    if (qty > 0) qty--;
    qtyDisplay.textContent = qty;
  });
}

function initAddToCart() {
  var btn = document.getElementById('addToCartBtn');
  if (!btn) return;

  // Read book info from the page
  var body  = document.body;
  var id    = body.getAttribute('data-book-id');
  var title = body.getAttribute('data-book-title');
  var price = parseFloat(body.getAttribute('data-book-price'));
  var img   = body.getAttribute('data-book-img');

  btn.addEventListener('click', function(){
    var qtyDisplay = document.getElementById('qtyDisplay');
    var qty = qtyDisplay ? (parseInt(qtyDisplay.textContent) || 1) : 1;
    if (qty < 1) qty = 1;

    var cart = getCart();
    var existing = null;
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].id === id) { existing = cart[i]; break; }
    }

    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({ id: id, title: title, price: price, img: img, qty: qty });
    }

    saveCart(cart);
    refreshBadges();
    refreshSummary();

    btn.textContent = 'Added!';
    setTimeout(function(){ btn.textContent = 'Add to Cart'; }, 1500);
  });
}


//CartPage

function renderCartItems() {
  var list  = document.getElementById('cartItemsList');
  var empty = document.getElementById('cartEmpty');
  if (!list) return;

  var cart = getCart();

  if (cart.length === 0) {
    list.innerHTML = '';
    if (empty) empty.style.display = 'block';
    return;
  }
  if (empty) empty.style.display = 'none';

  list.innerHTML = cart.map(function(item){
    return (
      '<div class="cart-item" data-id="' + item.id + '">' +
        '<div class="cart-item-img">' +
          '<img src="' + item.img + '" alt="' + item.title + '" />' +
        '</div>' +
        '<div class="cart-item-info">' +
          '<div class="cart-item-title">' + item.title + '</div>' +
          '<div class="cart-item-edition">Hardcover Edition</div>' +
          '<div class="cart-item-price">$' + item.price.toFixed(2) + '</div>' +
        '</div>' +
        '<div class="cart-item-right">' +
        '<div class="cart-item-actions">' +
        '<button class="cart-remove">Remove</button>' +
        '</div>' +
        '<div class="qty-control">' +
            '<button class="qty-btn cart-minus">−</button>' +
            '<span class="qty-num">' + item.qty + '</span>' +
            '<button class="qty-btn cart-plus">+</button>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }).join('');

  // Wire up +/−/remove buttons
  list.querySelectorAll('.cart-item').forEach(function(row){
    var id = row.getAttribute('data-id');

    row.querySelector('.cart-plus').addEventListener('click', function(){
      changeQty(id, 1);
    });
    row.querySelector('.cart-minus').addEventListener('click', function(){
      changeQty(id, -1);
    });
    row.querySelector('.cart-remove').addEventListener('click', function(){
      removeItem(id);
    });
  });
}

function changeQty(id, delta) {
  var cart = getCart();
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].id === id) {
      cart[i].qty += delta;
      if (cart[i].qty <= 0) { cart.splice(i, 1); }
      break;
    }
  }
  saveCart(cart);
  renderCartItems();
  refreshBadges();
  refreshSummary();
}

function removeItem(id) {
  var cart = getCart().filter(function(item){ return item.id !== id; });
  saveCart(cart);
  renderCartItems();
  refreshBadges();
  refreshSummary();
}


//Init
document.addEventListener('DOMContentLoaded', function(){
  refreshBadges();
  refreshSummary();
  initQuantity();
  initAddToCart();
  renderCartItems();  
});