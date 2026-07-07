import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiUploadCloud, FiLoader, FiImage, FiMapPin, FiRefreshCcw } from 'react-icons/fi';
import { getNames } from 'country-list'; 
import { getBreeds } from 'cat-breeds'; 
import { uploadCatImage, uploadMultipleImages } from '../../services/storage';
import { addCatToDatabase } from '../../services/database';
import styles from './AddCatModal.module.css';

const SUGGESTED_TAGS = ['Playful', 'Sleepy', 'Vocal', 'Friendly', 'Shy', 'Cuddly', 'Always Hungry'];
const POPULAR_BREEDS = ['Indie / DSH', 'Persian', 'Maine Coon', 'Siamese', 'British Shorthair', 'Bengal', 'Ragdoll','Sphynx'];

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", damping: 25, stiffness: 300 } },
  exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } }
};

const AddCatModal = ({ isOpen, onClose }) => {
  const profileInputRef = useRef(null);
  const galleryInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  
  const [breedsList] = useState(POPULAR_BREEDS);

  const [countriesList] = useState(getNames()); 
  const [citySuggestions, setCitySuggestions] = useState([]);
  
  const [showCountry, setShowCountry] = useState(false);
  const [showCity, setShowCity] = useState(false);
  const [showBreed, setShowBreed] = useState(false);
  
  const [profileFile, setProfileFile] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '', category: 'Community Cat', country: '', city: '', 
    age: '', breed: '', story: '',
  });

  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (formData.city.length > 2) {
      const timer = setTimeout(() => {
        fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(formData.city)}&limit=5`)
          .then(res => res.json())
          .then(data => {
            if (data.features) {
              // Map Photon's output to match your existing UI format
              const mappedResults = data.features.map((f, index) => ({
                id: index,
                name: f.properties.name || f.properties.street || f.properties.city || 'Unknown Place',
                admin1: f.properties.state || f.properties.district || '',
                country: f.properties.country || '',
                lat: f.geometry.coordinates[1], 
                lon: f.geometry.coordinates[0]
              })).filter(item => item.name !== 'Unknown Place');
              setCitySuggestions(mappedResults);
            }
          })
          .catch(() => setCitySuggestions([]));
      }, 300);
      return () => clearTimeout(timer);
    } else { 
      setCitySuggestions([]); 
    }
  }, [formData.city]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSelect = (e) => {
    const file = e.target.files[0];
    if (file) { setProfileFile(file); setProfilePreview(URL.createObjectURL(file)); }
  };

  const handleGallerySelect = (e) => {
    const files = Array.from(e.target.files).slice(0, 3);
    setGalleryFiles(files); setGalleryPreviews(files.map(file => URL.createObjectURL(file)));
  };

  const addTag = (tag) => {
    const newTag = tag.trim();
    if (newTag && !tags.includes(newTag)) { setTags([...tags, newTag]); setTagInput(''); }
  };

  const removeTag = (tagToRemove) => setTags(tags.filter(tag => tag !== tagToRemove));

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); addTag(tagInput); }
  };

  const handleClearAll = () => {
    setFormData({ name: '', category: 'Community Cat', country: '', city: '', age: '', breed: '', story: ''});
    setTags([]); setTagInput(''); setProfileFile(null); setProfilePreview(null); setGalleryFiles([]); setGalleryPreviews([]);
    if (profileInputRef.current) profileInputRef.current.value = '';
    if (galleryInputRef.current) galleryInputRef.current.value = '';
  };

 
  const getCoordinates = async (city, country) => {
    try {
      const searchQuery = `${city.trim()}, ${country.trim()}`;
      const response = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(searchQuery)}&limit=1`);

      if (!response.ok) return null;

      const data = await response.json();
      if (data && data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].geometry.coordinates;
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
        return { lat, lng };
      }
      return null;
    } catch {
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!profileFile || !formData.city || !formData.country) {
      alert("Please fill required fields: Country, Exact Locality/City, and Profile Image.");
      return;
    }
    setLoading(true);

    try {
      const coords = await getCoordinates(formData.city, formData.country);
      if (!coords) { alert("Location not found. Please select from the suggestions drop-down."); setLoading(false); return; }

      const profileId = await uploadCatImage(profileFile);
      const galleryIds = galleryFiles.length > 0 ? await uploadMultipleImages(galleryFiles) : [];

      const newCat = {
        name: formData.name,
        category: formData.category,
        country: formData.country,
        city: formData.city,
        lat: coords.lat,
        lng: coords.lng,
        age: formData.age,
        breed: formData.breed,
        story: formData.story,
        tags: tags.join(', '), 
        profileImageId: profileId,
        galleryImageIds: galleryIds 
      };

      await addCatToDatabase(newCat);
      alert("Added successfully!");
      handleClearAll(); 
      onClose();
      window.location.reload(); 
    } catch (error) {
      console.error(error);
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const filterList = (list, query) => list.filter(item => item.toLowerCase().includes(query.toLowerCase())).slice(0, 20);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div key="modal-overlay" className={styles.overlay} onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className={styles.modal} variants={modalVariants} initial="hidden" animate="visible" exit="exit" onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Add a New Cat</h2>
              <button type="button" className={styles.closeBtn} onClick={onClose}><FiX /></button>
            </div>

            <form className={styles.formContent} onSubmit={handleSubmit}>
              <div className={styles.sectionDivider}>Basic & Location</div>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g., Whiskers" />
                </div>
                <div className={styles.formGroup}>
                  <label>Category</label>
                  <select name="category" value={formData.category} onChange={handleChange}>
                    <option>Pet Cat</option><option>Community Cat</option><option>Street Cat</option><option>Shelter Cat</option>
                  </select>
                </div>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>Country *</label>
                  <div className={styles.autocompleteWrapper}>
                    <input type="text" value={formData.country} placeholder="Search country..." onChange={(e) => setFormData({...formData, country: e.target.value})} onFocus={() => setShowCountry(true)} onBlur={() => setTimeout(() => setShowCountry(false), 200)} required />
                    {showCountry && filterList(countriesList, formData.country).length > 0 && (
                      <ul className={styles.dropdownList}>
                        {filterList(countriesList, formData.country).map(c => (
                          <li key={c} onMouseDown={() => { setFormData(prev => ({...prev, country: c})); setShowCountry(false); }}>{c}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label>Locality / Landmark *</label>
                  <div className={styles.autocompleteWrapper}>
                    <input type="text" value={formData.city} placeholder="e.g., Victoria Memorial, Gariahat..." onChange={(e) => setFormData({...formData, city: e.target.value})} onFocus={() => setShowCity(true)} onBlur={() => setTimeout(() => setShowCity(false), 200)} required />
                    {showCity && citySuggestions.length > 0 && (
                      <ul className={styles.dropdownList}>
                        {citySuggestions.map((c) => (
                          <li key={c.id} onMouseDown={() => { setFormData(prev => ({...prev, city: c.name, country: c.country || formData.country})); setShowCity(false); }}>
                             <FiMapPin className={styles.cityIcon}/> 
                             <div>
                               <span className={styles.cityName}>{c.name}</span>
                               <span className={styles.cityAdmin}>{c.admin1 ? `${c.admin1}, ` : ''}{c.country}</span>
                             </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>

              <div className={styles.sectionDivider}>Details</div>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>Age</label>
                  <input type="text" name="age" value={formData.age} onChange={handleChange} placeholder="e.g., 2 years" />
                </div>
                <div className={styles.formGroup}>
                  <label>Breed</label>
                  <div className={styles.autocompleteWrapper}>
                    <input type="text" value={formData.breed} placeholder="Search breed..." onChange={(e) => setFormData({...formData, breed: e.target.value})} onFocus={() => setShowBreed(true)} onBlur={() => setTimeout(() => setShowBreed(false), 200)} />
                    {showBreed && filterList(breedsList, formData.breed).length > 0 && (
                      <ul className={styles.dropdownList}>
                        {filterList(breedsList, formData.breed).map(b => (
                          <li key={b} onMouseDown={() => { setFormData(prev => ({...prev, breed: b})); setShowBreed(false); }}>{b}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label>Personality Tags</label>
                <div className={styles.tagsContainer}>
                  {tags.map(tag => <span key={tag} className={styles.chip}>{tag} <button type="button" onClick={() => removeTag(tag)}>&times;</button></span>)}
                  <input type="text" placeholder="Type and Enter..." value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleTagKeyDown} className={styles.tagInput} />
                </div>
                <div className={styles.suggestedTags}>
                  {SUGGESTED_TAGS.map(tag => (
                    <span key={tag} className={styles.suggestedChip} onClick={() => addTag(tag)}>+ {tag}</span>
                  ))}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Short Story</label>
                <textarea name="story" rows="2" value={formData.story} placeholder="Share a sweet memory..." onChange={handleChange}></textarea>
              </div>

              <div className={styles.sectionDivider}>Photos</div>
              <div className={styles.photoUploadsRow}>
                <div className={styles.uploadBlock}>
                  <label>Profile Image *</label>
                  <div className={`${styles.uploadArea} ${profilePreview ? styles.hasImage : ''}`} onClick={() => profileInputRef.current?.click()}>
                    <input type="file" accept="image/*" ref={profileInputRef} onChange={handleProfileSelect} hidden />
                    {profilePreview ? <img src={profilePreview} alt="Profile" className={styles.imagePreview} /> : <div className={styles.uploadPlaceholder}><FiUploadCloud /><span>1 Image</span></div>}
                  </div>
                </div>

                <div className={styles.uploadBlock}>
                  <label>Gallery (Max 3)</label>
                  <div className={styles.uploadArea} onClick={() => galleryInputRef.current?.click()}>
                    <input type="file" accept="image/*" multiple ref={galleryInputRef} onChange={handleGallerySelect} hidden />
                    {galleryPreviews.length > 0 ? (
                      <div className={styles.galleryPreviewGrid}>
                        {galleryPreviews.map((src, i) => <img key={i} src={src} alt="Gallery" className={styles.tinyPreview} />)}
                      </div>
                    ) : (
                      <div className={styles.uploadPlaceholder}><FiImage /><span>Up to 3</span></div>
                    )}
                  </div>
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button type="button" className={styles.cancelBtn} onClick={handleClearAll} disabled={loading} style={{ marginRight: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FiRefreshCcw /> Clear All
                </button>
                <button type="button" className={styles.cancelBtn} onClick={onClose} disabled={loading}>Cancel</button>
                <button type="submit" className={styles.submitBtn} disabled={loading}>{loading ? <FiLoader className={styles.spinner} /> : 'Submit'}</button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddCatModal;