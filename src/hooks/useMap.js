import { useEffect, useMemo, useState } from 'react';

export function useMap(initialState) {
  const [mapInstance, setMapInstance] = useState(null);

  useEffect(() => {
    if (!initialState) return;
    setMapInstance({ ...initialState });
  }, [initialState]);

  const clusterOptions = useMemo(() => ({
    radius: 50,
    maxZoom: 14,
  }), []);

  return {
    mapInstance,
    clusterOptions,
  };
}
