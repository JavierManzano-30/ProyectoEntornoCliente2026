import { useEffect, useState } from "react";
import { fetchAlerts } from "../services/biApi";

export default function useAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchAlerts()
      .then((res) => setAlerts(res.data))
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { alerts, loading, error };
}
