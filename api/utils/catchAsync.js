const catchAsync = fn => {
  return (req, res, next) =>
    fn(req, res, next).catch(err => {
      res.status(401).json({
        status: 'fail',
        message: err
      });
    });
};
module.exports = catchAsync;
