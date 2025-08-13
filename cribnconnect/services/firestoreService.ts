import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  startAfter,
  DocumentSnapshot 
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Generic CRUD operations for Firestore

// Create a document
export const createDocument = async (collectionName: string, data: any) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return { id: docRef.id, error: null };
  } catch (error: any) {
    return { id: null, error: error.message };
  }
};

// Get a single document
export const getDocument = async (collectionName: string, documentId: string) => {
  try {
    const docRef = doc(db, collectionName, documentId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { data: { id: docSnap.id, ...docSnap.data() }, error: null };
    } else {
      return { data: null, error: 'Document not found' };
    }
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

// Update a document
export const updateDocument = async (collectionName: string, documentId: string, data: any) => {
  try {
    const docRef = doc(db, collectionName, documentId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Delete a document
export const deleteDocument = async (collectionName: string, documentId: string) => {
  try {
    await deleteDoc(doc(db, collectionName, documentId));
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Get multiple documents with optional filtering
export const getDocuments = async (
  collectionName: string,
  filters?: { field: string; operator: any; value: any }[],
  orderByField?: string,
  orderDirection: 'asc' | 'desc' = 'desc',
  limitCount?: number
) => {
  try {
    let q = collection(db, collectionName);
    let queryConstraints: any[] = [];

    // Add filters
    if (filters) {
      filters.forEach(filter => {
        queryConstraints.push(where(filter.field, filter.operator, filter.value));
      });
    }

    // Add ordering
    if (orderByField) {
      queryConstraints.push(orderBy(orderByField, orderDirection));
    }

    // Add limit
    if (limitCount) {
      queryConstraints.push(limit(limitCount));
    }

    const queryRef = query(q, ...queryConstraints);
    const querySnapshot = await getDocs(queryRef);
    
    const documents = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return { data: documents, error: null };
  } catch (error: any) {
    return { data: [], error: error.message };
  }
};

// Specific functions for your app collections

// Apartments
export const createApartment = (apartmentData: any) => createDocument('apartments', apartmentData);
export const getApartments = (filters?: any[], orderByField = 'createdAt', limitCount?: number) => 
  getDocuments('apartments', filters, orderByField, 'desc', limitCount);
export const getApartment = (id: string) => getDocument('apartments', id);
export const updateApartment = (id: string, data: any) => updateDocument('apartments', id, data);
export const deleteApartment = (id: string) => deleteDocument('apartments', id);

// Events
export const createEvent = (eventData: any) => createDocument('events', eventData);
export const getEvents = (filters?: any[], orderByField = 'date', limitCount?: number) => 
  getDocuments('events', filters, orderByField, 'asc', limitCount);
export const getEvent = (id: string) => getDocument('events', id);
export const updateEvent = (id: string, data: any) => updateDocument('events', id, data);
export const deleteEvent = (id: string) => deleteDocument('events', id);

// Linkups
export const createLinkup = (linkupData: any) => createDocument('linkups', linkupData);
export const getLinkups = (filters?: any[], orderByField = 'createdAt', limitCount?: number) => 
  getDocuments('linkups', filters, orderByField, 'desc', limitCount);
export const getLinkup = (id: string) => getDocument('linkups', id);
export const updateLinkup = (id: string, data: any) => updateDocument('linkups', id, data);
export const deleteLinkup = (id: string) => deleteDocument('linkups', id);

// Messages
export const createMessage = (messageData: any) => createDocument('messages', messageData);
export const getMessages = (filters?: any[], orderByField = 'createdAt', limitCount?: number) => 
  getDocuments('messages', filters, orderByField, 'asc', limitCount);
export const getMessage = (id: string) => getDocument('messages', id);
export const updateMessage = (id: string, data: any) => updateDocument('messages', id, data);
export const deleteMessage = (id: string) => deleteDocument('messages', id);
