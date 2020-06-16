
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

// let queryUser = async function(statement, values) {
//     let result = await db.query(statement, values, (err, rows) => {
//         if (err) throw err;
//         console.log(rows)
//         return rows[0];
//     });

//     return result;
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


let nest1 = function() {
    console.log('nest1 start');

    setTimeout(() => {
        console.log('setTimeOUt for nest 1!');
    }, 0);

    new Promise((resolve) => resolve('promse for nest 1')).then(res => console.log(res));
    console.log('nest1 end')
}

let nest2 = function() {
    console.log('nest2 start');

    setTimeout(() => {
        console.log('setTimeOUt for nest 2!');
    }, 0);

    new Promise((resolve) => resolve('promse for nest 2')).then(res => console.log(res));
    console.log('nest2 end')
}

nest1();
nest2();