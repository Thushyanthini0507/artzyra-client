/**
 * Format a number as LKR currency
 * @param amount - The amount to format
 * @returns Formatted currency string (e.g., "LKR 5,000.00")
 */
export function formatLKR(amount: number | undefined | null): string {
  if (amount === undefined || amount === null) {
    return "LKR 0.00";
  }
  
  return `LKR ${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Format hourly rate in LKR
 * @param rate - The hourly rate
 * @returns Formatted hourly rate string (e.g., "LKR 5,000/hr")
 */
export function formatHourlyRate(rate: number | undefined | null): string {
  if (rate === undefined || rate === null) {
    return "LKR 0/hr";
  }
  
  return `LKR ${rate.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}/hr`;
}
