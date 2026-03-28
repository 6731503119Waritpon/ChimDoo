import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Clock, Flame, Soup } from 'lucide-react-native';
import { ChimDooItem } from '@/hooks/useChimDoo';
import { AppFonts } from '@/constants/theme';

interface RecipeCardProps {
    item: ChimDooItem;
    onPress: (item: ChimDooItem) => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ item, onPress }) => {
    return (
        <TouchableOpacity
            style={styles.recipeCard}
            activeOpacity={0.7}
            onPress={() => onPress(item)}
        >
            <Image source={{ uri: item.image }} style={styles.recipeImage} />
            <View style={styles.recipeOverlay} />
            <View style={styles.recipeContent}>
                {item.category ? (
                    <View style={styles.recipeBadge}>
                        <Text style={styles.recipeBadgeText}>{item.category}</Text>
                    </View>
                ) : null}
                <Text style={styles.recipeName}>{item.name}</Text>
                <Text style={styles.recipeDesc} numberOfLines={2}>
                    {item.description}
                </Text>
                <View style={styles.recipeMeta}>
                    {item.prepTime ? (
                        <View style={styles.metaChip}>
                            <Clock size={13} color="#fff" />
                            <Text style={styles.metaChipText}>{item.prepTime}</Text>
                        </View>
                    ) : null}
                    {item.taste && item.taste.length > 0 ? (
                        <View style={styles.metaChip}>
                            <Soup size={13} color="#fff" />
                            <Text style={styles.metaChipText}>{item.taste[0]}</Text>
                        </View>
                    ) : null}
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default RecipeCard;

const styles = StyleSheet.create({
    recipeCard: {
        borderRadius: 22,
        overflow: 'hidden',
        marginBottom: 18,
        height: 220,
        position: 'relative',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
        elevation: 8,
    },
    recipeImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    recipeOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.35)',
    },
    recipeContent: {
        flex: 1,
        justifyContent: 'flex-end',
        padding: 18,
    },
    recipeBadge: {
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(230, 57, 70, 0.9)',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 5,
        marginBottom: 8,
    },
    recipeBadgeText: {
        color: '#fff',
        fontSize: 12,
        fontFamily: AppFonts.bold,
    },
    recipeName: {
        fontFamily: AppFonts.bold,
        fontSize: 22,
        color: '#fff',
        marginBottom: 4,
        textShadowColor: 'rgba(0,0,0,0.4)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    recipeDesc: {
        fontFamily: AppFonts.regular,
        fontSize: 13,
        color: 'rgba(255,255,255,0.85)',
        lineHeight: 18,
        marginBottom: 8,
    },
    recipeMeta: {
        flexDirection: 'row',
        gap: 10,
    },
    metaChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    metaChipText: {
        color: '#fff',
        fontSize: 12,
        fontFamily: AppFonts.semiBold,
    },
});