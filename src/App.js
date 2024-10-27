import React, { useRef, useState, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sky, Grid, PerspectiveCamera, AxesHelper, Plane } from "@react-three/drei";
import Terrain from "./components/Terrain";
import Character from "./components/Character";
import CameraController from "./components/CameraController";
import HUD from "./components/Hud";
import AnimationHUD from "./components/AnimationHud";
import { KeyboardControls } from "@react-three/drei";

function App() {
  const characterRef = useRef();
  const cameraControlRef = useRef();
  const [animations, setAnimations] = useState([]);
  const [currentAnimation, setCurrentAnimation] = useState('Idle');

  const handleCharacterLoad = useCallback((availableAnimations) => {
    console.log("handleCharacterLoad called with:", availableAnimations);
    if (Array.isArray(availableAnimations) && availableAnimations.length > 0) {
      console.log("Setting animations:", availableAnimations);
      setAnimations(availableAnimations);
      setCurrentAnimation(availableAnimations[0]);
    } else {
      console.warn("Received invalid or empty animations data:", availableAnimations);
      setAnimations([]);
    }
  }, []);

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <Canvas shadows>
        <KeyboardControls
          map={[
            { name: "forward", keys: ["ArrowUp", "w", "W"] },
            { name: "backward", keys: ["ArrowDown", "s", "S"] },
            { name: "left", keys: ["ArrowLeft", "a", "A"] },
            { name: "right", keys: ["ArrowRight", "d", "D"] },
            { name: "jump", keys: ["Space"] },
          ]}
        >
          <Sky sunPosition={[100, 10, 100]} />
          <ambientLight intensity={0.5} />
          <directionalLight
            castShadow
            position={[2.5, 8, 5]}
            intensity={1.5}
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-camera-far={50}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
          />
          <Terrain />

          <CameraController ref={cameraControlRef} characterRef={characterRef} />

          <Character 
            ref={characterRef} 
            onLoad={handleCharacterLoad} 
            currentAnimation={currentAnimation}
            cameraControlRef={cameraControlRef}
          />

          <Grid infiniteGrid />
          <axesHelper args={[5]} />
          {/* <PerspectiveCamera makeDefault position={[0, 2, 5]} /> */}

          <Plane 
            args={[10, 10]} 
            rotation={[-Math.PI / 2, 0, 0]} 
            position={[0, 0, 0]}
            receiveShadow
          >
            <meshStandardMaterial color="#cccccc" />
          </Plane> 
        </KeyboardControls>
      </Canvas>
      <HUD characterRef={characterRef} />
      {animations.length > 0 ? (
        <AnimationHUD 
          animations={animations} 
          currentAnimation={currentAnimation}
          onAnimationChange={setCurrentAnimation}
        />
      ) : (
        <div>No animations available</div>
      )}
    </div>
  );
}

export default App;
