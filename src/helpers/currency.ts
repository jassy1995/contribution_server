export const CURRENCY_SYMBOL = '₦';

export const formatAmount = (amount: number): string =>
  `${CURRENCY_SYMBOL}${amount.toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

/** Replace dollar-prefixed amounts in model replies with naira. */
export const normalizeCurrencyInText = (text: string): string =>
  text.replace(/\$(\d[\d,]*(?:\.\d+)?)/g, `${CURRENCY_SYMBOL}$1`);
