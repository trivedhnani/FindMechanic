const mongoose = require('mongoose');
const jobSchmea = new mongoose.Schema(
  {
    vehicle: {
      type: String,
      required: [true, 'Vechicle model should be specified'],
      enum: ['car', 'bike']
    },
    description: {
      type: String,
      required: [true, 'A job should have description']
    },
    createdAt: {
      type: Date
    },
    status: {
      type: String,
      default: 'pending',
      enum: ['pending', 'accepted', 'completed']
    },
    location: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String
    },
    mechanic: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    acceptedAt: Date,
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A user should create a job']
    },
    review: {
      type: mongoose.Schema.ObjectId,
      ref: 'Review'
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);
jobSchmea.pre('save', function(next) {
  if (this.isNew) {
    this.createdAt = Date.now();
  }
  next();
});
jobSchmea.pre(/^find/, function(next) {
  next();
});
const Job = new mongoose.model('Job', jobSchmea);
module.exports = Job;
