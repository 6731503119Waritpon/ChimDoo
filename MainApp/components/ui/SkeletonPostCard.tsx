import React from 'react';
import { View, StyleSheet } from 'react-native';
import Skeleton from '@/components/ui/Skeleton';
import { AppColors } from '@/constants/colors';

const SkeletonPostCard = () => {
    return (
        <View style={styles.postCard}>
            <View style={styles.postHeader}>
                <Skeleton width={44} height={44} borderRadius={22} />
                <View style={styles.postUserInfo}>
                    <Skeleton width="40%" height={16} borderRadius={4} style={{ marginBottom: 6 }} />
                    <View style={styles.postMeta}>
                        <Skeleton width="20%" height={12} borderRadius={4} />
                        <Skeleton width="15%" height={12} borderRadius={4} />
                    </View>
                </View>
            </View>

            <View style={styles.imageContainer}>
                <Skeleton width="100%" height="100%" borderRadius={18} />
                <View style={styles.foodBadge}>
                    <Skeleton width={80} height={24} borderRadius={12} />
                </View>
            </View>

            <View style={styles.bottomRow}>
                <View style={styles.leftColumn}>
                    <View style={styles.postActionsLeft}>
                        <Skeleton width={40} height={20} borderRadius={10} />
                        <Skeleton width={20} height={20} borderRadius={10} />
                    </View>

                    <View style={styles.captionContainer}>
                        <Skeleton width="90%" height={12} borderRadius={4} style={{ marginBottom: 6 }} />
                        <Skeleton width="70%" height={12} borderRadius={4} />
                    </View>
                </View>

                <View style={styles.verticalDivider} />

                <View style={styles.rightColumn}>
                    <Skeleton width="50%" height={10} borderRadius={4} style={{ marginBottom: 8 }} />
                    <View style={styles.commentsBox}>
                        <Skeleton width="80%" height={10} borderRadius={4} style={{ marginBottom: 6 }} />
                        <Skeleton width="90%" height={10} borderRadius={4} style={{ marginBottom: 6 }} />
                        <Skeleton width="60%" height={10} borderRadius={4} />
                    </View>
                </View>
            </View>
        </View>
    );
};

export default SkeletonPostCard;

const styles = StyleSheet.create({
    postCard: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 16,
        borderRadius: 24,
        overflow: 'hidden',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(29, 53, 87, 0.08)',
    },
    postHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        paddingBottom: 12,
        gap: 12,
    },
    postUserInfo: {
        flex: 1,
    },
    postMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 1,
    },
    imageContainer: {
        marginHorizontal: 12,
        borderRadius: 18,
        overflow: 'hidden',
        height: 220,
        position: 'relative',
    },
    foodBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
    },
    bottomRow: {
        flexDirection: 'row',
        paddingVertical: 18,
        paddingHorizontal: 16,
        alignItems: 'flex-start',
    },
    leftColumn: {
        flex: 0.8,
        paddingRight: 12,
    },
    postActionsLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 28,
        marginBottom: 12,
    },
    captionContainer: {
        paddingTop: 0,
    },
    verticalDivider: {
        width: 1.2,
        backgroundColor: 'rgba(0,0,0,0.06)',
        alignSelf: 'stretch',
        marginVertical: 2,
    },
    rightColumn: {
        flex: 1.2,
        paddingLeft: 12,
        justifyContent: 'center',
    },
    commentsBox: {
        backgroundColor: '#f6f7f9',
        borderRadius: 12,
        padding: 8,
        marginTop: 4,
    },
});
