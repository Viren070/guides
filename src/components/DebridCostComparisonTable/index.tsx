export default function generateDebridCostTable(generateDebridCostTableProps: { primaryCurrency: string, excludeServices?: string[]; }): JSX.Element {
    const { primaryCurrency, excludeServices } = generateDebridCostTableProps;
    // Define conversion rates
    const conversionRates = {
      EUR_TO_USD: 1.0881,
      EUR_TO_GBP: 0.8392,
      USD_TO_GBP: 0.7713,
      EUR_TO_AUD: 1.6477,
      USD_TO_AUD: 1.5143,
    };
    
    const conversionRatesMapping = {
      EUR: { EUR: 1, USD: conversionRates.EUR_TO_USD, GBP: conversionRates.EUR_TO_GBP, AUD: conversionRates.EUR_TO_AUD },
      USD: { EUR: 1 / conversionRates.EUR_TO_USD, USD: 1, GBP: conversionRates.USD_TO_GBP, AUD: conversionRates.USD_TO_AUD },
      GBP: { EUR: 1 / conversionRates.EUR_TO_GBP, USD: 1 / conversionRates.USD_TO_GBP, GBP: 1, AUD: 1 / conversionRates.EUR_TO_AUD },
      AUD: { EUR: 1 / conversionRates.EUR_TO_AUD, USD: 1 / conversionRates.USD_TO_AUD, GBP: 1 / conversionRates.EUR_TO_AUD, AUD: 1 },
    }

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
      // go through each excluded service and see if that string is within the name of the service
      excludeServices.forEach((service) => {
        services = services.filter((s) => !s.name.toLowerCase().includes(service.toLowerCase()));
      });
    }
    
    // Helper function to convert prices
    const convertPrice = (price: number, fromCurrency: string, toCurrency: string): number => {
      if (fromCurrency === toCurrency || !toCurrency || !["USD", "EUR", "GBP", "AUD"].includes(toCurrency)) return price;
      return price * conversionRatesMapping[fromCurrency][toCurrency];
    };
  
    // Helper function to format prices
    const formatPrice = (price: number, currency: string) => {
      const symbols = { GBP: '£', EUR: '€', USD: '$', AUD: '$' };
      return `${symbols[currency] || ''}${price.toFixed(2)}`;
    };
  
    // Prepare data with calculated prices
    const data = services.map((service) => {
      let pricePerDay: number, pricePerMonth: number, pricePerYear: number, price: number, duration: number, pointsUsed: boolean;
      if (service.pointsPerPlan && service.pointsRequiredForReward && service.durationPerReward) {
        const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
        const lcm = (a: number, b: number): number => (a * b) / gcd(a, b);

        const plansRequired = lcm(service.pointsPerPlan, service.pointsRequiredForReward) / service.pointsPerPlan;
        console.log(service.name, plansRequired);
        const planDuration = service.duration * plansRequired + ((service.pointsPerPlan * plansRequired) / service.pointsRequiredForReward) * service.durationPerReward;
        const planPrice = service.price * plansRequired;

        pricePerDay = planPrice / planDuration
        price = planPrice;
        duration = planDuration;
        pointsUsed = true;

      } else {
        pricePerDay = service.price / service.duration
        price = service.price;
        duration = service.duration;
        pointsUsed = false;
      }
      
      pricePerMonth = pricePerDay * 30;
      pricePerYear = pricePerDay * 365;

      return {
        ...service,
        pointsUsed,
        pricePerDay: convertPrice(pricePerDay, service.currency, primaryCurrency || service.currency),
        pricePerMonth: convertPrice(pricePerMonth, service.currency, primaryCurrency || service.currency),
        pricePerYear: convertPrice(pricePerYear, service.currency, primaryCurrency || service.currency),
        price,
        duration,
      }
    });
  
    // Sort data by price per day or service name if primary currency is not set
    if (primaryCurrency) {
      data.sort((a, b) => a.pricePerYear - b.pricePerYear);
    } else {
      data.sort((a, b) => a.name.localeCompare(b.name));  
    }
  
    return (
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
              <td>{service.name}</td>
              <td>{formatPrice(service.pricePerYear,  primaryCurrency || service.currency)}</td>
              <td>{formatPrice(service.pricePerMonth, primaryCurrency || service.currency)}</td>
              <td>{formatPrice(service.pricePerDay, primaryCurrency || service.currency)}</td>
              <td>{formatPrice(service.price, service.currency)}</td>
              <td>{service.duration}{service.pointsUsed && "*"}</td>
            </tr>
          ))}
        </tbody>
        <br/>
        <p>
          *Point systems such as fidelity points were also included in the calculation of the duration and therefore the price per day, month and year.
        </p>
      </table>
    );
  }
  