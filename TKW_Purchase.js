// ── Validation Modal ─────────────────────────────────────────────────────────
// Creates a lightweight modal once and reuses it on every call.

function showValidationModal(missingFields) {
  var modal = document.getElementById('tkwValidationModal');

  if (!modal) {
    // Build modal markup
    modal = document.createElement('div');
    modal.id = 'tkwValidationModal';
    modal.innerHTML =
      '<div id="tkwModalOverlay" style="' +
        'position:fixed;inset:0;background:rgba(0,0,0,0.45);' +
        'display:flex;align-items:center;justify-content:center;' +
        'z-index:9999;">' +
        '<div style="' +
          'background:#fff;border-radius:25px;padding:2rem 2.2rem;' +
          'max-width:360px;width:90%;box-shadow:0 8px 32px rgba(0,0,0,0.18);' +
          'font-family:inherit;text-align:center;">' +
          '<h3 style="margin:0 0 0.5rem;font-family:var(--font-title);font-size:2rem;color:var(--crimson)">' +
            'Please fill in all required fields.' +
          '</h3>' +
          '<p style="margin:0 0 1.2rem;font-size:0.75rem;color:#555;line-height:1.5;" ' +
            'id="tkwModalBody"></p>' +
          '<button id="tkwModalClose" style="' +
            'background:var(--crimson);color:#fff;border:none;border-radius:25px;' +
            'padding:0.6rem 1.8rem;font-size:0.95rem;cursor:pointer;' +
            'font-family:inherit;">' +
            'Got it' +
          '</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(modal);

    document.getElementById('tkwModalClose').addEventListener('click', function() {
      modal.style.display = 'none';
    });
    // Also close on overlay click
    document.getElementById('tkwModalOverlay').addEventListener('click', function(e) {
      if (e.target === this) modal.style.display = 'none';
    });
  }

  // Populate missing-field list
  var body = document.getElementById('tkwModalBody');
  body.innerHTML = 'The following field' +
    (missingFields.length > 1 ? 's are' : ' is') +
    ' missing or incomplete:<br><br>' +
    missingFields.map(function(f){ return '• ' + f; }).join('<br>');

  modal.style.display = 'block';
}

