import { useFrame } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import * as THREE from "three";

const CameraController = ({ characterRef }) => {
  const offset = useRef(new THREE.Vector3(0, 2, 15));
  const minZoom = 5;
  const maxZoom = 25;
  const lerpFactor = 0.05; // Reduced from 0.1 to 0.05 for smoother movement
  const lookAhead = useRef(new THREE.Vector3());

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

      // Calculate look-ahead position based on character's velocity
      if (characterRef.current.velocity) {
        lookAhead.current.copy(characterRef.current.velocity).multiplyScalar(2);
      }

      const rotatedOffset = offset.current.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), characterRotation);
      const targetPosition = characterPosition.clone().add(rotatedOffset).add(lookAhead.current);

      // Use a smoother interpolation method (e.g., cubic interpolation)
      camera.position.lerp(targetPosition, lerpFactor);
      
      // Smoothly interpolate the camera's look-at point
      const currentLookAt = new THREE.Vector3();
      camera.getWorldDirection(currentLookAt);
      const targetLookAt = new THREE.Vector3().subVectors(characterPosition, camera.position).normalize();
      const interpolatedLookAt = new THREE.Vector3().lerpVectors(currentLookAt, targetLookAt, lerpFactor);
      camera.lookAt(characterPosition, interpolatedLookAt);
    }
  });

  return null;
};

export default CameraController;
