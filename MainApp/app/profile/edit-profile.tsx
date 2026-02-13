import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Camera } from 'lucide-react-native';
import { updateProfile } from 'firebase/auth';
import { useAuth } from '../../hooks/useAuth';

export default function EditProfileScreen() {
    const router = useRouter();
    const { user } = useAuth();

    const [displayName, setDisplayName] = useState(user?.displayName || '');
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        if (!user) return;

        if (!displayName.trim()) {
            Alert.alert('Error', 'Display name cannot be empty');
            return;
        }

        setSaving(true);
        try {
            await updateProfile(user, { displayName: displayName.trim() });
            Alert.alert('Success', 'Profile updated successfully!', [
                { text: 'OK', onPress: () => router.back() },
            ]);
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const avatarLetter = (user?.displayName || user?.email || '?').charAt(0).toUpperCase();

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <ChevronLeft size={28} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Edit Profile</Text>
                    <View style={{ width: 28 }} />
                </View>

                {/* Avatar Section */}
                <View style={styles.avatarSection}>
                    <View style={styles.avatarWrapper}>
                        <View style={styles.avatarGradientRing}>
                            {user?.photoURL ? (
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
                        <TouchableOpacity
                            style={styles.cameraButton}
                            onPress={() =>
                                Alert.alert(
                                    'Coming Soon',
                                    'Photo upload will be available in a future update!'
                                )
                            }
                        >
                            <Camera size={16} color="#fff" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.changePhotoText}>Change Photo</Text>
                </View>

                {/* Form */}
                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Display Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your name"
                            placeholderTextColor="#555"
                            value={displayName}
                            onChangeText={setDisplayName}
                            autoCapitalize="words"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email</Text>
                        <View style={styles.readOnlyInput}>
                            <Text style={styles.readOnlyText}>
                                {user?.email || 'No email'}
                            </Text>
                        </View>
                        <Text style={styles.helperText}>
                            Email cannot be changed here
                        </Text>
                    </View>
                </View>

                {/* Save Button */}
                <TouchableOpacity
                    style={[styles.saveButton, saving && styles.saveButtonDisabled]}
                    onPress={handleSave}
                    disabled={saving}
                >
                    {saving ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.saveButtonText}>Save Changes</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0a0a',
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: Platform.OS === 'ios' ? 60 : 48,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#1a1a1a',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#fff',
    },

    // Avatar
    avatarSection: {
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 36,
    },
    avatarWrapper: {
        position: 'relative',
    },
    avatarGradientRing: {
        width: 110,
        height: 110,
        borderRadius: 55,
        borderWidth: 3,
        borderColor: '#eeb099ff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3,
    },
    avatar: {
        width: 98,
        height: 98,
        borderRadius: 49,
    },
    avatarPlaceholder: {
        width: 98,
        height: 98,
        borderRadius: 49,
        backgroundColor: '#1a1a1a',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarInitial: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#eeb099ff',
    },
    cameraButton: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: '#eeb099ff',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#0a0a0a',
    },
    changePhotoText: {
        marginTop: 12,
        fontSize: 14,
        color: '#f39584ff',
        fontWeight: '600',
    },

    // Form
    form: {
        paddingHorizontal: 24,
        gap: 24,
    },
    inputGroup: {
        gap: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#aaa',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
    },
    input: {
        backgroundColor: '#1a1a1a',
        borderRadius: 14,
        padding: 16,
        fontSize: 16,
        color: '#fff',
        borderWidth: 1,
        borderColor: '#2a2a2a',
    },
    readOnlyInput: {
        backgroundColor: '#111',
        borderRadius: 14,
        padding: 16,
        borderWidth: 1,
        borderColor: '#1e1e1e',
    },
    readOnlyText: {
        fontSize: 16,
        color: '#555',
    },
    helperText: {
        fontSize: 12,
        color: '#444',
        marginTop: 2,
    },

    // Save
    saveButton: {
        marginHorizontal: 24,
        marginTop: 40,
        backgroundColor: '#ff6b35',
        borderRadius: 14,
        padding: 18,
        alignItems: 'center',
    },
    saveButtonDisabled: {
        opacity: 0.6,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '700',
    },
});
