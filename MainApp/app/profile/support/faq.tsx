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
import { AppFonts } from '@/constants/theme';

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
                    <HelpCircle size={40} color={AppColors.primary} />
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
                        <ActivityIndicator size="large" color={AppColors.primary} />
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
                                        <ChevronUp size={20} color={AppColors.primary} />
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
        backgroundColor: AppColors.navy,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontFamily: AppFonts.bold,
        fontSize: 20,
        color: AppColors.navy,
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
        backgroundColor: 'rgba(230, 57, 70, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        borderWidth: 2,
        borderColor: AppColors.primary,
    },
    heroTitle: {
        fontFamily: AppFonts.bold,
        fontSize: 26,
        color: AppColors.navy,
        marginBottom: 8,
    },
    heroSubtitle: {
        fontFamily: AppFonts.regular,
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
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 20,
        marginBottom: 12,
        borderWidth: 1.5,
        borderColor: '#F1F5F9',
    },
    faqCardExpanded: {
        borderColor: AppColors.primary,
        backgroundColor: '#FEF2F2',
    },
    questionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 12,
    },
    questionText: {
        fontFamily: AppFonts.semiBold,
        fontSize: 15,
        color: AppColors.navy,
        flex: 1,
    },
    questionTextActive: {
        color: AppColors.primary,
    },
    answerContainer: {
        marginTop: 12,
    },
    answerDivider: {
        height: 1,
        backgroundColor: '#f1f1f1',
        marginBottom: 12,
    },
    answerText: {
        fontFamily: AppFonts.regular,
        fontSize: 14,
        color: '#666',
        lineHeight: 22,
    },
    footerSection: {
        alignItems: 'center',
        marginTop: 24,
        paddingVertical: 20,
    },
    footerText: {
        fontFamily: AppFonts.regular,
        fontSize: 15,
        color: '#666',
        marginBottom: 16,
    },
    contactButton: {
        backgroundColor: AppColors.primary,
        borderRadius: 14,
        paddingVertical: 14,
        paddingHorizontal: 32,
    },
    contactButtonText: {
        fontFamily: AppFonts.bold,
        color: '#fff',
        fontSize: 15,
    },
});
