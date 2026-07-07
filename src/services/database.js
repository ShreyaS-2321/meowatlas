import { databases, ID } from './appwrite';

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

export const addCatToDatabase = async (catData) => {
  try {
    const response = await databases.createDocument(
      DATABASE_ID,
      COLLECTION_ID,
      ID.unique(),
      catData
    );
    return response;
  } catch (error) {
    console.error("Appwrite Database Error:", error);
    throw error;
  }
};

export const getAllCats = async () => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ID,
    );
    return response.documents;
  } catch (error) {
    console.error("Appwrite Database Error:", error);
    throw error;
  }
};