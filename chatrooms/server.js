const http = require('http');
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');
let cache = {};


function send404(response) {
    response.writeHead(404, {'Content-Type':'text/plain'});
    response.write('404 Error: Not found resource!');
    response.end();
}

function sendFile(response, filePath, fileContents) {
    response.writeHead(200, {'Content-Type': mime.lookup(path.basename(filePath))});
    response.end(fileContents);
}

function serveStatic(response, cache, absPath) {
    if(cache[absPath]) {
        sendFile(response, absPath, cache[absPath]);
    } else {
        fs.exists(absPath, (exists) => {
            if(exists) {
                fs.readFile(absPath, (err, data) => {
                    if (err) {
                        send404(response);
                    } else {
                        cache[absPath] = data;
                        sendFile(response, absPath, cache[absPath]);
                    }
                });
            } else {
                send404(response);
            }
        });
    }
}

let server = http.createServer((request, response) => {
    let filePath = false;
    
    if(request.url == '/') {
        filePath = 'public/index.html';
    } else {
        filePath = 'public' + request.url;
    }
    let absPath = './' + filePath;
    console.log(absPath);
    serveStatic(response, cache, absPath);
});

server.listen(8000, () => {
    console.log('Server is listening on port: 8000!');
});

const chatServer = require('./lib/chat_server');
chatServer.listen(server);

