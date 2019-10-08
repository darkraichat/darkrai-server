const express = require('express')
const socket = require('socket.io')
const http = require('http')
const morgan = require('morgan')
const helmet = require('helmet')
const _ = require('lodash')
const { connectdb } = require('./db')
const { PythonShell } = require('python-shell')

// Declaring the express app
const app = express()

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

const addMsg = async function(username, message, website) {
  db = await connectdb('darkrai')
  const messages = db.collection('messages')
  await messages.insertOne({
    username: username,
    message: message,
    website: website,
    date: new Date(),
    flag: false,
  })
}

const updateMsg = async function(message) {
  db = await connectdb('darkrai')
  const messages = db.collection('messages')
  const result = await messages.updateOne(
    {
      message: message,
      flag: false,
    },
    { $set: { flag: true } }
  )
  console.log(result)
  console.log(messages)
}

async function readMsgs(room) {
  db = await connectdb('darkrai')
  const messages = db.collection('messages')
  const allMsg = []
  const msgArr = await messages
    .find({ website: room, flag: false })
    .sort({ date: -1 })
    .limit(20)
    .toArray()
  msgArr.forEach(m => allMsg.push(m))

  return allMsg
}

app.get('/logged', (req, res) => {
  ;(async function() {
    const m = await readMsgs(req.query.website)
    res.send(m.reverse())
  })()
})

async function getRooms() {
  db = await connectdb('darkrai')
  const room = await db
    .collection('rooms')
    .find({})
    .toArray()
  const allRooms = []
  room.forEach(r => allRooms.push(r.website))

  return allRooms
}
let rooms
;(async function() {
  rooms = await getRooms()
})()

const addRoom = async function(website) {
  db = await connectdb('darkrai')
  const rooms = db.collection('rooms')
  await rooms.insertOne({
    website: website,
    date: new Date(),
  })
}

io.sockets.on('connection', socket => {
  console.log('Connection Established ', socket.id)

  socket.on('add_user', data => {
    socket.username = data.username
    socket.room = data.website

    if (rooms.includes(socket.room)) {
      socket.join(socket.room)
    } else {
      rooms.push(socket.room)
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
