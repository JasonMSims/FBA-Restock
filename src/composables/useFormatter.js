export const useFormatter = {
  currency: (val) => new Intl.NumberFormat('en-US', { currency: 'USD', style: 'currency' }).format(val),
  decimal: (val) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2, style: 'decimal' }).format(val),
  number: (val) => new Intl.NumberFormat('en-US').format(val),
}
