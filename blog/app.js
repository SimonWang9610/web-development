const express = require('express');
const messages = require('./lib/messages');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const session = require('express-session');


const register = require('./routes/register_promise')
const login = require('./routes/login');
const user = require('./lib/middleware/user');

const app = express();

app.set('view engine', 'ejs');

app.use(methodOverride());
app.use(cookieParser('961002'));
app.use(session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(user);
app.use(messages);


app.get('/register', register.form);
app.post('/register', register.submit);

app.get('/login', login.form);
app.post('/login', login.submit);
app.get('/logout', login.logout);


app.listen(3000);