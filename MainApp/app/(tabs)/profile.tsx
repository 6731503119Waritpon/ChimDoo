import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    ActivityIndicator,
    ScrollView,
    Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import {
    UserPen,
    ChevronRight,
    LogOut,
} from 'lucide-react-native';
import { ProfileMenuItem } from '@/types/menuProfile';
import { profileMenuConfig } from '@/config/menuProfile';
import { useToast } from '@/components/ToastProvider';
import LogoutModal from '@/components/LogoutModal';

const Page = () => {
    const router = useRouter();
    const { user, loading, logOut } = useAuth();
    const toast = useToast();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    const handleLogout = async () => {
        setLoggingOut(true);
        try {
            await logOut();
            setShowLogoutModal(false);
        } catch (err: any) {
            toast.error('Error', err.message || 'Failed to log out');
        } finally {
            setLoggingOut(false);
        }
    };

    const handleMenuPress = (item: ProfileMenuItem) => {
        if (item.href) {
            router.push(item.href as any);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#ff6b35" />
            </View>
        );
    }

    if (!user) {
        return (
            <View style={styles.guestContainer}>
                <View style={styles.guestContent}>
                    <View style={styles.guestIconWrapper}>
                        <UserPen size={48} color="#E63946" />
                    </View>
                    <Text style={styles.guestTitle}>Welcome to ChimDoo</Text>
                    <Text style={styles.guestSubtitle}>
                        Sign in to access your profile, saved recipes, and more
                    </Text>

                    <View style={styles.guestButtons}>
                        <TouchableOpacity
                            style={styles.primaryButton}
                            onPress={() => router.push('/auth/login')}
                        >
                            <Text style={styles.primaryButtonText}>Log In</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.outlineButton}
                            onPress={() => router.push('/auth/signup')}
                        >
                            <Text style={styles.outlineButtonText}>
                                Create Account
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }

    const avatarLetter = (user.displayName || user.email || '?').charAt(0).toUpperCase();

    const renderMenuSection = (title: string, items: ProfileMenuItem[]) => (
        <View style={styles.menuSection} key={title}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <View style={styles.menuCard}>
                {items.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <React.Fragment key={item.label}>
                            <TouchableOpacity
                                style={styles.menuItem}
                                onPress={() => handleMenuPress(item)}
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

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.profileCard}>
                <View style={styles.avatarRing}>
                    {user.photoURL ? (
                        <Image
                            source={{ uri: user.photoURL }}
                            style={styles.avatar}
                        />
                    ) : (
                        <View style={styles.avatarPlaceholder}>
                            <Text style={styles.avatarInitial}>
                                {avatarLetter}
                            </Text>
                        </View>
                    )}
                </View>

                <View style={styles.profileInfo}>
                    <Text style={styles.displayName} numberOfLines={1}>
                        {user.displayName || 'Unnamed User'}
                    </Text>
                    <Text style={styles.email} numberOfLines={1}>
                        {user.email}
                    </Text>

                    <TouchableOpacity
                        style={styles.editBadge}
                        onPress={() => router.push('/profile/account/edit-profile' as any)}
                    >
                        <UserPen size={14} color="#1D3557" />
                        <Text style={styles.editBadgeText}>Edit Profile</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {profileMenuConfig.map((section) =>
                renderMenuSection(section.section, section.items)
            )}

            <TouchableOpacity
                style={styles.logoutButton}
                onPress={() => setShowLogoutModal(true)}
                activeOpacity={0.7}
            >
                <LogOut size={20} color="#ef4444" />
                <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>

            <Text style={styles.versionFooter}>ChimDoo v1.0.0</Text>

            <LogoutModal
                visible={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={handleLogout}
                loading={loggingOut}
            />
        </ScrollView>
    );
};

export default Page;

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        backgroundColor: '#0a0a0a',
        alignItems: 'center',
        justifyContent: 'center',
    },

    guestContainer: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        padding: 24,
    },
    guestContent: {
        alignItems: 'center',
    },
    guestIconWrapper: {
        width: 88,
        height: 88,
        borderRadius: 44,
        backgroundColor: 'rgba(230, 57, 70, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    guestTitle: {
        fontSize: 26,
        fontWeight: '800',
        marginBottom: 10,
    },
    guestSubtitle: {
        fontSize: 15,
        color: '#777',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 36,
        paddingHorizontal: 20,
    },
    guestButtons: {
        width: '100%',
        gap: 14,
    },
    primaryButton: {
        backgroundColor: '#E63946',
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: 'center',
    },
    primaryButtonText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '700',
    },
    outlineButton: {
        borderWidth: 1.5,
        borderColor: '#E63946',
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: 'center',
    },
    outlineButtonText: {
        color: '#E63946',
        fontSize: 17,
        fontWeight: '700',
    },

    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    scrollContent: {
        paddingTop: Platform.OS === 'ios' ? 60 : 48,
        paddingBottom: 160,
    },

    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        paddingVertical: 28,
        marginHorizontal: 20,
        marginBottom: 8,
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 5,
    },
    avatarRing: {
        width: 96,
        height: 96,
        borderRadius: 48,
        borderWidth: 3,
        borderColor: '#1D3557',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3,
        marginRight: 16,
    },
    profileInfo: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    avatar: {
        width: 84,
        height: 84,
        borderRadius: 42,
    },
    avatarPlaceholder: {
        width: 84,
        height: 84,
        borderRadius: 42,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarInitial: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#1D3557',
    },
    displayName: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 4,
    },
    email: {
        fontSize: 14,
        color: '#777',
        marginBottom: 16,
    },
    editBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#dad8d8ff',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    editBadgeText: {
        fontSize: 13,
        fontWeight: '600',
    },

    menuSection: {
        marginTop: 20,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: '#666',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        marginBottom: 10,
        marginLeft: 4,
    },
    menuCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        borderWidth: 0.2,
        borderColor: '#a7a6a6ff',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 5,
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
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.28,
        shadowRadius: 12,
        elevation: 5,
    },
    menuItemLabel: {
        fontSize: 16,
        fontWeight: '500',
    },
    menuDivider: {
        height: 0.5,
        backgroundColor: '#919497ff',
    },

    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        marginTop: 32,
        marginHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: 'rgba(239, 68, 68, 0.08)',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.2)',
    },
    logoutText: {
        color: '#ef4444',
        fontSize: 16,
        fontWeight: '600',
    },

    versionFooter: {
        textAlign: 'center',
        color: '#444',
        fontSize: 12,
        marginTop: 20,
    },
});