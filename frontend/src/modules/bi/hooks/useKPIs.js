import { useEffect, useState } from "react";
import { fetchKPIs } from "../services/biApi";

export default function useKPIs(params) {
  const [kpis, setKpis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchKPIs(params)
      .then((res) => setKpis(res.data))
      .catch(setError)
      .finally(() => setLoading(false));
  }, [params]);

  return { kpis, loading, error };
}
