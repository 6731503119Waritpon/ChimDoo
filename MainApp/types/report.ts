export interface ReportData {
    reporterId: string;
    targetId: string;
    targetType: 'review' | 'comment' | 'user';
    reason: string;
    details?: string;
    status: 'pending' | 'reviewed' | 'resolved';
}

export interface BlockedUser {
    id: string;
    displayName: string;
    photoURL: string | null;
    photoBase64?: string | null;
}
