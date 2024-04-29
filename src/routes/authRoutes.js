// /src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/user');

const jwt = require('jsonwebtoken');
const secretKey = 'your_secret_key'; // Harus disimpan dengan aman dan sebaiknya kompleks
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    await User.create(username, password);
    res.status(201).send('User registered');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
      const user = await User.findByUsernameAndPassword(username, password);
      if (user) {
        const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token });
        
      } else {
        res.status(401).send('Invalid username or password');
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
});

module.exports = router;

