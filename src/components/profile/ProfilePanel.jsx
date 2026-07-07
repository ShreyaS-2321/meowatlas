import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FiFile, FiHeart, FiMapPin, FiX } from 'react-icons/fi';
import { FaFish, FaPaw } from 'react-icons/fa';
import styles from './ProfilePanel.module.css';
import { getCatImagePreview } from '../../services/storage';
import PhotoGallery from './PhotoGallery';

const overlayVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };

const ProfilePanel = ({ cat, onClose }) => {
  const [isCoverOpen, setIsCoverOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsCoverOpen(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const catId = cat.$id || 'unknown';
  const lovedStateKey = `cat_${catId}_has_loved`;
  const loveCountKey = `cat_${catId}_love_count`;
  const fishedStateKey = `cat_${catId}_has_fished`;
  const fishCountKey = `cat_${catId}_fish_count`;

  // Base counts set to 0
  const stableBaseLoves = 0;
  const stableBaseFishes = 0;

  const [hasLoved, setHasLoved] = useState(() => localStorage.getItem(lovedStateKey) === 'true');
  const [hasFished, setHasFished] = useState(() => localStorage.getItem(fishedStateKey) === 'true');
  
  const [loves, setLoves] = useState(() => {
    const saved = localStorage.getItem(loveCountKey);
    return saved ? parseInt(saved) : stableBaseLoves;
  });
  
  const [fishes, setFishes] = useState(() => {
    const saved = localStorage.getItem(fishCountKey);
    return saved ? parseInt(saved) : stableBaseFishes;
  });

 
  useEffect(() => {
    setHasLoved(localStorage.getItem(lovedStateKey) === 'true');
    setHasFished(localStorage.getItem(fishedStateKey) === 'true');
    setLoves(localStorage.getItem(loveCountKey) ? parseInt(localStorage.getItem(loveCountKey)) : stableBaseLoves);
    setFishes(localStorage.getItem(fishCountKey) ? parseInt(localStorage.getItem(fishCountKey)) : stableBaseFishes);
  }, [catId, lovedStateKey, loveCountKey, fishedStateKey, fishCountKey]);

  const handleLove = () => {
    const newState = !hasLoved;
    setHasLoved(newState);
    localStorage.setItem(lovedStateKey, String(newState));
    
    const newCount = newState ? loves + 1 : loves - 1;
    setLoves(newCount);
    localStorage.setItem(loveCountKey, String(newCount));
  };

  const handleFish = () => {
    if (!hasFished) {
      setHasFished(true);
      localStorage.setItem(fishedStateKey, 'true');
      const newCount = fishes + 1;
      setFishes(newCount);
      localStorage.setItem(fishCountKey, String(newCount));
    }
  };

  if (!cat) return null;

  const personality = Array.isArray(cat.tags)
    ? cat.tags
    : (cat.tags ? cat.tags.split(',').map((tag) => tag.trim()).filter(Boolean) : []);

  const fallbackImg = `https://ui-avatars.com/api/?name=${cat.name || 'Cat'}&background=FEE4B8&color=000000`;
  const profileImg = cat.profileImageId ? getCatImagePreview(cat.profileImageId) : fallbackImg;

  let galleryImages = [];
  if (cat.galleryImageIds) {
    const rawIds = Array.isArray(cat.galleryImageIds)
      ? cat.galleryImageIds
      : String(cat.galleryImageIds).split(',');

    galleryImages = rawIds
      .filter((id) => id && String(id).trim() !== '')
      .map((id) => getCatImagePreview(id));
  }

  return createPortal(
    <AnimatePresence>
      <motion.div
        className={styles.overlay}
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        onClick={onClose}
      >
        <div className={styles.perspectiveWrapper} onClick={(event) => event.stopPropagation()}>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close profile">
            <FiX />
          </button>

          <div className={`${styles.bookContainer} ${isCoverOpen ? styles.open : ''}`}>
            <div className={styles.bookCover}>
              <div className={styles.coverContent}>
                <div className={styles.goldEmblem}><FaPaw /></div>
                <h1>MEOW ATLAS</h1>
                <p>DIGITAL MEOW PASSPORT</p>
                <div className={styles.coverCountry}>{cat.country || 'Global Citizen'}</div>
              </div>
            </div>

            <div className={styles.bookInside}>
              <div className={styles.leftPage}>
                <div className={styles.photoContainer}>
                  <img
                    src={profileImg}
                    alt={cat.name || 'Cat'}
                    className={styles.passportPhoto}
                    onError={(event) => {
                      console.error('Image failed to load. URL:', profileImg);
                      event.target.src = fallbackImg;
                    }}
                  />
                  <div className={styles.countryStamp}>
                    <span>Spotted in</span>
                    <strong>{cat.country || 'Unknown'}</strong>
                  </div>
                </div>

                <div className={styles.identityHeader}>
                  <div className={styles.passportCode}>
                    CAT-ID {cat.$id ? cat.$id.slice(0, 8).toUpperCase() : 'PENDING'}
                  </div>
                  <div className={styles.socialBar}>
                    <button className={`${styles.socialBtn} ${hasLoved ? styles.activeLove : ''}`} onClick={handleLove}>
                      <FiHeart className={styles.socialIcon} fill={hasLoved ? '#FFA43A' : 'none'} />
                      <span>{loves}</span>
                    </button>
                    <button className={`${styles.socialBtn} ${hasFished ? styles.activeFish : ''}`} onClick={handleFish}>
                      <FaFish className={styles.socialIcon} />
                      <span>{fishes}</span>
                    </button>
                  </div>
                </div>

                <div className={styles.identityDetails}>
                  <div className={styles.idRow}><span>Name:</span> <strong>{cat.name || 'Unknown'}</strong></div>
                  <div className={styles.idRow}><span>Class:</span> <strong>{cat.category || 'Friend'}</strong></div>
                  <div className={styles.idRow}><span>Age:</span> <strong>{cat.age || 'Unknown'}</strong></div>
                  <div className={styles.idRow}><span>Breed:</span> <strong>{cat.breed || 'Unknown'}</strong></div>
                </div>
              </div>

              <div className={styles.rightPage}>
                <div className={styles.storySection}>
                  <h4 className={styles.sectionTitle}><FiMapPin /> Current Location</h4>
                  <p className={styles.locationText}>{cat.city}, {cat.country}</p>
                </div>

                <div className={styles.storySection}>
                  <h4 className={styles.sectionTitle}><FaPaw /> Characteristics</h4>
                  <div className={styles.tagsContainer}>
                    {personality.length > 0 ? personality.map((tag, index) => (
                      <span key={index} className={styles.tag}>{tag}</span>
                    )) : <span className={styles.noTags}>No tags available</span>}
                  </div>
                </div>

                <div className={styles.storySection}>
                  <h4 className={styles.sectionTitle}><FiFile />About {cat.name}</h4>
                  <p className={styles.storyText}>{cat.story || 'No additional notes provided.'}</p>
                </div>

                {galleryImages.length > 0 && (
                  <>
                    <hr className={styles.divider} />
                    <PhotoGallery photos={galleryImages} />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

export default ProfilePanel;
