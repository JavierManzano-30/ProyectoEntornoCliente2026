import { useEffect, useState } from "react";
import { fetchReports } from "../services/biApi";

export default function useReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchReports()
      .then((res) => setReports(res.data))
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { reports, loading, error };
}
