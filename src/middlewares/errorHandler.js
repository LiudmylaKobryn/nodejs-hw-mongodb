const errorHandlerMiddleware = (err, req, res, next) => {
  res.status(500).json({
    message: 'Something wrong',
    error: err.message,
  });
};

export default errorHandlerMiddleware;
