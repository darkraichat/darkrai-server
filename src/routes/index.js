const express = require('express')
const router = express.Router()
const Message = require('../models/message')

router.get('/logged', (req, res) => {
  room = {
    website: req.query.website,
    hateSpeechFlag: false,
  }
  Message.find(room, (err, messages) => {
    if (err) {
      console.log(err)
    }
    if (messages.length <= 50) {
      res.send(messages.reverse())
    } else {
      limMessages = messages.slice(messages.length - 50)
      res.send(limMessages.reverse())
    }
  })
})

module.exports = router
