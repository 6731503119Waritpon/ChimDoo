import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Platform,
    ScrollView,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { UtensilsCrossed, Search, Earth } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useChimDoo, ChimDooItem } from '@/hooks/useChimDoo';
import { globeCountries } from '@/config/home';
import GuestState from '@/components/ui/GuestState';
import GridRecipeCard from '@/components/cards/GridRecipeCard';
import HeroRecipeCard from '@/components/cards/HeroRecipeCard';
import RecipeCard from '@/components/cards/RecipeCard';
import Pagination from '@/components/ui/Pagination';
import SortSelectModal from '@/components/modals/SortSelectModal';
import RecipeSkeleton from '@/components/ui/RecipeSkeleton';
import { AppColors } from '@/constants/colors';
import { AppFonts, AppLayout } from '@/constants/theme';
import { AppStrings } from '@/constants/strings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RecipeFilterBar } from '@/modules/recipes/components/RecipeFilterBar';

const Page = () => {
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [isCategoriesExpanded, setIsCategoriesExpanded] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sortMode, setSortMode] = useState<'latest' | 'az' | 'za'>('latest');
    const [isSortModalVisible, setSortModalVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const ITEMS_PER_PAGE = 12;
    const MAX_VISIBLE_CATS = 4;

    const { chimDooList, loading, isLoggedIn } = useChimDoo();

    useEffect(() => {
        const loadPrefs = async () => {
            try {
                const savedView = await AsyncStorage.getItem('chimpdoo_view');
                const savedSort = await AsyncStorage.getItem('chimpdoo_sort');
                if (savedView === 'list' || savedView === 'grid') setViewMode(savedView);
                if (savedSort === 'latest' || savedSort === 'az' || savedSort === 'za') setSortMode(savedSort);
            } catch (e) { }
        };
        loadPrefs();
    }, []);

    const changeViewMode = async (mode: 'grid' | 'list') => {
        setViewMode(mode);
        await AsyncStorage.setItem('chimpdoo_view', mode);
    };

    const changeSortMode = async (mode: 'latest' | 'az' | 'za') => {
        setSortMode(mode);
        setCurrentPage(1);
        await AsyncStorage.setItem('chimpdoo_sort', mode);
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [search, activeCategory]);

    const categories = useMemo(() => {
        const cats = new Set(chimDooList.map((r) => r.category).filter(Boolean));
        return ['All', ...Array.from(cats)];
    }, [chimDooList]);

    const isBaseState = currentPage === 1 && !search && activeCategory === 'All';
    const heroRecipe = isBaseState && chimDooList.length > 0 ? chimDooList[0] : null;

    const filteredRecipes = useMemo(() => {
        let items = [...chimDooList].filter((r) => {
            const matchCategory =
                activeCategory === 'All' || r.category === activeCategory;
            const matchSearch =
                !search ||
                r.name.toLowerCase().includes(search.toLowerCase()) ||
                r.description.toLowerCase().includes(search.toLowerCase()) ||
                (!!r.category && r.category.toLowerCase().includes(search.toLowerCase()));
            return matchCategory && matchSearch;
        });

        if (sortMode === 'az') {
            items.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortMode === 'za') {
            items.sort((a, b) => b.name.localeCompare(a.name));
        }

        if (isBaseState && items.length > 0 && sortMode === 'latest') {
            items = items.slice(1);
        }

        return items;
    }, [search, activeCategory, chimDooList, isBaseState, sortMode]);

    const totalItems = filteredRecipes.length;

    const paginatedRecipes = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredRecipes.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredRecipes, currentPage]);

    const handleRecipePress = (recipe: ChimDooItem) => {
        router.push({
            pathname: '/recipe',
            params: { food: JSON.stringify(recipe), category: recipe.category },
        });
    };

    const handleSortPress = () => {
        setSortModalVisible(true);
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1200);
    }, []);

    if (!isLoggedIn) {
        return (
            <GuestState
                icon={UtensilsCrossed}
                title={AppStrings.loginRequired}
                subtitle={AppStrings.loginToSaveRecipe}
            />
        );
    }

    if (loading) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.headerTitleRow}>
                        <Text style={styles.headerTitle}>My Recipes</Text>
                    </View>
                    <Text style={styles.headerSubtitle}>Preparing your cookbook...</Text>
                </View>
                <RecipeSkeleton viewMode={viewMode} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerTitleRow}>
                    <Text style={styles.headerTitle}>My Recipes</Text>
                    <View style={styles.headerBadge}>
                        <Text style={styles.headerBadgeText}>{chimDooList.length}</Text>
                    </View>
                </View>
                <Text style={styles.headerSubtitle}>
                    You've explored {chimDooList.length} {chimDooList.length === 1 ? 'dish' : 'dishes'} so far!
                </Text>
            </View>

            {chimDooList.length > 0 && (
                <RecipeFilterBar
                    search={search}
                    setSearch={setSearch}
                    sortMode={sortMode}
                    handleSortPress={() => setSortModalVisible(true)}
                    viewMode={viewMode}
                    changeViewMode={setViewMode}
                    categories={categories}
                    activeCategory={activeCategory}
                    setActiveCategory={setActiveCategory}
                    isCategoriesExpanded={isCategoriesExpanded}
                    setIsCategoriesExpanded={setIsCategoriesExpanded}
                />
            )}

            <SortSelectModal
                visible={isSortModalVisible}
                onClose={() => setSortModalVisible(false)}
                selectedSort={sortMode}
                onSelectSort={(sort) => {
                    changeSortMode(sort);
                    setSortModalVisible(false);
                }}
            />

            <FlatList
                data={paginatedRecipes}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[AppColors.primary]}
                        tintColor={AppColors.primary}
                    />
                }
                keyExtractor={(item) => item.id}
                numColumns={viewMode === 'grid' ? 2 : 1}
                key={`recipes-${viewMode}`}
                renderItem={({ item, index }) =>
                    viewMode === 'grid' ? (
                        <GridRecipeCard item={item} index={index} onPress={handleRecipePress} />
                    ) : (
                        <Animated.View entering={FadeInDown.delay((index % 12) * 80).duration(400).springify()}>
                            <View style={{ marginHorizontal: 20, marginBottom: 16 }}>
                                <RecipeCard item={item} onPress={handleRecipePress} />
                            </View>
                        </Animated.View>
                    )
                }
                contentContainerStyle={styles.listContent}
                columnWrapperStyle={viewMode === 'grid' ? styles.columnWrapper : undefined}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        {search || activeCategory !== 'All' ? (
                            <Animated.View entering={FadeInDown.duration(400).springify()} style={{ alignItems: 'center' }}>
                                <View style={styles.emptyIconCircle}>
                                    <Search size={32} color="#9CA3AF" />
                                </View>
                                <Text style={styles.emptyTitle}>Nothing Found</Text>
                                <Text style={styles.emptySubtitle}>
                                    We couldn't find any saved menus matching your filters. Try adjusting your search.
                                </Text>
                                <TouchableOpacity
                                    style={styles.emptyButton}
                                    activeOpacity={0.8}
                                    onPress={() => {
                                        setSearch('');
                                        setActiveCategory('All');
                                    }}
                                >
                                    <Text style={styles.emptyButtonText}>Clear Filters</Text>
                                </TouchableOpacity>
                            </Animated.View>
                        ) : (
                            <Animated.View entering={FadeInDown.duration(500).springify()} style={{ alignItems: 'center' }}>
                                <View style={[styles.emptyIconCircle, { backgroundColor: 'rgba(230, 57, 70, 0.1)' }]}>
                                    <Earth size={44} color={AppColors.primary} />
                                </View>
                                <Text style={styles.emptyTitle}>Your Cookbook is Empty</Text>
                                <Text style={styles.emptySubtitle}>
                                    You haven't discovered any dishes yet. Let's travel the globe and find your next favorite meal!
                                </Text>
                                <TouchableOpacity
                                    style={[styles.emptyButton, { backgroundColor: AppColors.primary, borderColor: AppColors.primary }]}
                                    activeOpacity={0.8}
                                    onPress={() => router.push('/')}
                                >
                                    <Text style={[styles.emptyButtonText, { color: '#FFF' }]}>Start Exploring</Text>
                                </TouchableOpacity>
                            </Animated.View>
                        )}
                    </View>
                }
                ListHeaderComponent={
                    heroRecipe ? (
                        <View style={styles.heroWrapper}>
                            <HeroRecipeCard item={heroRecipe} onPress={handleRecipePress} />
                            <Text style={styles.sectionTitle}>More Saved Menus</Text>
                        </View>
                    ) : null
                }
                ListFooterComponent={
                    totalItems > 0 ? (
                        <View style={styles.paginationWrapper}>
                            <Pagination
                                currentPage={currentPage}
                                totalItems={totalItems}
                                itemsPerPage={ITEMS_PER_PAGE}
                                onPageChange={(page) => setCurrentPage(page)}
                            />
                        </View>
                    ) : null
                }
            />
        </View>
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
        paddingTop: Platform.select(AppLayout.headerPaddingTop),
        paddingHorizontal: AppLayout.screenPaddingHorizontal,
        paddingBottom: 4,
    },
    headerTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    headerTitle: {
        fontFamily: AppFonts.bold,
        fontSize: 34,
        color: AppColors.navy,
        letterSpacing: -0.8,
    },
    headerBadge: {
        backgroundColor: AppColors.primary,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
    },
    headerBadgeText: {
        color: '#FFF',
        fontFamily: AppFonts.bold,
        fontSize: 14,
    },
    headerSubtitle: {
        fontFamily: AppFonts.medium,
        fontSize: 15,
        color: AppColors.textMuted,
        marginTop: 6,
    },
    listContent: {
        paddingTop: 8,
        paddingBottom: 120,
    },
    heroWrapper: {
        marginBottom: 8,
    },
    sectionTitle: {
        fontFamily: AppFonts.bold,
        fontSize: 18,
        color: AppColors.navy,
        marginLeft: 22,
        marginBottom: 16,
    },
    columnWrapper: {
        paddingHorizontal: 12,
        justifyContent: 'flex-start',
    },
    paginationWrapper: {
        marginTop: 16,
        marginBottom: 60,
        paddingHorizontal: 20,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 80,
    },
    emptyIconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: AppColors.backgroundLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    emptyTitle: {
        fontFamily: AppFonts.bold,
        fontSize: 20,
        color: AppColors.navy,
        marginBottom: 8,
        textAlign: 'center',
    },
    emptySubtitle: {
        fontFamily: AppFonts.medium,
        fontSize: 14,
        color: AppColors.textMuted,
        textAlign: 'center',
        lineHeight: 22,
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    emptyButton: {
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 100,
        backgroundColor: AppColors.white,
        borderWidth: 1.5,
        borderColor: AppColors.borderSubtle,
    },
    emptyButtonText: {
        fontFamily: AppFonts.bold,
        fontSize: 15,
        color: AppColors.textDark,
    },
});