const connect = require('connect');
const http = require('http');
const app = connect();
// const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const getBody = require('raw-body');

app.use(getBody.limit('32kb'));
app.use(bodyParser.urlencoded({extended: false})).use(bodyParser.json());
http.createServer(app).listen(3000);

