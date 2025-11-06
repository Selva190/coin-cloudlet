import { useState, useEffect } from 'react';

export type Currency = {
  code: string;
  symbol: string;
  name: string;
};

export const CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
];

const CURRENCY_STORAGE_KEY = 'budget-tracker-currency';

export function useCurrency() {
  const [currency, setCurrency] = useState<Currency>(() => {
    const stored = localStorage.getItem(CURRENCY_STORAGE_KEY);
    if (stored) {
      const code = stored;
      return CURRENCIES.find((c) => c.code === code) || CURRENCIES[0];
    }
    return CURRENCIES[0];
  });

  useEffect(() => {
    localStorage.setItem(CURRENCY_STORAGE_KEY, currency.code);
  }, [currency]);

  const formatAmount = (amount: number) => {
    return `${currency.symbol}${amount.toFixed(2)}`;
  };

  return {
    currency,
    setCurrency,
    formatAmount,
    currencies: CURRENCIES,
  };
}
