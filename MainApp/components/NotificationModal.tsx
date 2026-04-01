import React, { useRef, useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Modal,
    Animated,
    Dimensions,
    Platform,
    Image,
    ScrollView,
} from 'react-native';
import { Bell, X, UserPlus, Heart, MessageCircle, Star, CheckCheck } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { useNotifications, AppNotification } from '../hooks/useNotifications';
import { formatRelativeTime } from '@/utils/formatTime';
import { AppColors } from '@/constants/colors';
import { AppFonts } from '@/constants/theme';

const { width, height } = Dimensions.get('window');

const CARD_HEIGHT = 72;
const PANEL_TOP = Platform.OS === 'ios' ? 100 : 72;
const MAX_VISIBLE = 4;

const TYPE_ICON: Record<string, { icon: any; color: string }> = {
    friend_request: { icon: UserPlus, color: '#3b82f6' },
    like: { icon: Heart, color: AppColors.primary },
    comment: { icon: MessageCircle, color: '#22c55e' },
    review: { icon: Star, color: '#f59e0b' },
    chimdoo: { icon: Bell, color: '#8b5cf6' },
};

interface Props {
    visible: boolean;
    onClose: () => void;
}

export default function NotificationModal({ visible, onClose }: Props) {
    const router = useRouter();
    const { notifications, markAsRead, markAllRead, deleteNotification } = useNotifications();
    const slideAnim = useRef(new Animated.Value(-300)).current;
    const [selected, setSelected] = useState<AppNotification | null>(null);

    useEffect(() => {
        if (visible) {
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(slideAnim, {
                toValue: -300,
                duration: 200,
                useNativeDriver: true,
            }).start();
        }
    }, [visible]);

    const handlePress = (item: AppNotification) => {
        if (!item.read) markAsRead(item.id);
        setSelected(item);
    };

    const listMaxHeight = MAX_VISIBLE * CARD_HEIGHT + 8;

    const renderItem = ({ item }: { item: AppNotification }) => {
        const meta = TYPE_ICON[item.type] ?? TYPE_ICON.chimdoo;
        const Icon = meta.icon;
        return (
            <TouchableOpacity
                style={[styles.card, !item.read && styles.cardUnread]}
                onPress={() => handlePress(item)}
                activeOpacity={0.7}
            >
                <View style={[styles.iconCircle, { backgroundColor: `${meta.color}22` }]}>
                    {item.fromAvatar ? (
                        <Image source={{ uri: item.fromAvatar }} style={styles.avatar} />
                    ) : (
                        <Icon size={20} color={meta.color} />
                    )}
                </View>
                <View style={styles.cardBody}>
                    <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.cardBody2} numberOfLines={2}>{item.body}</Text>
                </View>
                <View style={styles.cardRight}>
                    <Text style={styles.timeText}>
                        {item.createdAt ? formatRelativeTime(item.createdAt.toDate()) : ''}
                    </Text>
                    {!item.read && <View style={styles.unreadDot} />}
                </View>
            </TouchableOpacity>
        );
    };

    if (!visible && !selected) return null;

    return (
        <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
            <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={onClose}>
                <BlurView intensity={10} tint="dark" style={[StyleSheet.absoluteFill, styles.backdrop]} />
            </TouchableOpacity>

            <Animated.View
                style={[styles.panel, { transform: [{ translateY: slideAnim }] }]}
            >
                <View style={styles.panelHeader}>
                    <Bell size={18} color={AppColors.navy} />
                    <Text style={styles.panelTitle}>Notifications</Text>
                    <TouchableOpacity style={styles.markAllBtn} onPress={markAllRead}>
                        <CheckCheck size={16} color="#888" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                        <X size={18} color="#555" />
                    </TouchableOpacity>
                </View>

                {notifications.length === 0 ? (
                    <View style={styles.empty}>
                        <Bell size={36} color="#ddd" />
                        <Text style={styles.emptyText}>No notifications yet</Text>
                    </View>
                ) : (
                    <ScrollView
                        style={{ maxHeight: listMaxHeight }}
                        showsVerticalScrollIndicator={notifications.length > MAX_VISIBLE}
                        bounces={false}
                        contentContainerStyle={styles.list}
                    >
                        {notifications.slice(0, 10).map((item) => (
                            <View key={item.id}>
                                {renderItem({ item })}
                            </View>
                        ))}
                        {notifications.length > 10 && (
                            <TouchableOpacity 
                                style={styles.seeAllButton}
                                onPress={() => {
                                    onClose();
                                    router.push('/profile/account/notifications');
                                }}
                            >
                                <Text style={styles.seeAllText}>See All</Text>
                            </TouchableOpacity>
                        )}
                    </ScrollView>
                )}
            </Animated.View>

            {selected && (
                <Modal transparent animationType="fade" visible={!!selected} onRequestClose={() => setSelected(null)}>
                    <TouchableOpacity style={styles.detailBackdrop} activeOpacity={1} onPress={() => setSelected(null)}>
                        <View style={styles.detailCard} onStartShouldSetResponder={() => true}>
                            <View style={styles.detailHeader}>
                                <Text style={styles.detailTitle}>{selected.title}</Text>
                                <TouchableOpacity onPress={() => setSelected(null)}>
                                    <X size={20} color="#555" />
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.detailBody}>{selected.body}</Text>
                            {selected.createdAt && (
                                <Text style={styles.detailTime}>
                                    {selected.createdAt.toDate().toLocaleString()}
                                </Text>
                            )}
                        </View>
                    </TouchableOpacity>
                </Modal>
            )}
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    panel: {
        position: 'absolute',
        top: PANEL_TOP,
        left: 16,
        right: 16,
        backgroundColor: '#fff',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.22,
        shadowRadius: 24,
        elevation: 14,
        overflow: 'hidden',
    },
    panelHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
        gap: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    panelTitle: {
        fontFamily: AppFonts.bold,
        flex: 1,
        fontSize: 16,
        color: AppColors.navy,
    },
    markAllBtn: {
        padding: 4,
    },
    closeBtn: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    list: {
        paddingHorizontal: 12,
        paddingVertical: 10,
        gap: 8,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fafafa',
        borderRadius: 14,
        padding: 10,
        gap: 10,
        borderWidth: 1,
        borderColor: '#f0f0f0',
        marginBottom: 8,
        minHeight: CARD_HEIGHT - 8,
    },
    cardUnread: {
        backgroundColor: 'rgba(230,57,70,0.04)',
        borderColor: 'rgba(230,57,70,0.15)',
    },
    iconCircle: {
        width: 42,
        height: 42,
        borderRadius: 21,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatar: {
        width: 42,
        height: 42,
        borderRadius: 21,
    },
    cardBody: {
        flex: 1,
        gap: 2,
    },
    cardTitle: {
        fontFamily: AppFonts.bold,
        fontSize: 13,
        color: '#1a1a1a',
    },
    cardBody2: {
        fontFamily: AppFonts.regular,
        fontSize: 12,
        color: '#666',
        lineHeight: 17,
    },
    cardRight: {
        alignItems: 'flex-end',
        gap: 6,
    },
    timeText: {
        fontFamily: AppFonts.regular,
        fontSize: 11,
        color: '#aaa',
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: AppColors.primary,
    },
    empty: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 36,
        gap: 10,
    },
    emptyText: {
        fontFamily: AppFonts.regular,
        fontSize: 14,
        color: '#bbb',
    },
    detailBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    detailCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 24,
        width: '100%',
        gap: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 10,
    },
    detailHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    detailTitle: {
        fontFamily: AppFonts.bold,
        fontSize: 16,
        color: AppColors.navy,
        flex: 1,
        marginRight: 12,
    },
    detailBody: {
        fontFamily: AppFonts.regular,
        fontSize: 14,
        color: '#444',
        lineHeight: 22,
    },
    detailTime: {
        fontFamily: AppFonts.regular,
        fontSize: 12,
        color: '#aaa',
    },
    seeAllButton: {
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 4,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    seeAllText: {
        fontFamily: AppFonts.semiBold,
        fontSize: 14,
        color: AppColors.primary,
    },
});
