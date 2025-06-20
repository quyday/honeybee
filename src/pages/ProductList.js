import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ProductDetailPage from './ProductDetailPage';
import './ProductList.css';

function ProductForm({ product, onSubmit, onCancel }) {
  const [name, setName] = useState(product ? product.name : '');
  const [price, setPrice] = useState(product ? product.price : '');
  const [image, setImage] = useState(product ? product.image : '');
  const [preview, setPreview] = useState(product ? product.image : '');

  // Định nghĩa lại style cho nút trong form
  const honeyButton = {
    background: 'linear-gradient(90deg, #f5af1a 0%, #ffce3c 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '8px 18px',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 8,
    boxShadow: '0 2px 8px rgba(245,175,26,0.15)',
    cursor: 'pointer',
    transition: 'transform 0.1s, box-shadow 0.1s',
  };
  const honeyButtonDanger = {
    ...honeyButton,
    background: 'linear-gradient(90deg, #f55 0%, #ffb347 100%)',
  };

  const honeyInput = {
    width: '100%',
    padding: '10px 14px',
    border: '2px solid #ffe082',
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 14,
    outline: 'none',
    boxSizing: 'border-box',
    background: '#fffbe7',
    color: '#333',
    transition: 'border-color 0.2s',
  };
  const honeyFileInput = {
    ...honeyInput,
    padding: 0,
    background: 'transparent',
    border: 'none',
    marginBottom: 14,
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ id: product ? product.id : undefined, name, price, image });
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 16 }}>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Tên sản phẩm" required style={honeyInput} />
      <input value={price} onChange={e => setPrice(e.target.value)} placeholder="Giá" type="number" required style={honeyInput} />
      <input type="file" accept="image/*" onChange={handleImageChange} style={honeyFileInput} />
      {preview && (
        <div style={{ margin: '8px 0' }}>
          <img src={preview} alt="preview" style={{ maxWidth: 120, maxHeight: 120, borderRadius: 8, boxShadow: '0 2px 8px #ffe082' }} />
        </div>
      )}
      <button type="submit" style={honeyButton}>{product ? 'Lưu' : 'Thêm'}</button>
      <button type="button" style={honeyButtonDanger} onClick={onCancel}>Hủy</button>
    </form>
  );
}

function OrderHistory({ onClose }) {
  const orders = [
    { id: 1, user: 'Nguyễn Văn A', product: 'Mật ong rừng', quantity: 2, date: '2024-06-01' },
    { id: 2, user: 'Trần Thị B', product: 'Mật ong hoa', quantity: 1, date: '2024-06-02' }
  ];
  return (
    <div style={{ background: '#fff', border: '1px solid #ccc', padding: 16, position: 'fixed', top: 100, left: '50%', transform: 'translateX(-50%)', zIndex: 1000 }}>
      <h3>Lịch sử đặt hàng</h3>
      <ul>
        {orders.map(order => (
          <li key={order.id}>
            {order.date} - {order.user} đặt {order.quantity} {order.product}
          </li>
        ))}
      </ul>
      <button onClick={onClose}>Đóng</button>
    </div>
  );
}

