import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Image,
    Platform,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Search, Clock, Flame, X, UtensilsCrossed, CookingPot } from 'lucide-react-native';
import { useChimDoo, ChimDooItem } from '@/hooks/useChimDoo';
import GuestState from '@/components/GuestState';
import RecipeCard from '@/components/RecipeCard';
import { AppColors } from '@/constants/colors';
import { AppFonts } from '@/constants/theme';

const Page = () => {
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    const { chimDooList, loading, isLoggedIn } = useChimDoo();

    const categories = useMemo(() => {
        const cats = new Set(chimDooList.map((r) => r.category).filter(Boolean));
        return ['All', ...Array.from(cats)];
    }, [chimDooList]);

    const filteredRecipes = useMemo(() => {
        return chimDooList.filter((r) => {
            const matchCategory =
                activeCategory === 'All' || r.category === activeCategory;
            const matchSearch =
                !search ||
                r.name.toLowerCase().includes(search.toLowerCase()) ||
                r.description.toLowerCase().includes(search.toLowerCase());
            return matchCategory && matchSearch;
        });
    }, [search, activeCategory, chimDooList]);

    const handleRecipePress = (recipe: ChimDooItem) => {
        router.push({
            pathname: '/recipe',
            params: { food: JSON.stringify(recipe), category: recipe.category },
        });
    };

    const renderRecipeCard = ({ item }: { item: ChimDooItem }) => (
        <RecipeCard item={item} onPress={handleRecipePress} />
    );

    if (!isLoggedIn) {
        return (
            <GuestState
                icon={UtensilsCrossed}
                title="Recipes"
                subtitle="Sign in to track menus you've tried and discover your favorite dishes!"
            />
        );
    }

    if (loading) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <ActivityIndicator size="large" color={AppColors.primary} />
            </View>
        );
    }

    return (
        <>
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.headerRow}>
                        <Text style={styles.headerTitle}>Recipes</Text>
                    </View>
                    <View style={styles.headerRight}>
                        <Text style={styles.headerSubtitle}>Menus you've tried!</Text>
                    </View>
                </View>

                {
                    chimDooList.length > 0 && (
                        <>
                            <View style={styles.searchWrapper}>
                                <View style={styles.searchBar}>
                                    <Search size={20} color="#999" />
                                    <TextInput
                                        style={styles.searchInput}
                                        placeholder="Search your ChimDoo recipes..."
                                        placeholderTextColor="#aaa"
                                        value={search}
                                        onChangeText={setSearch}
                                    />
                                    {search.length > 0 && (
                                        <TouchableOpacity onPress={() => setSearch('')}>
                                            <X size={18} color="#999" />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>

                            {categories.length > 1 && (
                                <View style={styles.categoryContainer}>
                                    <ScrollView
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        contentContainerStyle={styles.categoryScroll}
                                    >
                                        {categories.map((cat) => (
                                            <TouchableOpacity
                                                key={cat}
                                                style={[
                                                    styles.categoryPill,
                                                    activeCategory === cat &&
                                                    styles.categoryPillActive,
                                                ]}
                                                onPress={() => setActiveCategory(cat)}
                                                activeOpacity={0.7}
                                            >
                                                <Text
                                                    style={[
                                                        styles.categoryText,
                                                        activeCategory === cat &&
                                                        styles.categoryTextActive,
                                                    ]}
                                                >
                                                    {cat}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </View>
                            )}
                        </>
                    )
                }

                <FlatList
                    data={filteredRecipes}
                    keyExtractor={(item) => item.id}
                    renderItem={renderRecipeCard}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <UtensilsCrossed size={56} color={AppColors.navy} style={styles.emptyEmoji} />
                            <Text style={styles.emptyTitle}>Let's start Chim</Text>
                            <Text style={styles.emptySubtitle}>Explore ChimDoo and discover your favorite dish</Text>
                        </View>
                    }
                />
            </View>
        </>
    );
};

export default Page;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppColors.backgroundLight,
    },
    centerContent: {
        alignItems: 'center',
        justifyContent: 'center',
    },

    header: {
        paddingTop: Platform.OS === 'ios' ? 64 : 48,
        paddingHorizontal: 24,
        paddingBottom: 4,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerTitle: {
        fontFamily: AppFonts.bold,
        fontSize: 32,
        color: AppColors.navy,
        letterSpacing: -0.5,
    },
    headerSubtitle: {
        fontFamily: AppFonts.regular,
        fontSize: 14,
        color: '#888',
        marginTop: 4,
        marginLeft: 2,
    },
    searchWrapper: {
        paddingHorizontal: 20,
        marginTop: 16,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: Platform.OS === 'ios' ? 14 : 6,
        borderWidth: 1,
        borderColor: '#e8e8e8',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
        gap: 10,
    },
    searchInput: {
        fontFamily: AppFonts.regular,
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    categoryContainer: {
        marginTop: 16,
        marginBottom: 4,
    },
    categoryScroll: {
        paddingHorizontal: 20,
        gap: 10,
    },
    categoryPill: {
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 24,
        backgroundColor: '#FFFFFF',
        borderWidth: 1.5,
        borderColor: '#e0e0e0',
    },
    categoryPillActive: {
        backgroundColor: AppColors.primary,
        borderColor: AppColors.primary,
    },
    categoryText: {
        fontFamily: AppFonts.semiBold,
        fontSize: 14,
        color: '#666',
    },
    categoryTextActive: {
        color: '#FFFFFF',
    },

    listContent: {
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 120,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 80,
    },
    emptyEmoji: {
        marginBottom: 16,
    },
    emptyTitle: {
        fontFamily: AppFonts.bold,
        fontSize: 20,
        color: AppColors.navy,
        marginBottom: 8,
    },
    emptySubtitle: {
        fontFamily: AppFonts.regular,
        fontSize: 15,
        color: '#888',
        textAlign: 'center',
        paddingHorizontal: 40,
        lineHeight: 22,
    },
});