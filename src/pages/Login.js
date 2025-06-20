import React, { useState } from 'react';
import './Login.css';
import { useAuth } from '../context/AuthContext';

function Login({ setCurrentPage }) {
  const [showRecoverForm, setShowRecoverForm] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState('');

  const validateEmail = (email) => /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!validateEmail(formData.email)) {
      setError('Email không hợp lệ!');
      return;
    }
    const result = await login(formData.email, formData.password);
    if (result.success) {
      setSuccess('Chúc mừng đăng nhập thành công!');
      setTimeout(() => {
        setCurrentPage('profile');
      }, 1500);
    } else {
      setError(result.error);
    }
  };

  const showRecoverPasswordForm = () => {
    setShowRecoverForm(true);
  };

  const hideRecoverPasswordForm = () => {
    setShowRecoverForm(false);
  };

  return (
    <main className="wrapperMain_content">
        <nav className="bread-crumb clearfix">
            <div className="container">
                <ul className="breadcrumb">
                    <li className="home">
                        <a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('home'); }}>
                            <span>Trang chủ</span>
                        </a>
                        <span className="mr_lr">&nbsp;/&nbsp;</span>
                    </li>
                    <li><strong><span>Đăng nhập tài khoản</span></strong></li>
                </ul>
            </div>
        </nav>
        <section className="section wrap_background">
            <div className="container">
                <div className="wrap_background_aside page_login">
                    <div className="row">
                        <div className="col-12 col-md-6 offset-md-3 col-lg-4 offset-lg-4">
                            <div className="page-login">
                                <div id="login" style={{ display: showRecoverForm ? 'none' : 'block' }}>
                                    <h1>
                                        Đăng nhập
                                    </h1>
                                    <p className="des">
                                        Nếu bạn có một tài khoản, xin vui lòng đăng nhập
                                    </p>
                                    {error && <div className="form-signup margin-bottom-15" style={{ color: 'red' }}>
                                        {error}
                                    </div>}
                                    {success && <div className="form-signup margin-bottom-15" style={{ color: 'green' }}>
                                        {success}
                                    </div>}
                                    <form onSubmit={handleSubmit}>
                                        <div className="form-signup clearfix">
                                            <fieldset className="form-group">
                                                <label>Email <span className="required">*</span></label>
                                                <input 
                                                    type="email" 
                                                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,63}$"
                                                    className="form-control form-control-lg" 
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    placeholder="Email" 
                                                    required
                                                />
                                            </fieldset>
                                            <fieldset className="form-group">
                                                <label>Mật khẩu <span className="required">*</span> </label>
                                                <input 
                                                    type={showPassword ? 'text' : 'password'} 
                                                    className="form-control form-control-lg" 
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
                                            </fieldset>
                                            <div className="pull-xs-left button_bottom a-center">
                                                <button className="btn btn-style btn_50 btn-login" type="submit">
                                                    Đăng nhập
                                                </button>
                                                <p style={{ fontSize: '13px' }}>Bạn chưa có tài khoản 
                                                    <a href="#" 
                                                        onClick={(e) => { e.preventDefault(); setCurrentPage('register'); }}
                                                        className="btn-link-style btn-register"
                                                        style={{ textDecoration: 'underline', color: 'red' }}
                                                    >
                                                        Đăng ký tại đây
                                                    </a>
                                                </p>
                                                <p style={{ fontSize: '13px' }}>Bạn quên mật khẩu 
                                                    <a href="#"
                                                        className="btn-link-style" 
                                                        style={{ marginRight: '30px', color: 'red' }}
                                                        onClick={(e) => { e.preventDefault(); showRecoverPasswordForm(); }}
                                                    >
                                                        Lấy lại tại đây
                                                    </a>
                                                </p>
                                            </div>
                                        </div>
                                    </form>
                                </div>

                                <div id="recover-password" style={{ display: showRecoverForm ? 'block' : 'none' }} className="form-signup page-login">
                                    <h2>
                                        Đặt lại mật khẩu
                                    </h2>
                                    <p>
                                        Chúng tôi sẽ gửi cho bạn một email để kích hoạt việc đặt lại mật khẩu.
                                    </p>
                                    <form method="post" action="/account/recover" id="recover_customer_password"
                                        acceptCharset="UTF-8">
                                        <input name="FormType" type="hidden" value="recover_customer_password" />
                                        <input name="utf8" type="hidden" value="true" />
                                        <div className="form-signup" style={{ color: 'red' }}>
                                        </div>
                                        <div className="form-signup clearfix">
                                            <fieldset className="form-group">
                                                <input type="email" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,63}$"
                                                    className="form-control form-control-lg" value="" name="Email"
                                                    id="recover-email" placeholder="Email" required/>
                                            </fieldset>
                                        </div>
                                        <div className="action_bottom">
                                            <input className="btn btn-style btn-primary btn-recover btn_50" type="submit"
                                                value="Gửi" />
                                            <a href="#" className="btn btn-style btn-style-active"
                                                onClick={(e) => { e.preventDefault(); hideRecoverPasswordForm(); }}>Hủy</a>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <div className="block social-login--facebooks margin-top-20">
                                <p className="a-center">
                                    Hoặc đăng nhập bằng
                                </p>
                                <a href="javascript:void(0)" className="social-login--facebook"
                                    onClick={() => window.location.href = 'https://www.facebook.com/v3.2/dialog/oauth?client_id=947410958642584&redirect_uri=https://store.mysapo.net/account/facebook_account_callback&state=' + encodeURIComponent(JSON.stringify({ redirect_url: window.location.href })) + '&scope=email&response_type=code'}>
                                    <img width="129" height="37" style={{marginRight: '3px'}}   
                                        alt="facebook-login-button"
                                        src="//bizweb.dktcdn.net/assets/admin/images/login/fb-btn.svg"/>
                                </a>
                                <a href="javascript:void(0)" className="social-login--google" 
                                    onClick={() => window.location.href = 'https://accounts.google.com/o/oauth2/v2/auth?client_id=997675985899-pu3vhvc2rngfcuqgh5ddgt7mpibgrasr.apps.googleusercontent.com&redirect_uri=https://store.mysapo.net/account/google_account_callback&scope=email%20profile%20https://www.googleapis.com/auth/userinfo.email%20https://www.googleapis.com/auth/userinfo.profile&access_type=online&state=' + encodeURIComponent(JSON.stringify({ redirect_url: window.location.href })) + '&response_type=code'}>
                                    <img width="129" height="37" style={{marginRight: '3px'}}
                                        alt="google-login-button"
                                        src="//bizweb.dktcdn.net/assets/admin/images/login/gp-btn.svg"/>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>
  );
}

export default Login; 