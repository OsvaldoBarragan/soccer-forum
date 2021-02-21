const express = require('express')

const passport = require('passport')

const Thread = require('../models/thread')

const customErrors = require('./../../lib/custom_errors')

const handle404 = customErrors.handle404

const requireOwnership = customErrors.requireOwnership

// const removeBlanks = require('./../../lib/remove_blank_fields')

const requireToken = passport.authenticate('bearer', { session: false })

const router = express.Router()

router.post('/threads', requireToken, (req, res, next) => {
  // the owner of the new location will be the current user's id
  req.body.thread.owner = req.user.id

  Thread.create(req.body.thread)
    // respond to successful `create` with status 201 and JSON of new "location"
    .then(thread => {
      res.status(201).json({ thread: thread.toObject() })
    })
    // if an error occurs, move onto the error handler
    // the error handler needs the error message and the `res` object
    // so that it can send an error message back to the client
    .catch(next)
})

router.get('/threads', (req, res, next) => {
  Thread.find()
    .then(threads => {
      // `locations` will be an array of Mongoose documents
      // in order to convert each one to a Plain Old Java Object,
      // apply `.toObject` to each one using `.map`
      return threads.map(thread => thread.toObject())
    })
    // respond with status 200 and JSON of the examples
    .then(threads => res.status(200).json({ threads: threads }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

router.get('/threads/:id', (req, res, next) => {
  // req.params.id will be set based on the `:id` in the route
  Thread.findById(req.params.id)
    .then(handle404)
    // if `findById` is successful, respond with 200 and "location" JSON
    .then(thread => res.status(200).json({ thread: thread.toObject() }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

router.delete('/threads/:id', requireToken, (req, res, next) => {
  Thread.findById(req.params.id)
    .then(handle404)
    .then(thread => {
      // throw an error if current user doesn't own `example`
      requireOwnership(req, thread)
      // delete the example ONLY IF the above didn't throw
      thread.deleteOne()
    })
    // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

module.exports = router
