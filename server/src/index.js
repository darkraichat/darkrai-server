const express = require('express')
const socket = require('socket.io')
const http = require('http')

const app = express()
const server = http.createServer(app)

const io = socket(server)

const {connectdb}=require('./db')

// app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))





var addMsg= async function (username,message){
    db=await connectdb('darkrai')
    const messages=db.collection('messages')
    const result=await messages.insertOne({
            username:username,
            message:message,
            website:"abc.com",
            date:new Date()
    })
    // console.log(result)
}
async function readMsgs() {
    db=await connectdb('darkrai')
    const messages = db.collection('messages')
    const msgArr = await messages.find({}).sort({date: -1}).toArray()
    const allMsg=[]
    msgArr.forEach((m) => allMsg.push((m)))

    return allMsg
}



app.get('/logged',(req,res)=>{
    (async  function(){
        const m=await ( readMsgs())
        res.send(m)
    })()
})
io.on('connection', (socket) => {
    console.log("Connection Established ", socket.id )



    socket.on("send_ID",(data)=>{
        let userName=data.username
        socket.on("send_M",(data)=>{

            addMsg(userName,data.message)
            // console.log("data received ",data.message)

            io.emit("receive_M", {
                message: data.message,
                username:userName
            })
        })

    })

})

app.use('/', express.static(__dirname + '/front-end'))

server.listen(4848, () => {
    console.log("Server started on http://localhost:4848")
})




// io.emit sends to all
// socket.emit sends to only itself
// socket.broadcast.emit sends to all but itself
// io.to[].emit




