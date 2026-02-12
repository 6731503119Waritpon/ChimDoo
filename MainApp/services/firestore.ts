import {
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    QueryConstraint,
    DocumentData,
    WithFieldValue,
    DocumentReference,
    onSnapshot,
    Unsubscribe,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';

// Generic type for Firestore documents
export interface FirestoreDocument {
    id: string;
    [key: string]: any;
}

// Get a single document by ID
export const getDocument = async <T extends FirestoreDocument>(
    collectionName: string,
    docId: string
): Promise<T | null> => {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as T;
    }
    return null;
};

// Get all documents from a collection
export const getDocuments = async <T extends FirestoreDocument>(
    collectionName: string,
    ...queryConstraints: QueryConstraint[]
): Promise<T[]> => {
    const collectionRef = collection(db, collectionName);
    const q = query(collectionRef, ...queryConstraints);
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as T[];
};

// Add a new document
export const addDocument = async <T extends WithFieldValue<DocumentData>>(
    collectionName: string,
    data: T
): Promise<DocumentReference> => {
    const collectionRef = collection(db, collectionName);
    return await addDoc(collectionRef, data);
};

// Update a document
export const updateDocument = async (
    collectionName: string,
    docId: string,
    data: Partial<DocumentData>
): Promise<void> => {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, data);
};

// Delete a document
export const deleteDocument = async (
    collectionName: string,
    docId: string
): Promise<void> => {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
};

// Subscribe to a collection (real-time updates)
export const subscribeToCollection = <T extends FirestoreDocument>(
    collectionName: string,
    callback: (documents: T[]) => void,
    ...queryConstraints: QueryConstraint[]
): Unsubscribe => {
    const collectionRef = collection(db, collectionName);
    const q = query(collectionRef, ...queryConstraints);

    return onSnapshot(q, (querySnapshot) => {
        const documents = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as T[];
        callback(documents);
    });
};

// Subscribe to a single document (real-time updates)
export const subscribeToDocument = <T extends FirestoreDocument>(
    collectionName: string,
    docId: string,
    callback: (document: T | null) => void
): Unsubscribe => {
    const docRef = doc(db, collectionName, docId);

    return onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
            callback({ id: docSnap.id, ...docSnap.data() } as T);
        } else {
            callback(null);
        }
    });
};

// Export query helpers for convenience
export { where, orderBy, limit };
