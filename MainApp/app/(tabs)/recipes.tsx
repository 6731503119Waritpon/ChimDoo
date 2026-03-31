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
import { Search, X, UtensilsCrossed, Compass, Earth, List, LayoutGrid, ChevronDown, ChevronUp, ArrowDownUp } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import CountryFlag from 'react-native-country-flag';
import { useChimDoo, ChimDooItem } from '@/hooks/useChimDoo';
import { globeCountries } from '@/config/home';
import GuestState from '@/components/GuestState';
import GridRecipeCard from '@/components/GridRecipeCard';
import HeroRecipeCard from '@/components/HeroRecipeCard';
import RecipeCard from '@/components/RecipeCard';
import Pagination from '@/components/Pagination';
import SortSelectModal from '@/components/SortSelectModal';
import RecipeSkeleton from '@/components/RecipeSkeleton';
import { AppColors } from '@/constants/colors';
import { AppFonts } from '@/constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
            } catch (e) {}
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
                title="Your Cookbook"
                subtitle="Sign in to save menus you've tried and easily access your personal food diary!"
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
                <View style={styles.stickyControls}>
                    <View style={styles.searchContainer}>
                        <View style={[styles.searchBar, { flex: 1 }]}>
                            <Search size={18} color="#9CA3AF" />
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Find a dish or country..."
                                placeholderTextColor="#9CA3AF"
                                value={search}
                                onChangeText={setSearch}
                            />
                            {search.length > 0 && (
                                <TouchableOpacity onPress={() => setSearch('')} style={styles.clearBtn}>
                                    <X size={16} color="#FFF" />
                                </TouchableOpacity>
                            )}
                        </View>
                        <TouchableOpacity
                            style={[styles.toggleBtn, { marginRight: 4, marginLeft: 2 }]}
                            activeOpacity={0.7}
                            onPress={handleSortPress}
                        >
                            <ArrowDownUp size={20} color={sortMode !== 'latest' ? AppColors.primary : AppColors.textMuted} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.toggleBtn}
                            activeOpacity={0.7}
                            onPress={() => changeViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                        >
                            {viewMode === 'grid' ? (
                                <List size={22} color="#6B7280" />
                            ) : (
                                <LayoutGrid size={22} color="#6B7280" />
                            )}
                        </TouchableOpacity>
                    </View>

                    {categories.length > 1 && (
                        <View style={[styles.categoryContainer, isCategoriesExpanded && { marginBottom: 12 }]}>
                            {categories.length > MAX_VISIBLE_CATS && isCategoriesExpanded ? (
                                <View style={styles.categoryWrap}>
                                    {categories.map((cat) => {
                                        const isActive = activeCategory === cat;
                                        const countryInfo = globeCountries.find(
                                            (c) => c.name.toLowerCase() === cat.toLowerCase()
                                        );

                                        return (
                                            <TouchableOpacity
                                                key={cat}
                                                style={[
                                                    styles.categoryPill,
                                                    isActive && styles.categoryPillActive,
                                                ]}
                                                onPress={() => {
                                                    setActiveCategory(cat);
                                                    setIsCategoriesExpanded(false);
                                                }}
                                                activeOpacity={0.8}
                                            >
                                                {cat === 'All' ? (
                                                    <Compass size={14} color={isActive ? '#FFF' : AppColors.textMuted} style={{ marginRight: 6 }} />
                                                ) : countryInfo?.isoCode ? (
                                                    <CountryFlag 
                                                        isoCode={countryInfo.isoCode} 
                                                        size={12} 
                                                        style={{ marginRight: 6, borderRadius: 2 }} 
                                                    />
                                                ) : (
                                                    <Earth size={14} color={isActive ? '#FFF' : AppColors.textMuted} style={{ marginRight: 6 }} />
                                                )}
                                                <Text style={[styles.categoryText, isActive && styles.categoryTextActive]}>
                                                    {cat}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}

                                    <TouchableOpacity
                                        style={[styles.categoryPill, styles.categoryPillSpecial]}
                                        onPress={() => setIsCategoriesExpanded(false)}
                                        activeOpacity={0.8}
                                    >
                                        <ChevronUp size={16} color="#6B7280" style={{ marginRight: 4 }} />
                                        <Text style={[styles.categoryText, styles.categoryTextSpecial]}>Less</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={styles.categoryScroll}
                                >
                                    {categories.slice(0, MAX_VISIBLE_CATS).map((cat) => {
                                        const isActive = activeCategory === cat;
                                        const countryInfo = globeCountries.find(
                                            (c) => c.name.toLowerCase() === cat.toLowerCase()
                                        );

                                        return (
                                            <TouchableOpacity
                                                key={cat}
                                                style={[
                                                    styles.categoryPill,
                                                    isActive && styles.categoryPillActive,
                                                ]}
                                                onPress={() => setActiveCategory(cat)}
                                                activeOpacity={0.8}
                                            >
                                                {cat === 'All' ? (
                                                    <Compass size={14} color={isActive ? '#FFF' : AppColors.textMuted} style={{ marginRight: 6 }} />
                                                ) : countryInfo?.isoCode ? (
                                                    <CountryFlag 
                                                        isoCode={countryInfo.isoCode} 
                                                        size={12} 
                                                        style={{ marginRight: 6, borderRadius: 2 }} 
                                                    />
                                                ) : (
                                                    <Earth size={14} color={isActive ? '#FFF' : AppColors.textMuted} style={{ marginRight: 6 }} />
                                                )}
                                                <Text style={[styles.categoryText, isActive && styles.categoryTextActive]}>
                                                    {cat}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                    
                                    {categories.length > MAX_VISIBLE_CATS && (
                                        <TouchableOpacity
                                            style={[styles.categoryPill, styles.categoryPillSpecial]}
                                            onPress={() => setIsCategoriesExpanded(true)}
                                            activeOpacity={0.8}
                                        >
                                            <Text style={[styles.categoryText, styles.categoryTextSpecial]}>
                                                +{categories.length - MAX_VISIBLE_CATS} More
                                            </Text>
                                            <ChevronDown size={14} color="#6B7280" style={{ marginLeft: 4 }} />
                                        </TouchableOpacity>
                                    )}
                                </ScrollView>
                            )}
                        </View>
                    )}
                </View>
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
                key={`recipes-${viewMode}-${currentPage}-${activeCategory}-${search}`}
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
        paddingTop: Platform.OS === 'ios' ? 68 : 48,
        paddingHorizontal: 24,
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
    stickyControls: {
        backgroundColor: '#FAFAFA',
        paddingVertical: 12,
        zIndex: 10,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 12,
        gap: 12,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: AppColors.white,
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: Platform.OS === 'ios' ? 14 : 10,
        shadowColor: AppColors.textLight,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 3,
        borderWidth: 1,
        borderColor: AppColors.backgroundLight,
        gap: 10,
    },
    toggleBtn: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: AppColors.white,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: AppColors.textLight,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 3,
        borderWidth: 1,
        borderColor: AppColors.backgroundLight,
    },
    searchInput: {
        fontFamily: AppFonts.regular,
        flex: 1,
        fontSize: 15,
        color: AppColors.navy,
    },
    clearBtn: {
        backgroundColor: AppColors.borderLight,
        borderRadius: 12,
        padding: 4,
    },
    categoryContainer: {
    },
    categoryWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 20,
        gap: 10,
    },
    categoryScroll: {
        paddingHorizontal: 20,
        paddingRight: 40,
        gap: 8,
    },
    categoryPill: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: AppColors.backgroundLight,
        borderWidth: 1.5,
        borderColor: 'transparent',
    },
    categoryPillSpecial: {
        backgroundColor: AppColors.white,
        borderColor: AppColors.borderSubtle,
        borderStyle: 'dashed',
    },
    categoryPillActive: {
        backgroundColor: AppColors.primary,
        borderColor: AppColors.primary,
    },
    categoryText: {
        fontFamily: AppFonts.semiBold,
        fontSize: 13,
        color: AppColors.textDark,
    },
    categoryTextSpecial: {
        fontFamily: AppFonts.medium,
        color: AppColors.textMuted,
    },
    categoryTextActive: {
        color: AppColors.white,
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