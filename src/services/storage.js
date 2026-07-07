import { storage, ID } from './appwrite';

const BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID;

export const uploadCatImage = async (file) => {
  try {
    const response = await storage.createFile(BUCKET_ID, ID.unique(), file);
    return response.$id; 
  } catch (error) {
    console.error("Appwrite Storage Error:", error);
    throw error;
  }
};

export const uploadMultipleImages = async (files) => {
  try {
    const uploadPromises = files.map(file => uploadCatImage(file));
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error("Appwrite Multiple Storage Error:", error);
    throw error;
  }
};

export const getCatImagePreview = (fileId) => {
  if (!fileId) return '';
  
  try {
    const cleanId = String(fileId).replace(/['"\[\]]/g, '').trim();
    

    const result = storage.getFileView(BUCKET_ID, cleanId);
    
    return result.href || result;
  } catch (error) {
    console.error("Failed to generate image URL:", error);
    return '';
  }
};