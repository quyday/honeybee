import React, { useState } from 'react';
import './Home.css';
import './HomeAnimation.css';
import { useCart } from '../context/CartContext';

function Home({ onViewMoreProducts, setCurrentPage, setSelectedNews, onNewsClick, setSelectedProduct }) {
	// Thêm hàm xử lý click xem thêm sản phẩm
	const handleViewMoreProducts = () => {
		if (setCurrentPage) setCurrentPage('products');
		if (onViewMoreProducts) onViewMoreProducts();
	};

	// Thêm state cho số lượng và size sản phẩm đặc biệt
	const { addToCart } = useCart();
	const [qty, setQty] = useState(1);
	const [size, setSize] = useState('200g');

	// Danh sách ảnh sản phẩm
	const productImages = [
		"/images/9350631000056.jpg",
		"/images/australian-manuka-honey-mgo-30-500g.jpg",
		"/images/bramwells-mgo100-manuka-honey.jpg",
		"/images/3df-800-10-1f1424d2-97db-4cea-ba6e-d3c585d47bea.jpg",
		"/images/7-d32481ff-654d-414f-9782-34420d36363b.png"
	];
	const [selectedImageIdx, setSelectedImageIdx] = useState(0);
	const [thumbStartIdx, setThumbStartIdx] = useState(0);
	const THUMB_COUNT = 5;

	// Định nghĩa sản phẩm "Mật Ong Hoa Sâm Ngọc Linh"
	const product = {
		id: 3,
		name: "Mật Ong Hoa Sâm Ngọc Linh",
		price: size === '200g' ? 1000000 : 2500000,
		image: process.env.PUBLIC_URL + "/images/9350631000056.jpg",
		variantId: size === '200g' ? '76948955' : '76948956',
		size,
	};

	const handleAddToCart = (e) => {
		e.preventDefault();
		addToCart(product, qty);
		// Có thể hiện thông báo nếu muốn
	};

	const handleBuyNow = (e) => {
		e.preventDefault();
		addToCart(product, qty);
		if (setCurrentPage) setCurrentPage('cart');
	};

	// Thêm hàm xử lý chuyển sang trang chi tiết sản phẩm
	const handleProductDetail = (product) => {
		if (setSelectedProduct) setSelectedProduct(product);
		if (setCurrentPage) setCurrentPage('product-detail');
	};

	return (
		<main className="wrapperMain_content">
			<h1 className="d-none">Template Honey Bee - </h1>
			<section className="section_slider">
				<div className="home-slider swiper-container">
					<div className="swiper-wrapper">
						<div className="swiper-slide">
							<a href="#" className="clearfix" title="Slider 1">
								<picture>
									<source
										media="(max-width: 480px)"
										srcSet="//bizweb.dktcdn.net/thumb/large/100/472/304/themes/887048/assets/slider_1.jpg?1729245409661"
									/>
									<source
										media="(min-width: 481px) and (max-width: 600px)"
										srcSet="//bizweb.dktcdn.net/100/472/304/themes/887048/assets/slider_1.jpg?1729245409661"
									/>
									<source
										media="(min-width: 601px) and (max-width: 1023px)"
										srcSet="//bizweb.dktcdn.net/100/472/304/themes/887048/assets/slider_1.jpg?1729245409661"
									/>
									<source
										media="(min-width: 1024px) and (max-width: 1199px)"
										srcSet="//bizweb.dktcdn.net/100/472/304/themes/887048/assets/slider_1.jpg?1729245409661"
									/>
									<source
										media="(min-width: 1200px)"
										srcSet="//bizweb.dktcdn.net/100/472/304/themes/887048/assets/slider_1.jpg?1729245409661"
									/>
									<img
										width="100%"
										height="auto"
										src="../images/slider_1.jpg"
										alt="Slider 1"
										className="img-responsive center-block"
									/>
								</picture>
							</a>
						</div>
					</div>
				</div>
			</section>
			<section className="section_index_product">
				<div className="container">
					<div className="row">
						<div className="product-detail-left product-images col-12 col-md-12 col-lg-6 col-xl-6">
							<div className="product-image-detail clearfix">
								<div className="fullarge_img">
									<div style={{ width: '100%', height: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px #eee' }}>
										<img
											src={productImages[selectedImageIdx]}
											style={{ width: '100%', maxWidth: '100%', maxHeight: 380, objectFit: 'contain' }}
											alt="Mật Ong Hoa Sâm Ngọc Linh"
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
							<div className="box_details_product" bis_skin_checked="1">
								<h2 className="title-product"><a href="mat-ong-hoa-sam-ngoc-linh.html" title="Mật Ong Hoa Sâm Ngọc Linh">Mật Ong Hoa Sâm Ngọc Linh</a></h2>
								<div className="price-box clearfix" bis_skin_checked="1">
									<span className="old-price">
										<del className="price product-price-old">1.500.000₫</del>
									</span>
									<span className="special-price">
										<span className="price product-price">{size === '200g' ? '1.000.000₫' : '2.500.000₫'}</span>
									</span>
									<span className="save-price">
										<span className="price product-price-save">{size === '200g' ? '-500.000₫' : '-0₫'}</span>
									</span>
								</div>
								<div className="product-summary" bis_skin_checked="1">
									<ul>
										<li>Uống mật ong vào buổi sáng giúp làm sạch, bổ sung năng lượng cho dạ dày.</li>
										<li>Uống trước khi đi ngủ giúp an thần, dễ ngủ.</li>
										<li>Uống mật trước khi ăn 30 phút giúp tốt cho hệ tiêu hóa...</li>
									</ul>
								</div>
								<div className="product-content" bis_skin_checked="1">
									<p><strong>Đặc điểm sản phẩm</strong></p>
									<p>Ong hút mật của hoa sâm Ngọc Linh và các loại dược liệu quý khác nên mật thơm, mùi vị có chút khác biệt so với các loại mật ong khác.</p>
									<p><strong>Côn...</strong></p>
								</div>
								<strong>
									<form encType="multipart/form-data" id="add-to-cart-form" data-cart-form="" action="/cart/add" method="post" className="wishItem" onSubmit={e => e.preventDefault()}>
										<div className="form-product" bis_skin_checked="1">
											<div className="select-swatch" bis_skin_checked="1">
												<div className=" swatch clearfix" data-option-index="0" bis_skin_checked="1">
													<div className="options-title" bis_skin_checked="1">Kích thước</div>
													<div data-value="200g" className={`swatch-element 200g available${size === '200g' ? ' active' : ''}`} bis_skin_checked="1">
														<input id="swatch-0-200g" type="radio" name="option-0" value="200g" checked={size === '200g'} onChange={() => setSize('200g')} />
														<label title="200g" htmlFor="swatch-0-200g">200g</label>
													</div>
													<div data-value="500g" className={`swatch-element 500g available${size === '500g' ? ' active' : ''}`} bis_skin_checked="1">
														<input id="swatch-0-500g" type="radio" name="option-0" value="500g" checked={size === '500g'} onChange={() => setSize('500g')} />
														<label title="500g" htmlFor="swatch-0-500g">500g</label>
													</div>
												</div>
											</div>
											<div className="clearfix custom-btn-number" bis_skin_checked="1">
												<label>Số lượng:</label>
												<div className="custom custom-btn-numbers clearfix input_number_product" bis_skin_checked="1">
													<button type="button" onClick={() => setQty(q => Math.max(1, q - 1))} className="btn-minus btn-cts">–</button>
													<input aria-label="Số lượng" type="text" className="qty input-text" id="qty" name="quantity" value={qty} onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 1))} maxLength="3" />
													<button type="button" onClick={() => setQty(q => q + 1)} className="btn-plus btn-cts">+</button>
												</div>
												<div className="vd" bis_skin_checked="1">
													<span className="vend_c">Còn hàng</span>
												</div>
											</div>
											<div className="btn-mua clearfix" bis_skin_checked="1">
												<button type="button" className="btn btn-lg btn-gray btn-cart btn_buy add_to_cart" onClick={handleAddToCart}>
													<span className="text_1">Thêm giỏ hàng</span>
												</button>
												<button type="button" className="btn_buynow btn_base btn-buy-now" onClick={handleBuyNow}>
													<span className="text_1">Mua ngay</span>
												</button>
											</div>
										</div>
									</form>
								</strong>
							</div>
						</div>
					</div>
				</div>
			</section>
			<section className="section_bestsale lazyload" data-src="/images/bg_bestsale.png" data-was-processed="true" style={{ backgroundImage: "url(/images/bg_bestsale.png)" }}>
				<div className="container" bis_skin_checked="1">
					<div className="title_module_main" bis_skin_checked="1">
						<h2>
							<p title="Mật ong bán chạy nhất">Mật ong bán chạy nhất</p>
						</h2>
					</div>
					<div className="swiper_bestsale swiper-container swiper-container-initialized swiper-container-horizontal" bis_skin_checked="1">
						<div className="swiper-wrapper" id="swiper-wrapper-ffef373f33d463df" aria-live="polite" bis_skin_checked="1" style={{ transform: "translate3d(0px, 0px, 0px)" }}>
							<div className="item swiper-slide swiper-slide-active" role="group" aria-label="1 / 6" bis_skin_checked="1" style={{ width: "270px", marginRight: "20px" }}>
								<div className="item_product_main" bis_skin_checked="1">
									<form action="/cart/add" method="post" className="variants product-action wishItem" data-cart-form="" data-id="product-actions-28668377" encType="multipart/form-data">
										<div className="product-thumbnail" bis_skin_checked="1">
											<a className="image_thumb" href="combo-mat-ong-rung-hoa-yen-bach-honimore.html" title="Mật ong rừng Hoa Yên Bạch Honimore" style={{ height: "270px" }}>
												<img width="199" height="199" src="https://bizweb.dktcdn.net/100/472/304/products/frame-7-1.png?v=1669696727853" data-src="https://bizweb.dktcdn.net/100/472/304/products/frame-7-1.png?v=1669696727853" alt="Mật ong rừng Hoa Yên Bạch Honimore" className="lazyload img-responsive center-block loaded" data-was-processed="true" />
											</a>
											<div className="action-cart" bis_skin_checked="1">
												<input className="hidden" type="hidden" name="variantId" value="76944878" />
												<button className="btn btn-cart btn-left  btn btn-views left-to option-choice" title="Tùy chọn" type="button" onClick={() => window.location.href='combo-mat-ong-rung-hoa-yen-bach-honimore.html'}>
													Tùy chọn
												</button>
											</div>
										</div>
										<div className="info-product" bis_skin_checked="1">
											<h3 className="product-name"><a href="combo-mat-ong-rung-hoa-yen-bach-honimore.html" title="Mật ong rừng Hoa Yên Bạch Honimore">Mật ong rừng Hoa Yên Bạch
												Honimore</a></h3>
											<div className="price-box" bis_skin_checked="1">
												500.000₫
											</div>
										</div>
									</form>
								</div>
							</div>
							<div className="item swiper-slide swiper-slide-next" role="group" aria-label="2 / 6" bis_skin_checked="1" style={{ width: "270px", marginRight: "20px" }}>
								<div className="item_product_main" bis_skin_checked="1">
									<form action="/cart/add" method="post" className="variants product-action wishItem" data-cart-form="" data-id="product-actions-28668464" encType="multipart/form-data">
										<div className="product-thumbnail" bis_skin_checked="1">
											<a className="image_thumb" href="mat-ong-rung.html-cao-thao-duoc-honimore-lady" title="Mật ong rừng cao thảo dược Honimore Lady" style={{ height: "270px" }}>
												<img width="199" height="199" src="https://bizweb.dktcdn.net/100/472/304/products/frame-8.png?v=1669697248883" data-src="https://bizweb.dktcdn.net/100/472/304/products/frame-8.png?v=1669697248883" alt="Mật ong rừng cao thảo dược Honimore Lady" className="lazyload img-responsive center-block loaded" data-was-processed="true" />
											</a>
											<div className="action-cart" bis_skin_checked="1">
												<input className="hidden" type="hidden" name="variantId" value="76945705" />
												<button className="btn btn-cart btn-left  btn btn-views left-to option-choice" title="Tùy chọn" type="button" onClick={() => window.location.href='mat-ong-rung.html-cao-thao-duoc-honimore-lady'}>
													Tùy chọn
												</button>
											</div>
										</div>
										<div className="info-product" bis_skin_checked="1">
											<h3 className="product-name"><a href="mat-ong-rung.html-cao-thao-duoc-honimore-lady" title="Mật ong rừng cao thảo dược Honimore Lady">Mật ong rừng cao thảo
												dược Honimore Lady</a></h3>
											<div className="price-box" bis_skin_checked="1">
												<span className="discount">-
													40%
												</span>
												<span className="price">300.000₫</span>
												<span className="compare-price">500.000₫</span>
											</div>
										</div>
									</form>
								</div>
							</div>
							<div className="item swiper-slide" role="group" aria-label="3 / 6" bis_skin_checked="1" style={{ width: "270px", marginRight: "20px" }}>
								<div className="item_product_main" bis_skin_checked="1">
									<form action="/cart/add" method="post" className="variants product-action wishItem" data-cart-form="" data-id="product-actions-28669297" encType="multipart/form-data">
										<div className="product-thumbnail" bis_skin_checked="1">
											<a className="image_thumb" href="mat-ong-rung-hoa-cao-nguyen.html" title="Mật ong rừng Hoa Cao Nguyên" style={{ height: "270px" }}>
												<img width="199" height="199" src="https://bizweb.dktcdn.net/100/472/304/products/16.png?v=1669708547967" data-src="https://bizweb.dktcdn.net/100/472/304/products/16.png?v=1669708547967" alt="Mật ong rừng Hoa Cao Nguyên" className="lazyload img-responsive center-block loaded" data-was-processed="true" />
											</a>
											<div className="action-cart" bis_skin_checked="1">
												<input className="hidden" type="hidden" name="variantId" value="76947736" />
												<button className="btn btn-cart btn-left  btn btn-views left-to option-choice" title="Tùy chọn" type="button" onClick={() => window.location.href='mat-ong-rung-hoa-cao-nguyen.html'}>
													Tùy chọn
												</button>
											</div>
										</div>
										<div className="info-product" bis_skin_checked="1">
											<h3 className="product-name"><a href="mat-ong-rung-hoa-cao-nguyen.html" title="Mật ong rừng Hoa Cao Nguyên">Mật ong rừng Hoa Cao Nguyên</a></h3>
											<div className="price-box" bis_skin_checked="1">
												<span className="discount">-
													23%
												</span>
												<span className="price">230.000₫</span>
												<span className="compare-price">300.000₫</span>
											</div>
										</div>
									</form>
								</div>
							</div>
							<div className="item swiper-slide" role="group" aria-label="4 / 6" bis_skin_checked="1" style={{ width: "270px", marginRight: "20px" }}>
								<div className="item_product_main" bis_skin_checked="1">
									<form action="/cart/add" method="post" className="variants product-action wishItem" data-cart-form="" data-id="product-actions-28669317" encType="multipart/form-data">
										<div className="product-thumbnail" bis_skin_checked="1">
											<a className="image_thumb" href="mat-ong-rung.html-hoa-rung-phuong-nam.html" title="Mật ong rừng Hoa Rừng Phương Nam" style={{ height: "270px" }}>
												<img width="199" height="199" src="https://bizweb.dktcdn.net/100/472/304/products/17.png?v=1669708779423" data-src="https://bizweb.dktcdn.net/100/472/304/products/17.png?v=1669708779423" alt="Mật ong rừng Hoa Rừng Phương Nam" className="lazyload img-responsive center-block loaded" data-was-processed="true" />
											</a>
											<div className="action-cart" bis_skin_checked="1">
												<input type="hidden" name="variantId" value="76947769" />
												<button className="btn-buy btn-left btn-views add_to_cart " title="Mua ngay">
													Mua ngay
												</button>
											</div>
										</div>
										<div className="info-product" bis_skin_checked="1">
											<h3 className="product-name"><a href="mat-ong-rung.html-hoa-rung-phuong-nam.html" title="Mật ong rừng Hoa Rừng Phương Nam">Mật ong rừng Hoa Rừng Phương
												Nam</a></h3>
											<div className="price-box" bis_skin_checked="1">
												<span className="discount">-
													50%
												</span>
												<span className="price">200.000₫</span>
												<span className="compare-price">400.000₫</span>
											</div>
										</div>
									</form>
								</div>
							</div>
							<div className="item swiper-slide" role="group" aria-label="5 / 6" bis_skin_checked="1" style={{ width: "270px", marginRight: "20px" }}>
								<div className="item_product_main" bis_skin_checked="1">
									<form action="/cart/add" method="post" className="variants product-action wishItem" data-cart-form="" data-id="product-actions-28669438" encType="multipart/form-data">
										<div className="product-thumbnail" bis_skin_checked="1">
											<a className="image_thumb" href="mat-ong-chin-hoa-xuyen-chi.html" title="Mật ong chín Hoa Xuyến Chi" style={{ height: "270px" }}>
												<img width="199" height="199" src="data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=" data-src="https://bizweb.dktcdn.net/100/472/304/products/4.png?v=1669705551557" alt="Mật ong chín Hoa Xuyến Chi" className="lazyload img-responsive center-block" />
											</a>
											<div className="action-cart" bis_skin_checked="1">
												<input className="hidden" type="hidden" name="variantId" value="76948080" />
												<button className="btn btn-cart btn-left  btn btn-views left-to option-choice" title="Tùy chọn" type="button" onClick={() => window.location.href='mat-ong-chin-hoa-xuyen-chi.html'}>
													Tùy chọn
												</button>
											</div>
										</div>
										<div className="info-product" bis_skin_checked="1">
											<h3 className="product-name"><a href="mat-ong-chin-hoa-xuyen-chi.html" title="Mật ong chín Hoa Xuyến Chi">Mật ong chín Hoa Xuyến Chi</a></h3>
											<div className="price-box" bis_skin_checked="1">
												<span className="discount">-
													50%
												</span>
												<span className="price">300.000₫</span>
												<span className="compare-price">600.000₫</span>
											</div>
										</div>
									</form>
								</div>
							</div>
							<div className="item swiper-slide" role="group" aria-label="6 / 6" bis_skin_checked="1" style={{ width: "270px", marginRight: "20px" }}>
								<div className="item_product_main" bis_skin_checked="1">
									<form action="/cart/add" method="post" className="variants product-action wishItem" data-cart-form="" data-id="product-actions-28669863" encType="multipart/form-data">
										<div className="product-thumbnail" bis_skin_checked="1">
											<a className="image_thumb" href="mat-ong-hoa-sam-ngoc-linh.html" title="Mật Ong Hoa Sâm Ngọc Linh" style={{ height: "270px" }}>
												<img width="199" height="199" src="data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=" data-src="https://bizweb.dktcdn.net/100/472/304/products/9350631000056.jpg?v=1669707636973" alt="Mật Ong Hoa Sâm Ngọc Linh" className="lazyload img-responsive center-block" />
											</a>
											<div className="action-cart" bis_skin_checked="1">
												<input className="hidden" type="hidden" name="variantId" value="76948955" />
												<button className="btn btn-cart btn-left  btn btn-views left-to option-choice" title="Tùy chọn" type="button" onClick={() => window.location.href='mat-ong-hoa-sam-ngoc-linh.html'}>
													Tùy chọn
												</button>
											</div>
										</div>
										<div className="info-product" bis_skin_checked="1">
											<h3 className="product-name"><a href="mat-ong-hoa-sam-ngoc-linh.html" title="Mật Ong Hoa Sâm Ngọc Linh">Mật Ong Hoa Sâm Ngọc Linh</a></h3>
											<div className="price-box" bis_skin_checked="1">
												<span className="discount">-
													33%
												</span>
												<span className="price">1.000.000₫</span>
												<span className="compare-price">1.500.000₫</span>
											</div>
										</div>
									</form>
								</div>
							</div>
						</div>
						<span className="swiper-notification" aria-live="assertive" aria-atomic="true"></span>
					</div>
					<div className="button_readmore" bis_skin_checked="1">
						<a title="Xem thêm sản phẩm" onClick={e => { e.preventDefault(); if (setCurrentPage) setCurrentPage('products'); if (onViewMoreProducts) onViewMoreProducts(); }} style={{ fontWeight: 600, fontSize: 18, padding: '8px 24px', borderRadius: 8, textDecoration: 'underline', }}>
							Xem thêm sản phẩm
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
								<path d="M240.971 130.524l194.343 194.343c9.373 9.373 9.373 24.569 0 33.941l-22.24-22.24c-9.357-9.357-24.522-9.375-33.901-.04L224 227.495 69.255 381.516c-9.379 9.335-24.544 9.317-33.901-.04l-22.667-22.667c-9.373-9.373-9.373-24.569 0-33.941L207.03 130.525c9.372-9.373 24.568-9.373 33.941-.001z"></path>
							</svg>
						</a>
					</div>
				</div>
			</section>
			<section className="section_process lazyload" data-src="/images/bg_process.png" data-was-processed="true" style={{ backgroundImage: "url(/images/bg_process.png)" }}>
				<div className="container" bis_skin_checked="1">
					<div className="title_module_main" bis_skin_checked="1">
						<h2>
							<span>Quy trình sản xuất mật ong</span>
						</h2>
					</div>
					<div className="row row-75Gutter" bis_skin_checked="1">
						<div className="col-lg-3 col-md-6 col-12 col_process" bis_skin_checked="1">
							<div className="box_process" bis_skin_checked="1">
								<h3 className="number_process">
									1
								</h3>
								<h4 className="title_process">Chăm sóc &amp; thu hoạch<br /> mật chất lượng cao</h4>
								<span className="des_process">Chăm sóc &amp; thu hoặc mật ong<br />Kiểm định mật được thu hoạch mật
									ong</span>
							</div>
							<img src="/images/bee_1.png" alt="flying bee" className="flying-bee bee-1" />
						</div>
						<div className="col-lg-3 col-md-6 col-12 col_process" bis_skin_checked="1">
							<div className="box_process" bis_skin_checked="1">
								<h3 className="number_process">
									2
								</h3>
								<h4 className="title_process">Xử lý mật ong chất lượng thấp</h4>
								<span className="des_process">Mật chất lượng thấp xử lý pha đường để tạo ngọt<br />Mật non chất
									lượng thấp xử lý nhiệt đun nấu để làm cô đặc</span>
							</div>
							<img src="/images/bee_2.png" alt="flying bee" className="flying-bee bee-2" />
						</div>
						<div className="col-lg-3 col-md-6 col-12 col_process" bis_skin_checked="1">
							<div className="box_process" bis_skin_checked="1">
								<h3 className="number_process">
									3
								</h3>
								<h4 className="title_process">Xử lý mật ong<br /> chất lượng cao</h4>
								<span className="des_process">Phân loại mật ong <br />Lọc thô mật ong</span>
							</div>
							<img src="/images/bee_3.png" alt="flying bee" className="flying-bee bee-3" />
						</div>
						<div className="col-lg-3 col-md-6 col-12 col_process" bis_skin_checked="1">
							<div className="box_process" bis_skin_checked="1">
								<h3 className="number_process">
									4
								</h3>
								<h4 className="title_process">Chiết xuất đóng gói<br /> mật ong</h4>
								<span className="des_process">Chiết xuất mật ong<br />Đóng gói mật ong</span>
							</div>
						</div>
					</div>
				</div>
			</section>
			<section className="section_blog">
				<div className="container" bis_skin_checked="1">
					<h2 className="title_module_main">Tin tức</h2>
					<div className="swiper_blog swiper-container swiper-container-initialized swiper-container-horizontal" bis_skin_checked="1">
						<div className="swiper-wrapper" id="swiper-wrapper-ed3ab8528f96fc4c" aria-live="polite" bis_skin_checked="1" style={{ transform: 'translate3d(0px, 0px, 0px)' }}>
							<div className="swiper-slide swiper-slide-active" role="group" aria-label="1 / 4" bis_skin_checked="1" style={{ width: '270px', marginRight: '20px' }}>
								<div className="blog_item clearfix" bis_skin_checked="1">
									<div className="blogwp" bis_skin_checked="1">
										<div className="blog-thumbnail" bis_skin_checked="1">
											<a className="thumb" href="mat-ong-rung-va-mat-ong-nuoi-loai-nao-tot-hon.html" title="Mật ong rừng và mật ong nuôi loại nào tốt hơn?">
												<img src="https://bizweb.dktcdn.net/100/472/304/articles/wallpaperflare-com-wallpaper-7.jpg?v=1669711748507" data-src="https://bizweb.dktcdn.net/100/472/304/articles/wallpaperflare-com-wallpaper-7.jpg?v=1669711748507" alt="Mật ong rừng và mật ong nuôi loại nào tốt hơn?" className="lazyload img-responsive loaded" data-was-processed="true" />
											</a>
										</div>
										<div className="content_blog clearfix" bis_skin_checked="1">
											<span className="post-time">
												Thứ Ba,
												29/11/2022
											</span>
											<h3><a onClick={() => onNewsClick('honey-comparison')} title="Mật ong rừng và mật ong nuôi loại nào tốt hơn?" className="a-title">Mật ong rừng và mật ong nuôi loại nào tốt
												hơn?</a></h3>
											<div className="summary_blog" bis_skin_checked="1">
												<p>
													Mật ong rừng được lấy từ những tổ ong sống dã sinh trong rừng. Khi lấy
													mật, người ta sẽ phá luôn tổ ong. Mật ong nuôi được thu hoạch từ những
													thùng nuôi ong. Khi lấy mật, người ta vẫn giữ lại tổ cho ong. Hai loại
													này loại nào tốt hơn?
													Mật ong rừng&nbsp;
													Để có mật ong rừng, người ta có 2 cách khác nhau:
													Cách thứ nhất – hái lượm:
													Người săn mật tìm kiếm trong các cánh rừng các tổ ong có mật trên cành
													cây hay trong hốc đá… Họ hun khói cho ong bay đi để lấy cả tổ xuống, sau
													đó vắt mật bằng tay.
													Đây là cách mật ong nguyên sơ nhất. Mật ong lẫn rất nhiều tạp chất và
													xác của ấu trùng ong non. Vì là hái lượm nên cứ thấy là lấy, cho dù mật
													ong vẫn còn non. Mật còn non, chứa nhiều nước, nhanh bị lên men chua.
													Các can mật ong rừng thường phình to. Khi mở nút sẽ có hiện tượng bật
													khí ga.&nbsp;
													Cách thứ hai – gác kèo:
													Người U Minh Hạ "gác kèo" để dụ ong rừng đến làm tổ. Người ta tạo ra các
													chạc cây (gọi là kèo) giống như các chạc cây ong thường làm tổ. Họ gác
													chúng lên cây, tại vị trí gần nguồn hoa, nơi có nhiều ong. Ong sẽ dến
													làm tổ. Người gác kèo đợi đến khi có mật thì quay lại thu hoạch. Cách
													này khá hơn cách hái lượm. Người gác kèo tính toán thời gian quay lại để
													lấy mật lúc mật đã bớt non. Sau đó, cũng vắt mật thủ công.
													Gác kèo gần giống với nuôi ong. Điểm khác là người ta không làm tổ cho
													ong bằng các thùng gỗ và không nhân giống ong.
													Mật ong nuôi
													Nuôi ong:
													Đầu tiên, người nuôi ong làm "nhà" cho ong. Họ đóng các thùng gỗ có nặp
													đậy bên trên, Bên trong xếp khoảng 6 đến 10 cầu ong bằng khung gỗ. Mỗi
													khung đều đúc sẵn các lỗ tổ cao khoảng 1/3 so với lỗ tổ hoàn thiện bằng
													chính sáp ong. Ong sẽ tự tiết sáp tiếp tục xây tổ cho đến khi hoàn
													thiện.
													Gọi là nuôi, nhưng thực chất, người nuôi chỉ quản lý mật thu được. Đàn
													ong tự nuôi sống bằng khả năng làm mật hoang dã. Chỉ khi đàn ong đông,
													người ta tạo ong chúa mới để tách đàn. Khi mùa hoa hết, người nuôi ong
													cho ong ăn thức ăn bổ sung bao gồm: phấn hoa, bột đầu nành và đường để
													dưỡng ong mà không thu mật.
													Người nuôi ong sẽ chỉ khai thác mật khi mùa hoa nở rộ. Mật thu được từ
													lần quay mật thứ nhất và thậm chí lần thứ 2 sẽ dùng làm thức ăn chăn
													nuôi. Mật ong chất lượng sẽ được khai thác từ vòng thứ 3 trở đi. Đến mùa
													hoa tàn, ong phải dưỡng, lúc đó cũng không khai thác mật. Việc khai thác
													đúng vào mùa hoa nở rộ sẽ giúp đảm bảo mật ong đạt chât lượng cao.
													Đàn ong thường xuyên được di chuyển. Khi cánh rừng này hết hoa, ong sẽ
													được đưa đến các cánh rừng khác. Việc di chuyển đàn ong giúp ong không
													phải bay xa. Những trại ong thường có hàng trăm đàn.
													Quay mật&nbsp;
													Họ thường thu hoạch mật cùng một lúc bằng cách quay mật. Các cầu ong
													được cắt miệng lỗ tổ chứa mật, xếp trong thùng quay mật. Khi trục của
													thùng quay, mật trong các lỗ tổ văng ra theo lực ly tâm. Mật chảy xuống
													đáy thùng, nơi có vòi rót mật vào can chứa.
													Cách thu hoạch này vệ sinh hơn và rất ít khi bị lẫn các ấu trung ong
													non. Sau khi quay mật xong, người ta trả lại "nhà" cho đàn ong. Đây là
													cách lấy mật mà không phá tổ ong.
													So sánh mật ong nuôi và mật ong rừng&nbsp;
													&nbsp;
													Dù là mật ong rừng hay mật ong nuôi, giá trị dinh dưỡng và hương vị hoàn
													toàn giống nhau nếu như có cùng một nguồn mật hoa. Ong là một loài động
													vật không thể thuần hóa. Khi sống hoang dã trong rừng hay khi được nuôi,
													bản chất ong mật của chúng hoàn toàn không thay đổi. Ong luôn sống bầy
													đàn có phân công và luyên mật bằng các enzim và làm khô mật. Bạn hãy
													hình dung: một thùng ong nuôi đặt trong cùng 1 khu vực có tổ ong rừng dã
													sinh thì mật thu được là hoàn toàn giống nhau.
													Trong rừng có nhiều loại hoa. Nên mật ong rừng thường là mật đa hoa. Mật
													đa hoa phong phú hơn về các loại vi chất nên tốt hơn mật đơn hoa. Nhưng
													mật ong rừng thường bị lấy non. Mật ong nuôi thường là mật đơn hoa nhưng
													lại có thể thu hoạch chín. Hương vị của mật đơn hoa và đa hoa được so
													sánh, đánh giá phụ thuộc vào gu của người dùng. Người Việt thích mật đa
													hoa vì đây là đặc trưng của mật ong rừng. Người Âu Mỹ lại thích mật ong
													đơn hoa. Họ coi đó là đặc sản.
													Chất lượng mật ong&nbsp;không&nbsp;được đánh giá dựa trên nguồn mật hoa,
													mật đơn hoa hay đa hoa. Nó phụ thuộc vào hai yếu tố. Thứ nhất: thời điểm
													thu hoạch. Thu hoạch đúng lúc thì có mật ong chín. Thứ hai là cách thức
													thu hoạch: quay mật tốt hơn vắt mật bằng tay. Cách thức thu hoạch không
													chỉ ảnh hưởng đến vệ sinh an toàn thực phẩm. Nó còn ảnh hưởng đến môi
													trường và sinh thái. Bạn có ủng hộ việc lấy mật và phá luôn tổ ong?
												</p>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="swiper-slide swiper-slide-next" role="group" aria-label="2 / 4" bis_skin_checked="1" style={{ width: '270px', marginRight: '20px' }}>
								<div className="blog_item clearfix" bis_skin_checked="1">
									<div className="blogwp" bis_skin_checked="1">
										<div className="blog-thumbnail" bis_skin_checked="1">
											<a className="thumb" href="tac-dung-cua-mat-ong-chin-doi-voi-suc-khoe.html" title="Tác dụng đến ko ngờ của mật ong chín đối với sức khỏe">
												<img src="https://bizweb.dktcdn.net/100/472/304/articles/wallpaperflare-com-wallpaper-12.jpg?v=1669711557603" data-src="https://bizweb.dktcdn.net/100/472/304/articles/wallpaperflare-com-wallpaper-12.jpg?v=1669711557603" alt="Tác dụng đến ko ngờ của mật ong chín đối với sức khỏe" className="lazyload img-responsive loaded" data-was-processed="true" />
											</a>
										</div>
										<div className="content_blog clearfix" bis_skin_checked="1">
											<span className="post-time">
												Thứ Ba,
												29/11/2022
											</span>
											<h3><a onClick={() => onNewsClick('honey-benefit')} title="Tác dụng đến ko ngờ của mật ong chín đối với sức khỏe" className="a-title">Tác dụng đến ko ngờ của mật ong chín đối với
												sức khỏe</a></h3>
											<div className="summary_blog" bis_skin_checked="1">
												<p>
													Giàu vi chất dinh dưỡng
													Một thìa mật ong chín (21 gam) chứa 64 calo và 17 gam đường. Bao gồm
													fructose, glucose, maltose và sucrose. Mật ong chín hầu như không chứa
													chất xơ, chất béo hoặc protein.&nbsp;Trong mật ong chín có một lượng vi
													lượng dưới 1% RDI. Đó là các vitamin và khoáng chất. Mật ong chín giàu
													vitamin và khoáng chất hơn mật hoa.
													Tác dụng chống oxy hóa&nbsp;
													Mật ong chín chứa nhiều chất chống oxy hóa quan trọng. Đó là các axit
													hữu cơ và các hợp chất phenolic như flavonoid.&nbsp;Các nhà khoa học tin
													rằng sự kết hợp của các hợp chất này mang lại cho mật ong chín sức mạnh
													chống oxy hóa. Các chất này có liên quan đến việc giảm nguy cơ đau tim,
													đột quỵ và một số loại ung thư. Chúng cũng có thể làm mắt khỏe hơn.
													"It hại hơn" so với đường đối với bệnh nhân tiểu đường
													Mật ong chín làm giảm một số nguy cơ đối với bệnh tim ở những người mắc
													bệnh tiểu đường tuýp 2. Mặt khác, nó có thể làm giảm cholesterol LDL
													"xấu", chất béo trung tính và tăng cholesterol HDL "tốt".
													Tuy nhiên, nó cũng có thể làm tăng lượng đường trong máu dù không nhiều
													như đường tinh luyện. Những người bị bệnh tiểu đường vẫn nên thận trọng
													khi sử dụng.
													Tác dụng&nbsp; giảm huyết áp
													Huyết áp là một yếu tố nguy cơ quan trọng đối với bệnh tim. Mật ong chín
													có thể giúp giảm huyết áp. Nó chứa các hợp chất chống oxy hóa giúp giảm
													huyết áp.&nbsp;Các nghiên cứu ở cả chuột và người cho thấy giảm huyết áp
													từ việc sử dụng mật ong chín một cách vừa phải.
													5. Mật ong chín&nbsp;cũng giúp cải thiện cholesterol
													Mức cholesterol LDL cao là một yếu tố nguy cơ cao đối với bệnh tim. Loại
													cholesterol này làm xơ vữa động mạch. Chất béo tích tụ trong động mạch
													của bạn có thể dẫn đến đau tim và đột quỵ. Điều thú vị là một số nghiên
													cứu cho thấy mật ong chín có thể cải thiện mức cholesterol.&nbsp;Nó làm
													giảm cholesterol LDL toàn phần và "xấu" trong khi tăng đáng kể
													cholesterol HDL "tốt".
													Có thể làm giảm chất béo trung tính
													Chất béo trung tính trong máu tăng cao gây nguy cơ mắc bệnh tim. Chúng
													cũng liên quan đến tình trạng kháng insulin. Đó là nguyên nhân chính gây
													ra bệnh tiểu đường tuýp 2. Mức độ chất béo trung tính có xu hướng tăng
													trong chế độ ăn nhiều đường và tinh bột.
													Nhiều nghiên cứu đã chỉ ra sử dụng mật ong chín thường xuyên sẽ làm giảm
													chất béo trung tính. Mức giảm thấp hơn từ 11 đến 19%. Đặc biệt là khi nó
													được sử dụng để thay thế đường.&nbsp;Chất béo trung tính tăng cao là một
													yếu tố nguy cơ của bệnh tim và bệnh tiểu đường tuýp 2.&nbsp;
													Tốt cho sức khỏe tim mạch
													Mật ong chín giàu phenol và các hợp chất chống oxy hóa khác. Chúng có
													thể giúp các động mạch trong tim giãn ra. Chúng làm tăng lưu lượng máu
													đến tim. Chúng cũng có thể giúp ngăn ngừa sự hình thành cục máu đông. Nó
													có thể phòng ngừa đau tim và đột quỵ. Mật ong chín rất tốt cho sức khỏe
													người già.
													Tốt cho việc chữa lành vết bỏng và vết thương
													Điều trị tại chỗ bằng mật ong chín đã được sử dụng để chữa lành vết
													thương và vết bỏng. Việc này phổ biến từ thời Ai Cập cổ đại và vẫn còn
													cho đến ngày nay. 26 nghiên cứu về mật ong chín và chăm sóc vết thương
													cho thấy nó hiệu quả nhất trong việc chữa lành vết bỏng có độ dày một
													phần và vết thương bị nhiễm trùng sau phẫu thuật.
													Mật ong chín cũng là một phương pháp điều trị hiệu quả đối với các vết
													loét ở bàn chân do tiểu đường. Đây là những biến chứng nghiêm trọng có
													thể dẫn đến cắt cụt chân.&nbsp;Một nghiên cứu báo cáo tỷ lệ thành công
													43,3% với mật ong chín như một phương pháp điều trị vết thương.
													Trong một nghiên cứu khác, mật ong chín bôi ngoài da đã chữa lành 97%
													vết loét do tiểu đường của bệnh nhân.
													Mật ong chín&nbsp;giúp giảm ho ở trẻ em
													Ho là một vấn đề thường gặp đối với trẻ bị nhiễm trùng đường hô hấp
													trên. Những bệnh nhiễm trùng này có thể ảnh hưởng đến giấc ngủ và chất
													lượng sống của cả trẻ em và cha mẹ. Tuy nhiên, các loại thuốc trị ho
													chính thống không phải lúc nào cũng hiệu quả và có thể có tác dụng phụ.
													Điều thú vị là mật ong chín có thể là lựa chọn tốt hơn và bằng chứng cho
													thấy nó rất hiệu quả, nhất là khi được sử dụng với chanh.Song&nbsp;không
													bao giờ được cho trẻ em dưới một tuổi uống mật ong vì nguy cơ ngộ độc.
													Mật ong chín&nbsp;rất ngon, nhưng vẫn chứa nhiều calo và đường
													&nbsp;
													Mật ong chín là một sự thay thế ngon hơn và tốt cho sức khỏe hơn đường.
													Nhưng bạn cần đảm bảo chọn thương hiệu uy tín, vì một số loại mật ong có
													thể bị làm giả, trộn đường hoặc xi rô.
												</p>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="swiper-slide" role="group" aria-label="3 / 4" bis_skin_checked="1" style={{ width: '270px', marginRight: '20px' }}>
								<div className="blog_item clearfix" bis_skin_checked="1">
									<div className="blogwp" bis_skin_checked="1">
										<div className="blog-thumbnail" bis_skin_checked="1">
											<a className="thumb" href="cong-dung-va-huong-dan-dung-mat-ong-dung-cach.html" title="Công dụng và hướng dẫn dùng mật ong đúng cách">
												<img src="https://bizweb.dktcdn.net/100/472/304/articles/wallpaperflare-com-wallpaper.jpg?v=1669709493977" data-src="https://bizweb.dktcdn.net/100/472/304/articles/wallpaperflare-com-wallpaper.jpg?v=1669709493977" alt="Công dụng và hướng dẫn dùng mật ong đúng cách" className="lazyload img-responsive loaded" data-was-processed="true" />
											</a>
										</div>
										<div className="content_blog clearfix" bis_skin_checked="1">
											<span className="post-time">
												29/11/2022
											</span>
											<h3><a onClick={() => onNewsClick('honey-guide')} title="Công dụng và hướng dẫn dùng mật ong đúng cách" className="a-title">Công dụng và hướng dẫn dùng mật ong
												đúng cách</a></h3>
											<div className="summary_blog" bis_skin_checked="1">
												<p>
													1. Những điều cần biết về mật ong&nbsp;
													Mật ong là một chất lỏng ngọt ngào được tạo ra bởi những con ong sử dụng
													mật hoa từ hoa, có khoảng 320 loại&nbsp;mật ong&nbsp;khác nhau về màu
													sắc, mùi và hương vị.
													Mật ong chứa thành phần chủ yếu là đường, cũng như hỗn hợp các axit
													amin, vitamin, khoáng chất, sắt, kẽm và chất chống oxy hóa. Nó thường
													được sử dụng như một chất làm ngọt trong thực phẩm cũng như sử dụng như
													một loại thuốc.
													Mật ong&nbsp;có thể bị nhiễm vi trùng từ thực vật, ong và bụi trong quá
													trình sản xuất, thu thập và chế biến. May mắn thay, với những đặc tính
													sẵn có của mật ong đã ngăn chặn được vi trùng này còn sống hoặc sinh
													sản.
													Tuy nhiên, một số vi khuẩn sinh sản bằng bào tử, chẳng hạn như loại gây
													ngộ độc, có thể vẫn sinh sôi và phát triển. Điều này giải thích tại
													sao&nbsp;mật ong có thể gây ngộ độc ở trẻ sơ sinh.
													Mậtt ong được sử dụng để trị ho, tiểu đường, hen, suyễn&nbsp;và sốt. Nó
													cũng được sử dụng để chữa tiêu chảy, loét miệng trong quá trình điều trị
													ung thư và loét dạ dày do nhiễm vi khuẩn Helicobacter pylori (H.
													pylori). Mật ong cũng cung cấp một nguồn năng lượng dồi dào trong khi
													tập thể dục hoặc ở những người bị suy dinh dưỡng. Uống mật ong pha loãng
													giúp giảm đau và chữa lành vết thương sau khi cắt amidan.
													2. Công dụng của mật ong
													Với những đặc tính ưu việt,&nbsp;mật ong&nbsp;có rất nhiều công dụng
													trong sản xuất và thực phẩm. Trong thực phẩm, mật ong được sử dụng như
													một chất làm ngọt tự nhiên. Trong sản xuất, mật ong được sử dụng làm
													hương liệu và dưỡng ẩm trong xà phòng và mỹ phẩm. Một số công dụng phổ
													biến của mật ong như:
													Trị Ho:&nbsp;Các loại mật ong khuynh diệp, mật ong labiatae có thể hoạt
													động như một thuốc giảm ho đáng tin cậy cho một số người bị nhiễm trùng
													đường hô hấp trên và ho ban đêm cấp tính. Uống một lượng nhỏ mật ong khi
													đi ngủ có tác dụng giảm số lần ho ở trẻ từ 2 tuổi trở lên. Ngoài ra,
													uống nước có chứa một lượng nhỏ mật ong làm giảm tần suất ho ở người lớn
													bị ho kéo dài sau khi họ bị bệnh.
													Loét chân do tiểu đường: Hầu hết các nghiên cứu cho thấy rằng áp dụng
													băng có chứa mật ong cho loét chân tiểu đường&nbsp;dường như làm giảm
													thời gian chữa lành và ngăn ngừa sự cần thiết phải dùng kháng sinh.
													Nhưng không phải tất cả các nghiên cứu đều đồng ý.
													Giảm khô mắt: Sử dụng thuốc nhỏ mắt mật ong hoặc gel mắt đặc biệt vào
													mắt (Optimel Manuka cộng với thuốc nhỏ mắt hoặc Gel mắt kháng khuẩn
													Optimel) giúp làm cho mắt đỡ khô hơn. Những sản phẩm này có thể được sử
													dụng cùng với điều trị khô mắt thường xuyên như giọt dầu bôi trơn và
													khăn ấm trên mắt.
													Loét miệng do bức xạ hoặc điều trị hóa học (viêm niêm mạc):&nbsp;Đối với
													những bệnh nhân cần xạ trị, loét miệng là một trong những triệu chứng
													thường gặp. Uống mật ong trước và sau các buổi xạ trị giúp làm giảm nguy
													cơ phát triển loét miệng. Ngoài ra, bôi mật ong lên vết loét miệng hoặc
													uống mật ong cũng có tác dụng giúp chữa lành vết loét miệng do hóa trị.
													Làm lành vết thương: Sử dụng các chế phẩm mật ong trực tiếp vào vết
													thương hoặc sử dụng băng có chứa mật ong giúp cải thiện sự vết thương
													đáng kể như: vết thương sau phẫu thuật, loét chân mãn tính, áp xe, bỏng,
													trầy xước, nơi lấy da để ghép. Mật ong còn có tác dụng giảm mùi hôi và
													mủ, giúp làm sạch vết thương, giảm nhiễm trùng, giảm đau và giảm thời
													gian lành vết thương. Mật ong thường an toàn ở người lớn và trẻ lớn hơn
													1 tuổi. Nó có thể hữu ích trong việc điều trị bỏng, ho và có thể các
													tình trạng khác.
													Bệnh tim mạch:&nbsp;Chất chống oxy hóa trong mật ong có tác dụng giảm
													nguy cơ mắc bệnh tim
													Cải thiện tình trạng các bệnh thần kinh:&nbsp;Các nghiên cứu cho thấy
													mật ong có thể mang lại lợi ích chống trầm cảm, chống co giật và chống
													lo âu. Đồng thời, mật ong còn giúp ngăn ngừa rối loạn trí nhớ.
													Mật ong có tác dụng kháng khuẩn:&nbsp;Trong phòng thí nghiệm, mật ong đã
													được chứng minh là cản trở sự phát triển của các mầm bệnh truyền qua
													thực phẩm như E. coli và salmonella, và để chống lại một số vi khuẩn,
													bao gồm Staphylococcus aureus và Pseudomonas aeruginosa. Mật ong càng
													sẫm màu thì khả năng kháng khuẩn và chống oxy hóa càng tốt.
													3. Hướng dẫn sử dụng mật ong đúng cách
													Mật ong chỉ an toàn cho người lớn và trẻ từ một tuổi trở lên.&nbsp;Tuyệt
													đối không cho trẻ em dưới 1 tuổi, đặc biệt là trẻ sơ sinh sử dụng mật
													ong vì có thể gây ra một tình trạng đường tiêu hóa hiếm gặp nhưng nghiêm
													trọng (ngộ độc ở trẻ sơ sinh) do tiếp xúc với bào tử Clostridium
													botulinum. Các bào tử của vi khuẩn ngộ độc được tìm thấy trong bụi và
													đất có thể xâm nhập vào mật ong, mà trẻ sơ sinh lại không có một hệ
													thống miễn dịch phát triển để chống lại nhiễm trùng. Bên cạnh đó, vi
													khuẩn từ bào tử có thể phát triển và nhân lên trong ruột của em bé, tạo
													ra độc tố nguy hiểm.
													Nhưng cha mẹ có thể cho trẻ ăn ngũ cốc có chứa&nbsp;mật ong, vì đây là
													sản phẩm đã được nấu chín.
													Một số người nhạy cảm hoặc dị ứng với các thành phần cụ thể trong mật
													ong, đặc biệt là phấn ong cũng không nên sử dụng mật ong. Dị ứng phấn
													hoa ong có thể gây ra các phản ứng nghiêm trọng với cơ thể và đôi khi
													gây tử vong. Các dấu hiệu và triệu chứng của phản ứng bao gồm: khò khè
													và các triệu chứng hen suyễn khác, chóng mặt, buồn nôn, nôn, toát mồ
													hôi, ngất xỉu, nhịp tim không đều,...
													Loại&nbsp;mật ong Rhododendrons&nbsp;có chứa độc tố có thể gây ra các
													vấn đề về tim, huyết áp thấp và đau ngực.
													Đối với phụ nữ mang thai và cho con bú: hoàn toàn có thể sử dụng được
													các sản phẩm đến từ mật ong, tuy nhiên, không nên sử dụng quá nhiều.
													&nbsp;
												</p>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="swiper-slide" role="group" aria-label="4 / 4" bis_skin_checked="1" style={{ width: '270px', marginRight: '20px' }}>
								<div className="blog_item clearfix" bis_skin_checked="1">
									<div className="blogwp" bis_skin_checked="1">
										<div className="blog-thumbnail" bis_skin_checked="1">
											<a className="thumb" href="nhung-ai-nen-dung-mat-ong-thuong-xuyen.html" title="Những ai thì nên dùng mật ong thường xuyên?">
												<img src="https://bizweb.dktcdn.net/100/472/304/articles/wallpaperflare-com-wallpaper-13.jpg?v=1669712533677" data-src="https://bizweb.dktcdn.net/100/472/304/articles/wallpaperflare-com-wallpaper-13.jpg?v=1669712533677" alt="Những ai thì nên dùng mật ong thường xuyên?" className="lazyload img-responsive loaded" data-was-processed="true" />
											</a>
										</div>
										<div className="content_blog clearfix" bis_skin_checked="1">
											<span className="post-time">
												29/11/2022
											</span>
											<h3><a onClick={() => onNewsClick('honey-who')} title="Những ai thì nên dùng mật ong thường xuyên?" className="a-title">Những ai thì nên dùng mật ong thường
												xuyên?</a></h3>
											<div className="summary_blog" bis_skin_checked="1">
												<p>
													Những ai nên dùng mật ong? Mật ong là thực phẩm chứa nhiều công dụng tốt
													cho làn da, đường tiêu hóa. Nó còn được xem như một "vị thuốc tự nhiên"
													giúp phòng ngừa, điều trị nhiều vấn đề sức khỏe. Cùng tìm hiểu những
													nhóm đối tượng nên thường xuyên dùng mật ong để cải thiện sức khỏe chính
													mình.
													Đầu tiên, mật ong là một "chất bảo quản" rất tốt. Các lương y ngày xưa
													khi bào chế thuốc thường chất bảo bằng chính mật ong. Bằng chứng là các
													nhà khảo cổ đã tìm được trong các ngôi mộ cổ những hũ mật ong mà tới bây
													giờ vẫn còn dùng được.
													Mặc dù người bệnh tiểu đường nên tránh sử dụng thực phẩm có chất đường.
													Nhưng nếu phải sử dụng chất ngọt thì dùng mật ong vẫn tốt hơn. Không nên
													dùng các loại đường thông thường khác.
													Có những nhóm người nên thường xuyên sử dụng mật ong sau:
													Những người bị bội nhiễm đường hô hấp nên dùng mật ong
													Những người bị bội nhiễm đường hô hấp trên dưới dạng viêm xoang, viêm
													họng, viêm mũi… nên thường xuyên dùng mật ong, bởi vì khi bạn uống mật
													ong&nbsp;với tốc độ chậm hoặc ngậm mật ong&nbsp;thì nó sẽ có tác dụng
													kháng sinh cực kỳ tốt. Đồng thời nó còn có tác dụng làm lành những vết
													loét tại vùng cổ họng hoặc trên môi.
													Những người có vết thương ngoài da dùng nên dùng mật ong để bôi
													Người có vết thương ngoài da, bị trầy xước muốn vết thương mau lành thì
													có thể dùng mật ong để bôi, sau đó rửa sạch da và uống nước mật ong
													nhiều hơn.
													Phụ nữ tiền mãn kinh nên uống mật ong thường xuyên
													Phụ nữ mãn kinh không bị bệnh tiểu đường khi sử dụng dụng mật ong kết
													hợp với các thành phần khác của ong bao gồm sữa ong chúa, một chút sáp
													ong và phấn hoa sẽ có tác dụng tương tự như nội tiết tố nữ progesterone
													và estrogen nhưng lại không gây phản ứng phụ như hóa chất tổng hợp.
													Do đó, nếu phụ nữ có được những thành phần này và sử dụng trong giai
													đoạn mãn kinh sẽ thấy tình trạng đau nhức, bốc hỏa, đổ mồ hôi từng cơn,
													nóng bừng mặt… được cải thiện rõ rệt.
												</p>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<span className="swiper-notification" aria-live="assertive" aria-atomic="true"></span>
					</div>
				</div>
			</section>
		</main>
	);
}

export default Home; 
