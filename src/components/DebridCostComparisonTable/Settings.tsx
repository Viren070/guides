import React, { useState } from 'react';
import './Settings.css';
import { availableCurrencies } from './CurrencyRates';
import { initialServiceData } from './ServiceData';
import { showToast } from '@site/src/components/Toasts';

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
  const [tempServiceData, setTempServiceData] = useState<Service[]>([...serviceData]);
  const [isClosing, setIsClosing] = useState(false);
  const [newServiceIndex, setNewServiceIndex] = useState<number | null>(null);
  const [deletedServiceIndex, setDeletedServiceIndex] = useState<number | null>(null);

  const handleAddService = () => {
    const newService: Service = {
      name: '',
      price: 0,
      duration: 0,
      currency: 'USD',
    };
    setTempServiceData([...tempServiceData, newService]);
    setNewServiceIndex(tempServiceData.length);
  };

  const handleUpdateService = (index: number, updatedService: Service) => {
    const updatedServices = [...tempServiceData];
    updatedServices[index] = updatedService;
    setTempServiceData(updatedServices);
  };

  const handleDeleteService = (index: number) => {
    setDeletedServiceIndex(index);
    setTimeout(() => {
      const updatedServices = tempServiceData.filter((_, i) => i !== index);
      setTempServiceData(updatedServices);
      setDeletedServiceIndex(null);
    }, 500);
  };

  const handleApplyChanges = () => {
    if (tempServiceData.some((service) => !service.name || !service.price || !service.duration)) {
      showToast('All fields must be filled in', 'error');
      return;
    }
    if (tempServiceData.some((service) => service.price <= 0 || service.duration <= 0)) {
      showToast('Price and duration must be greater than 0', 'error');
      return;
    }


    setServiceData(tempServiceData);
    handleClose();
  };

  const handleReset = () => {
    setTempServiceData(initialServiceData);
    setServiceData(initialServiceData);
    handleClose();
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      closeSettings();
    }, 500);
  }

  return (
    <div className={`settings-popup ${isClosing ? 'fade-out' : ''}`}>
      <div className="settings-content">
        <button onClick={handleClose} className="close-button">X</button>
        <h2>Service Data</h2>
        <div className="service-list">
          {tempServiceData.map((service, index) => (
            <div
            key={index}
            className={
              `service-item ${index === newServiceIndex ? 'new-service' : ''} ${index === deletedServiceIndex ? 'deleted-service' : ''}`
            }
            onAnimationEnd={() => {
              if (index === newServiceIndex) {
                setNewServiceIndex(null);
              }
            }}
          >
              <label style={{ color: 'white' }}>Service Name</label>
              <input
                type="text"
                value={service.name}
                onChange={(e) => handleUpdateService(index, { ...service, name: e.target.value })}
                placeholder="Service Name"
              />
              <label style={{ color: 'white' }}>Price</label>
              <input
                type="number"
                value={service.price}
                onChange={(e) => handleUpdateService(index, { ...service, price: parseFloat(e.target.value) })}
                placeholder="Price"
              />
              <label style={{ color: 'white' }}>Duration</label>
              <input
                type="number"
                value={service.duration}
                onChange={(e) => handleUpdateService(index, { ...service, duration: parseInt(e.target.value) })}
                placeholder="Duration"
              />
              <label style={{ color: 'white' }}>Currency</label>
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
          <div className="service-item add-new-service" onClick={handleAddService}>
            <button className="add-new-service-button">+</button>
          </div>
        </div>
        <div className="settings-actions">
          <button onClick={handleReset} className="reset-button">Reset</button>
          <button onClick={handleApplyChanges} className="apply-button">Apply</button>
        </div>
      </div>
    </div>
  );
};

export default Settings;