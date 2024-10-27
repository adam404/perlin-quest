// src/components/Character.js
import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';

const Character = () => {
  const ref = useRef();
  const { scene } = useGLTF('path_to_character_model.glb');

  return <primitive ref={ref} object={scene} />;
};

export default Character;

