import { createContext } from 'react';

/**
 * Contexto global del módulo ERP
 * Proporciona acceso al estado y funciones del módulo ERP
 */
const ERPContext = createContext({
  // Estado del módulo
  selectedModule: null,
  selectedPeriod: null,
  currency: 'EUR',
  
  // Funciones de configuración
  setSelectedModule: () => {},
  setSelectedPeriod: () => {},
  setCurrency: () => {},
  
  // Estado de carga
  loading: false,
  error: null
});

export default ERPContext;
