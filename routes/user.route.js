const router = require('express').Router();
// const {asyncWrap}= require('../utils/async-wrap.utils');

const {
  // user crud
  userLists,
  getUser,
  updateUser,
  // auth
  register,
  signin,
  logout,
  userById,
  isLoggedIn,
  isAuth
} = require('../controllers/user.ctrl');

// GET
router.get('/hi', isLoggedIn, userLists);

router.get('/profile/:userId', isLoggedIn, isAuth, getUser);

router.put('/profile/:userId', isLoggedIn, isAuth, updateUser);

router.post('/imageurl', isLoggedIn, (req, res, next) => {
  console.log('image url');
});

router.put('/image', isLoggedIn, (req, res, next) => {
  console.log('image');
});

// login w/ auth, session
// TODO: how to auto login, session type

// AUTH
router.post('/register', register);
router.post('/signin', signin);
router.get('/logout', isLoggedIn, logout);

// TODO?: is this the 'option'??
router.param('userId', userById);

// mount
module.exports = router;
