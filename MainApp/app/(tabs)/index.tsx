import React, { Suspense, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Canvas } from '@react-three/fiber/native';
import { Stage } from '@react-three/drei/native';
import { ChevronRight, LucideIcon } from 'lucide-react-native';
import CountryFlag from 'react-native-country-flag';
import { useFocusEffect } from 'expo-router';
import { globeCountries } from '@/config/home';
import { useGlobe } from '@/hooks/useGlobe';
import CountrySelectModal from '@/components/modals/CountrySelectModal';
import { AppColors } from '@/constants/colors';
import { AppFonts, AppLayout } from '@/constants/theme';
import { getGreetingConfig } from '@/utils/greetingHelpers';
import EarthModel from '@/modules/home/components/EarthModel';
import AnimatedControls from '@/modules/home/components/AnimatedControls';


export default function HomeScreen() {
  const {
    modalVisible,
    setModalVisible,
    selected,
    rotationTarget,
    zooming,
    handleSelectCountry,
    handleRotationDone,
    handleZoomDone,
  } = useGlobe();
  const [canvasKey, setCanvasKey] = React.useState(0);

  useFocusEffect(
    React.useCallback(() => {
      setCanvasKey(k => k + 1);
    }, [])
  );

  const [greeting, setGreeting] = React.useState('');
  const [GreetingIcon, setGreetingIcon] = React.useState<LucideIcon | null>(null);

  React.useEffect(() => {
    const { message, icon } = getGreetingConfig();
    setGreeting(message);
    setGreetingIcon(() => icon);
  }, []);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerCenter}>
            <Text style={styles.appName}>
              <Text style={{ color: AppColors.primary }}>Chim</Text>Doo</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
              <Text style={[styles.subtitle, { marginTop: 0, marginRight: 6 }]}>
                {greeting || 'Choose your place to Chim'}
              </Text>
              {GreetingIcon && <GreetingIcon size={20} color="#F59E0B" />}
            </View>
          </View>
        </View>

        <View style={styles.pillWrapper}>
          <TouchableOpacity
            style={styles.pillButton}
            activeOpacity={0.7}
            onPress={() => setModalVisible(true)}
          >
            {selected ? (
              <>
                <CountryFlag isoCode={selected.isoCode} size={20} style={{ borderRadius: 4, marginRight: 8 }} />
                <Text style={styles.pillText} numberOfLines={1}>{selected.name}</Text>
              </>
            ) : (
              <Text style={styles.pillText} numberOfLines={1}>Select a country...</Text>
            )}
            <ChevronRight size={18} color={AppColors.navy} />
          </TouchableOpacity>
        </View>

        <View style={styles.canvasContainer}>
          <Canvas key={canvasKey} camera={{ position: [0, 0, 5], fov: 45 }}>
            <Suspense fallback={null}>
              <ambientLight intensity={1.5} />
              <hemisphereLight intensity={1.2} color="#ffffff" groundColor="#ffffff" />
              <directionalLight position={[10, 10, 10]} intensity={3.5} />
              <directionalLight position={[-10, -10, -10]} intensity={2.5} color="#e0f2fe" />
              <pointLight position={[0, 0, 10]} intensity={2} color="#ffffff" />
              <Stage environment={null} intensity={1} shadows={false}>
                <EarthModel />
              </Stage>
            </Suspense>
            <AnimatedControls
              target={rotationTarget}
              zooming={zooming}
              onRotationDone={handleRotationDone}
              onZoomDone={handleZoomDone}
            />
          </Canvas>
        </View>

        <CountrySelectModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          countries={globeCountries}
          selectedCountry={selected}
          onSelectCountry={handleSelectCountry}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.backgroundLight,
  },

  header: {
    paddingTop: Platform.select(AppLayout.headerPaddingTop),
    paddingHorizontal: AppLayout.screenPaddingHorizontal,
    marginBottom: 4,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  appName: {
    fontFamily: AppFonts.bold,
    fontSize: 32,
    color: AppColors.navy,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontFamily: AppFonts.regular,
    fontSize: 15,
    color: '#777',
    marginTop: 4,
  },
  pillWrapper: {
    paddingHorizontal: 40,
    marginTop: 18,
    marginBottom: 4,
    zIndex: 10,
  },
  pillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: '#ddd',
    paddingHorizontal: 22,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  pillText: {
    fontFamily: AppFonts.medium,
    fontSize: 16,
    color: AppColors.navy,
    flex: 1,
  },
  canvasContainer: {
    flex: 1,
    marginTop: -80,
    marginVertical: 8,
  },
});
