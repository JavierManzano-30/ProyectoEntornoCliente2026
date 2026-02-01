import { useState, useCallback } from 'react';
import ERPContext from './ERPContext';
import { CURRENCY_CONFIG, ERP_MODULES, FISCAL_PERIODS } from '../config';

/**
 * Provider del contexto ERP
 * Maneja el estado global del módulo ERP
 */
export const ERPProvider = ({ children }) => {
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState({
    type: FISCAL_PERIODS.MONTHLY,
    startDate: null,
    endDate: null
  });
  const [currency, setCurrency] = useState(CURRENCY_CONFIG.DEFAULT_CURRENCY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Actualizar módulo seleccionado
  const handleSetModule = useCallback((module) => {
    if (Object.values(ERP_MODULES).includes(module) || module === null) {
      setSelectedModule(module);
    }
  }, []);

  // Actualizar período seleccionado
  const handleSetPeriod = useCallback((period) => {
    setSelectedPeriod(period);
  }, []);

  // Actualizar moneda
  const handleSetCurrency = useCallback((newCurrency) => {
    setCurrency(newCurrency);
  }, []);

  const value = {
    // Estado
    selectedModule,
    selectedPeriod,
    currency,
    loading,
    error,
    
    // Funciones
    setSelectedModule: handleSetModule,
    setSelectedPeriod: handleSetPeriod,
    setCurrency: handleSetCurrency,
    setLoading,
    setError
  };

  return (
    <ERPContext.Provider value={value}>
      {children}
    </ERPContext.Provider>
  );
};

export default ERPProvider;
