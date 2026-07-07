import React from 'react';
import styles from './MainLayout.module.css';
import TopNav from '../components/layout/TopNav';
import BottomStatsDashboard from '../components/layout/BottomStatsDashboard';
import PawCursorTrail from '../components/ui/PawCursorTrail';

const MainLayout = ({ children, cats = [] }) => {
  return (
    <div className={styles.layoutContainer}>
      <PawCursorTrail />
      <TopNav />
      <main className={styles.mapArea}>
        {children}
      </main>

      <BottomStatsDashboard cats={cats} />
    </div>
  );
};

export default MainLayout;
