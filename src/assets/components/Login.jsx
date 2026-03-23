import { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../css/Login.css';

const Login = ({ open, onClose, onLogin }) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('email');
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [keepMeSignedIn, setKeepMeSignedIn] = useState(false);

  const [hasPassword, setHasPassword] = useState(false);

  // Forgot password states
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotPassword, setForgotPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');

  if (!open) return null;

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Check if user already has a password
    const res = await fetch('/api/check-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      if (data.hasPassword) {
        setHasPassword(true);
        setStep('login');
        toast.info('Please login with your password.');
      } else {
        setHasPassword(false);
        setLoading(true);
        const otpRes = await fetch('/api/send-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        const otpData = await otpRes.json();
        setLoading(false);
        if (otpRes.ok) {
          toast.success('OTP sent to your email. Please check your inbox.');
          setStep('otp');
        } else {
          toast.error(otpData.message || 'Email not found or error sending OTP.');
        }
      }
    } else {
      toast.error(data.message || 'Error checking user.');
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp })
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      setStep('password');
    } else {
      toast.error(data.message || 'Invalid or expired OTP.');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    setLoading(true);
    const res = await fetch('/api/set-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      toast.success('Password set successfully. Please log in.');
      setStep('login');
      setLoginPassword('');
    } else {
      toast.error(data.message || 'Error setting password.');
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password: loginPassword, keepMeSignedIn })
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      toast.success('Logged in successfully!');
      onLogin(email, loginPassword, keepMeSignedIn,data.profileImageUrl);
    } else {
      toast.error(data.message || 'Invalid email or password.');
    }
  };

  // --- Forgot Password Handlers ---
  const handleForgotPasswordClick = () => {
    setForgotEmail('');
    setForgotOtp('');
    setForgotPassword('');
    setForgotConfirmPassword('');
    setStep('forgot-email');
  };

  const handleForgotEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const otpRes = await fetch('/api/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: forgotEmail })
    });
    const otpData = await otpRes.json();
    setLoading(false);
    if (otpRes.ok) {
      toast.success('OTP sent to your email. Please check your inbox.');
      setStep('forgot-otp');
    } else {
      toast.error(otpData.message || 'Email not found or error sending OTP.');
    }
  };

  const handleForgotOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: forgotEmail, otp: forgotOtp })
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      setStep('forgot-password');
    } else {
      toast.error(data.message || 'Invalid or expired OTP.');
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    if (forgotPassword.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }
    if (forgotPassword !== forgotConfirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    setLoading(true);
    const res = await fetch('/api/set-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: forgotEmail, password: forgotPassword })
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      toast.success('Password reset successfully. Please log in.');
      setStep('login');
      setEmail(forgotEmail);
      setLoginPassword('');
    } else {
      toast.error(data.message || 'Error resetting password.');
    }
  };

  // --- Back to Login from Forgot Password ---
  const handleBackToLogin = () => {
    setStep('login');
    setForgotEmail('');
    setForgotOtp('');
    setForgotPassword('');
    setForgotConfirmPassword('');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>&times;</button>
        <h2 style={{ color: "#04145f", textAlign: "center" }}>
          {step === 'email' && 'Email Verification'}
          {step === 'otp' && 'Enter OTP'}
          {step === 'password' && 'Create Password'}
          {step === 'login' && 'Login'}
          {step === 'forgot-email' && 'Forgot Password'}
          {step === 'forgot-otp' && 'Enter OTP'}
          {step === 'forgot-password' && 'Reset Password'}
        </h2>
        {/* Normal flow */}
        {step === 'email' && (
          <form onSubmit={handleEmailSubmit}>
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
              autoFocus
            />
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Checking...' : 'Continue'}
            </button>
          </form>
        )}
        {step === 'otp' && !hasPassword && (
          <form onSubmit={handleOtpSubmit}>
            <label htmlFor="login-otp">OTP</label>
            <input
              id="login-otp"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              required
              value={otp}
              onChange={e => setOtp(e.target.value)}
              placeholder="Enter the OTP"
              autoFocus
            />
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify'}
            </button>
          </form>
        )}
        {step === 'password' && !hasPassword && (
          <form onSubmit={handlePasswordSubmit}>
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Create a password"
              autoFocus
            />
            <label htmlFor="login-confirm-password">Confirm Password</label>
            <input
              id="login-confirm-password"
              type="password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
            />
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Saving...' : 'Set Password'}
            </button>
          </form>
        )}
        {/* Login step with Forgot Password link */}
        {step === 'login' && (
          <form onSubmit={handleLoginSubmit}>
            <label htmlFor="login-email-login">Email</label>
            <input
              id="login-email-login"
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
              autoFocus
            />
            <label htmlFor="login-password-login">Password</label>
            <input
              id="login-password-login"
              type="password"
              required
              minLength={6}
              value={loginPassword}
              onChange={e => setLoginPassword(e.target.value)}
              placeholder="Enter your password"
            />
            <div className="checkbox-row" style={{ margin: "10px 0" }}>
              <input
                id="keep-me-signed-in"
                type="checkbox"
                checked={keepMeSignedIn}
                onChange={e => setKeepMeSignedIn(e.target.checked)}
              />
              <label htmlFor="keep-me-signed-in" style={{ marginLeft: "8px" }}>
                Keep me signed in
              </label>
            </div>
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
            <div style={{ textAlign: "right", marginTop: "10px" }}>
              <button
                type="button"
                className="forgot-password-link"
                style={{
                  background: "none",
                  border: "none",
                  color: "#04145f",
                  textDecoration: "underline",
                  cursor: "pointer",
                  fontSize: "0.95em"
                }}
                onClick={handleForgotPasswordClick}
                disabled={loading}
              >
                Forgot Password?
              </button>
            </div>
          </form>
        )}
        {/* Forgot password steps */}
        {step === 'forgot-email' && (
          <form onSubmit={handleForgotEmailSubmit}>
            <label htmlFor="forgot-email">Email</label>
            <input
              id="forgot-email"
              type="email"
              required
              value={forgotEmail}
              onChange={e => setForgotEmail(e.target.value)}
              placeholder="Enter your email"
              autoFocus
            />
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
            <div style={{ textAlign: "right", marginTop: "10px" }}>
              <button
                type="button"
                className="back-to-login-link"
                style={{
                  background: "none",
                  border: "none",
                  color: "#04145f",
                  textDecoration: "underline",
                  cursor: "pointer",
                  fontSize: "0.95em"
                }}
                onClick={handleBackToLogin}
                disabled={loading}
              >
                Back to Login
              </button>
            </div>
          </form>
        )}
        {step === 'forgot-otp' && (
          <form onSubmit={handleForgotOtpSubmit}>
            <label htmlFor="forgot-otp">OTP</label>
            <input
              id="forgot-otp"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              required
              value={forgotOtp}
              onChange={e => setForgotOtp(e.target.value)}
              placeholder="Enter the OTP"
              autoFocus
            />
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify'}
            </button>
            <div style={{ textAlign: "right", marginTop: "10px" }}>
              <button
                type="button"
                className="back-to-login-link"
                style={{
                  background: "none",
                  border: "none",
                  color: "#04145f",
                  textDecoration: "underline",
                  cursor: "pointer",
                  fontSize: "0.95em"
                }}
                onClick={handleBackToLogin}
                disabled={loading}
              >
                Back to Login
              </button>
            </div>
          </form>
        )}
        {step === 'forgot-password' && (
          <form onSubmit={handleForgotPasswordSubmit}>
            <label htmlFor="forgot-password">New Password</label>
            <input
              id="forgot-password"
              type="password"
              required
              minLength={6}
              value={forgotPassword}
              onChange={e => setForgotPassword(e.target.value)}
              placeholder="Create a new password"
              autoFocus
            />
            <label htmlFor="forgot-confirm-password">Confirm New Password</label>
            <input
              id="forgot-confirm-password"
              type="password"
              required
              minLength={6}
              value={forgotConfirmPassword}
              onChange={e => setForgotConfirmPassword(e.target.value)}
              placeholder="Confirm your new password"
            />
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Saving...' : 'Reset Password'}
            </button>
            <div style={{ textAlign: "right", marginTop: "10px" }}>
              <button
                type="button"
                className="back-to-login-link"
                style={{
                  background: "none",
                  border: "none",
                  color: "#04145f",
                  textDecoration: "underline",
                  cursor: "pointer",
                  fontSize: "0.95em"
                }}
                onClick={handleBackToLogin}
                disabled={loading}
              >
                Back to Login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
