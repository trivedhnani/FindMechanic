const mongoose = require('mongoose');
const reviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      required: [true, 'A review must contain rating'],
      min: [1, 'Minimum rating should be atleast 1'],
      max: [5, 'Maximum rating should be atmost 5']
    },
    review: {
      type: String,
      required: [true, 'You must provide review']
    },
    createdAt: {
      type: Date
    },
    mechanic: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a mechanic']
    },
    job: {
      type: mongoose.Schema.ObjectId,
      ref: 'Job',
      required: [true, 'Review must belong to a job']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A review must be given by user']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);
reviewSchema.pre('save', function(next) {
  if (this.isNew) this.createdAt = Date.now();
  next();
});
reviewSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'job',
    select: 'vehicle description'
  })
    .populate({
      path: 'mechanic',
      select: 'id name email'
    })
    .populate({
      path: 'user',
      select: 'name email'
    });
  next();
});
const Review = new mongoose.model('Review', reviewSchema);
module.exports = Review;