// Shipping
function initShippingForm() {
  var firstName = document.getElementById('firstName');
  var lastName  = document.getElementById('lastName');
  var street    = document.getElementById('streetAddress');
  var city      = document.getElementById('city');
  var zip       = document.getElementById('zipCode');
  if (!firstName) return;   // not on shipping page

  try {
    var saved = JSON.parse(sessionStorage.getItem('tkwShipping')) || {};
    if (saved.firstName) firstName.value = saved.firstName;
    if (saved.lastName)  lastName.value  = saved.lastName;
    if (saved.street)    street.value    = saved.street;
    if (saved.city)      city.value      = saved.city;
    if (saved.zip)       zip.value       = saved.zip;
} catch(e) {}
  // Name + Surname: letters, numbers, spaces only // max 20 chars

  [firstName, lastName].forEach(function(input) {
  input.setAttribute('maxlength', '20');
  input.addEventListener('input', function() {
    this.value = this.value.replace(/[^a-zA-Z0-9 ]/g, '').slice(0, 20);
  });
});

city.setAttribute('maxlength', '10');
city.addEventListener('input', function() {
  this.value = this.value.replace(/[^a-zA-Z]/g, '').slice(0, 10);
});

  // Street address: max 60 chars
  street.setAttribute('maxlength', '40');

  // Postcode: digits only, max 10
  zip.setAttribute('maxlength', '5');

  zip.addEventListener('input', function() {
    this.value = this.value.replace(/\D/g, '').slice(0, 10);
  });

  // Confirm & Pay — validate before navigating
  var confirmBtn = document.querySelector('.btn-checkout');
  if (confirmBtn) {
    // Remove the inline onclick so JS fully controls navigation
    confirmBtn.removeAttribute('onclick');

    confirmBtn.addEventListener('click', function() {
      var missing = [];
      if (!firstName.value.trim()) missing.push('First Name');
      if (!lastName.value.trim())  missing.push('Last Name');
      if (!street.value.trim())    missing.push('Street Address');
      if (!city.value.trim())      missing.push('State / City');
      if (!zip.value.trim())       missing.push('Postcode');

      if (missing.length > 0) {
        //Clear previous red boxes.
        document.querySelectorAll('.form-input').forEach(function(el) {
          el.style.boxShadow = '';
        });
        //Add red box to empty fields.
        document.querySelectorAll('.form-input').forEach(function(el) {
          if (!el.value.trim()) {
            el.style.boxShadow = '0 0 0 2px var(--crimson)';
          }
        });
        showValidationModal(missing);
        return;   // block navigation
      }

  // Save address and proceed
      var addr = {
        firstName : firstName.value.trim(),
        lastName  : lastName.value.trim(),
        street    : street.value.trim(),
        city      : city.value.trim(),
        zip       : zip.value.trim()
      };
      sessionStorage.setItem('tkwShipping', JSON.stringify(addr));
      window.location.href = 'TKW_Purchase_BPayment.html';
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

  try {
  var saved = JSON.parse(sessionStorage.getItem('tkwPayment')) || {};
  if (saved.cardName)   cardName.value   = saved.cardName;
  if (saved.cardNumber) cardNumber.value = saved.cardNumber;
  if (saved.expiry)     expiry.value     = saved.expiry;
  if (saved.cvv)        cvv.value        = saved.cvv;
} catch(e) {}
window.addEventListener('beforeunload', function() {
  var c = document.getElementById('cardName');
  var n = document.getElementById('cardNumber');
  var ex = document.getElementById('expiry');
  var cv = document.getElementById('cvv');
  if (c && n && ex && cv) {
    sessionStorage.setItem('tkwPayment', JSON.stringify({
      cardName   : c.value.trim(),
      cardNumber : n.value.trim(),
      expiry     : ex.value.trim(),
      cvv        : cv.value.trim()
    }));
  }
});
  // Cardholder name: letters and spaces only// max 40
  cardName.setAttribute('maxlength', '40');
  cardName.addEventListener('input', function() {
    this.value = this.value.replace(/[^a-zA-Z ]/g, '').slice(0, 40);
  });

  // Card number: digits only// max 16 // auto-space every 4 digits for display
  cardNumber.setAttribute('maxlength', '19'); 
  cardNumber.addEventListener('input', function() {
    var digits = this.value.replace(/\D/g, '').slice(0, 16);
    this.value = digits.match(/.{1,4}/g)
      ? digits.match(/.{1,4}/g).join(' ')
      : digits;
  });

  // Expiry: MM/YY format 
  expiry.setAttribute('maxlength', '5');
  expiry.addEventListener('input', function() {
    var digits = this.value.replace(/\D/g, '').slice(0, 4);
    //Cap month at 12
    if (digits.length >= 2) {
      var mm = Math.min(parseInt(digits.slice(0, 2)), 12);
      digits = String(mm).padStart(2, '0') + digits.slice(2);
    }
    this.value = digits.length > 2 ? digits.slice(0, 2) + '/' + digits.slice(2) : digits;
  });

  // CVV: digits only
  cvv.setAttribute('maxlength', '3');
  cvv.addEventListener('input', function() {
    this.value = this.value.replace(/\D/g, '').slice(0, 3);
  });
}

  // Confirm & Pay — validate before navigating
var confirmBtn = document.querySelector('.btn-checkout');
if (confirmBtn) {
  confirmBtn.removeAttribute('onclick');
  confirmBtn.addEventListener('click', function() {
    var missing = [];
    if (!cardName.value.trim()) missing.push('Cardholder Name');
    var digits = cardNumber.value.replace(/\D/g, '');
    if (digits.length < 16) missing.push('Card Number (must be 16 digits)');
    
    // Expiry validation: must be 4 digits & a valid future date.
    var expiryDigits = expiry.value.replace(/\D/g, '');
    if (expiryDigits.length < 4) {
      missing.push('Expiry Date (MM/YY)');
    } else {
      var mm = parseInt(expiryDigits.slice(0, 2));
      var yy = parseInt(expiryDigits.slice(2));
      var now = new Date();
      var curYear = now.getFullYear() % 100;
      var curMonth = now.getMonth() + 1;
      if (yy < curYear || (yy === curYear && mm < curMonth)) {
        missing.push('Expiry Date (card has expired)');
      }
    }

    if (cvv.value.length < 3) missing.push('CVV (must be 3 digits)');

    if (missing.length > 0) {
    //Clear previous red boxes.
    document.querySelectorAll('.form-input').forEach(function(el) {
      el.style.boxShadow = '';
    });
    // Add red box to empty fields.
    document.querySelectorAll('.form-input').forEach(function(el) {
      if (!el.value.trim()) {
        el.style.boxShadow = '0 0 0 2px var(--crimson)';
      }
    });
      showValidationModal(missing);
      return;
    }
    sessionStorage.setItem('tkwPayment', JSON.stringify({
      cardName   : cardName.value.trim(),
      cardNumber : cardNumber.value.trim(),
      expiry     : expiry.value.trim(),
      cvv        : cvv.value.trim()
}));
    window.location.href = 'TKW_Purchase_CReview.html';
  });
}


// Review

function initReviewPage() {
  var addressEl = document.getElementById('reviewShippingAddress');
  if (!addressEl) return;   // not on review page

  sessionStorage.removeItem('tkwCart');
  refreshBadges();

  try {
    var addr = JSON.parse(sessionStorage.getItem('tkwShipping')) || {};
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
})