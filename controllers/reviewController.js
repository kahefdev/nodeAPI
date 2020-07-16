const Review = require('../model/reviewModel.js');
const Factory = require('../controllers/handlerFactory');
// const catchAsync = require('../utils/catchAsync.js');;

exports.setTourUserIds = (req,res,next) =>{
    if(!req.body.tour) req.body.tour = req.params.tourId;

    if(!req.body.user) req.body.user = req.user.id;

    next();

}


exports.oneReview =Factory.getOne(Review);

exports.getReview = Factory.getAll(Review);

exports.updateReviw = Factory.updateOne(Review);
exports.deleteReview = Factory.deleteOne(Review);
exports.createReview = Factory.createOne(Review);