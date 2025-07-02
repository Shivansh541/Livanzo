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
    formData.append('locationLink', form.locationLink)

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
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/hostel/add`, {
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
        <div className="form-group">
          <input name="name" placeholder=" " value={form.name} onChange={handleChange} required />
          <label>Hostel Name <span className="required">*</span></label>
        </div>

        <div className="form-group">
          <input type="number" name="rent" placeholder=" " value={form.rent} onChange={handleChange} required />
          <label>Rent <span className="required">*</span></label>
        </div>

        <div className="form-group full-width">
          <textarea name="description" placeholder=" " value={form.description} onChange={handleChange}></textarea>
          <label>Description</label>
        </div>

        <div className="form-group full-width">
          <label htmlFor="images">Upload Images <span className="required">*</span></label>
          <input type="file" name="images" id="images" multiple accept="image/*" onChange={handleChange} required />
        </div>

        <div className="form-group">
          <input name="address.landmark" placeholder=" " value={form.address.landmark} onChange={handleChange} />
          <label>Landmark</label>
        </div>

        <div className="form-group">
          <input name="address.street" placeholder=" " value={form.address.street} onChange={handleChange} />
          <label>Street</label>
        </div>

        <div className="form-group">
          <input name="address.city" placeholder=" " value={form.address.city} onChange={handleChange} required />
          <label>City <span className="required">*</span></label>
        </div>

        <div className="form-group">
          <input name="address.state" placeholder=" " value={form.address.state} onChange={handleChange} required />
          <label>State <span className="required">*</span></label>
        </div>

        <div className="form-group">
          <input name="address.pincode" placeholder=" " value={form.address.pincode} onChange={handleChange} required />
          <label>Pincode <span className="required">*</span></label>
        </div>

        <div className="form-group">
          <input type="text" name="locationLink" placeholder=" " value={form.locationLink} onChange={handleChange} />
          <label>Google Maps Location Link</label>
        </div>

        <div className="form-group">
          <input name="nearbyColleges" placeholder=" " value={form.nearbyColleges} onChange={handleChange} />
          <label>Nearby Colleges (comma separated)</label>
        </div>

        <div className="form-group">
          <input name="facilities" placeholder=" " value={form.facilities} onChange={handleChange} />
          <label>Facilities (comma separated)</label>
        </div>

        <div className="form-group">
          <label htmlFor="roomType">Room Type</label>
          <select name="roomType" id="roomType" value={form.roomType} onChange={handleChange} required>
            <option>Single</option>
            <option>Double</option>
            <option>Triple</option>
            <option>Dormitory</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="allowedFor">Allowed For</label>
          <select name="allowedFor" id="allowedFor" value={form.allowedFor} onChange={handleChange} required>
            <option>Boys</option>
            <option>Girls</option>
            <option>Both</option>
            <option>Family</option>
          </select>
        </div>

        <button type="submit">Add Hostel</button>
      </form>

    </div>

  );
};

export default ManageHostel;
