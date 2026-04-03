import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    ScrollView,
    Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import {
    UserPen,
    LogOut,
} from 'lucide-react-native';
import { ProfileMenuItem } from '@/types/menuProfile';
import { profileMenuConfig } from '@/config/menuProfile';
import { useToast } from '@/components/ui/ToastProvider';
import LogoutModal from '@/components/modals/LogoutModal';
import AppVersionModal from '@/components/modals/AppVersionModal';
import GuestState from '@/components/ui/GuestState';
import ProfileMenuSection from '@/components/cards/ProfileMenuSection';
import SkeletonProfile from '@/components/ui/SkeletonProfile';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Collections } from '@/constants/collections';
import { AppFonts, AppLayout } from '@/constants/theme';
import { AppColors } from '@/constants/colors';
import { AppStrings } from '@/constants/strings';
import { getErrorMessage } from '@/types/firebase';
import ChefStatsBar from '@/components/ui/ChefStatsBar';
import { useChimDoo } from '@/hooks/useChimDoo';
import { useCommunity } from '@/hooks/useCommunity';
import { Heart, MessageCircleMore, Users, Clock } from 'lucide-react-native';
import DashboardGridCard from '@/modules/profile/components/DashboardGridCard';

const Page = () => {
    const router = useRouter();
    const { user, loading, logOut } = useAuth();
    const toast = useToast();
    const { chimDooList } = useChimDoo();
    const { getUserReviews } = useCommunity();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);
    const [showVersionModal, setShowVersionModal] = useState(false);
    const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
    const [displayName, setDisplayName] = useState(user?.displayName || '');

    const totalDishes = chimDooList.length;
    const totalCountries = new Set(chimDooList.map(item => item.category)).size;
    const totalReviews = getUserReviews().length;

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
        } catch (err: unknown) {
            toast.error('Error', getErrorMessage(err));
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
            router.push(item.href as never);
        }
    };

    if (loading) {
        return <SkeletonProfile />;
    }

    if (!user) {
        return (
            <GuestState
                icon={UserPen}
                title={AppStrings.loginRequired}
                subtitle={AppStrings.loginToReview}
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
                        onPress={() => router.push('/profile/account/edit-profile' as never)}
                    >
                        <UserPen size={14} color="#1D3557" />
                        <Text style={styles.editBadgeText}>Edit Profile</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.statsWrapper}>
                <ChefStatsBar totalDishes={totalDishes} totalCountries={totalCountries} />
            </View>

            <View style={styles.dashboardSection}>
                <Text style={styles.sectionTitle}>My Kitchen</Text>
                <View style={styles.gridContainer}>
                    <DashboardGridCard
                        label="Favorites"
                        value="Review All"
                        icon={Heart}
                        color="#E63946"
                        delay={100}
                        onPress={() => router.push('/profile/mykitchen/favorites')}
                    />
                    <DashboardGridCard
                        label="My Reviews"
                        value={`${totalReviews} Posts`}
                        icon={MessageCircleMore}
                        color="#3b82f6"
                        delay={200}
                        onPress={() => router.push('/profile/mykitchen/my-reviews')}
                    />
                    <DashboardGridCard
                        label="Friends"
                        value="Explore"
                        icon={Users}
                        color="#22c55e"
                        delay={300}
                        onPress={() => router.push('/profile/mykitchen/my-friends')}
                    />
                    <DashboardGridCard
                        label="History"
                        value="Recently Viewed"
                        icon={Clock}
                        color="#8E9AAF" /* Muted Indigo/Slate */
                        delay={400}
                        onPress={() => router.push('/profile/mykitchen/history')}
                    />
                </View>
            </View>

            {profileMenuConfig
                .filter(section => section.section !== 'My Kitchen')
                .map((section) =>
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
        backgroundColor: AppColors.white,
        borderRadius: AppLayout.radius.xl,
        borderWidth: 1,
        borderColor: AppColors.borderSubtle,
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
        borderColor: AppColors.navy,
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
        backgroundColor: 'rgba(29, 53, 87, 0.05)',
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(29, 53, 87, 0.08)',
    },
    editBadgeText: {
        fontFamily: AppFonts.bold,
        fontSize: 12,
        color: AppColors.navy,
        letterSpacing: 0.3,
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
    statsWrapper: {
        marginTop: 10,
    },
    dashboardSection: {
        marginTop: 2,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontFamily: AppFonts.bold,
        fontSize: 18,
        color: AppColors.navy,
        marginBottom: 12,
        marginLeft: 4,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 12,
    },
});