import { useFrame } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import * as THREE from "three";

const CameraController = ({ characterRef }) => {
  const offset = useRef(new THREE.Vector3(0, 2, 15));
  const minZoom = 5;
  const maxZoom = 25;

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === '+' || event.key === '=') {
        offset.current.z = Math.max(minZoom, offset.current.z - 1);
      } else if (event.key === '-' || event.key === '_') {
        offset.current.z = Math.min(maxZoom, offset.current.z + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useFrame(({ camera }) => {
    if (characterRef.current) {
      const characterPosition = characterRef.current.position;
      const characterRotation = characterRef.current.rotation.y;

      const rotatedOffset = offset.current.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), characterRotation);
      const targetPosition = characterPosition.clone().add(rotatedOffset);

      camera.position.lerp(targetPosition, 0.1);
      camera.lookAt(characterPosition);
    }
  });

  return null;
};

export default CameraController;
