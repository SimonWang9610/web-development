let Chat = function(socket) {
    this.socket = socket;
};

Chat.prototype.sendMessage = function(room, text) {
    let message = {
        room: room,
        text: text
    };
    console.log(message);
    this.socket.emit('message', message);
};

Chat.prototype.changeRoom = function(newRoom) {
    this.socket.emit('join', {
        room: newRoom
    });
};


Chat.prototype.changeName = function(name) {
    this.socket.emit('nameAttempt', {
        name: name
    })
}

// Chat.prototype.processCommand = function(command) {
//     let words = command.split(' ');
//     command = words[0].substring(1, words[0].length).toLowerCase();
//     let message = false;

//     switch(command) {
//         case 'join':
//             words.shift();
//             let room = words.join(' ');
//             this.changeRoom(room);
//             break;
//         case 'nick':
//             words.shift();
//             let name = words.join(' ');
//             this.socket.emit('nameAttempt', name);
//             break;
//         default:
//             message = 'Unrecognized command';
//             break;
//     }
    
//     return message;
// };


module.exports.Chat = Chat;