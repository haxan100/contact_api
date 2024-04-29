// /src/controllers/userController.js
const User = require('../models/user');

const register = async (req, res) => {
  const { username, password } = req.body;
  try {
    await User.create(username, password);
    res.status(201).send('User registered');
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findByUsernameAndPassword(username, password);
    if (user) {
        
      res.status(200).json({ message: 'Login successful', token });
    } else {
      res.status(401).send('Invalid username or password');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = { register, login };
