const socketio = require('socket.io');
let io;
let guestNumber = 1;
let nickNames = {}; // store users` names using in current room
let namesUsed = []; // store users` names used in current room
let currentRoom = {};

function assignGuestName(socket, guestNumber, nickNames, namesUsed) {
    let name = 'Guest ' + guestNumber;
    nickNames[socket.id] = name;
    socket.emit('nameResult', {
        success: true,
        name: name
    });
    namesUsed.push(name);
    return guestNumber + 1;
}


function joinRoom(socket, room) {
    socket.join(room); //make user join room
    currentRoom[socket.id] = room; //set user is now in this room
    socket.emit('joinResult', {
        room: room,
    }); //let user know they are now in new room
    socket.broadcast.to(room).emit('message', {
        text: nickNames[socket.id] + ' has joined ' + room + '.',
        author: 'system'
    }); //broadcast new comer to other users in this room

    // usersComing(socket);
}


function handleRoomJoining(socket) {
    socket.on('join', (room) => {
        socket.leave(currentRoom[socket.id]);
        joinRoom(socket, room.room);
    });
}

function handleNameChangeAttempts(socket, nickNames, namesUsed) {
    socket.on('nameAttempt', (name) => {
        if (name.name.startsWith('Guest')) {
            socket.emit('nameResult', {
                success: false,
                message: 'Customized names cannot begin with "Guest".'
            });
        } else {
            let anchor = namesUsed.indexOf(name.name) == -1;
            if (anchor) {
                let previousName = nickNames[socket.id];
                let previousNameIndex = namesUsed.indexOf(previousName);
                namesUsed.push(name.name);
                nickNames[socket.id] = name.name;
                delete namesUsed[previousNameIndex];
                
                socket.emit('nameResult', {
                    success: true,
                    name: name.name
                });
                socket.broadcast.to(currentRoom[socket.id]).emit('message', {
                    text: previousName + ' is now known as: ' + name.name + '.'
                });
            } else {
                socket.emit('nameResult', {
                    success: false,
                    message: 'That name is already in use.'
                });
            }
        }
    });
}

function handleMessageBroadcasting(socket, nickNames) {
    socket.on('message', (message) => {
        socket.broadcast.to(message.room).emit('message', {
            text: message.text,
            author: nickNames[socket.id]
        });
    });
}

function handleClientDisconnection(socket) {
    socket.on('disconnect', () => {
        let nameIndex = namesUsed.indexOf(nickNames[socket.id]);
        delete namesUsed[nameIndex];
        delete nickNames[socket.id];
    })
}


exports.listen = function(server) {
    io = socketio.listen(server);
    io.set('log level', 1);

    io.sockets.on('connection', (socket) => {
    
        guestNumber = assignGuestName(socket, guestNumber, nickNames, namesUsed);
        joinRoom(socket, 'Lobby');

        handleMessageBroadcasting(socket, nickNames);
        handleNameChangeAttempts(socket, nickNames, namesUsed);
        handleRoomJoining(socket);

        socket.on('rooms', () => {
            socket.emit('rooms', io.of('/').adapter.rooms);
        });

        handleClientDisconnection(socket, nickNames, namesUsed);
    });
};

