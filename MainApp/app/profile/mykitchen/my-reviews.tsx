import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ChevronLeft, MessageSquareText } from 'lucide-react-native';

const MyReviews = () => {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: 'My Reviews', headerBackTitle: 'Back' }} />
             <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <ChevronLeft size={28} color="#fff" />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <View style={styles.iconWrapper}>
                    <MessageSquareText size={48} color="#E63946" />
                </View>
                
                <Text style={styles.title}>No Reviews Yet</Text>
                <Text style={styles.subtitle}>
                    You haven't reviewed any recipes yet. Try cooking something delicious and share your thoughts with the community!
                </Text>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => router.replace('/')}
                    activeOpacity={0.8}
                >
                    <Text style={styles.buttonText}>Explore Recipes</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default MyReviews;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    iconWrapper: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: 'rgba(230, 57, 70, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1D3557',
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 32,
        paddingHorizontal: 20,
    },
    button: {
        backgroundColor: '#E63946',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
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
});