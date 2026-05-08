// Default to ZAR
let currentCurrency = 'ZAR';

// Full currency map with African and major international currencies
const currencyMap = {
  "ZAR": "South African Rand",
  "USD": "US Dollar",
  "EUR": "Euro",
  "GBP": "British Pound",
  "KES": "Kenyan Shilling",
  "NGN": "Nigerian Naira",
  "GHS": "Ghanaian Cedi",
  "BWP": "Botswana Pula",
  "TZS": "Tanzanian Shilling",
  "UGX": "Ugandan Shilling",
  "MAD": "Moroccan Dirham",
  "XOF": "West African CFA Franc",
  "XAF": "Central African CFA Franc",
  "EGP": "Egyptian Pound",
  "DZD": "Algerian Dinar",
  "INR": "Indian Rupee",
  "CNY": "Chinese Yuan",
  "JPY": "Japanese Yen",
  "AUD": "Australian Dollar",
  "CAD": "Canadian Dollar",
  "BRL": "Brazilian Real",
  "MXN": "Mexican Peso",
  "RUB": "Russian Ruble",
  "AED": "UAE Dirham"
  // Add more as needed
};

// Format number to selected currency
function formatCurrency(value, currency = currentCurrency) {
  const number = parseFloat(value);
  if (isNaN(number)) return value;
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(number);
}

// Detect currency based on browser locale
function detectCurrencyFromLocale() {
  try {
    const locale = navigator.language;
    const region = locale.split('-')[1] || 'ZA';
    const localeCurrency = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'ZAR' // temp fallback
    }).resolvedOptions().currency;
    return localeCurrency || 'ZAR';
  } catch {
    return 'ZAR';
  }
}

// Format all elements with data-price
function formatPricesOnPage() {
  document.querySelectorAll('[data-price]').forEach(el => {
    const rawValue = el.getAttribute('data-price');
    el.textContent = formatCurrency(rawValue);
  });
}

// Format input fields live
function setupCurrencyInputs() {
  const inputs = document.querySelectorAll('input[data-type="currency"]');
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      const numericValue = input.value.replace(/[^\d.]/g, '');
      if (numericValue) {
        input.value = formatCurrency(numericValue);
      }
    });

    // Remove currency symbol on focus for clean editing
    input.addEventListener('focus', () => {
      input.value = input.value.replace(/[^\d.]/g, '');
    });

    // Reformat on blur
    input.addEventListener('blur', () => {
      const numericValue = input.value.replace(/[^\d.]/g, '');
      if (numericValue) {
        input.value = formatCurrency(numericValue);
      }
    });
  });
}

// Populate and handle currency override dropdown
function setupCurrencyDropdown() {
  const dropdown = document.getElementById('currencyDropdown');
  if (!dropdown) return;

  // Populate
  dropdown.innerHTML = '';
  for (const [code, name] of Object.entries(currencyMap)) {
    const option = document.createElement('option');
    option.value = code;
    option.textContent = `${name} (${code})`;
    dropdown.appendChild(option);
  }

  // Set current value
  dropdown.value = currentCurrency;

  // Listen for changes
  dropdown.addEventListener('change', () => {
    currentCurrency = dropdown.value;
    localStorage.setItem('preferredCurrency', currentCurrency);
    formatPricesOnPage();
    setupCurrencyInputs(); // re-apply to reflect new currency
  });
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  const savedCurrency = localStorage.getItem('preferredCurrency');
  currentCurrency = savedCurrency || detectCurrencyFromLocale() || 'ZAR';

  setupCurrencyDropdown();
  formatPricesOnPage();
  setupCurrencyInputs();
});
