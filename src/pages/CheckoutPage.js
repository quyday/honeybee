import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FaShoppingCart, FaMapMarkerAlt, FaCreditCard, FaCheckCircle, FaUser, FaPhone, FaHome, FaMoneyBillWave, FaTruck, FaTicketAlt, FaRegStickyNote, FaWallet, FaQrcode } from 'react-icons/fa';

function formatPrice(price) {
  return price.toLocaleString('vi-VN') + ' vnđ';
}

const bgUrl = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80';


function randomOrderId() {
  return 'OD' + Math.floor(100000 + Math.random() * 900000);
}

function CheckoutPage({ setCurrentPage }) {
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [payment, setPayment] = useState('cod');
  const [msg, setMsg] = useState('');
  const [orderInfo, setOrderInfo] = useState(null); // Thông tin đơn hàng vừa đặt
  const total = cartItems.reduce((sum, item) => sum + Number(String(item.price).replace(/\D/g, '')) * item.quantity, 0);
  const [voucherCode, setVoucherCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [voucherMsg, setVoucherMsg] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setAddress(user.address || '');
    }
  }, [user]);

  // Thêm Google Fonts Raleway vào head nếu chưa có
  useEffect(() => {
    const id = 'raleway-font-link';
    if (!document.getElementById(id)) {
      const link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css?family=Raleway:400,500,600,700,800&display=swap';
      document.head.appendChild(link);
    }
  }, []);

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

  const handleSubmit = async (e) => {
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
      email: user ? user.email : 'guest',
      voucher: appliedVoucher ? appliedVoucher.code : '',
      discount: discount,
    };

    // Gửi đơn hàng về backend
    try {
      const res = await fetch('http://localhost:5001/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      });
      const data = await res.json();
      if (res.ok) {
        setMsg('Đặt hàng thành công!');
        setOrderInfo(order);
        clearCart();
        // Đánh dấu voucher đã dùng (xóa hẳn khỏi localStorage)
        if (appliedVoucher) {
          let vouchers = JSON.parse(localStorage.getItem('vouchers') || '[]');
          vouchers = vouchers.filter(v => v.code !== appliedVoucher.code);
          localStorage.setItem('vouchers', JSON.stringify(vouchers));
          setAppliedVoucher(null);
          setVoucherCode('');
          setDiscount(0);
        }
      } else {
        setMsg('Lỗi gửi email: ' + data.message);
      }
    } catch (err) {
      setMsg('Lỗi kết nối tới server!');
    }

    // Lưu vào localStorage như cũ
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.unshift(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    window.dispatchEvent(new Event('orders-updated'));
  };

  // Hàm áp dụng voucher
  const handleApplyVoucher = () => {
    if (!voucherCode) {
      setVoucherMsg('Vui lòng nhập mã voucher!');
      setDiscount(0);
      setAppliedVoucher(null);
      return;
    }
    const vouchers = JSON.parse(localStorage.getItem('vouchers') || '[]');
    const found = vouchers.find(v => v.code.trim().toUpperCase() === voucherCode.trim().toUpperCase() && v.status === 'active');
    if (!found) {
      setVoucherMsg('Mã không hợp lệ hoặc đã hết hạn!');
      setDiscount(0);
      setAppliedVoucher(null);
      return;
    }
    setAppliedVoucher(found);
    if (found.type === 'percent') {
      const d = Math.floor(total * (Number(found.value) / 100));
      setDiscount(d);
      setVoucherMsg(`Áp dụng thành công! Giảm ${found.value}% (${d.toLocaleString('vi-VN')} vnđ)`);
    } else if (found.type === 'amount') {
      setDiscount(Number(found.value));
      setVoucherMsg(`Áp dụng thành công! Giảm ${Number(found.value).toLocaleString('vi-VN')} vnđ`);
    } else if (found.type === 'freeship') {
      setDiscount(0);
      setVoucherMsg('Áp dụng thành công! Freeship');
    }
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
    height: 'auto',
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

  // Stepper tiến trình hiện đại với icon
  const steps = [
    { label: 'Giỏ hàng', icon: <FaShoppingCart /> },
    { label: 'Địa chỉ', icon: <FaMapMarkerAlt /> },
    { label: 'Thanh toán', icon: <FaCreditCard /> },
    { label: 'Hoàn tất', icon: <FaCheckCircle /> },
  ];
  const currentStep = 2; // Thanh toán
  // Animated counter cho tổng tiền
  const [displayTotal, setDisplayTotal] = useState(0);
  useEffect(() => {
    let start = 0;
    if (total === 0) { setDisplayTotal(0); return; }
    const duration = 600;
    const step = Math.ceil(total / (duration / 16));
    const interval = setInterval(() => {
      start += step;
      if (start >= total) {
        setDisplayTotal(total);
        clearInterval(interval);
      } else {
        setDisplayTotal(start);
      }
    }, 16);
    return () => clearInterval(interval);
  }, [total]);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f7f7fa',
      fontFamily: 'Raleway, sans-serif',
    }}>
      {/* Stepper tiến trình hiện đại */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 24,
        padding: '28px 0 14px 0',
        fontWeight: 600,
        fontSize: 18,
        letterSpacing: '1px',
        background: 'rgba(255,255,255,0.7)',
        borderRadius: 16,
        margin: '0 0 16px 0',
        boxShadow: '0 2px 12px #ffe08233',
        lineHeight: 1.7,
      }}>
        {steps.map((step, idx) => (
          <div key={step.label} style={{
            display: 'flex', alignItems: 'center',
            color: idx <= currentStep ? '#f5af1a' : '#bdbdbd',
            fontWeight: idx === currentStep ? 900 : 600,
            transition: 'color 0.2s',
          }}>
            <span style={{
              width: 38, height: 38, borderRadius: '50%',
              background: idx <= currentStep ? 'linear-gradient(135deg,#f5af1a,#ffe082)' : '#eee',
              color: idx <= currentStep ? '#fff' : '#bdbdbd',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginRight: 10, fontWeight: 700, fontSize: 20, boxShadow: idx === currentStep ? '0 2px 8px #ffe08299' : 'none',
              border: idx === currentStep ? '2px solid #b8860b' : '2px solid #eee',
              transition: 'all 0.2s',
            }}>{step.icon}</span>
            {step.label}
            {idx < steps.length - 1 && <span style={{ margin: '0 14px', color: '#ffe082', fontWeight: 900, fontSize: 22 }}>&rarr;</span>}
          </div>
        ))}
      </div>
      <style>{`
        @media (max-width: 900px) {
          .checkout-main {
            flex-direction: column !important;
            gap: 0 !important;
            margin: 0 !important;
            max-width: 100vw !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            padding: 0 !important;
          }
          .checkout-left, .checkout-right {
            min-width: 0 !important;
            width: 100vw !important;
            padding: 18px 8px !important;
            margin: 0 !important;
            border-radius: 0 !important;
            box-shadow: none !important;
          }
        }
      `}</style>
      <div className="checkout-main" style={{
        display: 'flex',
        maxWidth: 1200,
        margin: '24px auto 0 auto',
        gap: 32,
        alignItems: 'flex-start',
        justifyContent: 'center',
      }}>
        {/* Cột trái: Địa chỉ, sản phẩm, vận chuyển, voucher, ghi chú */}
        <div className="checkout-left" style={{ flex: 2, minWidth: 380 }}>
          {/* Địa chỉ nhận hàng */}
          <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #eee', padding: 18, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 14, lineHeight: 1.7 }}>
            <FaMapMarkerAlt style={{ color: '#f5af1a', fontSize: 20, marginRight: 6 }} />
            <div style={{ fontWeight: 600, fontSize: 16, color: '#b8860b', fontFamily: 'Raleway, sans-serif', lineHeight: 1.7 }}>Địa chỉ nhận hàng:</div>
            <div style={{ fontWeight: 500, fontSize: 15, color: '#333', fontFamily: 'Raleway, sans-serif', lineHeight: 1.7 }}>{name || 'Chưa nhập tên'} | {phone || 'Chưa nhập SĐT'} | {address || 'Chưa nhập địa chỉ'}</div>
          </div>
          {/* Sản phẩm */}
          <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #eee', padding: 18, marginBottom: 14 }}>
            <div style={{ fontWeight: 700, fontSize: 18, color: '#b8860b', marginBottom: 10, fontFamily: 'Raleway, sans-serif', lineHeight: 1.7 }}>Sản phẩm</div>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontSize: 15, lineHeight: 1.7 }}>
              <thead>
                <tr style={{ background: '#f5af1a', color: '#fff', fontWeight: 600, fontSize: 15, lineHeight: 1.7 }}>
                  <th style={{ padding: 10, borderTopLeftRadius: 10 }}>Hình ảnh</th>
                  <th style={{ padding: 10, fontSize: 15 }}>Tên</th>
                  <th style={{ padding: 10, fontSize: 15 }}>Giá</th>
                  <th style={{ padding: 10, fontSize: 15 }}>SL</th>
                  <th style={{ padding: 10, borderTopRightRadius: 10, fontSize: 15 }}>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map(item => (
                  <tr key={item.id} style={{ background: '#fff', borderBottom: '1px solid #f7f7fa', transition: 'background 0.2s', cursor: 'pointer', lineHeight: 1.7 }}
                    onMouseOver={e => e.currentTarget.style.background = '#fffde7'}
                    onMouseOut={e => e.currentTarget.style.background = '#fff'}
                  >
                    <td style={{ padding: 10, textAlign: 'center' }}><img src={item.image} alt={item.name} style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover', boxShadow: '0 2px 8px #ffe08255', border: '2px solid #f5af1a' }} /></td>
                    <td style={{ padding: 10, fontWeight: 500, fontSize: 15, fontFamily: 'Raleway, sans-serif', lineHeight: 1.7 }}>{item.name}</td>
                    <td style={{ padding: 10, color: '#f5af1a', fontWeight: 600, whiteSpace: 'nowrap', fontSize: 15, fontFamily: 'Raleway, sans-serif', lineHeight: 1.7 }}>{Number(String(item.price).replace(/\D/g, '')).toLocaleString('vi-VN')} vnđ</td>
                    <td style={{ padding: 10, textAlign: 'center', fontWeight: 500, fontSize: 15, fontFamily: 'Raleway, sans-serif', lineHeight: 1.7 }}>{item.quantity}</td>
                    <td style={{ padding: 10, color: '#b8860b', fontWeight: 600, whiteSpace: 'nowrap', fontSize: 15, fontFamily: 'Raleway, sans-serif', lineHeight: 1.7 }}>{(Number(String(item.price).replace(/\D/g, '')) * item.quantity).toLocaleString('vi-VN')} vnđ</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Vận chuyển */}
          <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #eee', padding: 16, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10, lineHeight: 1.7 }}>
            <FaTruck style={{ color: '#f5af1a', fontSize: 18, marginRight: 6 }} />
            <div style={{ fontWeight: 600, fontSize: 15, color: '#333', fontFamily: 'Raleway, sans-serif', lineHeight: 1.7 }}>Phương thức vận chuyển: <span style={{ color: '#b8860b', fontWeight: 700 }}>Nhanh</span></div>
            <span style={{ marginLeft: 'auto', color: '#f5af1a', fontWeight: 700, fontSize: 15, fontFamily: 'Raleway, sans-serif', lineHeight: 1.7 }}>Miễn phí</span>
          </div>
          {/* Voucher */}
          <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #eee', padding: 16, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10, lineHeight: 1.7 }}>
            <FaTicketAlt style={{ color: '#f5af1a', fontSize: 18, marginRight: 6 }} />
            <input
              value={voucherCode}
              onChange={e => setVoucherCode(e.target.value)}
              placeholder="Nhập mã giảm giá (nếu có)"
              style={{ flex: 1, padding: 10, borderRadius: 8, border: '1.5px solid #ffe082', fontSize: 15, outline: 'none', fontFamily: 'Raleway, sans-serif', lineHeight: 1.7 }}
            />
            <button
              type="button"
              onClick={handleApplyVoucher}
              style={{ background: '#f5af1a', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 600, fontSize: 15, marginLeft: 8, cursor: 'pointer', fontFamily: 'Raleway, sans-serif', lineHeight: 1.7 }}
            >Áp dụng</button>
            {voucherMsg && <span style={{ color: voucherMsg.includes('thành công') ? 'green' : 'red', marginLeft: 8, fontSize: 14 }}>{voucherMsg}</span>}
          </div>
          {/* Ghi chú */}
          <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #eee', padding: 16, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10, lineHeight: 1.7 }}>
            <FaRegStickyNote style={{ color: '#f5af1a', fontSize: 18, marginRight: 6 }} />
            <input placeholder="Lưu ý cho người bán..." style={{ flex: 1, padding: 10, borderRadius: 8, border: '1.5px solid #ffe082', fontSize: 15, outline: 'none', fontFamily: 'Raleway, sans-serif', lineHeight: 1.7 }} />
          </div>
        </div>
        {/* Cột phải: Tóm tắt đơn hàng, phương thức thanh toán, nút đặt hàng */}
        <div className="checkout-right" style={{ flex: 1, minWidth: 320, background: '#fff', borderRadius: 14, boxShadow: '0 2px 8px #eee', padding: 24, margin: '0 0 0 0', display: 'flex', flexDirection: 'column', gap: 0 }}>
          {/* Thông tin nhận hàng */}
          <div style={{ fontWeight: 700, marginBottom: 16, fontSize: 19, color: '#b8860b', letterSpacing: '1px', textShadow: '0 2px 8px #ffe08233', display: 'flex', alignItems: 'center', gap: 7, fontFamily: 'Raleway, sans-serif', lineHeight: 1.7 }}>
            <FaUser style={{ color: '#f5af1a', fontSize: 19 }} /> Thông tin nhận hàng
          </div>
          <div style={{ marginBottom: 14, color: '#333', fontWeight: 600, fontSize: 15, fontFamily: 'Raleway, sans-serif', lineHeight: 1.7 }}>
            <div><FaUser style={{ color: '#b8860b', marginRight: 6 }} /> {name || 'Chưa nhập tên'}</div>
            <div><FaPhone style={{ color: '#b8860b', marginRight: 6 }} /> {phone || 'Chưa nhập SĐT'}</div>
            <div><FaHome style={{ color: '#b8860b', marginRight: 6 }} /> {address || 'Chưa nhập địa chỉ'}</div>
          </div>
          {/* Form nhập thông tin nhận hàng */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <input value={name} onChange={handleNameChange} placeholder="Tên người nhận (chỉ nhập chữ)" style={{ width: '100%', padding: 12, marginBottom: 12, borderRadius: 8, border: '2px solid #ffe082', background: '#fff', fontSize: 15, outline: 'none', color: '#333', transition: 'border 0.2s', fontWeight: 600, fontFamily: 'Raleway, sans-serif', lineHeight: 1.7 }} />
            <input value={phone} onChange={handlePhoneChange} placeholder="Số điện thoại (10 số)" style={{ width: '100%', padding: 12, marginBottom: 12, borderRadius: 8, border: '2px solid #ffe082', background: '#fff', fontSize: 15, outline: 'none', color: '#333', transition: 'border 0.2s', fontWeight: 600, fontFamily: 'Raleway, sans-serif', lineHeight: 1.7 }} />
            <input value={address} onChange={e => setAddress(e.target.value)} placeholder="Địa chỉ cụ thể" style={{ width: '100%', padding: 12, marginBottom: 12, borderRadius: 8, border: '2px solid #ffe082', background: '#fff', fontSize: 15, outline: 'none', color: '#333', transition: 'border 0.2s', fontWeight: 600, fontFamily: 'Raleway, sans-serif', lineHeight: 1.7 }} />
            <div style={{ fontWeight: 700, margin: '14px 0 8px', fontSize: 15, color: '#b8860b', fontFamily: 'Raleway, sans-serif', lineHeight: 1.7 }}>Phương thức thanh toán</div>
            <div style={{ marginBottom: 14, fontSize: 15, fontFamily: 'Raleway, sans-serif', lineHeight: 1.7 }}>
              <label style={{ display: 'flex', alignItems: 'center', marginBottom: 7, fontWeight: 600 }}><input type="radio" value="cod" checked={payment === 'cod'} onChange={e => setPayment(e.target.value)} style={{ marginRight: 8 }} /><FaWallet style={{ color: '#f5af1a', marginRight: 6 }} /> Thanh toán khi nhận hàng (COD)</label>
              <label style={{ display: 'flex', alignItems: 'center', marginBottom: 7, fontWeight: 600 }}><input type="radio" value="bank" checked={payment === 'bank'} onChange={e => setPayment(e.target.value)} style={{ marginRight: 8 }} /><FaQrcode style={{ color: '#f5af1a', marginRight: 6 }} /> Chuyển khoản ngân hàng</label>
              <label style={{ display: 'flex', alignItems: 'center', fontWeight: 600 }}><input type="radio" value="momo" checked={payment === 'momo'} onChange={e => setPayment(e.target.value)} style={{ marginRight: 8 }} /><FaCreditCard style={{ color: '#f5af1a', marginRight: 6 }} /> Ví MoMo</label>
            </div>
            {payment === 'bank' && (
              <div className="qr-code-container" style={{ textAlign: 'center', marginBottom: 10 }}>
                <img src="/maQr/Mbbank.jpg" alt="MB Bank QR Code" style={{ borderRadius: 10, boxShadow: '0 2px 8px #ffe08255', margin: '0 auto', maxWidth: 150 }} />
                <p style={{ fontWeight: 500, color: '#b8860b', marginTop: 4, fontSize: 14, lineHeight: 1.7 }}>Quét mã để thanh toán</p>
              </div>
            )}
            {payment === 'momo' && (
              <div className="qr-code-container" style={{ textAlign: 'center', marginBottom: 10 }}>
                <img src="/maQr/Momo.jpg" alt="MoMo QR Code" style={{ borderRadius: 10, boxShadow: '0 2px 8px #ffe08255', margin: '0 auto', maxWidth: 150 }} />
                <p style={{ fontWeight: 500, color: '#b8860b', marginTop: 4, fontSize: 14, lineHeight: 1.7 }}>Quét mã để thanh toán</p>
              </div>
            )}
            {/* Tóm tắt đơn hàng */}
            <div style={{ background: '#fffbe7', borderRadius: 10, boxShadow: '0 2px 8px #ffe08233', padding: 14, margin: '14px 0', fontWeight: 700, fontSize: 16, color: '#b8860b', display: 'flex', flexDirection: 'column', gap: 6, fontFamily: 'Raleway, sans-serif', lineHeight: 1.7 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 600, fontSize: 15 }}>
                <span>Tổng tiền hàng:</span>
                <span style={{ color: '#f5af1a', fontWeight: 700 }}>{total.toLocaleString('vi-VN')} vnđ</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 600, fontSize: 15 }}>
                <span>Phí vận chuyển:</span>
                <span style={{ color: '#f5af1a', fontWeight: 700 }}>0 vnđ</span>
              </div>
              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 600, fontSize: 15, color: '#43a047' }}>
                  <span>Đã giảm:</span>
                  <span>-{discount.toLocaleString('vi-VN')} vnđ</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 18, marginTop: 6, fontWeight: 700 }}>
                <span>Tổng thanh toán:</span>
                <span style={{ color: '#e65100', fontWeight: 700, fontSize: 20 }}>{(total - discount > 0 ? total - discount : 0).toLocaleString('vi-VN')} vnđ</span>
              </div>
            </div>
            <button type="submit" style={{
              width: '100%',
              padding: 16,
              background: 'linear-gradient(90deg,#f5af1a,#ffe082)',
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              fontWeight: 700,
              fontSize: 18,
              marginTop: 8,
              boxShadow: '0 4px 16px #ffe08255',
              letterSpacing: '1px',
              cursor: 'pointer',
              transition: 'background 0.2s',
              textShadow: '0 2px 8px #ffe08233',
              textTransform: 'uppercase',
              fontFamily: 'Raleway, sans-serif',
              lineHeight: 1.7,
            }}>Đặt hàng</button>
            {msg && <div style={{ color: msg.includes('thành công') ? 'green' : 'red', marginTop: 12, fontWeight: 600, fontSize: 15, fontFamily: 'Raleway, sans-serif', lineHeight: 1.7 }}>{msg}</div>}
          </form>
        </div>
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