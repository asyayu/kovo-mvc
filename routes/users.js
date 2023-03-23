const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');

router.get('/register', (req, res) => {
  res.render('users/register', { title: 'Register' });
});

router.post(
  '/register',
  catchAsync(async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = new User({ username });
      const registeredUser = await User.register(user, password);
      console.log(registeredUser);
      req.flash('success', 'Successfully registered a new user!');
      res.redirect('/');
    } catch (e) {
      req.flash('error', e.message);
      res.redirect('register');
    }
  })
);

module.exports = router;
