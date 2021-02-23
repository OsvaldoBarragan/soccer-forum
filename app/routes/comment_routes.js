
const express = require('express')
const Thread = require('../models/thread')
const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const removeBlanks = require('../../lib/remove_blank_fields')
const passport = require('passport')
const requireToken = passport.authenticate('bearer', { session: false })

// create our router
const router = express.Router()
// Show & Index can be done, by fetching a location
// CREATE
router.post('/comments', requireToken, (req, res, next) => {
  // extract the review from the incoming request's data (req.body)
  const commentData = req.body.comment
  // extract the location's id
  const threadId = commentData.threadId
  Thread.findById(threadId)
    .then(handle404)
    .then(thread => {
      thread.comments.push(commentData)
      // save the location, so our new review is saved
      return thread.save()
    })
  // finally respond with a status of 201 created and the location that
  // includes our newly added review
    .then(thread => res.status(201).json({ thread }))
  // if an error occurs, go to the next middleware (which is the error handler)
    .catch(next)
})
router.delete('/comments/:commentId', requireToken, (req, res, next) => {
  // extract the reviewId
  const commentId = req.params.commentId
  // extract the locationId
  const threadId = req.body.comment.threadId
  Thread.findById(threadId)
    .then(handle404)
    .then(thread => {
      // remove the review from the restaurant's reviews subdocument array
      thread.comments.id(commentId).remove()
      // save the review's parent document (location) to ensure it is deleted
      return thread.save()
    })
    // respond with the status code 204 No Content (since the review was deleted)
    .then(() => res.sendStatus(204))
    // .then(() => res.status(200).send('Successfully Deleted'))
    .catch(next)
})
// Update
router.patch('/comments/:commentId', requireToken, removeBlanks, (req, res, next) => {
  // extract the reviewId
  const commentId = req.params.commentId
  // extract the review from the incoming request's data (req.body)
  const commentData = req.body.comment
  // extract the locationId
  const threadId = req.body.comment.threadId
  Thread.findById(threadId)
    .then(handle404)
    .then(thread => {
      // find the review whose id is reviewId inside of the reviews subdocument array
      const comment = thread.comments.id(commentId)
      // set the review subdocument's data to the incoming data (reviewData)
      comment.set(commentData)
      // save the review's parent document (location) so the review is saved
      return thread.save()
    })
    // respond with a successful 204 No Content
    .then(() => res.sendStatus(204))
    // respond with the updated data
    // .then(location => res.json({ location }))
    .catch(next)
})
// export the router
module.exports = router
