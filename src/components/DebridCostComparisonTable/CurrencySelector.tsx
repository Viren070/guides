import React from 'react';
import Select from 'react-select';
import { useColorMode } from '@docusaurus/theme-common';
import styles from './styles.module.css';

const getStyles = (colorMode: string) => ({
  control: (baseStyles: any, state: { isFocused: any; }) => ({
    ...baseStyles,
    borderWidth: '2px',
    backgroundColor: colorMode === 'dark' ? '#1b1b1d' : 'white',
    borderRadius: 'var(--ifm-global-radius)',
    borderColor: state.isFocused ? 'var(--ifm-color-primary-darkest)' : null,
    color: 'var(--ifm-color-primary-dark)',
    boxShadow: 'var(--button-box-shadow)',
    "&:hover": {
      borderColor: state.isFocused ? 'var(--ifm-color-primary-darkest)' : null,
      boxShadow: 'var(--button-hover-box-shadow)',
    },
  }),
  input: (baseStyles: any, state: any) => ({
    ...baseStyles,
    color: 'var(--ifm-color-primary-lightest)',
  }),
  singleValue: (baseStyles: any, state: any) => ({
    ...baseStyles,
    color: 'var(--ifm-color-primary-lightest)',
  }),
  menu: (baseStyles: any, state: any) => ({
    ...baseStyles,
    color: colorMode === 'dark' ? 'white' : 'black',
    backgroundColor: colorMode === 'dark' ? '#1b1b1d' : 'white',
  }),
  option: (baseStyles: any, state: { isFocused: any; }) => ({
    ...baseStyles,
    color: 'var(--ifm-color-primary-lightest)',
    backgroundColor: state.isFocused ? 'var(--ifm-color-primary-darkest)' : null,
    "&:hover": {
      backgroundColor: 'var(--ifm-color-primary-darker)',
    },
    "&:active": {
        backgroundColor: 'var(--ifm-color-primary-darkest)',
    },
  }),
});

interface CurrencySelectorProps {
  primaryCurrency: string;
  setPrimaryCurrency: (currency: string) => void;
  currencyOptions: { value: string, label: string }[];
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({ primaryCurrency, setPrimaryCurrency, currencyOptions }) => {
  const { colorMode } = useColorMode();

  return (
    <div className={styles["currency-select-container"]}>
      <div className={styles["currency-select-box"]}>
        <label htmlFor="currency-select"><strong>Select Currency (or clear for Original):</strong></label>
        <Select
          id="currency-select"
          value={{ value: primaryCurrency, label: primaryCurrency }}
          onChange={(selectedOption) => setPrimaryCurrency(selectedOption ? selectedOption.value : null)}
          options={currencyOptions}
          isClearable={true}
          styles={getStyles(colorMode)}
        />
      </div>
    </div>
  );
};

export default CurrencySelector;