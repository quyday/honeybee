import React, { useState, useEffect, useRef } from 'react';
import './Profile.css';
import { useAuth } from '../context/AuthContext';
import * as XLSX from 'xlsx';
import PasswordInput from '../components/PasswordInput';
import AdminDashboard from './AdminDashboard';

// Re-exporting for use in AdminDashboard
export { OrderHistoryTable, UserManagement, ChangePasswordTab, ProfileInfo };

function OrderHistoryTable() {
  const [search, setSearch] = useState('');
  const { user } = useAuth();
  
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  const filteredOrders = orders.filter(order => {
    if (user.role === 'admin') {
      return order.name.toLowerCase().includes(search.toLowerCase()) ||
             order.items.some(item => item.name.toLowerCase().includes(search.toLowerCase()));
    }
    return order.email === user.email && (
      order.name.toLowerCase().includes(search.toLowerCase()) ||
      order.items.some(item => item.name.toLowerCase().includes(search.toLowerCase()))
    );
  }).reverse(); // Show latest orders first

  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredOrders);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Orders');
    XLSX.writeFile(wb, 'lich_su_dat_hang.xlsx');
  };

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ color: '#333', fontWeight: 'bold', fontSize: 18, flex: 1 }}>
          {user.role === 'admin' ? `Tất cả đơn hàng (${filteredOrders.length})` : 'Lịch sử đặt hàng của bạn'}
        </div>
        <button onClick={handleExportExcel} style={{ background: '#007bff', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 'bold', fontSize: 15, cursor: 'pointer' }}>Xuất Excel</button>
      </div>
      <input placeholder='Tìm kiếm...' value={search} onChange={e => setSearch(e.target.value)} style={{ width: 250, marginBottom: 12, padding: '8px 12px', border: '1.5px solid #ccc', borderRadius: 8, background: '#fff' }} />
      <table className="data-table">
        <thead>
          <tr>
            <th>Mã đơn</th>
            <th>Khách hàng</th>
            {user.role === 'admin' && <th>Email</th>}
            <th>Địa chỉ</th>
            <th>Sản phẩm</th>
            <th>Tổng tiền</th>
            <th>Ngày đặt</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order, idx) => (
            <tr key={order.id}>
              <td style={{fontWeight: 'bold', color: '#007bff' }}>#{order.id}</td>
              <td>{order.name}</td>
              {user.role === 'admin' && <td>{order.email}</td>}
              <td>{order.address}</td>
              <td>{order.items.map(item => `${item.name} (x${item.quantity})`).join(', ')}</td>
              <td style={{fontWeight: 'bold' }}>{Number(order.total.toString().replace(/\D/g, '')).toLocaleString('vi-VN')} vnđ</td>
              <td>{order.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function NotificationTab() {
  return (
    <div style={{ width: '100%' }}>
      <div style={{ color: '#b8860b', fontWeight: 'bold', fontSize: 18, marginBottom: 16 }}>Thông báo</div>
      <ul style={{ paddingLeft: 18 }}>
        <li>Đơn hàng #1234 vừa được đặt thành công.</li>
        <li>Người dùng mới đăng ký: Nguyễn Văn C.</li>
        <li>Hệ thống sẽ bảo trì vào 23:00 tối nay.</li>
      </ul>
    </div>
  );
}

function ChangePasswordTab() {
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [msg, setMsg] = useState('');
  const { user, login } = useAuth();

  console.log('Render ChangePasswordTab');

  // Hàm đổi mật khẩu cho user/admin trong localStorage
  const updatePassword = (email, newPassword) => {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    users = users.map(u =>
      u.email.toLowerCase() === email.toLowerCase()
        ? { ...u, password: newPassword }
        : u
    );
    localStorage.setItem('users', JSON.stringify(users));
    // Nếu là admin, cập nhật cả admin_profile
    if (user && user.role === 'admin') {
      const adminProfile = JSON.parse(localStorage.getItem('admin_profile') || '{}');
      if (adminProfile.email && adminProfile.email.toLowerCase() === email.toLowerCase()) {
        localStorage.setItem('admin_profile', JSON.stringify({ ...adminProfile, password: newPassword }));
      }
    }
    // Cập nhật user hiện tại trong localStorage
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (currentUser.email && currentUser.email.toLowerCase() === email.toLowerCase()) {
      localStorage.setItem('user', JSON.stringify({ ...currentUser, password: newPassword }));
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!oldPass || !newPass || !confirmPass) {
      setMsg('Vui lòng nhập đầy đủ thông tin!');
      return;
    }
    if (newPass !== confirmPass) {
      setMsg('Mật khẩu mới không khớp!');
      return;
    }
    if (newPass.length < 6) {
      setMsg('Mật khẩu mới phải từ 6 ký tự!');
      return;
    }
    // Kiểm tra mật khẩu cũ
    let users = JSON.parse(localStorage.getItem('users')) || [];
    const found = users.find(u => u.email.toLowerCase() === user.email.toLowerCase() && u.password === oldPass);
    if (!found) {
      setMsg('Mật khẩu cũ không đúng!');
      return;
    }
    updatePassword(user.email, newPass);
    setMsg('Đổi mật khẩu thành công!');
    setOldPass(''); setNewPass(''); setConfirmPass('');
    // Đăng nhập lại để cập nhật context
    login(user.email, newPass);
  };

  return (
    <form style={{ width: 400, position: 'relative' }} onSubmit={handleSubmit}>
      <PasswordInput
        value={oldPass}
        onChange={e => setOldPass(e.target.value)}
        placeholder="Mật khẩu cũ"
        style={{ border: '1.5px solid #ccc', borderRadius: 8, padding: '10px 14px', width: '100%', marginBottom: '1rem' }}
      />
      <PasswordInput
        value={newPass}
        onChange={e => setNewPass(e.target.value)}
        placeholder="Mật khẩu mới"
        style={{ border: '1.5px solid #ccc', borderRadius: 8, padding: '10px 14px', width: '100%', marginBottom: '1rem' }}
      />
      <PasswordInput
        value={confirmPass}
        onChange={e => setConfirmPass(e.target.value)}
        placeholder="Nhập lại mật khẩu mới"
        style={{ border: '1.5px solid #ccc', borderRadius: 8, padding: '10px 14px', width: '100%', marginBottom: '1rem' }}
      />
      <button type='submit' style={{ background: '#007bff', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 'bold', fontSize: 16, marginTop: 8, cursor: 'pointer' }}>Đổi mật khẩu</button>
      {msg && <div style={{ color: msg.includes('thành công') ? 'green' : 'red', marginTop: 8 }}>{msg}</div>}
    </form>
  );
}

function UserManagement({ currentAdminEmail }) {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const allUsers = JSON.parse(localStorage.getItem('users')) || [];
    setUsers(allUsers.filter(u => u.email.toLowerCase() !== currentAdminEmail.toLowerCase()));
  }, [currentAdminEmail]);

  const handleDeleteUser = (email) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tài khoản này?')) {
      let allUsers = JSON.parse(localStorage.getItem('users')) || [];
      allUsers = allUsers.filter(u => u.email.toLowerCase() !== email.toLowerCase());
      localStorage.setItem('users', JSON.stringify(allUsers));
      setUsers(allUsers.filter(u => u.email.toLowerCase() !== currentAdminEmail.toLowerCase()));
    }
  };

  if (users.length === 0) return <div style={{ color: '#333', fontWeight: 'bold', fontSize: 18 }}>Không có người dùng nào khác.</div>;

  return (
    <div style={{ width: '100%' }}>
      <table className="data-table">
        <thead>
          <tr>
            <th>Họ tên</th>
            <th>Email</th>
            <th>SĐT</th>
            <th>Vai trò</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.email}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>{user.role}</td>
              <td>
                <button style={{ background: '#dc3545', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 'bold', fontSize: 15, cursor: 'pointer' }} onClick={() => handleDeleteUser(user.email)}>
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ProfileInfo() {
  const { user } = useAuth();
  const [profileUser, setProfileUser] = useState(user);
  const [editMode, setEditMode] = useState(false);

  const handleSaveProfile = () => {
    setEditMode(false);
    if (profileUser && profileUser.email) {
      let users = JSON.parse(localStorage.getItem('users')) || [];
      users = users.map(u =>
        u.email.toLowerCase() === profileUser.email.toLowerCase()
          ? { ...u, name: profileUser.name, phone: profileUser.phone, address: profileUser.address }
          : u
      );
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('user', JSON.stringify({ ...profileUser }));
      if (profileUser.role === 'admin') {
        localStorage.setItem('admin_profile', JSON.stringify(profileUser));
      }
    }
  };
  
  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    border: '1.5px solid #ccc',
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 14,
    boxSizing: 'border-box',
  };
  const labelStyle = {
    fontWeight: 'bold',
    color: '#333',
    marginTop: 12,
    marginBottom: 4,
    fontSize: 15,
  };

  if (!profileUser) return null;

  return (
    <form className="profile-form" style={{ maxWidth: 500 }}>
      <div style={labelStyle}>Họ tên</div>
      <input value={profileUser.name} disabled={!editMode} style={inputStyle} onChange={e => setProfileUser({ ...profileUser, name: e.target.value })} />
      <div style={labelStyle}>Email</div>
      <input value={profileUser.email} disabled style={inputStyle} />
      <div style={labelStyle}>Số điện thoại</div>
      <input value={profileUser.phone || ''} disabled={!editMode} style={inputStyle} onChange={e => setProfileUser({ ...profileUser, phone: e.target.value })} />
      <div style={labelStyle}>Địa chỉ</div>
      <input value={profileUser.address || ''} disabled={!editMode} style={inputStyle} onChange={e => setProfileUser({ ...profileUser, address: e.target.value })} />
      
      {!editMode ? (
        <button type="button" style={{ background: '#007bff', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 'bold', fontSize: 16, marginTop: 8, cursor: 'pointer' }} onClick={() => setEditMode(true)}>Chỉnh sửa</button>
      ) : (
        <button type="button" style={{ background: '#28a745', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 'bold', fontSize: 16, marginTop: 8, cursor: 'pointer' }} onClick={handleSaveProfile}>Lưu thay đổi</button>
      )}
    </form>
  );
}

