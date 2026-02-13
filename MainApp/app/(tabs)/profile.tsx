import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    ActivityIndicator,
    Alert,
    ScrollView,
    Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import {
    UserPen,
    KeyRound,
    HelpCircle,
    Mail,
    Info,
    Smartphone,
    ChevronRight,
    LogOut,
} from 'lucide-react-native';

interface MenuItem {
    icon: React.ReactNode;
    label: string;
    onPress: () => void;
    color?: string;
}

const Page = () => {
    const router = useRouter();
    const { user, loading, logOut } = useAuth();

    const handleLogout = async () => {
        Alert.alert('Log Out', 'Are you sure you want to log out?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Log Out',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await logOut();
                    } catch (err: any) {
                        Alert.alert('Error', err.message || 'Failed to log out');
                    }
                },
            },
        ]);
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#ff6b35" />
            </View>
        );
    }

    // --- Logged-out state ---
    if (!user) {
        return (
            <View style={styles.guestContainer}>
                <View style={styles.guestContent}>
                    <View style={styles.guestIconWrapper}>
                        <UserPen size={48} color="#ff6b35" />
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

    // --- Logged-in state ---
    const avatarLetter = (user.displayName || user.email || '?')
        .charAt(0)
        .toUpperCase();

    const accountItems: MenuItem[] = [
        {
            icon: <UserPen size={20} color="#ff6b35" />,
            label: 'Edit Profile',
            onPress: () => router.push('/profile/edit-profile' as any),
        },
        {
            icon: <KeyRound size={20} color="#ff6b35" />,
            label: 'Change Password',
            onPress: () =>
                Alert.alert('Coming Soon', 'This feature will be available soon!'),
        },
    ];

    const supportItems: MenuItem[] = [
        {
            icon: <HelpCircle size={20} color="#3b82f6" />,
            label: 'FAQ',
            onPress: () => router.push('/profile/faq' as any),
        },
        {
            icon: <Mail size={20} color="#3b82f6" />,
            label: 'Contact Us',
            onPress: () =>
                Alert.alert('Contact', 'Email us at support@chimdoo.com'),
        },
    ];

    const generalItems: MenuItem[] = [
        {
            icon: <Info size={20} color="#8b5cf6" />,
            label: 'About ChimDoo',
            onPress: () =>
                Alert.alert(
                    'About',
                    'ChimDoo — your ultimate cooking companion 🍳\nDiscover, save, and share amazing recipes with a vibrant community.'
                ),
        },
        {
            icon: <Smartphone size={20} color="#8b5cf6" />,
            label: 'App Version',
            onPress: () => Alert.alert('Version', 'ChimDoo v1.0.0'),
        },
    ];

    const renderMenuSection = (
        title: string,
        items: MenuItem[]
    ) => (
        <View style={styles.menuSection}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <View style={styles.menuCard}>
                {items.map((item, index) => (
                    <React.Fragment key={item.label}>
                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={item.onPress}
                            activeOpacity={0.6}
                        >
                            <View style={styles.menuItemLeft}>
                                <View style={styles.menuIconWrapper}>
                                    {item.icon}
                                </View>
                                <Text style={styles.menuItemLabel}>
                                    {item.label}
                                </Text>
                            </View>
                            <ChevronRight size={18} color="#444" />
                        </TouchableOpacity>
                        {index < items.length - 1 && (
                            <View style={styles.menuDivider} />
                        )}
                    </React.Fragment>
                ))}
            </View>
        </View>
    );

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
        >
            {/* Profile Header Card */}
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

                <Text style={styles.displayName}>
                    {user.displayName || 'Unnamed User'}
                </Text>
                <Text style={styles.email}>{user.email}</Text>

                <TouchableOpacity
                    style={styles.editBadge}
                    onPress={() => router.push('/profile/edit-profile' as any)}
                >
                    <UserPen size={14} color="#eeb099ff" />
                    <Text style={styles.editBadgeText}>Edit</Text>
                </TouchableOpacity>
            </View>

            {/* Menu Sections */}
            {renderMenuSection('Account', accountItems)}
            {renderMenuSection('Support', supportItems)}
            {renderMenuSection('General', generalItems)}

            {/* Logout */}
            <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
                activeOpacity={0.7}
            >
                <LogOut size={20} color="#ef4444" />
                <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>

            <Text style={styles.versionFooter}>ChimDoo v1.0.0</Text>
        </ScrollView>
    );
};

export default Page;

const styles = StyleSheet.create({
    // Loading
    loadingContainer: {
        flex: 1,
        backgroundColor: '#0a0a0a',
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Guest (not logged in)
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
        backgroundColor: 'rgba(255, 107, 53, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    guestTitle: {
        fontSize: 26,
        fontWeight: '800',
        // color: '#fff',
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
        backgroundColor: '#ff6b35',
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
        borderColor: '#ff6b35',
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: 'center',
    },
    outlineButtonText: {
        color: '#ff6b35',
        fontSize: 17,
        fontWeight: '700',
    },

    // Logged-in Container
    container: {
        flex: 1,
        backgroundColor: '#0a0a0a',
    },
    scrollContent: {
        paddingTop: Platform.OS === 'ios' ? 60 : 48,
        paddingBottom: 160,
    },

    // Profile Card
    profileCard: {
        alignItems: 'center',
        paddingVertical: 28,
        marginHorizontal: 20,
        marginBottom: 8,
        backgroundColor: '#111',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#1e1e1e',
    },
    avatarRing: {
        width: 96,
        height: 96,
        borderRadius: 48,
        borderWidth: 3,
        borderColor: '#eeb099ff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3,
        marginBottom: 16,
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
        backgroundColor: '#1a1a1a',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarInitial: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#eeb099ff',
    },
    displayName: {
        fontSize: 22,
        fontWeight: '700',
        color: '#fff',
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
        backgroundColor: 'rgba(255, 107, 53, 0.12)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    editBadgeText: {
        color: '#eeb099ff',
        fontSize: 13,
        fontWeight: '600',
    },

    // Menu
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
        backgroundColor: '#111',
        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#1e1e1e',
        overflow: 'hidden',
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
        backgroundColor: '#1a1a1a',
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuItemLabel: {
        fontSize: 16,
        color: '#ddd',
        fontWeight: '500',
    },
    menuDivider: {
        height: 1,
        backgroundColor: '#1e1e1e',
        marginLeft: 66,
    },

    // Logout
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

    // Footer
    versionFooter: {
        textAlign: 'center',
        color: '#444',
        fontSize: 12,
        marginTop: 20,
    },
});