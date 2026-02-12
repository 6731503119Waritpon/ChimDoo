import { StyleSheet, Text, View, TouchableOpacity, Image, ActivityIndicator, Alert } from "react-native"
import React from "react"
import { useRouter } from "expo-router"
import { useAuth } from "../../hooks/useAuth"

const Page = () => {
    const router = useRouter();
    const { user, loading, logOut } = useAuth();

    const handleLogout = async () => {
        try {
            await logOut();
        } catch (err: any) {
            Alert.alert('Error', err.message || 'Failed to log out');
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#ff6b35" />
            </View>
        );
    }

    if (user) {
        return (
            <View style={styles.profileSection}>
                <View style={styles.userRow}>
                    {user.photoURL ? (
                        <Image source={{ uri: user.photoURL }} style={styles.avatar} />
                    ) : (
                        <View style={styles.avatarPlaceholder}>
                            <Text style={styles.avatarInitial}>
                                {(user.displayName || user.email || '?').charAt(0).toUpperCase()}
                            </Text>
                        </View>
                    )}
                    
                    <View style={styles.profileInfo}>
                        <Text style={styles.displayName}>
                            {user.displayName || 'No Name'}
                        </Text>
                        <Text style={styles.email}>
                            {user.email}
                        </Text>
                    </View>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <Text style={styles.logoutButtonText}>Log Out</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Profile</Text>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => router.push('/auth/login')}
                >
                    <Text style={styles.buttonText}>Log In</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.outlineButton]}
                    onPress={() => router.push('/auth/signup')}
                >
                    <Text style={[styles.buttonText, styles.outlineButtonText]}>Create Account</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Page

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        paddingHorizontal: 20, 
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 32,
    },
    profileSection: {
        flex: 1,
        paddingTop: 50,
        paddingHorizontal: 20,
    },

    userRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 40,
    },
    profileInfo: {
        marginLeft: 20,
        justifyContent: 'center',
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    avatarPlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#e0e0e0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarInitial: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#555',
    },
    displayName: {
        fontSize: 20,
        fontWeight: '500',
        color: '#000',
        marginBottom: 4,
    },
    email: {
        fontSize: 16,
        color: '#000',
    },
    buttonContainer: {
        width: '100%',
        gap: 16,
    },
    button: {
        backgroundColor: '#ff6b35',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        width: '100%',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    outlineButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#ff6b35',
    },
    outlineButtonText: {
        color: '#ff6b35',
    },
    logoutButton: {
        backgroundColor: '#333',
        borderRadius: 12,
        marginTop: 'auto',
        marginBottom: 50,
        padding: 16,
        alignItems: 'center',
        width: '100%',
    },
    logoutButtonText: {
        color: '#ff4444',
        fontSize: 16,
        fontWeight: '600',
    },
})