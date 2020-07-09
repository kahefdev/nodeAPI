const catchAsync = require("../utils/catchAsync");


exports.deleteOne = Model => catchAsync(async (req, res, next) => {
    let { id } = req.params;
    console.log(id);
    let tour = await Tour.findByIdAndDelete(id);
  
    if (!tour) return next(new AppError('Tour not found', 404));
  
    res
      .status(200)
      .json({ status: 'Success', message: 'User deleted successfully' });
  });