function Sidebar() {
  return (
    <aside className="dqdt-sidebar sidebar left-content-product col-lg-3 col-md-4 col-sm-4">
      <div className="wrap_background_aside asidecollection">
        <aside className="aside-item sidebar-category collection-category clear-fix">
          <div className="aside-title">
            <h2>
              <span>
                Danh mục sản phẩm
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className="fa fa-down-arrow">
                  <path d="M192 384c-8.188 0-16.38-3.125-22.62-9.375l-160-160c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L192 306.8l137.4-137.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-160 160C208.4 380.9 200.2 384 192 384z" />
                </svg>
              </span>
            </h2>
          </div>
          <div className="aside-content clearfix">
            <nav className="nav-category navbar-toggleable-md">
              <ul className="nav navbar-pills">
                <li className="nav-item"><a className="nav-link" href="/">Trang chủ</a></li>
                <li className="nav-item current">
                  <a href="all.html" className="nav-link">Sản phẩm</a>
                  <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="angle-down" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" className="fa-plus svg-inline--fa fa-angle-down fa-w-10">
                    <path fill="currentColor" d="M143 352.3L7 216.3c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0l96.4 96.4 96.4-96.4c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9l-136 136c-9.2 9.4-24.4 9.4-33.8 0z" className=""></path>
                  </svg>
                  <ul className="dropdown-menu">
                    <li className="nav-item">
                      <a className="nav-link" href="../mat-ong-thien-nhien.html">Mật ong nhập khẩu</a>
                    </li>
                    <li className="dropdown-submenu nav-item">
                      <a className="nav-link" href="../mat-ong-rung.html">Mật ong rừng</a>
                      <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="angle-down" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" className="fa-plus svg-inline--fa fa-angle-down fa-w-10">
                        <path fill="currentColor" d="M143 352.3L7 216.3c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0l96.4 96.4 96.4-96.4c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9l-136 136c-9.2 9.4-24.4 9.4-33.8 0z" className=""></path>
                      </svg>
                      <ul className="dropdown-menu">
                        <li className="nav-item lv3">
                          <a className="nav-link" href="../mat-ong-thien-nhien.html">Mật ong rừng nhiệt đới</a>
                        </li>
                        <li className="nav-item lv3">
                          <a className="nav-link" href="../mat-ong-rung.html">Mật ong rừng hoa</a>
                        </li>
                        <li className="nav-item lv3">
                          <a className="nav-link" href="../mat-ong-rung.html">Mật ong rừng nhập mặn</a>
                        </li>
                      </ul>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="../mat-ong-hoa.html">Mật ong hoa</a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="../mat-ong-thien-nhien.html">Mật ong thiên nhiên</a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="../mat-ong-hoa.html">Mật ong nguyên chất</a>
                    </li>
                  </ul>
                </li>
                <li className="nav-item"><a className="nav-link" href="">Tin tức</a></li>
                <li className="nav-item"><a className="nav-link" href="../lien-he.html">Liên hệ</a></li>
                <li className="nav-item"><a className="nav-link" href="../gioi-thieu.html">Giới thiệu</a></li>
                <li className="nav-item"><a className="nav-link" href="">Cẩm nang</a></li>
              </ul>
            </nav>
          </div>
        </aside>
      </div>
    </aside>
  );
}

