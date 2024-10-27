import React from 'react';

const HUD = ({ position, velocity, isOnGround, health, firePower }) => {
  return (
    <div style={{
      position: 'absolute',
      top: 10,
      left: 10,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* <div>Position: X: {position.x.toFixed(2)}, Y: {position.y.toFixed(2)}, Z: {position.z.toFixed(2)}</div>
      <div>Velocity Y: {velocity.y.toFixed(2)}</div> */}
      <div>On Ground: {isOnGround ? 'Yes' : 'No'}</div>
      <div>Health: {health}</div>
      {/* <div>Fire Power: {firePower.toFixed(0)}</div> */}
    </div>
  );
};

export default HUD;
