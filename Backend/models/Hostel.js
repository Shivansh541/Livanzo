const mongoose = require("mongoose");
const { Schema } = mongoose;
const HostelSchema = new Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  images: {
    type: [String], // store image URLs
    default: [],
  },
  name: {
    type: String,
  },
  rent: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
  },
  numReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
      comment: {
        type: String,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    landmark: String,
  },
  roomType: {
    type: String,
    enum: ["Single", "Double", "Triple", "Dormitory"],
    required: true,
  },
  allowedFor: {
    type: String,
    enum: ["Boys", "Girls", "Both", "Family"],
    required: true,
  },
  nearbyColleges: {
    type: [String], // Array of nearby colleges
    default: [],
  },
  facilities: {
    type: [String],
    default: [],
  },
  description: {
    type: String,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  favoritedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("hostel", HostelSchema);
