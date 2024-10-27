import React from 'react';
import { useThree } from '@react-three/fiber';
import { CubeTextureLoader } from 'three';

const Skybox = () => {
  const { scene } = useThree();

  const loader = new CubeTextureLoader();
  const texture = loader.load([
    '/textures/skybox/px.jpg',
    '/textures/skybox/nx.jpg',
    '/textures/skybox/py.jpg',
    '/textures/skybox/ny.jpg',
    '/textures/skybox/pz.jpg',
    '/textures/skybox/nz.jpg',
  ]);

  scene.background = texture;

  return null;
};

export default Skybox;