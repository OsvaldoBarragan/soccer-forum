const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
  body: {
    type: String,
    required: true
  }
}, {
  // options go in the second object
  timestamps: true
})

// exporting the reviewSchema, so that we can use it in our locationSchema
module.exports = commentSchema
