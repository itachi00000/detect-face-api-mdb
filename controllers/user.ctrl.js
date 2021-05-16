const { isValidObjectId } = require('mongoose');
const _ = require('lodash');
const jwt = require('jsonwebtoken'); // generate signed token
const expressJwt = require('express-jwt'); // check authorization

// based on cookie

const User = require('../models/user.model');

// GET
const getUser = (req, res, next) => {
  // expected to have requireSignin

  try {
    const { params, auth, profile } = req;

    if (auth._id !== params.userId) {
      throw Error(`cannot access, use:, ${auth._id}`);
    }

    return res.json(profile);
  } catch (error) {
    return next(error);
  }
};

// GET
const userLists = async (req, res, next) => {
  try {
    const users = await User.find({});

    return res.json(users);
  } catch (error) {
    return next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { formInput } = req.body;

    const toUpdateUser = _.extend(req.profile, formInput);

    const user = await toUpdateUser.save();

    user.hashed_password = undefined;
    user.salt = undefined;

    return res.json({ user });
  } catch (error) {
    return next(error);
  }
};

// AUTH
// POST
const register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    if (!name || !password || !email) {
      throw Error('Enter name, email, password ');
    }

    // created, and saved
    const user = await User.create({
      email,
      password,
      name
    });

    console.log(user);

    if (!user) {
      throw Error('Error at registering');
    }

    // strip
    user.hashed_password = undefined;
    user.salt = undefined;

    return res.json(user);
  } catch (error) {
    return next(error);
  }
};

const signin = async (req, res, next) => {
  try {
    const { body } = req;

    if (!body.email || !body.password) {
      throw Error('no email or password');
    }

    const user = await User.findOne({ email: body.email });

    if (!user) {
      throw Error('no user or password');
    }

    if (!user.validatePassword(body.password)) {
      throw Error('password not match');
    }
    console.log('password match');

    // setting req.session by mounting/mutating
    // if (!req.sessionID) {
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    // req.session.jwt = token;
    // res.cookie('t', token);

    // }
    // req.session.reload((err) => {
    //   if (err) {
    //     console.log(err);
    //   }
    //   console.log('reload?');
    //   console.log(req.session.jwt);
    // });

    // strip info
    user.hashed_password = undefined;
    user.salt = undefined;

    return res.json({ token, user });
  } catch (error) {
    return next(error);
  }
};

const logout = (req, res) => {
  console.log('logout');
  req.session.destroy((err) => {
    if (err) throw err;

    res.redirect('/'); // will always fire after session is destroyed
  });
};

const userById = async (req, res, next, userId) => {
  try {
    if (!isValidObjectId(userId)) {
      // to no-url catcher
      return next('router');
    }

    const user = await User.findById(userId).select('-hashed_password -salt');

    if (!user) {
      throw Error('User not found');
    }

    // mount
    req.profile = user;

    next();
  } catch (error) {
    return next(error);
  }
};

// checker of auth
// mware, has next()
const isLoggedIn = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
  requestProperty: 'auth' // req.session.auth at mongodb
});

// put where you see /:userById
// to check if req.params (to req.profile) is equal to req.auth (from jwt)
const isAuth = (req, res, next) => {
  try {
    const authorized =
      req.profile && req.auth && req.profile._id.toString() === req.auth._id;

    if (!authorized) {
      const error = new Error('not Authorized, Access denied');
      error.statusCode = 403;
      throw error;
    }

    return next();
  } catch (error) {
    return next(error);
  }
};

const isAdmin = (req, res, next) => {
  try {
    // const authorized =
  } catch (error) {
    return next(error);
  }
};

// console.log(requireSignin.toString());
module.exports = {
  getUser,
  userLists,
  updateUser,
  // param
  userById,
  // auth
  register,
  signin,
  logout,
  // mware
  isLoggedIn,
  isAuth,
  isAdmin
};
