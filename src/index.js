const express = require('express')
const socket = require('socket.io')
const http = require('http')
const morgan = require('morgan')
const helmet = require('helmet')
const mongoose = require('mongoose')
const _ = require('lodash')
const { PythonShell } = require('python-shell')
const Message = require('./models/message')
const Room = require('./models/room')
var rooms = []
require('dotenv').config()

// Declaring the express app
const app = express()

// Connecting to Database
mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch(error => console.log(error))

mongoose.set('useCreateIndex', true)

// Morgan for logging requests
app.use(morgan('tiny'))

// A little security using helmet
app.use(helmet())

// Socket.io integration with express
const server = http.createServer(app)

// Creating the socket
const io = socket(server)

// JSON parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

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

app.get('/logged', (req, res) => {
  room = {
    website: req.query.website,
    hateSpeechFlag: false,
  }
  Message.find(room, (err, messages) => {
    res.send(messages.reverse())
  })
})

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

io.sockets.on('connection', function(socket) {
  console.log('Connection Established ', socket.id)
  socket.on('add_user', async function(data) {
    socket.username = data.username
    socket.room = data.website

    roomExist = await Room.exists({ website: socket.room })

    if (roomExist) {
      socket.join(socket.room)
    } else {
      addRoom(socket.room)
      socket.join(socket.room)
    }
  })

  socket.on('send_M', data => {
    let options = {
      args: [data.message],
      scriptPath: './python/',
    }
    console.log(data)
    PythonShell.run('prediction_model.py', options, function(err, result) {
      if (err) {
        console.log(err)
      } else {
        const temp = result[0].split(' ')
        if (Number(temp[0]) > 0.55 || Number(temp[1]) > 0.55) {
          io.sockets.in(socket.room).emit('delete_message', {
            message: data.message,
          })
          updateMsg(data.message)
        }
      }
    })

    _.debounce(function() {
      PythonShell.run('chatbot.py', options, function(err, result) {
        if (err) {
          console.log(err)
        } else {
          addMsg('frenzybot', result[0], socket.room)
          io.sockets.in(socket.room).emit('receive_M', {
            username: 'frenzybot',
            message: result[0],
          })
        }
      })
    }, 60000)

    addMsg(socket.username, data.message, socket.room)
    io.sockets.in(socket.room).emit('receive_M', {
      username: socket.username,
      message: data.message,
    })
  })
})

// Serving public folder
app.use('/', express.static(__dirname + '/public'))

const port = process.env.PORT || 4848

server.listen(port, () => {
  console.log(`Server running on port ${port}...`)
})
