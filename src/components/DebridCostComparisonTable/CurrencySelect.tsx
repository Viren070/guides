import { availableCurrencies } from "./CurrencyRates";
import Select from 'react-select';
import { useColorMode } from '@docusaurus/theme-common';

const currencyOptions = availableCurrencies.map((currency) => ({ value: currency, label: currency })).sort((a, b) => a.label.localeCompare(b.label));

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

interface CurrencySelectProps {
    currency: string;
    setCurrency: (currency: string) => void;
}

export const CurrencySelect: React.FC<CurrencySelectProps> = ({ currency, setCurrency }) => {
    const { colorMode } = useColorMode();
    
    return (
        <Select
        id="currency-select"
        value={{ value: currency, label: currency }}
        onChange={(selectedOption) => setCurrency(selectedOption ? selectedOption.value : null)}
        options={currencyOptions}
        isClearable={true}
        styles={getStyles(colorMode)}
        />
    );
    }
