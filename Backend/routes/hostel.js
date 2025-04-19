const express = require("express");
const router = express.Router();
const Hostel = require("../models/Hostel");
const fetchuser = require("../middleware/fetchuser");

// ✅ Add Hostel
router.post("/add", fetchuser, async (req, res) => {
  try {
    const hostel = new Hostel({
      ...req.body,
      owner: req.user.id,
    });

    const savedHostel = await hostel.save();
    res.status(201).json(savedHostel);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ✏️ Edit Hostel by ID
router.put("/edit/:id", fetchuser, async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id);
    if (!hostel) return res.status(404).json({ error: "Hostel not found" });

    // Only owner can update
    if (hostel.owner.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

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

    if (hostel.owner.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await hostel.deleteOne();
    res.json({ message: "Hostel deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});
router.get('/myHostels', fetchuser, async (req, res) => {
  const hostels = await Hostel.find({ owner: req.user.id });
    res.json(hostels);
  });
router.get('/all', async (req, res) => {
    const hostels = await Hostel.find();
    res.json(hostels);
  });

// GET /api/hostel/search?city=Delhi&maxRent=8000&allowedFor=Girls
// GET /api/hostels/search?query=delhi&min=3000&max=7000
router.get('/search', async (req, res) => {
  try {
    const { query, min, max } = req.query;

    const filter = {
      ...(query && {
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { city: { $regex: query, $options: 'i' } },
          { address: { $regex: query, $options: 'i' } },
        ],
      }),
      ...(min && { price: { $gte: Number(min) } }),
      ...(max && { price: { ...((min && { $gte: Number(min) }) || {}), $lte: Number(max) } }),
    };

    const hostels = await Hostel.find(filter);
    res.json(hostels);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Internal Server Error');
  }
});
router.get('/:id', async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id);
    if (!hostel) return res.status(404).json({ error: 'Hostel not found' });
    res.json(hostel);
    } catch (err) {
    console.error(err.message);
    res.status(500).send('Internal Server Error');
    }
})
  
module.exports = router;
