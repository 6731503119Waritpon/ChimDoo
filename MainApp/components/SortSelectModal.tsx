import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Platform, Animated, Dimensions } from 'react-native';
import { X, Clock, ArrowDownAZ, ArrowUpZA } from 'lucide-react-native';
import { AppColors } from '@/constants/colors';
import { AppFonts } from '@/constants/theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface SortSelectModalProps {
  visible: boolean;
  onClose: () => void;
  selectedSort: 'latest' | 'az' | 'za';
  onSelectSort: (sort: 'latest' | 'az' | 'za') => void;
}

export default function SortSelectModal({
  visible,
  onClose,
  selectedSort,
  onSelectSort,
}: SortSelectModalProps) {
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          bounciness: 0,
          speed: 12,
        })
      ]).start();
    } else {
      slideAnim.setValue(SCREEN_HEIGHT);
      backdropOpacity.setValue(0);
    }
  }, [visible]);

  if (!visible) return null;

  const options = [
    { id: 'latest', label: 'Latest First', icon: Clock },
    { id: 'az', label: 'Name (A to Z)', icon: ArrowDownAZ },
    { id: 'za', label: 'Name (Z to A)', icon: ArrowUpZA },
  ] as const;

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <Animated.View style={[styles.modalBackdrop, { opacity: backdropOpacity }]}>
        <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={onClose} />
      </Animated.View>

      <Animated.View style={[styles.modalSheet, { transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Sort Recipes</Text>
          <TouchableOpacity onPress={onClose} activeOpacity={0.6}>
            <X size={22} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.optionsContainer}>
            {options.map(opt => {
                const Icon = opt.icon;
                const isActive = selectedSort === opt.id;
                return (
                    <TouchableOpacity
                        key={opt.id}
                        style={[styles.optionItem, isActive && styles.optionItemActive]}
                        activeOpacity={0.7}
                        onPress={() => onSelectSort(opt.id)}
                    >
                        <View style={styles.iconWrapper}>
                            <Icon size={20} color={isActive ? AppColors.primary : '#6B7280'} />
                        </View>
                        <Text style={[styles.optionText, isActive && styles.optionTextActive]}>
                            {opt.label}
                        </Text>
                        {isActive && <View style={styles.activeDot} />}
                    </TouchableOpacity>
                );
            })}
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  modalSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalTitle: {
    fontFamily: AppFonts.bold,
    fontSize: 20,
    color: AppColors.navy,
  },
  optionsContainer: {
    paddingVertical: 8,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 16,
  },
  optionItemActive: {
    backgroundColor: 'rgba(230, 57, 70, 0.05)',
  },
  iconWrapper: {
    width: 28,
    alignItems: 'center',
  },
  optionText: {
    fontFamily: AppFonts.medium,
    fontSize: 16,
    color: '#4B5563',
    flex: 1,
  },
  optionTextActive: {
    fontFamily: AppFonts.bold,
    color: AppColors.primary,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: AppColors.primary,
  },
});
