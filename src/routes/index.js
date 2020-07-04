const express = require('express')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const { makePassword } = require('../utils')
const { getLatestMessages } = require('../controllers')
// Loading .env
require('dotenv').config()

const router = express.Router()

router.post('/login', async (req, res) => {
  const user = await User.findOne({
    username: req.body.username,
    password: req.body.password,
  })
  if (user) {
    const token = jwt.sign(
      { username: user.username },
      process.env.SERVER_SECRET,
      {
        expiresIn: '30d',
      }
    )
    const initialMessages = await getLatestMessages({
      website: req.body.website,
    })
    res.status(200).send({
      message: 'Successfully logged in',
      token,
      initialMessages,
    })
  } else {
    res.status(400).send({ message: 'User not found' })
  }
})

router.post('/register', (req, res) => {
  User.find({ username: req.body.username }, (err, user) => {
    if (err) {
      console.error(err)
      return res.status(500).json({ message: 'Something went wrong' })
    }
    if (user.length !== 0) {
      return res.status(400).json({ message: 'Username already exists' })
    }
    return User.create({
      username: req.body.username,
      password: makePassword(20),
    }).then(async user => {
      const token = jwt.sign(
        { username: user.username },
        process.env.SERVER_SECRET,
        {
          expiresIn: '30d',
        }
      )
      const initialMessages = await getLatestMessages({
        website: req.body.website,
      })
      res.status(200).json({
        message: 'User successfully created',
        initialMessages,
        token,
        username: user.username,
        password: user.password,
      })
    })
  })
})

module.exports = router
