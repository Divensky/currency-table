export function formatNumber(n, currency = 'USD', locale = navigator.language) {
  // todo: refactor so the Intl object is stored once created
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(n);
}
