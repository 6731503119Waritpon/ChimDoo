import { Timestamp } from 'firebase/firestore';

export interface CommunityPost {
    id: string;
    userId: string;
    userName: string;
    userAvatar: string;
    foodName: string;
    image: string;
    description: string;
    likes: number;
    likedBy: string[];
    commentsCount: number;
    createdAt: Timestamp;
    country: string;
}

export interface Comment {
    id: string;
    userId: string;
    userName: string;
    userAvatar: string;
    text: string;
    createdAt: Timestamp;
}
