import React, { useState, useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import { AppColors } from '@/constants/colors';
import { AppFonts } from '@/constants/theme';
import { segmentThaiText } from '@/utils/thaiText';

import { TypewriterTextProps } from '@/types/chatbot';

export const TypewriterText = ({ text, isLatest }: TypewriterTextProps) => {
    const [displayedText, setDisplayedText] = useState(isLatest ? '' : text);

    useEffect(() => {
        if (!isLatest || displayedText === text) {
            if (!isLatest && displayedText !== text) {
                setDisplayedText(text);
            }
            return;
        }

        const segments = segmentThaiText(text);
        let index = segmentThaiText(displayedText).length;
        let currentString = displayedText;

        const interval = setInterval(() => {
            if (index < segments.length) {
                currentString += segments[index];
                setDisplayedText(currentString);
                index++;
            } else {
                clearInterval(interval);
            }
        }, 30);

        return () => clearInterval(interval);
    }, [text, isLatest]);

    return <Text style={styles.messageTextAI}>{displayedText}</Text>;
};

const styles = StyleSheet.create({
    messageTextAI: {
        fontFamily: AppFonts.regular,
        fontSize: 15,
        lineHeight: 22,
        color: AppColors.navy
    },
});
