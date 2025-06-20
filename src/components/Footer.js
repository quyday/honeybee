import React from 'react';

function Footer({ setCurrentPage }) {
  React.useEffect(() => {
    // Handle footer menu toggle
    const footerTitles = document.querySelectorAll('.footer-click .title-menu');
    footerTitles.forEach(title => {
      title.addEventListener('click', () => {
        title.classList.toggle('clicked');
        const menu = title.nextElementSibling;
        if (menu) {
          menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
        }
      });
    });

    // Handle back to top button
    const backTop = document.querySelector('.backtop');
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        backTop.classList.add('show');
      } else {
        backTop.classList.remove('show');
      }
    });

    backTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    // Cleanup
    return () => {
      footerTitles.forEach(title => {
        title.removeEventListener('click', () => {});
      });
      window.removeEventListener('scroll', () => {});
      backTop.removeEventListener('click', () => {});
    };
  }, []);

  return (
    <footer className="footer">
      <div className="mid-footer">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-4 col-12">
              <div className="widget-ft">
                <a href="/" className="blocklogo">
                  <img src={process.env.PUBLIC_URL + "/images/logo-footer.png"} alt="Template Honey Bee" />
                </a>
                <div className="content_contact">
                  Nghĩa Chỉ, Minh Đạo, Tiên Du, Bắc Ninh
                </div>
                <div className="content_contact">
                  <a href="tel:18006750">0387-231-205</a>
                </div>
                <div className="content_contact">
                  <a href="mailto:hellocafein@gmail.com">nguyencongquy13@gmail.com</a>
                </div>
                <div className="content_contact">
                  <a href="#" title="Hệ thống chi nhánh">Hệ thống chi nhánh</a>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-4 col-12 footer-click">
                <h4 className="title-menu clicked">Thông tin khách hàng</h4>
                <ul className="list-menu toggle-mn" style={{color: '#e4f2ff', fontSize: 12}}>
                  <li className="li_menu"style={{height:'24px'}} >
                    <span style={{cursor: 'pointer'}} onClick={() => setCurrentPage('home')}>Trang chủ</span>
                  </li>
                  <li className="li_menu"style={{height:'24px'}}>
                    <span style={{cursor: 'pointer'}} onClick={() => setCurrentPage('products')}>Sản phẩm</span>
                  </li>
                  <li className="li_menu"style={{height:'24px'}}>
                    <span style={{cursor: 'pointer'}} onClick={() => setCurrentPage('contact')}>Liên hệ</span>
                  </li>
                  <li className="li_menu"style={{height:'24px'}}>
                    <span style={{cursor: 'pointer'}} onClick={() => setCurrentPage('introduct')}>Giới thiệu</span>
                  </li>
                </ul>
             
            </div>
            <div className="col-lg-3 col-md-4 col-12 footer-click">
              
                <h4 className="title-menu clicked">
                  Chính sách mua hàng
                </h4>
                <ul className="list-menu toggle-mn">
                  <li className="li_menu">
                    <a href="/" title="Trang chủ">Trang chủ</a>
                  </li>
                  <li className="li_menu">
                    <a href="collections/all.html" title="Sản phẩm">Sản phẩm</a>
                  </li>
                  <li className="li_menu">
                    <a href="tin-tuc.html" title="Tin tức">Tin tức</a>
                  </li>
                  <li className="li_menu">
                    <a href="lien-he.html" title="Liên hệ">Liên hệ</a>
                  </li>
                  <li className="li_menu">
                    <a href="gioi-thieu.html" title="Giới thiệu">Giới thiệu</a>
                  </li>
                  <li className="li_menu">
                    <a href="/cam-nang" title="Cẩm nang">Cẩm nang</a>
                  </li>
                </ul>
        
            </div>
            <div className="col-lg-3 col-md-12 col-12">
              <h4 className="title-menu">
                Dịch vụ hỗ trợ
              </h4>
              <div className="payment">
                <img src="/images/payment.png"
                  className="lazyload" alt="Phương thức thanh toán" />
              </div>
              <div className="qr-support" style={{ marginTop: 16, textAlign: 'center' }}>
                <img src="/logo/ma-qr.jpg" alt="Mã QR hỗ trợ" style={{ maxWidth: 120, width: '100%', borderRadius: 8, boxShadow: '0 2px 8px #eee' }} />
                <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>Quét mã QR để kết nối</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="copyright clearfix">
        <div className="container">
          <div className="row tablet">
            <div id="copyright" className="col-lg-12 col-md-12 col-xs-12 fot_copyright">
              <span className="wsp">
                <span className="mobile">Bản quyền thuộc về <b>Công Quý</b></span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <a href="#" className="backtop" title="Lên đầu trang" style={{bottom: '52px'}}>
        <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="angle-up" role="img"
          xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" className="svg-inline--fa fa-angle-up fa-w-10">
          <path fill="currentColor"
            d="M168.5 164.2l148 146.8c4.7 4.7 4.7 12.3 0 17l-19.8 19.8c-4.7 4.7-12.3 4.7-17 0L160 229.3 40.3 347.8c-4.7 4.7-12.3 4.7-17 0L3.5 328c-4.7-4.7-4.7-12.3 0-17l148-146.8c4.7-4.7 12.3-4.7 17 0z"
            className=""></path>
        </svg>
      </a>
    </footer>
  );
}

export default Footer; 