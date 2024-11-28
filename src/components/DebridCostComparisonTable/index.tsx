import React, { useState, useEffect } from 'react';
import CurrencySelector from './CurrencySelector';
import Settings from './Settings';
import { convertPrice, formatPrice } from './CurrencyRates';
import { initialServiceData } from './ServiceData';
import styles from './styles.module.css';
import Translate from '@docusaurus/Translate';

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
            {service.duration * service.calculatedPointData.plansRequired} + ({service.pointData.durationPerReward} x {service.calculatedPointData.extraDuration / service.pointData.durationPerReward})
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
  const [primaryCurrency, setPrimaryCurrency] = useState<string>('');
  const [formattedData, setFormattedData] = useState<FormattedService[]>([]);
  const [serviceData, setServiceData] = useState<Service[]>(initialServiceData);
  const [showSettings, setShowSettings] = useState<boolean>(false);

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
  }, [primaryCurrency, excludeServices, serviceData]);

  return (
    <>
      {showSettings && <Settings serviceData={serviceData} setServiceData={setServiceData} closeSettings={() => setShowSettings(false)} primaryCurrency={primaryCurrency} setPrimaryCurrency={setPrimaryCurrency} />}
      <button onClick={() => setShowSettings(!showSettings)} className={styles.settingsButton} >
        <b>
          <Translate
            id="debridTable.configureButton"
            description="Button to configure table data"
          >
            Configure Table Data
          </Translate>
        </b>
      </button>
        <CurrencySelector
          primaryCurrency={primaryCurrency}
          setPrimaryCurrency={setPrimaryCurrency}
        />
      <table>
        <thead>
          <tr>
            <th><Translate id='debridService' description='General term to refer to Debrid Services'>Debrid Service</Translate></th>
            <th><Translate id="debridTable.pricePerYear" description="Label to refer to the price of a debrid service per year">Price per Year</Translate><br/>{primaryCurrency && ` (${primaryCurrency})`}</th>
            <th><Translate id="debridTable.pricePerMonth" description="Label to refer to the price of a debrid service per month">Price per Month</Translate><br/>{primaryCurrency && ` (${primaryCurrency})`}</th>
            <th><Translate id="debridTable.pricePerDay" description="Label to refer to the price of a debrid service per day">Price per Day</Translate><br/>{primaryCurrency && ` (${primaryCurrency})`}</th>
            <th><Translate id="debridTable.planPrice" description="Label to refer to the total price of the relevant plan for a debrid service">Plan Price</Translate></th>
            <th><Translate id="debridTable.planDurationInDays" description="Label to refer to the total duration of a plan measured in days">Plan Duration (Days)</Translate></th>
          </tr>
        </thead>
        <tbody>
          {formattedData.map((service, index) => (
            <tr key={index}>
              <td>{service.name} {service.calculatedPointData && (<><br/><span>(w/ FP)</span></>)}</td>
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