// Deal metrics calculation utilities

import { formatFullCurrency } from "./formatters";

export interface DealMetrics {
  capRate: string;
  cashOnCashReturn: string;
  riskScore: number;
  marketVolatility: string;
  breakEvenAnalysis: string;
}

export interface FormData {
  purchasePrice: number;
  totalRaise: number;
  [key: string]: unknown;
}

/**
 * Calculate deal metrics based on form data
 * @param formData - The form data containing purchase price and total raise
 * @returns Calculated deal metrics
 */
export const calculateDealMetrics = (formData: FormData): DealMetrics => {
  const estimatedRent = Math.floor(formData.purchasePrice * 0.008); // 0.8% monthly rent
  const annualRent = estimatedRent * 12;

  // Cap Rate calculation
  const capRate = ((annualRent / formData.purchasePrice) * 100).toFixed(2);

  // Cash-on-Cash Return (assuming 20% down payment)
  const downPayment = formData.totalRaise;
  const cashOnCash = ((annualRent / downPayment) * 100).toFixed(1);

  // Risk Score (1-10, lower is better risk)
  const baseRisk = 4;
  const priceRisk = formData.purchasePrice > 500000 ? 1 : 0;
  const locationRisk = Math.random() > 0.7 ? 1 : 0; // Simulated location risk
  const riskScore = Math.min(10, baseRisk + priceRisk + locationRisk);

  // Market Volatility (simulated based on price range)
  const volatility =
    formData.purchasePrice > 750000
      ? "High"
      : formData.purchasePrice > 400000
      ? "Medium"
      : "Low";

  // Break-even analysis
  const monthsToBreakEven = Math.ceil(
    downPayment / (estimatedRent - estimatedRent * 0.3)
  ); // 30% expenses
  const breakEven = `${monthsToBreakEven} months`;

  return {
    capRate: `${capRate}%`,
    cashOnCashReturn: `${cashOnCash}%`,
    riskScore,
    marketVolatility: volatility,
    breakEvenAnalysis: breakEven,
  };
};

/**
 * Get risk color based on risk score
 * @param score - Risk score (1-10)
 * @returns Color string for UI display
 */
export const getRiskColor = (score: number): string => {
  if (score <= 3) return "green";
  if (score <= 6) return "yellow";
  return "red";
};

/**
 * Format currency with USD formatting
 * @param amount - The amount to format
 * @returns Formatted currency string
 */
export const formatCurrency = formatFullCurrency;

/**
 * Calculate estimated monthly rent based on purchase price
 * @param purchasePrice - The purchase price of the property
 * @returns Estimated monthly rent
 */
export const calculateEstimatedRent = (purchasePrice: number): number => {
  return Math.floor(purchasePrice * 0.008); // 0.8% of purchase price as monthly rent
};
