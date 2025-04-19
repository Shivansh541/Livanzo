import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/login.css';
const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const loginRes = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
  
      const loginData = await loginRes.json();
      console.log('Login response:', loginData);
  
      if (loginData.success) {
        localStorage.setItem('token', loginData.authtoken);
  
        const userRes = await fetch('http://localhost:5000/api/auth/getUser', {
          headers: {
            'Content-Type': 'application/json',
            'auth-token': loginData.authtoken,
          },
        });
  
        const userData = await userRes.json();
        console.log('User data:', userData);
  
        localStorage.setItem('role', userData.role);
  
        // Log role and check condition
        console.log('Role:', userData.role);
  
        const role = userData.role;
        
        if (role === 'owner') {
          console.log('Navigating to /owner');
          navigate('/owner');
        } else if (role === 'renter') {
          console.log(localStorage.getItem('token'))
          console.log('Navigating to /user');
          navigate('/user');
        } else {
          console.log('Navigating to /');
          navigate('/');
        }
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
  

  return (
    <div id='login'>
      <h2>Login</h2>
      <form className='loginForm' onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required /><br />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required /><br />
        <button type="submit">Login</button>
        <span>Don't have an account?<a href="/signup"> Sign Up</a></span>
      </form>
    </div>
  );
};

export default Login;
