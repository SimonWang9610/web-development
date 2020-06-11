const http = require('http');
const work = require('./lib/timetrack');
const mysql = require('mysql');

let db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '961002',
    database: 'scheduler'
});

// db.connect((err) => {
//     if(err) throw err;
//     console.log('Connected!');
//     db.query('CREATE DATABASE scheduler', (err, result) => {
//         if (err) throw err;
//         console.log('Database created!');
//     });
// });

let server = http.createServer((request, response) => {
    switch(request.method) {
        case 'POST':
            switch(request.url) {
                case '/':
                work.add(db, request, response);
                break;
            case '/archive':
                work.archive(db, request, response);
                break;
            case '/unarchive':
                work.unarchive(db, request, response);
                break;
            case '/delete':
                work.delete(db, request, response);
                break;
        };
            break;   
        case 'GET':
            switch(request.url) {
                case '/':
                    work.show(db, response);
                    break;
                case '/archived':
                    work.showArchived(db, response);
                    break;
                case '/return':
                    work.show(db, response);
                    break;
            };
            break;
    }
});

db.query(
    'CREATE TABLE IF NOT EXISTS work ('
    + 'id INT(10) NOT NULL AUTO_INCREMENT, '
    + 'hours DECIMAL(5, 2) DEFAULT 0, '
    + 'date DATE, '
    + 'archived INT(1) DEFAULT 0, '
    + 'description LONGTEXT, '
    + 'PRIMARY KEY(id))', (err) => {
        if (err) throw err;
        console.log('Server started...');
        server.listen(8888, '127.0.0.1');
    }
);