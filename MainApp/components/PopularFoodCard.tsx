import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import { Clock, Flame, Soup } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AppColors } from '@/constants/colors';

const { width } = Dimensions.get('window');

interface PopularFoodCardProps {
    item: any;
    onPress: () => void;
    badgeLabel?: string;
}

export default function PopularFoodCard({ item, onPress, badgeLabel = 'Popular' }: PopularFoodCardProps) {
    return (
        <TouchableOpacity style={styles.largeCard} activeOpacity={0.9} onPress={onPress}>
            <Image source={{ uri: item.image }} style={styles.largeCardImage} />
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={styles.largeCardOverlay}
            />

            <View style={styles.largeCardContent}>
                <View style={[
                    styles.largeCardBadge,
                    { backgroundColor: badgeLabel === 'Popular' ? AppColors.gold : AppColors.primary }
                ]}>
                    <Text style={styles.largeCardBadgeText}>{badgeLabel}</Text>
                </View>

                <Text style={styles.largeCardTitle}>{item.name}</Text>
                <Text style={styles.largeCardDesc} numberOfLines={2}>{item.description}</Text>

                <View style={styles.largeCardMeta}>
                    <View style={styles.metaChip}>
                        <Clock size={12} color="#fff" />
                        <Text style={styles.metaChipText}>{item.prepTime}</Text>
                    </View>
                    <View style={styles.metaChip}>
                        <Soup size={12} color="#fff" />
                        <Text style={styles.metaChipText}>
                            {Array.isArray(item.taste) ? item.taste.join(', ') : item.taste}
                        </Text>

                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    largeCard: {
        width: width > 600 ? 350 : width * 0.82,
        height: 220,
        borderRadius: 24,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#ccc',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
    },
    largeCardImage: { width: '100%', height: '100%', position: 'absolute' },
    largeCardOverlay: { ...StyleSheet.absoluteFillObject },
    largeCardContent: { flex: 1, justifyContent: 'flex-end', padding: 20 },
    largeCardBadge: {
        alignSelf: 'flex-start',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 4,
        marginBottom: 8,
    },
    largeCardBadgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },
    largeCardTitle: {
        fontSize: 22, fontWeight: '800', color: '#fff',
        marginBottom: 4, textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4,
    },
    largeCardDesc: { fontSize: 13, color: '#eee', marginBottom: 10 },
    largeCardMeta: { flexDirection: 'row', gap: 8 },
    metaChip: {
        flexDirection: 'row', alignItems: 'center', gap: 4,
        backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 8,
        paddingVertical: 4, borderRadius: 8,
    },
    metaChipText: { color: '#fff', fontSize: 11, fontWeight: '600' },
});
