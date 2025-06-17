import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
const Signup = () => {
  const [showPassword,setShowPassword] = useState(false)

  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'owner',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://livanzo.onrender.com/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      console.log(data);
      if(data.success){
        navigate('/login')
      }
      else{
        alert("Signup Failed")
      }
    } catch (error) {
      alert(error);
    }
  };
  const handleToggle = ()=>{
    setShowPassword(!showPassword)
  }
  return (
    <div id='signup'>
      <form className='loginForm' onSubmit={handleSubmit}>
      <h2>Sign Up</h2>
        <input type="text" name="name" placeholder="Name" onChange={handleChange} required /><br />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required /><br />
        <div className="pass_box">
          <input type={showPassword?'text':'password'} name="password" placeholder="Password" onChange={handleChange} required /><br />
          <FontAwesomeIcon onClick={handleToggle} className='eye' icon = {showPassword?faEye:faEyeSlash}/>
        </div>
        <input type="text" name="phone" placeholder="Phone (10 digits)" onChange={handleChange} required /><br />
        <select name="role" onChange={handleChange}>
          <option value="owner">Owner</option>
          <option value="renter">Renter</option>
        </select><br />
        <button type="submit">Register</button>
        <span>Already have an account? <Link to='/login'>Login</Link></span>
      </form>
    </div>
  );
};

export default Signup;
