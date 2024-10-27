// src/components/Camera.js
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";

const CameraController = ({ characterRef }) => {
  const { camera } = useThree();
  const cameraOffset = new Vector3(0, 2, 5); // Adjusted for behind-the-player view

  useFrame((state, delta) => {
    if (characterRef.current) {
      const characterPosition = characterRef.current.position.clone();
      const characterRotation = characterRef.current.rotation.y;

      // Calculate camera position based on character's position and rotation
      const rotatedOffset = cameraOffset.clone().applyAxisAngle(new Vector3(0, 1, 0), characterRotation);
      const targetPosition = characterPosition.clone().add(rotatedOffset);

      // Smoothly move the camera to the target position
      camera.position.lerp(targetPosition, 0.1);

      // Make the camera look at the character's position
      camera.lookAt(characterPosition);
    }
  });

  return null;
};

export default CameraController;
