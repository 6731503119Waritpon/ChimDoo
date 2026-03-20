import React from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet, Platform } from 'react-native';
import { X } from 'lucide-react-native';
import CountryFlag from 'react-native-country-flag';
import { AppColors } from '@/constants/colors';

import { GlobeCountry } from '@/types/home';

interface CountrySelectModalProps {
  visible: boolean;
  onClose: () => void;
  countries: GlobeCountry[];
  selectedCountry: GlobeCountry | null;
  onSelectCountry: (country: GlobeCountry) => void;
}

export default function CountrySelectModal({
  visible,
  onClose,
  countries,
  selectedCountry,
  onSelectCountry,
}: CountrySelectModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackdrop}>
        <View style={styles.modalSheet}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Country</Text>
            <TouchableOpacity onPress={onClose} activeOpacity={0.6}>
              <X size={22} color="#666" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={countries}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.countryItem,
                  selectedCountry?.id === item.id && styles.countryItemActive,
                ]}
                activeOpacity={0.6}
                onPress={() => onSelectCountry(item)}
              >
                <CountryFlag isoCode={item.isoCode} size={28} style={{ borderRadius: 4 }} />
                <Text
                  style={[
                    styles.countryName,
                    selectedCountry?.id === item.id && styles.countryNameActive,
                  ]}
                >
                  {item.name}
                </Text>
                {selectedCountry?.id === item.id && (
                  <View style={styles.activeDot} />
                )}
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '60%',
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 18,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e5e5e5',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: AppColors.navy,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 24,
    gap: 16,
  },
  countryItemActive: {
    backgroundColor: 'rgba(230, 57, 70, 0.07)',
  },
  countryName: {
    fontSize: 17,
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },
  countryNameActive: {
    color: AppColors.primary,
    fontWeight: '700',
  },
  activeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: AppColors.primary,
  },
});
