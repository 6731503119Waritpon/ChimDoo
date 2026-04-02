import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Info, Users } from 'lucide-react-native';
import { AppColors } from '@/constants/colors';
import { AppFonts } from '@/constants/theme';

interface EmptyFeedStateProps {
    feedTab: 'global' | 'friends';
}

export const EmptyFeedState: React.FC<EmptyFeedStateProps> = ({ feedTab }) => {
    return (
        <View style={styles.emptyContainer}>
            {feedTab === 'friends' ? (
                <>
                    <Users size={48} color={AppColors.navy} />
                    <Text style={styles.emptyTitle}>No Friend Posts</Text>
                    <Text style={styles.emptySubtitle}>
                        Add friends from the Global feed to see their posts here!
                    </Text>
                </>
            ) : (
                <>
                    <Info size={48} color={AppColors.navy} />
                    <Text style={styles.emptyTitle}>No Reviews Yet</Text>
                    <Text style={styles.emptySubtitle}>
                        Be the first to share your food experience! Go to a recipe, tap "Chim Doo", then write a review.
                    </Text>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    emptyTitle: {
        fontFamily: AppFonts.bold,
        fontSize: 22,
        color: AppColors.navy,
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 15,
        color: AppColors.textLight,
        textAlign: 'center',
        lineHeight: 22,
    },
});
