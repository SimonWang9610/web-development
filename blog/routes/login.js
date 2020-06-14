const User = require('../lib/user_async');

exports.form = (req, res) => {
    res.render('login', {title: 'Login'});
};

// exports.submit = (req, res, next) => {
//     let data = req.body.user;
//     User.authenticate(data.name, data.pass, (err, user) => {
//         if (err) return next(err);
//         if (user) {
//             req.session.uid = user.id;
//             res.redirect('/');
//         } else {
//             res.error('Sorry! invalid credientials.');
//             res.redirect('back');
//         }
//     });
// };

// Pormise submit
exports.submit = (req, res, next) => {
    let data = req.body.user;
    User.authenticate(data.name, data.pass).then(user => {
        if (user) {
            req.session.id = user.id;
            res.redirect('/');
        } else {
            // req.error('Sorry! Invalid credientials!');
            res.redirect('/login');
        }
    }).catch(err => next(err));
}

// async submit
// exports.submit = async (req, res, next) => {
//     let data = req.body.user;
//     let user = await User.authenticate(data.name, data.pass);
//     try {
//         if (user) {
//             req.session.id = user.id;
//             res.redirect('/');
//         } else {
//             req.error('Sorry@ Invalid credientials');
//             res.redirect('/login');
//         }
//     } catch(err) {
//         next(err);
//     } 
// }
exports.logout = (req, res) => {
    req.session.destory((err) => {
        if (err) throw err;
        res.redirect('/');
    });
};
