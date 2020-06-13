
// let User = function(obj) {
//     for (let key in obj) {
//         this[key] = obj[key];
//     }
// }

// let f = function() {
//     let a = new Promise((resolve) => {
//         let userInfo = {name: 'simon', pass: '961002'};
//         return resolve(userInfo);
//     });
//     return a.then(info => {
//         return new User(info);
//     }).catch(err => {throw err});

// }

// let query = function() {
//     let user = f();
//     user.then(user => {console.log(user)}).catch(err => {console.log(err)});
// };

// query();

// const mysql = require('mysql');
const bcrypt = require('bcrypt');

// let db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '961002',
//     database: 'scheduler'
// });

// let User = function(obj) {
//     for (let key in obj) {
//         this[key] = obj[key];
//     };
// };

// let queryUser = function(statement, values) {
//     return new Promise((resolve, reject) => {
//         db.query(statement, values, (err, result) => {
//             if (err) return reject(err);
//             resolve(result);
//         });
//     });
// }

// let queryStr = 'SELECT * FROM users WHERE name=?'
// let value = 'simon'
// queryUser(queryStr, value).then(result => {
//     let user = new User(result[0]);
//     console.log(user)});

// let executeQuery = function(statement, values) {
//     return new Promise((resolve, reject) => {
//         db.query(statement, values, (err) => {
//             if (err) return reject(err);
//             return resolve();
//         });
//     });
// };

// let executeUpdate = function(statement, values) {
//     db.query(
//         statement, values, (err) =>{
//             if (err) throw err;
//         }
//     );
//     return Promise.resolve();
// }

// let stat = 'UPDATE users SET pass=? WHERE name="bob"';
// let values = ['wang961002'];

// executeUpdate(stat, values).then(() => {
//     console.log('Updated!');
// });
let a = 5;
let number = function() {
    return 1;
}
new Promise((resolve, reject) => {
    resolve('5');
}).then((digit) => {
    console.log('second promise');
    let b = number();
    console.log(b);
    return [digit, b];
}).then(values => {
    console.log(values)
    values.forEach(value => console.log(value));
});