import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

function formatPrice(price) {
  return price.toLocaleString('vi-VN') + ' vnđ';
}

const bgUrl = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80';

function randomOrderId() {
  return 'OD' + Math.floor(100000 + Math.random() * 900000);
}

function CheckoutPage({ setCurrentPage }) {
  const { cartItems } = useCart();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [payment, setPayment] = useState('cod');
  const [msg, setMsg] = useState('');
  const [orderInfo, setOrderInfo] = useState(null); // Thông tin đơn hàng vừa đặt
  const total = cartItems.reduce((sum, item) => sum + Number(item.price.replace(/\D/g, '')) * item.quantity, 0);

  // Hàm kiểm tra tên chỉ chứa chữ cái và khoảng trắng
  const handleNameChange = (e) => {
    const value = e.target.value;
    // Chỉ cho phép chữ cái, khoảng trắng và dấu
    if (value === '' || /^[A-Za-zÀ-ỹ\s]+$/.test(value)) {
      setName(value);
    }
  };

  // Hàm kiểm tra số điện thoại chỉ chứa số
  const handlePhoneChange = (e) => {
    const value = e.target.value;
    // Chỉ cho phép số và giới hạn độ dài là 10 số
    if (value === '' || (/^\d+$/.test(value) && value.length <= 10)) {
      setPhone(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !phone || !address) {
      setMsg('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    // Kiểm tra định dạng số điện thoại
    if (!/^(0[3|5|7|8|9])+([0-9]{8})$/.test(phone)) {
      setMsg('Số điện thoại không hợp lệ! Vui lòng nhập số điện thoại 10 số bắt đầu bằng 03, 05, 07, 08, 09');
      return;
    }

    // Tạo đơn hàng
    const orderId = randomOrderId();
    const order = {
      id: orderId,
      items: cartItems,
      total,
      name,
      phone,
      address,
      payment,
      date: new Date().toLocaleString('vi-VN'),
    };
    // Lưu vào localStorage
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.unshift(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    setOrderInfo(order);
    setMsg('Đặt hàng thành công!');
    // Không chuyển trang ngay, hiện sidebar
  };

  // Style giống profile
  const bgStyle = {
    minHeight: '100vh',
    background: `url(${bgUrl}) center/cover no-repeat fixed`,
    padding: '40px 0',
  };
  const containerStyle = {
    display: 'flex',
    maxWidth: 950,
    margin: '40px auto',
    background: 'rgba(255,251,231,0.97)',
    borderRadius: 20,
    boxShadow: '0 4px 32px #ffe08255',
    minHeight: 480,
    overflow: 'hidden',
    gap: 40,
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'center',
  };
  const leftCol = { flex: 1, minWidth: 340, padding: '40px 0 40px 40px' };
  const rightCol = { flex: 1, minWidth: 320, background: '#fffbe7', borderRadius: 14, boxShadow: '0 1px 8px #ffe08233', padding: 28, margin: '40px 40px 40px 0' };
  const sidebarStyle = {
    position: 'fixed',
    top: 145,
    right: 0,
    width: 370,
    height: '60vh',
    background: '#fff',
    boxShadow: '-2px 0 16px #ffe08299',
    zIndex: 1001,
    padding: 32,
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 24,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    animation: 'slideInRight 0.3s',
  };

  return (
    <div style={bgStyle}>
      <div style={containerStyle}>
        <div style={leftCol}>
          <h2 style={{ color: '#b8860b', fontWeight: 900, fontSize: 32, marginBottom: 28, textAlign: 'center', letterSpacing: 1 }}>Thanh toán đơn hàng</h2>
          <div style={{ fontWeight: 'bold', marginBottom: 14, fontSize: 18 }}>Sản phẩm</div>
          <div style={{ background: '#fffbe7', borderRadius: 14, boxShadow: '0 1px 8px #ffe08233', padding: 18 }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, borderRadius: 10, overflow: 'hidden', fontSize: 15 }}>
              <thead>
                <tr style={{ background: '#f5af1a', color: '#fff', fontWeight: 700 }}>
                  <th style={{ padding: 10, borderTopLeftRadius: 10 }}>Hình ảnh</th>
                  <th style={{ padding: 10 }}>Tên</th>
                  <th style={{ padding: 10 }}>Giá</th>
                  <th style={{ padding: 10 }}>SL</th>
                  <th style={{ padding: 10, borderTopRightRadius: 10 }}>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map(item => (
                  <tr key={item.id} style={{ background: '#fff', borderBottom: '1px solid #ffe082' }}>
                    <td style={{ padding: 10, textAlign: 'center' }}><img src={item.image} alt={item.name} style={{ width: 54, height: 54, borderRadius: 8, objectFit: 'cover', boxShadow: '0 1px 4px #ffe08255' }} /></td>
                    <td style={{ padding: 10 }}>{item.name}</td>
                    <td style={{ padding: 10, color: '#f5af1a', fontWeight: 'bold', whiteSpace: 'nowrap' }}>{Number(item.price.replace(/\D/g, '')).toLocaleString('vi-VN')} vnđ</td>
                    <td style={{ padding: 10, textAlign: 'center' }}>{item.quantity}</td>
                    <td style={{ padding: 10, color: '#b8860b', fontWeight: 'bold', whiteSpace: 'nowrap' }}>{(Number(item.price.replace(/\D/g, '')) * item.quantity).toLocaleString('vi-VN')} vnđ</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ textAlign: 'right', fontWeight: 'bold', fontSize: 18, color: '#f5af1a', marginTop: 10 }}>
              Tổng cộng: {formatPrice(total)}
            </div>
          </div>
        </div>
        <form style={rightCol} onSubmit={handleSubmit}>
          <div style={{ fontWeight: 'bold', marginBottom: 12, fontSize: 18 }}>Thông tin nhận hàng</div>
          <input 
            value={name} 
            onChange={handleNameChange}
            placeholder="Tên người nhận (chỉ nhập chữ)" 
            style={{ width: '100%', padding: 12, marginBottom: 14, borderRadius: 8, border: '2px solid #ffe082', background: '#fff', fontSize: 16, outline: 'none', color: '#333', transition: 'border 0.2s' }} 
          />
          <input 
            value={phone} 
            onChange={handlePhoneChange}
            placeholder="Số điện thoại (10 số)" 
            style={{ width: '100%', padding: 12, marginBottom: 14, borderRadius: 8, border: '2px solid #ffe082', background: '#fff', fontSize: 16, outline: 'none', color: '#333', transition: 'border 0.2s' }} 
          />
          <input 
            value={address} 
            onChange={e => setAddress(e.target.value)} 
            placeholder="Địa chỉ cụ thể" 
            style={{ width: '100%', padding: 12, marginBottom: 14, borderRadius: 8, border: '2px solid #ffe082', background: '#fff', fontSize: 16, outline: 'none', color: '#333', transition: 'border 0.2s' }} 
          />
          <div style={{ fontWeight: 'bold', margin: '16px 0 8px', fontSize: 16 }}>Phương thức thanh toán</div>
          <select value={payment} onChange={e => setPayment(e.target.value)} style={{ width: '100%', padding: 12, borderRadius: 8, border: '2px solid #ffe082', background: '#fff', fontSize: 16, marginBottom: 18, color: '#333' }}>
            <option value="cod">Thanh toán khi nhận hàng (COD)</option>
            <option value="bank">Chuyển khoản ngân hàng</option>
            <option value="momo">Ví MoMo</option>
          </select>
          <button type="submit" style={{ width: '100%', padding: 14, background: '#f5af1a', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 'bold', fontSize: 18, marginTop: 8, boxShadow: '0 2px 8px #ffe08255', letterSpacing: 1, cursor: 'pointer', transition: 'background 0.2s' }}>Thanh toán</button>
          {msg && <div style={{ color: msg.includes('thành công') ? 'green' : 'red', marginTop: 14, fontWeight: 500 }}>{msg}</div>}
        </form>
      </div>
      {/* Sidebar đơn hàng */}
      {orderInfo && (
        <div style={sidebarStyle}>
          <button
            onClick={() => setOrderInfo(null)}
            style={{
              position: 'absolute',
              top: 18,
              right: 18,
              background: 'transparent',
              border: 'none',
              fontSize: 26,
              color: '#b8860b',
              cursor: 'pointer',
              zIndex: 2,
              padding: 0,
              lineHeight: 1
            }}
            title="Đóng"
          >
            &#10006;
          </button>
          <div style={{ fontWeight: 'bold', fontSize: 20, color: '#b8860b', marginBottom: 12 }}>Đặt hàng thành công!</div>
          <div style={{ fontWeight: 'bold', marginBottom: 8 }}>Mã đơn hàng: <span style={{ color: '#f5af1a' }}>{orderInfo.id}</span></div>
          <div style={{ marginBottom: 8 }}>Tên người nhận: <b>{orderInfo.name}</b></div>
          <div style={{ marginBottom: 8 }}>SĐT: <b>{orderInfo.phone}</b></div>
          <div style={{ marginBottom: 8 }}>Địa chỉ: <b>{orderInfo.address}</b></div>
          <div style={{ marginBottom: 8 }}>Phương thức: <b>{orderInfo.payment === 'cod' ? 'COD' : orderInfo.payment === 'bank' ? 'Chuyển khoản' : 'MoMo'}</b></div>
          <div style={{ marginBottom: 8 }}>Tổng tiền: <span style={{ color: '#f5af1a', fontWeight: 'bold' }}>{formatPrice(orderInfo.total)}</span></div>
          <div style={{ margin: '16px 0 8px', fontWeight: 'bold' }}>Sản phẩm:</div>
          <ul style={{ paddingLeft: 18, marginBottom: 16 }}>
            {orderInfo.items.map(item => (
              <li key={item.id}>{item.name} x {item.quantity} ({formatPrice(item.price * item.quantity)})</li>
            ))}
          </ul>
          <button style={{ background: '#f5af1a', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 'bold', fontSize: 16, marginTop: 8, cursor: 'pointer' }} onClick={() => setCurrentPage && setCurrentPage('profile')}>Xem lịch sử đơn hàng</button>
        </div>
      )}
    </div>
  );
}

export default CheckoutPage; 