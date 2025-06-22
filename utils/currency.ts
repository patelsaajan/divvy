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
    console.warn(
      `Invalid currency/locale combination: ${currency}/${locale}, falling back to GBP`
    );
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(amount);
  }
}
