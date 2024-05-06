// /src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Response = require('../../config/responseHelper'); // Adjust the path as necessary

const jwt = require('jsonwebtoken');
const secretKey = 'your_secret_key'; // Harus disimpan dengan aman dan sebaiknya kompleks
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.create(username, password); 
    return Response('User registered successfully', true, { userId: user.id }, 200, res);
    
  } catch (error) {
    return Response(error.message, false, {}, 500, []);
  }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
      const user = await User.findByUsernameAndPassword(username, password);
      if (user) {
        const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '1h' });
        return Response('Login successful', true, { token:token }, 200, res);
      } else {
        return Response('Invalid username or password', false, {}, 401, res);
      }
    } catch (error) {
        return Response('Terjadi Kendala', false, [], 401, res);
    }
});

module.exports = router;

