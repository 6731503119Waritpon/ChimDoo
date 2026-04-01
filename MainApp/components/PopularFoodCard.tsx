import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import { Check, CircleCheckBig, Clock, Drumstick, Flame, Soup, ChefHat } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AppColors } from '@/constants/colors';
import { AppFonts } from '@/constants/theme';

const { width } = Dimensions.get('window');

interface PopularFoodCardProps {
    item: any;
    onPress: () => void;
    badgeLabel?: string;
    isTasted?: boolean;
}

export default function PopularFoodCard({ item, onPress, badgeLabel = 'Popular', isTasted }: PopularFoodCardProps) {
    return (
        <TouchableOpacity style={styles.largeCard} activeOpacity={0.9} onPress={onPress}>
            <Image source={{ uri: item.image }} style={styles.largeCardImage} />
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={styles.largeCardOverlay}
            />

            {isTasted && (
                <View style={styles.tastedBadge}>
                    <ChefHat size={12} color={AppColors.success} />
                    <Text style={styles.tastedBadgeText}>CHIM</Text>
                </View>
            )}

            <View style={styles.largeCardContent}>
                <View style={[
                    styles.largeCardBadge,
                    { backgroundColor: badgeLabel === 'Popular' ? AppColors.popular : AppColors.primary },
                    styles.shadowSubtle
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
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginBottom: 10,
    },
    shadowSubtle: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    largeCardBadgeText: { color: '#fff', fontSize: 11, fontFamily: AppFonts.bold },
    largeCardTitle: {
        fontSize: 22, color: '#fff',
        fontFamily: AppFonts.bold,
        marginBottom: 4, textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4,
    },
    largeCardDesc: { fontFamily: AppFonts.regular, fontSize: 13, color: '#eee', marginBottom: 10 },
    largeCardMeta: { flexDirection: 'row', gap: 8 },
    metaChip: {
        flexDirection: 'row', alignItems: 'center', gap: 4,
        backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 8,
        paddingVertical: 4, borderRadius: 8,
    },
    metaChipText: { color: '#fff', fontSize: 11, fontFamily: AppFonts.semiBold },
    tastedBadge: {
        position: 'absolute',
        top: 14,
        right: 14,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        zIndex: 10,
        borderWidth: 1.5,
        borderColor: AppColors.success,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    tastedBadgeText: {
        color: AppColors.success,
        fontSize: 10,
        fontFamily: AppFonts.bold,
        letterSpacing: 1.2,
    },
});
