import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { AppColors } from '@/constants/colors';
import { AppFonts } from '@/constants/theme';
import { Check, CircleCheckBig, Drumstick } from 'lucide-react-native';

interface NormalFoodItemProps {
    item: any;
    onPress: () => void;
    isTasted?: boolean;
}

export default function NormalFoodItem({ item, onPress, isTasted }: NormalFoodItemProps) {
    return (
        <TouchableOpacity style={styles.smallCard} activeOpacity={0.7} onPress={onPress}>
            <Image source={{ uri: item.image }} style={styles.smallCardImage} />
            <View style={styles.smallCardInfo}>
                <Text style={styles.smallCardName}>{item.name}</Text>
                <Text style={styles.smallCardDesc} numberOfLines={2}>
                    {item.description}
                </Text>
            </View>
            {isTasted && (
                <View style={styles.tastedBadge}>
                    <Text style={styles.tastedBadgeText}>Chim <CircleCheckBig size={12} color="#fff" /></Text>
                </View>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    smallCard: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF',
        borderRadius: 16, padding: 12, marginBottom: 12,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05, shadowRadius: 8, elevation: 2, gap: 16,
        position: 'relative',
    },
    smallCardImage: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#f0f0f0' },
    smallCardInfo: { flex: 1 },
    smallCardName: { fontFamily: AppFonts.bold, fontSize: 16, color: AppColors.navy, marginBottom: 4, paddingRight: 60 },
    smallCardDesc: { fontFamily: AppFonts.regular, fontSize: 13, color: '#777', lineHeight: 18, paddingRight: 60 },
    tastedBadge: {
        position: 'absolute',
        top: 10,
        right: 12,
        backgroundColor: AppColors.success,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
    },
    tastedBadgeText: {
        color: '#fff',
        fontSize: 10,
        fontFamily: AppFonts.bold,
    },
});
