// 📁 HostelDetails.js
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './css/hostelDetails.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const HostelDetails = () => {
  const [editHostel, setEditHostel] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false)
  const [form, setForm] = useState({
    name: '', rent: '', description: '', roomType: 'Single', allowedFor: 'Both',
    address: { street: '', city: '', state: '', pincode: '', landmark: '' },
    nearbyColleges: [], facilities: [], images: [],
  });

  const { id } = useParams();
  const [hostel, setHostel] = useState(null);
  const [owner, setOwner] = useState(null);
  const [favoritedUsers, setFavoritedUsers] = useState([]);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [fullImagePreview, setFullImagePreview] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: '', comment: '' });
  const [isFavorite, setIsFavorite] = useState(false);
  const [user, setUser] = useState(null);
  const [newImages, setNewImages] = useState([]); // 🆕

  const BACKEND_URL = 'http://localhost:5000';
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHostel = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/hostel/${id}`);
        const data = await res.json();
        setHostel(data);

        const ownerRes = await fetch(`${BACKEND_URL}/api/auth/${data.owner}`, {
          headers: { 'Content-Type': 'application/json', 'auth-token': localStorage.getItem('token') },
        });
        const ownerData = await ownerRes.json();
        setOwner(ownerData);

        const userRes = await fetch(`${BACKEND_URL}/api/auth/getUser`, {
          headers: { 'auth-token': localStorage.getItem('token') },
        });
        const userData = await userRes.json();
        setUser(userData);
        setIsFavorite(userData.favorites.includes(id));

        if (data.favoritedBy?.length > 0) {
          const userDetails = await Promise.all(
            data.favoritedBy.map((userId) =>
              fetch(`${BACKEND_URL}/api/auth/${userId}`, {
                headers: { 'auth-token': localStorage.getItem('token') },
              }).then((res) => res.ok ? res.json() : null)
            )
          );
          setFavoritedUsers(userDetails.filter(Boolean));
        }
      } catch (err) {
        console.error('Failed to fetch hostel details', err);
      }
    };

    fetchHostel();
  }, [id]);

  const handleAddToFavorites = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/favorites/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'auth-token': localStorage.getItem('token') },
      });
      if (res.ok) setIsFavorite(!isFavorite);
    } catch (err) {
      console.error('Error adding/removing from favorites', err);
    }
  };

  const handlePrev = () => setCurrentImgIndex(prev => prev === 0 ? hostel.images.length - 1 : prev - 1);
  const handleNext = () => setCurrentImgIndex(prev => prev === hostel.images.length - 1 ? 0 : prev + 1);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/addReview/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'auth-token': localStorage.getItem('token') },
        body: JSON.stringify(newReview),
      });
      if (res.ok) {
        const updated = await res.json();
        setHostel(updated);
        setNewReview({ rating: '', comment: '' });
        setShowReviewForm(false);
      }
    } catch (err) {
      console.error('Error submitting review', err);
    }
  };

  const handleDelete = async (id) => {
    const res = await fetch(`${BACKEND_URL}/api/hostel/delete/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'auth-token': localStorage.getItem('token') },
    });
    if (res.ok) navigate('/owner/myHostels');
  };

  const handleEditClick = (hostel) => {
    setForm({
      name: hostel.name, rent: hostel.rent, description: hostel.description,
      roomType: hostel.roomType, allowedFor: hostel.allowedFor,
      address: hostel.address || {}, nearbyColleges: hostel.nearbyColleges || [],
      facilities: hostel.facilities || [], images: hostel.images || [],
    });
    setEditHostel(hostel);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address')) {
      setForm({ ...form, address: { ...form.address, [name.split('.')[1]]: value } });
    } else if (['images', 'nearbyColleges', 'facilities'].includes(name)) {
      setForm({ ...form, [name]: value.split(',') });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${BACKEND_URL}/api/hostel/edit/${editHostel._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'auth-token': localStorage.getItem('token') },
      body: JSON.stringify(form),
    });
    const updated = await res.json();
    setHostel(updated);
    setEditHostel(null);
  };

  const handleImageUpload = async () => {
    if (newImages.length === 0) return;
    const formData = new FormData();
    newImages.forEach((file) => formData.append('images', file));
    const res = await fetch(`${BACKEND_URL}/api/hostel/addImages/${hostel._id}`, {
      method: 'PUT',
      headers: { 'auth-token': localStorage.getItem('token') },
      body: formData,
    });
    if (res.ok) {
      const updated = await res.json();
      setHostel(updated);
      setNewImages([]);
    }
  };
