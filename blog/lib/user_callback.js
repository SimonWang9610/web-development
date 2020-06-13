const mysql = require('mysql');
const bcrypt = require('bcrypt');
const user = require('./middleware/user');

let db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '961002',
    database: 'scheduler'
});


let createTable = 'CREATE TABLE IF NOT EXISTS users (' + 'id INT(10) NOT NULL PRIMARY KEY AUTO_INCREMENT, '
                + 'name VARCHAR(255) NOT NULL UNIQUE, '
                + 'pass VARCHAR(255) NOT NULL, '
                + 'salt VARCHAR(255), '
                + 'age INT(2))';
db.query(
    createTable, (err) => {
        if (err) throw err;
        console.log('TABLE users created!');
    }
);

function User(obj) {
    for (let key in obj) {
        this[key] = obj[key];
    }
}

User.prototype.executeQuery = function(statement, values, callback) {
    db.query(
        statement,
        values, (err) => {
            if (err) return callback(err);
            this.hashPassword(callback);
            callback();
        }
    )
}; //handle error || execute callback

User.prototype.save = function(callback) {
    let statement = 'INSERT INTO users (name, pass, age)' + 'VALUES (?, ?, ?)';
    let values = [this.name, this.pass, this.age];

    if (this.id) {
        statement = 'UPDATE users SET (pass, age) WHERE id=?';
        values = [this.pass, this.age, this.id];
    }

    this.executeQuery(statement, values, callback)
};//pass callback

User.prototype.update = function(callback, col, value) {
    let queryStr = 'UPDATE users SET ' + col + '=?' + ' WHERE name=?';
    db.query(
        queryStr,
        [value, this.name],
        (err) => {
            if (err) return callback(err);
        }
    );
}; //handle error

User.prototype.hashPassword = function(callback) {
    bcrypt.genSalt(12, (err, salt) => {
        if (err) return callback(err);
        this.update(callback, 'salt', salt);
        bcrypt.hash(this.pass, salt, (err, hash) => {
            if (err) callback(err);
            this.update(callback, 'pass', hash);
        });   
    });
}; //handle error

User.queryUser =  function(key, identity, callback) {
    let queryStr = 'SELECT * FROM users WHERE ' + key + '=?';
    db.query(
        queryStr,
        [identity],
        (err, result) => {
            if (err) return callback(err);
            if (result.length) {
                return callback(null, new User(result[0]));
            };
            callback(null, null);
        }
    );
} // handle error || execute callback()


User.getByName = function(name, fn) {
    User.queryUser('name', name, fn);
}; //pass callback

User.getId = function(id, callback) {
    User.queryUser('id', id, callback);
} // pass callback

User.authenticate = function(name, pass, callback) {
    User.getByName(name, (err, user) => {
        if (err) return callback(err);
        if (user) {
            bcrypt.hash(pass, user.salt, (err, hash) => {
                if (err) return callback(err);
                if (hash == user.pass) return callback(null, user);
            });
        }
        callback();
    });
}

module.exports = User;
