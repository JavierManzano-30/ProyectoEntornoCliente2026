import { useEffect, useState } from "react";
import { fetchDatasets } from "../services/biApi";

export default function useDatasets() {
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchDatasets()
      .then((res) => setDatasets(res.data))
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { datasets, loading, error };
}
