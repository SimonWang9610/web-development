const mysql = require('mysql');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '961002',
    database: 'scheduler'
});

function Entry(obj) {
    for (let key in obj) {
        this[key] = obj[key];
    }
}

let createTable = 'CREATE TABLE IF NOT EXISTS entries (' + 'id INT(10) NOT NULL PRIMARY KEY AUTO_INCREMENT, '
                + 'username VARCHAR(255) NOT NULL, '
                + 'title VARCHAR(255), '
                + 'date TIMESTAMP NOT NULL, '
                + 'body TINYTEXT NOT NULL)'

db.query(createTable, (err) => {
    if (err) throw err;
});

Entry.prototype.save = async function() {
    db.query(
        'INSERT INTO entries (username, title, date, body) VALUES (?, ?, ?, ?)',
        [this.username, this.title, this.date, this.body],
        (err) => {
            if (err) throw err;
        }
    );
    return;
};

Entry.prototype.delete = async function() {
    db.query('DELETE FROM entries WHERE username=?, date=?', [this.username, this.date],
    (err) => {
        if (err) throw err;
    });
    return;
};

Entry.getMoments = function(key, identity) {

    let queryStr = 'SELECT * FROM entries';

    if (key) queryStr += 'WHERE ' + key + '=' + identity;
    return new Promise((resolve, reject) => {
        db.query(
            queryStr + ' ORDER BY date DESC',
            (err, result) => {
                if (err) return reject(err);
                return resolve(result);
            }
        );
    });
}; //return a promise


Entry.getMomentsByName = async function(name) {
    let rows = await Entry.getMoments('username', name);
    return rows;
},


Entry.getRange = async function(from, to) {
    let rows = await Entry.getMoments(null, null);
    
    let pageRows = []
    for (let i = from; i <= to; i++) {
        if (!rows[i]) break;
        pageRows.push(rows[i]);
    }
    return pageRows;
}

Entry.count = async function() {
    let rows = await Entry.getMoments(null, null);
    return rows.length;
}

Entry.delete = 
module.exports = Entry;
