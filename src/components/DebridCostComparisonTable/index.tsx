import React, { useState } from 'react';
import Select from 'react-select';
import styles from './styles.module.css';

export default function DebridCostComparisonTable({ excludeServices }: { excludeServices?: string[]; }): JSX.Element {
  const [primaryCurrency, setPrimaryCurrency] = useState<string>('GBP');

  const conversionRates = require('@site/static/currency_rates.json');
  const availableCurrencies = Object.keys(conversionRates['USD']).filter((currency) => Object.keys(conversionRates['EUR']).includes(currency));


  // Define service data
  let services = [
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

  if (excludeServices) {
    excludeServices.forEach((service) => {
      services = services.filter((s) => !s.name.toLowerCase().includes(service.toLowerCase()));
    });
  }

  // Helper function to convert prices
  const convertPrice = (price: number, fromCurrency: string, toCurrency: string): number => {
    if (fromCurrency === toCurrency || !toCurrency) return price;
    const rate = conversionRates[fromCurrency]?.[toCurrency];
    if (!rate) {
      return null;
    }
    return price * rate;
  };

  // Helper function to format prices
  const formatPrice = (price: number, currency: string) => {
    if (!price) return;
    return Intl.NumberFormat(undefined, { style: 'currency', currency: currency }).format(price);
  };

  // Prepare data with calculated prices
  const data = services.flatMap((service) => {
    const entries = [];

    // Entry without considering points
    let pricePerDay = service.price / service.duration;
    let pricePerYear = pricePerDay * 365;
    let pricePerMonth = pricePerYear / 12;

    entries.push({
      ...service,
      pointsUsed: false,
      pricePerDay: convertPrice(pricePerDay, service.currency, primaryCurrency || service.currency),
      pricePerMonth: convertPrice(pricePerMonth, service.currency, primaryCurrency || service.currency),
      pricePerYear: convertPrice(pricePerYear, service.currency, primaryCurrency || service.currency),
      price: service.price,
      duration: service.duration,
    });

    // Entry considering points
    if (service.pointsPerPlan && service.pointsRequiredForReward && service.durationPerReward) {
      const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
      const lcm = (a: number, b: number): number => (a * b) / gcd(a, b);

      const plansRequired = lcm(service.pointsPerPlan, service.pointsRequiredForReward) / service.pointsPerPlan;
      const planDuration = service.duration * plansRequired + ((service.pointsPerPlan * plansRequired) / service.pointsRequiredForReward) * service.durationPerReward;
      const planPrice = service.price * plansRequired;

      pricePerDay = planPrice / planDuration;
      pricePerYear = pricePerDay * 365;
      pricePerMonth = pricePerYear / 12;

      entries.push({
        ...service,
        pointsUsed: true,
        pricePerDay: convertPrice(pricePerDay, service.currency, primaryCurrency || service.currency),
        pricePerMonth: convertPrice(pricePerMonth, service.currency, primaryCurrency || service.currency),
        pricePerYear: convertPrice(pricePerYear, service.currency, primaryCurrency || service.currency),
        price: planPrice,
        duration: planDuration,
      });
    }

    return entries;
  });

  // Sort data by price per day or service name if primary currency is not set
  if (primaryCurrency) {
    data.sort((a, b) => a.pricePerYear - b.pricePerYear);
  } else {
    data.sort((a, b) => a.name.localeCompare(b.name));
  }


  
  const currencyOptions = [...availableCurrencies.map((currency) => ({ value: currency, label: currency }))];


  return (
    <div className={styles["table-container"]}>
      <div className={styles["currency-select-container"]}>
        <div className={styles["currency-select-box"]}>
          <label htmlFor="currency-select"><strong>Select Currency (or clear for Original):</strong></label>
          <Select
            id="currency-select"
            className={styles["currency-select"]}
            value={{value: primaryCurrency, label: primaryCurrency}}
            onChange={(selectedOption) => setPrimaryCurrency(selectedOption ? selectedOption.value : null)}
            options={currencyOptions}
            isClearable={true}
          />
        </div>
      </div>
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
          {data.map((service, index) => (
            <tr key={index}>
              <td>{service.name} {service.pointsUsed && "(with points*)"}</td>
              <td>{formatPrice(service.pricePerYear, primaryCurrency || service.currency)}</td>
              <td>{formatPrice(service.pricePerMonth, primaryCurrency || service.currency)}</td>
              <td>{formatPrice(service.pricePerDay, primaryCurrency || service.currency)}</td>
              <td>{formatPrice(service.price, service.currency)}</td>
              <td>{service.duration}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
