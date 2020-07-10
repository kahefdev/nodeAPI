const Review = require('../model/reviewModel.js');
const catchAsync = require('../utils/catchAsync.js');;

exports.createReview = catchAsync(async(req,res,next)=>{
        const newReview = await Review.create(req.body);
        res.status(201).json({ status:"Success",data:newReview});
}
)

exports.getReview = catchAsync(async(req,res,next)=>{
    let allReviews = await Review.find().populate([{path:'user',select:'name'},{path:'tour',select:"name"}]);
    res.status(200).json({status:"success",data:allReviews});
})