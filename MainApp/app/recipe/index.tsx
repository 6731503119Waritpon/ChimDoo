import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Clock, Flame, Utensils } from 'lucide-react-native';
import { FoodItem, Taste } from '@/types/recipe';

export default function RecipePage() {
    const router = useRouter();
    const params = useLocalSearchParams();
    
    const food: FoodItem = params.food ? JSON.parse(params.food as string) : null;

    if (!food) return null;

    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <Image source={{ uri: food.image }} style={styles.image} />
                <TouchableOpacity 
                    style={styles.backButton} 
                    onPress={() => router.back()}
                >
                    <ArrowLeft size={24} color="#fff" />
                </TouchableOpacity>
                <View style={styles.overlay} />
                <Text style={styles.title}>{food.name}</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <Text style={styles.description}>{food.description}</Text>

                <View style={styles.metaContainer}>
                    <View style={styles.metaItem}>
                        <Clock size={20} color="#E63946" />
                        <Text style={styles.metaText}>{food.prepTime}</Text>
                    </View>
                    <View style={styles.metaItem}>
                        <Flame size={20} color="#E63946" />
                        <Text style={styles.metaText}>{food.taste}</Text>
                    </View>
                    <View style={styles.metaItem}>
                        <Utensils size={20} color="#E63946" />
                        <Text style={styles.metaText}>{food.servings}</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Ingredients</Text>
                    {food.ingredients?.map((item, index) => (
                        <View key={index} style={styles.ingredientRow}>
                            <View style={styles.bullet} />
                            <Text style={styles.ingredientText}>{item}</Text>
                        </View>
                    )) || <Text style={styles.emptyText}>No ingredients info</Text>}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Instructions</Text>
                    {food.instructions?.map((step, index) => (
                        <View key={index} style={styles.stepContainer}>
                            <View style={styles.stepNumberBadge}>
                                <Text style={styles.stepNumber}>{index + 1}</Text>
                            </View>
                            <Text style={styles.stepText}>{step}</Text>
                        </View>
                    )) || <Text style={styles.emptyText}>No instructions info</Text>}
                </View>
                
                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    imageContainer: { height: 300, position: 'relative' },
    image: { width: '100%', height: '100%' },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    backButton: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 50 : 40,
        left: 20,
        zIndex: 10,
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    title: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 10,
    },
    content: { padding: 20 },
    description: { fontSize: 16, color: '#666', lineHeight: 24, marginBottom: 20 },
    metaContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 15,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#eee',
        marginBottom: 25,
    },
    metaItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    metaText: { fontSize: 14, fontWeight: '600', color: '#333' },
    section: { marginBottom: 25 },
    sectionTitle: { fontSize: 20, fontWeight: '700', color: '#1D3557', marginBottom: 15 },
    ingredientRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    bullet: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#E63946', marginRight: 12 },
    ingredientText: { fontSize: 16, color: '#444' },
    stepContainer: { flexDirection: 'row', marginBottom: 20 },
    stepNumberBadge: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#1D3557',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        marginTop: 2,
    },
    stepNumber: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
    stepText: { flex: 1, fontSize: 16, color: '#444', lineHeight: 24 },
    emptyText: { color: '#999', fontStyle: 'italic' },
});