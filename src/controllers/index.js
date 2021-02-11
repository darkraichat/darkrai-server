const Message = require('../models/message')
const Room = require('../models/room')
const addMessage = function (username, message, website) {
  const newMessage = {
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

const updateMessage = function (message) {
  const updatedMessage = {
    message,
    hateSpeechFlag: false,
  }
  Message.findOneAndUpdate(
    updatedMessage,
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

const addRoom = function (website) {
  const room = {
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

const getLatestMessages = async ({ website }) => {
  const room = {
    website,
    hateSpeechFlag: false,
  }
  const messages = await Message.find(room)
  return messages.splice(0, 50)
}

module.exports = {
  addMessage,
  addRoom,
  updateMessage,
  getLatestMessages,
}
