import React, { useState, useEffect, useRef } from 'react';
import './ProfilePage.css'; // We will create this new CSS file
import { useAuth } from '../context/AuthContext';
import PasswordInput from '../components/PasswordInput';
import AdminDashboard from './AdminDashboard';

// --- Re-usable Components for the new Profile Page ---

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const { user } = useAuth();
  
  useEffect(() => {
    const loadOrders = () => {
      const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      const userOrders = storedOrders.filter(o => o.email === user.email);
      setOrders(userOrders.reverse());
    };
    loadOrders();
    window.addEventListener('orders-updated', loadOrders);
    return () => window.removeEventListener('orders-updated', loadOrders);
  }, [user]);

  if (orders.length === 0) {
    return (
      <div className="profile-content-placeholder animate-fade-in">
        <img src="/images/empty-cart.png" alt="Không có đơn hàng"/>
        <p>Bạn chưa có đơn hàng nào.</p>
        <p>Hãy khám phá các sản phẩm tuyệt vời của chúng tôi!</p>
      </div>
    );
  }

  return (
    <div className="order-history-list">
      {orders.map((order, index) => (
        <div key={order.id} className="order-card animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
          <div className="order-card-header">
            <div>
              <span className="order-id">Đơn hàng #{order.id}</span>
              <span className="order-date">{order.date}</span>
            </div>
            <span className="order-status delivered">Đã giao</span>
          </div>
          <div className="order-card-body">
            {order.items.map(item => (
              <div key={`${order.id}-${item.id}`} className="order-item">
                <img src={item.image} alt={item.name} className="order-item-image" />
                <div className="order-item-details">
                  <span className="order-item-name">{item.name}</span>
                  <span className="order-item-quantity">Số lượng: {item.quantity}</span>
                </div>
                <span className="order-item-price">{Number(String(item.price).replace(/\D/g, '')).toLocaleString('vi-VN')} vnđ</span>
              </div>
            ))}
          </div>
          <div className="order-card-footer">
            <span>Tổng cộng</span>
            <span className="order-total">{Number(order.total.toString().replace(/\D/g, '')).toLocaleString('vi-VN')} vnđ</span>
          </div>
        </div>
      ))}
    </div>
  );
};

const ChangePassword = () => {
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [msg, setMsg] = useState('');
  const { user, login } = useAuth();

  const updatePassword = (email, newPassword) => {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    users = users.map(u => u.email.toLowerCase() === email.toLowerCase() ? { ...u, password: newPassword } : u);
    localStorage.setItem('users', JSON.stringify(users));
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (currentUser.email && currentUser.email.toLowerCase() === email.toLowerCase()) {
      localStorage.setItem('user', JSON.stringify({ ...currentUser, password: newPassword }));
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    setMsg('');
    if (!oldPass || !newPass || !confirmPass) {
      setMsg({ text: 'Vui lòng nhập đầy đủ thông tin!', type: 'error' });
      return;
    }
    if (newPass !== confirmPass) {
      setMsg({ text: 'Mật khẩu mới không khớp!', type: 'error' });
      return;
    }
    let users = JSON.parse(localStorage.getItem('users')) || [];
    const found = users.find(u => u.email.toLowerCase() === user.email.toLowerCase() && u.password === oldPass);
    if (!found) {
      setMsg({ text: 'Mật khẩu cũ không đúng!', type: 'error' });
      return;
    }
    updatePassword(user.email, newPass);
    setMsg({ text: 'Đổi mật khẩu thành công!', type: 'success' });
    setOldPass(''); setNewPass(''); setConfirmPass('');
    login(user.email, newPass);
    setTimeout(() => setMsg(''), 3000);
  };
  return (
    <div className="profile-form-container animate-fade-in">
      <h3>Bảo mật</h3>
      <p>Để đảm bảo an toàn, vui lòng không chia sẻ mật khẩu cho người khác.</p>
      <form className="profile-form" onSubmit={handleSubmit}>
        <PasswordInput value={oldPass} onChange={e => setOldPass(e.target.value)} placeholder="Mật khẩu cũ" />
        <PasswordInput value={newPass} onChange={e => setNewPass(e.target.value)} placeholder="Mật khẩu mới" />
        <PasswordInput value={confirmPass} onChange={e => setConfirmPass(e.target.value)} placeholder="Nhập lại mật khẩu mới" />
        <button type='submit' className="profile-form-button">Đổi mật khẩu</button>
        {msg && <div className={`form-message ${msg.type}`}>{msg.text}</div>}
      </form>
    </div>
  );
};

const MyProfileInfo = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(user);
  const [isEditing, setIsEditing] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    setProfile(user);
  }, [user]);

  const handleChange = (e) => {
    setProfile({...profile, [e.target.name]: e.target.value});
  }

  const handleSave = (e) => {
    e.preventDefault();
    updateUser(profile);
    setIsEditing(false);
    setMsg('Cập nhật thông tin thành công!');
    setTimeout(() => setMsg(''), 3000);
  }

  return (
    <div className="profile-form-container animate-fade-in">
      <h3>Thông tin cá nhân</h3>
      <p>Quản lý thông tin cá nhân của bạn để bảo mật tài khoản.</p>
      <form className="profile-form" onSubmit={handleSave}>
          <div className="form-group">
            <label>Họ tên</label>
            <input name="name" className="form-control" value={profile.name} onChange={handleChange} disabled={!isEditing} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input name="email" className="form-control" value={profile.email} disabled />
          </div>
          <div className="form-group">
            <label>Số điện thoại</label>
            <input name="phone" className="form-control" value={profile.phone || ''} onChange={handleChange} disabled={!isEditing} placeholder="Chưa có thông tin"/>
          </div>
          <div className="form-group">
            <label>Địa chỉ</label>
            <input name="address" className="form-control" value={profile.address || ''} onChange={handleChange} disabled={!isEditing} placeholder="Chưa có thông tin"/>
          </div>
          <div className="form-actions">
            {!isEditing ? (
              <button type="button" className="profile-form-button" onClick={() => setIsEditing(true)}>Chỉnh sửa</button>
            ) : (
              <>
                <button type="submit" className="profile-form-button save">Lưu thay đổi</button>
                <button type="button" className="profile-form-button cancel" onClick={() => { setIsEditing(false); setProfile(user); }}>Hủy</button>
              </>
            )}
          </div>
          {msg && <div className="form-message success">{msg}</div>}
      </form>
    </div>
  );
};

