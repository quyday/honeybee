import React, { useState } from 'react';
import './Register.css';
import { useAuth } from '../context/AuthContext';

function Register({ setCurrentPage }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    avatar: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateEmail = (email) => /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
  const validatePassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(password);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'avatar' && files && files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(files[0]);
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!validateEmail(formData.email)) {
      setError('Email không hợp lệ!');
      return;
    }
    if (!validatePassword(formData.password)) {
      setError('Mật khẩu phải tối thiểu 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt!');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu nhập lại không khớp!');
      return;
    }
    const result = await register({
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      password: formData.password,
      phone: formData.phone
    });
    if (result.success) {
      setSuccess('Chúc mừng bạn đăng kí thành công!');
      setTimeout(() => {
        setCurrentPage('login');
      }, 1500);
    } else {
      setError(result.error);
    }
  };

  return (
    <main className="register-wrapperMain_content">
        <nav className="register-bread-crumb clearfix">
            <div className="register-container">
                <ul className="register-breadcrumb">
                    <li className="register-home">
                        <a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('home'); }}>
                            <span>Trang chủ</span>
                        </a>
                        <span className="register-mr_lr">&nbsp;/&nbsp;</span>
                    </li>
                    <li><strong><span>Đăng ký tài khoản</span></strong></li>
                </ul>
            </div>
        </nav>
        <section className="register-section wrap_background">
            <div className="register-container">
                <div className="register-wrap_background_aside page_login">
                    <div className="register-row">
                        <div className="register-col-12 register-col-md-6 register-offset-md-3 register-col-lg-4 register-offset-lg-4">
                            <div className="register-page-login">
                                <div id="register">
                                    <h1>
                                        Thông tin cá nhân
                                    </h1>
                                    {error && <div className="register-form-signup" style={{color: 'red'}}>
                                        {error}
                                    </div>}
                                    {success && <div className="register-form-signup" style={{color: 'green'}}>
                                        {success}
                                    </div>}
                                    <form onSubmit={handleSubmit}>
                                        <div className="register-form-signup clearfix">
                                            <div className="register-row">
                                                <div className="register-col-md-12 register-col-lg-12 register-col-sm-12 register-col-xs-12">
                                                    <fieldset className="register-form-group">
                                                        <label>Họ <span className="register-required">*</span></label>
                                                        <input 
                                                            type="text" 
                                                            className="register-form-control register-form-control-lg" 
                                                            name="lastName"
                                                            value={formData.lastName}
                                                            onChange={handleChange}
                                                            placeholder="Họ" 
                                                            required
                                                        />
                                                    </fieldset>
                                                </div>
                                                <div className="register-col-md-12">
                                                    <fieldset className="register-form-group">
                                                        <label>Tên <span className="register-required">*</span></label>
                                                        <input 
                                                            type="text" 
                                                            className="register-form-control register-form-control-lg" 
                                                            name="firstName"
                                                            value={formData.firstName}
                                                            onChange={handleChange}
                                                            placeholder="Tên" 
                                                            required
                                                        />
                                                    </fieldset>
                                                </div>
                                                <div className="register-col-md-12 register-col-lg-12 register-col-sm-12 register-col-xs-12">
                                                    <fieldset className="register-form-group">
                                                        <label>Số điện thoại <span className="register-required">*</span></label>
                                                        <input 
                                                            placeholder="Số điện thoại" 
                                                            type="text" 
                                                            pattern="\d+"
                                                            className="register-form-control register-form-control-comment register-form-control-lg"
                                                            name="phone"
                                                            value={formData.phone}
                                                            onChange={handleChange}
                                                            required
                                                        />
                                                    </fieldset>
                                                </div>
                                            </div>
                                            <div className="register-row">
                                                <div className="register-col-md-12 register-col-lg-12 register-col-sm-12 register-col-xs-12">
                                                    <fieldset className="register-form-group">
                                                        <label>Email <span className="register-required">*</span></label>
                                                        <input 
                                                            type="email"
                                                            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,63}$"
                                                            className="register-form-control register-form-control-lg" 
                                                            name="email"
                                                            value={formData.email}
                                                            onChange={handleChange}
                                                            placeholder="Email" 
                                                            required
                                                        />
                                                    </fieldset>
                                                </div>
                                                <div className="register-col-md-12 register-col-lg-12 register-col-sm-12 register-col-xs-12">
                                                    <fieldset className="register-form-group">
                                                        <label>Mật khẩu <span className="register-required">*</span> </label>
                                                        <div style={{ position: 'relative' }}>
                                                            <input 
                                                                type={showPassword ? 'text' : 'password'}
                                                                className="register-form-control register-form-control-lg"
                                                                name="password"
                                                                value={formData.password}
                                                                onChange={handleChange}
                                                                placeholder="Mật khẩu" 
                                                                required
                                                                style={{ paddingRight: '40px' }}
                                                            />
                                                            <span
                                                                onClick={() => setShowPassword(!showPassword)}
                                                                style={{
                                                                    position: 'absolute',
                                                                    right: '10px',
                                                                    top: '50%',
                                                                    transform: 'translateY(-50%)',
                                                                    cursor: 'pointer',
                                                                    fontSize: '18px',
                                                                    color: '#888'
                                                                }}
                                                            >
                                                                {showPassword ? '👁️' : '🙈'}
                                                            </span>
                                                        </div>
                                                    </fieldset>
                                                </div>
                                                <div className="register-col-md-12 register-col-lg-12 register-col-sm-12 register-col-xs-12">
                                                    <fieldset className="register-form-group">
                                                        <label>Nhập lại mật khẩu <span className="register-required">*</span> </label>
                                                        <div style={{ position: 'relative' }}>
                                                            <input 
                                                                type={showConfirmPassword ? 'text' : 'password'}
                                                                className="register-form-control register-form-control-lg"
                                                                name="confirmPassword"
                                                                value={formData.confirmPassword}
                                                                onChange={handleChange}
                                                                placeholder="Nhập lại mật khẩu" 
                                                                required
                                                                style={{ paddingRight: '40px' }}
                                                            />
                                                            <span
                                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                                style={{
                                                                    position: 'absolute',
                                                                    right: '10px',
                                                                    top: '50%',
                                                                    transform: 'translateY(-50%)',
                                                                    cursor: 'pointer',
                                                                    fontSize: '18px',
                                                                    color: '#888'
                                                                }}
                                                            >
                                                                {showConfirmPassword ? '👁️' : '🙈'}
                                                            </span>
                                                        </div>
                                                    </fieldset>
                                                </div>
                                            </div>
                                            <div className="register-row">
                                                <div className="register-col-md-12 register-col-lg-12 register-col-sm-12 register-col-xs-12">
                                                    <fieldset className="register-form-group">
                                                        <label>Ảnh đại diện (không bắt buộc)</label>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 32, margin: '16px 0' }}>
                                                            <div style={{
                                                                width: 150,
                                                                height: 150,
                                                                border: '2px dashed #6c63ff',
                                                                borderRadius: 16,
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                overflow: 'hidden',
                                                                background: '#f4f6fb',
                                                                boxShadow: '0 2px 8px rgba(108,99,255,0.08)',
                                                                transition: 'box-shadow 0.2s',
                                                                cursor: 'pointer',
                                                                position: 'relative',
                                                            }}
                                                                onMouseOver={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(108,99,255,0.18)'}
                                                                onMouseOut={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(108,99,255,0.08)'}
                                                            >
                                                                {formData.avatar ? (
                                                                    <img src={formData.avatar} alt="avatar preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                                ) : (
                                                                    <span style={{ color: '#bbb', fontSize: 16, textAlign: 'center' }}>Chưa có ảnh</span>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <input
                                                                    id="avatar-upload"
                                                                    type="file"
                                                                    name="avatar"
                                                                    accept="image/*"
                                                                    onChange={handleChange}
                                                                    style={{ display: 'none' }}
                                                                />
                                                                <label htmlFor="avatar-upload" style={{
                                                                    display: 'inline-block',
                                                                    padding: '12px 28px',
                                                                    background: 'linear-gradient(90deg, #6c63ff 0%, #48c6ef 100%)',
                                                                    color: '#fff',
                                                                    borderRadius: 24,
                                                                    fontWeight: 600,
                                                                    fontSize: 16,
                                                                    cursor: 'pointer',
                                                                    boxShadow: '0 2px 8px rgba(108,99,255,0.10)',
                                                                    border: 'none',
                                                                    transition: 'background 0.2s, box-shadow 0.2s',
                                                                }}
                                                                    onMouseOver={e => e.currentTarget.style.background = 'linear-gradient(90deg, #48c6ef 0%, #6c63ff 100%)'}
                                                                    onMouseOut={e => e.currentTarget.style.background = 'linear-gradient(90deg, #6c63ff 0%, #48c6ef 100%)'}
                                                                >
                                                                    Chọn ảnh
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </fieldset>
                                                </div>
                                            </div>
                                            <div className="register-section register-margin-top-10 register-button_bottom">
                                                <button 
                                                    type="submit"
                                                    className="register-btn register-btn-style register-btn_50 register-btn_register"
                                                >
                                                    Đăng ký
                                                </button>
                                                <span className="register-or">Bạn đã có tài khoản? Đăng nhập
                                                    <a href="#" 
                                                        onClick={(e) => { e.preventDefault(); setCurrentPage('login'); }}
                                                        style={{textDecoration: 'underline'}}
                                                        className="register-btn-link-style register-btn-style register-margin-right-0"
                                                    >
                                                        tại đây
                                                    </a>
                                                </span>
                                            </div>
                                        </div>
                                    </form>
                                    <div className="register-block register-social-login--facebooks">
                                        <p className="register-a-center">
                                            Hoặc đăng nhập bằng
                                        </p>
                                        <a href="javascript:void(0)" className="register-social-login--facebook"
                                            onClick={() => window.loginFacebook()}>
                                            <img width="129px" height="37px"
                                                alt="facebook-login-button"
                                                src="//bizweb.dktcdn.net/assets/admin/images/login/fb-btn.svg"/>
                                        </a>
                                        <a href="javascript:void(0)" className="register-social-login--google"
                                            onClick={() => window.loginGoogle()}>
                                            <img width="129px" height="37px"
                                                alt="google-login-button"
                                                src="//bizweb.dktcdn.net/assets/admin/images/login/gp-btn.svg"/>
                                        </a>
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

export default Register; 