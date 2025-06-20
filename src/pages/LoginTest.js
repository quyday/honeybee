import React, { useState } from 'react';

export default function LoginTest() {
  const [email, setEmail] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submit login form', email);
    alert('Submit login form: ' + email);
  };
  return (
    <form onSubmit={handleSubmit} style={{ margin: 40 }}>
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <button type="submit">Đăng nhập</button>
    </form>
  );
}
 