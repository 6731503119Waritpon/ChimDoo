import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, TextInputProps } from 'react-native';
import { Lock, Eye, EyeOff } from 'lucide-react-native';
import { AppColors } from '@/constants/colors';
import { AppFonts } from '@/constants/theme';

interface SecureInputProps extends TextInputProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    errorText?: string;
    showStrength?: boolean;
    helperText?: string;
}

export default function SecureInput({
    label,
    value,
    onChangeText,
    placeholder,
    errorText,
    showStrength = false,
    helperText,
    ...props
}: SecureInputProps) {
    const [showPassword, setShowPassword] = useState(false);

    const getStrength = (pw: string): { level: number; label: string; color: string } => {
        if (pw.length === 0) return { level: 0, label: '', color: '#ddd' };
        let score = 0;
        if (pw.length >= 8) score++;
        if (/[A-Z]/.test(pw)) score++;
        if (/[0-9]/.test(pw)) score++;
        if (/[^A-Za-z0-9]/.test(pw)) score++;
        const map = [
            { level: 1, label: 'Weak', color: '#ef4444' },
            { level: 2, label: 'Fair', color: '#f97316' },
            { level: 3, label: 'Good', color: '#eab308' },
            { level: 4, label: 'Strong', color: '#22c55e' },
        ];
        return map[score - 1] ?? { level: 0, label: '', color: '#ddd' };
    };

    const strength = showStrength ? getStrength(value) : null;

    return (
        <View style={styles.inputGroup}>
            <Text style={styles.label}>{label}</Text>
            <View style={[styles.inputRow, errorText ? styles.inputRowError : null]}>
                <Lock size={18} color="#999" style={styles.inputIcon} />
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    placeholderTextColor="#aaa"
                    value={value}
                    onChangeText={onChangeText}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    {...props}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={20} color="#888" /> : <Eye size={20} color="#888" />}
                </TouchableOpacity>
            </View>

            {showStrength && value.length > 0 && strength && (
                <View style={styles.strengthWrapper}>
                    <View style={styles.strengthBars}>
                        {[1, 2, 3, 4].map((n) => (
                            <View
                                key={n}
                                style={[
                                    styles.strengthBar,
                                    { backgroundColor: n <= strength.level ? strength.color : '#e5e7eb' },
                                ]}
                            />
                        ))}
                    </View>
                    <Text style={[styles.strengthLabel, { color: strength.color }]}>
                        {strength.label}
                    </Text>
                </View>
            )}

            {helperText && !errorText && (
                <Text style={styles.helperText}>{helperText}</Text>
            )}

            {errorText ? (
                <Text style={styles.errorText}>{errorText}</Text>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    inputGroup: {
        gap: 8,
    },
    label: {
        fontFamily: AppFonts.bold,
        fontSize: 13,
        color: '#555',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: 'rgba(29, 53, 87, 0.12)',
        paddingHorizontal: 14,
        paddingVertical: 4,
        shadowColor: AppColors.navy,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 3,
    },
    inputRowError: {
        borderColor: AppColors.primary,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        fontFamily: AppFonts.regular,
        flex: 1,
        fontSize: 16,
        paddingVertical: 14,
        color: '#1a1a1a',
    },
    strengthWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 6,
    },
    strengthBars: {
        flexDirection: 'row',
        gap: 4,
        flex: 1,
    },
    strengthBar: {
        flex: 1,
        height: 4,
        borderRadius: 2,
    },
    strengthLabel: {
        fontFamily: AppFonts.bold,
        fontSize: 12,
        width: 48,
        textAlign: 'right',
    },
    helperText: {
        fontFamily: AppFonts.regular,
        fontSize: 12,
        color: '#888',
        lineHeight: 18,
    },
    errorText: {
        fontFamily: AppFonts.medium,
        fontSize: 12,
        color: AppColors.primary,
    },
});
