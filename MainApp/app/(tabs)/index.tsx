import React, { Suspense, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  Platform,
} from 'react-native';
import { Canvas, useFrame } from '@react-three/fiber/native';
import { useGLTF, OrbitControls, Stage } from '@react-three/drei/native';
import { ChevronRight, X } from 'lucide-react-native';

import { globeCountries } from '@/config/home';
import { useGlobe } from '@/hooks/useGlobe';
import modelPath from '@/assets/models/earth.glb';
import NotificationBell from '@/components/NotificationBell';
import NotificationModal from '@/components/NotificationModal';

function EarthModel(props: any) {
  const gltf = useGLTF(modelPath);
  return <primitive {...props} object={gltf.scene} />;
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

interface AnimatedControlsProps {
  target: { phi: number; theta: number } | null;
  onAnimationDone: () => void;
}

function AnimatedControls({ target, onAnimationDone }: AnimatedControlsProps) {
  const controlsRef = useRef<any>(null);
  const animating = useRef(false);
  const progress = useRef(0);
  const startAngles = useRef({ phi: 0, theta: 0 });
  const targetAngles = useRef({ phi: 0, theta: 0 });

  React.useEffect(() => {
    if (target && controlsRef.current) {
      const controls = controlsRef.current;
      startAngles.current = {
        phi: controls.getPolarAngle(),
        theta: controls.getAzimuthalAngle(),
      };
      targetAngles.current = { phi: target.phi, theta: target.theta };
      progress.current = 0;
      animating.current = true;
    }
  }, [target]);

  useFrame((_, delta) => {
    if (!animating.current || !controlsRef.current) return;

    progress.current = Math.min(progress.current + delta * 0.8, 1);
    const t = easeInOutCubic(progress.current);

    const currentPhi =
      startAngles.current.phi +
      (targetAngles.current.phi - startAngles.current.phi) * t;
    const currentTheta =
      startAngles.current.theta +
      (targetAngles.current.theta - startAngles.current.theta) * t;

    controlsRef.current.minPolarAngle = currentPhi;
    controlsRef.current.maxPolarAngle = currentPhi;
    controlsRef.current.minAzimuthAngle = currentTheta;
    controlsRef.current.maxAzimuthAngle = currentTheta;
    controlsRef.current.update();

    if (progress.current >= 1) {
      animating.current = false;
      controlsRef.current.minPolarAngle = 0;
      controlsRef.current.maxPolarAngle = Math.PI;
      controlsRef.current.minAzimuthAngle = -Infinity;
      controlsRef.current.maxAzimuthAngle = Infinity;
      onAnimationDone();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      autoRotate={!target}
      autoRotateSpeed={0.5}
    />
  );
}

export default function HomeScreen() {
  const {
    modalVisible,
    setModalVisible,
    selected,
    rotationTarget,
    handleSelectCountry,
    handleAnimationDone
  } = useGlobe();
  const [showNotif, setShowNotif] = React.useState(false);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerCenter} onPress={() => setShowNotif(true)} activeOpacity={0.75}>
            <Text style={styles.appName}>ChimDoo</Text>
            <Text style={styles.subtitle}>Choose your place to Chim</Text>
          </TouchableOpacity>
          <View style={styles.headerBell}>
            <NotificationBell onPress={() => setShowNotif(true)} />
          </View>
        </View>

        <View style={styles.pillWrapper}>
          <TouchableOpacity
            style={styles.pillButton}
            activeOpacity={0.7}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.pillText} numberOfLines={1}>
              {selected ? `${selected.flag}  ${selected.name}` : 'Select a country...'}
            </Text>
            <ChevronRight size={18} color="#1D3557" />
          </TouchableOpacity>
        </View>

        <View style={styles.canvasContainer}>
          <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
            <Suspense fallback={null}>
              <Stage environment="city" intensity={0.6} castShadow={false}>
                <EarthModel />
              </Stage>
            </Suspense>
            <AnimatedControls
              target={rotationTarget}
              onAnimationDone={handleAnimationDone}
            />
          </Canvas>
        </View>

        <Modal
          visible={modalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalSheet}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Country</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <X size={22} color="#666" />
                </TouchableOpacity>
              </View>

              <FlatList
                data={globeCountries}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.countryItem,
                      selected?.id === item.id && styles.countryItemActive,
                    ]}
                    activeOpacity={0.6}
                    onPress={() => handleSelectCountry(item)}
                  >
                    <Text style={styles.countryFlag}>{item.flag}</Text>
                    <Text
                      style={[
                        styles.countryName,
                        selected?.id === item.id && styles.countryNameActive,
                      ]}
                    >
                      {item.name}
                    </Text>
                    {selected?.id === item.id && (
                      <View style={styles.activeDot} />
                    )}
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>
      </View>
      <NotificationModal visible={showNotif} onClose={() => setShowNotif(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },

  header: {
    paddingTop: Platform.OS === 'ios' ? 64 : 48,
    paddingHorizontal: 24,
    marginBottom: 4,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerBell: {
    position: 'absolute',
    right: 20,
    top: Platform.OS === 'ios' ? 64 : 48,
  },
  appName: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1D3557',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#777',
    marginTop: 4,
  },
  pillWrapper: {
    paddingHorizontal: 40,
    marginTop: 18,
    marginBottom: 4,
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
    fontSize: 16,
    fontWeight: '500',
    color: '#1D3557',
    flex: 1,
  },

  canvasContainer: {
    flex: 1,
    marginVertical: 8,
  },
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
    color: '#1D3557',
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
  countryFlag: {
    fontSize: 28,
  },
  countryName: {
    fontSize: 17,
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },
  countryNameActive: {
    color: '#E63946',
    fontWeight: '700',
  },
  activeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E63946',
  },
});
