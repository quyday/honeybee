import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import CartHeader from './components/CartHeader';
import MainRouter from './MainRouter';
import BeeCursor from './components/BeeCursor';
import EyeSplash from './components/EyeSplash';
import MusicPlayer from './components/MusicPlayer';
import MobileMusicPlayer from './components/MobileMusicPlayer';
import FlowerEffect from './components/FlowerEffect';
import FloatingActions from './components/FloatingActions';

function App() {
  const [fallingGift, setFallingGift] = useState(null);
  const [giftImgError, setGiftImgError] = useState(false);
  const [umbrellaImgError, setUmbrellaImgError] = useState(false);
  const [autoGift, setAutoGift] = useState(() => localStorage.getItem('autoGiftOff') !== 'true');
  const randomGiftInterval = useRef();

  // Lắng nghe voucher admin phát và autoGiftOff
  useEffect(() => {
    function handleStorage(e) {
      if (e.key === 'pendingGiftVoucher') {
        if (e.newValue) {
          try {
            const voucher = JSON.parse(e.newValue);
            setFallingGift({
              id: 'admin-' + voucher.id,
              left: Math.random() * 90 + 'vw',
              type: voucher.type,
              value: voucher.value,
              code: voucher.code,
              opened: false,
              fromAdmin: true
            });
            setGiftImgError(false);
            setUmbrellaImgError(false);
          } catch {}
        } else {
          // Nếu voucher đã nhận, xóa hộp quà admin
          setFallingGift(g => g && g.fromAdmin ? null : g);
        }
      } else if (e.key === 'autoGiftOff') {
        setAutoGift(localStorage.getItem('autoGiftOff') !== 'true');
      }
    }
    window.addEventListener('storage', handleStorage);
    // Khi load trang, kiểm tra luôn
    const pending = localStorage.getItem('pendingGiftVoucher');
    if (pending) {
      try {
        const voucher = JSON.parse(pending);
        setFallingGift({
          id: 'admin-' + voucher.id,
          left: Math.random() * 90 + 'vw',
          type: voucher.type,
          value: voucher.value,
          code: voucher.code,
          opened: false,
          fromAdmin: true
        });
      } catch {}
    }
    setAutoGift(localStorage.getItem('autoGiftOff') !== 'true');
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Hộp quà random mỗi 30 phút (chỉ khi không có hộp quà admin và autoGift bật)
  useEffect(() => {
    // Clear interval cũ nếu có
    if (randomGiftInterval.current) {
      clearInterval(randomGiftInterval.current);
      randomGiftInterval.current = null;
    }
    // Nếu đang tắt autoGift hoặc có hộp quà admin, không tạo interval mới
    if (!autoGift || (fallingGift && fallingGift.fromAdmin)) {
      setFallingGift(g => (g && !g.fromAdmin ? null : g)); // Ẩn hộp quà random nếu đang tắt
      return;
    }
    // Hàm tạo hộp quà random
    const dropGift = () => {
      const types = ['freeship', 'percent', 'amount'];
      const type = types[Math.floor(Math.random() * types.length)];
      let value = '';
      if (type === 'percent') value = String(Math.floor(Math.random() * 40) + 1);
      if (type === 'amount') value = String((Math.floor(Math.random() * 20) + 1) * 10000);
      setFallingGift({
        id: Date.now() + '-' + Math.random(),
        left: Math.random() * 90 + 'vw',
        type,
        value,
        opened: false
      });
      setGiftImgError(false);
      setUmbrellaImgError(false);
      setTimeout(() => setFallingGift(g => (g && !g.fromAdmin ? null : g)), 14000);
    };
    // Rơi ngay 1 hộp khi bật
    dropGift();
    // Sau đó cứ 30 phút rơi 1 hộp
    randomGiftInterval.current = setInterval(dropGift, 30 * 60 * 1000);
    return () => {
      if (randomGiftInterval.current) clearInterval(randomGiftInterval.current);
    };
  }, [autoGift, fallingGift && fallingGift.fromAdmin]);

  const handleGiftClick = (gift) => {
    if (!gift || gift.opened) return;
    // Nếu là hộp quà admin phát
    if (gift.fromAdmin && gift.code) {
      const vouchers = JSON.parse(localStorage.getItem('vouchers') || '[]');
      vouchers.push({
        id: Date.now(),
        code: gift.code,
        type: gift.type,
        value: gift.value,
        status: 'active',
        user: '',
        expiry: '',
        fromGift: true
      });
      localStorage.setItem('vouchers', JSON.stringify(vouchers));
      setFallingGift(g => g ? { ...g, opened: true } : null);
      localStorage.removeItem('pendingGiftVoucher');
      alert('Bạn vừa nhận được voucher: ' + gift.code);
      return;
    }
    // Hộp quà random như cũ
    const vouchers = JSON.parse(localStorage.getItem('vouchers') || '[]');
    const code = 'GIFT' + Math.floor(Math.random() * 1000000);
    vouchers.push({
      id: Date.now(),
      code,
      type: gift.type,
      value: gift.value,
      status: 'active',
      user: '',
      expiry: '',
      fromGift: true
    });
    localStorage.setItem('vouchers', JSON.stringify(vouchers));
    setFallingGift(g => g ? { ...g, opened: true } : null);
    alert('Bạn vừa nhận được voucher: ' + code);
  };

  return (
    <>
      <FlowerEffect />
      <EyeSplash duration={3000} />
      <BeeCursor />
      <AuthProvider>
        <CartProvider>
          <div className="App">
            <MainRouter />
          </div>
        </CartProvider>
      </AuthProvider>
      <MusicPlayer />
      <MobileMusicPlayer />
      <FloatingActions />
      {fallingGift && (
        <div
          key={fallingGift.id}
          onClick={() => handleGiftClick(fallingGift)}
          style={{
            position: 'fixed',
            top: 0,
            left: fallingGift.left,
            zIndex: 9999,
            cursor: 'pointer',
            animation: `fallGift 12s linear 0s 1`,
            pointerEvents: fallingGift.opened ? 'none' : 'auto',
            opacity: fallingGift.opened ? 0.5 : 1
          }}
        >
          {!giftImgError ? (
            <img
              src="/images/giftbox.png"
              alt="Gift"
              style={{ width: 60, height: 60, filter: fallingGift.opened ? 'grayscale(1)' : 'none' }}
              onError={() => setGiftImgError(true)}
            />
          ) : (
            <span style={{ fontSize: 48 }}>🎁</span>
          )}
          {!umbrellaImgError ? (
            <img
              src="/images/umbrella.png"
              alt="Umbrella"
              style={{ width: 70, height: 70, position: 'absolute', top: -40, left: -5 }}
              onError={() => setUmbrellaImgError(true)}
            />
          ) : (
            <span style={{ fontSize: 48, position: 'absolute', top: -40, left: -5 }}>☂️</span>
          )}
        </div>
      )}
      <style>{`
        @keyframes fallGift {
          0% { top: -80px; }
          100% { top: 90vh; }
        }
      `}</style>
    </>
  );
}

export default App;
