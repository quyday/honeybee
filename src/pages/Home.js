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
				<div className="container">
					<div className="title_module_main">
						<h2>
							<p title="Mật ong bán chạy nhất">Mật ong bán chạy nhất</p>
						</h2>
					</div>
					<div className="bestsale-list">
						<div className="item">
							<div className="item_product_main">
								<form action="/cart/add" method="post" className="variants product-action wishItem" encType="multipart/form-data">
									<div className="product-thumbnail">
										<a className="image_thumb" href="combo-mat-ong-rung-hoa-yen-bach-honimore.html" title="Mật ong rừng Hoa Yên Bạch Honimore">
											<img width="199" height="199" src="https://bizweb.dktcdn.net/100/472/304/products/frame-7-1.png?v=1669696727853" alt="Mật ong rừng Hoa Yên Bạch Honimore" className="lazyload img-responsive center-block loaded" data-was-processed="true" />
										</a>
										<div className="action-cart">
												<input className="hidden" type="hidden" name="variantId" value="76944878" />
											<button className="btn btn-cart btn-left btn-views left-to option-choice" title="Tùy chọn" type="button" onClick={() => window.location.href='combo-mat-ong-rung-hoa-yen-bach-honimore.html'}>
													Tùy chọn
												</button>
											</div>
										</div>
									<div className="info-product">
										<h3 className="product-name"><a href="combo-mat-ong-rung-hoa-yen-bach-honimore.html" title="Mật ong rừng Hoa Yên Bạch Honimore">Mật ong rừng Hoa Yên Bạch Honimore</a></h3>
										<div className="price-box">500.000₫</div>
										</div>
									</form>
								</div>
							</div>
						<div className="item">
							<div className="item_product_main">
								<form action="/cart/add" method="post" className="variants product-action wishItem" encType="multipart/form-data">
									<div className="product-thumbnail">
										<a className="image_thumb" href="mat-ong-rung.html-cao-thao-duoc-honimore-lady" title="Mật ong rừng cao thảo dược Honimore Lady">
											<img width="199" height="199" src="https://bizweb.dktcdn.net/100/472/304/products/frame-8.png?v=1669697248883" alt="Mật ong rừng cao thảo dược Honimore Lady" className="lazyload img-responsive center-block loaded" data-was-processed="true" />
										</a>
										<div className="action-cart">
												<input className="hidden" type="hidden" name="variantId" value="76945705" />
											<button className="btn btn-cart btn-left btn-views left-to option-choice" title="Tùy chọn" type="button" onClick={() => window.location.href='mat-ong-rung.html-cao-thao-duoc-honimore-lady'}>
													Tùy chọn
												</button>
											</div>
										</div>
									<div className="info-product">
										<h3 className="product-name"><a href="mat-ong-rung.html-cao-thao-duoc-honimore-lady" title="Mật ong rừng cao thảo dược Honimore Lady">Mật ong rừng cao thảo dược Honimore Lady</a></h3>
										<div className="price-box">
											<span className="discount">-40%</span>
												<span className="price">300.000₫</span>
												<span className="compare-price">500.000₫</span>
											</div>
										</div>
									</form>
								</div>
							</div>
						<div className="item">
							<div className="item_product_main">
								<form action="/cart/add" method="post" className="variants product-action wishItem" encType="multipart/form-data">
									<div className="product-thumbnail">
										<a className="image_thumb" href="mat-ong-rung-hoa-cao-nguyen.html" title="Mật ong rừng Hoa Cao Nguyên">
											<img width="199" height="199" src="https://bizweb.dktcdn.net/100/472/304/products/16.png?v=1669708547967" alt="Mật ong rừng Hoa Cao Nguyên" className="lazyload img-responsive loaded" data-was-processed="true" />
										</a>
										<div className="action-cart">
												<input className="hidden" type="hidden" name="variantId" value="76947736" />
											<button className="btn btn-cart btn-left btn-views left-to option-choice" title="Tùy chọn" type="button" onClick={() => window.location.href='mat-ong-rung-hoa-cao-nguyen.html'}>
													Tùy chọn
												</button>
											</div>
										</div>
									<div className="info-product">
											<h3 className="product-name"><a href="mat-ong-rung-hoa-cao-nguyen.html" title="Mật ong rừng Hoa Cao Nguyên">Mật ong rừng Hoa Cao Nguyên</a></h3>
										<div className="price-box">
											<span className="discount">-23%</span>
												<span className="price">230.000₫</span>
												<span className="compare-price">300.000₫</span>
											</div>
										</div>
									</form>
								</div>
							</div>
						<div className="item">
							<div className="item_product_main">
								<form action="/cart/add" method="post" className="variants product-action wishItem" encType="multipart/form-data">
									<div className="product-thumbnail">
										<a className="image_thumb" href="mat-ong-rung.html-hoa-rung-phuong-nam.html" title="Mật ong rừng Hoa Rừng Phương Nam">
											<img width="199" height="199" src="https://bizweb.dktcdn.net/100/472/304/products/17.png?v=1669708779423" alt="Mật ong rừng Hoa Rừng Phương Nam" className="lazyload img-responsive center-block loaded" data-was-processed="true" />
										</a>
										<div className="action-cart">
												<input type="hidden" name="variantId" value="76947769" />
											<button className="btn-buy btn-left btn-views add_to_cart " title="Mua ngay">Mua ngay</button>
										</div>
									</div>
									<div className="info-product">
										<h3 className="product-name"><a href="mat-ong-rung.html-hoa-rung-phuong-nam.html" title="Mật ong rừng Hoa Rừng Phương Nam">Mật ong rừng Hoa Rừng Phương Nam</a></h3>
										<div className="price-box">
											<span className="discount">-50%</span>
												<span className="price">200.000₫</span>
												<span className="compare-price">400.000₫</span>
											</div>
										</div>
									</form>
								</div>
							</div>
						
					</div>
					<div className="button_readmore">
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
				<div className="container">
					<h2 className="title_module_main">Tin tức</h2>
					<div className="blog-list">
						<div className="blog-list-item">
							<div className="blog_item clearfix">
								<div className="blogwp">
									<div className="blog-thumbnail">
											<a className="thumb" href="mat-ong-rung-va-mat-ong-nuoi-loai-nao-tot-hon.html" title="Mật ong rừng và mật ong nuôi loại nào tốt hơn?">
											<img src="https://bizweb.dktcdn.net/100/472/304/articles/wallpaperflare-com-wallpaper-7.jpg?v=1669711748507" alt="Mật ong rừng và mật ong nuôi loại nào tốt hơn?" className="lazyload img-responsive loaded" data-was-processed="true" />
											</a>
										</div>
									<div className="content_blog clearfix">
										<span className="post-time">Thứ Ba, 29/11/2022</span>
										<h3><a onClick={() => onNewsClick('honey-comparison')} title="Mật ong rừng và mật ong nuôi loại nào tốt hơn?" className="a-title">Mật ong rừng và mật ong nuôi loại nào tốt hơn?</a></h3>
										<div className="summary_blog">
											<p>
												Mật ong rừng được lấy từ những tổ ong sống dã sinh trong rừng. Khi lấy mật, người ta sẽ phá luôn tổ ong. Mật ong nuôi được thu hoạch từ những thùng nuôi ong...
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="blog-list-item">
							<div className="blog_item clearfix">
								<div className="blogwp">
									<div className="blog-thumbnail">
											<a className="thumb" href="tac-dung-cua-mat-ong-chin-doi-voi-suc-khoe.html" title="Tác dụng đến ko ngờ của mật ong chín đối với sức khỏe">
											<img src="https://bizweb.dktcdn.net/100/472/304/articles/wallpaperflare-com-wallpaper-12.jpg?v=1669711557603" alt="Tác dụng đến ko ngờ của mật ong chín đối với sức khỏe" className="lazyload img-responsive loaded" data-was-processed="true" />
											</a>
										</div>
									<div className="content_blog clearfix">
										<span className="post-time">Thứ Ba, 29/11/2022</span>
										<h3><a onClick={() => onNewsClick('honey-benefit')} title="Tác dụng đến ko ngờ của mật ong chín đối với sức khỏe" className="a-title">Tác dụng đến ko ngờ của mật ong chín đối với sức khỏe</a></h3>
										<div className="summary_blog">
											<p>
												Giàu vi chất dinh dưỡng. Một thìa mật ong chín (21 gam) chứa 64 calo và 17 gam đường. Bao gồm fructose, glucose, maltose và sucrose...
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="blog-list-item">
							<div className="blog_item clearfix">
								<div className="blogwp">
									<div className="blog-thumbnail">
											<a className="thumb" href="cong-dung-va-huong-dan-dung-mat-ong-dung-cach.html" title="Công dụng và hướng dẫn dùng mật ong đúng cách">
											<img src="https://bizweb.dktcdn.net/100/472/304/articles/wallpaperflare-com-wallpaper.jpg?v=1669709493977" alt="Công dụng và hướng dẫn dùng mật ong đúng cách" className="lazyload img-responsive loaded" data-was-processed="true" />
											</a>
										</div>
									<div className="content_blog clearfix">
										<span className="post-time">29/11/2022</span>
										<h3><a onClick={() => onNewsClick('honey-guide')} title="Công dụng và hướng dẫn dùng mật ong đúng cách" className="a-title">Công dụng và hướng dẫn dùng mật ong đúng cách</a></h3>
										<div className="summary_blog">
											<p>
												1. Những điều cần biết về mật ong. Mật ong là một chất lỏng ngọt ngào được tạo ra bởi những con ong sử dụng mật hoa từ hoa...
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="blog-list-item">
							<div className="blog_item clearfix">
								<div className="blogwp">
									<div className="blog-thumbnail">
											<a className="thumb" href="nhung-ai-nen-dung-mat-ong-thuong-xuyen.html" title="Những ai thì nên dùng mật ong thường xuyên?">
											<img src="https://bizweb.dktcdn.net/100/472/304/articles/wallpaperflare-com-wallpaper-13.jpg?v=1669712533677" alt="Những ai thì nên dùng mật ong thường xuyên?" className="lazyload img-responsive loaded" data-was-processed="true" />
											</a>
										</div>
									<div className="content_blog clearfix">
										<span className="post-time">29/11/2022</span>
										<h3><a onClick={() => onNewsClick('honey-who')} title="Những ai thì nên dùng mật ong thường xuyên?" className="a-title">Những ai thì nên dùng mật ong thường xuyên?</a></h3>
										<div className="summary_blog">
											<p>
												Những ai nên dùng mật ong? Mật ong là thực phẩm chứa nhiều công dụng tốt cho làn da, đường tiêu hóa. Nó còn được xem như một "vị thuốc tự nhiên"...
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}

export default Home; 
