module.exports = (err, req, res, next) => {
  console.log(err.stack);
  console.log('GLOBAL ERROR HANDLER:', err.message);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({ status: err.status, message: err.message });
};
0