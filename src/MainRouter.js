import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductList from './pages/ProductList';
import ProductDetailPage from './pages/ProductDetailPage';
import Cart from './pages/Cart';
import Introduct from './pages/Introduct';
import Contact from './pages/Contact';
import NewsDetail from './pages/NewsDetail';
import ProfilePage from './pages/ProfilePage';
import { useAuth } from './context/AuthContext';
import Header from './components/Header';
import CartHeader from './components/CartHeader';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';
import Admin from './pages/Admin';
import CheckoutPage from './pages/CheckoutPage';

function MainRouter() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedNews, setSelectedNews] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    console.log('MainRouter user state:', user); // Debug log
    
    // Nếu user là admin, chuyển sang trang admin
    if (user && user.role === 'admin') {
        setCurrentPage('admin');
    }
  }, [user]);

  // Hàm xử lý click tiêu đề tin tức
  const handleNewsClick = (newsKey) => {
    setSelectedNews(newsKey);
    setCurrentPage('news-detail');
  };

  const renderPage = () => {
    console.log('Rendering page:', currentPage); // Debug log
    switch (currentPage) {
      case 'home':
        return <Home setCurrentPage={setCurrentPage} setSelectedNews={setSelectedNews} onNewsClick={handleNewsClick} setSelectedProduct={setSelectedProduct} />;
      case 'login':
        return <Login setCurrentPage={setCurrentPage} />;
      case 'register':
        return <Register setCurrentPage={setCurrentPage} />;
      case 'products':
        return <ProductList onNavigate={setCurrentPage} />;
      case 'products-flower':
        return <ProductList onNavigate={setCurrentPage} filterType="flower" title="Mật ong hoa" />;
      case 'products-wild':
        return <ProductList onNavigate={setCurrentPage} filterType="wild" title="Mật ong rừng" />;
      case 'products-wild-tropical':
        return <ProductList onNavigate={setCurrentPage} filterType="wild-tropical" title="Mật ong rừng nhiệt đới" />;
      case 'products-wild-flower':
        return <ProductList onNavigate={setCurrentPage} filterType="wild-flower" title="Mật ong rừng hoa" />;
      case 'products-wild-saltwater':
        return <ProductList onNavigate={setCurrentPage} filterType="wild-saltwater" title="Mật ong rừng ngập mặn" />;
      case 'products-natural':
        return <ProductList onNavigate={setCurrentPage} filterType="natural" title="Mật ong thiên nhiên" />;
      case 'products-pure':
        return <ProductList onNavigate={setCurrentPage} filterType="pure" title="Mật ong nguyên chất" />;
      case 'products-imported':
        return <ProductList onNavigate={setCurrentPage} filterType="imported" title="Mật ong nhập khẩu" />;
      case 'product-detail':
        return <ProductDetailPage setCurrentPage={setCurrentPage} product={selectedProduct} setSelectedProduct={setSelectedProduct} />;
      case 'cart':
        return <Cart setCurrentPage={setCurrentPage} />;
      case 'introduct':
        return <Introduct setCurrentPage={setCurrentPage} />;
      case 'contact':
        return <Contact setCurrentPage={setCurrentPage} />;
      case 'news-detail':
        return <NewsDetail setCurrentPage={setCurrentPage} news={selectedNews} />;
      case 'profile':
        return user ? <ProfilePage setCurrentPage={setCurrentPage} /> : <Login setCurrentPage={setCurrentPage} />;
      case 'admin':
        return user && user.role === 'admin' ? <Admin setCurrentPage={setCurrentPage} /> : <Login setCurrentPage={setCurrentPage} />;
      case 'checkout':
        return <CheckoutPage setCurrentPage={setCurrentPage} />;
      case 'admin-messages':
        return (
          <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, color: '#f5af1a', fontWeight: 600 }}>
            <span>Đây là trang chat với admin (demo)</span>
          </div>
        );
      default:
        return <Home setCurrentPage={setCurrentPage} setSelectedNews={setSelectedNews} onNewsClick={handleNewsClick} />;
    }
  };

  // Icon message + popup info
  const [showContact, setShowContact] = useState(false);
  const iconStyle = {
    position: 'fixed',
    right: 32,
    bottom: 120,
    zIndex: 9999,
    background: 'linear-gradient(120deg, #f5af1a 0%, #ffe082 100%)',
    borderRadius: '50%',
    width: 60,
    height: 60,
    boxShadow: '0 4px 16px #ffe08299',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'box-shadow 0.2s, transform 0.2s',
    fontSize: 32,
    color: '#fff',
    border: '3px solid #fffbe7',
    animation: 'slideInMsg 0.7s cubic-bezier(.68,-0.55,.27,1.55)',
  };
  if (!document.getElementById('msg-slidein-keyframes')) {
    const style = document.createElement('style');
    style.id = 'msg-slidein-keyframes';
    style.innerHTML = `@keyframes slideInMsg { from { transform: translateX(120px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`;
    document.head.appendChild(style);
  }
  const popupStyle = {
    position: 'fixed',
    right: 100,
    bottom: 40,
    zIndex: 10000,
    background: '#fffbe7',
    color: '#b8860b',
    borderRadius: 16,
    boxShadow: '0 4px 24px #ffe08299',
    padding: '20px 32px',
    minWidth: 260,
    fontSize: 17,
    fontWeight: 500,
    animation: 'fadeInAdmin 0.5s',
  };

  return (
    <>
      <Header setCurrentPage={setCurrentPage} />
      <CartHeader />
      <CartSidebar setCurrentPage={setCurrentPage} />
      <main className="main-content">
        {renderPage()}
      </main>
      <Footer setCurrentPage={setCurrentPage} />
      {/* Icon message fixed góc trái */}
      <div
        className="contact-admin-icon"
        style={iconStyle}
        onMouseEnter={() => setShowContact(true)}
        onMouseLeave={() => setShowContact(false)}
        onClick={() => window.open('https://www.facebook.com/messages/e2ee/t/7498801963555219/', '_blank')}
        title="Liên hệ admin"
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
      </div>
      {showContact && (
        <div style={popupStyle} onMouseEnter={() => setShowContact(true)} onMouseLeave={() => setShowContact(false)}>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Liên hệ Admin</div>
          <div>Tên: Nguyễn Công Quý</div>
          <div>Hotline: <a href="tel:0387231205" style={{ color: '#f5af1a', fontWeight: 600, textDecoration: 'none' }}>0387-231-205</a></div>
          <div style={{ marginTop: 8, fontSize: 14, color: '#888' }}>(Bấm vào icon để chat với admin)</div>
        </div>
      )}
    </>
  );
}

export default MainRouter; 