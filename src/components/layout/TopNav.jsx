import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiMapPin, FiPlus, FiSearch } from 'react-icons/fi';
import { FaPaw } from 'react-icons/fa';
import { useMap } from '../../hooks/useMapContext';
import { getAllCats } from '../../services/database';
import AddCatModal from '../forms/AddCatModal';
import styles from './TopNav.module.css';

const TopNav = () => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [dynamicSearchData, setDynamicSearchData] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { flyToLocation } = useMap();
  const searchRef = useRef(null);

  useEffect(() => {
    console.debug('[TopNav] isAddModalOpen ->', isAddModalOpen);
  }, [isAddModalOpen]);

  useEffect(() => {
    const loadSearchData = async () => {
      try {
        const data = await getAllCats();
        setDynamicSearchData(data);
      } catch (error) {
        console.error('Failed to load search data', error);
      }
    };

    loadSearchData();
  }, [isAddModalOpen]);

  const results = dynamicSearchData.filter((item) => {
    if (!query || query.trim() === '') return false;
    const q = query.toLowerCase().trim();
    return (
      (item.name && item.name.toLowerCase().includes(q)) ||
      (item.city && item.city.toLowerCase().includes(q)) ||
      (item.country && item.country.toLowerCase().includes(q)) ||
      (item.breed && item.breed.toLowerCase().includes(q))
    );
  });

  const handleSelect = (lng, lat) => {
    flyToLocation(lng, lat, 14);
    setQuery('');
    setIsFocused(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <motion.header
        className={styles.navbar}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className={styles.navContent}>
          <div className={styles.logo}>
            <img src="/hwclogo.svg" alt="MeowAtlas Logo" width="40" height="40" />
            <h1>MeowAtlas</h1>
          </div>

          <div className={styles.searchContainer} ref={searchRef}>
            <div className={styles.inputWrapper}>
              <FiSearch className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search live cats, cities, breeds..."
                className={styles.searchInput}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onFocus={() => setIsFocused(true)}
              />
            </div>

            <AnimatePresence>
              {isFocused && query.trim().length > 0 && (
                <motion.div
                  className={styles.dropdown}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  {results.length > 0 ? (
                    results.map((result) => (
                      <div
                        key={result.$id}
                        className={styles.dropdownItem}
                        onClick={() => handleSelect(result.lng, result.lat)}
                      >
                        <div className={styles.itemIcon}><FaPaw /></div>
                        <div className={styles.itemText}>
                          <span className={styles.itemName}>{result.name || 'Unknown Friend'}</span>
                          <span className={styles.itemLoc}>
                            {result.city ? `${result.city}, ` : ''}{result.country}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className={styles.noResults}>No matches found.</div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className={styles.actions}>
            <div className={styles.newCatsBadge}>
              <FiMapPin />
              <span>{dynamicSearchData.length} Total Cats</span>
            </div>

            <button
              className={styles.addCatBtn}
              onClick={() => {
                console.debug('[TopNav] Add button clicked');
                setIsAddModalOpen(true);
              }}
            >
              <FiPlus className={styles.btnIcon} />
              <span>Add a Cat</span>
            </button>
          </div>
        </div>
      </motion.header>

      <AddCatModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          window.location.reload();
        }}
      />
    </>
  );
};

export default TopNav;
