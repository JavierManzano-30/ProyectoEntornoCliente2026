import { useState, useEffect } from "react";
import { biService } from "../services/biService";

export const useReport = (id) => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    biService
      .getReportById(id)
      .then(setReport)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  return { report, loading, error };
};
