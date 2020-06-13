const express = require('express');
const app = express();

let myLogger = function (req, res, next) {
    console.log('new visitor!');
    next();
};

app.use(myLogger);

app.get('/', (req, res) => {
    res.end('Hello!');
});

app.listen(3000);