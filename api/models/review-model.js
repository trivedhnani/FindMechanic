const mongoose = require('mongoose');
const User = require('./user-model');
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
// Enforcing unique review for each user job pair
reviewSchema.index({ user: 1, job: 1 }, { unique: true });
reviewSchema.pre('save', function(next) {
  if (this.isNew) this.createdAt = Date.now();
  next();
});
// After we save a new review we have to calculate average ratings and assign them to mechanics
reviewSchema.post('save', async function() {
  await this.constructor.calcRatings(this.mechanic);
});
// We have to write findOneAnd because we are using findOne internally, causes recursion
// findById is internally findOneAnd. So hooks work fine
reviewSchema.pre(/^findOneAnd/, async function(next) {
  this.mechanicDoc = await this.model.findOne(this.getQuery());
  console.log(this.mechanicDoc);
  next();
});
reviewSchema.post(/^findOneAnd/, async function() {
  await this.mechanicDoc.constructor.calcRatings(this.mechanicDoc.id);
});
// Be sure to not use arrow functions in model since it explixitly sets the this variable
reviewSchema.statics.calcRatings = async function(mechId) {
  const stats = await this.aggregate([
    {
      $match: { mechanic: mechId }
    },
    {
      $group: {
        _id: '$mechanic',
        nRatings: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);
  // console.log(stats);
  if (stats.length > 0) {
    // Do not call findOneAndUpdate as it calls pre find hook again and that calls this static function again
    await User.findByIdAndUpdate(mechId, {
      ratingsQuantity: stats[0]['nRatings'],
      averageRating: stats[0]['avgRating']
    });
  } else {
    await User.findByIdAndUpdate(mechId, {
      ratingsAverage: 0, // If every review is deleted then these are the default
      ratingsQuantity: 4.5
    });
  }
};
const Review = new mongoose.model('Review', reviewSchema);
module.exports = Review;
