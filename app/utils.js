export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD', // This can be configured later
  }).format(amount);
}

export function generateBillCode(restaurantId) {
  const prefix = restaurantId.toUpperCase().slice(0, 4);
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${randomPart}`;
}
