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
        gap: 10,
    },
    label: {
        fontFamily: AppFonts.bold,
        fontSize: 10.5,
        color: '#64748B',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginLeft: 4,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: '#F1F5F9',
        paddingHorizontal: 16,
    },
    inputRowError: {
        borderColor: AppColors.primary,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        fontFamily: AppFonts.bold,
        flex: 1,
        fontSize: 16,
        paddingVertical: 16,
        color: AppColors.navy,
    },
    strengthWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginTop: 4,
        paddingHorizontal: 4,
    },
    strengthBars: {
        flexDirection: 'row',
        gap: 6,
        flex: 1,
    },
    strengthBar: {
        flex: 1,
        height: 5,
        borderRadius: 3,
    },
    strengthLabel: {
        fontFamily: AppFonts.bold,
        fontSize: 11,
        width: 50,
        textAlign: 'right',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    helperText: {
        fontFamily: AppFonts.medium,
        fontSize: 12,
        color: '#94A3B8',
        lineHeight: 18,
        marginTop: 4,
        marginLeft: 4,
    },
    errorText: {
        fontFamily: AppFonts.bold,
        fontSize: 12,
        color: AppColors.primary,
        marginTop: 4,
        marginLeft: 4,
    },
});
