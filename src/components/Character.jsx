import React, { forwardRef, useRef, useState, useEffect, useMemo, useImperativeHandle } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations, useKeyboardControls } from "@react-three/drei";
import * as THREE from "three";
import { terrainHeightAtPosition } from "./Terrain";
import { Text } from "@react-three/drei";
import { useCameraRotation } from "../hooks/useCameraRotation";

const Character = forwardRef(({ onLoad, currentAnimation }, ref) => {
  const group = useRef();
  const { scene, animations } = useGLTF("/models/Soldier.glb");
  const { actions, names } = useAnimations(animations, group);
  const { rotateCameraLeft, rotateCameraRight } = useCameraRotation(group);

  // Add this line to define characterHeight
  const characterHeight = useRef(0);

  useImperativeHandle(ref, () => ({
    position: group.current.position,
    rotation: group.current.rotation,
  }));

  const [currentAction, setCurrentAction] = useState(null);
  const [animationState, setAnimationStateValue] = useState("Idle");

  const position = useRef(new THREE.Vector3(0, 0, 0));
  const velocity = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());

  const [subscribeKeys, getKeys] = useKeyboardControls();

  const rotationRef = useRef(new THREE.Euler());
  const targetRotationRef = useRef(new THREE.Euler());

  const setAnimationState = useMemo(() => (state) => {
    if (!actions || state === animationState) return;
    if (currentAction) {
      currentAction.fadeOut(0.2);
    }
    const newAction = actions[state];
    if (newAction) {
      newAction.reset().fadeIn(0.2).play();
      setCurrentAction(newAction);
      setAnimationStateValue(state);
    }
  }, [actions, currentAction, animationState]);

  useEffect(() => {
    if (scene) {
      scene.traverse((object) => {
        if (object.isMesh) {
          object.castShadow = true;
          object.receiveShadow = true;
        }
      });

      // Center and scale the model if needed
      const box = new THREE.Box3().setFromObject(scene);
      const center = box.getCenter(new THREE.Vector3());
      scene.position.sub(center);
      const scale = 1; // Increased scale from 0.01 to 1
      scene.scale.set(scale, scale, scale);

      // Calculate the height of the scaled model
      const scaledBox = new THREE.Box3().setFromObject(scene);
      characterHeight.current = (scaledBox.max.y - scaledBox.min.y);

      console.log('Model loaded and adjusted, height:', characterHeight.current);
    }

    if (onLoad && names.length > 0) {
      console.log('Animations available, calling onLoad');
      onLoad(names);
    }
  }, [scene, animations, names, onLoad]);

  useEffect(() => {
    if (currentAnimation && actions[currentAnimation]) {
      console.log('Setting current animation:', currentAnimation);
      actions[currentAnimation].reset().fadeIn(0.5).play();
      return () => actions[currentAnimation].fadeOut(0.5);
    }
  }, [currentAnimation, actions]);

  useFrame((state, delta) => {
    if (!group.current || !actions) return;

    const { forward, backward, left, right } = getKeys();
    direction.current.set(0, 0, 0);

    if (forward) direction.current.z -= 1;
    if (backward) direction.current.z += 1;
    if (left) direction.current.x -= 1;
    if (right) direction.current.x += 1;

    if (direction.current.lengthSq() > 0) {
      direction.current.normalize();

      // Calculate target rotation based on movement direction
      targetRotationRef.current.y = Math.atan2(-direction.current.x, -direction.current.z);

      // Smoothly interpolate current rotation towards target rotation
      const rotationSpeed = 3; // Reduced from 5 to 3 for smoother turning
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y,
        targetRotationRef.current.y,
        rotationSpeed * delta
      );

      // Apply movement in the direction the character is facing
      const moveVector = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), group.current.rotation.y);
      const speed = 5;
      velocity.current.copy(moveVector).multiplyScalar(speed * delta);
      position.current.add(velocity.current);

      if (animationState !== 'Run') {
        setAnimationState('Run');
      }
    } else if (animationState !== 'Idle') {
      setAnimationState('Idle');
    }

    const terrainHeight = terrainHeightAtPosition(position.current.x, position.current.z);
    group.current.position.set(
      position.current.x,
      terrainHeight + characterHeight.current / 2, // Add half of the character's height
      position.current.z
    );
  });

  return (
    <group ref={group} position={[0, 10, 0]}>
      <primitive object={scene} scale={[1, 1, 1]} position={[0, -characterHeight.current / 2, 0]} />
      <mesh position={[0, 5, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial color="red" />
      </mesh>
      <group position={[0, 5, 0]}>
        <Text
          fontSize={2}
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.1}
          outlineColor="black"
        >
          {`Animation: ${animationState}`}
        </Text>
      </group>
    </group>
  );
});

export default Character;
