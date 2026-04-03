import React, { useState, useEffect, useRef, FC } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Animated,
    Dimensions,
} from 'react-native';
import { X, Send } from 'lucide-react-native';
import { Comment } from '@/types/community';
import { useCommunity } from '@/hooks/useCommunity';
import { useToast } from '@/components/ui/ToastProvider';
import { Unsubscribe } from 'firebase/firestore';
import { formatTimestamp } from '@/utils/formatTime';
import { AppColors } from '@/constants/colors';
import { AppFonts } from '@/constants/theme';
import { Image } from 'react-native';
import ConfirmCommentDeleteModal from './ConfirmCommentDeleteModal';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Props {
    visible: boolean;
    reviewId: string;
    onClose: () => void;
}

const CommentModal: FC<Props> = ({ visible, reviewId, onClose }) => {
    const { addComment, deleteComment, subscribeToComments, isLoggedIn, currentUserId, profile } = useCommunity();
    const toast = useToast();
    const [comments, setComments] = useState<Comment[]>([]);
    const [text, setText] = useState('');
    const [sending, setSending] = useState(false);
    const [loadingComments, setLoadingComments] = useState(true);

    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState<Comment | null>(null);
    const [deleting, setDeleting] = useState(false);

    const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
    const backdropOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(backdropOpacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.spring(slideAnim, {
                    toValue: 0,
                    useNativeDriver: true,
                    bounciness: 0,
                    speed: 12,
                })
            ]).start();
        } else {
            backdropOpacity.setValue(0);
            slideAnim.setValue(SCREEN_HEIGHT);
        }
    }, [visible]);

    useEffect(() => {
        if (!visible || !reviewId) return;

        setLoadingComments(true);
        const unsubscribe: Unsubscribe = subscribeToComments(reviewId, (data) => {
            setComments(data);
            setLoadingComments(false);
        });

        return () => unsubscribe();
    }, [visible, reviewId, subscribeToComments]);

    const handleSend = async () => {
        if (!text.trim() || sending) return;

        setSending(true);
        try {
            await addComment(reviewId, text.trim());
            setText('');
        } catch (err) {
            console.error('Comment error:', err);
        } finally {
            setSending(false);
        }
    };

    const handleLongPress = (comment: Comment) => {
        if (!isLoggedIn || comment.userId !== currentUserId) return;
        setCommentToDelete(comment);
        setIsDeleteModalVisible(true);
    };

    const handleConfirmDelete = async () => {
        if (!commentToDelete) return;
        setDeleting(true);
        try {
            await deleteComment(reviewId, commentToDelete.id);
            toast.success('Comment deleted', 'Your comment has been removed.');
            setIsDeleteModalVisible(false);
        } catch (err) {
            toast.error('Error', 'Failed to delete comment.');
        } finally {
            setDeleting(false);
            setCommentToDelete(null);
        }
    };

    const renderComment = ({ item }: { item: Comment }) => {
        const isOwnComment = item.userId === currentUserId;
        const displayAvatar = isOwnComment ? (profile?.photoBase64 || item.userAvatar) : item.userAvatar;
        const avatarLetter = (item.userName || '?').charAt(0).toUpperCase();

        return (
            <TouchableOpacity 
                style={styles.commentItem}
                onLongPress={() => handleLongPress(item)}
                delayLongPress={500}
                activeOpacity={0.7}
            >
                <View style={styles.commentAvatar}>
                    {displayAvatar ? (
                        <Image source={{ uri: displayAvatar }} style={styles.avatarImg} />
                    ) : (
                        <View style={[styles.avatarImg, { backgroundColor: AppColors.navy, alignItems: 'center', justifyContent: 'center' }]}>
                            <Text style={styles.commentAvatarText}>{avatarLetter}</Text>
                        </View>
                    )}
                </View>
                <View style={styles.commentContent}>
                    <View style={styles.commentHeader}>
                        <Text style={styles.commentUserName}>{item.userName}</Text>
                        <Text style={styles.commentTime}>{formatTimestamp(item.createdAt)}</Text>
                    </View>
                    <Text style={styles.commentText}>{item.text}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    if (!visible) return null;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                style={styles.root}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <Animated.View style={[styles.overlay, { opacity: backdropOpacity }]}>
                    <TouchableOpacity
                        style={StyleSheet.absoluteFill}
                        activeOpacity={1}
                        onPress={onClose}
                    />
                </Animated.View>

                <Animated.View 
                    style={[
                        styles.modal,
                        { transform: [{ translateY: slideAnim }] }
                    ]}
                >
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Comments</Text>
                        <TouchableOpacity onPress={onClose}>
                            <X size={24} color="#999" />
                        </TouchableOpacity>
                    </View>

                    {loadingComments ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color={AppColors.primary} />
                        </View>
                    ) : comments.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No comments yet</Text>
                            <Text style={styles.emptySubtext}>Be the first to comment!</Text>
                        </View>
                    ) : (
                        <FlatList
                            data={comments}
                            keyExtractor={(item) => item.id}
                            renderItem={renderComment}
                            contentContainerStyle={styles.commentsList}
                            showsVerticalScrollIndicator={false}
                        />
                    )}

                    {isLoggedIn && (
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Write a comment..."
                                placeholderTextColor="#aaa"
                                value={text}
                                onChangeText={setText}
                                multiline
                                maxLength={300}
                                editable={!sending}
                            />
                            <TouchableOpacity
                                style={[
                                    styles.sendButton,
                                    !text.trim() && styles.sendButtonDisabled,
                                ]}
                                onPress={handleSend}
                                disabled={!text.trim() || sending}
                            >
                                {sending ? (
                                    <ActivityIndicator size="small" color="#fff" />
                                ) : (
                                    <Send size={18} color="#fff" />
                                )}
                            </TouchableOpacity>
                        </View>
                    )}
                </Animated.View>

                <ConfirmCommentDeleteModal
                    visible={isDeleteModalVisible}
                    onClose={() => {
                        setIsDeleteModalVisible(false);
                        setCommentToDelete(null);
                    }}
                    onConfirm={handleConfirmDelete}
                    loading={deleting}
                />
            </KeyboardAvoidingView>
        </Modal>
    );
};

