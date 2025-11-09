/**
 * Finance calculation utilities
 * All calculations assume standard amortization formulas
 */

export interface FinanceEstimate {
  monthly: number
  totalCost: number
  totalInterest: number
}

export interface LeaseEstimate {
  monthly: number
  totalCost: number
  dueAtSigning: number
}

/**
 * Calculate monthly payment and total cost for financing
 * @param msrp Vehicle MSRP
 * @param apr Annual percentage rate (e.g., 5.5 for 5.5%)
 * @param termMonths Loan term in months (e.g., 60)
 * @param downPayment Down payment amount
 * @returns Finance estimate with monthly payment and total cost
 *
 * Formula: M = P[r(1+r)^n]/[(1+r)^n-1]
 * Where:
 *   M = Monthly payment
 *   P = Principal (amount financed)
 *   r = Monthly interest rate (APR / 12 / 100)
 *   n = Number of payments
 *
 * Example test case:
 * estimateFinance(30000, 5.5, 60, 3000)
 * Principal: $27,000
 * Monthly rate: 5.5/12/100 = 0.00458333
 * Expected monthly: ~$513.45
 * Total paid: $30,807
 * Total interest: $3,807
 */
export function estimateFinance(
  msrp: number,
  apr: number,
  termMonths: number,
  downPayment: number = 0
): FinanceEstimate {
  const principal = msrp - downPayment

  // Handle zero interest case
  if (apr === 0) {
    const monthly = principal / termMonths
    return {
      monthly: Math.round(monthly * 100) / 100,
      totalCost: Math.round((monthly * termMonths + downPayment) * 100) / 100,
      totalInterest: 0,
    }
  }

  const monthlyRate = apr / 12 / 100
  const numPayments = termMonths

  // Calculate monthly payment using amortization formula
  const monthly =
    principal *
    (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
    (Math.pow(1 + monthlyRate, numPayments) - 1)

  const totalPaid = monthly * termMonths
  const totalCost = totalPaid + downPayment
  const totalInterest = totalPaid - principal

  return {
    monthly: Math.round(monthly * 100) / 100,
    totalCost: Math.round(totalCost * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
  }
}

/**
 * Calculate monthly lease payment and total cost
 * @param msrp Vehicle MSRP
 * @param residualPct Residual value as percentage of MSRP (e.g., 60 for 60%)
 * @param moneyFactor Money factor (similar to APR / 2400)
 * @param termMonths Lease term in months (typically 36)
 * @param downPayment Down payment / cap cost reduction
 * @returns Lease estimate with monthly payment and total cost
 *
 * Lease payment = Depreciation Fee + Finance Fee
 * Depreciation Fee = (Adjusted Cap Cost - Residual Value) / Term
 * Finance Fee = (Adjusted Cap Cost + Residual Value) × Money Factor
 */
export function estimateLease(
  msrp: number,
  residualPct: number,
  moneyFactor: number,
  termMonths: number,
  downPayment: number = 0
): LeaseEstimate {
  const adjustedCapCost = msrp - downPayment
  const residualValue = msrp * (residualPct / 100)

  // Depreciation fee (cost of using the vehicle)
  const depreciationFee = (adjustedCapCost - residualValue) / termMonths

  // Finance fee (interest on the total value)
  const financeFee = (adjustedCapCost + residualValue) * moneyFactor

  const monthly = depreciationFee + financeFee
  const totalPayments = monthly * termMonths
  const dueAtSigning = downPayment + monthly // First payment + down payment
  const totalCost = totalPayments + downPayment

  return {
    monthly: Math.round(monthly * 100) / 100,
    totalCost: Math.round(totalCost * 100) / 100,
    dueAtSigning: Math.round(dueAtSigning * 100) / 100,
  }
}

/**
 * Convert APR to money factor
 * Money Factor = APR / 2400
 */
export function aprToMoneyFactor(apr: number): number {
  return apr / 2400
}

/**
 * Convert money factor to APR
 * APR = Money Factor × 2400
 */
export function moneyFactorToApr(moneyFactor: number): number {
  return moneyFactor * 2400
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Format monthly payment with precision
 */
export function formatMonthly(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}
