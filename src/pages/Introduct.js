import React, { useRef, useEffect, useState } from 'react';
import './Introduct.css';

// Custom hook to detect when an element is on screen
const useOnScreen = (options) => {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.unobserve(entry.target);
            }
        }, options);

        const currentRef = ref.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [ref, options]);

    return [ref, isVisible];
};


const HeroSection = () => {
    const bannerImages = [
      './images/slider-01.jpg',
      './images/slider-02.jpg',
      './images/slider-03.jpg',
      './images/wallpaperflare-com-wallpaper-1.jpg',
    ];
    const [currentBanner, setCurrentBanner] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentBanner((prev) => (prev + 1) % bannerImages.length);
        }, 5000);
        return () => clearInterval(timer);
  }, []);

  return (
        <section className="intro-hero-section">
            {bannerImages.map((img, index) => (
                <div
                    key={index}
                    className={`intro-hero-bg ${currentBanner === index ? 'active' : ''}`}
                    style={{ backgroundImage: `url(${img})` }}
                />
            ))}
            <div className="intro-hero-overlay" />
            <div className="intro-hero-content">
                <h1 className="intro-hero-title">Quý Honey Bee</h1>
                <p className="intro-hero-subtitle">Chất lượng - Uy tín - Đẳng cấp</p>
        </div>
      </section>
    );
};

const HoneycombSection = () => {
    const [ref, isVisible] = useOnScreen({ threshold: 0.2 });

    const values = [
        {
            icon: 'https://cdn-icons-png.flaticon.com/512/2991/2991127.png',
            title: '100% Nguyên Chất',
            description: 'Cam kết mật ong tinh khiết, không pha trộn, giữ trọn hương vị và dưỡng chất từ thiên nhiên.'
        },
        {
            icon: 'https://cdn-icons-png.flaticon.com/512/3063/3063824.png',
            title: 'Nguồn Gốc Rõ Ràng',
            description: 'Từng giọt mật đều có thể truy xuất nguồn gốc, từ những trang trại ong đạt chuẩn VietGAP.'
        },
        {
            icon: 'https://cdn-icons-png.flaticon.com/512/994/994537.png',
            title: 'Phát Triển Bền Vững',
            description: 'Hỗ trợ cộng đồng nuôi ong địa phương, bảo vệ hệ sinh thái và phát triển kinh tế bền vững.'
        }
    ];

    return (
        <section ref={ref} className={`intro-section honeycomb-section ${isVisible ? 'is-visible' : ''}`}>
             <div className="intro-section-header">
                <h2>Giá Trị Cốt Lõi</h2>
                <img src="./images/divider.png" alt="divider" className="intro-divider"/>
            </div>
            <div className="honeycomb-grid">
                {values.map((item, index) => (
                    <div key={index} className="honeycomb-cell" style={{ transitionDelay: `${index * 0.2}s` }}>
                        <div className="honeycomb-cell-inner">
                            <img src={item.icon} alt={item.title} className="honeycomb-icon" />
                            <h4>{item.title}</h4>
                            <p>{item.description}</p>
                        </div>
          </div>
                ))}
            </div>
        </section>
    );
};

const TimelineItem = ({ event, index }) => {
    const [ref, isVisible] = useOnScreen({ threshold: 0.5 });
    return (
        <div ref={ref} className={`timeline-item ${isVisible ? 'is-visible' : ''}`}>
            <div className="timeline-dot"></div>
            <div className="timeline-content">
                <div className="timeline-year">{event.year}</div>
                <div className="timeline-title-wrapper">
                    <img src={event.icon} alt="" className="timeline-icon" />
                    <h3>{event.title}</h3>
          </div>
                <p>{event.description}</p>
          </div>
        </div>
    );
};

