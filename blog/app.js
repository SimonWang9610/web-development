const express = require('express');
const messages = require('./lib/messages');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const session = require('express-session');


const register = require('./routes/register_promise')
const login = require('./routes/login');
const authenticated = require('./lib/middleware/authenticated');
const entries = require('./routes/entries')
const page = require('./lib/middleware/page');
const Entry = require('./lib/entry');
const api = require('./routes/api');

const app = express();

app.set('view engine', 'ejs');

app.use(methodOverride());
app.use(cookieParser('961002'));
app.use(session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use('/api', api.auth);
app.use(authenticated);
app.use(messages);


app.get('/register', register.form);
app.post('/register', register.submit);

app.get('/login', login.form);
app.post('/login', login.submit);
app.get('/logout', login.logout);

app.get('/:page?', page(Entry.count, 5), entries.list);

// app.get('/post', entries.form);
app.post('/post', entries.submit);

app.get('/edit/:id', entries.edit);
app.post('/edit/:id', entries.edited);
app.get('/delete/:id', entries.delete);

app.get('/api/user/:id', api.user);
app.get('/api/entries/:page?', page(Entry.count, 5), api.entries);
app.post('/api/entry', entries.submit);

app.listen(3000);