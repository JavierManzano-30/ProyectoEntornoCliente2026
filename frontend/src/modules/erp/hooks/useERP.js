import { useContext } from 'react';
import ERPContext from '../context/ERPContext';

/**
 * Hook para acceder al contexto ERP
 * @returns {Object} Contexto ERP con estado y funciones
 */
export const useERP = () => {
  const context = useContext(ERPContext);
  
  if (!context) {
    throw new Error('useERP debe ser usado dentro de un ERPProvider');
  }
  
  return context;
};

export default useERP;
