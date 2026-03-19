import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { X, Send } from 'lucide-react-native';
import { Comment } from '@/types/community';
import { useCommunity } from '@/hooks/useCommunity';
import { useAuth } from '@/hooks/useAuth';
import { Unsubscribe } from 'firebase/firestore';
import { formatTimestamp } from '@/utils/formatTime';
import { AppColors } from '@/constants/colors';

interface Props {
    visible: boolean;
    reviewId: string;
    onClose: () => void;
}



const CommentModal: React.FC<Props> = ({ visible, reviewId, onClose }) => {
    const { addComment, subscribeToComments, isLoggedIn } = useCommunity();
    const [comments, setComments] = useState<Comment[]>([]);
    const [text, setText] = useState('');
    const [sending, setSending] = useState(false);
    const [loadingComments, setLoadingComments] = useState(true);

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

    const renderComment = ({ item }: { item: Comment }) => (
        <View style={styles.commentItem}>
            <View style={styles.commentAvatar}>
                <Text style={styles.commentAvatarText}>
                    {(item.userName || '?').charAt(0).toUpperCase()}
                </Text>
            </View>
            <View style={styles.commentContent}>
                <View style={styles.commentHeader}>
                    <Text style={styles.commentUserName}>{item.userName}</Text>
                    <Text style={styles.commentTime}>{formatTimestamp(item.createdAt)}</Text>
                </View>
                <Text style={styles.commentText}>{item.text}</Text>
            </View>
        </View>
    );

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                style={styles.overlay}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <View style={styles.modal}>
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
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

export default CommentModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modal: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: Platform.OS === 'ios' ? 40 : 20,
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
        fontSize: 20,
        fontWeight: '800',
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
        fontSize: 16,
        fontWeight: '600',
        color: '#999',
    },
    emptySubtext: {
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
    },
    commentAvatarText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '700',
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
        fontSize: 14,
        fontWeight: '700',
        color: AppColors.navy,
    },
    commentTime: {
        fontSize: 12,
        color: '#aaa',
    },
    commentText: {
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
