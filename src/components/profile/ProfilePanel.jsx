import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FiFile, FiHeart, FiMapPin, FiX } from 'react-icons/fi';
import { FaFish, FaPaw } from 'react-icons/fa';
import styles from './ProfilePanel.module.css';
import { getCatImagePreview } from '../../services/storage';
import { updateCatStats } from '../../services/database'; 
import PhotoGallery from './PhotoGallery';

const overlayVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };

const ProfilePanel = ({ cat, onClose }) => {
  const [isCoverOpen, setIsCoverOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsCoverOpen(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const catId = cat?.$id || 'unknown';


  const lovedStateKey = `cat_${catId}_has_loved`;
  const fishedStateKey = `cat_${catId}_has_fished`;

  const [hasLoved, setHasLoved] = useState(() => localStorage.getItem(lovedStateKey) === 'true');
  const [hasFished, setHasFished] = useState(() => localStorage.getItem(fishedStateKey) === 'true');
  
  // 🔴 Global Database counts se variables initialize honge
  const [loves, setLoves] = useState(cat?.loves || 0);
  const [fishes, setFishes] = useState(cat?.fishes || 0);

  useEffect(() => {
    if (cat) {
      setLoves(cat.loves || 0);
      setFishes(cat.fishes || 0);
      setHasLoved(localStorage.getItem(lovedStateKey) === 'true');
      setHasFished(localStorage.getItem(fishedStateKey) === 'true');
    }
  }, [cat, catId, lovedStateKey, fishedStateKey]);

  const handleLove = async () => {
    const newState = !hasLoved;
    setHasLoved(newState);
    localStorage.setItem(lovedStateKey, String(newState));
    
    const newCount = Math.max(0, newState ? loves + 1 : loves - 1);
    setLoves(newCount);

    try {
      if (catId !== 'unknown') {
        await updateCatStats(catId, { loves: newCount });
      }
    } catch (error) {
      console.error("Failed to update loves", error);
    }
  };

  const handleFish = async () => {
    const newState = !hasFished;
    setHasFished(newState);
    localStorage.setItem(fishedStateKey, String(newState));
    
    const newCount = Math.max(0, newState ? fishes + 1 : fishes - 1);
    setFishes(newCount);

    try {
      if (catId !== 'unknown') {
        await updateCatStats(catId, { fishes: newCount });
      }
    } catch (error) {
      console.error("Failed to update fishes", error);
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