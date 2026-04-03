import React, { FC } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { AppColors } from '@/constants/colors';
import { AppFonts } from '@/constants/theme';

interface PaginationProps {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
}

const Pagination: FC<PaginationProps> = ({
    currentPage,
    totalItems,
    itemsPerPage,
    onPageChange,
}) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (totalItems === 0 || totalPages <= 1) return null;

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    const handlePrevious = () => {
        if (currentPage > 1) onPageChange(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) onPageChange(currentPage + 1);
    };

    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                pages.push(1, 2, 3, 4, '...', totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
            }
        }
        return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
        <View style={styles.container}>
            <View style={styles.controlsContainer}>
                <TouchableOpacity
                    style={[styles.navButton, currentPage === 1 && styles.navButtonDisabled]}
                    onPress={handlePrevious}
                    disabled={currentPage === 1}
                    activeOpacity={0.6}
                >
                    <ChevronLeft size={16} color={currentPage === 1 ? '#ccc' : '#888'} />
                    <Text style={[styles.navText, currentPage === 1 && styles.navTextDisabled]}>Previous</Text>
                </TouchableOpacity>

                <View style={styles.pageNumbersContainer}>
                    {pageNumbers.map((page, index) => {
                        if (page === '...') {
                            return (
                                <View key={`ellipsis-${index}`} style={styles.ellipsisContainer}>
                                    <Text style={styles.ellipsisText}>...</Text>
                                </View>
                            );
                        }

                        const isActive = page === currentPage;
                        return (
                            <TouchableOpacity
                                key={`page-${page}`}
                                onPress={() => onPageChange(page as number)}
                                style={[styles.pageButton, isActive && styles.pageButtonActive]}
                                activeOpacity={0.7}
                            >
                                <Text style={[styles.pageText, isActive && styles.pageTextActive]}>
                                    {page}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <TouchableOpacity
                    style={[styles.navButton, currentPage === totalPages && styles.navButtonDisabled]}
                    onPress={handleNext}
                    disabled={currentPage === totalPages}
                    activeOpacity={0.6}
                >
                    <Text style={[styles.navText, currentPage === totalPages && styles.navTextDisabled]}>Next</Text>
                    <ChevronRight size={16} color={currentPage === totalPages ? '#ccc' : '#888'} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Pagination;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#ffffff',
        borderRadius: 20,
        width: '100%',
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 4,
    },
    controlsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    navButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 6,
        gap: 4,
    },
    navButtonDisabled: {
        opacity: 0.5,
    },
    navText: {
        fontFamily: AppFonts.semiBold,
        fontSize: 14,
        color: '#888',
    },
    navTextDisabled: {
        color: '#ccc',
    },
    pageNumbersContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    pageButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pageButtonActive: {
        backgroundColor: '#2b2a33', 
    },
    pageText: {
        fontFamily: AppFonts.semiBold,
        fontSize: 14,
        color: '#666',
    },
    pageTextActive: {
        color: '#fff',
    },
    ellipsisContainer: {
        width: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    ellipsisText: {
        fontFamily: AppFonts.bold,
        fontSize: 14,
        color: '#888',
        letterSpacing: 1,
    },
});
