const express = require('express')
const router = express.Router()
const User = require('./../models/user')
const {jwtAuthMiddleware, generateToken} = require('./../jwt');

// Signup Route 
router.post('/signup', async (req, res) => {
  try {
    const data = req.body
    const newUser = new User(data)
    const response = await newUser.save()
    console.log('Data Saved:', response)

    const payload = {
      id: response.id,
    }
    console.log(JSON.stringify(payload));
    const token = generateToken(payload);
    console.log('Token is : ', token);
    res.status(200).json({response: response, token: token});
  } 
  catch (err) {
    console.error('Error saving data:', err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// Login Route
router.post('/login', async(req, res) => {
   try {
      // Extract username and passowrd from request body
      const {aadharCardNumber, password} = req.body;
      // Find the user by username
      const user = await User.findOne({aadharCardNumber: aadharCardNumber});
      // If user does not exist or password does not match
      if( !user || !(await user.comparePassword(password))){
        return res.status(401).json({error: 'Invalid username or password'});
      }

      // Generate Token
      const payload = {
        id : user.id,
      }
      const token = generateToken(payload);
      // Return token as response
      res.json({token})
   } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server error'});
   }
})

// Profile Route
router.get('/profile', jwtAuthMiddleware, async (req, res) => {
   try {
    const userData = req.user;
    const userId = userData.id;
    const user = await User.findById(userId);
    res.status(200).json({user});
   } catch (error) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server error'});
   }
})

// For Update
router.put('/profile/passowrd',async(req,res)=>{
    try {
     const userId = req.user;
     const {currentPassword, newPassword} = req.body;

     // Find the user by userId
     const user = await User.findById(userId);

     // If passowrd does not matched, return error
     if( !(await user.comparePassword(currentPassword))){
        return res.status(401).json({error: 'Invalid password'});
      }

      // Update the user's password
      user.password = newPassword;
      await user.save();
      console.log('Password updated');
     res.status(200).json({message: 'Password updated'});
    } catch (error) {
      console.error('Error saving data:', error);
      res.status(500).json({error: 'Internal Server Error'});
    }
  })


module.exports = router
