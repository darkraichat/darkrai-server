console.log("frontend running ")

let socket=io()

socket.on('connected',()=>{
    console.log(socket.id)
})


$(()=>{
    let inputMessage=$("#chatMessage")
    let username=$("#username")
    let sendMessage=$('#sendMessage')
    let login=$("#login")
    let msgList=$('#msgList')

    sendMessage.hide()
    inputMessage.hide()

    login.click(()=>{
        socket.emit('send_ID',{
            username:username.val(),
            // userId=socket.id
        })

        $.get( "/logged", ( messages ) =>{

            messages.forEach(data => {
                var str = data.date
                var date = new Date(str);
                dateTime=`${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}  `
                msgList.prepend(`<li class="list-group-item"> ${data.username}: ${data.message}  </li>`)
                // msgList.append(`<li class="list-group-item"> (${dateTime})${data.username}: ${data.message}  </li>`)
            });
        });

        username.hide()
        inputMessage.show()
        login.hide()
        sendMessage.show()
    })
    sendMessage.click(()=>{
        socket.emit('send_M',{
            message:inputMessage.val()
        })

    })

    socket.on('receive_M',(data)=>{
        msgList.append(`<li> ${data.username}:${data.message} </li>`)
    })
})


