const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
  body: {
    type: String,
    required: true
  },
  owner: {
    // the reference type
    type: mongoose.Schema.Types.ObjectId,
    // when the owner is populated, use the User model
    ref: 'User',
    required: true
  }
}, {
  // options go in the second object
  timestamps: true
})

// exporting the reviewSchema, so that we can use it in our locationSchema
module.exports = commentSchema
