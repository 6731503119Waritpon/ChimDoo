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
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { ActivityIndicator } from 'react-native';
import { AppColors } from '@/constants/colors';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface FAQItem {
    id: string;
    question: string;
    answer: string;
    order?: number;
}

export default function FAQScreen() {
    const router = useRouter();
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [faqData, setFaqData] = useState<FAQItem[]>([]);
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        const fetchFAQ = async () => {
            try {
                const q = query(collection(db, 'faq'), orderBy('order', 'asc'));
                const snapshot = await getDocs(q);
                const items: FAQItem[] = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...(doc.data() as Omit<FAQItem, 'id'>),
                }));
                setFaqData(items);
            } catch (err) {
                console.error('Failed to load FAQ:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchFAQ();
    }, []);

    const toggleExpand = (id: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <View style={styles.container}>
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

            <View style={styles.heroSection}>
                <View style={styles.heroIconWrapper}>
                    <HelpCircle size={40} color="#3b82f6" />
                </View>
                <Text style={styles.heroTitle}>How can we help?</Text>
                <Text style={styles.heroSubtitle}>
                    Find answers to commonly asked questions below
                </Text>
            </View>

            <ScrollView
                style={styles.listContainer}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            >
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#3b82f6" />
                    </View>
                ) : (
                    faqData.map((item) => {
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
                    }))}

                <View style={styles.footerSection}>
                    <Text style={styles.footerText}>
                        Still have questions?
                    </Text>
                    <TouchableOpacity style={styles.contactButton} onPress={() => router.push('/profile/support/contact-us')}>
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
        backgroundColor: AppColors.backgroundLight,
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
    },
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
        borderWidth: 2,
        borderColor: '#96b9e9ff',
    },
    heroTitle: {
        fontSize: 26,
        fontWeight: '800',
        marginBottom: 8,
    },
    heroSubtitle: {
        fontSize: 15,
        color: '#777',
        textAlign: 'center',
    },

    listContainer: {
        flex: 1,
    },
    loadingContainer: {
        paddingVertical: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    faqCard: {
        borderRadius: 16,
        padding: 18,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#1e1e1e',
    },
    faqCardExpanded: {
        borderColor: '#3b82f6',
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
        lineHeight: 22,
    },
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
