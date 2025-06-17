import React, { useState } from 'react';
import './css/manageHostel.css';

const ManageHostel = () => {
  const [form, setForm] = useState({
    name: '',
    rent: '',
    description: '',
    roomType: 'Single',
    allowedFor: 'Both',
    images: [], // will hold FileList
    address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      landmark: '',
    },
    nearbyColleges: '',
    facilities: '',
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'images') {
      setForm({ ...form, images: files }); // store files directly
    } else if (name.startsWith('address.')) {
      setForm({
        ...form,
        address: {
          ...form.address,
          [name.split('.')[1]]: value,
        },
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    // Basic fields
    formData.append('name', form.name);
    formData.append('rent', form.rent);
    formData.append('description', form.description);
    formData.append('roomType', form.roomType);
    formData.append('allowedFor', form.allowedFor);

    // Address
    for (const key in form.address) {
      formData.append(`address.${key}`, form.address[key]);
    }

    // Arrays (split by commas)
    form.nearbyColleges
      .split(',')
      .map((college) => college.trim())
      .forEach((college) => formData.append('nearbyColleges', college));

    form.facilities
      .split(',')
      .map((f) => f.trim())
      .forEach((f) => formData.append('facilities', f));

    // Images
    for (let i = 0; i < form.images.length; i++) {
      formData.append('images', form.images[i]);
    }

    try {
      const res = await fetch('http://localhost:5000/api/hostel/add', {
        method: 'POST',
        headers: {
          'auth-token': localStorage.getItem('token'),
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        alert('Hostel added successfully!');
        window.location.reload(); // optional: reload or redirect
      } else {
        alert(data.error || 'Failed to add hostel');
      }
    } catch (error) {
      console.error(error.message);
      alert('Something went wrong!');
    }
  };

  return (
    <div className="manage-hostel-container">
      <h2>Add New Hostel</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
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
          type="file"
          name="images"
          multiple
          accept="image/*"
          onChange={handleChange}
        />

        <input
          name="address.street"
          placeholder="Street"
          value={form.address.street}
          onChange={handleChange}
        />
        <input
          name="address.landmark"
          placeholder="Landmark"
          value={form.address.landmark}
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
          name="nearbyColleges"
          placeholder="Nearby Colleges (comma separated)"
          value={form.nearbyColleges}
          onChange={handleChange}
        />
        <input
          name="facilities"
          placeholder="Facilities (comma separated)"
          value={form.facilities}
          onChange={handleChange}
        />
        <select name="roomType" value={form.roomType} onChange={handleChange}>
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
