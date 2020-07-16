const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const APIfeatures = require("../utils/APIfeatures");

exports.createOne = Model =>catchAsync(async(req,res,next)=>{

  let doc = await Model.create(req.body);

  res.status(201).json({
    status:'Success',
    data:doc,
  })
})

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
  


  exports.getAll = Model =>catchAsync(async (req, res) => {
    console.log(req.query);
    
      const features = new APIfeatures(Model.find(), req.query)
        .filter()
        .sort()
        .fields()
        .paginate();
      const doc = await features.query;
    
      res.status(200).json({
        status: 'success',
        entries: doc.length,
        data: {
          doc
        },
      });
    });

    exports.getOne = Model => catchAsync(async (req, res, next) => {
      console.log()
      console.log(req.user.id);
      const doc = await Model.findById(req.user.id);
    
      if (!doc) {
        return next(new AppError('Tour not found', 404));
      }
    
      res.status(200).json({
        status: 'success',
        data: doc,
      });
    });
    