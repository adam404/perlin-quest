// src/components/Destination.js
import React from "react";

const Destination = () => {
  return (
    <mesh position={[0, 5, -100]}>
      <sphereGeometry args={[2, 32, 32]} />
      <meshBasicMaterial color="red" />
    </mesh>
  );
};

export default Destination;
