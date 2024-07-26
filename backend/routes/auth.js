const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config(); // Load environment variables

const router = express.Router();


router.get('/user', async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('_id');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ username: user.username });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user data' });
  }
});


router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send('User already exists');
    }
    const user = new User({ username, email, password: bcrypt.hashSync(password, 8) });
    await user.save();
    res.status(201).send('User created');
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(404).send('User not found');
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).send('Invalid credentials');
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.status(200).send({ token });
});

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).send('User not found');

  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  user.resetCode = resetCode;
  await user.save();

  // Configure nodemailer
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL, // Use environment variable for email
      pass: process.env.PASSWORD // Use environment variable for password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Password Reset Code',
    text: `Your password reset code is ${resetCode}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return res.status(500).send('Error sending email');
    } else {
      res.status(200).send('Reset code sent');
    }
  });
});

router.post('/reset-password', async (req, res) => {
  const { email, resetCode, newPassword } = req.body;
  const user = await User.findOne({ email, resetCode });
  if (!user) return res.status(404).send('Invalid reset code');

  user.password = bcrypt.hashSync(newPassword, 8);
  user.resetCode = undefined;
  await user.save();

  res.status(200).send('Password reset successful');
});

module.exports = router;
