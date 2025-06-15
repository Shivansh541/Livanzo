const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");
const Hostel = require("../models/Hostel");
const nodemailer = require("nodemailer");

require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
router.post(
  "/signup",
  [
    body("email", "Enter a valid email").isEmail(),
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("password", "Password length must be greater than 8").isLength({
      min: 8,
    }),
    body("phone", "Phone number must be of 10 digits").isLength({
      min: 10,
      max: 10,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ error: "User with this email already exists" });
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
        phone: req.body.phone,
        role: req.body.role,
      });
      data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      res.json({ authtoken, success: true });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some error occured");
    }
  }
);

router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      let user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(400).json({ error: "Sorry! User does not exists" });
      }
      const passwordCompare = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!passwordCompare) {
        return res.status(400).json({ error: "Sorry! Incorrect Password" });
      }
      data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      res.json({ authtoken, success: true });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some error occured");
    }
  }
);
// POST /api/auth/forgot-password

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: "User not found" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
  const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes from now
  const salt = await bcrypt.genSalt(10);
  const secOTP = await bcrypt.hash(otp, salt);
  user.otp = secOTP;
  user.otpExpires = otpExpires;
  await user.save();

  // SEND EMAIL
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: EMAIL_USER,
    to: user.email,
    subject: "Your OTP for Password Reset",
    text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Email sending failed" });
    }
    return res.json({ success: true, message: "OTP sent to email" });
  });
});
// POST /api/auth/verify-otp
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });
      const otpCompare = await bcrypt.compare(
        otp,
        user.otp
      );
  if (!user || !otpCompare || user.otpExpires < Date.now()) {
    return res.status(400).json({ error: "Invalid or expired OTP" });
  }

  return res.json({ success: true, message: "OTP verified" });
});
// POST /api/auth/reset-password
router.post("/reset-password", async (req, res) => {
  const {email, newPassword } = req.body;
  const user = await User.findOne({ email });

  const salt = await bcrypt.genSalt(10);
  const secPass = await bcrypt.hash(newPassword, salt);
  user.password = secPass; // Hash it if using bcrypt
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();

  return res.json({ success: true, message: "Password reset successful" });
});

router.get("/getUser", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});
// 👤 Update User Info
router.put("/update", fetchuser, async (req, res) => {
  try {
    const { name, phone, role } = req.body;

    const newUserData = {};
    if (name) newUserData.name = name;
    if (phone) newUserData.phone = phone;
    if (role) newUserData.role = role;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: newUserData },
      { new: true }
    ).select("-password"); // don't send password

    res.json(updatedUser);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ❌ Delete User Account
router.delete("/delete", fetchuser, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});
router.get("/all", async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});
router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

router.post("/addReview/:hostelId", fetchuser, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const hostel = await Hostel.findById(req.params.hostelId);
    if (!hostel) return res.status(404).json({ error: "Hostel not found" });

    const alreadyReviewed = hostel.reviews.find(
      (r) => r.user.toString() === req.user.id
    );
    if (alreadyReviewed) {
      return res
        .status(400)
        .json({ error: "Hostel already reviewed by this user" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(401).json({ error: "Invalid user" });
    }

    const review = {
      user: req.user.id,
      name: user.name,
      rating: Number(rating),
      comment,
    };

    hostel.reviews.push(review);
    hostel.numReviews = hostel.reviews.length;
    hostel.rating =
      hostel.reviews.reduce((acc, r) => acc + r.rating, 0) /
      hostel.reviews.length;

    await hostel.save();

    // ✅ Fix: return the updated hostel in clean format
    const updatedHostel = await Hostel.findById(req.params.hostelId).lean();
    res.status(201).json(updatedHostel);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

router.post("/favorites/:hostelId", fetchuser, async (req, res) => {
  try {
    const { hostelId } = req.params;
    const userId = req.user.id;

    const user = await User.findById(userId);
    const hostel = await Hostel.findById(hostelId);

    if (!user || !hostel) {
      return res.status(404).json({ error: "User or Hostel not found" });
    }

    const alreadyFavorited = user.favorites.includes(hostelId);

    if (alreadyFavorited) {
      // ❌ Remove hostel from user's favorites
      user.favorites = user.favorites.filter(
        (id) => id.toString() !== hostelId
      );

      // ❌ Remove user from hostel's favoritedBy
      hostel.favoritedBy = hostel.favoritedBy.filter(
        (id) => id.toString() !== userId
      );
    } else {
      // ✅ Add hostel to user's favorites
      user.favorites.push(hostelId);

      // ✅ Add user to hostel's favoritedBy
      hostel.favoritedBy.push(userId);
    }

    await user.save();
    await hostel.save();

    res.status(200).json({
      message: alreadyFavorited
        ? "Hostel removed from favorites"
        : "Hostel added to favorites",
      favorites: user.favorites,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
