import { Share } from 'react-native';

export const sharePost = async (foodName: string, description: string) => {
    try {
        await Share.share({
            message: `Check out this review of ${foodName} on ChimDoo!\n\n"${description}"\n\nDownload ChimDoo and share your food adventures!`,
            title: `${foodName} Review - ChimDoo`,
        });
    } catch (err) {
        console.error('Share error:', err);
    }
};
