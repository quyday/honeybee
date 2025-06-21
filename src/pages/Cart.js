import React from 'react';
import { useCart } from '../context/CartContext';
import './Cart.css';

function Cart({ setCurrentPage }) {
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <main className="wrapperMain_content">
      <nav className="bread-crumb clearfix">
        <div className="container">
          <ul className="breadcrumb">
            <li className="home">
              <a href="/"><span>Trang chủ</span></a>
              <span className="mr_lr">&nbsp;/&nbsp;</span>
            </li>
            <li><strong><span>Giỏ hàng</span></strong></li>
          </ul>
        </div>
      </nav>
      <section className="main-cart-page main-container col1-layout wrap_background">
        <div className="main container cartpcstyle">
          <div className="wrap_background_aside cartbg">
            <div className="header-cart">
              <div className="title-block-page">
                <h1 className="title-module"><span>Giỏ hàng của bạn</span></h1>
              </div>
            </div>
            {/* Desktop table */}
            <div className="cart-page d-xl-block d-none">
              <table className="cart-table">
                <thead>
                  <tr>
                    <th>Hình ảnh</th>
                    <th>Tên sản phẩm</th>
                    <th>Đơn giá</th>
                    <th>Số lượng</th>
                    <th>Thành tiền</th>
                    <th>Xóa</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.length === 0 ? (
                    <tr>
                      <td colSpan={6}>
                        <div className="empty-cart-container">
                           <img src="/images/empty-cart.png" alt="Giỏ hàng trống" />
                           <p>Bạn chưa có sản phẩm nào trong giỏ hàng.</p>
                           <button className="btn btn-warning" onClick={() => setCurrentPage('products')}>Khám phá sản phẩm</button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    cartItems.map(item => (
                      <tr key={item.id} className="cart-table__row">
                        <td><img src={item.image} alt={item.name} className="cart-table__img" /></td>
                        <td className="cart-table__name">{item.name}</td>
                        <td className="cart-table__price">{item.price.toLocaleString('vi-VN')} vnđ</td>
                        <td className="cart-table__qty">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1} className="cart-table__qty-btn">-</button>
                          <span className="cart-table__qty-value">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="cart-table__qty-btn">+</button>
                        </td>
                        <td className="cart-table__total">{item.price.toLocaleString('vi-VN')} vnđ</td>
                        <td>
                          <button onClick={() => removeFromCart(item.id)} title="Xóa" className="cart-table__remove">🗑</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              <div className="cart-summary">
                <span className="cart-summary__label">Tổng tiền thanh toán: </span>
                <span className="cart-summary__total">{total.toLocaleString('vi-VN') + '.000' } vnđ</span>
              </div>
              <div className="cart-actions">
                <button className="btn btn-secondary" onClick={() => setCurrentPage && setCurrentPage('products')}>TIẾP TỤC MUA HÀNG</button>
                <button className="btn btn-warning" onClick={() => setCurrentPage && setCurrentPage('checkout')}>THANH TOÁN NGAY</button>
              </div>
            </div>
            {/* Mobile list */}
            <div className="cart-mobile-page d-block d-xl-none">
              {cartItems.length === 0 ? (
                <div className="empty-cart-container">
                    <img src="/images/empty-cart.png" alt="Giỏ hàng trống" />
                    <p>Bạn chưa có sản phẩm nào trong giỏ hàng.</p>
                    <button className="btn btn-warning" onClick={() => setCurrentPage('products')}>Khám phá sản phẩm</button>
                </div>
              ) : (
                <div style={{padding: 8}}>
                  {cartItems.map(item => (
                    <div key={item.id} style={{display: 'flex', gap: 12, background: '#fff', borderRadius: 12, marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', padding: 12, alignItems: 'center'}}>
                      <img src={item.image} alt={item.name} style={{width: 64, height: 64, borderRadius: 8, objectFit: 'cover'}} />
                      <div style={{flex: 1}}>
                        <div style={{fontWeight: 'bold', fontSize: 16, marginBottom: 4}}>{item.name}</div>
                        <div style={{color: '#ffc107', fontWeight: 'bold', fontSize: 15}}>{item.price.toLocaleString('vi-VN')}vnđ</div>
                        <div style={{display: 'flex', alignItems: 'center', margin: '8px 0'}}>
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1} style={{width: 28, height: 28, borderRadius: '50%', border: '1px solid #ddd', background: '#fff', fontWeight: 'bold', marginRight: 4}}>-</button>
                          <span style={{margin: '0 8px'}}>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{width: 28, height: 28, borderRadius: '50%', border: '1px solid #ddd', background: '#fff', fontWeight: 'bold', marginLeft: 4}}>+</button>
                        </div>
                        <div style={{fontWeight: 'bold', fontSize: 15}}>Thành tiền: {(item.price ).toLocaleString('vi-VN')}vnđ</div>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} title="Xóa" style={{background: 'none', border: 'none', color: '#1e88e5', fontSize: 20, cursor: 'pointer'}}>🗑</button>
                    </div>
                  ))}
                  <div style={{textAlign: 'right', fontWeight: 'bold', marginTop: 12}}>
                    Tổng: <span style={{color: '#ffc107', fontSize: 18}}>{total.toLocaleString('vi-VN')}vnđ</span>
                  </div>
                  <div style={{display: 'flex', gap: 8, marginTop: 16}}>
                    <button className="btn btn-secondary" style={{flex: 1}} onClick={() => setCurrentPage && setCurrentPage('products')}>TIẾP TỤC MUA HÀNG</button>
                    <button className="btn btn-warning" style={{flex: 1}} onClick={() => setCurrentPage && setCurrentPage('checkout')}>THANH TOÁN NGAY</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Cart; 