import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { formatMoney, getCurrencySymbol } from '../utils/formatters';

const CurrencyContext = createContext(null);

export const CurrencyProvider = ({ children }) => {
  const { user } = useAuth();
  const [currency, setCurrencyState] = useState(() => {
    return user?.currency || localStorage.getItem('app_currency') || 'USD';
  });

  useEffect(() => {
    if (user?.currency && user.currency !== currency) {
      setCurrencyState(user.currency);
      localStorage.setItem('app_currency', user.currency);
    }
  }, [user?.currency]);

  const setCurrency = (newCurrency) => {
    setCurrencyState(newCurrency);
    localStorage.setItem('app_currency', newCurrency);
  };

  const format = (amount) => formatMoney(amount, currency);
  const symbol = getCurrencySymbol(currency);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, format, symbol }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error('useCurrency must be used within a CurrencyProvider');
  return context;
};

