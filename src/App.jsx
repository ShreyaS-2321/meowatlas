import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import { MapProvider } from './hooks/useMapContext';
import './styles/variables.css';
import './styles/global.css';

const App = () => {
  return (
    <MapProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </MapProvider>
  );
};

export default App;