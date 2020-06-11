// const EventEmitter = require('events').EventEmitter;
// const channel = new EventEmitter();

// channel.on('join', () => {
//     console.log('Welcome');
// }); // response event 'join' from client

const events = require('events');
const net = require('net');

const channel = new events.EventEmitter();

channel.clients = {}; //store clients connected to 'channel'
channel.subscriptions = {}; //store clients subscripted to 'channel'

channel.on('join', (id, client) => {
    
    let welcome = 'Welcoem!\n' + 'Guests online: ' + this.listeners('broadcast').length;
    client.write(welcome + '\n');

    this.clients[id] = client;
    this.subscriptions[id] = function (senderId, message) {
        if( id != senderId) {
            this.clients[id].write(message); 
        }
    }
    this.on('broadcast', this.subscriptions[id]); // broacdcast message to other clients
});

channel.on('leave', (id) => {
    channel.removeListener('broadcast', this.subscriptions[id]);
    channel.emit('broadcast', id, id + ' has left the chat.\n');
});

channel.on('shudown', () => {
    channel.emit('broadcast', '', 'Chat has shut down.\n');
    channel.removeAllListeners('broadcast');
})


let server = net.createServer((client) => {
    let id = client.remoteAddress + ':' + client.remotePort;
    
    client.on('connect', () => {
        channel.emit('join', id, client);
    });

    client.on('data', (data) => {
        data = data.toString();
        if (data == 'shutdown\r\n') {
            channel.emit('shutdown');
        }
        channel.emit('broadcast', id, data);
    });

    client.on('close', () => {
        channel.emit('leave', id);
    });


});




server.listen(8888)