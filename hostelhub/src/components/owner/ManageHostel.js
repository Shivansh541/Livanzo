import React, { useState } from 'react';
import './css/manageHostel.css';
const ManageHostel = () => {
  const [form, setForm] = useState({
    name: '',
    rent: '',
    description: '',
    roomType: 'Single',
    allowedFor: 'Both',
    images: [],
    address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      landmark: '',
    },
    nearbyColleges: [],
    facilities: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address')) {
      setForm({
        ...form,
        address: {
          ...form.address,
          [name.split('.')[1]]: value,
        },
      });
    } else if (name === 'images') {
      setForm({ ...form, images: value.split(',') }); // Convert comma-separated values into an array
    } else if (name === 'nearbyColleges') {
      setForm({ ...form, nearbyColleges: value.split(',') }); // Convert comma-separated values into an array
    } else if (name === 'facilities') {
      setForm({ ...form, facilities: value.split(',') }); // Convert comma-separated values into an array
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/hostel/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token'),
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        alert('Hostel added successfully!');
      } else {
        alert(data.error || 'Failed to add hostel');
      }
    } catch (error) {
      console.error(error.message);
      alert('Something went wrong!');
    }
  };

  return (
    <div className='manage-hostel-container'>
      <h2>Add New Hostel</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Hostel Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="rent"
          placeholder="Rent"
          value={form.rent}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
        />
        <input
          name="images"
          placeholder="Image URLs (comma separated)"
          value={form.images.join(', ')}
          onChange={handleChange}
        />
        <input
          name="address.street"
          placeholder="Street"
          value={form.address.street}
          onChange={handleChange}
        />
        <input
          name="address.city"
          placeholder="City"
          value={form.address.city}
          onChange={handleChange}
        />
        <input
          name="address.state"
          placeholder="State"
          value={form.address.state}
          onChange={handleChange}
        />
        <input
          name="address.pincode"
          placeholder="Pincode"
          value={form.address.pincode}
          onChange={handleChange}
        />
        <input
          name="address.landmark"
          placeholder="Landmark"
          value={form.address.landmark}
          onChange={handleChange}
        />
        <input
          name="nearbyColleges"
          placeholder="Nearby Colleges (comma separated)"
          value={form.nearbyColleges.join(', ')}
          onChange={handleChange}
        />
        <input
          name="facilities"
          placeholder="Facilities (comma separated)"
          value={form.facilities.join(', ')}
          onChange={handleChange}
        />
        <select
          name="roomType"
          value={form.roomType}
          onChange={handleChange}
        >
          <option>Single</option>
          <option>Double</option>
          <option>Triple</option>
          <option>Dormitory</option>
        </select>
        <select
          name="allowedFor"
          value={form.allowedFor}
          onChange={handleChange}
        >
          <option>Boys</option>
          <option>Girls</option>
          <option>Both</option>
          <option>Family</option>
        </select>
        <button type="submit">Add Hostel</button>
      </form>
    </div>
  );
};

export default ManageHostel;
