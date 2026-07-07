import { useEffect, useState } from 'react';
import { fetchCats } from '../services/database';

export function useCats(filters) {
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);

    fetchCats(filters)
      .then((result) => {
        if (active) setCats(result);
      })
      .catch((err) => {
        if (active) setError(err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [filters]);

  return { cats, loading, error };
}
