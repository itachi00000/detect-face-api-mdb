const getUniqueErrorMessage = (err) => {
  let output = '';

  try {
    const fieldName = err.message.substring(
      err.message.lastIndexOf('.$') + 2,
      err.message.lastIndexOf('_1')
    );
    output = `${fieldName.charAt(0).toUpperCase()}${fieldName.slice(
      1
    )} already exists`;
  } catch (ex) {
    output = 'Unique field already exists';
  }

  return output;
};

const getErrorMessage = (err) => {
  let message = '';

  if (err.code) {
    switch (err.code) {
      case 11000:
      case 11001:
        message = getUniqueErrorMessage(err);
        break;
      default:
        message = 'Something went wrong';
    }
  } else {
    for (const errName in err.errors) {
      if (err.errors[errName].message) message = err.errors[errName].message;
    }
  }
  return message;
};

const errorHandler = (error, req, res, next) => {
  const errorStatusCode = error.statusCode || 500;
  const errorReason = error.reason && error.reason.toString();

  if (error.reason) {
    console.error('| ==-- Error-Reason --== |:', errorReason);
  }

  console.error('| ==--- MyErrorStack ---== |:', error.stack);

  // sent to default express errorHandler???
  if (res.headersSent) {
    console.log('* * * * -Header Sent-');
    return next(error);
  }

  // jwt-express's error-handling
  if (error.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: `${error.name} : ${error.message}`
    });
  }

  // casterror
  // not useful
  if (error.name === 'CastError') {
    const { value, path } = error;
    console.log(`${path}:${value} is not Found`);
  }

  // NotFound Error
  if (errorStatusCode === 301) {
    console.log('* * * * * -Redirects-');
    return res.status(301).redirect('/not-found');
  }

  // clientError??
  if (req.xhr) {
    console.log('xhr!!!');
    return res.status(500).json({ error: 'Something failed - xhr jquery' });
  }

  // general error
  return res.status(errorStatusCode).json({
    errorHandler: { errorMsg: error.toString(), reason: errorReason }
  });
};

module.exports = { getErrorMessage, errorHandler };
