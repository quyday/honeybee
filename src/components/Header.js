import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function Header({ setCurrentPage }) {
  const [activeMenu, setActiveMenu] = useState('home');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartItems, setIsCartOpen } = useCart();
  const { user } = useAuth();
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Debug logs
  console.log('Header user context:', user);
  console.log('Local storage user:', localStorage.getItem('user'));

  useEffect(() => {
    // Sync user from localStorage if context is null but localStorage has user
    if (!user && localStorage.getItem('user')) {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      console.log('Syncing user from localStorage:', storedUser);
    }
  }, [user]);

  const handleMenuClick = (menu) => {
    if (isTransitioning) return;
    
    // Kiểm tra nếu menu là profile và user chưa đăng nhập
    if (menu === 'profile' && !user) {
      handleMenuClick('login');
      return;
    }
    
    setIsTransitioning(true);
    setActiveMenu(menu);
    setCurrentPage(menu);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
    setIsMobileMenuOpen(false);
  };

  const handleAccountClick = (page) => {
    handleMenuClick(page);
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('mobile-menu-overlay')) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className="header">
      <div className="tophead lazyload" style={{backgroundImage: `url(${process.env.PUBLIC_URL}/images/bg_header.png)`}}>
        <div className="container">
          <div className="text_tophead">
            <img className="img-responsive lazyload"
              src="/images/bee_header.png"
              alt="bee_header"/>Miễn phí vận chuyển trên mọi đơn hàng
          </div>
        </div>
      </div>
      <div className="mid-header">
        <div className="container">
          <div className="row">
            <div className="col-lg-5 col-md-12 col-12">
              <div className="header_menu clearfix">
                <div className={`navigation-head menu_mobile${isMobileMenuOpen ? ' open' : ''}`}>
                  {isMobileMenuOpen && (
                    <>
                      <div className="mobile-menu-overlay" onClick={handleOverlayClick}></div>
                      <div className="mobile-menu-header">
                        <button className="close-mobile-menu" onClick={() => setIsMobileMenuOpen(false)}>×</button>
                      </div>
                    </>
                  )}
                  <nav className="nav-horizontal">
                    <div className="account_mb">
                      <a onClick={() => handleAccountClick('login')}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                          <path d="M224 256c70.7 0 128-57.31 128-128s-57.3-128-128-128C153.3 0 96 57.31 96 128S153.3 256 224 256zM274.7 304H173.3C77.61 304 0 381.6 0 477.3c0 19.14 15.52 34.67 34.66 34.67h378.7C432.5 512 448 496.5 448 477.3C448 381.6 370.4 304 274.7 304z" />
                        </svg>Đăng nhập
                      </a>
                      <a onClick={() => handleAccountClick('register')}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                          <path d="M490.3 40.4C512.2 62.27 512.2 97.73 490.3 119.6L460.3 149.7L362.3 51.72L392.4 21.66C414.3-.2135 449.7-.2135 471.6 21.66L490.3 40.4zM172.4 241.7L339.7 74.34L437.7 172.3L270.3 339.6C264.2 345.8 256.7 350.4 248.4 353.2L159.6 382.8C150.1 385.6 141.5 383.4 135 376.1C128.6 370.5 126.4 361 129.2 352.4L158.8 263.6C161.6 255.3 166.2 247.8 172.4 241.7V241.7zM192 63.1C209.7 63.1 224 78.33 224 95.1C224 113.7 209.7 127.1 192 127.1H96C78.33 127.1 64 142.3 64 159.1V416C64 433.7 78.33 448 96 448H352C369.7 448 384 433.7 384 416V319.1C384 302.3 398.3 287.1 416 287.1C433.7 287.1 448 302.3 448 319.1V416C448 469 405 512 352 512H96C42.98 512 0 469 0 416V159.1C0 106.1 42.98 63.1 96 63.1H192z" />
                        </svg>Đăng ký
                      </a>
                    </div>
                    <ul className="item_big">
                      <li className={`nav-item ${activeMenu === 'home' ? 'active' : ''}`}>
                        <a className="a-img" onClick={() => handleMenuClick('home')} title="Trang chủ">
                          <span>Trang chủ</span>
                        </a>
                      </li>
                      <li className={`nav-item level0 ${activeMenu === 'products' ? 'active' : ''}`}>
                        <a className="a-img" onClick={() => handleMenuClick('products')} title="Sản phẩm">
                          Sản phẩm 
                          <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="caret-down" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" className="svg-inline--fa fa-caret-down fa-w-10">
                            <path fill="currentColor" d="M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z" />
                          </svg>
                        </a>
                        <i className="icon icon-plus"></i>
                        <ul className="item_small level0">
                          <li className="level1">
                            <a onClick={() => handleMenuClick('products-imported')} title="Mật ong nhập khẩu">Mật ong nhập khẩu</a>
                          </li>
                          <li className="level1">
                            <a onClick={() => handleMenuClick('products-wild')} title="Mật ong rừng">Mật ong rừng<i className="icon-right"></i></a>
                            <i className="icon icon-plus"></i>
                            <ul className="level1">
                              <li className="level2">
                                <a href="mat-ong-thien-nhien.html" title="Mật ong rừng nhiệt đới" className="a3">Mật ong rừng nhiệt đới</a>
                              </li>
                              <li className="level2">
                                <a href="mat-ong-rung.html" title="Mật ong rừng hoa" className="a3">Mật ong rừng hoa</a>
                              </li>
                              <li className="level2">
                                <a href="mat-ong-rung.html" title="Mật ong rừng nhập mặn" className="a3">Mật ong rừng nhập mặn</a>
                              </li>
                            </ul>
                          </li>
                          <li className="level1">
                            <a onClick={() => handleMenuClick('products-flower')} title="Mật ong hoa">Mật ong hoa</a>
                          </li>
                          <li className="level1">
                            <a onClick={() => handleMenuClick('products-natural')} title="Mật ong thiên nhiên">Mật ong thiên nhiên</a>
                          </li>
                          <li className="level1">
                            <a onClick={() => handleMenuClick('products-pure')} title="Mật ong nguyên chất">Mật ong nguyên chất</a>
                          </li>
                        </ul>
                      </li>
                      <li className={`nav-item ${activeMenu === 'contact' ? 'active' : ''}`}>
                        <a className="a-img" onClick={() => handleMenuClick('contact')} title="Liên hệ">
                          <span>Liên hệ</span>
                        </a>
                      </li>
                      <li className={`nav-item ${activeMenu === 'about' ? 'active' : ''}`}>
                        <a className="a-img" onClick={() => handleMenuClick('introduct')} title="Giới thiệu">
                          <span>Giới thiệu</span>
                        </a>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
            <div className="col-lg-2 col-md-5 col-12">
              <div className="logo_center">
                <div className="logo">
                  <a href="/" className="logo-wrapper">
                    <img src="//bizweb.dktcdn.net/100/472/304/themes/887048/assets/logo.png?1729245409661" alt="logo Template Honey Bee"/>
                  </a>
                </div>
              </div>
            </div>
            <div className="col-lg-5 col-md-7 col-12">
              <div className="header-right">
                <div className="hotline_header">
                  Hotline:<a href="tel:18006750" style={{marginLeft: '10px'}}>0387-231-205</a>
                </div>
                <div className="account_header">
                  <a
                    onClick={() => handleMenuClick('profile')}
                    className="icon-cart"
                    style={{ cursor: 'pointer' }}
                  >
                    <svg aria-hidden="true" focusable="false" data-prefix="fal" data-icon="user" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="svg-inline--fa fa-user fa-w-14">
                      <path fill="currentColor" d="M313.6 288c-28.7 0-42.5 16-89.6 16-47.1 0-60.8-16-89.6-16C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4zM416 464c0 8.8-7.2 16-16 16H48c-8.8 0-16-7.2-16-16v-41.6C32 365.9 77.9 320 134.4 320c19.6 0 39.1 16 89.6 16 50.4 0 70-16 89.6-16 56.5 0 102.4 45.9 102.4 102.4V464zM224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm0-224c52.9 0 96 43.1 96 96s-43.1 96-96 96-96-43.1-96-96 43.1-96 96-96z" className=""></path>
                    </svg>
                    {user && (
                      <span style={{ marginLeft: 8, fontWeight: 'bold', color: 'rgb(229 200 167)' }}>
                        {user.name || user.email}
                      </span>
                    )}
                  </a>
                  <div className="ac_hover">
                    {!user && <a onClick={() => handleMenuClick('login')}>Đăng nhập</a>}
                    {!user && <a onClick={() => handleMenuClick('register')}>Đăng ký</a>}
                    {user && <a onClick={() => handleMenuClick('profile')}>Thông tin cá nhân</a>}
                  </div>
                </div>
                <div className="header_search clearfix">
                  <div className="icon_search">
                    <i className="fas fa-search"></i>
                  </div>
                  <form action="/search" className="input-group search-bar theme-header-search-form ultimate-search" role="search">
                    <input type="text" aria-label="Tìm sản phẩm" name="query" defaultValue="" autoComplete="off" placeholder="Từ khóa tìm kiếm" className="search-auto input-group-field auto-search" required />
                    <input type="hidden" name="type" value="product" />
                    <span className="input-group-btn">
                      <button className="btn icon-fallback-text" aria-label="Justify">
                        <i className="fas fa-search"></i>
                      </button>
                    </span>
                  </form>
                </div>
                <div className="top-cart-contain">
                  <a onClick={() => handleMenuClick('cart')} className="img_hover_cart" title="Giỏ hàng">
                    <i className="fas fa-shopping-cart"></i>
                    <span className="count_item count_item_pr">{totalQuantity}</span>
                  </a>
                </div>
                <div className="menu-bar-mobile menu-bar-h nav-mobile-button" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                  <div className="menu-bar">
                    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="12" viewBox="0 0 19 12" fill="none">
                      <path d="M6.94116 2V0H18.9412V2H6.94116Z" fill="white" />
                      <path d="M0.941162 7H18.9412V5H0.941162V7Z" fill="white" />
                      <path d="M6.94116 12H18.9412V10H6.94116V12Z" fill="white" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header; 