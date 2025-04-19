import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MyHostel = () => {
  const navigate = useNavigate();
  const [myHostels, setMyHostels] = useState([]);
  const [editHostel, setEditHostel] = useState(null); // For tracking which hostel is being edited
  const [form, setForm] = useState({
    name: '',
    rent: '',
    description: '',
    roomType: 'Single',
    allowedFor: 'Both',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      landmark: '',
    },
    nearbyColleges: [],
    facilities: [],
    images: [],
  });

  useEffect(() => {
    const fetchMyHostels = async () => {
      const res = await fetch('http://localhost:5000/api/hostel/myHostels', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token'),
        },
      });
      const data = await res.json();
      setMyHostels(data);
    };
    fetchMyHostels();
  }, []);

  const handleDelete = async (id) => {
    await fetch(`/api/hostel/delete/${id}`, { method: 'DELETE' });
    setMyHostels((prev) => prev.filter((h) => h._id !== id));
  };

  const handleEditClick = (hostel) => {
    // Pre-fill the form with the hostel details for editing
    setForm({
      name: hostel.name,
      rent: hostel.rent,
      description: hostel.description,
      roomType: hostel.roomType,
      allowedFor: hostel.allowedFor,
      address: hostel.address || {
        street: '',
        city: '',
        state: '',
        pincode: '',
        landmark: '',
      },
      nearbyColleges: hostel.nearbyColleges || [],
      facilities: hostel.facilities || [],
      images: hostel.images || [],
    });
    setEditHostel(hostel); // Set the hostel being edited
  };

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
    } else if (name === 'images' || name === 'nearbyColleges' || name === 'facilities') {
      setForm({ ...form, [name]: value.split(',') });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`http://localhost:5000/api/hostel/edit/${editHostel._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token'),
      },
      body: JSON.stringify(form),
    });
    const updatedHostel = await res.json();
    setMyHostels((prev) =>
      prev.map((h) => (h._id === updatedHostel._id ? updatedHostel : h))
    );
    setEditHostel(null); // Reset editHostel after submission
  };

  const handleClick = (id) => {
    const role = localStorage.getItem('role');
    if (role === 'owner') {
      navigate(`/owner/hostel/${id}`);
    } else if (role === 'renter') {
      navigate(`/user/hostel/${id}`);
    } else {
      navigate('/login');
    }
  };

  return (
    <div style={{ padding: '0 2rem' }} className="all-hostels-container">
      <h2>My Hostels</h2>
      {myHostels?.length > 0 ? (
        <div className="hostel-grid">
          {myHostels.map((h) => (
            <div key={h._id} className="hostel-card">
              <img onClick={() => handleClick(h._id)} src={h.images[0]} alt="No img" />
              <h3>{h.name}</h3>
              <p>{h.description}</p>
              <p>Rent: ₹{h.rent}</p>
              <p>City: {h.address?.city}</p>
              <button onClick={() => handleDelete(h._id)}>Delete</button>
              <button onClick={() => handleEditClick(h)}>Edit</button>
            </div>
          ))}
        </div>
      ) : (
        <p>No hostels available</p>
      )}

      {editHostel && (
        <div className="edit-hostel-form-container" style={{ marginTop: '2rem' }}>
          <h3>Edit Hostel</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Name"
              required
            />
            <input
              type="number"
              name="rent"
              value={form.rent}
              onChange={handleChange}
              placeholder="Rent"
              required
            />
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description"
              required
            />
            <select name="roomType" value={form.roomType} onChange={handleChange}>
              <option>Single</option>
              <option>Double</option>
              <option>Triple</option>
              <option>Dormitory</option>
            </select>
            <select name="allowedFor" value={form.allowedFor} onChange={handleChange}>
              <option>Boys</option>
              <option>Girls</option>
              <option>Both</option>
              <option>Family</option>
            </select>

            {/* Address Fields */}
            <input
              type="text"
              name="address.street"
              value={form.address.street}
              onChange={handleChange}
              placeholder="Street"
            />
            <input
              type="text"
              name="address.city"
              value={form.address.city}
              onChange={handleChange}
              placeholder="City"
            />
            <input
              type="text"
              name="address.state"
              value={form.address.state}
              onChange={handleChange}
              placeholder="State"
            />
            <input
              type="text"
              name="address.pincode"
              value={form.address.pincode}
              onChange={handleChange}
              placeholder="Pincode"
            />
            <input
              type="text"
              name="address.landmark"
              value={form.address.landmark}
              onChange={handleChange}
              placeholder="Landmark"
            />

            {/* Nearby Colleges */}
            <input
              type="text"
              name="nearbyColleges"
              value={form.nearbyColleges.join(', ')}
              onChange={handleChange}
              placeholder="Nearby Colleges (comma separated)"
            />

            {/* Facilities */}
            <input
              type="text"
              name="facilities"
              value={form.facilities.join(', ')}
              onChange={handleChange}
              placeholder="Facilities (comma separated)"
            />

            {/* Images */}
            <input
              type="text"
              name="images"
              value={form.images.join(', ')}
              onChange={handleChange}
              placeholder="Image URLs (comma separated)"
            />
            <div style={{padding: "10px 0"}}>
              <button style={{ marginRight: '5px' }} type="submit">
                Save Changes
              </button>
              <button onClick={() => setEditHostel(null)}>Close</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default MyHostel;
