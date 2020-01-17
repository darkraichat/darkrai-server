const { makeGhostPassword } = require('../utils')
const express = require('express')

const router = express.Router()

const Message = require('../models/message')
const User = require('../models/user')

router.get('/login', (req, res) => {
  const room = {
    website: req.query.website,
    hateSpeechFlag: false,
  }
  Message.find(room, (err, messages) => {
    if (err) {
      console.log(err)
    }
    if (messages.length <= 50) {
      res.send(messages)
    } else {
      const limMessages = messages.slice(messages.length - 50)
      res.send(limMessages)
    }
  })
})

router.post('/register', (req, res) => {
  User.find({ username: req.body.username }, (err, user) => {
    if (err) {
      console.error(err)
      return res
        .status(500)
        .json({ message: 'Something went wrong', error: true })
    }
    if (user) {
      return res
        .status(200)
        .json({ message: 'Username already exists', error: true, exists: true })
    }
    return User.create({
      username: req.body.username,
      ghostPassword: makeGhostPassword(20),
    }).then(user =>
      res.status(200).json({
        message: 'User successfully created',
        ghostPassword: user.ghostPassword,
      })
    )
  })
})

module.exports = router
