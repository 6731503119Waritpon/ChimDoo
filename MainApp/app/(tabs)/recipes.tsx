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
import NotificationBell from '@/components/NotificationBell';
import NotificationModal from '@/components/NotificationModal';
import { AppColors } from '@/constants/colors';

const Page = () => {
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    const { chimDooList, loading, isLoggedIn } = useChimDoo();
    const [showNotif, setShowNotif] = useState(false);

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
        <TouchableOpacity
            style={styles.recipeCard}
            activeOpacity={0.7}
            onPress={() => handleRecipePress(item)}
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
                            <Text style={styles.metaChipText}>
                                {item.prepTime}
                            </Text>
                        </View>
                    ) : null}
                    {item.taste && item.taste.length > 0 ? (
                        <View style={styles.metaChip}>
                            <Flame size={13} color="#fff" />
                            <Text style={styles.metaChipText}>
                                {item.taste[0]}
                            </Text>
                        </View>
                    ) : null}
                </View>
            </View>
        </TouchableOpacity>
    );

    if (!isLoggedIn) {
        return (
            <View style={styles.guestContainer}>
                <View style={styles.guestIconWrapper}>
                    <UtensilsCrossed size={48} color={AppColors.primary} />
                </View>
                <Text style={styles.guestTitle}>Recipes</Text>
                <Text style={styles.guestSubtitle}>
                    Sign in to track menus you've tried and discover your favorite dishes!
                </Text>
            </View>
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
                        <CookingPot size={28} color={AppColors.primary} />
                        <Text style={styles.headerTitle}>Recipes</Text>
                    </View>
                    <View style={styles.headerRight}>
                        <Text style={styles.headerSubtitle}>Menus you've tried!</Text>
                        <NotificationBell onPress={() => setShowNotif(true)} />
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
            <NotificationModal visible={showNotif} onClose={() => setShowNotif(false)} />
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
        fontSize: 32,
        fontWeight: '800',
        color: AppColors.navy,
        letterSpacing: -0.5,
    },
    headerSubtitle: {
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
        fontSize: 14,
        fontWeight: '600',
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
        fontWeight: '700',
    },
    recipeName: {
        fontSize: 22,
        fontWeight: '800',
        color: '#fff',
        marginBottom: 4,
        textShadowColor: 'rgba(0,0,0,0.4)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    recipeDesc: {
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
        fontWeight: '600',
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
        fontSize: 20,
        fontWeight: '700',
        color: AppColors.navy,
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 15,
        color: '#888',
        textAlign: 'center',
        paddingHorizontal: 40,
        lineHeight: 22,
    },
    guestContainer: {
        flex: 1,
        backgroundColor: AppColors.backgroundLight,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    guestIconWrapper: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: 'rgba(230, 57, 70, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    guestTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: AppColors.navy,
        marginBottom: 12,
    },
    guestSubtitle: {
        fontSize: 15,
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
        paddingHorizontal: 10,
    },
    guestState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 80,
        paddingHorizontal: 32,
    },
});