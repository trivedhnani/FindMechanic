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
const Review = new mongoose.model('Review', reviewSchema);
module.exports = Review;
