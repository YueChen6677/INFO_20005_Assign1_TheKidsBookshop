// ===== MOBILE MENU =====
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', function () {
    mobileMenu.classList.toggle('open');
  });

  // Close on outside click
  document.addEventListener('click', function (e) {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.remove('open');
    }
  });
}

// ===== SEARCH BAR - redirect to library page =====
function initSearch() {
  const forms = document.querySelectorAll('.search-form');
  forms.forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const input = form.querySelector('input');
      const query = input ? input.value.trim() : '';
      window.location.href = 'library.html?q=' + encodeURIComponent(query);
    });
  });

  // Also handle header search input (enter key)
  const headerInput = document.getElementById('headerSearchInput');
  if (headerInput) {
    headerInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        const query = headerInput.value.trim();
        window.location.href = 'library.html?q=' + encodeURIComponent(query);
      }
    });
  }
}

// ===== LIBRARY: read URL query and populate search =====
function initLibrarySearch() {
  const params = new URLSearchParams(window.location.search);
  const q = params.get('q');
  const searchInput = document.getElementById('librarySearchInput');
  if (searchInput && q) {
    searchInput.value = q;
  }

  // Filter chips
  const chips = document.querySelectorAll('.filter-chip');
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      chips.forEach(function (c) { c.classList.remove('active'); });
      chip.classList.add('active');
    });
  });

  // Age range checkboxes
  const ageBoxes = document.querySelectorAll('.age-checkbox');
  ageBoxes.forEach(function (box) {
    box.addEventListener('change', function () {
      // Simple visual feedback - real filtering would need a backend
      console.log('Age filter:', box.value, box.checked);
    });
  });

  // Library search form
  const libForm = document.getElementById('librarySearchForm');
  if (libForm) {
    libForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const input = document.getElementById('librarySearchInput');
      const query = input ? input.value.trim() : '';
      window.location.href = 'library.html?q=' + encodeURIComponent(query);
    });
  }
}

// ===== PRODUCT PAGE: quantity buttons =====
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

// ===== CART COUNT (simple session memory) =====
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

// ===== INIT ALL =====
document.addEventListener('DOMContentLoaded', function () {
  initMobileMenu();
  initSearch();
  initLibrarySearch();
  initQuantity();
  initCart();
});
