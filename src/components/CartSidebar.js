import React from "react";
import { useCart } from "../context/CartContext";
import "./CartSidebar.css";

const CartSidebar = ({ setCurrentPage }) => {
  const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity } = useCart();
  const total = cartItems.reduce((sum, item) => {
    const price = Number(String(item.price).replace(/\D/g, ''));
    return sum + price * item.quantity;
  }, 0);
  if (!isCartOpen) return null;
  return (
    <div className="cart-sidebar">
      <button className="cart-sidebar__close" onClick={() => setIsCartOpen(false)}>&times;</button>
      <h2 className="cart-sidebar__title">Giỏ hàng</h2>
      {cartItems.length === 0 ? (
        <div className="empty-cart-container sidebar">
            <img src="/images/empty-cart.png" alt="Giỏ hàng trống" />
            <p>Bạn chưa có đơn hàng nào.</p>
            <span>Hãy khám phá các sản phẩm tuyệt vời của chúng tôi!</span>
        </div>
      ) : (
        <div>
          <div className="cart-sidebar__items">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} className="cart-item__img" />
                <div className="cart-item__info">
                  <div className="cart-item__name">{item.name}</div>
                  <div className="cart-item__price">{Number(String(item.price).replace(/\D/g, '')).toLocaleString('vi-VN')} vnđ</div>
                  <div className="cart-item__qty-group">
                    <button className="cart-item__qty-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
                    <span className="cart-item__qty">{item.quantity}</span>
                    <button className="cart-item__qty-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                  <button className="cart-item__remove" onClick={() => removeFromCart(item.id)} title="Xóa">🗑</button>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-sidebar__total-row">
            <span className="cart-sidebar__total-label">Tổng cộng:</span>
            <span className="cart-sidebar__total-value">{total.toLocaleString('vi-VN')} vnđ</span>
          </div>
          <button className="cart-sidebar__checkout" onClick={() => { setIsCartOpen(false); setCurrentPage && setCurrentPage('cart'); }}>Tiến hành thanh toán</button>
        </div>
      )}
    </div>
  );
};

export default CartSidebar; 