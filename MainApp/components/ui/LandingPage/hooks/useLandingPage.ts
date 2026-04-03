import { useState, useRef, useCallback } from 'react';
import { Platform, useWindowDimensions, Dimensions, ScrollView } from 'react-native';

export const useLandingPage = () => {
    const { width, height } = useWindowDimensions();
    const [scrollY, setScrollY] = useState(0);
    const scrollViewRef = useRef<ScrollView>(null);
    const [sectionOffsets, setSectionOffsets] = useState<Record<string, number>>({});

    const isMobile = width < 768;
    const isTablet = width >= 768 && width <= 1024;
    const isDesktop = Platform.OS === 'web' && width > 1024;

    const initialHeight = Dimensions.get('window').height;

    const handleScroll = (event: any) => {
        setScrollY(event.nativeEvent.contentOffset.y);
    };

    const setSectionOffset = useCallback((name: string, y: number) => {
        if (y > 0) {
            setSectionOffsets(prev => ({ ...prev, [name]: y }));
        }
    }, []);

    const scrollToSection = useCallback((name: string) => {
        const offset = sectionOffsets[name];
        
        console.log(`[scrollToSection] Navigating to: ${name} at offset: ${offset}`);

        if (offset !== undefined && scrollViewRef.current) {
            scrollViewRef.current.scrollTo({
                y: Math.max(0, offset - 70),
                animated: true,
            });
        } else {
            console.warn(`[scrollToSection] Target ${name} not ready or offset is missing.`);
        }
    }, [sectionOffsets]);

    return {
        width,
        height,
        initialHeight,
        scrollY,
        isMobile,
        isTablet,
        isDesktop,
        handleScroll,
        scrollViewRef,
        setSectionOffset,
        scrollToSection,
    };
};