const handleDeleteImage = async (imgPath) => {
  const confirmed = window.confirm('Are you sure you want to delete this image?');
  if (!confirmed) return;
  try {
    const res = await fetch(`${BACKEND_URL}/api/hostel/deleteImage/${hostel._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token')
      },
      body: JSON.stringify({ image: imgPath })
    });
    if (res.ok) {
      const updated = await res.json();
      setHostel(updated); // Update local state with new hostel data
    }
  } catch (err) {
    console.error('Error deleting image:', err);
  }
};

  if (!hostel) return <p>Loading...</p>;

  return (
    <div className="hostel-details-container">
      <h2>{hostel.name}</h2>

<div className="hostel-images">
  {hostel.images?.length > 0 ? (
    <div className="slideshow-wrapper">
      <div className="slideshow-slider" style={{ transform: `translateX(-${currentImgIndex * 100}%)` }}>
        {hostel.images.map((img, idx) => (
          <img
            key={idx}
            src={img.startsWith('http') ? img : `${BACKEND_URL}${img}`}
            alt={`Slide ${idx}`}
            className="slide-image"
            onClick={() => setFullImagePreview(true)}
            style={{ cursor: 'pointer' }}
          />
        ))}
      </div>

      {/* Show delete button over current image only */}
      {localStorage?.role === 'owner' && user && user._id === hostel.owner && (
        <FontAwesomeIcon
          className="delete-img-btn"
          onClick={() => handleDeleteImage(hostel.images[currentImgIndex])}
          icon={faXmark}
        />
      )}

      <button onClick={handlePrev} className="slide-button prev">&#10094;</button>
      <button onClick={handleNext} className="slide-button next">&#10095;</button>
    </div>
  ) : (
    <p>No images available</p>
  )}
</div>


      {fullImagePreview && (
        <div className="fullPreview">
          <div className="slideshow-fullwrapper">
            <div className="slideshow-fullslider" style={{ transform: `translateX(-${currentImgIndex * 100}%)` }}>
              {hostel.images.map((img, idx) => (
                <img key={idx} src={img.startsWith('http') ? img : `${BACKEND_URL}${img}`} alt={`Slide ${idx}`} className="slide-fullimage"/>
              ))}
            </div>
            <button onClick={handlePrev} className="slide-button prev">&#10094;</button>
            <button onClick={handleNext} className="slide-button next">&#10095;</button>
            <button className="closePreview" onClick={() => setFullImagePreview(false)}>X</button>
          </div>
        </div>
      )}
          {/* 🆕 Add Images */}
          {localStorage?.role === 'owner' && user && user._id === hostel.owner && (
            <button className='add-review-btn' onClick={()=>setShowAddModal(!showAddModal)}>Add More Images</button>
          )}
          {showAddModal && (
            <div onClick={(e) => {
      // If the click target is the overlay itself (not the modal content), close it
      if (e.target.classList.contains('modal-overlay')) {
        setShowAddModal(false);
      }
    }} class="modal-overlay">
            <div onClick={(e)=>e.stopPropagation()} className='image-modal modal-content' style={{ marginTop: '10px' }}>
              <input type="file" multiple onChange={(e) => setNewImages(Array.from(e.target.files))} />
              <div class="modal-buttons">
              <button onClick={()=>{handleImageUpload();setShowAddModal(!showAddModal)}}>Upload Images</button>
              <button onClick={()=>setShowAddModal(!showAddModal)}>Close</button>
              </div>
            </div>
          </div>
          )}
{hostel.locationLink && (
  <button
    className='add-review-btn'
    onClick={() => window.open(hostel.locationLink, "_blank")}
  >
    Open in maps
  </button>
)}

      <div className="hostelinfo">
        <p><strong>Rent:</strong> ₹{hostel.rent}</p>
        <p><strong>Room Type:</strong> {hostel.roomType}</p>
        <p><strong>Allowed For:</strong> {hostel.allowedFor}</p>
        {(hostel.facilities[0]!=="") && <p><strong>Facilities:</strong> {hostel.facilities.join(', ')}</p>}
        {hostel.description &&<p><strong>Description:</strong> {hostel.description}</p>}
        <p><strong>Rating:</strong> {hostel.rating} ({hostel.numReviews} reviews)</p>
        <p><strong>Address:</strong> {hostel.address.street}, {hostel.address.city}, {hostel.address.state} - {hostel.address.pincode} <br />
        {hostel.address.landmark && <strong>Landmark:</strong>} {hostel.address.landmark}</p>
        {hostel.nearbyColleges[0]!=="" && <p><strong>Nearby Colleges:</strong> {hostel.nearbyColleges.join(', ')}</p>}
        <p><strong>Availability:</strong> {hostel.isAvailable ? 'Available' : 'Not Available'}</p>
        <p><strong>Created At:</strong> {new Date(hostel.createdAt).toLocaleString()}</p>
      </div>

      {localStorage?.role === 'renter' && (
        <div>
          <button className='add-review-btn' style={{ backgroundColor: 'yellow',color:'black' }} onClick={handleAddToFavorites}>
            {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
          </button>
          <button className='add-review-btn' onClick={() => setShowReviewForm(!showReviewForm)}>
            {showReviewForm ? 'Cancel' : 'Add a Review'}
          </button>
        </div>
      )}

      {localStorage?.role === 'owner' && user && user._id === hostel.owner && (
        <div>
          <button className='add-review-btn' style={{ backgroundColor: 'red' }} onClick={() => handleDelete(hostel._id)}>Delete</button>
          <button className='add-review-btn' onClick={() => handleEditClick(hostel)}>Edit</button>

        </div>
      )}

      {editHostel && (
        <div onClick={(e) => {
      // If the click target is the overlay itself (not the modal content), close it
      if (e.target.classList.contains('modal-overlay')) {
        setEditHostel(false);
      }
    }} className="modal-overlay">
          <div onClick={(e)=>e.stopPropagation()} className="modal-content">
            <h3>Edit Hostel</h3>
            <form onSubmit={handleSubmit}>
              <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Name" required/>
              <input type="number" name="rent" value={form.rent} onChange={handleChange} placeholder="Rent" required />
              <textarea name="description" rows={5} value={form.description} onChange={handleChange} placeholder="Description" required />
              <select name="roomType" value={form.roomType} onChange={handleChange}>
                <option>Single</option><option>Double</option><option>Triple</option><option>Dormitory</option>
              </select>
              <select name="allowedFor" value={form.allowedFor} onChange={handleChange}>
                <option>Boys</option><option>Girls</option><option>Both</option><option>Family</option>
              </select>
              <input type="text" name="address.street" value={form.address.street} onChange={handleChange} placeholder="Street"/>
              <input type="text" name="address.city" value={form.address.city} onChange={handleChange} placeholder="City"/>
              <input type="text" name="address.state" value={form.address.state} onChange={handleChange} placeholder="State"/>
              <input type="text" name="address.pincode" value={form.address.pincode} onChange={handleChange} placeholder="Pincode"/>
              <input type="text" name="address.landmark" value={form.address.landmark} onChange={handleChange} placeholder="Landmark"/>
              <input type="text" name="nearbyColleges" value={form.nearbyColleges.join(', ')} onChange={handleChange} placeholder="Nearby Colleges (comma separated)" />
              <input type="text" name="facilities" value={form.facilities.join(', ')} onChange={handleChange} placeholder="Facilities (comma separated)" />
              <div className='modal-buttons'>
                <button style={{ marginRight: '5px' }} type="submit">Save Changes</button>
                <button onClick={() => setEditHostel(null)}>Close</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showReviewForm && (
        <form className="review-form" onSubmit={handleReviewSubmit}>
          <label>Rating (1-5):
            <input type="number" min="1" max="5" value={newReview.rating} onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })} required/>
          </label>
          <label>Comment:
            <textarea value={newReview.comment} onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })} required/>
          </label>
          <button type="submit">Submit Review</button>
        </form>
      )}

      {owner && (
        <div className="owner-info">
          <h3>Owner Info</h3>
          <p><strong>Name:</strong> {owner.name}</p>
          <p><strong>Email:</strong> {owner.email}</p>
          <p><strong>Phone:</strong> {owner.phone || 'Not provided'}</p>
        </div>
      )}

      {hostel.reviews?.length > 0 && (
        <div className="reviews">
          <h3>Reviews</h3>
          {hostel.reviews.map((review, idx) => (
            <div key={idx} className="review-card">
              <p><strong>{review.name}</strong> rated {review.rating}/5</p>
              <p>{review.comment}</p>
              <small>{new Date(review.createdAt).toLocaleString()}</small>
            </div>
          ))}
        </div>
      )}

      {user && user._id === hostel.owner && favoritedUsers.length > 0 && (
<div className="favorited-users">
  <h3>Favorited By</h3>
  <ul>
    {favoritedUsers.map((u, i) => (
      <li key={i} className="favorite-user-item">
        <p><strong>Name:</strong> {u.name}</p>
        <p><strong>Email:</strong> {u.email}</p>
      </li>
    ))}
  </ul>
</div>

      )}
    </div>
  );
};

export default HostelDetails;