function Profile({ setCurrentPage }) {
  const { user, logout } = useAuth();
  const [profileUser, setProfileUser] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const fileInputRef = useRef();
  const [activeMenu, setActiveMenu] = useState('profile');

  useEffect(() => {
    if (!user) {
      setCurrentPage('login');
      return;
    }
    // For non-admin users, set their profile
    if (user.role !== 'admin') {
        setProfileUser(user);
        setAvatar(user.avatar || null);
    }
  }, [user, setCurrentPage]);
  
  // If user is admin, render the new dashboard
  if (user && user.role === 'admin') {
      return <AdminDashboard setCurrentPage={setCurrentPage} />;
  }

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };
  const confirmLogout = () => {
    logout();
    setCurrentPage('login');
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
        // This should be updated to also save for non-admin user
        localStorage.setItem('user_avatar', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    if (profileUser && profileUser.email) {
      let users = JSON.parse(localStorage.getItem('users')) || [];
      users = users.map(u =>
        u.email.toLowerCase() === profileUser.email.toLowerCase()
          ? { ...u, name: profileUser.name, phone: profileUser.phone, address: profileUser.address }
          : u
      );
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('user', JSON.stringify({ ...profileUser }));
      if (profileUser.role === 'admin') {
        localStorage.setItem('admin_profile', JSON.stringify(profileUser));
      }
    }
  };

  const bgStyle = {
    minHeight: '100vh',
    background: 'url(https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80) center/cover no-repeat fixed',
    padding: '40px 0',
  };
  const containerStyle = {
    display: 'flex',
    maxWidth: 900,
    margin: '40px auto',
    background: 'rgba(255,251,231,0.97)',
    borderRadius: 16,
    boxShadow: '0 2px 16px #ffe08255',
    minHeight: 480,
    overflow: 'hidden',
  };
  const sidebarStyle = {
    width: 220,
    background: '#fff3c0',
    borderRight: '2px solid #ffe082',
    padding: '32px 0 32px 0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
  };
  const menuItemStyle = isActive => ({
    padding: '14px 32px',
    background: isActive ? '#f5af1a' : 'transparent',
    color: isActive ? '#fff' : '#b8860b',
    fontWeight: isActive ? 'bold' : 'normal',
    border: 'none',
    outline: 'none',
    cursor: 'pointer',
    fontSize: 16,
    textAlign: 'left',
    transition: 'background 0.2s',
  });
  const contentStyle = {
    flex: 1,
    padding: '40px 48px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    background: 'transparent',
  };
  const avatarStyle = {
    width: 90,
    height: 90,
    borderRadius: '50%',
    objectFit: 'cover',
    boxShadow: '0 2px 8px #ffe082',
    border: '3px solid #f5af1a',
    marginBottom: 12,
    background: '#fff',
    cursor: 'pointer',
    display: 'block',
  };
  const avatarWrap = {
    display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 16,
  };
  const modalStyle = {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.2)',
    zIndex: 1000,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  };
  const modalBox = {
    background: '#fff',
    borderRadius: 12,
    padding: 32,
    minWidth: 320,
    boxShadow: '0 2px 16px #ffe08299',
    textAlign: 'center',
  };

  // The menu for regular users
  const menuItems = [
    { key: 'profile', label: 'Thông tin cá nhân' },
    { key: 'orders', label: 'Lịch sử đặt hàng' },
    { key: 'changepass', label: 'Đổi mật khẩu' },
    { key: 'notifications', label: 'Thông báo' },
    { key: 'logout', label: 'Đăng xuất' },
  ];

  if (!profileUser) return <div>Đang tải...</div>;

  return (
    <div style={bgStyle}>
      <div style={containerStyle}>
        {/* Sidebar for regular user */}
        <aside style={sidebarStyle}>
          <div style={{ position: 'relative' }}>
            <div style={{ fontWeight: 'bold', color: '#b8860b', fontSize: 18, textAlign: 'center', marginBottom: 32 }}>
              MENU
            </div>
            <img 
              src="./images/bee_1.png" 
              alt="Bee 1" 
              className="bee-icon bee-icon-1"
            />
          </div>
          {menuItems.map(item => (
            <button
              key={item.key}
              style={menuItemStyle(activeMenu === item.key)}
              onClick={() => {
                if (item.key === 'logout') handleLogout();
                else setActiveMenu(item.key);
              }}
            >
              {item.label}
            </button>
          ))}
        </aside>
        
        {/* Content for regular user */}
        <section style={contentStyle}>
          {activeMenu === 'profile' && (
            <form className="profile-form" style={{ width: 350 }}>
              <div style={avatarWrap}>
                 <img
                    src={avatar || 'https://api.dicebear.com/7.x/initials/svg?seed=' + encodeURIComponent(profileUser.name)}
                    alt="avatar"
                    style={avatarStyle}
                    onClick={() => fileInputRef.current && fileInputRef.current.click()}
                    title="Click để đổi ảnh đại diện"
                  />
                  <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleAvatarChange}
                />
              </div>
              <ProfileInfo />
            </form>
          )}
          {activeMenu === 'orders' && <OrderHistoryTable />}
          {activeMenu === 'changepass' && <ChangePasswordTab />}
          {activeMenu === 'notifications' && <NotificationTab />}
        </section>
      </div>
      {showLogoutConfirm && (
        <div style={modalStyle}>
          <div style={modalBox}>
            <div style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 16 }}>Bạn có chắc chắn muốn đăng xuất?</div>
            <button style={{ background: '#f5af1a', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 'bold', fontSize: 16, marginRight: 12, cursor: 'pointer' }} onClick={confirmLogout}>Đăng xuất</button>
            <button style={{ background: '#eee', color: '#b8860b', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 'bold', fontSize: 16, cursor: 'pointer' }} onClick={() => setShowLogoutConfirm(false)}>Hủy</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile; 