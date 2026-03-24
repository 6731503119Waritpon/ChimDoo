import React, { useState, useEffect } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    ActivityIndicator, Image, KeyboardAvoidingView, Platform,
    ScrollView, Alert, ActionSheetIOS,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Camera } from 'lucide-react-native';
import { updateProfile } from 'firebase/auth';
import { doc, setDoc, getDoc, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../../hooks/useAuth';
import { useToast } from '@/components/ToastProvider';
import { AppColors } from '@/constants/colors';
import { db } from '@/firebaseConfig';
import { Collections } from '@/constants/collections';

export default function EditProfileScreen() {
    const router = useRouter();
    const { user } = useAuth();
    const toast = useToast();

    const [displayName, setDisplayName] = useState(user?.displayName || '');
    const [photoPreview, setPhotoPreview] = useState<string | null>(user?.photoURL || null);
    const [newPhotoBase64, setNewPhotoBase64] = useState<string | null>(null);
    const [photoRemoved, setPhotoRemoved] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!user) return;
        getDoc(doc(db, Collections.users, user.uid)).then((snap) => {
            const data = snap.data();
            if (data?.photoBase64) setPhotoPreview(data.photoBase64);
        });
    }, [user]);

    const pickImage = async (useCamera: boolean) => {
        const perm = useCamera
            ? await ImagePicker.requestCameraPermissionsAsync()
            : await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!perm.granted) {
            toast.warning('Permission Denied', `Please allow ${useCamera ? 'camera' : 'gallery'} access in Settings.`);
            return;
        }

        const opts: ImagePicker.ImagePickerOptions = {
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.3,
            base64: true,
        };

        const result = useCamera
            ? await ImagePicker.launchCameraAsync(opts)
            : await ImagePicker.launchImageLibraryAsync(opts);

        if (!result.canceled && result.assets[0]) {
            const asset = result.assets[0];
            setPhotoPreview(asset.uri);
            setPhotoRemoved(false);
            if (asset.base64) {
                setNewPhotoBase64(`data:image/jpeg;base64,${asset.base64}`);
            }
        }
    };

    const removePhoto = () => {
        setPhotoPreview(null);
        setNewPhotoBase64(null);
        setPhotoRemoved(true);
    };

    const showImageOptions = () => {
        const hasPhoto = !!photoPreview;
        if (Platform.OS === 'ios') {
            const options = hasPhoto
                ? ['Cancel', 'Take Photo', 'Choose from Gallery', 'Remove Photo']
                : ['Cancel', 'Take Photo', 'Choose from Gallery'];
            ActionSheetIOS.showActionSheetWithOptions(
                {
                    options,
                    cancelButtonIndex: 0,
                    destructiveButtonIndex: hasPhoto ? 3 : undefined,
                },
                (index) => {
                    if (index === 1) pickImage(true);
                    if (index === 2) pickImage(false);
                    if (index === 3 && hasPhoto) removePhoto();
                }
            );
        } else {
            const buttons: any[] = [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Take Photo', onPress: () => pickImage(true) },
                { text: 'Choose from Gallery', onPress: () => pickImage(false) },
            ];
            if (hasPhoto) {
                buttons.push({ text: 'Remove Photo', style: 'destructive', onPress: removePhoto });
            }
            Alert.alert('Change Photo', 'Choose an option', buttons);
        }
    };

    const handleSave = async () => {
        if (!user) return;

        if (!displayName.trim()) {
            toast.warning('Error', 'Display name cannot be empty');
            return;
        }

        setSaving(true);
        try {
            if (newPhotoBase64) {
                await setDoc(
                    doc(db, Collections.users, user.uid),
                    { photoBase64: newPhotoBase64 },
                    { merge: true }
                );
            } else if (photoRemoved) {
                await setDoc(
                    doc(db, Collections.users, user.uid),
                    { photoBase64: null },
                    { merge: true }
                );
            }

            await updateProfile(user, { displayName: displayName.trim() });

            const userSnap = await getDoc(doc(db, Collections.users, user.uid));
            const currentAvatar = userSnap.data()?.photoBase64 || '';

            const reviewsQuery = query(
                collection(db, Collections.reviews),
                where('userId', '==', user.uid)
            );
            const reviewsSnap = await getDocs(reviewsQuery);

            const updatePromises = reviewsSnap.docs.map((d) =>
                updateDoc(d.ref, {
                    userName: displayName.trim(),
                    userAvatar: currentAvatar,
                })
            );
            await Promise.all(updatePromises);

            toast.success('Success', 'Profile updated successfully!');
            setTimeout(() => router.back(), 1000);
        } catch (error: any) {
            toast.error('Error', error.message || 'Failed to update profile');
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

                <View style={styles.avatarSection}>
                    <TouchableOpacity
                        style={styles.avatarWrapper}
                        onPress={showImageOptions}
                        activeOpacity={0.8}
                    >
                        <View style={styles.avatarGradientRing}>
                            {photoPreview ? (
                                <Image
                                    source={{ uri: photoPreview }}
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
                        <View style={styles.cameraButton}>
                            <Camera size={16} color="#fff" />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={showImageOptions}>
                        <Text style={styles.changePhotoText}>Change Photo</Text>
                    </TouchableOpacity>
                </View>

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
        backgroundColor: AppColors.backgroundLight,
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
        borderColor: AppColors.navy,
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
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarInitial: {
        fontSize: 40,
        fontWeight: 'bold',
        color: AppColors.navy,
    },
    cameraButton: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: AppColors.navy,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#0a0a0a',
    },
    changePhotoText: {
        marginTop: 12,
        fontSize: 14,
        color: AppColors.navy,
        fontWeight: '600',
    },
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
        borderRadius: 14,
        padding: 16,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#2a2a2a',
    },
    readOnlyInput: {
        backgroundColor: '#cacacaff',
        borderRadius: 14,
        padding: 16,
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
    saveButton: {
        marginHorizontal: 24,
        marginTop: 40,
        backgroundColor: AppColors.primary,
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
