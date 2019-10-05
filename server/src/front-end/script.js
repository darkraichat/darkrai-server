console.log('frontend running')

let socket = io()

socket.on('connection', () => {
  console.log(socket.id)
})

const current_website = 'jbejv'

$(() => {
  let inputMessage = $('#chatMessage')
  let username = $('#username')
  let sendMessage = $('#sendMessage')
  let login = $('#login')
  let msgList = $('#msgList')

  sendMessage.hide()
  inputMessage.hide()

  login.click(() => {
    socket.emit('add_user', {
      username: username.val(),
      website: current_website,
    })

    $.get('/logged', { website: current_website }, messages => {
      messages.forEach(data => {
        var str = data.date
        var date = new Date(str)
        dateTime = `${date.getDate()}-${date.getMonth() +
          1}-${date.getFullYear()}  `
        msgList.prepend(
          `<li class="list-group-item"> ${data.username}: ${data.message}  </li>`
        )
        // msgList.append(`<li class="list-group-item"> (${dateTime})${data.username}: ${data.message}  </li>`)
      })
    })

    username.hide()
    inputMessage.show()
    login.hide()
    sendMessage.show()
  })
  sendMessage.click(() => {
    socket.emit('send_M', {
      message: inputMessage.val(),
    })
  })

  socket.on('receive_M', data => {
    msgList.append(`<li> ${data.username}:${data.message} </li>`)
  })
})
