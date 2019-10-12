const mongoose = require('mongoose')

var roomSchema = new mongoose.Schema({
  website: {
    type: String,
    required: true,
    unique: true,
  },
  date: {
    type: Date,
    required: true,
  },
})

module.exports = mongoose.model('Room', roomSchema)
