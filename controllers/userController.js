const User = require('../model/userModel.js');
const catchAsync = require('../utils/catchAsync.js');
const AppError = require('../utils/AppError.js');
const Factory = require("../controllers/handlerFactory");



exports.getMe = (req,res,next)=>{
    console.log('Inside getme')
      req.user.id = req.params.id;
      next();
}

exports.getUserId = (req, res) => {
  res.status(500).json({
    status: 'erro',
    message: 'This route is not yet defined',
  });
};


const filterObj = (dataObj, filterObj) => {
  let filteredObj = {};
  console.log(Object.keys(dataObj));
  Object.keys(dataObj).forEach((el) => {
    console.log(el);
    if (filterObj.includes(el)) {
      console.log(el);
      filteredObj[el] = dataObj[el];
    }
  });
  console.log(filteredObj);
  return filteredObj;
};

exports.deleteMe = catchAsync(async (req, res, next) => {
  console.log('Delete Function Invoked');
  console.log(req.user.id);
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(200).json({ status: 'Success', message: null });
});

//Only for administrators

exports.getUser = Factory.getOne(User);

exports.updateUser = Factory.updateOne(User);

exports.deleteUser = Factory.deleteOne(User);

exports.getAllUsers = Factory.getAll(User);

// exports.updateUser = catchAsync(async (req, res, next) => {
  //   console.log(req.body);
  //   if (req.body.password || req.body.connfirmPassword)
  //     return next(
    //       new AppError('Password cannot be updated, something went wrong', 400)
    //     );
    
    //   let userData = filterObj(req.body, ['name', 'email']);
//   console.log(userData);
//   let userUpdated = await User.findByIdAndUpdate(req.user.id, userData, {
//     new: true,
//     runValidators: true,
//   });

//   res.status(200).json({ status: 'Success', data: userUpdated });

//   // res.json(userUpdated);
// });
