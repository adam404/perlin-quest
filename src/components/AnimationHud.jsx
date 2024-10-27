import React from 'react';

function AnimationHUD({ animations, currentAnimation, onAnimationChange }) {
  return (
    <div style={{ position: 'absolute', top: 10, left: 10, color: 'white' }}>
      <h3>Animations:</h3>
      {animations && animations.map((anim) => (
        <button 
          key={anim} 
          onClick={() => onAnimationChange(anim)}
          style={{ 
            backgroundColor: anim === currentAnimation ? 'lightblue' : 'white',
            margin: '5px'
          }}
        >
          {anim}
        </button>
      ))}
      <p>Current Animation: {currentAnimation}</p>
    </div>
  );
}

export default AnimationHUD;
