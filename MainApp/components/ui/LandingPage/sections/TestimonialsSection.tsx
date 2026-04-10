import React from 'react';
import { View, Text, Image } from 'react-native';
import { Star } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { AppColors } from '@/constants/colors';
import { SectionHeader } from '../shared';
import { TESTIMONIALS } from '../LandingPage.constants';

import { TestimonialsSectionProps } from '@/types/landingPage';

export const TestimonialsSection = ({ styles }: TestimonialsSectionProps) => {
    return (
        <View style={styles.testimonialsSection}>
            <View style={styles.testimonialsBackground} />

            <SectionHeader
                preTitle="Trusted by Many"
                title="Join Thousands of Happy Home Chefs"
                subtitle="See why people around the world are choosing ChimDoo for their culinary adventures."
                styles={styles}
            />

            <View style={styles.testimonialsGrid}>
                {TESTIMONIALS.map((item, i) => (
                    <Animated.View
                        key={i}
                        entering={FadeInUp.delay(200 + i * 100).duration(600)}
                        style={styles.testimonialCard}
                    >
                        <View style={styles.testimonialHeader}>
                            <Image
                                source={{ uri: item.avatar }}
                                style={styles.testimonialAvatar}
                            />
                            <View style={styles.testimonialInfo}>
                                <Text style={styles.testimonialName}>{item.name}</Text>
                                <Text style={styles.testimonialHandle}>{item.handle}</Text>
                            </View>
                        </View>

                        <View style={styles.testimonialStars}>
                            {[...Array(5)].map((_, starIndex) => (
                                <Star
                                    key={starIndex}
                                    size={16}
                                    color={starIndex < Math.floor(item.rating) ? AppColors.orange : '#e2e8f0'}
                                    fill={starIndex < Math.floor(item.rating) ? AppColors.orange : 'transparent'}
                                />
                            ))}
                        </View>

                        <Text style={styles.testimonialQuote}>"{item.quote}"</Text>
                    </Animated.View>
                ))}
            </View>
        </View>
    );
};
