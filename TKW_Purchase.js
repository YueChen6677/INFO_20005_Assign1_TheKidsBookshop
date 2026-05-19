// Shipping
function initShippingForm() {
  var firstName = document.getElementById('firstName');
  var lastName  = document.getElementById('lastName');
  var street    = document.getElementById('streetAddress');
  var city      = document.getElementById('city');
  var zip       = document.getElementById('zipCode');
  if (!firstName) return;   // not on shipping page

  // Name + Surname: letters, numbers, spaces only // max 20 chars
  [firstName, lastName, city].forEach(function(input) {
    input.setAttribute('maxlength', '20');
    input.addEventListener('input', function() {
      this.value = this.value.replace(/[^a-zA-Z0-9 ]/g, '').slice(0, 20);
    });
  });

  // Street address: max 60 chars, any character is fine
  street.setAttribute('maxlength', '60');

  // Postcode: digits only, max 10
  zip.setAttribute('maxlength', '10');
  zip.addEventListener('input', function() {
    this.value = this.value.replace(/\D/g, '').slice(0, 10);
  });

  // Save address
  var confirmBtn = document.querySelector('.btn-checkout');
  if (confirmBtn) {
    confirmBtn.addEventListener('click', function() {
      var addr = {
        firstName : firstName.value.trim(),
        lastName  : lastName.value.trim(),
        street    : street.value.trim(),
        city      : city.value.trim(),
        zip       : zip.value.trim()
      };
      localStorage.setItem('tkwShipping', JSON.stringify(addr));
    });
  }
}


// Payment

function initPaymentForm() {
  var cardName   = document.getElementById('cardName');
  var cardNumber = document.getElementById('cardNumber');
  var expiry     = document.getElementById('expiry');
  var cvv        = document.getElementById('cvv');
  if (!cardName) return;   // not on payment page

  // Cardholder name: letters and spaces only// max 40
  cardName.setAttribute('maxlength', '40');
  cardName.addEventListener('input', function() {
    this.value = this.value.replace(/[^a-zA-Z ]/g, '').slice(0, 40);
  });

  // Card number: digits only// max 16 // auto-space every 4 digits for display
  cardNumber.setAttribute('maxlength', '19'); // 16 digits + 3 spaces
  cardNumber.addEventListener('input', function() {
    var digits = this.value.replace(/\D/g, '').slice(0, 16);
    this.value = digits.match(/.{1,4}/g)
      ? digits.match(/.{1,4}/g).join(' ')
      : digits;
  });

  // Expiry: MM/YY format // digits only, auto-insert slash
  expiry.setAttribute('maxlength', '5');
  expiry.addEventListener('input', function() {
    var digits = this.value.replace(/\D/g, '').slice(0, 4);
    if (digits.length > 2) {
      this.value = digits.slice(0, 2) + '/' + digits.slice(2);
    } else {
      this.value = digits;
    }
  });

  // CVV: digits only, exactly 3
  cvv.setAttribute('maxlength', '3');
  cvv.addEventListener('input', function() {
    this.value = this.value.replace(/\D/g, '').slice(0, 3);
  });
}


// Review

function initReviewPage() {
  var addressEl = document.getElementById('reviewShippingAddress');
  if (!addressEl) return;   // not on review page

  try {
    var addr = JSON.parse(localStorage.getItem('tkwShipping')) || {};
    var line1 = (addr.firstName + ' ' + addr.lastName).trim();
    var line2 = addr.street  || '';
    var line3 = (addr.city + ' ' + addr.zip).trim();

    var parts = [line1, line2, line3].filter(Boolean);
    addressEl.innerHTML = parts.join('<br />') || 'No address entered.';
  } catch(e) {
    addressEl.innerHTML = 'No address entered.';
  }
}


// boot 

document.addEventListener('DOMContentLoaded', function() {
  initShippingForm();
  initPaymentForm();
  initReviewPage();
});