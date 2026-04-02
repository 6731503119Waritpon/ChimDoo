import React from 'react';
import { View, StyleSheet, ScrollView, Platform, Dimensions } from 'react-native';
import Skeleton from '@/components/ui/Skeleton';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const SkeletonProfile = () => {
    return (
        <ScrollView 
            style={styles.container} 
            contentContainerStyle={styles.scrollContent}
            scrollEnabled={false}
        >
            <View style={styles.profileCard}>
                <View style={styles.avatarRing}>
                    <Skeleton width={84} height={84} borderRadius={42} />
                </View>

                <View style={styles.profileInfo}>
                    <Skeleton width={140} height={24} borderRadius={6} style={{ marginBottom: 8 }} />
                    <Skeleton width={180} height={16} borderRadius={4} style={{ marginBottom: 20 }} />
                    <Skeleton width={100} height={32} borderRadius={16} />
                </View>
            </View>

            {[1, 2, 3].map((section) => (
                <View key={section} style={styles.section}>
                    <Skeleton width={100} height={18} borderRadius={4} style={styles.sectionTitle} />
                    
                    {[1, 2].map((item) => (
                        <View key={item} style={styles.menuItem}>
                            <Skeleton width={24} height={24} borderRadius={6} style={{ marginRight: 12 }} />
                            <Skeleton width={120} height={16} borderRadius={4} />
                            <View style={{ flex: 1 }} />
                            <Skeleton width={16} height={16} borderRadius={4} />
                        </View>
                    ))}
                </View>
            ))}

            <View style={styles.logoutButton}>
                <Skeleton width={120} height={20} borderRadius={6} />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    scrollContent: {
        paddingTop: Platform.OS === 'ios' ? 60 : 48,
        paddingBottom: 40,
    },
    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        paddingVertical: 28,
        marginHorizontal: 20,
        marginBottom: 24,
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(29, 53, 87, 0.08)',
    },
    avatarRing: {
        width: 96,
        height: 96,
        borderRadius: 48,
        borderWidth: 3,
        borderColor: '#f0f0f0',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    profileInfo: {
        flex: 1,
    },
    section: {
        marginHorizontal: 20,
        marginBottom: 24,
    },
    sectionTitle: {
        marginLeft: 8,
        marginBottom: 12,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: 'rgba(29, 53, 87, 0.04)',
    },
    logoutButton: {
        marginTop: 12,
        marginHorizontal: 20,
        height: 56,
        backgroundColor: 'rgba(239, 68, 68, 0.05)',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default SkeletonProfile;
