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

function App() {
  return (
    <>
      <EyeSplash duration={3000} />
      <BeeCursor />
      <AuthProvider>
        <CartProvider>
          <div className="App">
            <MainRouter />
          </div>
        </CartProvider>
      </AuthProvider>
    </>
  );
}

export default App;
