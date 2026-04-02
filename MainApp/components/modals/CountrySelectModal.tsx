import React, { useRef, useEffect, useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet, Platform, Animated, Dimensions, TextInput } from 'react-native';
import { X, Search, Globe, Shuffle } from 'lucide-react-native';
import CountryFlag from 'react-native-country-flag';
import { AppColors } from '@/constants/colors';
import { AppFonts } from '@/constants/theme';
import { GlobeCountry } from '@/types/home';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

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
  const [search, setSearch] = useState('');
  
  const filteredCountries = useMemo(() => {
    if (!search.trim()) return countries;
    return countries.filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, countries]);

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

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.modalBackdrop, { opacity: backdropOpacity }]}>
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={onClose}
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.modalSheet,
          { transform: [{ translateY: slideAnim }] }
        ]}
      >
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Select Country</Text>
          <TouchableOpacity onPress={onClose} activeOpacity={0.6}>
            <X size={22} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchWrapper}>
          <View style={styles.searchBar}>
            <Search size={18} color="#999" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search country..."
              placeholderTextColor="#aaa"
              value={search}
              onChangeText={setSearch}
              autoCorrect={false}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')}>
                <X size={16} color="#999" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <FlatList
          data={filteredCountries}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            !search.trim() ? (
              <TouchableOpacity
                style={styles.countryItem}
                activeOpacity={0.6}
                onPress={() => {
                  const randomCountry = countries[Math.floor(Math.random() * countries.length)];
                  onSelectCountry(randomCountry);
                }}
              >
                <View style={{ width: 28, alignItems: 'center' }}>
                  <Shuffle size={20} color={AppColors.primary} />
                </View>
                <Text style={[styles.countryName, { color: AppColors.primary, fontFamily: AppFonts.bold }]}>
                  Random Country
                </Text>
              </TouchableOpacity>
            ) : null
          }
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
          ListFooterComponent={
            <View style={styles.footer}>
              <View style={styles.footerDivider} />
              <View style={styles.footerContent}>
                <Globe size={16} color="#bbb" />
                <Text style={styles.footerText}>More countries coming soon...</Text>
              </View>
            </View>
          }
        />
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
    maxHeight: '80%',
    minHeight: 600,
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
  },
  searchWrapper: {
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 4,
    gap: 8,
  },
  searchInput: {
    fontFamily: AppFonts.regular,
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  modalTitle: {
    fontFamily: AppFonts.bold,
    fontSize: 20,
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
    fontFamily: AppFonts.medium,
    fontSize: 17,
    color: '#333',
    flex: 1,
  },
  countryNameActive: {
    fontFamily: AppFonts.bold,
    color: AppColors.primary,
  },
  activeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: AppColors.primary,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    marginTop: 8,
  },
  footerDivider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginBottom: 20,
    width: '100%',
  },
  footerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  footerText: {
    fontFamily: AppFonts.medium,
    fontSize: 14,
    color: '#bbb',
    fontStyle: 'italic',
  },
});