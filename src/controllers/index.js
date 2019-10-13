const Message = require('../models/message')
const Room = require('../models/room')

const addMsg = function(username, message, website) {
  var newMessage = {
    username,
    message,
    website,
    date: new Date(),
  }

  Message.create(newMessage, (err, message) => {
    if (err) {
      console.log(err)
    } else {
      console.log('Message added')
    }
  })
}

const updateMsg = function(message) {
  var message = {
    message,
    hateSpeechFlag: false,
  }
  Message.findOneAndUpdate(
    message,
    { $set: { hateSpeechFlag: true } },
    (err, updatedMessage) => {
      if (err) {
        console.log(err)
      } else {
        console.log(updatedMessage)
      }
    }
  )
}

const addRoom = function(website) {
  var room = {
    website,
    date: new Date(),
  }
  Room.create(room, (err, newRoom) => {
    if (err) {
      console.log(err)
    } else {
      console.log('Added new room')
    }
  })
}

module.exports = {
  addMsg,
  addRoom,
  updateMsg,
}
