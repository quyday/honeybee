import React, { useEffect, useRef } from 'react';

const beeImg = '/images/bee_1.png'; // Đường dẫn tới icon ong của bạn

export default function BeeCursor() {
  const beeRef = useRef();

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (beeRef.current) {
        beeRef.current.style.left = `${e.clientX + 12}px`;
        beeRef.current.style.top = `${e.clientY + 12}px`;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <img
      ref={beeRef}
      src={beeImg}
      alt="bee"
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: 25,
        height: 25,
        pointerEvents: 'none',
        zIndex: 9999,
        transition: 'transform 0.08s cubic-bezier(0.4,0.2,0.2,1)',
        filter: 'drop-shadow(0 2px 8px #f5af1a88)'
      }}
      draggable={false}
    />
  );
} 