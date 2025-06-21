import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import * as XLSX from 'xlsx';
import PasswordInput from '../components/PasswordInput';

export function OrderHistoryTable() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  
  useEffect(() => {
    const loadOrders = () => {
      const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      setOrders(storedOrders);
    };

    loadOrders();
    window.addEventListener('orders-updated', loadOrders);
    return () => {
      window.removeEventListener('orders-updated', loadOrders);
    };
  }, []);

  const filteredOrders = orders.filter(order => {
    const searchTerm = search.toLowerCase();
    return order.name.toLowerCase().includes(searchTerm) ||
           order.id.toString().includes(searchTerm) ||
           (order.email && order.email.toLowerCase().includes(searchTerm)) ||
           order.items.some(item => item.name.toLowerCase().includes(searchTerm));
  }).reverse();

  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredOrders);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Orders');
    XLSX.writeFile(wb, 'danh_sach_don_hang.xlsx');
  };

  return (
    <div className="table-container">
      <div className="table-controls">
        <input placeholder='Tìm kiếm theo tên, mã, email...' value={search} onChange={e => setSearch(e.target.value)} className="search-input" />
        <button onClick={handleExportExcel} className="btn btn-primary">Xuất Excel</button>
      </div>
      <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th>Mã đơn</th>
            <th>Khách hàng</th>
            <th>Email</th>
            <th>Địa chỉ</th>
            <th>Sản phẩm</th>
            <th>Tổng tiền</th>
            <th>Ngày đặt</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.length > 0 ? filteredOrders.map((order) => (
            <tr key={order.id}>
              <td className="order-id">#{order.id}</td>
              <td>{order.name}</td>
              <td>{order.email}</td>
              <td>{order.address}</td>
              <td>{order.items.map(item => `${item.name} (x${item.quantity})`).join(', ')}</td>
              <td className="order-total">{Number(order.total.toString().replace(/\D/g, '')).toLocaleString('vi-VN')} vnđ</td>
              <td>{order.date}</td>
            </tr>
          )) : (
            <tr><td colSpan="7" style={{textAlign: 'center', padding: '20px'}}>Không có đơn hàng nào khớp.</td></tr>
          )}
        </tbody>
      </table>
      </div>
    </div>
  );
}

export function UserManagement({ currentAdminEmail }) {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const allUsers = JSON.parse(localStorage.getItem('users')) || [];
    setUsers(allUsers.filter(u => u.email.toLowerCase() !== currentAdminEmail.toLowerCase()));
  }, [currentAdminEmail]);

  const handleDeleteUser = (email) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tài khoản này? Thao tác này không thể hoàn tác.')) {
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
              <td>{user.phone || 'N/A'}</td>
              <td>{user.role}</td>
              <td className="actions">
                <button className="btn-delete" onClick={() => handleDeleteUser(user.email)}>
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

