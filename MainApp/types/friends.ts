import { Timestamp } from 'firebase/firestore';

export type FriendshipStatus = 'pending' | 'accepted' | 'rejected';

export interface Friendship {
    id: string;
    requesterId: string;
    requesteeId: string;
    requesterName: string;
    requesterAvatar: string;
    requesteeName: string;
    requesteeAvatar: string;
    status: FriendshipStatus;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export interface FriendInfo {
    uid: string;
    displayName: string;
    photoURL: string;
    friendshipId: string;
}
