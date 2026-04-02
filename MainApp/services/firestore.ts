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
import { db } from '@/config/firebase';

export interface FirestoreDocument {
    id: string;
    [key: string]: unknown;
}

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

export const addDocument = async <T extends WithFieldValue<DocumentData>>(
    collectionName: string,
    data: T
): Promise<DocumentReference> => {
    const collectionRef = collection(db, collectionName);
    return await addDoc(collectionRef, data);
};

export const updateDocument = async (
    collectionName: string,
    docId: string,
    data: Partial<DocumentData>
): Promise<void> => {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, data);
};

export const deleteDocument = async (
    collectionName: string,
    docId: string
): Promise<void> => {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
};

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

export { where, orderBy, limit, db };
