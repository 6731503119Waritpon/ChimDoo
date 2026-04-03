import React, { useEffect } from 'react';
import { useGLTF } from '@react-three/drei/native';
import * as THREE from 'three';
import modelPath from '@/assets/models/earth.glb';

export default function EarthModel(props: Record<string, unknown>) {
  const gltf = useGLTF(modelPath);

  useEffect(() => {
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
