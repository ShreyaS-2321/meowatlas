import React, { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import MapContainer from '../components/map/MapContainer';
import ProfilePanel from '../components/profile/ProfilePanel';
import { getAllCats } from '../services/database';

const Home = () => {
  const [cats, setCats] = useState([]);
  const [selectedCat, setSelectedCat] = useState(null); 

  const fetchCats = async () => {
    try {
      const data = await getAllCats();
      setCats(data);
    } catch (error) {
      console.error("Error fetching cats:", error);
    }
  };

  useEffect(() => {
    fetchCats();
  }, []);

  return (
    <MainLayout cats={cats}>
      <MapContainer cats={cats} onSelectCat={setSelectedCat} />
      {selectedCat && (
        <ProfilePanel 
          cat={selectedCat} 
          onClose={() => setSelectedCat(null)} 
        />
      )}
    </MainLayout>
  );
};

export default Home;
