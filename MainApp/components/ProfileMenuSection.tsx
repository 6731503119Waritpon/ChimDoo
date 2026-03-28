import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { ProfileMenuItem } from '@/types/menuProfile';
import { AppFonts } from '@/constants/theme';

interface ProfileMenuSectionProps {
    title: string;
    items: ProfileMenuItem[];
    onPress: (item: ProfileMenuItem) => void;
}

const ProfileMenuSection: React.FC<ProfileMenuSectionProps> = ({ title, items, onPress }) => {
    return (
        <View style={styles.menuSection}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <View style={styles.menuCard}>
                {items.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <React.Fragment key={item.label}>
                            <TouchableOpacity
                                style={styles.menuItem}
                                onPress={() => onPress(item)}
                                activeOpacity={0.6}
                            >
                                <View style={styles.menuItemLeft}>
                                    <View style={styles.menuIconWrapper}>
                                        <Icon size={20} color={item.iconColor} />
                                    </View>
                                    <Text style={styles.menuItemLabel}>{item.label}</Text>
                                </View>
                                <ChevronRight size={18} color="#444" />
                            </TouchableOpacity>
                            {index < items.length - 1 && <View style={styles.menuDivider} />}
                        </React.Fragment>
                    );
                })}
            </View>
        </View>
    );
};

export default ProfileMenuSection;

const styles = StyleSheet.create({
    menuSection: {
        marginTop: 20,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontFamily: AppFonts.semiBold,
        fontSize: 13,
        color: '#666',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        marginBottom: 10,
        marginLeft: 4,
    },
    menuCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        borderWidth: 1,
        borderColor: 'rgba(29, 53, 87, 0.07)',
        overflow: 'hidden',
        shadowColor: '#1D3557',
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.12,
        shadowRadius: 16,
        elevation: 8,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 15,
        paddingHorizontal: 16,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    menuIconWrapper: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#F8F9FA',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.12,
        shadowRadius: 6,
        elevation: 4,
    },
    menuItemLabel: {
        fontFamily: AppFonts.medium,
        fontSize: 16,
    },
    menuDivider: {
        height: 0.5,
        backgroundColor: '#919497ff',
    },
});
