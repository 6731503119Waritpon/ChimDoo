import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Modal,
    Platform,
    ActivityIndicator,
} from 'react-native';
import { X, Smartphone, CheckCircle2, Clock } from 'lucide-react-native';
import { useAppVersion } from '../hooks/useAppVersion';
import { AppColors } from '@/constants/colors';
import { AppFonts } from '@/constants/theme';

interface Props {
    visible: boolean;
    onClose: () => void;
}

export default function AppVersionModal({ visible, onClose }: Props) {
    const { versions, latestVersion, loading, error } = useAppVersion();

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <Smartphone size={22} color="#8b5cf6" />
                        <Text style={styles.headerTitle}>App Version</Text>
                    </View>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <X size={22} color="#666" />
                    </TouchableOpacity>
                </View>

                {latestVersion && !loading && (
                    <View style={styles.currentBadge}>
                        <View style={styles.currentBadgeLeft}>
                            <Text style={styles.currentVersion}>v{latestVersion.version}</Text>
                            <Text style={styles.currentLabel}>Current Version</Text>
                        </View>
                        <View style={styles.upToDateBadge}>
                            <CheckCircle2 size={14} color="#22c55e" />
                            <Text style={styles.upToDateText}>Up to date</Text>
                        </View>
                    </View>
                )}

                {loading ? (
                    <View style={styles.center}>
                        <ActivityIndicator size="large" color="#8b5cf6" />
                        <Text style={styles.loadingText}>Loading version history...</Text>
                    </View>
                ) : error ? (
                    <View style={styles.center}>
                        <Text style={styles.errorText}>Failed to load version info</Text>
                    </View>
                ) : (
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                    >
                        <Text style={styles.historyLabel}>Release History</Text>

                        {versions.map((ver, index) => (
                            <View key={ver.id} style={[styles.versionCard, ver.isLatest && styles.versionCardLatest]}>
                                <View style={styles.versionHeader}>
                                    <View style={styles.versionLeft}>
                                        <Text style={styles.versionNumber}>v{ver.version}</Text>
                                        {ver.isLatest && (
                                            <View style={styles.latestTag}>
                                                <Text style={styles.latestTagText}>Latest</Text>
                                            </View>
                                        )}
                                    </View>
                                    <View style={styles.dateRow}>
                                        <Clock size={12} color="#aaa" />
                                        <Text style={styles.dateText}>{ver.releaseDate}</Text>
                                    </View>
                                </View>

                                {ver.title ? (
                                    <Text style={styles.versionTitle}>{ver.title}</Text>
                                ) : null}

                                <View style={styles.changesList}>
                                    {(ver.changes ?? []).map((change, i) => (
                                        <View key={i} style={styles.changeItem}>
                                            <View style={[styles.changeDot, ver.isLatest && styles.changeDotLatest]} />
                                            <Text style={styles.changeText}>{change}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                )}
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppColors.backgroundLight,
        paddingTop: Platform.OS === 'ios' ? 16 : 0,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        backgroundColor: '#fff',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    headerTitle: {
        fontFamily: AppFonts.bold,
        fontSize: 18,
        color: AppColors.navy,
    },
    closeButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    currentBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: 20,
        padding: 18,
        backgroundColor: '#fff',
        borderRadius: 16,
        borderLeftWidth: 4,
        borderLeftColor: '#8b5cf6',
        shadowColor: '#8b5cf6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 4,
    },
    currentBadgeLeft: {
        gap: 2,
    },
    currentVersion: {
        fontFamily: AppFonts.bold,
        fontSize: 24,
        color: AppColors.navy,
    },
    currentLabel: {
        fontFamily: AppFonts.regular,
        fontSize: 13,
        color: '#888',
    },
    upToDateBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    upToDateText: {
        fontFamily: AppFonts.semiBold,
        fontSize: 13,
        color: '#22c55e',
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    loadingText: {
        fontFamily: AppFonts.regular,
        fontSize: 14,
        color: '#888',
    },
    errorText: {
        fontFamily: AppFonts.regular,
        fontSize: 14,
        color: AppColors.primary,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    historyLabel: {
        fontFamily: AppFonts.bold,
        fontSize: 13,
        color: '#999',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 16,
    },
    versionCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 18,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.06)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    versionCardLatest: {
        borderColor: 'rgba(139, 92, 246, 0.25)',
        backgroundColor: 'rgba(139, 92, 246, 0.03)',
    },
    versionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    versionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    versionNumber: {
        fontFamily: AppFonts.bold,
        fontSize: 18,
        color: AppColors.navy,
    },
    latestTag: {
        backgroundColor: '#8b5cf6',
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 3,
    },
    latestTagText: {
        fontFamily: AppFonts.bold,
        color: '#fff',
        fontSize: 11,
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    dateText: {
        fontFamily: AppFonts.regular,
        fontSize: 12,
        color: '#aaa',
    },
    versionTitle: {
        fontFamily: AppFonts.semiBold,
        fontSize: 14,
        color: '#555',
        marginBottom: 12,
    },
    changesList: {
        gap: 8,
    },
    changeItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
    },
    changeDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#ccc',
        marginTop: 6,
    },
    changeDotLatest: {
        backgroundColor: '#8b5cf6',
    },
    changeText: {
        fontFamily: AppFonts.regular,
        flex: 1,
        fontSize: 14,
        color: '#444',
        lineHeight: 20,
    },
});
