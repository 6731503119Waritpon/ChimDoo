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
import { ChevronRight, Sun, CloudSun, Sunset, Moon, SunMoon, LucideIcon } from 'lucide-react-native';
import * as THREE from 'three';
import CountryFlag from 'react-native-country-flag';
import { useFocusEffect } from 'expo-router';

import { globeCountries } from '@/config/home';
import { useGlobe } from '@/hooks/useGlobe';
import modelPath from '@/assets/models/earth.glb';
import NotificationModal from '@/components/NotificationModal';
import CountrySelectModal from '@/components/CountrySelectModal';
import { AppColors } from '@/constants/colors';
import { AppFonts } from '@/constants/theme';

function EarthModel(props: Record<string, unknown>) {
  const gltf = useGLTF(modelPath);
  React.useEffect(() => {
    gltf.scene.traverse((child: THREE.Object3D) => {
      const mesh = child as THREE.Mesh;
      if (mesh.isMesh && mesh.material) {
        const mat = mesh.material as THREE.MeshStandardMaterial;
        mat.roughness = 0.6;
        mat.metalness = 0.1;
        if (mat.color) {
          mat.color.set('#cccccc');
        }
      }
    });
  }, [gltf]);

  return <primitive {...props} object={gltf.scene} />;
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

interface AnimatedControlsProps {
  target: { phi: number; theta: number } | null;
  zooming: boolean;
  onRotationDone: () => void;
  onZoomDone: () => void;
}

function AnimatedControls({ target, zooming, onRotationDone, onZoomDone }: AnimatedControlsProps) {
  const controlsRef = useRef<React.ComponentRef<typeof OrbitControls> | null>(null);

  const rotating = useRef(false);
  const rotProgress = useRef(0);
  const startAngles = useRef({ phi: 0, theta: 0 });
  const targetAngles = useRef({ phi: 0, theta: 0 });

  const zoomProgress = useRef(0);
  const zoomStartDistance = useRef(5);
  const zoomFinished = useRef(false);
  const ZOOM_TARGET = 20;

  React.useEffect(() => {
    if (target && controlsRef.current) {
      const controls = controlsRef.current;
      startAngles.current = {
        phi: controls.getPolarAngle(),
        theta: controls.getAzimuthalAngle(),
      };
      targetAngles.current = { phi: target.phi, theta: target.theta };
      rotProgress.current = 0;
      rotating.current = true;
    }
  }, [target]);

  React.useEffect(() => {
    if (zooming && controlsRef.current) {
      zoomStartDistance.current = controlsRef.current.getDistance();
      zoomProgress.current = 0;
      zoomFinished.current = false;
    }
  }, [zooming]);

  useFrame((_, delta) => {
    if (!controlsRef.current) return;

    if (rotating.current) {
      rotProgress.current = Math.min(rotProgress.current + delta * 0.8, 1)
      const t = easeInOutCubic(rotProgress.current);

      const currentPhi = startAngles.current.phi + (targetAngles.current.phi - startAngles.current.phi) * t;
      const currentTheta = startAngles.current.theta + (targetAngles.current.theta - startAngles.current.theta) * t;

      controlsRef.current.minPolarAngle = currentPhi;
      controlsRef.current.maxPolarAngle = currentPhi;
      controlsRef.current.minAzimuthAngle = currentTheta;
      controlsRef.current.maxAzimuthAngle = currentTheta;
      controlsRef.current.update();

      if (rotProgress.current >= 1) {
        rotating.current = false;
        controlsRef.current.minPolarAngle = currentPhi;
        controlsRef.current.maxPolarAngle = currentPhi;
        controlsRef.current.minAzimuthAngle = currentTheta;
        controlsRef.current.maxAzimuthAngle = currentTheta;
        onRotationDone();
      }
      return;
    }

    if (zooming) {
      zoomProgress.current = Math.min(zoomProgress.current + delta * 0.4, 1); //ปรับเลขน้อยลงยิ่งซูมช้า ค่อยแก้
      const t = easeInOutCubic(zoomProgress.current);

      const currentDistance = zoomStartDistance.current + (ZOOM_TARGET - zoomStartDistance.current) * t;
      controlsRef.current.minDistance = currentDistance;
      controlsRef.current.maxDistance = currentDistance;
      controlsRef.current.update();

      if (zoomProgress.current >= 1 && !zoomFinished.current) {
        zoomFinished.current = true;
        controlsRef.current.minPolarAngle = 0;
        controlsRef.current.maxPolarAngle = Math.PI;
        controlsRef.current.minAzimuthAngle = -Infinity;
        controlsRef.current.maxAzimuthAngle = Infinity;
        controlsRef.current.minDistance = 0;
        controlsRef.current.maxDistance = Infinity;
        onZoomDone();
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      enableZoom={false}
      autoRotate={!target && !zooming}
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
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) {
      setGreeting("Good Morning! Let's find breakfast");
      setGreetingIcon(() => Sun);
    } else if (hour >= 11 && hour < 16) {
      setGreeting("Good Afternoon! Time for lunch");
      setGreetingIcon(() => CloudSun);
    } else if (hour >= 16 && hour < 22) {
      setGreeting("Good Evening! What's for dinner?");
      setGreetingIcon(() => SunMoon);
    } else {
      setGreeting("Late Night Cravings? Find a snack");
      setGreetingIcon(() => Moon);
    }
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
  countryFlag: {
    fontSize: 28,
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
});
