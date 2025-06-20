import React, { useEffect, useState } from 'react';

function FlowerEffect() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const update = () => setEnabled(localStorage.getItem('flowerEffect') === 'true');
    update();
    window.addEventListener('storage', update);
    window.addEventListener('flower-effect-toggle', update);
    return () => {
      window.removeEventListener('storage', update);
      window.removeEventListener('flower-effect-toggle', update);
    };
  }, []);

  if (!enabled) return null;

  const leaves = Array.from({ length: 15 });
  return (
    <div className="leaves-container" style={{ pointerEvents: 'none', position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 999 }}>
      {leaves.map((_, i) => (
        <div
          key={i}
          className="leaf"
          style={{
            left: `${Math.random() * 100}vw`,
            animationDelay: `${Math.random() * 15}s`,
            animationDuration: `${5 + Math.random() * 10}s`,
            position: 'absolute',
            top: 0,
            width: 32,
            height: 32,
            background: 'url(/images/bee_1.png) no-repeat center/contain',
            opacity: 0.7,
            pointerEvents: 'none',
          }}
        />
      ))}
    </div>
  );
}

export default FlowerEffect; 