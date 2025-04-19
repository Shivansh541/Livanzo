const express = require('express')
const User = require('../models/User')
const router = express.Router()
const {body,validationResult} = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const fetchuser = require('../middleware/fetchuser')
const Hostel = require('../models/Hostel')
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET
router.post('/signup',[
    body('email', 'Enter a valid email').isEmail(),
    body('name','Enter a valid name').isLength({min: 3}),
    body('password', 'Password length must be greater than 8').isLength({min: 8}),
    body('phone', 'Phone number must be of 10 digits').isLength({min: 10, max:10})
],async (req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    try{
        let user = await User.findOne({email: req.body.email})
        if(user){
            return res.status(400).json({error: "User with this email already exists"})
        }
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
            phone: req.body.phone,
            role: req.body.role,
        })
        data = {
            user:{
                id: user.id
            }
        }
        const authtoken = jwt.sign(data,JWT_SECRET)
        res.json({authtoken, success: true})
    }
    catch(error){
        console.error(error.message)
        res.status(500).send("Some error occured")
    }
})

router.post('/login', [
    body('email','Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists()
],async(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    try{
        let user = await User.findOne({email:req.body.email})
        if(!user){
            return res.status(400).json({error: 'Sorry! User does not exists'})
        }
        const passwordCompare = await bcrypt.compare(req.body.password,user.password)
        if(!passwordCompare){
            return res.status(400).json({error: 'Sorry! Incorrect Password'})
        }
        data = {
            user:{
                id: user.id
            }
        }
        const authtoken = jwt.sign(data,JWT_SECRET)
        res.json({authtoken, success: true})
    }
    catch(error){
        console.error(error.message)
        res.status(500).send("Some error occured")
    }
})

router.get('/getUser', fetchuser, async(req,res)=>{
    try{
        const userId = req.user.id;
        const user = await User.findById(userId).select('-password')
        res.send(user)
    }
    catch(error){
        console.error(error.message)
        res.status(500).send("Internal Server Error")
    }
})
// 👤 Update User Info
router.put('/update', fetchuser, async (req, res) => {
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
        ).select('-password'); // don't send password

        res.json(updatedUser);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
});


// ❌ Delete User Account
router.delete('/delete', fetchuser, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.user.id);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
});
router.get('/all', async (req, res) => {
    const users = await User.find().select('-password');
    res.json(users);
  });
router.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  });

  router.post('/addReview/:hostelId', fetchuser, async (req, res) => {
    try {
      const { rating, comment } = req.body;
      const hostel = await Hostel.findById(req.params.hostelId);
      if (!hostel) return res.status(404).json({ error: 'Hostel not found' });
  
      const alreadyReviewed = hostel.reviews.find(
        (r) => r.user.toString() === req.user.id
      );
      if (alreadyReviewed) {
        return res.status(400).json({ error: 'Hostel already reviewed by this user' });
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
        hostel.reviews.reduce((acc, r) => acc + r.rating, 0) / hostel.reviews.length;
  
      await hostel.save();
      res.status(201).json({ message: 'Review added', hostel });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  });
  router.post("/favorites/:hostelId", fetchuser, async (req, res) => {
    try {
      const { hostelId } = req.params;
  
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(401).json({ error: "Invalid user" });
      }
  
      // Check if hostel is already in favorites
      if (user.favorites.includes(hostelId)) {
        // If it's already in favorites, remove it
        user.favorites = user.favorites.filter(
          (favorite) => favorite.toString() !== hostelId
        );
      } else {
        // If it's not in favorites, add it
        user.favorites.push(hostelId);
      }
  
      await user.save();
  
      res.status(200).json({ message: "Favorites updated", favorites: user.favorites });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Internal Server Error");
    }
  });

module.exports = router