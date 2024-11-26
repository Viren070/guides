import React, { useState } from 'react';
import './Settings.css';
import { availableCurrencies } from './CurrencyRates';
import { initialServiceData } from './ServiceData';
import { showToast } from '@site/src/components/Toasts';
import Translate, { translate } from '@docusaurus/Translate';

interface Service {
  name: string;
  price: number;
  duration: number;
  currency: string;
  pointData?: {
    pointsPerPlan: number;
    pointsRequiredForReward: number;
    durationPerReward: number;
  },
  slideClass?: string;
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
    }, 500); // Match the duration of the disappearToCenter animation
  };

  const handleApplyChanges = () => {
    if (tempServiceData.some((service) => !service.name || !service.price || !service.duration)) {
      showToast(translate({
        message: 'All fields must be filled in',
        id: 'debridTable.settings.applyChanges.toast.error.missing',
        description: 'Toast message for missing fields'
      }), 'error');
      return;
    }
    if (tempServiceData.some((service) => service.price <= 0 || service.duration <= 0)) {
      showToast(translate({
        message: 'Price and duration must be greater than 0',
        id: 'debridTable.settings.applyChanges.toast.error.lessThanZero',
        description: 'Toast message for a price or duration less than 0'
      }), 'error');
      return;
    }

    setServiceData(tempServiceData);
    handleClose();
  };

  const handleReset = () => {
    setTempServiceData(initialServiceData);
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      closeSettings();
    }, 500);
  };

  return (
    <div className={`settings-popup ${isClosing ? 'fade-out' : ''}`}>
      <div className="settings-content">
        <button onClick={handleClose} className="close-button" title={translate({
          message: "Close",
          id: "debridTable.settings.closeButton.title",
          description: "Title for the close button"
        })}></button>
        <h2><Translate id="debridTable.settings.serviceData.title" description="Title for the service data section">Service Data</Translate></h2>
        <div className="service-list">
          {tempServiceData.map((service, index) => (
            <div
              key={index}
              className={`service-item ${service.slideClass} ${
                index === newServiceIndex ? 'new-service' : ''
              } ${index === deletedServiceIndex ? 'deleted-service' : ''}`}
              onAnimationEnd={() => {
                if (index === newServiceIndex) {
                  setNewServiceIndex(null);
                }
              }}
            >
              <label style={{ color: 'white' }}>
                <Translate
                  id="debridTable.settings.serviceName.label"
                  description="Label for the input field for the service name"
                >
                  Service Name
                </Translate>
              </label>
              <input
                type="text"
                value={service.name}
                onChange={(e) => handleUpdateService(index, { ...service, name: e.target.value })}
                placeholder={translate({
                  id: "debridTable.settings.serviceName.placeholder",
                  message: "Service Name",
                  description: "Placeholder for the service name input field"
                })}
              />
              <label style={{ color: 'white' }}>
                <Translate
                  id="debridTable.settings.price.label"
                  description="Label for the input field for the price"
                >
                  Price
                </Translate>
              </label>
              <input
                type="number"
                value={service.price}
                onChange={(e) => handleUpdateService(index, { ...service, price: parseFloat(e.target.value) })}
                placeholder={translate({
                  id: "debridTable.settings.price.placeholder",
                  message: "Price",
                  description: "Placeholder for the price input field"
                })}
              />
              <label style={{ color: 'white' }}>
                <Translate
                  id="debridTable.settings.duration.label"
                  description="Label for the input field for the duration in days"
                >
                  Duration (Days)
                </Translate>
              </label>
              <input
                type="number"
                value={service.duration}
                onChange={(e) => handleUpdateService(index, { ...service, duration: parseInt(e.target.value) })}
                placeholder={translate({
                  id: "debridTable.settings.duration.placeholder",
                  message: "Duration",
                  description: "Placeholder for the duration input field"
                })}
              />
              <label style={{ color: 'white' }}>
                <Translate
                  id="debridTable.settings.currency.label"
                  description="Label for the input field for the currency"
                >
                  Currency
                </Translate>
              </label>
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
              <button onClick={() => handleDeleteService(index)} className="delete-button" title={translate({
                message: "Delete",
                id: "debridTable.settings.deleteButton.title",
                description: "Title for the delete button"
              })}>
                <Translate id="debridTable.config.deleteButton.label" description="Label for the delete button">Delete</Translate>
              </button>
            </div>
          ))}
          <div className="service-item add-new-service" onClick={handleAddService} title={translate({
            message: "Add New Service",
            id: "debridTable.settings.addNewServiceButton.title",
            description: "Title for the add new service button"
          })}>
            <button className="add-new-service-button">+</button>
          </div>
        </div>
        <div className="settings-actions">
          <button onClick={handleReset} className="reset-button" title={translate({
            message: "Reset",
            id: "debridTable.settings.resetButton.title",
            description: "Title for the reset button"
          })}>
            <Translate id="debridTable.settings.resetButton.label" description="Label for the reset button">Reset</Translate>
          </button>
          <button onClick={handleApplyChanges} className="apply-button" title={translate({
            message: "Apply",
            id: "debridTable.settings.applyButton.title",
            description: "Title for the apply button"
          })}>
            <Translate id="debridTable.settings.applyButton.label" description="Label for the apply button">Apply</Translate>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;