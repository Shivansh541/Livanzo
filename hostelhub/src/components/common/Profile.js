import React, { useState, useEffect } from 'react';
import './css/profile.css'
const Profile = ({ user }) => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
  });

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      });
      setFormData({
        name: user.name,
        phone: user.phone,
      });
    }
  }, [user]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setFormData({
      name: profile.name,
      phone: profile.phone,
    });
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem('token');

    const response = await fetch('https://livanzo.onrender.com/api/auth/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': token,
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    if (response.ok) {
      setProfile(data);
      setIsEditing(false);
    } else {
      alert('Error updating profile');
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm('Are you sure you want to delete this account');
    if (!confirmed) return;
    const token = localStorage.getItem('token');

    const response = await fetch('/api/auth/delete', {
      method: 'DELETE',
      headers: {
        'auth-token': token,
      },
    });

    if (response.ok) {
      alert('Account deleted successfully');
      window.location.href = '/';
    } else {
      alert('Error deleting account');
    }
  };

return (
  <div className="profile-container">
    <h2>Profile</h2>
    <div>
      <div className="profile-field">
        <strong>Name:</strong>{' '}
        {isEditing ? (
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
        ) : (
          <span>{profile.name}</span>
        )}
      </div>

      <div className="profile-field">
        <strong>Email:</strong> <span>{profile.email}</span>
      </div>

      <div className="profile-field">
        <strong>Phone:</strong>{' '}
        {isEditing ? (
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
        ) : (
          <span>{profile.phone}</span>
        )}
      </div>

      <div className="profile-field">
        <strong>Role:</strong> <span>{profile.role}</span>
      </div>
    </div>

    <div className="profile-buttons">
  {isEditing ? (
    <>
      <button onClick={handleUpdate}>Save</button>
      <button onClick={handleCancelEdit}>Cancel</button>
    </>
  ) : (
    <>
      <button onClick={handleEditClick}>Edit</button>
      <button onClick={handleDelete} style={{ color: 'red', border: '1px solid red', background: 'transparent' }}>
        Delete Account
      </button>
    </>
  )}
</div>
  </div>
);
};

export default Profile;
