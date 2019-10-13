const express = require('express')
const router = express.Router()
const Message = require('../models/message')

router.get('/logged', (req, res) => {
  room = {
    website: req.query.website,
    hateSpeechFlag: false,
  }
  Message.find(room, (err, messages) => {
    res.send(messages.reverse())
  })
})

module.exports = router
