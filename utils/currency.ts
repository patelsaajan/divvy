export function formatCurrency(
  amount: number,
  currency?: string | null,
  locale?: string | null
): string {
  if (!currency) {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(amount);
  }

  // Default locale if not provided
  const defaultLocale = "en-GB";

  try {
    return new Intl.NumberFormat(locale || defaultLocale, {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount);
  } catch (error) {
    // Fallback to GBP if the currency/locale combination is invalid
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(amount);
  }
}

export const distributeAmountEvenly = (
  totalAmount: number,
  numShares: number
): number[] => {
  if (numShares <= 0) {
    return [];
  }

  const amountInCents = Math.round(totalAmount * 100);
  const baseShareInCents = Math.floor(amountInCents / numShares);
  const remainderInCents = amountInCents % numShares;

  const shares: number[] = [];
  for (let i = 0; i < numShares; i++) {
    let share = baseShareInCents;
    if (i < remainderInCents) {
      share++;
    }
    shares.push(share / 100);
  }

  return shares;
};

export const distributePercentageEvenly = (numShares: number): number[] => {
  if (numShares <= 0) {
    return [];
  }

  // Use basis points (1% = 100 basis points) for precision. Total is 10,000.
  const totalBasisPoints = 10000;
  const baseShare = Math.floor(totalBasisPoints / numShares);
  const remainder = totalBasisPoints % numShares;

  const shares: number[] = [];
  for (let i = 0; i < numShares; i++) {
    let share = baseShare;
    if (i < remainder) {
      share++;
    }
    // Convert back to a fractional value (e.g., 3333 -> 0.3333)
    shares.push(share / 10000);
  }

  return shares;
};
