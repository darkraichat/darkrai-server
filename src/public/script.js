/*
Testing frontend
*/

const socket = io()

socket.on('connection', () => {
  console.log(socket.id)
})

const current_website = 'darkrai-test.com'

$(() => {
  const inputMessage = $('#chatMessage')
  const username = $('#username')
  const sendMessage = $('#sendMessage')
  const login = $('#login')
  const msgList = $('#msgList')
  const disconnect = $('#disconnect')

  sendMessage.hide()
  inputMessage.hide()
  disconnect.hide()

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
      })
    })

    username.hide()
    inputMessage.show()
    login.hide()
    sendMessage.show()
    disconnect.show()
  })
  sendMessage.click(() => {
    socket.emit('send_M', {
      message: inputMessage.val(),
    })
  })
  disconnect.click(() => {
    socket.emit('Disconnect', {
      website: current_website,
    })
    window.location = 'http://localhost:4848/test.html'
  })

  socket.on('receive_M', data => {
    msgList.append(`<li> ${data.username}:${data.message} </li>`)
  })
})
