/**
 * Utility functions for formatting values in charts and displays
 */

/**
 * Formats currency values with appropriate abbreviations for chart display
 * @param value - The numeric value to format
 * @returns Formatted currency string (e.g., "$1.2M", "$500K", "$1,000")
 */
export const formatCurrency = (value: number): string => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(value);
};

/**
 * Formats percentage values for display
 * @param value - The numeric percentage value
 * @returns Formatted percentage string (e.g., "5.2%")
 */
export const formatPercent = (value: number): string => `${value}%`;

/**
 * Formats large numbers with abbreviations (non-currency)
 * @param value - The numeric value to format
 * @returns Formatted number string (e.g., "1.2M", "500K", "1,000")
 */
export const formatNumber = (value: number): string => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}K`;
  }
  return new Intl.NumberFormat("en-US").format(value);
};

/**
 * Formats percentage values with decimal places
 * @param value - The numeric percentage value
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted percentage string (e.g., "5.25%")
 */
export const formatPercentWithDecimals = (
  value: number,
  decimals: number = 1
): string => `${value.toFixed(decimals)}%`;

/**
 * Formats currency for full display (no abbreviations)
 * @param value - The numeric value to format
 * @returns Full currency string (e.g., "$1,200,000")
 */
export const formatFullCurrency = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(value);
};
