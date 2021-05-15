const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
// const helmet = require('helmet');

const { connectMDB } = require('./db');
const { errorHandler } = require('./utils/error-handler.utils');

// config, process.env
dotenv.config({ path: './.env.dev.local' });

// connect mongodb + more .catch()
connectMDB().catch((err) => console.error(err.stack()));

// init express app
const app = express();

// import routes
const usersRoute = require('./routes/user.route');

// setting vars, options, env
const PORT = parseInt(process.env.PORT || 3000, 10);
const NODE_ENV = process.env.NODE_ENV || 'none';

// 3rd mwares
app.use(cors());
// app.use(helmet())
app.use(morgan('dev'));
app.use(express.json()); // req.body
app.use(express.urlencoded({ extended: true }));

// mwares
app.use(express.static('public'));

// routes
app.use('/', usersRoute);

// url catch - below last routes
app.use('*', (req, res, next) => {
  const error = new Error(`${req.ip} tried to access ${req.originalUrl}`);
  error.statusCode = 301; //??

  return next(error);
});

// error handler - last middleware
app.use(errorHandler);

//listen
app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`<< Exp-Server running @ http://127.0.0.1:${PORT}/`);
});
