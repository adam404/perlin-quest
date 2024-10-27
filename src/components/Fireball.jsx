import React from 'react';
import { Sphere } from '@react-three/drei';

const Fireball = ({ position }) => {
  return (
    <Sphere position={position} args={[0.2, 16, 16]}>
      <meshStandardMaterial emissive="orange" emissiveIntensity={2} />
    </Sphere>
  );
};

export default Fireball;