import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Platform,
    Switch,
    Image,
    Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Bell, UserPlus, Heart, MessageCircle, Star, Trash2 } from 'lucide-react-native';
import { useNotifications, AppNotification, NotificationType } from '../../../hooks/useNotifications';
import { useNotificationSettings } from '../../../hooks/useNotificationSettings';
import { formatRelativeTime } from '../../../utils/formatTime';
import { AppColors } from '@/constants/colors';

const TYPE_META: Record<NotificationType, { label: string; icon: any; color: string }> = {
    friend_request: { label: 'Friend Requests', icon: UserPlus, color: '#3b82f6' },
    like: { label: 'Likes', icon: Heart, color: AppColors.primary },
    comment: { label: 'Comments', icon: MessageCircle, color: '#22c55e' },
    review: { label: 'Reviews', icon: Star, color: '#f59e0b' },
    chimdoo: { label: 'ChimDoo Updates', icon: Bell, color: '#8b5cf6' },
};

export default function NotificationsScreen() {
    const router = useRouter();
    const { notifications, deleteNotification } = useNotifications();
    const { settings, updateSetting } = useNotificationSettings();
    const [selected, setSelected] = useState<AppNotification | null>(null);

    const handleDelete = (id: string) => {
        Alert.alert('Delete Notification', 'Remove this notification?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => deleteNotification(id) },
        ]);
    };

    const renderItem = ({ item }: { item: AppNotification }) => {
        const meta = TYPE_META[item.type] ?? TYPE_META.chimdoo;
        const Icon = meta.icon;
        return (
            <TouchableOpacity
                style={[styles.card, !item.read && styles.cardUnread]}
                onPress={() => setSelected(item)}
                activeOpacity={0.7}
            >
                <View style={[styles.iconCircle, { backgroundColor: `${meta.color}18` }]}>
                    {item.fromAvatar ? (
                        <Image source={{ uri: item.fromAvatar }} style={styles.avatar} />
                    ) : (
                        <Icon size={20} color={meta.color} />
                    )}
                </View>
                <View style={styles.cardContent}>
                    <View style={styles.cardTop}>
                        <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
                        <Text style={styles.cardTime}>
                            {item.createdAt ? formatRelativeTime(item.createdAt.toDate()) : ''}
                        </Text>
                    </View>
                    <Text style={styles.cardBody} numberOfLines={2}>{item.body}</Text>
                </View>
                <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.id)}>
                    <Trash2 size={16} color="#ccc" />
                </TouchableOpacity>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <ChevronLeft size={28} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notifications</Text>
                <View style={{ width: 40 }} />
            </View>

            <FlatList
                data={notifications}
                keyExtractor={(i) => i.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <View style={styles.settingsSection}>
                        <Text style={styles.sectionLabel}>Notification Types</Text>
                        {(Object.keys(TYPE_META) as NotificationType[]).map((type) => {
                            const meta = TYPE_META[type];
                            const Icon = meta.icon;
                            return (
                                <View key={type} style={styles.settingRow}>
                                    <View style={[styles.settingIcon, { backgroundColor: `${meta.color}14` }]}>
                                        <Icon size={16} color={meta.color} />
                                    </View>
                                    <Text style={styles.settingLabel}>{meta.label}</Text>
                                    <Switch
                                        value={settings[type]}
                                        onValueChange={(val) => updateSetting(type, val)}
                                        thumbColor={settings[type] ? '#fff' : '#eee'}
                                        trackColor={{ false: '#ddd', true: AppColors.primary }}
                                    />
                                </View>
                            );
                        })}
                        <Text style={styles.sectionLabel2}>Recent</Text>
                    </View>
                }
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Bell size={48} color="#e0e0e0" />
                        <Text style={styles.emptyText}>No notifications yet</Text>
                    </View>
                }
            />

            {selected && (
                <TouchableOpacity style={styles.detailBackdrop} activeOpacity={1} onPress={() => setSelected(null)}>
                    <View style={styles.detailCard} onStartShouldSetResponder={() => true}>
                        <Text style={styles.detailTitle}>{selected.title}</Text>
                        <Text style={styles.detailBody}>{selected.body}</Text>
                        {selected.createdAt && (
                            <Text style={styles.detailTime}>
                                {selected.createdAt.toDate().toLocaleString()}
                            </Text>
                        )}
                        <TouchableOpacity style={styles.detailClose} onPress={() => setSelected(null)}>
                            <Text style={styles.detailCloseText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: AppColors.backgroundLight },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: Platform.OS === 'ios' ? 60 : 48,
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: AppColors.navy,
    },
    backButton: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center', justifyContent: 'center',
    },
    headerTitle: { fontSize: 20, fontWeight: '700', color: '#fff' },
    listContent: { paddingBottom: 40 },
    settingsSection: { paddingHorizontal: 20, paddingTop: 20 },
    sectionLabel: {
        fontSize: 12, fontWeight: '700', color: '#999',
        textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12,
    },
    sectionLabel2: {
        fontSize: 12, fontWeight: '700', color: '#999',
        textTransform: 'uppercase', letterSpacing: 1,
        marginTop: 24, marginBottom: 12,
    },
    settingRow: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#fff', borderRadius: 14,
        padding: 14, marginBottom: 8, gap: 12,
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
    },
    settingIcon: {
        width: 36, height: 36, borderRadius: 10,
        alignItems: 'center', justifyContent: 'center',
    },
    settingLabel: { flex: 1, fontSize: 15, fontWeight: '500', color: AppColors.navy },
    card: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#fff', marginHorizontal: 20,
        marginBottom: 8, borderRadius: 16, padding: 14, gap: 12,
        borderWidth: 1, borderColor: '#f0f0f0',
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
    },
    cardUnread: {
        backgroundColor: 'rgba(230,57,70,0.03)',
        borderColor: 'rgba(230,57,70,0.15)',
    },
    iconCircle: {
        width: 46, height: 46, borderRadius: 23,
        alignItems: 'center', justifyContent: 'center',
    },
    avatar: { width: 46, height: 46, borderRadius: 23 },
    cardContent: { flex: 1 },
    cardTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 },
    cardTitle: { fontSize: 14, fontWeight: '700', color: '#1a1a1a', flex: 1 },
    cardTime: { fontSize: 11, color: '#aaa', marginLeft: 8 },
    cardBody: { fontSize: 13, color: '#666', lineHeight: 18 },
    deleteBtn: { padding: 6 },
    empty: { alignItems: 'center', paddingTop: 40, gap: 12 },
    emptyText: { fontSize: 14, color: '#bbb' },
    detailBackdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'center', alignItems: 'center', padding: 32,
    },
    detailCard: {
        backgroundColor: '#fff', borderRadius: 20, padding: 24, width: '100%', gap: 12,
        shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2, shadowRadius: 16, elevation: 10,
    },
    detailTitle: { fontSize: 16, fontWeight: '700', color: AppColors.navy },
    detailBody: { fontSize: 14, color: '#444', lineHeight: 22 },
    detailTime: { fontSize: 12, color: '#aaa' },
    detailClose: {
        alignSelf: 'flex-end', backgroundColor: AppColors.navy,
        borderRadius: 10, paddingHorizontal: 20, paddingVertical: 10,
    },
    detailCloseText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});
