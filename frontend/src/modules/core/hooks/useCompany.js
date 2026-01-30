import { useState, useEffect, useCallback } from 'react';
import { getCompany, getCompanyUsers } from '../services/coreService';

export const useCompany = (id) => {
  const [company, setCompany] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCompany = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const [companyData, usersData] = await Promise.all([
        getCompany(id),
        getCompanyUsers(id),
      ]);
      setCompany(companyData);
      setUsers(usersData);
    } catch (err) {
      setError(err.message || 'Error al cargar empresa');
      console.error('Error fetching company:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCompany();
  }, [fetchCompany]);

  const refetch = useCallback(() => {
    fetchCompany();
  }, [fetchCompany]);

  return {
    company,
    users,
    loading,
    error,
    refetch,
  };
};
