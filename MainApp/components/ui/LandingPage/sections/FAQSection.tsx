import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import Animated, { 
    useAnimatedStyle, useSharedValue, withSpring, 
    interpolate, FadeInUp
} from 'react-native-reanimated';
import { AppColors } from '@/constants/colors';
import { SectionHeader } from '../shared';
import { FAQ_ITEMS } from '../LandingPage.constants';
import { FAQSectionProps, FAQStyles } from '@/types/landingPage';

const FAQItem = ({ item, index, styles }: { item: typeof FAQ_ITEMS[0]; index: number; styles: FAQStyles }) => {
    const [isOpen, setIsOpen] = useState(false);
    const progress = useSharedValue(0);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
        progress.value = withSpring(isOpen ? 0 : 1, { damping: 15, stiffness: 100 });
    };

    const chevronStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${interpolate(progress.value, [0, 1], [0, 180])}deg` }],
        };
    });

    const contentStyle = useAnimatedStyle(() => {
        return {
            height: interpolate(progress.value, [0, 1], [0, 100]),
            opacity: interpolate(progress.value, [0, 0.5, 1], [0, 0, 1]),
            overflow: 'hidden',
        };
    });
    return (
        <Animated.View 
            entering={FadeInUp.delay(200 + index * 100)}
            style={styles.faqItem}
        >
            <Pressable 
                onPress={toggleOpen} 
                style={({ pressed }) => [
                    styles.faqHeader,
                    pressed && { opacity: 0.8 }
                ]}
            >
                <Text style={styles.faqQuestion}>{item.question}</Text>
                <Animated.View style={chevronStyle}>
                    <ChevronDown size={24} color={AppColors.navy} strokeWidth={2.5} />
                </Animated.View>
            </Pressable>
            
            {isOpen && (
                <View style={styles.faqAnswerContainer}>
                    <Text style={styles.faqAnswer}>{item.answer}</Text>
                </View>
            )}
        </Animated.View>
    );
};

export const FAQSection = ({ isDesktop, styles }: FAQSectionProps) => {
    return (
        <View style={styles.faqSection}>
            <SectionHeader
                preTitle="Got Questions?"
                title="Frequently Asked Questions"
                subtitle="Everything you need to know about the ChimDoo culinary experience."
                styles={styles}
            />

            <View style={styles.faqContainer}>
                {FAQ_ITEMS.map((item, i) => (
                    <FAQItem key={i} item={item} index={i} styles={styles} />
                ))}
            </View>
        </View>
    );
};
