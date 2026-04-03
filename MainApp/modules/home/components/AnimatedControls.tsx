import React, { useRef, useEffect, ComponentRef } from 'react';
import { useFrame } from '@react-three/fiber/native';
import { OrbitControls } from '@react-three/drei/native';
import { easeInOutCubic } from '@/utils/recipeHelpers';

import { AnimatedControlsProps } from '@/types/home';

export default function AnimatedControls({ target, zooming, onRotationDone, onZoomDone }: AnimatedControlsProps) {
  const controlsRef = useRef<ComponentRef<typeof OrbitControls> | null>(null);

  const rotating = useRef(false);
  const rotProgress = useRef(0);
  const startAngles = useRef({ phi: 0, theta: 0 });
  const targetAngles = useRef({ phi: 0, theta: 0 });

  const zoomProgress = useRef(0);
  const zoomStartDistance = useRef(5);
  const zoomFinished = useRef(false);
  const ZOOM_TARGET = 20;

  useEffect(() => {
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

  useEffect(() => {
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
      zoomProgress.current = Math.min(zoomProgress.current + delta * 0.4, 1);
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
