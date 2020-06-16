const mysql = require('mysql');
const bcrypt = require('bcrypt');

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
    }
);

function User(obj) {
    for (let key in obj) {
        this[key] = obj[key];
    }
}

User.prototype.executeUpdate = function(statement, values) {
    // return new Promise((resolve, reject) => {
    //     db.query(statement, values, (err) => {
    //         if (err) return reject(err);
    //         this.hashPassword();
    //         resolve();
    //     });
    // });
    db.query(statement, values, (err) => {
            if (err) throw err;
        });
    console.log('-----------------Inserted!')
    return this.hashPassword();
} //return a Promise
User.prototype.save = function(fn) {

    let queryStr = 'INSERT INTO users (name, pass, age)' + 'VALUES (?, ?, ?)';
    let values = [this.name, this.pass, this.age];

    if (this.id) {
        queryStr = 'UPDATE users SET (pass, age) WHERE id=? ';
        values = [this.pass, this.age, this.id];
    }

    return this.executeUpdate(queryStr, values);
}; //return a Promise

User.prototype.update = function(col, value) {
    let queryStr = 'UPDATE users SET ' + col + '=?' + ' WHERE name=?';
    db.query(
        queryStr,
        [value, this.name],
        (err) => {
            if (err) throw err;
        });
};

User.prototype.hashPassword = function(fn) {
    let salt_temp = '';
    let salt = new Promise((resolve, reject) => {
        bcrypt.genSalt(12, (err, salt) => {
            if (err) return reject(err);
            resolve(salt);
        });
    });
    return salt.then(salt => {
            salt_temp = salt;
            return bcrypt.hash(this.pass, salt); //callback is empty, return a Promise;
        }).then(hash => {
            console.log(salt_temp, hash);
            this.update('salt', salt_temp);
            this.update('pass', hash);
            return Promise.resolve();
        });
}; //return a Promise

User.queryUser =  function(key, identity) {
    let queryStr = 'SELECT * FROM users WHERE ' + key + '=?';

    return new Promise((resolve, reject) => {
        db.query(queryStr, [identity], (err, result) => {
            if (err) return reject(err);
            if (result.length) return resolve(new User(result[0]));
            return resolve(false);
        })
    });
}

User.getByName = function(name) {
    return User.queryUser('name', name);
};

User.getId = function(id) {
    return User.queryUser('id', id);
}
User.authenticate = function(name, pass) {
    let user = User.getByName(name);
    let user_copy = '';
    return user.then(user => {
        user_copy = user;
        if (user) {
            return bcrypt.hash(pass, user.salt);
        }
        return false;
    }).then(hash => {
        if (hash == user_copy.pass) return user_copy;
        return false;
    });
}

module.exports = User;
