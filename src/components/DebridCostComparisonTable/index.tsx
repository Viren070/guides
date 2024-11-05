import React, { useState, useEffect } from 'react';
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
  { name: 'Real-Debrid', price: 16, duration: 180, currency: 'EUR', pointData: {pointsPerPlan: 800, pointsRequiredForReward: 1000, durationPerReward: 30} },
  { name: 'Debrid-Link', price: 25, duration: 300, currency: 'EUR' },
  { name: 'AllDebrid', price: 24.99, duration: 300, currency: 'EUR', pointData: {pointsPerPlan: 140, pointsRequiredForReward: 150, durationPerReward: 30} },
  { name: 'Offcloud', price: 54.99, duration: 365, currency: 'USD' },
  { name: 'Premiumize', price: 69.99, duration: 365, currency: 'EUR' },
  { name: 'put.io (100GB)', price: 99, duration: 365, currency: 'USD' },
  { name: 'put.io (1TB)', price: 199, duration: 365, currency: 'USD' },
];

interface Service {
  name: string;
  price: number;
  duration: number;
  currency: string;
  pointData?: {
    pointsPerPlan: number;
    pointsRequiredForReward: number;
    durationPerReward: number;
  };
}

interface CalculatedService extends Service {
  pricePerDay: number;
  pricePerMonth: number;
  pricePerYear: number;
  calculatedPointData?: {
    plansRequired: number;
    extraDuration: number;
    totalDuration: number;
    totalPrice: number;
  };
}

interface FormattedService extends CalculatedService {
  formattedPricePerYear: string;
  formattedPricePerMonth: string;
  formattedPricePerDay: string;
  formattedPlanPrice: JSX.Element;
  formattedPlanDuration: JSX.Element;
}

const convertPrice = (price: number, fromCurrency: string, toCurrency: string): number => {
  if (fromCurrency === toCurrency || !toCurrency) return price;
  const rate = conversionRates[fromCurrency]?.[toCurrency];
  return rate ? price * rate : price;
};

const calculatePrices = (service: Service, primaryCurrency: string): CalculatedService[] => {
  const entries = [];
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
  if (service.pointData) {
    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
    const lcm = (a: number, b: number): number => (a * b) / gcd(a, b);

    const plansRequired = lcm(service.pointData.pointsPerPlan, service.pointData.pointsRequiredForReward) / service.pointData.pointsPerPlan;
    const extraDuration = ((service.pointData.pointsPerPlan * plansRequired) / service.pointData.pointsRequiredForReward) * service.pointData.durationPerReward;
    const totalDuration = service.duration * plansRequired + extraDuration;
    const totalPrice = service.price * plansRequired;

    pricePerDay = totalPrice / totalDuration;
    pricePerYear = pricePerDay * 365;
    pricePerMonth = pricePerYear / 12;

    entries.push({
      ...service,
      pricePerDay: convertPrice(pricePerDay, service.currency, baseCurrency),
      pricePerMonth: convertPrice(pricePerMonth, service.currency, baseCurrency),
      pricePerYear: convertPrice(pricePerYear, service.currency, baseCurrency),
      calculatedPointData: {
        plansRequired,
        extraDuration,
        totalDuration: totalDuration,
        totalPrice: totalPrice,
      }
    });
  }

  return entries;
};

const formatPrice = (price: number, currency: string) => {
  return Intl.NumberFormat(undefined, { style: 'currency', currency }).format(price);
};

const formatServiceData = (data: CalculatedService[], primaryCurrency: string): FormattedService[] => {
  return data.map(service => ({
    ...service,
    formattedPricePerYear: formatPrice(service.pricePerYear, primaryCurrency || service.currency),
    formattedPricePerMonth: formatPrice(service.pricePerMonth, primaryCurrency || service.currency),
    formattedPricePerDay: formatPrice(service.pricePerDay, primaryCurrency || service.currency),
    formattedPlanPrice: (
      <>
        {service.calculatedPointData ? (
          <>
            {formatPrice(service.price, service.currency)} x {service.calculatedPointData.plansRequired}
            <br />
            ={formatPrice(service.calculatedPointData.totalPrice, service.currency)}
          </>
        ) : (
          formatPrice(service.price, service.currency)
        )}
      </>
    ),
    formattedPlanDuration: (
      <>
        {service.calculatedPointData ? (
          <>
            {service.calculatedPointData.totalDuration - service.duration} + ({service.pointData.durationPerReward} x {service.calculatedPointData.plansRequired})
            <br />
            ={service.calculatedPointData.totalDuration}
          </>
        ) : (
          `${service.duration}`
        )}
      </>
    ),
  }));
};

export default function DebridCostComparisonTable({ excludeServices }: { excludeServices?: string[]; }): JSX.Element {
  const [primaryCurrency, setPrimaryCurrency] = useState<string>('GBP');
  const [formattedData, setFormattedData] = useState<FormattedService[]>([]);

  useEffect(() => {
    let filteredServices = serviceData;
    if (excludeServices) {
      excludeServices.forEach((service) => {
        filteredServices = filteredServices.filter((s) => !s.name.toLowerCase().includes(service.toLowerCase()));
      });
    }

    const data = filteredServices.flatMap((service) => calculatePrices(service, primaryCurrency));

    if (primaryCurrency) {
      data.sort((a, b) => a.pricePerYear - b.pricePerYear);
    } else {
      data.sort((a, b) => a.name.localeCompare(b.name));
    }

    const formatted = formatServiceData(data, primaryCurrency);
    setFormattedData(formatted);
  }, [primaryCurrency, excludeServices]);

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
          {formattedData.map((service, index) => (
            <tr key={index}>
              <td>{service.name} {service.pointData && (<><br/><span>(w/ FP)</span></>)}</td>
              <td>{service.formattedPricePerYear}</td>
              <td>{service.formattedPricePerMonth}</td>
              <td>{service.formattedPricePerDay}</td>
              <td>{service.formattedPlanPrice}</td>
              <td>{service.formattedPlanDuration}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}