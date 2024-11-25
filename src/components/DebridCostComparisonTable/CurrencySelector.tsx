import React from 'react';
import styles from './styles.module.css';
import { CurrencySelect } from './CurrencySelect';


interface CurrencySelectorProps {
  primaryCurrency: string;
  setPrimaryCurrency: (currency: string) => void;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({ primaryCurrency, setPrimaryCurrency }) => {
  return (
    <div className={styles["currency-select-container"]}>
      <div className={styles["currency-select-box"]}>
        <label htmlFor="currency-select"><strong>Select Primary Currency</strong><br />The currency that all other prices are converted to. Leave blank to see original prices.</label>
          <CurrencySelect setCurrency={setPrimaryCurrency} currency={primaryCurrency} />
      </div>
    </div>
  );
};

export default CurrencySelector;