const MyVouchers = () => {
  const [vouchers, setVouchers] = useState([]);
  const [copiedCode, setCopiedCode] = useState('');
  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 1200);
  };
  useEffect(() => {
    const loadVouchers = () => {
      const all = JSON.parse(localStorage.getItem('vouchers') || '[]');
      setVouchers(all);
    };
    loadVouchers();
    window.addEventListener('storage', loadVouchers);
    return () => window.removeEventListener('storage', loadVouchers);
  }, []);
  if (!vouchers.length) return (
    <div className="profile-content-placeholder animate-fade-in">
      <img src="/images/giftbox.png" alt="Chưa có voucher" style={{maxWidth: 90, opacity: 0.7}} />
      <p>Bạn chưa có voucher nào.</p>
      <p>Hãy săn hộp quà hoặc nhận từ admin để được giảm giá!</p>
    </div>
  );
  return (
    <div className="order-history-list animate-fade-in" style={{gap: 12}}>
      {vouchers.map((v, idx) => (
        <div key={v.code + idx} className="order-card animate-fade-in" style={{ animationDelay: `${idx * 0.07}s`, borderLeft: v.type === 'freeship' ? '6px solid #43a047' : v.type === 'percent' ? '6px solid #e65100' : '6px solid #0288d1' }}>
          <div className="order-card-header" style={{background:'#f7fafd', display:'flex', alignItems:'center', gap:8}}>
            <span style={{fontWeight:700, color:'#c58940', fontSize:16, display:'flex', alignItems:'center', gap:6}}>
              Voucher: {v.code}
              <span style={{ cursor: 'pointer', fontSize: 18 }} title="Sao chép mã" onClick={() => handleCopy(v.code)}>📋</span>
              {copiedCode === v.code && <span style={{ color: '#43a047', fontSize: 13, marginLeft: 4 }}>Đã sao chép!</span>}
            </span>
            <span style={{fontWeight:600, color: v.status === 'active' ? '#43a047' : '#bdbdbd'}}>{v.status === 'active' ? 'Còn hạn' : 'Hết hạn'}</span>
          </div>
          <div className="order-card-body" style={{gap:8}}>
            <div style={{display:'flex',alignItems:'center',gap:12}}>
              <span style={{fontWeight:600, color: v.type === 'freeship' ? '#43a047' : v.type === 'percent' ? '#e65100' : '#0288d1'}}>
                {v.type === 'freeship' ? 'Freeship' : v.type === 'percent' ? 'Giảm %' : 'Giảm tiền'}
              </span>
              <span style={{fontWeight:700, fontSize:17}}>
                {v.type === 'percent' ? v.value + '%' : v.type === 'freeship' ? 'Freeship' : Number(v.value).toLocaleString('vi-VN') + ' vnđ'}
              </span>
            </div>
            <div style={{fontSize:14, color:'#888'}}>Hạn dùng: {v.expiry || 'Không giới hạn'}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

const ProfileCard = ({ user, onLogout, onAvatarChange }) => {
    const fileInputRef = useRef(null);
    const [completion, setCompletion] = useState(0);

    useEffect(() => {
        let fields = ['name', 'email', 'phone', 'address'];
        let completed = fields.filter(f => user[f] && user[f] !== '').length;
        setCompletion((completed / fields.length) * 100);
    }, [user]);

    return (
        <div className="profile-card animate-slide-in-left">
            <div className="profile-card-avatar-wrapper">
                <img 
                    src={user.avatar || 'https://api.dicebear.com/7.x/initials/svg?seed=' + encodeURIComponent(user.name)} 
                    alt="avatar" 
                    className="profile-card-avatar"
                />
                <button className="change-avatar-button" onClick={() => fileInputRef.current.click()} title="Đổi ảnh đại diện">
                    📷
                </button>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={onAvatarChange} 
                    style={{display: 'none'}} 
                    accept="image/*"
                />
            </div>
            <h2 className="profile-card-name">{user.name}</h2>
            <p className="profile-card-email">{user.email}</p>
            <div className="profile-completion">
                <p>Hoàn thiện hồ sơ</p>
                <div className="progress-bar">
                    <div className="progress-bar-inner" style={{width: `${completion}%`}}></div>
                </div>
                <span>{Math.round(completion)}%</span>
            </div>
            <button className="profile-logout-button" onClick={onLogout}>Đăng xuất</button>
        </div>
    );
};

// --- Main Profile Page Component ---
function ProfilePage({ setCurrentPage }) {
  const { user, logout, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    if (!user) setCurrentPage('login');
  }, [user, setCurrentPage]);
  
  if (user && user.role === 'admin') {
      return <AdminDashboard setCurrentPage={setCurrentPage} />;
  }

  const handleLogout = () => setShowLogoutConfirm(true);
  
  const confirmLogout = () => {
    logout();
    setShowLogoutConfirm(false);
    setCurrentPage('login');
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newAvatar = reader.result;
        updateUser({ ...user, avatar: newAvatar });
      };
      reader.readAsDataURL(file);
    }
  };

  const menuItems = [
    { key: 'profile', label: 'Tài khoản của tôi', icon: '👤' },
    { key: 'orders', label: 'Lịch sử mua hàng', icon: '📦' },
    { key: 'vouchers', label: 'Voucher của tôi', icon: '🎁' },
    { key: 'changepass', label: 'Đổi mật khẩu', icon: '🔑' },
  ];

  if (!user) return null; // Or a loading spinner

  return (
    <div className="profile-page-container">
      <div className="profile-layout">
        <aside className="profile-sidebar-wrapper">
            <ProfileCard user={user} onLogout={handleLogout} onAvatarChange={handleAvatarChange} />
        </aside>
        
        <main className="profile-content-wrapper animate-slide-in-right">
          <nav className="profile-tabs">
            {menuItems.map(item => (
              <button
                key={item.key}
                className={`profile-tab-item ${activeTab === item.key ? 'active' : ''}`}
                onClick={() => setActiveTab(item.key)}
              >
                <span className="tab-icon">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
          
          <div className="profile-content-area">
            {activeTab === 'profile' && <MyProfileInfo />}
            {activeTab === 'orders' && <OrderHistory />}
            {activeTab === 'vouchers' && <MyVouchers />}
            {activeTab === 'changepass' && <ChangePassword />}
          </div>
        </main>
      </div>

      {showLogoutConfirm && (
        <div className="profile-logout-modal">
          <div className="profile-logout-modal-box animate-fade-in">
            <h3>Xác nhận Đăng xuất</h3>
            <p>Bạn có chắc chắn muốn rời đi không?</p>
            <div className="modal-buttons">
              <button className="btn-confirm" onClick={confirmLogout}>Đăng xuất</button>
              <button className="btn-cancel" onClick={() => setShowLogoutConfirm(false)}>Hủy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePage; 