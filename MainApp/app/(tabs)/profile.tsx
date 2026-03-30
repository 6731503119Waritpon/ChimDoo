import React, { useState, useCallback } from 'react';
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
import { useFocusEffect } from 'expo-router';
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
import AppVersionModal from '@/components/AppVersionModal';
import GuestState from '@/components/GuestState';
import ProfileMenuSection from '@/components/ProfileMenuSection';
import SkeletonProfile from '@/components/SkeletonProfile';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { Collections } from '@/constants/collections';
import { AppFonts } from '@/constants/theme';

const Page = () => {
    const router = useRouter();
    const { user, loading, logOut } = useAuth();
    const toast = useToast();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);
    const [showVersionModal, setShowVersionModal] = useState(false);
    const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
    const [displayName, setDisplayName] = useState(user?.displayName || '');

    useFocusEffect(
        useCallback(() => {
            if (!user) return;
            user.reload().then(() => {
                setDisplayName(user.displayName || '');
            });

            getDoc(doc(db, Collections.users, user.uid)).then((snap) => {
                const data = snap.data();
                setProfilePhoto(data?.photoBase64 || null);
            });
        }, [user])
    );

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
        if (item.label === 'App Version') {
            setShowVersionModal(true);
            return;
        }
        if (item.href) {
            router.push(item.href as any);
        }
    };

    if (loading) {
        return <SkeletonProfile />;
    }

    if (!user) {
        return (
            <GuestState
                icon={UserPen}
                title="Welcome to ChimDoo"
                subtitle="Sign in to access your profile, saved recipes, and more"
                showAuthButtons={true}
            />
        );
    }

    const avatarLetter = (user.displayName || user.email || '?').charAt(0).toUpperCase();

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.profileCard}>
                <View style={styles.avatarRing}>
                    {(profilePhoto || user.photoURL) ? (
                        <Image
                            source={{ uri: profilePhoto || user.photoURL! }}
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
                        {displayName || 'Unnamed User'}
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
                <ProfileMenuSection
                    key={section.section}
                    title={section.section}
                    items={section.items}
                    onPress={handleMenuPress}
                />
            )}

            <TouchableOpacity
                style={styles.logoutButton}
                onPress={() => setShowLogoutModal(true)}
                activeOpacity={0.7}
            >
                <LogOut size={20} color="#ef4444" />
                <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>

            <LogoutModal
                visible={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={handleLogout}
                loading={loggingOut}
            />
            <AppVersionModal
                visible={showVersionModal}
                onClose={() => setShowVersionModal(false)}
            />
        </ScrollView>
    );
};

export default Page;

const styles = StyleSheet.create({
    centerContent: {
        alignItems: 'center',
        justifyContent: 'center',
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
        borderWidth: 1,
        borderColor: 'rgba(29, 53, 87, 0.08)',
        shadowColor: '#1D3557',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.18,
        shadowRadius: 20,
        elevation: 12,
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
        shadowColor: '#1D3557',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.35,
        shadowRadius: 10,
        elevation: 8,
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
        fontFamily: AppFonts.bold,
        fontSize: 36,
        color: '#1D3557',
    },
    displayName: {
        fontFamily: AppFonts.bold,
        fontSize: 22,
        marginBottom: 4,
    },
    email: {
        fontFamily: AppFonts.regular,
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
        fontFamily: AppFonts.semiBold,
        fontSize: 13,
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
        fontFamily: AppFonts.bold,
        color: '#ef4444',
        fontSize: 16,
    },
});