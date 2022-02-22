module.exports = app => {
  app.use((req, res, next) => {
    // This middleware throws an error, so Express will go straight to
    // the next error handler
    setImmediate(() => { next(new Error('Woops! route not found...')); });
  });

  app.use((err, req, res, next) => {
    // Any request to this server will get here, and will send an HTTP
    // response with the error message 'woops'
    // res.status(error.status || 500);

    if (typeof (err) === 'string') {
      // custom application error
      return res.status(400).json({
        error: true,
        message: err.message,
        data: {}
      });
    }

    if (err.message && err.status) {
      return res.status(err.status).json({
        error: true,
        message: err.message,
        data: {}
      });
    }

    if (err.name === 'UnauthorizedError') {
      // jwt authentication error
      return res.status(401).json({
        error: true,
        message: "Invalid Token",
        data: {}
      });
    }

    // default to 500 server error
    return res.status(500).json({
      error: true,
      message: err.message,
      data: {}
    });
  });
}