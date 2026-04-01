import React, { useState, useEffect } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    ActivityIndicator, Image, Platform,
    Alert, ActionSheetIOS,
} from 'react-native';
import KeyboardAwareView from '@/components/KeyboardAwareView';
import { useRouter } from 'expo-router';
import { ChevronLeft, Camera, User } from 'lucide-react-native';
import { updateProfile } from 'firebase/auth';
import { doc, setDoc, getDoc, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../../hooks/useAuth';
import { useToast } from '@/components/ToastProvider';
import { AppColors } from '@/constants/colors';
import { AppFonts } from '@/constants/theme';
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
        <KeyboardAwareView
            style={styles.container}
            contentContainerStyle={styles.scrollContent}
        >
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <ChevronLeft size={26} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Profile</Text>
                <View style={{ width: 44 }} />
            </View>

            <View style={styles.avatarSection}>
                <TouchableOpacity
                    style={styles.avatarWrapper}
                    onPress={showImageOptions}
                    activeOpacity={0.9}
                >
                    <View style={styles.avatarContainer}>
                        {photoPreview ? (
                            <Image
                                source={{ uri: photoPreview }}
                                style={styles.avatar}
                            />
                        ) : (
                            <View style={styles.avatarPlaceholder}>
                                <User size={40} color="#DDD" />
                            </View>
                        )}
                    </View>
                    <View style={styles.cameraSeal}>
                        <Camera size={14} color="#fff" />
                    </View>
                </TouchableOpacity>
                <Text style={styles.changePhotoText}>Tap to update photo</Text>
            </View>

            <View style={styles.form}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Display Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your name"
                        placeholderTextColor="#ccc"
                        value={displayName}
                        onChangeText={setDisplayName}
                        autoCapitalize="words"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Email Address</Text>
                    <View style={styles.readOnlyInput}>
                        <Text style={styles.readOnlyText}>
                            {user?.email || 'No email'}
                        </Text>
                    </View>
                    <Text style={styles.helperText}>
                        Registered email cannot be changed
                    </Text>
                </View>
            </View>

            <TouchableOpacity
                style={[styles.saveButton, saving && styles.saveButtonDisabled]}
                onPress={handleSave}
                disabled={saving}
                activeOpacity={0.8}
            >
                {saving ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                )}
            </TouchableOpacity>
        </KeyboardAwareView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
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
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 22,
        backgroundColor: AppColors.navy,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontFamily: AppFonts.bold,
        fontSize: 22,
        color: AppColors.navy,
    },
    avatarSection: {
        alignItems: 'center',
        paddingVertical: 40,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        marginBottom: 24,
    },
    avatarWrapper: {
        width: 100,
        height: 100,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#FFFFFF',
        borderWidth: 1.5,
        borderColor: '#F1F5F9',
        padding: 4,
        overflow: 'hidden',
    },
    avatar: {
        width: '100%',
        height: '100%',
        borderRadius: 47,
    },
    avatarPlaceholder: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cameraSeal: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: AppColors.navy,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2.5,
        borderColor: '#FFFFFF',
    },
    changePhotoText: {
        fontFamily: AppFonts.medium,
        marginTop: 16,
        fontSize: 13,
        color: '#64748B',
        letterSpacing: 0.5,
    },
    form: {
        paddingHorizontal: 24,
        gap: 32,
    },
    inputGroup: {
        gap: 10,
    },
    label: {
        fontFamily: AppFonts.bold,
        fontSize: 10.5,
        color: '#64748B',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginLeft: 4,
    },
    input: {
        fontFamily: AppFonts.bold,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 16,
        padding: 18,
        fontSize: 16,
        borderWidth: 1.5,
        borderColor: '#F1F5F9',
        color: AppColors.navy,
    },
    readOnlyInput: {
        backgroundColor: '#F8FAFC',
        borderRadius: 16,
        padding: 18,
        borderWidth: 1.5,
        borderColor: '#F1F5F9',
    },
    readOnlyText: {
        fontFamily: AppFonts.bold,
        fontSize: 16,
        color: '#94A3B8',
    },
    helperText: {
        fontFamily: AppFonts.medium,
        fontSize: 12,
        color: '#94A3B8',
        marginTop: 4,
        marginLeft: 4,
    },
    saveButton: {
        marginHorizontal: 24,
        marginTop: 48,
        backgroundColor: AppColors.navy,
        borderRadius: 20,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveButtonDisabled: {
        opacity: 0.6,
    },
    saveButtonText: {
        fontFamily: AppFonts.bold,
        color: '#fff',
        fontSize: 17,
        letterSpacing: 0.5,
    },
});
