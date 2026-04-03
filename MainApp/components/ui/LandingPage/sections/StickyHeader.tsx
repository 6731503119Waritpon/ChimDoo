import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';

interface StickyHeaderProps {
    scrollY: number;
    onEnter: () => void;
    styles: any;
    scrollToSection: (name: string) => void;
}

export const StickyHeader = ({ scrollY, onEnter, styles, scrollToSection }: StickyHeaderProps) => (
    <View style={[styles.stickyHeader, scrollY > 50 && styles.stickyHeaderActive]}>
        <View style={styles.headerContent}>
            <TouchableOpacity onPress={() => scrollToSection('top')} activeOpacity={0.7}>
                <Image
                    source={require('@/assets/images/ChimDooLogo2.png')}
                    style={styles.headerLogo}
                    resizeMode="contain"
                />
            </TouchableOpacity>
            
            <View style={styles.navLinks}>
                <TouchableOpacity onPress={() => scrollToSection('experience')} style={styles.navLink}>
                    <Text style={styles.navLinkText}>Experience</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => scrollToSection('innovation')} style={styles.navLink}>
                    <Text style={styles.navLinkText}>Innovation</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onEnter} style={styles.launchButton}>
                    <Text style={styles.launchButtonText}>Launch App</Text>
                </TouchableOpacity>
            </View>
        </View>
    </View>
);
