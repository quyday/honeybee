import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';
import { useAuth } from '../context/AuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { OrderHistoryTable, UserManagement, ChangePasswordTab, ProfileInfo } from './AdminShared';

const statusMap = {
    'In Transit': 'in-transit',
    'Delivered': 'delivered',
    'Pending': 'pending',
};

const BeeDecorations = () => (
    <>
        <img src="/images/bee_1.png" alt="Bee" className="bee-icon bee-1" style={{animationDuration: '10s', opacity: 0.8}} />
        <img src="/images/bee_2.png" alt="Bee" className="bee-icon bee-2" style={{animationDuration: '12s', opacity: 0.8}}/>
        <img src="/images/bee_3.png" alt="Bee" className="bee-icon bee-3" style={{animationDuration: '9s', opacity: 0.8}}/>
    </>
);

// Main AdminDashboard component
function AdminDashboard({ setCurrentPage }) {
    const { user, logout } = useAuth();
    const [activeView, setActiveView] = useState('dashboard');
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [summary, setSummary] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        totalUsers: 0,
        avgOrderValue: 0,
    });
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
        setOrders(allOrders);
        setUsers(allUsers);
        const totalRevenue = allOrders.reduce((sum, order) => sum + Number(order.total.toString().replace(/\D/g, '')), 0);
        const totalOrders = allOrders.length;
        const totalUsers = allUsers.length;
        const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
        setSummary({ totalRevenue, totalOrders, totalUsers, avgOrderValue });
        const salesByDate = allOrders.reduce((acc, order) => {
            const date = order.date.split(' ')[0];
            const amount = Number(order.total.toString().replace(/\D/g, ''));
            acc[date] = (acc[date] || 0) + amount;
            return acc;
        }, {});
        const formattedChartData = Object.keys(salesByDate).map(date => ({
            date,
            revenue: salesByDate[date],
        })).slice(-30);
        setChartData(formattedChartData);
    }, []);

    useEffect(() => {
        const detail = {
            isActive: true,
            isCollapsed: isSidebarCollapsed,
        };
        window.dispatchEvent(new CustomEvent('adminLayoutChange', { detail }));

        return () => {
            window.dispatchEvent(new CustomEvent('adminLayoutChange', { detail: { isActive: false, isCollapsed: false } }));
        };
    }, [isSidebarCollapsed]);

    const menuItems = [
        { key: 'dashboard', label: 'Dashboard', icon: '📊' },
        { key: 'products', label: 'Quản lý sản phẩm', icon: '🛒' },
        { key: 'orders', label: 'Quản lý đơn hàng', icon: '📦' },
        { key: 'users', label: 'Quản lý người dùng', icon: '👥' },
        { key: 'profile', label: 'Thông tin cá nhân', icon: '👤' },
        { key: 'changepass', label: 'Đổi mật khẩu', icon: '🔑' },
        { key: 'settings', label: 'Cài đặt chung', icon: '⚙️' },
        { key: 'admin-intro', label: 'Giới thiệu quyền Admin', icon: '🛡️' },
    ];

    const renderContent = () => {
        switch (activeView) {
            case 'dashboard':
                return <DashboardView summary={summary} orders={orders} users={users} chartData={chartData} />;
            case 'products':
                return <ProductManagement />;
            case 'orders':
                return (
                    <div className="data-table-container with-bees">
                        <h2>Quản lý đơn hàng</h2>
                        <OrderHistoryTable />
                        <BeeDecorations />
                    </div>
                );
            case 'users':
                return (
                    <div className="data-table-container with-bees">
                        <h2>Quản lý người dùng</h2>
                        <UserManagement currentAdminEmail={user?.email}/>
                        <BeeDecorations />
                    </div>
                );
            case 'profile':
                return (
                    <div className="data-table-container with-bees">
                        <h2>Thông tin cá nhân</h2>
                        <ProfileInfo />
                        <BeeDecorations />
                    </div>
                );
            case 'changepass':
                return (
                     <div className="data-table-container with-bees">
                        <h2>Đổi mật khẩu</h2>
                        <ChangePasswordTab/>
                        <BeeDecorations />
                    </div>
                );
            case 'settings':
                return <SettingsTab />;
            case 'admin-intro':
                 setCurrentPage('admin');
                 return null;
            default:
                return <DashboardView summary={summary} orders={orders} chartData={chartData} />;
        }
    };
    
    const handleLogout = () => {
        logout();
        setCurrentPage('home');
    }

    return (
        <div className={`admin-dashboard ${isSidebarOpen ? 'sidebar-open' : ''} ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
            <Sidebar 
                user={user}
                menuItems={menuItems} 
                activeView={activeView} 
                setActiveView={setActiveView} 
                setShowLogoutConfirm={setShowLogoutConfirm}
                setCurrentPage={setCurrentPage}
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                isSidebarCollapsed={isSidebarCollapsed}
                setIsSidebarCollapsed={setIsSidebarCollapsed}
            />
            <MainContent user={user} activeView={activeView} menuItems={menuItems} setIsSidebarOpen={setIsSidebarOpen}>
                {renderContent()}
            </MainContent>
            {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>}
            {showLogoutConfirm && (
                <div className="logout-modal-overlay">
                    <div className="logout-modal-box">
                        <h3>Xác nhận Đăng xuất</h3>
                        <p>Bạn có chắc chắn muốn thoát không?</p>
                        <div className="modal-buttons">
                            <button className="btn-cancel" onClick={() => setShowLogoutConfirm(false)}>Hủy</button>
                            <button className="btn-confirm" onClick={handleLogout}>Đăng xuất</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Sidebar Component
const Sidebar = ({ user, menuItems, activeView, setActiveView, setShowLogoutConfirm, setCurrentPage, isSidebarOpen, setIsSidebarOpen, isSidebarCollapsed, setIsSidebarCollapsed }) => {
    return (
        <aside className={`dashboard-sidebar ${isSidebarOpen ? 'mobile-open' : ''}`}>
            <button className="sidebar-close-btn" onClick={() => setIsSidebarOpen(false)}>×</button>
            <div className="sidebar-header">
                <img src={user?.avatar || 'https://api.dicebear.com/7.x/initials/svg?seed=' + user?.name} alt="avatar" className="sidebar-avatar" /> 
                <div className='sidebar-user-info'>
                    <span className='sidebar-user-name'>{user?.name}</span>
                    <span className='sidebar-user-role'>{user?.role}</span>
                </div>
            </div>
            <ul className="sidebar-nav">
                {menuItems.map(item => (
                    <li 
                        key={item.key} 
                        className={`sidebar-nav-item ${activeView === item.key ? 'active' : ''}`}
                        onClick={() => {
                            if (item.key === 'admin-intro') {
                                setCurrentPage('admin');
                            } else {
                                setActiveView(item.key);
                            }
                        }}
                        title={item.label}
                    >
                        <span className="icon">{item.icon}</span>
                        <span className="sidebar-label">{item.label}</span>
                    </li>
                ))}
            </ul>
             <ul className="sidebar-nav sidebar-bottom-nav">
                <li className='sidebar-nav-item' onClick={() => setShowLogoutConfirm(true)}>
                    <span className="icon">↩️</span>
                    <span className="sidebar-label">Đăng xuất</span>
                </li>
                <li className='sidebar-nav-item sidebar-toggle-desktop' onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}>
                    <span className="icon">{isSidebarCollapsed ? '→' : '←'}</span>
                    <span className="sidebar-label">Thu gọn</span>
                </li>
            </ul>
        </aside>
    )
};

// Main Content Area Component
const MainContent = ({ user, activeView, children, menuItems, setIsSidebarOpen }) => {
    const activeItem = menuItems.find(item => item.key === activeView);
    const pageTitle = activeItem ? activeItem.label : 'Dashboard';
    
    return (
        <main className="dashboard-main">
            <header className="dashboard-header">
                <button className="sidebar-open-btn" onClick={() => setIsSidebarOpen(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                </button>
                <h1>{pageTitle}</h1>
                <div className="header-actions">
                    <div className="header-search">
                        <input type="text" placeholder="Search..." />
                    </div>
                    <div className="header-profile">
                        <img src={user?.avatar || 'https://api.dicebear.com/7.x/initials/svg?seed=' + user?.name} alt="profile" />
                    </div>
                </div>
            </header>
            <FallingLeaves />
            {children}
        </main>
    );
};

// New Product Management Component
function ProductManagement() {
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    // Initial data load
    useEffect(() => {
        const storedProducts = JSON.parse(localStorage.getItem('products') || '[]');
        setProducts(storedProducts);
    }, []);

    const handleAddNew = () => {
        setEditingProduct(null);
        setShowModal(true);
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setShowModal(true);
    };

    const handleDelete = (productId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
            const updatedProducts = products.filter(p => p.id !== productId);
            localStorage.setItem('products', JSON.stringify(updatedProducts));
            setProducts(updatedProducts);
        }
    };
    
    const handleSave = (productData) => {
        let updatedProducts;
        if (editingProduct) {
            // Update existing product
            updatedProducts = products.map(p => p.id === editingProduct.id ? { ...p, ...productData } : p);
        } else {
            // Add new product
            const newProduct = { ...productData, id: Date.now(), rating: 5 };
            updatedProducts = [...products, newProduct];
        }
        localStorage.setItem('products', JSON.stringify(updatedProducts));
        setProducts(updatedProducts);
        setShowModal(false);
    };

    return (
        <div className="data-table-container">
            <div className="table-header">
                <h2>Quản lý sản phẩm ({products.length})</h2>
                <button className="btn-add-new" onClick={handleAddNew}>+ Thêm sản phẩm</button>
            </div>
            <table className="data-table">
                <thead>
                    <tr>
                        <th>Hình ảnh</th>
                        <th>Tên sản phẩm</th>
                        <th>Giá</th>
                        <th>Loại</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => {
                        const hasDiscount = product.compareAtPrice && Number(product.compareAtPrice) > Number(product.price);
                        const discountPercent = hasDiscount ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100) : 0;

                        return (
                            <tr key={product.id}>
                                <td><img src={product.image} alt={product.name} className="product-table-img" /></td>
                                <td>{product.name}</td>
                                <td>
                                    <div className="price-cell">
                                        {hasDiscount && <span className="discount-badge">-{discountPercent}%</span>}
                                        <span className="current-price">{Number(String(product.price || '').replace(/\D/g, '')).toLocaleString('vi-VN')} vnđ</span>
                                        {hasDiscount && <span className="original-price">{Number(String(product.compareAtPrice || '').replace(/\D/g, '')).toLocaleString('vi-VN')} vnđ</span>}
                                    </div>
                                </td>
                                <td>{product.type}</td>
                                <td className="actions">
                                    <button className="btn-edit" onClick={() => handleEdit(product)}>Sửa</button>
                                    <button className="btn-delete" onClick={() => handleDelete(product.id)}>Xóa</button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
             {showModal && (
                <ProductModal 
                    product={editingProduct}
                    onSave={handleSave}
                    onClose={() => setShowModal(false)}
                />
            )}
            <BeeDecorations />
        </div>
    );
}

// Product Form Modal
function ProductModal({ product, onSave, onClose }) {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        compareAtPrice: '',
        costPrice: '',
        image: '',
        type: 'flower',
        description: '',
        ...(product || {})
    });
    const [imagePreview, setImagePreview] = useState(product?.image || null);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "image" && files && files[0]) {
            const file = files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setFormData(prev => ({ ...prev, image: reader.result }));
            };
            reader.readAsDataURL(file);
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    const price = parseFloat(formData.price) || 0;
    const cost = parseFloat(formData.costPrice) || 0;
    const profit = price - cost;
    const margin = price > 0 ? (profit / price) * 100 : 0;

    return (
        <div className="modal-overlay">
            <div className="modal-box product-modal">
                <h2>{product ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2>
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <img src={'/images/divider.png'} style={{width: '400px', marginBottom: '25px', opacity: 0.5}} alt="Xem trước" className="image-preview"/>
                </div>
                <form onSubmit={handleSubmit} className="product-form-layout">
                    <div className="form-left-panel">
                        <div className="form-group">
                            <label>Tên sản phẩm</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Mô tả</label>
                            <textarea name="description" value={formData.description} onChange={handleChange}></textarea>
                        </div>
                         <div className="form-group">
                            <label>Hình ảnh sản phẩm</label>
                            <div className="image-upload-container">
                                 <input
                                    type="file"
                                    name="image"
                                    id="file-upload"
                                    accept="image/*"
                                    onChange={handleChange}
                                    style={{ display: 'none' }}
                                />
                                <label htmlFor="file-upload" className="image-upload-label">
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Xem trước" className="image-preview" />
                                    ) : (
                                        <div className="upload-placeholder">
                                            <span>+ Tải ảnh lên</span>
                                        </div>
                                    )}
                                </label>
                            </div>
                        </div>

                    </div>
                    <div className="form-right-panel">
                        <div className="form-section">
                            <h3 className="form-section-title">Giá sản phẩm</h3>
                            <div className="form-group-row">
                                <div className="form-group">
                                    <label>Giá bán (vnđ)</label>
                                    <input type="number" name="price" value={formData.price} onChange={handleChange} required placeholder="0" />
                                </div>
                                <div className="form-group">
                                    <label>Giá so sánh (vnđ)</label>
                                    <input type="number" name="compareAtPrice" value={formData.compareAtPrice} onChange={handleChange} placeholder="0" />
                                </div>
                            </div>
                        </div>
                        <div className="form-section">
                             <h3 className="form-section-title">Quản lý tồn kho</h3>
                             <div className="form-group">
                                <label>Giá vốn (vnđ)</label>
                                <input type="number" name="costPrice" value={formData.costPrice} onChange={handleChange} placeholder="0" />
                            </div>
                            <div className="profit-summary">
                                <div className="summary-item">
                                    <span>Biên lợi nhuận:</span>
                                    <span>{margin.toFixed(2)}%</span>
                                </div>
                                <div className="summary-item">
                                    <span>Lợi nhuận:</span>
                                    <span>{profit.toLocaleString('vi-VN')} vnđ</span>
                                </div>
                            </div>
                        </div>
                         <div className="form-section">
                            <h3 className="form-section-title">Phân loại</h3>
                             <div className="form-group">
                                <label>Loại sản phẩm</label>
                                <select name="type" value={formData.type} onChange={handleChange}>
                                    <option value="flower">Mật ong hoa</option>
                                    <option value="wild">Mật ong rừng</option>
                                    <option value="natural">Mật ong thiên nhiên</option>
                                    <option value="pure">Mật ong nguyên chất</option>
                                    <option value="imported">Mật ong nhập khẩu</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </form>
                 <div className="modal-buttons product-modal">
                    <button type="button" className="btn-cancel" onClick={onClose}>Hủy</button>
                    <button type="button" className="btn-confirm" onClick={handleSubmit}>Lưu</button>
                </div>
            </div>
        </div>
    );
}

const FallingLeaves = () => {
    const leaves = Array.from({ length: 15 });
    return (
        <div className="leaves-container">
            {leaves.map((_, i) => (
                <div 
                    key={i} 
                    className="leaf"
                    style={{
                        left: `${Math.random() * 100}vw`,
                        animationDelay: `${Math.random() * 15}s`,
                        animationDuration: `${5 + Math.random() * 10}s`
                    }}
                />
            ))}
        </div>
    )
}

// Dashboard View (the main page with widgets)
const DashboardView = ({ summary, orders, users, chartData }) => {
    const formatCurrency = (value) => `${Math.round(value).toLocaleString('vi-VN')} vnđ`;
    const summaryData = [
        { title: 'Total Revenue', value: formatCurrency(summary.totalRevenue), trend: '+6.88%', status: 'positive' },
        { title: 'Total Orders', value: summary.totalOrders, trend: '+10.2%', status: 'positive' },
        { title: 'Total Users', value: summary.totalUsers, trend: '', status: '' },
        { title: 'Avg. Revenue Per Order', value: formatCurrency(summary.avgOrderValue), trend: '-2.01%', status: 'negative' }
    ];
    const recentOrders = orders.slice(-5).reverse();
    return (
    <>
        <div className="summary-cards">
            {summaryData.map(card => (
                <div key={card.title} className="summary-card">
                    <div className="info"><h3>{card.title}</h3><p>{card.value}</p></div>
                    <div className="card-footer">{card.status && <span className={`trend ${card.status}`}>{card.trend}</span>}</div>
                </div>
            ))}
        </div>
        <div className="charts-grid">
            <div className="chart-container">
                 <h2>Revenue Over Time</h2>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 40 }}>
                        <defs><linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/><stop offset="95%" stopColor="#8884d8" stopOpacity={0}/></linearGradient></defs>
                        <XAxis dataKey="date" angle={-45} textAnchor="end" height={60} />
                        <YAxis tickFormatter={(value) => new Intl.NumberFormat('vi-VN').format(value)}/>
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                        <Area type="monotone" dataKey="revenue" stroke="#8884d8" fillOpacity={1} fill="url(#colorRevenue)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
             <div className="chart-container">
                <h2>Top Customers</h2>
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[{name: 'User A', orders: 5}, {name: 'User B', orders: 3}]} margin={{ top: 10, right: 30, left: 0, bottom: 40 }}>
                        <XAxis dataKey="name" /><YAxis /><Tooltip /><Legend /><Bar dataKey="orders" fill="#82ca9d" />
                    </BarChart>
                </ResponsiveContainer>
             </div>
        </div>
        <div className="data-table-container with-bees" style={{marginTop: '24px'}}>
            <h2>Recent Orders</h2>
            <table className="data-table">
                <thead><tr><th>Order ID</th><th>Customer</th><th>Total</th><th>Date</th><th>Status</th></tr></thead>
                <tbody>
                    {recentOrders.map(order => (
                        <tr key={order.id}>
                            <td>#{order.id}</td><td>{order.name}</td><td>{Number(order.total.toString().replace(/\D/g, '')).toLocaleString('vi-VN')} vnđ</td><td>{order.date}</td><td><span className="status delivered">Delivered</span></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <BeeDecorations />
        </div>
    </>
    )
};

// SettingsTab component
function SettingsTab() {
    // Music CRUD
    const [musicList, setMusicList] = useState(() => {
        const stored = localStorage.getItem('musicList');
        return stored ? JSON.parse(stored) : [];
    });
    const [editingIndex, setEditingIndex] = useState(null);
    const [form, setForm] = useState({ title: '', artist: '', src: '', cover: '' });
    // Flower effect
    const [flowerEffect, setFlowerEffect] = useState(() => {
        const stored = localStorage.getItem('flowerEffect');
        return stored === 'true';
    });

    useEffect(() => {
        localStorage.setItem('musicList', JSON.stringify(musicList));
    }, [musicList]);
    useEffect(() => {
        localStorage.setItem('flowerEffect', flowerEffect);
        window.dispatchEvent(new Event('flower-effect-toggle'));
    }, [flowerEffect]);

    const handleInputChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleAddOrUpdate = e => {
        e.preventDefault();
        if (!form.title || !form.artist || !form.src) return;
        if (editingIndex !== null) {
            const updated = [...musicList];
            updated[editingIndex] = { ...form };
            setMusicList(updated);
            setEditingIndex(null);
        } else {
            setMusicList([...musicList, { ...form }]);
        }
        setForm({ title: '', artist: '', src: '', cover: '' });
    };
    const handleEdit = idx => {
        setEditingIndex(idx);
        setForm(musicList[idx]);
    };
    const handleDelete = idx => {
        if (window.confirm('Bạn có chắc muốn xóa bài này?')) {
            setMusicList(musicList.filter((_, i) => i !== idx));
        }
    };
    const handleCancelEdit = () => {
        setEditingIndex(null);
        setForm({ title: '', artist: '', src: '', cover: '' });
    };
    return (
        <div className="settings-tab">
            <h2>Cài đặt chung</h2>
            <section style={{marginBottom: 32}}>
                <h3>Quản lý nhạc cho MusicPlayer</h3>
                <form onSubmit={handleAddOrUpdate} className="music-form" style={{display: 'flex', flexDirection: 'column', gap: 8}}>
                    <input name="title" value={form.title} onChange={handleInputChange} placeholder="Tên bài hát" required />
                    <input name="artist" value={form.artist} onChange={handleInputChange} placeholder="Ca sĩ" required />
                    <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                        <input
                            type="text"
                            name="src"
                            value={form.src}
                            onChange={handleInputChange}
                            placeholder="Link mp3 (hoặc /music/tenfile.mp3)"
                            style={{flex: 1}}
                            required
                        />
                        <input
                            type="file"
                            accept="audio/mp3,audio/mpeg"
                            style={{width: 180}}
                            onChange={e => {
                                if (e.target.files && e.target.files[0]) {
                                    const file = e.target.files[0];
                                    setForm(f => ({ ...f, src: `/music/${file.name}` }));
                                }
                            }}
                        />
                    </div>
                    {form.src && form.src.startsWith('/music/') && (
                        <div style={{fontSize: 13, color: '#888', marginLeft: 4}}>Sử dụng file: <b>{form.src.replace('/music/', '')}</b> (bạn cần copy file này vào thư mục <b>public/music</b> nếu chưa có)</div>
                    )}
                    <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                        <input
                            type="text"
                            name="cover"
                            value={form.cover}
                            onChange={handleInputChange}
                            placeholder="Link ảnh bìa (tùy chọn)"
                            style={{flex: 1}}
                        />
                        <input
                            type="file"
                            accept="image/*"
                            style={{width: 180}}
                            onChange={e => {
                                if (e.target.files && e.target.files[0]) {
                                    const file = e.target.files[0];
                                    setForm(f => ({ ...f, cover: `/music/${file.name}` }));
                                }
                            }}
                        />
                    </div>
                    {form.cover && form.cover.startsWith('/music/') && (
                        <div style={{fontSize: 13, color: '#888', marginLeft: 4}}>Sử dụng file: <b>{form.cover.replace('/music/', '')}</b> (bạn cần copy file này vào thư mục <b>public/music</b> nếu chưa có)</div>
                    )}
                    <button type="submit">{editingIndex !== null ? 'Cập nhật' : 'Thêm'}</button>
                    {editingIndex !== null && <button type="button" onClick={handleCancelEdit}>Hủy</button>}
                </form>
                <ul className="music-list">
                    {musicList.map((song, idx) => (
                        <li key={idx} style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8}}>
                            <img src={song.cover || '/logo192.png'} alt="cover" style={{width: 40, height: 40, objectFit: 'cover', borderRadius: 4}} />
                            <div style={{flex: 1}}>
                                <b>{song.title}</b> <span style={{color: '#888'}}>{song.artist}</span>
                                <div style={{fontSize: 12, color: '#aaa'}}>{song.src}</div>
                            </div>
                            <button onClick={() => handleEdit(idx)}>Sửa</button>
                            <button onClick={() => handleDelete(idx)} style={{color: 'red'}}>Xóa</button>
                        </li>
                    ))}
                </ul>
            </section>
            <section style={{marginTop: 32}}>
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <h3 style={{margin: 0}}>Hiệu ứng hoa rơi</h3>
                <label className="flower-switch">
                  <input
                    type="checkbox"
                    checked={flowerEffect}
                    onChange={e => setFlowerEffect(e.target.checked)}
                  />
                  <span className="flower-slider"></span>
                </label>
              </div>
              <div style={{color: '#888', fontSize: 15, marginTop: 4}}>
                Bật hiệu ứng hoa rơi trên toàn trang
              </div>
            </section>
        </div>
    );
}

export default AdminDashboard;