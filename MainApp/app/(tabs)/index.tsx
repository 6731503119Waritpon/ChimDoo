import React, { Suspense } from 'react';
import { StyleSheet, View } from 'react-native';
import { Canvas } from '@react-three/fiber/native';
import { useGLTF, OrbitControls, Stage } from '@react-three/drei/native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import modelPath from '@/assets/models/earth.glb';

function EarthModel(props: any) {
  const gltf = useGLTF(modelPath)
  return <primitive {...props} object={gltf.scene} />
}

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">ChimDoo</ThemedText>
        <ThemedText>Choose your place to Chim</ThemedText>
      </View>

      <View style={styles.canvasContainer}>
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <Suspense fallback={null}>
            <Stage environment="city" intensity={0.6} castShadow={false}>
              <EarthModel />
            </Stage>
          </Suspense>
          <OrbitControls enablePan={false} autoRotate autoRotateSpeed={0.5} />
        </Canvas>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  canvasContainer: {
    flex: 1,
    marginVertical: 20,
  },
});