export default CommentModal;

const styles = StyleSheet.create({
    root: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modal: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: Platform.OS === 'ios' ? 40 : 24,
        maxHeight: '75%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        paddingHorizontal: 4,
    },
    headerTitle: {
        fontFamily: AppFonts.bold,
        fontSize: 20,
        color: AppColors.navy,
    },
    loadingContainer: {
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontFamily: AppFonts.semiBold,
        fontSize: 16,
        color: '#999',
    },
    emptySubtext: {
        fontFamily: AppFonts.regular,
        fontSize: 14,
        color: '#bbb',
        marginTop: 4,
    },
    commentsList: {
        paddingBottom: 12,
    },
    commentItem: {
        flexDirection: 'row',
        paddingVertical: 10,
        gap: 12,
    },
    commentAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: AppColors.navy,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    avatarImg: {
        width: '100%',
        height: '100%',
    },
    commentAvatarText: {
        fontFamily: AppFonts.bold,
        color: '#fff',
        fontSize: 14,
    },
    commentContent: {
        flex: 1,
    },
    commentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    commentUserName: {
        fontFamily: AppFonts.bold,
        fontSize: 14,
        color: AppColors.navy,
    },
    commentTime: {
        fontFamily: AppFonts.regular,
        fontSize: 12,
        color: '#aaa',
    },
    commentText: {
        fontFamily: AppFonts.regular,
        fontSize: 14,
        color: '#444',
        lineHeight: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 10,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    input: {
        fontFamily: AppFonts.regular,
        flex: 1,
        backgroundColor: AppColors.backgroundLight,
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 14,
        color: '#333',
        maxHeight: 80,
        borderWidth: 1,
        borderColor: '#E8E8E8',
    },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: AppColors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sendButtonDisabled: {
        backgroundColor: '#ccc',
    },
});
