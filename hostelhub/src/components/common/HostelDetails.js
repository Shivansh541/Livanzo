import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './css/hostelDetails.css';

const HostelDetails = () => {
  const { id } = useParams();
  const [hostel, setHostel] = useState(null);
  const [owner, setOwner] = useState(null);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [fullImagePreview, setFullImagePreview] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: '', comment: '' });
  const [isFavorite, setIsFavorite] = useState(false);  // Track if hostel is in favorites

  useEffect(() => {
    const fetchHostel = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/hostel/${id}`);
        const data = await res.json();
        setHostel(data);

        const ownerRes = await fetch(`http://localhost:5000/api/auth/${data.owner}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token'),
          },
        });
        const ownerData = await ownerRes.json();
        setOwner(ownerData);

        // Check if hostel is in user's favorites
        const userRes = await fetch(`http://localhost:5000/api/auth/getUser`, {
          method: 'GET',
          headers: {
            'auth-token': localStorage.getItem('token'),
          },
        });
        const userData = await userRes.json();
        setIsFavorite(userData.favorites.includes(id));  // Check if hostel is in favorites
      } catch (err) {
        console.error('Failed to fetch hostel details', err);
      }
    };

    fetchHostel();
  }, [id]);

  const handleAddToFavorites = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/auth/favorites/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token'),
        },
      });

      if (res.ok) {
        // const data = await res.json();
        setIsFavorite(!isFavorite); // Toggle favorite status
      } else {
        console.error('Failed to add/remove from favorites');
      }
    } catch (err) {
      console.error('Error adding/removing from favorites', err);
    }
  };

  const handlePrev = () => {
    setCurrentImgIndex((prevIndex) =>
      prevIndex === 0 ? hostel.images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentImgIndex((prevIndex) =>
      prevIndex === hostel.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/api/auth/addReview/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token'),
        },
        body: JSON.stringify(newReview),
      });

      if (res.ok) {
        const updatedHostel = await res.json();
        setHostel(updatedHostel);
        setNewReview({ rating: '', comment: '' });
        setShowReviewForm(false);
      } else {
        console.error('Failed to submit review');
      }
    } catch (err) {
      console.error('Error submitting review', err);
    }
  };

  if (!hostel) return <p>Loading...</p>;

  return (
    <div className="hostel-details-container">
      <h2>{hostel.name}</h2>

      <div className="hostel-images">
        {hostel.images?.length > 0 ? (
          <div className="slideshow-wrapper">
            <div
              className="slideshow-slider"
              style={{ transform: `translateX(-${currentImgIndex * 100}%)` }}
            >
              {hostel.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Slide ${idx}`}
                  className="slide-image"
                  onClick={() => setFullImagePreview(true)}
                  style={{ cursor: 'pointer' }}
                />
              ))}
            </div>
            <button onClick={handlePrev} className="slide-button prev">
              &#10094;
            </button>
            <button onClick={handleNext} className="slide-button next">
              &#10095;
            </button>
          </div>
        ) : (
          <p>No images available</p>
        )}
      </div>

      {fullImagePreview && (
        <div className="fullPreview">
          <div className="slideshow-fullwrapper">
            <div
              className="slideshow-fullslider"
              style={{ transform: `translateX(-${currentImgIndex * 100}%)` }}
            >
              {hostel.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Slide ${idx}`}
                  className="slide-fullimage"
                />
              ))}
            </div>
            <button onClick={handlePrev} className="slide-button prev">
              &#10094;
            </button>
            <button onClick={handleNext} className="slide-button next">
              &#10095;
            </button>
            <button className="closePreview" onClick={() => setFullImagePreview(false)}>
              X
            </button>
          </div>
        </div>
      )}

      <p><strong>Rent:</strong> ₹{hostel.rent}</p>
      <p><strong>Room Type:</strong> {hostel.roomType}</p>
      <p><strong>Allowed For:</strong> {hostel.allowedFor}</p>
      <p><strong>Facilities:</strong> {hostel.facilities.join(', ')}</p>
      <p><strong>Description:</strong> {hostel.description}</p>
      <p><strong>Rating:</strong> {hostel.rating} ({hostel.numReviews} reviews)</p>
      <p><strong>Address:</strong> {hostel.address.street}, {hostel.address.city}, {hostel.address.state} - {hostel.address.pincode} <br /> Landmark: {hostel.address.landmark}</p>
      <p><strong>Nearby Colleges:</strong> {hostel.nearbyColleges.join(', ')}</p>
      <p><strong>Availability:</strong> {hostel.isAvailable ? 'Available' : 'Not Available'}</p>
      <p><strong>Created At:</strong> {new Date(hostel.createdAt).toLocaleString()}</p>
      {localStorage.role === 'renter' && <div>
        {/* Add to Favorites Button */}
        <button style = {{marginRight: '5px',backgroundColor: 'yellow', color: 'black'}} onClick={handleAddToFavorites} className="add-review-btn">
          {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
        </button>
        {/* Review Form Button */}
        <button onClick={() => setShowReviewForm(!showReviewForm)} className="add-review-btn">
          {showReviewForm ? 'Cancel' : 'Add a Review'}
        </button>
      </div>}

      {showReviewForm && (
        <form className="review-form" onSubmit={handleReviewSubmit}>
          <label>
            Rating (1-5):
            <input
              type="number"
              min="1"
              max="5"
              value={newReview.rating}
              onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}
              required
            />
          </label>
          <label>
            Comment:
            <textarea
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              required
            />
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
    </div>
  );
};

export default HostelDetails;
