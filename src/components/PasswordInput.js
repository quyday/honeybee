import React, { useState } from 'react';

const eyeStyle = {
  position: 'absolute',
  right: 12,
  top: '50%',
  transform: 'translateY(-50%)',
  cursor: 'pointer',
  color: '#b8860b',
  fontSize: 18,
  zIndex: 10,
};

export default function PasswordInput({ value, onChange, placeholder, style, ...props }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: 'relative', width: '100%', marginBottom: 16 }}>
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{ ...style, paddingRight: 38, display: 'block', width: '100%' }}
        {...props}
      />
      <span style={eyeStyle} onClick={() => setShow(v => !v)}>
        {show ? '👁️' : '🙈'}
      </span>
      
    </div>
  );
} 