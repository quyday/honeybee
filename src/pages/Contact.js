import React, { useEffect } from 'react';
import './Contact.css';

function Contact() {
  useEffect(() => {
    // Initialize any required scripts after component mount
    const initializeScripts = () => {
      if (window.jQuery && window.Swiper) {
        // Your initialization code here
        console.log('Scripts loaded successfully');
      } else {
        // Retry after a short delay if scripts aren't loaded
        setTimeout(initializeScripts, 100);
      }
    };

    initializeScripts();

    // Cleanup function
    return () => {
      // Cleanup code if needed
    };
  }, []); // Empty dependency array means this runs once on mount

  return (
    <main className="wrapperMain_content">
      <nav className="bread-crumb clearfix">
        <div className="container">
          <ul className="breadcrumb">
            <li className="home">
              <a href="/"><span>Trang chủ</span></a>
              <span className="mr_lr">&nbsp;/&nbsp;</span>
            </li>
            <li><strong><span>Liên hệ</span></strong></li>
          </ul>
        </div>
      </nav>
      
      <div className="page_contact">
        <div className="container">
          <h1 className="title_page"><span>Liên hệ</span></h1>
          <div className="row">
            <div className="col-lg-12 col-12 left_contact">
              <div className="row">
                <div className="col-lg-4 col-12">
                  <div className="single-contact clearfix">
                    <div className="contact-icon">
                      <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="map-marker-alt" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" class="svg-inline--fa fa-map-marker-alt fa-w-12"><path fill="currentColor" d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z" class=""></path></svg>
                    </div>
                    <h4>
                      Địa chỉ
                    </h4>
                    <div className="content_contact">
                      Nghĩa Chỉ - Minh Đạo - Tiên Du - Bắc Ninh </div>
                  </div>
                </div>
                <div className="col-lg-4 col-12">
                  <div className="single-contact clearfix">
                    <div className="contact-icon">
                      <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="phone-alt" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-phone-alt fa-w-16"><path fill="currentColor" d="M497.39 361.8l-112-48a24 24 0 0 0-28 6.9l-49.6 60.6A370.66 370.66 0 0 1 130.6 204.11l60.6-49.6a23.94 23.94 0 0 0 6.9-28l-48-112A24.16 24.16 0 0 0 122.6.61l-104 24A24 24 0 0 0 0 48c0 256.5 207.9 464 464 464a24 24 0 0 0 23.4-18.6l24-104a24.29 24.29 0 0 0-14.01-27.6z" class=""></path></svg>
                    </div>
                    <h4>
                      Số điện thoại
                    </h4>
                    <a className="content_contact" href="tel:18006750">
                      0387-231-205
                    </a>
                  </div>
                </div>
                <div className="col-lg-4 col-12">
                  <div className="single-contact clearfix">
                    <div className="contact-icon">
                      <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="envelope" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-envelope fa-w-16"><path fill="currentColor" d="M502.3 190.8c3.9-3.1 9.7-.2 9.7 4.7V400c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V195.6c0-5 5.7-7.8 9.7-4.7 22.4 17.4 52.1 39.5 154.1 113.6 21.1 15.4 56.7 47.8 92.2 47.6 35.7.3 72-32.8 92.3-47.6 102-74.1 131.6-96.3 154-113.7zM256 320c23.2.4 56.6-29.2 73.4-41.4 132.7-96.3 142.8-104.7 173.4-128.7 5.8-4.5 9.2-11.5 9.2-18.9v-19c0-26.5-21.5-48-48-48H48C21.5 64 0 85.5 0 112v19c0 7.4 3.4 14.3 9.2 18.9 30.6 23.9 40.7 32.4 173.4 128.7 16.8 12.2 50.2 41.8 73.4 41.4z" class=""></path></svg>
                    </div>
                    <h4>
                      Email
                    </h4>
                    <a className="content_contact" href="mailto:hellocafein@gmail.com">nguyencongquy13@gmail.com</a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-12 col-12 right_contact">
              <h2 className="title_page">
                <span>Gửi yêu cầu của bạn</span>
              </h2>
              <div id="pagelogin">
                <form method="post" action="/postcontact" id="contact" acceptCharset="UTF-8">
                  <input name="FormType" type="hidden" value="contact" />
                  <input name="utf8" type="hidden" value="true" />
                  <input type="hidden" id="Token-0979ca832d754324aee811ff533f4364" name="Token" />
                  
                  <div className="form-signup clearfix">
                    <div className="row group_contact">
                      <fieldset className="form-group col-lg-6 col-md-12 col-sm-12 col-xs-12">
                        <label>Họ và tên:</label>
                        <input type="text" className="form-control form-control-lg" required value="" name="contact[Name]" />
                      </fieldset>
                      <fieldset className="form-group col-lg-6 col-md-12 col-sm-12 col-xs-12">
                        <label>Email:</label>
                        <input type="email" className="form-control form-control-lg" required value="" name="contact[email]" />
                      </fieldset>
                      <fieldset className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <label>Nội dung:</label>
                        <textarea className="form-control form-control-lg" required name="contact[body]" rows="5"></textarea>
                      </fieldset>
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 a-center">
                        <button type="submit" className="btn btn-primary btn-lienhe">Gửi tin nhắn</button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="iFrameMap">
          <div id="contact_map" className="map">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d362.7617413735884!2d106.05483580558626!3d21.087326503837353!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313509001dca4555%3A0xee1eef25e8ebbd49!2zdHJ1bmcgdMOibSBz4buxIGtp4buHbiBOQ1E!5e1!3m2!1svi!2s!4v1749096552169!5m2!1svi!2s"
              width="100%" height="450" style={{border:'0', marginTop: '20px', marginBottom: '0px'}} allowFullScreen="" loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"></iframe>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Contact; 