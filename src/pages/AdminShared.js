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
    <form className="profile-form" onSubmit={handleSubmit} style={{maxWidth: '500px', margin: '20px auto'}}>
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
  const [profile, setProfile] = useState(user);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    setProfile(user);
  }, [user]);

  const handleSave = (e) => {
    e.preventDefault();
    updateUser(profile);
    setEditMode(false);
  };
  
  if (!profile) return null;

  return (
    <form className="profile-form" onSubmit={handleSave} style={{maxWidth: '500px', margin: '20px auto'}}>
      <div className="form-group">
        <label>Họ tên</label>
        <input className="form-control" value={profile.name} disabled={!editMode} onChange={e => setProfile({ ...profile, name: e.target.value })} />
      </div>
      <div className="form-group">
        <label>Email</label>
        <input className="form-control" value={profile.email} disabled />
      </div>
      <div className="form-group">
        <label>Số điện thoại</label>
        <input className="form-control" value={profile.phone || ''} disabled={!editMode} onChange={e => setProfile({ ...profile, phone: e.target.value })} />
      </div>
      
      {!editMode ? (
        <button type="button" className="btn btn-primary" onClick={() => setEditMode(true)}>Chỉnh sửa</button>
      ) : (
        <>
          <button type="submit" className="btn btn-success">Lưu thay đổi</button>
          <button type="button" className="btn" onClick={() => {setEditMode(false); setProfile(user);}} style={{marginLeft: '10px'}}>Hủy</button>
        </>
      )}
    </form>
  );
} 