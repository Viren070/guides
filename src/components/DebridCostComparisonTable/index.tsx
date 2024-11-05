import React, { useState } from 'react';
import CurrencySelector from './CurrencySelector';
import conversionRates from '@site/static/currency_rates.json';

const availableCurrencies = Object.keys(conversionRates['USD']).filter((currency) =>
  Object.keys(conversionRates['EUR']).includes(currency)
);
const currencyOptions = availableCurrencies.map((currency) => ({ value: currency, label: currency })).sort((a, b) => a.label.localeCompare(b.label));


const serviceData = [
  { name: 'Torbox (Essential)', price: 33, duration: 365, currency: 'USD' },
  { name: 'Torbox (Standard)', price: 55, duration: 365, currency: 'USD' },
  { name: 'Torbox (Pro)', price: 110, duration: 365, currency: 'USD' },
  { name: 'Real-Debrid', price: 16, duration: 180, currency: 'EUR', pointsPerPlan: 800, pointsRequiredForReward: 1000, durationPerReward: 30 },
  { name: 'Debrid-Link', price: 25, duration: 300, currency: 'EUR' },
  { name: 'AllDebrid', price: 24.99, duration: 300, currency: 'EUR', pointsPerPlan: 140, pointsRequiredForReward: 150, durationPerReward: 30 },
  { name: 'Offcloud', price: 54.99, duration: 365, currency: 'USD' },
  { name: 'Premiumize', price: 69.99, duration: 365, currency: 'EUR' },
  { name: 'put.io (100GB)', price: 99, duration: 365, currency: 'USD' },
  { name: 'put.io (1TB)', price: 199, duration: 365, currency: 'USD' },
];

const convertPrice = (price: number, fromCurrency: string, toCurrency: string): number => {
  if (fromCurrency === toCurrency || !toCurrency) return price;
  const rate = conversionRates[fromCurrency]?.[toCurrency];
  return rate ? price * rate : price;
};

const formatPrice = (price: number, currency: string) => {
  return Intl.NumberFormat(undefined, { style: 'currency', currency }).format(price);
};

interface Service {
  name: string;
  price: number;
  duration: number;
  currency: string;
  pointsPerPlan?: number;
  pointsRequiredForReward?: number;
  durationPerReward?: number;
}

interface CalculatedService extends Service {
  pointsUsed: boolean;
  pricePerDay: number;
  pricePerMonth: number;
  pricePerYear: number;
  totalPrice?: number;
  totalDuration?: number;
  plansRequired?: number;
  extraDuration?: number;
}

const calculatePrices = (service: Service, primaryCurrency: string): CalculatedService[] => {
  const entries: CalculatedService[] = [];
  const baseCurrency = primaryCurrency || service.currency;

  // Entry without considering points
  let pricePerDay = service.price / service.duration;
  let pricePerYear = pricePerDay * 365;
  let pricePerMonth = pricePerYear / 12;

  entries.push({
    ...service,
    pointsUsed: false,
    pricePerDay: convertPrice(pricePerDay, service.currency, baseCurrency),
    pricePerMonth: convertPrice(pricePerMonth, service.currency, baseCurrency),
    pricePerYear: convertPrice(pricePerYear, service.currency, baseCurrency),
  });

  // Entry considering points
  if (service.pointsPerPlan && service.pointsRequiredForReward && service.durationPerReward) {
    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
    const lcm = (a: number, b: number): number => (a * b) / gcd(a, b);

    const plansRequired = lcm(service.pointsPerPlan, service.pointsRequiredForReward) / service.pointsPerPlan;
    const extraDuration = ((service.pointsPerPlan * plansRequired) / service.pointsRequiredForReward) * service.durationPerReward;
    const planDuration = service.duration * plansRequired + extraDuration;
    const planPrice = service.price * plansRequired;

    pricePerDay = planPrice / planDuration;
    pricePerYear = pricePerDay * 365;
    pricePerMonth = pricePerYear / 12;

    entries.push({
      ...service,
      pointsUsed: true,
      pricePerDay: convertPrice(pricePerDay, service.currency, baseCurrency),
      pricePerMonth: convertPrice(pricePerMonth, service.currency, baseCurrency),
      pricePerYear: convertPrice(pricePerYear, service.currency, baseCurrency),
      totalPrice: planPrice,
      totalDuration: planDuration,
      plansRequired,
      extraDuration,
    });
  }

  return entries;
};


export default function DebridCostComparisonTable({ excludeServices }: { excludeServices?: string[]; }): JSX.Element {
  const [primaryCurrency, setPrimaryCurrency] = useState<string>('GBP');

  let filteredServiceData = serviceData;
  if (excludeServices) {
    excludeServices.forEach((service) => {
      filteredServiceData = filteredServiceData.filter((s) => !s.name.toLowerCase().includes(service.toLowerCase()));
    });
  }

  const calculatedServiceData = filteredServiceData.flatMap((service) => calculatePrices(service, primaryCurrency));

  if (primaryCurrency) {
    calculatedServiceData.sort((a, b) => a.pricePerYear - b.pricePerYear);
  } else {
    calculatedServiceData.sort((a, b) => a.name.localeCompare(b.name));
  }

  return (
    <>
      <CurrencySelector
        primaryCurrency={primaryCurrency}
        setPrimaryCurrency={setPrimaryCurrency}
        currencyOptions={currencyOptions}
      />
      <table>
        <thead>
          <tr>
            <th>Debrid Service</th>
            <th>Price per Year <br/>{primaryCurrency && `(${primaryCurrency})`}</th>
            <th>Price per Month <br/>{primaryCurrency && `(${primaryCurrency})`}</th>
            <th>Price per Day <br/>{primaryCurrency && `(${primaryCurrency})`}</th>
            <th>Plan Price</th>
            <th>Plan Duration (Days)</th>
          </tr>
        </thead>
        <tbody>
          {calculatedServiceData.map((service, index) => (
            <tr key={index}>
              <td>{service.name} {service.pointsUsed && "(with points*)"}</td>
              <td>{formatPrice(service.pricePerYear, primaryCurrency || service.currency)}</td>
              <td>{formatPrice(service.pricePerMonth, primaryCurrency || service.currency)}</td>
              <td>{formatPrice(service.pricePerDay, primaryCurrency || service.currency)}</td>
              <td>
                {service.pointsUsed
                  ? (<>{service.plansRequired} x {formatPrice(service.price, service.currency)}<br />={formatPrice(service.totalPrice, service.currency)}</>)
                  : formatPrice(service.price, service.currency)}
              </td>
              <td>
                {service.pointsUsed
                  ? <>{service.duration * service.plansRequired} + {service.extraDuration}<br />={service.totalDuration}</>
                  : service.duration
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}