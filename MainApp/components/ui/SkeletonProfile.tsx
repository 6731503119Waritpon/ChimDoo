import React from 'react';
import { View, StyleSheet, ScrollView, Platform, Dimensions } from 'react-native';
import Skeleton from '@/components/ui/Skeleton';

const CARD_W = (Dimensions.get('window').width - 52) / 2;

const MenuSection = ({ labelW, count }: { labelW: number; count: number }) => (
    <View style={styles.menuSection}>
        <Skeleton width={labelW} height={13} borderRadius={4} style={{ marginLeft: 4, marginBottom: 10 }} />
        <View style={styles.menuCard}>
            {Array.from({ length: count }).map((_, i) => (
                <React.Fragment key={i}>
                    <View style={styles.menuItem}>
                        <View style={styles.menuItemLeft}>
                            <Skeleton width={36} height={36} borderRadius={10} />
                            <Skeleton width={90 + i * 15} height={16} borderRadius={4} />
                        </View>
                        <Skeleton width={18} height={18} borderRadius={4} />
                    </View>
                    {i < count - 1 && <View style={styles.menuDivider} />}
                </React.Fragment>
            ))}
        </View>
    </View>
);

const SkeletonProfile = () => (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} scrollEnabled={false}>
        <View style={styles.profileCard}>
            <View style={styles.avatarRing}>
                <Skeleton width={84} height={84} borderRadius={42} />
            </View>
            <View style={{ flex: 1 }}>
                <Skeleton width={140} height={24} borderRadius={6} style={{ marginBottom: 8 }} />
                <Skeleton width={180} height={16} borderRadius={4} style={{ marginBottom: 20 }} />
                <Skeleton width={110} height={32} borderRadius={16} />
            </View>
        </View>

        <View style={styles.statsBar}>
            {[0, 1, 2].map((i) => (
                <React.Fragment key={i}>
                    <View style={styles.statItem}>
                        <Skeleton width={32} height={32} borderRadius={10} />
                        <View style={{ marginLeft: 8 }}>
                            <Skeleton width={28} height={14} borderRadius={4} style={{ marginBottom: 3 }} />
                            <Skeleton width={38} height={9} borderRadius={3} />
                        </View>
                    </View>
                    {i < 2 && <View style={styles.statDivider} />}
                </React.Fragment>
            ))}
        </View>

        <View style={styles.dashboardSection}>
            <Skeleton width={110} height={18} borderRadius={6} style={{ marginLeft: 4, marginBottom: 12 }} />
            <View style={styles.gridContainer}>
                {[0, 1, 2, 3].map((i) => (
                    <View key={i} style={styles.gridCard}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Skeleton width={24} height={24} borderRadius={8} />
                            <Skeleton width={8} height={8} borderRadius={4} />
                        </View>
                        <View style={{ marginTop: 8 }}>
                            <Skeleton width={70} height={11} borderRadius={4} style={{ marginBottom: 6 }} />
                            <Skeleton width={90} height={18} borderRadius={5} />
                        </View>
                    </View>
                ))}
            </View>
        </View>

        <MenuSection labelW={80} count={4} />
        <MenuSection labelW={72} count={2} />
        <MenuSection labelW={70} count={3} />

        <View style={styles.logoutButton}>
            <Skeleton width={100} height={20} borderRadius={6} />
        </View>
    </ScrollView>
);

export default SkeletonProfile;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    scrollContent: { paddingTop: Platform.OS === 'ios' ? 60 : 48, paddingBottom: 160 },
    profileCard: {
        flexDirection: 'row', alignItems: 'center',
        padding: 20, paddingVertical: 28,
        marginHorizontal: 20, marginBottom: 8,
        backgroundColor: '#FFF', borderRadius: 24,
        borderWidth: 1, borderColor: 'rgba(29,53,87,0.08)',
    },
    avatarRing: {
        width: 96, height: 96, borderRadius: 48,
        borderWidth: 3, borderColor: '#EAEAEA',
        alignItems: 'center', justifyContent: 'center', marginRight: 16,
    },
    statsBar: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        marginHorizontal: 16, marginTop: 10, marginBottom: 20,
        paddingVertical: 14, paddingHorizontal: 12,
        backgroundColor: 'rgba(255,255,255,0.85)', borderRadius: 22,
        borderWidth: 1, borderColor: 'rgba(29,53,87,0.06)',
    },
    statItem: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
    statDivider: { width: 1, height: 20, backgroundColor: 'rgba(0,0,0,0.04)' },
    dashboardSection: { marginTop: 2, paddingHorizontal: 20 },
    gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 },
    gridCard: {
        width: CARD_W, minHeight: 140, backgroundColor: '#FFF',
        padding: 20, borderRadius: 20, justifyContent: 'space-between',
        borderWidth: 1.5, borderColor: 'rgba(29,53,87,0.06)',
    },
    menuSection: { marginTop: 20, paddingHorizontal: 20 },
    menuCard: {
        backgroundColor: '#FFF', borderRadius: 18, overflow: 'hidden',
        borderWidth: 1, borderColor: 'rgba(29,53,87,0.07)',
    },
    menuItem: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingVertical: 15, paddingHorizontal: 16,
    },
    menuItemLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
    menuDivider: { height: 0.5, backgroundColor: 'rgba(145,148,151,0.2)' },
    logoutButton: {
        marginTop: 32, marginHorizontal: 20, height: 56,
        backgroundColor: 'rgba(239,68,68,0.05)', borderRadius: 16,
        borderWidth: 1, borderColor: 'rgba(239,68,68,0.1)',
        justifyContent: 'center', alignItems: 'center',
    },
});