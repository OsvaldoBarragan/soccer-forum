const mongoose = require('mongoose')
const commentSchema = require('./comment')

const threadSchema = new mongoose.Schema({
  title: {
    // require title to use a string type
    type: String,
    required: true
  },
  post: {
    // require post to use a string type
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  comments: [commentSchema],
  owner: {
    // the reference type
    type: mongoose.Schema.Types.ObjectId,
    // when the owner is populated, use the User model
    ref: 'User',
    required: true
  }
}, {
  // timestamps will give you the createdAt and
  // updatedAt in the document
  timestamps: true
})

// create a model for the TestLocation
// export the TestLocation model so it can be used in it's routes file
module.exports = mongoose.model('Thread', threadSchema)
