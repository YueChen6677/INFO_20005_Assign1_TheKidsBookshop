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


//Init
document.addEventListener('DOMContentLoaded', function(){
    initMobileMenu();
  refreshBadges();
  refreshSummary();
  initQuantity();
  initAddToCart();
  renderCartItems();  
});