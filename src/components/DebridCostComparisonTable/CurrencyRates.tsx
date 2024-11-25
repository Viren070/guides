import conversionRates from '@site/static/currency_rates.json';

export const availableCurrencies = Object.keys(conversionRates['USD']).filter((currency) =>
    Object.keys(conversionRates['EUR']).includes(currency)
  );
  
export const convertPrice = (price: number, fromCurrency: string, toCurrency: string): number => {
    if (fromCurrency === toCurrency || !toCurrency) return price;
    const rate = conversionRates[fromCurrency]?.[toCurrency];
    return rate ? price * rate : price;
  };

export const formatPrice = (price: number, currency: string) => {
    return Intl.NumberFormat(undefined, { style: 'currency', currency }).format(price);
};