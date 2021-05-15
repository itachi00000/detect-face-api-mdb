const User = require('../models/user.model');

const readUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (user.validatePassword('')) {
      console.log('match');
    }

    console.log(user);

    return res.json(user);
  } catch (error) {
    return next(error);
  }
};

const userLists = async (req, res, next) => {
  try {
    const users = await User.find({});

    return res.json(users);
  } catch (error) {
    return next(error);
  }
};

// POST
const createUser = async (req, res, next) => {
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

    if (user) {
      throw Error('Error at registering');
    }

    return res.json(user);
  } catch (error) {
    return next(error);
  }
};

const loginUser = {};

module.exports = {
  readUser,
  userLists,
  createUser,
  loginUser
};
