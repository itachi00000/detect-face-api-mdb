const router = require('express').Router();

// controllers
// // for auth and user
// const {
//   requireSignin,
//   isAdmin,
//   isAuth
// } = require('../controllers/auth.control');

const {
  userLists,
  readUser,
  createUser,
  loginUser
} = require('../controllers/user.ctrl');

// GET
router.get('/', userLists);
router.get('/:userId', readUser);

// POST
router.post('/register', createUser);

// signin w/ auth, session
// TODO: how to auto login, session type
router.post('/signin', loginUser);

// TODO?: is this the 'option'??
// router.param('userId', userById);

// mount
module.exports = router;
