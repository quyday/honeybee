import React from 'react';
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
    </>
  );
}

export default App;
