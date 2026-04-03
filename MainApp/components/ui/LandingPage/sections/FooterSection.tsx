import React from 'react';
import { View, Text, Image } from 'react-native';
import { AppColors } from '@/constants/colors';

interface FooterSectionProps {
    isDesktop: boolean;
    styles: any;
}

export const FooterSection = ({ isDesktop, styles }: FooterSectionProps) => (
    <View style={styles.footer}>
        <View style={styles.footerTop}>
            <View style={styles.footerBrand}>
                <Image
                    source={require('@/assets/images/ChimDooLogo2.png')}
                    style={styles.footerLogo}
                    resizeMode="contain"
                />
                <Text style={styles.footerTagline}>Discover. Cook. Share.</Text>
            </View>
            <View style={styles.footerLinks}>
                <View style={styles.footerCol}>
                    <Text style={styles.footerColTitle}>PRODUCT</Text>
                    <Text style={styles.footerLink}>Features</Text>
                    <Text style={styles.footerLink}>Smart Assistant</Text>
                    <Text style={styles.footerLink}>Community</Text>
                </View>
                <View style={styles.footerCol}>
                    <Text style={styles.footerColTitle}>COMPANY</Text>
                    <Text style={styles.footerLink}>About Us</Text>
                    <Text style={styles.footerLink}>Privacy</Text>
                    <Text style={styles.footerLink}>Terms</Text>
                </View>
            </View>
        </View>
        <View style={styles.footerBottom}>
            <Text style={styles.footerCopy}>© 2026 ChimDoo. All rights reserved. Created with passion for food lovers.</Text>
        </View>
    </View>
);
