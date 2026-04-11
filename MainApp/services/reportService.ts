import { collection, addDoc, serverTimestamp, doc, updateDoc, arrayUnion, arrayRemove, getDoc, getDocs, query, where, documentId } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Collections } from '@/constants/collections';

const SCRIPT_URL = process.env.EXPO_PUBLIC_CONTACT_SCRIPT_URL ?? '';

import { ReportData } from '@/types/report';

export const submitReport = async (report: Omit<ReportData, 'status'>) => {
    const docRef = await addDoc(collection(db, Collections.reports), {
        ...report,
        status: 'pending',
        createdAt: serverTimestamp(),
    });

    if (SCRIPT_URL) {
        try {
            await fetch(SCRIPT_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: 'ChimDoo System',
                    email: 'system@chimdoo.app',
                    subject: `[REPORT] New ${report.targetType} report`,
                    message: `A new report has been submitted.\n\nReporter ID: ${report.reporterId}\nTarget ID: ${report.targetId}\nType: ${report.targetType}\nReason: ${report.reason}\nDetails: ${report.details || 'None'}`,
                }),
            });
        } catch (err) {
            console.error('[ReportService] Failed to send email notification:', err);
        }
    }

    return docRef;
};

export const blockUser = async (currentUserId: string, targetUserId: string) => {
    const userRef = doc(db, Collections.users, currentUserId);
    return await updateDoc(userRef, {
        blockedUsers: arrayUnion(targetUserId),
    });
};

export const unblockUser = async (currentUserId: string, targetUserId: string) => {
    const userRef = doc(db, Collections.users, currentUserId);
    return await updateDoc(userRef, {
        blockedUsers: arrayRemove(targetUserId),
    });
};

export const getBlockedUserIds = async (currentUserId: string): Promise<string[]> => {
    const userSnap = await getDoc(doc(db, Collections.users, currentUserId));
    if (userSnap.exists()) {
        const data = userSnap.data();
        return data.blockedUsers || [];
    }
    return [];
};

export const fetchBlockedUserProfiles = async (userIds: string[]) => {
    if (userIds.length === 0) return []; 
    const q = query(collection(db, Collections.users), where(documentId(), 'in', userIds.slice(0, 30)));
    const querySnap = await getDocs(q);
    
    return querySnap.docs.map(doc => ({
        id: doc.id,
        displayName: doc.data().displayName || 'Unknown User',
        photoURL: doc.data().photoURL || null,
        photoBase64: doc.data().photoBase64 || null
    }));
};
