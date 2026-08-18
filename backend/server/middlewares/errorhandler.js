export const errorhandler = (err, req, res, next) => {
  res
    .status(err.status || 500)
    .json({ message: err.message || 'internal server error' });
};
export const notFound = (req, res) => {
  const error = new Error('Not Found');
  error.status = 404;
  throw error;
};
