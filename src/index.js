const express = require('express')
const socket = require('socket.io')
const http = require('http')
const morgan = require('morgan')
const helmet = require('helmet')
const mongoose = require('mongoose')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const Room = require('./models/room')
const indexRoutes = require('./routes')
const controllers = require('./controllers')
const toxicity = require('@tensorflow-models/toxicity')

// tfjs node backend initialization
require('@tensorflow/tfjs-node')

// Loading .env
require('dotenv').config()

// Declaring the express app
const app = express()

// Connecting to Database
const dbUrl = process.env.DB_URL || ''
const dbName = process.env.DB_NAME || ''
mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName,
  })
  .then(() => console.log('Connected to MongoDB...'))
  .catch(error => console.log('MongoDB Error:\n', error))
mongoose.set('useCreateIndex', true)

// Morgan for logging requests
app.use(morgan('combined'))

// A little security using helmet
app.use(helmet())

// CORS
app.use(cors())

// Socket.io integration with express
const server = http.createServer(app)

// Creating the socket
const io = socket(server)

// JSON parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Users count for each room
const rooms = {}

io.sockets
  .use(function(socket, next) {
    if (socket.handshake.query && socket.handshake.query.token) {
      jwt.verify(
        socket.handshake.query.token,
        process.env.SERVER_SECRET,
        function(err, decoded) {
          if (err) return next(new Error('Authentication error'))
          socket.decoded = decoded
          next()
        }
      )
    } else {
      next(new Error('Authentication error'))
    }
  })
  .on('connection', function(socket) {
    console.log('Connection Established ', socket.id)
    socket.on('add_user', async function(data) {
      socket.username = data.username
      socket.room = data.website

      const roomExist = await Room.exists({ website: socket.room })

      if (roomExist) {
        socket.join(socket.room)
      } else {
        controllers.addRoom(socket.room)
        socket.join(socket.room)
      }

      if (!rooms[data.website]) {
        rooms[data.website] = 1
      } else {
        rooms[data.website]++
      }
      console.log('Number of users in', socket.room, ':', rooms[socket.room])
    })

    socket.on('send_message', data => {
      // tfjs toxicity model prediction
      toxicity.load().then(model => {
        model.classify(data.message).then(predictions => {
          if (predictions[predictions.length - 1].results[0].match) {
            console.log('Toxic message detected. Deleting now...')
            io.sockets.in(socket.room).emit('delete_message', {
              message: data.message,
            })
            controllers.updateMessage(data.message)
          }
        })
      })

      controllers.addMessage(socket.username, data.message, socket.room)
      io.sockets.in(socket.room).emit('receive_message', {
        username: socket.username,
        message: data.message,
      })
    })

    socket.on('disconnect', data => {
      console.log('User Disconnected')
      rooms[data.website]--
      console.log('Number of users in', socket.room, ':', rooms[socket.room])
    })
  })

// Specifying routes
app.use('/', indexRoutes)

const port = process.env.PORT || 4848

server.listen(port, () => {
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${port}...`
  )
})
