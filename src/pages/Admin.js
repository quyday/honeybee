import React from 'react';
import './AdminIntro.css';

const StatCard = ({ icon, value, label, color }) => (
    <div className="stat-card" style={{ '--card-color': color }}>
        <div className="stat-icon">{icon}</div>
        <div className="stat-info">
            <span className="stat-value">{value}</span>
            <span className="stat-label">{label}</span>
        </div>
    </div>
);

const FeatureCard = ({ icon, title, description }) => (
    <div className="feature-card-reloaded">
        <div className="feature-icon-reloaded">{icon}</div>
        <div className="feature-info-reloaded">
            <h3>{title}</h3>
            <p>{description}</p>
        </div>
        <div className="feature-arrow">→</div>
    </div>
);

const ICONS = {
    products: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>,
    orders: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.89 1.45l8 4A2 2 0 0 1 22 7.24v9.53a2 2 0 0 1-1.11 1.79l-8 4a2 2 0 0 1-1.79 0l-8-4A2 2 0 0 1 2 16.76V7.24a2 2 0 0 1 1.11-1.79l8-4a2 2 0 0 1 1.78 0z"></path><polyline points="2.32 6.16 12 11 21.68 6.16"></polyline><line x1="12" y1="22.76" x2="12" y2="11"></line></svg>,
    users: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
    content: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>,
    discounts: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>,
    analytics: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>,
    settings: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>,
    feedback: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
};

function Admin({ user, summary }) {
    const formatCurrency = (value) => value ? `${Math.round(value).toLocaleString('vi-VN')} vnđ` : '0 vnđ';

    const features = [
        { icon: ICONS.products, title: 'Quản lý sản phẩm', description: 'Thêm, sửa, xóa, ẩn/hiện, quản lý danh mục' },
        { icon: ICONS.orders, title: 'Quản lý đơn hàng', description: 'Xem, lọc, cập nhật trạng thái, xem chi tiết, in hóa đơn' },
        { icon: ICONS.users, title: 'Quản lý người dùng', description: 'Xem danh sách, chi tiết, khóa/mở, xóa user' },
        { icon: ICONS.content, title: 'Quản lý nội dung trang', description: 'Banner, tin tức, khuyến mãi, giới thiệu, liên hệ' },
        { icon: ICONS.discounts, title: 'Quản lý mã giảm giá', description: 'Tạo, cập nhật, xóa mã giảm giá' },
        { icon: ICONS.analytics, title: 'Thống kê & báo cáo', description: 'Đơn hàng, doanh thu, sản phẩm bán chạy, user đăng ký' },
        { icon: ICONS.settings, title: 'Cài đặt hệ thống', description: 'Thông tin cửa hàng, thanh toán, phí vận chuyển' },
        { icon: ICONS.feedback, title: 'Quản lý liên hệ & phản hồi', description: 'Xem, trả lời, quản lý hỗ trợ/đánh giá, gửi thông báo' },
    ];

    const stats = [
        { icon: '💰', value: formatCurrency(summary?.totalRevenue), label: 'Tổng doanh thu', color: '#27ae60' },
        { icon: '📦', value: summary?.totalOrders || 0, label: 'Tổng đơn hàng', color: '#2980b9' },
        { icon: '👥', value: summary?.totalUsers || 0, label: 'Tổng người dùng', color: '#8e44ad' },
        { icon: '📈', value: formatCurrency(summary?.avgOrderValue), label: 'Giá trị TB', color: '#f39c12' },
    ];

    return (
        <div className="admin-intro-reloaded">
            <div className="admin-intro-header-reloaded">
                <h1>Chào mừng trở lại, {user?.name || 'Admin'}!</h1>
                <p>Đây là trung tâm điều hành của bạn. Mọi thứ bạn cần đều ở đây.</p>
            </div>

            <div className="stats-container">
                {stats.map(stat => <StatCard key={stat.label} {...stat} />)}
            </div>

            <div className="features-grid-reloaded">
                {features.map(feature => <FeatureCard key={feature.title} {...feature} />)}
            </div>
        </div>
    );
}

export default Admin; 