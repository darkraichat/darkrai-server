const express = require('express')
const socket = require('socket.io')
const http = require('http')

const app = express()
const server = http.createServer(app)

const io = socket(server)

const { connectdb } = require('./db')

// app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

var addMsg = async function(username, message, website) {
  db = await connectdb('darkrai')
  const messages = db.collection('messages')
  const result = await messages.insertOne({
    username: username,
    message: message,
    website: website,
    date: new Date(),
  })
  // console.log(result)
}
async function readMsgs(room) {
  db = await connectdb('darkrai')
  const messages = db.collection('messages')
  const msgArr = await messages
    .find({ website: room })
    .sort({ date: -1 })
    .limit(20)
    .toArray()
  const allMsg = []
  msgArr.forEach(m => allMsg.push(m))

  return allMsg
}

app.get('/logged', (req, res) => {
  ;(async function() {
    const m = await readMsgs(req.query.website)
    res.send(m)
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
  console.log(rooms)
})()

var addRoom = async function(website) {
  db = await connectdb('darkrai')
  const rooms = db.collection('rooms')
  const result = await rooms.insertOne({
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
      console.log(rooms)
    } else {
      rooms.push(socket.room)
      addRoom(socket.room)
      socket.join(socket.room)
    }
  })

  socket.on('send_M', data => {
    addMsg(socket.username, data.message, socket.room)
    io.sockets.in(socket.room).emit('receive_M', {
      username: socket.username,
      message: data.message,
    })
  })
})

app.use('/', express.static(__dirname + '/front-end'))

server.listen(4848, () => {
  console.log('Server started on http://localhost:4848')
})
