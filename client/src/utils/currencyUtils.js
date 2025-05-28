export const formatCurrency = (amount, currency = 'USD') => {
  if (amount === null || amount === undefined) return 'N/A';
  
  let finalAmount = 0;
  let finalCurrency = currency;
  
  // Handle object with amount and currency properties
  if (typeof amount === 'object' && amount !== null) {
    finalAmount = amount.amount || 0;
    finalCurrency = amount.currency || currency;
  } else if (typeof amount === 'number') {
    finalAmount = amount;
  } else if (typeof amount === 'string' && !isNaN(parseFloat(amount))) {
    finalAmount = parseFloat(amount);
  } else {
    return 'N/A';
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: finalCurrency
  }).format(finalAmount);
};