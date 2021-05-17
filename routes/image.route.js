const clarifai = require('clarifai');
// const { isValidObjectId } = require('mongoose');
const User = require('../models/user.model');

// add clarifai key at heroku "config vars"
const clarifaiApp = new clarifai.App({
  apiKey: process.env.CLARIFAI_API_KEY
});

const handleApiCall = async (req, res, next) => {
  try {
    const { body, auth } = req;

    const data = await clarifaiApp.models.predict(
      clarifai.FACE_DETECT_MODEL,
      body.input
    );

    if (!data) {
      throw Error('no clarifai data');
    }

    // save clarifai Data

    const user = await User.findOne({ email: auth.email }).select('history');
    user.history.push(body.input);
    await user.save();

    return res.json(data);
  } catch (error) {
    console.log('clarifai related-error');
    return next(error);
  }
};

const handleImage = async (req, res, next) => {
  try {
    const { body, auth } = req;

    // check if valid mongoose id
    // if (!isValidObjectId(body.id)) {
    //   throw Error('id is not valid');
    // }

    // check if 'email' is same with loggedIn user

    if (auth.email !== body.email) {
      throw Error('email not match, unauthorized');
    }

    const user = await User.findOne({ email: body.email }).select('history');

    return res.json(user.history.length);
  } catch (error) {
    console.log('error at handleImage');
    return next(error);
  }
};

module.exports = { handleApiCall, handleImage };
