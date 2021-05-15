const router = require('express').Router();
// const {asyncWrap}= require('../utils/async-wrap.utils');

const {
  // user crud
  userLists,
  getUser,
  // auth
  register,
  signin,
  logout,
  userById,
  requireSignin
} = require('../controllers/user.ctrl');

// GET
router.get('/hi', requireSignin, userLists);

router.get('/profile/:userId', requireSignin, getUser);

router.post('/profile/:userId', requireSignin, (req, res, next) => {
  console.log('update user');
});

router.post('/imageurl', requireSignin, (req, res, next) => {
  console.log('image url');
});

router.put('/image', requireSignin, (req, res, next) => {
  console.log('image');
});

// login w/ auth, session
// TODO: how to auto login, session type

// AUTH
router.post('/register', register);
router.post('/signin', signin);
router.get('/logout', requireSignin, logout);

// TODO?: is this the 'option'??
router.param('userId', userById);

// mount
module.exports = router;
