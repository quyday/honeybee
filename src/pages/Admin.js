import React from 'react';
import { useAuth } from '../context/AuthContext';

const fadeInAnim = {
  animation: 'fadeInAdmin 0.8s ease',
};
const cardStyle = {
  background: 'rgba(255,255,255,0.95)',
  borderRadius: 24,
  boxShadow: '0 8px 32px rgba(245,175,26,0.15)',
  padding: 36,
  maxWidth: 700,
  margin: '0 auto',
  position: 'relative',
  ...fadeInAnim,
};
const bgStyle = {
  minHeight: '100vh',
  background: ' url(https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80) center/cover no-repeat fixed',
  fontFamily: 'Quicksand, Nunito, Arial, sans-serif',
  padding: '48px',
};
const headerStyle = {
  fontFamily: 'monospace',
  fontSize: 32,
  fontWeight: 800,
  color: 'rgb(64 57 51)',
  letterSpacing: 1,
  textAlign: 'center',
  marginBottom: 32,
  textShadow: 'rgb(245 175 26 / 55%) 0 2px 8px',
};
const hiStyle = {
  fontSize: 20,
  color: '#f5af1a',
  fontWeight: 600,
  marginBottom: 18,
};
const ulStyle = {
  fontSize: 18,
  marginTop: 24,
  color: '#b8860b',
  listStyle: 'none',
  padding: 0,
};
const liStyle = {
  marginBottom: 14,
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  fontWeight: 500,
  background: 'rgba(255,251,231,0.7)',
  borderRadius: 12,
  padding: '10px 18px',
  boxShadow: '0 1px 4px #ffe08255',
  transition: 'transform 0.2s, box-shadow 0.2s',
};
const iconStyle = {
  fontSize: 22,
  color: '#f5af1a',
  minWidth: 28,
  textAlign: 'center',
};
const logoutBtn = {
  background: 'linear-gradient(90deg, #f55 0%, #ffb347 100%)',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  padding: '10px 28px',
  fontWeight: 'bold',
  fontSize: 18,
  boxShadow: '0 2px 8px #f55a',
  cursor: 'pointer',
  marginLeft: 18,
  transition: 'background 0.2s, transform 0.2s',
};
const homeBtn = {
  marginTop: 32,
  background: 'linear-gradient(90deg, #48c6ef 0%, #6c63ff 100%)',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  padding: '10px 28px',
  fontWeight: 'bold',
  fontSize: 18,
  boxShadow: '0 2px 8px #6c63ff33',
  cursor: 'pointer',
  transition: 'background 0.2s, transform 0.2s',
};

// Animation keyframes
const styleSheet = document.createElement('style');
styleSheet.innerHTML = `
@keyframes fadeInAdmin {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}
button.admin-logout:hover {
  background: linear-gradient(90deg, #ffb347 0%, #f55 100%);
  transform: scale(1.06);
}
button.admin-home:hover {
  background: linear-gradient(90deg, #6c63ff 0%, #48c6ef 100%);
  transform: scale(1.06);
}
li.admin-li:hover {
  transform: translateX(8px) scale(1.03);
  box-shadow: 0 4px 16px #ffe08299;
}
`;
document.head.appendChild(styleSheet);

function Admin({ setCurrentPage }) {
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    setCurrentPage('login');
  };

  const features = [
    { icon: '🛒', label: 'Quản lý sản phẩm', desc: 'Thêm, sửa, xóa, ẩn/hiện, quản lý danh mục' },
    { icon: '📦', label: 'Quản lý đơn hàng', desc: 'Xem, lọc, cập nhật trạng thái, xem chi tiết, in hóa đơn' },
    { icon: '👥', label: 'Quản lý người dùng', desc: 'Xem danh sách, chi tiết, khóa/mở, xóa user' },
    { icon: '📰', label: 'Quản lý nội dung trang', desc: 'Banner, tin tức, khuyến mãi, giới thiệu, liên hệ' },
    { icon: '🎫', label: 'Quản lý mã giảm giá', desc: 'Tạo, cập nhật, xóa mã giảm giá' },
    { icon: '📊', label: 'Thống kê & báo cáo', desc: 'Đơn hàng, doanh thu, sản phẩm bán chạy, user đăng ký' },
    { icon: '⚙️', label: 'Cài đặt hệ thống', desc: 'Thông tin cửa hàng, thanh toán, phí vận chuyển' },
    { icon: '💬', label: 'Quản lý liên hệ & phản hồi', desc: 'Xem, trả lời, quản lý hỗ trợ/đánh giá, gửi thông báo' },
  ];

  return (
    <div style={bgStyle}>
      <div style={cardStyle}>
        <div style={headerStyle}>QUẢN TRỊ HỆ THỐNG <span style={{fontSize:20, fontWeight:600, color:'#f5af1a'}}>(ADMIN DASHBOARD)</span></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <span style={hiStyle}>Xin chào, <b>{user?.name}</b></span>
          <button className="admin-logout" onClick={handleLogout} style={logoutBtn}>Đăng xuất</button>
        </div>
        <ul style={ulStyle}>
          {features.map(f => (
            <li key={f.label} className="admin-li" style={liStyle}>
              <span style={iconStyle}>{f.icon}</span>
              <span><b>{f.label}</b>: {f.desc}</span>
            </li>
          ))}
        </ul>
        <button className="admin-home" style={homeBtn} onClick={() => setCurrentPage('profile')}>Về trang Dashboard</button>
      </div>
    </div>
  );
}

export default Admin; 