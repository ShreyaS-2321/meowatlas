import React, { createContext, useContext, useState, useCallback } from 'react';

const MapContext = createContext();

export const MapProvider = ({ children }) => {
  const [mapInstance, setMapInstance] = useState(null);


  const flyToLocation = useCallback((lng, lat, zoom = 14) => {
    if (mapInstance) {
      mapInstance.flyTo({
        center: [lng, lat],
        zoom: zoom,
        duration: 2500, 
        curve: 1.5,     
        essential: true 
      });
    }
  }, [mapInstance]);

  return (
    <MapContext.Provider value={{ mapInstance, setMapInstance, flyToLocation }}>
      {children}
    </MapContext.Provider>
  );
};


export const useMap = () => useContext(MapContext);