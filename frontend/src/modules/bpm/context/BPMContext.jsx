/**
 * Context para el módulo BPM
 */

import { createContext, useContext } from 'react';

export const BPMContext = createContext(null);

export const useBPMContext = () => {
  const context = useContext(BPMContext);
  if (!context) {
    throw new Error('useBPMContext debe usarse dentro de BPMProvider');
  }
  return context;
};
