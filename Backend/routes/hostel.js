const express = require("express");
const router = express.Router();
const Hostel = require("../models/Hostel");
const fetchuser = require("../middleware/fetchuser");
const multer = require("multer");
const path = require("path");

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // make sure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// ✅ Add Hostel with multiple image uploads
router.post("/add", fetchuser, upload.array("images", 10), async (req, res) => {
  try {
    const imagePaths = req.files.map((file) => "/" + file.path.replace(/\\/g, "/"));

    const hostel = new Hostel({
      ...req.body,
      owner: req.user.id,
      images: imagePaths,
    });

    const savedHostel = await hostel.save();
    res.status(201).json(savedHostel);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ✏️ Edit Hostel by ID (no image change)
router.put("/edit/:id", fetchuser, async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id);
    if (!hostel) return res.status(404).json({ error: "Hostel not found" });

    if (hostel.owner.toString() !== req.user.id)
      return res.status(403).json({ error: "Unauthorized" });

    const updatedHostel = await Hostel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedHostel);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// 🗑️ Delete Hostel by ID
router.delete("/delete/:id", fetchuser, async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id);
    if (!hostel) return res.status(404).json({ error: "Hostel not found" });

    if (hostel.owner.toString() !== req.user.id)
      return res.status(403).json({ error: "Unauthorized" });

    await hostel.deleteOne();
    res.json({ message: "Hostel deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// 👤 Get all hostels of logged-in user
router.get("/myHostels", fetchuser, async (req, res) => {
  try {
    const hostels = await Hostel.find({ owner: req.user.id });
    res.json(hostels);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// 🌍 Get all hostels
router.get("/all", async (req, res) => {
  try {
    const hostels = await Hostel.find();
    res.json(hostels);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// 🔍 Search hostels
// GET /api/hostel/search?query=delhi&min=3000&max=7000
router.get("/search", async (req, res) => {
  try {
    const { query, min, max } = req.query;

    const filter = {
      ...(query && {
        $or: [
          { name: { $regex: query, $options: "i" } },
          { "address.city": { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
        ],
      }),
      ...(min && { rent: { $gte: Number(min) } }),
      ...(max && {
        rent: {
          ...((min && { $gte: Number(min) }) || {}),
          $lte: Number(max),
        },
      }),
    };

    const hostels = await Hostel.find(filter);
    res.json(hostels);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Internal Server Error");
  }
});

// 📄 Get hostel by ID
router.get("/:id", async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id);
    if (!hostel) return res.status(404).json({ error: "Hostel not found" });

    res.json(hostel);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
