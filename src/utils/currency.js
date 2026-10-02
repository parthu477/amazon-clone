/**
 * Indian Rupee (INR - ₹) Currency Formatting Utilities
 */

export const CURRENCY_SYMBOL = '₹';

/**
 * Formats a number to Indian Rupee currency format (e.g., ₹19,990.00 or ₹1,34,900.00)
 * Uses Indian numbering system grouping (lakhs & crores).
 * 
 * @param {number} amount - The numeric price to format
 * @param {boolean} includeSymbol - Whether to prefix with ₹ (default: true)
 * @param {number} fractionDigits - Number of decimal places (default: 2)
 * @returns {string} Formatted string
 */
export function formatPrice(amount, includeSymbol = true, fractionDigits = 2) {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return includeSymbol ? `${CURRENCY_SYMBOL}0.00` : '0.00';
  }
  
  const num = Number(amount);
  const formatted = num.toLocaleString('en-IN', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits
  });

  return includeSymbol ? `${CURRENCY_SYMBOL}${formatted}` : formatted;
}

/**
 * Splits a price into whole and decimal parts formatted with Indian numbering
 * Useful for Amazon's large-whole and small-fraction superscripts.
 * 
 * @param {number} amount
 * @returns {{ whole: string, fraction: string }}
 */
export function splitPriceParts(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return { whole: '0', fraction: '00' };
  }
  
  const num = Number(amount);
  const wholePart = Math.floor(num).toLocaleString('en-IN');
  const fractionPart = Math.round((num % 1) * 100).toString().padStart(2, '0');
  
  return {
    whole: wholePart,
    fraction: fractionPart
  };
}

/**
 * Formats an amount without decimal places if whole number, e.g. ₹499
 * 
 * @param {number} amount
 * @returns {string}
 */
export function formatCompactPrice(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return `${CURRENCY_SYMBOL}0`;
  }
  return `${CURRENCY_SYMBOL}${Number(amount).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
}
