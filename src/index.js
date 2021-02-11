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
const {PythonShell} =require('python-shell')
//const toxicity = require('@tensorflow-models/toxicity')
// tfjs node backend initialization
// require('@tensorflow/tfjs-node')

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
  .catch((error) => console.log('MongoDB Error:\n', error))
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
  .use(function (socket, next) {
    if (socket.handshake.query && socket.handshake.query.token) {
      jwt.verify(
        socket.handshake.query.token,
        process.env.SERVER_SECRET,
        function (err, decoded) {
          if (err) return next(new Error('Authentication error'))
          socket.decoded = decoded
          next()
        }
      )
    } else {
      next(new Error('Authentication error'))
    }
  })
  .on('connection', function (socket) {
    console.log('Connection Established ', socket.id)
    socket.on('add_user', async function (data) {
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

    socket.on('send_message', (data) => {
      //console.log(socket.id);
      // tfjs toxicity model prediction
      // toxicity.load().then((model) => {
      //   model.classify(data.message).then((predictions) => {
      //     if (predictions[predictions.length - 1].results[0].match) {
      //       console.log('Toxic message detected. Deleting now...')
      //       io.sockets.in(socket.room).emit('delete_message', {
      //         message: data.message,
      //       })
      //       controllers.updateMessage(data.message)
      //     }
      //   })
      // })

      controllers.addMessage(socket.username, data.message, socket.room)
      io.sockets.in(socket.room).emit('receive_message', {
        username: socket.username,
        message: data.message,
      })

      // ChatBot code 
      const check = data.message.toString();
      if(check[0].toLowerCase()==='c' && check[1].toLowerCase()==='b' && check[2]==='-'){
      const search = check.slice(3);
      let options = { 
        mode: 'text', 
        pythonOptions: ['-u'], // get print results in real-time 
        scriptPath: 'src/', //If you are having python_test.py script in same folder, then it's optional. 
        args: [search] //An argument which can be accessed in the script using sys.argv[1] 
      }; 
      let msg='' // Chatbot response
      PythonShell.run('chatBot.py', options, function (err, result){ 
        if (err) res.send(err.message); 
          const len = result.length;
          const response = result[len-1];
          msg = response.toString();
          console.log('result: ', msg); 
          io.sockets.in(socket.room).emit('receive_message',{
            username: 'ChatBot',
            message: msg
          })
        // res.send(response.toString()) 
      })
    }
    })

    socket.on('disconnect', (data) => {
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
