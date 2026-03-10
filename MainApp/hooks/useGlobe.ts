import { useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import * as THREE from 'three';
import { GlobeCountry, SphericalTarget } from '@/types/home';

export function lonLatToSpherical(lon: number, lat: number) {
  const phi = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(lon + 90);
  return { phi, theta };
}

export const useGlobe = () => {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState<GlobeCountry | null>(null);
  const [rotationTarget, setRotationTarget] = useState<SphericalTarget | null>(null);

  const handleSelectCountry = useCallback((country: GlobeCountry) => {
    setSelected(country);
    setModalVisible(false);
    
    const spherical = lonLatToSpherical(country.lon, country.lat);
    setRotationTarget({ ...spherical });
  }, []);

  const handleAnimationDone = useCallback(() => {
    if (selected) {
      setTimeout(() => {
        router.push(`/country/${selected.id}` as any);
        setRotationTarget(null);
      }, 400);
    }
  }, [selected, router]);

  return {
    modalVisible,
    setModalVisible,
    selected,
    rotationTarget,
    handleSelectCountry,
    handleAnimationDone
  };
};