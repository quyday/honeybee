import React, { useRef, useEffect, useState } from 'react';
import CartHeader from '../components/CartHeader';
import './Introduct.css';

const bannerImages = [
  './images/slider-01.jpg',
  './images/slider-02.jpg',
  './images/slider-03.jpg',
  './images/wallpaperflare-com-wallpaper-1.jpg',
];

const images = {
  value1: 'https://cdn-icons-png.flaticon.com/512/616/616494.png',
  value2: 'https://cdn-icons-png.flaticon.com/512/616/616408.png',
  value3: 'https://cdn-icons-png.flaticon.com/512/616/616408.png',
  decoLeft: 'https://i.imgur.com/1Q9Z1Zm.png', // hoa văn trái
  decoRight: 'https://i.imgur.com/1Q9Z1Zm.png', // hoa văn phải (có thể lật lại bằng css)
};

function Introduct() {
  // refs cho 3 icon
  const icon1Ref = useRef();
  const icon2Ref = useRef();
  const icon3Ref = useRef();

  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % bannerImages.length);
    }, 5000); // Chuyển banner mỗi 5 giây
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const icons = [icon1Ref, icon2Ref, icon3Ref];
    let timeout;
    function triggerFlip() {
      icons.forEach(ref => {
        if (ref.current) {
          ref.current.classList.remove('rotate-flipY');
          void ref.current.offsetWidth;
          ref.current.classList.add('rotate-flipY');
        }
      });
      timeout = setTimeout(triggerFlip, 8000);
    }
    triggerFlip();
    return () => clearTimeout(timeout);
  }, []);

  return (
    <main className="intro-luxury-bg">
      <CartHeader />
      {/* Banner section */}
      <section className="intro-banner-section">
        {bannerImages.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Banner ${index + 1}`}
            className={`intro-banner-img ${currentBanner === index ? 'active' : ''}`}
          />
        ))}
        <div className="intro-banner-overlay">
          <h1 className="intro-banner-title" style={{color: '#fbf6d7'}}>Quý Honey Bee<br /><span>Chất lượng - Uy tín - Đẳng cấp</span></h1>
        </div>
      </section>
      {/* Giá trị cốt lõi */}
      <section className="intro-value-section">
        <div className="intro-value-header">
          <h2>Mật Ong Quý Honey Bee</h2>
          <h3>Sự kết hợp hoàn hảo giữa hương vị và dinh dưỡng</h3>
          <img src="./images/divider.png" alt="decor left" style={{opacity: '70%', margin:'20px 0px'} } />
        </div>
        <div className="intro-value-list">
          <div className="intro-value-item">
            <div className="intro-value-icon">
              <img ref={icon1Ref} src={images.value1} alt="Tiêu hóa" className="intro-value-icon-img" />
            </div>
            <h4>Thần dược cho hệ tiêu hóa</h4>
            <p>JAHONEY không chỉ là một loại mật ong thông thường, mà còn là một "thần dược" tuyệt vời cho hệ tiêu hóa. Với thành phần polyphenol và flavonoid cao, mật ong JAHONEY giúp cải thiện sức khỏe đường ruột, hỗ trợ tiêu hóa, giảm viêm loét dạ dày và cải thiện khả năng hấp thụ dinh dưỡng.</p>
          </div>
          <div className="intro-value-item">
            <div className="intro-value-icon">
              <img ref={icon2Ref} src="https://randomuser.me/api/portraits/women/44.jpg" alt="Hồi sinh tuổi xuân" className="intro-value-icon-img" />
            </div>
            <h4>Kim bài hồi sinh tuổi xuân</h4>
            <p>Được sản xuất tại Fewster's Farm với hơn 100 năm kinh nghiệm, từng giọt mật ong JAHONEY là nguồn sinh dưỡng quý giá giúp hỗ trợ giảm lão hóa và bảo vệ da khỏi các dấu hiệu tuổi tác. Sử dụng JAHONEY thường xuyên là một cách hiệu quả để duy trì nét tươi trẻ và vẻ đẹp tự nhiên theo thời gian.</p>
          </div>
          <div className="intro-value-item">
            <div className="intro-value-icon">
              <img ref={icon3Ref} src="https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=100&q=80" alt="Caramel tự nhiên" className="intro-value-icon-img" />
            </div>
            <h4>Hương vị caramel thanh ngọt tự nhiên</h4>
            <p>Không chỉ tốt cho sức khỏe, mật ong JAHONEY còn chinh phục vị giác với hương vị caramel đặc trưng, thanh ngọt và thơm tự nhiên. Được thu hoạch từ cây Jarrah cổ thụ tại miền Tây Úc, mật ong JAHONEY mang đến một trải nghiệm ẩm thực độc đáo, dễ dàng ăn trực tiếp hoặc kết hợp vào nhiều món ăn khác, làm tăng thêm phần hấp dẫn và ngon miệng cho mọi bữa ăn.</p>
          </div>
        </div>
      </section>
      {/* Section giới thiệu doanh nghiệp */}
      <section className="intro-about-section">
        <div className="intro-about-content">
          <div className="intro-about-text">
            <h2>Về chúng tôi</h2>
            <h3>Quý Honey Bee - Doanh nghiệp dẫn đầu về mật ong cao cấp</h3>
            <p>
              Với hơn 20 năm kinh nghiệm, Quý Honey Bee tự hào là đơn vị tiên phong trong lĩnh vực cung cấp mật ong nguyên chất và các sản phẩm từ ong tại Việt Nam. Chúng tôi cam kết mang đến cho khách hàng những sản phẩm chất lượng cao, an toàn và giàu giá trị dinh dưỡng, đồng thời không ngừng đổi mới để đáp ứng nhu cầu ngày càng cao của thị trường.
            </p>
            <p>
              Sứ mệnh của chúng tôi là lan tỏa giá trị tự nhiên, bảo vệ sức khỏe cộng đồng và phát triển bền vững cùng đối tác, khách hàng.
            </p>
          </div>
          <div className="intro-about-img-wrap">
            <img src="./images/honey1.jpg" alt="Về chúng tôi" className="intro-about-img" />
          </div>
        </div>
      </section>
    </main>
  );
}

export default Introduct; 