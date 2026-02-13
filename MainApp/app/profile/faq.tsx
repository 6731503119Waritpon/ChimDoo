import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Platform,
    LayoutAnimation,
    UIManager,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react-native';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface FAQItem {
    id: string;
    question: string;
    answer: string;
}

const FAQ_DATA: FAQItem[] = [
    {
        id: '1',
        question: 'How do I create an account?',
        answer:
            'Tap on the Profile tab, then select "Create Account". You can sign up using your email address or sign in with Google for quick access.',
    },
    {
        id: '2',
        question: 'How do I save a recipe?',
        answer:
            'When viewing a recipe, tap the bookmark icon to save it to your collection. You can find all your saved recipes in the Recipes tab.',
    },
    {
        id: '3',
        question: 'Can I share my own recipes?',
        answer:
            'Yes! Go to the Community tab and tap the "+" button to create a new recipe post. You can add ingredients, steps, photos, and cooking tips for the community to enjoy.',
    },
    {
        id: '4',
        question: 'How do I edit my profile?',
        answer:
            'Navigate to the Profile tab and tap "Edit Profile". From there you can update your display name and profile photo.',
    },
    {
        id: '5',
        question: 'How do I reset my password?',
        answer:
            'On the login screen, tap "Forgot Password?" and enter your email address. We\'ll send you a link to reset your password.',
    },
    {
        id: '6',
        question: 'Is ChimDoo free to use?',
        answer:
            'Yes! ChimDoo is completely free. Browse recipes, save your favorites, and share your culinary creations with the community at no cost.',
    },
];

export default function FAQScreen() {
    const router = useRouter();
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const toggleExpand = (id: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <ChevronLeft size={28} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>FAQ</Text>
                <View style={{ width: 28 }} />
            </View>

            {/* Hero */}
            <View style={styles.heroSection}>
                <View style={styles.heroIconWrapper}>
                    <HelpCircle size={40} color="#3b82f6" />
                </View>
                <Text style={styles.heroTitle}>How can we help?</Text>
                <Text style={styles.heroSubtitle}>
                    Find answers to commonly asked questions below
                </Text>
            </View>

            {/* FAQ List */}
            <ScrollView
                style={styles.listContainer}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            >
                {FAQ_DATA.map((item) => {
                    const isExpanded = expandedId === item.id;
                    return (
                        <TouchableOpacity
                            key={item.id}
                            style={[
                                styles.faqCard,
                                isExpanded && styles.faqCardExpanded,
                            ]}
                            onPress={() => toggleExpand(item.id)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.questionRow}>
                                <Text
                                    style={[
                                        styles.questionText,
                                        isExpanded && styles.questionTextActive,
                                    ]}
                                >
                                    {item.question}
                                </Text>
                                {isExpanded ? (
                                    <ChevronUp size={20} color="#3b82f6" />
                                ) : (
                                    <ChevronDown size={20} color="#555" />
                                )}
                            </View>
                            {isExpanded && (
                                <View style={styles.answerContainer}>
                                    <View style={styles.answerDivider} />
                                    <Text style={styles.answerText}>
                                        {item.answer}
                                    </Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    );
                })}

                {/* Footer */}
                <View style={styles.footerSection}>
                    <Text style={styles.footerText}>
                        Still have questions?
                    </Text>
                    <TouchableOpacity style={styles.contactButton}>
                        <Text style={styles.contactButtonText}>
                            Contact Support
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0a0a',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: Platform.OS === 'ios' ? 60 : 48,
        paddingHorizontal: 20,
        paddingBottom: 16,
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

    // Hero
    heroSection: {
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 8,
        paddingBottom: 28,
    },
    heroIconWrapper: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: 'rgba(82, 232, 243, 0.12)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    heroTitle: {
        fontSize: 26,
        fontWeight: '800',
        color: '#fff',
        marginBottom: 8,
    },
    heroSubtitle: {
        fontSize: 15,
        color: '#777',
        textAlign: 'center',
    },

    // List
    listContainer: {
        flex: 1,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },

    // FAQ Card
    faqCard: {
        backgroundColor: '#141414',
        borderRadius: 16,
        padding: 18,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#1e1e1e',
    },
    faqCardExpanded: {
        borderColor: '#3b82f6',
        backgroundColor: '#181410',
    },
    questionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 12,
    },
    questionText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#ddd',
        flex: 1,
    },
    questionTextActive: {
        color: '#3b82f6',
    },
    answerContainer: {
        marginTop: 12,
    },
    answerDivider: {
        height: 1,
        backgroundColor: '#2a2a2a',
        marginBottom: 12,
    },
    answerText: {
        fontSize: 14,
        color: '#999',
        lineHeight: 22,
    },

    // Footer
    footerSection: {
        alignItems: 'center',
        marginTop: 24,
        paddingVertical: 20,
    },
    footerText: {
        fontSize: 15,
        color: '#666',
        marginBottom: 16,
    },
    contactButton: {
        borderWidth: 1,
        borderColor: '#3b82f6',
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 32,
    },
    contactButtonText: {
        color: '#3b82f6',
        fontSize: 15,
        fontWeight: '600',
    },
});
