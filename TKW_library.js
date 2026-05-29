//sortBy
const dropdown = document.querySelector('.sortBy-dropdown');
const selected = dropdown.querySelector('.sortBy-selected');
const options = dropdown.querySelectorAll('.sortBy-options li');

selected.addEventListener('click', () => dropdown.classList.toggle('open'));

options.forEach(opt => {
  opt.addEventListener('click', () => {
    options.forEach(o => o.classList.remove('active'));
    opt.classList.add('active');
    selected.childNodes[0].textContent = opt.textContent + ' ';
    dropdown.classList.remove('open');
  });
});

document.addEventListener('click', e => {
  if (!dropdown.contains(e.target)) dropdown.classList.remove('open');
});

//Search Popup
(function () {
  const input = document.getElementById('librarySearchInput');
  const form  = document.getElementById('librarySearchForm');
  const popup = document.getElementById('searchPopup');

  if (!input || !popup) return;

  // click input or form to open
  input.addEventListener('focus', () => popup.classList.add('open'));
  form.addEventListener('click', () => popup.classList.add('open'));

  // click elsewhere to close
  document.addEventListener('click', (e) => {
    if (!form.contains(e.target) && !popup.contains(e.target)) {
      popup.classList.remove('open');
    }
  });
})();

//Sidebar toggles
document.querySelectorAll('.sidebar-toggle').forEach(btn => {
  const targetId = btn.getAttribute('data-target');
  const content = document.getElementById(targetId);
  const arrow = btn.querySelector('svg');

  //Click to hide/toggle
  btn.addEventListener('click', () => {
    const isOpen = content.style.display !== 'none';
    content.style.display = isOpen ? 'none' : 'flex';
    arrow.style.transform = isOpen ? 'rotate(-180deg)' : 'rotate(0deg)';
  });
});

//Init
document.addEventListener('DOMContentLoaded', function(){
    initMobileMenu();
  refreshBadges();
  refreshSummary();
  initQuantity();
  initAddToCart();
  renderCartItems();  
});