import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function useCameraRotation(characterRef) {
  const cameraRotation = useRef(0);

  useFrame(({ camera }) => {
    if (characterRef.current) {
      const characterPosition = characterRef.current.position;
      const offset = new THREE.Vector3(0, 2, 5);

      const rotatedOffset = offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), cameraRotation.current);
      const targetPosition = characterPosition.clone().add(rotatedOffset);

      camera.position.lerp(targetPosition, 0.1);
      camera.lookAt(characterPosition);
    }
  });

  const rotateCameraLeft = () => {
    cameraRotation.current += 0.05;
  };

  const rotateCameraRight = () => {
    cameraRotation.current -= 0.05;
  };

  return { rotateCameraLeft, rotateCameraRight };
}