function ProductList({ onNavigate, filterType, title }) {
  const { user } = useAuth();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [sortBy, setSortBy] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6; // Số sản phẩm mỗi trang

  // Lấy sản phẩm từ localStorage hoặc dùng mặc định
  const [products, setProducts] = useState(() => {
    const stored = localStorage.getItem('products');
    if (stored) {
      return JSON.parse(stored);
    }
    return [
    {
      id: 1,
      name: "Mật Hoa Cà Phê",
      price: "100.000",
      comparePrice: "300.000",
      discount: "67",
      image: process.env.PUBLIC_URL + "/images/15.png",
      style: { width: "70%", height: "100%" },
      variantId: "76949308",
      hasOptions: false,
      type: "flower"
    },
    {
      id: 2,
      name: "Mật ong rừng mật khoái",
      price: "500.000",
      image: process.env.PUBLIC_URL + "/images/14.png",
      variantId: "76949082",
      hasOptions: false,
      type: "wild"
    },
    {
      id: 3,
      name: "Mật Ong Hoa Sâm Ngọc Linh",
      price: "1.000.000",
      comparePrice: "1.500.000",
      discount: "33",
      image: process.env.PUBLIC_URL + "/images/9350631000056.jpg",
      variantId: "76948955",
      hasOptions: true,
      type: "flower"
    },
    {
      id: 4,
      name: "Mật ong sữa chúa",
      price: "250.000",
      comparePrice: "500.000",
      discount: "50",
      image: process.env.PUBLIC_URL + "/images/13.png",
      variantId: "76948807",
      hasOptions: false,
      type: "natural"
    },
    {
      id: 5,
      name: "Mật ong chín Hoa Nhãn Cổ Thụ",
      price: "150.000",
      comparePrice: "200.000",
      discount: "25",
      image: process.env.PUBLIC_URL + "/images/3df-800-10-1f1424d2-97db-4cea-ba6e-d3c585d47bea.jpg",
      variantId: "76948513",
      hasOptions: false,
      type: "flower"
    },
    {
      id: 6,
      name: "Mật ong Hoa Bạc Hà",
      price: "350.000",
      comparePrice: "700.000",
      discount: "50",
      image: process.env.PUBLIC_URL + "/images/11.png",
      variantId: "76948333",
      hasOptions: true,
      type: "flower"
    },
    {
      id: 7,
      name: "Mật ong Tinh nghệ",
      price: "700.000",
      comparePrice: "1.000.000",
      discount: "30",
      image: process.env.PUBLIC_URL + "/images/8.png",
      variantId: "10000007",
      hasOptions: false,
      type: "natural"
    },
    {
      id: 8,
      name: "Mật ong chín Hoa Xuyên Chi",
      price: "300.000",
      comparePrice: "600.000",
      discount: "50",
      image: process.env.PUBLIC_URL + "/images/4.png",
      variantId: "10000008",
      hasOptions: false,
      type: "flower"
    },
    {
      id: 9,
      name: "Mật ong rừng Hoa Rừng Phương Nam",
      price: "200.000",
      comparePrice: "400.000",
      discount: "50",
      image: process.env.PUBLIC_URL + "/images/17.png",
      variantId: "10000009",
      hasOptions: false,
      type: "wild"
    },
    {
      id: 10,
      name: "Mật ong rừng Hoa Cao Nguyên",
      price: "230.000",
      comparePrice: "300.000",
      discount: "23",
      image: process.env.PUBLIC_URL + "/images/16.png",
      variantId: "10000010",
      hasOptions: false,
      type: "wild"
    },
    {
      id: 11,
      name: "Mật ong rừng cao thảo dược Honimore",
      price: "300.000",
      comparePrice: "500.000",
      discount: "40",
      image: process.env.PUBLIC_URL + "/images/frame-8.png",
      variantId: "10000011",
      hasOptions: false,
      type: "wild"
    },
    {
      id: 12,
      name: "Mật ong rừng Hoa Yên Bạch Honimore",
      price: "500.000",
      image: process.env.PUBLIC_URL + "/images/frame-7-1.png",
      variantId: "10000012",
      hasOptions: false,
      type: "wild"
    },
    {
      id: 13,
      name: "Mật ong rừng nhiệt đới A",
      price: "450.000",
      image: process.env.PUBLIC_URL + "/images/honey1.jpg",
      variantId: "10000013",
      hasOptions: false,
      type: "wild-tropical"
    },
    {
      id: 14,
      name: "Mật ong rừng nhiệt đới B",
      price: "480.000",
      image: process.env.PUBLIC_URL + "/images/7-d32481ff-654d-414f-9782-34420d36363b.png",
      variantId: "10000014",
      hasOptions: false,
      type: "wild-tropical"
    },
    {
      id: 15,
      name: "Mật ong rừng hoa Xuyến Chi",
      price: "320.000",
      image: process.env.PUBLIC_URL + "/images/4.png",
      variantId: "10000015",
      hasOptions: false,
      type: "wild-flower"
    },
    {
      id: 16,
      name: "Mật ong rừng ngập mặn Trà Vinh",
      price: "550.000",
      image: process.env.PUBLIC_URL + "/images/honey1.jpg",
      variantId: "10000016",
      hasOptions: false,
      type: "wild-saltwater"
    },
    {
      id: 17,
      name: "Mật ong Manuka Úc",
      price: "1.200.000",
      image: process.env.PUBLIC_URL + "/images/australian-manuka-honey-mgo-30-500g.jpg",
      variantId: "10000017",
      hasOptions: false,
      type: "imported"
    },
    {
      id: 18,
      name: "Mật ong Bramwells Anh Quốc",
      price: "950.000",
      image: process.env.PUBLIC_URL + "/images/bramwells-mgo100-manuka-honey.jpg",
      variantId: "10000018",
      hasOptions: false,
      type: "imported"
    },
    {
      id: 19,
      name: "Mật ong nguyên chất Squeezy",
      price: "180.000",
      image: process.env.PUBLIC_URL + "/images/honey1.jpg",
      variantId: "10000019",
      hasOptions: false,
      type: "pure"
    },
    {
      id: 20,
      name: "Mật ong nguyên chất Organic",
      price: "220.000",
      image: process.env.PUBLIC_URL + "/images/13.png",
      variantId: "10000020",
      hasOptions: false,
      type: "pure"
    }
  ];
  });
  
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showOrderHistory, setShowOrderHistory] = useState(false);

  // Lưu products vào localStorage mỗi khi thay đổi
  React.useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  // Định nghĩa style cho các nút ngoài ProductForm
  const honeyButton = {
    background: 'linear-gradient(90deg, #f5af1a 0%, #ffce3c 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '8px 18px',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 8,
    boxShadow: '0 2px 8px rgba(245,175,26,0.15)',
    cursor: 'pointer',
    transition: 'transform 0.1s, box-shadow 0.1s',
  };
  const honeyButtonDanger = {
    ...honeyButton,
    background: 'linear-gradient(90deg, #f55 0%, #ffb347 100%)',
  };
  const honeyButtonSmall = {
    ...honeyButton,
    fontSize: 14,
    padding: '6px 14px',
    marginRight: 4,
  };
  const honeyButtonSmallDanger = {
    ...honeyButtonDanger,
    fontSize: 14,
    padding: '6px 14px',
    marginRight: 4,
  };

  // Lọc sản phẩm dựa trên filterType
  const filteredProducts = filterType
    ? products.filter(p => {
        if (filterType === 'wild') {
          // Nếu danh mục là 'wild', hiển thị tất cả các loại con (wild, wild-tropical, v.v.)
          return p.type && p.type.startsWith('wild');
        }
        // Ngược lại, khớp chính xác loại
        return p.type === filterType;
      })
    : products;

  const getSortedProducts = () => {
    let sorted = [...filteredProducts]; // Sử dụng danh sách đã lọc
    switch (sortBy) {
      case 'price-asc':
        sorted.sort((a, b) => parseFloat(a.price.replace(/\\./g, '')) - parseFloat(b.price.replace(/\\./g, '')));
        break;
      case 'price-desc':
        sorted.sort((a, b) => parseFloat(b.price.replace(/\\./g, '')) - parseFloat(a.price.replace(/\\./g, '')));
        break;
      case 'created-desc':
        sorted.sort((a, b) => b.id - a.id);
        break;
      case 'created-asc':
        sorted.sort((a, b) => a.id - b.id);
        break;
      default:
        break;
    }
    return sorted;
  };

  // Lấy sản phẩm đã sắp xếp
  const sortedProducts = getSortedProducts();
  // Phân trang
  const totalPages = Math.ceil(sortedProducts.length / pageSize);
  const paginatedProducts = sortedProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1); // Reset về trang đầu khi đổi sắp xếp
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Thêm/sửa/xóa sản phẩm
  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };
  const handleDeleteProduct = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };
  const handleFormSubmit = (product) => {
    if (editingProduct) {
      setProducts(products.map(p => p.id === product.id ? product : p));
    } else {
      setProducts([...products, { ...product, id: Date.now() }]);
    }
    setShowForm(false);
  };

  if (selectedProduct) {
    return <ProductDetailPage product={selectedProduct} setCurrentPage={onNavigate} setSelectedProduct={setSelectedProduct} />;
  }

  return (
    <main className="wrapperMain_content">
      <nav className="bread-crumb clearfix">
        <div className="container">
          <ul className="breadcrumb">
            <li className="home">
              <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('home'); }}>
                <span>Trang chủ</span>
              </a>
              <span className="mr_lr">&nbsp;/&nbsp;</span>
            </li>
            <li><strong><span>{title || 'Tất cả sản phẩm'}</span></strong></li>
          </ul>
        </div>
      </nav>
      <div className="section wrap_background">
        <div className="container">
          <div className="bg_collection">
            <div className="row">
              <Sidebar />
              <div className="main_container collection right-content col-lg-9 col-md-12 col-sm-12">
                {/* Nút quản trị cho admin */}
                {user && user.role === 'admin' && (
                  <div style={{ marginBottom: 24, display: 'flex', gap: 12 }}>
                    <button style={honeyButton} onClick={handleAddProduct}>Thêm sản phẩm</button>
                    <button style={honeyButton} onClick={() => setShowOrderHistory(true)}>Xem lịch sử đặt hàng</button>
                    <button style={honeyButtonDanger} onClick={() => {
                      if (window.confirm('Bạn có chắc muốn reset về danh sách sản phẩm mặc định?')) {
                        localStorage.removeItem('products');
                        window.location.reload();
                      }
                    }}>Reset về mặc định</button>
                  </div>
                )}
                {showForm && (
                  <ProductForm
                    product={editingProduct}
                    onSubmit={handleFormSubmit}
                    onCancel={() => setShowForm(false)}
                  />
                )}
                {showOrderHistory && (
                  <OrderHistory onClose={() => setShowOrderHistory(false)} />
                )}
                <div className="sortPagiBar">
                  <div className="row">
                    <div className="col-xl-8 col-md-6 col-12">
                      <h1 className="collectiontitle">{title || 'Tất cả sản phẩm'}</h1>
                    </div>
                    <div className="col-xl-4 col-md-6 col-12">
                      <div className="sort-cate clearfix">
                        <div className="sort-by">
                          <label className="left">Sắp xếp: </label>
                          <select name="sortBy" id="sortBy" className="selectBox" value={sortBy} onChange={handleSortChange}>
                            <option value="default">Mặc định</option>
                            <option value="price-asc">Giá tăng dần</option>
                            <option value="price-desc">Giá giảm dần</option>
                            <option value="created-desc">Hàng mới nhất</option>
                            <option value="created-asc">Hàng cũ nhất</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="category-products products">
                  <section className="products-view view-grid products-view-grid collection_reponsive">
                    <div className="row">
                      {paginatedProducts.map(product => {
                        // Xử lý giá bán, giá so sánh, badge giảm giá, biên lợi nhuận
                        const price = Number(String(product.price || '').replace(/\D/g, ''));
                        const comparePrice = Number(String(product.compareAtPrice || product.comparePrice || '').replace(/\D/g, ''));
                        const costPrice = Number(String(product.costPrice || '').replace(/\D/g, ''));
                        const hasDiscount = comparePrice > price;
                        const discountPercent = hasDiscount ? Math.round(((comparePrice - price) / comparePrice) * 100) : 0;
                        const hasCost = !isNaN(costPrice) && costPrice > 0 && price > 0;
                        const margin = hasCost ? ((price - costPrice) / price) * 100 : null;
                        return (
                        <div key={product.id} className="col-12 col-md-4 col-lg-4 product-col">
                          <div className="item_product_main">
                            <form action="/cart/add" method="post" className="variants product-action wishItem" data-cart-form data-id={`product-actions-${product.id}`} encType="multipart/form-data">
                              <div className="product-thumbnail">
                                <div 
                                  className="image_thumb" 
                                  style={{ cursor: 'pointer' }}
                                  onClick={() => handleProductClick(product)}
                                >
                                  <img 
                                    width="199" 
                                    height="199"
                                    src={product.image}
                                    alt={product.name}
                                    className="img-responsive center-block" 
                                  />
                                </div>
                                <div className="action-cart">
                                  <input type="hidden" name="variantId" value={product.variantId} />
                                  {product.hasOptions ? (
                                    <button 
                                      className="btn btn-cart btn-left btn btn-views left-to option-choice"
                                      title="Tùy chọn" 
                                      type="button"
                                      onClick={() => handleProductClick(product)}
                                    >
                                      Tùy chọn
                                    </button>
                                  ) : (
                                    <button 
                                      className="btn-buy btn-left btn-views add_to_cart" 
                                      title="Mua ngay"
                                      onClick={() => handleProductClick(product)}
                                    >
                                      Mua ngay
                                    </button>
                                  )}
                                </div>
                              </div>
                              <div className="info-product">
                                <h3 
                                  className="product-name"
                                  style={{ cursor: 'pointer' }}
                                  onClick={() => handleProductClick(product)}
                                >
                                  {product.name}
                                </h3>
                                <div className="price-box">
                                  {hasDiscount && (
                                    <span className="discount">-{discountPercent}%</span>
                                  )}
                                  <span className="price">{price.toLocaleString('vi-VN')}vnđ</span>
                                  {hasDiscount && (
                                    <span className="compare-price">{comparePrice.toLocaleString('vi-VN')}vnđ</span>
                                  )}
                                </div>
                                {/* Nút sửa/xóa cho admin */}
                                {user && user.role === 'admin' && (
                                  <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                                    <button type="button" style={honeyButtonSmall} onClick={() => handleEditProduct(product)}>Sửa</button>
                                    <button type="button" style={honeyButtonSmallDanger} onClick={() => handleDeleteProduct(product.id)}>Xóa</button>
                                  </div>
                                )}
                              </div>
                            </form>
                          </div>
                        </div>
                      );
                      })}
                    </div>
                  </section>
                  <div className="section pagenav">
                    <nav className="clearfix relative nav_pagi w_100">
                      <ul className="pagination clearfix">
                        <li className={`page-item${currentPage === 1 ? ' disabled' : ''}`}> 
                          <button className="page-link" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                            &lt;&lt;
                          </button>
                        </li>
                        {[...Array(totalPages)].map((_, idx) => (
                          <li key={idx + 1} className={`page-item${currentPage === idx + 1 ? ' active disabled' : ''}`}>
                            <button className="page-link" onClick={() => handlePageChange(idx + 1)} disabled={currentPage === idx + 1}>{idx + 1}</button>
                          </li>
                        ))}
                        <li className={`page-item${currentPage === totalPages ? ' disabled' : ''}`}> 
                          <button className="page-link" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                            &gt;&gt;
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ProductList; 