const mongoose = require('mongoose');
const { genSaltSync, hashSync, compareSync } = require('bcrypt');

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      require: true,
      minlength: 1,
      maxlength: 32
    },
    email: {
      type: String,
      trim: true,
      require: true,
      unique: true,
      match: [/.+@.+\..+/, 'Email must contain @'],
      minlength: 1,
      maxlength: 32
    },

    role: {
      type: Number,
      default: 0
    },
    history: {
      type: Array,
      default: []
    },
    hashed_password: {
      type: String,
      require: true
    },
    salt: String, // for password? yes,
    age: {
      type: Number,
      min: 1,
      max: 300
    },
    pet: {
      type: String,
      minlength: 2,
      maxlength: 32
    },
    username: {
      type: String,
      minlength: 1,
      maxlength: 32,
      unique: true,
      trim: true
    }
  },
  { timestamps: true, versionKey: false }
);

/**
 * pre save
 */
userSchema.pre("save", function (next) {
  this.username = this.name;
  next();
});

/**
 * statics
 */

/**
 * virtuals
 */

userSchema
  .virtual('password')
  .set(function passVirtSet(password) {
    this._password = password;
    this.salt = genSaltSync(); // makeSalt

    // encrypting password is one-way
    this.hashed_password = hashSync(password, this.salt);
  })
  .get(function passVirtGet() {
    return this._password;
  });

/**
 * paths
 */

//  validating this._password (virtual)
userSchema.path('hashed_password').validate(function hashPassPathValidate(val) {
  // min. of 6 char
  if (this._password && this._password.length < 3) {
    // invalidates the incoming 'password'
    // Document#invalidate(<path>, <errorMsg>)
    this.invalidate('password', 'Password must be at least 6 chars.');
  }

  // Document#isNew (return boolean)
  // dealing w/ new register/signup w/ empty password
  if (this.isNew && !this._password) {
    // invalidates the incoming 'password'
    this.invalidate('password', 'Password is required!');
  }
}, null);

/**
 *  methods
 */

userSchema.methods = {
  // or authenticate(plainText)
  validatePassword(passwordGiven) {
    // encrypting password is one-way
    // we only compare the hash_password and the encrypted password-given
    return compareSync(passwordGiven, this.hashed_password);
  }
};

const User = model('User', userSchema);

module.exports = User;
