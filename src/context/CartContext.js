import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Lấy giỏ hàng của user hiện tại khi user thay đổi
  useEffect(() => {
    if (user) {
      const userCartKey = `cartItems_${user.email}`;
      const stored = localStorage.getItem(userCartKey);
      setCartItems(stored ? JSON.parse(stored) : []);
    } else {
      // Khi logout, xóa giỏ hàng hiện tại
      setCartItems([]);
    }
  }, [user]);

  // Lưu giỏ hàng vào localStorage theo user
  useEffect(() => {
    if (user && cartItems.length > 0) {
      const userCartKey = `cartItems_${user.email}`;
      localStorage.setItem(userCartKey, JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const exist = prev.find(item => item.id === product.id);
      if (exist) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        isCartOpen,
        setIsCartOpen
      }}
    >
      {children}
    </CartContext.Provider>
  );
}; 