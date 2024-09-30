const notFoundMiddleware = (req, res, next) => {
  res.status(404).json({
    message: 'Not found',
  });
  next();
};

export default notFoundMiddleware;
