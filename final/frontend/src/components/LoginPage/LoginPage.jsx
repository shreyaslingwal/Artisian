import React, { useState, useEffect } from 'react';
import { Phone } from 'lucide-react';
import '../../styles/components/LoginPage.css';
import { sendOtp, verifyOtp } from '../../services/authService';

const EnhancedLoginPage = ({ onLogin }) => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      const phoneInput = document.getElementById('phoneInput');
      if (phoneInput) phoneInput.focus();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const formatPhoneNumber = (value) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 10) {
      return digits.replace(/(\d{5})(\d{5})/, '$1 $2');
    }
    return digits.slice(0, 10).replace(/(\d{5})(\d{5})/, '$1 $2');
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
    setError('');

    const container = document.getElementById('phoneContainer');
    const cleanPhone = formatted.replace(/\s/g, '');
    
    if (cleanPhone.length === 10) {
      container.style.borderColor = 'rgba(76, 175, 80, 0.6)';
    } else if (cleanPhone.length > 0) {
      container.style.borderColor = 'rgba(255, 152, 0, 0.6)';
    } else {
      container.style.borderColor = '';
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
    setError('');
  };

  const handleGenerateOtp = async () => {
    if (phone.replace(/\s/g, '').length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      const container = document.getElementById('phoneContainer');
      container.style.animation = 'shake 0.5s ease-in-out';
      setTimeout(() => {
        container.style.animation = '';
      }, 500);
      return;
    }

    setLoading(true);
    setError('');

    const button = document.getElementById('otpButton');
    button.style.transform = 'translateY(-4px) scale(1.02)';

    try {
      const fullPhone = '+91' + phone.replace(/\s/g, '');
      const data = await sendOtp(fullPhone);

      if (data.message === 'OTP sent successfully') {
        setIsOtpSent(true);
        setError('');
      } else {
        setError(data.message || 'Failed to send OTP. Please try again.');
      }
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
      button.style.transform = '';
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const fullPhone = '+91' + phone.replace(/\s/g, '');
      const data = await verifyOtp(fullPhone, otp);

      if (data.token) {
        // Pass only the user object to onLogin; token & user already saved in localStorage
        onLogin(data.user);
      } else {
        setError(data.message || 'Failed to verify OTP. Please try again.');
      }
    } catch (err) {
      setError('Failed to verify OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setOtp('');
    setIsOtpSent(false);
    await handleGenerateOtp();
  };

  const handlePhoneInputFocus = () => {
    const container = document.getElementById('phoneContainer');
    container.classList.add('focused');
  };

  const handlePhoneInputBlur = () => {
    const container = document.getElementById('phoneContainer');
    container.classList.remove('focused');
  };

  return (
    <>
      <div className="background-image"></div>
      <div className="background-shapes">
        <div className="shape"></div>
        <div className="shape"></div>
        <div className="shape"></div>
        <div className="shape"></div>
        <div className="shape"></div>
      </div>
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>

      <div className="enhanced-login-container">
        <div className="enhanced-login-card">
          <div className="enhanced-icon-container">
            <Phone className="enhanced-phone-icon" />
          </div>

          <h1 className="enhanced-login-title">
            {isOtpSent ? 'Verify OTP' : 'Login with Phone'}
          </h1>
          <p className="enhanced-login-subtitle">
            {isOtpSent 
              ? `Enter the OTP sent to +91 ${phone}`
              : 'Enter your phone number to get started with ArtisanHub'
            }
          </p>

          {!isOtpSent ? (
            <div className="enhanced-form-group">
              <label className="enhanced-form-label">Phone Number</label>
              <div 
                className="enhanced-phone-input-container" 
                id="phoneContainer"
              >
                <span className="enhanced-country-code">+91</span>
                <input 
                  type="tel" 
                  className="enhanced-phone-input" 
                  id="phoneInput"
                  value={phone}
                  onChange={handlePhoneChange}
                  onFocus={handlePhoneInputFocus}
                  onBlur={handlePhoneInputBlur}
                  placeholder="XXXXX XXXXX"
                  maxLength="11"
                  required
                />
              </div>

              {error && (
                <div className="enhanced-error-message">
                  {error}
                </div>
              )}

              <button
                type="button"
                className="enhanced-otp-button"
                id="otpButton"
                onClick={handleGenerateOtp}
                disabled={loading || phone.replace(/\s/g, '').length !== 10}
              >
                <span id="buttonText">
                  {loading ? (
                    <div className="enhanced-loading-content">
                      <div className="enhanced-spinner"></div>
                      Generating...
                    </div>
                  ) : (
                    'Generate OTP'
                  )}
                </span>
              </button>
            </div>
          ) : (
            <div className="enhanced-form-group">
              <label className="enhanced-form-label">Enter OTP</label>
              <input
                type="text"
                value={otp}
                onChange={handleOtpChange}
                placeholder="123456"
                className="enhanced-otp-input"
                maxLength="6"
              />

              {error && (
                <div className={`enhanced-message ${error.includes('Demo') ? 'demo-message' : 'enhanced-error-message'}`}>
                  {error}
                </div>
              )}

              <button
                type="button"
                className="enhanced-otp-button"
                onClick={handleVerifyOtp}
                disabled={loading || otp.length !== 6}
              >
                {loading ? (
                  <div className="enhanced-loading-content">
                    <div className="enhanced-spinner"></div>
                    Verifying...
                  </div>
                ) : (
                  'Verify OTP'
                )}
              </button>

              <div className="enhanced-resend-section">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={loading}
                  className="enhanced-resend-button"
                >
                  Resend OTP
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EnhancedLoginPage;