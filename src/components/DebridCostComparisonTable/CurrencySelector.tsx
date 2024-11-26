import React from 'react';
import styles from './styles.module.css';
import { CurrencySelect } from './CurrencySelect';
import Translate from '@docusaurus/Translate';

interface CurrencySelectorProps {
  primaryCurrency: string;
  setPrimaryCurrency: (currency: string) => void;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({ primaryCurrency, setPrimaryCurrency }) => {
  return (
    <div className={styles["currency-select-container"]}>
      <div className={styles["currency-select-box"]}>
        <label htmlFor="currency-select">
          <strong>
            <Translate
              id="currencySelector.label"
              description="Label for the currency selector"
            >
              Select Primary Currency
            </Translate>
          </strong>
          <br />
          <Translate
            id="currencySelector.description"
            description="Description for the currency selector"
          >
            The currency that all other prices are converted to. Leave blank to see original prices.
          </Translate>

        </label>

        <CurrencySelect setCurrency={setPrimaryCurrency} currency={primaryCurrency} />
      </div>
    </div>
  );
};

export default CurrencySelector;