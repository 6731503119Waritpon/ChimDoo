import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Pressable, Platform } from 'react-native';
import { AppFonts, AppLayout } from '@/constants/theme';
import { AppColors } from '@/constants/colors';
import { LucideIcon } from 'lucide-react-native';

import { ActionOption, ActionOptionsModalProps } from '@/types/modals';

const ActionOptionsModal = ({ visible, onClose, title, options }: ActionOptionsModalProps) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <Pressable style={styles.overlay} onPress={onClose}>
                <Pressable style={styles.modalContainer}>
                    {title && (
                        <View style={styles.header}>
                            <Text style={styles.title}>{title}</Text>
                        </View>
                    )}

                    <View style={styles.optionsContainer}>
                        {options.map((option, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.optionItem,
                                    index === options.length - 1 && styles.lastOptionItem
                                ]}
                                onPress={() => {
                                    onClose();
                                    setTimeout(option.onPress, 100);
                                }}
                                activeOpacity={0.6}
                            >
                                <View style={[
                                    styles.iconBox,
                                    option.destructive && styles.destructiveIconBox
                                ]}>
                                    <option.icon 
                                        size={20} 
                                        color={option.destructive ? '#ef4444' : AppColors.navy} 
                                    />
                                </View>
                                <Text style={[
                                    styles.optionLabel,
                                    option.destructive && styles.destructiveLabel
                                ]}>
                                    {option.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TouchableOpacity 
                        style={styles.cancelButton} 
                        onPress={onClose}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                </Pressable>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: 'white',
        width: '85%',
        borderRadius: 28,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    header: {
        width: '100%',
        marginBottom: 20,
        alignItems: 'center',
    },
    title: {
        fontFamily: AppFonts.bold,
        fontSize: 20,
        color: AppColors.navy,
    },
    optionsContainer: {
        width: '100%',
        backgroundColor: '#F8FAFC',
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.03)',
    },
    lastOptionItem: {
        borderBottomWidth: 0,
    },
    iconBox: {
        width: 38,
        height: 38,
        borderRadius: 12,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    destructiveIconBox: {
        backgroundColor: 'rgba(239, 68, 68, 0.08)',
    },
    optionLabel: {
        fontFamily: AppFonts.bold,
        fontSize: 16,
        color: AppColors.navy,
    },
    destructiveLabel: {
        color: '#ef4444',
    },
    cancelButton: {
        width: '100%',
        marginTop: 16,
        paddingVertical: 14,
        backgroundColor: '#F1F5F9',
        borderRadius: 16,
        alignItems: 'center',
    },
    cancelText: {
        fontFamily: AppFonts.bold,
        fontSize: 16,
        color: AppColors.navy,
    },
});

export default ActionOptionsModal;
