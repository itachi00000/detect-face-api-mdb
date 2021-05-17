const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
// const expSession = require('express-session');
// const mongoSessionStore = require('connect-mongo');
// const passport = require('passport');
const morgan = require('morgan');
const cors = require('cors');
// const helmet = require('helmet');
const path = require('path');

// some var, import, utils
const { connectMDB } = require('./db');
const { errorHandler } = require('./utils/error-handler.utils');

// config, process.env
dotenv.config({ path: './.env.dev.local' });

// connect mongodb + more .catch()
connectMDB(mongoose).catch((err) =>
  console.error('Catch-Error-MDNconnect', err.stack)
);

// init express app
const app = express();

// import routes
const usersRoute = require('./routes/user.route');

// setting vars, options, env
const port = parseInt(process.env.PORT || 3000, 10);
const ROOT_URL = `http://localhost:${port}`;
const dev = process.env.NODE_ENV !== 'production';
// const MongoStore = mongoSessionStore(expSession);
// const sessOpts = {
//   name: process.env.SESSION_NAME,
//   secret: process.env.SESSION_SECRET,
//   store: new MongoStore({
//     mongooseConnection: mongoose.connection, // based on connection?
//     ttl: 14 * 24 * 60 * 60 // save session 14days
//   }),
//   resave: false,
//   saveUninitialized: false,
//   cookie: {
//     httpOnly: true, // default?
//     maxAge: 14 * 24 * 60 * 60 * 1000 // ms??
//   }
// };

// 3rd mwares ----------
app.use(cors());
// app.use(helmet())
if (dev) {
  app.use(morgan('dev'));
}
app.use(express.json()); // req.body
app.use(express.urlencoded({ extended: true }));
// app.use(expSession(sessOpts));
// passport
// app.use(passport.initialize());
// app.use(passport.session());

// passport.serializeUser((user, done) => {
//   done(null, user);
// });

// passport.deserializeUser((user, done) => {
//   done(null, user);
// });

// mwares
app.use('/', express.static(path.join(__dirname, 'public')));
// app.use(express.static('public'));

// routes
app.use('/', usersRoute);

// url catch - below last routes
app.use('*', (req, res, next) => {
  const error = new Error(`${req.ip} tried to access ${req.originalUrl}`);
  // error.statusCode = 301; //??

  return next(error);
});

// error handler - last middleware
app.use(errorHandler);

//listen
app.listen(port, (err) => {
  if (err) {
    console.error('error @ app.listen-', err);
    throw err;
  }
  console.log(
    `<< Exp-Server (${process.env.NODE_ENV ||
      'no-env'}) is Ready on ${ROOT_URL}!`
  );
});
