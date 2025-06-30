import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import './css/login.css';

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const loginRes = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const loginData = await loginRes.json();
      if (loginData.success) {
        localStorage.setItem('token', loginData.authtoken);

        const userRes = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/getUser`, {
          headers: {
            'Content-Type': 'application/json',
            'auth-token': loginData.authtoken,
          },
        });

        const userData = await userRes.json();
        localStorage.setItem('role', userData.role);

        const role = userData.role;
        navigate(role === 'owner' ? '/owner' : role === 'renter' ? '/user' : '/');
        setTimeout(() => {
          window.location.href = '/';
        }, 100);
      } else {
        alert('Login Failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      alert('Something went wrong');
    }
  };

  const handleToggle = () => {
    setShowPassword(!showPassword);
  };

  const sendOtp = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok) {
        alert('OTP sent to your email');
        setStep(2);
      } else {
        alert(data.error || 'Error sending OTP');
      }
    } catch (err) {
      alert('Error sending OTP');
    }
  };

  const verifyOtp = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });

      if (res.ok) setStep(3);
      else alert('Invalid OTP');
    } catch (err) {
      alert('Error verifying OTP');
    }
  };

  const resetPassword = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({email, newPassword })
      });

      const data = await res.json();
      if (res.ok) {
        alert('Password updated!');
        setShowForgotModal(false);
        setStep(1);
        navigate('/login');
      } else {
        alert(data.error || 'Failed to reset password');
      }
    } catch (err) {
      alert('Error resetting password');
    }
  };

  return (
    <div id='login'>
      <form className='loginForm' onSubmit={handleSubmit}>
      <h2>Login</h2>
      <FontAwesomeIcon className='avatar' icon = {faUserCircle}/>
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required /><br />
        <div className="pass_box">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            />
          <FontAwesomeIcon onClick={handleToggle} className='eye' icon={showPassword ? faEye : faEyeSlash} />
        </div>
        <Link to='/login' onClick={() => setShowForgotModal(true)} style={{ cursor: 'pointer' }}>Forgot Password?</Link>
        <button type="submit">Login</button>
        <span>Don't have an account? <Link to="/signup">Sign Up</Link></span>
      </form>

      {showForgotModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Forgot Password</h3>
            {step === 1 && (
              <>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  />
                <button onClick={sendOtp}>Send OTP</button>
              </>
            )}
            {step === 2 && (
              <>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  />
                <button onClick={verifyOtp}>Verify OTP</button>
              </>
            )}
            {step === 3 && (
              <>
              <div className="forgot_pass_box">
                <input
                  type={showPassword?"text":"password"}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  />
                <FontAwesomeIcon onClick={handleToggle} className='eye' icon = {showPassword?faEye:faEyeSlash}/>
                </div>
                <button onClick={resetPassword}>Reset Password</button>
              </>
            )}
            <button className="close-btn" onClick={() => { setShowForgotModal(false); setStep(1); }}>Cancel</button>
          </div>
        </div>
      )}
      </div>
  );
};

export default Login;
