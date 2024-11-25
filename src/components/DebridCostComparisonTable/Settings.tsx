import React, { useState } from 'react';
import './Settings.css';
import { availableCurrencies } from './CurrencyRates';
import { initialServiceData } from './ServiceData';
import CurrencySelector from './CurrencySelector';
import { CurrencySelect } from './CurrencySelect';

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

interface SettingsProps {
  serviceData: Service[];
  setServiceData: (data: Service[]) => void;
  closeSettings: () => void;
  primaryCurrency: string;
  setPrimaryCurrency: (currency: string) => void;
}

const Settings: React.FC<SettingsProps> = ({ serviceData, setServiceData, closeSettings, primaryCurrency, setPrimaryCurrency }) => {
  const [newService, setNewService] = useState<Service>({
    name: '',
    price: 0,
    duration: 0,
    currency: 'USD',
  });

  const [tempServiceData, setTempServiceData] = useState<Service[]>([...serviceData]);
  const [tempPrimaryCurrency, setTempPrimaryCurrency] = useState<string>(primaryCurrency);

  const handleAddService = () => {
    setTempServiceData([...tempServiceData, newService]);
    setNewService({ name: '', price: 0, duration: 0, currency: 'USD' });
  };

  const handleUpdateService = (index: number, updatedService: Service) => {
    const updatedServices = [...tempServiceData];
    updatedServices[index] = updatedService;
    setTempServiceData(updatedServices);
  };

  const handleDeleteService = (index: number) => {
    const updatedServices = tempServiceData.filter((_, i) => i !== index);
    setTempServiceData(updatedServices);
  };

  const handleApplyChanges = () => {
    setServiceData(tempServiceData);
    setPrimaryCurrency(tempPrimaryCurrency);
    closeSettings();
  };

  const handleReset = () => {
    setTempServiceData(initialServiceData);
  };

  return (
    <div className="settings-popup">
      <div className="settings-content">
        <h2>Settings</h2>
        <CurrencySelector
          primaryCurrency={tempPrimaryCurrency}
          setPrimaryCurrency={setTempPrimaryCurrency}
        />
        <div className="service-list">
          {tempServiceData.map((service, index) => (
            <div key={index} className="service-item">
              <label>Service Name</label>
              <input
                type="text"
                value={service.name}
                onChange={(e) => handleUpdateService(index, { ...service, name: e.target.value })}
                placeholder="Service Name"
              />
              <label>Price</label>
              <input
                type="number"
                value={service.price}
                onChange={(e) => handleUpdateService(index, { ...service, price: parseFloat(e.target.value) })}
                placeholder="Price"
              />
              <label>Duration</label>
              <input
                type="number"
                value={service.duration}
                onChange={(e) => handleUpdateService(index, { ...service, duration: parseInt(e.target.value) })}
                placeholder="Duration"
              />
              <label>Currency</label>
              <select
                value={service.currency}
                onChange={(e) => handleUpdateService(index, { ...service, currency: e.target.value })}
              >
                {availableCurrencies.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
              <button onClick={() => handleDeleteService(index)} className="delete-button">Delete</button>
            </div>
          ))}
        </div>
        <div className="new-service">
          <h3>Add New Service</h3>
          <label>Service Name</label>
          <input
            type="text"
            placeholder="Service Name"
            value={newService.name}
            onChange={(e) => setNewService({ ...newService, name: e.target.value })}
          />
          <label>Price</label>
          <input
            type="number"
            placeholder="Price"
            value={newService.price}
            onChange={(e) => setNewService({ ...newService, price: parseFloat(e.target.value) })}
          />
          <label>Duration</label>
          <input
            type="number"
            placeholder="Duration"
            value={newService.duration}
            onChange={(e) => setNewService({ ...newService, duration: parseInt(e.target.value) })}
          />
          <label>Currency</label>
          <select
            value={newService.currency}
            onChange={(e) => setNewService({ ...newService, currency: e.target.value })}
          >
            {availableCurrencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
          <button onClick={handleAddService}>Add Service</button>
        </div>
        <div className="settings-actions">
          <button onClick={handleApplyChanges} className="apply-button">Apply</button>
          <button onClick={handleReset} className="reset-button">Reset</button>
          <button onClick={closeSettings} className="close-button">Close</button>
        </div>
      </div>
    </div>
  );
};

export default Settings;