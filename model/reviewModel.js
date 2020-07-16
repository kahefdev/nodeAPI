//review/rating/createdAt/ref to tour/ref to user;
const mongoose = require('mongoose')

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
    tour:[
        {
            type:mongoose.Schema.ObjectId,
            ref : 'Tour',
        }
    ],
    user:[{
        type:mongoose.Schema.ObjectId,
        ref:'User',
    }],
}, {strict:false}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }

  )


const Review = mongoose.model('Review',reviewSchema);

module.exports = Review;