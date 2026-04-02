import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Search, X, ArrowDownUp, List, LayoutGrid, Compass, Earth, ChevronDown, ChevronUp, LucideIcon } from 'lucide-react-native';
import CountryFlag from 'react-native-country-flag';
import { AppColors } from '@/constants/colors';
import { AppFonts } from '@/constants/theme';
import { globeCountries } from '@/config/home';

const MAX_VISIBLE_CATS = 6;

interface RecipeFilterBarProps {
    search: string;
    setSearch: (text: string) => void;
    sortMode: string;
    handleSortPress: () => void;
    viewMode: 'grid' | 'list';
    changeViewMode: (mode: 'grid' | 'list') => void;
    categories: string[];
    activeCategory: string;
    setActiveCategory: (cat: string) => void;
    isCategoriesExpanded: boolean;
    setIsCategoriesExpanded: (expanded: boolean) => void;
}

const CategoryPill = ({
    cat,
    isActive,
    onPress,
    isSpecial = false,
    specialLabel = '',
    specialIcon: Icon
}: {
    cat: string;
    isActive: boolean;
    onPress: () => void;
    isSpecial?: boolean;
    specialLabel?: string;
    specialIcon?: LucideIcon;
}) => {
    const countryInfo = globeCountries.find(
        (c) => c.name.toLowerCase() === cat.toLowerCase()
    );

    return (
        <TouchableOpacity
            style={[
                styles.categoryPill,
                isActive && styles.categoryPillActive,
                isSpecial && styles.categoryPillSpecial
            ]}
            onPress={onPress}
            activeOpacity={0.8}
        >
            {isSpecial ? (
                <>
                    {Icon && <Icon size={16} color="#6B7280" style={{ marginRight: 4 }} />}
                    <Text style={[styles.categoryText, styles.categoryTextSpecial]}>{specialLabel}</Text>
                </>
            ) : (
                <>
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
                </>
            )}
        </TouchableOpacity>
    );
};

export const RecipeFilterBar: React.FC<RecipeFilterBarProps> = ({
    search,
    setSearch,
    sortMode,
    handleSortPress,
    viewMode,
    changeViewMode,
    categories,
    activeCategory,
    setActiveCategory,
    isCategoriesExpanded,
    setIsCategoriesExpanded,
}) => {
    return (
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
                            {categories.map((cat) => (
                                <CategoryPill
                                    key={cat}
                                    cat={cat}
                                    isActive={activeCategory === cat}
                                    onPress={() => {
                                        setActiveCategory(cat);
                                        setIsCategoriesExpanded(false);
                                    }}
                                />
                            ))}
                            <CategoryPill
                                cat="less"
                                isActive={false}
                                onPress={() => setIsCategoriesExpanded(false)}
                                isSpecial
                                specialLabel="Less"
                                specialIcon={ChevronUp}
                            />
                        </View>
                    ) : (
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.categoryScroll}
                        >
                            {categories.slice(0, MAX_VISIBLE_CATS).map((cat) => (
                                <CategoryPill
                                    key={cat}
                                    cat={cat}
                                    isActive={activeCategory === cat}
                                    onPress={() => setActiveCategory(cat)}
                                />
                            ))}

                            {categories.length > MAX_VISIBLE_CATS && (
                                <CategoryPill
                                    cat="more"
                                    isActive={false}
                                    onPress={() => setIsCategoriesExpanded(true)}
                                    isSpecial
                                    specialLabel={`+${categories.length - MAX_VISIBLE_CATS} More`}
                                    specialIcon={ChevronDown}
                                />
                            )}
                        </ScrollView>
                    )}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    stickyControls: {
        backgroundColor: AppColors.white,
        paddingHorizontal: 20,
        paddingBottom: 1.5,
        borderBottomWidth: 1,
        borderBottomColor: AppColors.divider,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginVertical: 12,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 44,
    },
    searchInput: {
        flex: 1,
        fontFamily: AppFonts.regular,
        fontSize: 15,
        color: AppColors.navy,
        marginLeft: 8,
        height: '100%',
    },
    clearBtn: {
        backgroundColor: '#9CA3AF',
        borderRadius: 10,
        width: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    toggleBtn: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    categoryContainer: {
        marginTop: 4,
    },
    categoryScroll: {
        paddingBottom: 12,
        gap: 8,
    },
    categoryWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        paddingBottom: 4,
    },
    categoryPill: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 10,
        backgroundColor: '#F3F4F6',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    categoryPillActive: {
        backgroundColor: AppColors.primary,
        borderColor: AppColors.primary,
    },
    categoryPillSpecial: {
        backgroundColor: AppColors.white,
        borderStyle: 'dashed',
    },
    categoryText: {
        fontFamily: AppFonts.semiBold,
        fontSize: 13,
        color: AppColors.textMuted,
    },
    categoryTextActive: {
        color: AppColors.white,
    },
    categoryTextSpecial: {
        color: '#6B7280',
    },
});
