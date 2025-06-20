import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';
import { useAuth } from '../context/AuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { OrderHistoryTable, UserManagement, ChangePasswordTab, ProfileInfo } from './Profile'; // Re-use components


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
function AdminDashboardPage({ setCurrentPage }) {
    const { user, logout } = useAuth();
    const [activeView, setActiveView] = useState('dashboard');
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

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


    const menuItems = [
        { key: 'dashboard', label: 'Dashboard', icon: '📊' },
        { key: 'products', label: 'Quản lý sản phẩm', icon: '🛒' },
        { key: 'orders', label: 'Quản lý đơn hàng', icon: '📦' },
        { key: 'users', label: 'Quản lý người dùng', icon: '👥' },
        { key: 'profile', label: 'Thông tin cá nhân', icon: '👤' },
        { key: 'changepass', label: 'Đổi mật khẩu', icon: '⚙️' },
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
        <div className="admin-dashboard">
            <Sidebar 
                user={user}
                menuItems={menuItems} 
                activeView={activeView} 
                setActiveView={setActiveView} 
                setShowLogoutConfirm={setShowLogoutConfirm}
                setCurrentPage={setCurrentPage}
            />
            <MainContent user={user} activeView={activeView} menuItems={menuItems}>
                {renderContent()}
            </MainContent>

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
const Sidebar = ({ user, menuItems, activeView, setActiveView, setShowLogoutConfirm, setCurrentPage }) => {
    return (
        <aside className="dashboard-sidebar">
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
                    >
                        <span className="icon">{item.icon}</span>
                        {item.label}
                    </li>
                ))}
            </ul>
             <ul className="sidebar-nav">
                <li className='sidebar-nav-item' onClick={() => setShowLogoutConfirm(true)}>
                    <span className="icon">↩️</span>
                    Đăng xuất
                </li>
            </ul>
        </aside>
    )
};

// Main Content Area Component
const MainContent = ({ user, activeView, children, menuItems }) => {
    const activeItem = menuItems.find(item => item.key === activeView);
    const pageTitle = activeItem ? activeItem.label : 'Dashboard';
    
    return (
        <main className="dashboard-main">
            <header className="dashboard-header">
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

function ProductManagement() {
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

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
            updatedProducts = products.map(p => p.id === editingProduct.id ? { ...p, ...productData } : p);
        } else {
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
                    {products.map(product => (
                        <tr key={product.id}>
                            <td><img src={product.image} alt={product.name} className="product-table-img" /></td>
                            <td>{product.name}</td>
                            <td>{Number(product.price).toLocaleString('vi-VN')} vnđ</td>
                            <td>{product.type}</td>
                            <td className="actions">
                                <button className="btn-edit" onClick={() => handleEdit(product)}>Sửa</button>
                                <button className="btn-delete" onClick={() => handleDelete(product.id)}>Xóa</button>
                            </td>
                        </tr>
                    ))}
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

function ProductModal({ product, onSave, onClose }) {
    const [formData, setFormData] = useState({
        name: '', price: '', image: '', type: 'flower', description: '', ...(product || {})
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-box product-modal">
                <h2>{product ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group"><label>Tên sản phẩm</label><input type="text" name="name" value={formData.name} onChange={handleChange} required /></div>
                    <div className="form-group"><label>Giá (vnđ)</label><input type="number" name="price" value={formData.price} onChange={handleChange} required /></div>
                    <div className="form-group"><label>URL Hình ảnh</label><input type="text" name="image" value={formData.image} onChange={handleChange} required /></div>
                    <div className="form-group"><label>Loại sản phẩm</label><select name="type" value={formData.type} onChange={handleChange}><option value="flower">Mật ong hoa</option><option value="wild">Mật ong rừng</option><option value="natural">Mật ong thiên nhiên</option><option value="pure">Mật ong nguyên chất</option><option value="imported">Mật ong nhập khẩu</option></select></div>
                    <div className="form-group"><label>Mô tả</label><textarea name="description" value={formData.description} onChange={handleChange}></textarea></div>
                    <div className="modal-buttons"><button type="button" className="btn-cancel" onClick={onClose}>Hủy</button><button type="submit" className="btn-confirm">Lưu</button></div>
                </form>
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
                    <div className="info">
                        <h3>{card.title}</h3>
                        <p>{card.value}</p>
                    </div>
                    <div className="card-footer">
                        {card.status && <span className={`trend ${card.status}`}>{card.trend}</span>}
                    </div>
                </div>
            ))}
        </div>

        <div className="charts-grid">
            <div className="chart-container">
                 <h2>Revenue Over Time</h2>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 40 }}>
                        <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
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
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="orders" fill="#82ca9d" />
                    </BarChart>
                </ResponsiveContainer>
             </div>
        </div>

        <div className="data-table-container with-bees" style={{marginTop: '24px'}}>
            <h2>Recent Orders</h2>
            <table className="data-table">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Total</th>
                        <th>Date</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {recentOrders.map(order => (
                        <tr key={order.id}>
                            <td>#{order.id}</td>
                            <td>{order.name}</td>
                            <td>{Number(order.total.toString().replace(/\D/g, '')).toLocaleString('vi-VN')} vnđ</td>
                            <td>{order.date}</td>
                            <td>
                                <span className="status delivered">
                                    Delivered
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <BeeDecorations />
        </div>
    </>
    )
};

export default AdminDashboardPage; 