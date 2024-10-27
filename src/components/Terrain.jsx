import React, { useMemo } from "react";
import { useLoader } from "@react-three/fiber";
import { TextureLoader, RepeatWrapping, Vector3 } from "three";
import * as THREE from "three";
import { generatePerlinNoise } from "perlin-noise";

const worldWidth = 256;
const worldDepth = 256;
const noise = generatePerlinNoise(worldWidth, worldDepth);

export const terrainHeightAtPosition = (x, z) => {
  const i = Math.floor((x + 200) / 400 * (worldWidth - 1));
  const j = Math.floor((z + 200) / 400 * (worldDepth - 1));
  const index = i + j * worldWidth;
  const height = noise[index] * 20;
  return height;
};

const Terrain = ({ seed }) => {
  const grassTexture = useLoader(TextureLoader, process.env.PUBLIC_URL + "/textures/grass.jpg");
  grassTexture.wrapS = grassTexture.wrapT = RepeatWrapping;
  grassTexture.repeat.set(50, 50);

  const mesh = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(400, 400, worldWidth - 1, worldDepth - 1);
    geometry.rotateX(-Math.PI / 2);

    const vertices = geometry.attributes.position.array;
    for (let i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {
      vertices[j + 1] = noise[i] * 20;
    }

    geometry.computeVertexNormals();
    return geometry;
  }, []);

  return (
    <>
      <mesh geometry={mesh} position={[0, 0, 0]}>
        <meshStandardMaterial map={grassTexture} />
      </mesh>
      <Trees />
    </>
  );
};

const Trees = () => {
  const treePositions = useMemo(() => {
    const positions = [];
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * 400 - 200;
      const z = Math.random() * 400 - 200;
      const y = terrainHeightAtPosition(x, z);
      positions.push(new Vector3(x, y, z));
    }
    return positions;
  }, []);

  return (
    <>
      {treePositions.map((position, index) => (
        <Tree key={index} position={position} />
      ))}
    </>
  );
};

const Tree = ({ position }) => {
  return (
    <group position={position}>
      <mesh position={[0, 2, 0]}>
        <coneGeometry args={[1, 3, 8]} />
        <meshStandardMaterial color="#2d4c1e" />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 1, 8]} />
        <meshStandardMaterial color="#3c2817" />
      </mesh>
    </group>
  );
};

export default Terrain;
