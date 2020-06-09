# how sockets communicate with clinets?
- each socket is regard as a client, which can `emit` to server responsing via `on`
- `html tags` inclued in `emit` and `on` messages can not be display correctly.
- `sockets on('connection', callback)` execute `callback` for each `socket in sockets`

# Issues
- `mime`can not work with `mime.lookup()`, change to `require('mime-type')`
- `/chat_ui.js: 40` set `io.connect('http://localhost:8000')` to connect `server` and `client-side`
- `/chat.js: 52` exports `Chat` so that `/chat_ui.js` can work correctly. otherwise, errors on `Chat object not defined`
- __user behaviors such as `change name`, `create room`, `send message` have to be `emit` by `Chat object`. Then, `socket.on(behavior, callback)` at server side will deal with data and finally `emit` to client side. Otherwise, users can not interact with each other, because, with no server-side, all data updates finish on static file and thus others can not see others' message.__ 

# QuestionList
- `display` and `update` the number of users in current room
- when `display` current number of users in this room, users `message` can not broadcast to other users.  
- there is the conflict between `broadcasting message` and `display number of users`, i have no ideas.
- can not `display room-list`, although users can `create/join room` by `room's name`