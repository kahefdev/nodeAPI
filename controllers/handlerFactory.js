const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

exports.deleteOne = Model => catchAsync(async (req, res, next) => {
    let { id } = req.params;
    let doc = await Model.findByIdAndDelete(id);
    if (!doc) return next(new AppError('Tour not found', 404));
  
    res
      .status(200)
      .json({ status: 'Success', message: 'Item deleted successfully' });
  });


  exports.updateOne = Model => catchAsync(async (req, res) => {
    try {
      const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      res.status(200).json({
        message: 'success',
        data: doc,
      });
    } catch (err) {
      res.status(400).json({
        message: 'error',
        data: err,
      });
    }
  });
  