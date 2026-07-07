import React from 'react';
import styles from './PhotoGallery.module.css';

const PhotoGallery = ({ photos }) => {
  if (!photos || photos.length === 0) return null;

  return (
    <div className={styles.galleryContainer}>
      <h3 className={styles.sectionTitle}>Spotted Moments</h3>
      <div className={styles.scrollArea}>
        {photos.map((photo, index) => (
          <div key={index} className={styles.photoWrapper}>
            <img src={photo} alt="Cat moment" className={styles.photo} loading="lazy" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhotoGallery;