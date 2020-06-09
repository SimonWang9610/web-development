
function divEscapsedContentElement(message) {
    return $('<li class="user-message"></li>').text(message);
}

function divSystemContentElement(message) {
    return $('<li class="system-message"></li>').html('<b><i>' + message + '</i></b>');
}

function processUserInput(chatApp) {
    let message = $('#send-message').val();
    // let systemMessage;
    
    // if (message.charAt(0) == '/') {
    //     systemMessage = chatApp.processCommand(message);
    //     if (systemMessage) {
    //         $('#messages').append(divSystemContentElement(systemMessage));
    //     }
    // } else {
    //     chatApp.sendMessage($('#room').text(), message);
    //     $('#messages ul').append(divEscapsedContentElement(message));
    //     $('#messages').scrollTop($('#messages').prop('scrollheight'));
    // }
    chatApp.sendMessage($('#room').text(), message);
    let anchor = new Date();
    let time = anchor.getHours() + ':' + anchor.getMinutes() + ':' + anchor.getSeconds()
    $('#messages ul').append(divEscapsedContentElement('You said: '+ message + ' @(' + time +')'));
    $('#messages').scrollTop($('#messages').prop('scrollheight'));
    $('#send-message').val('');
}

function createNewRoom(chatApp, newRoom) {
    chatApp.changeRoom(newRoom);
}

function changeNickName(chatApp, name) {
    chatApp.changeName(name);
}

let socket = io.connect('http://localhost:8000');
console.log('connected to server!')
$(document).ready(() => {
    let chatApp = new Chat(socket);
    socket.on('nameResult', (result) => {
        let message;
        if (result.success) {
            message = 'You are now known as: ' + result.name + '.';
        } else {
            message = result.message;
        }
        $('#messages ul').append(divSystemContentElement(message));
        $('#nickname').text(result.name);
    });

    socket.on('joinResult', (result) => {
        $('#room').text(result.room);
        let note = 'Room changed to: ' + result.room;
        $('#messages ul').append(divSystemContentElement(note));
        $('#current-room').text(result.room);
    });

    // socket.on('messageSummary', (summary) => {
    //     if (summary.success) {
    //         $('#room').append($('<span></span>').text(summary.text));
    //     }
    // });
    
    socket.on('message', (message) => {
        // let anchor = new Date();
        // let time = anchor.getHours() + ':' + anchor.getMinutes() + ':' + anchor.getSeconds();
        // $('#messages ul').append(divEscapsedContentElement(message.text + ' @(' + time + ')'));
        if (message.author === 'system') {
            $('#messages ul').append(divSystemContentElement(message.text));
        } else{
            let anchor = new Date();
            let time = anchor.getHours() + ':' + anchor.getMinutes() + ':' + anchor.getSeconds();
            $('#messages ul').append(divEscapsedContentElement(message.author + ' @(' + time + '): ' + message.text))
        }
    });
    
    
    // socket.on('userRoom', (userRoom) => {
    //     $('#room-list ul').append(divEscapsedContentElement(userRoom.room));
    // });
    // setInterval(() => {
    //     socket.emit('rooms');
    // }, 1000);
    // socket.on('rooms', (rooms) => {
    //     for(let room in rooms) {
    //         $('#room-list ul').append(divEscapsedContentElement(room));
    //     }
    // })

    $('#send-message').focus();
    $('#send-form').submit(() => {
        processUserInput(chatApp);
        return false;
    });

    $('#change-name').click(() => {
        let newName = prompt('please enter your new name:');
        changeNickName(chatApp, newName);
    });

    $('#create-room').click(() => {
        let newRoom = prompt('please enter the name of new room:');
        createNewRoom(chatApp, newRoom);
        // $('#room-list ul').append(divEscapsedContentElement(newRoom));
        // socket.on('rooms', (rooms) => {
        //     // $('#room-list').empty();
        //     for (let room in rooms) {
        //         $('#room-list ul').append(divEscapsedContentElement(room));
        //     }
        // });
    });
});


