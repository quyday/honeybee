import React, { useEffect, useState } from 'react';
import './EyeSplash.css';

export default function EyeSplash({ duration = 3000 }) {
  const [hide, setHide] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHide(true), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (hide) return null;

  return (
    <div className="eye-splash-bg">
      <div className="eye-splash-eyes">
        <div className="eye-splash-eye left-eye">
          <div className="eye-brow" />
          <div className="eye-lash" />
          <div className="eye-ball" />
          <div className="eye-lid" />
        </div>
        <div className="eye-splash-eye right-eye">
          <div className="eye-brow" />
          <div className="eye-lash" />
          <div className="eye-ball" />
          <div className="eye-lid" />
        </div>
      </div>
    </div>
  );
} 