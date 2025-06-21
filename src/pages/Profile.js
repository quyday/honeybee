import React, { useState, useEffect, useRef } from 'react';
import './Profile.css';
import { useAuth } from '../context/AuthContext';
import * as XLSX from 'xlsx';
import PasswordInput from '../components/PasswordInput';
import AdminDashboard from './AdminDashboard';

// Re-exporting for use in AdminDashboard
export { OrderHistoryTable, UserManagement, ChangePasswordTab, ProfileInfo };

function OrderHistoryTable() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const { user } = useAuth();
  
  useEffect(() => {
    const loadOrders = () => {
      const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      setOrders(storedOrders);
    };

    loadOrders(); // Tải lần đầu

    window.addEventListener('orders-updated', loadOrders); // Lắng nghe sự kiện

    return () => {
      window.removeEventListener('orders-updated', loadOrders); // Dọn dẹp listener
    };
  }, []);

  const filteredOrders = orders.filter(order => {
    if (!user) return false;
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
    <div className="table-container">
      <h3 className="table-title">
        {user.role === 'admin' ? `Tất cả đơn hàng (${filteredOrders.length})` : 'Lịch sử đặt hàng của bạn'}
      </h3>
      <div className="table-controls">
        <input placeholder='Tìm kiếm...' value={search} onChange={e => setSearch(e.target.value)} className="search-input" />
        <button onClick={handleExportExcel} className="btn btn-primary">Xuất Excel</button>
      </div>
      <div className="table-wrapper">
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
                <td className="order-id">#{order.id}</td>
                <td>{order.name}</td>
                {user.role === 'admin' && <td>{order.email}</td>}
                <td>{order.address}</td>
                <td>{order.items.map(item => `${item.name} (x${item.quantity})`).join(', ')}</td>
                <td className="order-total">{Number(order.total.toString().replace(/\D/g, '')).toLocaleString('vi-VN')} vnđ</td>
                <td>{order.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function NotificationTab() {
  return (
    <div className="notification-tab">
      <h3>Thông báo</h3>
      <ul>
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

  const updatePassword = (email, newPassword) => {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    users = users.map(u =>
      u.email.toLowerCase() === email.toLowerCase()
        ? { ...u, password: newPassword }
        : u
    );
    localStorage.setItem('users', JSON.stringify(users));
    if (user && user.role === 'admin') {
      const adminProfile = JSON.parse(localStorage.getItem('admin_profile') || '{}');
      if (adminProfile.email && adminProfile.email.toLowerCase() === email.toLowerCase()) {
        localStorage.setItem('admin_profile', JSON.stringify({ ...adminProfile, password: newPassword }));
      }
    }
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
    let users = JSON.parse(localStorage.getItem('users')) || [];
    const found = users.find(u => u.email.toLowerCase() === user.email.toLowerCase() && u.password === oldPass);
    if (!found) {
      setMsg('Mật khẩu cũ không đúng!');
      return;
    }
    updatePassword(user.email, newPass);
    setMsg('Đổi mật khẩu thành công!');
    setOldPass(''); setNewPass(''); setConfirmPass('');
    login(user.email, newPass);
  };

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      <PasswordInput
        value={oldPass}
        onChange={e => setOldPass(e.target.value)}
        placeholder="Mật khẩu cũ"
        className="form-control"
      />
      <PasswordInput
        value={newPass}
        onChange={e => setNewPass(e.target.value)}
        placeholder="Mật khẩu mới"
        className="form-control"
      />
      <PasswordInput
        value={confirmPass}
        onChange={e => setConfirmPass(e.target.value)}
        placeholder="Nhập lại mật khẩu mới"
        className="form-control"
      />
      <button type='submit' className="btn btn-primary">Đổi mật khẩu</button>
      {msg && <div className={`form-message ${msg.includes('thành công') ? 'success' : 'error'}`}>{msg}</div>}
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

  if (users.length === 0) return <h3>Không có người dùng nào khác.</h3>;

  return (
    <div className="table-container">
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
                <button className="btn btn-danger" onClick={() => handleDeleteUser(user.email)}>
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
  
  if (!profileUser) return null;

  return (
    <>
      <div className="form-group">
        <label className="form-label">Họ tên</label>
        <input className="form-control" value={profileUser.name} disabled={!editMode} onChange={e => setProfileUser({ ...profileUser, name: e.target.value })} />
      </div>
      <div className="form-group">
        <label className="form-label">Email</label>
        <input className="form-control" value={profileUser.email} disabled />
      </div>
      <div className="form-group">
        <label className="form-label">Số điện thoại</label>
        <input className="form-control" value={profileUser.phone || ''} disabled={!editMode} onChange={e => setProfileUser({ ...profileUser, phone: e.target.value })} />
      </div>
      <div className="form-group">
        <label className="form-label">Địa chỉ</label>
        <input className="form-control" value={profileUser.address || ''} disabled={!editMode} onChange={e => setProfileUser({ ...profileUser, address: e.target.value })} />
      </div>
      
      {!editMode ? (
        <button type="button" className="btn btn-primary" onClick={() => setEditMode(true)}>Chỉnh sửa</button>
      ) : (
        <button type="button" className="btn btn-success" onClick={handleSaveProfile}>Lưu thay đổi</button>
      )}
    </>
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
    if (user.role !== 'admin') {
        setProfileUser(user);
        setAvatar(user.avatar || null);
    }
  }, [user, setCurrentPage]);
  
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
        const result = reader.result;
        setAvatar(result);
        // Also update user in context and local storage
        let users = JSON.parse(localStorage.getItem('users')) || [];
        users = users.map(u => u.email === user.email ? { ...u, avatar: result } : u);
        localStorage.setItem('users', JSON.stringify(users));
        const updatedUser = { ...user, avatar: result };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setProfileUser(updatedUser);
      };
      reader.readAsDataURL(file);
    }
  };

  const menuItems = [
    { key: 'profile', label: 'Thông tin cá nhân' },
    { key: 'orders', label: 'Lịch sử đặt hàng' },
    { key: 'changepass', label: 'Đổi mật khẩu' },
    { key: 'notifications', label: 'Thông báo' },
    { key: 'logout', label: 'Đăng xuất' },
  ];

  if (!profileUser) return <div>Đang tải...</div>;

  return (
    <>
      <div className="profile-container">
        <aside className="profile-sidebar">
          <div className="profile-sidebar-header">
            <span className="profile-sidebar-title">MENU</span>
            <img 
              src="/images/bee_1.png" 
              alt="Bee" 
              className="bee-icon-menu"
            />
          </div>
          {menuItems.map(item => (
            <button
              key={item.key}
              className={`profile-menu-item ${activeMenu === item.key ? 'active' : ''}`}
              onClick={() => {
                if (item.key === 'logout') handleLogout();
                else setActiveMenu(item.key);
              }}
            >
              <span>{item.label}</span>
              {activeMenu === item.key && item.key === 'profile' && <img src="/images/bee_2.png" alt="Bee" className="bee-icon-menu-item"/>}
            </button>
          ))}
        </aside>
        
        <section className="profile-content">
          {activeMenu === 'profile' && (
            <form className="profile-form">
              <div className="avatar-wrapper" onClick={() => fileInputRef.current && fileInputRef.current.click()}>
                 <img
                    src={avatar || 'https://api.dicebear.com/7.x/initials/svg?seed=' + encodeURIComponent(profileUser.name)}
                    alt="avatar"
                    className="profile-avatar"
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
        <div className="logout-modal">
          <div className="logout-modal-box">
            <h3>Bạn có chắc chắn muốn đăng xuất?</h3>
            <div className="modal-buttons">
              <button className="btn btn-primary" onClick={confirmLogout}>Đăng xuất</button>
              <button className="btn btn-secondary" onClick={() => setShowLogoutConfirm(false)}>Hủy</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Profile; 