const User = require('../lib/user_async');

exports.form = function(req, res) {
    res.render('register', {title: 'Register'});
};

exports.submit = (req, res, next) => {
    let data = req.body.user;
    let user = User.getByName(data.name);
    user.then(user => {
        if (user) {
            // res.error('Username already taken!');
            res.redirect('/register');
        } else {
            user = new User({
                name: data.name,
                pass: data.pass
            });
            user.save().then(() =>{
                req.session.uid = user.id;
                res.redirect('/');
            });   
        }
    }).catch(err => next(err));
};