const TimelineSection = () => {
     const timelineEvents = [
        { year: '2003', icon: 'https://cdn-icons-png.flaticon.com/512/2942/2942100.png', title: 'Khởi đầu đam mê', description: 'Thành lập Quý Honey Bee với trang trại nhỏ, mang khát vọng đưa mật ong Việt chất lượng đến mọi nhà.' },
        { year: '2010', icon: 'https://cdn-icons-png.flaticon.com/512/3409/3409441.png', title: 'Mở rộng quy mô', description: 'Áp dụng quy trình nuôi ong tiên tiến, mở rộng trang trại và đạt chứng nhận chất lượng VietGAP.' },
        { year: '2018', icon: 'https://cdn-icons-png.flaticon.com/512/167/167522.png', title: 'Dấu ấn đặc biệt', description: 'Ra mắt dòng sản phẩm mật ong hoa rừng cao cấp, nhanh chóng chiếm được lòng tin của người tiêu dùng.' },
        { year: '2023', icon: 'https://cdn-icons-png.flaticon.com/512/2932/2932448.png', title: 'Vươn ra thế giới', description: 'Trở thành thương hiệu mật ong uy tín hàng đầu, bắt đầu hành trình xuất khẩu sang thị trường châu Á.' }
    ];

    return (
        <section className="timeline-section" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/wallpaperflare-com-wallpaper-9.jpg)` }}>
            <div className="intro-section-content-wrapper">
                <div className="intro-section-header">
                    <h2>Hành Trình Của Chúng Tôi</h2>
                     <img src="./images/divider.png" alt="divider" className="intro-divider"/>
          </div>
                <div className="timeline-container">
                    {timelineEvents.map((event, index) => {
                        return (
                            <TimelineItem key={index} event={event} index={index} />
                        )
                    })}
          </div>
        </div>
      </section>
    );
}

const ProcessSection = ({setCurrentPage}) => {
    const [ref, isVisible] = useOnScreen({ threshold: 0.2 });

    const processSteps = [
        { icon: 'https://cdn-icons-png.flaticon.com/512/2821/2821637.png', title: 'Thu Hoạch' },
        { icon: 'https://cdn-icons-png.flaticon.com/512/3767/3767194.png', title: 'Chiết Xuất' },
        { icon: 'https://cdn-icons-png.flaticon.com/512/1163/1163728.png', title: 'Kiểm Định' },
        { icon: 'https://cdn-icons-png.flaticon.com/512/3081/3081822.png', title: 'Đóng Gói' }
    ];

    return (
        <section ref={ref} className={`intro-section process-section ${isVisible ? 'is-visible' : ''}`}>
            <div className="intro-section-header">
                <h2>Quy Trình Tạo Ra Giọt Mật Vàng</h2>
                <img src="./images/divider.png" alt="divider" className="intro-divider"/>
            </div>
            <div className="process-steps">
                {processSteps.map((step, index) => (
                    <div key={index} className="process-step" style={{ transitionDelay: `${index * 0.2}s` }}>
                        <div className="process-icon-wrapper">
                            <img src={step.icon} alt={step.title} />
                        </div>
                        <h4>{step.title}</h4>
                    </div>
                ))}
            </div>
        </section>
    );
};

const CtaSection = ({setCurrentPage}) => {
    const [ref, isVisible] = useOnScreen({ threshold: 0.5 });

    return (
        <section ref={ref} className={`intro-cta-section ${isVisible ? 'is-visible' : ''}`} style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/slider_1.jpg)` }}>
            <div className="intro-cta-overlay"></div>
            <div className="intro-cta-content">
                <h2>Bạn đã sẵn sàng trải nghiệm sự tinh tuý từ thiên nhiên?</h2>
                <button className="intro-cta-button" onClick={() => setCurrentPage('products')}>Khám Phá Sản Phẩm Ngay</button>
            </div>
        </section>
    );
}

function Introduct({setCurrentPage}) {
  return (
    <main className="introduct-page">
      <HeroSection />
      <HoneycombSection />
      <TimelineSection />
      <ProcessSection />
      <CtaSection setCurrentPage={setCurrentPage}/>
    </main>
  );
}

export default Introduct; 