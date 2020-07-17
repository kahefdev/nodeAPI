//review/rating/createdAt/ref to tour/ref to user;
const mongoose = require('mongoose')
const Tour = require('../model/toursModel');

const reviewSchema =new mongoose.Schema({
   
    review:{
        type:String,
        required:true,
    },
    rating:{
        type:Number,
        required:true,
    },
    createdAt:{
        type:Date,
        default:new Date(),
    },
    tour:
        {
            type:mongoose.Schema.ObjectId,
            ref : 'Tour',
        }
    ,
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
    },
}, {strict:false}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
  )
  reviewSchema.statics.calcAverageRating = async function(tourId){
      const stats = await this.aggregate([{
          $match:{tour:tourId}
      },{$group:{
          _id:'$tour',
          nRating:{$sum : 1},
          averageRating : {$avg : '$rating'}
      }}])

      await Tour.findByIdAndUpdate(tourId,{
          ratingQuantity:stats[0].nRating,
          ratingsAverage:stats[0].averageRating,
      })

    console.log(stats);
    };



reviewSchema.pre(/^find/,function(next){
    this.populate({path:'user',select:'name -_id'}).populate({path:'tour'})
    next();
})

reviewSchema.post('save',function(){
    this.constructor.calcAverageRating(this.tour); 
})

const Review = mongoose.model('Review',reviewSchema);

module.exports = Review;