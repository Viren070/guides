export default function generateDebridCostTable(generateDebridCostTableProps: { primaryCurrency: string; }): JSX.Element {
    const { primaryCurrency } = generateDebridCostTableProps;
    // Define conversion rates
    const conversionRates = {
      EUR_TO_USD: 1.0982,
      EUR_TO_GBP: 0.8369,
      USD_TO_GBP: 0.7621,
    };
  
    const conversionRatesMapping = {
      EUR: { USD: conversionRates.EUR_TO_USD, GBP: conversionRates.EUR_TO_GBP },
      USD: { GBP: conversionRates.USD_TO_GBP, EUR: 1 / conversionRates.EUR_TO_USD },
      GBP: { USD: 1 / conversionRates.USD_TO_GBP, EUR: 1 / conversionRates.EUR_TO_GBP },
    };
  
    // Define service data
    const services = [
      { name: 'Torbox (Essential)', price: 30, duration: 365, currency: 'USD' },
      { name: 'Torbox (Standard)', price: 55, duration: 365, currency: 'USD' },
      { name: 'Torbox (Pro)', price: 110, duration: 365, currency: 'USD' },
      { name: 'Real-Debrid', price: 16, duration: 180, currency: 'EUR' },
      { name: 'Debrid-Link', price: 25, duration: 300, currency: 'EUR' },
      { name: 'AllDebrid', price: 24.99, duration: 300, currency: 'EUR' },
      { name: 'Offcloud', price: 54.99, duration: 365, currency: 'USD' },
      { name: 'Premiumize', price: 69.99, duration: 365, currency: 'EUR' },
      { name: 'put.io (100GB)', price: 99, duration: 365, currency: 'USD' },
      { name: 'put.io (1TB)', price: 199, duration: 365, currency: 'USD' },
    ];
  
  
    // Helper function to convert prices
    const convertPrice = (price, fromCurrency, toCurrency) => {
      if (fromCurrency === toCurrency || !toCurrency || !["USD", "EUR", "GBP"].includes(toCurrency)) return price;
      return price * conversionRatesMapping[fromCurrency][toCurrency];
    };
  
    // Helper function to format prices
    const formatPrice = (price, currency) => {
      const symbols = { GBP: '£', EUR: '€', USD: '$' };
      return `${symbols[currency] || ''}${price.toFixed(2)}`;
    };
  
    // Prepare data with calculated prices
    const data = services.map((service) => {
      const pricePerDay = service.price / service.duration;
      const pricePerMonth = pricePerDay * 30;
      const pricePerYear = pricePerDay * 365;
  
      return {
        ...service,
        pricePerDay,
        pricePerMonth,
        pricePerYear,
      };
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
              <td>{formatPrice(convertPrice(service.pricePerYear, service.currency, primaryCurrency), primaryCurrency || service.currency)}</td>
              <td>{formatPrice(convertPrice(service.pricePerMonth, service.currency, primaryCurrency), primaryCurrency || service.currency)}</td>
              <td>{formatPrice(convertPrice(service.pricePerDay, service.currency, primaryCurrency), primaryCurrency || service.currency)}</td>
              <td>{formatPrice(service.price, service.currency)}</td>
              <td>{service.duration}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
  