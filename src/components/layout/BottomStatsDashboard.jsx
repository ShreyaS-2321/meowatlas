import React from 'react';
import { motion } from 'framer-motion';
import { FiGlobe, FiHome, FiMapPin, FiShield, FiTrendingUp } from 'react-icons/fi';
import { FaCat, FaPaw } from 'react-icons/fa';
import styles from './BottomStatsDashboard.module.css';

const countBy = (items, getKey) => {
  return items.reduce((counts, item) => {
    const key = getKey(item);
    if (!key) return counts;
    counts[key] = (counts[key] || 0) + 1;
    return counts;
  }, {});
};

const getTopKey = (counts, fallback = 'N/A') => {
  const entries = Object.entries(counts);
  if (entries.length === 0) return fallback;
  return entries.sort((a, b) => b[1] - a[1])[0][0];
};

const formatNumber = (value) => new Intl.NumberFormat('en-US').format(value);

const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.05,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const BottomStatsDashboard = ({ cats = [] }) => {
  const categoryCounts = countBy(cats, (cat) => cat.category);
  const countryCounts = countBy(cats, (cat) => cat.country);
  const breedCounts = countBy(cats, (cat) => cat.breed);
  const uniqueCountries = new Set(cats.map((cat) => cat.country).filter(Boolean)).size;
  
  const stats = [
    { id: 'total', label: 'Total Cats', value: formatNumber(cats.length), icon: FaCat },
    { id: 'countries', label: 'Countries', value: formatNumber(uniqueCountries), icon: FiGlobe },
    { id: 'common', label: 'Top Breed', value: getTopKey(breedCounts), icon: FaPaw },
    

    { id: 'pet', label: 'Pet Cats', value: formatNumber(categoryCounts['Pet Cat'] || 0), icon: FiHome },
    { id: 'street', label: 'Street Cats', value: formatNumber(categoryCounts['Street Cat'] || 0), icon: FiMapPin },
    { id: 'shelter', label: 'Shelter', value: formatNumber(categoryCounts['Shelter Cat'] || 0), icon: FiShield },
  ];

  return (
    <motion.div
      className={styles.dashboardContainer}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className={styles.scrollWrapper}>
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <motion.div
              key={stat.id}
              className={styles.statCard}
              variants={cardVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <div className={styles.iconWrapper}><Icon /></div>
              <div className={styles.statInfo}>
                <span className={styles.statValue}>{stat.value}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default BottomStatsDashboard;