import React, { useEffect, useState } from 'react';
import './ProductDetailPage.css';
import { useCart } from "../context/CartContext";

const THUMB_COUNT = 5;

function ProductDetailPage({ product, onBack, setCurrentPage, setSelectedProduct }) {
    const { addToCart, setIsCartOpen } = useCart();
    const [selectedImageIdx, setSelectedImageIdx] = useState(0);
    const [thumbStartIdx, setThumbStartIdx] = useState(0);
    if (!product) return null;

    // Lấy mảng ảnh của sản phẩm, nếu không có thì fallback về 1 ảnh
    const productImages = product.images && product.images.length > 0
        ? product.images
        : [product.image];

    // Lấy danh sách sản phẩm từ localStorage hoặc mặc định
    const getAllProducts = () => {
        const stored = localStorage.getItem('products');
        if (stored) return JSON.parse(stored);
        return [
            // ... (có thể copy danh sách mặc định từ ProductList.js nếu muốn fallback)
        ];
    };
    const allProducts = getAllProducts();

    // Lọc ra các sản phẩm liên quan (khác id, lấy tối đa 4)
    const relatedProducts = allProducts.filter(p => p.id !== product.id).slice(0, 4);

    // Hàm xử lý click sản phẩm liên quan
    const handleRelatedProductClick = (relatedProduct) => {
        if (setSelectedProduct) setSelectedProduct(relatedProduct);
        if (setCurrentPage) setCurrentPage('product-detail');
    };

    return (
        <main className="wrapperMain_content">
            <nav className="bread-crumb clearfix">
                <div className="container">
                    <ul className="breadcrumb">
                        <li className="home">
                            <a href="#" onClick={e => { e.preventDefault(); setCurrentPage && setCurrentPage('home'); }}><span>Trang chủ</span></a>
                            <span className="mr_lr">&nbsp;/&nbsp;</span>
                        </li>
                        <li>
                            <a href="#" onClick={e => { e.preventDefault(); setCurrentPage && setCurrentPage('products'); }}><span>Sản phẩm</span></a>
                            <span className="mr_lr">&nbsp;/&nbsp;</span>
                        </li>
                        <li><strong><span>{product.name}</span></strong></li>
                    </ul>
                </div>
            </nav>
            <section className="product details-main" itemScope itemType="https://schema.org/Product">
                <meta itemProp="category" content="Mật ong thiên nhiên" />
                <meta itemProp="url" content="//template-honey-bee.mysapo.net/mat-ong-hoa-sam-ngoc-linh" />
                <meta itemProp="name" content="Mật Ong Hoa Sâm Ngọc Linh" />
                <meta itemProp="image" content="http://bizweb.dktcdn.net/thumb/grande/100/472/304/products/9350631000056.jpg?v=1669707636973" />
                <meta itemProp="description" content="Uống mật ong vào buổi sáng giúp làm sạch, bổ sung năng lượng cho dạ dày.Uống trước khi đi ngủ giúp an thần, dễ ngủ.Uống mật trước khi ăn 30 phút giúp tốt cho hệ tiêu hóa.Uống sau ăn thúc đẩy hệ tiêu hóa làm việc.Mỗi lần uống nên uống với liều lượng phù hợp." />

                <div className="d-none hidden" itemProp="offers" itemScope itemType="http://schema.org/Offer">
                    <div className="inventory_quantity hidden" itemScope itemType="http://schema.org/ItemAvailability">
                        <span className="a-stock" itemProp="supersededBy">Còn hàng</span>
                    </div>
                    <link itemProp="availability" href="http://schema.org/InStock" />
                    <meta itemProp="priceCurrency" content="VND" />
                    <meta itemProp="price" content="1000000" />
                    <meta itemProp="url" content="https://template-honey-bee.mysapo.net/mat-ong-hoa-sam-ngoc-linh" />
                    <span itemProp="UnitPriceSpecification" itemScope itemType="https://schema.org/Downpayment">
                        <meta itemProp="priceType" content="1000000" />
                    </span>
                    <span itemProp="UnitPriceSpecification" itemScope itemType="https://schema.org/Downpayment">
                        <meta itemProp="priceSpecification" content="1500000" />
                    </span>
                    <meta itemProp="priceValidUntil" content="2099-01-01" />
                </div>

                <div className="d-none hidden" id="https://template-honey-bee.mysapo.net" itemProp="seller" itemType="http://schema.org/Organization" itemScope>
                    <meta itemProp="name" content="Template Honey Bee" />
                    <meta itemProp="url" content="https://template-honey-bee.mysapo.net" />
                    <meta itemProp="logo" content="http://bizweb.dktcdn.net/100/472/304/themes/887048/assets/logo.png?1729245409661" />
                </div>

                <div className="container">
                    <div className="row">
                        <div className="product-detail-left product-images col-12 col-md-12 col-lg-6 col-xl-6">
                            <div className="product-image-detail clearfix">
                                <div className="col_large_default large-image">
                                    {/* Ảnh lớn */}
                                    <div style={{ width: '100%', height: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px #eee' }}>
                                        <img
                                            src={productImages[selectedImageIdx]}
                                            style={{ width: '100%', maxWidth: '100%', maxHeight: 380, objectFit: 'contain' }}
                                            alt={product.name}
                                            className="img-responsive mx-auto d-block"
                                        />
                                    </div>
                                </div>
                                {/* Thumbnail slider */}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 16 }}>
                                    <button
                                        onClick={() => setThumbStartIdx(idx => Math.max(0, idx - 1))}
                                        disabled={thumbStartIdx === 0}
                                        style={{ fontSize: 20, padding: '0 8px', borderRadius: 6, border: '1px solid #eee', background: '#fff', cursor: thumbStartIdx === 0 ? 'not-allowed' : 'pointer' }}
                                    >{'<'}</button>
                                    {productImages.slice(thumbStartIdx, thumbStartIdx + THUMB_COUNT).map((img, idx) => {
                                        const realIdx = thumbStartIdx + idx;
                                        return (
                                            <img
                                                key={img}
                                                src={img}
                                                alt={`thumb-${realIdx}`}
                                                style={{
                                                    width: 60,
                                                    height: 60,
                                                    border: realIdx === selectedImageIdx ? '2px solid orange' : '2px solid #eee',
                                                    borderRadius: 8,
                                                    objectFit: 'cover',
                                                    cursor: 'pointer',
                                                    background: '#fff',
                                                    boxShadow: realIdx === selectedImageIdx ? '0 2px 8px #ffe082' : 'none',
                                                }}
                                                onClick={() => setSelectedImageIdx(realIdx)}
                                            />
                                        );
                                    })}
                                    <button
                                        onClick={() => setThumbStartIdx(idx => Math.min(productImages.length - THUMB_COUNT, idx + 1))}
                                        disabled={thumbStartIdx + THUMB_COUNT >= productImages.length}
                                        style={{ fontSize: 20, padding: '0 8px', borderRadius: 6, border: '1px solid #eee', background: '#fff', cursor: thumbStartIdx + THUMB_COUNT >= productImages.length ? 'not-allowed' : 'pointer' }}
                                    >{'>'}</button>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-12 col-lg-6 col-xl-6 details-pro">
                            <div className="box_details_product">
                                <h1 className="title-product">{product.name}</h1>
                                <div className="price-box clearfix" bis_skin_checked="1">
                                    {product.discount && (
                                        <span className="old-price">
                                            <del className="price product-price-old">{product.comparePrice}₫</del>
                                        </span>
                                    )}
                                    <span className="special-price">
                                        <span className="price product-price">{product.price}₫</span>
                                    </span>
                                    {product.discount && (
                                        <span className="save-price">
                                            <span className="price product-price-save">-{(product.comparePrice).toLocaleString()}₫</span>
                                        </span>
                                    )}
                                </div>

                                <div className="product-summary">
                                    <ul>
                                        <li>Uống mật ong vào buổi sáng giúp làm sạch, bổ sung năng lượng cho dạ dày.</li>
                                        <li>Uống trước khi đi ngủ giúp an thần, dễ ngủ.</li>
                                        <li>Uống mật trước khi ăn 30 phút giúp tốt cho hệ tiêu hóa.</li>
                                    </ul>
                                </div>

                                <div className="service-product" bis_skin_checked="1">
                                    <div className="item" bis_skin_checked="1">
                                        <div className="icon" bis_skin_checked="1">
                                            <img src="https://bizweb.dktcdn.net/100/472/304/themes/887048/assets/icon_service_product_1.svg?1729245409661" alt="Giao hàng toàn quốc" />
                                        </div>
                                        <div className="info" bis_skin_checked="1">
                                            <h3>
                                                Giao hàng toàn quốc
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="item" bis_skin_checked="1">
                                        <div className="icon" bis_skin_checked="1">
                                            <img src="https://bizweb.dktcdn.net/100/472/304/themes/887048/assets/icon_service_product_2.svg?1729245409661" alt="Thanh toán khi nhận hàng" />
                                        </div>
                                        <div className="info" bis_skin_checked="1">
                                            <h3>
                                                Thanh toán khi nhận hàng
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="item" bis_skin_checked="1">
                                        <div className="icon" bis_skin_checked="1">
                                            <img src="https://bizweb.dktcdn.net/100/472/304/themes/887048/assets/icon_service_product_3.svg?1729245409661" alt="Cam kết đổi trả hàng miễn phí" />
                                        </div>
                                        <div className="info" bis_skin_checked="1">
                                            <h3>
                                                Cam kết đổi trả hàng miễn phí
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="item" bis_skin_checked="1">
                                        <div className="icon" bis_skin_checked="1">
                                            <img src="https://bizweb.dktcdn.net/100/472/304/themes/887048/assets/icon_service_product_4.svg?1729245409661" alt="Cam kết chính hãng" />
                                        </div>
                                        <div className="info" bis_skin_checked="1">
                                            <h3>
                                                Cam kết chính hãng
                                            </h3>
                                        </div>
                                    </div>


                                </div>

                                <form encType="multipart/form-data" id="add-to-cart-form" data-cart-form className="wishItem" onSubmit={e => e.preventDefault()}>
                                    <div className="form-product">
                                        <div className="select-swatch">
                                            <div className="swatch clearfix" data-option-index="0">
                                                <div className="options-title">Kích thước</div>
                                                <div data-value="200g" className="swatch-element 200g available">
                                                    <input id="swatch-0-200g" type="radio" name="option-0" value="200g" defaultChecked />
                                                    <label title="200g" htmlFor="swatch-0-200g">200g</label>
                                                </div>
                                                <div data-value="500g" className="swatch-element 500g available">
                                                    <input id="swatch-0-500g" type="radio" name="option-0" value="500g" />
                                                    <label title="500g" htmlFor="swatch-0-500g">500g</label>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="clearfix from-action-addcart">
                                            <div className="clearfix custom-btn-number">
                                                <label>Số lượng:</label>
                                                <div className="custom custom-btn-numbers clearfix input_number_product">
                                                    <button className="btn-minus btn-cts" type="button">–</button>
                                                    <input
                                                        aria-label="Số lượng"
                                                        type="text"
                                                        className="qty input-text"
                                                        id="qty"
                                                        name="quantity"
                                                        size="4"
                                                        defaultValue="1"
                                                        maxLength="3"
                                                    />
                                                    <button className="btn-plus btn-cts" type="button">+</button>
                                                </div>
                                            </div>
                                            <div className="btn-mua clearfix">
                                                <button
                                                    type="button"
                                                    className="btn btn-lg btn-gray btn-cart btn_buy add_to_cart"
                                                    onClick={() => {
                                                        const qty = parseInt(document.getElementById("qty").value, 10) || 1;
                                                        addToCart(product, qty);
                                                        setIsCartOpen(true);
                                                    }}
                                                >
                                                    <span className="text_1">Cho vào giỏ hàng</span>
                                                </button>
                                                <button type="button" className="btn_buynow btn_base btn-buy-now">
                                                    <span className="text_1">Mua ngay</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <div className="container">
                <div className="col-12" bis_skin_checked="1">
                    <div className="product-tab e-tabs not-dqtab" bis_skin_checked="1">
                        <ul className="tabs tabs-title clearfix">
                            <li className="tab-link current" data-tab="tab-1">
                                <span>Mô tả </span>
                            </li>
                            <li className="tab-link" data-tab="tab-2">
                                <span>Tab tùy chỉnh</span>
                            </li>
                        </ul>
                        <div id="tab-1" className="tab-content content_extab current" bis_skin_checked="1">
                            <div className="rte product_getcontent" bis_skin_checked="1">
                                <p><strong>Đặc điểm sản phẩm</strong></p>
                                <p>Ong hút mật của hoa sâm Ngọc Linh và các loại dược liệu quý khác nên mật thơm,
                                    mùi vị có chút khác biệt so với các loại mật ong khác.</p>
                                <p><strong>Công dụng sản phẩm</strong></p>
                                <p>+Sâm Ngọc Linh là một phương thuốc quý hiếm, do đó mật ong hoa sâm Ngọc Linh hay
                                    mật ong đắng ngâm với sâm Ngọc Linh làm hàm lượng dinh dưỡng tăng lên tốt
                                    đa. <br />
                                    +Vì thế nên mật ong hoa sâm Ngọc Linh rất quý hiếm, có tiền cũng chưa chắc là
                                    mua đúng hàng thật.</p>
                                <p><strong>Bảo quản sản phẩm</strong></p>
                                <p>Để mật ong ở nơi thoáng mát, không có ánh sáng chiếu vào và không nên để mật ong
                                    trong tủ lạnh.</p>
                                <ul>
                                    <li>Là loại mật cực kỳ quý hiếm, được khai thác tại vùng núi Ngọc Linh – Huyện
                                        Đăk Glei, Tỉnh Kon Tum. Sở dĩ mật ong rừng này được gọi là Mật Ong Đắng vì
                                        ong chuyên hút mật của&nbsp;Hoa Sâm Ngọc Linh&nbsp;và một số cây dược liệu
                                        quý khác tại núi Ngọc Linh nên mật ngoài vị ngọt đặc trưng của mật ong rừng
                                        còn có vị hơi đắng thanh ngay khi nếm, màu sậm.&nbsp;</li>
                                    <li>Bảo quản:&nbsp;Để mật ong&nbsp;ở nơi thoáng mát, không có ánh sáng chiếu vào
                                        và&nbsp;không nên để mật ong trong tủ lạnh.</li>
                                    <li>Hạn sử dụng: 2 năm kể từ ngày sản xuất được in trên bao bì.</li>
                                </ul>
                                <p><strong>Hạn sử dụng</strong></p>
                                <p>2 năm kể từ ngày sản xuất được in trên bao bì.</p>
                            </div>
                        </div>
                        <div id="tab-2" className="tab-content content_extab" bis_skin_checked="1">
                            <div className="rte" bis_skin_checked="1">

                                Đây là tab tuỳ chỉnh

                            </div>
                        </div>
                    </div>
                    <div className="section-related-product" bis_skin_checked="1">
                        <div className="section_prd_feature" bis_skin_checked="1">
                            <div className="title_module_main" bis_skin_checked="1">
                                <h2 className="h2">
                                    <a href="/mat-ong-thien-nhien" title="Sản phẩm liên quan">Sản phẩm liên quan</a>
                                </h2>
                            </div>

                            <div className="box_related" bis_skin_checked="1">
                                <div className="swiper-container swiper_related swiper-container-initialized swiper-container-horizontal" bis_skin_checked="1">
                                    <div className="swiper-wrapper" id="swiper-wrapper-38efd67912b19bd10" aria-live="polite" bis_skin_checked="1" style={{ transform: "translate3d(0px, 0px, 0px)" }}>
                                        {relatedProducts.map((item, idx) => (
                                            <div className="item swiper-slide" key={item.id || idx} style={{ width: "273.75px", marginRight: "15px" }}>
                                                <div className="item_product_main">
                                                    <form className="variants product-action wishItem">
                                                        <div className="product-thumbnail">
                                                            <a className="image_thumb" href="#" title={item.name} style={{ height: "274px" }} onClick={e => { e.preventDefault(); handleRelatedProductClick(item); }}>
                                                                <img width="199" height="199" src={item.image} alt={item.name} className="lazyload img-responsive center-block loaded" />
                                                            </a>
                                                        </div>
                                                        <div className="info-product">
                                                            <h3 className="product-name">
                                                                <a href="#" title={item.name} onClick={e => { e.preventDefault(); handleRelatedProductClick(item); }}>{item.name}</a>
                                                            </h3>
                                                            <div className="price-box">
                                                                {item.discount && <span className="discount">-{item.discount}%</span>}
                                                                <span className="price">{item.price}₫</span>
                                                                {item.comparePrice && <span className="compare-price">{item.comparePrice}₫</span>}
                                                            </div>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <span className="swiper-notification" aria-live="assertive" aria-atomic="true"></span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default ProductDetailPage;