export function ChangePasswordTab() {
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [msg, setMsg] = useState({ text: '', type: '' });
  const { user, login } = useAuth();

  const handleSubmit = e => {
    e.preventDefault();
    setMsg({ text: '', type: '' });

    if (!oldPass || !newPass || !confirmPass) {
      setMsg({ text: 'Vui lòng nhập đầy đủ thông tin!', type: 'error' });
      return;
    }
    if (newPass !== confirmPass) {
      setMsg({ text: 'Mật khẩu mới không khớp!', type: 'error' });
      return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const foundUser = users.find(u => u.email.toLowerCase() === user.email.toLowerCase());

    if (foundUser.password !== oldPass) {
      setMsg({ text: 'Mật khẩu cũ không đúng!', type: 'error' });
      return;
    }
    
    foundUser.password = newPass;
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('user', JSON.stringify(foundUser)); // Update current session

    setMsg({ text: 'Đổi mật khẩu thành công!', type: 'success' });
    setOldPass(''); setNewPass(''); setConfirmPass('');
    login(user.email, newPass); // Re-login to update auth context state
  };

  return (
    <form className="security-form" onSubmit={handleSubmit}>
      <PasswordInput value={oldPass} onChange={e => setOldPass(e.target.value)} placeholder="Mật khẩu cũ" />
      <PasswordInput value={newPass} onChange={e => setNewPass(e.target.value)} placeholder="Mật khẩu mới" />
      <PasswordInput value={confirmPass} onChange={e => setConfirmPass(e.target.value)} placeholder="Nhập lại mật khẩu mới" />
      <button type='submit' className="btn btn-primary">Đổi mật khẩu</button>
      {msg.text && <div className={`form-message ${msg.type}`}>{msg.text}</div>}
    </form>
  );
}

export function ProfileInfo() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user);
  const [activeTab, setActiveTab] = useState('account');

  useEffect(() => {
    setFormData(user);
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setFormData({ ...formData, avatar: fileReader.result });
      };
      fileReader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSave = () => {
    updateUser(formData);
    setIsEditing(false);
    // Add toast notification for success here in a real app
  };

  const handleCancel = () => {
    setFormData(user);
    setIsEditing(false);
  };
  
  if (!formData) return null;

  const AccountInfo = () => (
    <div className="admin-profile-card">
        <div className="admin-profile-card-header">
        <h3>Thông tin cá nhân</h3>
        {!isEditing ? (
            <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                Chỉnh sửa
            </button>
        ) : (
            <div className="action-buttons">
            <button className="btn btn-secondary" onClick={handleCancel}>Hủy</button>
            <button className="btn btn-success" onClick={handleSave}>Lưu</button>
            </div>
        )}
        </div>
        <div className="admin-profile-card-body">
        <div className="form-row">
            <div className="form-group">
            <label>Họ và Tên</label>
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} disabled={!isEditing} />
            </div>
            <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={formData.email} disabled />
            <small>Email không thể thay đổi.</small>
            </div>
        </div>
        <div className="form-group">
            <label>Số điện thoại</label>
            <input type="tel" name="phone" value={formData.phone || ''} onChange={handleInputChange} disabled={!isEditing} />
        </div>
        <div className="form-group">
            <label>Giới thiệu ngắn</label>
            <textarea name="bio" rows="3" value={formData.bio || 'Quản trị viên hệ thống Mật Ong Kimi.'} onChange={handleInputChange} disabled={!isEditing}></textarea>
        </div>
        </div>
    </div>
  );

  return (
    <div className="admin-profile-page-container">
      {/* Left Column */}
      <div className="admin-profile-sidebar">
        <div className="admin-profile-avatar-card">
          <div className="avatar-wrapper">
            <img src={formData.avatar || 'https://api.dicebear.com/7.x/initials/svg?seed=' + formData.name} alt="Avatar" />
            <label htmlFor="avatar-upload" className="avatar-edit-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9.002a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-9.002a2 2 0 0 0-2 2v2.5M12 10l-4 4 4 4"/><path d="m16 14-4-4 4-4"/><path d="M3.5 16H8"/></svg>
            </label>
            <input id="avatar-upload" type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }}/>
          </div>
          <h3>{formData.name}</h3>
          <p>{formData.role}</p>
        </div>
        <div className="admin-profile-meta-card">
            <h4>Thông tin bổ sung</h4>
            <ul>
                <li>
                    <span><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> Ngày tham gia:</span>
                    <span>{user.joinDate || '01/01/2024'}</span>
                </li>
                <li>
                    <span><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10.5h.5a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-1.063M3 16.5v-2a2 2 0 0 1 2-2h.5"/><path d="M22 12.5a6.522 6.522 0 0 0-7.38-6.445 6.522 6.522 0 0 0-11.2 5.378A6.522 6.522 0 0 0 8 20.932"/></svg> Lần đăng nhập cuối:</span>
                    <span>Vừa xong</span>
                </li>
            </ul>
        </div>
      </div>

      {/* Right Column */}
      <div className="admin-profile-main-content">
        <div className="admin-profile-tabs">
            <button className={`tab-button ${activeTab === 'account' ? 'active' : ''}`} onClick={() => setActiveTab('account')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>
                Tài khoản
            </button>
             <button className={`tab-button ${activeTab === 'password' ? 'active' : ''}`} onClick={() => setActiveTab('password')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                Bảo mật
            </button>
        </div>

        <div className="admin-profile-tab-content">
            {activeTab === 'account' && <AccountInfo />}
            {activeTab === 'password' && (
                <div className="admin-profile-card">
                    <div className="admin-profile-card-header"><h3>Đổi mật khẩu</h3></div>
                    <div className="admin-profile-card-body"><ChangePasswordTab /></div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
} 