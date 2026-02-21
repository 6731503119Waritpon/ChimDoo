import { useState, useEffect, useCallback } from 'react';
import { QueryConstraint } from 'firebase/firestore';
import {
    getDocuments,
    getDocument,
    addDocument,
    updateDocument,
    deleteDocument,
    subscribeToCollection,
    subscribeToDocument,
    FirestoreDocument,
} from '../services/firestore';

interface UseFirestoreState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}

// Hook for fetching a single document
export const useDocument = <T extends FirestoreDocument>(
    collectionName: string,
    docId: string | null,
    realtime: boolean = false
) => {
    const [state, setState] = useState<UseFirestoreState<T>>({
        data: null,
        loading: true,
        error: null,
    });

    useEffect(() => {
        if (!docId) {
            setState({ data: null, loading: false, error: null });
            return;
        }

        if (realtime) {
            const unsubscribe = subscribeToDocument<T>(
                collectionName,
                docId,
                (document) => {
                    setState({ data: document, loading: false, error: null });
                }
            );
            return () => unsubscribe();
        } else {
            const fetchDocument = async () => {
                try {
                    setState((prev) => ({ ...prev, loading: true }));
                    const document = await getDocument<T>(collectionName, docId);
                    setState({ data: document, loading: false, error: null });
                } catch (error: any) {
                    setState({
                        data: null,
                        loading: false,
                        error: error.message || 'Failed to fetch document',
                    });
                }
            };
            fetchDocument();
        }
    }, [collectionName, docId, realtime]);

    return state;
};

// Hook for fetching a collection
export const useCollection = <T extends FirestoreDocument>(
    collectionName: string,
    queryConstraints: QueryConstraint[] = [],
    realtime: boolean = false
) => {
    const [state, setState] = useState<UseFirestoreState<T[]>>({
        data: null,
        loading: true,
        error: null,
    });

    useEffect(() => {
        if (realtime) {
            const unsubscribe = subscribeToCollection<T>(
                collectionName,
                (documents) => {
                    setState({ data: documents, loading: false, error: null });
                },
                ...queryConstraints
            );
            return () => unsubscribe();
        } else {
            const fetchDocuments = async () => {
                try {
                    setState((prev) => ({ ...prev, loading: true }));
                    const documents = await getDocuments<T>(collectionName, ...queryConstraints);
                    setState({ data: documents, loading: false, error: null });
                } catch (error: any) {
                    setState({
                        data: null,
                        loading: false,
                        error: error.message || 'Failed to fetch collection',
                    });
                }
            };
            fetchDocuments();
        }
    }, [collectionName, realtime, JSON.stringify(queryConstraints)]);

    return state;
};

// Hook for CRUD mutations
export const useFirestoreMutation = (collectionName: string) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const add = useCallback(
        async <T extends object>(data: T) => {
            try {
                setLoading(true);
                setError(null);
                const docRef = await addDocument(collectionName, data);
                setLoading(false);
                return docRef.id;
            } catch (err: any) {
                setError(err.message || 'Failed to add document');
                setLoading(false);
                throw err;
            }
        },
        [collectionName]
    );

    const update = useCallback(
        async (docId: string, data: Partial<object>) => {
            try {
                setLoading(true);
                setError(null);
                await updateDocument(collectionName, docId, data);
                setLoading(false);
            } catch (err: any) {
                setError(err.message || 'Failed to update document');
                setLoading(false);
                throw err;
            }
        },
        [collectionName]
    );

    const remove = useCallback(
        async (docId: string) => {
            try {
                setLoading(true);
                setError(null);
                await deleteDocument(collectionName, docId);
                setLoading(false);
            } catch (err: any) {
                setError(err.message || 'Failed to delete document');
                setLoading(false);
                throw err;
            }
        },
        [collectionName]
    );

    return { add, update, remove, loading, error };
};
